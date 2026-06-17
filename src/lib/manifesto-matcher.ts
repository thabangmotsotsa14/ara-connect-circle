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
      "The Metro must run aggressive, targeted infrastructure rehabilitation for critical roads and pothole hot zones in industrial and residential nodes over administrative building expansion.",
    araPosition: "agree",
    justification:
      "ARA Ekurhuleni prioritises ratepayer-facing infrastructure (roads, stormwater, depots) over expanding municipal head-office footprints. Capital budgets must follow potholes, not boardrooms.",
  },
  {
    id: "s2",
    theme: "Billing integrity",
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
    theme: "Service delivery",
    statement:
      "The municipal administration should heavily expand public-private partnership contracts to handle local waste removal hubs and bypass depot gridlocks.",
    araPosition: "agree",
    justification:
      "Where in-house depots are gridlocked, ARA backs transparent, performance-based PPPs for waste collection — with open contracts and ward-level service-level dashboards.",
  },
  {
    id: "s5",
    theme: "Water security",
    statement:
      "Ekurhuleni must ring-fence a dedicated water-loss budget to fix burst mains and reservoir leaks in Tembisa, Katlehong and Vosloorus before approving any new vanity capital projects.",
    araPosition: "agree",
    justification:
      "Non-revenue water losses bleed the metro daily. ARA Ekurhuleni would ring-fence repair budgets for the worst-affected township reticulation networks ahead of any discretionary spend.",
  },
  {
    id: "s6",
    theme: "Electricity",
    statement:
      "The Metro should aggressively prosecute illegal connections and cable theft syndicates in industrial nodes like Wadeville, Isando and Springs to protect the city's electricity grid.",
    araPosition: "agree",
    justification:
      "Cable theft and illegal connections are a primary driver of load-shedding extensions across Ekurhuleni. ARA backs ring-fenced EMPD specialist units focused on the industrial corridors.",
  },
  {
    id: "s7",
    theme: "Public safety",
    statement:
      "The Ekurhuleni Metro Police Department (EMPD) should be doubled in size and deployed visibly into hijacking and CIT hotspots in Kempton Park, Boksburg and Germiston.",
    araPosition: "agree",
    justification:
      "ARA Ekurhuleni supports doubling visible EMPD deployment in documented crime hotspots, paired with body-cams and an independent civilian oversight panel.",
  },
  {
    id: "s8",
    theme: "Township economy",
    statement:
      "Spaza shops and SMMEs in Tembisa, Daveyton, Tsakane and KwaThema should get fast-tracked, low-cost trading licences instead of being shut down by by-law raids.",
    araPosition: "agree",
    justification:
      "ARA recognises township SMMEs as the backbone of local employment. We back a 7-day fast-track licence regime over punitive raids that destroy livelihoods.",
  },
  {
    id: "s9",
    theme: "Transport",
    statement:
      "The Harambee BRT and feeder bus network should be expanded to connect Tembisa and Vosloorus directly to OR Tambo and the Kempton Park CBD, even if it raises the municipal subsidy.",
    araPosition: "agree",
    justification:
      "Reliable public transport from townships to economic nodes is non-negotiable. ARA supports targeted Harambee expansion with transparent subsidy reporting per route.",
  },
  {
    id: "s10",
    theme: "Land use",
    statement:
      "Vacant municipal land along the R21 and N12 corridors should be released to verified developers for mixed-income housing rather than left to be invaded.",
    araPosition: "agree",
    justification:
      "ARA favours auditable, transparent release of dormant municipal land for mixed-income housing — closing the door on land invasions and slow-tender paralysis.",
  },
  {
    id: "s11",
    theme: "Procurement",
    statement:
      "Every Ekurhuleni tender above R500 000 should be published in full — including bidders, scores and award reasons — on a public dashboard within 7 days of award.",
    araPosition: "agree",
    justification:
      "Open contracting is core ARA policy. A 7-day public-disclosure rule is the single most effective deterrent against tender capture in the metro.",
  },
  {
    id: "s12",
    theme: "Councillor accountability",
    statement:
      "Ward councillors who miss more than three consecutive ward committee meetings should automatically forfeit their seat.",
    araPosition: "agree",
    justification:
      "Ward councillors are the front line of service delivery. ARA backs a hard attendance rule with automatic recall to end ghost-councillor syndrome.",
  },
  {
    id: "s13",
    theme: "Youth",
    statement:
      "At least 30% of all Metro-funded learnerships and EPWP placements should be reserved for unemployed youth from Ekurhuleni townships.",
    araPosition: "agree",
    justification:
      "ARA Ekurhuleni supports a hard 30% reservation for local township youth in metro-funded learnerships, with quarterly published placement audits.",
  },
  {
    id: "s14",
    theme: "Migration & by-laws",
    statement:
      "Spaza shops and informal traders operating in Ekurhuleni must comply with the same health, tax and licensing rules as any other business — regardless of the owner's nationality.",
    araPosition: "agree",
    justification:
      "ARA insists on one rulebook for every trader in the metro — applied fairly and without xenophobia, but without exemptions.",
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