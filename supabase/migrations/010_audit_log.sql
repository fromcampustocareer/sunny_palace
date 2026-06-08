-- 010_audit_log.sql
--
-- MED-5 (audit log for moderation actions): record who changed a row's `status`
-- and when, for the four public, moderated tables:
--   coffee_chat_profiles, opportunities, resume_submissions, panelists
--
-- WHY: status changes (pending -> approved/featured/rejected) are the moderation
-- actions that take content public. There are no app user accounts — writes happen
-- either via the `submit-form` edge function / admin SQL editor (service_role /
-- postgres) — so we capture `current_user` and, if present, `auth.uid()` to attribute
-- each action. This gives an after-the-fact trail reviewable from the dashboard.
--
-- SCOPE: lightweight, in-repo audit table + one shared AFTER trigger per table.
-- We log INSERTs (so new submissions are recorded with their initial status) and
-- status changes on UPDATE (only when `status` actually changed). We do NOT log
-- non-status column edits, to keep the table small and focused on moderation.
--
-- SAFETY: the trigger is AFTER INSERT OR UPDATE and the function is deliberately
-- minimal — a plain INSERT into audit_log. A logging failure should never be able
-- to occur here (no constraints can fail: all columns are nullable except the few
-- we always set), so it cannot abort a user's submission or an admin's status edit.
--
-- Re-runnable: uses CREATE TABLE IF NOT EXISTS, CREATE OR REPLACE FUNCTION, and
-- DROP TRIGGER IF EXISTS before each CREATE TRIGGER.

-- ── 1. AUDIT LOG TABLE ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_log (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  table_name  text NOT NULL,
  row_id      uuid,
  action      text NOT NULL,              -- 'INSERT' | 'status_change'
  actor       text,                       -- current_user, optionally with auth.uid()
  detail      jsonb,                       -- {status} on insert; {from,to} on change
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Helpful index for the common "review a row's history" / "recent activity" queries.
CREATE INDEX IF NOT EXISTS audit_log_row_id_idx     ON audit_log (row_id);
CREATE INDEX IF NOT EXISTS audit_log_created_at_idx ON audit_log (created_at DESC);

-- RLS on, with NO policies for anon: the public can never read the audit trail.
-- It is reviewed from the dashboard SQL editor, where service_role / postgres
-- bypass RLS. We also explicitly revoke any default grants from anon/authenticated.
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON audit_log FROM anon;
REVOKE ALL ON audit_log FROM authenticated;


-- ── 2. SHARED TRIGGER FUNCTION ─────────────────────────────
-- One function used by all four tables. Uses TG_TABLE_NAME / TG_OP so it stays
-- generic. All four target tables have `id uuid` PK and `status text`.
CREATE OR REPLACE FUNCTION record_status_audit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_actor text;
  v_uid   text;
BEGIN
  -- Best-effort attribution. auth.uid() may not exist / may be NULL on the
  -- service_role / SQL-editor path; guard it so it can never raise.
  BEGIN
    v_uid := auth.uid()::text;
  EXCEPTION WHEN OTHERS THEN
    v_uid := NULL;
  END;
  v_actor := current_user;
  IF v_uid IS NOT NULL THEN
    v_actor := v_actor || ' (uid:' || v_uid || ')';
  END IF;

  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_log (table_name, row_id, action, actor, detail)
    VALUES (
      TG_TABLE_NAME,
      NEW.id,
      'INSERT',
      v_actor,
      jsonb_build_object('table', TG_TABLE_NAME, 'status', NEW.status)
    );

  ELSIF TG_OP = 'UPDATE' THEN
    -- Only record genuine status changes.
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      INSERT INTO audit_log (table_name, row_id, action, actor, detail)
      VALUES (
        TG_TABLE_NAME,
        NEW.id,
        'status_change',
        v_actor,
        jsonb_build_object('from', OLD.status, 'to', NEW.status)
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$;


-- ── 3. TRIGGERS (one per moderated table) ──────────────────
DROP TRIGGER IF EXISTS audit_status ON coffee_chat_profiles;
CREATE TRIGGER audit_status
  AFTER INSERT OR UPDATE ON coffee_chat_profiles
  FOR EACH ROW EXECUTE FUNCTION record_status_audit();

DROP TRIGGER IF EXISTS audit_status ON opportunities;
CREATE TRIGGER audit_status
  AFTER INSERT OR UPDATE ON opportunities
  FOR EACH ROW EXECUTE FUNCTION record_status_audit();

DROP TRIGGER IF EXISTS audit_status ON resume_submissions;
CREATE TRIGGER audit_status
  AFTER INSERT OR UPDATE ON resume_submissions
  FOR EACH ROW EXECUTE FUNCTION record_status_audit();

DROP TRIGGER IF EXISTS audit_status ON panelists;
CREATE TRIGGER audit_status
  AFTER INSERT OR UPDATE ON panelists
  FOR EACH ROW EXECUTE FUNCTION record_status_audit();


-- ============================================================
-- ALERTING (documentation only — not enabled by this migration)
-- ============================================================
-- The audit_log table is a *passive* after-the-fact record. To get *active*
-- alerts when something goes wrong or something noteworthy happens, consider:
--
-- 1) SUPABASE LOG DRAINS (Postgres + edge-function logs):
--    Dashboard → Project Settings → Log Drains. Forward logs to a destination
--    (Datadog, BetterStack, an HTTP endpoint, etc.) and alert on patterns there.
--    Log Drains are a paid (Team/Enterprise plan) feature — flag for budgeting.
--    Until then, logs are viewable in Dashboard → Logs and via the Supabase MCP
--    `get_logs` tool.
--
-- 2) RESEND FAILURE ALERTING (notification email path):
--    The submit-form / notification flow sends mail via Resend. Add alerting so a
--    failed send is noticed:
--      - Resend Dashboard → Webhooks: subscribe to `email.bounced` /
--        `email.delivery_delayed` / `email.complained` and POST to a handler.
--      - In the edge function, on a non-2xx Resend response, log at error level
--        (so a Log Drain / Logs search can catch it) and/or send a fallback
--        notification to an ops inbox.
--    Resend webhooks are available on the free tier.
--
-- 3) SENTRY DSN (frontend error monitoring) — OPTIONAL, POSSIBLE PAID ADD-ON:
--    Add a Sentry DSN to the frontend (e.g. VITE_SENTRY_DSN) and initialize the
--    Sentry SDK to capture client-side errors and failed submission attempts.
--    Sentry has a free tier with limited event volume; meaningful retention /
--    higher quotas are PAID. Treat this as an optional add-on, not a hard
--    requirement for MED-5.
-- ============================================================
