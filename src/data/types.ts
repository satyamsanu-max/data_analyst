export const CATEGORIES = [
  "DSA",
  "SQL",
  "Probability",
  "Statistics",
  "ML",
  "Python",
  "Guesstimate",
] as const;
export type Category = (typeof CATEGORIES)[number];

export type Difficulty = "Easy" | "Medium" | "Hard";

/** Hard caps on how large each bank is allowed to grow. Enforced by the seeder. */
export const CATEGORY_CAPS: Record<Category, number> = {
  DSA: 300,
  SQL: 100,
  Probability: 100,
  Statistics: 100,
  ML: 120, // ML + Python share the "ML/Python" daily slot
  Python: 120,
  Guesstimate: 50,
};

/** Displayed as a single slot on the dashboard. */
export const SLOT_GROUPS: Record<string, Category[]> = {
  DSA: ["DSA"],
  SQL: ["SQL"],
  "Probability/Statistics": ["Probability", "Statistics"],
  "ML/Python": ["ML", "Python"],
  Guesstimate: ["Guesstimate"],
};

export type SeedTopic = {
  slug: string;
  name: string;
  category: Category;
  /** Interview importance of the topic itself, 0-100. */
  weight: number;
};

export type SeedCompany = {
  slug: string;
  name: string;
  bucket: "tech" | "product" | "consulting" | "finance" | "other";
};

export type SeedSource = {
  name: string;
  homepage?: string;
  kind: "roadmap" | "platform" | "book" | "article" | "company-report";
  notes?: string;
};

export type SeedQuestion = {
  id: string;
  category: Category;
  /** Topic slug — must exist in topics.ts */
  topic: string;
  pattern?: string;
  title: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  /** Source name — must exist in sources.ts */
  source?: string;
  sourceUrl?: string;
  sourceNote?: string;
  /** Company slugs — must exist in companies.ts */
  companyTags?: string[];
  /** 0-100: how often this shows up in real interviews. */
  frequencyScore: number;
  /** 0-100: how much reusable leverage the underlying pattern gives. */
  patternValue: number;
  /** 0-100: how much distinct concept surface it covers. */
  conceptCoverage?: number;
  concepts?: string[];
  prerequisites?: string[];
  skillsTested?: string[];
  /** Short ORIGINAL restatement. Never a verbatim copy of a copyrighted prompt. */
  prompt?: string;
  hint?: string;
  solution?: string;
  explanation?: string;
  framework?: string;
  assumptions?: string;
  industry?: string;
  year?: number;
};
