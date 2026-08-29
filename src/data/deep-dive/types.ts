/**
 * Deep Dive content model.
 *
 * Deliberately separate from `src/data/types.ts`: that file defines the Data
 * Analyst bank, whose categories and caps feed the Daily Practice scheduler.
 * Nothing here is ever loaded by `loadSchedulerQuestions()`.
 */

export const DOMAINS = ["DATA", "PRODUCT", "CONSULTING"] as const;
export type Domain = (typeof DOMAINS)[number];

export const CONTENT_TYPES = [
  "CONCEPT",
  "QUESTION",
  "CASE",
  "GUESSTIMATE",
  "INDUSTRY_PRIMER",
] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

export type Difficulty = "Easy" | "Medium" | "Hard";

/**
 * How strongly we can claim a question was really asked in an interview.
 *
 * The ordering matters: only the first three may be presented as a real
 * interview, and each of those needs a source that actually says so.
 * `ADAPTED_PRACTICE` is our own writing and must never be dressed up as more.
 */
export const SOURCE_TYPES = [
  "REAL_INTERVIEW",
  "INTERVIEW_EXPERIENCE",
  "CASEBOOK_INTERVIEW_CASE",
  "COMMON_INTERVIEW_QUESTION",
  "ADAPTED_PRACTICE",
] as const;
export type SourceType = (typeof SOURCE_TYPES)[number];

/** Source types that are allowed to carry a company or role attribution. */
export const ATTRIBUTABLE: readonly SourceType[] = [
  "REAL_INTERVIEW",
  "INTERVIEW_EXPERIENCE",
  "CASEBOOK_INTERVIEW_CASE",
];

export const SOURCE_TYPE_LABEL: Record<SourceType, string> = {
  REAL_INTERVIEW: "Real interview",
  INTERVIEW_EXPERIENCE: "Interview experience",
  CASEBOOK_INTERVIEW_CASE: "Casebook interview case",
  COMMON_INTERVIEW_QUESTION: "Common interview question",
  ADAPTED_PRACTICE: "Adapted practice",
};

export const SOURCE_TYPE_HELP: Record<SourceType, string> = {
  REAL_INTERVIEW:
    "A reliable public source reports this exact question being asked in an interview.",
  INTERVIEW_EXPERIENCE:
    "A candidate reported being tested on this, but the exact wording or circumstances are incomplete.",
  CASEBOOK_INTERVIEW_CASE:
    "Taken from a published casebook that identifies it as an interview case.",
  COMMON_INTERVIEW_QUESTION:
    "Listed repeatedly across interview preparation resources, with no evidence of one specific interview.",
  ADAPTED_PRACTICE:
    "Written by us from recurring concepts. Not reported from any specific interview.",
};

export const CITATION_KINDS = [
  "CASEBOOK",
  "GITHUB",
  "GEEKSFORGEEKS",
  "GLASSDOOR",
  "INTERVIEW_REPORT",
  "PUBLIC_ASSESSMENT",
  "ADAPTED",
  "COMMON_INTERVIEW",
] as const;
export type CitationKind = (typeof CITATION_KINDS)[number];

export type Citation = {
  kind: CitationKind;
  /** The publication or repository, e.g. "GeeksforGeeks". */
  name: string;
  title?: string;
  url?: string;
  /** Page number, for casebook citations. */
  page?: number;
  /** One line on why this source supports the claim. */
  evidence?: string;
};

export type CodeBlock = {
  /** Syntax label shown on the block, e.g. "Excel", "DAX", "Tableau", "SQL". */
  lang: string;
  label?: string;
  code: string;
};

export type DeepDiveItem = {
  id: string;
  domain: Domain;
  section: string;
  contentType: ContentType;
  category: string;
  title: string;
  difficulty?: Difficulty;

  question?: string;
  hint?: string;
  interviewAnswer?: string;
  detailedExplanation?: string;

  explanation?: string;
  example?: string;
  code?: CodeBlock[];
  framework?: string;
  commonMistakes?: string[];
  followUps?: string[];
  /** ids of related items. Concepts point at questions and vice versa. */
  related?: string[];
  tags?: string[];

  /** Only ever set when a source names it. Never inferred. */
  company?: string;
  role?: string;
  year?: number;

  sourceType: SourceType;
  confidence?: "high" | "medium" | "low";
  sources: Citation[];

  /** Existing `Question.id`, when this surfaces bank content rather than copying it. */
  existingQuestionId?: string;
};

/** Sections, in display order, with the labels the UI uses. */
export type SectionDef = {
  slug: string;
  name: string;
  domain: Domain;
  blurb: string;
  /** Filter chips offered on the questions list for this section. */
  filters: string[];
};

