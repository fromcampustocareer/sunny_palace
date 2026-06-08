-- HIGH-2: Server-side enforcement that user-submitted URLs are absolute https URLs.
--
-- The client sanitizes URLs (src/lib/safeUrl.js) before rendering them as an
-- href, but inserts flow through the `submit-form` edge function, so we also
-- enforce at the DB layer. These CHECK constraints require URL columns to be
-- either NULL (where the column is nullable) or start with 'https://'.
--
-- Why NOT VALID: legacy rows may contain non-https or malformed URLs. Adding a
-- plain CHECK constraint would fail the migration if any existing row violates
-- it. NOT VALID skips the validation of existing rows but still enforces the
-- constraint on all future INSERTs and UPDATEs. After cleaning up legacy data,
-- an operator can run the commented-out VALIDATE CONSTRAINT statements below to
-- retroactively verify existing rows.
--
-- Note: coffee_chat_profiles.linkedin_url is NOT NULL in the schema, so its
-- constraint omits the "IS NULL" branch.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'coffee_chat_profiles_linkedin_url_https_chk'
  ) THEN
    ALTER TABLE coffee_chat_profiles
      ADD CONSTRAINT coffee_chat_profiles_linkedin_url_https_chk
      CHECK (linkedin_url LIKE 'https://%') NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'resume_submissions_linkedin_url_https_chk'
  ) THEN
    ALTER TABLE resume_submissions
      ADD CONSTRAINT resume_submissions_linkedin_url_https_chk
      CHECK (linkedin_url IS NULL OR linkedin_url LIKE 'https://%') NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'opportunities_link_https_chk'
  ) THEN
    ALTER TABLE opportunities
      ADD CONSTRAINT opportunities_link_https_chk
      CHECK (link IS NULL OR link LIKE 'https://%') NOT VALID;
  END IF;
END $$;

-- After cleaning up any legacy rows that violate the above, an operator can
-- validate existing data by running:
--
--   ALTER TABLE coffee_chat_profiles VALIDATE CONSTRAINT coffee_chat_profiles_linkedin_url_https_chk;
--   ALTER TABLE resume_submissions   VALIDATE CONSTRAINT resume_submissions_linkedin_url_https_chk;
--   ALTER TABLE opportunities        VALIDATE CONSTRAINT opportunities_link_https_chk;
--
-- To find violating rows first:
--   SELECT id, linkedin_url FROM coffee_chat_profiles WHERE linkedin_url NOT LIKE 'https://%';
--   SELECT id, linkedin_url FROM resume_submissions   WHERE linkedin_url IS NOT NULL AND linkedin_url NOT LIKE 'https://%';
--   SELECT id, link         FROM opportunities        WHERE link IS NOT NULL AND link NOT LIKE 'https://%';
