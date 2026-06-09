-- 019_revoke_secondary_inserts.sql
--
-- MED-N1 (anti-abuse / Turnstile): close the direct anon INSERT path on the six
-- "secondary" public forms. Each of these previously did an UNGATED anon insert
-- straight to /rest/v1/<table> with the publishable (anon) key and a permissive
-- `WITH CHECK (true)` policy — no Turnstile, no human in the loop — making each one
-- a write-spam vector an attacker could script arbitrarily.
--
-- Mirroring migration 007 (HIGH-1) and migration 017 (HIGH-N1), these forms now
-- route through the `submit-form` edge function, which runs with the service role
-- AFTER verifying a Cloudflare Turnstile token and whitelisting writable columns.
-- The service role bypasses RLS, so legitimate gated submissions still land. We
-- revoke the table-level anon INSERT grant here so the Turnstile gate can't be
-- bypassed by POSTing straight to PostgREST with the anon key.
--
-- Defense-in-depth: each insert policy is rewritten to WITH CHECK (false) so even
-- if a table-level INSERT grant were ever re-added by mistake, RLS still denies
-- anon inserts (harmless once the grant is gone, but it keeps the system safe).
--
-- This does NOT touch the email-format / char_length CHECK constraints from
-- migration 011 — those remain as-is.

REVOKE INSERT ON template_requests FROM anon;
DROP POLICY IF EXISTS "template_requests_insert" ON template_requests;
CREATE POLICY "template_requests_insert" ON template_requests FOR INSERT WITH CHECK (false);

REVOKE INSERT ON bridge_year_suggestions FROM anon;
DROP POLICY IF EXISTS "bridge_year_insert" ON bridge_year_suggestions;
CREATE POLICY "bridge_year_insert" ON bridge_year_suggestions FOR INSERT WITH CHECK (false);

REVOKE INSERT ON interview_prep_requests FROM anon;
DROP POLICY IF EXISTS "interview_prep_insert" ON interview_prep_requests;
CREATE POLICY "interview_prep_insert" ON interview_prep_requests FOR INSERT WITH CHECK (false);

REVOKE INSERT ON panel_suggestions FROM anon;
DROP POLICY IF EXISTS "panel_suggestions_insert" ON panel_suggestions;
CREATE POLICY "panel_suggestions_insert" ON panel_suggestions FOR INSERT WITH CHECK (false);

REVOKE INSERT ON linkedin_episode_requests FROM anon;
DROP POLICY IF EXISTS "linkedin_requests_insert" ON linkedin_episode_requests;
CREATE POLICY "linkedin_requests_insert" ON linkedin_episode_requests FOR INSERT WITH CHECK (false);

REVOKE INSERT ON bridge_year_subscribers FROM anon;
DROP POLICY IF EXISTS "bridge_year_subscribers_insert" ON bridge_year_subscribers;
CREATE POLICY "bridge_year_subscribers_insert" ON bridge_year_subscribers FOR INSERT WITH CHECK (false);