export const SECTIONS: SectionDef[] = [
  {
    slug: "excel",
    name: "Excel",
    domain: "DATA",
    blurb: "Formulas, lookups, pivots, Power Query and the analysis questions built on them.",
    filters: [
      "Fundamentals",
      "Formula",
      "Lookup",
      "Text",
      "Dates",
      "Data Cleaning",
      "Pivot",
      "Charts",
      "Power Query",
      "Advanced",
      "Business Analysis",
      "Scenario",
    ],
  },
  {
    slug: "power-bi",
    name: "Power BI",
    domain: "DATA",
    blurb: "DAX, evaluation context, modelling, RLS, performance and the Service.",
    filters: [
      "Fundamentals",
      "Power Query",
      "Modeling",
      "DAX",
      "DAX Context",
      "Time Intelligence",
      "Visualization",
      "Performance",
      "RLS",
      "Service",
      "Scenario",
    ],
  },
  {
    slug: "tableau",
    name: "Tableau",
    domain: "DATA",
    blurb: "Dimensions and measures, filter order, LOD expressions, dashboards and performance.",
    filters: [
      "Fundamentals",
      "Data",
      "Filters",
      "Calculations",
      "LOD",
      "Parameters",
      "Sets",
      "Dates",
      "Visualization",
      "Performance",
      "Server",
      "Scenario",
    ],
  },
  {
    slug: "root-cause",
    name: "Root Cause Analysis",
    domain: "DATA",
    blurb: "Decompose a metric, segment it, generate hypotheses, and prove which one is real.",
    filters: [
      "Method",
      "Revenue",
      "Orders",
      "Retention",
      "Conversion",
      "Engagement",
      "Churn",
      "Growth",
      "Traffic",
      "Marketplace",
      "Operations",
      "Monetization",
    ],
  },
  {
    slug: "product-sense",
    name: "Product Sense",
    domain: "PRODUCT",
    blurb: "Users, pain points, prioritisation and the trade-offs behind a product decision.",
    filters: ["Fundamentals", "Strategy", "User Research", "Prioritization", "Critique", "Trade-offs"],
  },
  {
    slug: "product-design",
    name: "Product Design & Improvement",
    domain: "PRODUCT",
    blurb: "CIRCLES-style design and improvement cases from published PM interviews.",
    filters: ["Method", "Design", "Improvement", "Accessibility", "Marketplace", "Consumer"],
  },
  {
    slug: "product-metrics",
    name: "Product Metrics",
    domain: "PRODUCT",
    blurb: "North Star, input and guardrail metrics, funnels, retention and dashboards.",
    filters: ["Method", "North Star", "Acquisition", "Engagement", "Retention", "Monetization", "Dashboards"],
  },
  {
    slug: "product-rca",
    name: "Product Root Cause",
    domain: "PRODUCT",
    blurb: "Metric-drop cases as they are actually run in PM interviews.",
    filters: ["Method", "Revenue", "Orders", "Engagement", "Retention", "Conversion"],
  },
  {
    slug: "product-gtm",
    name: "Go-To-Market",
    domain: "PRODUCT",
    blurb: "Launch strategy, segmentation, positioning, channels and success criteria.",
    filters: ["Method", "Launch", "Positioning", "Channels", "Pricing"],
  },
  {
    slug: "product-guesstimates",
    name: "Product Guesstimates",
    domain: "PRODUCT",
    blurb: "Sizing and estimation questions asked in product interviews.",
    filters: ["Market Sizing", "Volume", "Revenue", "Infrastructure"],
  },
  {
    slug: "consulting-concepts",
    name: "Case Concepts & Frameworks",
    domain: "CONSULTING",
    blurb: "How case interviews are run, and the structures that hold up under pressure.",
    filters: [
      "Interview Format",
      "Structuring",
      "Profitability",
      "Market Entry",
      "Pricing",
      "Growth",
      "M&A",
      "Market Sizing",
      "Formulas",
    ],
  },
  {
    slug: "consulting-cases",
    name: "Real Interview Cases",
    domain: "CONSULTING",
    blurb: "Case transcripts contributed by candidates, restructured for practice.",
    filters: [
      "Profitability",
      "Market Entry",
      "Pricing",
      "Growth",
      "M&A",
      "Unconventional",
      "Miscellaneous",
    ],
  },
  {
    slug: "consulting-guesstimates",
    name: "Guesstimates",
    domain: "CONSULTING",
    blurb: "Market sizing and estimation, with the assumptions made explicit.",
    filters: ["Market Sizing", "Volume", "Revenue", "Infrastructure", "Consumption"],
  },
  {
    slug: "industry-primers",
    name: "Industry Primers",
    domain: "CONSULTING",
    blurb: "Value chains, profit drivers and vocabulary, one industry at a time.",
    filters: ["Consumer", "Industrial", "Financial", "Technology", "Healthcare", "Infrastructure", "Energy"],
  },
];

export const SECTION_BY_SLUG: Record<string, SectionDef> = Object.fromEntries(
  SECTIONS.map((s) => [s.slug, s]),
);

export const DOMAIN_LABEL: Record<Domain, string> = {
  DATA: "Data",
  PRODUCT: "Product",
  CONSULTING: "Consulting",
};

export const DOMAIN_BLURB: Record<Domain, string> = {
  DATA: "The tools you are tested on hands-on: Excel, Power BI, Tableau, and the analysis that ties them together.",
  PRODUCT: "Design, metrics, root cause and go-to-market, drawn from published PM interview cases.",
  CONSULTING: "Case frameworks, real interview transcripts, guesstimates and industry knowledge.",
};
