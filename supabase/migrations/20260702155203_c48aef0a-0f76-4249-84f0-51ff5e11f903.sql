-- Admin access to member_documents (table)
DROP POLICY IF EXISTS "admins read all member docs" ON public.member_documents;
CREATE POLICY "admins read all member docs" ON public.member_documents
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admins manage all member docs" ON public.member_documents;
CREATE POLICY "admins manage all member docs" ON public.member_documents
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin read on member-documents storage bucket
DROP POLICY IF EXISTS "admins read all member document files" ON storage.objects;
CREATE POLICY "admins read all member document files" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'member-documents' AND public.has_role(auth.uid(), 'admin'));

-- Per-user folder RLS on opportunity buckets
-- Convention: first path segment = auth.uid()::text
DO $$
DECLARE b text;
BEGIN
  FOREACH b IN ARRAY ARRAY['opportunities','opportunity-vault','opportunity-documents','opportunity-files']
  LOOP
    EXECUTE format($f$DROP POLICY IF EXISTS "own folder read %1$s" ON storage.objects$f$, b);
    EXECUTE format($f$DROP POLICY IF EXISTS "own folder insert %1$s" ON storage.objects$f$, b);
    EXECUTE format($f$DROP POLICY IF EXISTS "own folder update %1$s" ON storage.objects$f$, b);
    EXECUTE format($f$DROP POLICY IF EXISTS "own folder delete %1$s" ON storage.objects$f$, b);
    EXECUTE format($f$DROP POLICY IF EXISTS "admins read %1$s" ON storage.objects$f$, b);

    EXECUTE format($f$
      CREATE POLICY "own folder read %1$s" ON storage.objects
        FOR SELECT TO authenticated
        USING (bucket_id = %2$L AND auth.uid()::text = (storage.foldername(name))[1])
    $f$, b, b);

    EXECUTE format($f$
      CREATE POLICY "own folder insert %1$s" ON storage.objects
        FOR INSERT TO authenticated
        WITH CHECK (bucket_id = %2$L AND auth.uid()::text = (storage.foldername(name))[1])
    $f$, b, b);

    EXECUTE format($f$
      CREATE POLICY "own folder update %1$s" ON storage.objects
        FOR UPDATE TO authenticated
        USING (bucket_id = %2$L AND auth.uid()::text = (storage.foldername(name))[1])
        WITH CHECK (bucket_id = %2$L AND auth.uid()::text = (storage.foldername(name))[1])
    $f$, b, b);

    EXECUTE format($f$
      CREATE POLICY "own folder delete %1$s" ON storage.objects
        FOR DELETE TO authenticated
        USING (bucket_id = %2$L AND auth.uid()::text = (storage.foldername(name))[1])
    $f$, b, b);

    EXECUTE format($f$
      CREATE POLICY "admins read %1$s" ON storage.objects
        FOR SELECT TO authenticated
        USING (bucket_id = %2$L AND public.has_role(auth.uid(), 'admin'))
    $f$, b, b);
  END LOOP;
END $$;
