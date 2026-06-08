-- MED-3: Thin server-side input validation at the DB trust boundary.
--
-- The `submit-form`, `add-to-waitlist`, and `send-contact-email` edge functions
-- validate email format / max lengths in app code, but inserts ultimately land
-- in Postgres, so we ALSO enforce the known shapes at the DB layer. This is the
-- last line of defense and complements CRIT-2's server-side status lock.
--
-- Three classes of constraint are added:
--   1. status domain   — status must be one of the moderation states.
--   2. email format     — every table with an `email` column gets a regex check.
--   3. free-text caps   — char_length() ceilings on free-text columns so a
--                         crafted payload can't insert a 100k-char value.
--
-- Why NOT VALID: legacy rows may already violate these (e.g. an odd legacy email
-- or an unexpected status). A plain CHECK would fail the migration on that data.
-- NOT VALID skips validating existing rows but STILL enforces the constraint on
-- every future INSERT/UPDATE — including writes by the `postgres`/service role.
-- After cleaning legacy data, run the commented-out VALIDATE statements at the
-- bottom to retroactively verify existing rows.
--
-- Each ADD is guarded by a pg_constraint existence check so the migration is
-- safely re-runnable. Nullable email columns use `email IS NULL OR ...`.
--
-- This does NOT touch migration 008's *_https_chk URL constraints — those are
-- separate and remain as-is.

-- Email regex used for every email column. Postgres POSIX form of the edge
-- functions' /^[^@\s]+@[^@\s]+\.[^@\s]+$/ — one or more non-@/non-space chars,
-- an @, more non-@/non-space chars, a dot, and a non-@/non-space TLD.
-- (defined inline per constraint below; kept here as documentation)

