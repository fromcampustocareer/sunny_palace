-- 017_subscriber_via_submit_form.sql
--
-- HIGH-N1 (anti-abuse / Turnstile): close the direct anon INSERT path on the
-- `subscribers` table. The newsletter signup previously did an UNGATED anon insert
-- straight to /rest/v1/subscribers with the publishable (anon) key.
--
-- WHY THIS MATTERS: an INSERT into `subscribers` fires the `on-new-subscriber`
-- DB webhook, which sends an instant welcome email. An open anon insert therefore
-- turns the table into an email-amplification vector — an attacker can script
-- arbitrary signups (any address, no human in the loop) and have the platform
-- email each one. Mirroring migration 007, the ONLY way to insert a subscriber is
-- now through the `submit-form` edge function, which runs with the service role
-- AFTER verifying a Cloudflare Turnstile token. The service role bypasses RLS, so
-- the welcome-email webhook still fires for legitimate, gated signups.
--
-- Defense-in-depth: the insert policy is rewritten to WITH CHECK (false) so even if
-- the table-level INSERT grant were ever re-added by mistake, RLS still denies anon
-- inserts (harmless once the grant is gone, but it keeps the system safe).
--
-- This does NOT touch the existing email-format CHECK constraint
-- (subscribers_email_format_chk, migration 011) — that remains as-is.

REVOKE INSERT ON subscribers FROM anon;

DROP POLICY IF EXISTS "subscribers_insert" ON subscribers;
CREATE POLICY "subscribers_insert" ON subscribers FOR INSERT WITH CHECK (false);
