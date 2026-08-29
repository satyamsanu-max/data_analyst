import { casebook, common, questionsFor, CASEBOOK_IITK, CASEBOOK_KTC } from "../helpers";
import type { DeepDiveItem } from "../types";

const design = questionsFor("PRODUCT", "product-design", "CASE");
const metrics = questionsFor("PRODUCT", "product-metrics", "CASE");
const sense = questionsFor("PRODUCT", "product-sense", "CASE");
const gtm = questionsFor("PRODUCT", "product-gtm", "CASE");

/**
 * Product interview cases.
 *
 * The IITK Product Club casebook states its 21 cases are derived from actual
 * product management interviews, so those carry CASEBOOK_INTERVIEW_CASE and any
 * company named in the case prompt. Where a case names no company, none is
 * attributed. Prompts are our own concise restatements and all explanation is
 * original teaching material — no transcript is reproduced.
 */

export const PRODUCT_CASES: DeepDiveItem[] = [
  // =========================================================== DESIGN
  design({
    id: "pm-case-spice-box",
    category: "Accessibility",
    title: "Design a spice box for a blind person",
    difficulty: "Medium",
    sourceType: "CASEBOOK_INTERVIEW_CASE",
    confidence: "high",
    q: "Design a spice box for a person who is fully blind.",
    hint: "Do not start with features. Establish the persona, then walk their actual journey using the product — the pain points fall out of the journey.",
    answer:
      "I would clarify the degree of blindness, the reason the product is needed, and the form factor — here, a fully blind person cooking for themselves, using a large multi-compartment box. I would define personas: blind children, non-working adults with carers, blind adults living alone, and elderly blind users. The adult living alone and working remotely benefits most, since they cook unaided and spend most of their time at home. Then I would walk their journey: locate the box, identify each spice by touch, smell or taste, measure the right quantity, mix, and return the box. Locating it is not a real problem for someone familiar with their own kitchen, so the two problems worth solving are identification and measurement — solved by Braille or engraved symbols with re-labellable templates, and a press-button dispenser releasing a pre-measured quantity.",
    detail:
      "**Why the journey walk is the key move**\n\nMost candidates jump straight to \"add Braille labels\". Walking the journey produces three candidate problems rather than one, and — more importantly — it produces the *reason to discard one of them*. A blind person living alone knows where their own things are; locating the box is not a pain point worth engineering for. Explicitly deprioritising a plausible-sounding problem, with a reason, is stronger than solving all three.\n\n**Persona selection**\n\nFour personas, and the choice matters:\n\n| Persona | Why not chosen |\n|---|---|\n| Blind children | dependent on family for cooking |\n| Non-working adults with carers | receive regular assistance |\n| **Blind adults living alone, working remotely** | **cook unaided, home most of the day** |\n| Elderly blind | often have family or care support |\n\nThe common thread is *independence*: the chosen persona is the one with no fallback, which is where accessibility design creates the most value.\n\n**The two solutions**\n\n1. **Identification** — engraved symbols or Braille near the top of each compartment, so a spice is identified by touch rather than by smelling or tasting it. The refinement that makes it a product rather than a feature: supply a set of engraved templates or Braille labels so the user can *relabel* compartments when they change spices. Without that, the box is fixed at manufacture and useless the first time someone buys a different spice.\n2. **Measurement** — a built-in dispenser releasing a pre-measured amount, one teaspoon per press. This removes both over-dosing and spillage, which are the two failure modes of estimating by hand without sight.\n\n**What the relabelling detail demonstrates**\n\nIt shows thinking about the product over its lifetime rather than at the moment of purchase. That is the kind of detail interviewers remember, and it generalises: for any physical product, ask what happens on day 200, not day 1.\n\n**Where to go further if pressed**\n\nTactile differentiation between compartments by shape as well as label; a fixed spatial layout so muscle memory helps; audio feedback confirming which compartment is open; and a dispensing mechanism that gives haptic confirmation of a completed dose.",
    mistakes: [
      "Adding Braille and stopping there.",
      "Not walking the user journey, so the measurement problem is never identified.",
      "Solving all identified problems rather than prioritising.",
      "Designing for the moment of purchase and ignoring relabelling.",
    ],
    followUps: [
      "How would the user relabel a compartment when they buy a different spice?",
      "How would you handle spices used in very different quantities, like salt versus saffron?",
    ],
    tags: ["accessibility", "product design", "CIRCLES", "personas", "user journey"],
    related: ["pm-c-circles", "pm-case-spotify-older"],
    sources: [casebook(CASEBOOK_IITK, 15, "Case 2.4 'Spice Box for a Blind Man', presented as an interview case.")],
  }),
  design({
    id: "pm-case-spotify-older",
    category: "Accessibility",
    title: "Design Spotify for older adults",
    difficulty: "Medium",
    sourceType: "CASEBOOK_INTERVIEW_CASE",
    company: "Spotify",
    confidence: "high",
    q: "How would you design Spotify to cater to older adults?",
    hint: "Clarify the objective and the scope first. Then think about what specifically makes a music app hard for this group — it is not only font size.",
    answer:
      "I would clarify the objective — making music streaming more accessible, intuitive and enjoyable for older adults — and the scope, here music only rather than podcasts or video. The persona is an older music lover who enjoys classical and devotional music but finds the interface difficult. Their pain points are navigating an app they are not confident with, discovering the specific genres they care about, organising their library, and jarring transitions between very different genres. The solutions are a simplified interface with larger text and both light and dark modes, a tutorial in their regional language, clearly labelled genre categories on the homepage, and pre-organised personalised playlists per genre — prioritised by impact against effort.",
    detail:
      "**The pain points that are not obvious**\n\nEveryone proposes larger text. The two that show real thought:\n\n1. **Genre discovery** — an algorithmic feed optimised for broad engagement surfaces very little classical or devotional music. The user's genres are structurally under-served by the default experience, which is a *product* problem rather than an accessibility one.\n2. **Abrupt transitions between genres** — autoplay moving from devotional music to something unrelated is jarring in a way it is not for a listener who enjoys variety. This is a specific, well-observed insight.\n\n**Why dark mode belongs in an accessibility answer**\n\nThe casebook's reasoning is that dark mode reduces glare and is easier on the eyes for users with vision difficulties. Offering both modes rather than assuming one is the correct framing — vision conditions differ, and some users need high contrast the other way round.\n\n**The regional-language tutorial**\n\nA genuinely good detail for the Indian market: an older user's barrier is often language as much as interface complexity. A tutorial in English helps nobody who is struggling because the app is in English.\n\n**Prioritisation**\n\n| Solution | Impact | Effort | Priority |\n|---|---|---|---|\n| Simplified interface | High | Low | High |\n| Tutorial | High | Medium | Medium |\n| Genre categories on homepage | High | Medium | Medium |\n| Pre-organised library | Medium | High | Low |\n\nThe pre-organised personalised library is deferred not because it lacks value but because its effort is high relative to the others — a defensible sequencing decision.\n\n**Testing and rollout**\n\nThe case goes further than most: low-fidelity Figma prototypes, testing with senior citizens for qualitative feedback, then a soft launch to a small group before full rollout. Naming a validation plan unprompted is unusual and strong.\n\n**Success metrics**\n\nFeature adoption rate, user engagement score and retention rate, supported by surveys and usage analysis. Note these are stage-appropriate: adoption first, then engagement, then retention.\n\n**The wider lesson**\n\nAccessibility work reliably improves the product for everyone. Larger touch targets, clearer navigation and a light-mode option help distracted users, users on small screens and users in bright sunlight. Making that argument turns an accessibility case into a mainstream product case.",
    mistakes: [
      "Only proposing larger fonts.",
      "Missing that algorithmic discovery under-serves niche genre preferences.",
      "Proposing a tutorial without considering language.",
      "No validation plan or success metrics.",
    ],
    followUps: [
      "How would you test this before building it?",
      "What metrics would tell you the redesign worked?",
      "Would a separate 'Senior Mode' be better than changing the main app?",
    ],
    tags: ["accessibility", "Spotify", "personas", "product design", "onboarding"],
    related: ["pm-c-circles", "pm-c-improvement", "pm-case-spice-box"],
    sources: [casebook(CASEBOOK_IITK, 18, "Case 2.5 'Spotify for Older Adults', presented as an interview case.")],
  }),
  design({
    id: "pm-case-legal-marketplace",
    category: "Marketplace",
    title: "Design an app for a legal marketplace",
    difficulty: "Hard",
    sourceType: "CASEBOOK_INTERVIEW_CASE",
    confidence: "high",
    q: "Design an app for a legal marketplace that makes legal information and services more accessible.",
    hint: "This is a two-sided marketplace in a high-anxiety, low-literacy domain. Clarify scope aggressively before designing anything.",
    answer:
      "I would clarify heavily first: personal legal matters rather than public interest litigation, no restriction to a specific area of law, the Indian market, and a target of upper- and middle-class Tier 1 citizens who lack a strong understanding of legal processes. Then I would map the user journey, which starts earlier than people expect — with *recognising* that one has a legal issue at all, typically on receiving a notice or being involved in an incident. From there: understanding what kind of problem it is, finding a suitable lawyer, judging their credibility, understanding cost, and managing the matter. The pain points cluster around comprehension and trust rather than around search, which is what should drive the design.",
    detail:
      "**Why the clarifying questions matter so much here**\n\nFive scope questions change the product completely: personal versus public matters, area of law, geography, target segment, and whether we serve users or lawyers. The casebook's candidate asks all of them, and the interviewer's answer on segment is instructive — the candidate proposes that a lower-income focus would prioritise wage disputes, eviction and benefits access, and the interviewer redirects to upper and middle class. That single answer changes which problems matter.\n\n**The journey insight**\n\nThe journey begins at *recognition*, not at search. Most people with a legal problem do not know they have one, or do not know what kind. That means the product's first job is diagnostic and educational, not transactional — a marketplace that only matches users to lawyers has skipped the step where most users are stuck.\n\nThat reframing is the strongest move available in this case.\n\n**The pain points**\n\n| Stage | Pain |\n|---|---|\n| Recognition | not knowing whether this is a legal matter |\n| Understanding | inaccessible legal language; no sense of what happens next |\n| Finding | no way to judge which lawyer suits this matter |\n| Trust | no verifiable credibility signal |\n| Cost | opaque and unpredictable fees |\n| Management | no visibility of progress once engaged |\n\n**The two-sided problem**\n\nA legal marketplace needs lawyers as much as users, and lawyer supply is the harder side: established practitioners have no shortage of work and little incentive to join a platform that commoditises them. A complete answer names this and proposes a supply strategy — targeting newer practitioners, or offering practice-management value rather than only lead generation.\n\n**Trust is the core design problem**\n\nLegal decisions are high-stakes, infrequent and hard for a layperson to evaluate. Ratings are weak here, because a user cannot judge legal quality from an outcome they do not understand. Better signals: verified bar registration, specialisation with case-type history, transparent fixed-fee structures for standard matters, and a free structured initial assessment.\n\n**Regulatory constraint worth naming**\n\nLawyer advertising and solicitation are restricted in India. A design that assumes free marketing of individual lawyers may not be permissible, and acknowledging a regulatory constraint rather than designing past it is a mark of seriousness.",
    mistakes: [
      "Designing a search-and-match app without addressing the recognition and comprehension stages.",
      "Ignoring the supply side of the marketplace.",
      "Relying on star ratings in a domain where users cannot judge quality.",
      "Not acknowledging regulatory restrictions on legal advertising.",
    ],
    followUps: [
      "How would you get lawyers onto the platform?",
      "How does a non-expert judge lawyer quality?",
      "How would you handle the fee-transparency problem?",
    ],
    tags: ["marketplace", "trust", "legal", "two-sided", "user journey", "India"],
    related: ["pm-c-circles", "pm-c-gtm", "rca-q-marketplace-imbalance"],
    sources: [casebook(CASEBOOK_IITK, 21, "Case 2.6 'App for a Legal Marketplace', presented as an interview case.")],
  }),
  design({
    id: "pm-case-swiggy-group-order",
    category: "Improvement",
    title: "Reduce group ordering time from 20 minutes to 5",
    difficulty: "Hard",
    sourceType: "CASEBOOK_INTERVIEW_CASE",
    company: "Swiggy",
    confidence: "high",
    q: "Group food orders take about 20 minutes to finalise for a group of five, versus 5 minutes when ordering alone. Reduce the group time to 5 minutes.",
    hint: "The extra 15 minutes is coordination cost, not browsing cost. Work out what the group is actually spending time on before designing anything.",
    answer:
      "The gap is not browsing — a solo order takes five minutes and the group takes twenty, so roughly fifteen minutes is pure coordination overhead: collecting preferences, resolving disagreement, someone re-entering everyone's choices, and settling payment. I would decompose that time into its components, find the largest, and attack it. The dominant costs are usually serial communication (people relaying choices through one person) and consensus (agreeing a restaurant). So the highest-value changes are parallelising selection — a shared cart everyone adds to simultaneously — and reducing the consensus problem with constrained choice, such as a shortlist based on the group's shared history and dietary constraints.",
    detail:
      "**Decompose the twenty minutes**\n\nThis is what makes the case tractable, and it is what most candidates skip:\n\n| Activity | Rough share |\n|---|---|\n| Agreeing a restaurant | large — the consensus problem |\n| Each person choosing | would be parallel if it could happen at once |\n| Relaying choices to the orderer | serial, and error-prone |\n| Re-entering others' choices | pure waste |\n| Confirming and paying | splitting and collecting money |\n\nTwo structural problems fall out: **serialisation** (everything routes through one person) and **consensus** (five people must agree on one restaurant).\n\n**Attacking serialisation**\n\nA shared cart with a link: everyone adds their own items to the same order simultaneously from their own phone. This alone collapses the relay and re-entry time and removes transcription errors. Payment splitting removes the settlement step.\n\n**Attacking consensus**\n\nHarder, and more interesting. Options in increasing sophistication:\n\n1. **Constrained shortlist** — three restaurants meeting the group's shared constraints, rather than the whole catalogue. Choice overload is a real driver of decision time.\n2. **Group history** — suggest restaurants this group has ordered from before, since repeat groups converge on a small set.\n3. **Voting with a deadline** — a timed vote forces closure. The deadline matters more than the voting.\n4. **A default with an opt-out** — pre-select the most likely option; the group only spends time if they disagree.\n\n**The timer insight**\n\nGroup decisions expand to fill available time. A visible countdown is a cheap, high-impact intervention, and it addresses the actual mechanism rather than a symptom.\n\n**The trade-off to name**\n\nConstraining choice reduces decision time and may reduce satisfaction or order value. If the shortlist excludes what someone wanted, they may abandon entirely. Success should therefore be measured on completed group orders and group order value, not only on time — optimising time alone could reduce revenue.\n\n**Segmenting the groups**\n\nThe hostel context in the prompt matters: these are repeat groups ordering frequently from a limited local set. That is a much easier problem than a one-off group of strangers, and designing for the repeat case first is the right sequencing.",
    mistakes: [
      "Designing features before decomposing where the twenty minutes goes.",
      "Solving only the mechanical relay problem and ignoring consensus.",
      "Constraining choice without acknowledging the satisfaction and order-value cost.",
      "Measuring only time saved.",
    ],
    followUps: [
      "What if constraining the shortlist reduces order value?",
      "How would this differ for a one-off group versus a regular one?",
      "How would you handle someone who joins the cart late?",
    ],
    tags: ["Swiggy", "group ordering", "coordination", "decision time", "food delivery"],
    related: ["pm-c-improvement", "pm-c-prioritization", "pm-c-tradeoffs"],
    sources: [casebook(CASEBOOK_IITK, 24, "Case 2.7 'Swiggy Group Orders', presented as an interview case.")],
  }),
  design({
    id: "pm-case-traffic-light",
    category: "Design",
    title: "Optimise traffic lights to reduce urban congestion",
    difficulty: "Hard",
    sourceType: "CASEBOOK_INTERVIEW_CASE",
    confidence: "high",
    q: "Optimise traffic light control algorithms to reduce congestion in a large city, without changing the road infrastructure.",
    hint: "Clarify what is being optimised — physical design, algorithms, or placement — and clarify the objective function, because 'less congestion' can mean several different things.",
    answer:
      "I would clarify that we are optimising the control algorithms rather than the physical lights or their placement, that the goal is reducing urban congestion without altering road infrastructure, and that we are focusing on high-traffic intersections rather than the whole city. The critical next question is what we are actually optimising: total throughput, average wait time, worst-case wait, emissions, or emergency-vehicle transit. These conflict — maximising throughput on main roads can leave side-road traffic waiting indefinitely — so the objective has to be stated before any algorithm is designed.",
    detail:
      "**The clarification sequence is the case**\n\nThree layers, and each narrows usefully:\n\n1. Physical design, algorithms, or placement? → algorithms.\n2. What is the objective? → reduce congestion and travel time.\n3. Whole city or specific intersections? → high-traffic intersections.\n\nStarting at a single congested intersection rather than a city-wide system is the right scoping instinct: it is testable, measurable and has a clear rollback.\n\n**The objective function conflict**\n\nThis is what makes the case interesting, and naming it is the strongest move:\n\n| Objective | Consequence |\n|---|---|\n| Maximise throughput | side roads starve; some drivers wait indefinitely |\n| Minimise average wait | can be achieved while a minority waits enormously |\n| Minimise maximum wait | fairness, at a throughput cost |\n| Minimise emissions | favours smooth flow over raw throughput |\n| Prioritise emergency vehicles | overrides all of the above, correctly |\n\nAny sensible design needs a fairness constraint — a maximum wait bound — alongside a throughput objective. Pure optimisation of the average produces an unusable and arguably unjust system.\n\n**Approaches, in increasing sophistication**\n\n1. **Fixed timing tuned by time of day** — cheap, no sensing, captures most of the rush-hour gain.\n2. **Actuated control** — sensors detect waiting vehicles and extend or cut phases. Responsive to actual demand.\n3. **Adaptive coordination (green waves)** — synchronise adjacent lights along a corridor so a platoon travelling at the design speed meets successive greens. This is where the large gains are, because it treats the corridor as a system rather than the intersection as an isolated unit.\n4. **Predictive control** — use historical and live data to anticipate demand.\n\n**The constraint that shapes everything**\n\n\"Without altering road infrastructure\" rules out new lanes, flyovers and physical redesign — but it also raises the question of what sensing already exists. Existing traffic cameras, loop detectors, and anonymised mobile location data are all plausible inputs that need no new road works. Asking what data is available is a good practical question.\n\n**Pedestrians**\n\nAn easily-missed stakeholder. Optimising purely for vehicle throughput lengthens pedestrian waits and pushes people to cross unsafely. Any answer that treats the intersection as vehicles-only is incomplete.\n\n**Measurement**\n\nAverage and 90th-percentile journey time along the corridor, intersection throughput, maximum wait on the worst approach, queue length, and pedestrian wait. Piloting at a small number of intersections with matched controls is the right rollout.",
    mistakes: [
      "Designing an algorithm before defining the objective function.",
      "Optimising average wait with no fairness constraint.",
      "Treating each intersection in isolation rather than coordinating a corridor.",
      "Forgetting pedestrians and emergency vehicles.",
    ],
    followUps: [
      "What data would you need, given no new infrastructure?",
      "How do you stop side roads starving?",
      "How would you pilot this safely?",
    ],
    tags: ["systems design", "optimization", "objective function", "constraints", "civic"],
    related: ["pm-c-tradeoffs", "pm-c-circles", "pm-c-metrics-method"],
    sources: [casebook(CASEBOOK_IITK, 26, "Case 2.8 'Traffic Light Optimization', presented as an interview case.")],
  }),
  design({
    id: "pm-case-youtube-signin",
    category: "Improvement",
    title: "Get non-signed-in YouTube users to create accounts",
    difficulty: "Medium",
    sourceType: "CASEBOOK_INTERVIEW_CASE",
    company: "YouTube",
    confidence: "high",
    q: "As a PM at YouTube, how would you encourage non-signed-in users to create accounts and sign in?",
    hint: "Ask what the goal is first — data collection and engagement lead to different answers. Then ask why users currently choose not to sign in.",
    answer:
      "I would first establish the objective. Here it is boosting engagement through personalised recommendations based on watch history, rather than data collection for its own sake — which matters, because it means the value exchange offered to the user should be personalisation, not a vague benefit. The next question is why users currently do not sign in: privacy concern, friction, no perceived benefit, shared or public devices, or simply that the anonymous experience is good enough. Each of those needs a different intervention, so I would segment before designing.",
    detail:
      "**Establish the goal, then the barrier**\n\nTwo questions do most of the work:\n\n1. **What is sign-in for?** Personalisation and engagement, per the interviewer. That makes personalisation the natural incentive to offer.\n2. **Why do people not sign in today?** This is the one candidates skip, and the answer determines everything.\n\n**The barrier segments**\n\n| Barrier | Intervention |\n|---|---|\n| No perceived benefit | demonstrate personalisation value before asking |\n| Privacy concern | explain what is stored, offer incognito-style viewing |\n| Friction | one-tap sign-in with an existing Google account |\n| Shared or public device | not a target segment — do not push |\n| Anonymous experience is sufficient | the hardest case; needs a genuine benefit |\n\nRecognising that some segments should *not* be pushed is a strong point. Pressuring a user on a shared library computer degrades their experience for no gain.\n\n**The value-exchange principle**\n\nThe strong answer is not \"prompt more aggressively\" — it is to make the benefit visible before asking. YouTube already knows what an anonymous user has watched in-session. Showing what personalisation would look like, then offering sign-in to keep it, converts an abstract ask into a concrete one.\n\n**Where to place the ask**\n\nAt moments where the benefit is self-evident and the user is already engaged: trying to save a video, subscribe, comment, or continue watching on another device. These are natural sign-in moments because the user is reaching for something sign-in enables. An interstitial on app open is the opposite — it interrupts before any value is established.\n\n**The critical guardrail**\n\nAggressive sign-in prompting will raise sign-ins and can easily reduce overall watch time and retention, because it introduces friction into a product whose strength is instant access. Guardrails: total watch time, session abandonment at the prompt, and retention of prompted-but-not-signed-in users. Naming this unprompted is the difference between a growth-hacking answer and a product answer.\n\n**Google account leverage**\n\nMost YouTube users on Android already have a Google account on the device. For that segment sign-in is a one-tap confirmation, not an account creation — so the real problem is not registration but consent. Distinguishing those two is a good observation.\n\n**Metrics**\n\nSign-in rate by placement, watch time per user before and after, retention of newly signed-in users, and prompt dismissal rate. Success is signed-in users who watch *more*, not sign-ins alone.",
    mistakes: [
      "Proposing more aggressive prompts without a value exchange.",
      "Not asking why users currently avoid signing in.",
      "Ignoring the friction cost to watch time.",
      "Treating account creation and sign-in as the same problem on Android.",
    ],
    followUps: [
      "What would you measure, and what guardrail would stop you shipping this?",
      "Some users deliberately avoid signing in. Should you target them?",
    ],
    tags: ["YouTube", "sign-in", "personalisation", "growth", "value exchange", "guardrails"],
    related: ["pm-c-improvement", "pm-c-guardrail-metrics", "pm-c-tradeoffs"],
    sources: [casebook(CASEBOOK_IITK, 29, "Case 2.9 'YouTube Sign-Ins', presented as an interview case.")],
  }),

  // =========================================================== METRICS
  metrics({
    id: "pm-case-instagram-metrics",
    category: "Method",
    title: "Success metrics for Instagram",
    difficulty: "Medium",
    sourceType: "CASEBOOK_INTERVIEW_CASE",
    company: "Instagram",
    confidence: "high",
    q: "Describe the success metrics for Instagram.",
    hint: "State what the product is, clarify the scope, then derive metrics from the user journey rather than listing them.",
    answer:
      "I would state the product — a platform for sharing and interacting with photos, videos, stories and reels, aiming at engagement, satisfaction and app performance — and confirm the scope is the whole app rather than one feature. Then I would map the user journey into the five AARRR stages and derive metrics per stage: acquisition through sign-up rate and cost per acquisition, activation through profile completion and first post or follow, retention through DAU/MAU and cohort curves, revenue through ad impressions and revenue per user, and referral through invites and shares. I would then pick a North Star and name guardrails.",
    detail:
      "**Derive, do not list**\n\nThe casebook's candidate maps the journey into five stages and generates metrics from each. That is the method: an interviewer can tell the difference between metrics derived from a journey and metrics recalled from a list, because the derived set is coherent and complete while the recalled set has arbitrary gaps.\n\n**By stage**\n\n| Stage | Metrics |\n|---|---|\n| Acquisition | new sign-up rate, cost per acquisition, channel mix |\n| Activation | profile completed, first follow, first post, time to first feed interaction |\n| Retention | DAU, MAU, DAU/MAU, D1/D7/D30 cohort retention, session frequency |\n| Revenue | ad impressions, ad revenue per user, advertiser retention, shopping conversion |\n| Referral | invites sent, shares, external link opens, viral coefficient |\n\n**Choosing a North Star**\n\nFor Instagram, time spent is the obvious candidate and the weakest one — it is engagement in the extractive sense and says nothing about whether users are getting value. Better candidates measure the product working: **meaningful interactions per user** (comments, DMs, shares rather than passive scrolling), or **content creation rate**, since a social network with only consumers eventually starves.\n\nMaking that argument — that the obvious metric is the wrong one — is the strongest available move in this case.\n\n**Guardrails**\n\nThis is where Instagram specifically deserves care. Optimising engagement on a social platform has well-documented failure modes:\n\n- Reported user wellbeing and satisfaction.\n- Content-quality and integrity signals: harassment reports, misinformation prevalence.\n- Creator health: are new creators getting distribution, or only established ones?\n- Session-end sentiment rather than session length.\n\nA candidate who proposes only engagement metrics for a social network is missing the dimension the industry has spent a decade learning about.\n\n**Two-sided nature**\n\nInstagram has consumers, creators and advertisers. Creator-side metrics — creators active, distribution to new creators, creator retention — are a genuinely separate set, and supply health determines consumer experience. Asking which side is in scope is the right clarifying question.\n\n**Which metrics would you actually put on a wall**\n\nThe useful discipline is to name three or four, not thirty. Something like: DAU/MAU for stickiness, meaningful interactions per DAU for value, creators publishing per week for supply, and revenue per DAU for the business — with wellbeing and integrity as guardrails.",
    mistakes: [
      "Listing metrics without a journey.",
      "Choosing time spent as the North Star with no argument.",
      "Ignoring the creator side of the platform.",
      "No wellbeing or integrity guardrails on a social product.",
    ],
    followUps: [
      "Why not time spent as the North Star?",
      "How would you measure creator health separately?",
      "Which four would you actually put on a dashboard?",
    ],
    tags: ["Instagram", "AARRR", "North Star", "social", "guardrails", "creator"],
    related: ["pm-c-metrics-method", "pm-c-north-star", "pm-c-guardrail-metrics"],
    sources: [casebook(CASEBOOK_IITK, 49, "Case 4.3 'Measuring Success of Instagram', presented as an interview case.")],
  }),
  metrics({
    id: "pm-case-airbnb-dashboard",
    category: "Dashboards",
    title: "CPO dashboard metrics for Airbnb",
    difficulty: "Hard",
    sourceType: "CASEBOOK_INTERVIEW_CASE",
    company: "Airbnb",
    confidence: "high",
    q: "As the CPO of Airbnb, which metrics would you prioritise on your daily dashboard?",
    hint: "Ask why the dashboard exists — monitoring overall health is a different requirement from tracking a launch. And remember Airbnb has two sides.",
    answer:
      "I would clarify the product scope — accommodation booking, excluding Experiences here — and, importantly, why the dashboard exists: this one is for monitoring company health daily rather than tracking a new feature. That changes what belongs on it: health monitoring needs a small number of stable, comparable metrics with alerting, not an exhaustive analytics surface. I would then outline the customer journey to derive metrics, and cover both sides of the marketplace — guests and hosts — with a North Star of nights booked and guardrails on cancellation rate, host churn and trust and safety incidents.",
    detail:
      "**The clarifying question that shapes everything**\n\n\"Why are we building this dashboard?\" A launch dashboard, a health dashboard and an investor dashboard contain different metrics. Being told it is for daily health monitoring means: few metrics, stable definitions, clear thresholds, and comparability over time. A CPO's daily dashboard that requires interpretation has failed.\n\n**Both sides**\n\nAirbnb is a marketplace, and a guest-only dashboard is incomplete:\n\n| Side | Metrics |\n|---|---|\n| **Demand (guests)** | searches, search-to-booking conversion, nights booked, cancellation rate, repeat booking rate |\n| **Supply (hosts)** | active listings, new listings, host churn, occupancy rate, host response rate |\n| **Marketplace health** | search-to-availability rate, price competitiveness, liquidity by market |\n| **Business** | GMV, take rate, revenue, contribution margin |\n| **Trust** | safety incidents, disputes, review scores |\n\n**North Star**\n\nNights booked is the standard answer and a good one: it measures the product working for both sides simultaneously — a night booked is a guest served and a host earning. It is a value metric rather than an activity metric, and it leads revenue rather than being revenue.\n\n**The marketplace metric people miss**\n\n**Search-to-availability rate** — how often a guest's search returns suitable available inventory. This is the earliest indicator of supply problems in a specific market, and it moves long before bookings fall. Aggregate supply can look healthy while specific markets and date ranges have none. Proposing a liquidity metric rather than only volume metrics is the strongest technical contribution to this answer.\n\n**Why daily changes the selection**\n\nSome metrics are meaningless daily. Retention cohorts, LTV and host churn need weeks. A daily dashboard should carry high-frequency operational signals — bookings, conversion, cancellations, incidents — with the slower measures reviewed on a weekly or monthly cadence. Distinguishing dashboard cadences is a good practical point.\n\n**Seasonality**\n\nTravel is heavily seasonal, so raw daily bookings are close to unreadable. Any daily view needs year-on-year comparison or seasonal adjustment, otherwise every winter looks like a crisis. Naming this shows domain awareness.\n\n**Restraint**\n\nA CPO dashboard with forty metrics is unusable. Five to eight headline numbers with drill-down beneath is the right shape, and saying so demonstrates that you understand the artefact's purpose.",
    mistakes: [
      "Listing metrics for guests only.",
      "Not asking what the dashboard is for.",
      "Putting slow-moving metrics on a daily view.",
      "Ignoring seasonality in a travel business.",
      "Proposing forty metrics.",
    ],
    followUps: [
      "Which of these are meaningless when viewed daily?",
      "How would you detect a supply problem in one city before bookings fall?",
      "How do you handle seasonality on a daily dashboard?",
    ],
    tags: ["Airbnb", "dashboard", "marketplace", "North Star", "liquidity", "seasonality"],
    related: ["pm-c-metrics-method", "pm-c-north-star", "rca-q-marketplace-imbalance"],
    sources: [casebook(CASEBOOK_IITK, 54, "Case 4.5 'Airbnb Dashboard Metrics', presented as an interview case.")],
  }),
  metrics({
    id: "pm-case-tata1mg-metrics",
    category: "Method",
    title: "Success metrics for an online pharmacy",
    difficulty: "Medium",
    sourceType: "CASEBOOK_INTERVIEW_CASE",
    company: "Tata 1mg",
    confidence: "high",
    q: "Define the success metrics for Tata 1mg.",
    hint: "A healthcare product has constraints an ordinary e-commerce product does not. Let those shape the metric set.",
    answer:
      "I would scope the product — an online pharmacy and healthcare platform covering medicine delivery, diagnostics and consultations — and confirm which of those is in scope. Then derive metrics from the journey using AARRR. What makes this different from generic e-commerce is that healthcare adds constraints that must appear in the metrics: prescription validity and compliance, delivery reliability for time-critical medication, refill adherence, and diagnostic report turnaround. Repeat and refill behaviour is the core of the business, since chronic medication produces predictable recurring demand, so refill retention rather than one-off conversion is the metric that matters most.",
    detail:
      "**Why this is not just e-commerce**\n\nThe distinguishing metrics come from the domain:\n\n| Constraint | Metric |\n|---|---|\n| Prescription-only medicines | prescription validation rate, rejection rate |\n| Time-critical medication | on-time delivery rate, stock-out rate on chronic medicines |\n| Chronic conditions | refill adherence, refill retention by cohort |\n| Diagnostics | sample collection to report turnaround time |\n| Consultations | consultation completion rate, follow-up rate |\n| Trust | authenticity complaints, return rate on medicines |\n\nA candidate who produces a generic e-commerce metric set here has not engaged with the product.\n\n**Refill adherence is the North Star candidate**\n\nChronic medication is recurring, predictable and high-margin in aggregate. A customer on regular medication who reliably refills is worth far more than a one-off buyer, and refill adherence measures the product genuinely working — the patient is getting their medicine on time. It is a rare case where the business metric and the user-benefit metric coincide almost exactly, which is what makes it a strong North Star.\n\n**The three business lines**\n\nMedicine, diagnostics and consultation have different economics, different frequencies and different success measures. Asking which is in scope, or handling them separately, is the right move — averaging across them produces meaningless numbers.\n\n**Guardrails specific to healthcare**\n\n- Dispensing errors and safety incidents.\n- Prescription compliance — dispensing prescription-only medicines without a valid prescription is a regulatory failure, not a conversion opportunity.\n- Counterfeit or authenticity complaints.\n\nThese are non-negotiable in a way that guardrails in most consumer products are not, and treating them as hard constraints rather than trade-offs is the correct framing.\n\n**Supply side**\n\nInventory availability by SKU and geography, supplier reliability, and pharmacy network coverage. In healthcare a stock-out is not a lost sale, it is a patient without medication — which is why availability deserves more weight here than in ordinary retail.\n\n**Cadence**\n\nDaily: orders, on-time delivery, stock-outs, incidents. Monthly: refill adherence cohorts, retention, category economics.",
    mistakes: [
      "Producing a generic e-commerce metric set.",
      "Ignoring regulatory and safety metrics.",
      "Averaging across medicine, diagnostics and consultation.",
      "Choosing one-off conversion over refill retention.",
    ],
    followUps: [
      "Which of these metrics would you treat as a hard constraint rather than a trade-off?",
      "How would you measure whether patients are actually taking their medication?",
    ],
    tags: ["Tata 1mg", "healthcare", "pharmacy", "refill", "compliance", "AARRR"],
    related: ["pm-c-metrics-method", "pm-c-north-star", "pm-c-guardrail-metrics"],
    sources: [casebook(CASEBOOK_IITK, 52, "Case 4.4 'Tata 1mg Success Metrics', presented as an interview case.")],
  }),
  metrics({
    id: "pm-case-swiggy-metrics",
    category: "Method",
    title: "Performance metrics for a food delivery platform",
    difficulty: "Medium",
    sourceType: "CASEBOOK_INTERVIEW_CASE",
    company: "Swiggy",
    confidence: "high",
    q: "What metrics would you use to measure Swiggy's performance?",
    hint: "Three-sided, not two-sided. Customers, restaurants and delivery partners each need their own metrics.",
    answer:
      "Food delivery is a three-sided marketplace, so I would define metrics for customers, restaurants and delivery partners separately, then add marketplace-health and business metrics. Customer side: orders per active user, conversion, delivery time, cancellations and repeat rate. Restaurant side: active restaurants, order volume per restaurant, acceptance and preparation time. Delivery side: active riders, utilisation, idle time and earnings per hour. Marketplace health is the crucial layer — fill rate, unassigned-order rate and delivery time by zone and hour — and the North Star would be orders delivered on time.",
    detail:
      "**Three sides, not two**\n\nThis is what the question is testing:\n\n| Side | Metrics |\n|---|---|\n| **Customers** | orders per active user, search-to-order conversion, delivery time, cancellation rate, repeat rate, rating |\n| **Restaurants** | active restaurants, orders per restaurant, acceptance rate, preparation time, restaurant churn, commission economics |\n| **Delivery partners** | active riders, orders per rider hour, idle time, earnings per hour, rider churn |\n| **Marketplace** | fill rate, unassigned orders, delivery time by zone and hour, surge frequency |\n| **Business** | GMV, take rate, contribution margin per order, CAC and LTV |\n\nA candidate who covers only the customer side has missed two-thirds of the system, and the two missing sides are where the operational failures actually originate.\n\n**Why \"orders delivered on time\" beats \"orders\"**\n\nOrder count can be grown by accepting orders the network cannot fulfil, which produces late deliveries, cancellations and churn on all three sides. Building the quality condition into the North Star prevents that particular gaming. This is a good, concrete illustration of the guardrail principle.\n\n**Unit economics matter more here than in most consumer products**\n\nFood delivery has thin per-order margins and heavy delivery costs, so contribution margin per order — after delivery cost, discount and support cost — is a first-class metric rather than a finance afterthought. Growth in orders at a negative contribution margin makes the business worse, and a metrics answer that ignores this is missing the industry's defining problem.\n\n**Time and geography are the crucial cuts**\n\nAggregate metrics conceal almost everything in this business. Capacity fails at lunch and dinner peaks in specific zones, not uniformly. Delivery time by zone and hour, and rider utilisation by zone and hour, are where the real operating picture lives.\n\n**Restaurant-side health is the leading indicator**\n\nRestaurant churn and preparation time predict customer experience before customer metrics move. A restaurant with rising preparation times degrades delivery time, which degrades ratings and repeat rate — but the restaurant metric moves first. Naming a leading indicator on the supply side is a strong contribution.\n\n**Guardrails**\n\nRider safety incidents, delivery-time promises kept, food quality complaints, and restaurant margin health. The safety one matters: optimising delivery speed without a safety guardrail creates direct incentives for dangerous riding.",
    mistakes: [
      "Covering only the customer side.",
      "Choosing raw order count as the North Star.",
      "Omitting contribution margin in a thin-margin business.",
      "Reporting aggregate delivery time rather than by zone and hour.",
      "No rider safety guardrail.",
    ],
    followUps: [
      "Why include 'on time' in the North Star?",
      "Which side's metrics move first when things go wrong?",
      "How would you tell whether growth is profitable?",
    ],
    tags: ["Swiggy", "food delivery", "three-sided marketplace", "unit economics", "North Star"],
    related: ["pm-c-metrics-method", "pm-c-north-star", "rca-q-delivery-times", "rca-q-marketplace-imbalance"],
    sources: [casebook(CASEBOOK_IITK, 57, "Case 4.6 'Swiggy Performance Metrics', presented as an interview case.")],
  }),

  // =========================================================== MISCELLANEOUS / JUDGEMENT
  sense({
    id: "pm-case-instagram-story-duration",
    category: "Trade-offs",
    title: "Should Instagram Stories last 48 hours instead of 24?",
    difficulty: "Medium",
    sourceType: "CASEBOOK_INTERVIEW_CASE",
    company: "Instagram",
    confidence: "high",
    q: "Your team is debating whether to extend the duration of Instagram Stories from 24 to 48 hours. Would you approve or reject the proposal? Why?",
    hint: "Work out what the 24-hour limit is actually for before deciding whether to change it. The constraint is probably the feature.",
    answer:
      "I would establish what the 24-hour expiry is for. Stories exist as a low-pressure way to share ephemeral moments, and the ephemerality is not a limitation — it is the mechanism. It lowers the bar to posting, because the content disappears, and it creates a daily return habit, because content missed today is gone tomorrow. Doubling the window weakens both: posting feels more consequential, and the urgency to check in daily halves. So I would reject it as a blanket change, while proposing we test it for specific use cases where a longer window plausibly helps — such as business accounts announcing something time-bound.",
    detail:
      "**The reasoning that makes this a good answer**\n\nThe question looks like a preference question and is actually a systems question: what does the constraint *do*? Three things:\n\n1. **Lowers the posting bar.** Permanent posts invite curation; ephemeral ones do not. Extending the window moves Stories toward feeling like posts, which is the opposite of the feature's purpose.\n2. **Creates daily return.** \"Gone tomorrow\" is a scarcity mechanic driving a daily habit. A 48-hour window halves the urgency.\n3. **Reduces regret.** Content that disappears is safer to post, which is central to the format's appeal for casual sharing.\n\nA candidate who identifies that the constraint is the feature has answered the question, whatever their final recommendation.\n\n**The argument for the change, stated fairly**\n\n- Followers in other time zones or with irregular usage miss content.\n- Higher total views per Story.\n- More content available means more to watch, potentially raising session length.\n\nThese are real, and dismissing them without stating them is weaker than engaging with them.\n\n**Why it probably still fails**\n\nMore views per Story does not mean more value. If daily posting falls because posting feels more consequential, total Stories drop and the format's supply — which is the whole product — shrinks. The metric that would look good (views per Story) is not the metric that matters (Stories posted, and daily return).\n\nThat mismatch between the flattering metric and the real one is the analytical core of the case.\n\n**How to decide it properly**\n\nAn experiment, with the success criterion defined in advance:\n\n- **Primary:** Stories posted per active user, and daily returning users.\n- **Secondary:** views per Story, total Story views.\n- **Guardrail:** if Stories posted per user falls, reject regardless of what views do.\n\nStating that the guardrail overrides the headline metric before running the test is what makes this a disciplined answer.\n\n**A better alternative**\n\nRather than changing the default for everyone, let the poster choose — 24 hours by default, with an option to extend for content where it genuinely helps. That preserves the norm while serving the cases that motivated the proposal, which is usually the right shape for this kind of decision.\n\n**The transferable lesson**\n\nWhen asked to relax a constraint, ask what the constraint is doing. Many product constraints are load-bearing, and the ones that look arbitrary are often the ones doing the most work.",
    mistakes: [
      "Deciding on preference without analysing what the constraint does.",
      "Not stating the case for the change before rejecting it.",
      "Optimising views per Story rather than Stories posted.",
      "Giving a yes/no with no experiment or success criterion.",
    ],
    followUps: [
      "What would make you change your mind?",
      "Which metric would you refuse to ship against?",
      "Would your answer differ for business accounts?",
    ],
    tags: ["Instagram", "Stories", "ephemerality", "constraints", "trade-offs", "experimentation"],
    related: ["pm-c-tradeoffs", "pm-c-guardrail-metrics", "pm-c-critique"],
    sources: [casebook(CASEBOOK_IITK, 73, "Case 6.2 'Instagram Story Duration', presented as an interview case.")],
  }),
  sense({
    id: "pm-case-flight-delay",
    category: "Trade-offs",
    title: "Managing frustrated passengers during a flight delay",
    difficulty: "Medium",
    sourceType: "CASEBOOK_INTERVIEW_CASE",
    confidence: "high",
    q: "You are at an airport boarding gate and a flight is delayed due to severe weather at the destination. Passengers are increasingly frustrated. What would you do?",
    hint: "Understand the cause first. Then recognise that the passengers are not one group — segment them by what they actually need.",
    answer:
      "I would first establish the cause, because it determines what can honestly be promised — here, severe weather at the destination, which means the delay is safety-driven and its duration is uncertain. My immediate action is transparent communication: an announcement explaining the cause and emphasising that the delay exists for their safety, which addresses the frustration that comes from not knowing. Then, as the delay extends, I would segment the passengers — those with connections, those travelling with children, elderly passengers, those with medical needs, business travellers with fixed commitments — because each group needs something different, and treating them as one undifferentiated crowd is why airline delay handling usually fails.",
    detail:
      "**Why this is a product question**\n\nIt looks operational and is really about handling a stakeholder group under stress with incomplete information — which is a substantial part of a PM's job. The transferable skills are communication under uncertainty, segmentation of an affected population, and prioritising limited resources.\n\n**Communication first, and specifically**\n\nMost passenger frustration during a delay comes from *uncertainty* rather than from the delay. The principles:\n\n1. **Explain the cause honestly.** Weather at the destination is legitimate and understandable.\n2. **Lead with safety.** People accept delays they believe protect them.\n3. **Give a next-update time even when you cannot give a departure time.** \"I do not know when we will depart, but I will update you at 3:15\" converts open-ended anxiety into a bounded wait. This is the single most effective intervention available and the one most often missed.\n4. **Update on schedule even when there is no news.** Silence is read as concealment.\n\n**Segmenting the passengers**\n\n| Group | Need |\n|---|---|\n| Onward connections | rebooking, and priority — their cost is highest |\n| Families with children | food, space, somewhere for children to be |\n| Elderly or reduced mobility | seating, assistance, medication access |\n| Medical needs | immediate individual attention |\n| Business travellers | connectivity, rebooking, ability to work |\n| Everyone | food vouchers, lounge access, refreshments |\n\nThe segmentation is the analytical content of the answer. \"Keep passengers informed and offer refreshments\" is a reasonable but undifferentiated response; identifying that a passenger with a missed connection and a passenger with a toddler have entirely different problems is product thinking.\n\n**Prioritising under constraint**\n\nStaff and vouchers are limited. Prioritise by severity of consequence — medical needs first, then those whose onward journey is at risk, then comfort for everyone. Saying the prioritisation rule aloud is better than implying it.\n\n**Proactive over reactive**\n\nRebooking connections *before* passengers ask converts a complaint into a service moment. Waiting for a queue to form at the desk guarantees the worst version of the experience for everyone.\n\n**What not to do**\n\nDo not promise a departure time you cannot support — a missed promise is far worse than uncertainty honestly stated. Do not blame another department. Do not disappear from the gate, which is what turns frustration into anger.\n\n**The systemic close**\n\nIf asked how to prevent this: proactive notification before passengers travel to the airport, automatic rebooking of at-risk connections, and clear published entitlements so people know what they are owed rather than having to argue for it.",
    mistakes: [
      "Treating all passengers as one group.",
      "Promising a departure time that cannot be supported.",
      "Announcing once and then going silent.",
      "Not giving a next-update time when the departure time is unknown.",
    ],
    followUps: [
      "The delay extends to eight hours. What changes?",
      "How would you prioritise when you have vouchers for only half the passengers?",
      "How would you stop this being so bad next time?",
    ],
    tags: ["operations", "communication", "segmentation", "stakeholders", "crisis"],
    related: ["pm-c-tradeoffs", "rca-q-support-tickets", "pm-c-prioritization"],
    sources: [casebook(CASEBOOK_IITK, 77, "Case 6.4 'Flight Delay Management', presented as an interview case.")],
  }),
  sense({
    id: "pm-case-food-ordering-journey",
    category: "Fundamentals",
    title: "Map the food ordering journey",
    difficulty: "Easy",
    sourceType: "CASEBOOK_INTERVIEW_CASE",
    confidence: "high",
    q: "Walk through the user journey of ordering food online, and identify where the experience breaks down.",
    hint: "The journey starts before the app opens and ends after the food arrives. Most candidates only cover the middle.",
    answer:
      "The journey starts before the app: a trigger — hunger, a social occasion, no time to cook — and a decision about whether to order at all rather than cook or eat out. Then: open the app, decide what kind of food, browse or search, evaluate options on rating, price, delivery time and past experience, add items, review the cart, apply offers, choose payment, place the order, wait and track, receive, eat, and rate. The breakdown points cluster at deciding what to eat, which is genuinely hard and where most time goes, at the cart where costs and fees are revealed, and during the wait where the tracking experience determines the perception of the whole order.",
    detail:
      "**The stages people miss**\n\n**Before the app** — the trigger and the decision to order rather than cook. This matters commercially: the competition is not only other delivery apps, it is the kitchen. A product that only competes on being a better delivery app is fighting for share of a market it could instead grow.\n\n**After delivery** — eating, rating and the memory that determines whether they return. Most candidates stop at the doorstep, but retention is decided here.\n\n**Where it actually breaks down**\n\n| Stage | Failure |\n|---|---|\n| Deciding what to eat | choice overload; the hardest problem in the journey |\n| Browsing | the same restaurants dominate every list |\n| Evaluating | ratings compressed into a narrow band, so they do not discriminate |\n| Cart | delivery fee, taxes and surge revealed late |\n| Offers | confusing conditions, coupons that do not apply |\n| Payment | failures, limited methods |\n| Waiting | inaccurate estimates; tracking that stops updating |\n| Delivery | cold food, wrong items, no contact |\n| Post-order | no easy resolution when something is wrong |\n\n**The decision problem is the interesting one**\n\n\"What do I want to eat?\" is the longest and least-served stage. Search assumes you already know. Browsing produces choice overload. This is where a product can genuinely differentiate — through better constrained recommendation, mood or context-based entry points, or reordering shortcuts — and identifying it as the core problem rather than a UI detail is the strongest observation available.\n\n**Late cost revelation**\n\nThe cart is where an attractive item price becomes a much larger total once delivery fee, packaging, taxes and surge are added. It is the biggest abandonment driver, and the fix — showing true totals earlier — trades a worse-looking top of funnel for a better bottom. That is usually the right trade, and being able to argue it is a good moment in the answer.\n\n**The waiting stage disproportionately shapes memory**\n\nAn accurate estimate that is met beats an optimistic one that is missed, even when the optimistic one delivers sooner in absolute terms. Expectation management is the product here, and tracking that visibly updates does more for perceived speed than actually being faster.\n\n**How to use this in an interview**\n\nJourney mapping is rarely the whole question — it is the setup for \"now improve one stage\" or \"which metrics would you track\". Doing the map thoroughly, including the before and after, sets up everything that follows.",
    mistakes: [
      "Starting at the app open and ending at delivery.",
      "Treating browsing as a UI problem rather than a decision problem.",
      "Missing that late cost revelation drives abandonment.",
      "Ignoring the post-order stage, where retention is decided.",
    ],
    followUps: [
      "Which stage would you improve first, and why?",
      "What metrics would you attach to each stage?",
      "How would you help someone who does not know what they want?",
    ],
    tags: ["user journey", "food delivery", "choice overload", "friction", "retention"],
    related: ["pm-c-metrics-method", "pm-c-improvement", "rca-q-cart-abandonment"],
    sources: [casebook(CASEBOOK_IITK, 75, "Case 6.3 'Food Ordering Journey', presented as an interview case.")],
  }),
  sense({
    id: "pm-case-kitchen-prep-time",
    category: "Trade-offs",
    title: "Reduce restaurant kitchen preparation time",
    difficulty: "Medium",
    sourceType: "CASEBOOK_INTERVIEW_CASE",
    confidence: "high",
    q: "How would you reduce kitchen preparation time for restaurants on a food delivery platform?",
    hint: "Preparation time is one component of total delivery time, and the platform does not control the kitchen. That constraint shapes every solution.",
    answer:
      "First I would establish where preparation time sits in the total: order placed, restaurant accepts, preparation, rider waits, transit, delivery. Then I would decompose preparation itself — acceptance delay, queueing behind other orders, actual cooking, and packing — because those have different causes. The critical constraint is that the platform does not operate the kitchen, so the levers are indirect: better demand forecasting so restaurants can prepare, batching and sequencing guidance, incentives tied to preparation-time performance, and smoothing demand across the peak rather than concentrating it.",
    detail:
      "**Decompose before solving**\n\n```\nOrder placed → Accepted → Queued → Cooked → Packed → Rider collects\n```\n\nEach segment has different causes:\n\n| Segment | Cause | Lever |\n|---|---|---|\n| Acceptance delay | staff not watching the tablet | alerts, auto-accept for known items |\n| Queueing | peak concentration | demand smoothing, staggered promises |\n| Cooking | menu complexity, kitchen capacity | menu guidance, prep-ahead items |\n| Packing | packaging process | standardised packaging, pre-packing |\n\nMeasuring which segment dominates is the first task, and the answer differs by restaurant type — a pizza kitchen and a biryani kitchen have completely different profiles.\n\n**The constraint that defines the problem**\n\nThe platform does not run the kitchen. It cannot hire staff, buy equipment or change recipes. Every lever is therefore *indirect*: information, incentives, demand shaping, or menu design guidance. A candidate who proposes operational changes inside the restaurant has missed the constraint, and naming it explicitly is what shows you understood the question.\n\n**Demand smoothing is the highest-leverage move**\n\nKitchens fail at peak, not on average. Levers that flatten the peak:\n\n- Show longer delivery estimates during peak so demand self-selects.\n- Offer small incentives for off-peak ordering.\n- Stagger order release to a restaurant rather than dumping fifteen at once.\n- Allow scheduled ordering.\n\nThis is a genuinely platform-side lever, which is why it fits the constraint better than anything happening inside the kitchen.\n\n**Information levers**\n\nGive restaurants a forecast of the next hour's likely order volume and mix so they can pre-prepare components. A restaurant that knows twenty biryanis are likely between 8 and 9 can have rice ready. That is real value delivered without touching their operations.\n\n**Incentive levers**\n\nRank restaurants partly on preparation-time reliability, and make that visible. Restaurants respond to distribution, so tying visibility to reliability aligns their incentives with the platform's — but it must be **reliability** rather than raw speed, or restaurants will accept orders they cannot deliver on.\n\n**The trade-off to name**\n\nPressuring restaurants on preparation time risks food quality, restaurant satisfaction and restaurant churn. Supply is the scarce side of this marketplace; losing restaurants to hit a delivery-time target is a bad trade. Guardrails: food quality complaints, restaurant churn, and order rejection rate.\n\n**Where the real gain might be**\n\nWorth challenging the premise: if rider wait time exceeds preparation delay, the larger opportunity is better rider dispatch timing — sending the rider to arrive as the food is ready rather than earlier. Questioning whether preparation time is the right target at all is a legitimate and impressive move, provided you have the decomposition to support it.",
    mistakes: [
      "Proposing changes inside the kitchen, which the platform cannot make.",
      "Pushing speed without a food-quality or restaurant-churn guardrail.",
      "Not decomposing preparation into its components.",
      "Accepting the premise without checking whether rider wait is the bigger cost.",
    ],
    followUps: [
      "Rider wait time is larger than preparation delay. Does that change your answer?",
      "How do you avoid restaurants gaming a speed metric?",
      "Which restaurants would you pilot this with?",
    ],
    tags: ["operations", "food delivery", "supply side", "constraints", "demand smoothing"],
    related: ["rca-q-delivery-times", "pm-c-tradeoffs", "pm-case-swiggy-metrics"],
    sources: [casebook(CASEBOOK_IITK, 80, "Case 6.5 'Kitchen Preparation Time', presented as an interview case.")],
  }),

  // =========================================================== GTM
  gtm({
    id: "pm-case-gtm-streaming-kids",
    category: "Launch",
    title: "Go-to-market for a kids tier on a streaming service",
    difficulty: "Medium",
    q: "How would you take a kids tier of a music or video streaming service to market?",
    hint: "Pick a beachhead segment you can already reach, and define what would make you stop.",
    answer:
      "The objective here is household retention rather than incremental revenue — a family that has a kids tier is far harder to churn. The beachhead is existing family-plan subscribers with children: already trusted, cheaply reachable in-product, and the segment where the value is most obvious. Positioning is safety and age-appropriate curation, which is what parents actually buy. I would bundle it into the family plan rather than pricing it separately, so it drives plan upgrades, distribute in-product and by email, launch in one market first, and measure family-plan upgrade rate and parent retention — with a kill criterion if activation among eligible households stays below threshold after 90 days.",
    detail:
      "**Objective first**\n\nA kids tier can be launched for three different reasons and they produce different launches:\n\n| Objective | Consequence |\n|---|---|\n| Incremental revenue | price it separately; market it broadly |\n| **Household retention** | **bundle it; target existing subscribers** |\n| Competitive defence | speed matters more than polish |\n\nChoosing retention, and saying why, structures everything that follows.\n\n**Why existing family-plan subscribers are the right beachhead**\n\n- They are already paying, so no acquisition cost.\n- They are reachable in-product at zero marginal cost.\n- Trust is already established, which matters enormously for a children's product.\n- They can be identified from account data, so targeting is precise.\n\nContrast that with \"parents\" as a segment, which is a demographic rather than an addressable audience.\n\n**Positioning**\n\n*For parents of children under 12 who worry about what their children encounter online, [Product] Kids is a curated space with age-appropriate content and parental controls, unlike the main service where content is unfiltered.*\n\nThe key insight is that the buyer and the user are different people. The child uses it; the parent decides. Positioning must speak to the parent's anxiety, not the child's enjoyment — that is the distinguishing observation in this case.\n\n**Pricing**\n\nBundling into the family plan drives upgrades from individual plans, which is the retention objective. Pricing separately would optimise for revenue instead, and would slow adoption. The choice follows directly from the objective, which is what makes it defensible.\n\n**Launch sequence**\n\nInternal → employee families (a genuinely useful alpha group for a children's product) → closed beta with a few hundred households → soft launch in one market → general availability. Content safety issues surface in real usage, and a staged launch is the only responsible way to find them.\n\n**Metrics and the kill criterion**\n\n- **30 days:** activation among eligible households, content-safety incidents.\n- **60 days:** weekly active children per activated household, family-plan upgrade rate.\n- **90 days:** parent retention versus a matched control, churn difference.\n- **Kill criterion:** activation below the threshold at 90 days, or any material content-safety failure.\n\nDefining what would make you stop is the element almost nobody volunteers, and it is the clearest signal of a disciplined launch.\n\n**Risks specific to this launch**\n\nChild-safety regulation (COPPA and equivalents) is a hard constraint, not a risk to manage. Content licensing may not permit a separate kids surface. And a poorly-curated kids product is a reputational risk out of proportion to its revenue — which argues for a slower, more careful launch than the numbers alone would justify.",
    mistakes: [
      "Targeting 'parents' rather than an addressable segment.",
      "Positioning to the child rather than to the parent who decides.",
      "Pricing separately when the objective is retention.",
      "No kill criterion.",
      "Treating child-safety regulation as a risk rather than a constraint.",
    ],
    followUps: [
      "Why bundle rather than charge separately?",
      "What would make you stop the launch?",
      "How would you handle a content-safety incident in beta?",
    ],
    tags: ["go-to-market", "beachhead", "positioning", "pricing", "kill criterion", "streaming"],
    related: ["pm-c-gtm", "pm-c-metrics-method", "pm-c-tradeoffs"],
    sources: [
      casebook(CASEBOOK_KTC, 264, "The casebook's Go-To-Market section includes streaming-service launch cases of this form."),
      common("Kids-tier launch scenarios also recur across published product interview resources."),
    ],
  }),
];
