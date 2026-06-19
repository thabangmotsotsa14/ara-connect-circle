export type MatcherChoice = "agree" | "neutral" | "disagree" | "skip";

export type MatcherStatement = {
  id: string;
  theme: string;
  statement: string;
  araPosition: "agree" | "disagree";
  justification: string;
};

export const EKURHULENI_STATEMENTS: MatcherStatement[] = [
  {
    id: "s1",
    theme: "Infrastructure",
    statement:
      "The Metro must prioritize aggressive, targeted infrastructure rehabilitation for critical roads and pothole hot zones in industrial and residential nodes over administrative building expansion.",
    araPosition: "agree",
    justification:
      "ARA Ekurhuleni prioritises ratepayer-facing infrastructure (roads, stormwater, depots) over expanding municipal head-office footprints. Capital budgets must follow potholes, not boardrooms.",
  },
  {
    id: "s2",
    theme: "Utility Debt",
    statement:
      "By-law enforcement units should immediately step up utility disconnections on high-debt commercial and residential properties to secure the city's billing integrity.",
    araPosition: "agree",
    justification:
      "ARA supports lawful, audited disconnection of verified high-debt accounts — paired with indigent-relief protection — to restore Ekurhuleni's revenue base and end the cross-subsidisation of non-payment.",
  },
  {
    id: "s3",
    theme: "Housing",
    statement:
      "Informal settlement relocations should be completely halted unless modern, basic service-connected structures are fully finalized beforehand.",
    araPosition: "agree",
    justification:
      "ARA's housing platform refuses 'dump-and-go' relocations. Water, sanitation and electricity reticulation must be commissioned before a single household is moved.",
  },
  {
    id: "s4",
    theme: "Waste Management",
    statement:
      "The municipal administration should heavily expand public-private partnership contracts to handle local waste removal hubs and bypass depot gridlocks.",
    araPosition: "agree",
    justification:
      "Where in-house depots are gridlocked, ARA backs transparent, performance-based PPPs for waste collection — with open contracts and ward-level service-level dashboards.",
  },
  {
    id: "s5",
    theme: "Township Entrepreneurs & SMMEs",
    statement:
      "The City of Ekurhuleni must reserve a strict, minimum 30% quota of all municipal procurement and supply chain contracts exclusively for verified locally-owned township SMMEs and youth-led enterprises.",
    araPosition: "agree",
    justification:
      "ARA Ekurhuleni backs a hard 30% set-aside of metro procurement for verified township SMMEs and youth-led enterprises — published quarterly with bidder names and award values for full accountability.",
  },
  {
    id: "s6",
    theme: "Youth Employment & Spaces",
    statement:
      "Underutilized municipal buildings and community centers should be systematically repurposed into digital hubs and free public co-working spaces equipped with high-speed internet to support job seekers and young remote micro-entrepreneurs.",
    araPosition: "agree",
    justification:
      "ARA wants dormant metro buildings turned into free Wi-Fi-enabled co-working and digital hubs for jobseekers, learners and micro-entrepreneurs — unlocking dead public assets for active youth opportunity.",
  },
  {
    id: "s7",
    theme: "Education & Skills Alignment",
    statement:
      "The Metro's corporate bursary and work-integrated learning allocations must heavily favor technical, vocational, and artisan engineering fields over general administrative fields to bridge the local industrial skills gap.",
    araPosition: "agree",
    justification:
      "ARA Ekurhuleni would redirect metro bursary and WIL allocations toward TVET, artisan and engineering pipelines — closing the skills gap that strands Ekurhuleni's industrial corridors short of welders, electricians and millwrights.",
  },
];

export function scoreMatcher(
  answers: Record<string, { choice: MatcherChoice; doubled: boolean }>,
) {
  let earned = 0;
  let possible = 0;
  const breakdown = EKURHULENI_STATEMENTS.map((s) => {
    const a = answers[s.id] ?? { choice: "skip" as MatcherChoice, doubled: false };
    const weight = a.doubled ? 2 : 1;
    if (a.choice === "skip") {
      return { statement: s, choice: a.choice, doubled: a.doubled, points: 0, weight: 0 };
    }
    possible += 2 * weight;
    let pts = 0;
    if (a.choice === "neutral") pts = 1 * weight;
    else if (a.choice === s.araPosition) pts = 2 * weight;
    else pts = 0;
    earned += pts;
    return { statement: s, choice: a.choice, doubled: a.doubled, points: pts, weight: 2 * weight };
  });
  const percent = possible === 0 ? 0 : Math.round((earned / possible) * 100);
  return { percent, breakdown };
}