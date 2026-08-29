import type { Citation, DeepDiveItem, Difficulty, SourceType } from "./types";

/**
 * Authoring helpers.
 *
 * The point of these is that a content file stays readable as CONTENT — the
 * question, the hint, the answer — instead of drowning in repeated boilerplate
 * for `domain`, `isDeepDive` and citation objects.
 */

/** GeeksforGeeks citation. `page` is meaningless here; `title` names the article. */
export const gfg = (title: string, url: string, evidence?: string): Citation => ({
  kind: "GEEKSFORGEEKS",
  name: "GeeksforGeeks",
  title,
  url,
  evidence,
});

/** A GitHub repository that publishes an interview question list. */
export const github = (repo: string, url: string, evidence?: string): Citation => ({
  kind: "GITHUB",
  name: `GitHub — ${repo}`,
  title: repo,
  url,
  evidence,
});

/** One of the three casebooks. */
export const casebook = (name: string, page: number, evidence?: string): Citation => ({
  kind: "CASEBOOK",
  name,
  page,
  evidence,
});

/** Our own writing, with the reason it exists. */
export const adapted = (why: string): Citation => ({
  kind: "ADAPTED",
  name: "Written for this app",
  evidence: why,
});

/** Widely repeated across preparation resources, no single interview behind it. */
export const common = (why: string): Citation => ({
  kind: "COMMON_INTERVIEW",
  name: "Recurring across interview preparation resources",
  evidence: why,
});

export const CASEBOOK_KTC = "KTC 2025 Business Casebook — Consulting & Analytics Club, IIT Guwahati";
export const CASEBOOK_FINAL = "Consulting Casebook (1st ed., 2023) — Consulting & Analytics Club, IIT Guwahati";
export const CASEBOOK_IITK = "Product Management Casebook 2024-25 — Product Club, IIT Kanpur";

/** Known article URLs, so a citation is never a bare unlinked claim. */
export const URLS = {
  gfgExcel: "https://www.geeksforgeeks.org/excel/excel-interview-questions-and-answers/",
  gfgExcelDA: "https://www.geeksforgeeks.org/excel/top-excel-interview-questions-for-data-analysis/",
  gfgPowerBI: "https://www.geeksforgeeks.org/power-bi/power-bi-interview-questions-and-answers/",
  gfgTableau: "https://www.geeksforgeeks.org/tableau/tableau-interview-questions-and-answers/",
  ghDataAnalyst: "https://github.com/mandipdevnath/Data-Analyst-Interview-Questions",
  ghAwesomePowerBI: "https://github.com/NajiElKotob/Awesome-Power-BI",
  ghBIResourceHub: "https://github.com/virajbhutada/power-BI-resources",
} as const;

type QuestionInput = {
  id: string;
  category: string;
  title: string;
  difficulty?: Difficulty;
  q: string;
  hint: string;
  answer: string;
  detail: string;
  code?: { lang: string; label?: string; code: string }[];
  mistakes?: string[];
  followUps?: string[];
  tags?: string[];
  related?: string[];
  sourceType?: SourceType;
  confidence?: "high" | "medium" | "low";
  company?: string;
  role?: string;
  year?: number;
  sources: Citation[];
};

type ConceptInput = {
  id: string;
  category: string;
  title: string;
  difficulty?: Difficulty;
  /** What it is / how it works / when to use it. */
  body: string;
  example?: string;
  code?: { lang: string; label?: string; code: string }[];
  /** Why an interviewer cares. Appended to the body under its own heading. */
  relevance?: string;
  mistakes?: string[];
  related?: string[];
  tags?: string[];
  sources?: Citation[];
};

/** Build the question factory for one section. */
export function questionsFor(
  domain: DeepDiveItem["domain"],
  section: string,
  contentType: DeepDiveItem["contentType"] = "QUESTION",
) {
  return (input: QuestionInput): DeepDiveItem => ({
    id: input.id,
    domain,
    section,
    contentType,
    category: input.category,
    title: input.title,
    difficulty: input.difficulty ?? "Medium",
    question: input.q,
    hint: input.hint,
    interviewAnswer: input.answer,
    detailedExplanation: input.detail,
    code: input.code,
    commonMistakes: input.mistakes,
    followUps: input.followUps,
    related: input.related,
    tags: input.tags,
    company: input.company,
    role: input.role,
    year: input.year,
    sourceType: input.sourceType ?? "COMMON_INTERVIEW_QUESTION",
    confidence: input.confidence ?? "medium",
    sources: input.sources,
  });
}

/** Build the concept factory for one section. */
export function conceptsFor(domain: DeepDiveItem["domain"], section: string) {
  return (input: ConceptInput): DeepDiveItem => ({
    id: input.id,
    domain,
    section,
    contentType: "CONCEPT",
    category: input.category,
    title: input.title,
    difficulty: input.difficulty ?? "Medium",
    explanation: input.relevance
      ? `${input.body}\n\n**Why interviewers ask about it**\n${input.relevance}`
      : input.body,
    example: input.example,
    code: input.code,
    commonMistakes: input.mistakes,
    related: input.related,
    tags: input.tags,
    sourceType: "ADAPTED_PRACTICE",
    confidence: "high",
    sources: input.sources ?? [adapted("Original teaching note written for this section.")],
  });
}
