import { casebook, common, adapted, questionsFor, CASEBOOK_IITK, CASEBOOK_KTC } from "../helpers";
import type { DeepDiveItem } from "../types";

const q = questionsFor("DATA", "root-cause");

/**
 * Root cause analysis questions.
 *
 * The first three are structured records of interview cases published in the
 * IITK Product Club casebook, which states they are drawn from actual PM
 * interviews — so they carry the CASEBOOK_INTERVIEW_CASE label and the company
 * named in the case prompt. The rest are recurring RCA scenarios published
 * across interview preparation resources, labelled COMMON_INTERVIEW_QUESTION
 * with no company attributed, because none of those sources names one.
 *
 * The prompts below are our own concise restatements and the explanations are
 * original teaching notes. No transcript is reproduced.
 */

export const RCA_QUESTIONS: DeepDiveItem[] = [
  // =========================================================== CASEBOOK CASES
  q({
    id: "rca-q-uber-revenue",
    category: "Revenue",
    title: "Uber revenue decline in India",
    difficulty: "Hard",
    sourceType: "CASEBOOK_INTERVIEW_CASE",
    company: "Uber",
    confidence: "high",
    q: "Uber is seeing a decline in its revenue. Analyse the reason behind it.",
    hint: "Clarify which service and which geography first. Then ask one question that eliminates the entire external branch at once.",
    answer:
      "I would first scope it — rides or Eats, which geography, how large, and is this the first occurrence. Then I would ask whether competitors are seeing the same decline, because that single question separates market-wide causes from Uber-specific ones. If it is Uber-specific, I would decompose revenue into its streams — ride commissions, cancellations, promotions, advertising — to find which one moved, then walk the driver and rider journeys to locate where the breakdown occurs. In this case the decline traces to ride commissions, and the underlying cause is a supply-demand geographic mismatch: drivers finish trips in low-demand areas and then wait a long time for the next request, so completed rides per driver fall.",
    detail:
      "**How the case actually narrows**\n\n1. **Scope** — rides only, India only, first occurrence, magnitude unspecified but material.\n2. **The branch-eliminating question** — are competitors seeing this too? No, it is Uber-specific. That removes regulation, fuel prices, public transport shifts and macro conditions in one move.\n3. **Decompose revenue** — commissions, cancellation fees, promotions, advertising. The decline sits in ride commissions.\n4. **Which service type** — narrows further within the ride business.\n5. **Walk the driver journey** — log in, wait, accept, reach pickup, drop off, wait again. Are drivers rejecting or cancelling? No. So the problem is *after* the ride completes.\n6. **The finding** — drivers face long delays getting a new request after a drop-off, because drop-offs leave them in low-demand zones.\n\n**Why this is a good case**\n\nIt is a **marketplace** problem, and the instinct to look only at the demand side would miss it entirely. Riders wanting rides and drivers wanting rides is not enough — they have to be in the same place. The utilisation loss is geographic, not volumetric.\n\n**The recommendation**\n\nGive drivers visibility of where demand will be. A ride-expectancy view showing the average rides booked in a 10-minute window at a location, based on historical data, with colour-coded demand zones on a map and notifications when a driver enters a low-demand area.\n\nThe cost side has to be handled explicitly: repositioning burns fuel and time, so the recommendation must weigh expected wait against travel distance rather than simply telling drivers to move.\n\n**Success metrics**\n\nDriver idle time, rides per driver per hour, fuel efficiency, driver earnings, and driver feedback. Note that these are driver-side metrics — the fix is on the supply side even though the symptom was revenue.\n\n**What to take from it**\n\nThe transferable moves are: ask about competitors early to halve the problem, decompose revenue into its actual streams rather than treating it as one number, and walk both sides of a marketplace journey.",
    mistakes: [
      "Investigating only rider-side demand in a marketplace problem.",
      "Not asking whether competitors are affected, and spending the case on external factors.",
      "Recommending that drivers reposition without accounting for fuel and idle-time cost.",
    ],
    followUps: [
      "How would you define ride expectancy as a metric?",
      "How would you present this to drivers without distracting them while driving?",
      "How would you measure whether the feature worked?",
    ],
    tags: ["marketplace", "supply-demand", "utilisation", "revenue", "Uber", "driver experience"],
    related: ["rca-c-internal-external", "rca-c-decomposition", "rca-q-marketplace-imbalance"],
    sources: [
      casebook(CASEBOOK_IITK, 35, "Case 3.3 'Uber Revenue Decline', presented in the casebook as an interview case."),
    ],
  }),
  q({
    id: "rca-q-blinkit-orders",
    category: "Orders",
    title: "Blinkit order volume declining",
    difficulty: "Medium",
    sourceType: "CASEBOOK_INTERVIEW_CASE",
    company: "Blinkit",
    confidence: "high",
    q: "The number of orders on Blinkit is declining. Identify the cause.",
    hint: "Establish the metric definition and the shape of the decline, then walk the order funnel step by step until a step breaks.",
    answer:
      "I would define the metric precisely — successfully placed orders per day — then establish the shape: nationwide or local, which cohorts, which categories, and whether it is a cliff or a gradual slope. Here it is uniform across geographies, demographics and categories, and gradual over about a month, which rules out a localised or category-specific cause. After eliminating tracking changes, promotions and UI changes, I would walk the funnel: app open, search, add to cart, payment, confirmation. Users are adding to cart but not completing, which localises it to checkout — and specifically to payment failures affecting users across multiple banks, which points at the payment gateway rather than any individual bank.",
    detail:
      "**The narrowing sequence**\n\n| Question | Answer | What it rules out |\n|---|---|---|\n| How is 'orders' defined? | successful orders per day | ambiguity |\n| Geographic concentration? | uniform nationwide | local causes |\n| Demographic concentration? | uniform | cohort-specific causes |\n| Category concentration? | uniform | supply and catalogue |\n| Cliff or slope? | gradual, about a month | a single discrete event |\n| Tracking changed? | no | measurement |\n| Promotions changed? | no | pricing incentive |\n| UI changed? | minor tweak only | a redesign |\n\nUniformity across every dimension is itself the finding: it points at something systemic in the core flow rather than anything segment-specific.\n\n**The funnel walk**\n\nApp open → search → add to cart → payment → confirmation. App healthy, search working, carts being filled — but orders not completing. That localises it to the final step.\n\n**The bank question is the good move**\n\nOnce payments are failing, the natural next cut is *whose* payments. If failures were confined to one bank, it would be that bank's issue. They are spread across banks, which means the common element is Blinkit's own gateway integration. That is a clean piece of reasoning by elimination and is the analytical core of the case.\n\n**The recommendation**\n\nInvestigate the gateway: review recent API changes, check server logs for recurring errors and timeouts, and look for conflicts between the platform and the provider. Structurally: alerting on payment success rate so a failure of this kind surfaces in hours rather than over a month.\n\n**The tension worth noticing**\n\nThe decline was *gradual* over a month, while a gateway failure sounds discrete. That is consistent with a partial or intermittent failure — a rising error rate rather than a hard outage — which is exactly the kind of degradation that evades alerting built only for total failure. Raising that observation is a strong addition to the answer.",
    mistakes: [
      "Not pinning down the metric definition before starting.",
      "Skipping the funnel walk and guessing at causes.",
      "Stopping at 'payments are failing' without asking whether it is bank-specific.",
      "Not proposing monitoring so it is caught faster next time.",
    ],
    followUps: [
      "The decline was gradual. Is that consistent with a gateway failure?",
      "What monitoring would have caught this in a day rather than a month?",
    ],
    tags: ["funnel", "checkout", "payment gateway", "orders", "Blinkit", "quick commerce"],
    related: ["rca-c-funnel", "rca-c-segmentation", "rca-q-cart-abandonment"],
    sources: [
      casebook(CASEBOOK_IITK, 39, "Case 3.4 'Blinkit Order Reduction', presented in the casebook as an interview case."),
    ],
  }),
  q({
    id: "rca-q-zomato-orders",
    category: "Orders",
    title: "Zomato order decline concentrated in one cuisine",
    difficulty: "Medium",
    sourceType: "CASEBOOK_INTERVIEW_CASE",
    company: "Zomato",
    confidence: "high",
    q: "Zomato is seeing a decline in orders. Analyse the cause.",
    hint: "This one resolves externally. Work through internal factors to exhaust them, then ask about category-level market trends.",
    answer:
      "After scoping the metric and the period, I would work through internal factors: tracking changes, UI and navigation, and promotions. Here nothing internal explains it — and notably a discount campaign on chicken dishes was actually running, which should have increased orders rather than reduced them. That inconsistency pushes the investigation external. Competitors show no major shifts, but there is a category-level trend: users are moving away from chicken dishes, driven by a nationwide virus outbreak affecting chickens. So the cause is external demand collapse in one category, amplified by supply shortage and price rises.",
    detail:
      "**Why the promotion detail matters**\n\nA discount campaign on chicken was running *during* the decline. That is not a neutral fact — it means demand fell despite an incentive pushing the other way, so the true underlying decline is larger than the observed one. Spotting that a countervailing factor is present is a genuinely good analytical move and is easy to walk past.\n\n**The two mechanisms**\n\nThe outbreak affects the metric through two distinct channels, and a complete answer separates them:\n\n1. **Supply** — restaurants face shortages and higher input costs, so availability falls and prices rise.\n2. **Demand** — customers avoid chicken out of health concern. Crucially this operates on *perception*: even chicken that is entirely safe goes unordered, because the fear is what drives the choice.\n\nThe second is the harder problem, because it cannot be fixed by fixing the supply chain.\n\n**The recommendation**\n\n- **Reassure** — communicate sourcing policies, health inspections and cooking standards; behind-the-scenes content on the site, social channels and in-restaurant signage.\n- **Redirect** — actively promote vegetarian, vegan, seafood and other-meat alternatives through promotions, recommendations and campaigns, so the demand is retained rather than lost.\n\nThe redirect half is the commercially important one: the objective is to keep the order, not to defend the category.\n\n**The structural lesson**\n\nThis case is a reminder that a uniform-looking metric can have a highly concentrated cause. Had the decline been segmented by cuisine early, the concentration in chicken would have appeared immediately and the external branch would have been reached far faster. Segmenting by product category is a cut worth requesting early in any order-volume RCA.\n\n**A fair criticism to voice**\n\nThe investigation exhausted internal factors before segmenting by category. Reversing that order — segment first, then investigate the segment — is the more efficient sequence, and saying so shows you are evaluating the method rather than just following it.",
    mistakes: [
      "Missing that a promotion was running, which masks the true size of the decline.",
      "Treating the outbreak as purely a supply problem and ignoring perception.",
      "Recommending only reassurance, without redirecting demand to alternatives.",
      "Exhausting internal factors before segmenting by category.",
    ],
    followUps: [
      "A discount was running at the same time. What does that tell you about the true decline?",
      "How would you handle the perception problem separately from the supply problem?",
    ],
    tags: ["external factors", "category", "supply shock", "demand", "Zomato", "food delivery"],
    related: ["rca-c-internal-external", "rca-c-segmentation", "rca-q-revenue-decline"],
    sources: [
      casebook(CASEBOOK_IITK, 42, "Case 3.5 'Zomato Order Decline', presented in the casebook as an interview case."),
    ],
  }),
  q({
    id: "rca-q-conversion-drop-premium",
    category: "Conversion",
    title: "Free-to-premium conversion down 20%",
    difficulty: "Hard",
    sourceType: "CASEBOOK_INTERVIEW_CASE",
    confidence: "high",
    q: "A cloud storage service has seen a 20% decline in the conversion rate of free users to premium subscribers. Identify the reason.",
    hint: "Establish whether the drop is concentrated or uniform and whether it is a cliff or a slope, then split hypotheses into external and internal before walking the upgrade journey.",
    answer:
      "First clarify the shape: is the drop consistent across demographics, geographies, devices and operating systems, and did it happen sharply or gradually? Here it is a steady decline over six months, uniform across every segment — which rules out a release bug or a regional cause and points at something systemic. Then split hypotheses: externally, new competitors or better free tiers elsewhere, economic pressure on discretionary spend, or market saturation; internally, metric definition changes, upgrade-flow bugs, or pricing. Walking the user journey locates it: users heavily use the free features but drop off at payment, which points at both a payment-flow defect and a weak value perception of premium.",
    detail:
      "**The two-axis clarification**\n\nTwo questions do most of the work:\n\n1. **Concentrated or uniform?** Uniform across demographics, geography and device rules out platform bugs and regional causes.\n2. **Cliff or slope?** A steady six-month decline rules out any single discrete event and points at something accumulating — competition, saturation, or a slow erosion of perceived value.\n\nA candidate who asks both and states what each rules out has structured the whole case in two questions.\n\n**External hypotheses**\n\n- New competitors, or existing ones improving their free tier — a more generous free tier directly removes the reason to upgrade.\n- Macroeconomic pressure on discretionary spending.\n- Market saturation reducing the pool of users likely to upgrade at all.\n\nAll are checked and none explains it here.\n\n**Internal hypotheses, via the user journey**\n\nDiscovery → sign-up → onboarding → free usage → premium evaluation → upgrade decision → payment.\n\nThe finding: acquisition and onboarding are unchanged, users heavily use free features, and they drop off *during payment*.\n\n**The two root causes**\n\n1. **A payment-flow bug** — a defect preventing the payment page loading correctly on iOS devices, causing abandonment at the final step.\n2. **Weak value perception** — feedback shows many free users see insufficient additional value in premium; features are perceived as non-essential or are poorly communicated in the flow.\n\n**Why two causes is the right answer here**\n\nThese are genuinely different problems with different fixes and different time horizons. The bug is an engineering fix recovering demand that already existed. The value-perception problem is a positioning and packaging problem — arguably the more serious one, because it says the free tier is satisfying the need the paid tier is meant to address.\n\nBeing willing to report two contributing causes, rather than forcing a single tidy answer, is more credible and is usually closer to reality.\n\n**The tension worth naming**\n\nA payment bug is discrete and should produce a step change, yet the decline was gradual over six months. That inconsistency suggests the bug explains part of the drop and the value-perception erosion explains the trend. Saying which cause fits which part of the shape is the strongest possible close.",
    mistakes: [
      "Forcing a single root cause when the evidence supports two.",
      "Not reconciling a discrete bug against a gradual decline.",
      "Skipping the free-tier competitive question, which directly attacks the upgrade motive.",
    ],
    followUps: [
      "The decline is gradual but a bug is discrete. How do you reconcile that?",
      "How would you test whether the free tier is too generous?",
    ],
    tags: ["conversion", "freemium", "upgrade funnel", "payment", "value perception"],
    related: ["rca-c-funnel", "rca-c-internal-external", "rca-q-conversion-drop"],
    sources: [
      casebook(CASEBOOK_IITK, 32, "Section 3.2 sample case, used in the casebook to demonstrate the RCA method."),
    ],
  }),

  // =========================================================== COMMON RCA SCENARIOS
  q({
    id: "rca-q-revenue-decline",
    category: "Revenue",
    title: "Revenue is down. Where do you start?",
    difficulty: "Medium",
    q: "A company's revenue has declined by 15% this quarter. How would you investigate?",
    hint: "Do not list causes. Clarify, validate, decompose, segment — and say what each step rules out.",
    answer:
      "I would clarify first: 15% against what baseline, over what window, and is this the first occurrence. Then validate that the number is real — no definition change, no incomplete period, no broken pipeline. Then decompose: revenue is orders times average order value, so establish which one moved, and one level further, orders is users times orders per user. Then segment along geography, channel, product line, customer tier and new versus returning to see whether the drop is concentrated or uniform. Only then do I generate hypotheses, and I would ask early whether competitors are seeing the same movement, because that halves the problem.",
    detail:
      "**Step 1 — clarify**\n\n- 15% versus last quarter, or the same quarter last year? Sequential comparisons carry seasonality; year-on-year carries structural change.\n- Is the current period complete?\n- Has this happened before?\n- Is it gross or net revenue? Returns and refunds behave differently from bookings.\n\n**Step 2 — validate**\n\nDefinition changes, pipeline failures, partial loads. Cheap to check, and a real share of \"declines\" resolve here.\n\n**Step 3 — decompose**\n\n```\nRevenue = Orders × AOV\nOrders  = Active users × Orders per user\nAOV     = Items per order × Price per item\n```\n\nEach split roughly halves the search space. Orders down 20% with AOV up 3% is a demand story. Orders flat with AOV down 15% is a pricing or mix story — quite different investigations.\n\n**Step 4 — segment**\n\nGeography, channel, product line, customer tier, new versus returning, platform. Concentrated means a specific cause; uniform means something systemic.\n\nAlso check the **mix**: revenue can fall while every segment's revenue per customer rises, if the customer mix shifted toward lower-value segments.\n\n**Step 5 — internal versus external**\n\n\"Are competitors seeing this?\" If the category is down, look external. If it is only us, look internal.\n\n**Step 6 — hypotheses, prioritised by testability**\n\nWhat shipped, what ended, what changed in the weeks before. Rank by likelihood given the segmentation, and by cost to test.\n\n**Step 7 — close**\n\nRoot cause with its share of the decline, immediate fix, structural fix, and what remains unexplained.\n\n**What interviewers are grading**\n\nNot the answer — the structure, and specifically whether you ask for data before hypothesising. A candidate who says \"let me look at whether this is orders or order value\" before offering a single cause is already ahead.",
    mistakes: [
      "Listing plausible causes immediately.",
      "Not establishing the comparison baseline.",
      "Skipping validation of the metric itself.",
      "Missing a customer-mix shift.",
    ],
    followUps: [
      "It is orders, not order value. What next?",
      "Every segment's revenue per customer is up but total revenue is down. What is happening?",
    ],
    tags: ["revenue", "decomposition", "segmentation", "framework"],
    related: ["rca-c-method", "rca-c-decomposition", "rca-c-internal-external"],
    sources: [common("Revenue-decline RCA is the most frequently published scenario across analytics and PM interview preparation resources.")],
  }),
  q({
    id: "rca-q-dau-drop",
    category: "Engagement",
    title: "Daily active users dropped suddenly",
    difficulty: "Medium",
    q: "Daily active users fell 15% overnight and have stayed flat since. What happened?",
    hint: "The shape of the drop is the biggest clue. A cliff that holds is rarely behavioural.",
    answer:
      "A sharp cliff that then holds flat is almost never a behavioural change — human behaviour shifts gradually. It points at something discrete and technical: an instrumentation break, a release, a definition change, or an outage. I would check whether the drop coincides exactly with a deploy or a data-pipeline boundary, segment by platform and app version, and verify the DAU definition has not changed. Only if all of that is clean would I treat it as a real behavioural drop and investigate acquisition, notifications, or an external event.",
    detail:
      "**Cliff versus slope — the first read**\n\n| Shape | Usually means |\n|---|---|\n| Sharp cliff, holds flat | instrumentation, release, definition change, outage |\n| Sharp cliff, recovers | outage, incident, one-off event |\n| Gradual slope | behaviour, competition, cohort decay, seasonality |\n| Spike then decay | a campaign or press moment ending |\n\nStating this taxonomy immediately shows you have seen real metric charts.\n\n**The checks, in order of cost**\n\n1. **Does the drop align with a deploy?** Overlay the release timeline. Exact alignment is close to conclusive.\n2. **Segment by platform and app version.** A drop confined to one platform or one build is a release problem. This is the single highest-yield cut.\n3. **Did the definition change?** Someone excluded internal traffic, changed the activity threshold, or changed the timezone the day boundary uses. A timezone change alone can shift a daily metric materially.\n4. **Is the pipeline complete?** A partial load looks exactly like a drop.\n5. **Is a specific event missing?** If DAU is derived from an analytics event, check whether that event's volume fell rather than user behaviour.\n\n**If it is genuinely real**\n\nThen segment by new versus returning to separate acquisition from engagement, check whether a marketing channel was switched off, whether push notifications stopped sending, whether an app store ranking or featuring changed, and whether a competitor launched.\n\n**The push-notification cause**\n\nWorth naming specifically: a broken or throttled notification pipeline produces a sharp, sustained DAU drop that looks entirely behavioural, because the users are real and their behaviour did change — they just stopped being reminded. It is a common cause and easy to miss.\n\n**The reflex to demonstrate**\n\n\"What shipped that day?\" is the highest-yield single question in this scenario, and asking it early is what an experienced analyst does.",
    mistakes: [
      "Treating a cliff as a behavioural change.",
      "Not segmenting by app version.",
      "Overlooking notification or messaging pipelines.",
      "Not checking whether the metric definition changed.",
    ],
    followUps: [
      "It is confined to Android. What does that suggest?",
      "Everything checks out technically. Now what?",
    ],
    tags: ["DAU", "engagement", "instrumentation", "cliff", "release"],
    related: ["rca-c-validate", "rca-c-segmentation", "rca-q-mau-decline"],
    sources: [common("Metric-drop scenarios of this form appear consistently across published product and analytics interview guides.")],
  }),
  q({
    id: "rca-q-conversion-drop",
    category: "Conversion",
    title: "Homepage conversion dropped 10% last week",
    difficulty: "Medium",
    q: "Conversion on our homepage dropped by 10% last week. How do you diagnose what happened?",
    hint: "Conversion is a ratio — so either the numerator fell or the denominator rose. Check which before anything else.",
    answer:
      "Conversion is a ratio, so the first question is which side moved: did conversions fall, or did traffic rise while conversions held? A traffic increase from a low-intent channel lowers the rate with nothing actually broken. Assuming conversions genuinely fell, I would compute step-by-step funnel rates rather than end-to-end, to localise which step lost people, then segment that step by device, browser, channel and geography. In parallel I would check what shipped and whether any experiment is running, since an A/B test with a losing variant is a common and easily-missed cause.",
    detail:
      "**Numerator or denominator — the first move**\n\n| What moved | Means |\n|---|---|\n| Conversions fell, traffic flat | something in the experience broke |\n| Traffic rose, conversions flat | mix shift — check channel composition |\n| Both fell | probably upstream: traffic quality or availability |\n\nMost candidates skip this and assume the numerator. The mix-shift case is common and the fix is in marketing, not product.\n\n**Step-wise funnel rates**\n\nCompute each step's rate against its own history. One step will usually have moved while the others held, and that localises the problem immediately. Then segment that specific step.\n\n**The checks worth running in parallel**\n\n1. **What shipped?** Overlay deploys on the conversion chart.\n2. **Is an experiment running?** A test with a losing variant at 50% traffic drags the aggregate down. Checking the experiment platform takes minutes and is very often the answer.\n3. **Page performance.** Load time correlates strongly with conversion. A change that added a heavy script degrades conversion with nothing visibly broken.\n4. **Channel mix.** Compute conversion within each channel. All flat plus a lower total equals a mix shift.\n5. **Device and browser.** A layout defect confined to one browser is invisible in aggregate.\n\n**The experiment cause deserves emphasis**\n\nIt is the most common non-obvious explanation, and it is also the *least* alarming — the system is working as designed, you have just learned the variant is worse. Interviewers appreciate a candidate who asks about running tests early rather than escalating.\n\n**Time-to-convert**\n\nRising median time-to-convert alongside a falling rate indicates friction — a slow step, an added field, a new verification. It is a useful secondary signal that often points at the step before the one that visibly broke.",
    mistakes: [
      "Assuming conversions fell without checking whether traffic rose.",
      "Looking only at end-to-end conversion.",
      "Not checking whether an A/B test is running.",
      "Ignoring page performance as a cause.",
    ],
    followUps: [
      "Traffic is up 20% and conversions are flat. Is anything wrong?",
      "Every channel's conversion is unchanged but the total fell. What happened?",
    ],
    tags: ["conversion", "funnel", "A/B test", "mix shift", "page performance"],
    related: ["rca-c-funnel", "rca-c-segmentation", "rca-q-cart-abandonment"],
    sources: [common("Published widely as a standard product-execution interview scenario.")],
  }),
  q({
    id: "rca-q-cart-abandonment",
    category: "Conversion",
    title: "Cart abandonment has increased",
    difficulty: "Medium",
    q: "There has been a recent increase in cart abandonment. Analyse the cause.",
    hint: "Abandonment is the inverse of checkout completion. Find the step, then find the segment.",
    answer:
      "I would treat this as a checkout funnel problem: cart view, checkout start, address, delivery selection, payment, confirmation. Computing each step's completion rate against its history localises where people are leaving. Then segment that step by device, payment method, order value and customer type. The most common causes cluster into unexpected costs revealed late — shipping, taxes, fees — a technical failure at payment, a slow or broken step, and forced account creation. I would also check whether the cart mix changed, since abandonment naturally rises if more users are adding speculative high-value items.",
    detail:
      "**The checkout funnel**\n\n```\nCart viewed → Checkout started → Address → Delivery → Payment → Confirmed\n```\n\nStep rates, not end-to-end. The step whose rate moved is the investigation.\n\n**The usual causes, by step**\n\n| Step | Common cause |\n|---|---|\n| Cart → checkout | unexpected total; comparison shopping |\n| Checkout → address | forced account creation |\n| Address → delivery | shipping cost or slow delivery revealed here |\n| Delivery → payment | limited payment options |\n| Payment → confirmed | gateway failure, card declines, 3-D Secure friction |\n\n**The cost-revelation problem**\n\nThe most-cited cause of cart abandonment is extra cost appearing late — shipping, taxes, handling. It is a design problem rather than a bug: the earlier the true total is shown, the less abandonment at the end, at the cost of some abandonment earlier. That trade-off is worth naming, because moving abandonment earlier in the funnel is genuinely better even though it looks worse at the top.\n\n**Payment-step failures**\n\nIf the drop is at payment, segment by payment method and by bank or card network. Failures spread across many providers point at your own gateway or integration; failures at one provider point at them. This is the same reasoning as the Blinkit case.\n\n**The mix explanation**\n\nAbandonment can rise with nothing broken. If a campaign drove more browsing-intent traffic, more speculative carts get created and abandoned. Check abandonment within each channel — all flat plus a higher total means mix.\n\n**3-D Secure and verification**\n\nAdded authentication steps reliably increase abandonment. If a regulatory or risk change introduced one recently, that alone can explain a step change, and it is a cause people forget because it was imposed rather than chosen.\n\n**The close**\n\nSeparate the fixable friction from the legitimate abandonment. Some abandonment is people deciding not to buy, which is not a defect. The goal is removing friction, not driving abandonment to zero.",
    mistakes: [
      "Treating all abandonment as a defect.",
      "Not segmenting the failing step by payment method.",
      "Missing a traffic mix change.",
      "Overlooking a newly introduced verification step.",
    ],
    followUps: [
      "Abandonment rose but revenue is flat. What does that mean?",
      "Would showing shipping costs earlier help or hurt?",
    ],
    tags: ["cart abandonment", "checkout", "funnel", "payment", "friction"],
    related: ["rca-c-funnel", "rca-q-blinkit-orders", "rca-q-conversion-drop"],
    sources: [
      casebook(CASEBOOK_IITK, 31, "Listed in section 3.1 as an example RCA interview question."),
      common("Also published widely across product interview preparation resources."),
    ],
  }),
  q({
    id: "rca-q-retention-decline",
    category: "Retention",
    title: "Monthly retention has declined for six months",
    difficulty: "Hard",
    q: "Monthly retention has been declining for six months. How would you investigate?",
    hint: "An aggregate retention number hides the answer. Cohort it, then ask whether newer cohorts are worse or all cohorts dropped together.",
    answer:
      "Aggregate retention mixes cohorts acquired under different conditions, so the first move is to cohort by acquisition period and plot retention by periods-since-acquisition. That separates the two possible stories: if newer cohorts retain worse than older ones did at the same age, the problem is in acquisition or onboarding — we are attracting worse-fit users or the first experience degraded. If all cohorts including old ones dropped at the same calendar moment, something changed in the product or market that hit everyone. Those have completely different investigations, and an aggregate chart cannot distinguish them.",
    detail:
      "**The two shapes**\n\n| Pattern | Points at |\n|---|---|\n| Newer cohorts worse at the same age | acquisition quality, onboarding, activation |\n| All cohorts drop at one calendar date | a product change, an outage, a competitor, a market shift |\n| Curves never flatten | product-market fit, not retention tactics |\n\n**If it is an acquisition-quality problem**\n\nSegment cohorts by channel. Scaling a paid channel commonly brings lower-intent users who retain worse — total users rise while retention falls, and both numbers are behaving exactly as they should. The fix is in channel mix and targeting, not in the product.\n\nAlso check whether onboarding changed. A removed tutorial or an added sign-up field can reduce activation, and activation is the strongest predictor of retention.\n\n**If it is a calendar-aligned drop**\n\nThen it is the same investigation as any metric drop: what shipped, what broke, what did a competitor do. Cohorting has told you to stop looking at acquisition.\n\n**Define retention before measuring it**\n\nRetention of what — any activity, or a meaningful action? The threshold changes the number completely. For a usage product, \"active\" needs a definition; for a subscription, retention is observable but should be separated into **voluntary** and **involuntary** churn, since failed payments are a large share and have entirely different fixes.\n\n**Leading indicators**\n\nBy the time retention moves, those users disengaged weeks earlier. Session frequency, feature breadth and time-between-visits all move first, and monitoring those gives a much faster signal.\n\n**The uncomfortable possibility**\n\nA curve that never flattens means no cohort is forming a habit. That is a product-market fit problem, and no amount of re-engagement tactics fixes it. Being willing to say that is a mark of judgement rather than pessimism.",
    mistakes: [
      "Analysing aggregate retention without cohorting.",
      "Not distinguishing acquisition-quality decline from a product change.",
      "Ignoring involuntary churn in a subscription business.",
      "Treating a fit problem as a tactics problem.",
    ],
    followUps: [
      "Newer cohorts are worse. Where do you look?",
      "What is the difference between voluntary and involuntary churn, and why does it matter?",
    ],
    tags: ["retention", "cohort", "churn", "acquisition quality", "activation"],
    related: ["rca-c-retention", "rca-q-churn-spike", "rca-c-segmentation"],
    sources: [common("Gradual-retention-decline questions are a standard published product interview scenario.")],
  }),
  q({
    id: "rca-q-churn-spike",
    category: "Churn",
    title: "Subscription churn spiked this month",
    difficulty: "Hard",
    q: "Subscription churn jumped from 3% to 5% this month. What would you investigate?",
    hint: "Split voluntary from involuntary before anything else. They are different problems with different fixes.",
    answer:
      "First split voluntary churn — people who cancelled — from involuntary churn, meaning failed payments from expired or declined cards. They look identical in the churn number and have completely different causes and fixes. If it is involuntary, look at payment processing: a gateway change, a card-network update, a dunning process that stopped running. If it is voluntary, segment by cohort, plan, tenure and cancellation reason, and check whether a cohort acquired on a promotion has reached the end of its discount period, which produces a churn spike that is entirely predictable in hindsight.",
    detail:
      "**The first split**\n\n| Type | Cause | Fix |\n|---|---|---|\n| **Involuntary** | expired card, declined payment, failed retry | dunning, card updater, retry logic |\n| **Voluntary** | the user chose to leave | product, price, competition |\n\nInvoluntary churn is frequently a substantial share of total subscription churn and is much cheaper to fix. Checking it first is both the fastest and the highest-return move.\n\n**Involuntary causes to check**\n\n- A payment gateway or acquirer change.\n- Card network updates invalidating stored credentials.\n- A dunning or retry job that silently stopped running.\n- A regulatory change adding authentication to recurring payments.\n\n**Voluntary causes to check**\n\n- **Promotional cohort maturity.** A cohort acquired on a three-month discount churns when the discount ends. If acquisition spiked three months ago, this month's churn spike is arithmetic, not a new problem — and looking at the acquisition chart lagged by the promotion length reveals it instantly.\n- **A price change** taking effect for existing customers.\n- **A product change** removing something people valued.\n- **A competitor** launching or discounting.\n- **Annual renewal timing**, which concentrates decisions into specific months.\n\n**The promotional-cohort explanation deserves emphasis**\n\nIt is the most commonly missed and the most reassuring: nothing is broken, the business simply acquired customers whose willingness to pay full price was never established. The real question it raises is whether promotional acquisition is profitable at all once this churn is priced in — which is a much more valuable finding than a churn number.\n\n**Cancellation reasons**\n\nIf exit-survey data exists, use it — but treat it cautiously. Reported reasons skew toward socially acceptable answers, price especially, and under-report \"I stopped finding it useful\".\n\n**The close**\n\nSeparate the immediate recovery — win-back offers, payment retries — from the structural change: better dunning, revised promotional terms, or fixing whatever drove the voluntary exits.",
    mistakes: [
      "Not separating involuntary from voluntary churn.",
      "Missing a promotional cohort reaching the end of its discount.",
      "Taking exit-survey reasons at face value.",
      "Not checking whether a dunning job stopped running.",
    ],
    followUps: [
      "Acquisition spiked three months ago on a promotion. Does that explain this?",
      "Half the churn is failed payments. What do you do?",
    ],
    tags: ["churn", "subscription", "involuntary churn", "dunning", "cohort"],
    related: ["rca-c-retention", "rca-q-retention-decline"],
    sources: [common("Churn-spike diagnosis appears across subscription-analytics and product interview resources.")],
  }),
  q({
    id: "rca-q-mau-decline",
    category: "Engagement",
    title: "Engagement declining while users grow",
    difficulty: "Hard",
    q: "Monthly active users are growing but sessions per user are falling. Is this a problem?",
    hint: "Not necessarily. Think about what growth does to the composition of the user base.",
    answer:
      "Not necessarily — this pattern is what rapid acquisition looks like. New users are always less engaged than established ones, so growing quickly increases the share of low-tenure users and drags the average down even if no individual cohort became less engaged. The test is to hold tenure constant: cohort users by join date and compare sessions per user at the same age. If each cohort is stable at a given age, the decline is pure mix and the product is fine. If newer cohorts really are less engaged at the same age, then something did change.",
    detail:
      "**The mix effect, concretely**\n\nEstablished users average 20 sessions a month; new users average 5. Doubling the user base with new users halves the average, with nobody becoming less engaged. Every individual is behaving exactly as before.\n\nThis is Simpson's paradox in its most practically common form, and recognising it is the whole point of the question.\n\n**The test**\n\nCohort by join month, plot sessions per user by months-since-join, and compare cohorts at the same age. Stable across cohorts means mix. Declining across cohorts means a real change.\n\n**If it is genuinely real**\n\nThen segment by acquisition channel — a scaled channel bringing lower-intent users — and check whether onboarding or activation changed, since activation quality is what determines the level a cohort settles at.\n\n**Better metrics for this situation**\n\nAn average across a changing population is a poor metric during growth. More robust alternatives:\n\n- **Cohort-level engagement** at fixed tenure.\n- **DAU/MAU ratio** as a stickiness measure, though it has the same mix problem.\n- **Median rather than mean**, which is less distorted by a large low-engagement tail.\n- **Engagement of the established base only**, which answers \"is the core healthy?\" separately from \"are we growing?\".\n\nProposing a better metric rather than only diagnosing the current one is a strong finish.\n\n**When it IS a problem**\n\nIf total sessions are falling in absolute terms, or if the established base's engagement is declining, or if newer cohorts settle at a permanently lower level. That last one matters most for the long run: it means each new user is worth less than the last, which eventually stops growth from compensating.\n\n**The framing to give**\n\n\"Averages across a changing population are unreliable — I would hold tenure constant before concluding anything.\" That sentence answers the question.",
    mistakes: [
      "Declaring a problem without checking for a mix effect.",
      "Declaring it fine without verifying cohorts are stable.",
      "Not distinguishing average from total engagement.",
    ],
    followUps: [
      "How would you present this to an executive worried about the average?",
      "What metric would you use instead?",
    ],
    tags: ["engagement", "Simpson's paradox", "mix effect", "cohort", "metrics"],
    related: ["rca-c-decomposition", "rca-c-retention", "rca-q-dau-drop"],
    sources: [common("A standard published product-metrics interview scenario testing recognition of composition effects.")],
  }),
  q({
    id: "rca-q-marketplace-imbalance",
    category: "Marketplace",
    title: "Marketplace orders falling with demand intact",
    difficulty: "Hard",
    q: "A two-sided marketplace sees orders falling while buyer traffic is flat. What is happening?",
    hint: "Two sides. If demand is intact, look at supply — and at whether the two are actually meeting.",
    answer:
      "If demand is flat and orders are falling, either supply has contracted or the two sides are failing to meet. I would check supply volume and quality — active sellers, listings, availability, and fulfilment reliability — then check the matching layer: search relevance, availability by location and time, and price competitiveness. A marketplace can have adequate supply and adequate demand and still fail if they are mismatched in geography, timing or category, which is precisely what happens when drivers finish trips in low-demand zones or when stock exists in the wrong warehouse.",
    detail:
      "**Decompose both sides**\n\n```\nGMV = Buyers × Orders per buyer × AOV\n    = Sellers × Listings per seller × Sell-through × Price\n```\n\nBoth must reconcile to the same GMV. Working the supply side when the demand side looks healthy is the move most candidates miss.\n\n**Supply-side checks**\n\n- Active seller or provider count, and churn among them.\n- Listings or inventory per seller.\n- Availability — in stock, in the right place, at the right time.\n- Fulfilment reliability: cancellations, late deliveries, rejections.\n- Seller economics: did a commission or fee change push sellers away?\n\n**The matching layer**\n\nThis is where marketplaces fail invisibly. Supply and demand can both be adequate in aggregate and still not meet:\n\n| Mismatch | Example |\n|---|---|\n| Geographic | drivers idle in low-demand zones; stock in the wrong city |\n| Temporal | supply available at the wrong hours |\n| Category | plenty of the wrong products |\n| Price | supply priced above what demand will pay |\n| Discovery | supply exists but search does not surface it |\n\nThe search-relevance case is worth naming: a ranking change can suppress orders with supply and demand both untouched.\n\n**Metrics that expose matching failures**\n\n- **Search-to-result rate** — how often a search returns nothing usable.\n- **Fill rate** — share of demand actually served.\n- **Time-to-match**.\n- **Utilisation** on the supply side — the Uber case's idle time is exactly this.\n\nThese are the metrics an aggregate order count hides, and proposing them is a strong answer.\n\n**The liquidity framing**\n\nMarketplaces are liquidity businesses: the value to each side depends on the other's density. A small supply contraction in one location can trigger disproportionate demand loss there, because the experience degrades below a usable threshold and buyers stop returning. That non-linearity is why marketplace problems are often local rather than global, and why segmenting by location is essential.",
    mistakes: [
      "Investigating only the demand side.",
      "Treating aggregate supply as sufficient without checking whether it meets demand.",
      "Missing search or ranking changes as a cause.",
      "Not segmenting by location, where liquidity effects concentrate.",
    ],
    followUps: [
      "Supply and demand are both flat. What else could suppress orders?",
      "How would you measure whether the two sides are meeting?",
    ],
    tags: ["marketplace", "supply", "demand", "liquidity", "matching", "fill rate"],
    related: ["rca-q-uber-revenue", "rca-c-decomposition", "rca-c-segmentation"],
    sources: [common("Marketplace-imbalance scenarios are a recurring published format in product and analytics interviews.")],
  }),
  q({
    id: "rca-q-traffic-drop",
    category: "Traffic",
    title: "Organic traffic fell sharply",
    difficulty: "Medium",
    q: "Organic search traffic to the site fell 30% over two weeks. What would you investigate?",
    hint: "Separate what the search engine did from what we did. Both are common and the checks differ.",
    answer:
      "I would separate external causes — a search algorithm update, a competitor outranking us, seasonal query volume — from internal ones, which include accidental de-indexing, a robots.txt or noindex change shipped with a release, a site migration losing redirects, page speed degradation, or a broken sitemap. Segmenting by landing page and by query type localises it quickly: a uniform drop across all pages points at a site-wide technical change or an algorithm update, while a drop confined to specific pages points at those pages losing rankings.",
    detail:
      "**Internal causes, roughly in order of frequency**\n\n1. **Accidental noindex or robots.txt block.** A staging configuration shipped to production is a classic and produces a fast, severe drop. Check these first — the check takes seconds.\n2. **Migration without redirects.** A URL structure change without 301s discards accumulated ranking.\n3. **Page speed or Core Web Vitals regression.**\n4. **Content removed or consolidated.**\n5. **Broken canonical tags** consolidating rankings onto the wrong URL.\n\n**External causes**\n\n- A search engine algorithm update. These are usually documented and dated; if the drop aligns with a known update and competitors moved too, that is the explanation.\n- A competitor improving.\n- Genuine seasonal decline in query volume — check whether *impressions* fell alongside clicks.\n- SERP feature changes taking clicks, such as an AI summary or a featured snippet answering the query directly.\n\n**The impressions-versus-clicks split**\n\nThis is the most useful single diagnostic:\n\n| Impressions | Clicks | Means |\n|---|---|---|\n| down | down | ranking or indexing loss, or lower query volume |\n| flat | down | still ranking, but the listing is less compelling, or a SERP feature is absorbing clicks |\n| down | flat | narrower reach but better targeting |\n\n**Segmentation**\n\nBy landing page, by query, by device, by country. Uniform means site-wide or algorithmic; concentrated means specific pages lost rankings.\n\n**The reflex to demonstrate**\n\nAsk what shipped in the window. SEO regressions ship with releases far more often than people expect, and they are silent — nothing breaks visibly, the traffic just stops.\n\n**A caution about attribution**\n\nOrganic traffic drops are frequently blamed on algorithm updates because that is the explanation requiring no internal accountability. Insist on ruling out the internal causes first; they are cheaper to check and more often responsible.",
    mistakes: [
      "Blaming an algorithm update before ruling out internal changes.",
      "Not checking impressions separately from clicks.",
      "Missing a robots.txt or noindex change shipped in a release.",
      "Not segmenting by landing page.",
    ],
    followUps: [
      "Impressions are flat but clicks fell. What does that mean?",
      "What is the first thing you would check?",
    ],
    tags: ["traffic", "SEO", "organic", "indexing", "algorithm update"],
    related: ["rca-c-segmentation", "rca-c-internal-external", "rca-c-validate"],
    sources: [common("A recurring published analytics interview scenario for acquisition-focused roles.")],
  }),
  q({
    id: "rca-q-uninstall-rate",
    category: "Churn",
    title: "App uninstall rate has risen",
    difficulty: "Medium",
    q: "Spotify's uninstall rates have risen. Why might this be happening?",
    hint: "Uninstalls are a lagging, coarse signal. Find out who is uninstalling and when in their lifecycle.",
    answer:
      "I would first establish when in the user lifecycle the uninstalls happen. Uninstalls within days of install point at an onboarding or expectation-mismatch problem, and often at acquisition quality — a campaign promising something the product does not deliver. Uninstalls from long-tenured users point at something that changed: a redesign, a price rise, ads increasing, a removed feature, or performance and storage complaints. I would segment by tenure, platform, app version, acquisition channel and country, and check what shipped, since a release that degraded performance or increased app size drives uninstalls quickly.",
    detail:
      "**Tenure is the key cut**\n\n| Uninstalls concentrated in | Points at |\n|---|---|\n| Days 0–7 | acquisition quality, onboarding, expectation mismatch |\n| Weeks 2–8 | failure to reach habit; value not established |\n| Long-tenured users | something changed — product, price, ads, performance |\n\nThese are three different problems and they are indistinguishable in an aggregate uninstall rate.\n\n**Early-life uninstalls**\n\nOften an acquisition problem rather than a product one. An ad campaign that oversells drives installs from people the product was never going to suit. Install volume rises, uninstall rate rises, and both are working as designed — the channel is simply unprofitable. Segmenting by channel exposes this immediately.\n\n**Late-life uninstalls**\n\nCheck what changed: a redesign, an ad-load increase, a paywall moved earlier, a removed feature, a price change, app size growth or battery drain. Device storage pressure is a real and under-considered cause — large apps get removed when a phone fills up, which correlates with device age and market.\n\n**Platform and version**\n\nA drop confined to one OS version or one app build is a technical regression. Crash rate and ANR data should be checked alongside, since crashes are one of the strongest predictors of uninstall.\n\n**The measurement caveats**\n\nUninstall tracking is imperfect and differs by platform — Android reports more directly than iOS, so cross-platform comparisons of the absolute rate are unreliable. Uninstalls also lag disengagement by weeks: people stop using an app long before they remove it, so the underlying decision happened earlier than the metric suggests.\n\n**Better leading indicators**\n\nSession frequency, days-since-last-open, notification opt-outs, and feature breadth all move before uninstalls. If the goal is to intervene rather than to explain, those are the metrics to monitor.\n\n**The reframe**\n\nAn uninstall is the *end* of a disengagement process, not the start. The useful question is usually not \"why did they uninstall\" but \"when did they stop being engaged, and what happened then\".",
    mistakes: [
      "Analysing uninstalls without segmenting by tenure.",
      "Treating early uninstalls as a product problem when they are an acquisition problem.",
      "Comparing absolute uninstall rates across iOS and Android.",
      "Ignoring crash rate and app size.",
    ],
    followUps: [
      "Uninstalls are concentrated in the first three days. Where do you look?",
      "What would you monitor to intervene before someone uninstalls?",
    ],
    tags: ["uninstall", "churn", "onboarding", "acquisition quality", "crashes"],
    related: ["rca-c-retention", "rca-q-retention-decline", "rca-c-segmentation"],
    sources: [
      casebook(CASEBOOK_IITK, 31, "Listed in section 3.1 as an example RCA interview question."),
      common("Also published across product interview preparation resources."),
    ],
  }),
  q({
    id: "rca-q-mrr-drop",
    category: "Monetization",
    title: "Monthly recurring revenue has dropped",
    difficulty: "Hard",
    q: "Swiggy's monthly recurring revenue has dropped. Evaluate the reasons.",
    hint: "MRR has a standard decomposition into five movements. Use it.",
    answer:
      "MRR decomposes into new MRR, expansion, contraction, churn and reactivation, and a net drop means one of those five moved. Establishing which one immediately determines the investigation: falling new MRR is an acquisition problem, rising contraction is a downgrade problem, rising churn is a retention problem. I would then segment by plan, cohort and tenure, and check whether a promotional cohort has reached the end of its discount, which produces a contraction or churn spike that is entirely predictable once you look at acquisition lagged by the promotion length.",
    detail:
      "**The standard decomposition**\n\n```\nNet MRR change = New + Expansion + Reactivation − Contraction − Churn\n```\n\nAsk which component moved before anything else. The five have almost nothing in common as investigations:\n\n| Component fell / rose | Investigate |\n|---|---|\n| New MRR down | acquisition, funnel, pricing, competition |\n| Expansion down | upsell motion, usage growth, packaging |\n| Contraction up | downgrades — price sensitivity, reduced usage, seat reductions |\n| Churn up | retention, involuntary payment failures |\n| Reactivation down | win-back campaigns stopped |\n\n**Contraction is the one people forget**\n\nRevenue can fall with no customer lost at all, if existing customers downgrade or reduce seats. That is invisible in a customer-count metric and shows only in MRR. It usually signals reduced perceived value or budget pressure and is an early warning of churn to come.\n\n**Promotional cohort maturity**\n\nIf a discounted cohort's promotional period ended this month, MRR falls mechanically — either through churn or through customers moving to a lower plan. Comparing the MRR movement against acquisition lagged by the promotion length reveals it in one chart.\n\n**Segment by plan and tenure**\n\nA drop concentrated in one plan points at that plan's pricing or packaging. Concentrated in one tenure band points at a lifecycle event.\n\n**Involuntary churn, again**\n\nFailed payments show up in MRR churn identically to deliberate cancellation. Splitting them is cheap and often reveals that a meaningful share is recoverable through better dunning rather than through product work.\n\n**Currency and mix**\n\nFor a business selling in several currencies, exchange-rate movement changes reported MRR with no customer behaviour change at all. Worth ruling out early if the business is multi-country.\n\n**The close**\n\nName which component drove it, its share of the total movement, whether it is recoverable, and what would prevent a recurrence — separating the mechanical causes such as promotion maturity from genuine deterioration.",
    mistakes: [
      "Treating MRR as one number instead of decomposing it.",
      "Overlooking contraction, which loses revenue without losing customers.",
      "Missing promotional cohort maturity.",
      "Not checking currency effects in a multi-country business.",
    ],
    followUps: [
      "Customer count is flat but MRR fell. What happened?",
      "How much of the churn is recoverable?",
    ],
    tags: ["MRR", "monetization", "contraction", "expansion", "subscription", "churn"],
    related: ["rca-c-decomposition", "rca-q-churn-spike", "rca-c-retention"],
    sources: [
      casebook(CASEBOOK_IITK, 31, "Listed in section 3.1 as an example RCA interview question."),
      common("MRR decomposition is standard across subscription-analytics interview material."),
    ],
  }),
  q({
    id: "rca-q-support-tickets",
    category: "Operations",
    title: "Support ticket volume has spiked",
    difficulty: "Medium",
    q: "Customer support ticket volume has doubled in a week. How do you find out why?",
    hint: "The tickets themselves contain the answer. Categorise before theorising.",
    answer:
      "The tickets are the data — I would categorise them by topic first, since a spike is usually concentrated in one or two categories that point straight at the cause. Then check the timing against releases, and segment by platform, app version, geography and customer tier. I would also verify the denominator: if user volume doubled too, tickets per user is flat and nothing is wrong. And I would check whether the support channel itself changed, since adding a chat widget or removing a help article increases contact rate without any underlying product problem.",
    detail:
      "**Categorise first**\n\nMost ticket spikes are concentrated: one topic accounts for the majority of the increase. Reading a sample of fifty tickets from the spike window is faster and more informative than any amount of upstream analysis, and it is what an experienced person actually does first.\n\n**Then check the denominator**\n\nTickets per active user, not raw ticket count. Doubling users doubles tickets with nothing wrong. This is the same mix-effect discipline as any rate metric.\n\n**Timing**\n\nAlign the spike with release timestamps. A spike starting hours after a deploy is close to conclusive, and support is often the fastest detector of a bad release — faster than monitoring, because users notice things dashboards do not measure.\n\n**Segment**\n\nPlatform, app version, geography, customer tier, tenure. A spike confined to one build is a regression; confined to new users is an onboarding problem; confined to one region may be a local outage or a payment provider issue.\n\n**The contact-rate causes people miss**\n\nTickets can rise with no product change at all:\n\n- A help article was removed or a documentation site broke, so people who would have self-served now contact support.\n- A chat widget was made more prominent, lowering the effort to contact.\n- An email notification went out with a confusing message.\n- A status page failed to update during an incident, so everyone contacted support instead.\n\nThat last one is worth naming — during an outage, ticket volume measures communication failure as much as the outage itself.\n\n**Ticket volume as a leading indicator**\n\nSupport is often the earliest signal of a problem that will later show in conversion or retention metrics, because it captures friction that no dashboard instruments. Framing support data as an early-warning system rather than a cost centre is a good note to close on.\n\n**The recommendation shape**\n\nImmediate: fix the top category driving the spike. Structural: deflect it — better error messaging, a help article, or removing the friction entirely so the ticket is never created.",
    mistakes: [
      "Theorising before reading the tickets.",
      "Using raw volume instead of tickets per user.",
      "Not checking whether the support channel itself changed.",
      "Treating support data as noise rather than as an early signal.",
    ],
    followUps: [
      "Ticket volume doubled but so did signups. Is anything wrong?",
      "How would you reduce this category of ticket permanently?",
    ],
    tags: ["support", "operations", "tickets", "contact rate", "deflection"],
    related: ["rca-c-segmentation", "rca-c-validate", "rca-c-recommendation"],
    sources: [common("Operational-metric RCA scenarios appear across analytics interview preparation material.")],
  }),
  q({
    id: "rca-q-delivery-times",
    category: "Operations",
    title: "Delivery times have increased",
    difficulty: "Medium",
    q: "Average delivery time has increased by 20%. How would you investigate?",
    hint: "An average hides the distribution. And the operation has distinct stages, each of which can fail.",
    answer:
      "First look at the distribution rather than the average, because a 20% rise in the mean can come from a small number of very late deliveries rather than everything slowing. Then decompose the delivery into its stages — order acceptance, preparation, pickup wait, transit, drop-off — since each has different causes. Then segment by city, time of day, order type and courier cohort. The most common causes are a supply shortfall relative to demand at peak times, a change in the mix of orders or distances, and a routing or assignment change.",
    detail:
      "**Distribution before average**\n\nCheck the median and the p90 alongside the mean. \n\n| Pattern | Means |\n|---|---|\n| Mean up, median flat | a tail of very late deliveries — investigate the outliers |\n| Both up | a systemic slowdown |\n| p90 up sharply | capacity failing at peak rather than generally |\n\nThe first case is common and the fix is completely different from a systemic slowdown.\n\n**Decompose the delivery**\n\n```\nTotal = Accept → Prepare → Courier wait → Transit → Drop-off\n```\n\nEach stage has its own owner and its own causes: preparation is the merchant, courier wait is supply, transit is routing and traffic. Knowing which stage grew tells you whose problem it is.\n\n**Segment**\n\n- **City and zone** — often highly concentrated.\n- **Time of day** — a peak-only problem is a capacity problem, not a process problem.\n- **Order or merchant type** — some merchants are simply slower, so a mix shift toward them raises the average with nothing degrading.\n- **Courier tenure** — new couriers are slower; rapid courier growth raises average times exactly as new-user mix lowers engagement.\n\n**The mix explanations**\n\nTwo ways this rises with nothing broken:\n\n1. **Distance mix** — expanding the delivery radius adds longer trips. Average time rises, and the business decision was deliberate.\n2. **Merchant mix** — growth in a slower category.\n\nChecking whether average distance changed is a quick and high-yield test.\n\n**Supply-demand balance**\n\nCourier availability relative to order volume by zone and hour. Under-supply produces courier wait time, which is usually the largest single component when the operation is stressed. This connects directly to the marketplace matching problem.\n\n**The trade-off to name**\n\nDelivery time trades against cost. Faster requires more couriers idle. The right target is not the minimum time but the point where the marginal customer value equals the marginal cost — and a 20% rise may be an acceptable consequence of a deliberate cost decision. Asking whether anything changed on the cost side is a good question.",
    mistakes: [
      "Reading only the average.",
      "Not decomposing into stages.",
      "Missing a distance or merchant mix change.",
      "Treating it as a pure operations failure without asking whether a cost decision drove it.",
    ],
    followUps: [
      "The median is unchanged but the mean rose. What does that tell you?",
      "Average distance rose 15%. Does that explain it?",
    ],
    tags: ["delivery", "operations", "distribution", "supply", "mix effect", "logistics"],
    related: ["rca-q-marketplace-imbalance", "rca-c-decomposition", "rca-c-segmentation"],
    sources: [common("Operational RCA scenarios of this form recur across analytics and product interview resources.")],
  }),
  q({
    id: "rca-q-adoption-low",
    category: "Growth",
    title: "A new feature has low adoption",
    difficulty: "Medium",
    q: "You launched a new feature a month ago and adoption is far below target. What would you investigate?",
    hint: "Adoption is a funnel too. Awareness, trial and repeat are three different failures.",
    answer:
      "Adoption has three distinct stages and they fail for different reasons: do users know the feature exists, do they try it, and do they come back to it. I would measure each — discovery rate, first-use rate among those who discovered it, and repeat-use rate among those who tried. A low discovery rate is a placement and communication problem. High trial but no repeat means the feature does not deliver, which is the most serious outcome. Low trial despite good discovery means the value proposition is unclear or the effort is too high. I would also check whether the target was ever realistic.",
    detail:
      "**The adoption funnel**\n\n```\nEligible users → Aware → Tried once → Used again → Habitual\n```\n\nMeasure the rate at each step. One will be far below expectation and that localises the problem entirely.\n\n| Failing step | Means | Fix |\n|---|---|---|\n| Awareness | discoverability | placement, announcement, in-product prompts |\n| Trial | unclear value or too much effort | messaging, reduce steps |\n| Repeat | **it does not deliver** | reconsider the feature |\n| Habit | not solving a recurring need | reconsider the premise |\n\n**Repeat use is the honest signal**\n\nHigh trial with no repeat is the outcome worth being blunt about. It means people were interested enough to try and unconvinced enough not to return — which is information about the feature, not about the marketing. Interviewers value a candidate willing to conclude that a feature should be reconsidered rather than promoted harder.\n\n**Question the target**\n\nWas the target derived from anything, or asserted? Adoption targets are frequently set with no baseline. Comparing against adoption curves of previous features at the same age is a far more useful benchmark than an arbitrary number, and pointing that out is legitimate.\n\n**Segment**\n\nBy user type, tenure, plan and platform. A feature aimed at power users will show low adoption overall while performing well in its intended segment — which is success, measured wrongly. Check adoption *among the intended audience* rather than across everyone.\n\n**Check the mechanics**\n\n- Is it actually available to everyone, or gated by a rollout flag still at 10%?\n- Does it work? Errors in the feature's flow suppress adoption in a way no amount of promotion fixes.\n- Is it discoverable on mobile as well as desktop?\n\nThe rollout-flag case is embarrassing and genuinely common — worth checking before any analysis.\n\n**The close**\n\nSay which step failed, what that implies, and be explicit about whether the recommendation is to promote, to fix, or to reconsider. Not every feature deserves a growth push.",
    mistakes: [
      "Treating adoption as one number rather than a funnel.",
      "Recommending more promotion when repeat use is the failing step.",
      "Measuring adoption across all users when the feature targets a segment.",
      "Not checking whether the rollout is actually complete.",
    ],
    followUps: [
      "Trial is high and repeat is near zero. What do you recommend?",
      "Where did the adoption target come from?",
    ],
    tags: ["adoption", "feature launch", "funnel", "discovery", "repeat use"],
    related: ["rca-c-funnel", "rca-c-hypotheses", "rca-c-recommendation"],
    sources: [common("Feature-adoption diagnosis is a standard published product interview scenario.")],
  }),
];
