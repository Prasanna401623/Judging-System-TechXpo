export interface Score {
  ProblemRelevance: number;
  NoveltyDifferentiation: number;
  TechnicalDepth: number;
  ImplementationQuality: number;
  DemoTeamComm: number;
}

export interface Submission {
  judgeCode: string;
  judgeName: string;
  teamName: string;
  scores: Score;
  timestamp: number;
}

export interface JudgingFormData {
  teamName: string;
  ProblemRelevance: number;
  NoveltyDifferentiation: number;
  TechnicalDepth: number;
  ImplementationQuality: number;
  DemoTeamComm: number;
}

export const CRITERIA = {
  ProblemRelevance: "Problem Relevance & User Value (max 20)",
  NoveltyDifferentiation: "Novelty & Differentiation (max 20)",
  TechnicalDepth: "Technical Difficulty & Depth (max 20)",
  ImplementationQuality: "Implementation Quality, Security & Responsible AI (max 20)",
  DemoTeamComm: "Demo & Team Communication (max 20)",
} as const;

export const MAX_SCORES = {
  ProblemRelevance: 20,
  NoveltyDifferentiation: 20,
  TechnicalDepth: 20,
  ImplementationQuality: 20,
  DemoTeamComm: 20,
} as const;