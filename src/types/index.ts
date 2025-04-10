export interface Score {
  Presentation: number;
  UI: number;
  Features: number;
  Impact: number;
  Technical: number;
  AI: number;
}

export interface Submission {
  judgeName: string;
  teamName: string;
  scores: Score;
  timestamp: number;
}

export interface JudgingFormData {
  teamName: string;
  Presentation: number;
  UI: number;
  Features: number;
  Impact: number;
  Technical: number;
  AI: number;
}

export const CRITERIA = {
  Presentation: "Presentation (max 10)",
  UI: "User-Friendly UI (max 20)",
  Features: "Features (max 20)",
  Impact: "Impact on the Community (max 20)",
  Technical: "Technical Design & Implementation (max 10)",
  AI: "AI Integration (max 20)",
} as const;

export const MAX_SCORES = {
  Presentation: 10,
  UI: 20,
  Features: 20,
  Impact: 20,
  Technical: 10,
  AI: 20,
} as const; 