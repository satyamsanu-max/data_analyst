/**
 * Numeric answer keys.
 *
 * Only questions with a single unambiguous number appear here. Conceptual
 * questions ("define a p-value", "explain bias-variance") deliberately have no
 * entry — they stay self-graded, because no answer key can exist for them.
 *
 * `tolerance` is RELATIVE (0.02 = within 2%). Guesstimates get wide tolerances
 * because they are graded the way an interviewer grades them: the structure and
 * the order of magnitude matter, the exact digits do not.
 */

export type AnswerSpec = {
  value: number;
  /** Relative tolerance, e.g. 0.02 = within 2%. Ignored when `factor` is set. */
  tolerance: number;
  /**
   * Multiplicative band for order-of-magnitude grading: correct when the answer
   * lies in [value/factor, value*factor].
   *
   * This exists because a relative tolerance cannot express "within 3x" — the
   * relative error of an under-estimate saturates at 1, so any tolerance >= 1
   * would accept an answer of zero.
   */
  factor?: number;
  unit?: string;
  /** Extra exact strings accepted verbatim, e.g. "1/6". */
  alternates?: string[];
  /** Shown after grading, to explain what the number represents. */
  note?: string;
};

const P = (value: number, tolerance = 0.02, extra: Partial<AnswerSpec> = {}): AnswerSpec => ({
  value,
  tolerance,
  ...extra,
});

/** Guesstimates: correct within 3x either way — an order-of-magnitude check. */
const G = (value: number, unit: string, note?: string): AnswerSpec => ({
  value,
  tolerance: 0, // unused; `factor` governs
  factor: 3,
  unit,
  note,
});

