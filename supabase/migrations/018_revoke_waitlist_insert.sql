-- 018_revoke_waitlist_insert.sql
--
-- MED-N2 (anti-abuse / Turnstile): close the direct anon INSERT path on the
-- `waitlist_subscribers` table. The waitlist signup previously did an UNGATED anon
-- insert straight to /rest/v1/waitlist_subscribers with the publishable (anon) key.
--
-- WHY THIS MATTERS: the Turnstile-gated `add-to-waitlist` edge function is the
-- intended path — it runs with the service role AFTER verifying a Cloudflare
-- Turnstile token. An open anon insert lets an attacker bypass Turnstile by POSTing
-- straight to PostgREST and script arbitrary waitlist signups. Unlike `subscribers`
-- (migration 017), no DB webhook fires on insert here — the waitlist welcome email is
-- sent inside the function — so this is junk-row pollution rather than email
-- amplification, but it is the same bug class. Mirroring migrations 007 and 017, the
-- ONLY way to insert a waitlist row is now through the `add-to-waitlist` edge
-- function. The service role bypasses RLS, so legitimate, gated signups still work.
--
-- Defense-in-depth: the insert policy is rewritten to WITH CHECK (false) so even if
-- the table-level INSERT grant were ever re-added by mistake, RLS still denies anon
-- inserts (harmless once the grant is gone, but it keeps the system safe).

REVOKE INSERT ON waitlist_subscribers FROM anon;

DROP POLICY IF EXISTS "waitlist_subscribers_insert" ON waitlist_subscribers;
CREATE POLICY "waitlist_subscribers_insert" ON waitlist_subscribers FOR INSERT WITH CHECK (false);
