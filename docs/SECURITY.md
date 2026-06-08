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

