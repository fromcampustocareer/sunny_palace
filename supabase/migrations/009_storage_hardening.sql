-- ============================================================
-- 009 — Storage hardening (HIGH-3)
-- ============================================================
-- Constrains both storage buckets to safe size + MIME limits and
-- brings the `avatars` bucket config (previously created manually in
-- the dashboard, NOT in any migration) under version control so the
-- repo is now the source of truth for both buckets.
--
--   avatars  — public, 2MB cap, image/png|jpeg|webp only
--   resumes  — private, 5MB cap, application/pdf only
--
-- Both buckets ALREADY EXIST, so we UPDATE (via ON CONFLICT) rather
-- than rely on a plain INSERT. file_size_limit is in BYTES.
-- The resume_upload / resume_admin_select storage policies are
-- re-asserted verbatim from migration 001 so this migration can also
-- stand as the source of truth for them.
-- Safe to re-run: ON CONFLICT DO UPDATE + DROP POLICY IF EXISTS.
-- ============================================================

-- ── AVATARS BUCKET (public, images only, 2MB) ──────────────
-- 2MB = 2 * 1024 * 1024 = 2097152 bytes
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152,
  ARRAY['image/png','image/jpeg','image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public             = EXCLUDED.public,
  file_size_limit    = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ── RESUMES BUCKET (private, PDF only, 5MB) ─────────────────
-- 5MB = 5 * 1024 * 1024 = 5242880 bytes
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes',
  'resumes',
  false,
  5242880,
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public             = EXCLUDED.public,
  file_size_limit    = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ── RE-ASSERT RESUME STORAGE POLICIES (verbatim from 001) ──
DROP POLICY IF EXISTS "resume_upload" ON storage.objects;
DROP POLICY IF EXISTS "resume_admin_select" ON storage.objects;

CREATE POLICY "resume_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'resumes' AND
    (storage.foldername(name))[1] = 'pending'
  );

CREATE POLICY "resume_admin_select" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'resumes' AND auth.role() = 'service_role'
  );