export const ANSWER_KEYS: Record<string, AnswerSpec> = {
  // ---------------------------------------------------------------- Probability
  "prob-001": P(1 / 6, 0.02, { alternates: ["1/6", "6/36"], note: "6 of 36 equally likely ordered pairs sum to seven." }),
  "prob-002": P(671 / 1296, 0.02, { alternates: ["671/1296"], note: "1 - (5/6)^4." }),
  "prob-003": P(0.7, 0.01, { note: "0.4 + 0.5 - 0.2 by inclusion-exclusion." }),
  "prob-005": P(0.507, 0.02, { note: "The 23-person birthday problem." }),
  "prob-008": P(5 / 14, 0.02, { alternates: ["5/14", "20/56"], note: "(5/8)(4/7)." }),
  "prob-009": P(0.8, 0.01, { alternates: ["4/5"], note: "Odds of 4 to 1 in favour." }),
  "prob-010": P(0.09, 0.12, { note: "Base rate dominates: most positives are false positives." }),
  "prob-011": P(1 / 3, 0.02, { alternates: ["1/3"], note: "Conditioning on at least one girl leaves three equally likely cases." }),
  "prob-012": P(2 / 3, 0.02, { alternates: ["2/3"], note: "Switching wins two times in three." }),
  "prob-013": P(2 / 3, 0.02, { alternates: ["2/3"], note: "Posterior for the double-headed coin after one head." }),
  "prob-014": P(8 / 9, 0.02, { alternates: ["8/9"], note: "Posterior after three heads." }),
  "prob-015": P(0.017, 0.03, { note: "Weighted defect rate across the three factories." }),
  "prob-016": P(0.769, 0.03, { note: "0.06 / 0.078." }),
  "prob-020": P(120, 0.001, { alternates: ["C(10,3)"], note: "Committee of 3 from 10 — order does not matter." }),
  "prob-021": P(50400, 0.001, { note: "10! / (3! 3! 2!)." }),
  "prob-022": P(0.4226, 0.02, { note: "Probability of exactly one pair in five cards." }),
  "prob-023": P(286, 0.001, { alternates: ["C(13,3)"], note: "Stars and bars." }),
  "prob-024": P(0.000495, 0.05, { note: "C(13,5) / C(52,5)." }),
  "prob-025": P(5040, 0.001, { alternates: ["7!"], note: "(8-1)! for a round table." }),
  "prob-026": P(0.3667, 0.03, { alternates: ["44/120"], note: "Derangements of 5; the ratio tends to 1/e." }),
  "prob-027": P(3.5, 0.01, { note: "Expected value of one fair die." }),
  "prob-028": P(1, 0.01, { note: "Expected fixed points is 1 for every n." }),
  "prob-034": P(30, 0.01, { note: "np = 100 x 0.3." }),
  "prob-035": P(5, 0.01, { note: "1/p for a 20% answer rate." }),
  "prob-036": P(0.1008, 0.03, { note: "Poisson pmf at k = 5, lambda = 3." }),
  "prob-037": P(0.025, 0.15, { note: "Two standard deviations above the mean, one tail." }),
  "prob-038": P(0.135, 0.03, { alternates: ["e^-2"], note: "Exponential survival at rate 4 for half an hour." }),
  "prob-039": P(0.3, 0.01, { note: "Uniform on [0,10]." }),
  "prob-043": P(14.7, 0.02, { note: "Coupon collector for six faces." }),
  "prob-044": P(10.5, 0.01, { unit: "expected winnings", note: "3 x 3.5 against a cost of 10." }),
  "prob-045": P(3.2, 0.01, { note: "0.6(2) + 0.4(5) by the tower rule." }),
  "prob-046": P(6, 0.01, { note: "Expected flips for two consecutive heads." }),
  "prob-047": P(4.472, 0.02, { alternates: ["161/36"], note: "Expected maximum of two dice." }),
  "prob-048": P(0.368, 0.05, { alternates: ["1/e"], note: "The secretary problem's success rate." }),
  "prob-049": P(0.0244, 0.1, { alternates: ["5/205", "1/41"], note: "Threshold from the 200:5 cost ratio." }),
  "prob-050": P(0.5, 0.01, { note: "Fair game: the starting fraction." }),
  "prob-054": P(0.25, 0.02, { alternates: ["1/4"], note: "Broken stick forming a triangle." }),
  "prob-055": P(43.3, 0.03, { note: "50(1 - (49/50)^100)." }),
  "prob-060": P(1875, 0.03, { note: "Capture-recapture estimate." }),

  // ---------------------------------------------------------------- Statistics
  "stat-001": P(40000, 0.01, { unit: "median salary", alternates: ["40k", "40000"], note: "Median resists the 500k outlier." }),
  "stat-004": P(1.5, 0.01, { note: "(85 - 70) / 10." }),
  "stat-021": P(30400, 0.15, { unit: "users per arm", note: "16 p(1-p) / delta^2 at 80% power." }),
  "stat-026": P(0.64, 0.05, { note: "1 - 0.95^20." }),

  // ---------------------------------------------------------------- ML
  "ml-039": P(0.727, 0.02, { unit: "F1", note: "Harmonic mean of precision 0.80 and recall 0.667." }),

  // ---------------------------------------------------------------- Guesstimates
  // Graded on order of magnitude, which is how these are graded in interviews.
  "gs-001": G(5e9, "USD per year", "~432B rupees of annual online grocery spend."),
  "gs-002": G(750000, "units per year", "15M two-wheelers x 5% EV penetration."),
  "gs-003": G(19e6, "USD per year", "315k payers x $60."),
  "gs-004": G(9e9, "rupees per year", "15M tests x 600 rupees."),
  "gs-005": G(25e9, "USD per year", "50M covered employees x $500."),
  "gs-006": G(3.2e9, "USD TAM", "27M developer seats x $120/year."),
  "gs-007": G(2.5e6, "cups per day", "6.3M cups consumed, 40% purchased."),
  "gs-008": G(1.6e6, "rides per day", "Demand side binds below supply capacity."),
  "gs-009": G(200000, "ATMs", "400M active users / 2000 per ATM."),
  "gs-010": G(72000, "pizzas", "60k pizza orders x 1.2 pizzas."),
  "gs-011": G(260e6, "units per year", "233M replacement + 30M new adopters."),
  "gs-012": G(3400, "departures per day", "Hub-weighted rather than a flat average."),
  "gs-013": G(2.4e6, "litres per day", "12M people x 200 ml."),
  "gs-014": G(8e6, "weddings per year", "20M reaching age x 0.8, divided by two people."),
  "gs-015": G(65000, "elevators", "50k residential + 30% commercial."),
  "gs-016": G(700e6, "USD per year", "292B rupees GMV x 20% take rate."),
  "gs-017": G(17.5e6, "rupees per year", "200 customers/day x 250 rupees x 350 days."),
  "gs-018": G(1.3e9, "USD per year", "2.6T impressions at $0.50 CPM."),
  "gs-019": G(19.6e9, "rupees per year", "Tickets plus 40% food and beverage."),
  "gs-020": G(10.08e6, "USD per month", "Roughly flat: elasticity near -1."),
  "gs-021": G(1e9, "USD per year", "600M aeronautical + 400M non-aeronautical."),
  "gs-022": G(30000, "riders", "21.4k needed at peak, grossed up for shifts."),
  "gs-023": G(200000, "square feet", "3M items stored at 20 per sq ft, plus 30%."),
  "gs-024": G(180, "agents", "152 by capacity, plus 20% shrinkage."),
  "gs-025": G(45, "servers", "30 with headroom, plus zone redundancy."),
  "gs-026": G(15, "counters", "267 customers/hour at peak, 20 per counter."),
};

export function answerFor(questionId: string): AnswerSpec | undefined {
  return ANSWER_KEYS[questionId];
}
