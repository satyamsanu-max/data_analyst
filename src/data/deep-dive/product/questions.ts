import { common, gfg, github, questionsFor } from "../helpers";
import type { DeepDiveItem } from "../types";

const sense = questionsFor("PRODUCT", "product-sense");
const metrics = questionsFor("PRODUCT", "product-metrics");
const design = questionsFor("PRODUCT", "product-design");
const gtm = questionsFor("PRODUCT", "product-gtm");

/**
 * Product management interview questions.
 *
 * Sourced from two public collections that publish them as lists: the
 * GeeksforGeeks product manager question set, and the open-source
 * ferminrp/pm-interview-questions repository. Both are demonstrably published
 * and demonstrably asked, but neither ties a question to one named interview,
 * so every record here is COMMON_INTERVIEW_QUESTION with no company attributed.
 */

const GFG_PM = gfg(
  "Product Manager Interview Questions",
  "https://www.geeksforgeeks.org/interview-experiences/product-manager-interview-questions/",
  "Question published in the GeeksforGeeks product manager interview question list.",
);
const GH_PM = github(
  "ferminrp/pm-interview-questions",
  "https://github.com/ferminrp/pm-interview-questions",
  "Question published in an open-source list of product manager interview questions.",
);

export const PRODUCT_QUESTIONS: DeepDiveItem[] = [
  // =========================================================== FUNDAMENTALS
  sense({
    id: "pm-q-pm-vs-project",
    category: "Fundamentals",
    title: "Product management vs project management",
    difficulty: "Easy",
    q: "How does product management differ from project management?",
    hint: "One owns the what and the why. The other owns the when and the how.",
    answer:
      "A product manager owns the problem and the outcome — what to build, for whom, and why it matters to the business. A project manager owns delivery — scope, schedule, resources and risk, making sure the agreed thing ships on time. Put simply, the PM decides what success looks like; the project manager gets the team there. On smaller teams one person does both, which is where the confusion comes from.",
    detail:
      "**The clean split**\n\n| | Product manager | Project manager |\n|---|---|---|\n| Owns | the problem and the outcome | the plan and the delivery |\n| Asks | should we build this? | will this ship on time? |\n| Measures | did it move the metric? | was it on scope, schedule, budget? |\n| Horizon | continuous — the product outlives the project | bounded — the project ends |\n| Authority | influence | process |\n\n**The framing that lands**\n\nA project can succeed while the product fails: shipped on time, on budget, and nobody used it. That sentence answers the question better than any list, because it makes the distinction consequential rather than semantic.\n\n**Why interviewers ask it**\n\nCandidates moving from delivery roles often describe PM work as coordination. If your answer is about standups, timelines and Jira, you have described a project manager. The PM's distinguishing work is deciding *what deserves to be built at all*.\n\n**The honest nuance**\n\nOn most teams a PM does real project management too — chasing dependencies, unblocking, communicating slippage. Saying so is realistic rather than a weakness, as long as you are clear which part is the actual accountability.",
    mistakes: [
      "Describing PM work as coordination and scheduling.",
      "Claiming the two never overlap, which is untrue in practice.",
    ],
    followUps: ["Which of the two do you spend more time on today?"],
    tags: ["product management", "project management", "role", "fundamentals"],
    related: ["pm-c-what-is-pm", "pm-q-pm-role"],
    sources: [GFG_PM],
  }),
  sense({
    id: "pm-q-pm-role",
    category: "Fundamentals",
    title: "What is the primary role of a product manager?",
    difficulty: "Easy",
    q: "What is the primary role of a Product Manager in an organisation?",
    hint: "One sentence on accountability, then the activities that follow from it.",
    answer:
      "A product manager guides a product through its lifecycle — from identifying a problem worth solving, through definition and launch, to iteration and eventually retirement — and is accountable for the product meeting both user needs and business objectives. Everything else follows from that dual accountability: user research, prioritisation, working with engineering and design, defining success metrics, and go-to-market.",
    detail:
      "**The dual accountability is the answer**\n\nUser needs *and* business objectives. A product that delights users and loses money is a failure; one that extracts revenue and drives users away is a slower failure. The PM sits precisely where those two are traded off, which is why the role exists at all.\n\n**What the job actually contains**\n\n- Understanding users well enough to know which problem is worth solving.\n- Deciding what to build, and — harder — what not to.\n- Bringing engineering and design to that conclusion, without authority over either.\n- Defining what success looks like before shipping, not after.\n- Working with marketing and sales to get it into people's hands.\n\n**What it does not contain**\n\nDesigning the interface, writing the code, or running the schedule. A PM who does those is either on a very small team or is doing someone else's job at the expense of their own.\n\n**A good closing line**\n\nThe PM owns the outcome, not the output — which is why shipping on time is not by itself a success.",
    mistakes: [
      "Describing the PM as a mini-CEO.",
      "Listing activities without naming the accountability behind them.",
    ],
    followUps: ["What is the hardest part of the role?"],
    tags: ["product management", "role", "lifecycle", "accountability"],
    related: ["pm-c-what-is-pm", "pm-q-pm-vs-project"],
    sources: [GFG_PM],
  }),
  sense({
    id: "pm-q-mvp-mlp",
    category: "Fundamentals",
    title: "MVP vs Minimum Lovable Product",
    difficulty: "Medium",
    q: "Explain the concept of a Minimum Viable Product (MVP), and how a Minimum Lovable Product (MLP) differs.",
    hint: "Both are about the smallest thing you can ship. They disagree about what the smallest thing is for.",
    answer:
      "An MVP is the smallest version that lets you test your riskiest assumption with real users — its purpose is learning, not delighting. An MLP argues that in a crowded market a barely-adequate product teaches you nothing useful, because people reject it for being poor rather than for the reason you were testing, so the minimum bar should include enough quality to be genuinely liked. The right choice depends on what you are uncertain about: MVP when the risk is whether anyone wants this at all, MLP when the risk is whether they will choose you over an existing alternative.",
    detail:
      "**What an MVP is for**\n\nIt is an experiment. The question is not \"is this good enough to ship\" but \"what is the riskiest thing I believe, and what is the cheapest way to find out whether it is true?\" That framing keeps you from building features nobody asked about.\n\n**Why MLP exists as a critique**\n\nIf a category already has good products, a rough MVP produces a confounded result: low usage tells you nothing, because you cannot distinguish \"no demand for this idea\" from \"demand exists but your version was bad\". The MLP argument is that quality is part of viability once alternatives exist.\n\n**The decision**\n\n| Situation | Ship |\n|---|---|\n| New category, unproven demand | MVP — learn fast |\n| Crowded category, known demand | MLP — quality is table stakes |\n| Internal or B2B pilot with committed users | MVP — they will tolerate rough edges |\n| Consumer, discretionary, high switching ease | MLP |\n\n**The trap**\n\n\"MVP\" is routinely used to mean \"a cut-down version we shipped because we ran out of time\". That is not an MVP — it has no hypothesis attached. Naming that misuse is a good way to show you understand the concept rather than the acronym.",
    mistakes: [
      "Treating MVP as a synonym for a rushed first version.",
      "Shipping an MVP with no stated hypothesis, so the result cannot be interpreted.",
    ],
    followUps: [
      "What was the riskiest assumption in the last thing you shipped?",
      "When would a rough MVP give you an uninterpretable result?",
    ],
    tags: ["MVP", "MLP", "experimentation", "hypothesis", "launch"],
    related: ["pm-c-gtm", "pm-c-prioritization", "pm-q-limited-data"],
    sources: [GFG_PM],
  }),
  sense({
    id: "pm-q-jtbd",
    category: "User Research",
    title: "The jobs-to-be-done framework",
    difficulty: "Medium",
    q: "Describe the jobs-to-be-done (JTBD) framework.",
    hint: "It reframes who the customer is. Think about what the customer is hiring your product to do.",
    answer:
      "Jobs-to-be-done says people do not buy products, they hire them to make progress in a particular circumstance. So instead of describing customers demographically, you describe the job: \"when I am commuting and bored, help me feel entertained without needing my hands\". The value is that it reveals your real competitive set — the alternatives someone would hire for the same job, which are often nothing like your product — and it stops you designing for a persona rather than a situation.",
    detail:
      "**The canonical form**\n\n> When [situation], I want to [motivation], so I can [expected outcome].\n\nAll three parts matter. The situation is what triggers the job; the motivation is what they are trying to do; the outcome is how they judge success.\n\n**Why it beats demographics**\n\n\"Urban professionals aged 25–34\" tells you nothing about when they need you. Two people in that bracket have completely different jobs at 8am and 8pm. The situation predicts behaviour; the demographic does not.\n\n**The competitive-set insight**\n\nThis is the most useful output. If the job is \"help me feel less bored on my commute\", your competitors include podcasts, mobile games, social feeds, sleeping and staring out of the window. That set is far more useful than a list of products in your category, and it explains why so many products lose to something nobody thought was a competitor.\n\n**Where it is weak**\n\nJTBD is strong for discovery and positioning and weak for prioritisation — it tells you what people are trying to do, not which of many jobs to serve first. It also risks post-hoc storytelling: any behaviour can be narrated as a job. Pair it with quantitative evidence rather than treating it as sufficient on its own.\n\n**How to use it in an interview**\n\nIf asked to design or improve something, stating the job explicitly early — rather than a persona — is a fast way to sound like you have done real discovery work.",
    mistakes: [
      "Reciting the syntax without using it to identify the competitive set.",
      "Confusing a job with a feature request.",
      "Treating JTBD as a prioritisation framework.",
    ],
    followUps: [
      "What is your product's real competitive set under this framing?",
      "How would you validate a job statement?",
    ],
    tags: ["JTBD", "user research", "positioning", "competition", "discovery"],
    related: ["pm-c-circles", "pm-q-personas", "pm-c-gtm"],
    sources: [GFG_PM],
  }),
  sense({
    id: "pm-q-personas",
    category: "User Research",
    title: "Creating and using user personas",
    difficulty: "Medium",
    q: "How do you create user personas, and why are they important?",
    hint: "They are a research output, not a creative writing exercise. Say what they are built from.",
    answer:
      "A persona is a research-grounded archetype of a user segment — their context, goals, pain points and behaviours — built from interviews, surveys and usage data, not invented. They matter because they force a team to design for a specific person rather than an average of everyone, and because they give a shared shorthand: \"would this work for Priya?\" is a faster conversation than re-arguing the target user every time. Their failure mode is being written once from imagination and then decorating a wall.",
    detail:
      "**How to build one that is worth having**\n\n1. **Talk to real users** — a dozen interviews will surface the recurring patterns.\n2. **Look at behavioural data** — what segments actually behave differently, not what feels like a segment.\n3. **Cluster on behaviour and goals**, not demographics. Two 30-year-old professionals may belong to different personas; a 22-year-old and a 55-year-old may share one.\n4. **Include the uncomfortable parts** — constraints, low technical confidence, competing priorities, reasons they might leave.\n5. **Keep the number small.** Three is usable; eight is a filing system nobody consults.\n\n**What makes them useless**\n\n- Invented rather than researched. A persona with no evidence behind it is a projection of the team's assumptions, and it will confidently mislead.\n- Demographic rather than behavioural.\n- Too many, so nobody remembers which one they are designing for.\n- Never updated as the user base changes.\n\n**The prioritisation point**\n\nHaving personas is not the value — *choosing between them* is. A design case where you list three personas and treat them equally has not made a decision. Naming the primary persona and saying why is the actual work.\n\n**The alternative worth mentioning**\n\nJobs-to-be-done is a useful complement, because it describes the situation rather than the person, and situations predict behaviour more reliably than attributes do.",
    mistakes: [
      "Inventing personas rather than researching them.",
      "Segmenting on demographics when behaviour is what differs.",
      "Listing personas without prioritising one.",
    ],
    followUps: [
      "How would you validate that a persona is real and not an assumption?",
      "How does this relate to jobs-to-be-done?",
    ],
    tags: ["personas", "user research", "segmentation", "prioritization"],
    related: ["pm-c-circles", "pm-q-jtbd", "pm-c-improvement"],
    sources: [GFG_PM],
  }),
  sense({
    id: "pm-q-vision-strategy-roadmap",
    category: "Strategy",
    title: "Product vision vs strategy vs roadmap",
    difficulty: "Medium",
    q: "What is the difference between product vision, strategy and roadmap?",
    hint: "They differ in time horizon and in how often they should change.",
    answer:
      "The vision is the long-term end state — where the product is going and why that matters, and it should rarely change. The strategy is the chosen path to it: which users, which problems, which bets, and explicitly what you are not doing. The roadmap is the sequenced expression of that strategy over time, and it should change as you learn. A common failure is having a roadmap with no strategy behind it, which is just a list of features with dates.",
    detail:
      "**By horizon and volatility**\n\n| | Horizon | Changes |\n|---|---|---|\n| Vision | years | rarely — a changing vision is a warning sign |\n| Strategy | quarters to a year | when evidence changes |\n| Roadmap | weeks to quarters | continuously |\n\n**Strategy is defined by what you exclude**\n\nA strategy that does not say what you are *not* doing is not a strategy — it is an aspiration. \"We will serve small teams first and deliberately not build enterprise administration this year\" is a strategy. \"We will delight customers\" is not.\n\n**The roadmap trap**\n\nRoadmaps presented as dated feature lists create commitments you cannot honour and invite stakeholders to negotiate line items. Framing a roadmap around **outcomes in time horizons** — now / next / later, each tied to a problem rather than a feature — keeps the commitment at the right level and survives learning.\n\n**The test for coherence**\n\nEvery roadmap item should be traceable up to a strategic bet, and every bet up to the vision. If you cannot draw that line for something on the roadmap, either it does not belong or the strategy is not written down.",
    mistakes: [
      "A roadmap with no strategy behind it.",
      "A strategy that excludes nothing.",
      "Treating the roadmap as a set of dated promises.",
    ],
    followUps: [
      "What is your product not going to do this year?",
      "How do you present a roadmap without over-committing?",
    ],
    tags: ["vision", "strategy", "roadmap", "prioritization", "outcomes"],
    related: ["pm-c-what-is-pm", "pm-q-align-strategy", "pm-c-prioritization"],
    sources: [GFG_PM],
  }),
  sense({
    id: "pm-q-align-strategy",
    category: "Strategy",
    title: "Aligning product strategy with business strategy",
    difficulty: "Medium",
    q: "How do you align your product strategy with the overall business strategy?",
    hint: "Start by knowing what the business is actually optimising for this year. Then trace the line.",
    answer:
      "I start by being explicit about what the business is optimising for right now — growth, margin, retention, entering a segment, or surviving a runway — because those imply very different product strategies. Then I trace a line from each product bet to that objective, with a number attached where possible. Where a bet cannot be traced, either it does not belong or the company objective is not actually the one being stated. And I keep the alignment two-way: product evidence should sometimes change the business strategy, not only receive it.",
    detail:
      "**The practical mechanism**\n\n1. **Name the company objective** in the terms the leadership actually uses — often an annual target or an OKR set.\n2. **Decompose it into what product can move.** If the objective is 30% revenue growth, decompose into new customers, expansion and retention, and identify which lever product actually controls.\n3. **Map each bet to a lever**, with an estimate of contribution.\n4. **Say what you are dropping** because it does not serve the objective. This is the step that makes alignment real.\n5. **Report back in the objective's own terms**, not in feature counts.\n\n**Why misalignment usually happens**\n\nNot disagreement — ambiguity. The company objective is stated vaguely enough that three teams each interpret it differently and all believe they are aligned. Asking for the objective in a measurable form is often the highest-value thing a PM can do.\n\n**The two-way point**\n\nA PM who only receives strategy is a feature manager. If user evidence says the target segment will not pay, that is information the business strategy needs, and carrying it upward is part of the job. Saying this shows you understand the seniority of the role.\n\n**A concrete example to have ready**\n\nIf the business is optimising margin rather than growth, the product strategy shifts toward self-serve onboarding and support deflection rather than new-user acquisition features — same product, different priorities, traceable to the objective.",
    mistakes: [
      "Assuming the company objective is understood rather than asking for it measurably.",
      "Mapping every existing plan to the objective retroactively rather than dropping what does not fit.",
      "Treating alignment as one-directional.",
    ],
    followUps: [
      "The business shifts from growth to margin. What changes in your roadmap?",
      "What do you do when evidence contradicts the stated strategy?",
    ],
    tags: ["strategy", "alignment", "OKR", "prioritization", "stakeholders"],
    related: ["pm-q-vision-strategy-roadmap", "pm-c-prioritization", "pm-q-conflicting-priorities"],
    sources: [GFG_PM, GH_PM],
  }),

  // =========================================================== PRIORITISATION & EXECUTION
  sense({
    id: "pm-q-prioritize-initiatives",
    category: "Prioritization",
    title: "How do you prioritise?",
    difficulty: "Medium",
    q: "How do you prioritise initiatives, and how do you handle feature requests from different stakeholders?",
    hint: "Name a criterion and apply it consistently. The framework matters far less than the criterion.",
    answer:
      "I prioritise against a stated objective using a consistent criterion — usually RICE, or an impact-effort view when time is short — and I make the criterion visible so the conversation is about the inputs rather than about who asked. For competing stakeholder requests, the move that resolves most of them is to convert each request into the *problem* behind it: several requests often turn out to be the same underlying problem with different proposed solutions, and one better solution serves them all. Where they genuinely conflict, I show the trade-off explicitly rather than deciding privately.",
    detail:
      "**The criterion matters more than the framework**\n\nRICE, impact-effort, weighted scoring, MoSCoW — all work. What fails is prioritising without saying what you are optimising for, because then every disagreement becomes a disagreement about taste rather than about inputs.\n\n```\nRICE = (Reach × Impact × Confidence) / Effort\n```\n\nConfidence is the underused term: most prioritisation arguments are really disagreements about how sure we are, and making that explicit turns an argument into a question about what evidence would settle it.\n\n**Handling stakeholder requests**\n\n1. **Convert request to problem.** \"Add a bulk export button\" becomes \"finance spends four hours a month re-keying data\". Now you can solve it better, and you can see that two other requests were the same problem.\n2. **Quantify who it affects and what it costs them.**\n3. **Score it the same way as everything else.** Special-casing the loudest requester is how a roadmap becomes incoherent.\n4. **Say no with the reason and the criterion**, not with \"it's not on the roadmap\". People accept a no they can follow.\n5. **Show the queue.** A visible ordered backlog converts \"why isn't mine done\" into \"what would it take to move up\".\n\n**The high-profile customer case**\n\nA large customer asking for something off-strategy is the hardest version. The honest answer weighs the revenue at risk against the cost of the divergence — and if you build it, it should be because the economics justify it, not because they shouted. Building bespoke features for whoever is loudest is how products become unmaintainable.\n\n**What interviewers listen for**\n\nWhether you decide, and whether the decision is reproducible by someone else given the same inputs.",
    mistakes: [
      "Naming a framework without a stated objective to prioritise against.",
      "Special-casing the loudest stakeholder.",
      "Saying no without a reason the requester can follow.",
    ],
    followUps: [
      "Your largest customer wants something off-strategy. What do you do?",
      "Two teams want opposite things. How do you decide?",
    ],
    tags: ["prioritization", "RICE", "stakeholders", "backlog", "trade-offs"],
    related: ["pm-c-prioritization", "pm-q-conflicting-priorities", "pm-c-tradeoffs"],
    sources: [GH_PM, GFG_PM],
  }),
  sense({
    id: "pm-q-conflicting-priorities",
    category: "Trade-offs",
    title: "Conflicting priorities between teams",
    difficulty: "Medium",
    q: "What strategies have you used to manage conflicts within your team, especially between different functions, and how do you handle conflicting priorities between stakeholders?",
    hint: "Most cross-functional conflict is about different objectives, not different opinions. Find the objective first.",
    answer:
      "I start by surfacing what each side is actually optimising for, because most cross-functional conflict is not disagreement about facts — it is two teams correctly optimising different objectives. Sales wants the deal, engineering wants maintainability, support wants fewer tickets, and all three are behaving rationally. Once the objectives are on the table, I reframe the decision against the shared company objective and make the trade-off explicit and quantified. If it still cannot be resolved at that level, it needs escalation with a recommendation attached, not escalation as an abdication.",
    detail:
      "**The reframe that resolves most of it**\n\nConflict between functions is usually structural. Naming it out loud — \"you are optimising for X, they are optimising for Y, both are correct locally\" — depersonalises the argument immediately and moves it from who is right to which objective wins here.\n\n**The sequence**\n\n1. **Understand each position properly**, including the constraint behind it. Engineering resisting a deadline usually has a specific technical reason worth hearing.\n2. **Find the shared objective.** Almost always there is one at company level.\n3. **Quantify the trade-off.** \"Shipping in four weeks instead of eight means we skip the migration, which costs roughly three engineer-weeks later and raises incident risk.\" Numbers move arguments that adjectives do not.\n4. **Decide, or escalate with a recommendation.** Escalating without a view is passing the problem up; escalating with a recommendation and the trade-off is doing your job.\n5. **Close the loop** with whoever did not get what they wanted, with the reasoning.\n\n**Where PMs go wrong**\n\n- Deciding privately and announcing, which converts one conflict into ongoing resentment.\n- Splitting the difference to keep the peace, which frequently produces the worst of both options.\n- Treating it as a personality problem when it is an incentive problem.\n\n**The influence point**\n\nA PM has no authority over engineering or design, so the only durable tools are clarity of reasoning, quality of evidence and credibility built over time. That is why showing your working matters more in this role than in one with formal authority.",
    mistakes: [
      "Treating structural conflict as a personality clash.",
      "Splitting the difference rather than deciding.",
      "Escalating without a recommendation.",
    ],
    followUps: [
      "Give an example where you decided against a senior stakeholder.",
      "How do you rebuild the relationship after deciding against someone?",
    ],
    tags: ["conflict", "stakeholders", "cross-functional", "influence", "trade-offs"],
    related: ["pm-q-prioritize-initiatives", "pm-q-engineering-influence", "pm-c-tradeoffs"],
    sources: [GH_PM, GFG_PM],
  }),
  sense({
    id: "pm-q-engineering-influence",
    category: "Trade-offs",
    title: "Influencing engineering without authority",
    difficulty: "Medium",
    q: "How do you get engineering to listen to you, given that product management has no official authority?",
    hint: "The premise is the answer. Influence comes from being useful and being right, repeatedly.",
    answer:
      "The premise is correct and it is the defining constraint of the role. Influence comes from three things: bringing evidence rather than opinions, so decisions are about data and not seniority; being genuinely useful by removing ambiguity and unblocking rather than adding process; and being consistently right about users, which builds the credibility that makes the next decision easier. The fastest way to lose engineering is to hand down conclusions without the reasoning, or to be wrong about users and not acknowledge it.",
    detail:
      "**What actually builds influence**\n\n1. **Bring the why, not just the what.** An engineer who understands the user problem will frequently propose a better solution than the one you specified — and will care about the outcome rather than the ticket.\n2. **Be the person who removes ambiguity.** Clear problem statements, decisions made rather than deferred, and edge cases thought through before they are hit. This is concretely valuable and it compounds.\n3. **Protect the team.** Absorbing stakeholder churn rather than passing it through is the single most appreciated thing a PM does.\n4. **Take technical concerns seriously.** Tech debt and reliability arguments are usually correct; a PM who reflexively deprioritises them stops hearing about problems early.\n5. **Be right about users, and be seen to be right.** Credibility accrues from predictions that come true.\n\n**What destroys it**\n\n- Specifying solutions rather than problems, which signals you do not trust their judgement.\n- Changing direction without explaining what changed.\n- Committing on their behalf to dates you did not discuss.\n- Being unable to say why something matters.\n\n**The reframe**\n\nLack of authority is often described as a limitation. It is arguably a feature: because you cannot compel, you have to persuade, and a decision the team is persuaded of survives contact with reality far better than one they were told to implement.\n\n**In an interview**\n\nHave a specific example ready of a time engineering disagreed and you changed your mind. That is more convincing than any account of a time you got your way.",
    mistakes: [
      "Answering with process rather than credibility.",
      "Describing influence as persuasion technique rather than being useful and correct.",
      "Having no example of changing your own mind.",
    ],
    followUps: [
      "Tell me about a time an engineer changed your decision.",
      "How do you handle a team that consistently pushes back?",
    ],
    tags: ["influence", "engineering", "authority", "credibility", "collaboration"],
    related: ["pm-c-what-is-pm", "pm-q-conflicting-priorities", "pm-q-technical-depth"],
    sources: [GH_PM],
  }),
  sense({
    id: "pm-q-technical-depth",
    category: "Fundamentals",
    title: "How technical does a PM need to be?",
    difficulty: "Medium",
    q: "How would you rate your technical expertise, and how does it help you in your role as a product manager?",
    hint: "Answer honestly about level, then be specific about what the technical understanding buys you.",
    answer:
      "I would rather describe what my technical understanding lets me do than give it a rating. It lets me have a real conversation about trade-offs — understanding why an approach is expensive, what a migration costs, where the system is fragile — so I can make informed scope decisions rather than accepting or rejecting estimates blindly. It also lets me query data myself, which shortens the loop between a question and an answer considerably. What it does not mean is designing the solution: the team's judgement on how to build is better than mine, and treating it otherwise wastes their expertise.",
    detail:
      "**What technical depth actually buys a PM**\n\n| Capability | Why it matters |\n|---|---|\n| Understanding cost drivers | scope decisions become informed rather than arbitrary |\n| Reading the data yourself | hours instead of days to answer a question |\n| Grasping constraints | you stop proposing things that cannot work |\n| Credibility with engineers | the conversation is peer-level |\n| Understanding tech debt arguments | you can weigh them rather than deferring them |\n\n**The line not to cross**\n\nSpecifying implementation. A PM who dictates architecture is spending their credibility on the one area where the team knows more, and getting worse outcomes for it. Own the problem and the constraints; leave the solution to the people who will maintain it.\n\n**Being honest about level**\n\nOverstating technical depth is quickly exposed and is worse than admitting a gap. \"I can read and write SQL, understand system design at a conceptual level, and I would defer to the team on implementation\" is a strong, credible answer. Claiming more invites a question you cannot answer.\n\n**The genuinely differentiating skill**\n\nBeing able to get your own data. A PM who can write their own queries asks better questions, iterates faster, and does not bottleneck on an analyst — and in an interview this is concrete enough to be checkable.",
    mistakes: [
      "Overstating technical depth.",
      "Claiming technical skill is unnecessary, which reads as incuriosity.",
      "Describing yourself as specifying the implementation.",
    ],
    followUps: [
      "How would you weigh a tech-debt request against a feature?",
      "Can you get your own data, or do you depend on an analyst?",
    ],
    tags: ["technical", "engineering", "collaboration", "data", "credibility"],
    related: ["pm-q-engineering-influence", "pm-c-what-is-pm"],
    sources: [GH_PM, GFG_PM],
  }),
  sense({
    id: "pm-q-failed-project",
    category: "Trade-offs",
    title: "A project that did not go as planned",
    difficulty: "Medium",
    q: "Describe a time when a project or product feature didn't go as planned. How did you handle it, and what was the outcome?",
    hint: "Pick a real failure with a real cause. The learning has to be specific enough to be checkable.",
    answer:
      "The strongest version of this answer names a genuine failure, states the cause honestly including your own contribution, describes what you did once you knew, and identifies a specific change you made afterwards that you can point to. Interviewers are testing whether you can be accountable without being self-flagellating, and whether you learn in a way that changes behaviour rather than producing a platitude. A failure attributed entirely to other people, or one where the lesson is 'communicate more', is a weak answer.",
    detail:
      "**The structure**\n\n1. **Context** — what you were trying to do and why it mattered, briefly.\n2. **What went wrong** — concretely. Adoption was a fraction of forecast; the launch slipped twice; the feature broke a workflow you had not considered.\n3. **The cause, including your part in it.** This is the whole question.\n4. **What you did once you knew** — the recovery matters as much as the failure.\n5. **The specific change since.** Not \"I communicate more\" but \"I now require a written hypothesis and a kill criterion before we build anything over two weeks.\"\n\n**What makes it convincing**\n\nSpecificity. Numbers, dates, the actual decision that was wrong. Vague failures read as invented.\n\n**What makes it weak**\n\n- A failure that is not really a failure (\"we shipped late but it was great\").\n- Blaming engineering, leadership or the market with no self-attribution.\n- A lesson too generic to have changed anything.\n\n**The point about recovery**\n\nHow quickly you noticed matters. A candidate who says \"we had no leading indicator, so we did not know for two months, and now I instrument before launch\" has described both a real failure and a real fix.\n\n**A related question**\n\n\"What was a decision you made that had a negative impact, and how did you learn from it?\" is the same question with the accountability made even more explicit — prepare one example that serves both.",
    mistakes: [
      "Choosing a fake failure.",
      "Attributing the cause entirely to others.",
      "A lesson too generic to be actionable.",
    ],
    followUps: [
      "How long did it take you to notice?",
      "What would you instrument differently next time?",
    ],
    tags: ["behavioural", "failure", "accountability", "learning", "STAR"],
    related: ["pm-q-limited-data", "pm-c-guardrail-metrics"],
    sources: [GH_PM, GFG_PM],
  }),
  sense({
    id: "pm-q-limited-data",
    category: "Trade-offs",
    title: "Deciding with limited data",
    difficulty: "Medium",
    q: "Discuss a time when you had to make a decision with limited data or under uncertainty.",
    hint: "The answer is about how you reduced the uncertainty cheaply, and how reversible you made the decision.",
    answer:
      "The move is not to decide bravely with no information — it is to work out how cheaply the uncertainty can be reduced, and how reversible the decision is. For a reversible decision I would decide fast on the best available evidence and instrument it so we learn quickly. For an irreversible one I would spend more to reduce uncertainty first, because the cost of being wrong is permanent. And I would state the assumption explicitly, so that when it turns out to be wrong we know exactly what to revisit rather than re-litigating everything.",
    detail:
      "**The two axes**\n\n| | Cheap to reverse | Expensive to reverse |\n|---|---|---|\n| **Cheap to learn** | decide now, instrument | run the test first |\n| **Expensive to learn** | decide, set a review date | this is where you slow down |\n\nMost decisions are cheaper to reverse than they feel, which argues for deciding faster than instinct suggests. The genuinely irreversible ones — pricing changes announced publicly, data model decisions, platform commitments, anything involving a promise to customers — deserve real caution.\n\n**Cheap ways to reduce uncertainty**\n\n- Talk to five users. Often enough to kill or confirm a hypothesis.\n- Look at existing behavioural data for a proxy.\n- Ship to 5% and measure.\n- Fake the feature — a button that logs intent and shows \"coming soon\" measures demand before you build.\n- Ask whoever has seen it before; the answer sometimes already exists in the company.\n\n**State the assumption**\n\nThe practice worth describing: write down the assumption the decision rests on, and what would falsify it. When it fails, you know precisely what to revisit, and the team does not re-argue the whole decision.\n\n**What interviewers are checking**\n\nWhether you are paralysed by ambiguity, and whether you are reckless in it. Both fail. The middle — decide at a speed proportional to reversibility, and make the assumption explicit — is the answer.",
    mistakes: [
      "Presenting a decision made on instinct as decisiveness.",
      "Treating every decision as needing full information.",
      "Not distinguishing reversible from irreversible.",
    ],
    followUps: [
      "How would you have known sooner that you were wrong?",
      "Which decisions in your last role were genuinely irreversible?",
    ],
    tags: ["uncertainty", "decision making", "reversibility", "experimentation"],
    related: ["pm-c-tradeoffs", "pm-q-failed-project", "pm-q-ab-testing"],
    sources: [GFG_PM],
  }),

  // =========================================================== METRICS
  metrics({
    id: "pm-q-define-success",
    category: "Method",
    title: "How do you define and measure product success?",
    difficulty: "Medium",
    q: "How do you define success for a product, and how do you measure whether a feature was a success?",
    hint: "Define it before shipping, not after. And name what must not degrade.",
    answer:
      "Success has to be defined before shipping, otherwise you will find a metric that moved and call it a win. Concretely: state the user behaviour the feature is meant to change, choose one primary metric that captures it, name the guardrails that must not degrade, and set the threshold and the time window in advance. After launch I look at adoption, then at whether the primary metric moved for the people who adopted, then at whether the guardrails held — and I am explicit about whether the result is attributable or merely correlated.",
    detail:
      "**Define before, not after**\n\nThe discipline is to write down, before building: the behaviour we expect to change, the primary metric, the guardrails, the threshold that counts as success, and the window. Without that, every launch succeeds — because some number always goes up.\n\n**The three-layer read after launch**\n\n1. **Adoption** — did anyone use it? If not, nothing else matters and the problem is discovery or value, not the feature.\n2. **Effect among adopters** — did the target behaviour change for the people who used it? This is where you learn whether the idea worked.\n3. **Guardrails** — did anything else get worse? A feature that raises engagement and raises churn has not succeeded.\n\n**Attribution honesty**\n\nWithout a controlled rollout, a metric moving after launch is correlation. Seasonality, a marketing push, or another team's release could explain it. If it matters, ship it as an experiment with a holdout; if you cannot, say plainly that the result is suggestive rather than proven. Interviewers notice candidates who claim causation from a before-and-after chart.\n\n**Leading and lagging**\n\nRetention is the outcome you care about and takes months to read. Activation, feature adoption depth and session frequency move first and predict it. Watching only lagging metrics means learning too late to act.\n\n**The kill criterion**\n\nDefining in advance what result would make you remove the feature is rare and impressive. It also prevents the common outcome where an underperforming feature is kept because nobody wants to own removing it.",
    mistakes: [
      "Choosing the metric after seeing the results.",
      "Claiming causation from a before-and-after comparison.",
      "No guardrails, so a harmful feature reads as a success.",
    ],
    followUps: [
      "How would you know the change was caused by your feature?",
      "What result would make you remove it?",
    ],
    tags: ["success metrics", "guardrails", "attribution", "experimentation", "adoption"],
    related: ["pm-c-metrics-method", "pm-c-guardrail-metrics", "pm-q-ab-testing"],
    sources: [GH_PM, GFG_PM],
  }),
  metrics({
    id: "pm-q-ab-testing",
    category: "Method",
    title: "A/B testing for product managers",
    difficulty: "Hard",
    q: "What is A/B testing and how would you use it to make a product decision?",
    hint: "It is a controlled experiment. The PM-relevant parts are what you decide before running it.",
    answer:
      "An A/B test randomly assigns users to two or more variants and compares a pre-declared metric, so the difference can be attributed to the change rather than to anything else happening at the same time. The parts that matter for a PM are all decided beforehand: the hypothesis, the primary metric, the counter-metrics that must not degrade, the minimum effect worth detecting, and therefore the sample size and duration. Deciding those after seeing data is how teams talk themselves into shipping things that did not work.",
    detail:
      "**Before you run it**\n\n1. **Hypothesis** — a specific, falsifiable prediction. \"Moving the CTA above the fold will raise sign-up conversion.\"\n2. **Primary metric** — one. Several primary metrics means you will find one that moved.\n3. **Counter-metrics** — what must not get worse. Conversion up and refunds up is not a win.\n4. **Minimum detectable effect** — the smallest change worth acting on. This drives sample size, and it is the step most often skipped.\n5. **Duration** — at least one full weekly cycle, because weekday and weekend behaviour differ.\n\n**The errors that produce false wins**\n\n- **Peeking.** Checking daily and stopping when it looks significant dramatically inflates false positives. Fix the duration up front, or use a sequential test designed for it.\n- **Multiple comparisons.** Twenty metrics at 95% confidence means one shows significance by chance.\n- **Underpowered tests.** A test too small to detect the effect you care about produces a non-result, not a negative result — those are different conclusions.\n- **Novelty effect.** A new thing gets clicked because it is new. Run long enough for that to decay.\n\n**Practical significance vs statistical**\n\nA statistically significant 0.2% lift may not be worth the maintenance cost. \"Significant\" answers whether the effect is real, not whether it matters.\n\n**When you cannot A/B test**\n\nLow traffic, network effects that leak between variants, pricing changes where fairness matters, or an all-or-nothing launch. Then: staged rollout with a holdout region, difference-in-differences against a comparable segment, or an honest before-and-after with the caveats stated. Knowing the limits is as valuable as knowing the method.",
    mistakes: [
      "Peeking and stopping early.",
      "Not declaring counter-metrics in advance.",
      "Treating an underpowered non-result as evidence of no effect.",
      "Confusing statistical with practical significance.",
    ],
    followUps: [
      "You cannot run a test here. How else would you get evidence?",
      "The result is significant but tiny. Do you ship it?",
    ],
    tags: ["A/B testing", "experimentation", "counter-metrics", "significance", "sample size"],
    related: ["pm-q-define-success", "pm-c-guardrail-metrics", "pm-q-limited-data"],
    sources: [GFG_PM],
  }),
  metrics({
    id: "pm-q-saas-metrics",
    category: "Monetization",
    title: "Key metrics for a SaaS product",
    difficulty: "Medium",
    q: "What key metrics do you track for a SaaS product?",
    hint: "Group them: growth, retention, unit economics, engagement. And know the ratios that judge health.",
    answer:
      "Growth: MRR or ARR with its decomposition into new, expansion, contraction, churn and reactivation. Retention: logo churn, revenue churn, and net revenue retention — the last being the single best health indicator, since above 100% means the existing base grows without any new customers. Unit economics: CAC, LTV, the LTV:CAC ratio and CAC payback period. Engagement: activation rate, DAU/MAU, and feature adoption depth. Plus guardrails on support load and reliability.",
    detail:
      "**Growth — decompose MRR**\n\n```\nNet MRR change = New + Expansion + Reactivation − Contraction − Churn\n```\n\nA flat MRR number hides everything. Contraction in particular loses revenue without losing a customer, and it usually precedes churn.\n\n**Retention — the ratios that matter**\n\n| Metric | Reads |\n|---|---|\n| Logo churn | customers lost |\n| Revenue churn | revenue lost — differs when large accounts churn |\n| **Net revenue retention** | expansion minus churn on the existing base |\n\nNRR above 100% means the business grows even with zero new customers. It is the metric investors look at first, and it is the cleanest single summary of product-market fit in B2B.\n\n**Unit economics**\n\n```\nLTV = ARPU × Gross margin % ÷ Churn rate\nLTV:CAC — around 3:1 is the common health benchmark\nCAC payback — months to recover acquisition cost; under 12 is generally healthy\n```\n\nCAC payback matters more than LTV:CAC for a cash-constrained business, because LTV is realised over years while CAC is spent now.\n\n**Engagement**\n\nActivation rate is the most actionable, because it predicts retention and you can move it. DAU/MAU is only meaningful for products with a genuinely daily use case.\n\n**The distinction to draw**\n\nSelf-serve and enterprise SaaS need different emphases: self-serve lives on activation and CAC payback; enterprise lives on NRR and sales efficiency. Asking which model applies before listing metrics is the right instinct.",
    mistakes: [
      "Listing metrics without grouping or ratios.",
      "Quoting LTV without netting off gross margin.",
      "Ignoring contraction and treating churn as the only revenue loss.",
      "Using DAU/MAU for a product with no daily use case.",
    ],
    followUps: [
      "Which single metric would you put in front of the board?",
      "How does this change between self-serve and enterprise?",
    ],
    tags: ["SaaS", "MRR", "NRR", "LTV", "CAC", "churn", "unit economics"],
    related: ["pm-c-north-star", "rca-q-mrr-drop", "pm-c-metrics-method"],
    sources: [GFG_PM],
  }),
  metrics({
    id: "pm-q-user-satisfaction-vs-business",
    category: "Method",
    title: "Balancing user satisfaction against business metrics",
    difficulty: "Hard",
    q: "Discuss the balance between user satisfaction and business metrics.",
    hint: "They diverge in the short run and converge in the long run. Say where the line is.",
    answer:
      "Over a long enough horizon they converge — a product users dislike eventually loses them, and revenue follows. The tension is entirely short-term: ad load, aggressive upsell, dark patterns and paywalls all raise this quarter's numbers and erode the base slowly enough that the damage is not attributed to them. My approach is to treat user satisfaction measures as guardrails on business metrics rather than as a competing goal, and to be explicit that a change which raises revenue while degrading retention is a loan against future revenue, not a gain.",
    detail:
      "**Why the tension is real**\n\nThe damage is lagged and diffuse. Increasing ad load produces a measurable revenue gain this quarter and a retention cost spread over many months, attributable to nothing in particular. Every incentive in a quarterly-reporting organisation favours the visible gain. Naming that asymmetry is the substance of a good answer.\n\n**The practical mechanism**\n\nMake satisfaction a **guardrail**, not a goal you trade against. Any change optimising a business metric declares in advance what satisfaction or retention degradation would make it unacceptable, and that threshold is binding. That converts a values argument into a pre-agreed decision rule.\n\n**Measures worth using**\n\n- Retention by cohort — the honest long-run signal.\n- Session-end sentiment rather than session length.\n- Support contact rate and complaint themes.\n- NPS or CSAT, treated as directional rather than precise.\n- Voluntary churn reasons.\n\n**Where the line genuinely is**\n\nSome trades are legitimate — charging money is not a dark pattern, and a paywall is a fair exchange if the value is real. The test is whether a user, fully informed about what you did and why, would consider it fair. Changes that only work because users do not notice them fail that test, and that is a usable, non-preachy line to articulate.\n\n**The interview signal**\n\nThis question quietly asks what you would do under pressure. A candidate who optimises the visible metric without noticing the invisible cost has answered something about how they would behave, not just what they know.",
    mistakes: [
      "Claiming there is never a tension.",
      "Treating satisfaction as a soft concern with no measurement.",
      "Offering no mechanism, only good intentions.",
    ],
    followUps: [
      "Leadership wants ad load doubled this quarter. What do you do?",
      "How would you measure the long-run cost?",
    ],
    tags: ["trade-offs", "guardrails", "retention", "ethics", "metrics"],
    related: ["pm-c-guardrail-metrics", "pm-c-tradeoffs", "pm-q-define-success"],
    sources: [GFG_PM],
  }),

  // =========================================================== PRODUCT SENSE / DESIGN
  design({
    id: "pm-q-improve-our-product",
    category: "Improvement",
    title: "How would you improve our product?",
    difficulty: "Medium",
    q: "What aspects of our product do you think should be improved, and how would you improve feature X?",
    hint: "This is asked about the interviewer's own product. Be specific, be respectful, and show you actually used it.",
    answer:
      "I would use the product properly before the interview and come with one or two specific, well-reasoned observations rather than a list. For each: what I observed, which user it affects, why the current design might deliberately be that way, what I would change, and how I would measure whether it worked. The framing matters — you are critiquing something the people in the room built, so the tone should be curiosity about the trade-off rather than confidence that they missed something obvious.",
    detail:
      "**Preparation is the answer**\n\nThis question is really checking whether you used the product. Sign up, complete the core flow, and note where you hesitated. Specific friction you personally hit is far more convincing than a general observation.\n\n**The structure for each observation**\n\n1. **What I noticed**, concretely — where, doing what.\n2. **Who it affects** and how often.\n3. **Why it might be deliberate.** This is the step that separates a candidate from a critic. Most oddities are trade-offs — a constraint, a different user segment, a technical limit, a regulation.\n4. **What I would change**, and what it would cost.\n5. **How I would measure it.**\n\nStep 3 is where you win or lose. Saying \"this seems confusing, though I suspect it exists to serve power users, in which case progressive disclosure might serve both\" reads as someone who has shipped. Saying \"this is confusing, they should simplify it\" does not.\n\n**Tone**\n\nThe people interviewing you probably made the decision you are critiquing. Curiosity travels well; condescension does not. \"I'd be interested to know whether this was a deliberate trade-off\" is both honest and safe.\n\n**Depth over breadth**\n\nTwo observations reasoned through properly beat six listed. A long list reads as unfiltered rather than thoughtful.\n\n**If you genuinely could not access it**\n\nSay so and reason from the public marketing and the category instead. That is far better than inventing observations about a product you have not seen, which is transparent immediately.",
    mistakes: [
      "Not having used the product.",
      "Listing many shallow critiques.",
      "Not asking why the current design might be deliberate.",
      "A condescending tone about the interviewer's own work.",
    ],
    followUps: [
      "Why do you think they built it that way?",
      "How would you measure whether your change worked?",
    ],
    tags: ["product critique", "improvement", "preparation", "trade-offs"],
    related: ["pm-c-critique", "pm-c-improvement", "pm-c-circles"],
    sources: [GH_PM],
  }),
  design({
    id: "pm-q-favourite-product",
    category: "Improvement",
    title: "What is a product you admire, and why?",
    difficulty: "Easy",
    q: "What's the app on your phone with the best UX and why? What's one complex feature you think is really well designed?",
    hint: "Pick something you actually use, and explain the mechanism rather than the feeling.",
    answer:
      "The answer should name a product you genuinely use and then explain *why it works mechanically*, not that it feels nice. Good answers identify a specific design decision and the problem it solves — how a complex capability was made approachable, what was deliberately left out, or how the product handles a hard edge case invisibly. Naming what the designers chose to sacrifice to achieve it is what turns an opinion into product analysis.",
    detail:
      "**What separates a strong answer**\n\nWeak: \"It's clean and intuitive.\" Those are effects, not causes.\n\nStrong: identify the mechanism. Examples of the *shape* of a good observation:\n\n- A complex capability exposed progressively, so a novice sees three options and an expert can reach thirty.\n- Defaults chosen so that the common case requires no decision at all.\n- An irreversible action made recoverable — undo instead of a confirmation dialog, which is faster for everyone and safer.\n- Latency hidden by optimistic updates, so the product feels instant even when it is not.\n- A hard edge case handled silently rather than surfaced as an error.\n\n**Name the sacrifice**\n\nEvery good design gave something up. Simplicity costs power; strong defaults cost flexibility; a focused product costs breadth. Identifying what was traded away demonstrates you are analysing rather than admiring.\n\n**Choosing what to talk about**\n\nSomething you use daily, so you can answer follow-ups in detail. An obscure product you know deeply beats a famous one you know superficially — and the follow-up is always \"what would you change about it?\", so have that ready too.\n\n**The related question**\n\n\"What's a cool innovation you've seen lately?\" is testing whether you are curious about the industry. Have something current, and be able to say why it is interesting rather than just that it exists.",
    mistakes: [
      "Describing feelings rather than mechanisms.",
      "Choosing a product you rarely use.",
      "Not being ready for 'and what would you change?'",
    ],
    followUps: [
      "What did they sacrifice to achieve that?",
      "What would you change about it?",
    ],
    tags: ["product sense", "design", "critique", "curiosity"],
    related: ["pm-c-critique", "pm-q-improve-our-product"],
    sources: [GH_PM],
  }),
  design({
    id: "pm-q-user-research-impact",
    category: "Improvement",
    title: "Research that changed the product",
    difficulty: "Medium",
    q: "Tell me about a time you did user research on a product or feature and that research had a big impact on the product.",
    hint: "The strongest version is research that changed your mind, not research that confirmed you.",
    answer:
      "The version of this that lands is research that *changed the decision* — ideally one where you went in expecting one answer and the users told you something else. Describe what you believed, what method you used and why it suited the question, what you found that surprised you, and what specifically changed as a result. Research that confirmed the existing plan is real work but a weak story, because it does not demonstrate that you would have acted on a contrary result.",
    detail:
      "**The structure**\n\n1. **The decision at stake**, and what you believed going in.\n2. **The method, and why it fitted.** Interviews for why, surveys for how many, usability tests for where people struggle, analytics for what actually happens. Choosing the method well is itself a signal.\n3. **The finding**, especially the part that surprised you.\n4. **What changed** — scope cut, direction reversed, a different problem prioritised.\n5. **The outcome**, with a number if you have one.\n\n**Qualitative and quantitative do different jobs**\n\nA strong answer usually pairs them: interviews to discover the mechanism, data to size it. Interviews alone risk generalising from five people; analytics alone tells you what happened but never why.\n\n**The trap this question sets**\n\nCandidates often describe research that validated their plan. That is fine work and a poor story, because it does not show you were genuinely open. A finding that killed something you wanted to build is far more convincing evidence of intellectual honesty.\n\n**A caution worth voicing**\n\nUsers are reliable about their problems and unreliable about solutions. \"I want a faster horse\" is a real problem badly expressed. Showing that you distinguish reported problems from proposed solutions is a good detail.\n\n**Sample size honesty**\n\nFive interviews surface most usability issues but cannot size a market. Being explicit about what your evidence could and could not support reads as rigorous rather than hedging.",
    mistakes: [
      "Describing research that only confirmed the plan.",
      "Treating user-proposed solutions as requirements.",
      "Generalising from a handful of interviews to a market claim.",
    ],
    followUps: [
      "What did the research not tell you?",
      "How did you decide five interviews was enough?",
    ],
    tags: ["user research", "qualitative", "quantitative", "discovery", "behavioural"],
    related: ["pm-q-personas", "pm-q-jtbd", "pm-q-define-success"],
    sources: [GH_PM],
  }),

  // =========================================================== GTM
  gtm({
    id: "pm-q-launch-success",
    category: "Launch",
    title: "Measuring the success of a product launch",
    difficulty: "Medium",
    q: "How do you measure the success of a product launch?",
    hint: "Different metrics at different horizons. And define them before launch.",
    answer:
      "Different things at different horizons, all defined before launch. In the first week: reach and adoption — did the intended audience find it, and did they try it. In the first month: activation and repeat use — did they get value and come back. At three months: retention against a comparable baseline, and the business metric the launch existed to move. Guardrails run throughout: support load, reliability, and whether anything else in the product got worse.",
    detail:
      "**By horizon**\n\n| Horizon | Question | Metrics |\n|---|---|---|\n| Week 1 | did it land? | reach, awareness, trial rate, first-run completion |\n| Month 1 | did it deliver? | activation, repeat use, adoption depth, qualitative feedback |\n| Month 3 | did it matter? | retention vs baseline, the target business metric, revenue |\n| Throughout | did it break anything? | support tickets, error rates, other features' usage |\n\n**Why the horizons matter**\n\nWeek-one numbers are dominated by launch marketing and novelty, so treating them as evidence of product quality is a mistake. Repeat use in month one is the first honest signal.\n\n**Set the baseline before launch**\n\nComparing to \"before\" is only meaningful if you recorded before. And where possible hold out a segment, because otherwise seasonality and concurrent changes are indistinguishable from your effect.\n\n**The launch-versus-product distinction**\n\nThese are separable failures and diagnosing which you have determines what to fix:\n\n- **Low reach, good conversion among those who found it** — a launch problem. Market it harder.\n- **High reach, low adoption** — a positioning or value problem.\n- **High adoption, no repeat** — a product problem. More marketing makes it worse.\n\n**The kill criterion**\n\nDefining in advance what result would cause you to roll back or sunset is rare and worth stating. Without it, underperforming launches persist because no one owns ending them.",
    mistakes: [
      "Reading week-one numbers as product quality.",
      "No pre-launch baseline.",
      "Not distinguishing a launch failure from a product failure.",
    ],
    followUps: [
      "Reach is high and repeat use is near zero. What is wrong?",
      "What would make you roll it back?",
    ],
    tags: ["launch", "go-to-market", "adoption", "retention", "baseline"],
    related: ["pm-c-gtm", "pm-q-define-success", "rca-q-adoption-low"],
    sources: [GFG_PM],
  }),
  gtm({
    id: "pm-q-pricing-new-product",
    category: "Pricing",
    title: "Pricing a new product in a competitive market",
    difficulty: "Hard",
    q: "Explain your approach to pricing a new product in a competitive market.",
    hint: "Three approaches bound the answer. And pricing is a positioning decision, not a maths problem.",
    answer:
      "I would bound the range first: cost establishes the floor, the value delivered to the customer establishes the ceiling, and competitor pricing determines where within that range we position. Then the decision is strategic rather than arithmetic — penetration pricing to gain share where scale or network effects make share durable, or premium pricing where we can defend a differentiated position. I would also decide the packaging alongside the price, since what is bundled into which tier often matters more to revenue than the headline number.",
    detail:
      "**The bounds**\n\n```\nCost-based    → floor    (what we cannot sustain below)\nValue-based   → ceiling  (what the customer gains, capped by substitutes)\nCompetitive   → position within the range\n```\n\nValue-based analysis is the one candidates skip. If the product saves a customer twenty hours a year, that has a monetary value, and it sets the ceiling far more meaningfully than a competitor's list price does.\n\n**Elasticity, concretely**\n\n```\nBreak-even volume change % = −Δprice / (contribution margin % + Δprice)\n```\n\nA 10% price cut at a 40% contribution margin needs a 33% volume increase to stand still. Producing that number turns a pricing debate into arithmetic and is the single most useful thing to know here.\n\n**Penetration vs skimming**\n\n| | Use when |\n|---|---|\n| Penetration | scale economies or network effects make early share durable |\n| Skimming | early adopters are price-insensitive and you can cut later |\n\nRaising a price later is much harder than lowering one, which argues against under-pricing at launch out of caution.\n\n**Packaging is half the decision**\n\nWhich features sit in which tier determines who upgrades. A good-better-best structure with the middle tier deliberately best-value is standard, and anchoring effects are real.\n\n**Competitive response**\n\nEntering below the incumbent invites a price match from someone with better economics. Any pricing recommendation should state what happens if they respond, and whether our cost position survives it.\n\n**The framing to close on**\n\nPrice is the clearest signal of positioning a product sends. Pricing low is not a neutral choice — it tells the market what you think you are worth.",
    mistakes: [
      "Cost-plus only.",
      "Not computing the break-even volume change for a price move.",
      "Ignoring packaging and tier design.",
      "No consideration of competitive response.",
    ],
    followUps: [
      "What volume increase would a 10% cut need to break even?",
      "The incumbent matches your price. Then what?",
    ],
    tags: ["pricing", "value-based", "elasticity", "packaging", "positioning"],
    related: ["cons-c-pricing", "pm-c-gtm", "cons-case-pricing-generic"],
    sources: [GFG_PM],
  }),
];
