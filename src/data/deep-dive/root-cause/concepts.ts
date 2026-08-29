import { conceptsFor, casebook, adapted, CASEBOOK_IITK } from "../helpers";
import type { DeepDiveItem } from "../types";

const c = conceptsFor("DATA", "root-cause");

export const RCA_CONCEPTS: DeepDiveItem[] = [
  c({
    id: "rca-c-method",
    category: "Method",
    title: "The shape of a root cause investigation",
    difficulty: "Medium",
    body: `An RCA question gives you a metric that moved and asks why. What is being assessed is not whether you happen to guess the cause — it is whether you can narrow a very large space of possible causes in a structured, evidence-driven way.

The sequence that holds up under pressure:

1. **Clarify the metric and the movement.** What exactly is the metric, how is it defined, how big is the change, over what window, and is this the first time?
2. **Validate before investigating.** Is the number real? Instrumentation breaks, definitions change, pipelines fail. Ruling this out first costs one question and saves the whole investigation.
3. **Decompose the metric** into the factors that multiply or add to produce it. Revenue = orders × average order value. Orders = users × order rate.
4. **Segment** along every dimension available — geography, platform, user cohort, channel, product line, time of day. A drop that is concentrated in one segment is a very different problem from one that is uniform.
5. **Separate internal from external.** Did we change something, or did the world change? A competitor launch and a broken payment flow look identical in the aggregate number.
6. **Generate hypotheses** for the segment the data points at, and prioritise them by likelihood and by how cheaply they can be tested.
7. **Test** the top hypotheses against data, not intuition.
8. **State the root cause and the recommendation**, separating the immediate fix from the structural one.

The single most common failure is skipping from step 1 to step 6 — listing plausible causes before looking at where the drop actually is.

The **internal versus external** split is the framing the IITK Product Club casebook uses for this class of question, and it is a good one: external factors are outside the organisation's control (competitors, regulation, macroeconomics, seasonality), internal factors are within it (product changes, pricing, bugs, campaigns, supply).`,
    example: `"Revenue is down 20%." The weak answer starts listing causes. The strong answer asks: over what period, versus what baseline, is it the first time, is it all geographies, is it orders or average order value, and has anything changed in how we measure it. Four of those questions usually locate the problem before any hypothesis is offered.`,
    relevance: `Root cause questions are the most common analytical interview format in both data and product roles, because they are the closest thing to the actual job. The structure is what is graded, not the answer.`,
    mistakes: [
      "Listing hypotheses before segmenting the data.",
      "Never questioning whether the metric itself is correct.",
      "Treating one segment's problem as the whole business's problem.",
      "Stopping at the cause without a recommendation.",
    ],
    tags: ["RCA", "framework", "decomposition", "segmentation", "hypothesis"],
    related: ["rca-c-validate", "rca-c-decomposition", "rca-c-segmentation", "rca-c-hypotheses"],
    sources: [
      casebook(CASEBOOK_IITK, 31, "Section 3.1 'How to Perform Root Cause Analysis' sets out the clarify / hypothesise / identify structure and the internal-versus-external split used here."),
      adapted("Expanded into an eight-step method with original explanation and examples."),
    ],
  }),
  c({
    id: "rca-c-validate",
    category: "Method",
    title: "Validate the metric before you investigate it",
    difficulty: "Medium",
    body: `A surprising share of real metric drops are not drops at all. Before spending an investigation on the business, rule out the measurement:

**Is the data complete?** A failed pipeline run, a partial load, or a delayed upstream feed produces a genuine-looking cliff. Check whether the drop coincides exactly with a load boundary — a drop that starts precisely at midnight on a specific date is far more likely to be technical than behavioural.

**Did the definition change?** Someone edited the metric's SQL, changed a filter, excluded internal traffic, or altered what counts as an "active user". Version history on the metric definition answers this in minutes.

**Did tracking break?** A release that removed or renamed an analytics event stops the numerator while the denominator keeps counting. This is extremely common and produces a drop confined to one platform or one app version — which is why segmenting by app version is worth doing early.

**Is the comparison fair?** Comparing a partial current period against a complete prior one always shows a decline. So does comparing across a holiday, a leap year, or a month with a different number of weekends.

**Is it within normal variation?** A 3% weekly move on a noisy metric may be nothing. Plot enough history to see the normal range before treating a movement as a signal.

The cost of these checks is a few minutes. The cost of skipping them is an investigation into a business problem that does not exist — and in an interview, an interviewer who was waiting to see whether you would ask.`,
    example: `A daily-active-users chart falls 40% on one date and stays flat afterwards. A behavioural change is gradual; a cliff that holds is almost always technical. Segmenting by app version showed the drop confined to the latest iOS release, which had shipped with a broken analytics event.`,
    relevance: `Asking "is the number real?" early is one of the cheapest ways to distinguish yourself in an RCA interview, and it is what an experienced analyst genuinely does first.`,
    mistakes: [
      "Treating every movement as a business event.",
      "Not checking whether the current period is complete.",
      "Missing that a sharp cliff usually indicates instrumentation, not behaviour.",
    ],
    tags: ["data quality", "instrumentation", "metric definition", "validation"],
    related: ["rca-c-method", "rca-c-decomposition", "rca-q-dau-drop"],
  }),
  c({
    id: "rca-c-decomposition",
    category: "Method",
    title: "Decomposing a metric",
    difficulty: "Medium",
    body: `Decomposition turns one number into a small set of numbers, exactly one of which is usually responsible. It is the highest-value single move in an RCA.

**The standard decompositions**

\`\`\`
Revenue        = Orders × Average order value
Orders         = Active users × Orders per active user
Active users   = New + Returning + Reactivated − Churned
Average order value = Items per order × Price per item
Profit         = Revenue − Cost
Revenue (subscription) = Subscribers × ARPU
Conversion     = each funnel step's rate, multiplied
Marketplace GMV = Buyers × Orders per buyer × AOV
                = Sellers × Listings per seller × Sell-through × Price
\`\`\`

**The rule:** decompose multiplicatively where the components multiply, additively where they add, and do not mix the two in one tree.

**Why it works.** Revenue falling 20% is unactionable. Revenue falling 20% because orders fell 22% while order value rose 3% points at demand, not pricing. One more level — orders fell because order rate per user dropped while user count held — points at engagement, not acquisition. Each level roughly halves the search space.

**A marketplace needs both sides.** Supply and demand decompose separately and a drop can originate in either: fewer buyers, or the same buyers finding nothing available. Decomposing only the demand side is the classic marketplace RCA error.

**Watch the mix effect.** A metric can fall while every segment's value rises, if the mix shifts toward lower-value segments. Simpson's paradox is not a curiosity here — it is a routine cause of confusing RCA results, and the check is to look at both the within-segment rates and the segment weights.`,
    example: `Revenue −18%. Orders −20%, AOV +2% → demand problem. Users flat, orders per user −19% → not acquisition, engagement. Segmenting: entirely in the 30-day-plus cohort. Now the question is answerable: what changed for returning users a month ago?`,
    relevance: `Interviewers listen for whether you decompose before hypothesising. It also produces the natural follow-up structure for the rest of the conversation.`,
    mistakes: [
      "Jumping to causes without decomposing.",
      "Mixing additive and multiplicative components in one tree.",
      "Missing a mix shift, where every segment improves but the total falls.",
      "Decomposing only the demand side of a marketplace.",
    ],
    tags: ["decomposition", "issue tree", "metric tree", "marketplace", "Simpson's paradox"],
    related: ["rca-c-method", "rca-c-segmentation", "rca-c-funnel", "rca-q-revenue-decline"],
  }),
  c({
    id: "rca-c-segmentation",
    category: "Method",
    title: "Segmentation: finding where the drop actually lives",
    difficulty: "Medium",
    body: `Decomposition tells you *which component* moved. Segmentation tells you *who it moved for*. Together they usually locate the cause before any hypothesis is needed.

**The dimensions to cut by, roughly in order of yield:**

| Dimension | Reveals |
|---|---|
| Time | when it started — gradual or a cliff |
| Geography | regional regulation, a competitor, a local outage |
| Platform / OS / app version | a release bug, a store change |
| User cohort / tenure | onboarding versus retention problems |
| Acquisition channel | a paid campaign or an SEO change |
| Product / category | supply or catalogue issues |
| New vs returning | acquisition versus engagement |
| Customer tier | a change affecting one segment's economics |

**The two shapes and what each means**

- **Concentrated** — the drop lives in one segment while others are flat. This is good news: the cause is specific and usually findable. One platform points at a release; one region at something local; one cohort at a lifecycle change.
- **Uniform** — everything fell by roughly the same proportion. This points at something systemic: pricing, brand, a macro factor, a site-wide change, or a measurement problem.

**The timing shape matters as much as the segment.** A **cliff** on a specific date means something discrete happened — a release, a config change, a policy, an outage. A **gradual slope** means something accumulating — competition, seasonality, cohort decay, slow degradation. Saying which shape you see, and what it rules out, is a strong move in an interview.

**Ask for the data rather than assuming it.** In an interview the interviewer holds the segmentation. "Can we look at this split by platform and by new versus returning?" is the right form of question, and the answer will steer the rest of the case.`,
    example: `Orders down 15% nationally. Split by city: −60% in one city, flat everywhere else. That single cut converts a vague national problem into a local one — and the next question is what changed in that city, which is answerable.`,
    relevance: `Segmentation is where an RCA either becomes tractable or stalls. Interviewers specifically watch for candidates who ask for cuts rather than speculating.`,
    mistakes: [
      "Speculating about causes instead of asking for segment data.",
      "Cutting by only one dimension and stopping.",
      "Not noting whether the drop is a cliff or a slope.",
      "Treating a concentrated drop as a company-wide crisis.",
    ],
    tags: ["segmentation", "cohort", "platform", "geography", "cliff", "trend shape"],
    related: ["rca-c-decomposition", "rca-c-method", "rca-c-internal-external"],
  }),
  c({
    id: "rca-c-internal-external",
    category: "Method",
    title: "Internal versus external causes",
    difficulty: "Medium",
    body: `Once you know where the drop lives, the next split is whether the cause is inside the organisation or outside it. The IITK Product Club casebook uses exactly this division for RCA cases, and it is a good organising question because the two categories are investigated completely differently.

**External — outside the organisation's control**

- **Competition** — a new entrant, a price cut, a better free tier, an aggressive campaign.
- **Regulation and policy** — a new rule, a tax change, a platform policy change (an app store or ad platform shift can move a metric overnight).
- **Macroeconomic** — inflation, employment, discretionary spending.
- **Seasonality** — festivals, holidays, weather, academic calendars.
- **Market saturation** — the addressable pool stops growing.
- **Channel changes** — a search algorithm update, a social platform's reach change.

**Internal — within the organisation's control**

- **Product changes** — a release, a redesign, a removed feature, a bug.
- **Pricing and promotion** — a price rise, a discount ending, a loyalty change.
- **Supply and operations** — stockouts, capacity, delivery times, partner churn.
- **Marketing** — budget cuts, a campaign ending, a channel switched off.
- **Measurement** — definition or tracking changes.

**The diagnostic question that separates them**

*Are competitors seeing the same movement?* If the whole market is down, look external. If it is only you, look internal. In an interview this is one of the highest-value questions you can ask, and it is exactly the one used in the casebook's Uber revenue case — the interviewer confirms the decline is specific to Uber, which immediately eliminates the entire external branch.

Ask it early. It halves the problem in one question.`,
    example: `From the IITK casebook's Uber case: the candidate asks whether competitors are seeing the same decline, and is told it is specific to Uber. Regulation, fuel prices and public transport are all then ruled out in two more questions, and the investigation moves to Uber's own revenue streams.`,
    relevance: `Structuring aloud as "external then internal" gives the interviewer a visible framework to follow, and the competitor question is the single most efficient branch-elimination move available.`,
    mistakes: [
      "Investigating internal causes at length without ever asking whether the market moved too.",
      "Attributing a decline to competition with no evidence.",
      "Forgetting seasonality on a year-on-year comparison.",
    ],
    tags: ["internal", "external", "competition", "seasonality", "regulation"],
    related: ["rca-c-method", "rca-c-segmentation", "rca-q-uber-revenue"],
    sources: [
      casebook(CASEBOOK_IITK, 32, "Section 3.2's sample case organises hypotheses explicitly into external and internal factors."),
      adapted("Expanded with additional categories and the competitor-comparison diagnostic."),
    ],
  }),
  c({
    id: "rca-c-funnel",
    category: "Conversion",
    title: "Funnel analysis",
    difficulty: "Medium",
    body: `When the metric is a conversion, the decomposition is the funnel, and the question becomes *which step* lost people.

**Compute step-to-step rates, not just the end-to-end rate.** An end-to-end conversion falling from 4% to 3% could be any step. Rates per step localise it immediately.

\`\`\`
Visit → Product view → Add to cart → Checkout start → Payment → Confirmed
        60%            25%            70%              85%       98%
\`\`\`

Compare each step against its own history. The step whose rate moved is the one to investigate; steps that held are eliminated.

**Then segment the failing step.** A payment step that fell only on iOS is a build problem. One that fell only for a particular payment method is an integration or an acquirer problem. One that fell uniformly points at pricing, or at a change in who is arriving.

**Watch for composition changes.** A funnel can degrade with no step actually breaking, if the mix of incoming traffic shifts. A paid campaign bringing lower-intent visitors lowers the overall conversion while every step performs exactly as before. The check is to compute conversion within each channel: if every channel is flat and the total fell, it is a mix shift, and the problem is in acquisition rather than in the funnel.

**Absolute numbers matter alongside rates.** A step whose rate improved while its absolute volume collapsed means fewer people reached it — the problem is upstream. Always look at both.

**Time-to-convert** is the underused signal. A rising median time-to-convert often precedes a rate drop and points at friction — a slow page, an added field, a new verification step.`,
    example: `Checkout conversion fell from 68% to 51%. Step rates showed every step flat except payment authorisation, which fell from 96% to 78%. Segmenting by method: one card network's authorisation rate had collapsed. The cause was an acquirer routing change — nothing to do with the product.`,
    relevance: `Conversion drops are among the most frequently asked RCA scenarios, and step-wise decomposition plus the mix-shift check is what a strong answer contains.`,
    mistakes: [
      "Looking only at end-to-end conversion.",
      "Missing a traffic mix shift and blaming the funnel.",
      "Ignoring absolute volumes and only reading rates.",
    ],
    tags: ["funnel", "conversion", "drop-off", "mix shift", "checkout"],
    related: ["rca-c-decomposition", "rca-c-segmentation", "rca-q-conversion-drop", "rca-q-cart-abandonment"],
  }),
  c({
    id: "rca-c-retention",
    category: "Retention",
    title: "Retention, churn and cohort analysis",
    difficulty: "Hard",
    body: `Retention questions need cohort thinking, because an aggregate retention number mixes together users acquired at very different times under very different conditions.

**Cohort the users by acquisition period** and plot retention by periods-since-acquisition. That produces the retention triangle, and it separates two completely different problems:

- **Newer cohorts retain worse than older ones at the same age** → something changed in acquisition or onboarding. You are attracting worse-fit users, or the first experience degraded.
- **All cohorts, including old ones, dropped at the same calendar moment** → something changed in the product or the market that affected everyone at once.

That distinction is the whole point of cohorting, and an aggregate retention chart cannot show it.

**Retention curves flatten or they do not.** A healthy product's curve declines and then flattens at some floor — a stable core of habitual users. A curve that keeps declining toward zero means no one is forming a habit, which is a product-market-fit problem rather than a retention-tactics problem.

**Churn needs a definition before it needs analysis.** For a subscription business churn is observable — a cancellation event. For a usage-based product it is a judgement: how long must someone be absent before they count as churned? The threshold changes the number completely, and interviewers ask this to see whether you notice.

**Voluntary versus involuntary churn** is the split people forget. Involuntary churn — expired cards, failed payments — is often a large share of subscription churn and has entirely different fixes (dunning, card updater services) from voluntary churn. Separating them before analysing is a genuinely valuable move.

**Leading indicators beat lagging ones.** By the time churn shows in the numbers, those users left weeks ago. Declining session frequency, falling feature breadth, and rising time-between-visits all move first.`,
    example: `Monthly retention declining for six months. Cohorted, month-1 retention was stable for cohorts acquired before March and fell steadily for those after — pointing at acquisition quality, not the product. A new paid channel had been scaled up in March and was bringing poorly-matched users.`,
    relevance: `"Retention is declining, investigate" is a standard question, and the cohort-versus-calendar distinction is the specific analytical move interviewers want to hear.`,
    mistakes: [
      "Analysing aggregate retention without cohorting.",
      "Not defining churn before measuring it.",
      "Ignoring involuntary churn in a subscription business.",
      "Treating a never-flattening curve as a retention problem rather than a fit problem.",
    ],
    tags: ["retention", "churn", "cohort", "involuntary churn", "product-market fit"],
    related: ["rca-c-decomposition", "rca-q-retention-decline", "rca-q-churn-spike"],
  }),
  c({
    id: "rca-c-hypotheses",
    category: "Method",
    title: "Generating and prioritising hypotheses",
    difficulty: "Medium",
    body: `Once the data has localised the problem, you need candidate explanations — and the skill is generating them systematically rather than free-associating.

**Generate along a structure**, so the list is defensible and reasonably complete:

- **The user journey** — awareness, acquisition, onboarding, activation, habitual use, payment, support. Walk it and ask what could have degraded at each stage.
- **The value chain** — supply, pricing, distribution, delivery, service.
- **The stakeholders** — buyers, sellers, partners, internal teams.
- **The timeline** — what shipped, what changed, what ended, in the window before the drop.

That last one is underrated. "What did we release in the two weeks before this started?" resolves a large share of real investigations immediately.

**Prioritise on two axes:** how likely the hypothesis is given what the data already shows, and how cheaply it can be tested. Test the cheap-and-likely ones first. A hypothesis that requires a two-week study goes last, however plausible.

**Make each hypothesis falsifiable.** "Users don't like the new design" cannot be tested. "Users who saw the new checkout design convert 8 points lower than those on the old one" can be — and the data either shows it or does not.

**Say what would disprove it.** Naming the evidence that would kill your favourite hypothesis is the strongest signal of analytical honesty you can give in an interview, and it is what stops an investigation confirming its first guess.

**Correlation is where RCA goes wrong.** Two things moving together in the same window is where you *start*, not where you finish. Prefer evidence with structure: a difference-in-differences against an unaffected segment, a staged rollout comparison, or a clean before-and-after at a known change boundary.`,
    example: `Localised to mobile web checkout, starting on a specific date. Hypotheses: (1) the release that day broke something — testable in an hour from error logs; (2) a payment provider change — testable from authorisation rates; (3) a competitor promotion — expensive to test and does not explain why it is mobile-web-only. Test in that order, and note that (3) is inconsistent with the segmentation already seen.`,
    relevance: `Interviewers grade the structure of your hypothesis generation and whether you prioritise by testability. Volunteering what would disprove your leading hypothesis is unusual and lands well.`,
    mistakes: [
      "Free-associating a long list with no structure.",
      "Prioritising by interestingness rather than by likelihood and cost of testing.",
      "Untestable hypotheses phrased as opinions.",
      "Accepting a correlation as the answer.",
    ],
    tags: ["hypothesis", "prioritization", "falsifiable", "causation", "user journey"],
    related: ["rca-c-method", "rca-c-segmentation", "rca-c-recommendation"],
  }),
  c({
    id: "rca-c-recommendation",
    category: "Method",
    title: "Closing the analysis: root cause and recommendation",
    difficulty: "Medium",
    body: `An RCA that ends at "the cause was X" is unfinished. The close has four parts, and candidates routinely deliver only the first.

**1. State the root cause, with the evidence.** One or two sentences, naming what the data supports rather than what you suspect. If several causes contribute, say so and give their rough weights — real declines are frequently multi-causal, and pretending otherwise is less credible, not more.

**2. Separate the immediate fix from the structural one.**
- *Immediate* — stop the bleeding. Roll back the release, re-enable the campaign, fix the payment route.
- *Structural* — stop it recurring. Add a regression test, add monitoring on that funnel step, change the release process.

Interviewers notice when a candidate offers only the immediate fix. The structural half is what distinguishes an analyst from a firefighter.

**3. Quantify the impact and the expected recovery.** "This accounts for roughly 14 of the 18 points of the decline; fixing it should recover most of that within a week." A recommendation without a number attached is hard to prioritise against everything else the team could do.

**4. Say what you did not resolve.** If 4 of the 18 points remain unexplained, say so and say what you would look at next. Claiming to have explained all of it when you have not is the fastest way to lose credibility, and interviewers are usually holding back a detail to see whether you notice the residual.

**Prevention is the part that gets remembered.** "And I would add an alert on step-level conversion so this is caught in hours rather than weeks" is a sentence that changes how the whole answer reads.`,
    example: `"The decline is primarily an iOS payment bug shipped on the 3rd, which accounts for about 14 of the 18 points. Immediate: roll back or hot-fix, recovering most of it within days. Structural: add payment-flow smoke tests to the release pipeline and alert on step-level conversion. The remaining 4 points track a competitor promotion that began the same week, which I would confirm against category-level share data."`,
    relevance: `The close is disproportionately memorable and most candidates rush it. Separating immediate from structural, quantifying, and naming what is unexplained are three cheap moves that materially improve the impression.`,
    mistakes: [
      "Ending at the cause with no recommendation.",
      "Only offering the immediate fix.",
      "Claiming a single cause explains everything when it does not.",
      "No quantification, so the recommendation cannot be prioritised.",
    ],
    tags: ["recommendation", "root cause", "impact", "prevention", "communication"],
    related: ["rca-c-method", "rca-c-hypotheses"],
  }),
];
