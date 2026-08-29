import { conceptsFor } from "../helpers";
import type { DeepDiveItem } from "../types";

const c = conceptsFor("DATA", "power-bi");

export const POWERBI_CONCEPTS: DeepDiveItem[] = [
  // ------------------------------------------------------------------ FUNDAMENTALS
  c({
    id: "pbi-c-architecture",
    category: "Fundamentals",
    title: "Power BI architecture: Desktop, Service, and the pieces between",
    difficulty: "Easy",
    body: `Power BI is several products that people refer to with one name, and interviews reward being precise about which:

- **Power BI Desktop** — the free Windows authoring tool. You connect, transform, model and design here.
- **Power BI Service** — the cloud platform where reports are published, shared, scheduled and secured.
- **Power BI Mobile** — the consumption apps.
- **Power BI Report Server** — on-premises hosting, for organisations that cannot publish to the cloud.
- **On-premises Data Gateway** — the bridge that lets the cloud Service refresh a dataset sitting behind a corporate firewall. Without it, a cloud refresh of an on-prem SQL Server simply cannot happen.

Inside a report, four things are commonly confused:

| Thing | What it is |
|---|---|
| **Semantic model** (formerly dataset) | the data plus relationships plus measures |
| **Report** | pages of visuals bound to one semantic model |
| **Dashboard** | a Service-only canvas of pinned tiles, possibly from several reports |
| **Visual** | one chart |

A dashboard exists only in the Service — you cannot build one in Desktop, which is the detail this question is usually probing.`,
    example: `Desktop → publish → Service workspace → package as an App → users consume. Refresh runs in the Service on a schedule, reaching the source through the Gateway if that source is on-premises.`,
    relevance: `Almost every Power BI interview opens here. The differentiators are naming the Gateway unprompted and being clear that a dashboard is a Service artefact, not a Desktop one.`,
    mistakes: [
      "Using report and dashboard interchangeably.",
      "Forgetting the Gateway when asked how a cloud refresh reaches on-prem data.",
    ],
    tags: ["Power BI Desktop", "Power BI Service", "gateway", "semantic model", "dashboard"],
    related: ["pbi-q-what-is-powerbi", "pbi-q-dataset-report-dashboard", "pbi-q-gateway"],
  }),
  c({
    id: "pbi-c-storage-modes",
    category: "Fundamentals",
    title: "Import, DirectQuery, Live Connection and Composite models",
    difficulty: "Hard",
    body: `How a model stores data determines its performance, its freshness, and which DAX you are allowed to write.

- **Import** — data is copied into the VertiPaq in-memory columnar engine. Fastest queries, full DAX, but the data is only as fresh as the last refresh and the model must fit in memory.
- **DirectQuery** — no data is stored; every visual generates a query against the source at view time. Always current and unbounded in size, but every interaction is a round trip, and many DAX functions are unavailable or slow.
- **Live Connection** — a special case pointing at an existing Analysis Services model or a published Power BI semantic model. You get no local modelling at all; you are consuming someone else's model.
- **Composite** — mixes storage modes per table, so a large fact table can stay DirectQuery while small dimensions are imported. **Dual** mode lets a dimension behave as either, depending on what the query needs.

**Aggregations** sit on top of composite models: a pre-summarised imported table answers high-level queries instantly, and Power BI falls through to DirectQuery only when a query needs detail the aggregation cannot serve.`,
    example: `A billion-row fact table with a near-real-time requirement: keep the fact in DirectQuery, import the date and product dimensions as Dual, and add an imported aggregation table at day/product grain. Most visuals hit the aggregation in memory; drill-through falls through to the source.`,
    relevance: `This is the standard senior-level question because the answer is a trade-off rather than a fact. Naming Dual mode and aggregations moves you from "knows the three modes" to "has designed for scale".`,
    mistakes: [
      "Claiming DirectQuery is always better for large data without mentioning the per-interaction query cost.",
      "Forgetting that Live Connection removes your ability to add measures locally.",
    ],
    tags: ["Import", "DirectQuery", "Live Connection", "composite model", "aggregations", "VertiPaq"],
    related: ["pbi-q-import-vs-directquery", "pbi-q-composite-model", "pbi-c-performance"],
  }),

  // ------------------------------------------------------------------ POWER QUERY
  c({
    id: "pbi-c-query-folding",
    category: "Power Query",
    title: "Query folding",
    difficulty: "Hard",
    body: `Query folding is Power Query translating your transformation steps back into a single native query — usually SQL — that the source executes.

When folding works, the database does the filtering and grouping and returns only the rows you asked for. When folding breaks, Power BI pulls the entire table across the network and does the work locally. On a large table the difference is between seconds and hours.

**What preserves folding:** filtering rows, removing and renaming columns, changing types, merges against foldable sources, group by, sorting.

**What breaks it:** adding an index column, most custom M functions, \`Table.Buffer\`, and anything referencing a non-foldable source such as an Excel file or a hand-typed table.

The rule that follows is about ordering: put every foldable step first and anything that breaks folding last. Once a step breaks folding, nothing after it can fold either.

**How to check:** right-click a step in Applied Steps. If **View Native Query** is enabled, everything up to that step folded. If it is greyed out, folding stopped at or before that step.`,
    example: `Filtering to one year as the first step sends \`WHERE OrderDate >= '2025-01-01'\` to SQL Server and returns 200,000 rows. Adding an index column first breaks folding, so all 40 million rows cross the wire and are filtered locally.`,
    code: [
      { lang: "M", label: "Folds — pushed into SQL", code: "= Table.SelectRows(Source, each [OrderDate] >= #date(2025,1,1))" },
      { lang: "M", label: "Breaks folding — do this last, if at all", code: "= Table.AddIndexColumn(Source, \"Index\", 1, 1)" },
    ],
    relevance: `The best single question for distinguishing someone who has tuned a real refresh from someone who has only built demos. Being able to say how you would verify folding, not just define it, is the strong answer.`,
    mistakes: [
      "Describing folding but not knowing how to check whether it is happening.",
      "Adding index or custom columns early and breaking folding for every later step.",
      "Expecting folding against a flat file, which has no query engine to fold into.",
    ],
    tags: ["query folding", "Power Query", "M", "performance", "native query"],
    related: ["pbi-q-query-folding", "pbi-c-performance", "xl-c-powerquery"],
  }),
  c({
    id: "pbi-c-powerquery-pbi",
    category: "Power Query",
    title: "Power Query in Power BI: M, parameters and dataflows",
    difficulty: "Medium",
    body: `Power Query is the extract-and-transform layer. Its language is **M** — case-sensitive, functional, and quite unlike DAX, which is the other language in the product.

The distinction interviewers ask about directly:

| | M / Power Query | DAX |
|---|---|---|
| Runs | at refresh time | at query time |
| Purpose | shape and load data | calculate over the loaded model |
| Produces | tables and columns | measures and calculated columns |
| Case sensitivity | yes | no |

**Parameters** turn hardcoded values into managed inputs — a file path, a server name, a cut-off date — so the same model can point at dev and production without editing steps.

**Dataflows** move Power Query out of a single file and into the Service, where several reports reuse the same cleaned tables. That is how you stop five analysts each maintaining their own slightly different "clean customer list".

**Merge** adds columns (a join). **Append** adds rows (a union). That pair is asked constantly and the answer really is that simple.`,
    example: `A parameter \`SourceFolder\` feeds the folder connector, so moving from a test extract to the production share is a one-field change rather than an edit to every query.`,
    code: [
      { lang: "M", label: "Conditional column in M", code: "= Table.AddColumn(Source, \"Result\", each if [Marks] > 40 then \"Pass\" else \"Fail\")" },
    ],
    relevance: `The M-versus-DAX question is one of the most commonly asked in BI interviews, and the "when does each run" framing answers it far better than a feature list.`,
    mistakes: [
      "Saying M and DAX are interchangeable.",
      "Doing row-level transformation in DAX calculated columns when Power Query would be cheaper.",
    ],
    tags: ["M", "Power Query", "parameters", "dataflow", "merge", "append"],
    related: ["pbi-q-power-query", "pbi-q-dax-vs-m", "pbi-q-merge-vs-append-pbi", "pbi-c-query-folding"],
  }),

  // ------------------------------------------------------------------ MODELING
  c({
    id: "pbi-c-star-schema",
    category: "Modeling",
    title: "Star schema, and why Power BI insists on it",
    difficulty: "Medium",
    body: `A **star schema** is one central fact table of events (sales, clicks, tickets) surrounded by dimension tables describing them (date, product, customer, store), each joined on a single key.

A **snowflake** normalises dimensions further — Product → Subcategory → Category as three tables rather than one. It saves storage and costs joins.

Power BI recommends star schemas for reasons that are engine-level, not stylistic:

1. **Compression.** VertiPaq compresses by column. Wide dimension tables with repeated values compress extremely well, and narrow fact tables of keys and numbers compress best of all.
2. **Filter propagation.** Filters flow one-to-many from dimension to fact. A star gives every dimension a direct, one-hop path to the fact.
3. **Predictable DAX.** \`CALCULATE\` and the context-transition rules behave intuitively over a star and become genuinely hard to reason about over anything else.

Two structures to avoid: **flat single tables**, which compress badly and make consistent filtering impossible, and **many-to-many relationships**, which usually signal a missing bridge table.

A **date dimension** is not optional. Time intelligence requires a marked date table with one contiguous row per day covering the full range, with no gaps.`,
    example: `Sales (date key, product key, customer key, quantity, amount) joined to Date, Product and Customer. Every filter path is one hop, and every measure written once is correct at every level of every visual.`,
    code: [
      { lang: "DAX", label: "A date dimension, generated in DAX", code: "Date =\nADDCOLUMNS(\n    CALENDAR( DATE(2020,1,1), DATE(2026,12,31) ),\n    \"Year\",    YEAR([Date]),\n    \"Month\",   FORMAT([Date], \"MMM\"),\n    \"MonthNo\", MONTH([Date]),\n    \"Quarter\", \"Q\" & QUARTER([Date])\n)" },
    ],
    relevance: `Modelling questions separate report builders from BI developers. Answering with the three engine-level reasons — compression, filter propagation, DAX predictability — rather than "it is best practice" is what lands.`,
    mistakes: [
      "Loading one flat wide table because it looks simpler.",
      "Using the fact table's own date column instead of a marked date dimension, which breaks time intelligence.",
      "Reaching for bidirectional filtering to patch a modelling problem.",
    ],
    tags: ["star schema", "snowflake", "fact", "dimension", "date table", "VertiPaq"],
    related: ["pbi-q-star-vs-snowflake", "pbi-q-data-modeling", "pbi-c-relationships", "pbi-q-date-table"],
  }),
  c({
    id: "pbi-c-relationships",
    category: "Modeling",
    title: "Relationships: cardinality, cross-filter direction and active state",
    difficulty: "Medium",
    body: `Every relationship has three properties, and each one is interview material.

**Cardinality**
- *One-to-many* — the normal case. The "one" side is a dimension with unique keys.
- *Many-to-one* — the same thing described from the other end.
- *One-to-one* — usually a sign the two tables should be merged.
- *Many-to-many* — permitted since composite models, but it introduces ambiguity and usually means a bridge dimension is missing.

**Cross-filter direction**
- *Single* — filters flow one way, from the "one" side to the "many". The default, and almost always correct.
- *Both* — filters flow in both directions. Tempting, and the most common cause of an unpredictable model: with several bidirectional relationships the engine can find more than one filter path and either refuses to resolve it or produces results nobody can explain.

**Active vs inactive**
Only one active relationship may exist between two tables on a given path. Additional ones are stored inactive and switched on for a specific measure with \`USERELATIONSHIP\`. That is how a fact with both an order date and a ship date uses a single date dimension for both.`,
    example: `Sales has OrderDate and ShipDate, both pointing at Date. OrderDate is the active relationship; a shipped-revenue measure activates the other one for that calculation only.`,
    code: [
      { lang: "DAX", label: "Activate the inactive relationship for one measure", code: "Revenue by Ship Date =\nCALCULATE(\n    [Total Revenue],\n    USERELATIONSHIP( Sales[ShipDate], 'Date'[Date] )\n)" },
    ],
    relevance: `The role-playing dimension problem — two dates, one date table — is asked frequently, and \`USERELATIONSHIP\` is the expected answer. Knowing why bidirectional filtering is dangerous marks someone who has debugged a real model.`,
    mistakes: [
      "Turning on bidirectional filtering to fix a slicer, creating ambiguity elsewhere.",
      "Creating a second date table instead of using USERELATIONSHIP.",
      "Trying to build a relationship on a non-unique key.",
    ],
    tags: ["relationships", "cardinality", "cross-filter", "USERELATIONSHIP", "bidirectional"],
    related: ["pbi-c-star-schema", "pbi-q-cross-filter", "pbi-q-userelationship", "pbi-q-relationships"],
  }),

  // ------------------------------------------------------------------ DAX
  c({
    id: "pbi-c-dax-intro",
    category: "DAX",
    title: "DAX: measures, calculated columns and calculated tables",
    difficulty: "Medium",
    body: `DAX (Data Analysis Expressions) is the calculation language of the tabular engine — the same one behind Power Pivot and Analysis Services.

The three things you can create differ in *when* they are evaluated, and that difference drives every decision about which to use:

| | Calculated column | Measure | Calculated table |
|---|---|---|---|
| Evaluated | at refresh, row by row | at query time, per cell | at refresh |
| Stored in the model | yes, costs memory | no | yes |
| Responds to filters | no, it is fixed data | yes | no |
| Use for | row attributes, slicer fields | aggregations, ratios, KPIs | date tables, bridges |

**The rule of thumb:** if you need to slice *by* it, it is a column; if you need to aggregate it, it is a measure. Defaulting to measures keeps the model smaller and more flexible.

**Variables** are not merely style. \`VAR\` evaluates once and can be reused, which both speeds up a measure and — crucially — freezes the value before a later filter change.

**\`DIVIDE\` rather than \`/\`** is the other habit: it handles division by zero with an optional alternate result instead of erroring.`,
    example: `Margin as a measure — \`DIVIDE( SUM(Sales[Revenue]) - SUM(Sales[Cost]), SUM(Sales[Revenue]) )\` — is correct at every level of every visual. The same thing as a calculated column, then averaged in a visual, is wrong at every subtotal.`,
    code: [
      { lang: "DAX", label: "Measure with variables", code: "YoY Growth % =\nVAR Current = [Total Revenue]\nVAR PriorYr = CALCULATE( [Total Revenue], SAMEPERIODLASTYEAR('Date'[Date]) )\nRETURN\n    DIVIDE( Current - PriorYr, PriorYr )" },
    ],
    relevance: `"Difference between a calculated column and a measure" is asked in essentially every Power BI interview. The answer that lands explains evaluation time and memory, not just syntax.`,
    mistakes: [
      "Creating calculated columns for things that should be measures, bloating the model.",
      "Using `/` instead of DIVIDE and getting infinity errors.",
      "Repeating an expensive expression instead of storing it in a VAR.",
    ],
    tags: ["DAX", "measure", "calculated column", "VAR", "DIVIDE"],
    related: ["pbi-c-evaluation-context", "pbi-q-dax", "pbi-q-measure-vs-column", "pbi-q-dax-variables"],
  }),
  c({
    id: "pbi-c-evaluation-context",
    category: "DAX Context",
    title: "Row context, filter context and context transition",
    difficulty: "Hard",
    body: `Evaluation context is the hardest idea in DAX and the one interviews probe hardest.

**Filter context** is the set of filters applied to the model when an expression is evaluated. It comes from the visual (the row and column a cell sits in), from slicers, from page and report filters, and from \`CALCULATE\`. A measure in a cell showing "East, Q1" is evaluated with those two filters active.

**Row context** is the notion of a *current row*. It exists inside a calculated column and inside iterator functions (\`SUMX\`, \`AVERAGEX\`, \`FILTER\`). It is not a filter — it does not restrict the model, it just identifies which row you are looking at.

**Context transition** is where the two meet, and it is the concept that separates people who have read about DAX from people who have used it. When a **measure** is called inside a row context, the engine converts that row into an equivalent filter context: every column of the current row becomes a filter. \`CALCULATE\` triggers this, and a measure reference carries an implicit \`CALCULATE\`.

That is why these two behave completely differently:

\`\`\`
SUMX( Sales, Sales[Qty] * Sales[Price] )   -- row context, multiplies per row
SUMX( Sales, [Total Revenue] )             -- context transition on every row
\`\`\`

The second is usually a mistake and usually catastrophically slow, because it re-evaluates a whole measure once per row under a transitioned filter.`,
    example: `\`SUMX(Sales, Sales[Qty] * Sales[Price])\` computes revenue correctly line by line, which \`SUM(Qty) * SUM(Price)\` cannot — the latter multiplies two grand totals and is meaningless.`,
    code: [
      { lang: "DAX", label: "Iterator using row context — correct", code: "Revenue = SUMX( Sales, Sales[Quantity] * Sales[UnitPrice] )" },
      { lang: "DAX", label: "CALCULATE overriding filter context", code: "Revenue All Products =\nCALCULATE( [Revenue], REMOVEFILTERS( Product ) )" },
      { lang: "DAX", label: "Deliberate context transition", code: "Customers Above Average =\nCOUNTROWS(\n    FILTER( VALUES( Customer[CustomerID] ), [Revenue] > [Average Revenue] )\n)" },
    ],
    relevance: `"Difference between row context and filter context" is one of the most frequently asked Power BI questions, and context transition is the follow-up that separates candidates. Explaining why \`SUM(Qty)*SUM(Price)\` is wrong makes the idea concrete in one line.`,
    mistakes: [
      "Describing row context as 'a filter on one row' — it is not a filter at all.",
      "Referencing a measure inside an iterator without realising context transition fires.",
      "Using SUM where SUMX is required for a row-level product.",
    ],
    tags: ["row context", "filter context", "context transition", "CALCULATE", "SUMX", "iterator"],
    related: ["pbi-c-calculate", "pbi-q-row-vs-filter-context", "pbi-q-iterator-functions", "pbi-c-dax-intro"],
  }),
  c({
    id: "pbi-c-calculate",
    category: "DAX Context",
    title: "CALCULATE and the filter-removal family",
    difficulty: "Hard",
    body: `\`CALCULATE(expression, filter1, filter2, ...)\` evaluates an expression in a **modified** filter context. It is the most important function in DAX because it is the only way to change filter context, and every time-intelligence and percentage-of-total pattern is built on it.

Two behaviours to be precise about:

1. **Filter arguments replace, they do not add.** \`CALCULATE([Revenue], Product[Colour] = "Red")\` replaces any existing filter on Colour. To intersect with the existing filter instead, wrap it in \`KEEPFILTERS\`.
2. **CALCULATE triggers context transition.** Inside a row context it converts the current row into filters.

**The removal family** is what most interview questions target:

| Function | Removes |
|---|---|
| \`ALL(Table)\` | every filter on that table |
| \`ALL(Table[Col])\` | filters on that column only |
| \`ALLEXCEPT(Table, Col)\` | every filter except the listed columns |
| \`REMOVEFILTERS()\` | the modern, clearer alias for ALL |
| \`ALLSELECTED()\` | filters from the visual, while keeping slicer and page filters |

\`ALLSELECTED\` is the discriminator question: it respects what the user selected in slicers while ignoring the visual's own row context, which is exactly what "percent of the visible total" needs.`,
    example: `Percent of total that responds to slicers but not to the visual's own row: \`DIVIDE([Revenue], CALCULATE([Revenue], ALLSELECTED(Product[Category])))\`. Swap in \`ALL\` and it becomes percent of the grand total regardless of slicers.`,
    code: [
      { lang: "DAX", label: "% of grand total", code: "% of Total = DIVIDE( [Revenue], CALCULATE( [Revenue], REMOVEFILTERS() ) )" },
      { lang: "DAX", label: "% of what the user selected", code: "% of Selected = DIVIDE( [Revenue], CALCULATE( [Revenue], ALLSELECTED() ) )" },
      { lang: "DAX", label: "Add to the existing filter instead of replacing it", code: "Red Revenue = CALCULATE( [Revenue], KEEPFILTERS( Product[Colour] = \"Red\" ) )" },
    ],
    relevance: `"What does CALCULATE do" and "difference between ALL, ALLEXCEPT and ALLSELECTED" are both standard questions. The strong answer states that filter arguments replace rather than add, which is the behaviour that surprises people.`,
    mistakes: [
      "Believing CALCULATE's filters intersect with existing ones by default.",
      "Using ALL when the requirement was to respect slicers, which needs ALLSELECTED.",
      "Not realising CALCULATE causes context transition inside an iterator.",
    ],
    tags: ["CALCULATE", "ALL", "ALLEXCEPT", "ALLSELECTED", "REMOVEFILTERS", "KEEPFILTERS"],
    related: ["pbi-c-evaluation-context", "pbi-q-calculate", "pbi-q-all-allexcept-allselected", "pbi-q-percent-of-total"],
  }),
  c({
    id: "pbi-c-time-intelligence",
    category: "Time Intelligence",
    title: "Time intelligence and the date table it depends on",
    difficulty: "Medium",
    body: `Time intelligence functions shift or expand the filter context over dates: year-to-date, same period last year, rolling windows.

**They all share one prerequisite.** There must be a dedicated date table, marked as a date table, with one row per day, contiguous, covering every date in the fact data with no gaps. Using the fact table's own date column produces subtly wrong results — most visibly, periods with no transactions vanish rather than showing zero.

The core functions:

| Function | Returns |
|---|---|
| \`TOTALYTD\` / \`DATESYTD\` | year to date |
| \`SAMEPERIODLASTYEAR\` | the equivalent dates one year back |
| \`DATEADD(dates, n, interval)\` | shifted by any offset |
| \`PARALLELPERIOD\` | the *whole* prior period, not the equivalent slice |
| \`DATESINPERIOD\` | a window of n intervals from an anchor |
| \`PREVIOUSMONTH\` / \`PREVIOUSYEAR\` | the complete prior period |

\`SAMEPERIODLASTYEAR\` is exactly \`DATEADD(dates, -1, YEAR)\`. \`DATEADD\` is the general form, and the one to reach for when the offset is anything else.

**Rolling averages** use \`DATESINPERIOD\` anchored on the last visible date, not \`DATEADD\`.`,
    example: `YoY growth: compute the prior-year figure with \`SAMEPERIODLASTYEAR\`, then \`DIVIDE\` the difference. Using \`DIVIDE\` rather than \`/\` means the first year shows blank instead of an error.`,
    code: [
      { lang: "DAX", label: "Year to date", code: "Revenue YTD = TOTALYTD( [Total Revenue], 'Date'[Date] )" },
      { lang: "DAX", label: "Year on year", code: "YoY % =\nVAR PriorYr = CALCULATE( [Total Revenue], SAMEPERIODLASTYEAR('Date'[Date]) )\nRETURN DIVIDE( [Total Revenue] - PriorYr, PriorYr )" },
      { lang: "DAX", label: "3-month rolling average", code: "Rolling 3M Avg =\nAVERAGEX(\n    DATESINPERIOD( 'Date'[Date], LASTDATE('Date'[Date]), -3, MONTH ),\n    [Total Revenue]\n)" },
    ],
    relevance: `YoY and MoM measures are asked as live coding questions constantly. Volunteering the date-table prerequisite before writing the measure shows you know why these functions fail in practice.`,
    mistakes: [
      "No marked date table, or one with gaps.",
      "A fiscal year that does not start in January, which needs the year-end argument on TOTALYTD.",
      "Confusing PARALLELPERIOD with SAMEPERIODLASTYEAR — the former returns the entire prior period.",
    ],
    tags: ["time intelligence", "YTD", "YoY", "SAMEPERIODLASTYEAR", "DATEADD", "date table"],
    related: ["pbi-c-star-schema", "pbi-q-time-intelligence", "pbi-q-yoy-growth", "pbi-q-date-table"],
  }),

  // ------------------------------------------------------------------ VISUALIZATION
  c({
    id: "pbi-c-report-design",
    category: "Visualization",
    title: "Report design: drill-down, drill-through, bookmarks and tooltips",
    difficulty: "Medium",
    body: `The interactivity features get confused with each other, which is exactly why interviewers ask.

- **Drill-down** moves *within one visual*, down a hierarchy — Year to Quarter to Month — while staying on the same chart.
- **Drill-through** moves *to another page*, carrying the selected context with it. Right-click a category, land on a detail page filtered to it. This is how you keep a summary page clean while still offering depth.
- **Bookmarks** capture the state of a page — filters, selections, visual visibility — and replay it. Combined with the Selection pane they produce buttons that swap one visual for another, or a reset-filters control.
- **Tooltips** can be an entire report page rather than a text bubble, so hovering a bar shows a small trend chart for that bar.
- **Slicers vs filters**: a slicer is a visual on the canvas that the reader controls; the Filters pane is authored configuration applied at visual, page or report level. Slicers are visible and discoverable; filters are not.

**Conditional formatting** applies to backgrounds, font colours, data bars and icons, and can be driven by a rule, a colour scale, or a DAX field — the last of which is what makes it genuinely powerful.`,
    example: `A sales summary page with a drill-through to "Customer detail". The reader right-clicks a customer bar, arrives at a page filtered to that customer, and a back button returns them. The summary page stays uncluttered.`,
    relevance: `The drill-down versus drill-through distinction and the slicer versus filter distinction both have crisp right answers, so they are cheap marks — but only if you are precise.`,
    mistakes: [
      "Using drill-down and drill-through as synonyms.",
      "Building ten near-identical pages where bookmarks would do.",
      "Forgetting the back button on a drill-through page, stranding the reader.",
    ],
    tags: ["drill-down", "drill-through", "bookmarks", "tooltips", "slicer", "conditional formatting"],
    related: ["pbi-q-drill-down-vs-through", "pbi-q-slicer-vs-filter", "pbi-q-bookmarks", "xl-c-dashboard"],
  }),

  // ------------------------------------------------------------------ PERFORMANCE
  c({
    id: "pbi-c-performance",
    category: "Performance",
    title: "Diagnosing and fixing a slow report",
    difficulty: "Hard",
    body: `Slowness has three possible homes, and the first job is deciding which: the **model**, the **DAX**, or the **visuals**.

**Measure before you fix.** Performance Analyzer (View tab) records every visual's DAX query duration, render time and "other". That tells you where the time actually goes instead of guessing. DAX Studio gives query plans and server timings for anything suspicious.

**Model fixes — usually the biggest win**
- Remove columns nobody uses. VertiPaq compresses by column, so an unused high-cardinality column costs memory and refresh time for nothing.
- Reduce cardinality. Splitting a datetime into date plus time compresses far better than one column of unique timestamps.
- Star schema rather than a flat table.
- Turn off Auto Date/Time, which silently builds a hidden date table for *every* date column in the model.
- Use integer surrogate keys for relationships rather than long strings.

**DAX fixes**
- Avoid measures inside iterators, which trigger context transition per row.
- Prefer set-based functions over row-by-row logic.
- Use \`VAR\` so an expensive expression is evaluated once.
- Avoid \`FILTER\` over a whole table when a column predicate would do.

**Visual fixes**
- Fewer visuals per page. Every visual is at least one query.
- Avoid table visuals returning tens of thousands of rows.
- Limit slicers, especially high-cardinality ones.`,
    example: `A page taking 40 seconds: Performance Analyzer showed one table visual accounting for 34 of them. It returned 80,000 rows with a measure calling another measure inside SUMX. Rewriting it set-based and adding a Top N filter brought the page under 3 seconds.`,
    relevance: `"Your report is slow, what do you do" is a standard scenario question. The answer that stands out starts with measuring rather than listing fixes — anyone can recite optimisations; diagnosing first is the professional habit.`,
    mistakes: [
      "Listing optimisations without mentioning Performance Analyzer.",
      "Leaving Auto Date/Time on in a model with many date columns.",
      "Optimising DAX when the real problem is a flat, high-cardinality model.",
    ],
    tags: ["performance", "Performance Analyzer", "DAX Studio", "cardinality", "VertiPaq", "optimization"],
    related: ["pbi-c-storage-modes", "pbi-c-evaluation-context", "pbi-q-slow-report", "pbi-q-performance-analyzer"],
  }),

  // ------------------------------------------------------------------ SECURITY
  c({
    id: "pbi-c-rls",
    category: "RLS",
    title: "Row-Level Security, static and dynamic",
    difficulty: "Hard",
    body: `RLS restricts which **rows** a user can see. It is defined in Desktop as roles carrying DAX filter expressions, and enforced in the Service by assigning users to those roles.

**Static RLS** hardcodes the filter per role — \`[Region] = "East"\` — with one role per region. Simple, and unmaintainable past a handful.

**Dynamic RLS** uses one role whose filter resolves the current user at query time, driven by a mapping table. Adding a user becomes a data change rather than a model change, which is what production deployments need.

**Things that catch people out:**

- RLS filters **rows, not columns or measures**. Hiding a column entirely needs Object-Level Security.
- \`USERPRINCIPALNAME()\` returns the signed-in user's UPN in the Service; in Desktop it returns your own account, which is why you test with **View As Role**.
- RLS does **not** apply to a workspace **Admin, Member or Contributor** — those roles see everything. Only Viewers are filtered. Testing with your own admin account and concluding RLS is broken is the classic mistake.
- Bidirectional relationships can leak data past an RLS filter, which is another reason to avoid them.`,
    example: `A regional-manager report: one role, one \`UserSecurity\` table mapping email to region, one dynamic filter. Onboarding a new manager is a row insert, not a redeployment.`,
    code: [
      { lang: "DAX", label: "Dynamic RLS filter on the dimension", code: "[Region] =\nLOOKUPVALUE(\n    UserSecurity[Region],\n    UserSecurity[Email], USERPRINCIPALNAME()\n)" },
    ],
    relevance: `RLS appears in nearly every mid-to-senior Power BI interview, usually as "regional managers should only see their own region". Dynamic RLS with a mapping table is the expected answer, and noting that Viewers are the only filtered role is a strong detail.`,
    mistakes: [
      "Building one static role per region and calling it scalable.",
      "Testing as a workspace admin, who bypasses RLS entirely.",
      "Expecting RLS to hide a column rather than rows.",
    ],
    tags: ["RLS", "row-level security", "USERPRINCIPALNAME", "dynamic RLS", "OLS", "security"],
    related: ["pbi-q-rls", "pbi-q-dynamic-rls", "pbi-c-relationships", "pbi-c-service"],
  }),

  // ------------------------------------------------------------------ SERVICE
  c({
    id: "pbi-c-service",
    category: "Service",
    title: "Publishing, workspaces, apps and refresh",
    difficulty: "Medium",
    body: `The Service is where a report stops being a file and becomes a product.

**Workspaces** are the collaboration container. Roles are Admin, Member, Contributor and Viewer, in decreasing order of power — and only Viewer is subject to RLS.

**Apps** package the polished contents of a workspace for a wide audience. The distinction that matters: a workspace is where you build, an app is what you distribute. Sharing a workspace with hundreds of consumers is the wrong pattern.

**Refresh**
- *Scheduled refresh* runs on a timetable — up to 8 times a day on Pro, 48 on Premium or Fabric capacity.
- *Incremental refresh* partitions data by date and refreshes only recent partitions, so a ten-year table does not reload nightly. It requires parameters named exactly \`RangeStart\` and \`RangeEnd\`, of type DateTime, used to filter the source — and it needs query folding to work.
- *Gateway* is required for any on-premises source.

**Deployment pipelines** move content through Development → Test → Production with rules that repoint data sources per stage.

**Licensing**, briefly: Free authors in Desktop; **Pro** publishes and shares; **Premium Per User** adds larger models and more refreshes for one user; **Premium or Fabric capacity** licenses the workspace so free users can consume.`,
    example: `Build in Desktop → publish to a Development workspace → pipeline promotes to Test then Production → package Production as an App → hundreds of Viewers consume it under RLS, with incremental refresh running four times daily through the Gateway.`,
    relevance: `Service questions separate people who have shipped from people who have only authored. The incremental-refresh parameter names and the app-versus-workspace distinction are both commonly asked and easy to get exactly right.`,
    mistakes: [
      "Sharing a workspace instead of publishing an app.",
      "Not knowing incremental refresh requires parameters named RangeStart and RangeEnd specifically.",
      "Assuming a cloud refresh can reach an on-prem source without a Gateway.",
    ],
    tags: ["Power BI Service", "workspace", "app", "scheduled refresh", "incremental refresh", "gateway", "licensing"],
    related: ["pbi-c-architecture", "pbi-c-rls", "pbi-q-publish-share", "pbi-q-incremental-refresh"],
  }),
];
