import { casebook, common, questionsFor, CASEBOOK_KTC, CASEBOOK_FINAL } from "../helpers";
import type { DeepDiveItem } from "../types";

const q = questionsFor("CONSULTING", "consulting-cases", "CASE");

/**
 * Consulting interview cases from the KTC 2025 Business Casebook, which
 * describes its transcripts as actual business case study problems curated from
 * the IIT Guwahati alumni base.
 *
 * Company attribution comes ONLY from the running header printed on each case's
 * own pages (`Category | Company | Difficulty`), never from the book's index —
 * the index's columns are misaligned in the extracted text, and reading company
 * names from it would produce fabricated attributions.
 *
 * Prompts are our own concise restatements. All framework commentary, analysis
 * and teaching notes are original. No transcript is reproduced.
 */

export const CONSULTING_CASES: DeepDiveItem[] = [
  // =========================================================== PROFITABILITY
  q({
    id: "cons-case-fan-company",
    category: "Profitability",
    title: "Fan manufacturer wants to improve gross margin",
    difficulty: "Easy",
    sourceType: "CASEBOOK_INTERVIEW_CASE",
    company: "BCG",
    confidence: "high",
    q: "Your client manufactures ceiling and table fans in India and wants to improve its gross profit margin. How would you approach this?",
    hint: "Clarify the product, the competitive position and the market's price sensitivity before structuring — because one of those will close off an entire branch.",
    answer:
      "I would clarify what kind of fans, how competitive the market is and what share the client holds, and whether they have any differentiation. Here: standard ceiling and table fans with basic regulators and no advanced features, a moderately competitive market dominated by national players with the client at around 12% share, and no meaningful differentiation. That establishes a mid-range player in a price-sensitive market with elastic demand — which means raising prices is not available. So the two levers are differentiation on the revenue side and cost optimisation across the value chain on the expense side.",
    detail:
      "**Why the clarifying questions matter here**\n\nFour questions establish the constraint that shapes the whole case:\n\n| Question | Answer | Consequence |\n|---|---|---|\n| What kind of fans? | standard, basic regulators | no premium positioning today |\n| How competitive, what share? | moderately competitive, ~12% | not a leader, not marginal |\n| Any differentiation? | none | cannot command a premium |\n| Geography? | three plants, national distribution | logistics is in scope |\n\nA price-sensitive market with elastic demand and an undifferentiated product means **a price increase would lose more volume than it gains in margin**. Establishing that before proposing anything is what makes the rest of the answer credible — and it is why the case resolves into differentiation plus cost rather than pricing.\n\n**The structure**\n\n*Revenue side — differentiation.* Premium competitors already offer BLDC motors, IoT-enabled controls and better aesthetics. Investing in R&D for more energy-efficient, quieter and better-designed fans would allow repositioning in urban markets, where willingness to pay for efficiency is higher.\n\n*Cost side — the value chain.* Three stages hold the bulk of the cost:\n\n1. **Procurement.** Copper, aluminium and plastics are the key inputs. Long-term bulk contracts and vendor consolidation reduce unit cost. This is usually the fastest-acting lever.\n2. **Manufacturing.** Leaner operations and selective automation reduce waste. Modular parts shared across models simplify production and lower per-unit cost — this is the structurally interesting one, because component commonality compounds across the range.\n3. **Distribution.** Route planning, clustering vendors near plants, and a hub-and-spoke warehousing model cut transport cost. Lighter, cheaper packaging saves on both material and shipping.\n\n**The recommendation shape**\n\nShort term: a cost-reduction programme across procurement, manufacturing and distribution, which improves margin directly. Medium to long term: differentiate through energy-efficient and modern designs to justify a premium. That sequencing balances immediate margin against sustainable positioning, and separating the two horizons is what makes it a recommendation rather than a list.\n\n**The tension worth naming**\n\nR&D investment raises cost in the short run while the differentiation strategy is meant to raise margin in the long run. The case explicitly asks where in the value chain to cut cost to fund it — so the two halves are not independent, and saying so is better than presenting them as parallel options.\n\n**Modular design is the answer to remember**\n\nSharing components across models reduces procurement complexity, inventory, and manufacturing changeover simultaneously. It is a single lever affecting three cost lines, which is exactly the kind of answer that stands out from generic cost-cutting.",
    mistakes: [
      "Proposing a price increase in a demonstrably price-sensitive market.",
      "Cost cutting without establishing whether the problem is revenue or cost.",
      "Treating differentiation and cost reduction as unrelated when one funds the other.",
      "Generic cost-cutting rather than value-chain-specific levers.",
    ],
    followUps: [
      "Where in the value chain would you cut cost to fund the R&D?",
      "How would you avoid the cost programme damaging product quality?",
      "What would make you reconsider the differentiation strategy?",
    ],
    tags: ["profitability", "gross margin", "value chain", "differentiation", "manufacturing", "BCG"],
    related: ["cons-c-profitability", "cons-c-pricing", "cons-case-clothing-fashion"],
    sources: [casebook(CASEBOOK_KTC, 21, "Case 1 'Fan Company', page header: Profitability | BCG | Easy.")],
  }),
  q({
    id: "cons-case-clothing-fashion",
    category: "Profitability",
    title: "Fashion brand with declining profits",
    difficulty: "Medium",
    sourceType: "CASEBOOK_INTERVIEW_CASE",
    company: "BCG",
    confidence: "high",
    q: "A major national fashion brand with offline outlets and an e-commerce presence has declining profits. Find the cause and propose a plan.",
    hint: "Establish revenue versus cost early, and whether the industry is affected — both answers close off large branches.",
    answer:
      "I would first establish whether the problem is on the revenue or the cost side, and whether the industry as a whole is affected. Here revenues are stable and the decline is cost-related, while the broader fashion industry has grown at around 7% CAGR over two years — so this is client-specific and cost-driven, which eliminates demand, competition and market factors in two questions. I would then break the cost side down by value chain: R&D and raw material sourcing, inventory and storage, transportation and distribution, and outsourcing and marketing — starting with transportation and distribution, since those often drive significant cost in a nationally distributed retail business.",
    detail:
      "**Two questions that eliminate most of the tree**\n\n1. **Revenue or cost?** Revenues stable, costs the issue. That removes the entire demand-side branch.\n2. **Industry-wide or client-specific?** The industry grew ~7% CAGR while the client declined. Client-specific, so external factors are out.\n\nThis is the profitability framework working exactly as intended, and it demonstrates why those preliminary questions come before any structure.\n\n**The cost value chain**\n\n```\nR&D and raw material sourcing\n  → Inventory and storage\n    → Transportation and distribution\n      → Outsourcing and marketing\n```\n\nStarting with transportation and distribution is a reasonable prioritisation for a business with nationwide physical outlets plus e-commerce fulfilment — but the prioritisation should be *stated as a hypothesis*, not assumed. \"I'll start with distribution because a national physical footprint makes it likely to be material, but I'd want to confirm it is a large cost line\" is the correct form.\n\n**Where the case leads**\n\nTransportation and storage costs are higher than competitors'. Investigating the distribution network: major factories in Hyderabad and Chennai with head offices in both, shipping nationally. Geographic detail matters here — the client is strong across much of India but weaker in the north, and sales there are relatively weak. So goods travel long distances to regions that generate less revenue, which is a structurally expensive arrangement.\n\nA regulatory change compounds it: a state government revised toll structures a year earlier, with roads being expanded but tolls increased. Each truck traverses roughly 600 km through that state at around ₹200 per toll with multiple tolls along the route.\n\n**The analytical shape**\n\nThis case rewards connecting three facts that arrive separately — factories concentrated in the south, weak sales in the north, and a toll increase on the route between them. Individually each is minor; together they explain a structural cost problem. Actively looking for how the facts relate, rather than evaluating each in isolation, is the skill being tested.\n\n**Recommendation directions**\n\n- **Network redesign** — regional warehousing or a northern distribution hub to shorten the long haul.\n- **Route optimisation** — avoid or minimise the high-toll corridor.\n- **Reassess the northern market** — if sales there are weak and serving it is expensive, the question is whether to invest in growing it or reduce the cost of serving it. Those are genuinely different strategies and the choice depends on the market's potential.\n- **Mode shift** — rail for long-haul primary movement, road for last mile.\n\n**The strategic question underneath**\n\nThe honest issue is whether the northern region is worth serving at current volumes. Framing it that way — rather than only optimising the cost of a possibly-unjustified activity — is the more valuable contribution.",
    mistakes: [
      "Investigating demand when revenue is confirmed stable.",
      "Evaluating facts in isolation rather than connecting them.",
      "Optimising distribution cost without asking whether the northern market justifies the activity.",
      "Prioritising a cost line without confirming it is material.",
    ],
    followUps: [
      "Should the client keep serving the northern region at all?",
      "How would you quantify the toll impact?",
      "What would a regional warehouse cost against the savings?",
    ],
    tags: ["profitability", "cost", "distribution", "logistics", "retail", "value chain", "BCG"],
    related: ["cons-c-profitability", "cons-case-fan-company", "cons-c-formulas"],
    sources: [casebook(CASEBOOK_KTC, 23, "Case 2 'Clothing Fashion', page header: Profitability | BCG | Medium.")],
  }),
  q({
    id: "cons-case-profitability-generic",
    category: "Profitability",
    title: "Structuring any profitability decline",
    difficulty: "Medium",
    q: "A client's profits have declined over the last two years. Structure your approach.",
    hint: "Preliminary questions before structure. Then one clean decomposition, and let the data choose the branch.",
    answer:
      "Five preliminary questions first: the client's objective, the quantum of the decline, how long it has been going on, whether it is industry-wide or client-specific, and an understanding of the client's product, geography and place in the value chain. Then decompose: Profit equals Revenue minus Cost, Revenue equals Price times Volume, Volume equals Market size times Market share, Cost splits into fixed and variable. Ask which side moved, then which sub-branch, and let the answers direct the investigation rather than working through every branch.",
    detail:
      "**The preliminary questions and why each matters**\n\n| Question | Why |\n|---|---|\n| Objective | restoring prior margin and maximising profit are different problems |\n| Quantum | 2% and 40% are different cases |\n| Duration | gradual points at structural drift; sudden points at an event |\n| Industry-wide? | **the highest-value question** — halves the problem |\n| Client understanding | product, geography, value-chain position frame everything |\n\n**The decomposition**\n\n```\nProfit  = Revenue − Cost\n\nRevenue = Price × Volume\n  Volume = Market size × Market share\n\nCost    = Fixed + Variable\n  Variable = Cost per unit × Volume\n```\n\n**Reading the answers**\n\n| Finding | Next |\n|---|---|\n| Revenue stable, cost up | go straight to the value chain |\n| Volume down, market flat | share loss — competition, distribution, product |\n| Volume down, market down | industry decline — external |\n| Price down | discounting, mix shift, competitive pressure |\n| Variable cost up | inputs, suppliers, yield, wastage |\n| Fixed cost up | capacity, overhead, a one-off |\n\n**The mix trap**\n\nAverage realised price can fall with no individual price changing, if the sales mix shifted toward cheaper products. Similarly, average cost per unit can rise through mix rather than through any cost increasing. Checking mix separately from rates is the analytical move that distinguishes a strong candidate, and it is easy to miss because the averages look like clean evidence.\n\n**The value chain for the cost side**\n\nProcurement → manufacturing → inventory → distribution → sales and marketing → service. Locate which stage grew, then investigate that stage.\n\n**Fixed cost per unit**\n\nWorth being careful with: total fixed cost does not change with volume, but fixed cost *per unit* rises as volume falls. So a volume decline shows up as a margin decline even with every cost unchanged. Candidates regularly misdiagnose this as a cost problem when it is a volume problem.\n\n**The close**\n\nName the driver with its share of the decline, separate the immediate lever from the structural one, quantify the expected recovery, and state the main risk. A recommendation without a number cannot be prioritised.",
    mistakes: [
      "Structuring before asking the preliminary questions.",
      "Working through every branch instead of following the data.",
      "Missing a mix effect.",
      "Misreading rising fixed cost per unit as a cost problem.",
    ],
    followUps: [
      "Revenue is flat and profit is down. Where do you go?",
      "Average price fell but no price changed. What happened?",
    ],
    tags: ["profitability", "framework", "decomposition", "value chain", "mix effect"],
    related: ["cons-c-profitability", "cons-c-structuring", "cons-c-formulas"],
    sources: [
      casebook(CASEBOOK_FINAL, 5, "Profitability Framework Overview and preliminary questions."),
      common("Profitability structuring is the most frequently published case type across consulting preparation resources."),
    ],
  }),

  // =========================================================== MARKET ENTRY
  q({
    id: "cons-case-market-entry-generic",
    category: "Market Entry",
    title: "Should the client enter this market?",
    difficulty: "Medium",
    q: "A client is considering entering a new market. How would you advise them?",
    hint: "Establish the decision criterion before analysing anything, and have a concrete method for estimating market share.",
    answer:
      "First establish the decision criterion — what metric decides this, and what would make it a yes. Then why this market, why this product and whether it is a commodity or differentiable, why this geography, and which part of the value chain the client wants to occupy. Then assess market attractiveness, competition, the client's own capability, barriers, entry mode, and the financials. For market share, rather than guessing I would use one of three proxies: ask the interviewer directly, use the most recent entrant's share as a benchmark, or — best — use the share the client itself achieved in the first year of a previously entered geography.",
    detail:
      "**The preliminary questions**\n\n- What is the decision criterion for entering?\n- Why does the client want to enter? Any specific reason?\n- Understand the product — commodity or differentiable?\n- Why this geography?\n- Which part of the value chain?\n\nThe **commodity versus differentiable** question shapes everything downstream. In a commodity market you compete on cost and distribution, so entry needs a structural cost advantage and a niche is not viable. In a differentiable market you can enter on product or brand and a niche is a legitimate strategy.\n\n**The structure**\n\n1. **Market attractiveness** — size, growth, margins, segments, unmet needs.\n2. **Competition** — concentration, incumbent strength, likely response to entry.\n3. **Client capability** — product fit, distribution, brand, capital, talent.\n4. **Barriers** — regulation, capital intensity, distribution access, switching costs, IP.\n5. **Entry mode** — build, acquire, joint venture, license, partner.\n6. **Financials** — investment, expected share and revenue, break-even, NPV.\n7. **Risks and exit.**\n\n**The three market-share proxies**\n\nThis is the concrete technique most candidates lack:\n\n| Proxy | When |\n|---|---|\n| Ask the interviewer | always try first — they often have a number |\n| Last entrant's first-year share | a market benchmark for entry difficulty |\n| **The client's own first-year share elsewhere** | **best — uses demonstrated capability** |\n\nThe third is strongest because it reflects this client's actual execution rather than a generic benchmark. Asking \"has the client entered another geography before, and what share did they take in year one?\" is a question few candidates think to ask.\n\n**Competitive response is the commonly missed factor**\n\nIncumbents do not stand still. A well-capitalised incumbent can cut price to make entry unprofitable, and the entrant's business case must survive that. Asking \"how would the incumbent respond, and does our case still work if they cut price 15%?\" is a strong move.\n\n**Entry mode deserves real attention**\n\nBuilding is slow but retains control and margin. Acquiring is fast but expensive and carries integration risk. A joint venture shares risk and local knowledge but dilutes control. Licensing is capital-light and gives away the customer relationship. The right mode depends on how time-critical entry is and how much local knowledge the client lacks.\n\n**The recommendation**\n\nAnswer first — enter or not — then the reasons with numbers, then the main risk and mitigation, then next steps. And a conditional recommendation is legitimate: \"enter, but only via a joint venture, and only if we can secure distribution access before committing capital.\"",
    mistakes: [
      "Analysing before establishing the decision criterion.",
      "Guessing at market share with no proxy.",
      "Ignoring competitive response.",
      "Not considering entry mode.",
    ],
    followUps: [
      "How would you estimate the share we could win?",
      "What if the incumbent cuts price by 15% on entry?",
      "Build, buy or partner?",
    ],
    tags: ["market entry", "market share", "entry mode", "competitive response", "framework"],
    related: ["cons-c-market-entry", "cons-c-ma", "cons-gs-market-sizing-method"],
    sources: [
      casebook(CASEBOOK_FINAL, 6, "Market Entry Framework Overview, preliminary questions and the three market-share proxies."),
      common("Market entry is among the most frequently published case types."),
    ],
  }),
  q({
    id: "cons-case-airport-taxi",
    category: "Market Entry",
    title: "Airport taxi service entry",
    difficulty: "Easy",
    sourceType: "CASEBOOK_INTERVIEW_CASE",
    company: "BCG",
    confidence: "high",
    q: "A client is considering entering the airport taxi market. Should they, and how?",
    hint: "Airport transport has structural features ordinary taxi markets do not — think about who controls access.",
    answer:
      "I would establish the decision criterion and then assess the market, but the distinguishing feature of airport taxi services is that access is usually controlled: airports grant concessions, allocate ranks, and often run tenders. So the binding question is not whether demand exists — it plainly does — but whether the client can obtain the right to serve it. I would size the demand from passenger throughput and ground-transport mode share, assess the competitive set including app-based operators and public transport, and then focus on the concession or licensing route, since that is the actual barrier.",
    detail:
      "**Sizing the demand**\n\n```\nAnnual passengers through the airport\n  × share arriving (versus departing, for pickup demand)\n  × share using taxis (versus private car, bus, metro, ride-hailing)\n  × trips per passenger\n  = annual taxi trips\n  × average fare = market value\n```\n\nMode share is the assumption to defend, and it varies enormously with whether the airport has a rail link — an airport metro can take a very large share of ground transport and fundamentally changes the market size.\n\n**Why access is the real question**\n\nAirport ground transport is typically regulated by the airport operator through concessions, designated ranks, and permits. That produces a market with:\n\n- **High entry barriers** — you cannot simply start operating.\n- **Limited competitors** — often a small number of licensed operators.\n- **Better economics than street taxi** — captive demand, higher fares, less deadheading on the inbound leg.\n\nSo this is a **regulatory access** case dressed as a market entry case. Identifying that reframes the whole analysis and is the strongest move available.\n\n**The demand characteristics that matter**\n\n- **Highly peaked** by flight schedule — capacity must cover peaks that are idle at other times.\n- **One-directional imbalance** — many trips out of the airport, fewer in, so vehicles either deadhead back or wait.\n- **Price-insensitive segment** — business travellers with luggage and time pressure will pay a premium.\n- **Predictable** — flight schedules are known in advance, which makes supply planning far easier than in general taxi operations.\n\nThat last point is a genuine competitive advantage worth naming: airport demand is one of the few taxi markets where you can forecast reliably.\n\n**Competitive set**\n\nExisting licensed operators, app-based ride-hailing (which may or may not have airport access rights), airport buses and rail, hotel shuttles, and private car with parking. Ride-hailing's access position is the key uncertainty — if they have unrestricted pickup rights, the concession is worth much less.\n\n**Entry modes**\n\nBid for a concession at the next tender; acquire an existing licence holder; partner with one; or operate on the drop-off side only where restrictions are usually lighter. The acquisition route is often the realistic one when concessions run for long terms.\n\n**The recommendation**\n\nShould be conditional: enter *if* concession access can be secured on acceptable terms, since without it the demand analysis is irrelevant. Structuring the recommendation around the binding constraint rather than the attractive market is what makes it a consultant's answer.",
    mistakes: [
      "Treating it as a general taxi market and ignoring access rights.",
      "Sizing demand without checking whether a rail link exists.",
      "Ignoring the directional imbalance and peaking in the capacity plan.",
      "An unconditional recommendation when access is the binding constraint.",
    ],
    followUps: [
      "The airport has a metro link. How does that change your sizing?",
      "Ride-hailing has unrestricted pickup rights. Is the concession still worth having?",
      "How would you handle the peak capacity problem?",
    ],
    tags: ["market entry", "regulation", "concession", "transport", "capacity", "BCG"],
    related: ["cons-c-market-entry", "cons-case-market-entry-generic", "rca-q-marketplace-imbalance"],
    sources: [casebook(CASEBOOK_KTC, 73, "Case 15 'Airport Taxi', page header: Market Entry | BCG | Easy.")],
  }),

  // =========================================================== PRICING
  q({
    id: "cons-case-pricing-generic",
    category: "Pricing",
    title: "Pricing a new product",
    difficulty: "Medium",
    q: "A client is launching a new product and needs to decide the price. How would you approach it?",
    hint: "Three approaches bound the answer between a floor and a ceiling. Do not treat them as alternatives.",
    answer:
      "I would use all three approaches together rather than choosing one. Cost-based pricing establishes the floor — cost plus a margin, or break-even — and tells you what you cannot go below. Value-based pricing establishes the ceiling by quantifying what the product is worth to the customer, bounded by substitutes. Competitive pricing then positions you within that range: lower to gain share, higher if the brand supports it, or equal while competing on experience. Then I would test the recommendation against elasticity, competitive response and the product's life-cycle stage.",
    detail:
      "**The three as bounds, not options**\n\n```\nCost-based    → the FLOOR    — cannot sustain below this\nValue-based   → the CEILING  — customers will not pay above this\nCompetitive   → POSITION within the range\n```\n\nPresenting them this way is markedly stronger than describing three methods to pick from, and it makes the recommendation follow naturally from the analysis.\n\n**Cost-based**\n\nCost-plus and break-even. Simple, and insufficient alone — but it establishes the lower limit and forces you to understand the cost structure, which you need for every other part of the case.\n\n**Value-based**\n\nQuantify the customer's gain: cost saved, time saved, revenue enabled, risk avoided. Then bound it by substitutes — a customer will not pay more than the next-best alternative costs them. The important nuance is that value-based pricing is a function of the **target segment**, and the wider the segment, the lower the aspirational value. A product positioned for everyone cannot command a premium, which is a real strategic constraint rather than a pricing detail.\n\n**Competitive**\n\n| Posture | Used by |\n|---|---|\n| Lower | firms with scale economies, sometimes pricing some lines unprofitably to attract customers toward more profitable ones |\n| Higher | well-established brands |\n| Equal | firms differentiating on experience rather than price |\n\n**The factors to weigh**\n\nTotal costs both fixed and variable; market conditions including price wars, product life cycle, seasonality and availability; strategic position — cost advantage or benefit advantage; the unique selling point; government policy and regulation; and changing consumer expectations.\n\n**Elasticity is the analytical core**\n\nIf demand is elastic, a price rise loses more volume than it gains in margin. The break-even volume change for a price move is computable:\n\n```\nBreak-even volume change % = −Δprice / (contribution margin % + Δprice)\n```\n\nSo a 10% price cut on a 40% contribution margin requires a 33% volume increase just to stand still. Being able to produce that number changes a pricing discussion from opinion to arithmetic, and it is the single most useful pricing calculation to know.\n\n**Penetration versus skimming**\n\nPenetration — price low to gain share fast, viable where scale economies or network effects exist. Skimming — price high initially and reduce over time, viable where early adopters are price-insensitive. The choice depends on whether share now creates a durable advantage.\n\n**Competitive response**\n\nA price cut invites matching, and a price war destroys margin for everyone. Any pricing recommendation should state what happens if the competitor matches, and whether the client's cost position lets them survive that.",
    mistakes: [
      "Using cost-plus alone.",
      "Treating the three approaches as mutually exclusive.",
      "Recommending a price change without computing the break-even volume change.",
      "Ignoring competitive response.",
    ],
    followUps: [
      "What volume increase would a 10% price cut need to break even?",
      "What if the competitor matches your price?",
      "Penetration or skimming here, and why?",
    ],
    tags: ["pricing", "value-based", "cost-based", "elasticity", "penetration", "skimming"],
    related: ["cons-c-pricing", "cons-c-formulas", "cons-c-profitability"],
    sources: [
      casebook(CASEBOOK_FINAL, 9, "Pricing Strategy Framework Overview: the three approaches and the factors influencing price."),
      common("Pricing case structuring is widely published across consulting preparation resources."),
    ],
  }),

  // =========================================================== GROWTH
  q({
    id: "cons-case-growth-generic",
    category: "Growth",
    title: "Client wants to grow revenue",
    difficulty: "Medium",
    q: "A client wants to double revenue in three years. How would you advise them?",
    hint: "Enumerate the sources of growth, then evaluate them in order of cost rather than in order of excitement.",
    answer:
      "I would establish the growth objective and constraints first — why doubling, in what timeframe, with what capital and capacity. Then enumerate where growth can come from: existing customers buying more often, buying more per purchase, or buying adjacent products; new customers in existing or new segments and geographies; new products to either group; and inorganic growth through acquisition or partnership. Then evaluate in cost order, starting with existing customers, since they are the cheapest to reach and the analytics to find the opportunity already exist.",
    detail:
      "**Preliminary questions**\n\n- What market trends and opportunities should we leverage?\n- How do we compare to competitors, and what is our unique value proposition?\n- Who are the target customers and what do they need?\n- What are the growth objectives, short and long term?\n\nAnd four things to establish: the current situation, market, competitors and financial health; customer needs; how budget, personnel and technology will support the strategy; and the risks with mitigation.\n\n**The enumeration**\n\n```\nExisting customers → more often\n                   → more per purchase\n                   → adjacent products (cross-sell)\n                   → higher tier (up-sell)\nNew customers      → existing segments\n                   → new segments\n                   → new geographies\nNew products       → to existing customers\n                   → to new customers\nInorganic          → acquire · partner · license\n```\n\nThis maps to the **Ansoff matrix** — penetration, market development, product development, diversification — in increasing risk order.\n\n**Evaluate in cost order**\n\n| Source | Cost | Risk |\n|---|---|---|\n| Existing customers, more often | lowest | lowest |\n| Cross-sell and up-sell | low | low |\n| New customers, existing segment | medium | medium |\n| New geography | high | high |\n| New product | high | high |\n| Acquisition | highest | highest |\n\nCandidates who open with \"launch a new product\" have skipped every cheaper option. Working up the list, and saying why, is the structure.\n\n**Is doubling even feasible?**\n\nThis question deserves testing rather than accepting. Doubling in three years is roughly 26% CAGR. If the market grows at 5%, doubling means taking substantial share from competitors, entering new markets, or launching new products — organic penetration alone cannot deliver it. Doing that arithmetic early and saying what it implies is a strong, quantitative opening that most candidates miss.\n\n**Constraints**\n\nCapital, capacity, talent and time. A growth plan the client cannot fund or staff is not a plan. Asking what capital is available before recommending an acquisition is basic diligence.\n\n**Risks**\n\nCannibalisation — a new product taking sales from an existing one, so gross growth overstates net. Margin dilution — growth into lower-margin segments raises revenue and can reduce profit. Execution capacity — growing faster than the operation can serve degrades the customer experience and can reverse the growth.\n\n**The recommendation**\n\nA sequenced plan rather than a menu: which levers first, what each contributes toward the target, what it costs, and what the main risk is. Showing that the levers *sum to the target* is what turns a list into a plan.",
    mistakes: [
      "Listing ideas with no ordering.",
      "Starting with the most expensive options.",
      "Not testing whether the growth target is arithmetically feasible.",
      "Ignoring cannibalisation and margin dilution.",
    ],
    followUps: [
      "What CAGR does doubling in three years require?",
      "The market grows at 5%. Where does the rest come from?",
      "How would you avoid cannibalising the existing product?",
    ],
    tags: ["growth", "Ansoff", "cross-sell", "CAGR", "cannibalisation", "framework"],
    related: ["cons-c-growth", "cons-c-formulas", "cons-c-market-entry"],
    sources: [
      casebook(CASEBOOK_FINAL, 11, "Growth Strategy Overall Strategy: preliminary questions and supporting notes."),
      common("Growth strategy structuring is widely published across consulting preparation resources."),
    ],
  }),

  // =========================================================== M&A
  q({
    id: "cons-case-ma-generic",
    category: "M&A",
    title: "Should the client acquire this target?",
    difficulty: "Hard",
    q: "A client is considering acquiring a competitor. Should they proceed?",
    hint: "The question is never whether it is a good company. It is whether it is a good deal at this price.",
    answer:
      "I would start with the objective — why acquire, since revenue synergy, cost synergy, capability acquisition and defensive motives lead to different analyses. Then assess market attractiveness: market size, growth rate, average margins, and the availability and strength of substitutes. Then target attractiveness: financials, position, capabilities, customers. Then the part candidates skip — synergies quantified separately for cost and revenue, the price being paid, and integration risk. A good company at a bad price is a bad deal, and most failed acquisitions fail in integration rather than in analysis.",
    detail:
      "**Market attractiveness**\n\n- Market size\n- Market growth rate\n- Average profit margins in the market\n- Availability and strength of substitutes\n\n**Company attractiveness** — the target's own financials, market position, capabilities, customer base and assets.\n\n**Synergies, separated**\n\n| Type | Examples | Reliability |\n|---|---|---|\n| **Cost** | overlapping functions, procurement scale, facility consolidation | high — quantifiable and largely within your control |\n| **Revenue** | cross-selling, distribution access, bundling | low — frequently overestimated |\n\nApplying real scepticism to revenue synergies is the mark of a serious answer. Cost synergies mostly materialise because they depend on decisions you control; revenue synergies depend on customers behaving as hoped.\n\n**Price is the question most candidates never ask**\n\nAny target is attractive at some price and unattractive at another. The analysis is not \"is this a good company\" but \"does the value created exceed the price paid\". If the acquirer pays the full present value of the synergies, all the value transfers to the seller's shareholders — which is the standard explanation for why acquisitions so often fail to create value for the buyer.\n\n**Integration risk**\n\nCulture, systems, key-person retention, customer overlap and disruption. Integration reliably costs more and takes longer than modelled, and it is where most deals actually fail. Naming a retention plan for key people is a concrete, credible detail.\n\n**Alternatives**\n\nCould the client build it, partner, license, or acquire a smaller target? Acquisition is the most expensive and least reversible option, so the alternatives deserve explicit consideration before recommending it.\n\n**Regulatory**\n\nAcquiring a competitor raises competition-authority questions in concentrated markets. A deal that cannot be approved, or that is approved subject to divestments, has a different value entirely.\n\n**The recommendation**\n\nConditional recommendations are legitimate and often correct: \"Proceed, but only below a price of X, contingent on securing retention agreements with the target's engineering leadership and on competition clearance.\" That is a more useful answer than an unqualified yes, and it demonstrates that you have identified what the deal actually depends on.",
    mistakes: [
      "Evaluating the target without discussing price.",
      "Accepting revenue synergies at face value.",
      "Ignoring integration risk.",
      "Not considering build or partner alternatives.",
      "Overlooking competition-authority approval.",
    ],
    followUps: [
      "At what price does this stop being a good deal?",
      "Which synergies would you actually underwrite?",
      "Could the client build this instead?",
    ],
    tags: ["M&A", "synergies", "valuation", "integration", "regulatory", "framework"],
    related: ["cons-c-ma", "cons-c-market-entry", "cons-c-formulas"],
    sources: [
      casebook(CASEBOOK_FINAL, 12, "Mergers & Acquisition Overall Strategy: market and company attractiveness questions."),
      common("M&A case structuring is widely published across consulting preparation resources."),
    ],
  }),

  // =========================================================== UNCONVENTIONAL
  q({
    id: "cons-case-unconventional",
    category: "Unconventional",
    title: "Handling an unconventional case",
    difficulty: "Hard",
    q: "You are given a case with no obvious framework — a social problem, an unusual client, or an abstract question. How do you approach it?",
    hint: "The absence of a framework is the point. Build a structure from the objective rather than reaching for a memorised one.",
    answer:
      "Unconventional cases exist precisely to see what you do when no framework fits, so the worst response is forcing a profitability tree onto a problem that is not about profit. I would establish the objective and what success would look like, identify the stakeholders and what each wants, and build a structure from the problem's own logic — usually by decomposing the objective into the factors that drive it. Then quantify wherever possible, prioritise using the Pareto principle, and recommend with the same discipline as any other case.",
    detail:
      "**Why these are set**\n\nThe casebook devotes a substantial section to unconventional cases — public-sector problems, social questions, abstract situations. They exist to distinguish candidates who have *memorised frameworks* from candidates who can *think structurally*, and forcing a standard framework onto them is the single most visible failure.\n\n**The general method**\n\n1. **Objective.** What are we actually trying to achieve, and how would we know we had? For a social problem this is often the hardest and most valuable part — \"reduce road accidents\" needs to become a measurable objective before anything else.\n2. **Stakeholders.** Who is affected, and what does each want? Public-sector problems almost always have conflicting stakeholder objectives, and naming the conflict is analytical progress.\n3. **Decompose the objective** into its drivers, the same way you would decompose profit. Road accidents decompose into vehicles × distance × accident rate per km, and the accident rate decomposes into driver, vehicle, road and environmental factors.\n4. **Quantify** wherever you can, even roughly. A structure with numbers attached beats a qualitative list.\n5. **Prioritise** — the Pareto principle applies here as much as anywhere.\n6. **Recommend**, with feasibility and cost considered.\n\n**The transferable insight**\n\nEvery case structure is really \"decompose the objective into its drivers, find which driver matters, and act on it\". Profitability, market entry and pricing frameworks are just pre-built instances of that. Once you see it that way, an unconventional case is not harder — it just requires you to build the tree yourself, which is what the interviewer wants to watch.\n\n**Non-commercial objectives**\n\nFor a public or social problem, the objective may be welfare, access, safety or equity rather than profit — but the method is identical. Cost-effectiveness ratios (cost per life saved, cost per additional person reached) are the equivalent of margin analysis and are what let you compare options.\n\n**What to avoid**\n\n- Reciting a framework that does not fit.\n- Freezing because no framework applies.\n- Staying entirely qualitative when the problem could be quantified.\n- Ignoring feasibility — a recommendation nobody can implement is not a recommendation.\n\n**What to do if genuinely stuck**\n\nSay what you are thinking rather than going silent, and ask a clarifying question. Interviewers respond well to \"I do not think a standard framework fits here — let me build a structure from the objective\", because it names exactly what they are testing for.",
    mistakes: [
      "Forcing a profitability framework onto a non-commercial problem.",
      "Freezing because no framework applies.",
      "Staying qualitative where quantification is possible.",
      "Ignoring implementation feasibility.",
    ],
    followUps: [
      "How would you quantify a social objective?",
      "The stakeholders want conflicting things. How do you decide?",
    ],
    tags: ["unconventional", "structuring", "public sector", "stakeholders", "Pareto"],
    related: ["cons-c-structuring", "cons-c-interview-formats", "cons-c-communication"],
    sources: [
      casebook(CASEBOOK_KTC, 159, "The casebook's Unconventional case category spans public-sector and abstract problems of this kind."),
      common("Non-standard case handling is discussed across consulting preparation resources."),
    ],
  }),
];
