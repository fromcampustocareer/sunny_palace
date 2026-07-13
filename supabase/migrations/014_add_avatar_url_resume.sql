-- 014_add_avatar_url_resume.sql
--
-- PRE-LAUNCH BLOCKER FIX. The submit-form edge function writes `avatar_url` for
-- both coffee-chat and resume submissions, and ResumeReviews/CoffeeChat upload an
-- avatar. But `resume_submissions` never had an `avatar_url` column (it was only
-- added by hand to `coffee_chat_profiles` on the live DB, never to resumes and
-- never in a migration). Result: EVERY resume submission failed with
-- "column resume_submissions.avatar_url does not exist" and the uploaded PDF was
-- orphaned.
--
-- This adds the column to resume_submissions (and re-asserts it on
-- coffee_chat_profiles so the migration set is reproducible on a fresh database),
-- and grants the public read on the non-PII avatar so resume cards can show it.

ALTER TABLE resume_submissions   ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE coffee_chat_profiles ADD COLUMN IF NOT EXISTS avatar_url text;

-- avatar_url is non-PII (a public storage URL); expose it to anon like the other
-- non-PII columns granted in migration 006. email / linkedin_url stay revoked.
GRANT SELECT (avatar_url) ON resume_submissions TO anon;

-- fixes issue #91
GRANT SELECT (avatar_url) ON coffee_chat_profiles TO anon;
