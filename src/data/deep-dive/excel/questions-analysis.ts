import { common, gfg, github, questionsFor, URLS } from "../helpers";
import type { DeepDiveItem } from "../types";

const q = questionsFor("DATA", "excel");

const GFG_EXCEL = gfg(
  "200 Excel Interview Questions & Answers: Beginner to Expert",
  URLS.gfgExcel,
  "Question published in the GeeksforGeeks Excel interview question list.",
);
const GFG_EXCEL_DA = gfg(
  "Top Excel Interview Questions for Data Analysis",
  URLS.gfgExcelDA,
  "Question published in the GeeksforGeeks Excel-for-data-analysis interview list.",
);
const GH_DA = github(
  "mandipdevnath/Data-Analyst-Interview-Questions",
  URLS.ghDataAnalyst,
  "Question appears in a public GitHub collection of data analyst interview questions.",
);

/** Cleaning, validation, pivots, charts, Power Query, advanced and business analysis. */
export const EXCEL_QUESTIONS_ANALYSIS: DeepDiveItem[] = [
  // =========================================================== DATA CLEANING
  q({
    id: "xl-q-clean-data",
    category: "Data Cleaning",
    title: "How do you clean and prepare data for analysis?",
    difficulty: "Medium",
    q: "How do you use Excel to clean and prepare data for analysis?",
    hint: "Give a sequence, not a feature list. The order is what is being graded.",
    answer:
      "I profile first — row count, blanks per column, distinct values, min and max — because you cannot clean what you have not measured. Then fix data types, since everything downstream depends on numbers being numbers and dates being dates. Then normalise whitespace and case, handle duplicates deliberately, decide explicitly what to do with missing values, and finally add validation so the problem does not recur. For anything that arrives repeatedly I do all of it in Power Query, so the steps are recorded and re-run on refresh rather than repeated by hand.",
    detail:
      "**The sequence, with the tool at each step**\n\n1. **Profile** — `=COUNTA()`, `=COUNTBLANK()`, `=COUNTA(UNIQUE(range))`, MIN/MAX. In Power Query, the Column Quality and Column Distribution panes do this for you.\n2. **Fix types** — text-stored numbers via `VALUE()` or Text to Columns; text-stored dates via `DATEVALUE()`. Diagnose with alignment: real numbers and dates right-align.\n3. **Whitespace and case** — `TRIM(CLEAN(SUBSTITUTE(A2,CHAR(160),\" \")))`, and PROPER/UPPER where category labels should match.\n4. **Duplicates** — flag with `COUNTIF` before deleting. Decide whether duplicate means whole-row or key-column, and whether it is a genuine repeat transaction.\n5. **Missing values** — leave blank, impute, or exclude. Say which and why; each biases differently.\n6. **Outliers** — identify with IQR or z-score, investigate, do not silently delete.\n7. **Validate** — Data Validation rules so bad data cannot be entered next time.\n8. **Document** — Power Query's Applied Steps are self-documenting; a manual clean is not.\n\n**What separates a good answer**\n\nTwo things. First, profiling before acting — most candidates start at step 3. Second, naming Power Query at the end, which reframes cleaning as building a pipeline rather than doing a chore.\n\n**Interview trap**\n\nIf asked what you do with missing values, do not answer 'fill with zero'. Zero is a value; it drags averages down and is a real answer only when zero is genuinely what the blank means.",
    mistakes: [
      "Listing features with no order or reasoning.",
      "Deleting duplicates before checking whether they are legitimate.",
      "Cleaning by hand something that arrives every month.",
    ],
    followUps: [
      "How would you decide between imputing and excluding missing values?",
      "Which of these steps would you move into Power Query?",
    ],
    tags: ["data cleaning", "profiling", "Power Query", "workflow"],
    related: ["xl-c-cleaning-workflow", "xl-q-missing-values", "xl-q-trim", "xl-q-power-query"],
    sources: [GFG_EXCEL_DA],
  }),
  q({
    id: "xl-q-missing-values",
    category: "Data Cleaning",
    title: "How do you handle missing or null values?",
    difficulty: "Medium",
    q: "How do you identify and handle missing or null values in a dataset, for numerical and categorical columns?",
    hint: "The answer is a decision, not a technique. State the options and what each costs.",
    answer:
      "First quantify: COUNTBLANK per column, and what share of rows that is. Then decide, and the decision differs by column type. For numerical columns the options are leave blank, impute with mean or median, or exclude the row — median is safer than mean when the column is skewed. For categorical columns, impute with the mode or, better, add an explicit \"Unknown\" category so the missingness stays visible. The choice depends on whether the data is missing at random; if the blanks are systematic, imputing hides the pattern that mattered.",
    detail:
      "**Quantify first**\n\n`=COUNTBLANK(B2:B1000)` per column, and `=COUNTBLANK(...)/COUNT($A$2:$A$1000)` as a share. 2% missing and 40% missing are entirely different problems.\n\n**Numerical columns**\n\n| Option | When | Cost |\n|---|---|---|\n| Leave blank | Excel's AVERAGE ignores blanks correctly | some functions treat blank as 0 |\n| Median | skewed data | flattens variance |\n| Mean | roughly symmetric data | pulled by outliers |\n| Forward-fill | time series with carry-forward meaning | fabricates continuity |\n| Exclude row | few rows, missing at random | loses other columns' data |\n\n**Categorical columns**\n\nMode imputation quietly inflates the most common category. Adding an explicit `\"Unknown\"` level is usually better: the missingness remains countable, and if `\"Unknown\"` turns out to correlate with the outcome, you have found something.\n\n**The point interviewers are listening for**\n\nWhether the data is *missing at random*. If sales are blank only for one region because that region's file did not load, imputing the overall mean invents revenue that never existed and hides an ingestion bug. The right move is to investigate the pattern before choosing a treatment.\n\n**The blank-versus-zero trap**\n\nAVERAGE ignores blanks but includes zeros. Replacing blanks with 0 changes the average. That single fact is why 'fill with zero' is the wrong reflex answer.\n\n**Mechanics**\n\nF5 → Special → Blanks selects every empty cell at once, which is how you fill or highlight them in bulk. In Power Query, Replace Values and Fill Down do the same as recorded steps.",
    code: [
      { lang: "Excel", label: "Share of rows missing", code: "=COUNTBLANK(B2:B1000) / ROWS(B2:B1000)" },
      { lang: "Excel", label: "Median imputation, guarded", code: "=IF(B2=\"\", MEDIAN($B$2:$B$1000), B2)" },
    ],
    mistakes: [
      "Filling numeric blanks with 0 by default, which biases every average downward.",
      "Imputing without checking whether the missingness is systematic.",
      "Using the mean on a skewed column.",
    ],
    followUps: [
      "One region's sales are entirely blank. Do you impute? Why not?",
      "Why is median often safer than mean here?",
    ],
    tags: ["missing values", "imputation", "data quality", "COUNTBLANK"],
    related: ["xl-c-cleaning-workflow", "xl-q-clean-data", "xl-q-outliers"],
    sources: [GFG_EXCEL_DA, GH_DA],
  }),
  q({
    id: "xl-q-outliers",
    category: "Data Cleaning",
    title: "How do you deal with outliers?",
    difficulty: "Medium",
    q: "How do you deal with outliers?",
    hint: "Detect, investigate, then decide. Deleting is the last option, not the first.",
    answer:
      "Detect them with a rule rather than by eye — the IQR rule flags anything below Q1 − 1.5×IQR or above Q3 + 1.5×IQR, and a z-score above about 3 is the alternative for roughly normal data. Then investigate before acting: an outlier is either a data error, a genuine extreme, or a sign that the population is really two populations. Only the first justifies removal. For genuine extremes the options are winsorising, transforming, or reporting the median alongside the mean.",
    detail:
      "**Detection in Excel**\n\n```\nQ1  = QUARTILE.INC(range, 1)\nQ3  = QUARTILE.INC(range, 3)\nIQR = Q3 - Q1\nflag = OR(x < Q1 - 1.5*IQR, x > Q3 + 1.5*IQR)\n```\n\nA box plot renders exactly this rule visually, which makes it a good chart to name.\n\n**The three explanations, and what each implies**\n\n1. **Data error** — a decimal point in the wrong place, a unit mix-up, a sentinel value like 9999 meaning 'unknown'. Fix or remove.\n2. **Genuine extreme** — one enormous corporate order in a retail dataset. It is real. Removing it makes your analysis wrong, not cleaner.\n3. **Mixed populations** — B2B and B2C transactions in one table. The outliers are a *segment*. Split the analysis; this is the most interesting outcome and the one candidates miss.\n\n**Treatments short of deletion**\n\n- **Winsorise** — cap at the 1st and 99th percentile. Keeps the row, limits the influence.\n- **Log transform** — for right-skewed data such as income or order value.\n- **Report robust statistics** — median and IQR rather than mean and standard deviation.\n- **Segment** — analyse separately.\n\n**What to say out loud**\n\n\"I would not delete it until I knew what it was.\" Interviewers are testing judgement here, not the formula. Deleting inconvenient data is the failure mode this question exists to detect.",
    code: [
      { lang: "Excel", label: "IQR flag", code: "=OR(B2 < QUARTILE.INC(B:B,1) - 1.5*(QUARTILE.INC(B:B,3)-QUARTILE.INC(B:B,1)),\n    B2 > QUARTILE.INC(B:B,3) + 1.5*(QUARTILE.INC(B:B,3)-QUARTILE.INC(B:B,1)))" },
      { lang: "Excel", label: "Z-score", code: "=ABS((B2 - AVERAGE(B:B)) / STDEV.S(B:B)) > 3" },
    ],
    mistakes: [
      "Deleting outliers as a routine cleaning step.",
      "Using a z-score rule on heavily skewed data, where it flags far too much.",
      "Missing that the outliers are a distinct segment.",
    ],
    followUps: [
      "Your outliers all come from one customer type. What does that tell you?",
      "When would you winsorise rather than remove?",
    ],
    tags: ["outliers", "IQR", "z-score", "data quality"],
    related: ["xl-q-missing-values", "xl-c-cleaning-workflow"],
    sources: [GH_DA],
  }),
  q({
    id: "xl-q-identify-duplicates",
    category: "Data Cleaning",
    title: "How do you identify duplicate values in a column?",
    difficulty: "Easy",
    q: "How do you identify duplicate values in an Excel column?",
    hint: "Identify is not the same as remove. Give a way to see them before deleting anything.",
    answer:
      "Conditional Formatting → Highlight Cells Rules → Duplicate Values colours them without changing anything. A formula gives you a reusable flag: =COUNTIF($A$2:$A$1000, A2) > 1 is TRUE for any value appearing more than once. Data → Remove Duplicates deletes them, but only after you have looked — and note it compares only the columns you tick, so whole-row duplicates and key duplicates are different questions.",
    detail:
      "**Identify before you remove**\n\nRemove Duplicates is irreversible once saved and gives you only a count of what it deleted. Highlighting or flagging first lets you check whether the duplicates are genuine repeat transactions — two orders of the same product on the same day are not necessarily an error.\n\n**First occurrence vs all occurrences**\n\nConditional formatting marks every copy including the first. To flag only the *repeats*, make the range expand as it fills down:\n\n`=COUNTIF($A$2:A2, A2) > 1`\n\nThe half-locked reference `$A$2:A2` grows one row at a time, so the first occurrence sees a count of 1 and only later copies are flagged. That distinction is the interesting part of this question.\n\n**Duplicates across several columns**\n\nA row is a duplicate only if the whole key matches. COUNTIFS handles it:\n\n`=COUNTIFS($A$2:$A$1000, A2, $B$2:$B$1000, B2) > 1`\n\n**Extracting them rather than flagging**\n\nOn Microsoft 365: `=UNIQUE(FILTER(A2:A1000, COUNTIF(A2:A1000, A2:A1000) > 1))` returns just the values that repeat — which answers the GitHub-sourced phrasing of this question, 'extract only the duplicate entries to a new column'.\n\n**Removing**\n\nData → Remove Duplicates keeps the first occurrence. Advanced Filter with 'Unique records only' copies distinct values elsewhere without deleting. In Power Query, Remove Duplicates is a recorded step.",
    code: [
      { lang: "Excel", label: "Flag every copy", code: "=COUNTIF($A$2:$A$1000, A2) > 1" },
      { lang: "Excel", label: "Flag only repeats, not the first", code: "=COUNTIF($A$2:A2, A2) > 1" },
      { lang: "Excel", label: "Extract just the duplicated values (365)", code: "=UNIQUE(FILTER(A2:A1000, COUNTIF(A2:A1000, A2:A1000) > 1))" },
    ],
    mistakes: [
      "Running Remove Duplicates before checking whether the duplicates are legitimate.",
      "Not distinguishing key duplicates from whole-row duplicates.",
    ],
    followUps: [
      "How would you flag only the second and later occurrences?",
      "How would you extract the duplicated values into a new column?",
    ],
    tags: ["duplicates", "COUNTIF", "conditional formatting", "Remove Duplicates"],
    related: ["xl-c-cleaning-workflow", "xl-q-count-family", "xl-q-unique"],
    sources: [GFG_EXCEL, GFG_EXCEL_DA, GH_DA],
  }),
  q({
    id: "xl-q-conditional-formatting",
    category: "Data Cleaning",
    title: "Explain conditional formatting",
    difficulty: "Easy",
    q: "Can you explain conditional formatting in Excel?",
    hint: "Cover the rule types, then the formula-based rule, which is the powerful one.",
    answer:
      "Conditional formatting applies formatting automatically when a cell meets a rule. The built-in types cover value comparisons, top/bottom rules, duplicates, and the visual scales — data bars, colour scales and icon sets. The powerful option is a formula-based rule: any formula returning TRUE applies the format, which is how you highlight an entire row based on one column's value. Rules live in Home → Conditional Formatting → Manage Rules, where order and the Stop If True flag matter.",
    detail:
      "**Highlighting a whole row**\n\nThis is the question behind the question. Select the full data range, create a formula rule, and lock only the column:\n\n`=$C2 = \"Overdue\"`\n\nThe `$` before C fixes the column so every cell in the row evaluates the same test; the unlocked row number lets it move down. Getting this reference pattern right is the whole trick — `$C$2` formats one row, `C2` formats a diagonal.\n\n**Rule precedence**\n\nRules are evaluated top to bottom in Manage Rules, and multiple rules can apply at once with later ones layering on top. 'Stop If True' halts evaluation for a cell that matched, which is how you build mutually exclusive bands.\n\n**Visual types**\n\n- **Data bars** — in-cell magnitude bars; good for a ranked list.\n- **Colour scales** — two- or three-colour gradient; good for a heatmap of a matrix.\n- **Icon sets** — arrows or traffic lights; keep the thresholds meaningful rather than the defaults.\n\n**Performance and hygiene**\n\nConditional formatting applied to whole columns, or copied repeatedly, breeds duplicate rules and slows a workbook badly. Manage Rules will show hundreds of near-identical entries in an inherited file; clearing and reapplying to a bounded range is a standard fix.",
    code: [
      { lang: "Excel", label: "Highlight the whole row", code: "=$C2 = \"Overdue\"" },
      { lang: "Excel", label: "Highlight above-average rows", code: "=$D2 > AVERAGE($D$2:$D$1000)" },
    ],
    mistakes: [
      "Using $C$2 instead of $C2, which formats only one row.",
      "Applying rules to entire columns and slowing the workbook.",
    ],
    followUps: ["How do you highlight an entire row based on one cell's value?"],
    tags: ["conditional formatting", "formatting", "rules"],
    related: ["xl-q-identify-duplicates", "xl-q-and-function"],
    sources: [GFG_EXCEL, GFG_EXCEL_DA],
  }),
  q({
    id: "xl-q-validation",
    category: "Data Cleaning",
    title: "What is data validation?",
    difficulty: "Easy",
    q: "What is data validation in Excel?",
    hint: "It is prevention. Name the rule types and the one limitation everyone forgets.",
    answer:
      "Data Validation restricts what a cell will accept — a list, a whole number in a range, a date range, a text length, or a custom formula that must evaluate TRUE. You can attach an input message and a custom error alert. The limitation to state is that it only checks new entries: existing bad data stays, and pasting into a validated cell bypasses validation entirely.",
    detail:
      "**The rule types**\n\n| Type | Use |\n|---|---|\n| List | a fixed set of categories, shown as a drop-down |\n| Whole number / Decimal | numeric bounds |\n| Date / Time | a valid window |\n| Text length | fixed-width codes |\n| Custom | any formula returning TRUE |\n\n**Custom rules are where it gets useful**\n\n- Reject duplicates on entry: `=COUNTIF($A:$A, A1) = 1`\n- Force uppercase: `=EXACT(A1, UPPER(A1))`\n- Require a date after another cell: `=A1 > $B$1`\n- Require an email-ish string: `=ISNUMBER(SEARCH(\"@\", A1))`\n\n**The limitations to volunteer**\n\n1. **Paste bypasses it.** Pasting a value into a validated cell overwrites the rule and the value with no warning. Circle Invalid Data (Data → Data Validation → Circle Invalid Data) is how you find what slipped through.\n2. **It is not retroactive.** Applying a rule does nothing to data already present.\n3. **It is not security.** A user can simply remove the validation.\n\n**Why interviewers like it**\n\nIt separates people who fix data from people who prevent bad data. The strongest framing is that validation belongs at the point of entry, and cleaning is what you do when validation was not there.",
    code: [
      { lang: "Excel", label: "No duplicates allowed", code: "=COUNTIF($A:$A, A1) = 1" },
      { lang: "Excel", label: "Date must follow the start date", code: "=A1 > $B$1" },
    ],
    mistakes: [
      "Assuming validation protects against pasted values.",
      "Expecting it to flag data that was already there.",
    ],
    followUps: ["How would you find values that bypassed a validation rule?"],
    tags: ["data validation", "data quality", "prevention"],
    related: ["xl-c-validation", "xl-q-dropdown"],
    sources: [GFG_EXCEL, GFG_EXCEL_DA],
  }),
  q({
    id: "xl-q-dropdown",
    category: "Data Cleaning",
    title: "What is a dropdown list and how do you create one?",
    difficulty: "Easy",
    q: "What is an Excel dropdown list and how do you create one?",
    hint: "Give the mechanic, then say how you would make the source grow automatically.",
    answer:
      "A dropdown restricts a cell to a defined set of values. Data → Data Validation → Allow: List, then either type the values comma-separated or point Source at a range. The refinement worth adding is that a plain range does not grow — if the list of categories will change, make the source an Excel Table column or a spilled UNIQUE formula so new entries appear in the dropdown automatically.",
    detail:
      "**Three ways to define the source**\n\n1. **Typed list** — `East,West,North,South`. Fine for something that never changes.\n2. **A range** — `=$H$2:$H$10`. Editable, but fixed in size.\n3. **A dynamic source** — a Table column referenced through a name, or on 365 a spilled range referenced with a hash: `=$H$2#`. This is the one that keeps working.\n\n**Making it dynamic on 365**\n\nPut `=SORT(UNIQUE(Data[Region]))` in H2. It spills. Set the validation source to `=$H$2#`. Add a new region to the data and it appears in every dropdown, with no maintenance.\n\n**Pre-365**\n\nConvert the source to a Table and define a name pointing at the table column; Table columns resize automatically, whereas a plain range does not. (Validation cannot reference a structured reference directly, hence the intermediate name.)\n\n**Practical touches**\n\n- Untick 'Ignore blank' if an empty cell should be rejected.\n- The Input Message tab shows a tooltip on selection — good for explaining what the field means.\n- The Error Alert tab lets you choose Stop, Warning or Information; Warning still permits the entry, which is sometimes what you want.",
    code: [
      { lang: "Excel", label: "Dynamic source (365)", code: "=SORT(UNIQUE(Data[Region]))" },
      { lang: "Excel", label: "Validation source referencing the spill", code: "=$H$2#" },
    ],
    mistakes: [
      "Pointing at a fixed range that never grows.",
      "Leaving 'Ignore blank' ticked when blanks should be rejected.",
    ],
    followUps: ["How do you make the dropdown update when new categories are added?"],
    tags: ["dropdown", "data validation", "UNIQUE", "dynamic"],
    related: ["xl-c-validation", "xl-q-dependent-dropdown", "xl-q-unique"],
    sources: [GFG_EXCEL_DA],
  }),
  q({
    id: "xl-q-dependent-dropdown",
    category: "Data Cleaning",
    title: "How do you create a dependent drop-down list?",
    difficulty: "Hard",
    q: "How do you create a dependent drop-down list in Excel?",
    hint: "The second list has to be chosen by the first. There is a classic method and a modern one.",
    answer:
      "The classic method uses named ranges plus INDIRECT: name each sub-list after the exact text of its parent value, then set the child cell's validation source to =INDIRECT($A2). Selecting \"East\" makes Excel resolve the name East to that range. On Microsoft 365 the cleaner method is a spilled FILTER — =FILTER(States, Countries=$A2) in a helper cell, with the validation source pointing at the spill.",
    detail:
      "**The INDIRECT method, step by step**\n\n1. Create the parent list (Countries) and one column per parent value holding its children.\n2. Select each child column and name it **exactly** as the parent value appears. Select the header and children, then Formulas → Create from Selection → Top row does all of them at once.\n3. Parent cell A2: validation List, source = the parent range.\n4. Child cell B2: validation List, source = `=INDIRECT($A2)`.\n\nNote `$A2` — column locked, row free — so the rule works when filled down the column.\n\n**Why it breaks**\n\nNamed ranges cannot contain spaces or start with a digit. A parent value of `\"North East\"` cannot become a name, so INDIRECT fails. The standard workaround substitutes the space:\n\n`=INDIRECT(SUBSTITUTE($A2, \" \", \"_\"))`\n\nwith the ranges named `North_East`. Knowing this failure mode is what makes the answer credible — it is the thing that goes wrong in practice.\n\n**The 365 method**\n\nIn a helper cell, `=FILTER(States, Countries=$A2, \"—\")`, then set the child validation source to that cell with a `#`. No named ranges, no naming rules, and it handles spaces and new values without maintenance. The trade-off is a visible helper column, which you can push to a hidden sheet.\n\n**Third level**\n\nThe same pattern chains: the third list's source is `=INDIRECT($B2)`. Beyond three levels the named-range approach becomes unmanageable and a table-driven FILTER is the only sane option.\n\n**The stale-selection problem**\n\nChanging the parent does not clear an already-chosen child, so you can end up with Country = India and State = Texas. Either clear dependents with a small event macro, or add a conditional format that flags mismatched rows. Mentioning this unprompted is a strong signal.",
    code: [
      { lang: "Excel", label: "Classic — INDIRECT", code: "=INDIRECT($A2)" },
      { lang: "Excel", label: "Handles spaces in parent values", code: "=INDIRECT(SUBSTITUTE($A2, \" \", \"_\"))" },
      { lang: "Excel", label: "Modern — spilled FILTER (365)", code: "=FILTER(States, Countries=$A2, \"—\")" },
    ],
    mistakes: [
      "Parent values containing spaces, which cannot be named ranges.",
      "Using $A$2 instead of $A2, so every row depends on the first row's parent.",
      "Not handling the stale child value after the parent changes.",
    ],
    followUps: [
      "What happens if a country name contains a space?",
      "The user changes the country but the state stays. How do you handle that?",
    ],
    tags: ["dependent dropdown", "INDIRECT", "FILTER", "data validation"],
    related: ["xl-c-validation", "xl-q-dropdown", "xl-q-dynamic-array"],
    sources: [GFG_EXCEL],
  }),
  q({
    id: "xl-q-compare-datasets",
    category: "Data Cleaning",
    title: "How do you compare two datasets?",
    difficulty: "Medium",
    q: "How do you compare two datasets in Excel?",
    hint: "Decide first what 'compare' means — missing rows, or changed values?",
    answer:
      "Clarify the question first: are you looking for rows present in one and not the other, or rows present in both whose values differ? For membership, a lookup returning #N/A identifies what is missing in each direction, and you must check both directions. For value differences, join on the key and compare field by field. For a bulk reconciliation, Power Query's Merge with a Full Outer join gives you all three groups — left only, right only, and matched — in one table.",
    detail:
      "**Step 1: agree the key**\n\nEverything depends on a reliable key. If both files have a clean ID, use it. If not, build a composite key (`=A2&\"|\"&B2`) and be explicit that a composite key is an assumption, not a fact.\n\n**Step 2: membership, both directions**\n\n```\nIn B but not A:  =IF(ISNA(MATCH(key, ListA, 0)), \"Missing from A\", \"\")\nIn A but not B:  =IF(ISNA(MATCH(key, ListB, 0)), \"Missing from B\", \"\")\n```\n\nChecking only one direction is the classic mistake — it finds additions but never deletions.\n\n**Step 3: value differences**\n\nFor matched keys, compare each field. `EXACT()` rather than `=` when case matters, and be careful with floating point: `=ROUND(a-b, 2) <> 0` is safer than `a <> b` for currency.\n\n**The Power Query answer**\n\nMerge Queries with a **Full Outer** join on the key, then expand. Nulls on the left mean rows only in the right table, and vice versa. Add a comparison column for the matched rows. This is repeatable, handles large files, and is the answer to give if the comparison happens regularly.\n\n**Related built-ins**\n\n- **Conditional formatting** with a formula rule highlights differences visually for a quick eyeball check.\n- **View → View Side by Side** with synchronous scrolling, for small manual comparisons.\n- **Spreadsheet Compare** (in some Office editions) diffs two workbooks including formulas.\n\n**What to say**\n\nAlways report the counts of all three buckets — only in A, only in B, differing — rather than a single 'they don't match'. That framing is what a reconciliation actually needs.",
    code: [
      { lang: "Excel", label: "Membership, one direction", code: "=IF(ISNA(MATCH(A2, ListB, 0)), \"Missing from B\", \"\")" },
      { lang: "Excel", label: "Value difference, currency-safe", code: "=IF(ROUND(VLOOKUP(A2,TableB,3,FALSE) - C2, 2) <> 0, \"Differs\", \"\")" },
    ],
    mistakes: [
      "Checking membership in only one direction.",
      "Comparing floating-point currency with `=` and getting spurious differences.",
      "Assuming a composite key is unique without verifying it.",
    ],
    followUps: [
      "How would you do this if it ran every week?",
      "What if there is no reliable key?",
    ],
    tags: ["compare", "reconciliation", "MATCH", "Power Query", "merge"],
    related: ["xl-q-power-query", "xl-q-merge-vs-append", "xl-q-vlookup"],
    sources: [GFG_EXCEL],
  }),
  q({
    id: "xl-q-normalize",
    category: "Data Cleaning",
    title: "What does normalising data mean in Excel?",
    difficulty: "Medium",
    q: "What is the meaning of data normalization in Excel?",
    hint: "The word means two different things. Say which one, because the interviewer may mean either.",
    answer:
      "The term is overloaded, so I would clarify which is meant. Statistically, normalisation rescales values to a common range — min-max scaling to 0–1, or z-score standardisation to a mean of 0 and standard deviation of 1 — so that variables measured on different scales can be compared. Structurally, it means organising data into a tidy form: one row per observation, one column per variable, no repeated groups, which is what makes a table usable by pivots and Power Query.",
    detail:
      "**Statistical normalisation**\n\n```\nMin-max:  =(x - MIN(range)) / (MAX(range) - MIN(range))     → 0 to 1\nZ-score:  =(x - AVERAGE(range)) / STDEV.S(range)           → mean 0, sd 1\n```\n\nMin-max is bounded and preserves the shape of the distribution but is sensitive to outliers, since a single extreme value compresses everything else. Z-score is unbounded but robust to range and is what most statistical methods expect.\n\n**Structural normalisation**\n\nThis is usually the more relevant meaning for an Excel analyst. A table with twelve month columns is *wide* and unusable — you cannot pivot it by month, and a thirteenth month means editing every formula. Unpivoting it in Power Query produces a long, tidy table:\n\n| Product | Month | Sales |\n|---|---|---|\n| A | Jan | 100 |\n| A | Feb | 120 |\n\nThat form pivots correctly, filters correctly and survives new months. Unpivot is arguably the single most valuable transformation in Power Query, and naming it here is a strong answer.\n\n**How to handle the ambiguity in the interview**\n\nSay both exist, ask which they mean, and offer a sentence on each. That reads as precision rather than hedging.",
    code: [
      { lang: "Excel", label: "Min-max scaling", code: "=(B2 - MIN($B$2:$B$1000)) / (MAX($B$2:$B$1000) - MIN($B$2:$B$1000))" },
      { lang: "Excel", label: "Z-score", code: "=(B2 - AVERAGE($B$2:$B$1000)) / STDEV.S($B$2:$B$1000)" },
      { lang: "M", label: "Structural — unpivot in Power Query", code: "= Table.UnpivotOtherColumns(Source, {\"Product\"}, \"Month\", \"Sales\")" },
    ],
    mistakes: [
      "Answering only the statistical sense when the interviewer meant table shape.",
      "Min-max scaling data with extreme outliers, which crushes everything into a narrow band.",
    ],
    followUps: [
      "Your table has twelve month columns. Why is that a problem, and what do you do?",
      "When would you prefer z-score over min-max?",
    ],
    tags: ["normalization", "z-score", "min-max", "unpivot", "tidy data"],
    related: ["xl-c-powerquery", "xl-q-power-query"],
    sources: [GFG_EXCEL_DA],
  }),

  // =========================================================== PIVOT
  q({
    id: "xl-q-pivot-table",
    category: "Pivot",
    title: "What is a pivot table and what does it do?",
    difficulty: "Easy",
    q: "What is a Pivot Table, and what does it do?",
    hint: "Describe the four drop zones, then mention the two behaviours that surprise people.",
    answer:
      "A pivot table summarises a flat table without writing formulas. You drag fields into four zones — Rows and Columns for the dimensions you group by, Values for the measure and its aggregation, and Filters for a page-level slice — and Excel recomputes the cross-tab as you rearrange them. Two behaviours catch people out: it reads a cached snapshot, so source edits do nothing until you Refresh, and the default aggregation flips to Count instead of Sum if the value column contains any text or blanks.",
    detail:
      "**The four zones**\n\n| Zone | Holds | Produces |\n|---|---|---|\n| Rows | dimensions | one row per value |\n| Columns | dimensions | one column per value |\n| Values | measures | the aggregated numbers |\n| Filters | dimensions | a page-level slice |\n\n**Why Count instead of Sum**\n\nExcel picks Sum only when the whole column is numeric. One text cell — often a stray 'N/A' or a number stored as text — and it switches to Count. The fix is not to change the aggregation; it is to fix the data type, because the same problem is corrupting everything else too. Treat it as a diagnostic.\n\n**Requirements on the source**\n\nEvery column needs a unique, non-blank header. No merged cells. No blank rows inside the range. Ideally the source is an Excel Table, so the pivot's range grows automatically when rows are added — otherwise you must re-point the source every time.\n\n**Beyond the basics**\n\n- **Grouping** — right-click a date field to roll up by month/quarter/year; right-click a number to create bins.\n- **Show Values As** — % of grand total, % of parent row, difference from, running total, rank. Most 'how do I show contribution' questions are answered here rather than with a formula.\n- **Slicers** — visual filters that can drive several pivots at once through Report Connections.\n- **Calculated fields** — formulas over aggregated values, which is why a calculated margin can disagree with a row-level one.\n\n**GETPIVOTDATA**\n\nClicking a pivot cell in a formula generates GETPIVOTDATA, which is robust to the pivot's layout changing but confuses people expecting a cell reference. It can be turned off in PivotTable options.",
    mistakes: [
      "Reporting stale numbers because the pivot was not refreshed.",
      "Changing Count to Sum manually instead of fixing the underlying data type.",
      "Building on a fixed range rather than a Table, so new rows are excluded.",
    ],
    followUps: [
      "Your pivot shows Count when you expected Sum. What does that tell you?",
      "How do you show each category's share of the total without a formula?",
    ],
    tags: ["pivot table", "aggregation", "refresh", "slicer"],
    related: ["xl-c-pivot", "xl-q-create-pivot", "xl-q-slicer", "xl-q-pivot-filters"],
    sources: [GFG_EXCEL, GFG_EXCEL_DA],
  }),
  q({
    id: "xl-q-create-pivot",
    category: "Pivot",
    title: "How do you create a pivot table?",
    difficulty: "Easy",
    q: "How do you create a Pivot Table in Excel?",
    hint: "Give the steps, but spend most of the answer on preparing the source correctly.",
    answer:
      "Select a cell in the data, Insert → PivotTable, choose where to put it, then drag fields into Rows, Columns, Values and Filters. The part that actually matters is the source: convert it to a Table first with Ctrl+T, so the pivot range expands as data is added. Without that, adding rows next month leaves them silently excluded from every pivot built on the old range.",
    detail:
      "**Before you insert anything**\n\n1. Every column has a unique, non-blank header.\n2. No merged cells anywhere in the range.\n3. No blank rows or columns inside the data.\n4. Data types are consistent per column — this is what determines whether you get Sum or Count.\n5. Ctrl+T to make it a Table, and give the Table a meaningful name.\n\nSkipping step 5 is the most common mistake, and it is invisible: the pivot works today and quietly under-reports next month.\n\n**Placement**\n\nPut the pivot on its own sheet. Pivots resize as you add fields and will overwrite anything below or beside them, which is how people lose adjacent work.\n\n**Multiple tables**\n\nTicking 'Add this data to the Data Model' at insert time lets one pivot span several related tables, so you can relate Orders to Customers instead of flattening them with VLOOKUPs first. This is Power Pivot, and it is the right answer when the interviewer follows up with 'what if the data is in two tables'.\n\n**After building**\n\n- Refresh with Alt+F5, or Refresh All with Ctrl+Alt+F5.\n- PivotTable Options → Data → 'Refresh data when opening the file' removes one source of stale reporting.\n- Design → Report Layout → Tabular Form gives a flat, readable layout with repeated row labels, which is much easier to reuse than the default compact form.",
    mistakes: [
      "Not converting to a Table, so the pivot misses newly added rows.",
      "Placing the pivot next to data it will later overwrite.",
      "Leaving it in Compact layout when the output needs to be reused.",
    ],
    followUps: [
      "Your data lives in two tables. How do you pivot across both?",
      "How do you make sure the pivot always includes new rows?",
    ],
    tags: ["pivot table", "Table", "Ctrl+T", "data model"],
    related: ["xl-c-pivot", "xl-q-pivot-table", "xl-q-power-pivot"],
    sources: [GFG_EXCEL, GFG_EXCEL_DA],
  }),
  q({
    id: "xl-q-pivot-filters",
    category: "Pivot",
    title: "How do you use pivot table filters?",
    difficulty: "Easy",
    q: "What is the process for using Excel's Pivot Table filters?",
    hint: "There are four different filtering mechanisms. They are not interchangeable.",
    answer:
      "There are four. The Filters zone applies a page-level slice to the whole pivot. Row and column label filters filter the dimension itself, including Top 10 and label-text conditions. Value filters filter by the aggregated number — categories with sales above a threshold. And slicers and timelines are visual filters that can be connected to several pivots at once, which is what makes them the right choice on a dashboard.",
    detail:
      "**Which to use when**\n\n| Mechanism | Filters on | Best for |\n|---|---|---|\n| Filters zone | a dimension, page-level | a single global slice |\n| Label filter | dimension values | text conditions, Top 10 by label |\n| Value filter | the aggregate | 'categories over £10k' |\n| Slicer | a dimension, visually | dashboards, multi-pivot control |\n| Timeline | dates, visually | period selection |\n\n**Value filters are the interesting ones**\n\nTop 10 is a value filter and is not limited to ten — it takes any N, and can work by percentage or by cumulative sum. 'Top items making up 80% of revenue' is a Pareto analysis done entirely through the filter dialog, which is worth knowing.\n\n**The subtlety about totals**\n\nA label or value filter removes rows from the pivot, and the grand total reflects only what remains. A Report Filter behaves the same way. So a filtered pivot's total is the filtered total, not the overall one — which is fine as long as the report says so. Presenting a filtered subtotal as an overall figure is a real reporting error.\n\n**Connecting a slicer to several pivots**\n\nRight-click the slicer → Report Connections, and tick every pivot it should drive. Both pivots must share the same data source or Data Model. This is the mechanism behind a coherent multi-chart dashboard, and candidates who know it tend to have built one.",
    mistakes: [
      "Presenting a filtered grand total as the overall figure.",
      "Adding a separate slicer per chart instead of connecting one to all of them.",
    ],
    followUps: [
      "How would you show the products making up 80% of revenue?",
      "How do you make one slicer control four charts?",
    ],
    tags: ["pivot filters", "slicer", "timeline", "Top 10"],
    related: ["xl-c-pivot", "xl-q-slicer", "xl-q-pivot-table"],
    sources: [GFG_EXCEL_DA],
  }),
  q({
    id: "xl-q-slicer",
    category: "Pivot",
    title: "What is a slicer?",
    difficulty: "Easy",
    q: "What is a slicer in Excel?",
    hint: "It is a filter with two extra properties that a dropdown filter does not have.",
    answer:
      "A slicer is a visual filter — a panel of clickable buttons for a field's values. Two things make it better than a dropdown filter on a dashboard: the current selection is always visible, so nobody misreads a filtered report as an unfiltered one, and one slicer can be connected to several pivot tables and pivot charts at once through Report Connections. Timelines are the date-specific equivalent, with period granularity.",
    detail:
      "**Why visibility matters**\n\nThe Filters zone shows the selection in a small dropdown that is easy to overlook, and 'Multiple Items' tells you nothing about which. A slicer shows every value with the selected ones highlighted, so a filtered figure cannot be mistaken for a total. On a report other people read, that is a correctness property, not a cosmetic one.\n\n**Connecting to multiple pivots**\n\nRight-click → Report Connections → tick each pivot. They must share a data source or a Data Model. This is what turns several charts into one dashboard rather than several independent reports.\n\n**Useful settings**\n\n- Slicer Settings → 'Hide items with no data' cleans up cascading slicers.\n- Columns (in Slicer Settings) lays the buttons out horizontally.\n- Multi-select is the small icon in the header, or Alt+S.\n- Slicers work on Excel Tables too, not just pivots.\n\n**Timelines**\n\nA timeline requires a genuine date field — another reason text-stored dates are a problem. It offers years, quarters, months and days, and a drag-to-select range, which is far better than ticking twelve month checkboxes.\n\n**Limitation**\n\nSlicers add file size and can slow a workbook with very high-cardinality fields. A slicer over 5,000 customer names is the wrong control; a search-enabled filter or a parameter is better.",
    mistakes: [
      "One slicer per chart instead of connecting one to all of them.",
      "Putting a slicer on a very high-cardinality field.",
      "Trying to add a timeline to a text-formatted date column.",
    ],
    followUps: ["Why can't you add a timeline to this date column?"],
    tags: ["slicer", "timeline", "dashboard", "filter"],
    related: ["xl-c-pivot", "xl-q-pivot-filters", "xl-q-dashboard-design"],
    sources: [GFG_EXCEL],
  }),
  q({
    id: "xl-q-power-pivot",
    category: "Pivot",
    title: "What is Power Pivot?",
    difficulty: "Hard",
    q: "How do you use Power Pivot in Excel, and what does it add?",
    hint: "It removes two limits and adds a language. Name all three.",
    answer:
      "Power Pivot is Excel's in-memory tabular data model. It removes the one-million-row worksheet limit by holding compressed data outside the grid, lets you relate multiple tables to each other rather than flattening them with lookups, and adds DAX for writing measures. It is the same engine Power BI uses, so a model built in Power Pivot transfers conceptually — and often literally — to Power BI.",
    detail:
      "**The three things it adds**\n\n1. **Scale.** Data lives in a compressed columnar store, not on a sheet. Tens of millions of rows are workable.\n2. **Relationships.** Define Orders[CustomerID] → Customers[CustomerID] once, and every pivot can use fields from both. This replaces a wall of VLOOKUPs with a model.\n3. **DAX.** Measures that respond to filter context, so one definition is correct at every level of a pivot.\n\n**Why a DAX measure beats a calculated field**\n\nA pivot calculated field computes on the *sums*, which is why a margin calculated field can be wrong at the subtotal level. A DAX measure is re-evaluated in each cell's filter context, so it is correct at every level:\n\n`Margin % := DIVIDE( SUM(Sales[Revenue]) - SUM(Sales[Cost]), SUM(Sales[Revenue]) )`\n\nThat difference is the strongest argument for Power Pivot and a good thing to be able to explain.\n\n**Typical workflow**\n\nPower Query loads and shapes → 'Add to Data Model' → build a star schema in the Diagram View → write DAX measures → pivot against the model.\n\n**Star schema**\n\nOne fact table (transactions) surrounded by dimension tables (date, product, customer), each joined on a single key. This is the shape the engine is optimised for, and the same recommendation Power BI makes.\n\n**The bridge to Power BI**\n\nSame VertiPaq engine, same DAX, same modelling concepts. Candidates who understand Power Pivot pick up Power BI quickly, and interviewers for BI roles often ask this question precisely to find out.",
    code: [
      { lang: "DAX", label: "A measure, correct at every level", code: "Margin % := DIVIDE( SUM(Sales[Revenue]) - SUM(Sales[Cost]), SUM(Sales[Revenue]) )" },
    ],
    mistakes: [
      "Describing it as 'a bigger pivot table' and missing relationships and DAX.",
      "Building a flat table with lookups instead of a star schema.",
    ],
    followUps: [
      "Why can a pivot calculated field give a wrong subtotal?",
      "What is a star schema and why does the engine prefer it?",
    ],
    tags: ["Power Pivot", "data model", "DAX", "star schema", "relationships"],
    related: ["xl-c-pivot-advanced", "xl-q-power-query", "pbi-c-dax-intro", "pbi-c-star-schema"],
    sources: [GFG_EXCEL, GFG_EXCEL_DA],
  }),

  // =========================================================== CHARTS
  q({
    id: "xl-q-chart-types",
    category: "Charts",
    title: "What chart types does Excel offer, and how do you choose?",
    difficulty: "Easy",
    q: "What is an Excel chart, and how many kinds are there? How do you choose between them?",
    hint: "Do not list all seventeen. Map question types to chart types.",
    answer:
      "Excel offers around seventeen chart categories, but the useful answer is the mapping rather than the list. Comparison across categories takes a bar or column chart. A trend over time takes a line chart. A relationship between two numerics takes a scatter. A distribution takes a histogram or box plot. Composition takes a stacked bar, or a waterfall when you need to show how a starting figure became an ending one. Two measures on different scales take a combo chart with a secondary axis.",
    detail:
      "**The mapping**\n\n| Question | Chart |\n|---|---|\n| Which category is biggest? | bar / column |\n| How has this moved over time? | line |\n| Are these two variables related? | scatter, with a trendline |\n| How is this variable distributed? | histogram, box plot |\n| What makes up the total? | stacked bar, treemap |\n| How did we get from A to B? | waterfall |\n| Two measures, different units | combo with secondary axis |\n| Where, geographically? | filled map |\n\n**Bar versus column**\n\nHorizontal bars when category labels are long, because rotated labels are hard to read. Vertical columns for time when a line is not appropriate — but for a long time series, a line is almost always better.\n\n**On pie charts**\n\nDefensible only for a few categories forming a meaningful whole. Human beings compare angles badly; a sorted bar chart conveys the same information more accurately. Saying this shows visual judgement rather than tool familiarity.\n\n**Honesty in axes**\n\nA bar chart's value axis must start at zero — truncating it exaggerates differences and is genuinely misleading. Line charts may be truncated, because they show change rather than magnitude. This distinction is worth stating; it is the kind of thing that separates someone who makes charts from someone who reads them critically.\n\n**Practical**\n\nAlt+F1 inserts a default chart on the current sheet, F11 on a new one. Select the data first.",
    mistakes: [
      "Reciting the full chart list instead of the mapping.",
      "Truncating a bar chart's axis.",
      "A pie chart with a dozen slices.",
    ],
    followUps: [
      "Which chart for quarterly sales trends across five years?",
      "Which for the distribution across quartiles?",
    ],
    tags: ["charts", "visualization", "chart choice"],
    related: ["xl-c-charts", "xl-q-dynamic-chart", "tb-c-chart-choice"],
    sources: [GFG_EXCEL, GFG_EXCEL_DA],
  }),
  q({
    id: "xl-q-dynamic-chart",
    category: "Charts",
    title: "What is a dynamic chart and how do you build one?",
    difficulty: "Hard",
    q: "What is a dynamic chart in Excel, and how would you create one?",
    hint: "The chart has to follow the data. There are three mechanisms, of increasing quality.",
    answer:
      "A dynamic chart updates its range automatically as data is added or as the user changes a selection. Three mechanisms, best first: base the chart on an Excel Table, which grows automatically and needs no formulas; use a spilled dynamic-array range on Microsoft 365; or use a named range defined with OFFSET or INDEX for older versions. Interactivity comes from slicers, or from a parameter cell feeding a FILTER.",
    detail:
      "**1. Excel Table — the default answer**\n\nCtrl+T, then chart the Table. New rows are included automatically. No formulas, nothing to maintain. This should be the first thing you say.\n\n**2. Spilled ranges (365)**\n\nChart a range built by FILTER or SORT and reference the spill with `#`. The chart follows whatever the formula returns, so a dropdown feeding the FILTER gives genuine interactivity:\n\n`=FILTER(Sales, Region = $H$1)`\n\n**3. Dynamic named ranges — the legacy method**\n\n```\n=OFFSET(Sheet1!$A$2, 0, 0, COUNTA(Sheet1!$A:$A)-1, 1)\n```\n\nOFFSET is volatile, so it recalculates constantly and slows large workbooks. The non-volatile equivalent uses INDEX:\n\n```\n=Sheet1!$A$2:INDEX(Sheet1!$A:$A, COUNTA(Sheet1!$A:$A))\n```\n\nKnowing that INDEX is the non-volatile alternative to OFFSET is a genuinely good signal.\n\n**Adding interactivity**\n\n- **Slicers** on a Table or pivot chart — no formulas at all.\n- **A parameter cell** driving FILTER — full control over what is charted.\n- **A dynamic title**: `=\"Sales — \" & $H$1 & \" (\" & TEXT(SUM(...), \"#,##0\") & \")\"`, linked to the chart title by selecting the title and typing `=` then the cell. A chart whose title does not state the active filter is a reporting hazard.\n\n**The order to give the answer**\n\nTable first, spill second, OFFSET last with the caveat. Leading with OFFSET suggests knowledge frozen around 2010.",
    code: [
      { lang: "Excel", label: "Non-volatile dynamic range", code: "=Sheet1!$A$2:INDEX(Sheet1!$A:$A, COUNTA(Sheet1!$A:$A))" },
      { lang: "Excel", label: "Spilled source (365)", code: "=FILTER(Sales, Region = $H$1)" },
      { lang: "Excel", label: "Dynamic title", code: "=\"Sales — \" & $H$1 & \" (\" & TEXT(SUM(FILTER(Amount, Region=$H$1)), \"#,##0\") & \")\"" },
    ],
    mistakes: [
      "Reaching for OFFSET when a Table would do it with no formula.",
      "Not linking the chart title to the active filter.",
    ],
    followUps: ["Why is INDEX preferable to OFFSET for a dynamic range?"],
    tags: ["dynamic chart", "OFFSET", "INDEX", "Table", "FILTER"],
    related: ["xl-c-charts", "xl-q-chart-types", "xl-q-dynamic-array", "xl-q-dashboard-design"],
    sources: [GFG_EXCEL],
  }),

  // =========================================================== POWER QUERY
  q({
    id: "xl-q-power-query",
    category: "Power Query",
    title: "What is Power Query?",
    difficulty: "Medium",
    q: "What is Power Query in Excel?",
    hint: "The key idea is that it records a recipe rather than editing data.",
    answer:
      "Power Query, or Get & Transform, is Excel's ETL layer. You connect to a source, apply a sequence of transformation steps, and load the result. Every step is recorded in Applied Steps and re-executes on refresh, so next month's file goes through the same cleaning with one click. That is the fundamental difference from cleaning by hand: Power Query does not edit data, it records a repeatable recipe.",
    detail:
      "**Where it sits**\n\nSource → **Power Query** (extract and transform) → worksheet or Data Model → pivot/chart. It is the E and T; Power Pivot is the model; the pivot is the presentation.\n\n**The transformations that earn their keep**\n\n- **Unpivot** — turn a cross-tab into a tidy long table. The single highest-value operation there is.\n- **Merge** — a join. Adds columns from another query, with all the usual join types.\n- **Append** — a union. Adds rows from another query with the same shape.\n- **Group By** — aggregate at load time.\n- **Split / Extract / Replace** — the text cleaning, recorded.\n- **Change Type** — do it deliberately and early, and set the locale for dates from other regions.\n\n**Combining a folder of files**\n\nGet Data → From Folder points at a directory and combines every file in it. Twelve monthly exports become one query, and adding a thirteenth file requires no work at all. This is the answer that impresses on 'how would you consolidate monthly reports'.\n\n**Query folding**\n\nAgainst a database, Power Query pushes as much of your transformation as it can into a single SQL statement rather than pulling everything down first. Steps that cannot fold break the chain for everything after them, so filter early and add custom columns late. Right-click a step → View Native Query shows whether folding is still happening.\n\n**Versus VBA**\n\nFor data transformation, Power Query has largely replaced VBA: it is declarative, self-documenting, requires no macro-enabled file, and does not need a developer to maintain. VBA remains for UI automation and application control.",
    code: [
      { lang: "M", label: "A filter step in M", code: "= Table.SelectRows(Source, each [Amount] > 1000)" },
      { lang: "M", label: "Unpivot every column except Product", code: "= Table.UnpivotOtherColumns(Source, {\"Product\"}, \"Month\", \"Sales\")" },
    ],
    mistakes: [
      "Treating it as an import tool and never using the transformation steps.",
      "Breaking query folding by adding a custom column before filtering.",
      "Loading everything to a worksheet when the Data Model would be better.",
    ],
    followUps: [
      "How would you consolidate twelve monthly files?",
      "What is query folding and how would you check it is still happening?",
    ],
    tags: ["Power Query", "M", "ETL", "unpivot", "query folding"],
    related: ["xl-c-powerquery", "xl-q-merge-vs-append", "pbi-c-query-folding", "xl-q-clean-data"],
    sources: [GFG_EXCEL, GFG_EXCEL_DA],
  }),
  q({
    id: "xl-q-merge-vs-append",
    category: "Power Query",
    title: "Merge vs Append in Power Query",
    difficulty: "Medium",
    q: "What is the difference between Append Queries and Merge Queries?",
    hint: "One adds rows, the other adds columns. Say it that plainly, then give the detail.",
    answer:
      "Append adds rows — it stacks tables with the same shape, like a SQL UNION ALL. Twelve monthly files with identical columns become one long table. Merge adds columns — it joins two tables on a matching key, like a SQL JOIN, so you can bring customer details onto an orders table. Append needs matching column names; Merge needs a matching key.",
    detail:
      "**Side by side**\n\n| | Append | Merge |\n|---|---|---|\n| Adds | rows | columns |\n| SQL equivalent | UNION ALL | JOIN |\n| Needs | matching column names | a matching key |\n| Typical use | monthly files | lookup enrichment |\n\n**Append gotcha**\n\nIt matches on column *name*. A column called `Amount` in one file and `Amt` in another produces two columns, each half-null. Check the result's column count — more columns than expected means a name mismatch.\n\n**Merge join types**\n\n| Join | Keeps |\n|---|---|\n| Left Outer | all left rows, matches from right |\n| Right Outer | all right rows |\n| Full Outer | everything from both |\n| Inner | only matched rows |\n| Left Anti | left rows with NO match |\n| Right Anti | right rows with NO match |\n\nThe **anti joins** are the ones worth calling out. Left Anti answers 'which orders have no matching customer record' in one step — a data-quality check that would otherwise be a column of `#N/A`. Interviewers rarely expect a candidate to name them, so doing so lands well.\n\n**After merging**\n\nMerge produces a column of nested tables. Click the expand icon and choose the columns you want; untick 'Use original column name as prefix' unless you need the disambiguation.\n\n**Row-count discipline**\n\nA Merge on a non-unique key multiplies rows. Always compare the row count before and after: if it grew, the key was not unique and you have silently fanned out your fact table. That check is the mark of someone who has been burned by this before.",
    code: [
      { lang: "M", label: "Append", code: "= Table.Combine({Jan, Feb, Mar})" },
      { lang: "M", label: "Merge — left anti, to find unmatched rows", code: "= Table.NestedJoin(Orders, {\"CustomerID\"}, Customers, {\"CustomerID\"}, \"c\", JoinKind.LeftAnti)" },
    ],
    mistakes: [
      "Appending files whose column names differ slightly.",
      "Merging on a non-unique key and multiplying the fact rows without noticing.",
    ],
    followUps: [
      "How would you find orders with no matching customer?",
      "Your row count grew after a merge. What happened?",
    ],
    tags: ["merge", "append", "join", "union", "Power Query"],
    related: ["xl-c-powerquery", "xl-q-power-query", "xl-q-compare-datasets"],
    sources: [GFG_EXCEL_DA],
  }),

  // =========================================================== ADVANCED
  q({
    id: "xl-q-dynamic-array",
    category: "Advanced",
    title: "What are dynamic array functions?",
    difficulty: "Medium",
    q: "What are dynamic array functions in Excel?",
    hint: "One formula, many results. Name the family and the error you get when it cannot expand.",
    answer:
      "In Microsoft 365, a formula can return multiple values that spill into the neighbouring cells automatically — one formula, a whole result set, with no Ctrl+Shift+Enter. The family is UNIQUE, FILTER, SORT, SORTBY, SEQUENCE and RANDARRAY, joined by LET for naming intermediate results and LAMBDA for reusable custom functions. A spilled range is referenced with a hash, as D2#, and #SPILL! means something is blocking the output area.",
    detail:
      "**Why they change how you build things**\n\nBefore dynamic arrays, a live filtered list meant either a helper-column construction, an array formula filled down a guessed number of rows, or VBA. Now it is one formula that resizes itself.\n\n**The core set**\n\n| Function | Returns |\n|---|---|\n| `UNIQUE(range)` | distinct values |\n| `FILTER(range, condition, [if_empty])` | matching rows |\n| `SORT(range, [col], [order])` | sorted |\n| `SORTBY(range, by_array, order)` | sorted by another column |\n| `SEQUENCE(rows, [cols], [start], [step])` | generated numbers |\n\n**Composition is the point**\n\n`=SORT(UNIQUE(FILTER(Region, Amount>1000)))`\n\nDistinct regions with a large order, sorted, live. Three functions, one cell, updates itself.\n\n**LET**\n\nNames intermediate results so each is computed once and the formula reads like code:\n\n```\n=LET(\n  net,  Revenue - Returns,\n  rate, net / Target,\n  IF(rate > 1, \"Above target\", ROUND(rate, 2))\n)\n```\n\nWithout LET, `net` would be recomputed every time it appeared.\n\n**#SPILL!**\n\nThe output range is obstructed — usually stray data, sometimes a merged cell. Click the error dropdown and choose 'Select Obstructing Cells'.\n\n**The constraint**\n\n365 or 2021 only. Opened in an older Excel these become legacy CSE array formulas or `#NAME?`. Say so.",
    code: [
      { lang: "Excel", label: "Composed", code: "=SORT(UNIQUE(FILTER(Region, Amount>1000)))" },
      { lang: "Excel", label: "Reference a spilled range", code: "=COUNTA(D2#)" },
    ],
    mistakes: [
      "Using them in a workbook that must open on Excel 2019.",
      "Not recognising #SPILL! as an obstruction rather than a formula error.",
    ],
    followUps: ["What does D2# mean?", "What causes #SPILL!?"],
    tags: ["dynamic arrays", "FILTER", "UNIQUE", "SORT", "LET", "SPILL"],
    related: ["xl-c-dynamic-arrays", "xl-q-unique", "xl-q-array-formula"],
    sources: [GFG_EXCEL_DA],
  }),
  q({
    id: "xl-q-unique",
    category: "Advanced",
    title: "How do you extract unique values?",
    difficulty: "Easy",
    q: "How do you extract unique values in Excel?",
    hint: "Four ways. The choice depends on whether the result must stay live.",
    answer:
      "On Microsoft 365, =UNIQUE(range) returns distinct values as a live spilled list. Data → Remove Duplicates does it destructively in place. Advanced Filter with \"Unique records only\" copies distinct values elsewhere without deleting. Power Query's Remove Duplicates does it as a recorded, repeatable step. The deciding question is whether the result needs to update when the source changes — if so, only UNIQUE and Power Query qualify.",
    detail:
      "**Choosing**\n\n| Method | Live? | Destructive? | Best for |\n|---|---|---|---|\n| `UNIQUE()` | yes | no | dashboards, dropdown sources |\n| Remove Duplicates | no | **yes** | one-off cleanup |\n| Advanced Filter | no | no | a one-off copy elsewhere |\n| Power Query | on refresh | no | recurring pipelines |\n\n**UNIQUE's extra arguments**\n\n`UNIQUE(array, [by_col], [exactly_once])`. The third argument is the interesting one: set it TRUE and you get only values appearing **exactly once**, which is the inverse of finding duplicates:\n\n- `=UNIQUE(A2:A100)` — one of each\n- `=UNIQUE(A2:A100,,TRUE)` — only the non-repeated ones\n\n**Distinct combinations**\n\nPass multiple columns and UNIQUE returns distinct row combinations, not distinct values per column:\n\n`=UNIQUE(A2:B100)`\n\n**Counting distinct values**\n\n`=COUNTA(UNIQUE(range))` on 365. Pre-365 the idiom is `=SUMPRODUCT(1/COUNTIF(range, range))`, which errors on blanks. A pivot table with 'Distinct Count' (Data Model required) is the third route.\n\n**The warning about Remove Duplicates**\n\nIt is irreversible after saving and reports only how many rows it deleted. Flag duplicates and inspect them before removing anything.",
    code: [
      { lang: "Excel", label: "Distinct values, live", code: "=UNIQUE(A2:A100)" },
      { lang: "Excel", label: "Only values appearing exactly once", code: "=UNIQUE(A2:A100,,TRUE)" },
      { lang: "Excel", label: "Distinct count, pre-365", code: "=SUMPRODUCT(1/COUNTIF(A2:A100, A2:A100))" },
    ],
    mistakes: [
      "Using Remove Duplicates for something that needs to stay live.",
      "Not knowing the third argument, which answers 'values appearing only once'.",
    ],
    followUps: ["How would you count distinct values without 365?"],
    tags: ["UNIQUE", "duplicates", "distinct", "Remove Duplicates"],
    related: ["xl-c-dynamic-arrays", "xl-q-identify-duplicates", "xl-q-dynamic-array"],
    sources: [GFG_EXCEL, GFG_EXCEL_DA],
  }),
  q({
    id: "xl-q-array-formula",
    category: "Advanced",
    title: "What is an array formula?",
    difficulty: "Medium",
    q: "What is an Excel array formula?",
    hint: "Distinguish the legacy CSE kind from what modern Excel does automatically.",
    answer:
      "An array formula performs a calculation across a whole set of values rather than one pair at a time. Historically these needed Ctrl+Shift+Enter — hence \"CSE formulas\" — and Excel displayed them wrapped in braces. In Microsoft 365 array behaviour is the default: the formula spills its results automatically and no special keystroke is needed. The classic example is SUMPRODUCT, which was always an array function without requiring CSE.",
    detail:
      "**What 'array' actually means**\n\n`=SUM(B2:B100 * C2:C100)` multiplies element by element and then sums. There is no single intermediate cell holding the products — the multiplication happens across the whole vector in memory. In legacy Excel that required Ctrl+Shift+Enter; SUMPRODUCT does the same thing without it, which is why SUMPRODUCT was the standard workaround for decades.\n\n**Legacy vs modern**\n\n| | Legacy CSE | Modern (365) |\n|---|---|---|\n| Entry | Ctrl+Shift+Enter | Enter |\n| Display | `{=...}` | plain |\n| Multi-cell results | pre-select the range | spills automatically |\n| Errors | wrong size fails silently | `#SPILL!` explains |\n\n**Where they are still the right tool**\n\n- Weighted average: `=SUMPRODUCT(scores, weights)/SUM(weights)`\n- Multi-condition counting with OR logic\n- Multi-condition lookup: `=INDEX(Price, MATCH(1, (Region=\"East\")*(Product=A2), 0))`\n\nThe boolean multiplication trick underpins all of these: TRUE is 1 and FALSE is 0, so multiplying conditions is AND and adding them is OR.\n\n**The compatibility note**\n\nA 365 spilled formula opened in Excel 2016 is converted to a legacy array formula wrapped in `_xlfn` prefixes, and often shows `#NAME?`. Worth stating if the workbook will be shared.\n\n**Performance**\n\nArray formulas over whole columns (`A:A`) evaluate a million rows each time. Bound the ranges, or use a Table.",
    code: [
      { lang: "Excel", label: "Element-wise, no CSE needed", code: "=SUMPRODUCT(B2:B100, C2:C100)" },
      { lang: "Excel", label: "Multi-condition lookup", code: "=INDEX(Price, MATCH(1, (Region=\"East\")*(Product=A2), 0))" },
    ],
    mistakes: [
      "Using whole-column references inside an array formula.",
      "Assuming a 365 spilled formula will work on an older version.",
    ],
    followUps: ["Why does multiplying two conditions give AND logic?"],
    tags: ["array formula", "CSE", "SUMPRODUCT", "spill"],
    related: ["xl-c-dynamic-arrays", "xl-q-dynamic-array", "xl-q-weighted-average"],
    sources: [GFG_EXCEL, GFG_EXCEL_DA],
  }),
  q({
    id: "xl-q-goal-seek",
    category: "Advanced",
    title: "How do you use Goal Seek?",
    difficulty: "Medium",
    q: "How do you use Goal Seek in Excel?",
    hint: "One input, one target. Say clearly what it cannot do.",
    answer:
      "Data → What-If Analysis → Goal Seek. You give it three things: the cell whose value you want to fix, the target value, and the single input cell it may change. Excel back-solves iteratively. Its limits are that it changes exactly one input, accepts no constraints, and requires the target cell to contain a formula that actually depends on the input — for anything with multiple variables or constraints, you need Solver.",
    detail:
      "**A worked example**\n\nA break-even model where profit = units × (price − variable cost) − fixed cost. To find the units needed for zero profit:\n\n- Set cell: the profit cell\n- To value: `0`\n- By changing cell: the units cell\n\nExcel converges and writes the answer into the units cell.\n\n**The three limits to state**\n\n1. **One variable only.** 'What price and volume together hit this target' is not a Goal Seek question.\n2. **No constraints.** It will happily return a negative price or 4.7 employees.\n3. **It overwrites the input cell.** Note the original value first — there is no undo history within the dialog.\n\n**When it fails to converge**\n\nIf the relationship is not monotonic, or the target is unreachable, Goal Seek stops at its iteration limit and reports the closest it found. That result is not an answer; check it. File → Options → Formulas exposes the iteration count and precision.\n\n**Where Goal Seek ends and Solver begins**\n\n| | Goal Seek | Solver |\n|---|---|---|\n| Variables | one | many |\n| Constraints | none | yes |\n| Objective | exact target | max, min, or target |\n| Availability | built in | add-in |\n\n**Data Table, the third what-if tool**\n\nA one- or two-variable Data Table shows the result across a whole grid of inputs at once, rather than solving for one. It is the right tool for sensitivity analysis, and worth naming alongside the other two.",
    mistakes: [
      "Pointing 'By changing cell' at a cell containing a formula — it must be a constant.",
      "Accepting an unconverged result as an answer.",
      "Reaching for Goal Seek when constraints exist.",
    ],
    followUps: ["When would you need Solver instead?", "What is a Data Table used for?"],
    tags: ["Goal Seek", "what-if", "break-even", "Data Table"],
    related: ["xl-c-whatif", "xl-q-solver"],
    sources: [GFG_EXCEL],
  }),
  q({
    id: "xl-q-solver",
    category: "Advanced",
    title: "What is Solver?",
    difficulty: "Hard",
    q: "What is Solver in Excel?",
    hint: "Three parts. Name them, because the third is what distinguishes it from Goal Seek.",
    answer:
      "Solver is an optimisation add-in with three parts: an objective cell to maximise, minimise or drive to a value; variable cells it may change; and constraints those variables must satisfy. That third part is what separates it from Goal Seek — Solver handles many variables under real limits, such as allocating a budget across channels to maximise return subject to a cap per channel and a total budget.",
    detail:
      "**Setting it up**\n\nFile → Options → Add-ins → Solver Add-in must be enabled first; it then appears under the Data tab.\n\n1. **Set Objective** — the cell to optimise, and whether to Max, Min, or hit a Value Of.\n2. **By Changing Variable Cells** — the decision variables. Must be constants, not formulas.\n3. **Subject to the Constraints** — added one at a time. Includes `int` for integers and `bin` for binary (0/1) variables.\n\n**A worked shape**\n\nMaximise total profit by choosing production units for four products, subject to: machine hours ≤ 500, material ≤ 2000 kg, each product's units ≥ 0 and integer. That is a linear programme, and Simplex LP solves it exactly.\n\n**Choosing the solving method**\n\n| Method | Use |\n|---|---|\n| Simplex LP | linear objective and constraints — fast, guarantees the optimum |\n| GRG Nonlinear | smooth nonlinear — finds a *local* optimum |\n| Evolutionary | non-smooth (IF, LOOKUP, ABS in the model) — slow, no guarantee |\n\nGRG returning a local optimum is the subtle point: run it from several starting values and compare, or tick 'Use Multistart'.\n\n**Non-negativity**\n\nTick 'Make Unconstrained Variables Non-Negative' unless negative values are genuinely meaningful. Forgetting it produces optimal solutions involving negative production.\n\n**The reports**\n\nAfter solving, Solver offers Answer, Sensitivity and Limits reports. The Sensitivity report gives shadow prices — how much the objective would improve per unit of a relaxed constraint. In a business context that is often more valuable than the solution itself, and mentioning it is a strong finish.",
    mistakes: [
      "Not enabling the add-in and concluding Solver does not exist.",
      "Using GRG Nonlinear on a model containing IF and trusting the result.",
      "Leaving out the non-negativity constraint.",
    ],
    followUps: [
      "Which solving method for a model containing IF statements?",
      "What does the Sensitivity report tell you?",
    ],
    tags: ["Solver", "optimization", "constraints", "linear programming"],
    related: ["xl-c-whatif", "xl-q-goal-seek"],
    sources: [GFG_EXCEL],
  }),
  q({
    id: "xl-q-macro",
    category: "Advanced",
    title: "What is a macro and when would you use one?",
    difficulty: "Medium",
    q: "What is the purpose of macros in Excel, and how would you automate a repetitive task?",
    hint: "Give the mechanic, then the judgement call about when NOT to use one.",
    answer:
      "A macro is a recorded or written sequence of Excel actions, stored as VBA and replayable on demand. You record with Developer → Record Macro, or write it in the VBA editor with Alt+F11. The judgement worth showing is when not to use one: for data import and transformation, Power Query is now the better tool — declarative, self-documenting, no macro-enabled file, and maintainable by someone who is not a developer. VBA remains right for UI actions and application control.",
    detail:
      "**Recording is for learning, not for shipping**\n\nRecorded code is verbose and full of `Select` and `Activate`:\n\n```vba\nRange(\"A1\").Select\nSelection.Value = 5\n```\n\nThe idiomatic version needs no selection and is far faster inside a loop:\n\n```vba\nRange(\"A1\").Value = 5\n```\n\nRecording is an excellent way to discover the object model. It is not a way to produce good code.\n\n**Where VBA still wins**\n\n- Custom worksheet functions (a `Function` is callable from a cell)\n- Loops over sheets or workbooks\n- Event handlers — Worksheet_Change, Workbook_Open\n- Driving other Office applications\n- Custom forms and dialogs\n\n**Where Power Query wins**\n\nAnything that is import, clean, reshape, combine. Which is most of what people historically wrote VBA for.\n\n**Practicalities**\n\n- Must be saved as **.xlsm**. Saving as .xlsx discards the code silently.\n- Macros are disabled by default on open; users see a security banner.\n- A macro's effect is not undoable by Ctrl+Z, so destructive macros should confirm first.\n- The Personal Macro Workbook stores macros available across every file.\n\n**Performance**\n\n`Application.ScreenUpdating = False` and `Application.Calculation = xlCalculationManual` around a long routine, restored afterwards, is the standard speed-up — often an order of magnitude. Reading a range into a variant array, processing it in memory, and writing it back once is the bigger win.",
    code: [
      { lang: "VBA", label: "The standard speed-up wrapper", code: "Application.ScreenUpdating = False\nApplication.Calculation = xlCalculationManual\n' ... work ...\nApplication.Calculation = xlCalculationAutomatic\nApplication.ScreenUpdating = True" },
    ],
    mistakes: [
      "Saving as .xlsx and losing the code.",
      "Leaving Select/Activate in production code.",
      "Writing VBA for a transformation Power Query would handle better.",
    ],
    followUps: [
      "When would you use Power Query instead of a macro?",
      "How do you make a slow macro faster?",
    ],
    tags: ["macro", "VBA", "automation", "xlsm"],
    related: ["xl-c-macros", "xl-q-vba-sub-function", "xl-q-power-query"],
    sources: [GFG_EXCEL, GFG_EXCEL_DA],
  }),
  q({
    id: "xl-q-vba-sub-function",
    category: "Advanced",
    title: "Difference between a VBA function and a subroutine",
    difficulty: "Medium",
    q: "Explain the distinction between a VBA function and a subroutine.",
    hint: "One returns a value. That single difference drives everything else.",
    answer:
      "A Sub performs actions and returns nothing; a Function returns a value. Because a Function returns something, it can be called from a worksheet cell as a custom formula — a UDF — while a Sub cannot. Subs appear in the macro list and can be assigned to buttons; Functions do not appear there. A Function returns its value by assigning to its own name, or via a Return-style assignment in the body.",
    detail:
      "**The two shapes**\n\n```vba\nSub ClearFilters()\n    If ActiveSheet.AutoFilterMode Then ActiveSheet.AutoFilterMode = False\nEnd Sub\n\nFunction MarginPct(rev As Double, cost As Double) As Double\n    If rev = 0 Then Exit Function\n    MarginPct = (rev - cost) / rev\nEnd Function\n```\n\nNote that the Function assigns to its own name — that is how VBA returns a value.\n\n**Consequences of the difference**\n\n| | Sub | Function |\n|---|---|---|\n| Returns a value | no | yes |\n| Callable from a cell | no | yes |\n| Appears in the macro list | yes | no |\n| Assignable to a button | yes | no |\n| Called by | `Call Name` or `Name` | `x = Name(args)` |\n\n**The UDF restriction that gets asked**\n\nA Function called from a worksheet cell **cannot change the workbook**. It cannot write to other cells, format anything, or insert rows — Excel silently ignores such attempts. A UDF may only compute and return. Candidates often try to write a UDF that colours a cell and cannot work out why nothing happens; knowing this rule outright is a good signal.\n\n**ByRef and ByVal**\n\nVBA passes arguments **ByRef by default**, meaning a procedure can modify the caller's variable. This surprises people coming from other languages. Declare `ByVal` when you do not intend that.\n\n**Volatility**\n\nA UDF recalculates only when its arguments change, unless you add `Application.Volatile` — which makes it recalculate constantly and can make a workbook crawl. Use it only when the function genuinely depends on something outside its arguments.",
    code: [
      { lang: "VBA", label: "Sub — action", code: "Sub ClearFilters()\n    If ActiveSheet.AutoFilterMode Then ActiveSheet.AutoFilterMode = False\nEnd Sub" },
      { lang: "VBA", label: "Function — returns, usable in a cell", code: "Function MarginPct(rev As Double, cost As Double) As Double\n    If rev = 0 Then Exit Function\n    MarginPct = (rev - cost) / rev\nEnd Function" },
    ],
    mistakes: [
      "Trying to modify cells from a worksheet-called UDF.",
      "Forgetting VBA passes ByRef by default.",
      "Adding Application.Volatile without needing it.",
    ],
    followUps: [
      "Why can't a UDF change another cell's colour?",
      "What does ByRef mean for a variable you pass in?",
    ],
    tags: ["VBA", "Sub", "Function", "UDF", "ByRef"],
    related: ["xl-c-macros", "xl-q-macro", "xl-q-thisworkbook"],
    sources: [GFG_EXCEL_DA],
  }),
  q({
    id: "xl-q-thisworkbook",
    category: "Advanced",
    title: "ThisWorkbook vs ActiveWorkbook in VBA",
    difficulty: "Medium",
    q: "What are the differences in VBA between ThisWorkbook and the Active workbook?",
    hint: "One is fixed, one moves. They diverge as soon as your code opens another file.",
    answer:
      "ThisWorkbook always refers to the workbook containing the running code — it never changes. ActiveWorkbook refers to whichever workbook currently has focus, which changes the moment your macro opens another file, or a user clicks a different window. They are identical only when your code has not switched context, which is exactly why the bug they cause is intermittent and hard to trace.",
    detail:
      "**The bug this causes**\n\nA macro in Reports.xlsm opens Data.xlsx to read from it. Data.xlsx is now the ActiveWorkbook. Every subsequent unqualified `Sheets(\"Summary\")` or `ActiveWorkbook.Save` targets the wrong file. Worse, it works correctly when you test it with no other files open, so it passes review and fails in production.\n\n**The rule**\n\nUse `ThisWorkbook` for anything belonging to your own file. Use an explicit object variable for anything else:\n\n```vba\nDim wb As Workbook\nSet wb = Workbooks.Open(\"C:\\data\\Data.xlsx\")\nDim total As Double\ntotal = Application.WorksheetFunction.Sum(wb.Sheets(1).Range(\"B:B\"))\nwb.Close SaveChanges:=False\nThisWorkbook.Sheets(\"Summary\").Range(\"B2\").Value = total\n```\n\nNothing here relies on what happens to be active, so nothing breaks when focus moves.\n\n**The same trap one level down**\n\n`ActiveSheet` and `Selection` have exactly the same problem within a workbook. Fully qualifying every reference — workbook, then sheet, then range — is the discipline that makes VBA reliable:\n\n`ThisWorkbook.Worksheets(\"Data\").Range(\"A1\")`\n\nAn unqualified `Range(\"A1\")` means 'A1 on whatever sheet is active in whatever workbook is active', which is rarely what was intended.\n\n**Why recorded macros are full of this**\n\nThe recorder captures what you did through the UI, which is inherently selection-based. That is precisely why recorded code needs rewriting before it is trusted.",
    code: [
      { lang: "VBA", label: "Fragile — depends on focus", code: "Sheets(\"Summary\").Range(\"B2\").Value = 100" },
      { lang: "VBA", label: "Robust — fully qualified", code: "ThisWorkbook.Worksheets(\"Summary\").Range(\"B2\").Value = 100" },
    ],
    mistakes: [
      "Using ActiveWorkbook in code that opens other files.",
      "Unqualified Range and Sheets references.",
      "Testing with only one workbook open, which hides the bug.",
    ],
    followUps: ["What is the equivalent trap for ActiveSheet?"],
    tags: ["VBA", "ThisWorkbook", "ActiveWorkbook", "qualification"],
    related: ["xl-c-macros", "xl-q-vba-sub-function", "xl-q-macro"],
    sources: [GFG_EXCEL_DA],
  }),

  // =========================================================== BUSINESS ANALYSIS
  q({
    id: "xl-q-weighted-average",
    category: "Business Analysis",
    title: "How do you calculate a weighted average?",
    difficulty: "Medium",
    q: "How do you calculate a weighted average in Excel?",
    hint: "One function does it in a single expression. Then say when a plain average would have been wrong.",
    answer:
      "=SUMPRODUCT(values, weights) / SUM(weights). SUMPRODUCT multiplies the two ranges element by element and sums the products, and dividing by the total weight normalises it. The reason it matters is that a plain AVERAGE treats every row equally, which is wrong whenever the rows represent different sizes — averaging regional margins ignores the fact that one region sells ten times as much.",
    detail:
      "**Worked example**\n\n| Region | Margin % | Revenue |\n|---|---|---|\n| East | 10% | 1,000,000 |\n| West | 40% | 100,000 |\n\n`AVERAGE` gives 25%. The real blended margin is\n\n`(0.10 × 1,000,000 + 0.40 × 100,000) / 1,100,000 = 140,000 / 1,100,000 ≈ 12.7%`\n\nThe unweighted figure overstates by nearly double. This is one of the most common quiet errors in business reporting, which is why the question is asked.\n\n**Adding a condition**\n\nSUMPRODUCT takes conditions as multiplied booleans:\n\n`=SUMPRODUCT((Region=\"East\") * Margin * Revenue) / SUMIF(Region, \"East\", Revenue)`\n\n**Guarding it**\n\n`=IFERROR(SUMPRODUCT(v, w)/SUM(w), \"\")` — a zero total weight otherwise gives `#DIV/0!`.\n\n**The general principle**\n\nNever average a ratio. Recompute it from the underlying numerator and denominator totals. Average margin, average conversion rate, average price per unit — all of these are wrong when computed as the mean of per-row ratios. Stating that principle, rather than only the formula, is what makes this a strong answer.\n\n**In other tools**\n\nThe same rule is why a DAX measure written as `DIVIDE(SUM(Revenue)-SUM(Cost), SUM(Revenue))` is correct at every level while `AVERAGE(Margin%)` is not.",
    code: [
      { lang: "Excel", label: "Weighted average", code: "=SUMPRODUCT(Margin, Revenue) / SUM(Revenue)" },
      { lang: "Excel", label: "Guarded", code: "=IFERROR(SUMPRODUCT(Margin, Revenue)/SUM(Revenue), \"\")" },
    ],
    mistakes: [
      "Using AVERAGE on a column of ratios.",
      "Forgetting to divide by the sum of weights.",
      "Mismatched range sizes, which SUMPRODUCT rejects.",
    ],
    followUps: [
      "Why is the average of regional margins not the overall margin?",
      "How would you weight only the East region?",
    ],
    tags: ["weighted average", "SUMPRODUCT", "ratios", "aggregation"],
    related: ["xl-c-business-metrics", "xl-q-array-formula", "pbi-q-average-of-averages"],
    sources: [GFG_EXCEL],
  }),
  q({
    id: "xl-q-cagr",
    category: "Business Analysis",
    title: "How do you calculate CAGR?",
    difficulty: "Medium",
    q: "How do you calculate CAGR in Excel?",
    hint: "It is a root, not an average of growth rates. Say why that distinction matters.",
    answer:
      "CAGR = (Ending value / Beginning value)^(1/years) − 1, written as =(B10/B2)^(1/8)-1. It is the constant annual rate that would take you from the start value to the end value over the period. It is not the average of the yearly growth rates — averaging those overstates the result, because growth compounds, and the correct aggregation of multiplicative rates is a geometric mean rather than an arithmetic one.",
    detail:
      "**Getting the exponent right**\n\nThe exponent is 1 divided by the number of **periods**, which is one fewer than the number of data points. Revenue for 2018 through 2026 is nine values but eight years of growth. Off-by-one here is the most common error.\n\n**Why not average the growth rates**\n\nTwo years: +50% then −50%. The arithmetic mean is 0%, suggesting you broke even. In reality 100 → 150 → 75, a loss of 25%. CAGR gives `(75/100)^(1/2) − 1 ≈ −13.4%` per year, which is correct. This example is worth having ready; it makes the point in one line.\n\n**Alternatives**\n\n- `=RRI(8, B2, B10)` does exactly this and is more readable.\n- `=GEOMEAN(range_of_growth_factors) - 1` where the factors are 1+g.\n- For irregular dates, `XIRR` handles uneven intervals.\n\n**Where CAGR misleads**\n\nIt only looks at the endpoints. A series that collapsed in the middle and recovered shows the same CAGR as a smooth climb. If the path matters — and it usually does — show the CAGR alongside the actual series. Choosing a start year that happens to be a trough is the classic way CAGR is used to flatter a result, and being alert to that is worth mentioning.\n\n**Negative or zero start**\n\nCAGR is undefined for a negative or zero beginning value. A negative base makes the root meaningless. Say so rather than producing a number.",
    code: [
      { lang: "Excel", label: "CAGR", code: "=(B10/B2)^(1/8) - 1" },
      { lang: "Excel", label: "Same thing, clearer", code: "=RRI(8, B2, B10)" },
    ],
    mistakes: [
      "Using the count of data points instead of the count of periods.",
      "Averaging annual growth rates instead of compounding them.",
      "Reporting CAGR from a cherry-picked trough year.",
    ],
    followUps: [
      "Growth of +50% then −50%. What is the CAGR, and what does the arithmetic mean say?",
      "When does CAGR mislead?",
    ],
    tags: ["CAGR", "growth", "compounding", "RRI", "geometric mean"],
    related: ["xl-c-business-metrics", "xl-q-percentage"],
    sources: [GFG_EXCEL],
  }),
  q({
    id: "xl-q-percentage",
    category: "Business Analysis",
    title: "How do you calculate percentages and percentage change?",
    difficulty: "Easy",
    q: "How can you measure a percentage in Excel?",
    hint: "Distinguish share-of-total from change, and mention the percent-format subtlety.",
    answer:
      "A share of total is part / whole, formatted as a percentage — =B2/$B$10 with the denominator absolute so it survives being filled down. Percentage change is (new − old) / old. The formatting subtlety is that applying the Percent format multiplies the display by 100, so the underlying value should be the decimal 0.157, not 15.7 — storing the already-multiplied number and then formatting it gives 1570%.",
    detail:
      "**The two calculations**\n\n```\nShare of total:      =B2 / $B$10\nPercentage change:   =(New - Old) / Old\nPercentage points:   =NewPct - OldPct\n```\n\n**Percent vs percentage point**\n\nMoving from 10% to 12% is a rise of 2 percentage **points** and 20 **percent**. Reports that confuse these are wrong, sometimes materially. Being precise about it in an interview is a small thing that reads as rigour.\n\n**Guarding the denominator**\n\n`=IF(Old=0, \"n/a\", (New-Old)/Old)`\n\nGrowth from zero is undefined, not infinite. A report full of `#DIV/0!` or, worse, silently suppressed errors is a common failure. And growth from a negative base produces a sign-flipped nonsense figure, which is worth guarding separately in financial models.\n\n**The formatting trap**\n\nType `15.7` and apply Percent → 1570%. Type `0.157` and apply Percent → 15.7%. Formatting multiplies for display; it does not convert. If a column of percentages arrives as 15.7, divide by 100 before formatting.\n\n**Doing it without a formula**\n\nIn a pivot table, Show Values As → % of Grand Total, % of Column Total or % of Parent Row Total computes shares directly. Faster and less error-prone than a formula column.\n\n**Reverse percentage**\n\nTo find the pre-tax amount from a tax-inclusive one: `=Total / (1 + rate)`. Subtracting 18% is a different and wrong operation, and this catches people out regularly.",
    code: [
      { lang: "Excel", label: "Share of total", code: "=B2 / $B$10" },
      { lang: "Excel", label: "Guarded percentage change", code: "=IF(C2=0, \"n/a\", (D2-C2)/C2)" },
      { lang: "Excel", label: "Remove tax from an inclusive total", code: "=Total / (1 + 0.18)" },
    ],
    mistakes: [
      "Confusing percent with percentage points.",
      "Storing 15.7 and applying a Percent format.",
      "Subtracting 18% instead of dividing by 1.18 to strip tax.",
    ],
    followUps: [
      "A rate moved from 10% to 12%. By how much did it rise?",
      "How do you get the pre-tax figure from a tax-inclusive total?",
    ],
    tags: ["percentage", "growth", "percentage points", "formatting"],
    related: ["xl-c-business-metrics", "xl-q-cagr", "xl-q-cell-formats"],
    sources: [GFG_EXCEL_DA],
  }),
  q({
    id: "xl-q-revenue-formulas",
    category: "Business Analysis",
    title: "Five financial formulas for a BI dashboard",
    difficulty: "Medium",
    q: "Name five revenue or financial formulas you would put on a BI dashboard.",
    hint: "Pick metrics that support different decisions, and say what each one is for.",
    answer:
      "Revenue growth versus the prior period, because it is the headline. Gross margin percentage, because revenue without margin tells you nothing about health. Contribution by category as a share of total, which is where you find concentration risk. Variance to budget in both absolute and percentage terms, since that is what drives the conversation with finance. And a forward-looking one — run rate or CAGR — so the dashboard says something about direction rather than only history.",
    detail:
      "**The five, with formulas and the decision each supports**\n\n| Metric | Formula | Answers |\n|---|---|---|\n| Growth % | `(Current − Prior)/Prior` | are we growing? |\n| Gross margin % | `(Revenue − COGS)/Revenue` | is the growth profitable? |\n| Contribution % | `Category/Total` | where is the concentration? |\n| Variance to budget | `Actual − Budget`, and `/Budget` | are we on plan? |\n| Run rate / CAGR | `PTD/days × days_in_period` · `(End/Start)^(1/n)−1` | where does this land? |\n\n**Habits that matter more than the list**\n\n1. **Guard every denominator.** `=IF(Prior=0,\"n/a\",...)`. One zero prior period otherwise fills a dashboard with errors.\n2. **Label the comparison period.** \"Growth 12%\" is meaningless without knowing whether that is versus last month, last quarter or last year. Put it in the tile label.\n3. **Never average a ratio.** Recompute margin from total revenue and total cost, never as the mean of row margins.\n4. **Pair absolute with relative.** A 400% variance on a tiny base is noise; showing both stops people chasing it.\n\n**Others worth naming if pressed**\n\nAOV (revenue ÷ orders), customer concentration (top-10 share of revenue), DSO, inventory turns, and for subscription businesses MRR, churn and net revenue retention. Which ones belong depends entirely on the business model — saying that, rather than reciting a fixed list, is the stronger answer.\n\n**The framing that lands**\n\nA dashboard metric earns its place only if someone would act differently depending on its value. Metrics nobody acts on are decoration. Opening with that principle and then giving the five is better than opening with the list.",
    code: [
      { lang: "Excel", label: "Growth, guarded", code: "=IF(Prior=0, \"n/a\", (Current-Prior)/Prior)" },
      { lang: "Excel", label: "Gross margin", code: "=(Revenue - COGS) / Revenue" },
      { lang: "Excel", label: "Run rate", code: "=PeriodToDate / DaysElapsed * DaysInPeriod" },
    ],
    mistakes: [
      "Listing metrics with no statement of what decision each supports.",
      "Showing percentage variance without the absolute figure.",
      "Averaging margins across rows.",
    ],
    followUps: [
      "Which of these would change for a subscription business?",
      "How do you decide whether a metric belongs on a dashboard at all?",
    ],
    tags: ["KPI", "dashboard", "margin", "variance", "growth"],
    related: ["xl-c-business-metrics", "xl-q-dashboard-design", "xl-q-weighted-average"],
    sources: [GH_DA],
  }),
  q({
    id: "xl-q-dashboard-design",
    category: "Business Analysis",
    title: "How would you build an Excel dashboard?",
    difficulty: "Hard",
    q: "How would you design and build a dashboard in Excel for a business audience?",
    hint: "Start with the audience and the decision, not with charts.",
    answer:
      "I would start by asking who reads it and what decision it supports, because a dashboard that does not change a decision is just a report. Then I would build it in three separated layers — a raw data sheet nobody edits, a calculation layer, and a presentation layer — with Power Query handling ingestion so a refresh is one click, the Data Model handling relationships, and pivots with connected slicers driving the visuals. Headline KPIs top-left, supporting detail below, filters in a consistent place, and a documented refresh procedure because someone else will run it.",
    detail:
      "**The architecture**\n\n```\nSource files / database\n        ↓  Power Query   (recorded, repeatable)\nData Model               (relationships, DAX measures)\n        ↓\nCalculation sheet        (pivots, intermediate measures)\n        ↓\nDashboard sheet          (charts, KPI tiles, slicers)\n```\n\nThe separation is the whole point. When formulas reference the presentation layer, a formatting change breaks the maths — and it will happen, because presentation layers get edited.\n\n**Layout**\n\nReaders scan top-left first. Put three to five headline KPIs there with their comparison (\"₹4.2 Cr, +12% vs LY\"). Trend beneath. Detail tables last. Slicers in a fixed position, ideally top-right, connected to every pivot via Report Connections so one control drives the whole page.\n\n**Things that make it survive handover**\n\n- Every formula guarded, so one bad row does not fill the page with `#DIV/0!`.\n- Chart titles that state the active filter, built with a formula and linked to the title.\n- A visible 'last refreshed' timestamp, written by the refresh rather than `=NOW()`.\n- A short instructions block: where the data comes from, how to refresh, who owns it.\n- Protected presentation sheets so the layout is not accidentally dragged apart.\n\n**Restraint**\n\nFifteen KPIs with equal visual weight communicate nothing. Pick the few that drive decisions and let everything else be a drill-down. Avoid dual axes unless clearly labelled, keep bar-chart axes at zero, and use colour to encode meaning rather than decoration — ideally one accent colour plus a neutral, with red and green reserved for good and bad.\n\n**When to say it should not be Excel**\n\nIf it needs scheduled refresh, row-level security by viewer, or a large audience, Power BI is the honest recommendation. Knowing where Excel's ceiling is reads as maturity rather than disloyalty to the tool.",
    mistakes: [
      "Opening with chart types instead of the audience and the decision.",
      "Mixing data, calculation and presentation on one sheet.",
      "No documented refresh path, so it rots on handover.",
      "Too many KPIs with no hierarchy.",
    ],
    followUps: [
      "When would you tell the stakeholder this should be a Power BI report instead?",
      "How do you make sure the reader knows which filter is active?",
    ],
    tags: ["dashboard", "design", "Power Query", "slicer", "KPI", "scenario"],
    related: ["xl-c-dashboard", "xl-q-revenue-formulas", "xl-q-slicer", "xl-q-power-query"],
    sources: [common("Scenario question that recurs across published Excel and data-analyst interview preparation resources.")],
  }),
  q({
    id: "xl-q-data-formats",
    category: "Fundamentals",
    title: "How many data formats are available, and which matter?",
    difficulty: "Easy",
    q: "How many data formats are available in Excel, and which ones matter for analysis?",
    hint: "Same twelve categories as cell formats — focus on which ones change behaviour.",
    answer:
      "Twelve built-in categories plus an open-ended Custom option. For analysis only a few change behaviour rather than appearance: Text, which forces the cell to store input as a string and preserves leading zeros; Date and Time, which rely on the underlying serial number; Number versus Accounting, which differ in alignment and how zeros display; and Custom, where a format string can display a value quite differently from what it is.",
    detail:
      "**The ones that change behaviour**\n\n- **Text** — the only format that changes how input is *stored*. Set a column to Text before typing product codes like `007`, or the leading zeros are gone permanently. This is also the format that breaks arithmetic when applied by accident.\n- **Date / Time** — display of an underlying serial number. Applying a date format to text does not create a date.\n- **General** — Excel guesses, which is convenient on entry and dangerous on import. Long numeric IDs get converted to scientific notation and lose precision.\n\n**Custom format codes worth knowing**\n\n| Code | Shows |\n|---|---|\n| `#,##0` | 1,234 |\n| `#,##0,,\"M\"` | 1M |\n| `0.0%` | 15.7% |\n| `[Red]-#,##0;[Green]#,##0` | colour by sign |\n| `[h]:mm` | hours beyond 24 |\n| `;;;` | hides the contents entirely |\n\nThe last one is a genuine trick question answer: three semicolons make a cell appear empty while still holding its value.\n\n**The rule to state**\n\nFormat is display; it does not convert. Formatting a text-stored number as Number leaves it text. Conversion needs `VALUE()`, Text to Columns with the right type, or Paste Special → Multiply by 1.\n\n**On import**\n\nThe most reliable route for a CSV with IDs, leading zeros or non-UK dates is Power Query rather than double-clicking the file, because you set the type per column explicitly and the choice is recorded.",
    code: [
      { lang: "Excel", label: "Millions with one decimal", code: "#,##0.0,,\"M\"" },
      { lang: "Excel", label: "Convert text to a real number", code: "=VALUE(A2)" },
    ],
    mistakes: [
      "Believing a Number format converts text.",
      "Opening a CSV directly and losing leading zeros irreversibly.",
    ],
    followUps: [
      "How do you preserve leading zeros when importing a CSV?",
      "What does the custom format `;;;` do?",
    ],
    tags: ["data formats", "custom format", "text", "import"],
    related: ["xl-q-cell-formats", "xl-c-cleaning-workflow", "xl-q-power-query"],
    sources: [GFG_EXCEL_DA],
  }),
];
