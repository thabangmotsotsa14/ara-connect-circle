
DROP POLICY IF EXISTS "anyone can count votes" ON public.votes;
DROP VIEW IF EXISTS public.vote_tallies;

CREATE OR REPLACE FUNCTION public.get_vote_tallies(_issue_id UUID DEFAULT NULL)
RETURNS TABLE (issue_id UUID, vote_choice TEXT, total BIGINT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT v.issue_id, v.vote_choice, COUNT(*)::bigint
  FROM public.votes v
  WHERE _issue_id IS NULL OR v.issue_id = _issue_id
  GROUP BY v.issue_id, v.vote_choice
$$;

GRANT EXECUTE ON FUNCTION public.get_vote_tallies(UUID) TO anon, authenticated;
