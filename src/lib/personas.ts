export const PERSONA_ATTRIBUTES = [
  "Worker",
  "Hirer",
  "Mother",
  "Father",
  "Native",
  "Creative",
  "Student",
  "Entrepreneur",
  "Caregiver",
  "Activist",
  "Faith Leader",
  "Veteran",
  "Unemployed",
  "Farmer",
  "Tradesperson",
] as const;

export type Persona = (typeof PERSONA_ATTRIBUTES)[number];

export const PRIMARY_ROLES = [
  "Business",
  "Student",
  "Senior Citizen",
  "Youth Member",
  "Religious Person",
  "Non-Religious Person",
  "Content Creator",
  "Content Consumer",
] as const;

export const INDUSTRY_SECTORS = [
  "Agriculture",
  "Construction",
  "Education",
  "Energy",
  "Finance",
  "Healthcare",
  "Hospitality",
  "ICT & Software",
  "Logistics",
  "Manufacturing",
  "Media & Creative",
  "Mining",
  "Professional Services",
  "Retail",
  "Public Sector",
  "Other",
] as const;

export function showVaultCV(attrs: string[]) {
  return attrs.some((a) => a === "Worker" || a === "Student" || a === "Unemployed");
}

export function showVaultBusiness(attrs: string[], role?: string | null) {
  return attrs.some((a) => a === "Hirer" || a === "Entrepreneur") || role === "Business";
}