-- ============================================================
-- 005 — Lock INSERT status (re-enable real moderation)
-- CRIT-2: Anonymous clients must NOT be able to self-approve.
-- Every new submission to a user-writable table that has a
-- `status` column must land as `status = 'pending'` and only
-- become visible after a human approves it (read policies in
-- 001_initial_schema.sql already gate SELECT on status).
--
-- This migration drops and recreates the existing `_insert`
-- policies (names taken verbatim from 001_initial_schema.sql)
-- so the WITH CHECK pins status to 'pending'. Read policies are
-- intentionally left untouched.
-- Safe to re-run: uses DROP POLICY IF EXISTS.
-- ============================================================

-- ── coffee_chat_profiles ───────────────────────────────────
-- Has both `status` and `public_profile` columns: lock both so
-- a client cannot self-publish a public, approved profile.
DROP POLICY IF EXISTS "coffee_chat_insert" ON coffee_chat_profiles;
CREATE POLICY "coffee_chat_insert" ON coffee_chat_profiles FOR INSERT
  WITH CHECK (status = 'pending' AND public_profile = false);

-- ── opportunities ──────────────────────────────────────────
-- Has `status` only (no public_profile column).
DROP POLICY IF EXISTS "opportunities_insert" ON opportunities;