-- ============================================================
-- W1 — Stop exposing the submitter email via public table reads
-- ============================================================
-- The opportunity submission form stores the submitter's email address
-- in `opportunities.submitted_by` (OpportunityBoard.jsx form insert).
-- The public Opportunity Board read used `.select('*')` while the anon
-- (public REST) role held a broad table-level SELECT on `opportunities`,
-- so every submitter's email was readable through the public REST API —
-- a PII leak.
--
-- Mirrors the CRIT-3 column-grant fix (006_lock_pii_columns.sql): RLS
-- policies keep gating WHICH rows are visible (approved / featured);
-- column-level GRANTs gate WHICH columns anon may read. Revoking the
-- broad SELECT and re-granting only the non-PII columns makes
-- `submitted_by` unreadable while every column the public board needs
-- stays available.
--
-- `submitted_by` is deliberately omitted — it holds the submitter's
-- email address (PII).
--
-- Full opportunities column set:
--   id, role, company, role_type, link, deadline, eligibility, why,
--   submitted_by, status, created_at, location, pay
--   (location/pay added in migration 013).
-- ============================================================

REVOKE SELECT ON opportunities FROM anon;
GRANT SELECT (id, role, company, role_type, link, deadline, eligibility, why,
              status, created_at, location, pay) ON opportunities TO anon;
