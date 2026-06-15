
-- ============== 1. PROFILES EXTENSIONS ==============
DO $$ BEGIN
  CREATE TYPE public.primary_role AS ENUM (
    'Business','Student','Senior Citizen','Youth Member',
    'Religious Person','Non-Religious Person','Content Creator','Content Consumer'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS primary_role public.primary_role,
  ADD COLUMN IF NOT EXISTS structural_sector TEXT,
  ADD COLUMN IF NOT EXISTS skills_keywords TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS industry_sector VARCHAR(100),
  ADD COLUMN IF NOT EXISTS manifesto_alignment INTEGER;

-- ============== 2. PROFILE ATTRIBUTES ==============
CREATE TABLE IF NOT EXISTS public.profile_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  attribute_type TEXT NOT NULL,
  attribute_value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (profile_id, attribute_type, attribute_value)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profile_attributes TO authenticated;
GRANT ALL ON public.profile_attributes TO service_role;
ALTER TABLE public.profile_attributes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members manage own attributes" ON public.profile_attributes
  FOR ALL TO authenticated
  USING (auth.uid() = profile_id OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (auth.uid() = profile_id);

CREATE INDEX IF NOT EXISTS idx_profile_attributes_profile ON public.profile_attributes(profile_id);

-- ============== 3. MEMBER DOCUMENTS ==============
CREATE TABLE IF NOT EXISTS public.member_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('CV','Business Profile','Academic Letter','Company Registration')),
  file_url TEXT NOT NULL,
  file_path TEXT,
  title TEXT,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.member_documents TO authenticated;
GRANT ALL ON public.member_documents TO service_role;
ALTER TABLE public.member_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members read own or public docs" ON public.member_documents
  FOR SELECT TO authenticated
  USING (auth.uid() = profile_id OR is_public = true OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "members insert own docs" ON public.member_documents
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "members update own docs" ON public.member_documents
  FOR UPDATE TO authenticated USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "members delete own docs" ON public.member_documents
  FOR DELETE TO authenticated USING (auth.uid() = profile_id);

CREATE INDEX IF NOT EXISTS idx_member_documents_profile ON public.member_documents(profile_id);

-- ============== 4. PERSONAL BOTTLENECKS ==============
CREATE TABLE IF NOT EXISTS public.personal_bottlenecks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  geographical_node VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('Education Funding','Unemployment','Municipal Failure','Business Red Tape','Healthcare Access')),
  headline TEXT NOT NULL,
  detailed_description TEXT NOT NULL,
  has_supporting_doc BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(30) NOT NULL DEFAULT 'Logged' CHECK (status IN ('Logged','Under Review','Escalated to Council','Resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.personal_bottlenecks TO authenticated;
GRANT ALL ON public.personal_bottlenecks TO service_role;
ALTER TABLE public.personal_bottlenecks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members manage own bottlenecks" ON public.personal_bottlenecks
  FOR ALL TO authenticated
  USING (auth.uid() = profile_id OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (auth.uid() = profile_id);

CREATE INDEX IF NOT EXISTS idx_bottlenecks_profile ON public.personal_bottlenecks(profile_id);
CREATE INDEX IF NOT EXISTS idx_bottlenecks_node ON public.personal_bottlenecks(geographical_node);
CREATE INDEX IF NOT EXISTS idx_bottlenecks_category ON public.personal_bottlenecks(category);

CREATE TRIGGER trg_bottlenecks_updated_at
  BEFORE UPDATE ON public.personal_bottlenecks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Anonymized public view for the National Crisis Tracker
CREATE OR REPLACE VIEW public.crisis_tracker
WITH (security_invoker = true) AS
SELECT id, geographical_node, category, status, created_at
FROM public.personal_bottlenecks;
GRANT SELECT ON public.crisis_tracker TO anon, authenticated;

-- ============== 5. ISSUES (V.O.T.E. booklet) ==============
CREATE TABLE IF NOT EXISTS public.issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('Energy Crisis','Wealth Inequality','Race & Identity','International Relations')),
  summary TEXT NOT NULL,
  pro_arguments TEXT[] NOT NULL DEFAULT '{}',
  con_arguments TEXT[] NOT NULL DEFAULT '{}',
  impact_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  empirical_studies JSONB NOT NULL DEFAULT '[]'::jsonb,
  vote_options TEXT[] NOT NULL DEFAULT ARRAY['For','Against','Abstain'],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.issues TO anon, authenticated;
GRANT ALL ON public.issues TO service_role;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "issues readable by all" ON public.issues
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "admins write issues" ON public.issues
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============== 6. VOTES ==============
CREATE TABLE IF NOT EXISTS public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  vote_choice TEXT NOT NULL,
  verification_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (profile_id, issue_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.votes TO authenticated;
GRANT ALL ON public.votes TO service_role;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members read own votes" ON public.votes
  FOR SELECT TO authenticated
  USING (auth.uid() = profile_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "members cast own votes" ON public.votes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "members update own votes" ON public.votes
  FOR UPDATE TO authenticated USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "members delete own votes" ON public.votes
  FOR DELETE TO authenticated USING (auth.uid() = profile_id);

CREATE TRIGGER trg_votes_updated_at
  BEFORE UPDATE ON public.votes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Public aggregate view (no profile ids)
CREATE OR REPLACE VIEW public.vote_tallies
WITH (security_invoker = false) AS
SELECT issue_id, vote_choice, COUNT(*)::int AS total
FROM public.votes
GROUP BY issue_id, vote_choice;
GRANT SELECT ON public.vote_tallies TO anon, authenticated;

-- ============== 7. TOWN HALL COMMENTS ==============
CREATE TABLE IF NOT EXISTS public.town_hall_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  comment_as_persona TEXT NOT NULL,
  comment_text TEXT NOT NULL CHECK (char_length(comment_text) BETWEEN 1 AND 2000),
  upvotes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.town_hall_comments TO authenticated;
GRANT ALL ON public.town_hall_comments TO service_role;
ALTER TABLE public.town_hall_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "comments readable by authenticated" ON public.town_hall_comments
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "members post own comments" ON public.town_hall_comments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "members update own comments" ON public.town_hall_comments
  FOR UPDATE TO authenticated USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "members delete own comments" ON public.town_hall_comments
  FOR DELETE TO authenticated USING (auth.uid() = profile_id);

CREATE INDEX IF NOT EXISTS idx_comments_issue ON public.town_hall_comments(issue_id);

-- ============== 8. SEED ISSUES ==============
INSERT INTO public.issues (slug, title, category, summary, pro_arguments, con_arguments, impact_details, empirical_studies)
VALUES
  ('end-load-shedding', 'End Load Shedding via Independent Power Producers', 'Energy Crisis',
   'Open the grid to private and municipal generation to permanently end scheduled blackouts.',
   ARRAY['Faster generation capacity','Reduces Eskom monopoly risk','Creates green jobs'],
   ARRAY['Short-term tariff increases','Grid integration complexity'],
   '{"gdp_impact":"+1.8%","jobs":"120k","timeline":"24 months"}'::jsonb,
   '[{"title":"CSIR Energy Outlook 2024","url":"https://www.csir.co.za"}]'::jsonb),
  ('wealth-tax', 'Progressive Wealth Tax on Net Assets > R50m', 'Wealth Inequality',
   'Fund education and SMME credit through a 1.5% annual tax on ultra-high net worth.',
   ARRAY['Funds NSFAS gap','Reduces Gini coefficient'],
   ARRAY['Risk of capital flight','Valuation enforcement burden'],
   '{"revenue":"R140bn/yr","affected":"~4,500 households"}'::jsonb,
   '[{"title":"WID.world SA Report","url":"https://wid.world"}]'::jsonb),
  ('identity-policy', 'Constitution-First Identity Policy', 'Race & Identity',
   'Centre citizenship and merit while preserving redress mechanisms tied to economic need, not race.',
   ARRAY['Universalist framing','Targets actual poverty'],
   ARRAY['Disrupts existing BEE scorecards','Implementation cost'],
   '{"affected_programs":12}'::jsonb,
   '[]'::jsonb),
  ('brics-trade', 'Pragmatic BRICS+ Trade Posture', 'International Relations',
   'Maximise non-aligned trade leverage while protecting AGOA and EU access.',
   ARRAY['Diversifies export markets','Currency settlement options'],
   ARRAY['Geopolitical friction with US','AGOA at risk'],
   '{"exports_at_risk_usd":"3.6B"}'::jsonb,
   '[]'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- ============== 9. STORAGE BUCKET POLICIES (bucket created via tool) ==============
-- (Policies only — bucket creation handled separately)
DO $$ BEGIN
  CREATE POLICY "members read own or public member docs" ON storage.objects
    FOR SELECT TO authenticated
    USING (
      bucket_id = 'member-documents'
      AND (
        (storage.foldername(name))[1] = auth.uid()::text
        OR public.has_role(auth.uid(),'admin')
        OR EXISTS (
          SELECT 1 FROM public.member_documents md
          WHERE md.file_path = name AND md.is_public = true
        )
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "members upload own member docs" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'member-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "members update own member docs" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'member-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "members delete own member docs" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'member-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
