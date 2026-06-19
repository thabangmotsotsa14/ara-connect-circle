REVOKE ALL ON FUNCTION public.get_vote_tallies(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_vote_tallies(uuid) TO service_role;