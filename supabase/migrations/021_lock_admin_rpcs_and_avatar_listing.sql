-- 021_lock_admin_rpcs_and_avatar_listing.sql
--
-- Final hardening from the Supabase security advisor. Neither item was an active
-- anon-exploitable hole, but both reduce attack surface.
--
-- 1) Coffee-chat admin RPCs (admin moderation layer). They run SECURITY DEFINER and
--    self-gate via is_coffee_chat_admin() (which checks the caller's JWT email against
--    the RLS-write-locked coffee_chat_admins table), so anon — which carries no JWT
--    email — was already denied. The advisor still flags them as anon/authenticated
--    EXECUTE-able. The admin layer is used by a signed-in (authenticated) admin, so we
--    remove the anon/PUBLIC execute surface and grant EXECUTE to authenticated (and the
--    privileged service_role) only. Internal calls from the admin_* functions to
--    is_coffee_chat_admin() run as the function owner and are unaffected.
REVOKE EXECUTE ON FUNCTION public.admin_approve_coffee_chat_profile(uuid)              FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.admin_reject_coffee_chat_profile(uuid)               FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.admin_set_featured_coffee_chat_profile(uuid, boolean) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.admin_list_pending_coffee_chat_profiles()            FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_coffee_chat_admin()                               FROM anon, public;

GRANT EXECUTE ON FUNCTION public.admin_approve_coffee_chat_profile(uuid)               TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.admin_reject_coffee_chat_profile(uuid)                TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.admin_set_featured_coffee_chat_profile(uuid, boolean) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.admin_list_pending_coffee_chat_profiles()             TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_coffee_chat_admin()                                TO authenticated, service_role;

-- 2) avatars is a PUBLIC bucket: object URLs are served directly without consulting a
--    storage.objects SELECT policy, so the broad public SELECT (avatar_public_read)
--    only enabled LISTING/enumeration of every avatar key. The client only uploads and
--    builds public URLs (getPublicUrl) — it never calls .list() — so drop the listing
--    policy. The upload policy (avatar_upload, INSERT) and image display are unaffected.
DROP POLICY IF EXISTS "avatar_public_read" ON storage.objects;
