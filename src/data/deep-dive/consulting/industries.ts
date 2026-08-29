import { conceptsFor, casebook, adapted, CASEBOOK_KTC } from "../helpers";
import type { DeepDiveItem } from "../types";

const base = conceptsFor("CONSULTING", "industry-primers");

/**
 * Industry primers.
 *
 * The KTC 2025 Business Casebook publishes 30 industry reports covering value
 * chains, revenue and cost segments, industry challenges, PESTEL and Porter
 * analysis, and industry-specific keywords. These records follow that structure
 * and cite it, but the content is written by us as original teaching notes —
 * the casebook's reports are not reproduced.
 *
 * Primers are CONCEPT-family content: they are knowledge you bring into a case,
 * not interview questions, so none is presented as one.
 */

const primer = (input: Parameters<typeof base>[0]): DeepDiveItem => ({
  ...base(input),
  contentType: "INDUSTRY_PRIMER",
});

export const INDUSTRY_PRIMERS: DeepDiveItem[] = [
  primer({
    id: "ind-ecommerce",
    category: "Consumer",
    title: "E-commerce",
    difficulty: "Medium",
    body: `**Value chain**
Sourcing and seller onboarding → cataloguing → warehousing and inventory → order management → last-mile delivery → returns and reverse logistics → customer service.

**Revenue drivers**
- Commission or take rate on marketplace GMV
- Owned-inventory margin on first-party sales
- Advertising — increasingly the largest profit pool, since it is nearly pure margin
- Logistics and fulfilment services sold to sellers
- Subscription memberships
- Financial services and payments

**Cost drivers**
- Logistics and last-mile delivery, the dominant variable cost
- Warehousing and inventory holding
- Customer acquisition
- Returns processing, which can destroy the margin on a category entirely
- Payment gateway fees
- Technology and platform

**Demand drivers**
Internet and smartphone penetration, disposable income, urbanisation, trust in online payment, delivery speed and reliability, assortment breadth, and price relative to offline.

**The economics that define the industry**
Contribution margin per order is thin and heavily dependent on order value and delivery density. A dense urban route with high-value orders is profitable; a rural single-item low-value delivery is usually not. Growth in orders is therefore not automatically good — the mix matters more than the count.

**Returns are the structural problem in apparel.** Return rates of 25–40% are normal, and each return incurs reverse logistics, inspection, repackaging and often markdown. A category can be revenue-positive and contribution-negative purely through returns.

**Common case angles**
Profitability decline (usually mix, returns or delivery cost), market entry into a new category or geography, take-rate pricing, competing with quick commerce, and whether to hold inventory or run a pure marketplace.

**Keywords**
GMV, take rate, AOV, contribution margin per order, cohort retention, RTO (return to origin), reverse logistics, dark store, fill rate, seller GMV concentration.`,
    example: `A common case shape: revenue growing, profit falling. Decompose into orders × AOV × contribution per order. Orders are up, AOV down, and the mix has shifted toward a low-value high-return category — so growth is actively destroying margin, and the recommendation is about category mix rather than cost cutting.`,
    relevance: `E-commerce cases are extremely common, and the discriminating knowledge is that advertising is the profit pool and returns are the margin killer — neither is obvious from the outside.`,
    mistakes: [
      "Treating GMV growth as success without checking contribution margin.",
      "Ignoring returns in apparel and footwear.",
      "Missing advertising as the actual profit engine.",
    ],
    tags: ["ecommerce", "GMV", "take rate", "returns", "logistics", "marketplace"],
    related: ["ind-food-delivery", "ind-fmcg", "cons-c-profitability"],
    sources: [
      casebook(CASEBOOK_KTC, 366, "Industry Primer 127 'ECommerce'."),
      adapted("Original teaching note following the casebook's value-chain and driver structure."),
    ],
  }),
  primer({
    id: "ind-food-delivery",
    category: "Consumer",
    title: "Food delivery",
    difficulty: "Medium",
    body: `**Value chain**
Restaurant onboarding → menu and catalogue → demand generation → order placement → restaurant preparation → rider assignment and pickup → delivery → ratings and support.

**Three-sided marketplace:** customers, restaurants and delivery partners. Every analysis must cover all three, because the failures usually originate in the two people forget.

**Revenue drivers**
- Commission from restaurants, typically 15–25% of order value
- Delivery fees from customers
- Advertising and priority placement sold to restaurants — high margin
- Subscription memberships offering free or discounted delivery
- Surge and small-order fees

**Cost drivers**
- Delivery partner payouts, the largest variable cost by a wide margin
- Discounts and promotions, often the second largest
- Customer acquisition
- Support and refunds
- Technology and dispatch infrastructure

**The economics**
Contribution margin per order is measured in tens of rupees, not hundreds. It is highly sensitive to delivery distance, order value, batching (delivering two orders on one trip) and discount intensity. This is why the industry's central strategic question is density: more orders per square kilometre means shorter trips, more batching, and better rider utilisation.

**Peak concentration** is the operational constraint. Demand concentrates into roughly four hours a day, so capacity must be sized for peak and is idle otherwise. Nearly every operational problem in this industry — long delivery times, unassigned orders, rider shortages — is a peak problem rather than an average one.

**Common case angles**
Profitability per order, reducing delivery time, restaurant churn, rider supply and retention, expanding into a new city, and competing with quick commerce for the same riders.

**Keywords**
AOV, contribution margin per order, batching, rider utilisation, fill rate, unassigned orders, dark kitchen, take rate, delivery radius, peak-hour capacity.`,
    example: `"Delivery times have increased." The instinct is to look at riders. The decomposition — accept, prepare, rider wait, transit — often shows the growth is in restaurant preparation at peak, which is a supply-side partner problem the platform can only influence indirectly through forecasting and incentives.`,
    relevance: `Food delivery appears constantly in Indian consulting and product interviews. The three-sided structure and the density argument are the two things that separate an informed answer from a generic marketplace one.`,
    mistakes: [
      "Analysing only the customer side.",
      "Treating order growth as success without contribution margin.",
      "Using average delivery time rather than by zone and hour.",
    ],
    tags: ["food delivery", "three-sided marketplace", "density", "batching", "unit economics"],
    related: ["ind-ecommerce", "pm-case-swiggy-metrics", "rca-q-delivery-times"],
    sources: [
      casebook(CASEBOOK_KTC, 370, "Industry Primer 131 'Food Delivery'."),
      adapted("Original teaching note following the casebook's structure."),
    ],
  }),
  primer({
    id: "ind-fmcg",
    category: "Consumer",
    title: "FMCG",
    difficulty: "Medium",
    body: `**Value chain**
Raw material sourcing → manufacturing → primary distribution to depots → secondary distribution to distributors → wholesale and retail → consumer.

**Revenue drivers**
Volume × price, where volume is driven by distribution reach (how many outlets stock you), shelf presence, brand pull, and pack-size strategy. FMCG revenue is fundamentally a distribution game — a superior product with inferior reach loses.

**Cost drivers**
- Raw materials and packaging, highly commodity-price sensitive
- Advertising and promotion, a large and semi-discretionary line
- Distribution and logistics
- Trade margins to distributors and retailers
- Manufacturing overhead

**The defining characteristics**
- **Low ticket, high frequency.** Purchase decisions are habitual and low-involvement, so brand and availability matter more than features.
- **Distribution is the moat.** Reaching millions of small outlets is expensive and slow to build, and it is why incumbents are hard to displace.
- **Price points are sticky.** In India, hitting a ₹5 or ₹10 price point matters more than the exact gram weight, so **grammage reduction** is the standard response to input cost inflation rather than a price increase.
- **Margins are thin but volumes are enormous**, so small percentage improvements are large absolute sums.

**Rural versus urban** is the standard segmentation, with different pack sizes, price points, distribution models and media. Sachets and small packs exist to hit affordable price points and drive trial.

**Common case angles**
Declining market share, launching a new product, entering rural markets, responding to a competitor's price cut, input cost inflation, and channel conflict between traditional trade, modern trade and e-commerce.

**Keywords**
Grammage, price point, sachet, distribution reach, numeric and weighted distribution, primary and secondary sales, trade margin, ASP, general trade, modern trade, direct reach.`,
    example: `Input costs rise 15%. Raising the price breaks a psychological price point and loses volume disproportionately. The standard industry answer is to reduce grammage while holding the price — and the case is about how much reduction consumers will tolerate before switching.`,
    relevance: `FMCG is a staple of Indian consulting interviews. The grammage-versus-price-point insight and the primacy of distribution are the two pieces of industry knowledge that most improve an answer.`,
    mistakes: [
      "Recommending a price increase without considering price-point psychology.",
      "Treating distribution as a detail rather than the core competitive asset.",
      "Confusing primary sales (to distributors) with secondary sales (to consumers).",
    ],
    tags: ["FMCG", "distribution", "grammage", "price point", "rural", "trade margin"],
    related: ["ind-ecommerce", "cons-c-pricing", "cons-c-profitability"],
    sources: [
      casebook(CASEBOOK_KTC, 369, "Industry Primer 130 'FMCG'."),
      adapted("Original teaching note following the casebook's structure."),
    ],
  }),
  primer({
    id: "ind-banking",
    category: "Financial",
    title: "Banking",
    difficulty: "Medium",
    body: `**How a bank makes money**

\`\`\`
Net Interest Income = Interest earned on assets − Interest paid on deposits
Net Interest Margin (NIM) = Net Interest Income / Average earning assets
Total income = Net Interest Income + Fee and other income
Profit = Total income − Operating cost − Credit cost (provisions) − Tax
\`\`\`

**Revenue drivers**
- Net interest margin, driven by the mix of low-cost deposits and high-yield loans
- **CASA ratio** — current and savings account deposits as a share of total. CASA is cheap funding, so a high CASA ratio structurally improves NIM. This is the single most important funding metric.
- Fee income — cards, transactions, distribution of insurance and mutual funds, forex, advisory
- Loan book growth

**Cost drivers**
- Cost of funds
- Operating cost — branches, staff, technology. Measured as the **cost-to-income ratio**.
- **Credit cost** — provisions for loans that go bad. This is what turns a good year into a bad one.

**The defining risk**
Banking is a leveraged business in which credit quality dominates outcomes. A bank can grow its loan book impressively for years and lose all of it in one credit cycle. **NPAs** (non-performing assets) are therefore the metric that matters most, and growth in lending without a corresponding view of underwriting quality is a warning sign rather than a success.

**Regulation is a first-class constraint**, not a background factor: capital adequacy requirements, priority-sector lending targets, provisioning norms and liquidity ratios all directly shape what a bank can do.

**Common case angles**
Improving NIM, reducing NPAs, growing CASA, digital transformation and branch rationalisation, competing with fintechs and NBFCs on lending, and cross-selling to the existing base.

**Keywords**
NIM, CASA, NPA and GNPA, provision coverage ratio, cost-to-income, CAR (capital adequacy), CRR and SLR, priority sector lending, credit cost, spread.`,
    example: `A bank's profit is falling while its loan book grows. Decompose: NIM is compressing because deposit costs rose faster than lending yields, and credit cost is rising as an earlier growth cohort seasons. Growth was the *cause*, not the cure — which is the counterintuitive shape banking cases often take.`,
    relevance: `Financial services cases require this vocabulary. CASA, NIM and credit cost are used without explanation, and NPAs are usually where the case is actually going.`,
    mistakes: [
      "Treating loan growth as unambiguously good.",
      "Ignoring credit cost when analysing profitability.",
      "Not knowing what CASA is or why it matters.",
    ],
    tags: ["banking", "NIM", "CASA", "NPA", "credit cost", "regulation"],
    related: ["ind-asset-management", "ind-asset-management", "cons-c-formulas"],
    sources: [
      casebook(CASEBOOK_KTC, 363, "Industry Primer 124 'Banking'."),
      adapted("Original teaching note following the casebook's structure."),
    ],
  }),
  primer({
    id: "ind-asset-management",
    category: "Financial",
    title: "Asset management",
    difficulty: "Hard",
    body: `**Value chain**
Fund raising from institutional mandates and retail flows → product structuring (mutual funds, ETFs, PMS, AIF, PE/VC) → trading and execution, liquidity and collateral management, NAV calculation and fund accounting → distribution through brokers, banks, advisers and direct apps → client service, reporting, stewardship and audit.

**Revenue segments**
1. **Management fees** — a percentage of AUM. The core, and it scales with market levels as well as with flows.
2. **Performance fees** — incentive or carry, in alternatives.
3. **Advisory fees** — consulting and wealth.
4. **Distribution** — platform and trail income.
5. **Other** — securities lending, data.

**Cost segments**
People (portfolio managers, analysts, sales), technology and market data, distribution fees to partners and platforms, operations and administration (custody, fund admin, audit), and compliance and regulatory overhead.

**The industry's structural challenges**
- **Fee pressure.** Passive adoption compresses active management fees continuously. This is a secular trend, not a cycle.
- **Alpha scarcity.** Efficient markets make consistent outperformance difficult, and capacity constraints mean strategies that work stop working at scale.
- **Distribution concentration.** Platforms and banks are gatekeepers and wield pricing power; acquisition costs rise.
- **Regulatory burden.** Disclosure, valuation, liquidity and stewardship rules escalate compliance cost.
- **Market volatility.** Flows are pro-cyclical — money arrives after good performance and leaves after bad, which is exactly backwards for returns and destabilising for the business.
- **Data and technology costs.**

**Porter's forces are unusually informative here.** Supplier power is high because scarce quant and PM talent and critical data vendors have leverage. Buyer power is high because institutional RFPs squeeze fees and retail has abundant low-cost choices. Substitutes are strong — direct indexing, passive ETFs, target-date funds and robo-advisers. Rivalry is intense.

**Keywords**
AUM, NAV, expense ratio, TER, alpha, beta, active share, SIP, AIF, PMS, ETF, trail commission, carry, high-water mark, stewardship.`,
    example: `Revenue is a percentage of AUM, and AUM moves with both flows and market levels. So a fund house's revenue can fall in a market downturn with no client lost at all — which means a revenue decline must be decomposed into market movement versus net flows before any conclusion is drawn.`,
    relevance: `Asset management appears in financial services cases, and the fee-pressure and pro-cyclical-flow dynamics are the two things that make its economics distinctive.`,
    mistakes: [
      "Treating an AUM-driven revenue fall as a client-loss problem without separating market movement.",
      "Ignoring passive substitution as a structural rather than cyclical pressure.",
      "Overlooking distributor power over pricing.",
    ],
    tags: ["asset management", "AUM", "expense ratio", "passive", "fee pressure", "flows"],
    related: ["ind-banking", "cons-c-profitability", "cons-c-formulas"],
    sources: [
      casebook(CASEBOOK_KTC, 361, "Industry Primer 122 'Asset Management', including its revenue and cost segments, challenges and Porter analysis."),
      adapted("Original teaching note; the casebook's report is not reproduced."),
    ],
  }),
  primer({
    id: "ind-automobile",
    category: "Industrial",
    title: "Automobile",
    difficulty: "Medium",
    body: `**Value chain**
Raw materials (steel, aluminium, lithium) and component imports → manufacturing and assembly, increasingly including EV battery lines → packaging, warehousing and battery-safe storage → outbound logistics and dealer distribution → dealer networks, online sales and financing tie-ups → after-sales service and spares.

**Revenue drivers**
- Vehicle sales volume × average selling price
- Variant and trim mix — higher trims carry disproportionately better margin
- **Spares and service**, which is a far higher-margin and more stable revenue stream than vehicle sales
- Financing and insurance commissions
- Exports

**Cost drivers**
Raw materials and components (the dominant line, and commodity-price exposed), manufacturing overhead in a highly capital-intensive plant, R&D, dealer margins, marketing, and warranty provisions.

**The economics**
Extremely capital intensive with high fixed costs, so **capacity utilisation dominates profitability**. A plant running at 60% and one at 90% have completely different unit economics with identical products. Volume decline therefore hits margin much harder than the revenue fall alone suggests, because fixed cost per unit rises.

**After-sales is where the profit is.** Vehicle sale margins are thin and competitive; spares and service margins are high and recurring. A manufacturer's installed base is an annuity, which is why case answers about automotive profitability should look at service attachment and parts, not only at units sold.

**The EV transition** is the structural story: different supply chain (batteries, rare earths), different cost curve, fewer moving parts and therefore less service revenue, new charging infrastructure dependency, and heavy policy influence through subsidies and emissions rules. The reduced service revenue is the under-discussed consequence and a good point to raise.

**Common case angles**
Falling market share, capacity utilisation, EV transition strategy, dealer network profitability, entering a new segment or geography, and localisation of components.

**Keywords**
Capacity utilisation, contribution per vehicle, variant mix, dealer inventory days, after-sales attachment rate, localisation, BOM cost, EV penetration, ICE.`,
    example: `Volumes fall 10% and profit falls 40%. That gap is operating leverage: fixed costs are unchanged, so fixed cost per unit rises and margin compresses far faster than revenue. Recognising the leverage rather than hunting for a cost increase is the correct diagnosis.`,
    relevance: `Automotive cases are common, and the two distinguishing insights are that capacity utilisation drives profitability and that after-sales carries the margin.`,
    mistakes: [
      "Missing operating leverage when volume falls.",
      "Focusing only on vehicle sales and ignoring the service annuity.",
      "Treating the EV transition purely as a product change rather than a supply chain and revenue-model change.",
    ],
    tags: ["automobile", "capacity utilisation", "operating leverage", "after-sales", "EV"],
    related: ["ind-evs", "cons-c-profitability", "cons-c-formulas"],
    sources: [
      casebook(CASEBOOK_KTC, 362, "Industry Primer 123 'Automobile'."),
      adapted("Original teaching note following the casebook's structure."),
    ],
  }),
  primer({
    id: "ind-evs",
    category: "Energy",
    title: "Electric vehicles",
    difficulty: "Medium",
    body: `**Value chain**
Battery cells and raw materials (lithium, cobalt, nickel) → battery pack assembly → vehicle manufacturing → distribution and dealers → charging infrastructure → after-sales and battery servicing → end-of-life recycling.

**What makes EV economics different from ICE**
- **The battery is 30–40% of vehicle cost**, so the whole industry's cost curve tracks battery prices. This single fact drives most EV strategy.
- **Fewer moving parts** means lower service requirements — which cuts the manufacturer's after-sales annuity, historically a major profit source.
- **Higher upfront price, lower running cost.** The purchase decision therefore depends on total cost of ownership over a holding period, not sticker price.
- **Charging infrastructure is a complement** the manufacturer often does not control, and adoption is gated by it.
- **Policy dependence** is unusually high: purchase subsidies, tax treatment, emissions mandates and local manufacturing incentives materially change demand.

**Demand drivers**
Total cost of ownership versus petrol, fuel price levels, charging availability, range and range anxiety, subsidy levels, model availability in the buyer's segment, and resale value confidence — which is weak while battery degradation is poorly understood by buyers.

**Segment matters enormously in India.** Two- and three-wheeler electrification is far ahead of four-wheeler, because the TCO case is stronger (high daily usage, low upfront price gap), charging is simpler, and range requirements are modest. A generic EV answer that does not distinguish segments misses the actual market.

**Common case angles**
Should a manufacturer enter EVs and in which segment, charging infrastructure investment, battery sourcing and localisation, pricing against ICE equivalents, and fleet electrification for commercial operators.

**Keywords**
TCO, range anxiety, kWh cost, battery pack, charging infrastructure, FAME/PLI incentives, battery swapping, degradation, residual value.`,
    example: `Commercial fleets electrify before private buyers because high daily running converts a lower per-kilometre cost into payback within a short period. A TCO calculation with the fleet's actual daily distance is the analysis that decides the case — and it explains why three-wheeler and delivery fleets lead adoption.`,
    relevance: `EV cases are increasingly common. The battery-cost dominance, the TCO framing and the loss of service revenue are the three points that distinguish an informed answer.`,
    mistakes: [
      "Comparing sticker prices instead of total cost of ownership.",
      "Treating EVs as one market rather than distinguishing two-, three- and four-wheelers.",
      "Ignoring that reduced servicing removes a profit stream for manufacturers.",
    ],
    tags: ["EV", "battery", "TCO", "charging", "subsidy", "adoption"],
    related: ["ind-automobile", "cons-c-market-entry", "cons-c-pricing"],
    sources: [
      casebook(CASEBOOK_KTC, 368, "Industry Primer 129 'EVs'."),
      adapted("Original teaching note following the casebook's structure."),
    ],
  }),
  primer({
    id: "ind-airlines",
    category: "Infrastructure",
    title: "Airlines",
    difficulty: "Medium",
    body: `**The economics in one line**
An airline sells a perishable inventory of seats with very high fixed costs, so the entire business is about filling seats at the best achievable yield.

\`\`\`
Revenue    = ASK × Load factor × Yield
  ASK      = Available Seat Kilometres (capacity)
  Load factor = seats filled / seats available
  Yield    = revenue per passenger kilometre
RASK       = revenue per available seat km
CASK       = cost per available seat km
Profit per seat km = RASK − CASK
\`\`\`

**Cost drivers**
- **Fuel**, typically 30–40% of operating cost, and volatile
- Aircraft lease or ownership and financing
- Crew and staff
- Maintenance
- Airport charges and navigation fees
- Distribution and commissions

**The defining characteristics**
- **Perishable inventory.** An empty seat at departure is revenue lost forever, which is why yield management and last-minute pricing exist.
- **Very high fixed costs.** Once a flight is scheduled, most of its cost is committed regardless of load, so the marginal passenger is nearly pure contribution. This drives aggressive discounting to fill seats — rational per flight, destructive industry-wide.
- **Fuel and currency exposure.** Fuel is priced in dollars while much revenue is local, creating a double exposure for non-US carriers.
- **Route economics vary enormously.** Profitability is a route-level question, not an airline-level one; a carrier can be profitable overall while a third of its routes lose money.

**Business models**
Full-service carriers compete on network, connections and premium cabins; low-cost carriers on a single aircraft type, high utilisation, point-to-point routes, and unbundled ancillaries. **Ancillary revenue** — baggage, seat selection, food, priority — is a major and high-margin profit source for LCCs.

**Common case angles**
Route profitability and network rationalisation, fleet decisions, responding to fuel price rises, entering a new route, ancillary revenue strategy, and turnaround-time improvement.

**Keywords**
ASK, RPK, load factor, yield, RASK, CASK, turnaround time, aircraft utilisation, ancillary revenue, hub-and-spoke, point-to-point, slots.`,
    example: `"Should we add this route?" is answered at route level: expected load factor × yield × frequency against route-specific cost, including whether the aircraft could earn more elsewhere. The opportunity cost of the aircraft is the part candidates forget, and it often decides the answer.`,
    relevance: `Airline cases require the ASK/load factor/yield decomposition. Without it the analysis has nowhere to go; with it the case structures itself.`,
    mistakes: [
      "Analysing airline profitability at company level rather than route level.",
      "Ignoring aircraft utilisation and the opportunity cost of the asset.",
      "Overlooking ancillary revenue in a low-cost model.",
    ],
    tags: ["airlines", "load factor", "yield", "RASK", "CASK", "ancillary revenue"],
    related: ["ind-automobile", "cons-c-profitability", "pm-case-flight-delay"],
    sources: [
      casebook(CASEBOOK_KTC, 359, "Industry Primer 120 'Airlines'."),
      adapted("Original teaching note following the casebook's structure."),
    ],
  }),
  primer({
    id: "ind-telecom",
    category: "Technology",
    title: "Telecom",
    difficulty: "Medium",
    body: `**Value chain**
Spectrum acquisition → network build (towers, fibre, spectrum deployment) → network operations → distribution and retail → customer acquisition → service and billing.

**Revenue drivers**
- **ARPU** (average revenue per user) × subscriber base
- Data consumption and plan mix
- Postpaid versus prepaid mix, with postpaid carrying higher ARPU and lower churn
- Enterprise services, fixed broadband, and increasingly digital services bundled in
- Tower and infrastructure sharing revenue

**Cost drivers**
- Network capital expenditure — enormous and continuous, since each generation requires a new build
- Spectrum acquisition and licence fees
- Network operating cost — energy, backhaul, maintenance
- Subscriber acquisition, including handset subsidies and channel commissions
- Regulatory levies

**The defining economics**
Extremely capital intensive with very low marginal cost per additional user once the network exists. That combination produces intense competition for scale, because the player with the most subscribers spreads a fixed network cost furthest. It also produces price wars, since the marginal cost of carrying one more customer is close to zero — which is rational per decision and ruinous in aggregate.

**Churn is the central operational metric.** Number portability makes switching easy, and acquiring a replacement subscriber costs far more than retaining an existing one. Prepaid churn is structurally higher than postpaid.

**The strategic tension:** data volumes grow relentlessly while ARPU does not, so operators carry more traffic for the same revenue. Monetising data beyond connectivity — content, enterprise, cloud, financial services — is the industry's persistent question.

**Common case angles**
ARPU improvement, churn reduction, network investment prioritisation, spectrum bidding strategy, rural expansion economics, and bundling digital services.

**Keywords**
ARPU, churn, MNP, subscriber base, capex intensity, spectrum, backhaul, tower sharing, data per user, postpaid mix.`,
    example: `A price war leaves everyone with more subscribers and less profit. The correct framing is that the marginal cost of a subscriber is near zero, so competing on price is individually rational and collectively destructive — which is why consolidation follows, and why case answers should consider industry structure rather than only the client's move.`,
    relevance: `Telecom cases test whether you understand high-fixed-cost, near-zero-marginal-cost economics — a structure shared with software and infrastructure businesses.`,
    mistakes: [
      "Treating subscriber growth as success without ARPU.",
      "Ignoring capex intensity when recommending network expansion.",
      "Analysing the client's pricing move without anticipating competitor response.",
    ],
    tags: ["telecom", "ARPU", "churn", "capex", "spectrum", "price war"],
    related: ["ind-it-services", "cons-c-pricing", "cons-c-profitability"],
    sources: [
      casebook(CASEBOOK_KTC, 372, "Industry Primer from the casebook's telecom report."),
      adapted("Original teaching note following the casebook's structure."),
    ],
  }),
  primer({
    id: "ind-it-services",
    category: "Technology",
    title: "IT services",
    difficulty: "Medium",
    body: `**The business model**
Sell skilled hours or outcomes to enterprise clients. Revenue is fundamentally people × utilisation × billing rate, which makes it a talent and pricing business rather than a capital one.

\`\`\`
Revenue = Billable headcount × Utilisation × Realised rate × Hours
Margin  = (Realised rate − Cost per hour) / Realised rate
\`\`\`

**Revenue drivers**
- Headcount and utilisation
- Billing rate, driven by skill mix and geography
- **Onsite versus offshore mix** — onsite bills more but costs far more; offshore carries better margin
- Contract type — time and materials versus fixed price versus outcome-based
- Client mining: growing existing accounts is far cheaper than new logos

**Cost drivers**
Salaries (the overwhelming majority), recruitment and training, attrition replacement, travel and visa costs, sales and bid costs, and facilities.

**The defining metrics**
- **Utilisation** — billable hours as a share of available. A few points of utilisation is the difference between a good and a poor quarter.
- **Attrition** — replacing a skilled engineer costs recruitment, ramp time and often client disruption. High attrition is both a cost and a delivery risk.
- **Pyramid structure** — the ratio of junior to senior staff. A bottom-heavy pyramid is cheaper per hour; a top-heavy one erodes margin. Managing the pyramid is a core lever most candidates have never heard of.
- **Revenue per employee** — the summary productivity measure.

**The structural tension**
Linear growth: more revenue traditionally required proportionally more people. Automation, platforms and outcome-based pricing are attempts to break that linearity, and the industry's strategic narrative is largely about non-linear revenue.

**Common case angles**
Margin improvement, attrition reduction, moving up the value chain from staffing to consulting, pricing model shift to outcome-based, entering a new vertical, and automation's effect on the model.

**Keywords**
Utilisation, bench, pyramid, onsite-offshore mix, attrition, revenue per employee, T&M, fixed price, SOW, client mining, non-linear revenue.`,
    example: `Margin is falling while revenue grows. Decompose: rate realisation is flat, utilisation is flat, but the pyramid has become top-heavy as juniors left and seniors were retained — so cost per billable hour rose with no rate increase. The fix is a hiring and pyramid problem, not a pricing one.`,
    relevance: `IT services is a large Indian employer and a common case subject. Utilisation, pyramid and onsite-offshore mix are the three levers, and the pyramid is the one candidates almost never know.`,
    mistakes: [
      "Ignoring utilisation and the bench.",
      "Missing the pyramid as a margin lever.",
      "Treating headcount growth as success without revenue per employee.",
    ],
    tags: ["IT services", "utilisation", "pyramid", "attrition", "offshore", "billing rate"],
    related: ["ind-telecom", "cons-c-profitability", "cons-c-formulas"],
    sources: [
      casebook(CASEBOOK_KTC, 374, "Industry Primer from the casebook's IT services report."),
      adapted("Original teaching note following the casebook's structure."),
    ],
  }),
  primer({
    id: "ind-edtech",
    category: "Consumer",
    title: "EdTech",
    difficulty: "Medium",
    body: `**Value chain**
Content creation → platform and delivery technology → marketing and demand generation → sales and counselling → teaching and delivery → assessment → outcomes and placement.

**Revenue drivers**
Course fees, subscriptions, test-prep programmes, certification and degree partnerships, B2B sales to institutions, and enterprise upskilling.

**Cost drivers**
- **Customer acquisition cost**, which in this industry is unusually high and often the largest single line
- Content production
- Teacher and instructor cost, especially in live-teaching models
- Sales and counselling teams
- Technology and platform

**The defining economics**
LTV:CAC is the whole business. Education purchases are typically infrequent and one-off — a student buys a test-prep course once — so unlike a subscription product there is limited repeat revenue to amortise a high acquisition cost against. That makes CAC discipline existential rather than merely important, and it explains much of the sector's financial difficulty.

**Completion and outcomes are the real product.** Enrolment is easy to grow and easy to sell; completion rates in online education are notoriously low. Since word of mouth and referral depend on outcomes, low completion undermines the cheapest acquisition channel and forces reliance on paid marketing — a self-reinforcing loop that raises CAC further.

**Model variants and their economics**
- *Recorded content* — high gross margin, low completion.
- *Live cohort teaching* — better completion, but teacher cost scales with students, so margin is capped.
- *Hybrid* — most common compromise.
- *B2B and institutional* — longer sales cycles, better retention, lower CAC per learner.

**Common case angles**
Reducing CAC, improving completion and retention, pricing and financing options, expanding to new subjects or geographies, and shifting from B2C to B2B.

**Keywords**
CAC, LTV, completion rate, enrolment, cohort, ARPU, counselling conversion, churn, outcome rate, placement rate.`,
    example: `Revenue grows while losses widen. Decompose CAC by channel and cohort: paid acquisition scaled while referral share fell, because completion — and therefore satisfaction — declined. Growth was bought rather than earned, and the fix is in the product and outcomes rather than in the marketing budget.`,
    relevance: `EdTech cases are common and hinge on unit economics. The insight that low completion raises CAC through the referral channel is the connection that distinguishes a strong answer.`,
    mistakes: [
      "Analysing enrolment growth without CAC or completion.",
      "Treating completion as a delivery detail rather than a growth driver.",
      "Assuming repeat purchase where the category is genuinely one-off.",
    ],
    tags: ["edtech", "CAC", "LTV", "completion", "cohort", "unit economics"],
    related: ["ind-ecommerce", "cons-c-growth", "cons-c-formulas"],
    sources: [
      casebook(CASEBOOK_KTC, 367, "Industry Primer 128 'EdTech'."),
      adapted("Original teaching note following the casebook's structure."),
    ],
  }),
  primer({
    id: "ind-cement",
    category: "Industrial",
    title: "Cement",
    difficulty: "Medium",
    body: `**Value chain**
Limestone mining → crushing and grinding → clinker production in the kiln → grinding with additives → bagging and bulk storage → distribution → direct project sales and retail dealer channel.

**Revenue drivers**
Volume × realisation per tonne, where realisation depends heavily on region and on the trade (retail, bagged) versus non-trade (institutional, bulk) mix. Trade sales typically carry better realisation.

**Cost drivers**
- **Power and fuel** — cement is extremely energy intensive, and coal or pet coke prices move the cost base directly
- **Freight** — the defining cost, discussed below
- Raw materials and limestone
- Fixed plant costs

**The characteristic that defines the industry: freight**
Cement has a low value-to-weight ratio, so transport cost becomes prohibitive beyond roughly 300–500 km. That single fact produces most of the industry's structure:

- Markets are **regional, not national.** Pricing, demand and competition differ by region and a national average conceals everything.
- Plants are located near limestone reserves, and **grinding units** are placed near demand centres to shorten the haul of the finished product.
- Regional supply-demand balance drives pricing far more than national capacity does.

**Capacity utilisation and operating leverage**
Very high fixed costs mean utilisation drives margin. A regional capacity addition can depress prices across that region for years, because the new capacity must run to cover its fixed cost.

**Demand drivers**
Housing construction, infrastructure and government capital spending, real estate cycles, and monsoon seasonality — construction slows in the rains, so volumes are seasonal in a predictable way.

**Common case angles**
Plant location decisions, regional pricing, capacity expansion, cost reduction in power and freight, and demand forecasting against infrastructure spend.

**Keywords**
Clinker, grinding unit, realisation per tonne, trade and non-trade mix, lead distance, capacity utilisation, blended cement, pet coke.`,
    example: `"Why is our realisation lower than a competitor's?" often resolves to geography and mix rather than pricing strategy: a longer average lead distance to market, or a higher non-trade share. Checking lead distance and trade mix before discussing price is the industry-specific move.`,
    relevance: `Cement is a standard industrial case. The freight constraint creating regional markets is the one insight that reframes the whole analysis, and it generalises to any low value-to-weight product.`,
    mistakes: [
      "Analysing cement as a national market.",
      "Ignoring lead distance when comparing realisations.",
      "Missing operating leverage when volumes fall.",
    ],
    tags: ["cement", "freight", "lead distance", "regional markets", "capacity utilisation"],
    related: ["ind-automobile", "cons-c-profitability", "cons-c-pricing"],
    sources: [
      casebook(CASEBOOK_KTC, 364, "Industry Primer 125 'Cement'."),
      adapted("Original teaching note following the casebook's structure."),
    ],
  }),
  primer({
    id: "ind-pharma",
    category: "Healthcare",
    title: "Pharmaceuticals",
    difficulty: "Hard",
    body: `**Two very different businesses under one label**

*Innovator / originator* — discovers new molecules, runs clinical trials, holds patents, and prices to recover an enormous and uncertain R&D investment across the few compounds that succeed.

*Generic* — manufactures off-patent molecules, competes on cost and regulatory approvals, and operates on thin margins at scale. This is where most Indian pharmaceutical companies sit.

Their economics are almost opposites, so the first question in any pharma case is which one the client is.

**Innovator economics**
R&D is a portfolio of long-odds bets — most compounds fail, and the successes must fund the failures. Patent life is finite and much of it is consumed by trials, so the commercial window is short. **The patent cliff** — generic entry on expiry, with price falling steeply — is the industry's defining event and drives the constant need for pipeline replenishment.

**Generic economics**
Regulatory approval (such as an ANDA filing) is the gate. First-to-file can bring a period of limited competition and better margins; after that, price erodes quickly as more entrants are approved. Manufacturing cost, regulatory compliance and plant inspection outcomes determine who survives. A regulatory observation on a plant can halt exports and is an existential rather than operational risk.

**Cost drivers**
R&D and clinical trials for innovators; API and raw material (often import-dependent), manufacturing, and quality and regulatory compliance for generics; plus sales force and distribution for both.

**Distinctive features**
- **The payer is often not the patient** — insurers, governments and hospitals decide, so pricing negotiates with institutions rather than consumers.
- **Regulation is pervasive**: approval, manufacturing standards, pricing controls, and prescription rules.
- **Price controls** on essential medicines cap margins in many markets, India included.

**Common case angles**
Portfolio and pipeline prioritisation, responding to a patent expiry, entering a new geography with its own regulatory regime, API backward integration, and pricing under regulatory caps.

**Keywords**
API, ANDA, patent cliff, exclusivity, formulary, price control, DPCO, bioequivalence, regulatory observation, pipeline.`,
    example: `A generic maker's margin collapses on a key product. The usual cause is not cost but competition: additional approvals for the same molecule, with price eroding sharply as entrants multiply. The strategic response is portfolio — which molecules to file next — rather than cost reduction on a product whose price is structurally falling.`,
    relevance: `Pharma cases require distinguishing innovator from generic economics immediately. The patent cliff and the payer-is-not-the-patient point are the two structural features that most change an answer.`,
    mistakes: [
      "Not establishing whether the client is an innovator or a generic manufacturer.",
      "Treating pricing as a consumer decision when institutions are the payer.",
      "Underweighting regulatory and compliance risk.",
    ],
    tags: ["pharma", "generics", "patent cliff", "API", "regulation", "price control"],
    related: ["ind-healthcare", "cons-c-pricing", "pm-case-tata1mg-metrics"],
    sources: [
      casebook(CASEBOOK_KTC, 376, "Industry Primer from the casebook's pharmaceutical report."),
      adapted("Original teaching note following the casebook's structure."),
    ],
  }),
  primer({
    id: "ind-healthcare",
    category: "Healthcare",
    title: "Hospitals and healthcare delivery",
    difficulty: "Medium",
    body: `**Revenue drivers**
- **Occupancy rate** × **ARPOB** (average revenue per occupied bed) × bed count
- Case mix — the specialty and complexity of procedures performed, which drives revenue per case far more than volume does
- Outpatient, diagnostics and pharmacy revenue
- Payer mix — cash, insurance, government scheme, corporate

**Cost drivers**
Doctor and clinical staff cost (the largest line, and doctors are scarce and mobile), consumables and pharmacy, equipment depreciation, facility and utilities, and administration.

**The defining metrics**
- **Occupancy** — beds are a fixed asset with high carrying cost; empty beds are pure loss, so occupancy drives profitability much as load factor does for an airline.
- **ALOS** (average length of stay) — shorter stays free beds for new patients, raising throughput, but shorter stays also mean less revenue per admission. The optimum is not the minimum, and this trade-off is the analytical heart of many hospital cases.
- **Case mix index** — a hospital doing complex cardiac and oncology work earns far more per bed-day than one doing routine procedures, on the same asset base.
- **Payer mix** — government scheme rates are often below cost, so a shift in payer mix changes margin with no clinical change at all.

**The structural features**
- **Doctors drive demand.** A hospital's patient flow follows its consultants, which gives senior clinicians unusual bargaining power and makes retention a commercial issue rather than an HR one.
- **High fixed cost, capital intensive.** Equipment and beds are expensive and long-lived.
- **Trust and outcomes** drive choice more than price for serious conditions, and reputation compounds slowly.

**Common case angles**
Improving occupancy, optimising case mix toward higher-value specialties, doctor retention, expanding to a new city, payer mix and insurance negotiation, and whether to add a specialty.

**Keywords**
Occupancy, ARPOB, ALOS, case mix, bed turnover, payer mix, OPD/IPD, consumables ratio, clinical outcomes.`,
    example: `A hospital wants to improve profitability. Volume growth is limited by beds, so the higher-return lever is usually **case mix** — shifting toward higher-ARPOB specialties on the same asset base — combined with ALOS reduction to raise turnover. Recognising that the constraint is beds, not demand, is what points at mix rather than marketing.`,
    relevance: `Healthcare delivery cases turn on occupancy, ALOS and case mix. The ALOS trade-off — shorter stays raise throughput but cut revenue per admission — is the nuance that shows genuine understanding.`,
    mistakes: [
      "Recommending volume growth when beds are the binding constraint.",
      "Treating ALOS reduction as unambiguously good.",
      "Ignoring payer mix as a driver of margin.",
    ],
    tags: ["healthcare", "hospitals", "occupancy", "ARPOB", "ALOS", "case mix", "payer mix"],
    related: ["ind-pharma", "pm-case-tata1mg-metrics", "cons-c-profitability"],
    sources: [
      casebook(CASEBOOK_KTC, 378, "Industry Primer from the casebook's healthcare report."),
      adapted("Original teaching note following the casebook's structure."),
    ],
  }),
  primer({
    id: "ind-agriculture",
    category: "Consumer",
    title: "Agriculture and agri-inputs",
    difficulty: "Medium",
    body: `**Value chain**
Inputs (seed, fertiliser, crop protection, machinery) → farming → harvest → aggregation and procurement → processing → storage and cold chain → distribution → retail → consumer.

**Where value accrues**
Very little of the final consumer price reaches the farmer. The chain is long, fragmented and intermediary-heavy, with each layer taking a margin and adding handling cost. That structure is the reason most agri cases are ultimately about disintermediation, aggregation or logistics.

**Revenue drivers for agri-input businesses**
Acreage under the relevant crop, adoption rate of the input, price per unit, dealer reach, and crop cycle timing. Demand is seasonal, tied to sowing windows, and highly dependent on the monsoon.

**Cost drivers**
Raw materials (fertiliser is energy and gas intensive), manufacturing, an extensive distribution network reaching fragmented rural retail, working capital tied up in seasonal credit to dealers, and R&D for seed and crop protection.

**The defining characteristics**
- **Seasonality and weather dependence.** Demand concentrates into sowing windows and a poor monsoon can remove a season's demand entirely. Working capital and inventory planning are dominated by this.
- **Fragmented smallholder base.** Millions of small farms make direct reach expensive, which is why dealer networks are the critical asset.
- **Heavy regulation and subsidy.** Fertiliser subsidy, minimum support prices and procurement policy shape economics more than market forces in several crops.
- **Post-harvest losses** are substantial where cold chain and storage are inadequate — a large, quantifiable inefficiency and a frequent case subject.
- **Credit dependence.** Farmers buy on credit against harvest, so receivables and default risk sit inside the input business.

**Common case angles**
Improving farmer income, reducing post-harvest loss, expanding dealer reach, entering a new crop or geography, direct-to-farmer models, and mechanisation adoption.

**Keywords**
Acreage, yield per hectare, MSP, mandi, post-harvest loss, cold chain, dealer network, kharif and rabi, input intensity, aggregation.`,
    example: `"How would you increase farmer income?" decomposes cleanly: income = yield × price − input cost. Yield is agronomy and inputs; price is market access and disintermediation; cost is input efficiency and credit. Each branch leads to a different intervention, and stating the decomposition immediately structures an otherwise sprawling question.`,
    relevance: `Agriculture appears in Indian consulting cases, particularly public-sector and social-impact ones. The income decomposition and the post-harvest loss angle are the two most productive entry points.`,
    mistakes: [
      "Ignoring seasonality and the monsoon in demand planning.",
      "Treating farmers as a homogeneous group rather than segmenting by landholding.",
      "Overlooking credit and working capital, which dominate the input business.",
    ],
    tags: ["agriculture", "agri-inputs", "seasonality", "post-harvest loss", "MSP", "dealer network"],
    related: ["ind-fmcg", "cons-case-unconventional", "cons-c-guesstimate-method"],
    sources: [
      casebook(CASEBOOK_KTC, 358, "Industry Primer 119 'Agriculture'."),
      adapted("Original teaching note following the casebook's structure."),
    ],
  }),
];
