import { common, gfg, questionsFor, URLS } from "../helpers";
import type { DeepDiveItem } from "../types";

const q = questionsFor("DATA", "tableau");

/**
 * Tableau interview questions — fundamentals, data, filters and calculations.
 *
 * Sourcing: the GeeksforGeeks Tableau interview article publishes these as a
 * numbered list across its sections. Labelled COMMON_INTERVIEW_QUESTION: they
 * are demonstrably published and demonstrably asked, but no public source ties
 * any of them to one specific named interview, so no company is attributed.
 */

const GFG_TB = gfg(
  "50+ Tableau Interview Questions and Answers",
  URLS.gfgTableau,
  "Question published in the GeeksforGeeks Tableau interview question list.",
);

export const TABLEAU_QUESTIONS: DeepDiveItem[] = [
  // =========================================================== FUNDAMENTALS
  q({
    id: "tb-q-tableau-products",
    category: "Fundamentals",
    title: "What is Tableau and what are its products?",
    difficulty: "Easy",
    q: "What is Tableau and what are its different products?",
    hint: "Name the authoring tool, the two publishing platforms, and the prep tool.",
    answer:
      "Tableau is a visual analytics platform for exploring and presenting data. Tableau Desktop is the authoring tool where you connect, build worksheets and assemble dashboards. Tableau Server is the self-hosted publishing platform and Tableau Cloud is the same thing hosted by Tableau. Tableau Prep Builder is a separate visual data-preparation tool. Tableau Public is free but publishes everything publicly, Tableau Reader is a free viewer for packaged workbooks, and Tableau Bridge keeps Tableau Cloud connected to on-premises data.",
    detail:
      "**The family**\n\n| Product | Role |\n|---|---|\n| Desktop | authoring |\n| Server | self-hosted publishing |\n| Cloud (was Online) | Tableau-hosted publishing |\n| Prep Builder | data preparation |\n| Public | free, everything published publicly |\n| Reader | free viewer for .twbx |\n| Bridge | connects Cloud to on-prem sources |\n\n**What makes Tableau distinctive**\n\nThe design philosophy is drag-and-drop exploration: you build a view by placing fields on shelves and Tableau generates the query. That makes iteration fast and is why it became the default for exploratory analysis. The trade-off is that the modelling layer was historically thinner than Power BI's, which relationships have largely addressed since 2020.\n\n**The caution about Tableau Public**\n\nIt is free and excellent for building a portfolio, but everything you save is publicly visible and downloadable. Publishing anything with real company data to it is a genuine data-loss incident, and knowing that is worth stating.\n\n**Bridge**\n\nThe equivalent of Power BI's on-premises gateway: Tableau Cloud cannot reach into a private network, so Bridge runs inside the network and relays queries and extract refreshes. Naming it signals deployment experience rather than just Desktop familiarity.",
    mistakes: [
      "Confusing Tableau Public with Tableau Cloud.",
      "Omitting Prep, which is a separate product rather than a Desktop feature.",
      "Not knowing Bridge exists.",
    ],
    followUps: [
      "How would Tableau Cloud refresh an extract from an on-premises database?",
      "What is the risk of using Tableau Public for work?",
    ],
    tags: ["Tableau", "Desktop", "Server", "Cloud", "Prep", "Bridge", "Public"],
    related: ["tb-c-products", "tb-q-file-extensions", "tb-q-tableau-prep"],
    sources: [GFG_TB],
  }),
  q({
    id: "tb-q-file-extensions",
    category: "Fundamentals",
    title: "Tableau file extensions and what each contains",
    difficulty: "Easy",
    q: "What are the different file extensions used in Tableau and what is their significance?",
    hint: "The key pair is .twb versus .twbx. One carries data, the other does not.",
    answer:
      "A .twb is a workbook — XML describing the views, with no data, so the recipient needs access to the original source. A .twbx is a packaged workbook containing the definition plus the data extract, so it travels standalone. A .hyper is the extract file itself, which replaced the older .tde. A .tds is a data source definition — connection details, calculations and formatting — and a .tdsx packages that definition with its data. A .tfl is a Tableau Prep flow.",
    detail:
      "**The table**\n\n| Extension | Contains | Needs source access? |\n|---|---|---|\n| `.twb` | workbook definition, XML | yes |\n| `.twbx` | definition + extract | no |\n| `.hyper` | the extract itself | n/a |\n| `.tds` | data source definition | yes |\n| `.tdsx` | definition + data | no |\n| `.tfl` | Prep flow | yes |\n| `.tbm` | bookmark — a single saved worksheet | yes |\n\n**The practical decision**\n\nSending a workbook to someone outside your network: `.twbx`, because a `.twb` will simply fail to render for them. Committing to version control: `.twb`, because it is XML and produces readable diffs, while a `.twbx` is a binary blob containing the data.\n\n**The `.twbx` warning worth giving**\n\nA packaged workbook contains the *whole extract*, including rows filtered out of every view. Sharing one externally can disclose far more data than the dashboard shows. Filtering at extract level rather than at view level is the fix, and raising this shows a data-governance instinct.\n\n**`.tds` is underrated**\n\nA published data source definition holds the connection, the joins, the calculated fields and the formatting. Publishing one to Server means every analyst builds on the same definitions rather than each re-creating \"Profit Ratio\" slightly differently — the same governance argument as a shared semantic model in Power BI.",
    mistakes: [
      "Sending a .twb to someone with no database access.",
      "Sharing a .twbx externally without realising it carries every extracted row.",
      "Not knowing .hyper replaced .tde.",
    ],
    followUps: [
      "Which format would you commit to git, and why?",
      "What is the disclosure risk with a .twbx?",
    ],
    tags: ["twb", "twbx", "hyper", "tds", "file formats"],
    related: ["tb-c-products", "tb-c-extracts", "tb-q-tableau-products"],
    sources: [GFG_TB],
  }),
  q({
    id: "tb-q-dimensions-vs-measures",
    category: "Data",
    title: "Dimensions vs measures",
    difficulty: "Easy",
    q: "What is the difference between measures and dimensions in Tableau?",
    hint: "Qualitative versus quantitative — and say what each does when dropped on a shelf.",
    answer:
      "A dimension is qualitative and slices the data — region, product, order date. Dropping one on a shelf partitions the view into distinct headers. A measure is quantitative and gets aggregated — sales, profit, quantity. Dropping one on a shelf produces an aggregated number, SUM by default. Tableau assigns them automatically on connection based on data type, but the assignment can be changed: a numeric field like Order ID should usually be converted to a dimension because summing it is meaningless.",
    detail:
      "**What happens when you drop each**\n\n| | Dimension | Measure |\n|---|---|---|\n| Effect on the view | partitions into headers | produces an aggregate |\n| Default behaviour | groups | SUMs |\n| Typical type | text, date, boolean | number |\n| Position in the pane | above the line | below the line |\n\n**The classic conversion**\n\nOrder ID, Customer ID, postcode and year-as-integer all arrive as measures because they are numeric. Summing them is nonsense. Right-click → Convert to Dimension. Volunteering this shows you have connected to real data rather than only the Superstore sample.\n\n**The independent second axis**\n\nDimension/measure is about *what the field is*. Discrete/continuous is about *how it is displayed* — blue versus green. They are orthogonal, and conflating them is the most common error on this question. A measure can be made discrete; a date dimension can be continuous.\n\n**Aggregation defaults**\n\nA measure's default aggregation is set per field and can be changed to AVG, MIN, MAX, COUNT, COUNTD or MEDIAN. Setting a sensible default once is better than changing it in every view — and for something like a rate or a percentage, SUM is almost always the wrong default.",
    mistakes: [
      "Merging the dimension/measure and discrete/continuous distinctions.",
      "Leaving ID fields as measures.",
      "Leaving SUM as the default aggregation on a rate.",
    ],
    followUps: [
      "Order ID arrives as a measure. What do you do?",
      "How does this differ from discrete versus continuous?",
    ],
    tags: ["dimension", "measure", "aggregation", "fundamentals"],
    related: ["tb-c-dimensions-measures", "tb-q-discrete-vs-continuous"],
    sources: [GFG_TB],
  }),
  q({
    id: "tb-q-discrete-vs-continuous",
    category: "Data",
    title: "Discrete vs continuous fields",
    difficulty: "Medium",
    q: "What is the difference between discrete and continuous fields in Tableau?",
    hint: "Blue and green. It is about display, not about what the field is.",
    answer:
      "Discrete fields are blue and produce distinct headers and separate panes; continuous fields are green and produce a continuous axis. It is a display property, independent of whether the field is a dimension or a measure — you can have a discrete measure or a continuous dimension. Dates are where it matters most: a discrete month gives twelve labelled columns collapsing all years together, while a continuous month gives a proper time axis where gaps are visible.",
    detail:
      "**The four combinations, all valid**\n\n| | Discrete (blue) | Continuous (green) |\n|---|---|---|\n| **Dimension** | Region as headers — the normal case | Order Date as a time axis |\n| **Measure** | Sales binned into labelled groups | Sales on an axis — the normal case |\n\n**Why it matters for dates**\n\nA line chart of five years by discrete MONTH gives twelve points, because every January collapses into one. By continuous MONTH it gives sixty points on a real timeline. If a trend line looks strangely short, this is almost always why.\n\nUse discrete date parts for seasonality comparison — \"how does January compare across years\" — and continuous date values for trends.\n\n**Colour and size follow the same rule**\n\nA discrete field on the Colour shelf produces a categorical palette, one colour per member. A continuous field produces a gradient. That is why dropping a measure on Colour gives a heatmap and dropping a dimension gives distinct colours.\n\n**Sorting**\n\nDiscrete fields can be sorted freely; continuous axes are ordered by value and cannot be arbitrarily reordered. When someone needs a bar chart in a custom order, the field has to be discrete.\n\n**How to convert**\n\nRight-click the pill → Discrete or Continuous, or drag a date field with the right mouse button to choose explicitly.",
    mistakes: [
      "Assuming blue means dimension and green means measure.",
      "Using a discrete date part for a trend, hiding gaps in time.",
      "Trying to custom-sort a continuous field.",
    ],
    followUps: [
      "Your five-year trend shows only twelve points. Why?",
      "How would you get a categorical colour palette instead of a gradient?",
    ],
    tags: ["discrete", "continuous", "blue", "green", "dates", "display"],
    related: ["tb-c-dimensions-measures", "tb-c-dates", "tb-q-dimensions-vs-measures"],
    sources: [GFG_TB],
  }),
  q({
    id: "tb-q-tableau-prep",
    category: "Data",
    title: "What is Tableau Prep?",
    difficulty: "Easy",
    q: "What is Tableau Prep and how is it different from Tableau Desktop?",
    hint: "Different stage of the pipeline. One prepares data, the other analyses it.",
    answer:
      "Tableau Prep Builder is a separate visual data-preparation tool — the ETL stage. You build a flow of cleaning, joining, unioning, pivoting and aggregating steps, seeing a profile of the data at each one, and output a clean extract or published data source. Tableau Desktop is the analysis and visualisation stage, consuming data that is already in shape. Prep answers questions Desktop's data pane cannot — reshaping wide data to long, deduplicating, and cleaning inconsistent categorical values.",
    detail:
      "**What Prep does that Desktop cannot do well**\n\n- **Pivot** wide to long at scale, with a recorded, repeatable step.\n- **Union** many files with a wildcard pattern.\n- **Group and Replace** with fuzzy matching, which clusters near-identical values — \"USA\", \"U.S.A.\", \"United States\" — automatically.\n- **Aggregate** before analysis, so the extract is smaller.\n- **Output** to a .hyper extract, a published data source, or a database table.\n\n**The profile pane is the real advantage**\n\nAt every step Prep shows the distribution of each field, so you *see* the seventeen spellings of a category rather than discovering them later in a broken filter. That immediate feedback is why it is worth using even for work Desktop could technically manage.\n\n**Prep Conductor**\n\nA Server/Cloud add-on that schedules flows, so the preparation runs automatically rather than someone opening Prep Builder each month. Naming it answers the natural follow-up about automation.\n\n**The comparison worth drawing**\n\nPrep is to Tableau roughly what Power Query is to Power BI — with the difference that Power Query is built into Power BI Desktop, whereas Prep is a separate application and a separate licence. That is a fair, concrete distinction to offer if the interviewer compares the two platforms.",
    mistakes: [
      "Describing Prep as a Desktop feature rather than a separate product.",
      "Not knowing about Prep Conductor when asked how flows are automated.",
    ],
    followUps: [
      "How would you schedule a Prep flow to run nightly?",
      "How does this compare to Power Query?",
    ],
    tags: ["Tableau Prep", "ETL", "data preparation", "pivot", "Prep Conductor"],
    related: ["tb-c-products", "tb-q-pivot-data", "xl-q-power-query"],
    sources: [GFG_TB],
  }),

  // =========================================================== JOINS / BLENDS
  q({
    id: "tb-q-join-types",
    category: "Data",
    title: "What join types does Tableau support?",
    difficulty: "Easy",
    q: "What are the different types of joins available in Tableau, and what is a union?",
    hint: "The four SQL joins, plus union which is a different operation entirely.",
    answer:
      "Inner, left outer, right outer and full outer, exactly as in SQL — inner keeps only matching rows, left keeps all rows from the left table, and so on. A union is a different operation: it stacks tables vertically, adding rows rather than columns, and requires matching column names and types. Joins combine columns, unions combine rows. Tableau also offers a wildcard union that picks up every file matching a pattern in a folder.",
    detail:
      "**Joins versus unions**\n\n| | Join | Union |\n|---|---|---|\n| Adds | columns | rows |\n| Needs | a matching key | matching column names |\n| Use for | enrichment | combining periods or regions |\n\n**The duplication hazard**\n\nJoining a one-to-many relationship inflates measures on the \"one\" side. Join Customers to Orders and each customer's attributes repeat once per order, so a SUM of any customer-level measure is multiplied. This is the single most common source of wrong numbers in Tableau, and the modern answer is to use a **relationship** instead, which lets Tableau keep each table at its own grain.\n\n**Wildcard union**\n\nIn the data source pane, a union can be defined by a file-name pattern, so dropping a thirteenth monthly file into the folder includes it automatically on the next refresh. Tableau adds `Path` and `Table Name` fields identifying each row's origin, which is useful for auditing.\n\n**Mismatched columns in a union**\n\nColumns that do not match by name become separate columns with nulls. Tableau's union editor lets you merge mismatched fields manually. Checking the resulting column count is the fast sanity test — more columns than expected means a name mismatch.\n\n**Cross-database joins**\n\nTableau can join across different connections in one data source, which historically required blending. That capability is one reason blending is now much rarer.",
    mistakes: [
      "Joining one-to-many and reporting inflated totals.",
      "Confusing a union with a join.",
      "Not checking for mismatched column names after a union.",
    ],
    followUps: [
      "You joined Customers to Orders and revenue tripled. Why?",
      "How would you combine twelve monthly files?",
    ],
    tags: ["join", "union", "inner", "outer", "wildcard union", "duplication"],
    related: ["tb-c-joins-blends-relationships", "tb-q-join-vs-blend", "tb-q-relationship-vs-join"],
    sources: [GFG_TB],
  }),
  q({
    id: "tb-q-join-vs-blend",
    category: "Data",
    title: "Joining vs blending",
    difficulty: "Hard",
    q: "What is the difference between joining and blending in Tableau?",
    hint: "Where it happens and when. One is row-level before aggregation, the other is aggregate-level after.",
    answer:
      "A join combines tables at row level within a single data source, before aggregation, producing one flattened table. A blend combines two separate data sources at the view level: Tableau queries each independently, aggregates each, and then matches the results on a linking field. So a join can use fields from both tables at row level, while a blend can only bring aggregated values from the secondary source. Blending is for data that genuinely cannot live in one source; relationships have replaced most of what blending used to be needed for.",
    detail:
      "**Side by side**\n\n| | Join | Blend |\n|---|---|---|\n| Level | row, before aggregation | aggregate, after |\n| Sources | one data source | two or more |\n| Secondary fields | fully available | aggregated only |\n| Granularity | flattened to the join | each source keeps its own |\n| Marked in the pane | one source | orange tick on the secondary |\n\n**When blending is genuinely the right answer**\n\n- The sources are in different systems that cannot be cross-joined.\n- The sources are at **different granularity** — daily sales against monthly targets — and joining would duplicate the coarser side.\n- One source is a published data source you must not modify.\n\nThat middle case is the strongest argument for blending, and it is worth giving as the example.\n\n**The blend limitations to name**\n\n- The linking field must exist in both, with matching values.\n- You cannot use a secondary source's dimension to partition the primary view.\n- Non-additive aggregates such as COUNTD on the secondary source can behave unexpectedly.\n- Performance degrades with many linking fields.\n\n**Where relationships fit**\n\nSince 2020.2, relationships handle most of the different-granularity case *within* one data source without duplication, which was blending's main advantage. So the modern ordering is: relationships first, joins when you deliberately want a flattened physical table, blending only when the data cannot be brought into one source. A candidate who does not mention relationships is describing a version of Tableau from before 2020.",
    mistakes: [
      "Not mentioning relationships, which reads as dated knowledge.",
      "Blending when the sources could simply be related.",
      "Expecting to partition a view by a secondary source's dimension.",
    ],
    followUps: [
      "Daily sales and monthly targets. Join, blend or relate?",
      "What can't you do with a blended secondary source?",
    ],
    tags: ["join", "blend", "relationship", "granularity", "data source"],
    related: ["tb-c-joins-blends-relationships", "tb-q-relationship-vs-join", "tb-q-join-types"],
    sources: [GFG_TB],
  }),
  q({
    id: "tb-q-relationship-vs-join",
    category: "Data",
    title: "Relationships vs joins",
    difficulty: "Hard",
    q: "What is a Relationship in Tableau, and how is it different from a Join?",
    hint: "A relationship defers the decision. A join makes it up front.",
    answer:
      "A join is executed up front at the physical layer, flattening tables into one result with a fixed granularity. A relationship is defined at the logical layer and defers the decision: you tell Tableau how tables relate, and it works out at query time — per visualisation — which tables to bring together and at what level of detail. The practical consequence is that measures keep their native granularity, so a count of orders stays correct even in a view that also shows line-level detail. Relationships have been the default since 2020.2.",
    detail:
      "**The problem relationships solve**\n\nWith a join, Orders joined to Order Lines produces one row per line. Any order-level measure is now duplicated once per line, and `SUM([Order Value])` is wrong. The traditional workarounds were LOD expressions or careful use of COUNTD — both fiddly, both easy to get wrong.\n\nWith a relationship, Tableau keeps the tables separate and generates a different query depending on what the view needs. An order-level measure is aggregated at order grain; a line-level measure at line grain. No duplication, no workaround.\n\n**How they coexist**\n\nThe data source pane now has two layers. The **logical layer** holds tables connected by relationship noodles. Double-clicking a logical table opens the **physical layer** inside it, where you can still join and union. So relationships do not remove joins — they sit above them.\n\n**When a join is still right**\n\n- You genuinely want one flat table with fixed granularity.\n- The relationship's automatic behaviour is not what you want and you need explicit control.\n- Performance: a relationship can generate more complex queries, and for a simple one-to-one an explicit join may be cheaper.\n\n**Setting one up**\n\nDrag a table next to another and define the matching fields. The performance options — cardinality and referential integrity — let you tell Tableau that every fact row has a matching dimension row, which allows it to skip joins it would otherwise need. Setting those correctly is a real optimisation; setting them wrongly produces incorrect results, so they should be based on knowledge of the data rather than optimism.\n\n**The one-line summary**\n\nA join asks \"combine these now\"; a relationship asks \"here is how these relate — combine them as needed\".",
    mistakes: [
      "Describing relationships as just a new name for joins.",
      "Setting referential-integrity performance options optimistically rather than accurately.",
      "Defaulting to joins out of habit and then fighting duplication.",
    ],
    followUps: [
      "Why does a join between Orders and Order Lines break your order count?",
      "When would you still choose a join?",
    ],
    tags: ["relationship", "join", "logical layer", "physical layer", "granularity"],
    related: ["tb-c-joins-blends-relationships", "tb-q-join-vs-blend", "tb-c-lod"],
    sources: [GFG_TB],
  }),
  q({
    id: "tb-q-live-vs-extract",
    category: "Data",
    title: "Live connection vs extract",
    difficulty: "Medium",
    q: "What kinds of connections can you build with your dataset in Tableau, and when would you choose each?",
    hint: "Two options, and the trade-off is freshness against speed and source load.",
    answer:
      "Live or extract. A live connection queries the source on every interaction, so the data is always current but every click costs a round trip and puts load on the source system. An extract is a compressed columnar snapshot in Tableau's .hyper format, queried locally — usually far faster, works offline, and takes load off production, at the cost of the data being as old as the last refresh. Choose live when real-time accuracy is genuinely required; choose an extract by default otherwise.",
    detail:
      "**The comparison**\n\n| | Live | Extract |\n|---|---|---|\n| Freshness | real time | as of last refresh |\n| Speed | depends on the source | usually much faster |\n| Load on the source | every interaction | only at refresh |\n| Works offline | no | yes |\n| Portable in a .twbx | no | yes |\n\n**Why extracts are usually faster**\n\nHyper is a columnar analytical engine. A transactional database is optimised for row-level writes and point lookups, not for scanning and aggregating millions of rows. Extracting moves the work to an engine built for it. That said, it is not universal — a well-indexed warehouse returning a small aggregate can beat an extract, and claiming extracts are always faster is an overstatement worth avoiding.\n\n**Keeping an extract small**\n\n- Filter rows at extract time.\n- **Hide unused fields** — hidden fields are excluded from the extract entirely, which is the single biggest and most-forgotten saving.\n- Aggregate to visible dimensions if row detail is not needed.\n- Materialise calculations (Compute Calculations Now) so they are not recomputed per query.\n\n**Refreshing**\n\nFull refresh rebuilds everything. Incremental refresh appends only rows above the last value of a nominated column — fast, but it only *adds*, so edits and deletions to existing rows are never picked up. A periodic full refresh is still needed, and saying so is the detail that shows production experience.\n\n**When live is required**\n\nOperational dashboards where minutes matter, sources too large to extract, or governance rules forbidding a copy of the data leaving the system.",
    mistakes: [
      "Claiming extracts are always faster.",
      "Using incremental refresh alone and never catching updates or deletes.",
      "Extracting every column rather than hiding unused fields.",
    ],
    followUps: [
      "Your extract is enormous. What do you do first?",
      "What does incremental refresh miss?",
    ],
    tags: ["live connection", "extract", "hyper", "refresh", "performance"],
    related: ["tb-c-extracts", "tb-q-incremental-refresh", "tb-c-performance"],
    sources: [GFG_TB],
  }),
  q({
    id: "tb-q-incremental-refresh",
    category: "Data",
    title: "Incremental vs full refresh",
    difficulty: "Medium",
    q: "What is Incremental Refresh in Tableau, and how is it different from a Full Refresh?",
    hint: "One appends, one rebuilds. Name what the appending one cannot do.",
    answer:
      "A full refresh rebuilds the entire extract from the source. An incremental refresh appends only rows whose value in a nominated column — usually a date or an ascending ID — is greater than the highest value already in the extract. It is much faster on a large table, but it only ever adds rows: changes and deletions to existing rows are never picked up, so it must be paired with a periodic full refresh.",
    detail:
      "**How it works**\n\nYou nominate a column when defining the extract. On each incremental refresh Tableau records the maximum value present and queries only rows above it. So the column must be monotonically increasing and never revised.\n\n**What it misses, concretely**\n\n| Source change | Picked up? |\n|---|---|\n| New row | yes |\n| Existing row edited | **no** |\n| Row deleted | **no** |\n| Row backdated below the watermark | **no** |\n\nThat last one is the subtle failure: a late-arriving transaction with an older date is silently skipped forever. In systems where records arrive out of order, incremental refresh on a date column is unsafe and an ascending surrogate ID is the safer choice.\n\n**The standard production pattern**\n\nIncremental nightly, full weekly or monthly. That gives fast daily refreshes while guaranteeing corrections eventually propagate.\n\n**Scheduling**\n\nOn Server or Cloud, refresh schedules are configured per extract, and Tableau Bridge is required to reach an on-premises source from Cloud.\n\n**The comparison worth making**\n\nThis is the same idea as Power BI's incremental refresh, but simpler and less capable: Power BI partitions the table by date range and can refresh several recent partitions, which does catch late edits within the refresh window. Tableau's version is a pure high-water-mark append. Being able to compare them accurately is a good sign in a candidate who claims both tools.",
    mistakes: [
      "Assuming incremental refresh catches edits and deletions.",
      "Using a date column when records can arrive backdated.",
      "Never scheduling a full refresh alongside it.",
    ],
    followUps: [
      "A transaction is entered late with last month's date. Does incremental refresh catch it?",
      "How does this compare with Power BI's incremental refresh?",
    ],
    tags: ["incremental refresh", "full refresh", "extract", "watermark"],
    related: ["tb-c-extracts", "tb-q-live-vs-extract", "pbi-q-incremental-refresh"],
    sources: [GFG_TB],
  }),

  // =========================================================== FILTERS
  q({
    id: "tb-q-filter-types",
    category: "Filters",
    title: "What are the different filter types?",
    difficulty: "Medium",
    q: "What are the different types of filters in Tableau?",
    hint: "Name them in the order Tableau applies them — that ordering is the real content.",
    answer:
      "In the order Tableau applies them: extract filters, applied when the extract is built; data source filters, applied to every query from that source; context filters, which create a temporary subset everything after operates on; dimension filters from the Filters shelf; measure filters, applied after aggregation; and table calculation filters, applied last, which hide marks without removing them from the calculation. That ordering is the reason filters sometimes appear to interact strangely.",
    detail:
      "**The pipeline**\n\n| # | Filter | Applied |\n|---|---|---|\n| 1 | Extract | when the extract is built |\n| 2 | Data source | to every query |\n| 3 | **Context** | creates a temporary subset |\n| 4 | Dimension | on the Filters shelf |\n| 5 | *FIXED LODs computed here* | |\n| 6 | Measure | after aggregation |\n| 7 | Table calculation | last, hides marks only |\n\n**Why the order is the answer**\n\nA Top 10 filter and a Region filter together give the global top 10, then show whichever of those happen to be in the region — because Top N is computed before the dimension filter narrows the data. Promoting Region to a context filter moves it earlier and produces the expected within-region top 10.\n\nSimilarly, a FIXED LOD ignores dimension filters entirely, because it is computed before them. Promoting a filter to context is again the fix.\n\n**Table calculation filters are special**\n\nThey **hide** marks rather than removing rows, so a running total or percent-of-total computed before the filter still reflects the hidden data. That is sometimes exactly what you want — showing only the last three months of a running total that accumulated over years — and sometimes a bug. Knowing that they hide rather than exclude is a strong detail.\n\n**Performance ordering**\n\nEarlier filters are cheaper because they remove data sooner. Extract and data source filters cost essentially nothing at query time; quick filters each cost a query to populate their list.",
    mistakes: [
      "Listing filter types with no sense of ordering.",
      "Not knowing table calculation filters hide rather than exclude.",
      "Overusing context filters, which are materialised.",
    ],
    followUps: [
      "Your Top 10 filter behaves oddly with a region filter. Why?",
      "Which filter type is cheapest, and why?",
    ],
    tags: ["filters", "context filter", "order of operations", "extract filter", "measure filter"],
    related: ["tb-c-filter-order", "tb-q-context-filter", "tb-q-order-of-operations"],
    sources: [GFG_TB],
  }),
  q({
    id: "tb-q-context-filter",
    category: "Filters",
    title: "What is a context filter and when do you need one?",
    difficulty: "Hard",
    q: "What is a Context Filter in Tableau, and when would you use one?",
    hint: "It changes which filters run first. Give the Top N example.",
    answer:
      "A context filter creates a temporary subset of the data that all subsequent filters and calculations operate on. You create one by right-clicking a filter and choosing Add to Context. You need it whenever another filter or calculation must see only the filtered data — most commonly with a Top N filter, which is otherwise computed against the whole dataset, and with FIXED LOD expressions, which ignore ordinary dimension filters entirely.",
    detail:
      "**The Top N problem**\n\nA view of Sales by Customer with a Top 10 filter and a Region = East filter. Because Top N is computed before dimension filters, you get the top 10 customers *overall*, then only those that happen to be in East — often three or four of them, not ten.\n\nRight-click Region → Add to Context. Region now runs before the Top N computation, and you get the top 10 customers within East. This is the canonical example and the one to give.\n\n**The FIXED problem**\n\nA FIXED LOD is computed before dimension filters, so `{ FIXED [Customer] : SUM([Sales]) }` ignores your region filter. Promoting the region filter to context is the standard fix, because context filters run before FIXED expressions.\n\n**How to recognise it in the interface**\n\nContext filters appear grey on the Filters shelf rather than blue.\n\n**The performance trade-off**\n\nTableau materialises the context — historically as a temporary table — before running the remaining filters. That is genuine work. On a live connection with a frequently-changing context filter it can be slower rather than faster. The old advice that context filters improve performance is now largely obsolete; use them for **correctness**, and treat any performance benefit as incidental. Saying that distinguishes current knowledge from a memorised older answer.\n\n**When not to use one**\n\nIf no downstream filter or FIXED expression depends on it, a context filter adds cost for nothing.",
    mistakes: [
      "Recommending context filters primarily for performance.",
      "Not knowing they are the fix for FIXED LODs ignoring filters.",
      "Adding several context filters without needing them.",
    ],
    followUps: [
      "Your FIXED LOD ignores the region filter. How do you fix it?",
      "Do context filters make things faster?",
    ],
    tags: ["context filter", "Top N", "FIXED", "order of operations", "filters"],
    related: ["tb-c-filter-order", "tb-q-filter-types", "tb-c-lod", "tb-q-top-5-products"],
    sources: [GFG_TB],
  }),
  q({
    id: "tb-q-order-of-operations",
    category: "Filters",
    title: "What is Tableau's order of operations?",
    difficulty: "Hard",
    q: "What is the Order of Operations (query pipeline) in Tableau?",
    hint: "Recite the sequence, then explain one thing it makes sense of.",
    answer:
      "Tableau applies operations in a fixed sequence: extract filters, data source filters, context filters, FIXED LOD expressions, dimension filters, INCLUDE and EXCLUDE LODs, measure filters, forecasts and totals, and finally table calculations and table-calculation filters. The practical value of knowing it is that it explains every confusing filter interaction — why Top N ignores a region filter, why a FIXED expression ignores dimension filters, and why a table-calculation filter hides marks rather than excluding data.",
    detail:
      "**The pipeline**\n\n```\n1. Extract filters\n2. Data source filters\n3. Context filters\n4. FIXED LOD expressions\n5. Dimension filters\n6. INCLUDE / EXCLUDE LOD expressions\n7. Measure filters\n8. Forecasts, trend lines, totals\n9. Table calculations\n10. Table calculation filters\n```\n\n**The three things it explains**\n\n1. **FIXED ignores dimension filters** — because step 4 runs before step 5. Move the filter to context (step 3) and it applies.\n2. **INCLUDE and EXCLUDE do respect dimension filters** — because step 6 runs after step 5. That is a genuine behavioural difference between FIXED and the other two LOD types, and it is the detail most candidates miss.\n3. **Table calculation filters hide rather than exclude** — because step 10 runs after the calculation at step 9. The calculation has already seen the data.\n\n**Where Top N sits**\n\nA Top N filter is a dimension filter (step 5), computed against whatever survives steps 1–4. That is precisely why a context filter fixes it and an ordinary dimension filter does not.\n\n**How to use this in an interview**\n\nYou will rarely be asked to recite all ten steps. You will be asked a scenario — \"why does my filter not affect this calculation\" — and the pipeline is how you answer it confidently rather than by trial and error. Framing your answer that way is better than reciting the list.",
    mistakes: [
      "Knowing FIXED ignores filters but not knowing INCLUDE and EXCLUDE do not.",
      "Reciting the list without being able to apply it to a scenario.",
    ],
    followUps: [
      "Does an INCLUDE LOD respect a dimension filter? Why?",
      "Where does a Top N filter sit in this pipeline?",
    ],
    tags: ["order of operations", "query pipeline", "FIXED", "context filter", "table calculation"],
    related: ["tb-c-filter-order", "tb-q-context-filter", "tb-q-lod-types"],
    sources: [GFG_TB],
  }),

  // =========================================================== CALCULATIONS
  q({
    id: "tb-q-calculated-field",
    category: "Calculations",
    title: "What is a calculated field?",
    difficulty: "Easy",
    q: "What is a calculated field and how do you create one in Tableau?",
    hint: "Give the mechanic briefly, then the row-level versus aggregate distinction.",
    answer:
      "A calculated field is a new field defined by a formula, created from Analysis → Create Calculated Field or by right-clicking in the data pane. The important distinction is between row-level and aggregate calculations: [Profit]/[Sales] is computed on each underlying row, so summing it gives the average of ratios, which is wrong. SUM([Profit])/SUM([Sales]) is computed on the aggregates and gives the correct ratio. Tableau will not let you mix aggregated and non-aggregated terms in one expression, which is where the \"cannot mix aggregate and non-aggregate arguments\" error comes from.",
    detail:
      "**Row-level versus aggregate, concretely**\n\n```\n[Profit] / [Sales]              -- row level, then aggregated. Wrong.\nSUM([Profit]) / SUM([Sales])    -- aggregate. Right.\n```\n\nOn a dataset with a few large loss-making orders these give dramatically different answers. It is the same principle as never averaging a percentage in Excel: recompute the ratio from the totals rather than averaging per-row ratios.\n\n**The error message this explains**\n\n\"Cannot mix aggregate and non-aggregate arguments\" means part of your expression is aggregated and part is not. The fix is to aggregate the other part too, or to wrap the non-aggregated part in `ATTR()` if you know it is constant within the view.\n\n**Function families**\n\n| Family | Examples |\n|---|---|\n| Aggregate | SUM, AVG, MIN, MAX, COUNT, COUNTD, MEDIAN |\n| Logical | IF/THEN/ELSE, CASE, IIF, ISNULL, IFNULL |\n| String | LEFT, MID, CONTAINS, SPLIT, REGEXP_EXTRACT |\n| Date | DATEPART, DATETRUNC, DATEADD, DATEDIFF |\n| Type conversion | INT, FLOAT, STR, DATE |\n| Table calculation | RUNNING_SUM, WINDOW_AVG, RANK, LOOKUP, INDEX |\n| LOD | FIXED, INCLUDE, EXCLUDE |\n\n**IF versus CASE**\n\nCASE is cleaner for matching one field against a list of literal values. IF handles arbitrary conditions including comparisons and compound logic. CASE cannot express `> 100`, so anything with ranges needs IF.\n\n**Performance**\n\nBoolean calculations evaluate fastest; string comparisons are slowest. Where a calculation is used heavily and the logic is stable, pushing it into the source or into Tableau Prep is better than recomputing it on every query.",
    code: [
      { lang: "Tableau", label: "Correct ratio", code: "SUM([Profit]) / SUM([Sales])" },
      { lang: "Tableau", label: "IF for ranges", code: "IF SUM([Sales]) > 100000 THEN \"High\"\nELSEIF SUM([Sales]) > 50000 THEN \"Medium\"\nELSE \"Low\"\nEND" },
      { lang: "Tableau", label: "CASE for literal matching", code: "CASE [Region]\n  WHEN \"East\" THEN \"Domestic\"\n  WHEN \"West\" THEN \"Domestic\"\n  ELSE \"International\"\nEND" },
    ],
    mistakes: [
      "Writing a row-level ratio and aggregating it.",
      "Trying to use CASE for a range comparison.",
      "Heavy string calculations on large row counts.",
    ],
    followUps: [
      "Why is [Profit]/[Sales] wrong?",
      "What does 'cannot mix aggregate and non-aggregate arguments' mean?",
    ],
    tags: ["calculated field", "aggregate", "row level", "IF", "CASE"],
    related: ["tb-c-calculations", "tb-q-profit-margin", "tb-q-table-calculation"],
    sources: [GFG_TB],
  }),
  q({
    id: "tb-q-table-calculation",
    category: "Calculations",
    title: "What is a table calculation?",
    difficulty: "Hard",
    q: "What is a Table Calculation in Tableau and what are its types? How does it differ from a calculated field?",
    hint: "It runs after the query, on what is already in the view. That constraint explains everything about it.",
    answer:
      "A table calculation is computed after the query returns, on the aggregated results already present in the view — not on the underlying data. The types are running total, difference, percent difference, percent of total, rank, percentile and moving average. Because it operates on what is displayed, its result depends entirely on Compute Using, which sets the direction and partitioning. The key difference from an ordinary calculated field is that a table calculation can only see data that is in the view, whereas an LOD expression can see data that is not.",
    detail:
      "**The defining constraint**\n\nA table calculation sees the result table, not the database. If a customer is filtered out of the view, a running total cannot include them. If you need data not in the view, you need an LOD expression instead. That single distinction answers most table-calculation-versus-LOD questions.\n\n**Compute Using is where the confusion lives**\n\n| Setting | Means |\n|---|---|\n| Table (across) | left to right |\n| Table (down) | top to bottom |\n| Pane (across/down) | restart at each pane boundary |\n| Specific Dimensions | you choose the addressing and partitioning fields |\n\nThe default is often plausible but wrong. A running total that resets when you expected it to accumulate — or vice versa — is almost always a Compute Using problem. For anything non-trivial, set Specific Dimensions explicitly rather than relying on the default.\n\n**Addressing vs partitioning**\n\nThe fields you tick are **addressing** — the direction the calculation moves along. The fields you leave unticked are **partitioning** — they define the groups it restarts within. Being able to state that distinction is the mark of someone who has genuinely used them.\n\n**The functions**\n\n`RUNNING_SUM`, `WINDOW_SUM`, `WINDOW_AVG`, `RANK`, `INDEX`, `FIRST`, `LAST`, `LOOKUP`, `TOTAL`, `SIZE`.\n\n`LOOKUP(SUM([Sales]), -1)` returns the previous row's value, which is how year-over-year growth is written as a table calculation.\n\n**Quick table calculations**\n\nPresets on a pill's dropdown — running total, percent of total, rank, year-over-year growth. They generate a standard table calculation which you can then convert to a custom, editable one. Using a quick table calculation and then editing it is the fastest way to write a correct one.",
    code: [
      { lang: "Tableau", label: "Running total", code: "RUNNING_SUM( SUM([Sales]) )" },
      { lang: "Tableau", label: "Percent of total", code: "SUM([Sales]) / TOTAL( SUM([Sales]) )" },
      { lang: "Tableau", label: "Year-over-year growth", code: "(SUM([Sales]) - LOOKUP(SUM([Sales]), -1)) / ABS(LOOKUP(SUM([Sales]), -1))" },
      { lang: "Tableau", label: "3-period moving average", code: "WINDOW_AVG( SUM([Sales]), -2, 0 )" },
    ],
    mistakes: [
      "Leaving Compute Using at its default on a non-trivial calculation.",
      "Expecting a table calculation to see filtered-out rows.",
      "Confusing addressing with partitioning.",
    ],
    followUps: [
      "Your running total resets unexpectedly. What do you check?",
      "When would you use an LOD instead of a table calculation?",
    ],
    tags: ["table calculation", "compute using", "RUNNING_SUM", "WINDOW_AVG", "LOOKUP", "addressing"],
    related: ["tb-c-calculations", "tb-q-window-avg", "tb-c-lod", "tb-q-running-total"],
    sources: [GFG_TB],
  }),
  q({
    id: "tb-q-lod",
    category: "LOD",
    title: "What is a Level of Detail expression?",
    difficulty: "Hard",
    q: "What is a Level of Detail (LOD) Expression in Tableau?",
    hint: "It computes at a granularity different from the view. That is the whole idea.",
    answer:
      "An LOD expression computes an aggregation at a level of detail different from the one shown in the view. FIXED computes at exactly the dimensions you name, ignoring the view. INCLUDE computes at the view's dimensions plus the ones you name, then rolls back up. EXCLUDE computes at the view's dimensions minus the ones you name. They are written in braces — { FIXED [Customer ID] : SUM([Sales]) } — and unlike table calculations they are computed by the database and can see rows that are not in the view.",
    detail:
      "**The three, with the case each solves**\n\n| Type | Granularity | Solves |\n|---|---|---|\n| `FIXED` | exactly what you name | customer lifetime value, cohort dates |\n| `INCLUDE` | view + named dims | average order value on a coarse view |\n| `EXCLUDE` | view − named dims | percent of category total |\n\n**FIXED — the most used**\n\n```\n{ FIXED [Customer ID] : SUM([Sales]) }\n```\n\nEach customer's total, regardless of what is on the shelves. Drop Region into the view and the number does not change, because FIXED ignores the view entirely. That is exactly what you want for customer-level segmentation.\n\n**INCLUDE — the one candidates forget**\n\nA view showing only Region, and you need average *order* value. `AVG([Sales])` gives the average line value. \n\n```\nAVG( { INCLUDE [Order ID] : SUM([Sales]) } )\n```\n\ncomputes each order's total first, then averages those. The order dimension is not in the view, which is exactly why a table calculation cannot do this.\n\n**EXCLUDE — for ratios against a coarser total**\n\n```\nSUM([Sales]) / SUM( { EXCLUDE [Sub-Category] : SUM([Sales]) } )\n```\n\nEach sub-category's share of its category, in a view broken down to sub-category.\n\n**Versus table calculations**\n\nLODs are part of the database query and see all the data; table calculations run afterwards on the returned result and see only the view. If the data you need is not in the view, the answer is an LOD.\n\n**The filter interaction**\n\nFIXED is computed before dimension filters, so it ignores them — promote a filter to context to make it apply. INCLUDE and EXCLUDE are computed after dimension filters and do respect them. That asymmetry is the detail most worth knowing.\n\n**Performance**\n\nFIXED over a high-cardinality dimension is expensive, since the database must compute and hold a value per member. Materialising it in an extract or pushing it into the source is the usual mitigation.",
    code: [
      { lang: "Tableau", label: "Customer lifetime value", code: "{ FIXED [Customer ID] : SUM([Sales]) }" },
      { lang: "Tableau", label: "Average order value on any view", code: "AVG( { INCLUDE [Order ID] : SUM([Sales]) } )" },
      { lang: "Tableau", label: "Share of category total", code: "SUM([Sales]) / SUM( { EXCLUDE [Sub-Category] : SUM([Sales]) } )" },
      { lang: "Tableau", label: "Cohort — first purchase month", code: "{ FIXED [Customer ID] : MIN([Order Date]) }" },
    ],
    mistakes: [
      "Expecting a dimension filter to affect a FIXED expression.",
      "Using a table calculation when the needed data is not in the view.",
      "FIXED over a very high-cardinality dimension without considering the cost.",
    ],
    followUps: [
      "How would you compute average order value on a view showing only Region?",
      "Why does your FIXED calculation ignore the region filter?",
    ],
    tags: ["LOD", "FIXED", "INCLUDE", "EXCLUDE", "granularity"],
    related: ["tb-c-lod", "tb-q-lod-types", "tb-q-one-time-customers", "tb-q-table-calculation"],
    sources: [GFG_TB],
  }),
  q({
    id: "tb-q-lod-types",
    category: "LOD",
    title: "FIXED vs INCLUDE vs EXCLUDE",
    difficulty: "Hard",
    q: "What is the difference between FIXED, INCLUDE and EXCLUDE LOD expressions?",
    hint: "Relative to the view: ignores it, adds to it, subtracts from it. And they differ on filters.",
    answer:
      "All three set the granularity of a calculation relative to the view. FIXED ignores the view entirely and computes at exactly the dimensions named. INCLUDE computes at the view's dimensions plus the named ones, which lets you work at a finer grain than is displayed. EXCLUDE computes at the view's dimensions minus the named ones, giving a coarser total to compare against. They also differ on filters: FIXED is computed before dimension filters and ignores them, while INCLUDE and EXCLUDE are computed after and respect them.",
    detail:
      "**Relative to the view**\n\n```\nFIXED    →  exactly the named dimensions        (view irrelevant)\nINCLUDE  →  view dimensions + named            (finer)\nEXCLUDE  →  view dimensions − named            (coarser)\n```\n\n**Worked contrast**\n\nView shows Region. Named dimension is Customer.\n\n| Expression | Computes at |\n|---|---|\n| `{FIXED [Customer] : SUM([Sales])}` | Customer only |\n| `{INCLUDE [Customer] : SUM([Sales])}` | Region + Customer |\n| `{EXCLUDE [Region] : SUM([Sales])}` | the grand total |\n\n**The filter asymmetry — the discriminator question**\n\n| | Respects dimension filters? |\n|---|---|\n| FIXED | **no** — computed at step 4, before filters at step 5 |\n| INCLUDE | yes — step 6 |\n| EXCLUDE | yes — step 6 |\n\nAll three respect extract, data source and context filters, because those run earlier still. So promoting a dimension filter to context is how you make it apply to a FIXED expression.\n\n**Choosing**\n\n- Need a value that stays constant however the view changes → **FIXED**.\n- Need a finer grain than the view shows → **INCLUDE**.\n- Need a coarser total to divide by → **EXCLUDE**.\n\n**A table-level LOD**\n\n`{ : MAX([Order Date]) }` with no dimensions computes across the entire table — useful for \"the latest date in the data\", which is how you build a dynamic latest-month filter that does not need hardcoding.",
    code: [
      { lang: "Tableau", label: "Latest date in the whole table", code: "{ : MAX([Order Date]) }" },
      { lang: "Tableau", label: "Comparison of all three", code: "{ FIXED   [Customer] : SUM([Sales]) }\n{ INCLUDE [Customer] : SUM([Sales]) }\n{ EXCLUDE [Region]   : SUM([Sales]) }" },
    ],
    mistakes: [
      "Thinking all three behave the same way with dimension filters.",
      "Using FIXED when the calculation should follow the view.",
      "Forgetting the table-level form with no dimensions.",
    ],
    followUps: [
      "Which of the three respect a dimension filter?",
      "What does { : MAX([Order Date]) } give you?",
    ],
    tags: ["LOD", "FIXED", "INCLUDE", "EXCLUDE", "filters", "order of operations"],
    related: ["tb-c-lod", "tb-q-lod", "tb-q-order-of-operations", "tb-q-latest-month"],
    sources: [GFG_TB],
  }),
  q({
    id: "tb-q-parameter",
    category: "Parameters",
    title: "Parameter vs filter",
    difficulty: "Medium",
    q: "What is a Parameter in Tableau, and how is it different from a Filter?",
    hint: "A parameter is not connected to the data. That single fact explains every difference.",
    answer:
      "A parameter is a single user-input value — a number, date, string or boolean — that is not connected to the data at all. It just holds a value that calculations, filters and reference lines can reference. A filter is connected to the data and directly restricts which rows appear. So a parameter alone can never filter anything; it needs a calculated field that uses it. The advantage is flexibility: one parameter can switch which measure is displayed, set a threshold, or drive a Top N cutoff, none of which a filter can do.",
    detail:
      "**The core distinction**\n\n| | Parameter | Filter |\n|---|---|---|\n| Connected to data | **no** | yes |\n| Filters by itself | no | yes |\n| Values | a fixed list or range you define | the data's actual values |\n| Selection | one value only | one or many |\n| Scope | workbook-wide | worksheet, unless applied wider |\n\n**Why \"not connected to the data\" matters**\n\nA filter's list updates as the data changes. A parameter's list is static unless you set it to refresh on workbook open — so a parameter listing regions will not gain a new region automatically. That is a real maintenance trap and worth naming.\n\n**The three patterns that come up**\n\n1. **Measure swap** — a string parameter plus a CASE calculation, so one chart can show Sales, Profit or Quantity:\n   ```\n   CASE [Select Measure]\n     WHEN \"Sales\"  THEN SUM([Sales])\n     WHEN \"Profit\" THEN SUM([Profit])\n   END\n   ```\n2. **Threshold** — an integer parameter used in a Top N filter or a reference line.\n3. **What-if** — a discount or growth rate the reader can vary to see the effect.\n\n**Parameter actions**\n\nSince 2019.2, clicking a mark can set a parameter's value. That closes the old gap where parameters could not respond to the view, and enables patterns like clicking a bar to set the comparison baseline.\n\n**Dynamic parameters**\n\nA parameter can be configured to take its list of values from a field and refresh on workbook open, which mitigates the staleness problem — though it still only refreshes on open, not continuously.",
    code: [
      { lang: "Tableau", label: "Measure swap", code: "CASE [Select Measure]\n  WHEN \"Sales\"    THEN SUM([Sales])\n  WHEN \"Profit\"   THEN SUM([Profit])\n  WHEN \"Quantity\" THEN SUM([Quantity])\nEND" },
      { lang: "Tableau", label: "Threshold flag", code: "IF SUM([Sales]) > [Sales Threshold] THEN \"Above\" ELSE \"Below\" END" },
    ],
    mistakes: [
      "Saying a parameter filters the view directly.",
      "Forgetting a parameter's list is static unless set to refresh.",
      "Not knowing parameter actions exist.",
    ],
    followUps: [
      "How would you let a reader switch a chart between Sales and Profit?",
      "A new region is added to the data. Does your parameter show it?",
    ],
    tags: ["parameter", "filter", "measure swap", "parameter action", "dynamic parameter"],
    related: ["tb-c-params-sets", "tb-q-sets-bins-groups", "tb-q-top-5-products"],
    sources: [GFG_TB],
  }),
  q({
    id: "tb-q-sets-bins-groups",
    category: "Sets",
    title: "Sets vs bins vs groups",
    difficulty: "Medium",
    q: "What is the difference between sets, bins and groups in Tableau?",
    hint: "Membership, ranges, and relabelling. Three different jobs.",
    answer:
      "A set is a subset of dimension members, returning IN or OUT per member — static if you pick them manually, dynamic if defined by a condition or a Top N rule. A bin buckets a continuous measure into equal-width ranges, which is how you build a histogram. A group merges dimension members into a coarser category, changing labelling rather than membership. The distinguishing feature of sets is that they are boolean and can be combined, used in calculations, and placed on shelves.",
    detail:
      "**The three jobs**\n\n| | Operates on | Produces | Dynamic? |\n|---|---|---|---|\n| **Set** | dimension members | IN/OUT boolean | yes, if computed |\n| **Bin** | a continuous measure | equal-width ranges | recalculates as data changes |\n| **Group** | dimension members | a merged label | no, static list |\n\n**Sets are the powerful one**\n\nBecause a set returns a boolean, you can:\n- Drop it on Colour to highlight members in versus out.\n- Use it in a calculation: `IF [Top Customers] THEN ... END`.\n- **Combine two sets** — union, intersection, or difference. \"Customers who bought in 2024 AND in 2025\" is a set intersection, and that is the cleanest way to express retention membership.\n\n**Dynamic sets update; groups do not**\n\nA computed set defined as \"Top 10 by Sales\" re-evaluates as data changes. A group is a fixed list of members you chose — add a new sub-category to the data and it lands outside every group, silently, as \"Other\" or ungrouped. That difference is the practical reason to prefer a set where the rule can be expressed.\n\n**Bins**\n\nRight-click a measure → Create → Bins, choose a size. Tableau suggests one using the Diagonal-Wilkinson algorithm. Bin size choice materially changes what a histogram appears to show, so it deserves thought rather than accepting the default.\n\n**The set-versus-filter distinction**\n\nA set is not a filter until you put it on the Filters shelf. Left on Colour or Detail it marks membership without removing anything, which is often more informative — you can see the in-group and the out-group side by side.",
    mistakes: [
      "Using a group where a computed set would stay current.",
      "Treating a set as necessarily a filter.",
      "Accepting the default bin size without considering it.",
    ],
    followUps: [
      "How would you find customers who bought in both 2024 and 2025?",
      "A new sub-category is added. Does your group include it?",
    ],
    tags: ["set", "bin", "group", "combined set", "histogram"],
    related: ["tb-c-params-sets", "tb-q-parameter", "tb-q-retention"],
    sources: [GFG_TB],
  }),
];
