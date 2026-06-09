-- 020_db_function_hardening.sql
--
-- Hardening surfaced by the Supabase security advisor (database linter) after the
-- Wave 1–3 DDL changes. IMPORTANT: none of these was an active anon-exploitable
-- hole — the coffee-chat admin RPCs self-gate via is_coffee_chat_admin() (the anon
-- key carries no JWT email) and coffee_chat_admins is RLS-write-locked. These two
-- changes are defense-in-depth / linter hygiene with zero functional impact.
--
-- 1) function_search_path_mutable: pin a non-mutable search_path so a SECURITY
--    DEFINER / trigger function can't be influenced by a caller-set search_path.
--    - record_status_audit() is SECURITY DEFINER and writes public.audit_log
--      (unqualified), so it needs 'public'. auth.uid() is already schema-qualified
--      and jsonb_build_object/current_user live in pg_catalog (always implicit).
--    - set_updated_at() and coffee_chat_set_approved_at() are trivial INVOKER
--      trigger functions that only touch NEW + now() (pg_catalog), so they get an
--      empty search_path.
ALTER FUNCTION public.record_status_audit()        SET search_path = 'public';
ALTER FUNCTION public.set_updated_at()             SET search_path = '';
ALTER FUNCTION public.coffee_chat_set_approved_at() SET search_path = '';

-- 2) (anon|authenticated)_security_definer_function_executable: record_status_audit
--    and rls_auto_enable are INTERNAL trigger / event-trigger functions, never meant
--    to be invoked via PostgREST RPC. Triggers and event triggers fire independently
--    of the caller's EXECUTE grant, so revoking EXECUTE from the API roles is safe
--    and removes them from the public /rest/v1/rpc surface.
REVOKE EXECUTE ON FUNCTION public.record_status_audit() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable()     FROM anon, authenticated, public;

-- NOTE (not done here, left as an operator decision — see SECURITY-AUDIT.md):
--   The coffee-chat admin RPCs (admin_approve/reject/set_featured/list_pending,
--   is_coffee_chat_admin) are also EXECUTE-able by anon, but they self-gate and are
--   not exploitable. Tightening them to authenticated-only touches the (undocumented)
--   admin layer, so it is recommended rather than applied automatically.