DO $$
BEGIN
  -- ── 1. STATUS DOMAIN ──────────────────────────────────────
  -- status columns default to 'pending'; allow NULL defensively.
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'coffee_chat_profiles_status_chk') THEN
    ALTER TABLE coffee_chat_profiles
      ADD CONSTRAINT coffee_chat_profiles_status_chk
      CHECK (status IS NULL OR status IN ('pending','approved','featured','rejected')) NOT VALID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'opportunities_status_chk') THEN
    ALTER TABLE opportunities
      ADD CONSTRAINT opportunities_status_chk
      CHECK (status IS NULL OR status IN ('pending','approved','featured','rejected')) NOT VALID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'resume_submissions_status_chk') THEN
    ALTER TABLE resume_submissions
      ADD CONSTRAINT resume_submissions_status_chk
      CHECK (status IS NULL OR status IN ('pending','approved','featured','rejected')) NOT VALID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'panelists_status_chk') THEN
    ALTER TABLE panelists
      ADD CONSTRAINT panelists_status_chk
      CHECK (status IS NULL OR status IN ('pending','approved','featured','rejected')) NOT VALID;
  END IF;

  -- ── 2. EMAIL FORMAT ───────────────────────────────────────
  -- NOT NULL email columns: subscribers, coffee_chat_profiles, resume_submissions,
  --   panelists, bridge_year_subscribers, waitlist_subscribers.
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'subscribers_email_format_chk') THEN
    ALTER TABLE subscribers
      ADD CONSTRAINT subscribers_email_format_chk
      CHECK (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$') NOT VALID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'coffee_chat_profiles_email_format_chk') THEN
    ALTER TABLE coffee_chat_profiles
      ADD CONSTRAINT coffee_chat_profiles_email_format_chk
      CHECK (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$') NOT VALID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'resume_submissions_email_format_chk') THEN
    ALTER TABLE resume_submissions
      ADD CONSTRAINT resume_submissions_email_format_chk
      CHECK (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$') NOT VALID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'panelists_email_format_chk') THEN
    ALTER TABLE panelists
      ADD CONSTRAINT panelists_email_format_chk
      CHECK (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$') NOT VALID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bridge_year_subscribers_email_format_chk') THEN
    ALTER TABLE bridge_year_subscribers
      ADD CONSTRAINT bridge_year_subscribers_email_format_chk
      CHECK (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$') NOT VALID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'waitlist_subscribers_email_format_chk') THEN
    ALTER TABLE waitlist_subscribers
      ADD CONSTRAINT waitlist_subscribers_email_format_chk
      CHECK (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$') NOT VALID;
  END IF;

  -- Nullable email columns: template_requests, bridge_year_suggestions,
  --   interview_prep_requests, panel_suggestions, linkedin_episode_requests.
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'template_requests_email_format_chk') THEN
    ALTER TABLE template_requests
      ADD CONSTRAINT template_requests_email_format_chk
      CHECK (email IS NULL OR email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$') NOT VALID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bridge_year_suggestions_email_format_chk') THEN
    ALTER TABLE bridge_year_suggestions
      ADD CONSTRAINT bridge_year_suggestions_email_format_chk
      CHECK (email IS NULL OR email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$') NOT VALID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'interview_prep_requests_email_format_chk') THEN
    ALTER TABLE interview_prep_requests
      ADD CONSTRAINT interview_prep_requests_email_format_chk
      CHECK (email IS NULL OR email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$') NOT VALID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'panel_suggestions_email_format_chk') THEN
    ALTER TABLE panel_suggestions
      ADD CONSTRAINT panel_suggestions_email_format_chk
      CHECK (email IS NULL OR email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$') NOT VALID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'linkedin_episode_requests_email_format_chk') THEN
    ALTER TABLE linkedin_episode_requests
      ADD CONSTRAINT linkedin_episode_requests_email_format_chk
      CHECK (email IS NULL OR email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$') NOT VALID;
  END IF;

  -- ── 3. FREE-TEXT LENGTH CAPS ──────────────────────────────
  -- Long-form (<= 5000): story, why, notes, topics, target_companies, message-like.
  -- Medium (<= 500): name, handle, company, role, role_title, location, school,
  --   target_companies headers, etc. Short labels (<= 200): pronouns, category,
  --   stage, capacity, role_type. Caps are generous to avoid breaking legit data.

  -- subscribers
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'subscribers_name_len_chk') THEN
    ALTER TABLE subscribers
      ADD CONSTRAINT subscribers_name_len_chk
      CHECK (name IS NULL OR char_length(name) <= 500) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'subscribers_source_len_chk') THEN
    ALTER TABLE subscribers
      ADD CONSTRAINT subscribers_source_len_chk
      CHECK (source IS NULL OR char_length(source) <= 500) NOT VALID;
  END IF;

  -- opportunities
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'opportunities_role_len_chk') THEN
    ALTER TABLE opportunities
      ADD CONSTRAINT opportunities_role_len_chk
      CHECK (char_length(role) <= 500) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'opportunities_company_len_chk') THEN
    ALTER TABLE opportunities
      ADD CONSTRAINT opportunities_company_len_chk
      CHECK (char_length(company) <= 500) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'opportunities_eligibility_len_chk') THEN
    ALTER TABLE opportunities
      ADD CONSTRAINT opportunities_eligibility_len_chk
      CHECK (eligibility IS NULL OR char_length(eligibility) <= 5000) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'opportunities_why_len_chk') THEN
    ALTER TABLE opportunities
      ADD CONSTRAINT opportunities_why_len_chk
      CHECK (why IS NULL OR char_length(why) <= 5000) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'opportunities_submitted_by_len_chk') THEN
    ALTER TABLE opportunities
      ADD CONSTRAINT opportunities_submitted_by_len_chk
      CHECK (submitted_by IS NULL OR char_length(submitted_by) <= 500) NOT VALID;
  END IF;

  -- coffee_chat_profiles
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'coffee_chat_profiles_name_len_chk') THEN
    ALTER TABLE coffee_chat_profiles
      ADD CONSTRAINT coffee_chat_profiles_name_len_chk
      CHECK (char_length(name) <= 500) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'coffee_chat_profiles_role_title_len_chk') THEN
    ALTER TABLE coffee_chat_profiles
      ADD CONSTRAINT coffee_chat_profiles_role_title_len_chk
      CHECK (char_length(role_title) <= 500) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'coffee_chat_profiles_location_len_chk') THEN
    ALTER TABLE coffee_chat_profiles
      ADD CONSTRAINT coffee_chat_profiles_location_len_chk
      CHECK (location IS NULL OR char_length(location) <= 500) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'coffee_chat_profiles_topics_len_chk') THEN
    ALTER TABLE coffee_chat_profiles
      ADD CONSTRAINT coffee_chat_profiles_topics_len_chk
      CHECK (topics IS NULL OR char_length(topics) <= 5000) NOT VALID;
  END IF;

  -- resume_submissions
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'resume_submissions_handle_len_chk') THEN
    ALTER TABLE resume_submissions
      ADD CONSTRAINT resume_submissions_handle_len_chk
      CHECK (char_length(handle) <= 500) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'resume_submissions_role_title_len_chk') THEN
    ALTER TABLE resume_submissions
      ADD CONSTRAINT resume_submissions_role_title_len_chk
      CHECK (role_title IS NULL OR char_length(role_title) <= 500) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'resume_submissions_target_companies_len_chk') THEN
    ALTER TABLE resume_submissions
      ADD CONSTRAINT resume_submissions_target_companies_len_chk
      CHECK (target_companies IS NULL OR char_length(target_companies) <= 5000) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'resume_submissions_story_len_chk') THEN
    ALTER TABLE resume_submissions
      ADD CONSTRAINT resume_submissions_story_len_chk
      CHECK (story IS NULL OR char_length(story) <= 5000) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'resume_submissions_file_name_len_chk') THEN
    ALTER TABLE resume_submissions
      ADD CONSTRAINT resume_submissions_file_name_len_chk
      CHECK (file_name IS NULL OR char_length(file_name) <= 500) NOT VALID;
  END IF;

  -- template_requests
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'template_requests_request_len_chk') THEN
    ALTER TABLE template_requests
      ADD CONSTRAINT template_requests_request_len_chk
      CHECK (char_length(request) <= 5000) NOT VALID;
  END IF;

  -- bridge_year_suggestions
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bridge_year_suggestions_program_name_len_chk') THEN
    ALTER TABLE bridge_year_suggestions
      ADD CONSTRAINT bridge_year_suggestions_program_name_len_chk
      CHECK (char_length(program_name) <= 500) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bridge_year_suggestions_company_len_chk') THEN
    ALTER TABLE bridge_year_suggestions
      ADD CONSTRAINT bridge_year_suggestions_company_len_chk
      CHECK (char_length(company) <= 500) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bridge_year_suggestions_why_len_chk') THEN
    ALTER TABLE bridge_year_suggestions
      ADD CONSTRAINT bridge_year_suggestions_why_len_chk
      CHECK (why IS NULL OR char_length(why) <= 5000) NOT VALID;
  END IF;

  -- interview_prep_requests
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'interview_prep_requests_description_len_chk') THEN
    ALTER TABLE interview_prep_requests
      ADD CONSTRAINT interview_prep_requests_description_len_chk
      CHECK (char_length(description) <= 5000) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'interview_prep_requests_help_needed_len_chk') THEN
    ALTER TABLE interview_prep_requests
      ADD CONSTRAINT interview_prep_requests_help_needed_len_chk
      CHECK (help_needed IS NULL OR char_length(help_needed) <= 5000) NOT VALID;
  END IF;

  -- panel_suggestions
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'panel_suggestions_topic_len_chk') THEN
    ALTER TABLE panel_suggestions
      ADD CONSTRAINT panel_suggestions_topic_len_chk
      CHECK (char_length(topic) <= 5000) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'panel_suggestions_why_helpful_len_chk') THEN
    ALTER TABLE panel_suggestions
      ADD CONSTRAINT panel_suggestions_why_helpful_len_chk
      CHECK (char_length(why_helpful) <= 5000) NOT VALID;
  END IF;

  -- panelists
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'panelists_name_len_chk') THEN
    ALTER TABLE panelists
      ADD CONSTRAINT panelists_name_len_chk
      CHECK (char_length(name) <= 500) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'panelists_role_title_len_chk') THEN
    ALTER TABLE panelists
      ADD CONSTRAINT panelists_role_title_len_chk
      CHECK (char_length(role_title) <= 500) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'panelists_topic_len_chk') THEN
    ALTER TABLE panelists
      ADD CONSTRAINT panelists_topic_len_chk
      CHECK (topic IS NULL OR char_length(topic) <= 5000) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'panelists_interested_in_len_chk') THEN
    ALTER TABLE panelists
      ADD CONSTRAINT panelists_interested_in_len_chk
      CHECK (interested_in IS NULL OR char_length(interested_in) <= 5000) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'panelists_notes_len_chk') THEN
    ALTER TABLE panelists
      ADD CONSTRAINT panelists_notes_len_chk
      CHECK (notes IS NULL OR char_length(notes) <= 5000) NOT VALID;
  END IF;

  -- linkedin_episode_requests
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'linkedin_episode_requests_topic_len_chk') THEN
    ALTER TABLE linkedin_episode_requests
      ADD CONSTRAINT linkedin_episode_requests_topic_len_chk
      CHECK (char_length(topic) <= 5000) NOT VALID;
  END IF;

  -- waitlist_subscribers
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'waitlist_subscribers_name_len_chk') THEN
    ALTER TABLE waitlist_subscribers
      ADD CONSTRAINT waitlist_subscribers_name_len_chk
      CHECK (char_length(name) <= 500) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'waitlist_subscribers_school_len_chk') THEN
    ALTER TABLE waitlist_subscribers
      ADD CONSTRAINT waitlist_subscribers_school_len_chk
      CHECK (school IS NULL OR char_length(school) <= 500) NOT VALID;
  END IF;
