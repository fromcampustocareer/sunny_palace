# Security

This document is the reference for the security posture of the Jose x Jocelyn site
(`fromcampuscareer.com`). It records the architecture's trust model, every hardening
measure implemented during the 2026-06 security audit, the secrets/config that hold it
together, and the ongoing responsibilities required to keep it secure.

> Security is not a one-time state. The fixes below close the issues found in the audit
> and raise the bar significantly, but no system is unhackable. The "Ongoing maintenance"
> section at the end is as important as the fixes.

---

## 1. Architecture & trust model

- **Frontend:** React 18 + Vite 5 single-page app, built to `dist/` and served on
  **Cloudflare Pages**. No server-side rendering; all logic the browser runs is public.
- **Backend:** a single **Supabase** project (Postgres 17, ref `kdkeerhukydxwoycjuwl`).
  The browser talks **directly** to Supabase with the **publishable / anon key**, which is
  *designed to be public* and is governed by **Row-Level Security (RLS)** and table/column
  **GRANTs**. Privileged work runs in **Deno edge functions** using the service role.
- **No user accounts.** There is no login, session, password, or JWT minted by the app —
  every visitor is the anonymous role. Admin/moderation is done by hand in the Supabase
  dashboard SQL editor. This makes a whole class of measures (password reset, session
  management, IDOR-between-users, CSRF on cookie sessions, default credentials) **not
  applicable** — see section 9.

### Core authorization model
1. **Writes are funneled through one trusted path.** All public submissions
   (coffee-chat, resume, opportunity, panelist, contact, waitlist) go through
   **Turnstile-gated edge functions** that run with the **service role** and set
   security-sensitive fields (`status`, `public_profile`) **server-side**. Direct
   anonymous `INSERT` is **revoked** on every user-writable table, so the gate cannot be
   bypassed via the REST API.
2. **Reads are "gated, column-restricted."** RLS row policies expose only
   approved/featured rows; **column-level GRANTs** hide PII (`email`, `linkedin_url`) from
   the anon role — RLS governs *rows*, GRANTs govern *columns*.
3. **The browser is never trusted.** Client-side validation is treated as cosmetic;
   every constraint is re-enforced at the edge-function and/or database layer.

---

## 2. Critical fixes

### CRIT-1 — Gemini API key shipped in the frontend bundle  *(measures #3, #14)*
**Risk:** `src/lib/gemini.js` read `VITE_GEMINI_API_KEY`, and any `VITE_`-prefixed variable
is inlined into the public JS bundle at build time. Anyone could extract the Google API key
from DevTools / the deployed `dist/assets/*.js` and run unlimited Gemini calls on the
project's bill and quota.
**Fix:** the AI resume-builder feature was unreachable dead code, so it was **deleted**
entirely (`src/lib/gemini.js`, `ResumeBuilder.jsx`, and all references/i18n strings). The
leaked key was **rotated/deleted** in Google AI Studio and **removed** from the Cloudflare
Pages environment.
**Verification:** `grep -r "generativelanguage\|VITE_GEMINI\|AIza" dist/` returns nothing;
confirmed against the live deployed bundle.
**Lesson:** never use a `VITE_`-prefixed variable for a secret. Only values that are
*designed* to be public (Supabase anon key, Turnstile site key) may be `VITE_`.

### CRIT-2 — Submissions self-approved (moderation bypass)  *(measures #5, #15, #34)*
**Risk:** every table's insert policy was `WITH CHECK (true)`, and the browser inserted rows
with `status: 'approved'`. Anyone hitting the REST API with the public key could publish
arbitrary content instantly, or pin it with `status:'featured'`.
**Fix:** migration `005` rewrote the insert policies to pin `status='pending'`
(`coffee_chat_profiles` also forces `public_profile=false`). Submissions now flow through
the `submit-form` edge function, which sets the status server-side. Moderation happens in
the dashboard. (Opportunities/resumes were later set to auto-publish *server-side* — see
section 7 — without re-opening the client-controlled hole.)
**Verification:** `POST /rest/v1/<table>` with `status:'approved'` via the anon key is
rejected; the only insert path is the service-role edge function.

