import { EXCEL_CONCEPTS } from "./excel/concepts";
import { EXCEL_QUESTIONS } from "./excel/questions";
import { EXCEL_QUESTIONS_FORMULAS } from "./excel/questions-formulas";
import { EXCEL_QUESTIONS_ANALYSIS } from "./excel/questions-analysis";
import { POWERBI_CONCEPTS } from "./power-bi/concepts";
import { POWERBI_QUESTIONS } from "./power-bi/questions";
import { POWERBI_QUESTIONS_DAX } from "./power-bi/questions-dax";
import { TABLEAU_CONCEPTS } from "./tableau/concepts";
import { TABLEAU_QUESTIONS } from "./tableau/questions";
import { TABLEAU_QUESTIONS_PRACTICAL } from "./tableau/questions-practical";
import { RCA_CONCEPTS } from "./root-cause/concepts";
import { RCA_QUESTIONS } from "./root-cause/questions";
import { PRODUCT_CONCEPTS } from "./product/concepts";
import { PRODUCT_CASES } from "./product/cases";
import { PRODUCT_QUESTIONS } from "./product/questions";
import { PRODUCT_GUESSTIMATES } from "./product/guesstimates";
import { CONSULTING_CONCEPTS } from "./consulting/concepts";
import { CONSULTING_CASES } from "./consulting/cases";
import { CONSULTING_QUESTIONS } from "./consulting/questions";
import { CONSULTING_GUESSTIMATES } from "./consulting/guesstimates";
import { INDUSTRY_PRIMERS } from "./consulting/industries";
import { validateDeepDive, contentReport } from "./validate";
import type { DeepDiveItem } from "./types";

export const ALL_DEEP_DIVE: DeepDiveItem[] = [
  ...EXCEL_CONCEPTS,
  ...EXCEL_QUESTIONS,
  ...EXCEL_QUESTIONS_FORMULAS,
  ...EXCEL_QUESTIONS_ANALYSIS,
  ...POWERBI_CONCEPTS,
  ...POWERBI_QUESTIONS,
  ...POWERBI_QUESTIONS_DAX,
  ...TABLEAU_CONCEPTS,
  ...TABLEAU_QUESTIONS,
  ...TABLEAU_QUESTIONS_PRACTICAL,
  ...RCA_CONCEPTS,
  ...RCA_QUESTIONS,
  ...PRODUCT_CONCEPTS,
  ...PRODUCT_CASES,
  ...PRODUCT_QUESTIONS,
  ...PRODUCT_GUESSTIMATES,
  ...CONSULTING_CONCEPTS,
  ...CONSULTING_CASES,
  ...CONSULTING_QUESTIONS,
  ...CONSULTING_GUESSTIMATES,
  ...INDUSTRY_PRIMERS,
];

export { validateDeepDive, contentReport };
export * from "./types";
