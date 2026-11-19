// Protothon 2026 Official Judging Rubric
// Three categories, each scored 1 to 5, for 15 points total.

export interface Score {
  ProblemSolving: number;
  CreativityWowFactor: number;
  PresentationSkills: number;
}

export type CriterionKey = keyof Score;

export interface Submission {
  judgeCode: string;
  judgeName: string;
  teamName: string;
  scores: Score;
  timestamp: number;
}

export interface JudgingFormData extends Score {
  teamName: string;
}

export interface RubricLevel {
  score: number;
  rating: string;
  title: string;
  explanation: string;
}

export interface Criterion {
  key: CriterionKey;
  label: string;
  max: number;
  levels: RubricLevel[];
}

export const MIN_SCORE = 1;

export const PRESENTATION_TIME = {
  presentationMinutes: 5,
  questionMinutes: 3,
} as const;

export const RUBRIC: Criterion[] = [
  {
    key: 'ProblemSolving',
    label: 'Problem Solving',
    max: 5,
    levels: [
      {
        score: 5,
        rating: 'Excellent',
        title: 'Clear & Insightful',
        explanation:
          'The presenter clearly defined a real, specific problem in their hometown and explained who it affects and why it matters. The solution directly addresses the problem and is realistic and well thought out.',
      },
      {
        score: 4,
        rating: 'Satisfactory',
        title: 'Clear & Logical',
        explanation:
          'A clear problem is defined, and the solution is logical and would reasonably help. The presenter shows a solid understanding of the problem.',
      },
      {
        score: 3,
        rating: 'Fair',
        title: 'Broad, but Workable',
        explanation:
          'The problem is broadly defined, and the solution only partly addresses it. Understanding of the problem or the people it affects may be surface-level.',
      },
      {
        score: 2,
        rating: 'Needs Improvement',
        title: 'Unclear Problem',
        explanation:
          "The problem is poorly defined or misunderstood. The proposed solution is impractical or doesn't clearly solve the stated problem.",
      },
      {
        score: 1,
        rating: 'Critical Flaw',
        title: 'No Problem Identified',
        explanation:
          'The presenter failed to define any clear problem, or the proposed solution is entirely irrelevant to the event theme.',
      },
    ],
  },
  {
    key: 'CreativityWowFactor',
    label: 'Creativity & Wow Factor',
    max: 5,
    levels: [
      {
        score: 5,
        rating: 'Excellent',
        title: 'Memorable & Original',
        explanation:
          'The idea is exceptionally original and unlike common solutions to the problem. It takes a fresh, unexpected angle and includes a standout feature or moment that makes the audience say "wow." The concept is memorable, shows bold creative thinking and leaves a lasting impression after the pitch ends.',
      },
      {
        score: 4,
        rating: 'Satisfactory',
        title: 'Creative & Engaging',
        explanation:
          'The idea is creative and clearly different from existing products or common approaches. It includes a unique twist, feature or perspective that grabs attention. While not groundbreaking, it shows thoughtful creative effort and keeps the audience engaged.',
      },
      {
        score: 3,
        rating: 'Fair',
        title: 'Expected',
        explanation:
          'The idea is reasonable but predictable, representing only a moderate modification of an existing product or idea. It may solve the problem, but it lacks a unique angle or a standout moment. Creative choices are safe and do not leave a strong impression.',
      },
      {
        score: 2,
        rating: 'Needs Improvement',
        title: 'Lacks Originality',
        explanation:
          'The idea closely copies an existing product or app without meaningful new insight or improvement. Little effort was made to make it stand out or to approach the problem in a new way. The pitch does not capture the audience\'s interest.',
      },
      {
        score: 1,
        rating: 'Critical Flaw',
        title: 'No Creative Effort',
        explanation:
          'The idea shows no original thinking or creative effort, or it is entirely irrelevant to the event theme. Nothing about the concept distinguishes it from a simple restatement of the problem.',
      },
    ],
  },
  {
    key: 'PresentationSkills',
    label: 'Presentation Skills',
    max: 5,
    levels: [
      {
        score: 5,
        rating: 'Excellent',
        title: 'Compelling & Concise',
        explanation:
          'The presentation is highly engaging, clear, and professional. The presenter uses excellent eye contact, confident body language, and manages the time perfectly (within 5 minutes), covering all required elements fluidly.',
      },
      {
        score: 4,
        rating: 'Satisfactory',
        title: 'Clear & Prepared',
        explanation:
          'The presentation is well-structured and covers all key information. Presenters maintain consistent eye contact, speak clearly, and manage the time effectively (close to 5 minutes).',
      },
      {
        score: 3,
        rating: 'Fair',
        title: 'Informative, needs Polish',
        explanation:
          'The presentation is informative but may be slightly rushed or too slow (up to 1 minute over/under time). Presenters have some difficulty maintaining eye contact or rely too heavily on notes.',
      },
      {
        score: 2,
        rating: 'Needs Improvement',
        title: 'Unclear or Too Long/Short',
        explanation:
          'The presentation is confusing, incomplete, or significantly misses the time mark (more than 2 minutes over/under). Presenters struggle with confidence, eye contact, and clear articulation.',
      },
      {
        score: 1,
        rating: 'Critical Flaw',
        title: 'Did Not Present/Coherent',
        explanation:
          'The presenter did not present, or the presentation failed to communicate any coherent idea, solution, or effort related to the challenge.',
      },
    ],
  },
];

export const CRITERIA_KEYS: CriterionKey[] = RUBRIC.map((c) => c.key);

export const CRITERIA = Object.fromEntries(
  RUBRIC.map((c) => [c.key, `${c.label} (max ${c.max})`])
) as Record<CriterionKey, string>;

export const MAX_SCORES = Object.fromEntries(
  RUBRIC.map((c) => [c.key, c.max])
) as Record<CriterionKey, number>;

export const MAX_TOTAL_SCORE = RUBRIC.reduce((sum, c) => sum + c.max, 0);

export function emptyScores(): Score {
  return { ProblemSolving: 0, CreativityWowFactor: 0, PresentationSkills: 0 };
}

// Reads one category score from a saved submission. Entries saved with the
// old TechXpo categories don't have these keys, so they count as 0 instead
// of breaking the totals with NaN.
export function getScore(scores: object | null | undefined, key: CriterionKey): number {
  const value = Number((scores as Record<string, unknown> | null | undefined)?.[key]);
  return Number.isFinite(value) ? value : 0;
}

export function totalScore(scores: object | null | undefined): number {
  return CRITERIA_KEYS.reduce((sum, key) => sum + getScore(scores, key), 0);
}
