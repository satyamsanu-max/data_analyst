import { common, gfg, github, questionsFor, URLS } from "../helpers";
import type { DeepDiveItem } from "../types";

const q = questionsFor("DATA", "power-bi");

/**
 * Power BI interview questions — fundamentals, Power Query and modelling.
 *
 * Sourcing: chiefly the GeeksforGeeks Power BI interview article, which
 * publishes these as a numbered list, cross-checked against public GitHub
 * Power BI resource repositories. Labelled COMMON_INTERVIEW_QUESTION because
 * they are demonstrably published and demonstrably asked, but no public source
 * ties them to a specific named interview — so no company is attributed.
 */

const GFG_PBI = gfg(
  "Top 30 Power BI Interview Questions and Answers",
  URLS.gfgPowerBI,
  "Question published in the GeeksforGeeks Power BI interview question list.",
);
const GH_AWESOME = github(
  "NajiElKotob/Awesome-Power-BI",
  URLS.ghAwesomePowerBI,
  "Curated Power BI resource list that collects interview question sets, including DAX-focused ones.",
);
const GH_HUB = github(
  "virajbhutada/BI-ResourceHub",
  URLS.ghBIResourceHub,
  "Public Power BI resource repository covering interview questions and a reference cheat sheet.",
);

export const POWERBI_QUESTIONS: DeepDiveItem[] = [
  // =========================================================== FUNDAMENTALS
  q({
    id: "pbi-q-what-is-powerbi",
    category: "Fundamentals",
    title: "What is Power BI and what are its key features?",
    difficulty: "Easy",
    q: "What is Power BI, what is business intelligence, and what are Power BI's key features?",
    hint: "Define it as a pipeline — connect, transform, model, visualise, share — rather than as a chart tool.",
    answer:
      "Power BI is Microsoft's business intelligence platform. It connects to data sources, transforms the data with Power Query, models it into related tables with DAX calculations, visualises it as interactive reports, and publishes them to a cloud service where they can be refreshed, shared and secured. Business intelligence more broadly is the practice of turning raw operational data into information people can act on. The key features are Power Query for ETL, the VertiPaq in-memory engine, DAX, interactive visuals, row-level security and scheduled refresh.",
    detail:
      "**Frame it as a pipeline**\n\nConnect → Transform (Power Query) → Model (relationships and DAX) → Visualise → Publish and share (Service). Answering with that sequence rather than 'it makes dashboards' immediately positions you as someone who has built a model rather than only opened a report.\n\n**The features worth naming**\n\n| Feature | Why it matters |\n|---|---|\n| Power Query | repeatable ETL, recorded as steps |\n| VertiPaq | columnar in-memory compression; the reason it is fast |\n| DAX | measures that respond to filter context |\n| Relationships | model many tables rather than one flat sheet |\n| RLS | one report, filtered per viewer |\n| Scheduled refresh | it stays current without you |\n| Q&A | natural-language querying |\n\n**What distinguishes it from Excel**\n\nScale (millions of rows rather than a million), a governed shared model rather than a file per analyst, refresh and distribution as first-class features, and row-level security. Excel remains better for ad-hoc exploration and for anything genuinely one-off.\n\n**A good closing sentence**\n\nPower BI's real value is that the model is defined once and consumed many times — which is also why modelling questions dominate the rest of the interview.",
    mistakes: [
      "Describing it as a visualisation tool and omitting Power Query and the model.",
      "Reciting a feature list with no sense of the pipeline.",
    ],
    followUps: ["How is Power BI different from Excel?", "What is the difference from Tableau?"],
    tags: ["Power BI", "business intelligence", "overview"],
    related: ["pbi-c-architecture", "pbi-q-powerbi-vs-excel", "pbi-q-powerbi-vs-tableau"],
    sources: [GFG_PBI, GH_HUB],
  }),
  q({
    id: "pbi-q-powerbi-vs-tableau",
    category: "Fundamentals",
    title: "Power BI vs Tableau",
    difficulty: "Medium",
    q: "What is the difference between Power BI and Tableau?",
    hint: "Compare on ecosystem, calculation language, cost and where each is genuinely stronger. Avoid partisanship.",
    answer:
      "Both are leading BI platforms with heavy overlap. Power BI is tightly integrated with the Microsoft ecosystem, uses DAX and M, and is significantly cheaper per user, which makes it the default in Microsoft-centric organisations. Tableau has historically had the edge on visual flexibility and exploratory analysis, uses its own calculation and LOD syntax, and is platform-agnostic. Power BI's modelling layer is stronger out of the box; Tableau's visual design ceiling is higher. The honest answer is that the choice is usually driven by existing infrastructure and licensing rather than capability.",
    detail:
      "**Where they genuinely differ**\n\n| | Power BI | Tableau |\n|---|---|---|\n| Calculation | DAX + M | Tableau calcs + LOD |\n| Data prep | Power Query, built in | Tableau Prep, separate |\n| Modelling | strong relationships, star schema first-class | relationships added later, historically join/blend |\n| Visual flexibility | good, improving | traditionally stronger |\n| Cost | markedly lower per user | higher |\n| Ecosystem | Excel, Azure, Teams, Fabric | platform-agnostic |\n| Learning curve | easier if you know Excel | easier for pure visual exploration |\n\n**The trap in this question**\n\nInterviewers are partly checking whether you are dogmatic. Declaring one strictly better reads badly, especially since you are probably being interviewed by a shop that has already chosen. The strong answer states real differences, then says the decision follows from the existing stack, the team's skills and the licensing budget.\n\n**A concrete differentiator worth citing**\n\nDAX's filter context and Tableau's LOD expressions solve overlapping problems in genuinely different ways. If you can say that — \"CALCULATE modifies filter context; FIXED sets a computation's granularity independent of the view\" — it shows you have used both rather than read a comparison table.",
    mistakes: [
      "Being partisan about a tool the interviewer's company may already use.",
      "Claiming a difference that has since been closed, such as saying Power BI cannot do relationships well.",
    ],
    followUps: ["Which would you recommend for a company already on Microsoft 365, and why?"],
    tags: ["Power BI", "Tableau", "comparison", "tool selection"],
    related: ["pbi-c-architecture", "tb-q-tableau-products", "pbi-q-what-is-powerbi"],
    sources: [GFG_PBI],
  }),
  q({
    id: "pbi-q-powerbi-vs-excel",
    category: "Fundamentals",
    title: "Power BI vs Excel",
    difficulty: "Easy",
    q: "Differentiate between Power BI and Excel.",
    hint: "They share an engine. Focus on scale, governance and distribution.",
    answer:
      "They share technology — Power Query and the tabular engine exist in both — so the difference is not capability at small scale, it is scale and governance. Excel is a file per analyst, limited to about a million rows per sheet, refreshed by whoever opens it. Power BI holds a shared governed model, handles far larger volumes, refreshes on a schedule without a person, supports row-level security so one report serves many audiences, and distributes to hundreds of viewers. Excel remains better for genuinely ad-hoc analysis and one-off work.",
    detail:
      "**The shared heritage**\n\nPower Query and Power Pivot are the same technologies in both products, and DAX is the same language. Someone fluent in Power Pivot already knows most of Power BI's modelling layer. Saying this shows you understand the products rather than treating them as rivals.\n\n**Where the line falls**\n\n| | Excel | Power BI |\n|---|---|---|\n| Row limit | ~1M per sheet | tens of millions in the model |\n| Refresh | manual, or on open | scheduled, unattended |\n| Distribution | email a file | publish, share, apps |\n| Security | file-level | row-level per user |\n| Single source of truth | no — everyone has a copy | yes — one model |\n| Ad-hoc exploration | excellent | more structured |\n\n**The governance point**\n\nThe real failure mode Power BI solves is version drift: five people emailing five slightly different copies of last month's numbers. One published model with scheduled refresh eliminates that class of problem entirely.\n\n**When Excel is still right**\n\nOne-off analysis, quick modelling, anything the recipient must edit, and situations where the audience simply will not open a new tool. Saying this is a strength, not a hedge — recommending Power BI for a one-off ad-hoc question is bad judgement.",
    mistakes: [
      "Treating them as competitors rather than complements.",
      "Missing that they share Power Query and the tabular engine.",
    ],
    followUps: ["When would you tell someone to stay in Excel?"],
    tags: ["Power BI", "Excel", "comparison", "governance"],
    related: ["pbi-c-architecture", "xl-q-power-pivot", "pbi-q-what-is-powerbi"],
    sources: [GFG_PBI],
  }),
  q({
    id: "pbi-q-dataset-report-dashboard",
    category: "Fundamentals",
    title: "Semantic model vs report vs dashboard vs visual",
    difficulty: "Easy",
    q: "What is the difference between a Power BI semantic model (dataset), a report, a dashboard and a visual?",
    hint: "They nest. And one of them cannot be created in Desktop at all.",
    answer:
      "A semantic model — previously called a dataset — is the data, its relationships and its measures. A report is one or more pages of visuals bound to a single semantic model. A dashboard is a Service-only single canvas of tiles pinned from one or more reports. A visual is an individual chart. The detail that gets tested: a dashboard can only be created in the Service, never in Desktop, and it can combine tiles from several different reports whereas a report page cannot.",
    detail:
      "**The nesting**\n\n```\nSemantic model  (data + relationships + measures)\n   └── Report   (pages)\n        └── Page\n             └── Visual\n\nDashboard  (Service only) ── tiles pinned from many reports\n```\n\n**Report vs dashboard, precisely**\n\n| | Report | Dashboard |\n|---|---|---|\n| Created in | Desktop or Service | Service only |\n| Pages | many | one canvas |\n| Data sources | one semantic model | tiles from many reports |\n| Interactivity | full cross-filtering, slicers | tiles link back to their report |\n| Filters | slicers and filter pane | none |\n\n**Why the renaming matters**\n\nMicrosoft renamed 'dataset' to 'semantic model' to emphasise that it is a governed model rather than a copy of data. Using the current term, while noting the old one, reads as current knowledge.\n\n**The practical consequence**\n\nOne semantic model can serve many reports. That is the governance win: define \"revenue\" once and every report using the model agrees. Candidates who describe a model as belonging to a report have the relationship backwards.",
    mistakes: [
      "Saying you build a dashboard in Desktop.",
      "Thinking a semantic model belongs to a report rather than the other way round.",
    ],
    followUps: ["Can two reports share one semantic model? Why would you want that?"],
    tags: ["semantic model", "dataset", "report", "dashboard", "visual"],
    related: ["pbi-c-architecture", "pbi-q-publish-share"],
    sources: [GFG_PBI],
  }),
  q({
    id: "pbi-q-components",
    category: "Fundamentals",
    title: "What are the major components of Power BI?",
    difficulty: "Easy",
    q: "What are the major components of Power BI?",
    hint: "Two lists exist — the products, and the internal engine components. Give both briefly.",
    answer:
      "At product level: Power BI Desktop for authoring, Power BI Service for publishing and sharing, Power BI Mobile for consumption, Power BI Report Server for on-premises hosting, and the on-premises Data Gateway for refreshing behind a firewall. Inside Desktop the components are Power Query for extract and transform, Power Pivot as the data model with DAX, Power View as the visualisation layer, and Power Q&A for natural-language querying.",
    detail:
      "**Product level**\n\n| Component | Role |\n|---|---|\n| Desktop | authoring: connect, transform, model, design |\n| Service | publish, share, schedule, secure |\n| Mobile | consumption on phones and tablets |\n| Report Server | on-premises hosting |\n| Data Gateway | bridge from cloud Service to on-prem sources |\n\n**Internal components**\n\nThese are the historical Excel add-in names, which is why they still appear in interview lists:\n\n- **Power Query** — extract and transform, in M\n- **Power Pivot** — the tabular model and DAX\n- **Power View** — interactive visualisation\n- **Power Map** — geospatial visuals\n- **Power Q&A** — natural language\n\n**Which list to give**\n\nAsk, or give the product list first and offer the internal one. The product list is the more useful framing in practice; the internal one is what older question banks expect, which is why knowing both is worth the extra sentence.",
    mistakes: [
      "Omitting the Gateway, which is the component that makes real deployments work.",
      "Listing only the Excel-era add-in names, which sounds dated on its own.",
    ],
    followUps: ["Which component would you need if your source is an on-prem SQL Server?"],
    tags: ["components", "architecture", "gateway"],
    related: ["pbi-c-architecture", "pbi-q-gateway"],
    sources: [GFG_PBI],
  }),
  q({
    id: "pbi-q-gateway",
    category: "Fundamentals",
    title: "What is a Power BI Gateway and why is it needed?",
    difficulty: "Medium",
    q: "What is a Power BI Gateway (On-premises Data Gateway) and why is it needed?",
    hint: "It solves a network problem, not a data problem.",
    answer:
      "The Gateway is software installed inside your network that lets the cloud Power BI Service reach data sources sitting behind the firewall. The Service cannot open an inbound connection into a private network, so the Gateway makes an outbound connection to Azure and relays queries and refresh requests. Without one, a published report cannot refresh from an on-premises SQL Server, file share or SAP system — the data would go stale the moment you published.",
    detail:
      "**Two modes**\n\n| Mode | Use |\n|---|---|\n| **Standard** (enterprise) | shared across users and reports, supports scheduled refresh, DirectQuery and Live Connection, centrally managed |\n| **Personal** | one user, scheduled refresh only, no DirectQuery |\n\nStandard is the production answer. Personal mode is fine for an individual's own report and is a liability as soon as anyone else depends on it, because it dies when that person leaves.\n\n**Why it is not a security hole**\n\nThe Gateway makes an *outbound* connection to Azure Service Bus. No inbound firewall port is opened. Credentials are encrypted and stored in the Service; the Gateway holds the key. That explanation is worth giving, because the follow-up is often a security concern.\n\n**When you do not need one**\n\nCloud sources — Azure SQL, Synapse, SharePoint Online, Dataverse, most SaaS connectors — are already reachable from the Service. The Gateway is specifically about crossing the network boundary into a private network.\n\n**Operational realities worth mentioning**\n\nIt is a single point of failure, so production deployments use a **gateway cluster** for high availability. It must be kept updated. And refresh failures very often trace back to the machine hosting it being switched off or its service account's password expiring.",
    mistakes: [
      "Describing it as a data store — it stores no data, it relays queries.",
      "Recommending Personal mode for a shared production report.",
      "Assuming a cloud source needs one.",
    ],
    followUps: [
      "Does a report on Azure SQL need a Gateway?",
      "How would you make a Gateway highly available?",
    ],
    tags: ["gateway", "refresh", "on-premises", "security", "Service"],
    related: ["pbi-c-architecture", "pbi-c-service", "pbi-q-refresh-data"],
    sources: [GFG_PBI],
  }),
  q({
    id: "pbi-q-refresh-data",
    category: "Service",
    title: "How can you refresh data in Power BI?",
    difficulty: "Medium",
    q: "How can you refresh data in Power BI?",
    hint: "There are several mechanisms and they apply at different points in the pipeline.",
    answer:
      "Manually in Desktop with the Refresh button, manually in the Service, or on a schedule configured per semantic model in the Service — up to 8 times a day on Pro and 48 on Premium or Fabric capacity. Incremental refresh reloads only recent partitions rather than the whole table. DirectQuery and Live Connection need no refresh at all, since they query the source at view time. Any on-premises source requires a Gateway for the scheduled refresh to reach it.",
    detail:
      "**The mechanisms**\n\n| Mechanism | Where | Notes |\n|---|---|---|\n| Manual, Desktop | Desktop | during development |\n| Manual, Service | Service | 'Refresh now' on the model |\n| Scheduled | Service | 8/day Pro, 48/day Premium |\n| Incremental | Service | only recent partitions |\n| API / Power Automate | programmatic | trigger on an ETL completion |\n| DirectQuery / Live | n/a | queried at view time |\n\n**Incremental refresh, briefly**\n\nDefine two parameters named exactly `RangeStart` and `RangeEnd`, both DateTime, use them to filter the source table, then configure the archive and refresh windows. Power BI partitions the table and refreshes only the recent partitions. It requires query folding — without folding there is nothing to push the partition filter into.\n\n**Triggering on ETL completion**\n\nThe most robust production pattern is not a fixed schedule at all: the ETL job calls the Power BI REST API (or a Power Automate flow) when it finishes loading. That eliminates the race where refresh runs at 6am and the warehouse load finishes at 6:10.\n\n**Common failure causes**\n\nExpired data-source credentials, the Gateway machine offline, a source schema change breaking a query step, and refresh timeouts on large models. Naming these shows operational experience.",
    mistakes: [
      "Forgetting the Gateway requirement for on-prem sources.",
      "Not knowing the Pro versus Premium refresh limits.",
      "Scheduling a fixed time that races the upstream ETL.",
    ],
    followUps: [
      "How would you avoid refreshing before the upstream load finishes?",
      "What does incremental refresh require?",
    ],
    tags: ["refresh", "scheduled refresh", "incremental refresh", "gateway", "API"],
    related: ["pbi-c-service", "pbi-q-gateway", "pbi-q-incremental-refresh"],
    sources: [GFG_PBI],
  }),

  // =========================================================== POWER QUERY
  q({
    id: "pbi-q-power-query",
    category: "Power Query",
    title: "What is Power Query in Power BI?",
    difficulty: "Easy",
    q: "What is Power Query in Power BI?",
    hint: "It is the E and T of ETL, and it records steps rather than editing data.",
    answer:
      "Power Query is Power BI's extract-and-transform layer. You connect to a source, apply a sequence of transformations, and load the result into the model. Every step is recorded in Applied Steps and re-executes on every refresh, so the cleaning is a repeatable recipe rather than a manual chore. Its language is M, which is separate from DAX: M runs at refresh time to shape data, DAX runs at query time to calculate over data already loaded.",
    detail:
      "**Where it sits**\n\n`Source → Power Query (E and T) → Model (relationships, DAX) → Visuals`\n\n**The transformations that matter most**\n\n- **Unpivot** — turn a cross-tab into a tidy long table. The highest-value single operation.\n- **Merge** — a join; adds columns.\n- **Append** — a union; adds rows.\n- **Group By** — aggregate at load time, reducing model size.\n- **Change Type** — do it deliberately and early; set the locale explicitly for dates from other regions.\n- **From Folder** — combine every file in a directory into one query.\n\n**The rule about where to transform**\n\nDo it as far upstream as possible: in the source database if you can, then Power Query, then DAX as a last resort. Each step downstream costs more memory and is harder to reuse. A calculated column doing something Power Query could have done is a small design smell that experienced interviewers notice.\n\n**Query folding**\n\nAgainst a database, Power Query pushes what it can into a single native query rather than downloading everything first. Ordering matters — filter early, break folding late.",
    mistakes: [
      "Confusing M with DAX.",
      "Doing transformations in DAX that belong in Power Query.",
      "Loading raw tables and cleaning them later.",
    ],
    followUps: ["What is the difference between M and DAX?", "What is query folding?"],
    tags: ["Power Query", "M", "ETL", "transformations"],
    related: ["pbi-c-powerquery-pbi", "pbi-q-dax-vs-m", "pbi-q-query-folding", "xl-q-power-query"],
    sources: [GFG_PBI],
  }),
  q({
    id: "pbi-q-dax-vs-m",
    category: "Power Query",
    title: "Difference between DAX and M query",
    difficulty: "Medium",
    q: "What is the difference between DAX and M (Power Query) language?",
    hint: "The cleanest discriminator is when each one runs.",
    answer:
      "They run at different times and do different jobs. M runs at refresh time in Power Query, and its job is to shape data — connect, filter, reshape, join, and load tables into the model. DAX runs at query time, once the data is already loaded, and its job is to calculate over that model in response to the current filter context. M is case-sensitive and functional; DAX is case-insensitive and closer to Excel formulas. As a rule, if it is about getting the right rows and columns into the model, it is M; if it is about calculating a number in a visual, it is DAX.",
    detail:
      "**Side by side**\n\n| | M | DAX |\n|---|---|---|\n| Runs at | refresh time | query time |\n| Job | shape and load | calculate |\n| Produces | tables, columns | measures, calculated columns/tables |\n| Case-sensitive | yes | no |\n| Aware of filter context | no | yes — this is its whole point |\n| Where you write it | Power Query Editor | Desktop model view |\n\n**The decision rule**\n\nSomething fixed and row-level — a category derived from a string, a cleaned date, a joined attribute — belongs in M, computed once at refresh. Something that must respond to what the user has selected — a total, a ratio, a share of the visible total — must be DAX, because only DAX sees filter context.\n\n**The overlap that causes confusion**\n\nBoth can create a column. A conditional column can be written in M or as a DAX calculated column, and both work. Prefer M: it is computed once at refresh, compresses into the model like any source column, and does not carry DAX's row-context subtleties.\n\n**The one thing only DAX can do**\n\nRespond to selection. No amount of M can produce \"percentage of the categories currently visible in this visual\", because M has already finished running before anyone clicks anything. That sentence answers the question completely.",
    mistakes: [
      "Saying one is 'for data' and the other 'for reports' without explaining when each runs.",
      "Writing DAX calculated columns for static row-level attributes.",
    ],
    followUps: ["Where would you put a conditional Pass/Fail column, and why?"],
    tags: ["DAX", "M", "Power Query", "comparison"],
    related: ["pbi-c-powerquery-pbi", "pbi-c-dax-intro", "pbi-q-power-query"],
    sources: [GFG_PBI, github("mandipdevnath/Data-Analyst-Interview-Questions", URLS.ghDataAnalyst, "The question 'What is difference between Dax and m-query?' appears verbatim in this public collection.")],
  }),
  q({
    id: "pbi-q-query-folding",
    category: "Power Query",
    title: "What is query folding?",
    difficulty: "Hard",
    q: "What is Query Folding in Power Query, and how would you check whether it is happening?",
    hint: "It is about where the work executes. And there is a specific menu item that tells you.",
    answer:
      "Query folding is Power Query translating your transformation steps into a single native query — usually SQL — that the source database executes, so only the rows you need cross the network. When folding breaks, Power BI downloads the whole table and transforms it locally, which on a large table is the difference between seconds and hours. You check it by right-clicking a step in Applied Steps: if View Native Query is enabled, everything up to that step folded; if it is greyed out, folding has stopped.",
    detail:
      "**What folds and what does not**\n\n| Folds | Breaks folding |\n|---|---|\n| filter rows | add index column |\n| remove / rename columns | most custom M functions |\n| change type | `Table.Buffer` |\n| merge against a foldable source | anything after a broken step |\n| group by, sort | non-foldable sources (Excel, CSV, entered data) |\n\n**The consequence for step ordering**\n\nOnce folding breaks, nothing after it can fold. So the ordering rule is: every foldable step first, every folding-breaker last. Moving an index column from step 2 to step 12 can change a refresh from hours to minutes without changing the output at all.\n\n**Verifying**\n\nRight-click each step → View Native Query. Walk down the Applied Steps until it greys out; the step where it greys out is where folding stopped. For deeper diagnosis, Power Query's Query Diagnostics or a SQL Server trace shows exactly what was sent.\n\n**Why non-foldable sources cannot fold**\n\nFolding means pushing work into a query engine. A CSV or an Excel sheet has no engine to push into, so everything is done locally by definition. Candidates sometimes look for folding against a flat file and conclude something is broken.\n\n**Why it is a good interview question**\n\nIt only comes up when you have had a refresh that was mysteriously slow. Someone who can describe the diagnosis — not just the definition — has almost certainly done it.",
    mistakes: [
      "Defining folding but not knowing View Native Query.",
      "Adding an index or custom column early.",
      "Expecting folding from a file source.",
    ],
    followUps: [
      "Your refresh takes two hours. How do you find out whether folding is the problem?",
      "Why does step order matter here?",
    ],
    tags: ["query folding", "performance", "native query", "M", "refresh"],
    related: ["pbi-c-query-folding", "pbi-q-power-query", "pbi-q-slow-report"],
    sources: [GFG_PBI],
  }),
  q({
    id: "pbi-q-parameters",
    category: "Power Query",
    title: "What are parameters in Power Query?",
    difficulty: "Medium",
    q: "What are Parameters in Power Query, and what would you use them for?",
    hint: "They replace hardcoded values. Name the case where they are mandatory.",
    answer:
      "A parameter is a named, typed value managed separately from the queries that use it — a file path, a server name, a cut-off date, an environment flag. Instead of hardcoding a connection string in twelve queries, you point them all at a parameter and change it once. They are mandatory in one case: incremental refresh requires two parameters named exactly RangeStart and RangeEnd, of type DateTime, used to filter the source table.",
    detail:
      "**Where they earn their keep**\n\n1. **Environment switching** — a `ServerName` parameter lets the same file point at dev, test or production. Combined with deployment pipeline rules, promotion between stages repoints the source automatically.\n2. **Folder and file paths** — so moving the source share is one edit, not twelve.\n3. **Incremental refresh** — `RangeStart` and `RangeEnd`. The names are not a convention, they are a requirement; Power BI looks for those exact identifiers.\n4. **Function parameters** — converting a query into a reusable function, which is how the From Folder pattern applies the same transformation to every file.\n\n**Types and lists**\n\nA parameter has a type and can be restricted to a list of allowed values, which turns it into a dropdown in the Manage Parameters dialog and prevents typos.\n\n**Parameters vs What-if parameters**\n\nWorth distinguishing, because the names collide. A **Power Query parameter** is a design-time value baked in at refresh. A **What-if parameter** (Modeling tab) is a DAX-generated table plus a slicer that lets a *report reader* vary a value interactively — a discount rate, a growth assumption. Different things at different layers, and interviewers occasionally test whether you conflate them.\n\n**In the Service**\n\nParameters can be edited after publishing under the semantic model's settings, so an environment change does not require republishing from Desktop.",
    mistakes: [
      "Not knowing RangeStart and RangeEnd must be named exactly that.",
      "Confusing Power Query parameters with What-if parameters.",
      "Hardcoding paths and then editing every query when the source moves.",
    ],
    followUps: [
      "What is the difference between this and a What-if parameter?",
      "How do parameters help with dev/test/prod?",
    ],
    tags: ["parameters", "Power Query", "incremental refresh", "deployment"],
    related: ["pbi-c-powerquery-pbi", "pbi-q-incremental-refresh", "pbi-c-service"],
    sources: [GFG_PBI],
  }),
  q({
    id: "pbi-q-merge-vs-append-pbi",
    category: "Power Query",
    title: "Append vs Merge queries",
    difficulty: "Easy",
    q: "What is the difference between Append Queries and Merge Queries in Power BI?",
    hint: "Rows versus columns. Then talk about join kinds.",
    answer:
      "Append stacks tables vertically — it adds rows, like a SQL UNION ALL — and needs the tables to share column names. Merge joins tables horizontally — it adds columns, like a SQL JOIN — and needs a matching key. Twelve monthly sales files with identical columns are an Append. Bringing customer attributes onto an orders table is a Merge.",
    detail:
      "**Side by side**\n\n| | Append | Merge |\n|---|---|---|\n| Adds | rows | columns |\n| SQL equivalent | UNION ALL | JOIN |\n| Requires | matching column names | a matching key |\n| Typical use | monthly files | enrichment |\n\n**Append gotcha**\n\nIt matches on column *name*. `Amount` in one file and `Amt` in another produces two columns, each half null. Checking the resulting column count is the quick sanity test.\n\n**Merge join kinds**\n\n| Join | Keeps |\n|---|---|\n| Left Outer | all left rows plus matches |\n| Right Outer | all right rows |\n| Full Outer | everything |\n| Inner | matched only |\n| **Left Anti** | left rows with **no** match |\n| **Right Anti** | right rows with no match |\n\nThe anti joins are worth calling out: Left Anti answers \"which orders have no matching customer record\" in one step, which is a data-quality check most candidates would attempt with a column of errors instead.\n\n**The row-count discipline**\n\nA Merge on a non-unique key multiplies rows and silently fans out your fact table. Compare the row count before and after every merge. Volunteering this habit is the mark of someone who has been caught by it.\n\n**A modelling caveat**\n\nMerging everything into one wide table defeats the star schema. Merge to clean and conform; use model relationships, not merges, to connect facts to dimensions.",
    mistakes: [
      "Appending files whose column names differ slightly.",
      "Merging on a non-unique key and not checking the row count.",
      "Merging dimensions into the fact instead of relating them.",
    ],
    followUps: [
      "How would you find orders with no matching customer?",
      "Should you merge a dimension into the fact table? Why not?",
    ],
    tags: ["append", "merge", "join", "union", "anti join"],
    related: ["pbi-c-powerquery-pbi", "pbi-q-relationships", "xl-q-merge-vs-append"],
    sources: [GFG_PBI],
  }),
  q({
    id: "pbi-q-remove-nulls-duplicates",
    category: "Power Query",
    title: "How do you remove nulls and duplicates in Power BI?",
    difficulty: "Easy",
    q: "How do you remove null and duplicate values in Power BI?",
    hint: "Do it in Power Query, and think about what 'duplicate' means before removing anything.",
    answer:
      "In Power Query: for nulls, use the column filter to remove them, Remove Empty Rows, or Replace Values to substitute something meaningful. For duplicates, select the key columns and Remove Duplicates, which keeps the first occurrence. Both are recorded as steps so they re-run every refresh. The judgement part is deciding what a duplicate means — Remove Duplicates on the selected columns only, so removing on the whole row and removing on a key column give very different results.",
    detail:
      "**Nulls**\n\n| Option | When |\n|---|---|\n| Filter them out | the row is useless without that field |\n| Replace Values | a null genuinely means zero or 'Unknown' |\n| Fill Down | a hierarchical export where blanks mean 'same as above' |\n| Keep them | the missingness itself is information |\n\nFill Down is the one people forget and it is enormously useful on exports where a category is printed only on its first row.\n\n**Duplicates**\n\nRemove Duplicates operates on the **currently selected columns**. Selecting one key column removes rows sharing that key, keeping the first. Selecting nothing (all columns) removes only fully identical rows. Those are different operations and confusing them silently deletes real data.\n\n**Before removing, inspect**\n\nGroup By the key with a Count, filter to count > 1, and look at what you would be deleting. Two orders from the same customer on the same day may be perfectly genuine.\n\n**Which occurrence is kept?**\n\nRemove Duplicates keeps the first row *in the current sort order*, which is not guaranteed to be meaningful. If you need the latest record, sort descending by date first — and be aware that Power Query's sort stability across a refresh is not something to rely on for correctness. The safer construction is Group By the key with an aggregation of `Max(Date)` and then merge back.\n\n**Where to do it**\n\nUpstream if you can. If the source database can deduplicate, let it — that keeps folding intact and reduces what crosses the network.",
    mistakes: [
      "Removing duplicates on all columns when a key duplicate was meant, or vice versa.",
      "Replacing nulls with 0 by reflex, which changes every average.",
      "Relying on row order to keep the 'right' duplicate.",
    ],
    followUps: [
      "How would you keep the most recent record per customer instead of the first?",
      "When would you keep the nulls?",
    ],
    tags: ["nulls", "duplicates", "Power Query", "cleaning", "fill down"],
    related: ["pbi-c-powerquery-pbi", "xl-q-identify-duplicates", "xl-q-missing-values"],
    sources: [GFG_PBI],
  }),
  q({
    id: "pbi-q-conditional-column",
    category: "Power Query",
    title: "How do you add a conditional column?",
    difficulty: "Easy",
    q: "You want to add a new column that says \"Pass\" if marks are above 40 and \"Fail\" otherwise. How would you do this?",
    hint: "There are three places you could do it. Say which is best and why.",
    answer:
      "Power Query is the right place: Add Column → Conditional Column, set the rule marks > 40 → \"Pass\", otherwise \"Fail\". Under the hood that generates M using an if/then/else expression. You could also write it as a DAX calculated column, but Power Query is preferable because the value is fixed row-level data — computing it once at refresh means it compresses into the model like any other source column, rather than being evaluated by the DAX engine.",
    detail:
      "**The three options, ranked**\n\n1. **Power Query conditional column** — best. Computed at refresh, compresses well, and the logic is visible in Applied Steps.\n2. **DAX calculated column** — works, but the value is static anyway so there is no benefit to computing it in DAX, and it adds to model size without the same compression story.\n3. **A measure** — wrong for this. Pass/Fail is a row attribute you want to slice *by*, and you cannot slice by a measure.\n\nThat third point is the one worth stating: if the result needs to appear on an axis or in a slicer, it must be a column, not a measure.\n\n**The M behind it**\n\n```\n= Table.AddColumn(Source, \"Result\", each if [Marks] > 40 then \"Pass\" else \"Fail\", type text)\n```\n\nWriting it by hand rather than through the dialog lets you handle cases the dialog cannot, such as nulls:\n\n```\neach if [Marks] = null then \"No result\"\n     else if [Marks] > 40 then \"Pass\"\n     else \"Fail\"\n```\n\n**The null trap**\n\nIn M, `null > 40` evaluates to null, not false — so a naive two-branch condition sends nulls down the \"Fail\" path silently. Handling null explicitly first is the correct construction and a genuinely good detail to raise.\n\n**Better still**\n\nIf the pass mark might change, put it in a parameter or a small reference table rather than hardcoding 40. Then the threshold is data, not logic.",
    code: [
      { lang: "M", label: "Conditional column, null-safe", code: "= Table.AddColumn(Source, \"Result\", each\n    if [Marks] = null then \"No result\"\n    else if [Marks] > 40 then \"Pass\"\n    else \"Fail\", type text)" },
      { lang: "DAX", label: "The calculated-column alternative", code: "Result = IF( ISBLANK(Marks[Marks]), \"No result\", IF( Marks[Marks] > 40, \"Pass\", \"Fail\" ) )" },
    ],
    mistakes: [
      "Writing it as a measure, which cannot be used on an axis or in a slicer.",
      "Not handling nulls, which silently fall into the else branch.",
      "Hardcoding the threshold when it might change.",
    ],
    followUps: [
      "What happens to rows where Marks is null?",
      "Why not make this a measure?",
    ],
    tags: ["conditional column", "Power Query", "M", "calculated column"],
    related: ["pbi-c-powerquery-pbi", "pbi-q-measure-vs-column", "pbi-q-dax-vs-m"],
    sources: [GFG_PBI],
  }),

  // =========================================================== MODELING
  q({
    id: "pbi-q-data-modeling",
    category: "Modeling",
    title: "What is data modelling in Power BI?",
    difficulty: "Medium",
    q: "What is data modelling in Power BI and how do relationships work within it?",
    hint: "It is about how tables relate and how filters travel between them.",
    answer:
      "Data modelling is organising your tables and defining how they relate, so that filtering one table correctly filters the others. Relationships are built on matching key columns and carry a cardinality — normally one-to-many, from a dimension with unique keys to a fact table with repeats — and a cross-filter direction, normally single. When a user selects a product, the filter flows from the Product dimension down to the Sales fact, and every measure over Sales is automatically restricted. The recommended shape is a star schema: one fact table surrounded by dimensions.",
    detail:
      "**Filter propagation is the core idea**\n\nFilters travel from the **one** side to the **many** side by default. Selecting `Product[Category] = \"Bikes\"` filters `Sales` to bike rows, and every measure over Sales reflects that automatically. This is why you never need to write a join in a measure — the model already knows.\n\n**Why star, not flat**\n\nA single flat table seems simpler but breaks down quickly: it compresses badly (repeated dimension values in every fact row), it cannot support a shared date dimension, and there is no clean way to filter one part of the model from another. The star exists because the engine is built for it.\n\n**Relationship properties**\n\n- **Cardinality** — one-to-many is the healthy default. Many-to-many is a warning sign of a missing bridge table.\n- **Cross-filter direction** — single by default. Bidirectional is the most common source of an unpredictable model, because multiple filter paths become possible.\n- **Active/inactive** — only one active path between two tables; extras are activated per measure with `USERELATIONSHIP`.\n\n**The date dimension**\n\nA separate marked date table is mandatory for time intelligence, and it lets several fact tables share one calendar. Using each fact's own date column is the single most common modelling error.\n\n**What good looks like**\n\nA reviewer should be able to open Model view and see a recognisable star: facts in the middle, dimensions around them, single-direction arrows, no diagonal relationships between dimensions. If it looks like a spider web, something is wrong.",
    mistakes: [
      "Loading one flat table and calling it a model.",
      "Bidirectional relationships used to patch a filtering problem.",
      "No dedicated date dimension.",
    ],
    followUps: [
      "Why is a star schema preferred?",
      "What would you do with two date columns on the same fact table?",
    ],
    tags: ["data modeling", "relationships", "star schema", "filter propagation"],
    related: ["pbi-c-star-schema", "pbi-c-relationships", "pbi-q-star-vs-snowflake"],
    sources: [GFG_PBI],
  }),
  q({
    id: "pbi-q-star-vs-snowflake",
    category: "Modeling",
    title: "Star schema vs snowflake schema",
    difficulty: "Medium",
    q: "What is a star schema versus a snowflake schema, and why does Power BI recommend a star schema?",
    hint: "Give the shapes, then three engine-level reasons rather than 'best practice'.",
    answer:
      "A star schema has one fact table joined directly to denormalised dimension tables — Product holds category and subcategory as columns. A snowflake normalises those dimensions into separate tables, so Product joins to Subcategory joins to Category. Power BI recommends the star for three engine-level reasons: VertiPaq compresses denormalised dimensions extremely well, filters propagate in one hop instead of several, and DAX filter context behaves predictably over a star and becomes hard to reason about otherwise.",
    detail:
      "**The shapes**\n\n```\nSTAR                          SNOWFLAKE\n  Date                          Date\n    |                             |\nProduct — Sales — Customer    Product — Sales — Customer\n                                 |\n                            Subcategory\n                                 |\n                             Category\n```\n\n**The three reasons, in order of weight**\n\n1. **Compression.** VertiPaq compresses column by column. A denormalised Product dimension with repeated category strings compresses to almost nothing because there are few distinct values. Normalising to save storage optimises for a problem the engine does not have.\n2. **Filter propagation.** Every extra hop is another relationship the filter must traverse at query time. A star is one hop from any dimension to the fact.\n3. **DAX predictability.** `CALCULATE`, context transition and the `ALL` family are all easiest to reason about when every dimension has a direct path to the fact.\n\n**When a snowflake is acceptable**\n\nVery large dimensions where the normalised form genuinely saves meaningful memory, or a dimension shared by facts at different grains. Both are uncommon. If you snowflake, do it deliberately and be able to say why.\n\n**Where the normalisation belongs**\n\nThird normal form is right for a transactional source system, where write consistency matters. An analytical model has different priorities: read speed and query simplicity. Being able to articulate that OLTP and OLAP optimise for different things is the answer that reads as genuine understanding rather than repetition.",
    mistakes: [
      "Answering 'it is best practice' without any reason.",
      "Carrying a normalised OLTP schema straight into Power BI unchanged.",
      "Confusing which one has more tables — snowflake does.",
    ],
    followUps: [
      "When would a snowflake be acceptable?",
      "Why is 3NF right for a source system but wrong here?",
    ],
    tags: ["star schema", "snowflake", "normalization", "VertiPaq", "modeling"],
    related: ["pbi-c-star-schema", "pbi-q-data-modeling", "xl-q-power-pivot"],
    sources: [GFG_PBI],
  }),
  q({
    id: "pbi-q-cross-filter",
    category: "Modeling",
    title: "Single vs bidirectional cross-filter direction",
    difficulty: "Hard",
    q: "What is cross-filter direction (single vs bidirectional) in relationships, and when should you use each?",
    hint: "Bidirectional is the tempting one. Explain concretely what goes wrong.",
    answer:
      "Cross-filter direction controls which way filters travel across a relationship. Single means filters flow only from the one side to the many side — Product filters Sales, but selecting in Sales does not filter Product. Bidirectional lets filters flow both ways. Single should be the default; bidirectional introduces ambiguity, because with several bidirectional relationships the engine can find more than one path between two tables and either refuses to resolve the model or produces results nobody can explain.",
    detail:
      "**The legitimate reason people reach for it**\n\nA slicer built on a dimension shows every value, including ones with no matching facts — every product, even those never sold. Bidirectional filtering makes the slicer show only products that appear in Sales.\n\n**The better fixes**\n\n1. Filter the slicer visual itself to exclude blanks.\n2. Use `CROSSFILTER` inside the specific measure that needs it, so the change is scoped to one calculation rather than the whole model.\n3. Reconsider the model — often the dimension contains rows it should not.\n\nOption 2 is the answer that impresses, because it shows you know the effect can be scoped:\n\n```\nCALCULATE( [Revenue], CROSSFILTER( Sales[ProductKey], Product[ProductKey], BOTH ) )\n```\n\n**What actually goes wrong**\n\nWith two bidirectional relationships in a chain, a filter on table A can reach table C by two different routes. The results depend on evaluation order, which is not something you control. In a large model this produces numbers that are wrong intermittently and are extremely hard to debug — the worst failure mode there is.\n\n**The security consequence**\n\nBidirectional filtering can leak data past a row-level security filter, because the filter can travel a path RLS did not anticipate. In a model with RLS, bidirectional relationships should be treated as a security issue, not a convenience.\n\n**The rule to state**\n\nSingle by default; bidirectional only for a deliberate, documented reason; and prefer `CROSSFILTER` in one measure over changing the model for everyone.",
    code: [
      { lang: "DAX", label: "Scope bidirectional behaviour to one measure", code: "Products Sold =\nCALCULATE(\n    DISTINCTCOUNT( Product[ProductKey] ),\n    CROSSFILTER( Sales[ProductKey], Product[ProductKey], BOTH )\n)" },
    ],
    mistakes: [
      "Enabling bidirectional filtering to fix a slicer, changing the whole model for one visual.",
      "Not knowing CROSSFILTER exists as a scoped alternative.",
      "Combining bidirectional relationships with RLS.",
    ],
    followUps: [
      "How would you make a slicer hide unused values without going bidirectional?",
      "Why is bidirectional filtering a problem when RLS is in place?",
    ],
    tags: ["cross-filter", "bidirectional", "relationships", "CROSSFILTER", "RLS"],
    related: ["pbi-c-relationships", "pbi-c-rls", "pbi-q-relationships"],
    sources: [GFG_PBI],
  }),
  q({
    id: "pbi-q-relationships",
    category: "Modeling",
    title: "How do you connect two tables?",
    difficulty: "Easy",
    q: "You have two tables, Customers and Orders. How do you connect them?",
    hint: "Model relationship, not a merge. Say why.",
    answer:
      "Create a relationship in Model view by dragging CustomerID from Customers onto CustomerID in Orders. Power BI will detect it as one-to-many — Customers is the one side because CustomerID is unique there — with single cross-filter direction from Customers to Orders. That is preferable to merging the tables in Power Query, because a relationship preserves the star schema, keeps the model compressed, and lets filters propagate rather than duplicating customer attributes onto every order row.",
    detail:
      "**Relationship, not merge**\n\nMerging customer columns into Orders creates a flat table. It works, but it repeats every customer's name and city on every one of their orders, which compresses worse and makes the customer list unavailable as an independent dimension. Relationships are the answer whenever the two tables are a fact and a dimension.\n\n**Requirements for the relationship**\n\n- The key must be **unique on the one side**. If CustomerID repeats in Customers, Power BI refuses one-to-many and offers many-to-many, which is a signal your dimension has a data-quality problem.\n- Data types must match — a text key on one side and a whole number on the other will not join.\n- Blank or null keys create a blank row in the dimension, which appears in visuals as an empty category. Handle unmatched facts explicitly with an \"Unknown\" member rather than letting blanks appear.\n\n**Auto-detect**\n\nPower BI guesses relationships on load by matching column names. It is often right and sometimes confidently wrong, so check Model view rather than trusting it. Turning off auto-detect in Options is common practice on serious models.\n\n**Checking it works**\n\nDrop Customer[City] on rows and a Sales measure in values. If every row shows the same grand total, the relationship is missing or inactive — that is the fastest diagnostic and worth naming.",
    mistakes: [
      "Merging in Power Query when a relationship was the right answer.",
      "Trusting auto-detected relationships without checking Model view.",
      "Ignoring blank keys, which surface as an empty category in every visual.",
    ],
    followUps: [
      "What if CustomerID is not unique in the Customers table?",
      "How would you tell, from a visual, that a relationship is missing?",
    ],
    tags: ["relationships", "one-to-many", "model", "keys"],
    related: ["pbi-c-relationships", "pbi-q-merge-vs-append-pbi", "pbi-q-data-modeling"],
    sources: [GFG_PBI],
  }),
  q({
    id: "pbi-q-userelationship",
    category: "Modeling",
    title: "Two date columns, one date table",
    difficulty: "Hard",
    q: "Your Sales table has both an OrderDate and a ShipDate. How do you analyse by both using a single date dimension?",
    hint: "Only one relationship can be active. There is a function for the other one.",
    answer:
      "Create both relationships to the date table. Power BI will make one active — say OrderDate — and store the other as inactive, shown as a dotted line. Then write measures that activate the inactive relationship when needed, using USERELATIONSHIP inside CALCULATE. That way one date dimension serves both roles, slicers behave consistently, and you avoid the alternative of duplicating the date table.",
    detail:
      "**Why not just build a second date table?**\n\nIt works, and it is sometimes the right answer, but it has real costs: two date slicers on the page confusing readers, two sets of time-intelligence measures to maintain, and no way to filter both roles from a single selection. `USERELATIONSHIP` keeps one calendar and one slicer.\n\n**The measures**\n\n```\nRevenue (Order Date) = [Total Revenue]          -- uses the active relationship\n\nRevenue (Ship Date) =\nCALCULATE( [Total Revenue],\n    USERELATIONSHIP( Sales[ShipDate], 'Date'[Date] ) )\n```\n\nOne measure per role. The active relationship needs nothing special.\n\n**Constraints on USERELATIONSHIP**\n\n- It must be inside `CALCULATE` (or a CALCULATE-family function). It is a modifier, not a standalone function.\n- The relationship must already exist as inactive; it cannot create one.\n- It does not work over a Live Connection to a model you do not own, and it has limitations in DirectQuery.\n\n**When the second date table IS right**\n\nIf users need to slice by order date and ship date *simultaneously* — \"orders placed in Q1 that shipped in Q2\" — one date table cannot do it, because a single slicer selection cannot mean two different things at once. That scenario genuinely needs a second, role-playing date dimension. Recognising when `USERELATIONSHIP` is not enough is the senior-level part of this answer.\n\n**The name for this**\n\nA dimension used in more than one role against the same fact is a *role-playing dimension*. Using the term correctly signals warehouse modelling background.",
    code: [
      { lang: "DAX", label: "Activate the ship-date relationship", code: "Revenue by Ship Date =\nCALCULATE(\n    [Total Revenue],\n    USERELATIONSHIP( Sales[ShipDate], 'Date'[Date] )\n)" },
    ],
    mistakes: [
      "Building two date tables by reflex without considering USERELATIONSHIP.",
      "Using USERELATIONSHIP outside CALCULATE.",
      "Not recognising the case where one date table genuinely cannot work.",
    ],
    followUps: [
      "When would a second date table actually be necessary?",
      "What is a role-playing dimension?",
    ],
    tags: ["USERELATIONSHIP", "role-playing dimension", "inactive relationship", "date table"],
    related: ["pbi-c-relationships", "pbi-c-time-intelligence", "pbi-q-date-table"],
    sources: [GH_AWESOME],
  }),
  q({
    id: "pbi-q-date-table",
    category: "Modeling",
    title: "How do you create a date table, and why do you need one?",
    difficulty: "Medium",
    q: "How do you create a Date/Calendar table in Power BI using DAX, and why is one necessary?",
    hint: "CALENDAR or CALENDARAUTO, plus ADDCOLUMNS. The 'why' matters more than the syntax.",
    answer:
      "Generate it with CALENDAR or CALENDARAUTO wrapped in ADDCOLUMNS to attach year, month, quarter and sort columns, then mark it as a date table in the Modeling tab. It is necessary because every time-intelligence function requires a contiguous date table with one row per day and no gaps — using the fact table's own date column means periods with no transactions simply vanish rather than showing zero, and shared filtering across several fact tables becomes impossible.",
    detail:
      "**The DAX**\n\n```\nDate =\nADDCOLUMNS(\n    CALENDAR( DATE(2020,1,1), DATE(2026,12,31) ),\n    \"Year\",      YEAR([Date]),\n    \"MonthNo\",   MONTH([Date]),\n    \"Month\",     FORMAT([Date], \"MMM\"),\n    \"Quarter\",   \"Q\" & QUARTER([Date]),\n    \"YearMonth\", FORMAT([Date], \"YYYY-MM\")\n)\n```\n\n`CALENDARAUTO()` derives the range from the model's own date columns automatically, which is convenient but can produce a surprisingly wide range if any table contains a stray far-future date.\n\n**Sort by column — the step people forget**\n\nA `Month` column of text sorts alphabetically: Apr, Aug, Dec. Select the Month column → Sort by Column → MonthNo. Without this every chart's month axis is wrong, and it is one of the most common visible defects in a first Power BI report.\n\n**Mark as Date Table**\n\nModeling → Mark as Date Table, choosing the date column. This tells the engine the table is a proper calendar and enables the time-intelligence functions to behave correctly, particularly around filter removal on the date table.\n\n**Requirements**\n\n- One row per day, contiguous, no gaps.\n- Covers the full span of every fact table's dates, and complete years at both ends — a partial year breaks year-to-date.\n- A unique date column of Date type.\n\n**Power Query as the alternative**\n\nA date table can equally be built in M, or loaded from a warehouse's existing calendar dimension. If the organisation already has one with fiscal periods and holiday flags, use it rather than generating your own — consistency with the rest of the business matters more than elegance.\n\n**Turn off Auto Date/Time**\n\nPower BI silently creates a hidden date table for *every* date column in the model unless you disable this in Options. On a model with a dozen date columns that is real memory wasted, and it is one of the quickest performance wins available.",
    code: [
      { lang: "DAX", label: "Date dimension", code: "Date =\nADDCOLUMNS(\n    CALENDAR( DATE(2020,1,1), DATE(2026,12,31) ),\n    \"Year\",    YEAR([Date]),\n    \"MonthNo\", MONTH([Date]),\n    \"Month\",   FORMAT([Date], \"MMM\"),\n    \"Quarter\", \"Q\" & QUARTER([Date])\n)" },
    ],
    mistakes: [
      "Forgetting Sort by Column, so months sort alphabetically.",
      "Not marking it as a date table.",
      "A range that does not cover complete years, breaking YTD.",
      "Leaving Auto Date/Time enabled.",
    ],
    followUps: [
      "Why do your months appear in alphabetical order?",
      "What does Auto Date/Time cost you?",
    ],
    tags: ["date table", "CALENDAR", "time intelligence", "sort by column", "Auto Date/Time"],
    related: ["pbi-c-time-intelligence", "pbi-c-star-schema", "pbi-q-time-intelligence"],
    sources: [GFG_PBI],
  }),
  q({
    id: "pbi-q-measure-vs-column",
    category: "Modeling",
    title: "Calculated column vs measure vs calculated table",
    difficulty: "Medium",
    q: "What is the difference between calculated columns, calculated tables and measures?",
    hint: "Evaluation time and storage. Then give the rule of thumb for choosing.",
    answer:
      "A calculated column is evaluated once per row at refresh and stored in the model, so it costs memory but can be used on an axis or in a slicer. A measure is evaluated at query time for each cell of each visual, is not stored, and responds to filter context. A calculated table is evaluated at refresh and stored, typically used for date dimensions or bridge tables. The rule of thumb is: if you need to slice by it, it is a column; if you need to aggregate it, it is a measure — and default to measures, because they keep the model smaller and more flexible.",
    detail:
      "**The comparison**\n\n| | Calculated column | Measure | Calculated table |\n|---|---|---|---|\n| When evaluated | refresh, row by row | query time, per cell | refresh |\n| Stored | yes | no | yes |\n| Sees filter context | no | yes | no |\n| Usable on an axis / slicer | yes | no | n/a |\n| Memory cost | real | negligible | real |\n\n**Why a measure is usually right for a ratio**\n\nMargin as a calculated column computes per row and then has to be *averaged* in a visual — which gives the wrong answer at every subtotal, because the average of ratios is not the ratio of totals. As a measure it is recomputed from the totals in each cell's filter context and is correct at every level. This is the same principle as never averaging a percentage in Excel.\n\n**When a calculated column is genuinely right**\n\n- A category you need on an axis or in a slicer.\n- A static row-level attribute, such as a price band.\n- A sort key.\n\nAnd even then: if the value could be computed in Power Query, do it there. A calculated column is the right answer mainly when the calculation depends on the *model* — on a relationship, or on `RELATED` — which Power Query cannot see.\n\n**That is the sharpest version of the rule**\n\nPower Query for anything derivable from the source row. Calculated column when it needs the model. Measure when it needs the filter context.",
    code: [
      { lang: "DAX", label: "Wrong — column then averaged", code: "Margin % = DIVIDE( Sales[Revenue] - Sales[Cost], Sales[Revenue] )   -- averaging this is wrong" },
      { lang: "DAX", label: "Right — measure, correct at every level", code: "Margin % := DIVIDE( SUM(Sales[Revenue]) - SUM(Sales[Cost]), SUM(Sales[Revenue]) )" },
    ],
    mistakes: [
      "Creating calculated columns for aggregations.",
      "Averaging a ratio stored in a calculated column.",
      "Using a calculated column where Power Query would be cheaper.",
    ],
    followUps: [
      "Why is an averaged margin column wrong at the subtotal?",
      "When would a calculated column beat a Power Query column?",
    ],
    tags: ["measure", "calculated column", "calculated table", "DAX", "modeling"],
    related: ["pbi-c-dax-intro", "pbi-q-dax", "pbi-q-conditional-column", "xl-q-weighted-average"],
    sources: [GFG_PBI],
  }),
  q({
    id: "pbi-q-import-vs-directquery",
    category: "Modeling",
    title: "Import vs DirectQuery vs Live Connection",
    difficulty: "Hard",
    q: "What is the difference between Import, DirectQuery and Live Connection modes?",
    hint: "Compare on freshness, performance, size limit and DAX availability.",
    answer:
      "Import copies data into the in-memory VertiPaq engine — fastest queries and full DAX, but the data is only as current as the last refresh and the model must fit in memory. DirectQuery stores no data and queries the source on every interaction — always current and effectively unlimited in size, but every click is a round trip and many DAX functions are restricted. Live Connection points at an existing Analysis Services or published Power BI model, so you consume someone else's model and cannot add your own relationships or calculated columns.",
    detail:
      "**The comparison**\n\n| | Import | DirectQuery | Live Connection |\n|---|---|---|---|\n| Data stored locally | yes | no | no |\n| Freshness | as of last refresh | real time | real time |\n| Query speed | fastest | depends on source | depends on source |\n| Size limit | model must fit in memory | none | n/a |\n| Full DAX | yes | restricted | measures only, no model changes |\n| Can add relationships | yes | yes | **no** |\n| Needs refresh | yes | no | no |\n\n**Choosing**\n\nDefault to **Import**. It is faster, cheaper on the source system, and imposes no DAX restrictions. Reach for **DirectQuery** only when the data genuinely must be real time, or is too large to import, or governance forbids copying it. Use **Live Connection** when the organisation has a governed enterprise model and you should be consuming it rather than rebuilding it.\n\n**The DirectQuery cost people underestimate**\n\nEvery visual on a page is at least one query to the source, on every interaction. A page with ten visuals generates ten queries each time someone moves a slicer. If the source is a busy transactional database, your report becomes a load problem for someone else — which is a conversation worth having before choosing it.\n\n**Composite models**\n\nSince composite models you can mix per table: a huge fact in DirectQuery, small dimensions Imported, and dimensions set to **Dual** so they can serve either. Adding **aggregation** tables on top lets most queries hit an in-memory summary and fall through to DirectQuery only for detail. That is the modern answer to \"real time and large\".\n\n**The Live Connection limitation to state**\n\nYou can still write report-level measures, but you cannot add tables, relationships or calculated columns. Candidates often discover this mid-project.",
    mistakes: [
      "Choosing DirectQuery for 'freshness' without considering the load on the source.",
      "Not knowing Live Connection blocks model changes.",
      "Missing composite models as the way to have both.",
    ],
    followUps: [
      "The data is a billion rows and must be near real time. What do you do?",
      "What can't you do on a Live Connection?",
    ],
    tags: ["Import", "DirectQuery", "Live Connection", "composite model", "storage mode"],
    related: ["pbi-c-storage-modes", "pbi-q-composite-model", "pbi-c-performance"],
    sources: [GFG_PBI],
  }),
  q({
    id: "pbi-q-composite-model",
    category: "Modeling",
    title: "What is a composite model?",
    difficulty: "Hard",
    q: "What is a Composite Model in Power BI, and what is Dual storage mode?",
    hint: "It mixes storage modes per table. Dual is the clever bit.",
    answer:
      "A composite model lets different tables in one model use different storage modes — a huge fact table left in DirectQuery while small dimensions are Imported. Dual is a third mode for dimension tables: the engine decides per query whether to treat the table as Imported or DirectQuery, depending on which other tables the query touches. That matters because a DirectQuery fact joined to an Imported dimension would otherwise force a slow cross-source join.",
    detail:
      "**Why Dual exists**\n\nIf a dimension is purely Imported and the fact is DirectQuery, any query joining them must combine an in-memory table with a remote one — expensive. If the dimension is purely DirectQuery, then even a simple slicer listing its values has to hit the source. Dual resolves this: the same table is materialised in memory *and* available in the source, and the engine picks per query.\n\nSo the standard composite pattern is:\n\n| Table | Mode |\n|---|---|\n| Large fact | DirectQuery |\n| Dimensions | **Dual** |\n| Aggregation table | Import |\n\n**Aggregations**\n\nAn aggregation table is a pre-summarised Import table — say revenue by date and product — mapped to the detailed DirectQuery fact. Power BI checks whether a query can be answered from the aggregation; if yes it answers in memory in milliseconds, and if not it silently falls through to DirectQuery. Users never see the difference; they just get fast summaries and slower drill-through.\n\n**The other use of composite models**\n\nSince DirectQuery over Power BI semantic models, you can build a composite model that extends someone else's published enterprise model with your own local tables. That solves the old Live Connection frustration where you could not add anything at all.\n\n**Caveats worth stating**\n\n- Governance gets harder: a model spanning several sources has several refresh and permission stories.\n- RLS across a composite model needs care, because the security context has to reach the DirectQuery source.\n- It is a genuinely advanced feature; reaching for it before Import has actually failed is over-engineering.",
    mistakes: [
      "Setting dimensions to Import rather than Dual in a DirectQuery model.",
      "Using a composite model when a plain Import model would have fitted.",
      "Overlooking the RLS complexity it introduces.",
    ],
    followUps: [
      "Why is Dual better than Import for a dimension here?",
      "How do aggregations fit in?",
    ],
    tags: ["composite model", "Dual", "aggregations", "DirectQuery", "storage mode"],
    related: ["pbi-c-storage-modes", "pbi-q-import-vs-directquery", "pbi-c-performance"],
    sources: [GFG_PBI],
  }),
];
