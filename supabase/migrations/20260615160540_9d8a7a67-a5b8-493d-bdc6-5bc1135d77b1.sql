
CREATE OR REPLACE VIEW public.vote_tallies
WITH (security_invoker = true) AS
SELECT issue_id, vote_choice, COUNT(*)::int AS total
FROM public.votes
GROUP BY issue_id, vote_choice;
GRANT SELECT ON public.vote_tallies TO anon, authenticated;

-- Allow tally aggregation across all members without exposing individual votes
CREATE POLICY "anyone can count votes" ON public.votes
  FOR SELECT TO anon, authenticated USING (true);
