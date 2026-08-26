/**
 * Numeric answer keys.
 *
 * Keyed by question TITLE, not by id.
 *
 * The first version of this file was keyed by id, and 39 of 70 keys ended up on
 * the wrong question — ids are assigned by array position, and hand-counting
 * them drifted as rows were added. Titles are stable and self-describing, so a
 * mistake is visible on the line itself, and an unknown title fails the seed
 * loudly instead of silently mis-grading. `npm test` additionally asserts that
 * every expected value actually appears in that question's own solution.
 *
 * `ask` states exactly which quantity to enter. Without it a question like
 * "Should you switch?" gives no clue that the grader wants 2/3.
 *
 * Only questions with ONE unambiguous number appear here. Conceptual questions
 * stay self-graded, because no answer key can exist for them.
 */

export type AnswerSpec = {
  value: number;
  /** Relative tolerance, e.g. 0.02 = within 2%. Ignored when `factor` is set. */
  tolerance: number;
  /**
   * Multiplicative band for order-of-magnitude grading: correct when the answer
   * lies in [value/factor, value*factor].
   *
   * A relative tolerance cannot express "within 3x" — the relative error of an
   * under-estimate saturates at 1, so any tolerance >= 1 would accept zero.
   */
  factor?: number;
  /** The exact quantity being asked for. Shown above the input. */
  ask: string;
  unit?: string;
  /** Extra exact strings accepted verbatim, e.g. "1/6". */
  alternates?: string[];
  /** Shown after grading, to explain what the number represents. */
  note?: string;
};

const P = (
  value: number,
  ask: string,
  tolerance = 0.02,
  extra: Partial<AnswerSpec> = {},
): AnswerSpec => ({ value, ask, tolerance, ...extra });

/** Guesstimates: correct within 3x either way — an order-of-magnitude check. */
const G = (value: number, ask: string, unit: string, note?: string): AnswerSpec => ({
  value,
  ask,
  tolerance: 0, // unused; `factor` governs
  factor: 3,
  unit,
  note,
});

