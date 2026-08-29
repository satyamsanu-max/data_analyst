import { conceptsFor, casebook, adapted, CASEBOOK_FINAL, CASEBOOK_IITK } from "../helpers";
import type { DeepDiveItem } from "../types";

const c = conceptsFor("CONSULTING", "consulting-concepts");

export const CONSULTING_CONCEPTS: DeepDiveItem[] = [
  // ------------------------------------------------------------------ FORMAT
  c({
    id: "cons-c-interview-formats",
    category: "Interview Format",
    title: "How case interviews are actually run",
    difficulty: "Easy",
    body: `Consulting firms use several case formats, and knowing which you are in changes how you behave.

**Candidate-led** — the format most casebooks are written for. You are given a deliberately ambiguous problem and expected to lead: ask clarifying questions, structure the problem, request the data you need, and drive to a recommendation. The interviewer largely stays quiet, validates your thinking, or asks for alternative approaches. **You** must ask for data; nothing is volunteered.

**Interviewer-led** — the interviewer decides what matters. They select the questions, provide data, and may dive into an area regardless of how you prioritised it. Your structure still matters, but you are being steered. McKinsey has historically leaned this way.

**Written case** — you are given graphs, exhibits and documents, analyse them in a fixed time, and then take a written test or deliver a presentation.

**Group case** — three to five candidates receive an open-ended problem and solve it together while being observed. Here you are assessed as much on how you handle other people as on the analysis: building on someone's point, disagreeing without dismissing, and bringing in a quieter candidate all count.

**What interviewers say they are looking for**

The Consulting & Analytics Club casebook names four things directly:

1. **The art of questioning.** Clarifying questions are a litmus test — they reveal both the breadth and the depth of your thinking, and they break a large problem into tractable parts.
2. **Effectiveness of the solution.** A workable answer given the constraints. Precision is less important than a fair approximation that supports a decision.
3. **The Pareto principle.** Roughly 20% of causes produce 80% of the problem. Identify the major drivers before diving into solutions.
4. **Confidence.** Consultants make recommendations that redirect companies. Confidence and quick thinking signal you could do that.

The Pareto point is the practically useful one: you are not expected to be exhaustive, you are expected to find what matters.`,
    example: `In a candidate-led case, silence after the prompt is not the interviewer waiting for an answer — it is the first test. The expected response is clarifying questions and a structure, not an immediate hypothesis.`,
    relevance: `Misreading the format wastes the first five minutes. In a candidate-led case, waiting to be given data means nothing happens; in an interviewer-led case, insisting on your own structure reads as inflexible.`,
    mistakes: [
      "Waiting for data in a candidate-led case.",
      "Aiming for precision when a fair approximation is what is wanted.",
      "In a group case, competing with other candidates rather than working with them.",
      "Being exhaustive rather than identifying the major drivers.",
    ],
    tags: ["case interview", "candidate-led", "interviewer-led", "group case", "Pareto"],
    related: ["cons-c-structuring", "cons-c-profitability", "cons-c-communication"],
    sources: [
      casebook(CASEBOOK_FINAL, 2, "The 'Understanding Case Interviews' and 'What interviewers expect from candidates' sections set out the four formats and the four expectations."),
      adapted("Original commentary on how format changes candidate behaviour."),
    ],
  }),
  c({
    id: "cons-c-structuring",
    category: "Structuring",
    title: "Structuring a case: MECE, issue trees and hypotheses",
    difficulty: "Medium",
    body: `Structure is what a case interview is actually assessing. The analysis matters, but a candidate who structures well and gets an approximate answer beats one who calculates precisely within a bad structure.

**MECE** — Mutually Exclusive, Collectively Exhaustive. Your buckets should not overlap, and together they should cover the problem. "Revenue and costs" is MECE for profit. "Marketing, sales and India" is not — the categories overlap and the list is incomplete.

MECE is a discipline, not a goal in itself. A perfectly MECE structure that does not help you solve the problem is worse than a slightly imperfect one that does.

**Issue trees** turn a question into a tree of sub-questions, each of which can be investigated. Build them top-down from the objective, and prefer trees whose branches are *quantifiable* — you want to be able to say which branch the numbers point to.

**Hypothesis-driven thinking** is the consulting habit that distinguishes the approach from generic problem-solving. Rather than investigating every branch equally, form an early view of the likely answer and test it. It is faster, and it makes your questions purposeful rather than exploratory.

The tension: hypothesise too early and you anchor on the wrong answer; too late and you boil the ocean. The resolution is to structure first, take a quick look at the data, then hypothesise — and to say explicitly what would disprove your hypothesis.

**Signposting.** Say what you are about to do before you do it. "I would like to structure this into revenue and cost, start with revenue since the client says volumes are down, and within revenue look at price and volume separately." The interviewer can now follow you, and if your priority is wrong they will redirect you rather than watch you go astray.`,
    example: `Profit decline. Structure: Profit = Revenue − Cost. Revenue = Price × Volume. Cost = Fixed + Variable. Ask which side moved, then which sub-branch. Two questions eliminate three quarters of the tree, and every subsequent question is targeted.`,
    relevance: `Every consulting interview grades structure. Signposting and MECE-ness are the two most visible signals, and both are entirely within your control regardless of how the case goes.`,
    mistakes: [
      "Reciting a memorised framework rather than building a structure for this problem.",
      "Overlapping buckets.",
      "Hypothesising before any data, then anchoring.",
      "Not signposting, so the interviewer cannot follow the reasoning.",
    ],
    tags: ["MECE", "issue tree", "hypothesis", "structure", "signposting"],
    related: ["cons-c-profitability", "cons-c-interview-formats", "cons-c-communication"],
    sources: [
      casebook(CASEBOOK_FINAL, 4, "The Frameworks section establishes structured case approaches; the interviewer-expectations section emphasises structuring and prioritisation."),
      adapted("Original explanation of MECE, hypothesis-driven thinking and signposting."),
    ],
  }),

  // ------------------------------------------------------------------ PROFITABILITY
  c({
    id: "cons-c-profitability",
    category: "Profitability",
    title: "Profitability cases",
    difficulty: "Medium",
    body: `The most common case type. Profit = Revenue − Cost, and the whole case is finding which side moved and why.

**Preliminary questions, as the casebook sets them out**

- What is the client's objective?
- What is the quantum of the decline — how much, in what terms?
- How long has the decline been going on?
- Is this industry-wide or specific to our client?
- Understand the client: their product, geography, and position in the value chain.

The **industry-wide versus client-specific** question is the highest-value one, exactly as in a root cause analysis. If the whole industry is down, the causes are external — regulation, input costs, demand shift. If only the client is, the causes are internal and the branch of the tree to explore is completely different.

**The decomposition**

\`\`\`
Profit  = Revenue − Cost
Revenue = Price × Volume
Volume  = Market size × Market share
Cost    = Fixed + Variable
        = (per unit) × Volume  for variable
\`\`\`

**Where the case usually goes**

| Finding | Investigate |
|---|---|
| Volume down | demand, competition, distribution, product |
| Price down | discounting, mix shift, competitive pressure |
| Variable cost up | input prices, supplier terms, yield, wastage |
| Fixed cost up | capacity, overhead, depreciation, one-offs |
| Revenue stable, profit down | costs — this narrows fast |

**Mix effects are the sophisticated finding.** Revenue can fall with prices and volumes unchanged in every segment, if the sales mix shifted toward lower-priced products. Checking mix, not just averages, is what distinguishes a strong candidate — average price is a weighted average and can move without any individual price changing.

**Then walk the value chain** for the cost side: procurement, manufacturing, distribution, marketing, service. Locating which stage grew tells you whose problem it is and what levers exist.`,
    example: `A fan manufacturer wants to improve gross margin. Mid-range player, no differentiation, competitive and price-sensitive market, 12% share. Because demand is elastic, raising prices is not available — so the levers are differentiation on the revenue side and cost optimisation across procurement, manufacturing and distribution on the expense side. Establishing that price is unavailable *before* proposing anything is what makes the structure work.`,
    relevance: `Profitability is the single most common case type across every firm, and the industry-versus-client question plus the mix-effect check are the two moves that most reliably distinguish candidates.`,
    mistakes: [
      "Diving into cost cutting without establishing whether revenue or cost moved.",
      "Not asking whether the industry is affected too.",
      "Missing a mix effect and blaming price.",
      "Proposing a price rise in a demonstrably price-sensitive market.",
    ],
    tags: ["profitability", "revenue", "cost", "value chain", "mix effect", "framework"],
    related: ["cons-c-structuring", "cons-c-growth", "cons-c-pricing", "cons-case-fan-company"],
    sources: [
      casebook(CASEBOOK_FINAL, 5, "Profitability Framework Overview and its preliminary questions."),
      adapted("Extended with the decomposition, mix effects and original commentary."),
    ],
  }),

  // ------------------------------------------------------------------ MARKET ENTRY
  c({
    id: "cons-c-market-entry",
    category: "Market Entry",
    title: "Market entry cases",
    difficulty: "Medium",
    body: `The question is whether a client should enter a market, and — if so — how.

**Preliminary questions, per the casebook**

- What is the decision criterion? What metric decides whether to enter — revenue, profit, share, strategic position?
- Why does the client want to enter this market? Is there a specific reason?
- Understand the product. Is it a commodity or a differentiable good? This changes everything about how entry works.
- Why this particular geography?
- Which part of the value chain does the client want to occupy?

The decision criterion must come first. "Should we enter?" is unanswerable until you know what success would mean — a break-even within three years and a 15% share target lead to different analyses.

**The structure**

1. **Market attractiveness** — size, growth rate, margins, segments, customer needs.
2. **Competition** — who is there, how concentrated, how they would respond.
3. **Client capability** — do we have the product, the distribution, the brand, the capital?
4. **Barriers** — regulation, capital intensity, distribution access, switching costs, IP.
5. **Entry mode** — organic build, acquisition, joint venture, licensing, partnership.
6. **Financials** — investment required, expected share, break-even, NPV.
7. **Risks and exit** — what would make this fail, and can we get out?

**Estimating market share is where candidates get stuck.** The casebook gives three practical proxies, and they are worth memorising:

- **Ask the interviewer** directly what share they expect.
- **Use the most recent entrant** as a proxy — what share did the last company to enter achieve?
- **Ask whether the client has entered another geography before**, and if so what share they took in the first year.

That third one is the best of the three when it is available, because it uses the client's own demonstrated capability rather than a generic benchmark.

**Commodity versus differentiable** determines the entry logic entirely. In a commodity market you compete on cost and distribution, so entry requires a structural cost advantage. In a differentiable market you can enter on product or brand, and a niche is viable.`,
    example: `A client considering entering a new country: establish the criterion (break-even by year three), market size and growth, the competitive structure, and whether the client's product travels. Then estimate share using the client's own first-year share in a previously entered geography as the proxy, rather than assuming a number.`,
    relevance: `Market entry is one of the most common case types, and the share-estimation proxies are a concrete technique most candidates lack — they either guess or freeze.`,
    mistakes: [
      "Analysing the market without establishing the decision criterion.",
      "Guessing at market share with no proxy.",
      "Ignoring competitive response to entry.",
      "Not considering entry mode — build, buy or partner.",
    ],
    tags: ["market entry", "market attractiveness", "market share", "entry mode", "barriers"],
    related: ["cons-c-structuring", "cons-c-ma", "cons-c-guesstimate-method"],
    sources: [
      casebook(CASEBOOK_FINAL, 6, "Market Entry Framework Overview, preliminary questions and the three market-share proxy techniques."),
      adapted("Extended structure and original commentary."),
    ],
  }),

  // ------------------------------------------------------------------ PRICING
  c({
    id: "cons-c-pricing",
    category: "Pricing",
    title: "Pricing cases",
    difficulty: "Medium",
    body: `A pricing case asks you to set an optimum price for a product or service, usually for a new launch and occasionally as a repricing.

**Three approaches, and they bound the answer between them**

**Cost-based** — calculate the costs and add a margin. Cost-plus pricing and break-even pricing are the two forms. The casebook is direct that this is insufficient on its own in modern practice, but it serves an essential purpose: it establishes the **lower limit**. You cannot sustainably price below cost.

**Competitive** — price relative to what is already in the market. Three postures:
- *Lower* — used by companies with economies of scale, setting unprofitable prices on some lines to attract customers toward more profitable goods and services.
- *Higher* — used by well-established brands.
- *Equal* — match the competitor's price and compete on a unique experience instead.

**Value-based** — price on the value delivered to the customer. This establishes the **upper limit**. It is a function of the target segment, and the casebook makes a sharp point: the wider the target segment, the lower the aspirational value. A product for everyone cannot command a premium. Substitute and alternative prices must be considered, since they cap what value-based pricing can extract.

**So the three together give you a range:** cost sets the floor, value sets the ceiling, competition positions you within it. Presenting it that way is much stronger than treating them as three alternatives to choose between.

**Factors influencing price**, per the casebook: total costs (fixed and variable), market conditions (price wars, product life cycle, seasonality, availability), strategic position (cost advantage or benefit advantage), the unique selling point, government policy and regulation, and changing consumer behaviour and expectations.

**Price elasticity** is the analytical core. If demand is elastic, a price rise loses more volume than it gains in margin. Establishing elasticity — or at least asking about it — before recommending a price change is essential, and it is what prevents the classic error of recommending a price increase in a commoditised market.`,
    example: `Pricing a new product: cost-based gives a floor of ₹400. The nearest competitor sells at ₹650. Value-based analysis suggests customers save ₹1,200 a year using it, giving a ceiling well above ₹650. So the viable range is ₹400 to roughly ₹900, and the positioning decision — premium, parity or penetration — determines where within it you land.`,
    relevance: `Pricing cases appear frequently, and the floor-ceiling-position framing is a clearer answer than listing three methods. The elasticity question is what stops a recommendation being naive.`,
    mistakes: [
      "Using cost-plus alone and ignoring what customers will pay.",
      "Recommending a price rise without establishing elasticity.",
      "Treating the three approaches as alternatives rather than bounds.",
      "Ignoring competitive response to a price change.",
    ],
    tags: ["pricing", "cost-based", "value-based", "competitive pricing", "elasticity"],
    related: ["cons-c-profitability", "cons-c-market-entry", "cons-c-formulas"],
    sources: [
      casebook(CASEBOOK_FINAL, 9, "Pricing Strategy Framework Overview: the three approaches, the factors influencing pricing, and the segment-width point on aspirational value."),
      adapted("Original floor-ceiling-position framing and elasticity commentary."),
    ],
  }),

  // ------------------------------------------------------------------ GROWTH
  c({
    id: "cons-c-growth",
    category: "Growth",
    title: "Growth strategy cases",
    difficulty: "Medium",
    body: `The client wants to grow and needs to know how.

**Preliminary questions, per the casebook**

- What market trends and opportunities should we leverage?
- How do we compare to competitors, and what is our unique value proposition?
- Who are our target customers and what are their needs?
- What are the growth objectives, short-term and long-term?

The casebook also emphasises four things to establish: a deep understanding of the current situation, market, competitors and financial health; customer needs as the priority; how budget, personnel and technology will support the strategy; and the risks with a mitigation plan.

**The structure**

Growth comes from a limited number of places, and being able to enumerate them is the structure:

\`\`\`
Grow revenue by:
  Existing customers  → buy more often
                      → buy more per purchase
                      → buy adjacent products (cross-sell)
                      → trade up (up-sell)
  New customers       → in existing segments
                      → in new segments
                      → in new geographies
  New products        → to existing customers
                      → to new customers
  Inorganic           → acquire, partner, license
\`\`\`

That maps closely to the **Ansoff matrix** — market penetration, market development, product development, diversification — in increasing order of risk.

**The order to evaluate them.** Existing customers first: they are cheapest to reach, already trust you, and the analytics to find the opportunity already exist. New geographies and new products are far more expensive and riskier. A candidate who starts with "launch a new product" has skipped the cheapest options.

**Constraints matter as much as options.** Growth is limited by capital, capacity, talent and time. A growth recommendation that ignores whether the client can fund or staff it is not a recommendation.`,
    example: `A tea brand relaunching: existing customers buying more often is the cheapest lever, then new segments in existing geographies, then new products. Evaluating in that order, and saying why, structures the case without any framework being recited.`,
    relevance: `Growth cases are common and are where candidates most often produce an unordered list of ideas. Enumerating the sources of growth and evaluating them in cost order is what turns a brainstorm into a strategy.`,
    mistakes: [
      "Listing ideas with no structure or ordering.",
      "Starting with new products, the most expensive option.",
      "Ignoring capital and capacity constraints.",
      "Not establishing what growth objective is actually being pursued.",
    ],
    tags: ["growth", "Ansoff", "cross-sell", "market development", "framework"],
    related: ["cons-c-profitability", "cons-c-market-entry", "cons-c-ma"],
    sources: [
      casebook(CASEBOOK_FINAL, 11, "Growth Strategy Overall Strategy: preliminary questions and the four notes on situation, customers, resources and risk."),
      adapted("Original growth-source enumeration and evaluation ordering."),
    ],
  }),

  // ------------------------------------------------------------------ M&A
  c({
    id: "cons-c-ma",
    category: "M&A",
    title: "Mergers and acquisitions cases",
    difficulty: "Hard",
    body: `Should the client acquire this target? The casebook organises the answer around two attractiveness assessments.

**Market attractiveness**
- What is the market size?
- What is the market growth rate?
- What are average profit margins in the market?
- How available and strong are substitutes?

**Company attractiveness** — the target itself: its financials, market position, capabilities, customer base, and the quality of what you would be buying.

**The full structure**

1. **Objective.** Why acquire? Revenue synergy, cost synergy, capability, market access, defensive, or eliminating a competitor. The objective determines what counts as a good deal.
2. **Market attractiveness** — size, growth, margins, substitutes, competitive intensity.
3. **Target attractiveness** — financials, position, assets, people, customers, technology.
4. **Synergies** — where value is actually created:
   - *Cost synergies* — overlapping functions, procurement scale, facility consolidation. More reliable and easier to quantify.
   - *Revenue synergies* — cross-selling, distribution access, bundling. Frequently overestimated.
5. **Valuation and price** — what is it worth, and what are we paying? A good company at a bad price is a bad deal, and this is the point candidates most often skip.
6. **Integration risk** — culture, systems, retention of key people. Most failed acquisitions fail here rather than in the analysis.
7. **Alternatives** — could we build it, partner, or license instead? Acquisition is the most expensive and least reversible option.
8. **Risks and exit.**

**The two points that distinguish a strong answer**

*Price.* The question is never "is this a good company" but "is this a good deal at this price". Any target is attractive at some price and unattractive at another.

*Integration.* Cost synergies mostly materialise; revenue synergies often do not; and integration reliably costs more and takes longer than modelled. Applying scepticism to revenue synergies is the mark of someone who has thought about this seriously.`,
    example: `Acquiring a competitor for cost synergies: overlapping distribution and procurement scale are quantifiable and reliable. Claimed revenue synergies from cross-selling should be discounted heavily. The deal's merit then rests on whether the cost synergies alone justify the price paid — which is usually the honest test.`,
    relevance: `M&A cases test whether you can evaluate a decision rather than describe a company. Raising price and integration risk unprompted is what separates a structured answer from a checklist.`,
    mistakes: [
      "Assessing the target without ever discussing price.",
      "Accepting revenue synergies at face value.",
      "Ignoring integration risk.",
      "Not considering build or partner as alternatives.",
    ],
    tags: ["M&A", "synergies", "valuation", "integration", "market attractiveness"],
    related: ["cons-c-market-entry", "cons-c-growth", "cons-c-formulas"],
    sources: [
      casebook(CASEBOOK_FINAL, 12, "Mergers & Acquisition Overall Strategy: market attractiveness and company attractiveness questions."),
      adapted("Extended structure with synergy typology, price and integration commentary."),
    ],
  }),

  // ------------------------------------------------------------------ GUESSTIMATES
  c({
    id: "cons-c-guesstimate-method",
    category: "Market Sizing",
    title: "Solving guesstimates and market sizing",
    difficulty: "Medium",
    body: `A guesstimate combines logical guessing and estimation. The casebook is explicit that the aim is **not** to find an exact answer — it is to explain your reasoning clearly. You are graded on making valid assumptions, securing the interviewer's agreement with your approach, and walking them through structured thinking.

**The method**

1. **Clarify the scope.** Ask what exactly is being asked, and define exclusions. Estimating coffee shops in a city — branded outlets only, or independent cafés too? Scoping sets the boundaries and is where the first marks are.
2. **Segment the problem.** Break it into smaller parts.
   - **Identify a starting point** — population, area, number of households.
   - **Identify bottlenecks** that limit capacity and flow — checkout counters in a store, seats in a restaurant. These are excellent starting points for supply-constrained problems.
   - **Segment on relevance** — by income, or urban versus rural, where the segments genuinely behave differently.
3. **Calculate**, keeping track of your working so you can catch mistakes and revise assumptions.
4. **Magnitude-check against industry benchmarks.**

**Top-down versus bottom-up**

*Top-down* starts from a large number and narrows: population → segment → penetration → usage. *Bottom-up* builds from a unit: one outlet's sales × number of outlets. Where both are available, doing both and comparing is the strongest possible answer — two independent methods agreeing is far more convincing than one method executed precisely.

**Demand-side versus supply-side**

Some problems are demand-constrained (how many people want this?) and some are supply-constrained (how many can be served?). The pizza-outlet question is supply-constrained — the oven is the bottleneck — while a market-size question is demand-constrained. Choosing the right direction is most of the difficulty.

**The sanity check is not optional**

Every estimate must end with a plausibility test: does this imply a sensible per-capita figure, a sensible market value, a sensible number relative to something known? An estimate presented without a check reads as a calculation rather than a judgement.

**Round aggressively.** Use 1.4 billion, not 1,428,627,663. Round numbers make the arithmetic tractable and keep attention on the structure, which is what is being assessed. Getting lost in decimals is a real way to fail a guesstimate.`,
    example: `Trees on a university campus: clarify whether landscaped trees only or all vegetation. Segment the campus by land use — residential, academic, roads, open ground. Estimate area and tree density per type. Multiply and sum. Then check: does the implied trees-per-hectare figure resemble a park, a forest or a car park?`,
    relevance: `Guesstimates appear in nearly every consulting and many product interviews. The scoring is entirely on structure and assumption quality, which means the sanity check and the explicit assumptions matter more than the arithmetic.`,
    mistakes: [
      "Starting to calculate before clarifying scope.",
      "Assumptions stated without justification.",
      "No sanity check at the end.",
      "Carrying too many significant figures.",
      "Segmenting on a dimension that does not change behaviour.",
    ],
    tags: ["guesstimate", "market sizing", "top-down", "bottom-up", "assumptions", "sanity check"],
    related: ["cons-c-formulas", "pm-gs-atms-india", "cons-gs-tea-cups"],
    sources: [
      casebook(CASEBOOK_IITK, 60, "Section 5.1 'How to Solve Guesstimates' sets out the clarify-scope, segment, bottleneck and magnitude-check method used here."),
      adapted("Extended with top-down versus bottom-up, demand versus supply framing, and original commentary."),
    ],
  }),

  // ------------------------------------------------------------------ FORMULAS
  c({
    id: "cons-c-formulas",
    category: "Formulas",
    title: "Formulas and jargon you are expected to know",
    difficulty: "Medium",
    body: `Case interviews assume a working vocabulary of business arithmetic. You are not expected to be an accountant, but hesitating over contribution margin costs credibility.

**Profitability**

\`\`\`
Profit            = Revenue - Cost
Gross profit      = Revenue - COGS
Gross margin %    = (Revenue - COGS) / Revenue
Operating profit  = Gross profit - Operating expenses      (EBIT)
Net profit        = Operating profit - Interest - Tax
Contribution      = Price - Variable cost per unit
Contribution margin % = Contribution / Price
Break-even units  = Fixed costs / Contribution per unit
\`\`\`

**Contribution margin is the one that matters most in cases.** It tells you whether one more unit sold helps, and it is the basis of every break-even and pricing question.

**Growth and returns**

\`\`\`
Growth %  = (Current - Prior) / Prior
CAGR      = (End / Start)^(1/years) - 1
ROI       = (Gain - Cost) / Cost
Payback   = Investment / Annual cash flow
Market share = Client revenue / Total market revenue
\`\`\`

**Customer economics**

\`\`\`
CAC  = Total acquisition spend / New customers acquired
LTV  = ARPU x Gross margin % x Average customer lifetime
     = (ARPU x Gross margin %) / Churn rate      for subscriptions
LTV:CAC — a ratio around 3:1 is the commonly used health benchmark
\`\`\`

**Vocabulary that gets used without explanation**

| Term | Meaning |
|---|---|
| COGS | direct cost of producing what you sold |
| EBITDA | earnings before interest, tax, depreciation, amortisation |
| Working capital | current assets minus current liabilities |
| Economies of scale | unit cost falls as volume rises |
| Fixed vs variable | does the cost move with volume? |
| Cannibalisation | a new product taking sales from your own existing one |
| Elasticity | how much demand moves when price moves |
| Take rate | the platform's share of transaction value |
| Churn | share of customers lost in a period |
| Value chain | the sequence from raw input to end customer |

**Arithmetic discipline in a case.** Round aggressively, write your working so you can retrace it, state the units, and sanity-check the result before presenting it. Announcing "that gives roughly 40 million, which is about 3% of the market — that seems plausible" is worth more than the number alone.`,
    example: `A client selling at 500 with variable cost 300 has contribution of 200 per unit, a 40% contribution margin. With fixed costs of 10 million, break-even is 50,000 units. If they currently sell 35,000, the gap is what the case is really about.`,
    relevance: `Fluency here is assumed rather than tested directly, and hesitation is noticed. Contribution margin, break-even and LTV:CAC are the three that come up most.`,
    mistakes: [
      "Confusing gross margin with contribution margin.",
      "Forgetting that fixed costs do not change per unit but fixed cost *per unit* does.",
      "Quoting LTV without netting off gross margin.",
      "Presenting a number without units or a sanity check.",
    ],
    tags: ["formulas", "contribution margin", "break-even", "CAGR", "LTV", "CAC", "jargon"],
    related: ["cons-c-profitability", "cons-c-pricing", "cons-c-guesstimate-method"],
    sources: [
      casebook(CASEBOOK_FINAL, 123, "The casebook's Appendix collects commonly used formulas and jargon for case interviews."),
      adapted("Expanded with worked definitions and original commentary."),
    ],
  }),

  // ------------------------------------------------------------------ COMMUNICATION
  c({
    id: "cons-c-communication",
    category: "Structuring",
    title: "Communicating in a case: synthesis and recommendation",
    difficulty: "Medium",
    body: `How you communicate is graded as heavily as what you conclude, because communication *is* the consulting deliverable.

**Answer first.** Lead with the conclusion, then support it. "I recommend entering the market, for three reasons" — then the reasons. Building up to a conclusion at the end works in an essay and fails in a case, because the interviewer is listening for whether you can brief a partner in thirty seconds.

**Signpost.** Say what you are about to do before you do it, so the interviewer can follow and redirect you early rather than watching you go the wrong way.

**Synthesise, do not summarise.** A summary lists what happened; a synthesis says what it means. "We looked at revenue and cost, then segments" is a summary. "The decline is entirely in one region, driven by a distribution failure rather than demand" is a synthesis.

**The recommendation structure**

1. **The recommendation**, in one sentence.
2. **Two or three reasons**, each with a number attached.
3. **The main risk**, and how you would mitigate it.
4. **Next steps** — what you would do first, and what you would want to know.

Naming a risk unprompted is what makes a recommendation credible. A recommendation with no acknowledged downside sounds like advocacy rather than analysis.

**Handling being wrong.** Interviewers frequently push back to see how you respond. The right reaction is neither to collapse nor to dig in: acknowledge the point, consider it genuinely, and either update your view with a reason or explain why you still hold it. Changing your mind when given new information is a strength; changing it under mere social pressure is not.

**Thinking time.** Asking for thirty seconds to structure your thoughts is entirely acceptable and better than talking while you think. Use it, then present a structure rather than a stream.

**Numbers out loud.** State what you are calculating and why before doing it, then state the result with units and a sanity check. Silent arithmetic leaves the interviewer unable to follow — and unable to give you credit for the parts you got right.`,
    example: `Closing a profitability case: "I recommend a two-stage cost programme. First, procurement consolidation, which addresses the largest cost line and is achievable within a quarter. Second, distribution redesign, which is slower but structural. The main risk is that supplier consolidation reduces resilience, so I would keep a second source for critical inputs. I would start by validating the procurement savings against actual supplier contracts."`,
    relevance: `Communication is what the interviewer is left with. Two candidates with identical analysis are separated entirely by whether they led with the answer and named a risk.`,
    mistakes: [
      "Building to the conclusion instead of leading with it.",
      "Summarising rather than synthesising.",
      "A recommendation with no risk acknowledged.",
      "Doing arithmetic silently.",
      "Abandoning a correct position under pushback.",
    ],
    tags: ["communication", "synthesis", "recommendation", "answer first", "signposting"],
    related: ["cons-c-structuring", "cons-c-interview-formats", "cons-c-profitability"],
    sources: [
      casebook(CASEBOOK_FINAL, 3, "The interviewer-expectations section emphasises confidence and the effectiveness of the communicated solution."),
      adapted("Original structure for synthesis and recommendation."),
    ],
  }),
];
