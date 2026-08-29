import { casebook, adapted, questionsFor, CASEBOOK_IITK } from "../helpers";
import type { DeepDiveItem } from "../types";

const g = questionsFor("PRODUCT", "product-guesstimates", "GUESSTIMATE");

/**
 * Guesstimates from the IITK Product Club casebook, which states its four
 * guesstimates are derived from actual product management interviews.
 *
 * Numbers below follow the casebook's own assumption chains where it provides
 * them, so the arithmetic is reproducible. The commentary and critique are
 * original. The point of these is never the final number — it is whether the
 * structure and the assumptions are defensible.
 */

export const PRODUCT_GUESSTIMATES: DeepDiveItem[] = [
  g({
    id: "pm-gs-atms-india",
    category: "Infrastructure",
    title: "Number of ATMs in India",
    difficulty: "Medium",
    sourceType: "CASEBOOK_INTERVIEW_CASE",
    confidence: "high",
    q: "Estimate the number of ATMs in India.",
    hint: "Build demand first — cardholders — then convert demand into infrastructure using a machine's capacity. Do not guess the machine count directly.",
    answer:
      "Work from population to cardholders to transactions to machines. Take 1.3 billion people, split 70% rural and 30% urban, at 4 people per household — giving 225 million rural and 100 million urban households. Assume 70% of rural and 90% of urban households hold ATM cards, giving 160 million rural and 90 million urban cardholders; allowing 10% of urban households to hold two cards raises the urban figure to about 99 million, so roughly 259 million cardholders in total. Then convert to machines using transactions per cardholder per month and the number a machine can handle, which lands the answer in the low hundreds of thousands.",
    detail:
      "**The chain**\n\n```\nPopulation 1.3B\n  → rural 70% = 900M  ·  urban 30% = 400M\n  → households at 4 people: rural 225M · urban 100M\n  → card penetration: rural 70% = 160M · urban 90% = 90M\n  → urban multiple cards: (10% × 90M) × 2 + (90% × 90M) × 1 = 99M\n  → total cardholders ≈ 259M\n```\n\nThen the supply side:\n\n```\nTransactions per cardholder per month  ≈ 3\nTotal monthly transactions             ≈ 780M\nTransactions per ATM per day           ≈ 100\nTransactions per ATM per month         ≈ 3,000\nATMs required                          ≈ 780M / 3,000 ≈ 260,000\n```\n\nThat is the right order of magnitude for India, which is the standard this is judged against.\n\n**Why the demand-then-capacity structure is the right one**\n\nGuessing a machine count directly is unfalsifiable. Building demand and dividing by a machine's throughput makes every assumption visible and individually challengeable — which is exactly what the interviewer wants, because they are testing the reasoning rather than the number.\n\n**The assumptions worth flagging yourself**\n\n1. **Rural card penetration at 70%** is the most aggressive assumption. Jan Dhan account opening drove nominal penetration up substantially, but *active* card usage is much lower. If the question is about ATM demand, active users matter, not accounts opened — and saying so is a strong move.\n2. **Three transactions per cardholder per month** varies enormously between rural and urban users, and UPI has substantially displaced small-value cash withdrawal in urban India. A more careful model would use different rates per segment.\n3. **A household as the card-holding unit** understates urban reality, where individuals rather than households hold cards.\n\n**The sanity check**\n\nIndia's actual ATM count is in the region of a quarter of a million, so this method lands correctly. But state the check as a *method* — \"does this imply a plausible number of ATMs per 100,000 people?\" — rather than as recalled trivia, because the interviewer is assessing whether you can validate an estimate without knowing the answer.\n\n**The refinement that impresses**\n\nATMs are not distributed in proportion to cardholders. Urban density means one machine serves far more people, and rural coverage is driven by mandated financial inclusion rather than by transaction economics. Segmenting the machine-throughput assumption by urban and rural would materially improve the estimate, and noting that unprompted shows you understand what the model is missing.",
    mistakes: [
      "Guessing the ATM count directly instead of building from demand.",
      "Using nominal card penetration when active usage is what drives demand.",
      "Applying one throughput assumption to both urban and rural machines.",
      "Not sanity-checking the result against a per-capita benchmark.",
    ],
    followUps: [
      "How would UPI adoption change this estimate?",
      "Would you expect ATMs per capita to be higher in urban or rural areas, and why?",
    ],
    tags: ["guesstimate", "market sizing", "India", "infrastructure", "banking"],
    related: ["pm-gs-soaps-kanpur", "pm-gs-credit-cards", "cons-c-guesstimate-method"],
    sources: [casebook(CASEBOOK_IITK, 62, "Guesstimate 5.2 'ATMs in India', presented as drawn from an actual PM interview.")],
  }),
  g({
    id: "pm-gs-soaps-kanpur",
    category: "Volume",
    title: "Soaps bought in Kanpur",
    difficulty: "Easy",
    sourceType: "CASEBOOK_INTERVIEW_CASE",
    confidence: "high",
    q: "Estimate the number of soap bars bought in Kanpur in a year.",
    hint: "Population, then households, then consumption rate. Segment by income if the consumption pattern genuinely differs.",
    answer:
      "Take Kanpur's population at roughly 3 million, at 4–5 people per household, giving around 650,000 households. Segment by income, since consumption differs: higher-income households use more soap per person and buy more premium bars, lower-income households fewer. Assume an average of around 1 bar per person per month for bathing soap, which gives 3 million bars per month and roughly 36 million bars a year. Then sanity check: does that imply a plausible per-capita spend, and does the implied market value look reasonable for a tier-2 Indian city?",
    detail:
      "**The chain**\n\n```\nPopulation of Kanpur           ≈ 3M\nHousehold size                 ≈ 4.5\nHouseholds                     ≈ 650,000\nBathing soap per person/month  ≈ 1 bar\nMonthly bars                   ≈ 3M\nAnnual bars                    ≈ 36M\n```\n\nAt an average of about ₹40 per bar that implies a market of roughly ₹144 crore a year for bathing soap in Kanpur — which is a plausible figure for a city of that size and is the sanity check to state.\n\n**The scoping question that must come first**\n\n\"Soap\" is ambiguous, and clarifying it is the first mark available:\n\n| Type | Include? |\n|---|---|\n| Bathing soap bars | the usual intent |\n| Liquid body wash | different unit — clarify |\n| Detergent and laundry soap | usually excluded |\n| Dishwashing bars | usually excluded |\n| Commercial and institutional use | hotels, hospitals — often forgotten |\n\nStating the scope you are adopting, and asking whether it is right, is worth more than any refinement to the arithmetic.\n\n**Where segmentation actually helps**\n\nIncome segmentation matters for *value* but much less for *volume* — a wealthy household does not bathe five times as often as a poorer one. Volume is driven by population; value is driven by price mix. If the question asks for units, heavy income segmentation adds complexity without accuracy; if it asks for market value, it is essential.\n\nRecognising which segmentations actually change the answer is a genuinely useful discipline, and over-segmenting is a common way candidates lose time.\n\n**Consumption rate is the assumption to defend**\n\nOne bar per person per month is the load-bearing number. Justify it concretely: a 100g bar lasts one person roughly a month at daily use. That kind of physical reasoning is far more persuasive than asserting a rate.\n\n**Refinements worth mentioning**\n\n- **Seasonality** — soap consumption rises in summer.\n- **Shared use** — a bar in a household bathroom is often shared, which would reduce the per-person figure. This is the most likely source of over-estimation.\n- **Institutional demand** — hotels, hostels and hospitals add a separate, non-household stream.\n\n**The general shape**\n\nThis is the standard consumption guesstimate: population → households → consumption rate → volume → value. Learning the shape matters more than learning the numbers, because it transfers directly to toothpaste, shampoo, tea, or any other FMCG product.",
    mistakes: [
      "Not clarifying which kind of soap is in scope.",
      "Over-segmenting by income when the question asks for units.",
      "Asserting a consumption rate without physical justification.",
      "Forgetting institutional demand.",
    ],
    followUps: [
      "Does your answer change if the question means market value rather than units?",
      "How would shared use within a household affect this?",
    ],
    tags: ["guesstimate", "FMCG", "consumption", "India", "market sizing"],
    related: ["pm-gs-atms-india", "pm-gs-pizza-outlet", "cons-c-guesstimate-method"],
    sources: [casebook(CASEBOOK_IITK, 64, "Guesstimate 5.3 'Soaps Bought in Kanpur', presented as drawn from an actual PM interview.")],
  }),
  g({
    id: "pm-gs-pizza-outlet",
    category: "Volume",
    title: "Pizzas sold at a Domino's outlet",
    difficulty: "Medium",
    sourceType: "CASEBOOK_INTERVIEW_CASE",
    company: "Domino's",
    confidence: "high",
    q: "Estimate the number of pizzas sold per day at a single Domino's outlet.",
    hint: "This is a supply-constrained problem. Work from the outlet's capacity — ovens, seats, delivery riders — rather than from the city's population.",
    answer:
      "This is a capacity problem rather than a market problem, so I would work from the outlet's own constraints. Split the day into peak and off-peak hours, since a pizza outlet's demand is concentrated at lunch and dinner. Then work through the binding constraint — oven throughput, seating turnover for dine-in, and delivery rider capacity for delivery — and take the minimum, since the outlet cannot exceed its tightest bottleneck. A typical outlet running roughly 12 hours with a few hundred pizzas across dine-in, takeaway and delivery lands in the range of 150–300 pizzas a day.",
    detail:
      "**Why supply-side, not demand-side**\n\nThe question asks about *one outlet*, not the market. Building from city population and market share requires two very shaky assumptions — total pizza demand and this outlet's share of it. Working from what the outlet can physically produce and serve is far more defensible and is the structurally correct choice. Saying why you chose that direction is itself worth marks.\n\n**The capacity model**\n\n```\nOperating hours                    ≈ 12\nPeak hours (lunch + dinner)        ≈ 4\nOff-peak hours                     ≈ 8\n\nPeak:      ~30 pizzas/hour × 4  = 120\nOff-peak:  ~10 pizzas/hour × 8  =  80\nTotal                            ≈ 200 pizzas/day\n```\n\n**Identify the binding constraint**\n\n| Channel | Constraint | Rough capacity |\n|---|---|---|\n| Dine-in | seats × turnover | 30 seats, 1.5 turns/hour at peak |\n| Delivery | riders × trips/hour | 5 riders × 2 trips/hour × 2 pizzas |\n| All | oven throughput | the usual real bottleneck |\n\nThe oven is typically the binding constraint at peak, which is why this is a bottleneck problem. Naming the bottleneck explicitly is the analytical core of the answer — the outlet's output is the minimum of its constraints, not the sum of its channels.\n\n**The peak/off-peak split is essential**\n\nA flat hourly rate across twelve hours would badly misestimate. Pizza demand is sharply bimodal — lunch and dinner — and the outlet is nearly idle mid-afternoon. Modelling a flat rate either overstates the total or understates peak capacity, and it also misses that the constraint only binds at peak.\n\n**Cross-checking with the demand side**\n\nA good answer sanity-checks the supply estimate against demand: does the outlet's catchment plausibly generate 200 pizzas a day? For a catchment of, say, 50,000 people with a small share ordering pizza in any given week, that is broadly consistent. Two independent methods landing in the same range is the strongest possible validation, and offering it unprompted is impressive.\n\n**Variation to acknowledge**\n\nOutlet location changes this enormously — a mall outlet, a highway outlet and a residential-area outlet have completely different profiles. Weekends differ from weekdays. Stating which kind of outlet you are modelling, rather than producing an average nobody recognises, makes the estimate meaningful.\n\n**Refinements**\n\nWeekday versus weekend, seasonality, promotional days, and the mix between dine-in, takeaway and delivery — the last of which has shifted heavily toward delivery and changes the binding constraint from seating to riders.",
    mistakes: [
      "Building from city population and an assumed market share.",
      "Using a flat hourly rate across the whole day.",
      "Adding channel capacities instead of finding the binding constraint.",
      "Not stating what kind of outlet is being modelled.",
    ],
    followUps: [
      "Which constraint binds first — oven, seats or riders?",
      "How would a mall outlet differ from a residential one?",
      "Can you cross-check this from the demand side?",
    ],
    tags: ["guesstimate", "capacity", "bottleneck", "supply side", "Domino's", "peak demand"],
    related: ["pm-gs-soaps-kanpur", "cons-c-guesstimate-method", "cons-gs-canteen-revenue"],
    sources: [casebook(CASEBOOK_IITK, 67, "Guesstimate 5.4 'Pizzas Sold at a Domino's Outlet', presented as drawn from an actual PM interview.")],
  }),
  g({
    id: "pm-gs-credit-cards",
    category: "Market Sizing",
    title: "Credit cards issued annually in India",
    difficulty: "Hard",
    sourceType: "CASEBOOK_INTERVIEW_CASE",
    confidence: "high",
    q: "Estimate the number of credit cards issued in India per year.",
    hint: "Separate the stock from the flow. New issuance is new cardholders plus replacements on the existing base — and the second term is easy to forget.",
    answer:
      "Cards issued in a year is a flow, not a stock, and it has two components: cards issued to genuinely new cardholders, and replacements or additional cards for the existing base. I would build the eligible population — income-qualified, credit-worthy, largely urban working adults — estimate current penetration and the annual growth in penetration to get new cardholders, then add replacements at some annual rate against the installed base. Missing the replacement term is the most common error, and it is often the larger of the two.",
    detail:
      "**Stock versus flow**\n\n```\nCards issued this year = New cardholders + Replacement/additional cards\n```\n\nCandidates typically estimate the *stock* of cards and present it as the answer. The question asks for the annual flow, and the two differ by an order of magnitude. Naming this distinction at the start is the clearest way to signal you have understood the question.\n\n**Building the eligible base**\n\n```\nPopulation                            1.4B\nWorking-age (20–60)                   ≈ 55%  → 770M\nUrban / semi-urban                    ≈ 40%  → 310M\nIncome above the issuance threshold   ≈ 25%  → 78M eligible\nCurrent penetration                   ≈ 25%  → ~20M cardholders\n```\n\nThen the flow:\n\n```\nNew cardholders per year   ≈ 15% growth on 20M  ≈ 3M\nReplacements               ≈ 20% of 20M base    ≈ 4M\nTotal issued per year                            ≈ 7M\n```\n\nThe replacement term being larger than the new-cardholder term is exactly why it must not be omitted.\n\n**Why replacements are substantial**\n\n- Cards expire on a three-to-five year cycle, so roughly 20–30% of the base is reissued annually.\n- Lost, stolen and damaged cards.\n- Product upgrades — a customer moved to a higher tier receives a new card.\n- Additional cards on the same account, including supplementary cards for family members.\n\n**The eligibility assumption is the load-bearing one**\n\nCredit card issuance is credit-gated, not just income-gated. Formal income documentation, credit bureau history and employment type all filter the population heavily, and India's large informal-employment share means the eligible base is much narrower than the income distribution alone suggests. Flagging that is a substantive insight rather than an arithmetic refinement.\n\n**Cards versus cardholders**\n\nOne person frequently holds several cards. If the question means cards rather than people, a multiplier of 1.5 to 2 on the cardholder count is needed. Asking which is meant is a legitimate clarifying question.\n\n**The sanity check**\n\nWhat does this imply for credit cards per 100 adults? India's penetration is low by international standards — single-digit percentages of the adult population — so an estimate implying 30% penetration would be badly wrong and should be revised. State the check as a method, not as recalled data.\n\n**A trend worth naming**\n\nUPI has substantially changed India's payments landscape, but it competes more with debit and cash than with credit. Credit card issuance has continued growing, driven by co-branded and BNPL-adjacent products. Mentioning that shows commercial awareness without requiring precise figures.",
    mistakes: [
      "Estimating the stock of cards rather than annual issuance.",
      "Omitting replacements, which are often the larger term.",
      "Treating eligibility as income-only rather than credit-gated.",
      "Not distinguishing cards from cardholders.",
    ],
    followUps: [
      "Which is larger — new cards or replacements?",
      "How does the informal economy affect the eligible base?",
      "Cards or cardholders — which did you estimate?",
    ],
    tags: ["guesstimate", "market sizing", "credit cards", "stock vs flow", "India", "banking"],
    related: ["pm-gs-atms-india", "cons-c-guesstimate-method", "cons-gs-amex-cards"],
    sources: [casebook(CASEBOOK_IITK, 69, "Guesstimate 5.5 'Credit Cards Issued Annually', presented as drawn from an actual PM interview.")],
  }),
];