### CRIT-3 — PII (emails) readable by anyone via the REST API  *(measures #6, #33, #35)*
**Risk:** SELECT policies granted the anon role whole rows including `email`. The frontend's
column allow-list was **cosmetic** — `GET /rest/v1/coffee_chat_profiles?select=name,email`
returned every approved mentor's email. RLS governs rows, not columns.
**Fix:** migration `006` uses **column-level GRANTs** — `REVOKE SELECT` on the table then
`GRANT SELECT (<non-PII columns>)` to `anon` — so `email`/`linkedin_url` (resumes) and
`email`/`consented_at` (coffee chat) are unreadable. Client reads stopped using
`select('*')` and enumerate the granted columns.
**Verification:** `?select=email` and `?select=*` return **401** for the anon role; non-PII
selects return data. Confirmed live.

---

## 3. High-severity fixes — anti-abuse

### HIGH-1 — No rate limiting / anti-abuse on forms or functions  *(measure #28)*
**Risk:** insert policies were `WITH CHECK (true)` with no throttle; the edge functions had
no protection. A script with the public key could flood every table, email-bomb the contact
inbox, and burn the Resend quota.
**Fix (Cloudflare Turnstile + a single trusted insert path):**
- A shared `src/components/Turnstile.jsx` widget was added to the contact, waitlist,
  coffee-chat, resume, opportunity (and later panelist) forms; the token is sent with each
  request.
- `send-contact-email` and `add-to-waitlist` verify the token against Cloudflare's
  `siteverify` endpoint before doing any work (403 on failure, fail-closed if the secret is
  unset).
- A new **`submit-form`** edge function is the **only** path for the direct-insert forms:
  it verifies Turnstile, inserts with the **service role**, **whitelists columns**, and
  **force-sets** `status`/`public_profile` server-side.
- Migration `007` **revokes anon `INSERT`** on `coffee_chat_profiles`, `resume_submissions`,
  and `opportunities`, so the REST API can no longer be used to bypass Turnstile.
**Verification:** a replayed POST without a valid token → 403; a direct anon REST insert →
401. Confirmed live.

### HIGH-1b — Panelist form left an open anon insert  *(follow-up)*
**Risk:** the Partner Panels "apply to speak" form still inserted into `panelists` directly
with the anon key (no Turnstile), the one form HIGH-1 missed.
**Fix:** `submit-form` gained a `panelist` type (whitelisted columns, forced
`status='pending'`, email-validated); the form now posts through it with a Turnstile token;
migration `012` revokes anon `INSERT` on `panelists`.
**Verification:** direct anon insert → 401; `submit-form` panelist with a bad token → 403.

---

## 4. High-severity fixes — injection & uploads

### HIGH-2 — Stored XSS via user URLs rendered as `href`  *(measure #19)*
**Risk:** user-controlled URLs (`linkedin_url`, opportunity `link`) were rendered straight
into anchor `href`s. A `javascript:alert(document.cookie)` value became a clickable XSS
payload (and combined with CRIT-2 could be published instantly).
**Fix:** `src/lib/safeUrl.js` exports `safeHttpUrl(raw)`, which returns the URL only if it
parses as an absolute `http:`/`https:` URL (blocking `javascript:`, `data:`, `vbscript:`,
relative URLs). It is applied at every `href` sink. Migration `008` adds DB-layer
`CHECK (... LIKE 'https://%')` constraints (NOT VALID) on the URL columns as a backstop.
**Verification:** `safeHttpUrl('javascript:alert(1)')` → null; the DB rejects a non-https
link insert. Confirmed live.