export const ANSWER_KEYS_BY_TITLE: Record<string, AnswerSpec> = {
  // ---------------------------------------------------------------- Probability
  "Two dice sum to seven": P(1 / 6, "Probability the total is seven", 0.02, {
    alternates: ["1/6", "6/36"],
    note: "6 of the 36 equally likely ordered pairs sum to seven.",
  }),
  "At least one six in four rolls": P(671 / 1296, "Probability of at least one six", 0.02, {
    alternates: ["671/1296"],
    note: "1 - (5/6)^4.",
  }),
  "Union of two events": P(0.7, "P(A or B)", 0.01, { note: "0.4 + 0.5 - 0.2 by inclusion-exclusion." }),
  "Birthday problem": P(0.507, "Probability at least two share a birthday", 0.02),
  "Drawing without replacement": P(5 / 14, "Probability both balls are red", 0.02, {
    alternates: ["5/14", "20/56"],
    note: "(5/8)(4/7).",
  }),
  "Odds versus probability": P(0.8, "The probability (not the log-odds)", 0.01, {
    alternates: ["4/5"],
    note: "Odds of 4 to 1 in favour means 4 wins in every 5.",
  }),
  "Medical test false positives": P(0.09, "Probability they actually have the disease", 0.12, {
    note: "The base rate dominates: most positives are false positives.",
  }),
  "Two children problem": P(1 / 3, "Probability both are girls, given at least one is", 0.02, {
    alternates: ["1/3"],
  }),
  "Monty Hall": P(2 / 3, "Probability of winning if you switch", 0.02, {
    alternates: ["2/3"],
    note: "Switching wins two times in three; staying wins one in three.",
  }),
  "Bayes with a biased coin": P(2 / 3, "Posterior probability it is the double-headed coin", 0.02, {
    alternates: ["2/3"],
  }),
  "Sequential Bayes updating": P(8 / 9, "Posterior after three heads", 0.02, { alternates: ["8/9"] }),
  "Law of total probability": P(0.017, "Overall share of units that are defective", 0.03),
  "Spam filter posterior": P(0.769, "Probability the email is spam", 0.03, { note: "0.06 / 0.078." }),
  "Three prisoners problem": P(1 / 3, "A's probability of being pardoned, after the guard names B", 0.02, {
    alternates: ["1/3"],
    note: "A is unchanged at 1/3; C rises to 2/3.",
  }),
  "Permutations versus combinations": P(120, "Number of committees (order does not matter)", 0.001, {
    alternates: ["C(10,3)"],
  }),
  "Arrangements with repeated letters": P(50400, "Number of distinct arrangements", 0.001),
  "Poker hand probability": P(0.4226, "Probability of exactly one pair", 0.02),
  "Stars and bars": P(286, "Number of distributions", 0.001, { alternates: ["C(13,3)"] }),
  "Probability via counting": P(0.000495, "Probability all five cards are hearts", 0.05),
  "Circular arrangements": P(5040, "Number of seatings", 0.001, { alternates: ["7!"] }),
  Derangements: P(0.3667, "Probability nobody gets their own hat", 0.03, {
    alternates: ["44/120"],
    note: "The ratio tends to 1/e as n grows.",
  }),
  "Expected value of a die": P(3.5, "The expected value (not the variance)", 0.01),
  "Linearity of expectation": P(1, "Expected number of fixed points", 0.01, {
    note: "It is 1 for every n.",
  }),
  Transformations: P(25, "The mean of 3X - 5", 0.01, { note: "Variance would be 36." }),
  "Sum of independent random variables": P(5, "The rate of the resulting Poisson", 0.01),
  "Binomial expected value and variance": P(30, "The mean, for n = 100 and p = 0.3", 0.01, {
    note: "Variance would be 21.",
  }),
  "Geometric distribution": P(5, "Expected number of calls to the first answer", 0.01),
  "Poisson probability": P(0.1008, "P(exactly 5 tickets in one hour)", 0.03),
  "Normal distribution rules of thumb": P(0.025, "Share of heights exceeding 190", 0.15),
  "Exponential waiting times": P(0.135, "Probability of waiting more than 30 minutes", 0.03, {
    alternates: ["e^-2"],
  }),
  "Uniform distribution": P(0.3, "P(X > 7)", 0.01, { note: "Mean 5, variance 8.33." }),
  "Expected rolls to see all six faces": P(14.7, "Expected number of rolls", 0.02),
  "Expected value of a game": P(10.5, "Expected winnings per play (before the cost)", 0.01, {
    note: "Against a cost of 10, the edge is 0.5 per play.",
  }),
  "Conditional expectation and the tower rule": P(3.2, "Overall mean number of defects", 0.01),
  "Expected number of flips for two heads in a row": P(6, "Expected number of flips", 0.01),
  "Expected maximum of two dice": P(4.472, "Expected maximum", 0.02, { alternates: ["161/36"] }),
  "Optimal stopping intuition": P(0.368, "Probability of hiring the best candidate", 0.05, {
    alternates: ["1/e"],
    note: "Reject the first n/e, then take the next record-setter.",
  }),
  "Expected loss from a threshold": P(0.0244, "Threshold probability above which you block", 0.1, {
    alternates: ["5/205", "1/41"],
  }),
  "Gambler's ruin": P(0.5, "Probability of reaching 10 before going broke", 0.01),
  "Simulating a die from a coin": P(4, "Expected number of coin flips per die roll", 0.02),
  "Broken stick problem": P(0.25, "Probability the pieces form a triangle", 0.02, { alternates: ["1/4"] }),
  "Expected number of distinct values": P(43.3, "Expected number of distinct items seen", 0.03),
  "Estimating population size": P(1875, "Estimated population", 0.03),

  // ---------------------------------------------------------------- Statistics
  "Mean, median, mode and skew": P(40000, "The median salary", 0.01, {
    alternates: ["40k", "40000"],
    note: "The mean of 130k describes nobody.",
  }),
  "Z-scores and standardisation": P(1.5, "The z-score", 0.01),
  "Sample size calculation": P(30400, "Users required per arm", 0.15, { unit: "users per arm" }),
  "Multiple comparisons": P(0.64, "Probability of at least one false positive", 0.05, {
    note: "1 - 0.95^20.",
  }),
  "Two-proportion z-test by hand": P(1.89, "The z statistic", 0.05, {
    note: "p is about 0.059, so it falls just short at alpha 0.05.",
  }),
  "Confidence interval for a proportion": P(0.06, "The point estimate of the conversion rate", 0.02, {
    note: "The 95% interval is [0.0496, 0.0704].",
  }),

  // ---------------------------------------------------------------- ML
  "Confusion matrix from scratch": P(0.727, "The F1 score", 0.02, {
    unit: "F1",
    note: "Harmonic mean of precision 0.80 and recall 0.667.",
  }),

  // ---------------------------------------------------------------- Guesstimates
  "Size the online grocery market in India": G(5e9, "Annual market size in USD", "USD per year", "~432B rupees of annual online grocery spend."),
  "Size the market for electric two-wheelers": G(750000, "Annual unit sales", "units per year", "15M two-wheelers x 5% EV penetration."),
  "Market size for a paid meditation app": G(19e6, "Annual revenue in USD", "USD per year", "315k payers x $60."),
  "Size the diagnostic lab market in a city": G(9e9, "Annual revenue in rupees", "rupees per year", "15M tests x 600 rupees."),
  "Size the market for corporate training": G(25e9, "Annual spend in USD", "USD per year", "50M covered employees x $500."),
  "Total addressable market for a B2B SaaS tool": G(3.2e9, "The TAM in USD", "USD TAM", "27M developer seats x $120/year."),
  "Cups of coffee sold in a large city per day": G(2.5e6, "Cups SOLD per day", "cups per day", "6.3M cups consumed, of which 40% are purchased."),
  "Daily ride volume for a ride-hailing app in a city": G(1.6e6, "Rides per day", "rides per day", "Demand binds below supply capacity."),
  "Number of ATMs in a country": G(200000, "Number of ATMs", "ATMs", "400M active users / 2000 per ATM."),
  "Pizzas delivered in a city on a Friday night": G(72000, "Pizzas delivered", "pizzas", "60k pizza orders x 1.2 pizzas."),
  "Smartphones sold in a country per year": G(260e6, "Units sold per year", "units per year", "233M replacement + 30M new adopters."),
  "Number of flights departing a country daily": G(3400, "Departures per day", "departures per day", "Hub-weighted rather than a flat average."),
  "Litres of milk consumed in a city daily": G(2.4e6, "Litres per day", "litres per day", "12M people x 200 ml."),
  "Number of weddings in a country per year": G(8e6, "Weddings per year", "weddings per year", "20M reaching age x 0.8, divided by two people per wedding."),
  "Elevators in a city": G(65000, "Number of elevators", "elevators", "50k residential + 30% commercial."),
  "Annual revenue of a food delivery company": G(700e6, "Annual REVENUE (not GMV) in USD", "USD per year", "292B rupees GMV x 20% take rate."),
  "Revenue of a single coffee shop": G(17.5e6, "Annual revenue in rupees", "rupees per year", "200 customers/day x 250 rupees x 350 days."),
  "Advertising revenue of a social media platform": G(1.3e9, "Annual ad revenue in USD", "USD per year", "2.6T impressions at $0.50 CPM."),
  "Revenue of a movie theatre chain": G(19.6e9, "Annual revenue in rupees", "rupees per year", "Tickets plus 40% food and beverage."),
  "Revenue impact of a pricing change": G(10.08e6, "Monthly revenue after the change, in USD", "USD per month", "Roughly flat: elasticity near -1."),
  "Annual revenue of an airport": G(1e9, "Annual revenue in USD", "USD per year", "600M aeronautical + 400M non-aeronautical."),
  "Delivery riders needed for a city": G(30000, "Registered riders needed", "riders", "21.4k needed at peak, grossed up for shifts."),
  "Warehouse space required": G(200000, "Square feet required", "square feet", "3M items at 20 per sq ft, plus 30%."),
  "Customer support headcount": G(180, "Agents required", "agents", "152 by capacity, plus 20% shrinkage."),
  "Servers needed for a web service": G(45, "Servers required", "servers", "30 with headroom, plus zone redundancy."),
  "Checkout counters in a supermarket": G(15, "Counters required", "counters", "267 customers/hour at peak at 20 per counter gives 13.3, so about 15 counters to hold the queue target."),
};

/**
 * Resolve title-keyed answers to question ids.
 *
 * Throws on an unknown title rather than skipping it, so a renamed question
 * breaks the seed instead of silently losing its answer key.
 */
export function resolveAnswerKeys(
  questions: { id: string; title: string }[],
): { byId: Record<string, AnswerSpec>; unmatched: string[] } {
  const idsByTitle = new Map<string, string[]>();
  for (const q of questions) {
    const list = idsByTitle.get(q.title) ?? [];
    list.push(q.id);
    idsByTitle.set(q.title, list);
  }

  const byId: Record<string, AnswerSpec> = {};
  const unmatched: string[] = [];

  for (const [title, spec] of Object.entries(ANSWER_KEYS_BY_TITLE)) {
    const ids = idsByTitle.get(title);
    if (!ids || ids.length === 0) {
      unmatched.push(title);
      continue;
    }
    if (ids.length > 1) {
      unmatched.push(`${title} (ambiguous: ${ids.join(", ")})`);
      continue;
    }
    byId[ids[0]] = spec;
  }

  return { byId, unmatched };
}
