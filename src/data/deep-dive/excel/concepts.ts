import { conceptsFor } from "../helpers";
import type { DeepDiveItem } from "../types";

const c = conceptsFor("DATA", "excel");

export const EXCEL_CONCEPTS: DeepDiveItem[] = [
  // ------------------------------------------------------------------ FUNDAMENTALS
  c({
    id: "xl-c-workbook",
    category: "Fundamentals",
    title: "Workbook, worksheet, cell and range",
    difficulty: "Easy",
    body: `A **workbook** is the file (.xlsx). A **worksheet** is one tab inside it. A **cell** is one intersection of a row and a column, addressed as column-then-row — \`B7\` is column B, row 7. A **range** is a rectangular block of cells, written as its top-left and bottom-right corners joined by a colon: \`B2:D50\`.

Ranges are the unit almost every Excel function operates on, which is why range hygiene matters more than it first appears. A range written as \`B2:B50\` silently stops working the day row 51 arrives. Converting the data to a **Table** (Ctrl+T) instead gives you structured references like \`Sales[Amount]\` that grow with the data.`,
    example: `\`=SUM(B2:B50)\` breaks when you paste in new rows.
\`=SUM(Sales[Amount])\` does not.`,
    relevance: `Interviewers use this as a five-second screen. Answering "a range is a group of cells" is fine; adding that you would convert it to a Table so formulas do not go stale is what separates a user from an analyst.`,
    mistakes: [
      "Hardcoding a range that stops at today's last row.",
      "Confusing a worksheet with a workbook when describing a file structure.",
    ],
    tags: ["workbook", "worksheet", "range", "table"],
    related: ["xl-c-references", "xl-q-spreadsheet-components"],
  }),
  c({
    id: "xl-c-references",
    category: "Fundamentals",
    title: "Relative, absolute and mixed references",
    difficulty: "Easy",
    body: `Excel decides what a reference means when you **copy** it, and the dollar sign is what freezes it.

- **Relative** \`A1\` — both parts shift. Copy one row down and it becomes \`A2\`.
- **Absolute** \`$A$1\` — neither part shifts. Always \`A1\`, wherever you paste it.
- **Mixed** \`$A1\` (column locked) or \`A$1\` (row locked) — one part shifts, the other does not.

F4 cycles through the four states while editing.`,
    example: `A multiplication table is the canonical use of mixed references. In B2, write:

\`=$A2*B$1\`

and fill it across and down the whole grid. The column letter is locked to A for the row headers, the row number is locked to 1 for the column headers, so one formula fills the entire table.`,
    code: [{ lang: "Excel", label: "Mixed reference — fills a whole grid", code: "=$A2*B$1" }],
    relevance: `This is the most common "can you actually use Excel" question there is, and the multiplication-table follow-up is the version that catches people who only know \`$A$1\`. Being able to explain WHY \`$\` is needed — because copying rewrites the reference — is the real answer.`,
    mistakes: [
      "Making everything absolute to be safe, which breaks the moment you fill a formula across.",
      "Not knowing F4 toggles the states, then typing dollar signs by hand.",
    ],
    tags: ["references", "absolute", "relative", "mixed", "dollar sign"],
    related: ["xl-q-dollar-symbol", "xl-c-named-ranges"],
  }),
  c({
    id: "xl-c-named-ranges",
    category: "Fundamentals",
    title: "Named ranges and the Name Box",
    difficulty: "Easy",
    body: `A named range attaches a label to a cell or range, so \`=B2*$F$1\` becomes \`=B2*TaxRate\`. You create one from the **Name Box** to the left of the formula bar, or via Formulas → Define Name.

Names are absolute by default and workbook-scoped unless you deliberately scope them to a sheet. They make formulas self-documenting and they make constants (a tax rate, a target) editable in one place.`,
    example: `Name \`F1\` as \`TaxRate\`, then write \`=Subtotal*TaxRate\` instead of \`=B2*$F$1\`. Six months later the second version still explains itself.`,
    relevance: `It signals that you think about maintainability, not just getting today's number out. It also sets up the Table/structured-reference conversation.`,
    mistakes: [
      "Creating names that collide with cell addresses, which Excel rejects.",
      "Forgetting that a named range does not expand when data grows unless it is defined dynamically or is a Table column.",
    ],
    tags: ["named range", "name box"],
    related: ["xl-c-references", "xl-q-name-box"],
  }),
  c({
    id: "xl-c-formula-vs-function",
    category: "Fundamentals",
    title: "Formula vs function",
    difficulty: "Easy",
    body: `A **formula** is anything you type that starts with \`=\`. A **function** is a named, built-in piece of logic that a formula can call.

\`=A1+A2+A3\` is a formula with no function in it. \`=SUM(A1:A3)\` is a formula that calls the SUM function. Every function lives inside a formula; not every formula uses a function.`,
    example: `\`=B2*1.18\` — formula, no function.
\`=ROUND(B2*1.18, 2)\` — formula calling ROUND.`,
    relevance: `A vocabulary check that opens a lot of interviews. Answer it in one sentence and move on — dwelling on it reads as padding.`,
    mistakes: ["Using the two words interchangeably in an interview, which sounds imprecise."],
    tags: ["formula", "function"],
    related: ["xl-q-formula-vs-function"],
  }),

  // ------------------------------------------------------------------ CORE FUNCTIONS
  c({
    id: "xl-c-counts",
    category: "Formula",
    title: "COUNT, COUNTA, COUNTBLANK and COUNTIF",
    difficulty: "Easy",
    body: `Four counting functions that differ only in what they consider countable:

- **COUNT** — numeric values only. Text and blanks are ignored.
- **COUNTA** — anything non-empty, including text, errors, and the empty string \`""\` returned by a formula.
- **COUNTBLANK** — truly empty cells, plus cells containing \`""\`.
- **COUNTIF / COUNTIFS** — cells matching one condition / several conditions.

The trap is COUNTA versus COUNTBLANK on a column of formula results: a formula that returns \`""\` looks blank but COUNTA still counts it.`,
    example: `Column A holds \`5\`, \`"apple"\`, an empty cell, and \`=IF(B1>0,B1,"")\` which evaluates to \`""\`.

COUNT → 1 · COUNTA → 3 · COUNTBLANK → 1`,
    code: [
      { lang: "Excel", label: "Count sales over 1000 in the East region", code: "=COUNTIFS(Region, \"East\", Amount, \">1000\")" },
    ],
    relevance: `The COUNT/COUNTA distinction appears on essentially every Excel screen. The \`""\` edge case is the follow-up that separates rehearsed answers from real experience.`,
    mistakes: [
      "Assuming COUNTA ignores formula-produced empty strings.",
      "Reaching for COUNTIF when the criteria span multiple columns — that needs COUNTIFS.",
    ],
    tags: ["COUNT", "COUNTA", "COUNTBLANK", "COUNTIF", "COUNTIFS"],
    related: ["xl-q-count-counta", "xl-q-count-family", "xl-c-conditional-aggregation"],
  }),
  c({
    id: "xl-c-conditional-aggregation",
    category: "Formula",
    title: "Conditional aggregation: SUMIF, SUMIFS, AVERAGEIF, AVERAGEIFS",
    difficulty: "Easy",
    body: `These aggregate a range but only over the rows that satisfy your conditions.

The argument order is the trap. **SUMIF** puts the range to test first: \`SUMIF(criteria_range, criteria, [sum_range])\`. **SUMIFS** puts the range to sum first: \`SUMIFS(sum_range, criteria_range1, criteria1, ...)\`. They are backwards relative to each other, and this is the single most common Excel formula error in interviews.

Criteria are written as text: \`">1000"\`, \`"<>East"\`, \`"Jan*"\`. To compare against a cell, concatenate: \`">"&F1\`.`,
    example: `Total revenue for the East region in Q1:`,
    code: [
      { lang: "Excel", label: "SUMIF — criteria range first", code: "=SUMIF(A2:A100, \"East\", C2:C100)" },
      { lang: "Excel", label: "SUMIFS — sum range first", code: "=SUMIFS(C2:C100, A2:A100, \"East\", B2:B100, \"Q1\")" },
      { lang: "Excel", label: "Criteria from a cell", code: "=SUMIFS(C2:C100, D2:D100, \">\"&F1)" },
    ],
    relevance: `Conditional aggregation is what most analyst work actually is. Interviewers ask it because it is the closest thing to a real task that fits in a whiteboard question.`,
    mistakes: [
      "Swapping the argument order between SUMIF and SUMIFS.",
      "Writing \`>F1\` instead of \`\">\"&F1\`, which compares against the literal text.",
      "Mismatched range sizes — every range in a SUMIFS must have the same height.",
    ],
    tags: ["SUMIF", "SUMIFS", "AVERAGEIF", "AVERAGEIFS", "conditional"],
    related: ["xl-c-counts", "xl-q-sum-by-condition", "xl-q-weighted-average"],
  }),
  c({
    id: "xl-c-if-logic",
    category: "Formula",
    title: "IF, IFS, AND, OR and IFERROR",
    difficulty: "Easy",
    body: `**IF** takes a test, a value when true, and a value when false: \`IF(test, then, else)\`. Nesting IFs works but gets unreadable past two or three levels, which is what **IFS** exists for — it takes condition/result pairs and returns the first match, top to bottom.

**AND** and **OR** combine tests inside the first argument. **IFERROR** wraps an expression and substitutes a fallback when it errors, which is how you stop \`#N/A\` from propagating through a report.

Order matters in IFS: conditions are evaluated in sequence, so put the narrowest first.`,
    example: `Grade a score without a nest of IFs:`,
    code: [
      { lang: "Excel", label: "IFS — evaluated top to bottom", code: "=IFS(B2>=90,\"A\", B2>=80,\"B\", B2>=70,\"C\", TRUE,\"F\")" },
      { lang: "Excel", label: "AND inside IF", code: "=IF(AND(B2>1000, C2=\"East\"), \"Priority\", \"Standard\")" },
      { lang: "Excel", label: "IFERROR as a safety net", code: "=IFERROR(VLOOKUP(A2, Table, 3, FALSE), \"Not found\")" },
    ],
    relevance: `The IFERROR question is really a data-quality question. A good answer says you use it to present a clean message, but warns that blanket IFERROR hides genuine problems — you should know WHY the lookup failed before you paper over it.`,
    mistakes: [
      "Ordering IFS conditions widest-first, so every row matches the first branch.",
      "Wrapping an entire report in IFERROR and losing sight of real data errors.",
      "Forgetting the final \`TRUE\` catch-all in IFS, which leaves unmatched rows as #N/A.",
    ],
    tags: ["IF", "IFS", "AND", "OR", "IFERROR", "logical"],
    related: ["xl-q-if-function", "xl-q-iferror", "xl-c-errors"],
  }),
  c({
    id: "xl-c-errors",
    category: "Data Cleaning",
    title: "Excel error values and what each one means",
    difficulty: "Easy",
    body: `Every Excel error is a specific diagnosis, not a generic failure:

- **#N/A** — a lookup found nothing. The most common error in analyst work.
- **#REF!** — the formula points at a cell that no longer exists, usually after a delete.
- **#VALUE!** — wrong data type, typically arithmetic on text.
- **#DIV/0!** — division by zero or by an empty cell.
- **#NAME?** — Excel does not recognise the name, usually a typo in a function or an unquoted string.
- **#NUM!** — a number that is invalid for the operation, such as \`SQRT(-1)\`.
- **#NULL!** — the intersection operator (a space) between ranges that do not intersect.
- **#SPILL!** — a dynamic array cannot expand because something is in the way.

Reading the error tells you where to look, which is the point of the question.`,
    example: `\`=A1/B1\` where B1 is empty → \`#DIV/0!\`. Guard it with \`=IFERROR(A1/B1, 0)\` — or better, \`=IF(B1=0, "", A1/B1)\`, which only suppresses the case you actually expect.`,
    relevance: `Interviewers ask "what is the most common error you see" to find out whether you have debugged real spreadsheets. Naming #N/A and #REF! and explaining what each implies about the cause is a strong answer.`,
    mistakes: [
      "Treating every error as something to hide rather than diagnose.",
      "Confusing #REF! (deleted cell) with #NAME? (unknown identifier).",
    ],
    tags: ["errors", "#N/A", "#REF", "#VALUE", "#DIV/0", "#SPILL"],
    related: ["xl-c-if-logic", "xl-q-common-error"],
  }),

  // ------------------------------------------------------------------ LOOKUP
  c({
    id: "xl-c-vlookup",
    category: "Lookup",
    title: "VLOOKUP and its limits",
    difficulty: "Easy",
    body: `\`VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])\` searches the **first column** of a range for a value and returns something from a column to its right.

Three things constrain it, and all three are interview material:

1. It can only look **rightwards**. The key must be the leftmost column of the table array.
2. \`col_index_num\` is a **position**, not a name. Insert a column in the middle and every VLOOKUP silently returns the wrong field.
3. The fourth argument defaults to **TRUE** (approximate match), which is almost never what you want and silently returns wrong answers on unsorted data.

Always pass \`FALSE\` explicitly.`,
    example: `\`=VLOOKUP(A2, Products!$A$2:$D$500, 3, FALSE)\` — find A2 in the first column of the product table, return the third column, exact match only.`,
    code: [
      { lang: "Excel", label: "Correct VLOOKUP — note the explicit FALSE", code: "=VLOOKUP(A2, Products!$A$2:$D$500, 3, FALSE)" },
      { lang: "Excel", label: "Robust against inserted columns", code: "=VLOOKUP(A2, Products!$A$2:$D$500, MATCH(\"Price\", Products!$A$1:$D$1, 0), FALSE)" },
    ],
    relevance: `"What is the default value of the last VLOOKUP argument" is a real, frequently asked question, and the answer — TRUE, approximate match — is the single most dangerous default in Excel.`,
    mistakes: [
      "Omitting the fourth argument and getting approximate matches on unsorted data.",
      "Hardcoding col_index_num, then breaking every formula when a column is inserted.",
      "Trying to look left, which VLOOKUP simply cannot do.",
    ],
    tags: ["VLOOKUP", "lookup", "exact match", "approximate match"],
    related: ["xl-c-index-match", "xl-c-xlookup", "xl-q-vlookup", "xl-q-vlookup-default"],
  }),
  c({
    id: "xl-c-index-match",
    category: "Lookup",
    title: "INDEX + MATCH",
    difficulty: "Medium",
    body: `\`INDEX(return_range, row_number)\` returns the nth item of a range. \`MATCH(value, lookup_range, 0)\` returns the position of a value within a range. Compose them and MATCH supplies the row number INDEX needs.

This beats VLOOKUP on all three of its limits: it looks in any direction, it references columns by range rather than by position so inserting columns is harmless, and it reads more clearly once you are used to it.

The two-dimensional form uses MATCH twice — once down for the row, once across for the column.`,
    example: `Look up a price by product ID where the ID column sits to the RIGHT of the price column, which VLOOKUP cannot do:`,
    code: [
      { lang: "Excel", label: "One-dimensional lookup", code: "=INDEX(Price, MATCH(A2, ProductID, 0))" },
      { lang: "Excel", label: "Two-dimensional — row and column both matched", code: "=INDEX($B$2:$M$50, MATCH($A2, $A$2:$A$50, 0), MATCH(B$1, $B$1:$M$1, 0))" },
      { lang: "Excel", label: "Multi-condition lookup without a helper column", code: "=INDEX(Price, MATCH(1, (Region=\"East\")*(Product=A2), 0))" },
    ],
    relevance: `"Differentiate VLOOKUP and INDEX-MATCH" is one of the most reliably asked Excel questions. The answer that lands is not a feature list — it is that INDEX/MATCH decouples the lookup from column position, so the workbook survives schema changes.`,
    mistakes: [
      "Forgetting the \`0\` third argument to MATCH, which defaults to approximate.",
      "Giving INDEX a return range of a different height to the MATCH range.",
      "Reciting 'INDEX/MATCH is faster' as the main advantage — the structural advantage matters far more.",
    ],
    tags: ["INDEX", "MATCH", "lookup", "two-way lookup"],
    related: ["xl-c-vlookup", "xl-c-xlookup", "xl-q-index-match", "xl-q-vlookup-vs-indexmatch"],
  }),
  c({
    id: "xl-c-xlookup",
    category: "Lookup",
    title: "XLOOKUP",
    difficulty: "Medium",
    body: `\`XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])\` is the modern replacement for both VLOOKUP and INDEX/MATCH.

What it fixes:
- **Exact match is the default.** The dangerous default is gone.
- **Separate lookup and return arrays**, so direction is irrelevant.
- **Built-in not-found handling** as the fourth argument — no IFERROR wrapper needed.
- **Search mode** lets you search bottom-up (\`-1\`), which is how you find the *latest* matching record.
- It can **return a whole range**, which makes two-way lookups a single nested XLOOKUP.

The catch is availability: it requires Microsoft 365 or Excel 2021. On older versions you still need INDEX/MATCH.`,
    example: `Find the most recent price for a product by searching from the bottom:`,
    code: [
      { lang: "Excel", label: "Basic — exact match by default", code: "=XLOOKUP(A2, ProductID, Price, \"Not found\")" },
      { lang: "Excel", label: "Last match, searching bottom-up", code: "=XLOOKUP(A2, ProductID, Price, \"Not found\", 0, -1)" },
      { lang: "Excel", label: "Two-way lookup by nesting", code: "=XLOOKUP(A2, ProductID, XLOOKUP(B1, Headers, DataRange))" },
    ],
    relevance: `"Difference between VLOOKUP and XLOOKUP" is now a standard question. Mentioning the version constraint unprompted is a strong signal — it shows you have deployed workbooks to other people's machines.`,
    mistakes: [
      "Assuming XLOOKUP is available everywhere and shipping a workbook that breaks on Excel 2019.",
      "Not knowing about search_mode = -1, which is the clean answer to 'find the latest record'.",
    ],
    tags: ["XLOOKUP", "lookup", "dynamic arrays"],
    related: ["xl-c-vlookup", "xl-c-index-match", "xl-q-xlookup", "xl-q-vlookup-vs-xlookup"],
  }),

  // ------------------------------------------------------------------ TEXT
  c({
    id: "xl-c-text-extract",
    category: "Text",
    title: "LEFT, RIGHT, MID, LEN, FIND and SEARCH",
    difficulty: "Easy",
    body: `Text extraction in Excel is almost always a composition of two ideas: *find the position of a delimiter*, then *cut relative to it*.

- **LEFT(text, n)** / **RIGHT(text, n)** — n characters from either end.
- **MID(text, start, n)** — n characters from a position.
- **LEN(text)** — length, used to compute the "rest of the string".
- **FIND(needle, haystack)** — position, case-**sensitive**, no wildcards.
- **SEARCH(needle, haystack)** — position, case-**insensitive**, wildcards allowed.

The FIND/SEARCH distinction is the question that gets asked; case sensitivity is the answer.`,
    example: `Split "Priya Sharma" into first and last name:`,
    code: [
      { lang: "Excel", label: "First name — everything before the space", code: "=LEFT(A2, FIND(\" \", A2) - 1)" },
      { lang: "Excel", label: "Last name — everything after it", code: "=RIGHT(A2, LEN(A2) - FIND(\" \", A2))" },
      { lang: "Excel", label: "Modern equivalents (365)", code: "=TEXTBEFORE(A2, \" \")\n=TEXTAFTER(A2, \" \")" },
    ],
    relevance: `"How do you get a first name from a whole name" is a classic hands-on prompt. The strong answer gives the formula, then notes that Text-to-Columns or Power Query is better for a one-off bulk split, and TEXTBEFORE/TEXTAFTER is cleaner on modern Excel.`,
    mistakes: [
      "Using FIND when the data has inconsistent capitalisation — SEARCH is the tolerant one.",
      "Forgetting the \`-1\` in LEFT, which includes the delimiter.",
      "Not handling middle names, which breaks a naive RIGHT-based last-name formula.",
    ],
    tags: ["LEFT", "RIGHT", "MID", "LEN", "FIND", "SEARCH", "text"],
    related: ["xl-c-text-clean", "xl-q-first-name", "xl-q-split-columns"],
  }),
  c({
    id: "xl-c-text-clean",
    category: "Text",
    title: "TRIM, CLEAN, SUBSTITUTE and TEXTJOIN",
    difficulty: "Easy",
    body: `- **TRIM** removes leading, trailing and repeated internal spaces — but not non-breaking spaces (character 160), which is exactly what you get when pasting from a web page.
- **CLEAN** strips non-printable control characters.
- **SUBSTITUTE(text, old, new)** replaces by content; **REPLACE(text, start, n, new)** replaces by position.
- **CONCAT** / **TEXTJOIN** combine strings, with TEXTJOIN adding a delimiter and the ability to skip blanks.

The non-breaking-space trap is worth memorising: \`=TRIM(CLEAN(SUBSTITUTE(A2, CHAR(160), " ")))\` is the belt-and-braces clean.`,
    example: `Data pasted from a website still fails a VLOOKUP even after TRIM, because the "spaces" are CHAR(160):`,
    code: [
      { lang: "Excel", label: "The full clean", code: "=TRIM(CLEAN(SUBSTITUTE(A2, CHAR(160), \" \")))" },
      { lang: "Excel", label: "TEXTJOIN, skipping blanks", code: "=TEXTJOIN(\", \", TRUE, B2:F2)" },
    ],
    relevance: `Data cleaning questions are where interviewers look for scar tissue. Anyone can name TRIM; naming CHAR(160) as the reason TRIM "did not work" is a genuine field signal.`,
    mistakes: [
      "Assuming TRIM handles every kind of whitespace.",
      "Using SUBSTITUTE when you meant REPLACE, or vice versa.",
    ],
    tags: ["TRIM", "CLEAN", "SUBSTITUTE", "REPLACE", "TEXTJOIN", "CONCAT"],
    related: ["xl-c-text-extract", "xl-c-cleaning-workflow", "xl-q-trim"],
  }),

  // ------------------------------------------------------------------ DATES
  c({
    id: "xl-c-dates",
    category: "Dates",
    title: "How Excel stores dates, and the date functions built on that",
    difficulty: "Medium",
    body: `Excel stores a date as a **serial number**: days elapsed since 1 January 1900, which is serial 1. Times are the fractional part — 0.5 is midday. Everything about date handling follows from this.

Because dates are numbers, you can subtract them directly to get days. Formatting is purely cosmetic; a "date" that will not do arithmetic is text, and that is the single most common date problem in real workbooks.

Key functions: **TODAY()** and **NOW()** (volatile, recalculate constantly), **DATE(y,m,d)** to build one, **YEAR/MONTH/DAY** to take one apart, **EOMONTH** for month-end, **DATEDIF** for age in whole units, **NETWORKDAYS** and **WORKDAY** for business days with a holiday list.`,
    example: `Age in complete years, and the number of working days in a project:`,
    code: [
      { lang: "Excel", label: "Age in whole years", code: "=DATEDIF(A2, TODAY(), \"Y\")" },
      { lang: "Excel", label: "Business days, excluding a holiday list", code: "=NETWORKDAYS(StartDate, EndDate, Holidays)" },
      { lang: "Excel", label: "Last day of the month, three months out", code: "=EOMONTH(A2, 3)" },
      { lang: "Excel", label: "Rescue text that looks like a date", code: "=DATEVALUE(A2)" },
    ],
    relevance: `Date questions test whether you understand the storage model or just the formatting. "Why is my date not sorting correctly" is a real diagnostic scenario, and the answer — it is text, not a date serial — requires knowing how dates are stored.`,
    mistakes: [
      "Treating left-aligned dates as dates. Excel right-aligns real numbers; left-aligned means text.",
      "Using TODAY() in a stored record, so historical rows silently change every day.",
      "Forgetting DATEDIF is undocumented and does not autocomplete, then assuming it does not exist.",
    ],
    tags: ["dates", "DATEDIF", "EOMONTH", "NETWORKDAYS", "TODAY", "serial number"],
    related: ["xl-q-current-date", "xl-q-networkdays", "xl-q-datedif"],
  }),

  // ------------------------------------------------------------------ DATA CLEANING
  c({
    id: "xl-c-cleaning-workflow",
    category: "Data Cleaning",
    title: "A repeatable data cleaning workflow",
    difficulty: "Medium",
    body: `Interviewers rarely want a list of features here — they want a **sequence** that shows you have done this before:

1. **Profile first.** Row count, blanks per column, distinct counts, min/max. You cannot clean what you have not measured.
2. **Fix types.** Numbers stored as text, dates stored as text. Everything downstream depends on this.
3. **Normalise whitespace and case** — TRIM, CLEAN, the CHAR(160) substitution, PROPER/UPPER where categories should match.
4. **Handle duplicates.** Decide whether a duplicate means a genuine repeat or a data-entry error, and whether "duplicate" means whole-row or key-column. Highlight before you delete.
5. **Handle missing values** deliberately: leave blank, impute, or exclude — and say which, because each biases differently.
6. **Validate.** Data Validation rules and conditional formatting to stop the problem recurring at entry.
7. **Document.** For anything recurring, do it in Power Query so the steps are recorded and repeatable.

That last point is the one that impresses. Manual cleaning is a one-off; Power Query is a pipeline.`,
    example: `Asked "how would you clean this file", walk the seven steps and name the tool at each one. Naming Power Query at the end converts a tactical answer into an architectural one.`,
    relevance: `This is the most open-ended Excel question asked and the one candidates handle worst, usually by listing "Remove Duplicates, TRIM, filters" with no order or reasoning.`,
    mistakes: [
      "Deleting duplicates before checking whether they are legitimate repeat transactions.",
      "Imputing missing numerics with 0, which silently drags every average down.",
      "Cleaning by hand something that will arrive again next month.",
    ],
    tags: ["data cleaning", "duplicates", "missing values", "validation"],
    related: ["xl-c-text-clean", "xl-c-powerquery", "xl-q-clean-data", "xl-q-missing-values"],
  }),
  c({
    id: "xl-c-validation",
    category: "Data Cleaning",
    title: "Data validation and dependent drop-downs",
    difficulty: "Medium",
    body: `Data Validation constrains what a cell will accept: a list, a numeric range, a date range, a text length, or a custom formula that must evaluate TRUE.

A **dependent drop-down** narrows the second list based on the first. The classic construction uses named ranges plus INDIRECT: name each sub-list after its parent value, then set the child list source to \`=INDIRECT(A2)\`. On Microsoft 365 the cleaner construction is a FILTER formula feeding the list.

Validation is prevention rather than cure — it is the answer to "how do you stop this data being dirty next time".`,
    example: `Country in A2 drives State in B2:`,
    code: [
      { lang: "Excel", label: "Dependent list — classic INDIRECT method", code: "=INDIRECT($A2)" },
      { lang: "Excel", label: "Dependent list — dynamic array method (365)", code: "=FILTER(States, Countries=$A2)" },
      { lang: "Excel", label: "Custom rule — reject duplicates on entry", code: "=COUNTIF($A:$A, A1) = 1" },
    ],
    relevance: `Being asked to build a dependent drop-down is a genuine hands-on task. Knowing both the INDIRECT and FILTER routes, and when each applies, covers whichever Excel version is on the interviewer's machine.`,
    mistakes: [
      "Named ranges with spaces, which INDIRECT cannot resolve — substitute underscores.",
      "Assuming validation applies retroactively. It only checks new entries; existing bad data stays.",
    ],
    tags: ["data validation", "dropdown", "INDIRECT", "dependent list"],
    related: ["xl-c-named-ranges", "xl-q-dropdown", "xl-q-dependent-dropdown"],
  }),

  // ------------------------------------------------------------------ PIVOT
  c({
    id: "xl-c-pivot",
    category: "Pivot",
    title: "Pivot tables: rows, columns, values and filters",
    difficulty: "Medium",
    body: `A pivot table aggregates a flat table without formulas. Four drop zones control everything:

- **Rows / Columns** — the dimensions you group by.
- **Values** — the measure, with an aggregation (Sum, Count, Average, Distinct Count).
- **Filters** — a page-level slice.

Two behaviours cause most confusion. First, a pivot reads a **cached snapshot** of the source, so edits to the source do nothing until you Refresh. Second, the default aggregation flips to **Count** instead of Sum the moment the value column contains one text cell or one blank — which is usually a symptom of a data type problem, not a pivot problem.

**Slicers** are visual filters that can drive several pivots at once. **Calculated fields** add a formula that operates on the aggregated data, and famously compute on the *sum* rather than row-by-row, which is why a calculated margin field can disagree with a manual one.`,
    example: `Revenue by region and quarter: Region → Rows, Quarter → Columns, Amount → Values (Sum). Add a Product slicer to filter interactively.`,
    relevance: `Pivot tables are the fastest way to demonstrate analytical fluency. The strongest answers volunteer the refresh behaviour and the Count-instead-of-Sum diagnosis, because both are things you only learn by being bitten.`,
    mistakes: [
      "Not refreshing, then reporting stale numbers.",
      "Grouping dates that are stored as text, which offers no grouping options at all.",
      "Trusting a calculated field for a ratio without checking it against a row-level computation.",
    ],
    tags: ["pivot table", "slicer", "calculated field", "grouping", "refresh"],
    related: ["xl-c-pivot-advanced", "xl-q-pivot-table", "xl-q-create-pivot", "xl-q-slicer"],
  }),
  c({
    id: "xl-c-pivot-advanced",
    category: "Pivot",
    title: "Grouping, Show Values As, and Power Pivot",
    difficulty: "Hard",
    body: `Beyond the basics, three capabilities cover most advanced pivot questions:

**Grouping** — right-click a date field to roll up by month, quarter or year; right-click a numeric field to create bins. This is how you build an age-band or price-band distribution without helper columns.

**Show Values As** — turns a raw measure into a comparison: % of Grand Total, % of Parent Row, Difference From, Running Total, Rank. Most "how do you show contribution by category" questions are answered by this menu rather than a formula.

**Power Pivot** — the Data Model. It lifts the one-million-row worksheet limit, lets you relate multiple tables without flattening them into one sheet first, and gives you DAX measures. When an interviewer asks how you would analyse data too big for a worksheet, Power Pivot plus Power Query is the answer.`,
    example: `Contribution by category without a single formula: put Category in Rows, Sales in Values twice, and set the second copy to Show Values As → % of Grand Total.`,
    relevance: `Power Pivot is the bridge question between Excel and Power BI. Candidates who can explain that Power Pivot IS the same tabular engine that Power BI uses tend to interview well for both roles.`,
    mistakes: [
      "Building helper columns for things Show Values As does natively.",
      "Trying to relate tables with VLOOKUP when the Data Model would do it properly.",
    ],
    tags: ["Power Pivot", "grouping", "show values as", "data model", "DAX"],
    related: ["xl-c-pivot", "xl-c-powerquery", "xl-q-power-pivot", "pbi-c-dax-intro"],
  }),

  // ------------------------------------------------------------------ CHARTS
  c({
    id: "xl-c-charts",
    category: "Charts",
    title: "Choosing the right chart",
    difficulty: "Easy",
    body: `Chart choice follows from the question, not from taste:

- **Comparison across categories** → bar (horizontal if labels are long) or column.
- **Trend over time** → line. Never a bar chart for a long time series.
- **Relationship between two numerics** → scatter. Add a trendline for correlation.
- **Distribution of one numeric** → histogram or box plot.
- **Composition** → stacked bar, or a waterfall when you need to show how you got from a starting figure to an ending one.
- **Two measures on different scales** → combo chart with a secondary axis.

Pie charts survive only for a handful of categories summing to a meaningful whole, and even then a bar chart usually reads better.`,
    example: `"Quarterly sales trend for the last five years" → line chart, time on the x-axis. "Contribution of each product to revenue" → stacked bar or a sorted column chart, not a pie with fourteen slices.`,
    relevance: `Visualisation questions are really communication questions. Interviewers want to hear you tie the chart type to the analytical question and the audience.`,
    mistakes: [
      "Truncating the y-axis on a bar chart, which exaggerates differences.",
      "Using a dual axis without saying so, which invites false comparisons.",
      "Pie charts with more than about five slices.",
    ],
    tags: ["charts", "visualization", "waterfall", "histogram", "combo chart"],
    related: ["xl-q-chart-types", "xl-q-dynamic-chart", "tb-c-chart-choice"],
  }),

  // ------------------------------------------------------------------ POWER QUERY
  c({
    id: "xl-c-powerquery",
    category: "Power Query",
    title: "Power Query and the transformation pipeline",
    difficulty: "Medium",
    body: `Power Query (Get & Transform) is Excel's ETL layer. You connect to a source, apply a sequence of transformation steps, and load the result. Every step is recorded in **Applied Steps** and re-executes on refresh — which is the whole point.

The mental shift is that Power Query does not edit data, it records a **recipe**. Next month's file goes through the same steps with one click.

Core operations: remove/keep rows, change type, split and merge columns, unpivot (turning a cross-tab into a tidy long table — the single most valuable transformation there is), group by, **Merge** (a join) and **Append** (a union).

**Query folding** is the performance concept: when the source is a database, Power Query pushes as much of your transformation as possible back into a single SQL query. Steps that cannot fold force the whole dataset to be pulled locally, so ordering matters — filter early, add custom columns late.`,
    example: `A monthly sales file with months spread across twelve columns is unusable in a pivot. Unpivot those columns and you get a tidy Month/Value pair per row, which pivots correctly and keeps working when a thirteenth month arrives.`,
    code: [
      { lang: "M", label: "Applied step, in M", code: "= Table.SelectRows(Source, each [Amount] > 1000)" },
    ],
    relevance: `"What is Power Query" is the entry question; "what is query folding" is the one that identifies someone who has tuned a real refresh. Merge-vs-Append is asked constantly and the answer is simply columns versus rows.`,
    mistakes: [
      "Confusing Merge (adds columns, a join) with Append (adds rows, a union).",
      "Adding a custom column early and breaking query folding for everything after it.",
      "Cleaning by hand what should have been a recorded step.",
    ],
    tags: ["Power Query", "M", "ETL", "unpivot", "merge", "append", "query folding"],
    related: ["xl-c-cleaning-workflow", "xl-q-power-query", "xl-q-merge-vs-append", "pbi-c-query-folding"],
  }),

  // ------------------------------------------------------------------ ADVANCED
  c({
    id: "xl-c-dynamic-arrays",
    category: "Advanced",
    title: "Dynamic arrays: FILTER, SORT, UNIQUE, SEQUENCE and LET",
    difficulty: "Hard",
    body: `In Microsoft 365, a formula can return many values that **spill** into neighbouring cells. One formula, a whole result set. The spilled range is referenced with a hash: \`D2#\`.

- **UNIQUE(range)** — distinct values, replacing Remove Duplicates for anything that must stay live.
- **FILTER(range, condition, [if_empty])** — rows meeting a condition. The workhorse.
- **SORT / SORTBY** — ordered results without touching the source.
- **SEQUENCE(n)** — a generated list of numbers, useful for date scaffolds.
- **LET(name, value, ..., calculation)** — names intermediate results so a long formula computes each part once and reads like code.
- **LAMBDA** — a reusable named function, for when the same logic repeats.

\`#SPILL!\` means something is blocking the output range.`,
    example: `A live list of East-region orders over 1000, sorted by amount, from a single formula:`,
    code: [
      { lang: "Excel", label: "FILTER + SORT, spilled", code: "=SORT(FILTER(A2:D500, (B2:B500=\"East\")*(D2:D500>1000), \"None found\"), 4, -1)" },
      { lang: "Excel", label: "UNIQUE, live", code: "=UNIQUE(B2:B500)" },
      { lang: "Excel", label: "LET — compute once, read clearly", code: "=LET(\n  net,  Revenue - Returns,\n  rate, net / Target,\n  IF(rate > 1, \"Above target\", ROUND(rate, 2))\n)" },
    ],
    relevance: `Dynamic arrays are the clearest marker of current Excel knowledge. A candidate who solves "extract unique values" with UNIQUE rather than Remove Duplicates is telling you they keep up.`,
    mistakes: [
      "Assuming these work in Excel 2019 — they need 365 or 2021.",
      "Placing a spilled formula where existing data blocks the range, then not recognising #SPILL!.",
      "Using Remove Duplicates when the answer needs to update as data changes.",
    ],
    tags: ["dynamic arrays", "FILTER", "SORT", "UNIQUE", "LET", "LAMBDA", "SPILL"],
    related: ["xl-c-xlookup", "xl-q-dynamic-array", "xl-q-unique", "xl-q-array-formula"],
  }),
  c({
    id: "xl-c-whatif",
    category: "Advanced",
    title: "Goal Seek, Solver and Scenario Manager",
    difficulty: "Medium",
    body: `Three what-if tools, increasing in power:

- **Goal Seek** — one input, one target. "What discount rate gets profit to exactly zero?" Excel back-solves the single cell.
- **Solver** — many inputs, an objective to maximise or minimise, and constraints. This is genuine optimisation: allocate a budget across channels to maximise return subject to a cap per channel. It is an add-in and must be enabled.
- **Scenario Manager** — stores named sets of input values (Best / Base / Worst) and switches between them, producing a comparison summary.

The distinction interviewers want is Goal Seek = one variable, no constraints; Solver = many variables with constraints.`,
    example: `Goal Seek: set the break-even cell to 0 by changing the units-sold cell. Solver: maximise total profit by changing the units of four products, subject to total machine hours ≤ 500 and each product's units ≥ 0.`,
    relevance: `These come up in finance-flavoured analyst interviews. Naming Solver's three parts — objective, variable cells, constraints — is a concise, complete answer.`,
    mistakes: [
      "Describing Solver as 'Goal Seek for several cells' while omitting constraints, which are its whole point.",
      "Forgetting Solver is an add-in that has to be loaded.",
    ],
    tags: ["Goal Seek", "Solver", "what-if", "Scenario Manager", "optimization"],
    related: ["xl-q-goal-seek", "xl-q-solver"],
  }),
  c({
    id: "xl-c-macros",
    category: "Advanced",
    title: "Macros and VBA",
    difficulty: "Medium",
    body: `A **macro** is a recorded or written sequence of Excel actions. **VBA** is the language behind them.

Two vocabulary distinctions get asked directly:

- **Sub vs Function** — a Sub performs actions and returns nothing; a Function returns a value and can be called from a worksheet cell as a custom formula (a UDF).
- **ThisWorkbook vs ActiveWorkbook** — \`ThisWorkbook\` is the workbook containing the running code; \`ActiveWorkbook\` is whichever one currently has focus. They differ the moment your macro opens or switches files, and confusing them is a classic source of a macro writing into the wrong file.

Files with macros must be saved as .xlsm. Recording a macro is the fastest way to learn the object model, but recorded code is verbose and full of \`Select\` calls that should be refactored away.`,
    example: `A recorded macro produces \`Range("A1").Select : Selection.Value = 5\`. The idiomatic version is \`Range("A1").Value = 5\` — no selection needed, and far faster in a loop.`,
    code: [
      { lang: "VBA", label: "Sub — does something", code: "Sub ClearFilters()\n    If ActiveSheet.AutoFilterMode Then ActiveSheet.AutoFilterMode = False\nEnd Sub" },
      { lang: "VBA", label: "Function — returns a value, usable in a cell", code: "Function MarginPct(rev As Double, cost As Double) As Double\n    If rev = 0 Then Exit Function\n    MarginPct = (rev - cost) / rev\nEnd Function" },
    ],
    relevance: `Automation questions test judgement as much as syntax. The best answers note that Power Query has replaced VBA for most data-transformation automation, and VBA is now mainly for UI actions and application control.`,
    mistakes: [
      "Saving as .xlsx and losing the macros silently.",
      "Leaving Select/Activate in production code.",
      "Reaching for VBA where Power Query would be more maintainable.",
    ],
    tags: ["macro", "VBA", "automation", "sub", "function", "UDF"],
    related: ["xl-c-powerquery", "xl-q-macro", "xl-q-vba-sub-function", "xl-q-thisworkbook"],
  }),

  // ------------------------------------------------------------------ BUSINESS ANALYSIS
  c({
    id: "xl-c-business-metrics",
    category: "Business Analysis",
    title: "Business metrics an analyst is expected to compute",
    difficulty: "Medium",
    body: `The formulas interviewers expect on sight:

- **Growth %** = (Current − Prior) / Prior. Guard the zero denominator.
- **CAGR** = (End / Start)^(1/years) − 1.
- **Gross margin %** = (Revenue − COGS) / Revenue.
- **Contribution %** = Category / Grand Total.
- **Weighted average** = SUMPRODUCT(values, weights) / SUM(weights).
- **Run rate** = period-to-date ÷ days elapsed × days in period.
- **Variance to budget** = Actual − Budget, usually shown alongside the percentage.

Two habits matter as much as the formulas: always state whether a growth number is year-on-year or period-on-period, and always guard division so a zero prior period does not produce \`#DIV/0!\` across a report.`,
    example: `Revenue grew from 40 lakh to 62 lakh over three years. CAGR = (62/40)^(1/3) − 1 ≈ 15.7%.`,
    code: [
      { lang: "Excel", label: "CAGR", code: "=(EndValue/StartValue)^(1/Years) - 1" },
      { lang: "Excel", label: "Weighted average", code: "=SUMPRODUCT(Scores, Weights)/SUM(Weights)" },
      { lang: "Excel", label: "Safe growth percentage", code: "=IF(Prior=0, \"n/a\", (Current-Prior)/Prior)" },
    ],
    relevance: `"Name five financial formulas you would put on a BI dashboard" is asked verbatim. Having margin, growth, CAGR, contribution and variance-to-budget ready, with the guard clauses, answers it completely.`,
    mistakes: [
      "Averaging percentages instead of recomputing from the underlying totals.",
      "Reporting growth without stating the comparison period.",
      "Computing CAGR over a period that includes a structural break, making it meaningless.",
    ],
    tags: ["CAGR", "growth", "margin", "weighted average", "KPI", "variance"],
    related: ["xl-q-cagr", "xl-q-weighted-average", "xl-q-percentage", "xl-q-revenue-formulas"],
  }),
  c({
    id: "xl-c-dashboard",
    category: "Business Analysis",
    title: "Building an Excel dashboard that survives contact with users",
    difficulty: "Hard",
    body: `A dashboard is an architecture question, not a formatting one. The structure that holds up:

1. **Three-layer separation** — a raw data sheet nobody edits, a calculation layer, and a presentation layer. Never mix them.
2. **Power Query for ingestion**, so a refresh is one click and the steps are documented.
3. **Data Model / Power Pivot** for relationships, rather than flattening everything with VLOOKUPs.
4. **Pivots and slicers** for interactivity; connect one slicer to multiple pivots via Report Connections.
5. **A visual hierarchy** — headline KPIs at the top left, supporting detail below, filters in a consistent place.
6. **Guarded formulas** everywhere, so one bad row does not fill the dashboard with errors.
7. **A documented refresh procedure**, because someone else will run it.

When asked to "design a dashboard", spend your first sentences on the audience and the decision it supports. A dashboard that does not change a decision is a report.`,
    example: `A sales dashboard for regional managers: revenue, growth vs last year, margin and top-five products as headline tiles; a trend line beneath; region and period slicers pinned top-right. One refresh button, one data source.`,
    relevance: `Dashboard questions are the most common scenario prompt in analyst interviews, and the discriminator is whether you talk about the audience and the pipeline or jump straight to chart colours.`,
    mistakes: [
      "Formulas pointing at the presentation layer, so a formatting change breaks the maths.",
      "No refresh path, so the dashboard rots the day you hand it over.",
      "Fifteen KPIs with no hierarchy, so nothing stands out.",
    ],
    tags: ["dashboard", "KPI", "slicer", "design", "Power Query"],
    related: ["xl-c-pivot-advanced", "xl-c-powerquery", "xl-q-dashboard-design", "pbi-c-report-design"],
  }),
];