END $$;

-- ════════════════════════════════════════════════════════════
-- POST-CLEANUP VALIDATION (run manually after fixing legacy rows)
-- ════════════════════════════════════════════════════════════
-- After confirming no existing rows violate the above, an operator can promote
-- each NOT VALID constraint to fully validated:
--
--   -- status domain
--   ALTER TABLE coffee_chat_profiles VALIDATE CONSTRAINT coffee_chat_profiles_status_chk;
--   ALTER TABLE opportunities        VALIDATE CONSTRAINT opportunities_status_chk;
--   ALTER TABLE resume_submissions   VALIDATE CONSTRAINT resume_submissions_status_chk;
--   ALTER TABLE panelists            VALIDATE CONSTRAINT panelists_status_chk;
--
--   -- email format
--   ALTER TABLE subscribers                VALIDATE CONSTRAINT subscribers_email_format_chk;
--   ALTER TABLE coffee_chat_profiles       VALIDATE CONSTRAINT coffee_chat_profiles_email_format_chk;
--   ALTER TABLE resume_submissions         VALIDATE CONSTRAINT resume_submissions_email_format_chk;
--   ALTER TABLE panelists                  VALIDATE CONSTRAINT panelists_email_format_chk;
--   ALTER TABLE bridge_year_subscribers    VALIDATE CONSTRAINT bridge_year_subscribers_email_format_chk;
--   ALTER TABLE waitlist_subscribers       VALIDATE CONSTRAINT waitlist_subscribers_email_format_chk;
--   ALTER TABLE template_requests          VALIDATE CONSTRAINT template_requests_email_format_chk;
--   ALTER TABLE bridge_year_suggestions    VALIDATE CONSTRAINT bridge_year_suggestions_email_format_chk;
--   ALTER TABLE interview_prep_requests    VALIDATE CONSTRAINT interview_prep_requests_email_format_chk;
--   ALTER TABLE panel_suggestions          VALIDATE CONSTRAINT panel_suggestions_email_format_chk;
--   ALTER TABLE linkedin_episode_requests  VALIDATE CONSTRAINT linkedin_episode_requests_email_format_chk;
--
--   -- free-text caps (one VALIDATE per constraint; see names above)
--
-- To find violating rows BEFORE validating:
--   -- bad statuses
--   SELECT id, status FROM coffee_chat_profiles WHERE status IS NOT NULL AND status NOT IN ('pending','approved','featured','rejected');
--   SELECT id, status FROM opportunities        WHERE status IS NOT NULL AND status NOT IN ('pending','approved','featured','rejected');
--   SELECT id, status FROM resume_submissions   WHERE status IS NOT NULL AND status NOT IN ('pending','approved','featured','rejected');
--   SELECT id, status FROM panelists            WHERE status IS NOT NULL AND status NOT IN ('pending','approved','featured','rejected');
--   -- bad emails (repeat per table)
--   SELECT id, email FROM subscribers          WHERE email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$';
--   SELECT id, email FROM coffee_chat_profiles WHERE email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$';
--   SELECT id, email FROM resume_submissions   WHERE email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$';
--   SELECT id, email FROM panelists            WHERE email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$';
--   SELECT id, email FROM bridge_year_subscribers WHERE email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$';
--   SELECT id, email FROM waitlist_subscribers WHERE email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$';
--   SELECT id, email FROM template_requests          WHERE email IS NOT NULL AND email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$';
--   SELECT id, email FROM bridge_year_suggestions    WHERE email IS NOT NULL AND email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$';
--   SELECT id, email FROM interview_prep_requests    WHERE email IS NOT NULL AND email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$';
--   SELECT id, email FROM panel_suggestions          WHERE email IS NOT NULL AND email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$';
--   SELECT id, email FROM linkedin_episode_requests  WHERE email IS NOT NULL AND email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$';
--   -- oversized free-text (example)
--   SELECT id FROM resume_submissions WHERE story IS NOT NULL AND char_length(story) > 5000;
