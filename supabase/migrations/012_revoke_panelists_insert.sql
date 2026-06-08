-- 012_revoke_panelists_insert.sql
--
-- HIGH-1b (anti-abuse / Turnstile follow-up): close the direct anon INSERT path on the
-- `panelists` table, the one public moderated form that migration 007 left untouched.
-- The Partner Panels "apply to speak" form now POSTs through the `submit-form` edge
-- function, which runs with the service role AFTER verifying a Cloudflare Turnstile
-- token and force-sets status='pending'. Revoking the anon grant here means an attacker
-- can no longer bypass Turnstile by POSTing straight to the PostgREST
-- /rest/v1/panelists endpoint with the publishable (anon) key.
--
-- The CRIT-2 `panelists_insert` RLS policy is intentionally left in place as
-- defense-in-depth — harmless once the table-level INSERT grant is gone, but it keeps
-- the system safe if a grant is ever re-added by mistake.

REVOKE INSERT ON panelists FROM anon;
