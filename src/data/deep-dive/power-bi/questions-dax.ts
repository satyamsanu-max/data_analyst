import { common, gfg, github, questionsFor, URLS } from "../helpers";
import type { DeepDiveItem } from "../types";

const q = questionsFor("DATA", "power-bi");

const GFG_PBI = gfg(
  "Top 30 Power BI Interview Questions and Answers",
  URLS.gfgPowerBI,
  "Question published in the GeeksforGeeks Power BI interview question list.",
);
const GH_AWESOME = github(
  "NajiElKotob/Awesome-Power-BI",
  URLS.ghAwesomePowerBI,
  "Curated Power BI resource list that collects DAX-focused interview question sets.",
);
const GH_HUB = github(
  "virajbhutada/BI-ResourceHub",
  URLS.ghBIResourceHub,
  "Public Power BI resource repository covering interview questions and a DAX cheat sheet.",
);

/** DAX, visualisation, performance, security, service and scenario questions. */
export const POWERBI_QUESTIONS_DAX: DeepDiveItem[] = [
  // =========================================================== DAX
  q({
    id: "pbi-q-dax",
    category: "DAX",
    title: "What is DAX?",
    difficulty: "Easy",
    q: "What is DAX, and what are the three fundamental concepts you need to understand it?",
    hint: "Name the language, then the three concepts every DAX question ultimately reduces to.",
    answer:
      "DAX — Data Analysis Expressions — is the formula and query language of the tabular engine used by Power BI, Power Pivot and Analysis Services. Its three fundamental concepts are syntax, functions and context. Context is the one that matters: DAX formulas look like Excel formulas but behave completely differently, because a measure is re-evaluated in each cell of each visual under whatever filters apply there. Understanding row context, filter context and context transition is what separates working DAX from DAX that happens to give the right number in one visual.",
    detail:
      "**The three concepts**\n\n1. **Syntax** — how a formula is written. `Total Sales = SUM(Sales[Amount])`. The name, the equals sign, the expression.\n2. **Functions** — the library: aggregations, filters, time intelligence, iterators, relationship functions.\n3. **Context** — the environment a formula is evaluated in. This is the whole subject.\n\n**Why 'it is like Excel' is misleading**\n\nIn Excel, `=SUM(B2:B100)` refers to specific cells. In DAX, `SUM(Sales[Amount])` refers to a whole column, and the *filter context* of the cell you are looking at decides which rows of that column are actually summed. The same measure produces a different number in every cell of a matrix, correctly, without you writing anything conditional. That is the mental shift.\n\n**The habits that make DAX maintainable**\n\n- Use `VAR` for anything referenced more than once or non-obvious.\n- Use `DIVIDE(a, b)` rather than `a / b` — it handles a zero denominator with an optional alternate result.\n- Write explicit measures rather than dragging a column into Values and letting Power BI create an implicit one.\n- Name measures for what they mean, not how they are computed.\n\n**Why explicit measures matter**\n\nAn implicit measure exists only inside the visual that created it. An explicit measure is defined once in the model, is reusable, can be referenced by other measures, and is visible to anyone reading the model. Volunteering this shows model-authoring discipline rather than report-building habits.",
    code: [
      { lang: "DAX", label: "A measure with variables", code: "Margin % =\nVAR Revenue = SUM( Sales[Revenue] )\nVAR Cost    = SUM( Sales[Cost] )\nRETURN\n    DIVIDE( Revenue - Cost, Revenue )" },
    ],
    mistakes: [
      "Describing DAX as 'Excel formulas for Power BI' with no mention of context.",
      "Relying on implicit measures created by dragging columns.",
      "Using `/` instead of DIVIDE.",
    ],
    followUps: [
      "What is the difference between an implicit and an explicit measure?",
      "Why is DIVIDE preferred over the division operator?",
    ],
    tags: ["DAX", "context", "measures", "VAR", "DIVIDE"],
    related: ["pbi-c-dax-intro", "pbi-c-evaluation-context", "pbi-q-dax-variables"],
    sources: [GFG_PBI, GH_AWESOME],
  }),
  q({
    id: "pbi-q-dax-variables",
    category: "DAX",
    title: "What are the benefits of variables in DAX?",
    difficulty: "Medium",
    q: "What are the benefits of using variables in DAX?",
    hint: "Three benefits, and one of them is about correctness rather than speed.",
    answer:
      "Three things. Performance: a VAR is evaluated once and reused, so an expensive expression referenced three times is computed once rather than three times. Readability: naming intermediate results makes a long measure readable like code instead of a nest of parentheses. And correctness: a VAR is evaluated in the filter context where it is declared, so it freezes the value before any later CALCULATE changes the context — which is often exactly the behaviour you want, and occasionally a trap if you expected re-evaluation.",
    detail:
      "**The correctness point, with an example**\n\n```\nYoY % =\nVAR Current = [Total Revenue]\nVAR PriorYr = CALCULATE( [Total Revenue], SAMEPERIODLASTYEAR('Date'[Date]) )\nRETURN DIVIDE( Current - PriorYr, PriorYr )\n```\n\n`Current` is captured in the visual's own filter context, before the CALCULATE shifts the dates. If you inlined `[Total Revenue]` inside the same expression as the shifted CALCULATE, reasoning about which context applied where would be much harder. Variables make evaluation order explicit.\n\nThis also creates the one gotcha: a variable does **not** re-evaluate. Declaring `VAR x = [Revenue]` and then using `x` inside a `CALCULATE` that changes the filter gives you the *old* value, not a recomputed one. That is usually the intent, but when it is not, it is a confusing bug.\n\n**Syntax rules**\n\n- Every `VAR` block must end with `RETURN`.\n- Variables are immutable once assigned.\n- They can hold scalars **or tables**, which is what makes them useful for intermediate filtered sets.\n- Scope is the measure they are declared in.\n\n**As a debugging tool**\n\nTemporarily change `RETURN` to output an intermediate variable and you can inspect each step of a complex measure without rewriting it. That is the standard way to debug DAX and worth mentioning.\n\n**Performance in practice**\n\nThe gain is real but not magic: it matters most when the repeated expression is an expensive iterator or a CALCULATE. Repeating `SUM(Sales[Amount])` three times costs little, because the engine caches within a query. Being honest about that nuance is better than overselling it.",
    code: [
      { lang: "DAX", label: "Variables for clarity and evaluation order", code: "YoY % =\nVAR Current = [Total Revenue]\nVAR PriorYr = CALCULATE( [Total Revenue], SAMEPERIODLASTYEAR('Date'[Date]) )\nVAR Delta   = Current - PriorYr\nRETURN\n    DIVIDE( Delta, PriorYr )" },
      { lang: "DAX", label: "Debugging — return an intermediate", code: "-- temporarily:\nRETURN PriorYr" },
    ],
    mistakes: [
      "Expecting a variable to re-evaluate inside a later CALCULATE.",
      "Omitting RETURN.",
      "Claiming variables always make measures faster.",
    ],
    followUps: [
      "Does a variable re-evaluate if the filter context changes later in the measure?",
      "How would you debug a complex measure?",
    ],
    tags: ["VAR", "DAX", "performance", "readability", "debugging"],
    related: ["pbi-c-dax-intro", "pbi-q-dax", "pbi-c-evaluation-context"],
    sources: [GFG_PBI],
  }),
  q({
    id: "pbi-q-row-vs-filter-context",
    category: "DAX Context",
    title: "Row context vs filter context",
    difficulty: "Hard",
    q: "What is the difference between row context and filter context in DAX?",
    hint: "One identifies a row, the other restricts the model. Then explain what happens when they meet.",
    answer:
      "Filter context is the set of filters applied to the model when an expression is evaluated — from the visual's rows and columns, slicers, page filters and CALCULATE. Row context is the notion of a current row; it exists inside calculated columns and inside iterators like SUMX, and it identifies which row you are on without restricting the model at all. The point where they meet is context transition: when a measure is called inside a row context, the engine converts that row into an equivalent filter context, with every column of the row becoming a filter.",
    detail:
      "**The distinction in one line each**\n\n- **Filter context** — *which rows are visible*.\n- **Row context** — *which row I am currently on*.\n\nRow context does not filter. Inside `SUMX(Sales, ...)`, the whole Sales table is still visible to any measure you call; you simply have a pointer to the current row's values.\n\n**Where each comes from**\n\n| Context | Created by |\n|---|---|\n| Filter | visual axes, slicers, page/report filters, CALCULATE |\n| Row | calculated columns, iterators (SUMX, AVERAGEX, FILTER, ADDCOLUMNS) |\n\n**Why SUM cannot do what SUMX does**\n\n```\nBad:  SUM(Sales[Qty]) * SUM(Sales[Price])   -- multiplies two grand totals. Meaningless.\nGood: SUMX(Sales, Sales[Qty] * Sales[Price]) -- multiplies per row, then sums.\n```\n\nThis is the cleanest way to demonstrate row context, and it is worth leading with because it makes an abstract idea concrete immediately.\n\n**Context transition**\n\nWhen you reference a **measure** inside an iterator, the measure carries an implicit `CALCULATE`, which triggers transition: the current row becomes a filter. So:\n\n```\nSUMX( Customer, [Total Revenue] )\n```\n\nevaluates `[Total Revenue]` once per customer, each time filtered to that customer, and sums the results. That is sometimes exactly what you want — and it is also why such measures can be extremely slow, because a whole measure is re-evaluated per row.\n\n**The rule that follows**\n\nInside an iterator, referencing a *column* uses row context and is cheap. Referencing a *measure* triggers context transition and is expensive. Knowing which one you are doing is most of DAX performance.",
    code: [
      { lang: "DAX", label: "Row context — cheap", code: "Revenue = SUMX( Sales, Sales[Quantity] * Sales[UnitPrice] )" },
      { lang: "DAX", label: "Context transition — expensive, sometimes necessary", code: "Big Customers =\nCOUNTROWS( FILTER( VALUES(Customer[CustomerID]), [Total Revenue] > 100000 ) )" },
    ],
    mistakes: [
      "Calling row context 'a filter on one row'.",
      "Using SUM where SUMX is needed for a row-level product.",
      "Referencing measures inside iterators without realising the cost.",
    ],
    followUps: [
      "Why is SUM(Qty) * SUM(Price) wrong?",
      "What happens when you put a measure inside SUMX?",
    ],
    tags: ["row context", "filter context", "context transition", "SUMX", "iterator"],
    related: ["pbi-c-evaluation-context", "pbi-q-iterator-functions", "pbi-q-calculate"],
    sources: [GFG_PBI, GH_AWESOME],
  }),
  q({
    id: "pbi-q-calculate",
    category: "DAX Context",
    title: "What is the CALCULATE function?",
    difficulty: "Hard",
    q: "What is the CALCULATE function in DAX and why is it considered the most important one?",
    hint: "It is the only way to do one specific thing. And its filter arguments do something surprising.",
    answer:
      "CALCULATE evaluates an expression in a modified filter context: CALCULATE(expression, filter1, filter2, ...). It is the most important function because it is the only way to change filter context — every time-intelligence pattern, percentage-of-total and comparison measure is built on it. Two behaviours matter: its filter arguments replace existing filters on the same column rather than intersecting with them, and it triggers context transition, converting any surrounding row context into filters.",
    detail:
      "**The replacement behaviour**\n\n```\nRed Revenue = CALCULATE( [Revenue], Product[Colour] = \"Red\" )\n```\n\nIn a visual already filtered to Blue products, this returns Red revenue — not zero. The filter argument *replaced* the Colour filter. To intersect instead, wrap it:\n\n```\nCALCULATE( [Revenue], KEEPFILTERS( Product[Colour] = \"Red\" ) )\n```\n\nwhich returns blank in a Blue row, because Red ∩ Blue is empty. Candidates who assume filters always intersect are surprised by this, which is exactly why it is asked.\n\n**Context transition**\n\nInside a row context, CALCULATE converts the current row into a filter. This is why a measure reference — which carries an implicit CALCULATE — behaves so differently from a column reference inside an iterator.\n\n**Filter argument forms**\n\n- A simple predicate: `Product[Colour] = \"Red\"` — shorthand that DAX expands into a FILTER over the column's distinct values.\n- A table expression: `FILTER( ALL(Product), Product[Price] > 100 )` — needed when the condition involves a measure or spans columns.\n- A modifier: `ALL`, `REMOVEFILTERS`, `KEEPFILTERS`, `USERELATIONSHIP`, `CROSSFILTER`.\n\n**The performance note**\n\nPrefer the simple predicate form when you can. `FILTER(ALL(Table), ...)` materialises the whole table and is markedly slower than a column predicate the engine can push down.\n\n**Why it dominates DAX**\n\nEvery non-trivial measure is \"the same number, but under different filters\": prior year, all products, the visible selection, excluding returns. CALCULATE is the mechanism for all of them. Saying that is a better answer than defining the syntax.",
    code: [
      { lang: "DAX", label: "Replace the filter", code: "Red Revenue = CALCULATE( [Revenue], Product[Colour] = \"Red\" )" },
      { lang: "DAX", label: "Intersect with the existing filter", code: "Red Revenue = CALCULATE( [Revenue], KEEPFILTERS( Product[Colour] = \"Red\" ) )" },
      { lang: "DAX", label: "Remove filters entirely", code: "Total All Products = CALCULATE( [Revenue], REMOVEFILTERS( Product ) )" },
    ],
    mistakes: [
      "Assuming filter arguments intersect with the existing context.",
      "Using FILTER(ALL(Table), ...) where a column predicate would do.",
      "Not knowing CALCULATE causes context transition.",
    ],
    followUps: [
      "What does KEEPFILTERS change?",
      "In a visual filtered to Blue, what does CALCULATE([Revenue], Colour=\"Red\") return?",
    ],
    tags: ["CALCULATE", "filter context", "KEEPFILTERS", "context transition"],
    related: ["pbi-c-calculate", "pbi-q-all-allexcept-allselected", "pbi-q-row-vs-filter-context"],
    sources: [GFG_PBI, GH_AWESOME],
  }),
  q({
    id: "pbi-q-all-allexcept-allselected",
    category: "DAX Context",
    title: "ALL vs ALLEXCEPT vs ALLSELECTED",
    difficulty: "Hard",
    q: "What is the difference between ALL, ALLEXCEPT and ALLSELECTED in DAX?",
    hint: "They all remove filters. The difference is which ones, and ALLSELECTED is the subtle one.",
    answer:
      "ALL removes filters — from a whole table, or from named columns. ALLEXCEPT removes every filter on a table except the columns you list, which is the concise way to say \"keep the category, drop everything else\". ALLSELECTED is the subtle one: it removes filters coming from the visual itself while preserving filters the user applied through slicers and page filters, which is exactly what \"percentage of the visible total\" requires.",
    detail:
      "**The three, concretely**\n\nA matrix of Category by Revenue, with a slicer restricting to 2025:\n\n| Denominator | Returns |\n|---|---|\n| `CALCULATE([Rev], ALL(Product))` | every year, every category — the absolute grand total |\n| `CALCULATE([Rev], ALL(Product[Category]))` | all categories, still only 2025 |\n| `CALCULATE([Rev], ALLSELECTED())` | the total of what the user can currently see |\n\nThat table is the answer. If you can state it, you have answered the question completely.\n\n**ALLEXCEPT**\n\n```\nCALCULATE( [Revenue], ALLEXCEPT( Product, Product[Category] ) )\n```\n\nequals \"remove every filter on Product except Category\". It is shorthand for listing every other column in an ALL, and it has the advantage of automatically covering columns added to the table later.\n\n**REMOVEFILTERS**\n\nA newer, clearer alias for `ALL` when used as a CALCULATE modifier. `ALL` is doing double duty as both a table function and a filter modifier, which is confusing; `REMOVEFILTERS` names the intent. Prefer it in new code and say so.\n\n**Which to use for percent-of-total**\n\nAlmost always `ALLSELECTED`. A reader who has filtered to one region expects the percentages in front of them to add to 100%. Using `ALL` gives percentages of a total they cannot see, which reads as a bug.\n\n**The gotcha**\n\n`ALLSELECTED` has genuinely intricate semantics with nested contexts and is the function most likely to produce a result you did not expect in a complex measure. Being honest that you would test it in the actual visual rather than reason it out abstractly is a reasonable and mature thing to say.",
    code: [
      { lang: "DAX", label: "% of grand total", code: "% of All = DIVIDE( [Revenue], CALCULATE( [Revenue], REMOVEFILTERS() ) )" },
      { lang: "DAX", label: "% of what the user selected — usually what you want", code: "% of Visible = DIVIDE( [Revenue], CALCULATE( [Revenue], ALLSELECTED() ) )" },
      { lang: "DAX", label: "Keep only the category filter", code: "Category Total = CALCULATE( [Revenue], ALLEXCEPT( Product, Product[Category] ) )" },
    ],
    mistakes: [
      "Using ALL for percent-of-total, so percentages do not add to 100% under a slicer.",
      "Confusing ALLEXCEPT's argument order — the table first, then the columns to KEEP.",
      "Assuming ALLSELECTED and ALL are interchangeable.",
    ],
    followUps: [
      "Which would you use so the percentages add up to 100% for the reader?",
      "What does ALLEXCEPT keep?",
    ],
    tags: ["ALL", "ALLEXCEPT", "ALLSELECTED", "REMOVEFILTERS", "percent of total"],
    related: ["pbi-c-calculate", "pbi-q-calculate", "pbi-q-percent-of-total"],
    sources: [GFG_PBI, GH_AWESOME],
  }),
  q({
    id: "pbi-q-iterator-functions",
    category: "DAX",
    title: "What are iterator (X) functions?",
    difficulty: "Medium",
    q: "What are Iterator (X) functions in DAX, and when do you need them?",
    hint: "They create row context. Give the case where the non-X version gives the wrong answer.",
    answer:
      "Iterator functions — SUMX, AVERAGEX, COUNTX, MAXX, MINX, RANKX — take a table and an expression, evaluate the expression once per row under row context, then aggregate the results. You need them whenever the calculation must happen at row level before aggregation. The canonical case is revenue from quantity and price: SUM(Qty) * SUM(Price) multiplies two grand totals and is meaningless, while SUMX(Sales, Qty * Price) multiplies per line and then sums.",
    detail:
      "**The family**\n\n| Function | Does |\n|---|---|\n| `SUMX(table, expr)` | evaluate per row, sum |\n| `AVERAGEX` | evaluate per row, average |\n| `COUNTX` | count non-blank results |\n| `MAXX` / `MINX` | largest / smallest result |\n| `RANKX` | rank each row against the others |\n| `CONCATENATEX` | join text results, with a separator |\n\n**The defining example**\n\n```\nSUM(Sales[Qty]) * SUM(Sales[Price])   -- wrong\nSUMX(Sales, Sales[Qty] * Sales[Price])  -- right\n```\n\nThe first computes total quantity times total price, a number with no meaning. The second computes each line's revenue and sums. If you can only remember one thing about iterators, remember this.\n\n**Where AVERAGEX is the only correct option**\n\n\"Average revenue per customer\" is not `AVERAGE` of anything in the fact table:\n\n```\nAVERAGEX( VALUES(Customer[CustomerID]), [Total Revenue] )\n```\n\nThis iterates customers and evaluates the measure per customer via context transition. Doing it any other way gives the average line value, not the average customer value.\n\n**CONCATENATEX for dynamic titles**\n\n```\n\"Regions: \" & CONCATENATEX( VALUES(Region[Name]), Region[Name], \", \" )\n```\n\nA useful and slightly unexpected use — building a title that states the current selection.\n\n**Performance**\n\nIterators over large tables are expensive, and referencing a *measure* inside one triggers context transition per row, which multiplies the cost. Where a set-based alternative exists, prefer it. Where it does not — as with average per customer — the iterator is correct and the cost is the price of the right answer.",
    code: [
      { lang: "DAX", label: "Row-level product", code: "Revenue = SUMX( Sales, Sales[Quantity] * Sales[UnitPrice] )" },
      { lang: "DAX", label: "Average per customer", code: "Avg Revenue per Customer =\nAVERAGEX( VALUES( Customer[CustomerID] ), [Total Revenue] )" },
      { lang: "DAX", label: "Dynamic title listing the selection", code: "Title = \"Regions: \" & CONCATENATEX( VALUES(Region[Name]), Region[Name], \", \" )" },
    ],
    mistakes: [
      "Using SUM where the calculation must happen per row first.",
      "Using AVERAGE on the fact table for a per-customer average.",
      "Iterating a huge fact table when a set-based expression would work.",
    ],
    followUps: [
      "How would you compute average revenue per customer?",
      "Why is SUM(Qty)*SUM(Price) wrong?",
    ],
    tags: ["SUMX", "AVERAGEX", "RANKX", "iterator", "row context"],
    related: ["pbi-c-evaluation-context", "pbi-q-row-vs-filter-context", "pbi-q-rankx"],
    sources: [GFG_PBI, GH_AWESOME],
  }),
  q({
    id: "pbi-q-common-dax-functions",
    category: "DAX",
    title: "What are the most common DAX functions?",
    difficulty: "Easy",
    q: "What are the most common DAX functions used, and what are the DAX aggregate functions?",
    hint: "Group them by purpose rather than listing them alphabetically.",
    answer:
      "Grouped by purpose: aggregations (SUM, AVERAGE, MIN, MAX, COUNT, COUNTA, COUNTROWS, DISTINCTCOUNT); iterators (SUMX, AVERAGEX, COUNTX, RANKX); filter and context (CALCULATE, FILTER, ALL, ALLEXCEPT, ALLSELECTED, REMOVEFILTERS, VALUES, DISTINCT); relationships (RELATED, RELATEDTABLE, USERELATIONSHIP, LOOKUPVALUE); logical (IF, SWITCH, AND, OR); time intelligence (TOTALYTD, SAMEPERIODLASTYEAR, DATEADD, DATESINPERIOD); and utility (DIVIDE, BLANK, ISBLANK, FORMAT).",
    detail:
      "**By purpose**\n\n| Group | Functions |\n|---|---|\n| Aggregate | SUM, AVERAGE, MIN, MAX, COUNT, COUNTA, COUNTROWS, DISTINCTCOUNT |\n| Iterator | SUMX, AVERAGEX, COUNTX, MAXX, MINX, RANKX, CONCATENATEX |\n| Filter / context | CALCULATE, FILTER, ALL, ALLEXCEPT, ALLSELECTED, REMOVEFILTERS, KEEPFILTERS, VALUES, DISTINCT |\n| Relationship | RELATED, RELATEDTABLE, USERELATIONSHIP, CROSSFILTER, LOOKUPVALUE |\n| Logical | IF, SWITCH, AND, OR, NOT, COALESCE |\n| Time intelligence | TOTALYTD, SAMEPERIODLASTYEAR, DATEADD, DATESINPERIOD, PARALLELPERIOD |\n| Utility | DIVIDE, BLANK, ISBLANK, FORMAT, SELECTEDVALUE |\n\n**Distinctions worth being ready for**\n\n- **COUNT vs COUNTA vs COUNTROWS** — COUNT counts numeric values in a column, COUNTA counts non-blank values of any type, COUNTROWS counts rows of a table. COUNTROWS is usually what you want and is generally the fastest.\n- **COUNTROWS vs DISTINCTCOUNT** — rows versus distinct values of a column. `COUNTROWS(Sales)` is the number of transactions; `DISTINCTCOUNT(Sales[CustomerID])` is the number of customers.\n- **RELATED vs RELATEDTABLE** — RELATED fetches a single value from the *one* side of a relationship, usable in a row context on the many side. RELATEDTABLE returns the related rows from the many side. Direction is everything.\n- **SWITCH vs nested IF** — SWITCH is far more readable past two branches, and `SWITCH(TRUE(), cond1, res1, cond2, res2, default)` is the idiom for arbitrary conditions.\n- **SELECTEDVALUE** — returns the single selected value of a column, or a fallback when zero or several are selected. It is the clean modern replacement for `IF(HASONEVALUE(...), VALUES(...))`.\n\n**How to answer well**\n\nDo not recite the whole list. Give the groups, then pick two or three distinctions — COUNT family, RELATED versus RELATEDTABLE, SWITCH over nested IF — and explain those properly. Depth on a few beats breadth on all.",
    code: [
      { lang: "DAX", label: "SWITCH(TRUE()) — the readable multi-condition idiom", code: "Band =\nSWITCH( TRUE(),\n    [Revenue] > 1000000, \"Large\",\n    [Revenue] > 100000,  \"Mid\",\n    \"Small\"\n)" },
      { lang: "DAX", label: "SELECTEDVALUE with a fallback", code: "Selected Year = SELECTEDVALUE( 'Date'[Year], \"All years\" )" },
    ],
    mistakes: [
      "Listing functions with no grouping or distinctions.",
      "Confusing RELATED with RELATEDTABLE.",
      "Using COUNT where COUNTROWS or DISTINCTCOUNT was meant.",
    ],
    followUps: [
      "What is the difference between COUNTROWS and DISTINCTCOUNT?",
      "When would you use RELATEDTABLE rather than RELATED?",
    ],
    tags: ["DAX functions", "aggregate", "COUNTROWS", "DISTINCTCOUNT", "SWITCH", "RELATED"],
    related: ["pbi-c-dax-intro", "pbi-q-countrows-distinctcount", "pbi-q-iterator-functions"],
    sources: [GFG_PBI],
  }),
  q({
    id: "pbi-q-countrows-distinctcount",
    category: "DAX",
    title: "COUNTROWS vs DISTINCTCOUNT",
    difficulty: "Easy",
    q: "What is the difference between COUNTROWS and DISTINCTCOUNT in DAX?",
    hint: "Rows of a table versus distinct values of a column. The business meanings differ completely.",
    answer:
      "COUNTROWS takes a table and returns how many rows it has. DISTINCTCOUNT takes a column and returns how many distinct values it contains. On a sales table, COUNTROWS(Sales) is the number of transactions while DISTINCTCOUNT(Sales[CustomerID]) is the number of unique customers — two very different business numbers that people conflate.",
    detail:
      "**The business framing**\n\n| Measure | Answers |\n|---|---|\n| `COUNTROWS(Sales)` | how many orders? |\n| `DISTINCTCOUNT(Sales[CustomerID])` | how many customers bought? |\n| `DISTINCTCOUNT(Sales[ProductID])` | how many products sold at least once? |\n| `COUNTROWS(Customer)` | how many customers exist? |\n\nThe last two rows are the interesting pair: customers who bought versus customers who exist. The gap between them is your inactive base, and asking which one the stakeholder means is a good instinct to display.\n\n**Blanks**\n\nDISTINCTCOUNT counts BLANK as a distinct value if the column contains one. `DISTINCTCOUNTNOBLANK` excludes it. On a column with unmatched foreign keys that difference is real.\n\n**Performance**\n\nDISTINCTCOUNT is one of the more expensive DAX operations, because the engine cannot simply add partial results — distinct counts do not aggregate. A distinct count over a high-cardinality column in a large model is a common cause of a slow visual, and it is worth naming as a performance suspect.\n\n**Non-additivity**\n\nRelated and worth volunteering: distinct counts do not sum across categories. The distinct customers for East plus the distinct customers for West is *more* than the distinct customers overall, because customers who bought in both are counted twice. A grand total row will therefore not equal the sum of the rows above it — which looks like a bug to stakeholders and is not. Being able to explain that clearly is genuinely useful on the job.\n\n**COUNT and COUNTA**\n\nFor completeness: COUNT counts numeric values in a column, COUNTA counts non-blank values of any type. COUNTROWS is usually preferred over both for counting records, and is typically faster.",
    code: [
      { lang: "DAX", label: "Transactions", code: "Orders = COUNTROWS( Sales )" },
      { lang: "DAX", label: "Distinct customers who bought", code: "Buying Customers = DISTINCTCOUNT( Sales[CustomerID] )" },
    ],
    mistakes: [
      "Reporting transactions when the stakeholder asked for customers.",
      "Expecting a distinct-count grand total to equal the sum of its rows.",
      "Overlooking DISTINCTCOUNT as a performance cost.",
    ],
    followUps: [
      "Why doesn't the distinct-count total equal the sum of the rows?",
      "How would you count customers who exist but never bought?",
    ],
    tags: ["COUNTROWS", "DISTINCTCOUNT", "non-additive", "performance"],
    related: ["pbi-q-common-dax-functions", "pbi-q-distinct-products", "pbi-c-performance"],
    sources: [GFG_PBI],
  }),
  q({
    id: "pbi-q-time-intelligence",
    category: "Time Intelligence",
    title: "What are time intelligence functions?",
    difficulty: "Medium",
    q: "What are Time Intelligence functions in DAX, and what do they require?",
    hint: "Say the prerequisite before the list. It is the thing that makes them fail in practice.",
    answer:
      "Time intelligence functions shift or expand the filter context over dates — year-to-date, same period last year, rolling windows. They all share one prerequisite: a dedicated date table, marked as a date table, with one contiguous row per day covering the full range of the fact data with no gaps. Without that, results are subtly wrong, most visibly because periods with no transactions disappear instead of showing zero. The core set is TOTALYTD, SAMEPERIODLASTYEAR, DATEADD, DATESINPERIOD, PARALLELPERIOD and the PREVIOUS family.",
    detail:
      "**Lead with the prerequisite**\n\nVolunteering the date-table requirement before listing functions is what distinguishes someone who has debugged a broken YTD from someone who has read a function list.\n\n**The functions**\n\n| Function | Returns |\n|---|---|\n| `TOTALYTD(expr, dates, [ye])` | year to date; the third argument sets a fiscal year end |\n| `SAMEPERIODLASTYEAR(dates)` | the equivalent dates one year back |\n| `DATEADD(dates, n, interval)` | any offset — the general form |\n| `PARALLELPERIOD(dates, n, interval)` | the *entire* prior period |\n| `DATESINPERIOD(dates, anchor, n, interval)` | a window from an anchor |\n| `PREVIOUSMONTH` / `PREVIOUSYEAR` | the complete prior period |\n| `DATESYTD` / `DATESMTD` / `DATESQTD` | the date sets, for use inside CALCULATE |\n\n**SAMEPERIODLASTYEAR vs PARALLELPERIOD**\n\nThe distinction that gets asked. Viewing March: `SAMEPERIODLASTYEAR` returns last March. `PARALLELPERIOD(..., -1, YEAR)` returns the whole of last year. One is a like-for-like slice, the other is the entire period — using the wrong one produces a comparison that is off by a factor of twelve.\n\n**Fiscal years**\n\n`TOTALYTD([Revenue], 'Date'[Date], \"31/3\")` sets a 31 March year end. Forgetting this argument in an organisation with a non-calendar fiscal year makes every YTD figure wrong, and it is a very common real-world defect.\n\n**Rolling windows**\n\n`DATESINPERIOD` anchored on `LASTDATE`, not `DATEADD`:\n\n```\nAVERAGEX( DATESINPERIOD('Date'[Date], LASTDATE('Date'[Date]), -3, MONTH), [Revenue] )\n```\n\n**DirectQuery caveat**\n\nMany time-intelligence functions are unavailable or heavily restricted in DirectQuery mode. Worth knowing before you promise a YoY measure on a DirectQuery model.",
    code: [
      { lang: "DAX", label: "Fiscal year to date, 31 March year end", code: "Revenue FYTD = TOTALYTD( [Total Revenue], 'Date'[Date], \"31/3\" )" },
      { lang: "DAX", label: "Rolling 3-month average", code: "Rolling 3M =\nAVERAGEX( DATESINPERIOD('Date'[Date], LASTDATE('Date'[Date]), -3, MONTH), [Total Revenue] )" },
    ],
    mistakes: [
      "Not having a marked date table.",
      "Confusing SAMEPERIODLASTYEAR with PARALLELPERIOD.",
      "Omitting the fiscal year-end argument.",
    ],
    followUps: [
      "Your fiscal year ends in March. What changes?",
      "What is the difference between SAMEPERIODLASTYEAR and PARALLELPERIOD?",
    ],
    tags: ["time intelligence", "TOTALYTD", "SAMEPERIODLASTYEAR", "DATEADD", "fiscal year"],
    related: ["pbi-c-time-intelligence", "pbi-q-date-table", "pbi-q-yoy-growth"],
    sources: [GFG_PBI, GH_AWESOME],
  }),

  // =========================================================== SCENARIO / DAX WRITING
  q({
    id: "pbi-q-yoy-growth",
    category: "Scenario",
    title: "Write a year-over-year growth measure",
    difficulty: "Medium",
    q: "Write a DAX measure for Year-over-Year (YoY) growth in sales. Then do Month-over-Month.",
    hint: "Compute the prior period into a variable first, then divide safely.",
    answer:
      "Compute the prior-year figure with SAMEPERIODLASTYEAR inside CALCULATE, store it in a variable, and divide with DIVIDE so the first year returns blank rather than an error. Month-over-month is the same shape with DATEADD shifted by one month, or PREVIOUSMONTH. Both depend on a marked date table with contiguous dates.",
    detail:
      "**YoY**\n\n```\nRevenue LY =\nCALCULATE( [Total Revenue], SAMEPERIODLASTYEAR( 'Date'[Date] ) )\n\nYoY Growth % =\nVAR Current = [Total Revenue]\nVAR Prior   = [Revenue LY]\nRETURN\n    DIVIDE( Current - Prior, Prior )\n```\n\nSplitting the prior-year figure into its own measure is deliberate: it is reusable, it can be displayed alongside the growth, and it makes the growth measure trivially readable.\n\n**MoM**\n\n```\nRevenue PM =\nCALCULATE( [Total Revenue], DATEADD( 'Date'[Date], -1, MONTH ) )\n\nMoM Growth % =\nDIVIDE( [Total Revenue] - [Revenue PM], [Revenue PM] )\n```\n\n`PREVIOUSMONTH` also works, but `DATEADD` generalises to any offset, so it is the one to reach for by habit.\n\n**Why DIVIDE, specifically**\n\nIn the first year of data there is no prior period, so `Prior` is blank. `Current / Prior` throws; `DIVIDE` returns blank, which renders as an empty cell rather than an error scattered across the visual. You can pass a third argument if you want something other than blank.\n\n**The detail that impresses**\n\nMention that the measure needs a marked date table with complete years, and that the visual should be sorted by a numeric month key rather than the month name. Both are things that go wrong the first time someone builds this.\n\n**Formatting**\n\nSet the measure's format to percentage in the model rather than wrapping it in `FORMAT()`. `FORMAT` returns text, which then will not sort or plot numerically — a small trap that catches people building KPI cards.\n\n**Partial periods**\n\nComparing an incomplete current month against a complete prior month understates growth. A production measure often needs a guard that blanks the current period until it is complete, or compares like-for-like day ranges. Raising that unprompted is a strong finish.",
    code: [
      { lang: "DAX", label: "Prior year", code: "Revenue LY = CALCULATE( [Total Revenue], SAMEPERIODLASTYEAR('Date'[Date]) )" },
      { lang: "DAX", label: "YoY growth %", code: "YoY Growth % =\nVAR Current = [Total Revenue]\nVAR Prior   = [Revenue LY]\nRETURN DIVIDE( Current - Prior, Prior )" },
      { lang: "DAX", label: "MoM growth %", code: "MoM Growth % =\nVAR Prior = CALCULATE( [Total Revenue], DATEADD('Date'[Date], -1, MONTH) )\nRETURN DIVIDE( [Total Revenue] - Prior, Prior )" },
    ],
    mistakes: [
      "Using `/` and producing errors in the first period.",
      "Wrapping the result in FORMAT, making it text that will not sort.",
      "Comparing an incomplete current period against a complete prior one.",
    ],
    followUps: [
      "What happens in the first year of data?",
      "How would you stop an incomplete month from looking like a collapse?",
    ],
    tags: ["YoY", "MoM", "DAX", "time intelligence", "DIVIDE", "scenario"],
    related: ["pbi-c-time-intelligence", "pbi-q-time-intelligence", "pbi-q-date-table"],
    sources: [GFG_PBI, GH_HUB],
  }),
  q({
    id: "pbi-q-percent-of-total",
    category: "Scenario",
    title: "Percentage of total sales by region",
    difficulty: "Medium",
    q: "Write a DAX measure for percentage of total sales by region.",
    hint: "The numerator is easy. The whole question is which denominator you choose.",
    answer:
      "DIVIDE([Total Revenue], CALCULATE([Total Revenue], ALLSELECTED(Region))). The numerator is the revenue in the current cell's filter context; the denominator removes the region filter so it becomes the total across regions. ALLSELECTED rather than ALL is usually correct, because it respects the user's slicer selections — so the percentages the reader can see actually add up to 100%.",
    detail:
      "**The three possible denominators**\n\n```\nCALCULATE([Revenue], ALL(Region))          -- every region, ignoring slicers\nCALCULATE([Revenue], ALLSELECTED(Region))  -- regions visible after slicers\nCALCULATE([Revenue], REMOVEFILTERS())      -- absolutely everything\n```\n\nWhich is right depends entirely on what the reader expects. If they have filtered to Asia-Pacific and the percentages sum to 34%, they will report it as a bug — so `ALLSELECTED` is the usual answer.\n\n**Why the numerator needs nothing special**\n\nIn a matrix row for \"East\", `[Total Revenue]` is already filtered to East by the visual's filter context. You do not write anything to make that happen — that is the whole point of measures. Candidates sometimes try to add a region filter to the numerator, which is redundant and reveals a shaky grasp of filter context.\n\n**Formatting**\n\nSet the measure format to Percentage in the model. Do not use `FORMAT()` — it returns text, which then will not sort, will not plot, and will not participate in conditional formatting.\n\n**The alternative with no DAX at all**\n\nIn a matrix visual, the value's dropdown offers *Show value as → Percent of grand total / column total / row total*. For simple cases that is the right answer and worth saying, because reaching for DAX when the UI already does it is a small design smell.\n\n**Extending it**\n\nPercent of parent for a hierarchy uses `ALLSELECTED` on the child column while keeping the parent filter — `ALLEXCEPT` is often the cleanest expression of that. Nested percentages are where this question usually goes next.",
    code: [
      { lang: "DAX", label: "% of visible total — usually correct", code: "% of Total =\nDIVIDE( [Total Revenue], CALCULATE( [Total Revenue], ALLSELECTED( Region ) ) )" },
      { lang: "DAX", label: "% of the absolute grand total", code: "% of All = DIVIDE( [Total Revenue], CALCULATE( [Total Revenue], REMOVEFILTERS() ) )" },
    ],
    mistakes: [
      "Using ALL, so the visible percentages do not sum to 100%.",
      "Adding a redundant region filter to the numerator.",
      "Using FORMAT instead of setting the measure's format string.",
    ],
    followUps: [
      "The user filters to two regions. What should the percentages add up to?",
      "Could you do this without DAX at all?",
    ],
    tags: ["percent of total", "ALLSELECTED", "CALCULATE", "DAX", "scenario"],
    related: ["pbi-c-calculate", "pbi-q-all-allexcept-allselected", "pbi-q-calculate"],
    sources: [GFG_PBI, GH_HUB],
  }),
  q({
    id: "pbi-q-rankx",
    category: "Scenario",
    title: "Rank products by sales, and find the top N",
    difficulty: "Hard",
    q: "How do you rank products by sales using RANKX, and how would you show the top 5 products?",
    hint: "RANKX needs a table to rank against, and getting that table right is the whole problem.",
    answer:
      "RANKX(ALL(Product[Product]), [Total Revenue], , DESC, Dense) ranks each product against all products by revenue. The critical argument is the first one: it must be the full set you want to rank within, wrapped in ALL or ALLSELECTED, because otherwise each row is ranked against a table containing only itself and every product ranks 1. For a top 5, either use the visual's Top N filter, or filter on the rank measure being less than or equal to 5.",
    detail:
      "**Why the first argument is the whole question**\n\n```\nRANKX( Product, [Total Revenue] )        -- wrong: row context restricts the table\nRANKX( ALL(Product[Product]), [Revenue] ) -- right\n```\n\nInside a matrix row for \"Bike\", the filter context already restricts Product to Bike. Ranking against that gives 1 for everything. `ALL` lifts the filter so each product is ranked against the whole list. This is the single most common RANKX mistake and the reason the question is asked.\n\n**ALL vs ALLSELECTED again**\n\n`ALL` ranks against every product regardless of slicers; `ALLSELECTED` ranks within the user's current selection. Same trade-off as percent-of-total, and the same usual answer.\n\n**Ties**\n\nThe fifth argument controls tie handling:\n\n| Value | Behaviour |\n|---|---|\n| `Skip` (default) | 1, 2, 2, 4 — ranks are skipped after a tie |\n| `Dense` | 1, 2, 2, 3 — no gaps |\n\nWhich you want depends on the business meaning. Mentioning that ties need a decision is a good sign.\n\n**Top 5 — three routes**\n\n1. **Visual-level Top N filter** — simplest, no DAX. Filter pane → Top N → 5 by Total Revenue.\n2. **TOPN in a measure** — when you need the top 5's total rather than a list:\n   ```\n   Top 5 Revenue = SUMX( TOPN(5, ALL(Product[Product]), [Total Revenue], DESC), [Total Revenue] )\n   ```\n3. **Filter on the rank measure** — a visual filter of `Rank <= 5`, which lets the ranking respond to slicers.\n\n**Second highest**\n\nA related question that comes up constantly:\n\n```\nSecond Highest = MAXX( TOPN(2, ALL(Product[Product]), [Total Revenue], DESC), [Total Revenue] )\n```\n\nTOPN returns the top 2, and MAXX over... actually you want the minimum of those two, so `MINX` — worth reasoning through out loud rather than reciting, because the interviewer is watching you handle exactly this kind of off-by-one.\n\n**Performance**\n\nRANKX over a high-cardinality column is expensive, because it evaluates the measure once per item in the ranked table. On a large product catalogue this is a genuine cost.",
    code: [
      { lang: "DAX", label: "Rank against all products", code: "Product Rank =\nRANKX( ALL( Product[Product] ), [Total Revenue], , DESC, Dense )" },
      { lang: "DAX", label: "Total of the top 5", code: "Top 5 Revenue =\nSUMX( TOPN( 5, ALL(Product[Product]), [Total Revenue], DESC ), [Total Revenue] )" },
      { lang: "DAX", label: "Second highest value", code: "Second Highest =\nMINX( TOPN( 2, ALL(Product[Product]), [Total Revenue], DESC ), [Total Revenue] )" },
    ],
    mistakes: [
      "Passing the table without ALL, so everything ranks 1.",
      "Not deciding how ties should behave.",
      "Using RANKX where the visual's Top N filter would have been enough.",
    ],
    followUps: [
      "Why does every product rank 1 in your first attempt?",
      "How would you find the second-highest sales value?",
    ],
    tags: ["RANKX", "TOPN", "ranking", "DAX", "scenario"],
    related: ["pbi-q-iterator-functions", "pbi-q-all-allexcept-allselected", "pbi-q-second-highest"],
    sources: [GFG_PBI, GH_HUB],
  }),
  q({
    id: "pbi-q-second-highest",
    category: "Scenario",
    title: "Find the second-highest sales value",
    difficulty: "Hard",
    q: "How would you find the second-highest sales value using DAX?",
    hint: "Take the top two, then take the smaller of them.",
    answer:
      "Take the top two with TOPN and then take the minimum of that pair: MINX(TOPN(2, ALL(Product[Product]), [Total Revenue], DESC), [Total Revenue]). TOPN returns the two highest, and MINX over those two returns the lower one — which is the second highest. The subtlety is ties: if two products share the highest value, TOPN(2) returns both and this formula returns the highest value twice over, so you would need distinct values rather than distinct products if ties matter.",
    detail:
      "**Reasoning it through**\n\nThe instinct is to reach for a rank and filter to rank = 2. That works but is fragile with ties and is more code. The TOPN + MINX construction is two functions and reads directly as \"of the top two, the smaller\".\n\n**Handling ties properly**\n\nIf the requirement is the second-highest *value* rather than the second-ranked *product*, operate on distinct values:\n\n```\nSecond Highest Value =\nVAR Ranked = TOPN( 2, DISTINCT( SELECTCOLUMNS( ALL(Product[Product]), \"v\", [Total Revenue] ) ), [v], DESC )\nRETURN MINX( Ranked, [v] )\n```\n\nMessier, and worth saying out loud that you would clarify with the interviewer which of the two they mean before writing it. \"Second highest value\" and \"the runner-up product\" are different questions and the difference only shows up when there is a tie.\n\n**The RANKX alternative**\n\n```\nSecond by Rank =\nCALCULATE( [Total Revenue],\n    FILTER( ALL(Product[Product]), [Product Rank] = 2 ) )\n```\n\nThis needs the rank measure to exist and inherits whatever tie behaviour it uses. It generalises better to \"nth highest\" though, so it is the better answer if the interviewer follows up with \"now make n a parameter\".\n\n**Nth highest, parameterised**\n\nWith a What-if parameter feeding `N`:\n\n```\nNth Highest =\nMINX( TOPN( SELECTEDVALUE(N[N]), ALL(Product[Product]), [Total Revenue], DESC ), [Total Revenue] )\n```\n\n**Excel and SQL parallels**\n\nWorth a sentence if it comes up: Excel's `LARGE(range, 2)` and SQL's `DENSE_RANK() = 2` solve the same problem. Being able to move between the three shows the concept rather than the syntax.",
    code: [
      { lang: "DAX", label: "Second highest", code: "Second Highest =\nMINX( TOPN( 2, ALL(Product[Product]), [Total Revenue], DESC ), [Total Revenue] )" },
      { lang: "DAX", label: "Nth highest, driven by a parameter", code: "Nth Highest =\nMINX(\n    TOPN( SELECTEDVALUE(N[N]), ALL(Product[Product]), [Total Revenue], DESC ),\n    [Total Revenue]\n)" },
    ],
    mistakes: [
      "Not asking whether ties matter.",
      "Using MAXX instead of MINX over the top two.",
      "Forgetting ALL, so TOPN operates on a single-row table.",
    ],
    followUps: [
      "What happens if two products tie for first?",
      "Now make it the nth highest, where n is chosen by the user.",
    ],
    tags: ["TOPN", "MINX", "second highest", "ranking", "scenario"],
    related: ["pbi-q-rankx", "pbi-q-iterator-functions", "tb-q-second-highest"],
    sources: [GFG_PBI],
  }),
  q({
    id: "pbi-q-average-of-averages",
    category: "Scenario",
    title: "Average sales per customer",
    difficulty: "Medium",
    q: "Write a measure for average sales per customer. Why is AVERAGE on the fact table wrong?",
    hint: "You need to iterate customers, not transactions.",
    answer:
      "AVERAGEX(VALUES(Customer[CustomerID]), [Total Revenue]). AVERAGE over the sales column is wrong because it gives the average transaction value, not the average customer value — a customer with twenty small orders and one with a single large order are weighted completely differently. AVERAGEX iterates the distinct customers and evaluates the revenue measure per customer through context transition, which is the number actually being asked for.",
    detail:
      "**Why the naive version is wrong**\n\n```\nAVERAGE( Sales[Amount] )      -- average per LINE, not per customer\nDIVIDE( [Revenue], COUNTROWS(Sales) )  -- same thing\nAVERAGEX( VALUES(Customer[CustomerID]), [Total Revenue] )  -- average per CUSTOMER\n```\n\nWith 100 customers and 1,000 transactions, the first two divide by 1,000 and the third divides by 100. They are different questions and both have legitimate uses — average order value versus average customer value — so the real skill is asking which one the stakeholder means.\n\n**The simpler equivalent**\n\n```\nDIVIDE( [Total Revenue], DISTINCTCOUNT(Sales[CustomerID]) )\n```\n\nThis gives the same answer more cheaply, because it avoids iterating. It is worth offering both and noting the trade-off: `AVERAGEX` generalises to any per-customer expression, while `DIVIDE` by a distinct count is faster but only works for a simple ratio.\n\n**VALUES vs DISTINCT vs ALL**\n\n`VALUES(Customer[CustomerID])` returns the customers visible in the current filter context, which is what you want — the average should respect slicers. `ALL` would ignore them. `VALUES` also returns a blank row if the fact table has unmatched keys, which can quietly skew the denominator.\n\n**Which customers count**\n\nA real subtlety: should customers who bought nothing this period be in the denominator? `VALUES(Customer[CustomerID])` on the *fact* side gives only buyers; iterating the Customer *dimension* includes everyone. Those produce very different numbers and the right one depends on whether the question is \"average spend per buyer\" or \"average spend per customer on file\". Raising that distinction is the strongest thing you can do with this question.\n\n**The general principle**\n\nThis is the same rule as never averaging a ratio: recompute from the correct numerator and denominator rather than averaging pre-computed values.",
    code: [
      { lang: "DAX", label: "Average per customer", code: "Avg Revenue per Customer =\nAVERAGEX( VALUES( Customer[CustomerID] ), [Total Revenue] )" },
      { lang: "DAX", label: "Cheaper equivalent", code: "Avg Revenue per Customer =\nDIVIDE( [Total Revenue], DISTINCTCOUNT( Sales[CustomerID] ) )" },
      { lang: "DAX", label: "Average order value — a different question", code: "Avg Order Value = DIVIDE( [Total Revenue], COUNTROWS(Sales) )" },
    ],
    mistakes: [
      "Using AVERAGE on the fact table and reporting it as per-customer.",
      "Not clarifying whether non-buyers belong in the denominator.",
      "Using ALL instead of VALUES, so the measure ignores slicers.",
    ],
    followUps: [
      "Should customers who bought nothing be in the denominator?",
      "What is the difference between this and average order value?",
    ],
    tags: ["AVERAGEX", "VALUES", "DISTINCTCOUNT", "per customer", "scenario"],
    related: ["pbi-q-iterator-functions", "pbi-q-countrows-distinctcount", "xl-q-weighted-average"],
    sources: [GFG_PBI, GH_HUB],
  }),
  q({
    id: "pbi-q-distinct-products",
    category: "Scenario",
    title: "Distinct products sold and employees joined after a date",
    difficulty: "Easy",
    q: "Write measures for (a) the distinct number of products sold and (b) the number of employees who joined after 2020.",
    hint: "One is a distinct count; the other is a filtered row count. Watch the difference between products sold and products listed.",
    answer:
      "Distinct products sold is DISTINCTCOUNT(Sales[ProductID]) — counted on the fact table, so it means products that actually sold rather than products in the catalogue. Employees joined after 2020 is CALCULATE(COUNTROWS(Employee), Employee[JoinDate] >= DATE(2021,1,1)), using COUNTROWS over the dimension with a filter argument rather than counting a column.",
    detail:
      "**(a) The fact-versus-dimension distinction**\n\n```\nDISTINCTCOUNT( Sales[ProductID] )    -- products that sold\nCOUNTROWS( Product )                 -- products in the catalogue\n```\n\nThese answer different questions, and the gap between them — products that have never sold — is often the more interesting number. Clarifying which is meant before writing is the right instinct.\n\n**(b) Boundary care**\n\n\"After 2020\" is ambiguous: does it include 2020 itself? Written as `>= DATE(2021,1,1)` it excludes 2020; written as `> DATE(2020,1,1)` it includes most of 2020. State your reading, because off-by-one on a date boundary is exactly the kind of thing that produces a wrong number nobody notices.\n\n```\nJoiners After 2020 =\nCALCULATE( COUNTROWS( Employee ), Employee[JoinDate] >= DATE(2021,1,1) )\n```\n\n**Why COUNTROWS rather than COUNT**\n\n`COUNT(Employee[EmployeeID])` works but counts non-blank values of a column; `COUNTROWS` counts rows of a table and is both clearer and typically faster.\n\n**Using the date dimension instead**\n\nIf a date table exists and is related to `JoinDate`, the cleaner form is:\n\n```\nCALCULATE( COUNTROWS(Employee), 'Date'[Year] > 2020 )\n```\n\nThis is more readable and lets the same filter interact properly with a year slicer. Preferring the dimension over a raw date comparison is a small modelling-discipline signal.\n\n**A likely follow-up**\n\n\"Now make it dynamic — employees who joined after the year selected in a slicer.\" That needs `SELECTEDVALUE` on the slicer column rather than a hardcoded date, which is a natural next step to be ready for.",
    code: [
      { lang: "DAX", label: "Distinct products actually sold", code: "Products Sold = DISTINCTCOUNT( Sales[ProductID] )" },
      { lang: "DAX", label: "Employees joined after 2020", code: "Joiners After 2020 =\nCALCULATE( COUNTROWS( Employee ), Employee[JoinDate] >= DATE(2021,1,1) )" },
      { lang: "DAX", label: "Products never sold", code: "Never Sold = COUNTROWS( Product ) - DISTINCTCOUNT( Sales[ProductID] )" },
    ],
    mistakes: [
      "Counting the product dimension when the question meant products sold.",
      "Being vague about whether 2020 itself is included.",
      "Using COUNT on a column where COUNTROWS is clearer.",
    ],
    followUps: [
      "How many products have never sold?",
      "Make the year come from a slicer instead of being hardcoded.",
    ],
    tags: ["DISTINCTCOUNT", "COUNTROWS", "CALCULATE", "scenario"],
    related: ["pbi-q-countrows-distinctcount", "pbi-q-calculate"],
    sources: [GFG_PBI],
  }),
  q({
    id: "pbi-q-cumulative",
    category: "Scenario",
    title: "Cumulative (running total) sales over the year",
    difficulty: "Medium",
    q: "How would you show a trend of cumulative sales over the year?",
    hint: "Sum over all dates less than or equal to the last date visible in the current cell.",
    answer:
      "Use CALCULATE with a date filter that keeps every date up to the maximum date in the current context: CALCULATE([Total Revenue], FILTER(ALL('Date'[Date]), 'Date'[Date] <= MAX('Date'[Date]))). ALL removes the visual's date filter so earlier dates are visible, and MAX captures the last date of the current cell before that removal takes effect. For a year-to-date reset, TOTALYTD does the same thing more concisely.",
    detail:
      "**The measure**\n\n```\nCumulative Revenue =\nVAR LastDateInContext = MAX( 'Date'[Date] )\nRETURN\n    CALCULATE(\n        [Total Revenue],\n        FILTER( ALL('Date'[Date]), 'Date'[Date] <= LastDateInContext )\n    )\n```\n\nCapturing `MAX` into a variable *before* the CALCULATE is what makes this work: the variable is evaluated in the visual's own context, so it holds the current month's end date, and then `ALL` inside CALCULATE lifts the date filter so earlier months become visible again.\n\n**Running total vs year-to-date**\n\n| Requirement | Measure |\n|---|---|\n| Never resets, accumulates across years | the FILTER/ALL construction above |\n| Resets each January | `TOTALYTD([Total Revenue], 'Date'[Date])` |\n\nAsking which one is meant is a good clarifying question — \"cumulative\" is genuinely ambiguous.\n\n**Why not the visual's built-in running total?**\n\nPower BI offers a Running Total quick measure and some visuals have a running-total option. Those are fine for simple cases. The DAX version is needed when the accumulation must respect a custom filter, reset on a non-calendar boundary, or be reused by other measures.\n\n**The blank-months problem**\n\nWith `ALL('Date'[Date])`, months with no sales still appear with the carried-forward cumulative value, which is usually what you want in a running total — the line stays flat rather than dropping to zero. Using the fact table's dates instead of a date dimension would make those months vanish, which is another reason the date table matters.\n\n**Performance**\n\n`FILTER(ALL('Date'[Date]), ...)` iterates the date table, which is small, so this is generally cheap. The same pattern over a large fact table would not be.",
    code: [
      { lang: "DAX", label: "Cumulative, never resets", code: "Cumulative Revenue =\nVAR LastDate = MAX( 'Date'[Date] )\nRETURN\n    CALCULATE(\n        [Total Revenue],\n        FILTER( ALL('Date'[Date]), 'Date'[Date] <= LastDate )\n    )" },
      { lang: "DAX", label: "Year-to-date, resets each January", code: "Revenue YTD = TOTALYTD( [Total Revenue], 'Date'[Date] )" },
    ],
    mistakes: [
      "Computing MAX inside the CALCULATE, after ALL has already removed the filter.",
      "Not clarifying whether it should reset annually.",
      "Using the fact table's dates, so empty periods disappear from the line.",
    ],
    followUps: [
      "Should this reset each year?",
      "Why does MAX have to be captured before the CALCULATE?",
    ],
    tags: ["cumulative", "running total", "TOTALYTD", "CALCULATE", "scenario"],
    related: ["pbi-c-time-intelligence", "pbi-q-time-intelligence", "pbi-q-yoy-growth"],
    sources: [GFG_PBI],
  }),
  q({
    id: "pbi-q-dynamic-title",
    category: "Scenario",
    title: "Create a dynamic report title",
    difficulty: "Medium",
    q: "How do you create a dynamic title for a report page that changes based on the selected year?",
    hint: "A measure returning text, bound to the title through conditional formatting.",
    answer:
      "Write a measure that returns the title as text, using SELECTEDVALUE to read the slicer with a fallback for when nothing or several things are selected. Then select the visual, open Format → Title, click the fx button next to Title text, and bind it to that measure. The title then updates as the reader filters, which matters because a filtered chart with a static title is genuinely misleading.",
    detail:
      "**The measure**\n\n```\nReport Title =\nVAR Yr = SELECTEDVALUE( 'Date'[Year], \"All Years\" )\nRETURN \"Revenue by Region — \" & Yr\n```\n\n`SELECTEDVALUE` returns the single selected value, or the fallback when zero or more than one is selected. That is the clean modern replacement for the older `IF(HASONEVALUE(...), VALUES(...), \"...\")` idiom.\n\n**Handling multiple selections properly**\n\nIf the reader might select several years, listing them is friendlier than a generic fallback:\n\n```\nVAR Years = CONCATENATEX( VALUES('Date'[Year]), 'Date'[Year], \", \" )\nRETURN \"Revenue by Region — \" & Years\n```\n\n**Binding it**\n\nSelect visual → Format pane → Title → the **fx** icon beside Title text → Format style: Field value → pick the measure. The same fx mechanism drives dynamic colours, dynamic subtitles and conditional URLs, so it is worth naming the general capability rather than just this use.\n\n**Why it matters beyond neatness**\n\nA screenshot of a filtered chart with a static title is a reporting hazard — it will be pasted into a deck and read as the whole picture. A title that states the active filter travels with the image. Framing the answer that way, rather than as a formatting trick, is what makes it a good answer.\n\n**Including a figure**\n\n```\n\"Revenue — \" & Yr & \": \" & FORMAT( [Total Revenue], \"#,##0\" )\n```\n\n`FORMAT` is correct here, because the title genuinely is text. That is the one place where FORMAT is not a trap.",
    code: [
      { lang: "DAX", label: "Dynamic title with a fallback", code: "Report Title =\nVAR Yr = SELECTEDVALUE( 'Date'[Year], \"All Years\" )\nRETURN \"Revenue by Region — \" & Yr" },
      { lang: "DAX", label: "Listing a multiple selection", code: "Report Title =\n\"Revenue — \" & CONCATENATEX( VALUES('Date'[Year]), 'Date'[Year], \", \" )" },
    ],
    mistakes: [
      "Using VALUES directly, which errors when several values are selected.",
      "Not handling the no-selection case.",
      "Leaving a static title on a filtered visual.",
    ],
    followUps: [
      "What if the user selects three years?",
      "What else can the fx binding drive?",
    ],
    tags: ["dynamic title", "SELECTEDVALUE", "CONCATENATEX", "conditional formatting", "scenario"],
    related: ["pbi-c-report-design", "pbi-q-common-dax-functions", "xl-q-dynamic-chart"],
    sources: [GFG_PBI],
  }),

  // =========================================================== VISUALIZATION
  q({
    id: "pbi-q-drill-down-vs-through",
    category: "Visualization",
    title: "Drill-down vs drill-through",
    difficulty: "Easy",
    q: "What is the difference between Drill Down and Drill Through in Power BI?",
    hint: "One stays in the visual, one goes to another page.",
    answer:
      "Drill-down moves within a single visual, down a hierarchy — Year to Quarter to Month — while staying on the same chart and the same page. Drill-through navigates to a different report page, carrying the selected context with it, so right-clicking a customer bar lands you on a customer detail page filtered to that customer. Drill-down explores a hierarchy in place; drill-through changes the level of detail by changing pages.",
    detail:
      "**Side by side**\n\n| | Drill-down | Drill-through |\n|---|---|---|\n| Stays on the page | yes | no |\n| Needs a hierarchy | yes | no |\n| Carries filter context | within the visual | to the target page |\n| Set up by | adding fields to the axis | adding fields to the target page's Drill-through well |\n| Triggered by | the drill arrows, or clicking a bar | right-click → Drill through |\n\n**Setting up drill-through**\n\nOn the destination page, drag the field you want to drill by — Customer, say — into the Drill-through well in the Visualizations pane. Power BI adds a back button automatically. That back button matters: without it the reader is stranded on a detail page with no obvious way home.\n\n**Cross-report drill-through**\n\nDrill-through can target a page in a *different* report in the same workspace, provided cross-report drill-through is enabled. That is how you keep a lightweight executive report that hands off to a detailed operational one.\n\n**Why the design point matters**\n\nDrill-through is the answer to \"the stakeholder wants both a clean summary and full detail\". Rather than cramming both onto one page, the summary stays readable and detail is one right-click away. Framing it as a layout solution rather than a feature is the stronger answer.\n\n**Related: expand vs drill down**\n\nIn a matrix, the drill arrows offer *drill down* (replace the level) and *expand all down one level* (show both levels together). Candidates often conflate these, and interviewers who use matrices heavily do notice.",
    mistakes: [
      "Using the two terms interchangeably.",
      "Building a drill-through page and forgetting the back button.",
      "Confusing drill down with expand-all-down-one-level in a matrix.",
    ],
    followUps: [
      "How do you set up a drill-through page?",
      "Can drill-through cross reports?",
    ],
    tags: ["drill down", "drill through", "navigation", "hierarchy"],
    related: ["pbi-c-report-design", "pbi-q-slicer-vs-filter", "pbi-q-bookmarks"],
    sources: [GFG_PBI],
  }),
  q({
    id: "pbi-q-slicer-vs-filter",
    category: "Visualization",
    title: "Slicers vs filters",
    difficulty: "Easy",
    q: "What is the difference between slicers and filters in Power BI, and what are the different ways to filter data?",
    hint: "One is on the canvas for the reader; the other is authored configuration.",
    answer:
      "A slicer is a visual placed on the canvas that the reader interacts with, and its current selection is always visible. The Filters pane is authored configuration applied at visual, page or report level — it is set by the report author and, unless you expose it, invisible to the reader. Beyond those there is also cross-filtering by clicking a visual, drill-through filters, and row-level security, which filters per user regardless of anything on the page.",
    detail:
      "**The filtering mechanisms, in order of visibility**\n\n| Mechanism | Scope | Reader can see it? |\n|---|---|---|\n| Slicer | page (or synced across pages) | yes, always |\n| Visual-level filter | one visual | only in the Filters pane |\n| Page-level filter | one page | only in the Filters pane |\n| Report-level filter | every page | only in the Filters pane |\n| Cross-filter by clicking | other visuals on the page | implicitly |\n| Drill-through filter | the target page | via the applied-filters card |\n| **RLS** | per user, at the data layer | no — invisible by design |\n\n**Why visibility is a correctness issue**\n\nA page-level filter excluding cancelled orders is invisible to a reader who does not open the Filters pane. If they export the visual and present it, nobody knows the exclusion happened. Anything that materially changes what the numbers mean belongs in a slicer or a stated title, not a hidden filter.\n\n**Sync slicers**\n\nView → Sync slicers lets one slicer control several pages, so a reader's year selection persists as they navigate. Without it, each page has its own independent selection, which is a common source of confusion.\n\n**Edit interactions**\n\nBy default clicking one visual cross-filters the others. Format → Edit interactions lets you set each target to filter, highlight or do nothing. Turning off unwanted interactions is a normal part of report polish and is worth naming.\n\n**Performance**\n\nEvery slicer is a query. A page with eight high-cardinality slicers pays for all of them on every interaction, which is a real and frequently overlooked cost.",
    mistakes: [
      "Hiding a material exclusion in a page-level filter.",
      "Not knowing sync slicers exist, so selections reset on every page.",
      "Leaving every cross-interaction on by default.",
    ],
    followUps: [
      "How would you make a year selection persist across pages?",
      "Why might eight slicers be a performance problem?",
    ],
    tags: ["slicer", "filter", "sync slicers", "edit interactions", "RLS"],
    related: ["pbi-c-report-design", "pbi-q-drill-down-vs-through", "pbi-c-rls"],
    sources: [GFG_PBI],
  }),
  q({
    id: "pbi-q-bookmarks",
    category: "Visualization",
    title: "What are bookmarks?",
    difficulty: "Medium",
    q: "What are Bookmarks in Power BI and what would you use them for?",
    hint: "They capture page state. The interesting uses are navigation and swapping visuals.",
    answer:
      "A bookmark captures the current state of a page — filter and slicer selections, sort order, drill level, and which visuals are visible — and lets you return to it. Combined with the Selection pane, which controls visual visibility, and buttons with a Bookmark action, bookmarks build genuine interactivity: a toggle that swaps a chart for a table in the same space, a reset-filters button, or a guided sequence through a report.",
    detail:
      "**What a bookmark stores**\n\nBy default: filters, slicers, sort, drill state, spotlight and visual visibility. Each bookmark's context menu lets you narrow that — for instance, saving only visibility and not filters, so a toggle button does not also reset the user's slicer choices. Getting that right is the difference between a toggle that works and one that surprises people.\n\n**The three uses that come up**\n\n1. **Swap visuals in one space.** Two visuals stacked, each shown by its own bookmark, driven by two buttons. A chart/table toggle without spending a second page.\n2. **Reset filters.** Capture the default state as a bookmark; a Reset button returns to it. Readers otherwise have no way back to a clean slate.\n3. **Navigation and storytelling.** A bookmark group played in sequence walks an audience through an analysis, or buttons act as a custom menu.\n\n**Personal bookmarks**\n\nIn the Service, readers can create their own bookmarks to save a view they use often. These are distinct from report bookmarks the author defines, and the distinction occasionally gets asked.\n\n**The Selection pane**\n\nBookmarks are much less useful without it. The Selection pane lists every object on the page, controls visibility, and sets the tab order for accessibility. Naming it alongside bookmarks shows you have actually built a toggle rather than read about one.\n\n**A caution**\n\nBookmark-heavy reports become hard to maintain: adding a visual means revisiting every bookmark to decide its visibility. They are excellent in small numbers and a maintenance burden in large ones — saying so is a mark of experience.",
    mistakes: [
      "Saving filters in a visibility toggle, so the button also wipes the reader's selections.",
      "Not using the Selection pane, making bookmarks far harder to manage.",
      "Building a report with twenty bookmarks nobody can maintain.",
    ],
    followUps: [
      "How would you build a chart/table toggle button?",
      "What is a personal bookmark?",
    ],
    tags: ["bookmarks", "selection pane", "buttons", "navigation", "interactivity"],
    related: ["pbi-c-report-design", "pbi-q-drill-down-vs-through"],
    sources: [GFG_PBI],
  }),
  q({
    id: "pbi-q-kpi",
    category: "Visualization",
    title: "What is a KPI visual, and how do you show actual vs target?",
    difficulty: "Medium",
    q: "What is a KPI in Power BI, and how do you build one showing whether actual sales met the target?",
    hint: "There is a KPI visual, and there is the more flexible card-plus-conditional-formatting approach.",
    answer:
      "The KPI visual takes three inputs: an indicator (the actual value), a trend axis (usually a date), and a target. It shows the current value, the goal, and the variance, with colour indicating whether the target was met. In practice many teams instead use a card with a measure plus conditional formatting, because the KPI visual is quite rigid — you cannot easily control its formatting or show a percentage of target alongside.",
    detail:
      "**The measures behind it**\n\n```\nActual   = SUM( Sales[Revenue] )\nTarget   = SUM( Budget[Target] )\nVariance = [Actual] - [Target]\nAttainment % = DIVIDE( [Actual], [Target] )\nStatus = IF( [Actual] >= [Target], \"On target\", \"Below\" )\n```\n\n**The KPI visual's requirements and limits**\n\nIt needs a trend axis, so it cannot show a KPI without a time dimension. It shows one goal. Its formatting options are limited. For a simple \"are we on track this month\" tile it is fine; for anything with more nuance the card approach wins.\n\n**The card approach**\n\nA card showing `[Actual]`, with conditional formatting on the font colour driven by a measure:\n\n```\nKPI Colour = IF( [Actual] >= [Target], \"#2E7D32\", \"#C62828\" )\n```\n\nbound through Format → Callout value → fx → Field value. That gives full control and can be paired with a second line showing attainment percentage.\n\n**The design point worth making**\n\nA KPI needs three things to be useful: the value, a comparison (target or prior period), and a direction of good. A number on its own is not a KPI — \"revenue £4.2m\" tells nobody whether that is good. Saying this is more valuable than describing the visual, because it is the mistake most dashboards actually make.\n\n**Where the target comes from**\n\nOften the harder half of the question. A budget table at a different grain to the fact table — monthly targets against daily sales — needs care: the target must be allocated or the comparison must happen at the common grain. Raising that shows you have built one against real data.",
    code: [
      { lang: "DAX", label: "Attainment against target", code: "Attainment % = DIVIDE( [Actual Revenue], [Target Revenue] )" },
      { lang: "DAX", label: "Colour driver for conditional formatting", code: "KPI Colour = IF( [Actual Revenue] >= [Target Revenue], \"#2E7D32\", \"#C62828\" )" },
    ],
    mistakes: [
      "Showing a value with no comparison and calling it a KPI.",
      "Ignoring a grain mismatch between the budget and fact tables.",
      "Fighting the KPI visual's formatting limits instead of using a card.",
    ],
    followUps: [
      "Your targets are monthly and your sales are daily. How do you compare them?",
      "What makes a number a KPI rather than just a number?",
    ],
    tags: ["KPI", "target", "conditional formatting", "card", "scenario"],
    related: ["pbi-c-report-design", "pbi-q-percent-of-total", "xl-q-revenue-formulas"],
    sources: [GFG_PBI],
  }),

  // =========================================================== PERFORMANCE
  q({
    id: "pbi-q-slow-report",
    category: "Performance",
    title: "Your report is slow. What do you do?",
    difficulty: "Hard",
    q: "Your Power BI report is very slow because of large data. What steps can you take?",
    hint: "Start by measuring. Then work through model, DAX and visuals in that order.",
    answer:
      "Measure before changing anything: Performance Analyzer records each visual's DAX query time, render time and other, which tells you whether the problem is the model, the DAX or the visuals. Then work in order of likely impact — model first (remove unused columns, reduce cardinality, adopt a star schema, disable Auto Date/Time), then DAX (avoid measures inside iterators, use variables, prefer set-based expressions), then visuals (fewer per page, avoid huge table visuals, limit high-cardinality slicers).",
    detail:
      "**Step 1 — measure**\n\nView → Performance Analyzer → Start recording → interact with the page. Each visual reports DAX query time, visual display time and other. One visual usually dominates, and that tells you where to look. DAX Studio gives server timings and the query plan for anything that needs more depth.\n\n**Step 2 — the model, where the biggest wins usually are**\n\n| Fix | Why |\n|---|---|\n| Remove unused columns | VertiPaq compresses per column; unused ones cost memory and refresh time for nothing |\n| Split datetime into date + time | a column of unique timestamps has terrible cardinality; two columns compress far better |\n| Star schema | fewer hops, better compression, predictable DAX |\n| Disable Auto Date/Time | it builds a hidden date table per date column |\n| Integer surrogate keys | relationships on long strings are markedly slower |\n| Aggregate at load | if nobody needs transaction grain, do not load it |\n\n**Step 3 — the DAX**\n\n- Measures inside iterators trigger context transition per row. This is the most common cause of a single catastrophically slow measure.\n- `FILTER(ALL(BigTable), ...)` materialises the whole table; a column predicate inside CALCULATE is much cheaper.\n- `VAR` so an expensive expression evaluates once.\n- DISTINCTCOUNT on a high-cardinality column is inherently expensive and non-additive.\n\n**Step 4 — the visuals**\n\nEvery visual is at least one query. A page with twenty visuals runs twenty queries per interaction. Table visuals returning tens of thousands of rows are a frequent culprit, as are many slicers.\n\n**Step 5 — the architecture, if needed**\n\nIncremental refresh, aggregations over a DirectQuery fact, or moving heavy transformation upstream into the warehouse.\n\n**What makes this answer good**\n\nStarting with measurement. Every candidate can list optimisations; diagnosing first is what an experienced person actually does, and it is also what stops you spending a day tuning DAX when the real problem was a 40-column flat table.",
    mistakes: [
      "Listing optimisations without measuring first.",
      "Tuning DAX when the model is the problem.",
      "Leaving Auto Date/Time on.",
    ],
    followUps: [
      "How would you find which visual is responsible?",
      "What would you check in the model first?",
    ],
    tags: ["performance", "Performance Analyzer", "optimization", "cardinality", "scenario"],
    related: ["pbi-c-performance", "pbi-q-performance-analyzer", "pbi-q-query-folding"],
    sources: [GFG_PBI, GH_HUB],
  }),
  q({
    id: "pbi-q-performance-analyzer",
    category: "Performance",
    title: "What is Performance Analyzer?",
    difficulty: "Medium",
    q: "What is the Performance Analyzer in Power BI and how do you use it?",
    hint: "It breaks each visual's time into components. Say what each component tells you.",
    answer:
      "Performance Analyzer, on the View tab, records how long each visual takes and splits that into three components: DAX query, visual display, and other. You start recording, interact with the page, and read the breakdown. DAX query time points at the measure or the model; visual display time points at the visual itself, usually too many data points; and other is mostly waiting on other visuals. It also lets you copy the generated DAX query for any visual, which you can then run in DAX Studio.",
    detail:
      "**Reading the three components**\n\n| Component | Long means |\n|---|---|\n| **DAX query** | the measure or model is the problem — look at cardinality, relationships, iterator usage |\n| **Visual display** | the visual is rendering too much — thousands of data points, a huge table |\n| **Other** | mostly time queued behind other visuals; reduce the number of visuals on the page |\n\n**The workflow**\n\n1. View → Performance Analyzer → Start recording.\n2. Refresh visuals, or interact the way a user would.\n3. Sort by duration; the worst visual is almost always obvious.\n4. Expand it, read the breakdown, and copy the DAX query.\n5. Paste that query into DAX Studio, run it with Server Timings on, and look at storage-engine versus formula-engine time.\n\n**Storage engine vs formula engine**\n\nWorth knowing for the follow-up. The storage engine (VertiPaq) is fast, cached and multi-threaded; the formula engine is single-threaded and slower. A query dominated by formula-engine time usually indicates DAX that cannot be pushed into the storage engine — often an iterator with a measure inside it. That is the deepest useful thing to say about Power BI performance in an interview.\n\n**Limitations**\n\nIt measures Desktop on your machine, not the Service under load with concurrent users. A report that is fine in Desktop can still be slow in production because of capacity contention, gateway latency or refresh overlap. Acknowledging that gap is a good, honest detail.\n\n**Related tooling**\n\nDAX Studio for query plans and server timings; Tabular Editor's Best Practice Analyzer for model-level issues; VertiPaq Analyzer for column-by-column memory usage, which is how you find the one column costing 40% of your model.",
    mistakes: [
      "Only reading total duration and ignoring the breakdown.",
      "Assuming Desktop timings predict Service performance.",
      "Not knowing the DAX query can be copied out for deeper analysis.",
    ],
    followUps: [
      "The DAX query time is long but the visual is simple. Where do you look?",
      "What does VertiPaq Analyzer tell you that Performance Analyzer does not?",
    ],
    tags: ["Performance Analyzer", "DAX Studio", "VertiPaq Analyzer", "diagnostics"],
    related: ["pbi-c-performance", "pbi-q-slow-report"],
    sources: [GFG_PBI],
  }),

  // =========================================================== RLS
  q({
    id: "pbi-q-rls",
    category: "RLS",
    title: "What is Row-Level Security?",
    difficulty: "Hard",
    q: "What is Row-Level Security (RLS) in Power BI? Explain static and dynamic RLS.",
    hint: "Define it, give both forms, then name who it does NOT apply to.",
    answer:
      "RLS restricts which rows a user can see within a report. You define roles in Desktop with DAX filter expressions on tables, then assign users to those roles in the Service. Static RLS hardcodes the filter per role — one role per region — which does not scale. Dynamic RLS uses a single role whose filter resolves the current user at query time via USERPRINCIPALNAME against a mapping table, so adding a user is a data change rather than a model change. Critically, RLS does not apply to workspace Admins, Members or Contributors — only Viewers are filtered.",
    detail:
      "**Static**\n\n```\nRole \"East\":  [Region] = \"East\"\nRole \"West\":  [Region] = \"West\"\n```\n\nFine for two or three fixed groups; unmanageable for fifty regions or a changing org.\n\n**Dynamic**\n\nOne role, one mapping table (`UserSecurity` with Email and Region), one filter:\n\n```\n[Region] = LOOKUPVALUE( UserSecurity[Region], UserSecurity[Email], USERPRINCIPALNAME() )\n```\n\nOnboarding a new manager is now a row insert into a table, not a model edit and republish. For users who map to several regions, filter with a table expression instead:\n\n```\nRegion[Region] IN\n    CALCULATETABLE( VALUES(UserSecurity[Region]),\n        UserSecurity[Email] = USERPRINCIPALNAME() )\n```\n\n**Where to apply the filter**\n\nOn the *dimension*, not the fact table. Filtering `Region[Region]` propagates down to Sales through the relationship and is far cheaper than filtering millions of fact rows directly.\n\n**Testing**\n\nDesktop: Modeling → View As → pick a role, and optionally enter a UPN to simulate a specific user. Service: the role's context menu offers Test as role.\n\n**The three things that catch people out**\n\n1. **Workspace roles bypass RLS.** Admin, Member and Contributor see everything. Testing as yourself and concluding RLS is broken is the classic mistake.\n2. **`USERPRINCIPALNAME()` in Desktop** returns your own account, so it must be tested with View As.\n3. **Bidirectional relationships can leak** past the RLS filter by providing an unanticipated path. In an RLS model, treat them as a security concern.\n\n**RLS vs OLS**\n\nRLS hides rows. Object-Level Security hides entire tables or columns — including from the field list. If the requirement is \"managers must not see the salary column at all\", RLS is the wrong tool.",
    code: [
      { lang: "DAX", label: "Dynamic RLS, single region per user", code: "[Region] =\nLOOKUPVALUE( UserSecurity[Region], UserSecurity[Email], USERPRINCIPALNAME() )" },
      { lang: "DAX", label: "Dynamic RLS, several regions per user", code: "Region[Region] IN\n    CALCULATETABLE(\n        VALUES( UserSecurity[Region] ),\n        UserSecurity[Email] = USERPRINCIPALNAME()\n    )" },
    ],
    mistakes: [
      "One static role per region.",
      "Testing as a workspace admin, who bypasses RLS entirely.",
      "Applying the filter to the fact table rather than the dimension.",
      "Expecting RLS to hide a column.",
    ],
    followUps: [
      "Why does the report show everything when you test it yourself?",
      "What if a user is responsible for three regions?",
      "How would you hide a salary column entirely?",
    ],
    tags: ["RLS", "dynamic RLS", "USERPRINCIPALNAME", "OLS", "security"],
    related: ["pbi-c-rls", "pbi-q-dynamic-rls", "pbi-c-relationships"],
    sources: [GFG_PBI, GH_HUB],
  }),
  q({
    id: "pbi-q-dynamic-rls",
    category: "RLS",
    title: "Restrict regional managers to their own region",
    difficulty: "Hard",
    q: "You need to restrict data visibility so that regional managers only see data for their own region. How would you achieve this?",
    hint: "Dynamic RLS with a mapping table. Walk through the setup end to end.",
    answer:
      "Dynamic row-level security. Add a UserSecurity table mapping each manager's email to their region and load it into the model. Create a single role with the filter on the Region dimension resolving USERPRINCIPALNAME against that table. Publish, assign all the managers to that one role in the Service, and test with View As. Adding or moving a manager afterwards is a row change in the mapping table, with no republishing.",
    detail:
      "**End to end**\n\n1. **Mapping table** — `UserSecurity(Email, Region)`, sourced from a spreadsheet, a database table or ideally an HR system so it stays current.\n2. **Load it into the model.** It does not need a relationship to anything; the filter expression queries it directly. Hide it from the report view.\n3. **Create one role** — Modeling → Manage Roles → New. Apply the filter to the **Region dimension**:\n   ```\n   [Region] = LOOKUPVALUE( UserSecurity[Region], UserSecurity[Email], USERPRINCIPALNAME() )\n   ```\n4. **Test in Desktop** — View As → tick the role → enter a manager's UPN.\n5. **Publish**, then in the Service: semantic model → Security → add every manager to that one role.\n6. **Distribute** via an app, with the managers as Viewers. This matters: a manager added as a workspace Member would bypass RLS entirely.\n\n**Managers covering several regions**\n\nThe `LOOKUPVALUE` form returns an error if a user maps to more than one row. Use a table filter instead:\n\n```\nRegion[Region] IN\n    CALCULATETABLE( VALUES(UserSecurity[Region]),\n        UserSecurity[Email] = USERPRINCIPALNAME() )\n```\n\nAsking whether any manager covers more than one region is exactly the clarifying question to raise before writing anything.\n\n**Hierarchies**\n\nIf a country manager should see every region beneath them, a flat mapping is not enough — you need either one mapping row per region per manager, or a parent-child hierarchy resolved with `PATH` and `PATHCONTAINS`. Naming that as the next level up shows range.\n\n**Users not in the mapping table**\n\nThey see nothing, which is the correct default — failing closed rather than open. But it looks like a broken report to them, so a visible message when the filter returns nothing is a real design consideration.\n\n**Auditing**\n\nBecause the mapping is data, it is easy to audit and easy to get wrong. Whoever can edit that table effectively controls data access, so it needs the same governance as any permissions system.",
    code: [
      { lang: "DAX", label: "One region per manager", code: "[Region] =\nLOOKUPVALUE( UserSecurity[Region], UserSecurity[Email], USERPRINCIPALNAME() )" },
      { lang: "DAX", label: "Several regions per manager", code: "Region[Region] IN\n    CALCULATETABLE(\n        VALUES( UserSecurity[Region] ),\n        UserSecurity[Email] = USERPRINCIPALNAME()\n    )" },
    ],
    mistakes: [
      "Building one static role per region.",
      "Adding managers as workspace Members, which bypasses RLS.",
      "Using LOOKUPVALUE when a manager covers several regions.",
      "No handling for a user missing from the mapping table.",
    ],
    followUps: [
      "What if a manager covers three regions?",
      "What about a country manager who should see every region below them?",
      "What does a user who is not in the mapping table see?",
    ],
    tags: ["RLS", "dynamic RLS", "USERPRINCIPALNAME", "scenario", "security"],
    related: ["pbi-c-rls", "pbi-q-rls", "pbi-c-service"],
    sources: [GFG_PBI],
  }),

  // =========================================================== SERVICE
  q({
    id: "pbi-q-publish-share",
    category: "Service",
    title: "How do you publish and share a report?",
    difficulty: "Easy",
    q: "How do you publish and share a Power BI report via the Power BI Service?",
    hint: "Publish, then choose a distribution method — and the right one depends on the audience size.",
    answer:
      "In Desktop, Home → Publish, and choose a workspace. From there the distribution options are: share the individual report with named people, publish the workspace contents as an App for a wide audience, or grant workspace access for collaborators. For anything beyond a handful of readers, an App is the right answer — it separates the polished thing you distribute from the workspace where you build. Everyone consuming needs a Pro licence unless the workspace is on Premium or Fabric capacity.",
    detail:
      "**The three distribution methods**\n\n| Method | Audience | Use when |\n|---|---|---|\n| Direct share | a few named people | ad-hoc, one-off |\n| **App** | a whole department | the normal answer for real distribution |\n| Workspace access | co-authors | people who edit, not just read |\n\n**Why an App rather than workspace access**\n\nA workspace contains work in progress — half-finished reports, test versions, scratch datasets. Granting viewers workspace access exposes all of it. An App publishes only what you choose, with its own navigation and audience list, and — importantly — workspace Viewers are the only role RLS applies to, so distribution method and security are linked.\n\n**Licensing, briefly**\n\n| | Can do |\n|---|---|\n| Free | author in Desktop, consume Premium-capacity content |\n| Pro | publish, share, and consume shared content |\n| PPU | Pro plus larger models and more refreshes, per user |\n| Premium / Fabric capacity | licenses the workspace, so free users can consume |\n\nThe rule that catches people: on a Pro workspace, *both* the sharer and the recipient need Pro. Only capacity licensing lets free users consume.\n\n**After publishing**\n\nConfigure the semantic model's data source credentials, set the refresh schedule, add the Gateway if the source is on-premises, and set up RLS role membership. A published report with no refresh configured silently goes stale, which is one of the most common real-world failures.\n\n**Governance**\n\nDeployment pipelines for dev/test/prod, sensitivity labels, and endorsement (Promoted or Certified) so users can tell which of the six \"Sales\" reports is the real one. Mentioning endorsement is a nice touch — it addresses a genuine organisational pain.",
    mistakes: [
      "Sharing workspace access with a large consumer audience.",
      "Publishing and forgetting to configure refresh, so the report goes stale.",
      "Assuming free users can consume Pro-workspace content.",
    ],
    followUps: [
      "Why is an App better than workspace access for 200 readers?",
      "Who needs a Pro licence?",
    ],
    tags: ["publish", "share", "app", "workspace", "licensing", "Service"],
    related: ["pbi-c-service", "pbi-q-dataset-report-dashboard", "pbi-c-rls"],
    sources: [GFG_PBI],
  }),
  q({
    id: "pbi-q-incremental-refresh",
    category: "Service",
    title: "How do you implement incremental refresh?",
    difficulty: "Hard",
    q: "How do you implement Incremental Refresh in Power BI? What are the steps and requirements?",
    hint: "Two specifically-named parameters, a filter using them, then the policy. And it needs one thing to work at all.",
    answer:
      "Create two parameters named exactly RangeStart and RangeEnd, both of type DateTime. Use them in Power Query to filter the fact table's date column, with one bound inclusively and the other exclusively to avoid double-counting. Then right-click the table, Incremental refresh, and set the archive period and the refresh period. Publish, and the Service partitions the table and refreshes only the recent partitions. It requires query folding — without folding there is nothing to push the partition filter into, and the whole point is lost.",
    detail:
      "**The steps**\n\n1. **Parameters** — Manage Parameters → new, named `RangeStart` and `RangeEnd`, type DateTime. The names are a requirement, not a convention; Power BI looks for those exact identifiers.\n2. **Filter the table** —\n   ```\n   = Table.SelectRows(Source, each [OrderDate] >= RangeStart and [OrderDate] < RangeEnd)\n   ```\n   Note `>=` on one side and `<` on the other. Using `<=` on both would include the boundary row in two partitions and double-count it.\n3. **Policy** — right-click the table → Incremental refresh → set \"Archive data starting X years before refresh date\" and \"Incrementally refresh data in the last N days\".\n4. **Publish.** The partitioning happens in the Service, not in Desktop — Desktop still loads only the RangeStart/RangeEnd window you set for development, which is itself a useful side effect.\n\n**Optional settings**\n\n- **Detect data changes** — a last-modified column lets the Service skip partitions that have not changed at all.\n- **Only refresh complete periods** — avoids refreshing a partial current day.\n\n**Why folding is mandatory**\n\nThe partition filter has to become a `WHERE` clause at the source. If folding is broken, Power BI downloads the whole table for every partition, which is worse than a normal full refresh. This is the requirement people most often miss, and it rules out flat-file sources.\n\n**What it buys you**\n\nA ten-year fact table where only the last week changes: a full refresh reloads 3,650 days of data nightly; incremental reloads 7. That is the difference between a refresh that fits in a maintenance window and one that does not.\n\n**Caveats**\n\nOnce published with a policy, the table is partitioned in the Service; republishing from Desktop can reset the partitions and force a full reload, which is a nasty surprise on a large model. And the source must have a reliable date column — incremental refresh on a table with no natural date partition key is not possible.",
    code: [
      { lang: "M", label: "The filter — note >= and <", code: "= Table.SelectRows(Source, each\n    [OrderDate] >= RangeStart and [OrderDate] < RangeEnd)" },
    ],
    mistakes: [
      "Parameters named anything other than RangeStart and RangeEnd.",
      "Using `<=` on both bounds and double-counting boundary rows.",
      "Configuring it against a source that cannot fold.",
    ],
    followUps: [
      "Why does it need query folding?",
      "Why is one bound inclusive and the other exclusive?",
    ],
    tags: ["incremental refresh", "RangeStart", "RangeEnd", "partitions", "query folding"],
    related: ["pbi-c-service", "pbi-q-query-folding", "pbi-q-parameters", "pbi-q-refresh-data"],
    sources: [GFG_PBI],
  }),
  q({
    id: "pbi-q-qna",
    category: "Service",
    title: "What is Power BI Q&A?",
    difficulty: "Easy",
    q: "How would you ask Power BI \"Show me total sales in 2023\" in natural language?",
    hint: "There is a feature for this, and it depends heavily on how well the model is named.",
    answer:
      "Power BI Q&A. You add the Q&A visual to a report page, or use the Q&A box on a dashboard in the Service, and type the question in plain English; Power BI parses it against the model and generates a visual. How well it works depends almost entirely on the model: friendly table and column names, synonyms configured in the Q&A setup pane, and hidden technical columns so they are not offered as answers.",
    detail:
      "**Making it actually work**\n\nQ&A fails when the model is named for developers rather than readers. The preparation that matters:\n\n1. **Rename fields** — `SalesAmt_USD` → `Sales Amount`. Q&A matches on names.\n2. **Add synonyms** — Modeling → Q&A setup → Synonyms. Teach it that \"revenue\", \"turnover\" and \"sales\" mean the same column. This is the single highest-value step.\n3. **Hide technical columns** — surrogate keys and helper columns should not be answerable.\n4. **Review Q&A setup** — it surfaces questions users asked that it could not answer, which is a direct list of what to fix.\n5. **Teach Q&A** — you can define terms explicitly, so \"top customers\" maps to a specific measure.\n\n**Where it fits, honestly**\n\nQ&A is good for simple aggregations and filters — \"total sales in 2023\", \"revenue by region last quarter\". It is not good at multi-step analytical questions, and it will not replace a designed report. Being realistic about that is better than overselling it, because interviewers who have deployed it know.\n\n**Related capabilities**\n\n- **Smart Narrative** generates a text summary of a visual that updates with filters.\n- **Quick Insights** runs automated analysis over a dataset looking for patterns.\n- **Copilot**, on capacity, extends the natural-language idea considerably.\n\n**The framing that lands**\n\nQ&A quality is a modelling outcome, not a feature you switch on. A well-named star schema with synonyms makes it useful; a flat table of cryptic column names makes it useless. That connects the question back to modelling, which is where the interviewer's real interest usually lies.",
    mistakes: [
      "Presenting Q&A as capable of arbitrary analysis.",
      "Not mentioning synonyms, which are what make it usable.",
      "Leaving technical columns visible to it.",
    ],
    followUps: [
      "Why does Q&A work badly on some models?",
      "What is Smart Narrative?",
    ],
    tags: ["Q&A", "natural language", "synonyms", "Smart Narrative"],
    related: ["pbi-c-service", "pbi-c-star-schema", "pbi-q-what-is-powerbi"],
    sources: [GFG_PBI],
  }),
];
