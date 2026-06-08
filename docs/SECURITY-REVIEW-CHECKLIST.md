# Security Review Checklist

This repo is heavily AI-assisted. Most of the security findings in our
[security audit](../SECURITY-AUDIT.md) were not exotic exploits — they were
**plausible-but-wrong patterns** that looked correct, passed local testing, and
shipped anyway: a client-side column allow-list that the REST API ignored, an
insert that "validated" status in the browser, a secret prefixed with `VITE_`.

Generated code is confident and reads cleanly. That is exactly why it slips
through. Use this checklist on every PR that touches data access, forms, edge
functions, env vars, storage, or headers. Each item below was a **real finding
in this codebase** — the "why it bit us" note is the actual bug. If a box can't
be honestly checked, the PR isn't ready.

How to use: tick every box that applies, or write `N/A` next to ones that don't.
"It works in the browser" is never sufficient evidence — these all bypass the
browser.

---

## Authorization & RLS

- [ ] **RLS hides rows, not columns — PII columns are protected by GRANTs or views, not just a row policy or a client-side `select` list.**
  _Why it bit us (CRIT-3): the client selected an explicit non-PII column allow-list, but that was cosmetic — RLS governs rows, so anyone could hit `GET /rest/v1/coffee_chat_profiles?select=name,email` and harvest every approved mentor's email. Fixed with column-level privacy (views / column GRANTs)._

- [ ] **The client cannot set `status` / role / visibility / `featured` fields — these are forced server-side.**
  _Why it bit us (CRIT-2): public inserts sent `status:'approved'` (and `public_profile:true`) directly, so anything posted went live instantly and moderation was a no-op. Fixed with an RLS `WITH CHECK (status='pending' ...)` plus routing inserts through a service-role edge function that forces `status='pending'`._

- [ ] **Anon `INSERT` is revoked on tables that are written through an edge function, so the function's gate (Turnstile / validation) can't be bypassed by calling the table directly.**
  _Why it bit us (HIGH-1): an anti-abuse gate in an edge function is worthless if the public anon key can still POST straight to the REST table and skip it._

## Input & Output

- [ ] **Validation exists at the server / DB boundary — not only in the browser. Client checks are cosmetic.**
  _Why it bit us (MED-3): client-side regex/required-field checks are trivially bypassed by anyone hitting the REST API or edge function directly. Fixed with DB `CHECK` constraints (status enum, email format, length caps) plus edge-function validation._

- [ ] **User-submitted URLs are sanitized before being used as an `href` — only `http:`/`https:` allowed; `javascript:` and `data:` blocked.**
  _Why it bit us (HIGH-2): `linkedin_url` / `link` were dropped straight into `<a href=...>`. A `javascript:alert(document.cookie)` value became a clickable XSS payload. Fixed with `safeHttpUrl()` (and a server-side `https://` check)._

- [ ] **User input interpolated into emails is HTML-escaped, and newlines are stripped from anything that becomes a header (subject / from).**
  _Why it bit us (MED-1): admin notification emails interpolated `name` / `message` / `email` raw into the HTML body, allowing HTML/link injection into our inbox. Fixed with `escapeHtml()` + length caps; strip `\r`/`\n` from subject-line inputs to prevent header injection._

- [ ] **Raw DB / upstream (Resend, Gemini) error text is never returned to the client — generic message out, details only to `console.error` / logs.**
  _Why it bit us (HIGH-5): edge functions returned `dbErr.message` / raw Resend bodies to the browser, leaking schema and internals. Fixed by mapping known cases to safe messages and returning a generic error otherwise._

## Secrets & Config

- [ ] **No secret is prefixed `VITE_`. Only truly-public values (Supabase anon/publishable key, Turnstile site key) may be `VITE_`.**
  _Why it bit us (CRIT-1): a Google Gemini API key was `VITE_GEMINI_API_KEY`, so Vite inlined it into the public JS bundle — anyone could extract it from `dist/assets/*.js` and spend our quota. Anything `VITE_*` ships to every visitor. Verify with `npm run build && grep -r "VITE_<secret>" dist/` (must be empty)._

- [ ] **Security headers / CSP are present and tight — `script-src 'self'` (no wildcard, no `unsafe-eval`), and `connect-src` / origins list only what the app actually loads.**
  _Why it bit us (HIGH-6): no `public/_headers` and no CSP at all left the site open to clickjacking and MIME-sniffing with no XSS defense-in-depth. When proxying Gemini server-side, the `generativelanguage.googleapis.com` origin is dropped from `connect-src` — don't leave dead/`VITE_`-era origins in the CSP._

- [ ] **No CLI / link metadata or secrets are committed — `supabase/.temp/` is gitignored; no `.env` with real values.**
  _Why it bit us (MED-6): `supabase/.temp/` (pooler URL with DB username + host, linked-project ref) was tracked in a public repo — free recon for an attacker. `git rm -r --cached supabase/.temp` and gitignore it._

## Infrastructure (Storage & Webhooks)

- [ ] **Storage buckets set `allowed_mime_types` + `file_size_limit`; the server does not trust client `file.type`; PDF uploads are validated by magic bytes.**
  _Why it bit us (HIGH-3): the public `avatars` bucket accepted any anon upload of any type/size with a user-controlled `contentType: file.type`, so an HTML/SVG file spoofed as `image/*` got a public URL on our storage domain → hosted phishing. Resumes forced `application/pdf` but had no size cap or content sniffing._

- [ ] **Webhook-triggered edge functions verify a shared secret header — the anon key is public and cannot be the auth.**
  _Why it bit us (HIGH-4): `send-welcome-email` fired on DB insert and trusted `payload.record.email` entirely; its only "auth" was the publicly-bundled anon key, so anyone could POST a crafted record and make our verified domain email arbitrary addresses. Fixed by requiring an `x-webhook-secret` header (`WEBHOOK_SECRET`) before reading the body._

---

### Quick reference: the 12 pitfalls this audit found

| # | Pitfall | Finding |
|---|---------|---------|
| 1 | RLS hides rows, not columns — use views / column GRANTs for PII | CRIT-3 |
| 2 | Client must not set `status`/role/visibility — force server-side | CRIT-2 |
| 3 | Validate at the server/DB boundary; client checks are cosmetic | MED-3 |
| 4 | Sanitize URLs before `href` (only `http(s):`) | HIGH-2 |
| 5 | Escape user input in emails; strip newlines from subjects | MED-1 |
| 6 | No `VITE_`-prefixed secrets | CRIT-1 |
| 7 | Don't return raw DB/upstream error text to clients | HIGH-5 |
| 8 | Anti-abuse on public writes; revoke anon INSERT when gating via a function | HIGH-1 |
| 9 | Lock storage buckets (mime types, size, magic bytes) | HIGH-3 |
| 10 | Strict security headers / CSP; no dead origins | HIGH-6 |
| 11 | Webhooks need a shared secret (anon key is public) | HIGH-4 |
| 12 | Keep CLI metadata & secrets out of the repo | MED-6 |
