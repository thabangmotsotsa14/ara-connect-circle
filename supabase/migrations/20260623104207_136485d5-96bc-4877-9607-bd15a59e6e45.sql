CREATE TABLE public.membership_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  gender text,
  date_of_birth date,
  id_number text,
  nationality text,
  religion text,
  residence_status text,
  marital_status text,
  mobile_no text NOT NULL,
  address text,
  suburb text,
  city text,
  province text,
  postal_code text,
  country text,
  email text NOT NULL,
  municipality text,
  ward text,
  ward_leader text,
  captured_by text,
  marketing_consent boolean NOT NULL DEFAULT false,
  voter_registration_status text,
  member_signature text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.membership_applications TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.membership_applications TO authenticated;
GRANT ALL ON public.membership_applications TO service_role;

ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a membership application"
  ON public.membership_applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view membership applications"
  ON public.membership_applications FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update membership applications"
  ON public.membership_applications FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete membership applications"
  ON public.membership_applications FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER set_membership_applications_updated_at
  BEFORE UPDATE ON public.membership_applications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();