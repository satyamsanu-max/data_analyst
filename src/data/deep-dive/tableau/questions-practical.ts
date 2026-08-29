import { common, gfg, questionsFor, URLS } from "../helpers";
import type { DeepDiveItem } from "../types";

const q = questionsFor("DATA", "tableau");

const GFG_TB = gfg(
  "50+ Tableau Interview Questions and Answers",
  URLS.gfgTableau,
  "Question published in the GeeksforGeeks Tableau interview question list.",
);

/** Practical calculations, visualisation, dashboards, server and performance. */
export const TABLEAU_QUESTIONS_PRACTICAL: DeepDiveItem[] = [
  // =========================================================== PRACTICAL CALCULATIONS
  q({
    id: "tb-q-profit-margin",
    category: "Calculations",
    title: "Calculate profit margin",
    difficulty: "Easy",
    q: "How do you calculate Profit Margin in Tableau?",
    hint: "Aggregate both terms. The wrong version is the one that looks most natural.",
    answer:
      "SUM([Profit]) / SUM([Sales]), formatted as a percentage. Both terms must be aggregated — writing [Profit]/[Sales] computes the ratio on each underlying row and then aggregates those ratios, which gives the average of ratios rather than the ratio of totals. On any dataset with varying order sizes those two numbers differ, sometimes dramatically.",
    detail:
      "**Why the row-level version is wrong**\n\nTwo orders: one with £1,000 sales and £100 profit (10%), one with £10 sales and £5 profit (50%). The true margin is 105/1010 ≈ 10.4%. Averaging the row ratios gives 30%. The small order is weighted equally with the large one, which is exactly the mistake.\n\nThis is the same principle as never averaging a percentage in Excel: recompute from the totals.\n\n**Formatting**\n\nRight-click the field → Default Properties → Number Format → Percentage. Doing it on the field rather than in each view means every use is formatted consistently.\n\n**Guarding zero sales**\n\n```\nIF SUM([Sales]) = 0 THEN NULL ELSE SUM([Profit]) / SUM([Sales]) END\n```\n\nTableau returns null rather than erroring on divide-by-zero, but being explicit documents the intent and avoids a misleading zero.\n\n**The likely follow-up**\n\n\"Now show margin by customer regardless of what is in the view\" — that needs an LOD:\n\n```\n{ FIXED [Customer ID] : SUM([Profit]) } / { FIXED [Customer ID] : SUM([Sales]) }\n```\n\n**A related trap**\n\nDo not set the field's default aggregation to SUM. A margin is already a ratio; summing margins across rows is meaningless. Leave it as a calculated aggregate.",
    code: [
      { lang: "Tableau", label: "Profit margin", code: "SUM([Profit]) / SUM([Sales])" },
      { lang: "Tableau", label: "Guarded", code: "IF SUM([Sales]) = 0 THEN NULL ELSE SUM([Profit]) / SUM([Sales]) END" },
    ],
    mistakes: [
      "Writing [Profit]/[Sales] at row level.",
      "Setting the resulting field's default aggregation to SUM.",
    ],
    followUps: ["Now compute it per customer regardless of the view."],
    tags: ["profit margin", "aggregate", "ratio", "calculated field"],
    related: ["tb-c-calculations", "tb-q-calculated-field", "xl-q-weighted-average"],
    sources: [GFG_TB],
  }),
  q({
    id: "tb-q-top-5-products",
    category: "Calculations",
    title: "Find the top 5 products by sales",
    difficulty: "Medium",
    q: "How can you find the Top 5 products by Sales in Tableau, and how would you show the top 10 customers by profit within each region?",
    hint: "Several routes. And watch how the Top N interacts with other filters.",
    answer:
      "Simplest is a filter on Product with the Top tab set to Top 5 by SUM([Sales]). You can also use a computed set with a Top N rule, which is reusable, or a table calculation such as INDEX() <= 5 or RANK. The important part is the interaction: a Top N filter is computed before other dimension filters, so combining it with a Region filter gives the global top 5 filtered to that region rather than the region's top 5. Promoting Region to a context filter fixes it.",
    detail:
      "**The three routes**\n\n| Method | Reusable | Responds to other filters |\n|---|---|---|\n| Filter → Top tab | no | only if they are context filters |\n| Computed set with Top N | yes | same caveat |\n| Table calc `INDEX() <= 5` | no | yes — runs after filters |\n\n**The Top N + Region trap**\n\nTop N is a dimension filter, computed at the same stage as other dimension filters, and Tableau computes it against the data surviving *earlier* stages. So a global Top 5 gets applied and only then is Region applied to what remains. Right-click Region → Add to Context, and Region now runs at the context stage, before Top N, giving the top 5 within the region.\n\n**Top 10 per region — a different question**\n\n\"Top 10 customers by profit *in each region*\" needs the ranking to restart per region, which is a table calculation partitioned by Region:\n\n```\nRANK( SUM([Profit]) ) <= 10\n```\n\nwith Compute Using set to Customer, partitioned by Region. Then put that boolean on the Filters shelf. A Top N filter cannot do per-partition ranking; this is the case where the table calculation is genuinely necessary.\n\n**Making N adjustable**\n\nBind the Top N filter's value to an integer parameter so the reader can change it. That is the standard combination of a parameter with a set and is a common practical task.\n\n**Ties**\n\nRANK skips after ties (1, 2, 2, 4); RANK_DENSE does not (1, 2, 2, 3). With ties at the boundary a \"top 5\" can return six rows, which is worth mentioning as a thing to check rather than assume.",
    code: [
      { lang: "Tableau", label: "Top 10 per region, as a table calc filter", code: "RANK( SUM([Profit]) ) <= 10\n// Compute Using: Customer, partitioned by Region" },
      { lang: "Tableau", label: "Parameter-driven Top N", code: "INDEX() <= [Top N Parameter]" },
    ],
    mistakes: [
      "Combining Top N with a dimension filter and not using context.",
      "Trying to use a Top N filter for per-region ranking.",
      "Ignoring tie behaviour at the cutoff.",
    ],
    followUps: [
      "Why does adding a region filter break your Top 5?",
      "How would you rank within each region?",
    ],
    tags: ["Top N", "RANK", "INDEX", "context filter", "parameter"],
    related: ["tb-q-context-filter", "tb-c-params-sets", "tb-q-table-calculation"],
    sources: [GFG_TB],
  }),
  q({
    id: "tb-q-running-total",
    category: "Calculations",
    title: "Calculate a running total",
    difficulty: "Medium",
    q: "How do you calculate a Running Total of Sales in Tableau?",
    hint: "A table calculation — and the setting that matters is not the function.",
    answer:
      "Right-click the measure pill and choose Quick Table Calculation → Running Total, or write RUNNING_SUM(SUM([Sales])) as a calculated field. The function is the easy part; what determines whether the answer is right is Compute Using — the direction it accumulates along and the partitions it restarts within. Leaving it at the default is where running totals silently go wrong.",
    detail:
      "**Setting the direction**\n\nRight-click the pill → Compute Using. Table (down) accumulates down the whole table; Pane (down) restarts at each pane boundary. For anything with two dimensions on the shelves, set **Specific Dimensions** explicitly:\n\n- Ticked fields = **addressing**, the direction it moves along.\n- Unticked fields = **partitioning**, the groups it restarts within.\n\nA cumulative sales chart by month within year: tick Month (addressing), leave Year unticked (partitioning). It then accumulates through each year and resets in January.\n\n**Restart at level**\n\nUnder Specific Dimensions there is a *Restart every* option, which is a more explicit way to express the same reset.\n\n**The constraint to state**\n\nA running total is a table calculation, so it only sees what is in the view. Filter out January and the running total starts at February — it does not carry the missing month forward. If you need the accumulation to include data that is filtered out of the display, you need an LOD or a table-calculation filter that hides rather than excludes.\n\nThat last option is the neat trick: filtering with a table calculation hides marks after the running total has been computed, so you can show only the last three months of a total that accumulated over years.\n\n**Percent running total**\n\nQuick Table Calculation → Running Total, then Edit Table Calculation → Percent of Total, gives a cumulative percentage — the basis of a Pareto chart.",
    code: [
      { lang: "Tableau", label: "Running total", code: "RUNNING_SUM( SUM([Sales]) )" },
      { lang: "Tableau", label: "Cumulative share, for a Pareto", code: "RUNNING_SUM( SUM([Sales]) ) / TOTAL( SUM([Sales]) )" },
    ],
    mistakes: [
      "Leaving Compute Using at the default with two dimensions in the view.",
      "Expecting it to include rows filtered out of the view.",
      "Confusing addressing with partitioning.",
    ],
    followUps: [
      "How do you make it reset each year?",
      "How would you show only the last three months without restarting the accumulation?",
    ],
    tags: ["running total", "RUNNING_SUM", "table calculation", "compute using", "Pareto"],
    related: ["tb-q-table-calculation", "tb-c-calculations", "tb-q-window-avg"],
    sources: [GFG_TB],
  }),
  q({
    id: "tb-q-yoy-growth-tableau",
    category: "Calculations",
    title: "Year-over-year growth in Tableau",
    difficulty: "Medium",
    q: "How do you calculate Year-over-Year (YoY) Growth in Tableau?",
    hint: "LOOKUP to reach the previous period, then the standard growth formula.",
    answer:
      "Use LOOKUP to fetch the prior period's value and compute the change: (SUM([Sales]) - LOOKUP(SUM([Sales]), -1)) / ABS(LOOKUP(SUM([Sales]), -1)). Or use the Quick Table Calculation → Year over Year Growth, which generates the same thing. ABS on the denominator matters when values can be negative — without it, growth from a loss to a smaller loss shows the wrong sign.",
    detail:
      "**The formula**\n\n```\n(SUM([Sales]) - LOOKUP(SUM([Sales]), -1)) / ABS(LOOKUP(SUM([Sales]), -1))\n```\n\n`LOOKUP(expr, -1)` returns the value from one row back in the table calculation's addressing direction. So the direction must be along the year axis, which again means checking Compute Using.\n\n**Why ABS**\n\nWith profit rather than sales, a move from −100 to −50 is an improvement. Without ABS the denominator is negative and the growth comes out as −50%, implying deterioration. With ABS it is +50%. This is a real reporting bug and worth volunteering.\n\n**The first period**\n\nThere is no prior row, so LOOKUP returns null and the growth is null — which renders as an empty cell. That is correct behaviour, but if the chart looks broken to stakeholders you can hide the first period or handle it explicitly.\n\n**Comparing the same period across years**\n\nWith both Year and Month in the view, `LOOKUP(..., -1)` moves one *row* back, which may be the previous month rather than the same month last year. Partition by Month and address by Year and it compares like with like. Getting that partitioning right is the substance of the question.\n\n**The alternative: an LOD or a date calculation**\n\nA table calculation only sees the view. If you need prior-year values for periods not displayed, a self-join on a date offset, or a calculation using DATEADD in the data source, is more robust. Naming that limitation shows you know when the easy answer stops working.\n\n**Versus Power BI**\n\nWorth a sentence if comparing: Power BI has dedicated time-intelligence functions (`SAMEPERIODLASTYEAR`) that operate on the date table rather than on the view, so they work regardless of what is displayed. Tableau's table-calculation approach is view-dependent. That is a genuine architectural difference between the tools.",
    code: [
      { lang: "Tableau", label: "YoY growth", code: "(SUM([Sales]) - LOOKUP(SUM([Sales]), -1)) / ABS(LOOKUP(SUM([Sales]), -1))" },
      { lang: "Tableau", label: "Prior year value on its own", code: "LOOKUP( SUM([Sales]), -1 )" },
    ],
    mistakes: [
      "Omitting ABS, so improvements from a negative base show as declines.",
      "Wrong addressing, so it compares consecutive months rather than the same month last year.",
      "Expecting it to work for periods not in the view.",
    ],
    followUps: [
      "Why ABS in the denominator?",
      "How does this differ from Power BI's SAMEPERIODLASTYEAR?",
    ],
    tags: ["YoY", "LOOKUP", "table calculation", "growth", "ABS"],
    related: ["tb-q-table-calculation", "tb-c-dates", "pbi-q-yoy-growth"],
    sources: [GFG_TB],
  }),
  q({
    id: "tb-q-latest-month",
    category: "Dates",
    title: "Show only the latest month dynamically",
    difficulty: "Hard",
    q: "How can you show only the latest month's data dynamically in Tableau?",
    hint: "Derive the latest date from the data rather than hardcoding it. A table-scoped LOD does this.",
    answer:
      "Use a table-scoped LOD to find the maximum date in the data, then compare each row's month against it: DATETRUNC('month', [Order Date]) = { : DATETRUNC('month', MAX([Order Date])) }. Put that boolean on the Filters shelf set to True. Because the LOD reads the data rather than a hardcoded value, the view moves forward automatically as new data arrives.",
    detail:
      "**The calculation**\n\n```\nDATETRUNC('month', [Order Date])\n  = { : DATETRUNC('month', MAX([Order Date])) }\n```\n\nThe `{ : ... }` form with no dimensions is a **table-scoped LOD** — it computes across the entire table, ignoring the view. That is what makes it a single fixed value to compare against.\n\n**Why not use TODAY()**\n\n`DATETRUNC('month', TODAY())` looks equivalent and is a common answer, but it is wrong whenever the data lags. If the warehouse loads through yesterday and it is the 1st of the month, filtering to \"this calendar month\" returns an empty view. Deriving the latest month from `MAX([Order Date])` means the dashboard always shows the most recent month that actually has data. Making that distinction is the strongest part of the answer.\n\n**Relative date filters**\n\nTableau's built-in relative date filter (Filter → Relative dates → Months → This month) is simpler but has the same TODAY-based problem. It is fine when the data is genuinely current.\n\n**Last N months**\n\nThe same idea generalises:\n\n```\nDATEDIFF('month', [Order Date], { : MAX([Order Date]) }) < 3\n```\n\n**Filter placement**\n\nThe LOD is computed before dimension filters, so if other filters should affect what counts as \"latest\", promote them to context filters.\n\n**The dashboard-design point**\n\nA view showing only the latest month should say which month it is, ideally in a dynamic title. A tile reading \"Sales: £4.2m\" with no period stated is the sort of thing that ends up in a deck and gets misread.",
    code: [
      { lang: "Tableau", label: "Latest month in the data", code: "DATETRUNC('month', [Order Date])\n  = { : DATETRUNC('month', MAX([Order Date])) }" },
      { lang: "Tableau", label: "Last three months of data", code: "DATEDIFF('month', [Order Date], { : MAX([Order Date]) }) < 3" },
    ],
    mistakes: [
      "Using TODAY(), which breaks whenever the data lags.",
      "Hardcoding the month and having to edit it monthly.",
      "Not stating the period in the view's title.",
    ],
    followUps: [
      "Why not use TODAY()?",
      "How would you extend this to the last three months?",
    ],
    tags: ["latest month", "LOD", "DATETRUNC", "dynamic filter", "dates"],
    related: ["tb-c-dates", "tb-q-lod-types", "tb-c-lod"],
    sources: [GFG_TB],
  }),
  q({
    id: "tb-q-one-time-customers",
    category: "LOD",
    title: "Identify one-time customers",
    difficulty: "Hard",
    q: "How do you identify one-time (single-purchase) customers using an LOD expression?",
    hint: "Count each customer's distinct orders at customer grain, regardless of the view.",
    answer:
      "Compute each customer's distinct order count with a FIXED LOD and test for one: { FIXED [Customer ID] : COUNTD([Order ID]) } = 1. Because it is FIXED at customer level, the result is the same however the view is broken down — put Region on the shelves and the flag still reflects the customer's total order count, not their orders within that region.",
    detail:
      "**The calculation**\n\n```\n{ FIXED [Customer ID] : COUNTD([Order ID]) } = 1\n```\n\nA boolean per row, which you can put on Colour to split one-time from repeat customers, or on Filters to isolate them.\n\n**Why FIXED specifically**\n\nWith `COUNTD([Order ID])` alone, adding Region to the view would count orders per customer *per region*, so a customer who ordered once in each of two regions would look like two one-time customers. FIXED at customer grain ignores the view and gives the true count. That contrast is the point of the question.\n\n**Counting them**\n\nTo count one-time customers rather than flag rows:\n\n```\nCOUNTD( IF { FIXED [Customer ID] : COUNTD([Order ID]) } = 1 THEN [Customer ID] END )\n```\n\nThe IF returns the customer ID only for one-timers and null otherwise, and COUNTD ignores nulls.\n\n**The filter interaction to flag**\n\nFIXED is computed before dimension filters. So filtering the view to 2025 does **not** make this \"customers whose only order was in 2025\" — it still counts their orders across all time. If the period should matter, promote the date filter to a context filter. Raising this unprompted is what makes the answer strong, because it is exactly the bug this pattern produces in practice.\n\n**The related patterns**\n\nThe same shape solves a family of questions:\n\n| Question | Expression |\n|---|---|\n| Customer lifetime value | `{ FIXED [Customer] : SUM([Sales]) }` |\n| Acquisition cohort | `{ FIXED [Customer] : MIN([Order Date]) }` |\n| Repeat customers | `{ FIXED [Customer] : COUNTD([Order ID]) } > 1` |\n| Days since last order | `DATEDIFF('day', { FIXED [Customer] : MAX([Order Date]) }, TODAY())` |\n\nKnowing the family rather than the single formula is what generalises.",
    code: [
      { lang: "Tableau", label: "One-time customer flag", code: "{ FIXED [Customer ID] : COUNTD([Order ID]) } = 1" },
      { lang: "Tableau", label: "Count of one-time customers", code: "COUNTD( IF { FIXED [Customer ID] : COUNTD([Order ID]) } = 1 THEN [Customer ID] END )" },
      { lang: "Tableau", label: "Acquisition cohort month", code: "{ FIXED [Customer ID] : MIN([Order Date]) }" },
    ],
    mistakes: [
      "Using COUNTD without FIXED, so the count changes with the view.",
      "Assuming a date filter narrows the FIXED calculation.",
      "Counting rows rather than distinct customers.",
    ],
    followUps: [
      "Does filtering to 2025 change what this returns?",
      "How would you find each customer's acquisition month?",
    ],
    tags: ["LOD", "FIXED", "COUNTD", "cohort", "customer analysis"],
    related: ["tb-c-lod", "tb-q-lod", "tb-q-retention", "tb-q-context-filter"],
    sources: [GFG_TB],
  }),
  q({
    id: "tb-q-second-highest",
    category: "Calculations",
    title: "Find the second-highest sales value",
    difficulty: "Hard",
    q: "How do you find the Second Highest Sales value in Tableau?",
    hint: "Rank and take rank 2 — or use a window function. Both work; say which you would pick.",
    answer:
      "Rank the values and filter to rank 2: a table calculation RANK(SUM([Sales])) = 2, with Compute Using set to the dimension being ranked. The alternative is a window function, WINDOW_MAX of the values excluding the maximum, but the rank approach is clearer and generalises to nth-highest by parameterising the number. The thing to clarify first is ties — if two products share the top value, whether rank 2 means the runner-up product or the second distinct value.",
    detail:
      "**The rank approach**\n\n```\nRANK( SUM([Sales]) ) = 2\n```\n\nOn the Filters shelf, with Compute Using set to Product. Parameterise the 2 and it becomes nth-highest for free.\n\n**Tie behaviour**\n\n| Function | On 100, 100, 90 |\n|---|---|\n| `RANK` | 1, 1, 3 — no rank 2 exists |\n| `RANK_DENSE` | 1, 1, 2 |\n| `RANK_UNIQUE` | 1, 2, 3 — arbitrary tiebreak |\n| `RANK_MODIFIED` | 2, 2, 3 |\n\nWith plain `RANK` and a tie at the top, filtering to rank 2 returns **nothing**. That is the trap. `RANK_DENSE` gives the second distinct value; `RANK_UNIQUE` gives a runner-up but picks arbitrarily between tied rows.\n\nSo the honest answer starts by asking what should happen on a tie, then picks the function. Interviewers asking this are usually watching for exactly that.\n\n**Second highest across the whole table**\n\nIf you need a single scalar rather than a filtered row — say for a KPI tile — an LOD plus a window function is cleaner, or a nested calculation excluding the maximum:\n\n```\nWINDOW_MAX( IF SUM([Sales]) < WINDOW_MAX(SUM([Sales])) THEN SUM([Sales]) END )\n```\n\n**Cross-tool parallel**\n\nExcel does this with `LARGE(range, 2)`, SQL with `DENSE_RANK() = 2`, and Power BI with `MINX(TOPN(2, ...))`. Being able to move between them shows you understand the problem rather than one tool's syntax.",
    code: [
      { lang: "Tableau", label: "Second highest, ties give a second distinct value", code: "RANK_DENSE( SUM([Sales]) ) = 2" },
      { lang: "Tableau", label: "Nth highest, parameterised", code: "RANK_DENSE( SUM([Sales]) ) = [N]" },
    ],
    mistakes: [
      "Using plain RANK and returning nothing when the top value is tied.",
      "Not asking what a tie should mean.",
      "Forgetting to set Compute Using.",
    ],
    followUps: [
      "Two products tie for first. What does your formula return?",
      "How would you do this in SQL?",
    ],
    tags: ["RANK", "RANK_DENSE", "second highest", "ties", "table calculation"],
    related: ["tb-q-table-calculation", "tb-q-top-5-products", "pbi-q-second-highest"],
    sources: [GFG_TB],
  }),
  q({
    id: "tb-q-retention",
    category: "Calculations",
    title: "Find customers who purchased in consecutive years",
    difficulty: "Hard",
    q: "How do you find retention — customers who purchased in consecutive years?",
    hint: "Two sets, or an LOD comparing each customer's purchase years. Set logic is the neat answer.",
    answer:
      "The cleanest route is combined sets: create a set of customers who purchased in 2024 and another for 2025, then create a combined set using the intersection — customers in both. Tableau's Create Combined Set dialog does this directly. The LOD alternative flags customers whose distinct purchase years include both, which generalises better when the years should be dynamic.",
    detail:
      "**The set approach**\n\n1. Create a set on Customer with a condition: `SUM(IF YEAR([Order Date]) = 2024 THEN [Sales] END) > 0`.\n2. Create the same for 2025.\n3. Select both sets in the data pane → Create Combined Set → **Shared members in both sets**.\n\nThat combined set is your retained cohort, and it can go on Colour, on Filters, or into a calculation. Combined sets are underused and naming them here lands well.\n\n**The LOD approach**\n\n```\n{ FIXED [Customer ID] : SUM( IF YEAR([Order Date]) = 2024 THEN 1 ELSE 0 END ) } > 0\nAND\n{ FIXED [Customer ID] : SUM( IF YEAR([Order Date]) = 2025 THEN 1 ELSE 0 END ) } > 0\n```\n\nMore verbose, but it works inside other calculations and the years can be parameterised.\n\n**Generalising to any consecutive pair**\n\nHardcoding two years does not scale. A more general form compares each customer's set of purchase years against the next:\n\n```\n{ FIXED [Customer ID], YEAR([Order Date]) : MIN(1) }\n```\n\nas a building block, or — more practically — do the cohort calculation upstream in SQL or Tableau Prep, where window functions make it natural. Saying \"for real retention analysis I would compute the cohort in the data layer\" is a mature answer rather than a dodge.\n\n**Defining retention properly**\n\nWorth clarifying before writing anything: retention of *what*? Customers active in year N who are also active in N+1, as a share of those active in N. The denominator matters and is where retention numbers most often get misreported. Asking that question is a better first move than immediately writing a formula.\n\n**Cohort analysis**\n\nThe natural extension: `{ FIXED [Customer ID] : MIN([Order Date]) }` gives the acquisition cohort, and plotting activity by cohort and by months-since-acquisition produces the standard retention triangle.",
    code: [
      { lang: "Tableau", label: "Purchased in a given year", code: "SUM( IF YEAR([Order Date]) = 2024 THEN [Sales] END ) > 0" },
      { lang: "Tableau", label: "Acquisition cohort", code: "{ FIXED [Customer ID] : MIN([Order Date]) }" },
      { lang: "Tableau", label: "Months since acquisition", code: "DATEDIFF('month', { FIXED [Customer ID] : MIN([Order Date]) }, [Order Date])" },
    ],
    mistakes: [
      "Not clarifying the denominator before computing a retention rate.",
      "Hardcoding two specific years with no path to generalising.",
      "Counting rows rather than distinct customers.",
    ],
    followUps: [
      "What is the denominator in your retention rate?",
      "How would you build a cohort retention triangle?",
    ],
    tags: ["retention", "combined set", "cohort", "LOD", "customer analysis"],
    related: ["tb-q-sets-bins-groups", "tb-q-one-time-customers", "tb-c-lod"],
    sources: [GFG_TB],
  }),
  q({
    id: "tb-q-window-avg",
    category: "Calculations",
    title: "Moving averages with WINDOW functions",
    difficulty: "Medium",
    q: "How can you use WINDOW_AVG to calculate a moving average, and what does WINDOW_SUM do?",
    hint: "The two offset arguments define the window relative to the current row.",
    answer:
      "WINDOW_AVG(SUM([Sales]), -2, 0) averages the current row and the two before it — a three-period moving average. The two numbers are offsets relative to the current row, so -2 to 0 is a trailing window and -1 to 1 is centred. WINDOW_SUM works identically but totals rather than averages; with no offsets it sums the entire partition, which is how you get a denominator for percent-of-total.",
    detail:
      "**The offsets**\n\n```\nWINDOW_AVG(SUM([Sales]), -2, 0)   -- current + 2 previous: trailing 3\nWINDOW_AVG(SUM([Sales]), -1, 1)   -- centred 3-period\nWINDOW_AVG(SUM([Sales]))          -- the whole partition\nWINDOW_SUM(SUM([Sales]))          -- partition total, useful as a denominator\n```\n\nOmitting the offsets means the entire partition, which is a useful default to remember.\n\n**Compute Using still governs everything**\n\nThese are table calculations, so the window moves along the addressing direction and restarts at partition boundaries. A moving average with the wrong addressing averages across the wrong axis and produces a smooth, plausible, wrong line — the most dangerous kind of error.\n\n**Edge behaviour**\n\nAt the start of a partition there are not enough prior rows, so the window is truncated. A three-period trailing average shows the first row as itself and the second as the average of two. That is usually acceptable; if not, hide the incomplete periods explicitly rather than letting them mislead.\n\n**The WINDOW family**\n\n`WINDOW_SUM`, `WINDOW_AVG`, `WINDOW_MIN`, `WINDOW_MAX`, `WINDOW_MEDIAN`, `WINDOW_STDEV`, `WINDOW_COUNT`, `WINDOW_CORR`. All take the same offset arguments.\n\n**Versus RUNNING_SUM**\n\n`RUNNING_SUM` accumulates from the start of the partition to the current row — an expanding window. `WINDOW_SUM` with offsets is a fixed-width sliding window. Both are table calculations; the difference is whether the window grows or slides.\n\n**Why moving averages at all**\n\nWorth a sentence: they smooth noise to reveal trend, at the cost of lag and of hiding genuine spikes. A seven-day moving average on daily data removes day-of-week seasonality, which is usually the actual reason for using one.",
    code: [
      { lang: "Tableau", label: "Trailing 3-period moving average", code: "WINDOW_AVG( SUM([Sales]), -2, 0 )" },
      { lang: "Tableau", label: "Percent of partition total", code: "SUM([Sales]) / WINDOW_SUM( SUM([Sales]) )" },
    ],
    mistakes: [
      "Wrong Compute Using, giving a smooth but meaningless line.",
      "Not handling the truncated window at the start of a partition.",
      "Confusing a sliding window with a running total.",
    ],
    followUps: [
      "How is this different from RUNNING_SUM?",
      "Why would you use a seven-day moving average on daily data?",
    ],
    tags: ["WINDOW_AVG", "WINDOW_SUM", "moving average", "table calculation"],
    related: ["tb-q-table-calculation", "tb-q-running-total", "tb-c-calculations"],
    sources: [GFG_TB],
  }),
  q({
    id: "tb-q-pivot-data",
    category: "Data",
    title: "Pivot data from wide to long",
    difficulty: "Medium",
    q: "How do you pivot data from wide format to long (tall) format in Tableau?",
    hint: "Select the columns in the data source pane. Then say why the wide shape was a problem.",
    answer:
      "In the data source pane, select the columns to reshape, right-click and choose Pivot. Tableau replaces them with two columns — Pivot Field Names and Pivot Field Values — giving one row per original column per record. This matters because wide data with twelve month columns cannot be plotted as a trend or filtered by month; long data can. Tableau Prep and Custom SQL are the alternatives when the pivot is more complex.",
    detail:
      "**Why the wide shape breaks things**\n\nA table with Jan, Feb, ... Dec as separate columns has no month *field*. You cannot put month on an axis, cannot filter by it, and adding a thirteenth month means editing every view. Long format gives you a Month dimension and a Value measure, which is what every visualisation actually wants.\n\nThis is the same principle as unpivoting in Power Query, and it is arguably the single most valuable data-shaping operation there is.\n\n**Before and after**\n\n```\nProduct | Jan | Feb | Mar        Product | Month | Sales\nA       | 100 | 120 | 130   →    A       | Jan   | 100\n                                A       | Feb   | 120\n                                A       | Mar   | 130\n```\n\n**Limitations of the built-in pivot**\n\n- It works on relational sources and extracts, but not on all connection types.\n- It cannot pivot on a wildcard — you select specific columns, so a new month column next year has to be added manually.\n- Custom SQL blocks it.\n\nThat second limitation is the practical one, and it is why Tableau Prep or a database view is the better answer for a file whose columns grow over time.\n\n**Renaming afterwards**\n\nAlways rename `Pivot Field Names` and `Pivot Field Values` to something meaningful — Month and Sales. Leaving the defaults in a published data source is a small but visible sign of carelessness.\n\n**The reverse**\n\nGoing long to wide is done in the view rather than the data: put the dimension on Columns. Tableau's whole model prefers long data, so there is no built-in unpivot-to-wide, and that asymmetry is deliberate.",
    mistakes: [
      "Trying to analyse wide data instead of reshaping it.",
      "Leaving the pivot fields with their default names.",
      "Using the built-in pivot for a file whose columns change each period.",
    ],
    followUps: [
      "A thirteenth month column appears next year. What happens?",
      "How does this compare to unpivoting in Power Query?",
    ],
    tags: ["pivot", "wide to long", "reshape", "tidy data", "Tableau Prep"],
    related: ["tb-q-tableau-prep", "xl-q-normalize", "xl-c-powerquery"],
    sources: [GFG_TB],
  }),
  q({
    id: "tb-q-dateadd",
    category: "Dates",
    title: "Date functions: DATEADD, DATEDIFF, DATEPART and DATETRUNC",
    difficulty: "Medium",
    q: "How do you use DATEADD to add or subtract time from a date field, and how does it differ from DATETRUNC and DATEPART?",
    hint: "One shifts, one truncates, one extracts. Give an example of each.",
    answer:
      "DATEADD('month', 3, [Order Date]) shifts a date by an interval, with a negative number going backwards. DATETRUNC('month', [Order Date]) truncates to the start of the period, turning any date in March into 1 March — which is how you group by month while keeping a real date. DATEPART('month', [Order Date]) extracts the component as a number, and DATENAME returns it as text. DATEDIFF('day', a, b) gives the difference in a chosen unit.",
    detail:
      "**The four, side by side**\n\n| Function | On 15 March 2025 | Returns |\n|---|---|---|\n| `DATEADD('month', 3, d)` | | 15 June 2025 |\n| `DATETRUNC('month', d)` | | 1 March 2025 (a date) |\n| `DATEPART('month', d)` | | 3 (a number) |\n| `DATENAME('month', d)` | | \"March\" (text) |\n\n**Why DATETRUNC matters most**\n\nIt keeps the result a *date*, so it still sorts chronologically and works on a continuous axis. `DATENAME` gives \"March\" as text, which sorts alphabetically — April, August, December. Anyone who has seen a chart with months in alphabetical order has met this.\n\n**The DATEDIFF subtlety**\n\n`DATEDIFF` counts *boundary crossings*, not elapsed time. `DATEDIFF('year', '2024-12-31', '2025-01-01')` returns 1, despite one day passing. For genuine elapsed months or years you need day differences and division, or an explicit adjustment. This trips people up in age and tenure calculations regularly.\n\n**The optional start-of-week argument**\n\n`DATETRUNC('week', [d], 'monday')` sets which day the week begins on. Default is Sunday, which is wrong for most business reporting outside the US. Worth knowing because weekly aggregates silently shift otherwise.\n\n**Practical patterns**\n\n```\nYTD flag:      [Order Date] >= DATETRUNC('year', TODAY()) AND [Order Date] <= TODAY()\nSame period LY: DATEADD('year', -1, [Order Date])\nAge in years:   DATEDIFF('year', [DOB], TODAY())   -- boundary-crossing caveat applies\n```\n\n**The units**\n\n`'year'`, `'quarter'`, `'month'`, `'week'`, `'day'`, `'hour'`, `'minute'`, `'second'`, plus `'dayofyear'`, `'weekday'` and `'iso-week'` for DATEPART. ISO week matters for reporting standards that use it.",
    code: [
      { lang: "Tableau", label: "Shift a date", code: "DATEADD('month', -1, [Order Date])" },
      { lang: "Tableau", label: "Group by month, staying a date", code: "DATETRUNC('month', [Order Date])" },
      { lang: "Tableau", label: "Year-to-date flag", code: "[Order Date] >= DATETRUNC('year', TODAY())\nAND [Order Date] <= TODAY()" },
      { lang: "Tableau", label: "Weeks starting Monday", code: "DATETRUNC('week', [Order Date], 'monday')" },
    ],
    mistakes: [
      "Using DATENAME for grouping, so months sort alphabetically.",
      "Assuming DATEDIFF measures elapsed time rather than boundary crossings.",
      "Leaving weeks starting on Sunday when the business reports Monday to Sunday.",
    ],
    followUps: [
      "Why do your months sort alphabetically?",
      "What does DATEDIFF('year', '2024-12-31', '2025-01-01') return, and why?",
    ],
    tags: ["DATEADD", "DATETRUNC", "DATEPART", "DATEDIFF", "dates"],
    related: ["tb-c-dates", "tb-q-latest-month", "tb-q-yoy-growth-tableau"],
    sources: [GFG_TB],
  }),

  // =========================================================== VISUALIZATION
  q({
    id: "tb-q-chart-types",
    category: "Visualization",
    title: "Which chart for which question?",
    difficulty: "Easy",
    q: "Which chart would you use to visualise quarterly sales trends over five years, the distribution across quartiles, and market share across companies?",
    hint: "Map the analytical question to the chart. Say why, not just what.",
    answer:
      "Quarterly trends over five years: a line chart with a continuous quarter axis, so the time spacing is real and gaps are visible. Distribution across quartiles: a box plot, which shows median, quartiles and outliers directly. Market share across companies: a sorted horizontal bar chart — not a pie, because people compare lengths far more accurately than angles, and a sorted bar also makes the ranking immediately readable.",
    detail:
      "**The mapping**\n\n| Question | Chart | Why |\n|---|---|---|\n| Trend over time | line, continuous axis | shows direction and real spacing |\n| Distribution of one measure | histogram or box plot | shows spread, not just centre |\n| Quartiles specifically | box plot | median, IQR and outliers in one mark |\n| Comparison across categories | sorted bar | length is the most accurately judged encoding |\n| Two measures related | scatter with trend line | shows correlation and outliers |\n| Composition of a whole | stacked bar or treemap | parts within a total |\n| Two measures, different scales | dual axis, synchronised or labelled | avoids two charts |\n| Geography | filled or symbol map | spatial patterns |\n| Two-dimensional density | heat map | magnitude across a matrix |\n\n**Why continuous for a trend**\n\nA discrete quarter part collapses all five years into four columns. A continuous quarter value gives twenty points on a real timeline. If a five-year trend shows four points, this is why.\n\n**Why not a pie for market share**\n\nCleveland and McGill's work on graphical perception ranks position and length above angle and area for accuracy. A sorted bar chart conveys the same data more precisely and adds an explicit ranking. Pies survive for two or three categories summing to a meaningful whole; beyond that they are decorative. Being able to give the reason rather than just the preference is what makes this answer sound informed.\n\n**Box plot detail**\n\nThe box spans Q1 to Q3, the line is the median, and the whiskers extend to 1.5×IQR with points beyond shown individually. That is the same rule as the IQR outlier test, which is a nice connection to draw.\n\n**On dual axes**\n\nUse Synchronize Axis whenever the two measures share a unit. When they do not, label both axes clearly — an unsynchronised dual axis can be made to show almost any relationship, and readers know it.",
    mistakes: [
      "Using a discrete date part for a trend line.",
      "A pie chart with many slices.",
      "An unsynchronised dual axis with no labelling.",
    ],
    followUps: [
      "Why is a bar chart better than a pie here?",
      "What does a box plot's whisker length represent?",
    ],
    tags: ["chart choice", "line chart", "box plot", "bar chart", "visualization"],
    related: ["tb-c-chart-choice", "tb-q-dual-axis", "xl-q-chart-types"],
    sources: [GFG_TB],
  }),
  q({
    id: "tb-q-dual-axis",
    category: "Visualization",
    title: "What is a dual-axis plot?",
    difficulty: "Medium",
    q: "What is a dual-axis plot and how do you create one in Tableau?",
    hint: "Two measures sharing one pane. And there is one menu option that decides whether it is honest.",
    answer:
      "A dual axis shows two measures in the same pane with separate axes on the left and right. You create it by dropping the second measure onto the right-hand side of the pane, or by right-clicking its pill and choosing Dual Axis. The critical follow-up is Synchronize Axis: if the two measures share a unit, synchronising them is mandatory, because unsynchronised axes can be scaled to imply almost any relationship between the two series.",
    detail:
      "**How to build one**\n\n1. Put the first measure on Rows.\n2. Drag the second measure to the right edge of the pane until a second axis appears — or put it on Rows and right-click its pill → Dual Axis.\n3. Right-click the right-hand axis → **Synchronize Axis** if the units match.\n4. Set each measure's mark type independently in the Marks card — this is what lets you combine a bar and a line.\n\n**The honesty point**\n\nTwo unsynchronised axes let you choose the scaling, and different scaling can make two series appear correlated, inversely correlated, or unrelated. When both measures are in the same unit — sales and profit, both in pounds — synchronising is not a preference, it is correctness. When the units genuinely differ — revenue and conversion rate — label both axes prominently and consider whether two stacked charts would be clearer.\n\n**The legitimate uses**\n\n- **Actual versus target**: bars for actual, a line for target, same unit, synchronised.\n- **Volume and rate**: bars for order count, line for conversion rate. Different units, so labelled rather than synchronised.\n- **Lollipop and other combined marks**: a circle and a line on a dual axis of the *same* measure, used purely for styling.\n\nThat last one is worth knowing — dual axis is often used for visual construction rather than for showing two different measures.\n\n**Combined axis versus dual axis**\n\nA *combined* axis uses Measure Values and Measure Names to put several measures on one shared axis. That is right when the measures are comparable and you want them on the same scale. A dual axis is right when they need separate scales or different mark types. The distinction gets asked.",
    mistakes: [
      "Not synchronising axes when the measures share a unit.",
      "Using a dual axis where two separate charts would be clearer.",
      "Confusing a dual axis with a combined Measure Values axis.",
    ],
    followUps: [
      "When must you synchronise, and when must you not?",
      "What is a combined axis, and when is it better?",
    ],
    tags: ["dual axis", "synchronize axis", "combined axis", "visualization"],
    related: ["tb-c-chart-choice", "tb-q-chart-types"],
    sources: [GFG_TB],
  }),
  q({
    id: "tb-q-actions",
    category: "Visualization",
    title: "What are dashboard actions?",
    difficulty: "Medium",
    q: "What are Actions in Tableau and what types are there?",
    hint: "Four or five types. Say what each does to the destination.",
    answer:
      "Actions make a dashboard interactive by letting a selection in one sheet drive something elsewhere. Filter actions use the selection to filter another sheet. Highlight actions emphasise matching marks without removing others. URL actions open an external link with values passed in. Parameter actions set a parameter's value from a clicked mark. Set actions add or remove members from a set. Each is configured under Dashboard → Actions, with a trigger of hover, select or menu.",
    detail:
      "**The five types**\n\n| Action | Effect on the target |\n|---|---|\n| **Filter** | filters the target sheet to the selection |\n| **Highlight** | emphasises matching marks, keeps the rest visible |\n| **URL** | opens a link, with field values substituted |\n| **Parameter** | sets a parameter value from the selection |\n| **Set** | changes a set's membership from the selection |\n\n**Filter versus highlight**\n\nFiltering removes context — you see only the selection. Highlighting keeps the rest visible but dimmed, so the selection is seen *in* context. For comparison tasks highlight is usually better, and choosing deliberately between them is a design decision worth articulating.\n\n**The clearing behaviour**\n\nA filter action's \"Clearing the selection will\" setting decides what the target shows when nothing is selected: show all values, leave the filter, or show no values. \"Show no values\" produces an empty dashboard on load, which readers report as broken. Getting this right is a common polish issue.\n\n**Parameter and set actions**\n\nThese are the newer and more powerful ones. A parameter action lets clicking a bar set the comparison baseline, or the reference line, or which measure is displayed. A set action lets clicking build up a selection — the basis of proportional-brushing and drill-down-without-navigation patterns. Naming them signals current Tableau knowledge, since both are relatively recent.\n\n**Triggers**\n\nHover is immediate but can feel twitchy; Select requires a click; Menu puts the action in the tooltip as a link, which is the least intrusive and often the best choice for a URL action.\n\n**Why actions rather than more filters**\n\nEvery filter added to a dashboard is another control the reader must understand. Actions let the visualisation itself be the control, which usually produces a cleaner and more discoverable dashboard.",
    mistakes: [
      "Leaving the clearing behaviour at 'show no values', so the dashboard loads empty.",
      "Filtering when highlighting would preserve useful context.",
      "Not knowing parameter and set actions exist.",
    ],
    followUps: [
      "Your dashboard is blank when it loads. What did you configure wrongly?",
      "When would you highlight rather than filter?",
    ],
    tags: ["actions", "filter action", "highlight", "parameter action", "set action", "dashboard"],
    related: ["tb-c-chart-choice", "tb-c-params-sets"],
    sources: [GFG_TB],
  }),

  // =========================================================== PERFORMANCE / SERVER
  q({
    id: "tb-q-optimize-dashboard",
    category: "Performance",
    title: "How do you optimise a slow dashboard?",
    difficulty: "Hard",
    q: "What are the different ways to optimise a dashboard's performance in Tableau?",
    hint: "Measure first with performance recording, then work through data, calculations, filters and the view.",
    answer:
      "Start with Help → Settings and Performance → Start Performance Recording, which produces a workbook showing where the time actually goes — query execution, calculations, geocoding or layout. Then work in order: use an extract rather than a slow live connection and filter and hide fields within it; simplify calculations, preferring booleans over strings and pushing heavy logic upstream; reduce filters, especially quick filters set to \"only relevant values\"; and reduce the number of marks and worksheets, since each worksheet is at least one query.",
    detail:
      "**Step 1 — record**\n\nThe performance recording workbook breaks time down by event type and shows the actual SQL for slow queries. Without it you are guessing, and the guess is often wrong — people optimise calculations when the real cost was six quick filters.\n\n**Step 2 — the data**\n\n| Fix | Effect |\n|---|---|\n| Extract instead of live | usually the single biggest win |\n| Filter rows at extract time | less data to scan |\n| **Hide unused fields** | hidden fields are excluded from the extract entirely |\n| Aggregate the extract | if row detail is not needed |\n| Compute Calculations Now | materialises calculations into the extract |\n\nHiding unused fields is the most-forgotten one and often halves an extract.\n\n**Step 3 — calculations**\n\nBooleans evaluate fastest, then integers, then dates, then strings. A row-level string comparison over ten million rows is expensive; the same logic as a boolean flag computed upstream is nearly free. LODs over high-cardinality dimensions are costly. Anything stable should be pushed into the database or Tableau Prep.\n\n**Step 4 — filters**\n\nEach quick filter runs a query to populate its list. \"Only relevant values\" makes every filter re-query whenever any other filter changes, which is quadratic in the worst case and is a very common cause of a sluggish dashboard. Prefer a parameter, a wildcard filter, or fewer filters.\n\n**Step 5 — the view**\n\nEvery worksheet on a dashboard is at least one query, and they run in parallel up to a limit. A dashboard with twelve worksheets is doing twelve queries per interaction. Reduce the number of marks too — a scatter with half a million points is slow and unreadable.\n\n**Step 6 — architecture**\n\nIf it is still slow: aggregate in the warehouse, use a published and pre-aggregated data source, or move the heavy work into a scheduled Prep flow.\n\n**What makes this answer good**\n\nMeasuring first. Everyone can list tips; diagnosing before acting is the professional habit and also the thing that stops you spending a day on the wrong problem.",
    mistakes: [
      "Listing optimisations without mentioning performance recording.",
      "Leaving unused fields in the extract.",
      "Many quick filters with 'only relevant values' enabled.",
    ],
    followUps: [
      "What does performance recording actually show you?",
      "Why is 'only relevant values' expensive?",
    ],
    tags: ["performance", "performance recording", "extract", "quick filters", "marks"],
    related: ["tb-c-performance", "tb-c-extracts", "tb-c-filter-order"],
    sources: [GFG_TB],
  }),
  q({
    id: "tb-q-tableau-rls",
    category: "Server",
    title: "Row-level security in Tableau",
    difficulty: "Hard",
    q: "What is Row-Level Security (RLS) in Tableau, and how do you implement it?",
    hint: "Two main approaches. Both rely on a function that identifies the signed-in user.",
    answer:
      "RLS restricts which rows each user can see in a published workbook. The classic approach is a user filter using USERNAME() or ISMEMBEROF() in a calculated field, applied as a data source filter. The scalable approach is an entitlements table mapping usernames to the values they may see, joined or related to the data, with a calculated filter comparing USERNAME() against it. Newer versions also support virtual connections with centrally-defined data policies, which apply the rule once for every workbook using that connection.",
    detail:
      "**The entitlements-table approach**\n\n1. Build a table mapping username to permitted values — `Entitlements(Username, Region)`.\n2. Relate or join it to the data on Region.\n3. Add a data source filter: `[Username] = USERNAME()`.\n\nAdding a user becomes a row insert. This is the equivalent of Power BI's dynamic RLS and is the answer to give for anything beyond a handful of users.\n\n**The functions**\n\n| Function | Returns |\n|---|---|\n| `USERNAME()` | the signed-in user's name |\n| `FULLNAME()` | their display name |\n| `ISMEMBEROF('group')` | true if they are in that Server group |\n| `USERDOMAIN()` | their domain |\n\n`ISMEMBEROF` is useful for a coarse override: `ISMEMBEROF('Executives') OR [Region] = [User Region]` gives executives full visibility without a separate workbook.\n\n**Why it must be a data source filter**\n\nApplied as a worksheet filter, a user could potentially remove it, or a different sheet could omit it. As a **data source filter** it applies to every query from that source. Getting this wrong is a genuine security hole, not a cosmetic issue.\n\n**Testing**\n\nOn Server or Cloud, open the view and use the option to view as a different user. Testing as yourself with full permissions tells you nothing — the same trap as Power BI RLS.\n\n**Virtual connections and data policies**\n\nThe modern approach: define the connection and the row-level policy once, centrally, and every workbook built on it inherits the rule. That removes the risk of one analyst forgetting to apply the filter, which is the main weakness of the per-workbook approach.\n\n**The comparison**\n\nPower BI defines roles in the model and assigns users in the Service; Tableau applies a filter using the signed-in identity. Same goal, different mechanism — and Tableau's has historically been easier to get subtly wrong, which is why virtual connections exist.",
    mistakes: [
      "Applying the user filter as a worksheet filter rather than a data source filter.",
      "One workbook per user group instead of an entitlements table.",
      "Testing with an account that has full access.",
    ],
    followUps: [
      "Why must it be a data source filter?",
      "How would you give executives full visibility?",
    ],
    tags: ["RLS", "USERNAME", "ISMEMBEROF", "entitlements", "security", "Server"],
    related: ["tb-c-products", "pbi-q-rls", "tb-q-troubleshoot-no-data"],
    sources: [GFG_TB],
  }),
  q({
    id: "tb-q-troubleshoot-no-data",
    category: "Server",
    title: "A published dashboard shows \"No Data\". How do you troubleshoot?",
    difficulty: "Hard",
    q: "A published dashboard on Tableau Server suddenly shows \"No Data\" or fails to load. How would you troubleshoot it?",
    hint: "Work outwards: does it work for you, for everyone, and did anything change?",
    answer:
      "Establish the scope first: is it one user or everyone, one view or the whole workbook, and did it ever work? If it works for you but not for a colleague, it is permissions or row-level security. If it fails for everyone, check the extract refresh history for a failed refresh, then the data source credentials, then whether the source schema changed — a renamed or dropped column breaks a calculated field and can empty a view. Also check whether a filter is set to exclude everything, which is the most common non-infrastructure cause.",
    detail:
      "**The triage order**\n\n1. **Scope it.** One user or all? One view or all? Did it ever work?\n2. **Works for you, not for them** → permissions, or RLS filtering them to nothing. Use view-as-user to confirm. A user missing from the entitlements table sees no rows, which is correct behaviour that looks like a bug.\n3. **Fails for everyone** →\n   - **Extract refresh history.** A failed refresh can leave an empty or stale extract. This is the first thing to check and the most common cause.\n   - **Data source credentials.** An expired service-account password breaks refresh silently until someone looks.\n   - **Bridge or gateway** offline, for a cloud site reaching on-prem data.\n   - **Source schema change.** A renamed column breaks the calculated fields that reference it.\n4. **Filters.** A relative date filter of \"this month\" returns nothing on the 1st if the data lags. A context filter or a Top N combination can also legitimately produce an empty result.\n5. **Server health.** Background tasks queued, disk full on the extract volume, licence expiry.\n\n**The date-filter cause worth calling out**\n\nA dashboard that works all month and empties on the 1st is almost always a relative date filter set to the current calendar period against data that lags by a day. The fix is to derive the period from `MAX([Order Date])` rather than `TODAY()` — which is the same point as the dynamic latest-month question.\n\n**What good troubleshooting sounds like**\n\nNot a list of causes, but a narrowing process: scope, then recent change, then the specific hypothesis. Interviewers asking this are assessing method more than knowledge, and \"what changed?\" is usually the most productive single question.\n\n**Prevention**\n\nAlerts on refresh failure, a visible last-refreshed timestamp on the dashboard itself, and monitoring on the extract schedule. A dashboard that fails silently is worse than one that fails loudly.",
    mistakes: [
      "Jumping to a cause before establishing the scope.",
      "Not checking the extract refresh history first.",
      "Overlooking RLS as the reason one user sees nothing.",
    ],
    followUps: [
      "It works all month and breaks on the 1st. What is happening?",
      "How would you stop this failing silently next time?",
    ],
    tags: ["troubleshooting", "Tableau Server", "extract refresh", "permissions", "RLS", "scenario"],
    related: ["tb-q-tableau-rls", "tb-c-extracts", "tb-q-latest-month"],
    sources: [GFG_TB],
  }),
];
