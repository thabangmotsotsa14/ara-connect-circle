ALTER TABLE public.membership_applications
  ADD COLUMN IF NOT EXISTS support_education boolean,
  ADD COLUMN IF NOT EXISTS support_dignified_homes boolean,
  ADD COLUMN IF NOT EXISTS support_nutrition_wellbeing boolean;