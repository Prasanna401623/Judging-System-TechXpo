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
  NoveltyDifferentiation: "Innovation and Creativity (max 20)",
  ImplementationQuality: "Security and Technical Implementation (max 20)",
  ProblemRelevance: "Relevance and Impact (max 20)",
  DemoTeamComm: "Presentation and Clarity (max 20)",
  TechnicalDepth: "Documentation and Research (max 20)",
} as const;

export const MAX_SCORES = {
  ProblemRelevance: 20,
  NoveltyDifferentiation: 20,
  TechnicalDepth: 20,
  ImplementationQuality: 20,
  DemoTeamComm: 20,
} as const;