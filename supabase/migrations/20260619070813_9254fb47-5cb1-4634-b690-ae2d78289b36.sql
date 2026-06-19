
-- 1) Profiles: add DELETE policy (own profile) and admin UPDATE policy
CREATE POLICY "Members delete own profile"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins update any profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 2) Member documents: prevent non-admins from setting is_public = true
DROP POLICY IF EXISTS "members insert own docs" ON public.member_documents;
DROP POLICY IF EXISTS "members update own docs" ON public.member_documents;

CREATE POLICY "members insert own docs"
  ON public.member_documents FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = profile_id
    AND (is_public = false OR public.has_role(auth.uid(), 'admin'::app_role))
  );

CREATE POLICY "members update own docs"
  ON public.member_documents FOR UPDATE
  TO authenticated
  USING (auth.uid() = profile_id OR public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (
    (auth.uid() = profile_id AND is_public = false)
    OR public.has_role(auth.uid(), 'admin'::app_role)
  );

-- 3) user_roles: add explicit admin-only write policies (no self role assignment)
CREATE POLICY "Admins insert roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update roles"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 4) Lock down SECURITY DEFINER functions from direct API exposure
-- Trigger-only functions: nobody but the trigger owner needs EXECUTE
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

-- has_role is used inside RLS policies; authenticated needs EXECUTE so policies evaluate.
-- Revoke from anon and PUBLIC, keep authenticated and service_role.
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

-- get_vote_tallies: keep callable by signed-in members only
REVOKE ALL ON FUNCTION public.get_vote_tallies(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_vote_tallies(uuid) TO authenticated, service_role;
