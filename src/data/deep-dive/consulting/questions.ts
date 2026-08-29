import { common, gfg, github, casebook, questionsFor, CASEBOOK_FINAL } from "../helpers";
import type { DeepDiveItem } from "../types";

const q = questionsFor("CONSULTING", "consulting-concepts");

/**
 * Consulting and business-analyst interview questions — the non-case half of a
 * consulting loop: fit, business vocabulary, and how you actually behave inside
 * a case.
 *
 * Sourced from the GeeksforGeeks business analyst question list and public
 * case-interview note repositories. No source ties any of these to a specific
 * named interview, so none carries a company attribution.
 */

const GFG_BA = gfg(
  "30+ Business Analyst Interview Questions",
  "https://www.geeksforgeeks.org/data-analysis/business-analyst-interview-questions/",
  "Question published in the GeeksforGeeks business analyst interview question list.",
);
const GH_CASE = github(
  "zwang89/Case-Interview-Notes",
  "https://github.com/zwang89/Case-Interview-Notes",
  "Public case-interview preparation repository covering frameworks including MECE, issue trees and hypothesis-driven structuring.",
);

export const CONSULTING_QUESTIONS: DeepDiveItem[] = [
  // =========================================================== CASE TECHNIQUE
  q({
    id: "cons-q-mece",
    category: "Structuring",
    title: "What is MECE and why does it matter?",
    difficulty: "Medium",
    q: "What does MECE mean, and why do consultants insist on it?",
    hint: "Two properties. Then say what goes wrong when each one fails.",
    answer:
      "Mutually Exclusive, Collectively Exhaustive. Mutually exclusive means your buckets do not overlap, so nothing is counted twice and no finding sits ambiguously in two places. Collectively exhaustive means they cover the whole problem, so nothing important falls outside the structure. It matters because a non-MECE structure produces conclusions you cannot trust — overlapping buckets double-count, and an incomplete set means the real cause may be in the branch you never drew.",
    detail:
      "**What each failure costs you**\n\n| Failure | Consequence |\n|---|---|\n| Not mutually exclusive | double counting; the same driver appears twice and looks bigger |\n| Not collectively exhaustive | the answer may be outside your structure entirely |\n\n**Examples**\n\n- MECE: Profit = Revenue − Cost. Nothing overlaps, nothing is missing.\n- MECE: customers split by new / returning / reactivated.\n- Not MECE: \"marketing, sales, and India\" — India overlaps both and the list omits everything else.\n- Not MECE: \"price too high, product too weak, competitors too strong\" — plausible, overlapping, and incomplete.\n\n**The honest caveat**\n\nMECE is a discipline, not a goal. A perfectly MECE structure that does not help you solve the problem is worse than a slightly imperfect one that does. Interviewers do not want you agonising over whether a branch overlaps by a hair — they want a structure that lets you eliminate branches with data.\n\n**The practical test**\n\nAsk whether every finding has exactly one place to go, and whether anything you can imagine causing the problem has a home in the tree. If yes, it is MECE enough.\n\n**How to use it aloud**\n\nDo not say \"my structure is MECE\" — it is a claim about your own work and it sounds rehearsed. Just present a structure that is, and signpost how you will use it.",
    mistakes: [
      "Announcing that your structure is MECE rather than demonstrating it.",
      "Pursuing perfect exclusivity at the cost of a usable structure.",
      "Buckets that sound distinct but overlap causally.",
    ],
    followUps: ["Give me a MECE breakdown of why a restaurant's profits might fall."],
    tags: ["MECE", "structuring", "issue tree", "framework"],
    related: ["cons-c-structuring", "cons-q-issue-tree", "cons-c-profitability"],
    sources: [GH_CASE, casebook(CASEBOOK_FINAL, 4, "The Frameworks section builds structured approaches on this principle.")],
  }),
  q({
    id: "cons-q-issue-tree",
    category: "Structuring",
    title: "How do you build an issue tree?",
    difficulty: "Medium",
    q: "How would you build an issue tree for a business problem, and what makes a good one?",
    hint: "Top-down from the objective, and every branch should be something you can get a number for.",
    answer:
      "Start from the objective as the root, then break it into the factors that drive it, and break those down again until each leaf is something you could actually investigate or measure. A good tree has three properties: it is MECE at each level, its branches are quantifiable so data can tell you which one matters, and it is shallow enough to use — three levels is usually the practical limit in an interview. The test of a good tree is whether one question can eliminate a whole branch.",
    detail:
      "**Build it top-down**\n\n```\nWhy have profits fallen?\n├── Revenue fell\n│   ├── Volume fell\n│   │   ├── Market shrank\n│   │   └── Share lost\n│   └── Price fell\n│       ├── Discounting\n│       └── Mix shift\n└── Costs rose\n    ├── Variable\n    │   ├── Input prices\n    │   └── Yield / wastage\n    └── Fixed\n        ├── Capacity\n        └── Overhead\n```\n\n**What makes it good**\n\n1. **MECE at each level**, so findings have one home and nothing is missing.\n2. **Quantifiable branches.** \"Revenue fell\" can be checked; \"the brand is weaker\" cannot, directly. Prefer branches the data can adjudicate.\n3. **Shallow.** Three levels covers most cases. A five-level tree cannot be held in the conversation.\n4. **Prunable.** The point is that one question kills a whole branch — \"is this revenue or cost?\" eliminates half the tree immediately.\n\n**Drawing it versus using it**\n\nCandidates sometimes build an elegant tree and then work through every branch methodically. That is the wrong use. The tree exists so you can *skip* branches. Say which branch you are prioritising and why, based on what you have been told.\n\n**Hypothesis-driven variant**\n\nOnce you have the tree, form a view about which branch is likely and test that first. That is faster than exhaustive traversal and it is what distinguishes consulting problem-solving from generic analysis — but only after you have the structure, or you are guessing.\n\n**In an RCA context**\n\nThe same tool appears in data and product interviews as metric decomposition. The vocabulary differs; the technique is identical.",
    mistakes: [
      "Building a tree and then traversing every branch.",
      "Branches that cannot be checked against data.",
      "Going five levels deep in a live conversation.",
    ],
    followUps: [
      "Which branch would you test first, and why?",
      "How is this different from a metric decomposition?",
    ],
    tags: ["issue tree", "MECE", "structuring", "hypothesis", "decomposition"],
    related: ["cons-c-structuring", "cons-q-mece", "rca-c-decomposition"],
    sources: [GH_CASE],
  }),
  q({
    id: "cons-q-hypothesis-driven",
    category: "Structuring",
    title: "What is hypothesis-driven problem solving?",
    difficulty: "Hard",
    q: "What does it mean to be hypothesis-driven in a case, and what is the risk of it?",
    hint: "It makes you fast. It can also make you wrong in a way that is hard to notice.",
    answer:
      "Rather than investigating every branch of your structure equally, you form an early view of the likely answer and design your questions to test it. It is faster, it makes your questions purposeful rather than exploratory, and it mirrors how consulting engagements actually run. The risk is anchoring: commit too early and you will interpret ambiguous evidence as confirmation and stop looking. The discipline that manages it is stating what would disprove your hypothesis, out loud, before you start testing it.",
    detail:
      "**The sequence that balances speed against anchoring**\n\n1. **Structure first.** Build the tree before forming a view, or your hypothesis is a guess dressed up.\n2. **Take a first look at the data** — one or two questions.\n3. **Then hypothesise**, and say so explicitly: \"my working hypothesis is that this is a cost problem in distribution.\"\n4. **Name the disconfirming evidence.** \"If distribution cost per unit is flat year on year, I am wrong and I would move to procurement.\"\n5. **Test the cheapest discriminating question first.**\n6. **Update visibly** when the evidence goes the other way.\n\nStep 4 is the one almost nobody does, and it is the single most impressive habit in a case interview. It converts an assertion into a testable claim and demonstrates that you are not merely confirming yourself.\n\n**Why anchoring is dangerous here**\n\nConfirmation bias is efficient-feeling. Once you believe the answer is pricing, every ambiguous data point looks like pricing, and you stop asking about the branch that actually mattered. In an interview this shows up as a candidate who reaches a confident conclusion the data did not support.\n\n**The other failure**\n\nRefusing to hypothesise at all and working exhaustively through every branch. That runs out of time and reads as an inability to prioritise. Interviewers explicitly value the Pareto instinct — find the 20% of causes producing 80% of the problem.\n\n**Changing your mind well**\n\nSay it plainly: \"that rules out my hypothesis — the cost per unit is flat, so I'll move to the revenue side.\" Updating cleanly on evidence is a strength; quietly abandoning a claim and hoping nobody noticed is not.",
    mistakes: [
      "Hypothesising before any data, so it is a guess.",
      "Never naming what would disprove it.",
      "Interpreting ambiguous evidence as confirmation.",
      "Refusing to prioritise and traversing everything.",
    ],
    followUps: [
      "What evidence would change your mind?",
      "What do you do when the data contradicts your hypothesis halfway through?",
    ],
    tags: ["hypothesis", "structuring", "anchoring", "Pareto", "prioritization"],
    related: ["cons-c-structuring", "cons-q-issue-tree", "rca-c-hypotheses"],
    sources: [GH_CASE, casebook(CASEBOOK_FINAL, 3, "The interviewer-expectations section emphasises the Pareto principle and prioritisation.")],
  }),
  q({
    id: "cons-q-clarifying-questions",
    category: "Interview Format",
    title: "What clarifying questions do you ask at the start of a case?",
    difficulty: "Medium",
    q: "A case prompt is deliberately ambiguous. What do you ask before you start structuring?",
    hint: "Objective, magnitude, timeframe, and whether the industry is affected. Four questions do most of the work.",
    answer:
      "Four questions carry most of the value. What is the client's objective, and what would success look like in measurable terms? What is the magnitude — how much has it moved, in what units? Over what period, and is this the first time? And is this industry-wide or specific to our client, because that single answer eliminates either the entire external branch or the entire internal one. After those I would understand the client's business: the product, the geography, and where they sit in the value chain.",
    detail:
      "**The four, and what each buys**\n\n| Question | Eliminates |\n|---|---|\n| Objective and success criterion | ambiguity about what we are solving for |\n| Magnitude | whether this is a rounding error or a crisis |\n| Duration and first occurrence | gradual drift versus a discrete event |\n| **Industry-wide or client-specific** | **half the tree, in one question** |\n\nThe fourth is the highest-leverage question in any case or root-cause interview. If the whole industry is down, look external; if only the client, look internal.\n\n**Why interviewers care so much about this**\n\nThe casebook is direct that clarifying questions are a litmus test — they show both the breadth of a candidate's thinking and the depth of each thought, and good ones break a large ambiguous problem into tractable parts. They are also the first thing that happens, so they set the tone.\n\n**Ask them, then stop**\n\nThree to five focused questions, then move to structure. Fifteen questions is stalling, and it burns the time you need for analysis. The interviewer will tell you what matters if you ask well.\n\n**Take notes and repeat back**\n\nSummarising what you have been told before structuring — \"so we are a mid-market player, revenue is stable, costs are up, and the industry is growing\" — confirms you heard correctly and buys you a few seconds to think.\n\n**Questions not to ask**\n\nAnything the interviewer plainly does not have, anything you could reasonably assume, and anything that is really you thinking out loud. Each question should have a purpose you could state.",
    mistakes: [
      "Asking fifteen questions before structuring.",
      "Not asking whether the industry is affected.",
      "Questions with no purpose behind them.",
      "Failing to repeat back what you were told.",
    ],
    followUps: [
      "Which single question would you ask if you could only ask one?",
      "How do you know when to stop asking and start structuring?",
    ],
    tags: ["clarifying questions", "case interview", "scoping", "structuring"],
    related: ["cons-c-interview-formats", "cons-c-profitability", "rca-c-method"],
    sources: [casebook(CASEBOOK_FINAL, 3, "The 'art of questioning' expectation is set out in the interviewer-expectations section."), common("Standard opening technique across published case interview resources.")],
  }),
  q({
    id: "cons-q-math-in-case",
    category: "Formulas",
    title: "How do you handle the maths in a case?",
    difficulty: "Medium",
    q: "How should you approach the numerical part of a case interview?",
    hint: "Narrate before you calculate, round aggressively, and sanity-check the answer.",
    answer:
      "Say what you are about to calculate and why before doing it, so the interviewer can follow and correct your approach rather than watching a silent pause. Round aggressively — 1.4 billion, not 1,428,627,663 — because the structure is what is being assessed and precision buys nothing. Write your working so you can retrace it. Then state the result with its units and immediately sanity-check it against something known. The check is not optional; an answer presented without one reads as a calculation rather than a judgement.",
    detail:
      "**Narrate first**\n\n\"To get contribution per unit I'll take price minus variable cost, then multiply by volume to get total contribution, and compare that against fixed costs.\" Now the interviewer can redirect you before you spend two minutes on the wrong computation — and if you make an arithmetic slip, they can see the method was right.\n\n**Rounding rules**\n\n- Use round numbers: 1.4B, 300M, ₹500.\n- Convert percentages to fractions where easier: 12.5% is one eighth.\n- Work in consistent units and say which — crores, millions, lakhs — because unit confusion is the most common source of a wildly wrong answer.\n- Track zeros deliberately. Order-of-magnitude errors are the ones interviewers remember.\n\n**The sanity check**\n\nEvery number gets one:\n\n- Does the implied per-capita figure make sense?\n- Is this a plausible share of a market I know the rough size of?\n- Does an independent method land nearby?\n\n\"That gives about ₹40 crore, which is roughly 3% of the market — plausible for a challenger brand\" is worth far more than the number alone.\n\n**If you make a mistake**\n\nCatch it, say so plainly, correct it, move on. Interviewers are not looking for flawless arithmetic; they are looking at whether you notice and whether you panic. Quietly hoping an error is missed is much worse than fixing it.\n\n**The formulas to have automatic**\n\nContribution margin, break-even units, CAGR, market share, and simple percentage change. Hesitating on those costs credibility disproportionately.",
    mistakes: [
      "Calculating silently.",
      "Carrying unnecessary precision.",
      "Mixing units, especially crores and millions.",
      "No sanity check.",
    ],
    followUps: [
      "Walk me through a break-even calculation out loud.",
      "How would you check that answer without knowing the true value?",
    ],
    tags: ["case maths", "estimation", "sanity check", "units", "communication"],
    related: ["cons-c-formulas", "cons-c-guesstimate-method", "cons-c-communication"],
    sources: [casebook(CASEBOOK_FINAL, 123, "The Appendix collects the formulas assumed in case interviews."), GH_CASE],
  }),
  q({
    id: "cons-q-recommendation",
    category: "Structuring",
    title: "How do you close a case?",
    difficulty: "Medium",
    q: "You have finished the analysis and the interviewer asks for your recommendation. How do you structure it?",
    hint: "Answer first. Then reasons with numbers, then the risk, then next steps.",
    answer:
      "Lead with the recommendation in one sentence, then two or three reasons each with a number attached, then the main risk and how I would mitigate it, then what I would do first. Building up to the conclusion works in an essay and fails here — the interviewer is assessing whether you could brief a partner in thirty seconds. Naming a risk unprompted is what makes the recommendation credible; a recommendation with no acknowledged downside reads as advocacy rather than analysis.",
    detail:
      "**The structure**\n\n1. **Recommendation** — one sentence. \"I recommend entering via acquisition rather than building.\"\n2. **Two or three reasons**, each quantified. \"Building takes three years to reach the share we can buy today; the target is available at roughly 2× revenue; and we lack the local distribution relationships.\"\n3. **The main risk and mitigation.** \"The principal risk is integration — I would make retention agreements with their commercial leadership a condition of the deal.\"\n4. **Next steps.** \"I would start by validating the synergy estimate against their actual contracts.\"\n\n**Synthesis, not summary**\n\nA summary recounts what you did. A synthesis says what it means. \"We looked at revenue, then costs, then segments\" is a summary. \"The decline is entirely in one region and is driven by distribution cost, not demand\" is a synthesis. Only the second is worth saying.\n\n**Conditional recommendations are legitimate**\n\n\"Proceed, but only below a price of X and contingent on securing distribution\" is often the honest answer and is stronger than a false binary. It shows you have identified what the decision actually depends on.\n\n**If you did not finish the analysis**\n\nGive the recommendation the evidence supports and say what you would need to be confident. That is far better than either inventing certainty or refusing to conclude.\n\n**Timing**\n\nKeep it to about a minute. A long close loses the thread it exists to deliver, and running over suggests you cannot distil.",
    mistakes: [
      "Building to the conclusion instead of leading with it.",
      "Summarising the process rather than synthesising the finding.",
      "No risk acknowledged.",
      "Reasons with no numbers attached.",
    ],
    followUps: [
      "What would make you change this recommendation?",
      "What is the single biggest risk you have not resolved?",
    ],
    tags: ["recommendation", "synthesis", "communication", "answer first", "risk"],
    related: ["cons-c-communication", "cons-c-structuring", "cons-c-interview-formats"],
    sources: [casebook(CASEBOOK_FINAL, 3, "The interviewer-expectations section emphasises solution effectiveness and confident communication."), common("Answer-first structuring is standard across published consulting preparation resources.")],
  }),

  // =========================================================== BUSINESS ANALYST
  q({
    id: "cons-q-business-analysis",
    category: "Interview Format",
    title: "What is business analysis, and what does a BA do?",
    difficulty: "Easy",
    q: "Can you explain what business analysis is, and what your primary responsibilities as a Business Analyst would be?",
    hint: "Bridge between business need and delivered solution. Name the artefacts.",
    answer:
      "Business analysis is the practice of identifying a business need, understanding it well enough to define what a solution must do, and making sure what gets delivered actually meets it. The BA sits between stakeholders who have a problem and the team that will build something — eliciting and documenting requirements, modelling the current and desired process, analysing the gap, and validating the delivered solution against the original need. The core skills are analytical, but the job is largely communication.",
    detail:
      "**The responsibilities**\n\n1. **Elicit requirements** — interviews, workshops, observation, document analysis.\n2. **Document them** so they are unambiguous and testable — a BRD, an FRD, user stories, use cases.\n3. **Model the process** — current state, desired state, and the gap between them.\n4. **Analyse and prioritise**, because stakeholders always want more than can be built.\n5. **Support delivery** — answer the team's questions, arbitrate ambiguity, manage scope change.\n6. **Validate** — does the delivered thing meet the need it was defined against?\n\n**The distinction that gets asked**\n\n- **BRD** (Business Requirement Document) — *what* the business needs and *why*. Written for stakeholders, in business language, outcome-focused.\n- **FRD** (Functional Requirement Document) — *how* the system must behave to meet it. Written for the delivery team, specific and testable.\n\nOne is the need; the other is the specification. Confusing them produces documents nobody can use — stakeholders cannot read an FRD, and a team cannot build from a BRD.\n\n**Where BA and PM differ**\n\nA BA typically defines requirements for a solution whose direction is already set; a PM decides the direction and owns the outcome. In many organisations the roles overlap substantially, and saying so is honest rather than evasive.\n\n**The skill that actually matters**\n\nAsking the question behind the request. A stakeholder asking for a report is describing a solution; the BA's job is to find the decision they are trying to make, which is often better served by something else entirely.",
    mistakes: [
      "Describing the role as documentation.",
      "Confusing a BRD with an FRD.",
      "Taking stated requests as requirements without finding the need behind them.",
    ],
    followUps: [
      "What is the difference between a BRD and an FRD?",
      "How does this differ from a product manager?",
    ],
    tags: ["business analysis", "BRD", "FRD", "requirements", "role"],
    related: ["cons-q-gap-analysis", "pm-q-pm-vs-project", "cons-q-requirements-conflict"],
    sources: [GFG_BA],
  }),
  q({
    id: "cons-q-gap-analysis",
    category: "Structuring",
    title: "How do you perform a gap analysis?",
    difficulty: "Medium",
    q: "How would you approach performing a gap analysis in a project?",
    hint: "Three states: where we are, where we want to be, and what stands between them.",
    answer:
      "Establish the current state factually rather than from assumption — how the process actually runs, with measurements. Define the desired state in specific, measurable terms, because \"better\" is not a target. Then identify the gaps between them across process, data, systems, skills and policy, and quantify what each gap costs. Finally prioritise the gaps by impact and effort and propose how to close them. The step that usually gets skipped is documenting the current state properly, and everything downstream depends on it.",
    detail:
      "**The three states**\n\n```\nCurrent state  →  Gap  →  Desired state\n```\n\n**Current state, done properly**\n\nObserve the process as it is actually performed, not as the documentation claims. Measure it — cycle time, error rate, volume, cost per transaction. Talk to the people doing it, who invariably know about workarounds nobody has written down. This is the step organisations skip and it is why so many change programmes solve the wrong problem.\n\n**Desired state**\n\nMeasurable and specific. \"Reduce order processing from four days to one\" is a target. \"Improve efficiency\" is a wish.\n\n**Categorise the gaps**\n\n| Category | Example |\n|---|---|\n| Process | steps that are manual, duplicated or unnecessary |\n| Data | information not captured, or captured inconsistently |\n| Systems | capability that does not exist or does not integrate |\n| People | skills, capacity, ownership |\n| Policy | approvals and rules that force the delay |\n\nSpreading across these categories matters because the instinctive answer is always a system, and frequently the real gap is a policy or an unowned handoff — which is far cheaper to fix.\n\n**Quantify**\n\nEach gap should carry a cost: hours lost, errors caused, revenue delayed. Without numbers you cannot prioritise, and the recommendation becomes a matter of opinion.\n\n**Prioritise and close**\n\nImpact against effort, exactly as in any prioritisation. Some gaps close with a process change and no build at all, and those should be done first — they are cheap and they clarify whether the expensive fix is still needed.",
    mistakes: [
      "Documenting the current state from the process manual rather than observing it.",
      "A desired state with no measurable target.",
      "Assuming every gap needs a system change.",
      "Not quantifying what each gap costs.",
    ],
    followUps: [
      "What if the current state is undocumented and everyone describes it differently?",
      "Which gap would you close first, and why?",
    ],
    tags: ["gap analysis", "current state", "process", "requirements", "prioritization"],
    related: ["cons-q-business-analysis", "cons-c-structuring", "rca-c-decomposition"],
    sources: [GFG_BA],
  }),
  q({
    id: "cons-q-requirements-conflict",
    category: "Structuring",
    title: "Conflicting requirements from multiple stakeholders",
    difficulty: "Medium",
    q: "Can you describe a situation where you had to handle conflicting requirements from multiple stakeholders?",
    hint: "Get behind the stated requirements to the underlying needs — most conflicts dissolve there.",
    answer:
      "The first move is to separate stated requirements from underlying needs, because most apparent conflicts are two stakeholders proposing different solutions to compatible problems. Once the needs are on the table, several conflicts simply dissolve into one better solution. Where a genuine conflict remains, I make the trade-off explicit and quantified, decide against the agreed business objective, and — importantly — close the loop with whoever did not get what they wanted, with the reasoning. Deciding privately is what turns a resolved conflict into an ongoing one.",
    detail:
      "**Requirements versus needs**\n\nFinance asks for a nightly export; operations asks for a live dashboard. Stated, they conflict on build effort. Behind them, both need current figures for a decision — and one well-designed reporting layer serves both. Getting to the need is the highest-yield move available, and it works far more often than people expect.\n\n**When the conflict is real**\n\nSome conflicts are genuine: limited capacity, or two groups who genuinely want opposite behaviour. Then:\n\n1. **Quantify both sides.** Who is affected, how often, at what cost.\n2. **Refer to the agreed business objective**, so the decision is against a criterion rather than a preference.\n3. **Decide, or escalate with a recommendation** — never escalate without a view.\n4. **Communicate the decision and its reasoning** to the party who lost. This is the step that determines whether they cooperate next time.\n\n**Do not split the difference**\n\nA compromise between two coherent designs is frequently worse than either. Building half of each satisfies nobody and costs more than one done properly.\n\n**The prevention**\n\nAgree the prioritisation criterion with stakeholders *before* the conflicts arise. A criterion agreed in the abstract is far easier to apply than one proposed in the middle of a dispute, when it looks like it was chosen to favour a side.\n\n**In an interview**\n\nHave a specific example with named functions, the actual trade-off, the decision, and what happened. Generic accounts of \"facilitating discussion\" are not credible.",
    mistakes: [
      "Treating stated requirements as needs.",
      "Splitting the difference.",
      "Deciding without telling the losing party why.",
      "Escalating with no recommendation.",
    ],
    followUps: [
      "Give an example where the conflict was genuine and could not be dissolved.",
      "How do you keep the relationship after deciding against someone?",
    ],
    tags: ["requirements", "stakeholders", "conflict", "prioritization", "behavioural"],
    related: ["cons-q-business-analysis", "pm-q-conflicting-priorities", "cons-q-scope-creep"],
    sources: [GFG_BA],
  }),
  q({
    id: "cons-q-scope-creep",
    category: "Structuring",
    title: "How would you handle scope creep?",
    difficulty: "Medium",
    q: "How would you handle scope creep in a project?",
    hint: "Distinguish uncontrolled creep from legitimate change. The response differs.",
    answer:
      "First distinguish the two things people call scope creep. Legitimate change — new information genuinely alters what the right solution is — should be welcomed and processed through a change mechanism that makes its cost visible. Uncontrolled creep — additions accumulating informally without anyone assessing the impact — is the actual problem, and it is a process failure rather than a stakeholder failure. The fix is a defined baseline, a change process that prices every addition in time and cost, and visible trade-offs so that adding something means naming what it displaces.",
    detail:
      "**The two things**\n\n| | Cause | Response |\n|---|---|---|\n| **Legitimate change** | new information, changed market, better understanding | welcome it, price it, decide explicitly |\n| **Uncontrolled creep** | informal additions, unclear baseline, nobody pricing it | fix the process |\n\nTreating all change as bad produces a project that ships the wrong thing on schedule. The goal is not zero change; it is that every change is a decision someone made deliberately.\n\n**The mechanism**\n\n1. **A documented, agreed baseline.** Creep is undefinable without one, and the absence of a baseline is the root cause more often than anyone admits.\n2. **A change process** with an impact assessment — time, cost, risk, and what it displaces.\n3. **A visible trade-off.** \"We can add this; it pushes the launch two weeks, or we drop that other item.\" Framed as a choice rather than a refusal, stakeholders usually make a sensible decision themselves.\n4. **A single decision-maker** for scope. Multiple people able to add work is the structural cause.\n5. **Regular re-baselining**, so the plan stays honest rather than fictional.\n\n**The framing that works with stakeholders**\n\nNever \"no\". Always \"yes, and here is what it costs\". The former makes you an obstacle and pushes requests around you; the latter makes the cost visible and lets the requester weigh it. Most people withdraw a request once they see it displaces something they care about more.\n\n**Prevention**\n\nMuch creep comes from requirements that were vague at the outset, so each clarification feels like an addition. Sharper definition up front prevents more creep than any change process controls.",
    mistakes: [
      "Treating all change as illegitimate.",
      "Saying no rather than pricing the request.",
      "No documented baseline, making creep undefinable.",
      "Several people able to add scope.",
    ],
    followUps: [
      "The change genuinely is necessary and the deadline is fixed. Now what?",
      "How do you prevent creep rather than manage it?",
    ],
    tags: ["scope creep", "change control", "baseline", "stakeholders", "trade-offs"],
    related: ["cons-q-requirements-conflict", "pm-q-conflicting-priorities", "pm-c-prioritization"],
    sources: [GFG_BA],
  }),
  q({
    id: "cons-q-oltp-olap",
    category: "Formulas",
    title: "OLTP vs OLAP",
    difficulty: "Medium",
    q: "Can you explain the difference between OLTP and OLAP?",
    hint: "Two systems optimised for opposite access patterns. Say what each is designed to do well.",
    answer:
      "OLTP — online transaction processing — runs the business: many small, fast reads and writes against current data, normalised to keep writes consistent. OLAP — online analytical processing — analyses the business: fewer, much larger read-only queries scanning historical data, denormalised into star schemas and usually stored column-wise so aggregations are fast. They are optimised for opposite access patterns, which is why analytical queries run against a production transactional database are both slow and a risk to the people trying to use it.",
    detail:
      "**Side by side**\n\n| | OLTP | OLAP |\n|---|---|---|\n| Purpose | run the business | analyse the business |\n| Operations | insert, update, small reads | large aggregate reads |\n| Data | current | historical |\n| Schema | normalised (3NF) | denormalised, star schema |\n| Storage | row-oriented | column-oriented |\n| Query volume | very high, tiny | low, huge |\n| Optimised for | write consistency | read throughput |\n\n**Why normalisation differs**\n\nOLTP normalises to avoid update anomalies — a customer address stored once is changed once. OLAP denormalises deliberately, because storage is cheap, the data is not being updated, and every join avoided is a faster query. That is why a warehouse schema looks \"wrong\" to someone trained on transactional design, and being able to explain the reason rather than just the difference is the strong answer.\n\n**Why columnar storage matters**\n\nAnalytical queries touch few columns across millions of rows. Column-oriented storage reads only the columns needed and compresses extremely well, since a column of repeated values compresses far better than a row of mixed types. This is the same principle behind Power BI's VertiPaq engine and Tableau's Hyper extracts — which is a useful connection to draw if the interview is for a BI role.\n\n**The practical consequence**\n\nRunning analytical queries directly on production OLTP is the mistake this question exists to prevent. It is slow, it holds locks, and it degrades the system real users depend on. The answer is a replica, an ETL pipeline into a warehouse, or an extract.\n\n**Where the line blurs**\n\nHTAP systems and modern cloud warehouses handle both to a degree. Acknowledging that is fine, but the distinction remains the right mental model.",
    mistakes: [
      "Describing the difference without explaining why the schemas differ.",
      "Not knowing why columnar storage suits analytics.",
      "Missing the practical point about querying production.",
    ],
    followUps: [
      "Why is a star schema better for analytics than 3NF?",
      "How does this relate to how Power BI or Tableau store data?",
    ],
    tags: ["OLTP", "OLAP", "star schema", "columnar", "data warehouse"],
    related: ["pbi-c-star-schema", "tb-c-extracts", "cons-c-formulas"],
    sources: [GFG_BA],
  }),
  q({
    id: "cons-q-kpis",
    category: "Formulas",
    title: "Which KPIs would you use to measure business success?",
    difficulty: "Medium",
    q: "What KPIs would you focus on to measure business success?",
    hint: "It depends on the business model. Say that, then give a structure rather than a list.",
    answer:
      "It depends entirely on the business model, and saying so is the first mark — a subscription business, a marketplace and a manufacturer need different measures. The structure I would use is four layers: financial health (revenue growth, gross and contribution margin, cash), customer economics (CAC, LTV, payback, retention), operational efficiency (utilisation, cycle time, fill rate — whatever the constraint is), and leading indicators that move before the financials do. And I would insist on guardrails, since any KPI optimised alone will be gamed.",
    detail:
      "**The four layers**\n\n| Layer | Examples | Answers |\n|---|---|---|\n| Financial | revenue growth, gross margin, contribution margin, cash conversion | are we viable? |\n| Customer | CAC, LTV, LTV:CAC, payback, retention, NPS | are we earning customers profitably? |\n| Operational | utilisation, cycle time, fill rate, defect rate | are we running well? |\n| Leading | pipeline, activation, engagement, complaint rate | what happens next? |\n\n**By business model**\n\n- **Subscription** — NRR, churn, MRR decomposition, CAC payback.\n- **Marketplace** — GMV, take rate, liquidity and fill rate, both-sided retention.\n- **Manufacturing** — capacity utilisation, contribution per unit, inventory turns, yield.\n- **Retail** — like-for-like sales, sales per square foot, inventory turns, basket size.\n\nOffering the right set for the stated model, rather than a generic list, is what distinguishes the answer.\n\n**Leading versus lagging**\n\nRevenue is lagging — by the time it moves, the cause is months old. Pipeline, activation and complaint rate move first. A dashboard of only lagging indicators tells you what happened, never what is about to.\n\n**The test for whether a KPI belongs**\n\nWould anyone act differently depending on its value? If not, it is decoration. That test removes most metrics from most dashboards, and stating it is more valuable than any list.\n\n**Guardrails**\n\nEvery KPI optimised hard enough gets gamed. Ticket closure speed gets gamed by closing without resolving; sales growth gets gamed by discounting. Pair each with the measure that catches the shortcut.",
    mistakes: [
      "Listing KPIs without asking about the business model.",
      "Only lagging indicators.",
      "No guardrails.",
      "Metrics nobody would act on.",
    ],
    followUps: [
      "Which of these are leading and which are lagging?",
      "How would each of these be gamed?",
    ],
    tags: ["KPI", "metrics", "business model", "leading indicators", "guardrails"],
    related: ["cons-c-formulas", "pm-c-guardrail-metrics", "pm-q-saas-metrics"],
    sources: [GFG_BA],
  }),
  q({
    id: "cons-q-why-consulting",
    category: "Interview Format",
    title: "Why consulting, and why this firm?",
    difficulty: "Medium",
    q: "Why do you want to work in consulting, and why this firm in particular?",
    hint: "Specific and honest beats polished. Generic answers are the default and they fail.",
    answer:
      "The answer needs to be specific enough that it could not be given about any other candidate or any other firm. For consulting: name what the work actually involves that suits you — variety of problems, the pace of learning, working on decisions that matter, exposure across industries — and tie it to something you have actually done. For the firm: something concrete you know about it, ideally from a conversation with someone who works there rather than from its website. And be honest about the trade-offs, because a candidate who claims not to have considered the hours is not credible.",
    detail:
      "**Why the generic version fails**\n\n\"I like solving problems and working with smart people\" describes every professional job and every firm. It is the default answer, interviewers hear it constantly, and it conveys nothing. The bar is specificity.\n\n**What makes it specific**\n\n- **A concrete experience** that revealed the preference. A project where you enjoyed the structuring more than the building; a case competition; an internship where you saw the work.\n- **A trade-off you have consciously accepted.** \"I want the breadth, and I know that costs depth in any one industry, which I am choosing for now.\"\n- **Something about the firm that is checkable** — a practice area, a piece of published work, a person you spoke to and what they said. \"I spoke to two people in your analytics practice and what struck me was X\" is worth more than any amount of enthusiasm.\n\n**Be honest about the hard parts**\n\nInterviewers know the hours and the travel. A candidate who has clearly not thought about them either has not done their research or is not being straight. Acknowledging the cost and saying why it is worth it now is more convincing than pretending it does not exist.\n\n**The self-awareness version**\n\n\"Why not something else?\" is a common follow-up. Having a real answer — why not banking, why not a product role, why not staying technical — shows you made a choice rather than defaulted.\n\n**Length**\n\nA minute. This is a fit question, not an essay, and over-answering it reads as rehearsed.",
    mistakes: [
      "An answer that would work for any firm.",
      "Pretending the hours and travel are not a cost.",
      "Nothing checkable about the specific firm.",
      "No answer to 'why not something else?'",
    ],
    followUps: [
      "Why not a product role?",
      "What do you expect to find hardest?",
    ],
    tags: ["fit", "behavioural", "motivation", "firm research"],
    related: ["cons-c-interview-formats", "cons-c-communication"],
    sources: [common("Fit questions of this form open essentially every published consulting interview guide.")],
  }),
];
