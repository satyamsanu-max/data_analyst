import { conceptsFor, casebook, adapted, CASEBOOK_IITK, CASEBOOK_KTC } from "../helpers";
import type { DeepDiveItem } from "../types";

const sense = conceptsFor("PRODUCT", "product-sense");
const design = conceptsFor("PRODUCT", "product-design");
const metrics = conceptsFor("PRODUCT", "product-metrics");
const rca = conceptsFor("PRODUCT", "product-rca");
const gtm = conceptsFor("PRODUCT", "product-gtm");

export const PRODUCT_CONCEPTS: DeepDiveItem[] = [
  // ------------------------------------------------------------------ FUNDAMENTALS
  sense({
    id: "pm-c-what-is-pm",
    category: "Fundamentals",
    title: "What a product manager actually does",
    difficulty: "Easy",
    body: `Product management sits at the intersection of engineering, business strategy and design. The IITK Product Club casebook frames the role around five responsibilities, and they are a good scaffold because interview questions map onto them directly:

1. **Vision and strategy.** Define a long-term goal for the product, then a strategy and roadmap for reaching it — prioritising features, allocating resources, setting timelines.
2. **User-centred focus.** Know the customer's pain points, needs and behaviours in detail, and keep gathering feedback to refine the product.
3. **Cross-functional leadership.** PMs lead without authority. They do not manage engineers or designers but must keep everyone aligned, acting as the connective tissue between engineering, design, marketing and sales.
4. **Data-driven decisions.** Define KPIs, track performance, and use the numbers to decide what to build and what to change.
5. **Go-to-market.** Work with product marketing on positioning, branding and launch.

**What the role is not.** A PM is not a project manager (who owns schedule and delivery), not a designer (who owns the interface), and not an engineering manager (who owns the team). The distinction that matters in interviews: a PM owns the *problem* and the *outcome*, not the solution or the schedule.

**"Leading without authority" is the phrase to understand rather than repeat.** It means influence has to come from clarity of reasoning, quality of evidence and credibility — because you cannot direct anyone. Almost every behavioural PM question is testing for this.`,
    example: `A PM does not decide "we will build feature X". A PM establishes that a specific user segment has a specific costly problem, that solving it advances a business objective, and that this solution is the best use of the team's next six weeks — and brings engineering and design to that conclusion with them, not at them.`,
    relevance: `"What does a PM do?" and "why product management?" open most PM interviews. Answering with the problem-and-outcome ownership framing, rather than a list of activities, immediately reads as someone who understands the role.`,
    mistakes: [
      "Describing the PM as a mini-CEO, which overstates the authority and understates the influence work.",
      "Confusing the role with project management.",
      "Listing activities without saying what the PM is accountable for.",
    ],
    tags: ["product management", "role", "vision", "cross-functional", "leadership"],
    related: ["pm-c-circles", "pm-c-prioritization", "pm-c-north-star"],
    sources: [
      casebook(CASEBOOK_IITK, 5, "Section 1.2 'Key Responsibilities of a Product Manager' sets out the five responsibilities used here."),
      adapted("Expanded with the role-boundary distinctions and original framing."),
    ],
  }),

  // ------------------------------------------------------------------ DESIGN
  design({
    id: "pm-c-circles",
    category: "Method",
    title: "The CIRCLES framework for product design",
    difficulty: "Medium",
    body: `CIRCLES is the structure the IITK Product Club casebook recommends for product design and improvement questions — "design a smart refrigerator", "how would you improve WhatsApp". Its value is that it stops you jumping to features, which is what almost every unprepared candidate does.

| Step | What you do |
|---|---|
| **C** — Comprehend the situation | Ask clarifying questions. What does the interviewer actually mean? New product or enhancement? Who is the target audience? |
| **I** — Identify the customer | Segment the users into personas. Demographics, lifestyle, context of use. |
| **R** — Report the customer's needs | For the prioritised persona, what are their specific pain points? |
| **C** — Cut through prioritisation | Rank those pain points. By impact, reach, or ease — and say which criterion you used. |
| **L** — List solutions | Generate features that address the prioritised pains. |
| **E** — Evaluate trade-offs | Score solutions on impact and effort. RICE, or an impact-effort matrix if time is short. |
| **S** — Summarise | Recap: user, problem, chosen solution, why. |

**The two steps that actually differentiate candidates**

*Prioritising the persona* (step 2) and *prioritising the pain points* (step 4). Anyone can list three user types and five problems. Choosing one and defending the choice — and checking with the interviewer that they are happy to proceed with it — is what separates a structured answer from a broad one.

**The trap.** CIRCLES is a scaffold, not a script. Reciting the acronym aloud and marching through it mechanically reads worse than using it invisibly. Interviewers have heard it hundreds of times; what they are listening for is whether your *reasoning* is structured, not whether you can name the steps.`,
    example: `"Design a smart refrigerator." Clarify: enhancing an existing fridge with smart features, for urban households. Personas: homemakers, working professionals, differently-abled users. Prioritise working professionals — busiest, least able to manage inventory. Their pains: tracking what is inside, remote visibility while shopping, storage flexibility, finding items. Prioritise inventory tracking and remote monitoring by impact on experience. Solutions: automatic inventory scanner, mobile app integration, smart-home integration. Evaluate: scanner and app are high impact; smart-home is medium and can wait. Summarise.`,
    relevance: `Product design and improvement questions are among the most common PM interview formats, and CIRCLES is the most widely taught structure for them. Knowing where its weight lies — persona and pain prioritisation — is more useful than knowing the acronym.`,
    mistakes: [
      "Reciting the acronym instead of using it.",
      "Listing personas without choosing and defending one.",
      "Jumping to features before establishing the pain point.",
      "Skipping the summary, which is what the interviewer remembers.",
    ],
    tags: ["CIRCLES", "product design", "personas", "prioritization", "framework"],
    related: ["pm-c-prioritization", "pm-c-improvement", "pm-case-spice-box", "pm-case-spotify-older"],
    sources: [
      casebook(CASEBOOK_IITK, 8, "Section 2.1 recommends CIRCLES for product design and improvement cases and works it through in section 2.2."),
      adapted("Original commentary on where the framework's weight actually falls."),
    ],
  }),
  design({
    id: "pm-c-improvement",
    category: "Method",
    title: "Product improvement questions",
    difficulty: "Medium",
    body: `"How would you improve WhatsApp?" looks like a design question and is subtly different: the product already exists, so the first job is to establish *what improvement means* before generating any.

The sequence the IITK casebook uses:

1. **Understand the product.** State your understanding aloud and invite correction. If you do not know the product, ask — that is entirely acceptable and better than bluffing.
2. **Ask what kind of improvement.** Acquisition, engagement, monetisation, retention, or a specific feature? "Improve" is meaningless without a goal. This single question reframes the whole answer.
3. **Identify and prioritise a user segment.** Create personas, pick one, justify it.
4. **Report their pain points.**
5. **Prioritise the pains** by impact on the stated goal.
6. **List solutions.**
7. **Evaluate trade-offs** on impact and effort.
8. **Summarise.**

**Step 2 is the whole question.** Improving WhatsApp for engagement among elderly users and improving it for monetisation among businesses lead to entirely different answers. A candidate who starts listing features without asking has already failed the main test.

**Choosing a non-obvious segment pays off.** The casebook's worked example prioritises *elderly users* — becoming more digitally active but struggling with a complex interface, small text, unfamiliar emoji conventions and privacy settings. That is a more interesting answer than "young professionals" because it identifies a real underserved group and leads naturally to concrete solutions: a simplified interface, larger text and buttons, hiding advanced features, and a tutorial.

**Constrain yourself.** A good improvement answer proposes two or three well-reasoned changes, not eight. Depth on a prioritised few beats breadth.`,
    example: `Improving WhatsApp for elderly users: the high-priority pains are the complex interface and small text and buttons — both directly block usage. Emoji and slang comprehension and privacy settings are real but lower priority, because someone can hold a conversation without either. Solutions: a "Senior Mode" with fewer visible features and larger icons, customisable text and button sizes, and hiding advanced features unless enabled. A tutorial is supportive rather than core.`,
    relevance: `Improvement questions are extremely common and are where candidates most often produce an unstructured feature list. Asking "improve along which dimension?" is the single highest-value move available.`,
    mistakes: [
      "Generating features before asking what improvement means.",
      "Choosing the most obvious user segment with no justification.",
      "Proposing eight ideas rather than three well-argued ones.",
      "Not stating how you would measure whether the improvement worked.",
    ],
    tags: ["product improvement", "CIRCLES", "personas", "prioritization", "goal"],
    related: ["pm-c-circles", "pm-c-prioritization", "pm-c-metrics-method"],
    sources: [
      casebook(CASEBOOK_IITK, 12, "Section 2.3 'Sample Case - Product Improvement' works through the WhatsApp example used here."),
      adapted("Original commentary and emphasis."),
    ],
  }),
  design({
    id: "pm-c-prioritization",
    category: "Method",
    title: "Prioritisation: RICE, impact-effort and the alternatives",
    difficulty: "Medium",
    body: `Prioritisation is where a design answer becomes a decision rather than a brainstorm.

**RICE** — the framework the IITK casebook uses for evaluating solutions:

\`\`\`
Score = (Reach × Impact × Confidence) / Effort
\`\`\`

- **Reach** — how many users are affected per period.
- **Impact** — how much it moves the goal per user, usually on a scale like 3 / 2 / 1 / 0.5 / 0.25.
- **Confidence** — how sure you are, as a percentage, which is the term that keeps you honest about weak evidence.
- **Effort** — person-months.

**Impact-effort matrix** — when time is short, plot solutions on two axes and take the high-impact, low-effort quadrant first. The casebook's worked cases use exactly this, adding a "need" column for how strongly the user requires it.

**Other frameworks worth naming**

| Framework | Use |
|---|---|
| **MoSCoW** | Must / Should / Could / Won't — scoping a release |
| **Kano** | basic, performance and delight features — deciding what merely prevents dissatisfaction versus what creates satisfaction |
| **Weighted scoring** | several criteria with explicit weights |
| **Cost of delay / WSJF** | when timing changes the value |

**The point interviewers actually test.** Not which framework you can name — whether you *state your criterion and apply it consistently*. Saying "I am prioritising by impact on user experience, because the goal we agreed was engagement" and then ranking accordingly is worth more than reciting four frameworks.

**Confidence is the underused term.** Most prioritisation arguments are really disagreements about confidence, not impact. Making it explicit converts an argument about opinions into a question about what evidence would settle it.`,
    example: `Smart-fridge solutions scored on impact and effort: automatic inventory scanner — high impact, high effort, strong need; mobile app integration — high impact, medium effort, strong need; smart-home integration — medium impact, high effort, moderate need. Prioritise the first two; defer the third to a later release. The reasoning is the deliverable, not the scores.`,
    relevance: `Every design and improvement case ends in a prioritisation, and it is the step candidates most often skip or hand-wave. Stating a criterion and applying it is a cheap way to sound decisive.`,
    mistakes: [
      "Naming a framework without applying it.",
      "Inventing precise-looking scores with no basis, which reads as false rigour.",
      "Ignoring confidence, so a guess and a measured result carry equal weight.",
      "Prioritising with no stated goal to prioritise against.",
    ],
    tags: ["RICE", "prioritization", "impact-effort", "MoSCoW", "Kano", "confidence"],
    related: ["pm-c-circles", "pm-c-improvement", "pm-c-tradeoffs"],
    sources: [
      casebook(CASEBOOK_IITK, 11, "Sections 2.2 and 2.3 use RICE and an impact/effort/need table to evaluate solutions."),
      adapted("Extended with the other frameworks and original commentary on confidence."),
    ],
  }),
  sense({
    id: "pm-c-tradeoffs",
    category: "Trade-offs",
    title: "Reasoning about trade-offs",
    difficulty: "Medium",
    body: `Interviewers ask trade-off questions because product decisions are almost never about whether something is good — they are about what you give up to get it.

**The recurring tensions**

| Trade-off | The real question |
|---|---|
| Speed vs quality | what does a defect cost here? |
| Simplicity vs power | who is the marginal user you are optimising for? |
| Growth vs monetisation | is the constraint demand or revenue per user? |
| Personalisation vs privacy | what would the user consider a fair exchange? |
| Automation vs control | how expensive is a wrong automatic decision? |
| New users vs existing users | which group's experience are you willing to degrade? |
| Short-term metric vs long-term health | is the metric measuring value or extracting it? |

**How to answer well**

1. **Name what is actually being traded.** Many candidates argue for one side without articulating the cost of choosing it.
2. **Ask what the objective is.** The right answer to speed versus quality depends entirely on whether this is a payments flow or a marketing page.
3. **Look for the reframe.** Some trade-offs dissolve — a "Senior Mode" gives simplicity to the users who need it without removing power from anyone else. Segmenting the user base is the most common way a trade-off turns out to be false.
4. **Decide.** Having reasoned through it, commit. Interviewers penalise fence-sitting more than a defensible wrong answer.
5. **Say what would change your mind.** Naming the evidence that would flip your decision is the strongest close available.

**The one to be careful with.** Short-term metric versus long-term health is the trade-off where interviewers watch for judgement. Increasing ad load raises revenue today and degrades retention over months. A candidate who optimises the visible metric without noticing the invisible cost is showing you something about how they would behave on the job.`,
    example: `"Should Spotify auto-play a similar track when the queue ends?" The trade-off is engagement against user control, and the answer depends on context: in a driving or workout context, autoplay is genuinely useful; during focused listening it is an intrusion. That reframes a yes/no into a contextual default with an easy override — which is usually the better product answer.`,
    relevance: `Trade-off questions appear inside almost every design, metrics and strategy case. The differentiator is naming the cost of your own recommendation before the interviewer does.`,
    mistakes: [
      "Arguing one side without acknowledging what it costs.",
      "Refusing to decide.",
      "Missing that segmentation can dissolve the trade-off entirely.",
      "Optimising a metric without asking what it degrades.",
    ],
    tags: ["trade-offs", "decision making", "segmentation", "judgement"],
    related: ["pm-c-prioritization", "pm-c-guardrail-metrics", "pm-c-circles"],
  }),

  // ------------------------------------------------------------------ METRICS
  metrics({
    id: "pm-c-metrics-method",
    category: "Method",
    title: "Answering a product metrics question",
    difficulty: "Medium",
    body: `Metrics questions — "how would you measure the success of X" — have a structure, and the IITK casebook's is a good one:

1. **Describe the product.** State what it is in one or two sentences, so you and the interviewer are talking about the same thing.
2. **Clarify the scope.** Which service, which side of a marketplace, which platform, which geography. A ride-hailing question is completely different for riders and for drivers.
3. **Describe the customer journey.** Discovery → download → search → book → use → feedback → repeat. The journey is what generates the metrics.
4. **Quantify each stage** using **AARRR** — Acquisition, Activation, Retention, Revenue, Referral.
5. **Choose a North Star** and say why.
6. **Name guardrails** — the metrics that must not degrade while you optimise the North Star.

**Why the journey step matters.** Deriving metrics from a journey produces a defensible, complete set. Listing metrics from memory produces an arbitrary one, and the interviewer can tell which you did.

**AARRR by stage**

| Stage | Typical metrics |
|---|---|
| Acquisition | installs, sign-ups, CAC, channel mix |
| Activation | completed onboarding, first key action, time-to-value |
| Retention | D1/D7/D30, cohort curves, DAU/MAU |
| Revenue | ARPU, conversion to paid, LTV, margin |
| Referral | invites sent, viral coefficient, share rate |

**The mistake to avoid.** Listing thirty metrics. A metric earns its place only if someone would act differently depending on its value. Naming five that matter, and saying which one you would put on the wall, is a far stronger answer than exhaustiveness.`,
    example: `"Evaluate success metrics for Ola." Clarify: ride-hailing only, rider side only. Journey: discovery through ads and word of mouth → download → search and evaluate → book → ride → rate → repeat. Then metrics per stage, a North Star of completed rides per active rider per month, and guardrails on cancellation rate, wait time and safety incidents.`,
    relevance: `Metrics questions are a core PM interview format. Deriving metrics from the user journey rather than reciting a list is the single clearest signal of a structured thinker.`,
    mistakes: [
      "Listing metrics without a journey or a framework.",
      "Not clarifying which side of a two-sided product is in scope.",
      "Naming no North Star, so the answer has no priority.",
      "Forgetting guardrails.",
    ],
    tags: ["AARRR", "metrics", "user journey", "North Star", "guardrails"],
    related: ["pm-c-north-star", "pm-c-guardrail-metrics", "pm-case-instagram-metrics"],
    sources: [
      casebook(CASEBOOK_IITK, 45, "Section 4.1 recommends AARRR for product metrics cases; section 4.2 works through the Ola example."),
      adapted("Extended with North Star and guardrail steps and original commentary."),
    ],
  }),
  metrics({
    id: "pm-c-north-star",
    category: "North Star",
    title: "North Star, input and output metrics",
    difficulty: "Medium",
    body: `A **North Star metric** is the single number that best captures the value your product delivers to users, and which the business's success follows from. It exists to align a whole organisation on one definition of progress.

**What makes a good one**

1. **It measures delivered value, not activity.** Time spent is activity. A completed ride, a message delivered, a night booked — those are value.
2. **Users doing more of it is genuinely good for them**, not merely good for you. This is the test that separates a North Star from a vanity or extractive metric.
3. **It is a leading indicator of revenue**, not revenue itself. Revenue is an outcome; a North Star is what produces it.
4. **The team can actually move it.**

**Input versus output metrics**

An output metric is the result — the North Star, revenue, retention. Input metrics are the levers that drive it, and they are what a team actually works on week to week.

\`\`\`
Output:  Nights booked
Inputs:  Listings added · Search-to-booking conversion · Repeat booking rate
\`\`\`

Teams should be set targets on inputs and judged on outputs. A team told to "increase nights booked" has no starting point; a team told to "improve search-to-booking conversion" does.

**Vanity metrics** are numbers that rise reliably and mean nothing: cumulative registered users, total page views, app downloads. They never go down, which is exactly why they are comfortable and useless. The test is whether the number could realistically fall, and whether anyone would act if it did.

**Counter-positioning matters.** A North Star pursued alone will be gamed. That is why it is always paired with guardrails.`,
    example: `Plausible North Stars: Spotify — time spent listening, or listening days per month; Airbnb — nights booked; WhatsApp — messages sent per active user; Slack — messages sent within a team that has crossed the activation threshold. Note that each measures the product working, not the product being opened.`,
    relevance: `"What is your North Star metric for this product?" is asked in almost every metrics case, and the follow-up is always "why that one, and what would it miss?"`,
    mistakes: [
      "Choosing revenue as the North Star — it is the outcome, not the leading indicator.",
      "Choosing a vanity metric that only ever rises.",
      "Not distinguishing inputs from outputs, so the team has no lever.",
      "Proposing a North Star with no guardrails.",
    ],
    tags: ["North Star", "input metrics", "output metrics", "vanity metrics", "leading indicator"],
    related: ["pm-c-metrics-method", "pm-c-guardrail-metrics", "pm-c-funnel-metrics"],
  }),
  metrics({
    id: "pm-c-guardrail-metrics",
    category: "Method",
    title: "Guardrail metrics and metric gaming",
    difficulty: "Hard",
    body: `Every metric, optimised hard enough, gets gamed — usually not deliberately, but because the easiest way to move a number is rarely the way that creates value. Guardrail metrics are the constraints that make optimisation safe.

**The pattern**

| Optimising | Gets gamed by | Guardrail |
|---|---|---|
| Session time | autoplay, infinite scroll, friction to leave | retention, satisfaction, complaint rate |
| Click-through | clickbait, misleading titles | bounce rate, post-click satisfaction |
| Sign-ups | lowering quality of acquisition | activation rate, D30 retention |
| Revenue per user | ad load, aggressive upsell | churn, NPS, session frequency |
| Ticket closure speed | closing without resolving | reopen rate, CSAT |
| Delivery speed | unsafe driving, cost blowout | safety incidents, unit economics |

**How to choose a guardrail.** Ask: what is the laziest way someone could move this number without creating value? Then measure that. This question generates good guardrails reliably, and asking it aloud in an interview is a strong move.

**Counter-metrics in experimentation.** In an A/B test the same idea appears as counter-metrics — a variant that raises conversion but also raises refunds has not won. Deciding these *before* running the test is what stops post-hoc rationalisation.

**Goodhart's law** is the underlying principle: when a measure becomes a target, it ceases to be a good measure. Naming it is fine; explaining a concrete instance is better.

**The judgement this reveals.** A candidate who proposes engagement metrics with no guardrails is telling the interviewer they would happily ship a dark pattern. This is one of the few places in a PM interview where the answer reveals something about values rather than skill.`,
    example: `A team optimising notification click-through raises it substantially by sending more notifications with more urgent wording. Click-through is up, and notification opt-outs and 30-day retention are both down. Without those guardrails the team would have declared victory on a change that damaged the product.`,
    relevance: `Guardrails are what turn a metrics answer from a list into a system. Volunteering them unprompted is unusual and reads as maturity.`,
    mistakes: [
      "Proposing an engagement metric with nothing constraining it.",
      "Choosing guardrails after the experiment rather than before.",
      "Naming Goodhart's law without a concrete example.",
    ],
    tags: ["guardrail", "counter-metric", "Goodhart", "gaming", "experimentation"],
    related: ["pm-c-north-star", "pm-c-metrics-method", "pm-c-tradeoffs"],
  }),
  metrics({
    id: "pm-c-funnel-metrics",
    category: "Engagement",
    title: "Funnels, retention and engagement metrics",
    difficulty: "Medium",
    body: `**Funnel metrics** measure progression through a sequence. Always compute step-to-step rates rather than end-to-end, because only step rates tell you where people are lost. Watch the mix: a funnel can degrade with no step breaking, if incoming traffic quality changes.

**Retention metrics** measure whether people come back.

- **Classic retention** — of users active in period 0, what share were active in period N. Cohort it, always.
- **Rolling retention** — active at any point on or after period N. More forgiving, useful for infrequent products.
- **DAU/MAU** — a stickiness ratio. 50% means the average monthly user shows up every other day. Useful, but it is an average across a changing population, so it moves when growth changes even if nobody's behaviour does.

**The retention curve shape is the real signal.** A healthy curve declines and then *flattens* — a stable core has formed a habit. A curve that keeps declining toward zero means nobody is forming a habit, which is a product-market fit problem that no retention tactic will fix.

**Engagement metrics** measure depth: sessions per user, actions per session, feature breadth, time-to-value. Feature breadth is underused and is often a strong predictor of retention, because users doing several things with a product are harder to displace.

**Frequency has to match the product's natural rhythm.** Daily active users is the wrong metric for a tax product or a holiday booking site. Measuring against a cadence the product does not have makes every number look bad and tells you nothing.

**Activation deserves its own attention.** It is the point where a user first experiences the core value, and it predicts retention better than almost anything else. Defining it concretely — "added three contacts", "sent a first message", "completed one booking" — turns a vague onboarding conversation into a measurable one.`,
    example: `Slack's widely-discussed activation threshold is a team exchanging a substantial number of messages — the point at which the product's value becomes evident and retention rises sharply. Whatever the exact figure, the principle is what matters: find the behaviour that predicts retention and make reaching it the onboarding goal.`,
    relevance: `Interviewers probe whether you can define these precisely. "Retention" without a cohort, a period and a definition of active is not an answer.`,
    mistakes: [
      "Quoting retention without specifying cohort, period and definition of active.",
      "Using DAU as a metric for an inherently infrequent product.",
      "Reading a retention curve without checking whether it flattens.",
      "Treating activation as vague rather than defining a concrete behaviour.",
    ],
    tags: ["funnel", "retention", "DAU/MAU", "activation", "engagement", "cohort"],
    related: ["pm-c-north-star", "pm-c-metrics-method", "rca-c-retention"],
  }),

  // ------------------------------------------------------------------ PRODUCT RCA
  rca({
    id: "pm-c-rca-method",
    category: "Method",
    title: "Root cause analysis in a PM interview",
    difficulty: "Medium",
    body: `RCA questions in PM interviews — "Swiggy's monthly recurring revenue has dropped, evaluate the reasons" — assess analytical structure under ambiguity. The IITK casebook's structure is:

1. **Clarify and gather context.** Is the drop uniform across demographics, geographies, devices and operating systems? Is it gradual or a sharp drop at a specific time? These two questions do most of the narrowing.
2. **Formulate hypotheses, split into external and internal.**
   - *External* — competitors, new entrants, better rival free tiers, economic conditions, market saturation, regulation, seasonality.
   - *Internal* — metric definition or tracking changes, product bugs, UI friction, pricing changes, campaign changes, supply issues.
3. **Map the user journey** to locate internal problems: discovery, sign-up, onboarding, core usage, evaluation, decision, payment.
4. **Identify the root cause** from the evidence gathered.
5. **Recommend**, separating the immediate fix from the structural one.

**The distinguishing move is asking about competitors early.** If the whole category is down, the cause is external and half the tree can be discarded. If it is only you, it is internal. One question, half the problem.

**The second distinguishing move is validating the metric.** "Have there been any changes in how the metric is calculated or tracked?" A real share of reported drops are measurement artefacts, and asking costs one question.

**Differences from a pure data-analyst RCA.** A PM RCA ends in a *product decision*, not just a diagnosis. You are expected to say what you would build or change, and how you would measure whether it worked. An analyst can stop at the cause; a PM cannot.`,
    example: `Free-to-premium conversion down 20%: clarify that it is a steady six-month decline, uniform across demographics, geography and devices — which rules out platform bugs and regional causes. Rule out external factors. Walk the journey and find users using free features heavily but dropping at payment. Root causes: a payment-flow bug on iOS, and weak perceived value of premium features.`,
    relevance: `RCA appears in most PM interview loops as the "product execution" or "analytical" round. The structure is graded far more heavily than the conclusion.`,
    mistakes: [
      "Listing hypotheses before clarifying the shape of the drop.",
      "Never asking whether competitors are affected.",
      "Diagnosing without recommending — a PM answer must end in a decision.",
      "Not saying how you would measure whether the fix worked.",
    ],
    tags: ["RCA", "internal external", "user journey", "hypothesis", "product execution"],
    related: ["rca-c-method", "rca-c-internal-external", "pm-c-metrics-method"],
    sources: [
      casebook(CASEBOOK_IITK, 31, "Section 3.1 and the section 3.2 sample case set out this structure."),
      adapted("Extended with the PM-versus-analyst distinction and original commentary."),
    ],
  }),

  // ------------------------------------------------------------------ GTM
  gtm({
    id: "pm-c-gtm",
    category: "Method",
    title: "Go-to-market strategy",
    difficulty: "Medium",
    body: `A go-to-market question asks how you would launch — and the structure that holds up runs from market to measurement.

1. **Objective.** What is this launch for? Revenue, share, defending against a competitor, validating a hypothesis? Different objectives produce different launches.
2. **Market and segment.** Who is the beachhead? Launching to everyone is launching to no one. Name the specific segment whose problem is most acute and who is easiest to reach.
3. **Positioning.** For [segment] who [need], our product is [category] that [key benefit], unlike [alternative]. Being able to fill that in concisely is most of positioning.
4. **Pricing and packaging.** Free, freemium, trial, tiered, usage-based. Pricing is part of the product, not an afterthought.
5. **Channels.** Where does this segment actually make decisions? Paid, organic, partnerships, sales-led, community, app store. Match the channel to the price point — a low-priced product cannot support a direct sales motion.
6. **Launch sequence.** Internal → alpha → closed beta → soft launch to one segment or geography → general availability. A staged launch buys you evidence before scale.
7. **Success metrics and a kill criterion.** What does success look like at 30, 60 and 90 days — and what result would make you stop?
8. **Risks and dependencies.** Supply, support capacity, regulatory, competitive response.

**Step 2 is where most answers fail.** "We would launch to millennials" is not a segment. "Freelance designers in tier-1 Indian cities who currently use spreadsheets to invoice" is.

**The kill criterion is the most impressive element.** Almost nobody volunteers it, and defining in advance what result would make you stop is the clearest evidence of intellectual honesty. It also happens to be what actually distinguishes disciplined product organisations.`,
    example: `Launching a kids tier for a music service: objective is household retention rather than direct revenue; beachhead is existing family-plan subscribers with children, who are already trusted customers and cheaply reachable in-product; positioning is safety and age-appropriate curation; pricing is bundled into the family plan to drive upgrades; channels are in-product prompts and email; staged from a single market; success measured on family-plan upgrade rate and parent retention, with a kill criterion if activation among eligible households stays under a set threshold after 90 days.`,
    relevance: `GTM questions are common for senior PM and for product-marketing-adjacent roles. Naming a beachhead segment and a kill criterion are the two moves that most reliably distinguish a strong answer.`,
    mistakes: [
      "A vague target market.",
      "Choosing channels before understanding where the segment decides.",
      "Treating pricing as separate from the product.",
      "No kill criterion, so the launch can only ever be declared a success.",
    ],
    tags: ["go-to-market", "positioning", "segmentation", "pricing", "channels", "launch"],
    related: ["pm-c-tradeoffs", "pm-c-metrics-method", "pm-c-north-star"],
    sources: [
      casebook(CASEBOOK_KTC, 259, "The casebook's Go-To-Market case section establishes the launch-case format this structure addresses."),
      adapted("Original eight-step structure and commentary."),
    ],
  }),
  sense({
    id: "pm-c-critique",
    category: "Critique",
    title: "Product critique questions",
    difficulty: "Medium",
    body: `"What is your favourite product and why?" or "critique Instagram" tests whether you can evaluate a product analytically rather than express a preference.

**The structure**

1. **What is the product for, and for whom?** State the core job it does and the primary user.
2. **What does it do well?** Be specific about mechanisms, not adjectives. "The feed loads instantly" is an observation; "the app pre-fetches the next several items during idle time, so scrolling never blocks" is an analysis.
3. **What does it do badly?** Identify a real weakness with a reason, not a personal annoyance.
4. **Why might that weakness exist?** This is the step that separates candidates. Most "flaws" are deliberate trade-offs. Naming the constraint — a technical limit, a business model, a competing user segment, a regulatory requirement — shows you think like someone who has shipped.
5. **What would you change, and what would it cost?**
6. **How would you measure whether the change worked?**

**Step 4 is the whole question.** A candidate who says "the settings are confusing, they should simplify them" is describing an annoyance. A candidate who says "settings are deep because the product serves both casual and power users, and simplifying would break the power-user workflow — so the better move is progressive disclosure" is doing product thinking.

**Choosing what to critique.** Pick a product you genuinely use, not the most impressive-sounding one. Depth of actual usage shows immediately, and a well-observed critique of a mundane product beats a shallow critique of a famous one.

**Avoid** critiquing the interviewer's own product harshly unless invited, and avoid criticising something that is obviously a legal or platform constraint rather than a choice.`,
    example: `Critiquing a food delivery app: it does discovery well through strong filtering and reliable delivery estimates, but restaurant discovery beyond the top-rated few is weak — the same restaurants dominate every list. That is probably deliberate, because ranking by rating maximises immediate conversion. The cost is long-tail supply starving, which weakens the marketplace over time. A change: an exploration slot in the ranking, measured on long-tail order share and on whether overall conversion holds.`,
    relevance: `Critique questions appear in nearly every PM loop, often as an opener. The differentiator is explaining why a flaw exists rather than listing flaws.`,
    mistakes: [
      "Listing personal annoyances as product flaws.",
      "Not asking why the flaw might be deliberate.",
      "Choosing a product you do not actually use.",
      "Proposing a change with no way to measure it.",
    ],
    tags: ["critique", "product sense", "trade-offs", "analysis"],
    related: ["pm-c-tradeoffs", "pm-c-improvement", "pm-c-metrics-method"],
    sources: [
      casebook(CASEBOOK_KTC, 283, "The casebook includes a dedicated Product Critique case category."),
      adapted("Original structure and commentary."),
    ],
  }),
];
