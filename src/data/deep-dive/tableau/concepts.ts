import { conceptsFor } from "../helpers";
import type { DeepDiveItem } from "../types";

const c = conceptsFor("DATA", "tableau");

export const TABLEAU_CONCEPTS: DeepDiveItem[] = [
  // ------------------------------------------------------------------ FUNDAMENTALS
  c({
    id: "tb-c-products",
    category: "Fundamentals",
    title: "The Tableau product family and file types",
    difficulty: "Easy",
    body: `Tableau is several products, and interviews reward precision about which does what:

- **Tableau Desktop** — the authoring tool. Connect, build worksheets, assemble dashboards.
- **Tableau Server** — self-hosted publishing platform, run on your own infrastructure.
- **Tableau Cloud** (formerly Online) — the same thing hosted by Tableau.
- **Tableau Prep Builder** — a separate visual data-preparation tool for cleaning, joining and reshaping before analysis.
- **Tableau Public** — free, but everything you publish is public.
- **Tableau Reader** — free desktop viewer for packaged workbooks.
- **Tableau Bridge** — keeps Tableau Cloud connected to on-premises data, the equivalent of Power BI's gateway.

**The file extensions** get asked directly:

| Extension | Contains |
|---|---|
| \`.twb\` | workbook — the definition only, XML, no data |
| \`.twbx\` | packaged workbook — definition **plus** the data extract |
| \`.hyper\` | the extract itself (replaced \`.tde\`) |
| \`.tds\` | data source definition — connection, calculations, formatting |
| \`.tdsx\` | packaged data source — definition plus data |
| \`.tfl\` | Tableau Prep flow |

The pair that matters is \`.twb\` versus \`.twbx\`: sending someone a \`.twb\` when they have no access to the underlying database means they see nothing. A \`.twbx\` travels with its data.`,
    example: `Emailing a workbook to a client who has no VPN access: package it as \`.twbx\` so the extract goes with it. Committing to version control: prefer \`.twb\`, which is XML and diffable, with the data source managed separately.`,
    relevance: `The products question opens most Tableau interviews and the file-extension question is a reliable follow-up. Naming Bridge unprompted signals deployment experience.`,
    mistakes: [
      "Confusing Tableau Public (everything is published publicly) with Tableau Cloud.",
      "Sending a .twb to someone without database access.",
    ],
    tags: ["Tableau Desktop", "Tableau Server", "Tableau Prep", "twb", "twbx", "hyper"],
    related: ["tb-q-tableau-products", "tb-q-file-extensions", "tb-c-extracts"],
  }),
  c({
    id: "tb-c-dimensions-measures",
    category: "Data",
    title: "Dimensions and measures, discrete and continuous",
    difficulty: "Easy",
    body: `Two independent distinctions that candidates constantly merge into one.

**Dimensions vs measures** — what the field *is*:
- A **dimension** is qualitative and slices the data. Region, product, order date. Dropping one on a shelf partitions the view.
- A **measure** is quantitative and gets aggregated. Sales, profit, quantity. Dropping one on a shelf produces a number, aggregated by default.

**Discrete vs continuous** — how the field is *displayed*:
- **Discrete** fields are **blue**. They produce distinct headers and separate panes.
- **Continuous** fields are **green**. They produce a continuous axis.

The two distinctions are orthogonal. Dimensions are usually discrete and measures usually continuous, but you can change either. That is exactly what makes date fields flexible: a discrete month gives you separate columns per month, while a continuous month gives you a real time axis with proportional spacing.

The colour convention is worth stating explicitly — **blue means discrete, green means continuous** — because interviewers use it as shorthand.`,
    example: `Order Date as discrete MONTH gives twelve labelled columns that ignore year gaps. Order Date as continuous MONTH gives one axis where a missing month leaves a visible gap. For a trend line you almost always want continuous; for comparing month-of-year across years you want discrete.`,
    relevance: `"Difference between dimensions and measures" and "discrete versus continuous" are both asked, often back to back. Getting the orthogonality right — rather than saying dimension means blue — is the discriminator.`,
    mistakes: [
      "Treating dimension/measure and discrete/continuous as the same distinction.",
      "Not knowing you can convert a measure to a dimension and vice versa.",
      "Using discrete dates for a trend line, which hides gaps in time.",
    ],
    tags: ["dimension", "measure", "discrete", "continuous", "blue", "green"],
    related: ["tb-q-dimensions-vs-measures", "tb-q-discrete-vs-continuous", "tb-c-dates"],
  }),
  c({
    id: "tb-c-joins-blends-relationships",
    category: "Data",
    title: "Joins, blends and relationships",
    difficulty: "Hard",
    body: `Three ways to combine data, introduced at different points in Tableau's history, which is why they overlap confusingly.

**Joins** happen at the physical layer, row by row, before aggregation. Inner, left, right and full outer, exactly as in SQL. Both tables must be in the same data source and connection. The hazard is **duplication**: joining a one-to-many relationship inflates the "one" side's measures, so a customer's revenue is counted once per order line.

**Blending** combines two *separate* data sources at the view level. Tableau queries each source independently, aggregates each, then matches on a linking field. The secondary source appears with an orange tick and can only contribute aggregated values. Use it when the sources genuinely cannot be joined — different databases, different granularity.

**Relationships** (since 2020.2) are the modern default and sit at the logical layer. You define how tables relate, and Tableau decides at query time — per visualisation — what join to actually perform and at what granularity. Nothing is flattened up front, so measures keep their native grain and duplication stops being a routine problem.

**The rule now:** use relationships unless you have a specific reason not to. Joins when you deliberately want a flattened physical table. Blending only when the data cannot live in one source.`,
    example: `Orders and Order Lines related rather than joined: a count of orders stays correct even in a view that also shows line-level detail, because Tableau does not flatten them into one duplicated table.`,
    relevance: `The join-versus-blend question is a Tableau staple, and relationships are the part that dates a candidate — someone who does not mention them is describing Tableau as it was before 2020.`,
    mistakes: [
      "Not mentioning relationships at all, which reads as dated knowledge.",
      "Joining one-to-many and reporting inflated measures.",
      "Reaching for blending when the sources could simply be related.",
    ],
    tags: ["join", "blend", "relationship", "logical layer", "physical layer", "duplication"],
    related: ["tb-q-join-vs-blend", "tb-q-relationship-vs-join", "tb-q-join-types", "tb-c-extracts"],
  }),
  c({
    id: "tb-c-extracts",
    category: "Data",
    title: "Live connections, extracts and incremental refresh",
    difficulty: "Medium",
    body: `A **live connection** queries the source every time the view changes. Data is always current, and every interaction costs a round trip to the database.

An **extract** is a compressed columnar snapshot in Tableau's \`.hyper\` format, stored with the workbook or on the server. Queries hit the extract rather than the source, which is usually far faster — the Hyper engine is built for analytical queries in a way a transactional database is not.

Extracts also enable features a live connection to some sources cannot support, work offline, and take load off the production database.

**Refreshing an extract**
- **Full refresh** rebuilds the whole thing.
- **Incremental refresh** appends only rows newer than a nominated column's last value. Fast, but it only *adds* — it does not pick up edits or deletes to existing rows, so a periodic full refresh is still needed.

**Reducing extract size** is a standard performance answer: filter rows at extract time, hide and exclude unused fields, and aggregate to the visible dimensions.`,
    example: `A 200-million-row transactional table on a busy production server: extract it filtered to the last two years with unused columns removed, refresh incrementally each night on the append-only order ID, and run a full refresh weekly to catch amendments.`,
    relevance: `"Live versus extract" is asked constantly, and the incremental-refresh limitation — that it misses updates and deletes — is the follow-up that separates people who have run one in production.`,
    mistakes: [
      "Claiming extracts are always faster; a well-indexed source with a small result set can beat one.",
      "Relying on incremental refresh alone, so edits and deletions never propagate.",
      "Extracting everything rather than filtering and hiding unused fields.",
    ],
    tags: ["extract", "live connection", "hyper", "incremental refresh", "performance"],
    related: ["tb-q-live-vs-extract", "tb-q-incremental-refresh", "tb-c-performance"],
  }),

  // ------------------------------------------------------------------ FILTERS
  c({
    id: "tb-c-filter-order",
    category: "Filters",
    title: "Filter types and the order of operations",
    difficulty: "Hard",
    body: `Tableau applies filters in a fixed sequence, and almost every confusing filter result traces back to not knowing it.

**The order of operations (query pipeline):**

1. **Extract filters** — applied when the extract is built. Rows excluded here never exist locally.
2. **Data source filters** — applied to every query from this source.
3. **Context filters** — create a temporary subset that everything after it operates on.
4. **Dimension filters** — the ordinary filters from the Filters shelf.
5. **FIXED LOD expressions** — computed here, *before* dimension filters apply to them.
6. **Measure filters** — applied after aggregation.
7. **Table calculation filters** — applied last, hiding marks without removing them from the calculation.

**Why this matters concretely:** a Top 10 filter combined with a Region filter gives the top 10 overall, then shows whichever of them are in that region — not the top 10 within the region. Promoting the Region filter to a **context filter** moves it before the Top N computation and produces the expected result.

**FIXED versus dimension filters** falls out of the same list: a FIXED LOD is computed before dimension filters, so it ignores them. To make a dimension filter affect a FIXED calculation, promote it to context.`,
    example: `Sales by customer with a Top 10 filter and a Region = East filter. Without context, you get however many of the global top 10 happen to be in East — often three. Right-click Region → Add to Context, and you get the top 10 customers within East.`,
    relevance: `The order of operations is the single most valuable thing to know about Tableau filtering, and "why does my Top N filter behave oddly with another filter" is a classic scenario question.`,
    mistakes: [
      "Not knowing context filters exist, and fighting Top N behaviour.",
      "Expecting a dimension filter to affect a FIXED LOD.",
      "Adding many context filters, which are materialised and can hurt performance.",
    ],
    tags: ["filters", "context filter", "order of operations", "Top N", "FIXED", "query pipeline"],
    related: ["tb-q-filter-types", "tb-q-context-filter", "tb-q-order-of-operations", "tb-c-lod"],
  }),

  // ------------------------------------------------------------------ CALCULATIONS
  c({
    id: "tb-c-calculations",
    category: "Calculations",
    title: "Row-level, aggregate and table calculations",
    difficulty: "Medium",
    body: `Three kinds of calculation, distinguished by *when* they are computed.

**Row-level** calculations run on each underlying row before aggregation. \`[Profit] / [Sales]\` written without aggregation is row-level, and summing the result gives the average of ratios, which is almost always wrong.

**Aggregate** calculations operate on aggregated values: \`SUM([Profit]) / SUM([Sales])\`. This is the correct profit ratio — the ratio of totals, not the total of ratios. Tableau will not let you mix aggregated and non-aggregated terms in one expression, which is the cause of the "cannot mix aggregate and non-aggregate arguments" error.

**Table calculations** run *after* the query returns, on the aggregated result table already in the view. Running total, percent of total, rank, difference from, moving average. Because they operate on what is in the view, they depend entirely on **Compute Using** — the direction and partitioning — which is where all the confusion lives.

**Quick table calculations** are presets for the common ones, applied from a pill's dropdown. They generate the same underlying calculation and can be converted to an editable custom one.`,
    example: `Profit ratio done wrong: \`[Profit]/[Sales]\` row-level then summed. Done right: \`SUM([Profit])/SUM([Sales])\`. On a view with a few large loss-making orders the two answers differ dramatically.`,
    code: [
      { lang: "Tableau", label: "Correct profit ratio", code: "SUM([Profit]) / SUM([Sales])" },
      { lang: "Tableau", label: "Classify with IF", code: "IF SUM([Sales]) > 100000 THEN \"High\"\nELSEIF SUM([Sales]) > 50000 THEN \"Medium\"\nELSE \"Low\"\nEND" },
      { lang: "Tableau", label: "Running total, a table calculation", code: "RUNNING_SUM( SUM([Sales]) )" },
    ],
    relevance: `The row-level versus aggregate distinction explains Tableau's most common error message, and table calculations are where candidates most often reveal they have only followed tutorials.`,
    mistakes: [
      "Averaging a row-level ratio instead of computing the ratio of sums.",
      "Not setting Compute Using on a table calculation and getting a plausible but wrong direction.",
      "Assuming a table calculation can see rows that are not in the view — it cannot.",
    ],
    tags: ["calculated field", "aggregate", "row-level", "table calculation", "compute using"],
    related: ["tb-q-calculated-field", "tb-q-table-calculation", "tb-q-profit-margin", "tb-c-lod"],
  }),
  c({
    id: "tb-c-lod",
    category: "LOD",
    title: "Level of Detail expressions: FIXED, INCLUDE, EXCLUDE",
    difficulty: "Hard",
    body: `LOD expressions let a calculation run at a granularity **different from the view**. That is the whole idea, and it is what makes them the most-asked advanced Tableau topic.

- **FIXED** — computes at exactly the dimensions you name, ignoring the view entirely.
  \`{ FIXED [Customer ID] : SUM([Sales]) }\` gives each customer's total sales regardless of what else is on the shelves.
- **INCLUDE** — computes at the view's dimensions **plus** the ones you name, then aggregates back up. Use it when you need a finer grain than the view shows.
  \`{ INCLUDE [Order ID] : SUM([Sales]) }\` averaged gives average order value even on a view showing only Region.
- **EXCLUDE** — computes at the view's dimensions **minus** the ones you name. Use it for a "total for the category" comparison inside a view broken down further.

**How they differ from table calculations:** LODs are computed by the database as part of the query and can see rows not present in the view. Table calculations run afterwards on the aggregated result and can only see what is displayed. When you need data that is not in the view, you need an LOD.

**The filter interaction** is the detail that gets tested: FIXED is computed *before* dimension filters, so it ignores them. Promote a filter to a context filter to make it apply to a FIXED expression.`,
    example: `Average order value on a view showing only Region. \`AVG([Sales])\` gives the average line value, not the average order. \`AVG({ INCLUDE [Order ID] : SUM([Sales]) })\` computes each order's total first and then averages, which is the number actually wanted.`,
    code: [
      { lang: "Tableau", label: "FIXED — ignores the view", code: "{ FIXED [Customer ID] : SUM([Sales]) }" },
      { lang: "Tableau", label: "INCLUDE — finer than the view", code: "AVG( { INCLUDE [Order ID] : SUM([Sales]) } )" },
      { lang: "Tableau", label: "EXCLUDE — coarser than the view", code: "SUM([Sales]) / SUM( { EXCLUDE [Sub-Category] : SUM([Sales]) } )" },
      { lang: "Tableau", label: "Customer cohort — first purchase date", code: "{ FIXED [Customer ID] : MIN([Order Date]) }" },
    ],
    relevance: `LOD questions appear in essentially every intermediate-or-above Tableau interview. The cohort pattern — FIXED MIN(Order Date) per customer — and the average-order-value pattern are the two worth having ready.`,
    mistakes: [
      "Expecting a dimension filter to affect a FIXED expression.",
      "Using a table calculation when the data needed is not in the view.",
      "Overusing FIXED on high-cardinality dimensions, which is expensive.",
    ],
    tags: ["LOD", "FIXED", "INCLUDE", "EXCLUDE", "level of detail", "granularity"],
    related: ["tb-q-lod", "tb-q-lod-types", "tb-q-one-time-customers", "tb-c-filter-order"],
  }),
  c({
    id: "tb-c-params-sets",
    category: "Parameters",
    title: "Parameters, sets and groups",
    difficulty: "Medium",
    body: `Three ways to make a view flexible, often confused with each other.

**Parameter** — a single user-input value: a number, date, string or boolean. It is *not* connected to the data and knows nothing about it; it just holds a value that calculations can reference. That independence is the point: a parameter can drive a threshold, switch which measure is displayed, or set a Top N cutoff. Since parameter actions, clicking a mark can also set one.

**Set** — a subset of dimension members, and it is data-aware.
- A **static set** is a fixed list you pick manually.
- A **dynamic** (computed) set is defined by a condition or a Top N rule and re-evaluates as the data changes.
Sets return a boolean IN/OUT per member, so they can be dropped on shelves, combined with each other, and used in calculations.

**Group** — merges dimension members into a coarser category. "Combine these six sub-categories into Furniture." It changes how a dimension is labelled, not which rows appear.

**The distinctions that get asked:** a parameter is a single value with no data awareness; a set is a data-driven membership; a group is a relabelling. A parameter alone can never filter — it needs a calculation that references it.`,
    example: `A Top N parameter feeding a set: the parameter holds the number, a dynamic set uses "Top N by Sales" with N bound to the parameter, and the set goes on the Filters shelf. The reader changes the number and the view responds.`,
    code: [
      { lang: "Tableau", label: "Parameter driving a measure swap", code: "CASE [Select Measure]\n  WHEN \"Sales\"    THEN SUM([Sales])\n  WHEN \"Profit\"   THEN SUM([Profit])\n  WHEN \"Quantity\" THEN SUM([Quantity])\nEND" },
      { lang: "Tableau", label: "Parameter as a threshold", code: "IF SUM([Sales]) > [Sales Threshold] THEN \"Above\" ELSE \"Below\" END" },
    ],
    relevance: `"Parameter versus filter" is a standard question and the answer — a parameter is not connected to the data and cannot filter on its own — is crisp. The measure-swap pattern is the most common practical use and worth being able to write.`,
    mistakes: [
      "Saying a parameter filters the view; it only holds a value.",
      "Confusing a group (relabelling) with a set (membership).",
      "Forgetting that a parameter's list is static unless it is set to refresh on workbook open.",
    ],
    tags: ["parameter", "set", "group", "bin", "parameter action", "Top N"],
    related: ["tb-q-parameter", "tb-q-sets-bins-groups", "tb-q-top-5-products"],
  }),

  // ------------------------------------------------------------------ DATES
  c({
    id: "tb-c-dates",
    category: "Dates",
    title: "Date parts, date values and date calculations",
    difficulty: "Medium",
    body: `Tableau treats a date field two ways, and the distinction drives most date confusion.

- **Date part** (discrete, blue) — extracts a component: MONTH gives "January" regardless of year, so every January across five years collapses into one column. Good for seasonality comparison.
- **Date value** (continuous, green) — truncates to a point in time: MONTH gives "January 2025", distinct from January 2024. Good for trends.

Right-clicking a date pill and dragging it offers both explicitly.

**The functions worth knowing:**

| Function | Does |
|---|---|
| \`DATEPART('month', [d])\` | a number, the component |
| \`DATENAME('month', [d])\` | the component as text |
| \`DATETRUNC('month', [d])\` | the date truncated to the period start |
| \`DATEADD('month', 3, [d])\` | shift by an interval |
| \`DATEDIFF('day', [a], [b])\` | difference in a unit |
| \`TODAY()\` / \`NOW()\` | date / date-and-time |

**Period-to-date** calculations combine DATETRUNC with a boolean:

\`\`\`
[Order Date] >= DATETRUNC('year', TODAY()) AND [Order Date] <= TODAY()
\`\`\`

**Showing only the latest month** is a recurring practical question, and the robust answer uses a FIXED LOD to find the maximum date in the data rather than hardcoding it.`,
    example: `A trend line that unexpectedly shows twelve points for five years of data is using a discrete date *part*. Switching the pill to a continuous date *value* gives sixty points on a real time axis.`,
    code: [
      { lang: "Tableau", label: "Year to date flag", code: "[Order Date] >= DATETRUNC('year', TODAY())\nAND [Order Date] <= TODAY()" },
      { lang: "Tableau", label: "Only the latest month in the data", code: "DATETRUNC('month', [Order Date])\n  = { FIXED : DATETRUNC('month', MAX([Order Date])) }" },
      { lang: "Tableau", label: "Year-over-year growth", code: "(SUM([Sales]) - LOOKUP(SUM([Sales]), -1)) / ABS(LOOKUP(SUM([Sales]), -1))" },
    ],
    relevance: `The date part versus date value distinction explains a whole class of "why does my chart look wrong" problems, and "show only the latest month dynamically" is asked as a practical task.`,
    mistakes: [
      "Using a date part for a trend line, so years collapse together.",
      "Hardcoding the current month instead of deriving it from the data.",
      "Using DATEDIFF for month differences without realising it counts boundary crossings, not elapsed months.",
    ],
    tags: ["dates", "DATEPART", "DATETRUNC", "DATEADD", "YTD", "date value"],
    related: ["tb-c-dimensions-measures", "tb-q-dateadd", "tb-q-latest-month", "tb-q-yoy-growth-tableau"],
  }),

  // ------------------------------------------------------------------ VISUALIZATION
  c({
    id: "tb-c-chart-choice",
    category: "Visualization",
    title: "Choosing a chart, and dashboard design",
    difficulty: "Medium",
    body: `Chart choice follows the analytical question, not preference:

| Question | Chart |
|---|---|
| Comparison across categories | bar — horizontal if labels are long |
| Trend over time | line |
| Relationship between two measures | scatter, with a trend line |
| Distribution of one measure | histogram or box plot |
| Distribution across quartiles | box plot |
| Composition of a total | stacked bar, treemap |
| Two measures on different scales | dual axis, synchronised or clearly labelled |
| Geographic | filled or symbol map |
| Hierarchical composition | treemap |
| Density across two dimensions | heat map / highlight table |

**Dual axis** is created by dropping a second measure on the opposite axis and choosing Dual Axis; **Synchronize Axis** matters whenever the two share a unit, or the comparison is meaningless.

**Dashboard design** principles that interviews reward:
- Lead with the headline number, top-left, where readers look first.
- Use a **container** layout rather than floating objects, so it reflows sensibly.
- Set a specific size or use device-specific layouts; "Automatic" degrades unpredictably.
- Use dashboard **actions** — filter, highlight, URL, parameter — instead of stacking more filters on the page.
- Fewer marks. Every mark is work for both the engine and the reader.`,
    example: `"Quarterly sales trends over five years" → a line chart with a continuous quarter axis. "Distribution across quartiles" → a box plot. "Market share across companies" → a sorted bar chart, not a pie.`,
    relevance: `A run of "which chart would you use for X" questions is standard in Tableau interviews. Answering by naming the analytical task each chart serves, rather than by preference, is what makes it sound informed.`,
    mistakes: [
      "Dual axes without synchronising or labelling, inviting false comparison.",
      "Floating layouts that break at other screen sizes.",
      "Pie charts with many slices.",
    ],
    tags: ["chart choice", "dashboard", "dual axis", "containers", "actions", "design"],
    related: ["tb-q-chart-types", "tb-q-dual-axis", "tb-q-actions", "xl-c-charts"],
  }),

  // ------------------------------------------------------------------ PERFORMANCE
  c({
    id: "tb-c-performance",
    category: "Performance",
    title: "Making a slow workbook fast",
    difficulty: "Hard",
    body: `Diagnose before optimising. **Help → Settings and Performance → Start Performance Recording** produces a workbook showing where time actually goes: query execution, geocoding, layout, calculations.

Then work through the usual causes, roughly in order of impact:

**Data**
- Use an **extract** rather than a live connection to a slow source.
- Filter the extract at build time and **hide unused fields** — hidden fields are excluded from the extract entirely.
- Aggregate the extract to visible dimensions if row detail is not needed.
- Materialise calculations in the extract (Compute Calculations Now).

**Calculations**
- Prefer **boolean** over string comparisons; booleans are the fastest type to evaluate.
- Push complex logic into the source database or into Tableau Prep.
- Avoid LOD expressions over very high-cardinality dimensions.
- Table calculations run on the returned result and are cheap; row-level string manipulation on millions of rows is not.

**Filters**
- **Extract and data source filters** are cheapest; they remove rows before anything else.
- **Quick filters** each cost a query to populate their list. "Only relevant values" costs more still.
- Avoid filters on high-cardinality dimensions with the multi-select list; use wildcards or a parameter.
- Context filters help Top N correctness but are materialised, so use them deliberately.

**The view**
- Reduce the number of marks. A scatter with 500,000 points is slow to query and unreadable anyway.
- Fewer worksheets per dashboard — each is at least one query.
- Avoid custom SQL that prevents Tableau optimising the query.`,
    example: `A dashboard taking 45 seconds: performance recording showed 38 of them in one worksheet's query, driven by a live connection with six "only relevant values" quick filters. An extract plus converting three filters to a parameter brought it under 4 seconds.`,
    relevance: `"How would you optimise a slow dashboard" is a standard senior question. Starting with performance recording rather than a list of tips is what distinguishes the answer.`,
    mistakes: [
      "Listing optimisations without mentioning performance recording.",
      "Leaving unused fields in the extract.",
      "Many quick filters set to 'only relevant values'.",
    ],
    tags: ["performance", "performance recording", "extract", "marks", "quick filters", "optimization"],
    related: ["tb-q-optimize-dashboard", "tb-c-extracts", "tb-c-filter-order"],
  }),
];
