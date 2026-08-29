import { casebook, common, questionsFor, CASEBOOK_KTC } from "../helpers";
import type { DeepDiveItem } from "../types";

const g = questionsFor("CONSULTING", "consulting-guesstimates", "GUESSTIMATE");

/**
 * Guesstimates from the KTC 2025 Business Casebook, which describes its
 * guesstimate section as drawn from real alumni interview experiences.
 *
 * Company attribution comes only from each case's own page header. Where the
 * header names no company, none is recorded. Every number below is our own
 * worked assumption chain — the casebook's answers are not reproduced — so the
 * arithmetic is transparent and challengeable, which is the point.
 */

export const CONSULTING_GUESSTIMATES: DeepDiveItem[] = [
  g({
    id: "cons-gs-tea-cups",
    category: "Consumption",
    title: "Cups of tea consumed in a day",
    difficulty: "Easy",
    sourceType: "CASEBOOK_INTERVIEW_CASE",
    confidence: "high",
    q: "Estimate the number of cups of tea consumed in India in a day.",
    hint: "Scope it first — at home, out of home, or both? Then segment by consumption rate, because the rates genuinely differ.",
    answer:
      "First scope: all tea, both home-brewed and purchased, across the whole country. Then segment, because consumption rates differ sharply. Take 1.4 billion people; exclude young children, leaving roughly 1.1 billion tea-capable. Assume around 70% are regular tea drinkers, giving about 770 million. Segment those into heavy drinkers at 4 cups a day (around 30%), moderate at 2 (around 50%) and occasional at 1 (around 20%), which gives roughly 0.9 + 0.77 + 0.15 billion, so around 1.8 billion cups a day.",
    detail:
      "**The chain**\n\n```\nPopulation                        1.4B\nExclude under-5s (~9%)          → 1.27B\nExclude non-tea regions/coffee   → ~1.1B tea-capable\nRegular tea drinkers ~70%        → 770M\n\nHeavy   30% × 770M × 4 cups = 924M\nModerate 50% × 770M × 2 cups = 770M\nOccasional 20% × 770M × 1 cup = 154M\nTotal                        ≈ 1.85B cups/day\n```\n\n**Why segment rather than use an average**\n\nA single average — say 2.4 cups per drinker — gets you to a similar number faster. The reason to segment anyway is that it makes the assumption *inspectable*: an interviewer can challenge whether 30% of drinkers really have four cups, which is a much more productive conversation than challenging a blended average that came from nowhere. The structure is what is being graded.\n\n**Scope questions worth asking**\n\n| Question | Effect |\n|---|---|\n| Home-brewed and purchased, or only sold? | out-of-home is a small fraction of total |\n| Does chai from a street vendor count? | usually yes |\n| Green tea, iced tea? | usually included but small |\n| Whole country, or a city? | changes everything |\n\n**Regional variation**\n\nTea consumption is far higher in the north and east than in the south, where coffee dominates in parts of Tamil Nadu, Karnataka and Kerala. A more careful model would split north and south with different penetration rates. Naming this shows you are thinking about the actual population rather than a uniform abstraction.\n\n**The sanity check**\n\n1.85 billion cups a day is roughly 1.3 cups per person per day across the whole population, which is plausible for a tea-drinking country. Cross-check against production: India produces roughly 1.3 million tonnes of tea a year, most consumed domestically. At about 2 grams per cup, 1 million tonnes is 500 billion cups a year — around 1.4 billion a day. The two methods land within about 30% of each other, which is a strong result and exactly the kind of cross-check that impresses.\n\n**The technique to take away**\n\nWhere a physical constraint exists — production volume, capacity, land area — use it as an independent check on a demand-side estimate. Two methods agreeing is far more convincing than one method executed carefully.",
    mistakes: [
      "Not scoping home versus out-of-home consumption.",
      "Using one blended rate with no visible structure.",
      "Ignoring regional variation in a country where it is substantial.",
      "No cross-check against production or another independent route.",
    ],
    followUps: [
      "How would you cross-check this against tea production?",
      "How would the answer differ for the south of India?",
      "What if the question meant only tea bought outside the home?",
    ],
    tags: ["guesstimate", "consumption", "segmentation", "India", "cross-check"],
    related: ["cons-c-guesstimate-method", "pm-gs-soaps-kanpur", "cons-gs-canteen-revenue"],
    sources: [casebook(CASEBOOK_KTC, 298, "Guesstimate 92 'Cups of Tea', from the casebook's guesstimate section.")],
  }),
  g({
    id: "cons-gs-atms-delhi",
    category: "Infrastructure",
    title: "ATMs in Delhi",
    difficulty: "Medium",
    sourceType: "CASEBOOK_INTERVIEW_CASE",
    confidence: "high",
    q: "Estimate the number of ATMs in Delhi.",
    hint: "A city is more tractable than a country because you can work from area and density as well as from demand. Try both.",
    answer:
      "Two routes, and doing both is the strongest answer. Demand-side: Delhi's population of around 20 million, at 4 per household, gives 5 million households; with high urban card penetration and multiple cards per household, roughly 12 million cardholders; at 3 withdrawals a month and 100 transactions per ATM per day, that implies around 12,000 ATMs. Supply-side: Delhi covers roughly 1,500 km², and at a plausible density of a handful of ATMs per km² in built-up areas, you land in the same range. Both routes converging around 10,000–14,000 is the useful result.",
    detail:
      "**Demand-side**\n\n```\nPopulation                    ≈ 20M\nHouseholds at 4               ≈ 5M\nUrban card penetration ~90%   ≈ 4.5M households with cards\nCards per household ~1.5      ≈ 6.75M cards... \n  but urban individuals hold cards, not households:\nAdults (~65%)                 ≈ 13M\nCard penetration among adults ~60% ≈ 8M cardholders\nCards per holder ~1.5         ≈ 12M cards\n\nWithdrawals per card/month    ≈ 3   → 36M transactions/month\nPer ATM: 100/day × 30         ≈ 3,000/month\nATMs                          ≈ 36M / 3,000 ≈ 12,000\n```\n\nNote the correction mid-chain: for an urban population, treating *individuals* rather than households as cardholders is more accurate, and saying so out loud shows you are checking your own model rather than executing it blindly.\n\n**Supply-side cross-check**\n\n```\nDelhi area                    ≈ 1,500 km²\nDeveloped/built-up share      ≈ 60%  → 900 km²\nATMs per km² in built-up area ≈ 12\n                              ≈ 11,000 ATMs\n```\n\nThe density assumption is the weak point, so justify it physically: in a dense commercial area you might pass an ATM every few hundred metres, implying far more than 12 per km²; in residential areas far fewer. Segmenting by area type would improve it.\n\n**Why a city is easier than a country**\n\nTwo independent routes are available — demand and spatial density — and the population is more homogeneous, so a single set of assumptions is more defensible. A national estimate has to handle enormous urban-rural variation.\n\n**What has changed the answer**\n\nUPI has substantially reduced small-value cash withdrawal in urban India, so withdrawals per card have fallen while the *value* per withdrawal has risen. ATM counts in metros have been roughly flat or declining rather than growing with population. Mentioning that the demand assumption is time-sensitive is a genuine insight rather than a hedge.\n\n**Sanity check**\n\n12,000 ATMs for 20 million people is roughly 60 per 100,000 — plausible for a major metro and above the national average, which is what you would expect for Delhi.",
    mistakes: [
      "Using households rather than individuals as cardholders in an urban estimate.",
      "A single density assumption across commercial and residential areas.",
      "Ignoring how digital payments have changed withdrawal frequency.",
      "Only doing one route when two are available.",
    ],
    followUps: [
      "How has UPI changed this?",
      "Would you expect the density to be uniform across Delhi?",
    ],
    tags: ["guesstimate", "infrastructure", "banking", "density", "Delhi", "cross-check"],
    related: ["pm-gs-atms-india", "cons-c-guesstimate-method", "cons-gs-amex-cards"],
    sources: [casebook(CASEBOOK_KTC, 305, "Guesstimate 97 'ATMs in Delhi', from the casebook's guesstimate section.")],
  }),
  g({
    id: "cons-gs-canteen-revenue",
    category: "Revenue",
    title: "Campus canteen revenue",
    difficulty: "Easy",
    sourceType: "CASEBOOK_INTERVIEW_CASE",
    confidence: "high",
    q: "Estimate the annual revenue of a canteen on a university campus.",
    hint: "Bounded population, known meal pattern. Check whether demand or seating capacity is the binding constraint.",
    answer:
      "Start from the campus population — say 8,000 students plus 1,500 staff. Not everyone eats at the canteen every day: assume 60% of students use it on a given day, some for one meal and some for two, and a smaller share of staff. That gives roughly 6,000–7,000 meals a day at an average of ₹60, so about ₹400,000 a day. Over roughly 250 operating days, allowing for vacations, that is around ₹10 crore a year. Then check whether seating capacity could even support that peak volume, since a canteen is often capacity-constrained at lunch.",
    detail:
      "**The chain**\n\n```\nStudents                       8,000\nStaff                          1,500\n\nStudents using canteen daily   60% → 4,800\nMeals per user per day         ~1.3 → 6,240 meals\nStaff using canteen daily      40% × 1,500 × 1 → 600 meals\nTotal daily meals              ≈ 6,800\n\nAverage spend per meal         ₹60\nDaily revenue                  ≈ ₹408,000\nOperating days (vacations out) ≈ 250\nAnnual revenue                 ≈ ₹10.2 crore\n```\n\n**The capacity cross-check**\n\nThis is what turns a demand estimate into a good answer:\n\n```\nSeats                          300\nLunch peak window              2 hours\nTurnover per seat per hour     2\nLunch capacity                 300 × 2 × 2 = 1,200 meals\n```\n\nIf lunch demand is around 3,000 meals but capacity is 1,200, the canteen physically cannot serve it — so either the demand assumption is too high, the peak is longer than assumed, or there is significant takeaway. Discovering that the two sides do not reconcile, and saying so, is worth more than a smooth estimate that was never checked.\n\n**Operating days matter more than people expect**\n\nA university runs roughly 250 days once vacations, exam breaks and holidays are removed — not 365. Using 365 overstates revenue by nearly 50%, and it is one of the most common errors in this style of question.\n\n**Segmentation that helps**\n\nBreakfast, lunch and dinner have different volumes and different average spends. Lunch is the largest and highest-value; breakfast is smaller. Splitting by meal improves both the revenue estimate and the capacity check, since the constraint binds at lunch.\n\n**What the question is really testing**\n\nA bounded population with a known pattern of behaviour, so the estimate should be tight rather than order-of-magnitude. And whether you check supply against demand rather than only building one side — which is the transferable technique.\n\n**Extension**\n\nIf asked about profitability: food cost is typically 30–40% of revenue, labour 20–25%, with rent often subsidised or nil on a campus. That gives a contribution structure you can work with, and it connects the guesstimate to a profitability discussion.",
    mistakes: [
      "Using 365 days.",
      "Assuming every student eats there every day.",
      "Not checking seating capacity against demand.",
      "One average spend across breakfast, lunch and dinner.",
    ],
    followUps: [
      "Can the seating actually support your lunch estimate?",
      "How would you estimate the canteen's profit rather than revenue?",
    ],
    tags: ["guesstimate", "revenue", "capacity", "bounded population", "cross-check"],
    related: ["cons-c-guesstimate-method", "pm-gs-pizza-outlet", "cons-c-formulas"],
    sources: [casebook(CASEBOOK_KTC, 342, "Guesstimate 106 'Campus Canteen Revenue', from the casebook's guesstimate section.")],
  }),
  g({
    id: "cons-gs-amex-cards",
    category: "Market Sizing",
    title: "American Express credit cards in India",
    difficulty: "Hard",
    sourceType: "CASEBOOK_INTERVIEW_CASE",
    company: "American Express",
    confidence: "high",
    q: "Estimate the number of American Express credit cards in India.",
    hint: "Build the total credit card market, then estimate a share — and think hard about why this issuer's share is not typical.",
    answer:
      "Build the market then take a share. Start with the credit-eligible population: 1.4 billion people, working-age and urban and above the income threshold gives roughly 80 million eligible, with penetration around 25% giving about 20 million cardholders and perhaps 30 million cards. Then estimate this issuer's share — and the key judgement is that a premium, higher-fee, lower-acceptance issuer will hold a much smaller share than its brand prominence suggests, likely low single digits. At around 3–5% that gives roughly 1–1.5 million cards.",
    detail:
      "**Building the market**\n\n```\nPopulation                              1.4B\nWorking age 20–60 (~55%)               770M\nUrban / semi-urban (~40%)              310M\nAbove income threshold (~25%)           78M eligible\nCredit card penetration (~25%)          ~20M cardholders\nCards per holder (~1.5)                 ~30M cards\n```\n\n**The share judgement is the actual question**\n\nEverything above is a standard market build. The insight is in the share, and it requires reasoning about this issuer's specific position rather than applying an average:\n\n| Factor | Effect on share |\n|---|---|\n| Premium positioning, high annual fees | narrows the addressable base sharply |\n| Higher merchant discount rate | fewer merchants accept it |\n| Lower acceptance | reduces utility, so fewer customers choose it |\n| Strong brand among affluent and travellers | high share *within* that narrow segment |\n| Closed-loop network | no third-party issuing at the scale of Visa/Mastercard rails |\n| Domestic banks dominate mass-market issuance | crowded out below the premium tier |\n\nSo the correct structure is not \"total market × average share\" but \"**premium segment** × high share within it\":\n\n```\nPremium cardholders (~10% of the 20M)   ≈ 2M\nShare of the premium segment (~30–50%)  ≈ 0.6–1.0M cardholders\nCards per holder (~1.5)                 ≈ 1–1.5M cards\n```\n\nBoth routes converge on roughly a million cards, which is the useful confirmation.\n\n**Why the segment-first approach is better**\n\nApplying an average market share to a deliberately non-average competitor is the error this question is designed to catch. A premium issuer is not a small version of a mass-market one — it competes in a different segment with different economics. Recognising that reframes the estimate entirely.\n\n**The acceptance point deserves emphasis**\n\nA card is only useful where it is accepted. Higher merchant fees mean lower acceptance, which reduces the card's utility, which limits how many customers will hold it as a primary card. That is a structural constraint on share, not a marketing problem, and naming the causal chain is a strong contribution.\n\n**Sanity check**\n\nAround a million cards against a market of roughly 30 million is about 3–4%. For a premium-only issuer competing against domestic banks with vast branch distribution, that is plausible. An estimate implying 20% share should be rejected immediately.\n\n**What to say about uncertainty**\n\nThe share assumption dominates the answer and is the weakest link. Being explicit that the market build is reasonably robust while the share estimate carries most of the uncertainty is a more honest and more useful close than presenting one number with false confidence.",
    mistakes: [
      "Applying an average market share to a deliberately premium competitor.",
      "Ignoring acceptance as a structural constraint on share.",
      "Not segmenting the market before applying a share.",
      "Presenting a single number without identifying which assumption dominates the uncertainty.",
    ],
    followUps: [
      "Why would this issuer's share differ from the market average?",
      "How does merchant acceptance constrain cardholder numbers?",
      "Which of your assumptions carries the most uncertainty?",
    ],
    tags: ["guesstimate", "market sizing", "market share", "premium segment", "credit cards"],
    related: ["pm-gs-credit-cards", "cons-c-guesstimate-method", "cons-c-market-entry"],
    sources: [casebook(CASEBOOK_KTC, 338, "Guesstimate 105 'American Express Credit Cards', page header names American Express.")],
  }),
  g({
    id: "cons-gs-petrol-pump",
    category: "Revenue",
    title: "Revenue of a petrol pump",
    difficulty: "Medium",
    sourceType: "CASEBOOK_INTERVIEW_CASE",
    confidence: "high",
    q: "Estimate the annual revenue of a single petrol pump.",
    hint: "Supply-constrained. Work from nozzles, service time and utilisation rather than from area demand.",
    answer:
      "This is a throughput problem, so work from the physical constraint. A typical pump has, say, 6 nozzles. Each vehicle takes about 3 minutes including approach and payment, so a nozzle serves around 20 vehicles an hour at full utilisation. Over 16 operating hours with realistic utilisation — high at peaks, low overnight, averaging perhaps 40% — that is around 6 × 20 × 16 × 0.4 ≈ 770 vehicles a day. At an average fill of ₹700, that is roughly ₹540,000 a day, or about ₹19–20 crore a year.",
    detail:
      "**The chain**\n\n```\nNozzles                        6\nService time per vehicle       3 min → 20 vehicles/nozzle/hour\nOperating hours                16\nTheoretical max                6 × 20 × 16 = 1,920 vehicles/day\nAverage utilisation            ~40%\nActual                         ≈ 770 vehicles/day\n\nAverage fill value             ₹700\nDaily revenue                  ≈ ₹540,000\nAnnual (365 days)              ≈ ₹19.7 crore\n```\n\n**Utilisation is the load-bearing assumption**\n\nA petrol pump is not uniformly busy: morning and evening commutes are near capacity, the middle of the day is moderate, and overnight is nearly empty. A flat 40% is a blended figure standing in for that profile. A better model splits the day:\n\n```\nPeak    4 hours × 80% utilisation\nNormal  8 hours × 40%\nNight   4 hours × 10%\nWeighted average ≈ 40%\n```\n\nShowing the profile behind the average is what makes the assumption defensible rather than asserted.\n\n**The vehicle mix matters for the fill value**\n\nTwo-wheelers fill ₹150–300 and are quick; cars fill ₹1,000–2,000 and take longer; commercial vehicles fill much more and take much longer. So mix affects *both* the average fill value and the service time, and those move in opposite directions — a two-wheeler-heavy pump serves more vehicles at lower value. Recognising that the two assumptions are linked, rather than independent, is a good observation.\n\n**Location changes everything**\n\nA highway pump has fewer, larger, commercial fills; an urban pump has many small two-wheeler fills; a residential-area pump has a pronounced commute peak. Stating which you are modelling makes the estimate meaningful.\n\n**Days per year**\n\nUnlike a canteen, a petrol pump runs essentially every day, so 365 is right here. Knowing when 365 applies and when it does not is part of the skill.\n\n**Revenue versus profit — the important extension**\n\nFuel retail runs on very thin regulated margins, often only 2–4% of the selling price. So ₹20 crore of revenue might yield ₹50–80 lakh of gross margin before costs. That is why pumps push convenience stores, lubricants and car washes — non-fuel revenue carries far higher margins. If asked about the business rather than the number, that is the answer, and it is a genuinely commercial observation rather than an arithmetic one.\n\n**Sanity check**\n\n770 vehicles a day is roughly one every two minutes across 16 hours. That feels right for a moderately busy urban pump, which is the kind of intuitive check worth stating aloud.",
    mistakes: [
      "Assuming full utilisation across all operating hours.",
      "Using one fill value regardless of vehicle mix.",
      "Not stating what kind of location is being modelled.",
      "Presenting revenue as though it indicated profitability, in a thin-margin business.",
    ],
    followUps: [
      "How would a highway pump differ from an urban one?",
      "Revenue is ₹20 crore. What is the profit likely to be?",
      "Why do pumps push convenience stores?",
    ],
    tags: ["guesstimate", "throughput", "capacity", "utilisation", "fuel retail", "margins"],
    related: ["pm-gs-pizza-outlet", "cons-c-guesstimate-method", "cons-c-formulas"],
    sources: [casebook(CASEBOOK_KTC, 325, "Guesstimate 102 'Petrol Pump Revenue', from the casebook's guesstimate section.")],
  }),
  g({
    id: "cons-gs-market-sizing-method",
    category: "Market Sizing",
    title: "Market sizing: top-down and bottom-up",
    difficulty: "Medium",
    q: "How do you size a market, and when would you use top-down versus bottom-up?",
    hint: "Two directions, and where both are available the real answer is to do both.",
    answer:
      "Top-down starts from a large aggregate and narrows: total population, then the relevant segment, then penetration, then usage and price. Bottom-up builds from a unit and multiplies: revenue per outlet times number of outlets, or per customer times number of customers. Use top-down when a reliable aggregate exists and you can defend the narrowing ratios; use bottom-up when you understand the unit economics well or the market is fragmented. Where both are available, do both — two independent methods landing in the same range is far stronger evidence than one method executed carefully.",
    detail:
      "**Top-down**\n\n```\nTotal population / GDP / total category spend\n  → relevant segment\n    → penetration\n      → usage frequency\n        → price per unit\n          = market size\n```\n\nStrong when a credible starting aggregate exists. Weak when the narrowing ratios are guesses, because errors compound multiplicatively — four assumptions each off by 30% can leave you off by a factor of three.\n\n**Bottom-up**\n\n```\nRevenue per unit (outlet, customer, transaction)\n  × number of units\n  = market size\n```\n\nStrong when you know the unit well, and it is easier to sanity-check because the unit is observable. Weak when the number of units is itself unknown, which just moves the problem.\n\n**TAM, SAM, SOM**\n\n| Term | Meaning |\n|---|---|\n| **TAM** | total addressable market — everyone who could conceivably buy |\n| **SAM** | serviceable addressable market — those you can actually reach with your model, geography and channel |\n| **SOM** | serviceable obtainable market — the realistic share you could win |\n\nTAM alone is close to a vanity number. The useful figure for a business decision is almost always SOM, and distinguishing the three explicitly is what interviewers listen for.\n\n**Value versus volume**\n\nAlways clarify which is being asked. Units and revenue are different questions and need different segmentation — income segmentation matters a lot for value and much less for volume.\n\n**The checks**\n\n1. **Per-capita** — does the implied spend per person look sensible?\n2. **Share of a known larger market** — does your estimate imply an implausible share of total retail or total category spend?\n3. **Independent method** — does a bottom-up build land near the top-down one?\n\n**Where it goes wrong**\n\n- Compounding four uncertain ratios and presenting a precise number.\n- Sizing the TAM when the decision needs the SOM.\n- Segmenting on a dimension that does not change behaviour, which adds work and no accuracy.\n- Forgetting that markets have a growth rate — a current size and a growth rate are different questions, and business decisions usually depend on both.\n\n**How to present it**\n\nState the structure, state the assumptions with brief justification, do the arithmetic aloud with round numbers, give the result with units, sanity-check it, and name which assumption the answer is most sensitive to. That last step — a one-line sensitivity comment — is what makes it a business estimate rather than a sum.",
    mistakes: [
      "Compounding several uncertain ratios and reporting a precise figure.",
      "Sizing TAM when the decision needs SOM.",
      "Not clarifying volume versus value.",
      "No sanity check and no sensitivity comment.",
    ],
    followUps: [
      "Which of your assumptions is the answer most sensitive to?",
      "Is that TAM, SAM or SOM?",
      "How would you cross-check it?",
    ],
    tags: ["market sizing", "TAM", "SAM", "SOM", "top-down", "bottom-up", "sensitivity"],
    related: ["cons-c-guesstimate-method", "cons-c-market-entry", "pm-gs-credit-cards"],
    sources: [
      casebook(CASEBOOK_KTC, 296, "The casebook's Guesstimates section covers market-sizing method across its worked problems."),
      common("Market sizing method is published across every major consulting preparation resource."),
    ],
  }),
];