### HIGH-3 — Insecure file uploads + public avatars bucket  *(measures #21, #8)*
**Risk:** the `avatars` bucket was public, accepted anon uploads of any type/size, and used
the **user-controlled** `file.type` as the stored content type — an attacker could upload an
HTML/SVG file with a spoofed `image/*` type and get a hosted URL on the storage domain
(phishing / stored content). The `resumes` bucket had no size limit and no content sniffing.
**Fix:** migration `009` codifies both buckets in version control and sets
`allowed_mime_types` + `file_size_limit` (avatars: png/jpeg/webp, 2 MB; resumes:
application/pdf, 5 MB), re-asserting the resume storage policies. The client validates size
and type before upload, passes an explicit allowed MIME (never `file.type`), and checks the
`%PDF` **magic-byte** header for resumes. The bucket limits are a server-side backstop.
**Verification:** live `storage.buckets` shows the limits on both buckets; a `.html`
renamed to `.png`, an oversized image, and a non-PDF resume are all rejected.

---

## 5. High-severity fixes — webhooks, errors, headers, dependencies

### HIGH-4 — Webhook had no signature verification  *(measure #31)*
**Risk:** `send-welcome-email` is triggered by a Supabase database webhook and trusted the
payload entirely. The only "auth" was the public anon key, so anyone could POST a crafted
`{record:{email:"victim@x.com"}}` and send mail from the verified domain to arbitrary
addresses (spam/phishing, Resend abuse, sender-reputation damage).
**Fix:** the function reads `WEBHOOK_SECRET` and requires a matching `x-webhook-secret`
header **before** reading the body (timing-safe compare, fail-closed if unset), validates
`record.email`, caps name length, and stays at `verify_jwt=true` so the publishable key
alone cannot invoke it. The DB webhook sends the matching header.
**Verification:** POST without a valid JWT + secret → 401, no email. (The same pattern was
later applied to `coffee-chat-welcome` — see section 7.)

### HIGH-5 — Verbose errors leaked internals  *(measures #12, #11)*
**Risk:** edge functions returned raw Resend bodies, `dbErr.message`, and stack info to the
browser, leaking schema and upstream details.
**Fix:** all responses now return generic messages (e.g. "Something went wrong"); the real
error stays in `console.error` only. Known cases map to safe messages (duplicate email →
"You're already on the list", 409). No DB/Resend body ever reaches the client.

### HIGH-6 — Missing security headers / CSP  *(measure #46)*
**Risk:** no `Content-Security-Policy`, `HSTS`, `X-Frame-Options`, etc. — open to
clickjacking, MIME-sniffing, and no defense-in-depth against XSS.
**Fix:** `public/_headers` (Cloudflare Pages) and a mirrored `vercel.json` set
`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, a 2-year
`Strict-Transport-Security` (preload), `Permissions-Policy`, and a strict **CSP** scoped to
exactly what the app loads (self, Cloudflare Turnstile, Fontshare/Google Fonts,
`*.supabase.co`, `cdn.simpleicons.org`, `data:`/`blob:`). No `unsafe-eval`, no wildcard
`script-src`, no dead Gemini origin.
**Verification:** `curl -I https://fromcampuscareer.com` shows all headers live; the CSP
allows the Turnstile script/iframe with zero violations.

### HIGH-7 — Dependency vulnerabilities & unpinned imports  *(measures #37, #38)*
**Risk:** no `npm audit` in CI; edge functions imported an old `deno.land/std` and an
unpinned `@supabase/supabase-js@2`.
**Fix:** `npm audit fix` patched the reachable advisories (production scope → 0 vulns; the
2 remaining are dev-only esbuild/Vite). Edge functions dropped the stale std `serve` import
for the built-in `Deno.serve`, and `@supabase/supabase-js` is pinned. A
`.github/workflows/audit.yml` runs `npm audit` on every PR. Major upgrades (React 19,
Vite 8, etc.) were deliberately deferred — no security driver.

