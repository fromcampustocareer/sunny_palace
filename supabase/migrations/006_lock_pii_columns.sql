-- ============================================================
-- CRIT-3 — Stop exposing PII via public table reads
-- ============================================================
-- The anon (public REST) role could SELECT entire rows — including
-- `email` and `linkedin_url` — from resume_submissions, leaking PII.
--
-- WHY COLUMN-LEVEL GRANTS (and NOT views):
--   The previous attempt (006_public_views.sql) dropped the broad RLS
--   SELECT policies and exposed SECURITY INVOKER views instead. That is
--   WRONG for this live database:
--     * RLS policies are ROW-level — they gate WHICH rows are visible
--       (approved / featured / public). They are NOT the PII leak and
--       must stay intact.
--     * A SECURITY INVOKER view runs with the *caller's* privileges. With
--       the SELECT policies dropped AND no table grant for anon, the view
--       would return 0 rows for the public — breaking every page.
--     * The views also referenced columns that don't exist on
--       resume_submissions (avatar_url, like_count, view_count), so they
--       were invalid against the live schema.
--
--   The correct, minimal fix — and the pattern the live DB ALREADY uses
--   for coffee_chat_profiles — is PostgreSQL column-level GRANTs. RLS keeps
--   gating rows; column GRANTs gate which COLUMNS anon may read. Revoking
--   SELECT on the PII columns makes them unreadable while every non-PII
--   column the public UI needs stays available.
--
-- This migration:
--   * Leaves the RLS SELECT policies (coffee_chat_read_approved,
--     resumes_read_approved) untouched.
--   * Revokes the broad table-level SELECT from anon and re-grants SELECT
--     on ONLY the non-PII columns. REVOKE + GRANT is idempotent, so this
--     also codifies the coffee_chat_profiles grants that already exist live
--     (making this repo the source of truth).
-- ============================================================


-- ── 1. resume_submissions — lock out email + linkedin_url ──
-- email and linkedin_url are PII and are deliberately omitted. The
-- granted set matches the explicit column list ResumeReviews.jsx and
-- ResumeCompanies.jsx now select.
REVOKE SELECT ON resume_submissions FROM anon;
GRANT SELECT (id, handle, role_title, role_type, stage, target_companies,
              background_tags, file_name, allow_download, story, allow_annotation,
              status, created_at) ON resume_submissions TO anon;


-- ── 2. coffee_chat_profiles — codify existing live grants ──
-- Matches PUBLIC_PROFILE_COLUMNS in src/pages/CoffeeChat.jsx exactly.
-- Deliberately omits PII: email, consented_at.
REVOKE SELECT ON coffee_chat_profiles FROM anon;
GRANT SELECT (id, name, pronouns, linkedin_url, role_title, location,
              role_function, identity_tags, topics, capacity, public_profile,
              status, created_at, avatar_url) ON coffee_chat_profiles TO anon;
