export interface Score {
  Innovation: number;
  TechnicalComplexity: number;
  Functionality: number;
  UXDesign: number;
  Impact: number;
  Presentation: number;
}

export interface Submission {
  judgeName: string;
  teamName: string;
  scores: Score;
  timestamp: number;
}

export interface JudgingFormData {
  teamName: string;
  Innovation: number;
  TechnicalComplexity: number;
  Functionality: number;
  UXDesign: number;
  Impact: number;
  Presentation: number;
}

export const CRITERIA = {
  Innovation: "Innovation (max 20)",
  TechnicalComplexity: "Technical Complexity (max 20)",
  Functionality: "Functionality (max 20)",
  UXDesign: "UX & Design (max 15)",
  Impact: "Impact (max 15)",
  Presentation: "Presentation (max 10)",
} as const;

export const MAX_SCORES = {
  Innovation: 20,
  TechnicalComplexity: 20,
  Functionality: 20,
  UXDesign: 15,
  Impact: 15,
  Presentation: 10,
} as const; 