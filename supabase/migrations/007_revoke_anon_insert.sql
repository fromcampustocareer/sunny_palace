-- 007_revoke_anon_insert.sql
--
-- HIGH-1 (anti-abuse / Turnstile): close the direct anon INSERT path on the three
-- public, moderated tables. As of this change, the ONLY way to insert these rows is
-- through the `submit-form` edge function, which runs with the service role AFTER
-- verifying a Cloudflare Turnstile token. Revoking the anon grant here means an
-- attacker can no longer bypass Turnstile by POSTing straight to the PostgREST
-- /rest/v1/<table> endpoint with the publishable (anon) key.
--
-- The CRIT-2 RLS insert policies (which force status='pending') are intentionally left
-- in place as defense-in-depth — harmless once the table-level INSERT grant is gone,
-- but they keep the system safe if a grant is ever re-added by mistake.
--
-- NOTE: `panelists` is NOT revoked here. The Partner Panels page still inserts panelist
-- suggestions directly via the anon key and is out of scope for this change set; that
-- path is flagged for a follow-up (route it through submit-form before revoking).

REVOKE INSERT ON coffee_chat_profiles FROM anon;
REVOKE INSERT ON resume_submissions  FROM anon;
REVOKE INSERT ON opportunities        FROM anon;
