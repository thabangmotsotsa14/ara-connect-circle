export type QuizQuestion = {
  id: string;
  prompt: string;
  aligned: string; // statement that aligns with ARA
  opposed: string; // opposing view
};

export const MANIFESTO_QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "Independent judiciary with enforcement powers should be entrenched.",
    aligned: "Strongly agree — courts must hold power accountable.",
    opposed: "Disagree — the executive should keep primary authority.",
  },
  {
    id: "q2",
    prompt: "Corruption should be prosecuted without political interference.",
    aligned: "Strongly agree — zero tolerance, no protected class.",
    opposed: "It depends on the political context.",
  },
  {
    id: "q3",
    prompt: "South Africa should invest internally to build jobs before relying on foreign aid.",
    aligned: "Strongly agree — internal investment first.",
    opposed: "Foreign capital should lead the recovery.",
  },
  {
    id: "q4",
    prompt: "Quality education, healthcare and housing are a basic right of every citizen.",
    aligned: "Strongly agree — government must guarantee these.",
    opposed: "These should be market-driven services.",
  },
  {
    id: "q5",
    prompt: "Shack dwellings must be eradicated through formal housing programmes.",
    aligned: "Strongly agree — dignified housing is non-negotiable.",
    opposed: "Informal housing is acceptable.",
  },
];

export function scoreQuiz(answers: Record<string, "aligned" | "opposed" | null>) {
  const total = MANIFESTO_QUIZ.length;
  const aligned = MANIFESTO_QUIZ.filter((q) => answers[q.id] === "aligned").length;
  return Math.round((aligned / total) * 100);
}