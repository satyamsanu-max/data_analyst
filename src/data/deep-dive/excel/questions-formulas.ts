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

/** Formulas, logic, lookup, text and dates. */
export const EXCEL_QUESTIONS_FORMULAS: DeepDiveItem[] = [
  // =========================================================== CORE FORMULAS
  q({
    id: "xl-q-formula",
    category: "Formula",
    title: "What is a formula in Excel?",
    difficulty: "Easy",
    q: "What is a formula in Excel?",
    hint: "Start with the character that makes it one, then say what it can contain.",
    answer:
      "A formula is any cell entry beginning with an equals sign that Excel evaluates rather than stores literally. It can combine constants, cell references, operators and functions — =B2*1.18, =SUM(A1:A10), =IF(B2>100,\"High\",\"Low\"). Because it references other cells, the result updates automatically whenever those change, which is what makes a spreadsheet a model rather than a table.",
    detail:
      "**Operator precedence**\n\nExcel evaluates in the order: parentheses, exponent `^`, then `*` and `/`, then `+` and `-`, then comparison operators. `=2+3*4` is 14, not 20. Use parentheses whenever the reading is not instantly obvious — reviewers should not have to recall precedence rules.\n\n**Text and reference operators**\n\n`&` concatenates: `=A2 & \" \" & B2`. A colon makes a range, a comma unions ranges, and a space is the intersection operator — the last one is obscure but explains the `#NULL!` error.\n\n**Entering formulas**\n\nTyping `=` starts one. Ctrl+` toggles between showing results and showing the formulas themselves, which is the fastest way to audit a sheet you did not write.",
    code: [{ lang: "Excel", label: "Precedence needs parentheses", code: "=(A1 + A2) * 0.18" }],
    mistakes: [
      "Relying on operator precedence instead of parentheses in anything non-trivial.",
      "Forgetting the leading `=`, so the cell stores text.",
    ],
    followUps: ["How would you display every formula in a sheet at once?"],
    tags: ["formula", "operators", "precedence"],
    related: ["xl-c-formula-vs-function", "xl-q-formula-vs-function"],
    sources: [GFG_EXCEL],
  }),
  q({
    id: "xl-q-count-counta",
    category: "Formula",
    title: "Difference between COUNT and COUNTA",
    difficulty: "Easy",
    q: "What is the difference between COUNT and COUNTA?",
    hint: "One is fussy about data type. The other is not.",
    answer:
      "COUNT counts only numeric values in a range, ignoring text, logicals and blanks. COUNTA counts every non-empty cell regardless of type, including text and error values. So in a column holding 5, \"apple\" and one blank, COUNT returns 1 and COUNTA returns 2.",
    detail:
      "**Where it bites**\n\nCounting a column of IDs. If some IDs were imported as text and some as numbers, COUNT silently under-reports and COUNTA does not — the gap between the two is itself a useful data-quality signal.\n\n**The edge case worth volunteering**\n\nA formula returning `\"\"` produces a cell that looks empty but is not. COUNTA counts it; COUNT does not; COUNTBLANK does count it, because COUNTBLANK treats an empty string as blank. So on a column of `=IF(x,y,\"\")` formulas you can get COUNTA and COUNTBLANK both non-zero and summing to more than the row count.\n\n**Quick reference**\n\n| Function | Counts |\n|---|---|\n| COUNT | numbers only |\n| COUNTA | any non-empty cell |\n| COUNTBLANK | empty cells and `\"\"` |\n| COUNTIF | cells matching one condition |\n| COUNTIFS | cells matching several |",
    mistakes: [
      "Assuming COUNTA ignores formula-produced empty strings.",
      "Using COUNT on a column of text-formatted numbers and reporting zero.",
    ],
    followUps: ["What does COUNTA return for a cell containing a formula that evaluates to \"\"?"],
    tags: ["COUNT", "COUNTA", "counting"],
    related: ["xl-c-counts", "xl-q-count-family"],
    sources: [GFG_EXCEL, GFG_EXCEL_DA],
  }),
  q({
    id: "xl-q-count-family",
    category: "Formula",
    title: "COUNT vs COUNTA vs COUNTBLANK vs COUNTIF",
    difficulty: "Easy",
    q: "What is the difference between the COUNT, COUNTA, COUNTBLANK and COUNTIF functions?",
    hint: "Three differ by data type; the fourth differs by taking a condition.",
    answer:
      "COUNT counts numbers. COUNTA counts anything non-empty. COUNTBLANK counts empty cells, and also counts cells holding an empty string. COUNTIF is the odd one out — it counts cells meeting a stated condition, such as =COUNTIF(A2:A100,\">1000\"), and COUNTIFS extends that to several conditions across several columns.",
    detail:
      "**Writing COUNTIF criteria**\n\nCriteria are strings. Literal comparison: `\">1000\"`. Against a cell: `\">\"&F1` — the concatenation is required, because `\">F1\"` compares against the literal text \"F1\". Wildcards work on text: `\"Jan*\"` matches anything starting with Jan, `\"?at\"` matches cat and bat.\n\n**COUNTIFS rules**\n\nEvery range must be the same size, and the conditions are combined with AND. For OR logic you either add COUNTIFs together or use SUMPRODUCT.\n\n**A useful pattern**\n\nFinding duplicates: `=COUNTIF($A$2:$A$1000, A2) > 1` returns TRUE for any value appearing more than once, which is how you flag duplicates without deleting anything.",
    code: [
      { lang: "Excel", label: "Two conditions, AND", code: "=COUNTIFS(Region,\"East\", Amount,\">1000\")" },
      { lang: "Excel", label: "OR logic — add them", code: "=COUNTIF(Region,\"East\") + COUNTIF(Region,\"West\")" },
      { lang: "Excel", label: "Flag duplicates", code: "=COUNTIF($A$2:$A$1000, A2) > 1" },
    ],
    mistakes: [
      "Writing `>F1` instead of `\">\"&F1`.",
      "Expecting COUNTIFS to give OR behaviour — it is AND.",
    ],
    followUps: ["How would you count rows matching either of two regions?"],
    tags: ["COUNT", "COUNTA", "COUNTBLANK", "COUNTIF", "COUNTIFS"],
    related: ["xl-c-counts", "xl-q-count-counta", "xl-q-identify-duplicates"],
    sources: [GFG_EXCEL_DA],
  }),
  q({
    id: "xl-q-sum-by-condition",
    category: "Formula",
    title: "How do you sum values based on a condition?",
    difficulty: "Easy",
    q: "How do you calculate the sum of values based on a certain condition?",
    hint: "There are two functions, and their argument orders are reversed relative to each other.",
    answer:
      "SUMIF for one condition, SUMIFS for several. The trap is the argument order: SUMIF takes the criteria range first — SUMIF(criteria_range, criteria, sum_range) — while SUMIFS takes the sum range first — SUMIFS(sum_range, criteria_range1, criteria1, ...). They are backwards relative to each other, which is the single most common Excel formula error.",
    detail:
      "**The two signatures side by side**\n\n```\nSUMIF ( where_to_look , what_to_look_for , what_to_add )\nSUMIFS( what_to_add   , where_to_look    , what_to_look_for , ... )\n```\n\nA habit that avoids the problem entirely: always use SUMIFS, even for a single condition. It costs nothing, the argument order stays consistent, and adding a second condition later is a small edit rather than a rewrite.\n\n**Criteria forms**\n\n- Literal: `\"East\"`, `\">1000\"`, `\"<>\"&\"\"` for non-blank\n- From a cell: `\">\"&F1`\n- Dates: `\">=\"&DATE(2024,1,1)`\n- Wildcards on text: `\"Prod*\"`\n\n**Alternatives worth knowing**\n\nSUMPRODUCT handles conditions that SUMIFS cannot express, such as OR across values or a condition computed from two columns: `=SUMPRODUCT((Region=\"East\")*(Margin/Revenue>0.2), Revenue)`. On Microsoft 365, `=SUM(FILTER(...))` is more readable than either.",
    code: [
      { lang: "Excel", label: "Preferred — SUMIFS even for one condition", code: "=SUMIFS(Amount, Region, \"East\")" },
      { lang: "Excel", label: "Two conditions", code: "=SUMIFS(Amount, Region, \"East\", Date, \">=\"&DATE(2024,1,1))" },
      { lang: "Excel", label: "Computed condition — needs SUMPRODUCT", code: "=SUMPRODUCT((Margin/Revenue > 0.2) * Revenue)" },
    ],
    mistakes: [
      "Swapping the argument order between SUMIF and SUMIFS.",
      "Ranges of different heights inside one SUMIFS, which errors.",
    ],
    followUps: [
      "How would you sum where the condition depends on two columns divided by each other?",
      "How would you write this on Microsoft 365?",
    ],
    tags: ["SUMIF", "SUMIFS", "SUMPRODUCT", "conditional"],
    related: ["xl-c-conditional-aggregation", "xl-q-count-family"],
    sources: [GFG_EXCEL_DA],
  }),
  q({
    id: "xl-q-if-function",
    category: "Formula",
    title: "What is the IF function?",
    difficulty: "Easy",
    q: "What is the IF function in Excel?",
    hint: "Three arguments. Then talk about what to do when you need more than two outcomes.",
    answer:
      "IF(logical_test, value_if_true, value_if_false) evaluates a condition and returns one of two results. =IF(B2>=50,\"Pass\",\"Fail\") is the canonical example. For more than two outcomes you can nest IFs, but past two or three levels it becomes unreadable — IFS, or a lookup table, is the better answer.",
    detail:
      "**Nesting vs IFS**\n\nA nested IF for grading is legal but hard to review:\n\n`=IF(B2>=90,\"A\",IF(B2>=80,\"B\",IF(B2>=70,\"C\",\"F\")))`\n\nThe same thing in IFS reads top to bottom:\n\n`=IFS(B2>=90,\"A\", B2>=80,\"B\", B2>=70,\"C\", TRUE,\"F\")`\n\n**Order matters in both**\n\nConditions are evaluated in sequence and the first match wins. Put the narrowest first. Writing `B2>=70` before `B2>=90` makes every high score a C.\n\n**The third option**\n\nFor many bands, a lookup table plus an approximate-match VLOOKUP or XLOOKUP beats both: the bands become data you can edit rather than logic you have to rewrite. Mentioning this is what turns a beginner answer into a design answer.",
    code: [
      { lang: "Excel", label: "IFS — readable", code: "=IFS(B2>=90,\"A\", B2>=80,\"B\", B2>=70,\"C\", TRUE,\"F\")" },
      { lang: "Excel", label: "Lookup table — maintainable", code: "=XLOOKUP(B2, BandFloor, BandGrade, \"F\", -1)" },
    ],
    mistakes: [
      "Ordering conditions from widest to narrowest, so only the first branch ever fires.",
      "Omitting the final TRUE catch-all in IFS.",
    ],
    followUps: ["When would you replace nested IFs with a lookup table?"],
    tags: ["IF", "IFS", "logical", "nested"],
    related: ["xl-c-if-logic", "xl-q-and-function", "xl-q-iferror"],
    sources: [GFG_EXCEL],
  }),
  q({
    id: "xl-q-and-function",
    category: "Formula",
    title: "How does the AND function work?",
    difficulty: "Easy",
    q: "How does the AND() function work in Excel?",
    hint: "It returns a logical, and it is almost always used inside something else.",
    answer:
      "AND(condition1, condition2, ...) returns TRUE only when every condition is TRUE, and FALSE otherwise. On its own it is rarely useful — it is normally nested inside IF, as =IF(AND(B2>1000, C2=\"East\"), \"Priority\", \"Standard\"). OR is its counterpart, returning TRUE when at least one condition holds, and NOT inverts a logical.",
    detail:
      "**Where candidates get caught**\n\nAND does not work element-wise across ranges the way people expect. `=AND(A2:A10>5)` does not return one TRUE per row — it collapses to a single value. For row-by-row logic you multiply the conditions instead, because TRUE behaves as 1 and FALSE as 0:\n\n`(Region=\"East\") * (Amount>1000)`\n\nThat multiplication trick is AND; addition is OR. It is what makes SUMPRODUCT and array-style INDEX/MATCH work, so it is worth being able to explain.\n\n**In conditional formatting**\n\nAND is the natural way to write a multi-condition formatting rule: `=AND($C2=\"East\", $D2>1000)` highlights the whole row when both hold, provided the column references are locked with `$`.",
    code: [
      { lang: "Excel", label: "AND inside IF", code: "=IF(AND(B2>1000, C2=\"East\"), \"Priority\", \"Standard\")" },
      { lang: "Excel", label: "Row-wise AND via multiplication", code: "=SUMPRODUCT((Region=\"East\") * (Amount>1000))" },
    ],
    mistakes: [
      "Expecting AND to evaluate row by row across a range.",
      "Forgetting to lock the column with `$` in a conditional formatting rule.",
    ],
    followUps: ["How do you express AND and OR inside SUMPRODUCT?"],
    tags: ["AND", "OR", "NOT", "logical"],
    related: ["xl-c-if-logic", "xl-q-if-function", "xl-q-conditional-formatting"],
    sources: [GFG_EXCEL_DA],
  }),
  q({
    id: "xl-q-iferror",
    category: "Formula",
    title: "What does IFERROR do, and when should you not use it?",
    difficulty: "Easy",
    q: "What is IFERROR and when would you avoid it?",
    hint: "The second half of the question is the interesting one.",
    answer:
      "IFERROR(expression, value_if_error) returns the expression's result unless it errors, in which case it returns your fallback. It is how you keep #N/A out of a report. You should avoid it when you have not yet established why the error happens — a blanket IFERROR turns a visible data problem into an invisible one, and a lookup silently returning \"Not found\" for 30% of rows looks exactly like a lookup working fine.",
    detail:
      "**The judgement the question is testing**\n\nInterviewers ask this to see whether you distinguish presentation from correctness. The right sequence is: diagnose the error, fix the cause if it is fixable, and only then suppress the residual expected case.\n\n**A more precise alternative**\n\nIFNA catches only #N/A and lets #REF!, #VALUE! and #DIV/0! through. That is usually what you actually want around a lookup — you expect some keys to be missing, you do not expect a broken reference:\n\n`=IFNA(VLOOKUP(A2, Table, 3, FALSE), \"Unmatched\")`\n\n**Auditing what you suppressed**\n\nBefore wrapping anything, count the failures: `=COUNTIF(range,\"Not found\")` or `=SUMPRODUCT(--ISNA(range))`. If the count is material, the answer is not IFERROR — it is a data fix.",
    code: [
      { lang: "Excel", label: "Too broad", code: "=IFERROR(VLOOKUP(A2,Table,3,FALSE), \"\")" },
      { lang: "Excel", label: "Precise — only unmatched keys", code: "=IFNA(VLOOKUP(A2,Table,3,FALSE), \"Unmatched\")" },
      { lang: "Excel", label: "Count what you are hiding", code: "=SUMPRODUCT(--ISNA(D2:D1000))" },
    ],
    mistakes: [
      "Wrapping a whole model in IFERROR and losing sight of genuine breakage.",
      "Returning `\"\"` for errors, which then confuses COUNT and COUNTA downstream.",
    ],
    followUps: ["What is the difference between IFERROR and IFNA?"],
    tags: ["IFERROR", "IFNA", "errors", "data quality"],
    related: ["xl-c-if-logic", "xl-c-errors", "xl-q-common-error"],
    sources: [common("Appears consistently across Excel interview preparation resources as a follow-up to the IF and lookup questions.")],
  }),
  q({
    id: "xl-q-common-error",
    category: "Data Cleaning",
    title: "What is the most common error message in Excel?",
    difficulty: "Easy",
    q: "What is the most common error message in Excel, and what do the main errors mean?",
    hint: "Name the most frequent one, then treat the rest as a diagnostic table.",
    answer:
      "#N/A is the one you see most in analytical work — it means a lookup found no match. The others each name a specific cause: #REF! is a reference to a deleted cell, #VALUE! is a data-type mismatch, #DIV/0! is division by zero or a blank, #NAME? is an unrecognised identifier or an unquoted string, #NUM! is an invalid number for the operation, and #SPILL! means a dynamic array cannot expand.",
    detail:
      "**Reading errors as diagnoses**\n\n| Error | Cause | First thing to check |\n|---|---|---|\n| #N/A | lookup found nothing | trailing spaces, text vs number key |\n| #REF! | referenced cell deleted | recent row/column deletions |\n| #VALUE! | wrong data type | arithmetic on text |\n| #DIV/0! | divide by zero or blank | the denominator |\n| #NAME? | unknown identifier | function spelling, missing quotes |\n| #NUM! | invalid number | SQRT of a negative, huge exponents |\n| #SPILL! | blocked spill range | cells below or right of the formula |\n\n**Why #N/A dominates**\n\nAlmost all of it is key mismatch, and almost all key mismatch is one of three things: trailing whitespace, a number stored as text on one side, or inconsistent case combined with a case-sensitive method. `=TRIM(A2)=A2` and `=ISNUMBER(A2)` are the two checks that resolve most of them in seconds.\n\n**Tracing errors**\n\nFormulas → Error Checking → Trace Error draws arrows to the precedent cells, which finds the origin of an error that has propagated through several layers.",
    code: [
      { lang: "Excel", label: "Is the key really clean?", code: "=AND(TRIM(A2)=A2, ISNUMBER(A2))" },
    ],
    mistakes: [
      "Suppressing #N/A without checking whether the key is dirty.",
      "Confusing #REF! with #NAME?.",
    ],
    followUps: ["A VLOOKUP returns #N/A for a value you can see in the table. What do you check?"],
    tags: ["errors", "#N/A", "#REF", "debugging"],
    related: ["xl-c-errors", "xl-q-iferror", "xl-q-vlookup"],
    sources: [GFG_EXCEL_DA],
  }),
  q({
    id: "xl-q-round",
    category: "Formula",
    title: "What does ROUND do, and how does it differ from formatting?",
    difficulty: "Easy",
    q: "What is the ROUND function in Excel?",
    hint: "The contrast with number formatting is the real content of this answer.",
    answer:
      "ROUND(number, digits) rounds a value to a given number of decimal places — ROUND(3.14159, 2) is 3.14. A negative digit count rounds to the left of the decimal point, so ROUND(1234, -2) is 1200. Crucially, ROUND changes the stored value, whereas number formatting only changes the display; that difference is why a column of displayed values sometimes fails to add up to the displayed total.",
    detail:
      "**The family**\n\n- **ROUND** — normal half-up rounding.\n- **ROUNDUP / ROUNDDOWN** — always away from or toward zero, regardless of the digit.\n- **MROUND** — to the nearest multiple, e.g. `MROUND(A2, 50)` for the nearest 50.\n- **CEILING / FLOOR** — to a multiple, up or down. Useful for pricing tiers and packaging quantities.\n- **TRUNC / INT** — chop the decimal. They differ on negatives: `INT(-2.5)` is -3, `TRUNC(-2.5)` is -2.\n\n**The display trap**\n\nFormat three cells holding 0.4 to zero decimals and they display as 0, 0, 0 while the total displays as 1. Nothing is broken — the format is lying about the values. Either round the values with ROUND, or accept the difference and explain it. Excel's 'Set precision as displayed' option does the rounding globally, but it is destructive and rarely the right call.\n\n**Financial note**\n\nExcel's ROUND is half-away-from-zero, which is not banker's rounding. Where a specification requires round-half-to-even, you have to implement it, and saying so signals care.",
    code: [
      { lang: "Excel", label: "Round to hundreds", code: "=ROUND(1234, -2)" },
      { lang: "Excel", label: "Nearest 50", code: "=MROUND(A2, 50)" },
    ],
    mistakes: [
      "Assuming a two-decimal display means a two-decimal value.",
      "Using INT on negatives when TRUNC was intended.",
    ],
    followUps: ["Why might a column of displayed values not sum to the displayed total?"],
    tags: ["ROUND", "MROUND", "CEILING", "TRUNC", "formatting"],
    related: ["xl-q-cell-formats", "xl-c-business-metrics"],
    sources: [GFG_EXCEL],
  }),
  q({
    id: "xl-q-trim",
    category: "Data Cleaning",
    title: "What does TRIM do, and why does it sometimes not work?",
    difficulty: "Easy",
    q: "What is the TRIM function, and why might it fail to fix a lookup?",
    hint: "There is a kind of space TRIM does not touch.",
    answer:
      "TRIM removes leading and trailing spaces and collapses repeated internal spaces to one. It fails on non-breaking spaces — character 160 — which is exactly what you get when pasting from a web page or an HTML export. The fix is to substitute them first: =TRIM(SUBSTITUTE(A2, CHAR(160), \" \")), usually wrapped in CLEAN to strip non-printable control characters too.",
    detail:
      "**Why this question is a good signal**\n\nEveryone can name TRIM. Knowing that it does not handle CHAR(160) is something you only learn by having a VLOOKUP fail on values that look identical, which is why interviewers like it.\n\n**Diagnosing invisible characters**\n\n`=LEN(A2)` versus the visible character count tells you something extra is there. `=CODE(RIGHT(A2,1))` names the offending character — 32 is a normal space, 160 is non-breaking, 10 and 13 are line breaks.\n\n**The full clean**\n\n`=TRIM(CLEAN(SUBSTITUTE(A2, CHAR(160), \" \")))`\n\nCLEAN removes characters 0–31. It does not remove 160, which is why the SUBSTITUTE has to be there as well.\n\n**Doing it at scale**\n\nPower Query's Text.Trim plus a replace step does the same thing as a recorded, repeatable transformation, which is the better answer for anything that arrives monthly.",
    code: [
      { lang: "Excel", label: "The full clean", code: "=TRIM(CLEAN(SUBSTITUTE(A2, CHAR(160), \" \")))" },
      { lang: "Excel", label: "Identify the invisible character", code: "=CODE(RIGHT(A2,1))" },
    ],
    mistakes: [
      "Assuming TRIM handles every whitespace variant.",
      "Cleaning by hand data that arrives on a schedule.",
    ],
    followUps: [
      "Two cells look identical but a lookup fails. How do you find out why?",
      "How would you do this in Power Query instead?",
    ],
    tags: ["TRIM", "CLEAN", "SUBSTITUTE", "CHAR", "whitespace"],
    related: ["xl-c-text-clean", "xl-q-common-error", "xl-q-clean-data"],
    sources: [GFG_EXCEL],
  }),
  q({
    id: "xl-q-text-function",
    category: "Text",
    title: "What is the TEXT function?",
    difficulty: "Easy",
    q: "What is the TEXT function in Excel?",
    hint: "It converts a number to text using a format code — which is both its use and its danger.",
    answer:
      "TEXT(value, format_code) converts a number or date into text formatted the way you specify — TEXT(TODAY(),\"dd-mmm-yyyy\") gives \"29-Aug-2026\". It is mainly used to build readable labels by concatenating numbers into sentences. The caution is that the result is text, so it can no longer be used in arithmetic or matched against a real number.",
    detail:
      "**The main use: dynamic labels**\n\n`=\"Revenue grew \" & TEXT(growth, \"0.0%\") & \" versus last year\"`\n\nWithout TEXT, a growth value of 0.157 concatenates as \"0.157\" rather than \"15.7%\". Dashboard titles that state the current filter are built exactly this way.\n\n**Common format codes**\n\n| Code | Result |\n|---|---|\n| `0.0%` | 15.7% |\n| `#,##0` | 1,234 |\n| `#,##0,,\"M\"` | 1M |\n| `dd-mmm-yyyy` | 29-Aug-2026 |\n| `mmmm` | August |\n| `[h]:mm` | hours past 24 |\n\n**The trap**\n\nA column produced by TEXT will not sum, will not sort numerically, and will not match a numeric lookup key. Keep the numeric value in one column and the formatted label in another rather than replacing one with the other.\n\n**Related**\n\nVALUE does the reverse. DATEVALUE and TIMEVALUE handle text that should have been a date or time.",
    code: [
      { lang: "Excel", label: "Dynamic title", code: "=\"Sales for \" & TEXT(A1, \"mmmm yyyy\") & \": \" & TEXT(B1, \"#,##0\")" },
    ],
    mistakes: [
      "Converting a numeric column with TEXT and then wondering why it will not sum.",
      "Using TEXT when a number format would do — formatting keeps the value usable.",
    ],
    followUps: ["When would you use a number format instead of TEXT?"],
    tags: ["TEXT", "format codes", "concatenation"],
    related: ["xl-c-text-clean", "xl-q-cell-formats"],
    sources: [GFG_EXCEL],
  }),
  q({
    id: "xl-q-first-name",
    category: "Text",
    title: "How do you extract a first name from a full name?",
    difficulty: "Easy",
    q: "How do you get a first name from a whole name in Excel?",
    hint: "Find the delimiter's position, then cut relative to it.",
    answer:
      "Find the position of the first space and take everything before it: =LEFT(A2, FIND(\" \", A2) - 1). The -1 excludes the space itself. On Microsoft 365 the cleaner version is =TEXTBEFORE(A2, \" \"). For a one-off split of a whole column, Data → Text to Columns with space as the delimiter is faster than any formula.",
    detail:
      "**Three routes, and when each is right**\n\n1. **Formula** — when the result must stay live as the source changes.\n2. **Text to Columns** — a one-off bulk split. Destructive: it overwrites adjacent columns, so insert blanks to the right first.\n3. **Power Query** — when the file arrives repeatedly and the split should be part of a recorded pipeline.\n\n**Handling the edge cases**\n\nA name with no space breaks FIND with `#VALUE!`. Guard it:\n\n`=IFERROR(LEFT(A2, FIND(\" \", A2) - 1), A2)`\n\nFor the **last** name, a middle name breaks the naive `RIGHT` formula. The robust trick replaces the final space with a marker character and splits on that:\n\n`=TRIM(RIGHT(SUBSTITUTE(A2, \" \", REPT(\" \", 100)), 100))`\n\nThat pads every space to 100 characters so the last field always lands in the final 100, then trims. It looks odd but it is the standard pre-365 idiom, and being able to explain why it works is a genuinely strong answer.\n\n**Worth saying out loud**\n\nNames are not reliably splittable. Compound surnames, single-name individuals and different cultural orderings all break the assumption. If the split feeds anything that matters, flag it rather than presenting it as clean.",
    code: [
      { lang: "Excel", label: "First name, guarded", code: "=IFERROR(LEFT(A2, FIND(\" \",A2)-1), A2)" },
      { lang: "Excel", label: "Last name, handles middle names", code: "=TRIM(RIGHT(SUBSTITUTE(A2,\" \",REPT(\" \",100)), 100))" },
      { lang: "Excel", label: "Microsoft 365", code: "=TEXTBEFORE(A2, \" \")\n=TEXTAFTER(A2, \" \", -1)" },
    ],
    mistakes: [
      "Forgetting the -1, so the space is included.",
      "Running Text to Columns without inserting empty columns first, overwriting data.",
      "Assuming every name splits into exactly two parts.",
    ],
    followUps: ["How would you get the LAST name when middle names are present?"],
    tags: ["LEFT", "FIND", "TEXTBEFORE", "text to columns", "names"],
    related: ["xl-c-text-extract", "xl-q-split-columns"],
    sources: [GFG_EXCEL_DA],
  }),
  q({
    id: "xl-q-split-columns",
    category: "Data Cleaning",
    title: "How do you split one column into several?",
    difficulty: "Easy",
    q: "How do you split information in a column into two or more columns?",
    hint: "Name the three tools and say which one you would pick for data that arrives monthly.",
    answer:
      "Data → Text to Columns, choosing delimited (comma, space, custom) or fixed width. Formulas using LEFT/MID/RIGHT with FIND, or TEXTSPLIT on Microsoft 365, keep the result live. Flash Fill (Ctrl+E) infers the pattern from one or two typed examples. For a file that arrives on a schedule, Power Query's Split Column is the right answer, because the step is recorded and re-runs on refresh.",
    detail:
      "**Choosing between them**\n\n| Tool | Live? | Repeatable? | Best for |\n|---|---|---|---|\n| Text to Columns | no | no | one-off bulk split |\n| Formulas | yes | manual | results that must update |\n| Flash Fill | no | no | irregular patterns you can demonstrate |\n| Power Query | on refresh | yes | recurring files |\n\n**The Text to Columns warning**\n\nIt overwrites the columns to the right without asking. Insert empty columns first. It also applies a data type per column in step 3 — set an ID column to Text there, or leading zeros are stripped permanently.\n\n**Flash Fill is underrated**\n\nType the desired output for the first row, start typing the second, and Ctrl+E fills the rest by inferring the pattern. It handles messy cases formulas struggle with. It is static, though, so it does not update when the source changes.\n\n**TEXTSPLIT**\n\nOn 365: `=TEXTSPLIT(A2, \" \")` spills across columns; it takes both column and row delimiters, so it can parse a small block in one formula.",
    code: [
      { lang: "Excel", label: "Microsoft 365 — spills across columns", code: "=TEXTSPLIT(A2, \",\")" },
      { lang: "M", label: "Power Query — recorded and repeatable", code: "= Table.SplitColumn(Source, \"Name\", Splitter.SplitTextByDelimiter(\" \"))" },
    ],
    mistakes: [
      "Overwriting adjacent columns with Text to Columns.",
      "Letting Text to Columns type an ID column as General and losing leading zeros.",
    ],
    followUps: ["Which of these would you choose for a file that arrives every month, and why?"],
    tags: ["text to columns", "TEXTSPLIT", "Flash Fill", "Power Query", "split"],
    related: ["xl-c-text-extract", "xl-q-first-name", "xl-q-power-query"],
    sources: [GFG_EXCEL_DA, GFG_EXCEL],
  }),

  // =========================================================== LOOKUP
  q({
    id: "xl-q-vlookup",
    category: "Lookup",
    title: "Explain the VLOOKUP formula",
    difficulty: "Easy",
    q: "Explain the VLOOKUP formula in Excel.",
    hint: "Four arguments. The fourth is the one that causes wrong answers.",
    answer:
      "VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup]) searches for a value in the FIRST column of a range and returns a value from a column to its right, identified by position. The fourth argument controls match type and defaults to TRUE, meaning approximate — which silently returns wrong answers on unsorted data. Always pass FALSE explicitly for an exact match.",
    detail:
      "**Walking through it**\n\n`=VLOOKUP(A2, Products!$A$2:$D$500, 3, FALSE)`\n\n- `A2` — the key you are looking up\n- `Products!$A$2:$D$500` — the table. Absolute, so filling down does not shift it. The key MUST be in column A of this range.\n- `3` — return the third column of the range, counting from its own first column\n- `FALSE` — exact match only\n\n**Its three real limitations**\n\n1. **Left-only.** The key must be the leftmost column. You cannot return something to the left of the key.\n2. **Positional column index.** Insert a column inside the table and every VLOOKUP returns the wrong field, with no error to warn you.\n3. **Dangerous default.** Omit the fourth argument and you get approximate matching, which on unsorted data returns essentially arbitrary results.\n\n**Making it robust**\n\nReplace the hardcoded index with a MATCH on the header, so the formula follows the column by name:\n\n`=VLOOKUP(A2, Products!$A$2:$D$500, MATCH(\"Price\", Products!$A$1:$D$1, 0), FALSE)`\n\nAt which point INDEX/MATCH or XLOOKUP is simpler anyway.\n\n**When #N/A appears**\n\nCheck three things in order: trailing spaces on either key, one side stored as text and the other as a number, and whether the key really is in the first column of the range.",
    code: [
      { lang: "Excel", label: "Correct usage", code: "=VLOOKUP(A2, Products!$A$2:$D$500, 3, FALSE)" },
      { lang: "Excel", label: "Robust against column insertion", code: "=VLOOKUP(A2, Products!$A$2:$D$500, MATCH(\"Price\", Products!$A$1:$D$1, 0), FALSE)" },
    ],
    mistakes: [
      "Omitting FALSE and getting approximate matches.",
      "Forgetting to make table_array absolute, so it drifts when filled down.",
      "Counting col_index_num from column A of the sheet rather than of the range.",
    ],
    followUps: [
      "What is the default of the fourth argument, and why does it matter?",
      "How would you look up a value to the LEFT of the key?",
    ],
    tags: ["VLOOKUP", "lookup", "exact match"],
    related: ["xl-c-vlookup", "xl-q-vlookup-default", "xl-q-vlookup-vs-indexmatch", "xl-q-xlookup"],
    sources: [GFG_EXCEL, GH_DA],
  }),
  q({
    id: "xl-q-vlookup-default",
    category: "Lookup",
    title: "What is the default value of VLOOKUP's last parameter?",
    difficulty: "Medium",
    q: "What is the default value of the last parameter of VLOOKUP?",
    hint: "It is the opposite of what almost everyone wants.",
    answer:
      "TRUE — approximate match. If you omit range_lookup, VLOOKUP assumes the first column is sorted ascending and returns the largest value less than or equal to your key. On unsorted data that produces confidently wrong answers with no error at all, which is why you should always write FALSE explicitly for an exact match.",
    detail:
      "**Why approximate mode is dangerous**\n\nIt does a binary search assuming sorted data. On unsorted data the search lands somewhere arbitrary and returns whatever is there. There is no error, no warning — just a plausible-looking wrong number. This is the classic source of a spreadsheet that is subtly wrong for months.\n\n**Worked example**\n\nA product table sorted by name, looking up ID `1005` with approximate match. Excel binary-searches a column that is not sorted by ID and returns the row it happens to land on. The value looks fine. It belongs to a different product.\n\n**When approximate match is genuinely correct**\n\nBand lookups. Tax brackets, grade boundaries, shipping tiers — where you want \"the band this value falls into\" rather than an exact key. The table must be sorted ascending by the band's lower bound:\n\n```\n0    → 0%\n250000 → 5%\n500000 → 20%\n```\n\n`=VLOOKUP(income, BandTable, 2, TRUE)` then returns the correct rate. This is the one place TRUE is the right answer, and knowing it turns the question from a gotcha into a real answer.\n\n**In XLOOKUP**\n\nThe default is reversed — exact match. Approximate becomes an explicit `match_mode` of `-1` or `1`. That reversal is one of the strongest arguments for XLOOKUP.",
    code: [
      { lang: "Excel", label: "Always be explicit", code: "=VLOOKUP(A2, Table, 3, FALSE)" },
      { lang: "Excel", label: "The legitimate use of TRUE — sorted band table", code: "=VLOOKUP(Income, TaxBands, 2, TRUE)" },
    ],
    mistakes: [
      "Believing the default is exact match.",
      "Using approximate match on a table that is not sorted by the lookup column.",
    ],
    followUps: [
      "When IS approximate match the right choice?",
      "What is the default in XLOOKUP?",
    ],
    tags: ["VLOOKUP", "approximate match", "range_lookup", "band lookup"],
    related: ["xl-c-vlookup", "xl-q-vlookup", "xl-q-xlookup"],
    sources: [GFG_EXCEL_DA],
  }),
  q({
    id: "xl-q-index-match",
    category: "Lookup",
    title: "How do INDEX and MATCH work together?",
    difficulty: "Medium",
    q: "How do the INDEX and MATCH functions work together?",
    hint: "One finds a position. The other retrieves by position. Compose them.",
    answer:
      "MATCH(value, lookup_range, 0) returns the position of a value within a range. INDEX(return_range, position) returns the item at that position. Composed, MATCH supplies the row number INDEX needs: =INDEX(Price, MATCH(A2, ProductID, 0)). Because the lookup range and the return range are given independently, the lookup can go in any direction and is unaffected by inserted columns.",
    detail:
      "**Reading it in the right order**\n\nEvaluate the inner MATCH first. If `A2` is the 47th entry of `ProductID`, MATCH returns 47, and INDEX returns the 47th entry of `Price`. Explaining it inside-out like this is much clearer than reciting the syntax.\n\n**The two-dimensional form**\n\nMATCH twice — once down for the row, once across for the column:\n\n`=INDEX($B$2:$M$50, MATCH($A2, $A$2:$A$50, 0), MATCH(B$1, $B$1:$M$1, 0))`\n\nNote the mixed references: `$A2` and `B$1` so one formula fills the whole grid.\n\n**Multi-condition lookup without a helper column**\n\nMultiply the conditions — TRUE is 1, FALSE is 0, so the product is 1 only where every condition holds:\n\n`=INDEX(Price, MATCH(1, (Region=\"East\")*(Product=A2), 0))`\n\nIn older Excel this needs Ctrl+Shift+Enter; in 365 it just works.\n\n**Why it beats VLOOKUP**\n\nNot speed — the structural point. The return column is referenced as a range, not a position, so inserting a column into the source leaves the formula correct. That is what makes INDEX/MATCH the maintainable choice in a model other people will edit.",
    code: [
      { lang: "Excel", label: "Basic", code: "=INDEX(Price, MATCH(A2, ProductID, 0))" },
      { lang: "Excel", label: "Two-way", code: "=INDEX($B$2:$M$50, MATCH($A2,$A$2:$A$50,0), MATCH(B$1,$B$1:$M$1,0))" },
      { lang: "Excel", label: "Two conditions", code: "=INDEX(Price, MATCH(1, (Region=\"East\")*(Product=A2), 0))" },
    ],
    mistakes: [
      "Omitting MATCH's third argument `0`, which defaults to approximate.",
      "INDEX and MATCH ranges of different heights, giving silently wrong rows.",
    ],
    followUps: [
      "How would you do a lookup on two conditions with no helper column?",
      "Build a two-way lookup across a grid.",
    ],
    tags: ["INDEX", "MATCH", "lookup", "two-way"],
    related: ["xl-c-index-match", "xl-q-vlookup-vs-indexmatch", "xl-q-vlookup"],
    sources: [GFG_EXCEL, GFG_EXCEL_DA],
  }),
  q({
    id: "xl-q-vlookup-vs-indexmatch",
    category: "Lookup",
    title: "VLOOKUP vs INDEX-MATCH",
    difficulty: "Medium",
    q: "Differentiate between VLOOKUP and INDEX-MATCH and explain their main differences.",
    hint: "Lead with the structural difference, not the speed one.",
    answer:
      "VLOOKUP searches the leftmost column of a range and returns a column identified by position. INDEX-MATCH takes the lookup range and the return range as independent arguments. Three consequences: INDEX-MATCH can look in any direction, it survives column insertion because the return column is a reference rather than a number, and its default match is not the dangerous approximate one. VLOOKUP's advantage is that it is shorter and more widely recognised.",
    detail:
      "**Side by side**\n\n| | VLOOKUP | INDEX-MATCH |\n|---|---|---|\n| Direction | right only | any |\n| Return column | position number | range reference |\n| Survives inserted column | no | yes |\n| Default match | approximate (TRUE) | must be stated |\n| Readability | shorter | inside-out, needs practice |\n| Two-way lookup | awkward | natural |\n\n**The argument that actually matters**\n\nA colleague inserts a column into the source table. Every VLOOKUP now returns the wrong field, silently. Every INDEX-MATCH is still correct. In a model that other people maintain, that difference is worth far more than any performance claim.\n\n**On the performance claim**\n\nINDEX-MATCH is sometimes faster because MATCH scans one column while VLOOKUP may load the whole table array. On modern Excel with realistic data sizes the difference is rarely the deciding factor, and leading with it suggests a memorised answer rather than experience.\n\n**The modern resolution**\n\nOn Microsoft 365, XLOOKUP supersedes both: exact match by default, any direction, a built-in not-found argument, and reverse search. The complete answer names all three and says which you would use on which Excel version.",
    code: [
      { lang: "Excel", label: "VLOOKUP", code: "=VLOOKUP(A2, $A$2:$D$500, 3, FALSE)" },
      { lang: "Excel", label: "INDEX-MATCH", code: "=INDEX($C$2:$C$500, MATCH(A2, $A$2:$A$500, 0))" },
      { lang: "Excel", label: "XLOOKUP", code: "=XLOOKUP(A2, $A$2:$A$500, $C$2:$C$500, \"Not found\")" },
    ],
    mistakes: [
      "Leading with speed rather than maintainability.",
      "Not mentioning XLOOKUP, which suggests dated knowledge.",
    ],
    followUps: ["Where does XLOOKUP fit, and when can you not use it?"],
    tags: ["VLOOKUP", "INDEX", "MATCH", "comparison"],
    related: ["xl-c-vlookup", "xl-c-index-match", "xl-q-index-match", "xl-q-vlookup-vs-xlookup"],
    sources: [GFG_EXCEL_DA],
  }),
  q({
    id: "xl-q-xlookup",
    category: "Lookup",
    title: "What is XLOOKUP?",
    difficulty: "Medium",
    q: "What is the XLOOKUP function in Excel?",
    hint: "Six arguments, but only three are usually needed. Mention the version constraint.",
    answer:
      "XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode]) is the modern replacement for VLOOKUP and INDEX-MATCH. It defaults to exact match, takes the lookup and return arrays separately so direction does not matter, handles the not-found case as a built-in argument rather than an IFERROR wrapper, and can search from the bottom up. It requires Microsoft 365 or Excel 2021.",
    detail:
      "**What each optional argument buys you**\n\n- `if_not_found` — replaces `IFERROR(...)` wrapping, and unlike IFERROR it only catches the not-found case, leaving real errors visible.\n- `match_mode` — `0` exact (default), `-1` exact or next smaller, `1` exact or next larger, `2` wildcard.\n- `search_mode` — `1` first to last (default), `-1` last to first, `2`/`-2` binary search on sorted data.\n\n**The one that wins interviews**\n\n`search_mode = -1` searches bottom-up, which returns the LAST match. In a transaction log sorted by date, that is the current price or the latest status — a genuinely awkward problem with VLOOKUP:\n\n`=XLOOKUP(A2, ProductID, Price, \"None\", 0, -1)`\n\n**Returning a whole range**\n\nBecause `return_array` can be multiple columns, XLOOKUP can return an entire record at once, spilling across columns. Nesting two XLOOKUPs gives a clean two-way lookup:\n\n`=XLOOKUP(A2, ProductID, XLOOKUP(B1, Headers, DataRange))`\n\n**The constraint to volunteer**\n\nIt does not exist before Excel 2021. If the workbook will be opened on an older version the formula resolves to `#NAME?`. Saying this unprompted signals you have shipped workbooks to other people.",
    code: [
      { lang: "Excel", label: "Basic, with fallback", code: "=XLOOKUP(A2, ProductID, Price, \"Not found\")" },
      { lang: "Excel", label: "Last matching record", code: "=XLOOKUP(A2, ProductID, Price, \"None\", 0, -1)" },
      { lang: "Excel", label: "Return the whole row", code: "=XLOOKUP(A2, ProductID, B2:F500)" },
    ],
    mistakes: [
      "Shipping XLOOKUP to users on Excel 2019 and getting #NAME?.",
      "Wrapping XLOOKUP in IFERROR when the fourth argument does it better.",
    ],
    followUps: ["How would you find the most recent price for a product?"],
    tags: ["XLOOKUP", "lookup", "search mode", "365"],
    related: ["xl-c-xlookup", "xl-q-vlookup-vs-xlookup", "xl-q-vlookup-default"],
    sources: [GFG_EXCEL],
  }),
  q({
    id: "xl-q-vlookup-vs-xlookup",
    category: "Lookup",
    title: "Difference between VLOOKUP and XLOOKUP",
    difficulty: "Medium",
    q: "What is the difference between VLOOKUP and XLOOKUP?",
    hint: "Go through VLOOKUP's three weaknesses and show how XLOOKUP addresses each.",
    answer:
      "XLOOKUP fixes VLOOKUP's three structural problems. Direction: VLOOKUP can only return columns to the right of the key, XLOOKUP takes lookup and return arrays independently. Fragility: VLOOKUP identifies the return column by position and breaks silently when a column is inserted, XLOOKUP references a range. Defaults: VLOOKUP defaults to approximate match, XLOOKUP defaults to exact. XLOOKUP also has built-in not-found handling and reverse search. The trade-off is that it needs Microsoft 365 or Excel 2021.",
    detail:
      "**Point by point**\n\n| | VLOOKUP | XLOOKUP |\n|---|---|---|\n| Direction | rightwards only | any |\n| Return identified by | column number | range |\n| Default match | approximate | exact |\n| Not found | needs IFERROR | built-in argument |\n| Search from end | no | `search_mode = -1` |\n| Return multiple columns | no | yes, spills |\n| Availability | every version | 365 / 2021+ |\n\n**Rewriting one as the other**\n\n`=VLOOKUP(A2, $A$2:$D$500, 3, FALSE)`\n\nbecomes\n\n`=XLOOKUP(A2, $A$2:$A$500, $C$2:$C$500)`\n\nShorter, exact by default, and unaffected if someone inserts a column between B and C.\n\n**The honest caveat**\n\nVLOOKUP is not obsolete in practice. Plenty of organisations run older Excel, and a workbook that has to open everywhere still needs VLOOKUP or INDEX-MATCH. The best answer states the preference and then the constraint that would override it.",
    code: [
      { lang: "Excel", label: "Before", code: "=IFERROR(VLOOKUP(A2, $A$2:$D$500, 3, FALSE), \"Not found\")" },
      { lang: "Excel", label: "After", code: "=XLOOKUP(A2, $A$2:$A$500, $C$2:$C$500, \"Not found\")" },
    ],
    mistakes: [
      "Claiming XLOOKUP is strictly better without noting the version requirement.",
      "Missing that the match-type default is reversed between the two.",
    ],
    followUps: ["Your workbook must open on Excel 2016. What do you use?"],
    tags: ["VLOOKUP", "XLOOKUP", "comparison", "lookup"],
    related: ["xl-c-xlookup", "xl-c-vlookup", "xl-q-xlookup"],
    sources: [common("Published in multiple Excel interview question collections as the standard modern-lookup comparison.")],
  }),
  q({
    id: "xl-q-lookup-functions",
    category: "Lookup",
    title: "What are lookup functions in Excel?",
    difficulty: "Easy",
    q: "What are lookup functions in Excel?",
    hint: "Name the family, then say which you would actually reach for.",
    answer:
      "Lookup functions retrieve a value from one place based on a key found in another — the spreadsheet equivalent of a join. The family is VLOOKUP and HLOOKUP (vertical and horizontal, position-based), INDEX with MATCH (flexible, direction-agnostic), XLOOKUP (the modern replacement for all of them), and LOOKUP (a legacy function best avoided). In practice you use XLOOKUP where it is available and INDEX-MATCH where it is not.",
    detail:
      "**The family**\n\n| Function | Searches | Notes |\n|---|---|---|\n| VLOOKUP | first column of a range | rightwards only, positional return |\n| HLOOKUP | first row of a range | the transposed version; rarely useful |\n| INDEX + MATCH | any range | flexible, survives column changes |\n| XLOOKUP | any range | exact by default, 365/2021 only |\n| LOOKUP | vector or array | legacy, always approximate — avoid |\n\n**Why HLOOKUP is rare**\n\nData is normally stored with records as rows, so vertical lookup is the natural direction. HLOOKUP mostly appears when someone has laid months across columns — which is itself the sign of a table that should be unpivoted.\n\n**The framing that impresses**\n\nA lookup is a join. If you find yourself writing many lookups to stitch several tables together, the real answer is the Data Model or Power Query, where you define a relationship once instead of a formula per column. Saying that moves the conversation from formula trivia to data modelling.",
    mistakes: [
      "Listing LOOKUP as a viable modern choice — it is approximate-only and legacy.",
      "Missing that repeated lookups usually indicate a modelling problem.",
    ],
    followUps: ["At what point would you stop writing lookups and build a data model instead?"],
    tags: ["lookup", "VLOOKUP", "HLOOKUP", "XLOOKUP", "INDEX", "MATCH"],
    related: ["xl-c-vlookup", "xl-c-index-match", "xl-c-xlookup", "xl-c-pivot-advanced"],
    sources: [GFG_EXCEL_DA],
  }),

  // =========================================================== DATES
  q({
    id: "xl-q-current-date",
    category: "Dates",
    title: "How do you get the current date and time?",
    difficulty: "Easy",
    q: "How can you get the current date and time in Excel?",
    hint: "There are volatile functions and static shortcuts, and the difference matters.",
    answer:
      "TODAY() returns the current date and NOW() returns date and time. Both are volatile — they recalculate on every change and update whenever the file is opened, so a stored record using them silently changes over time. For a fixed timestamp use the keyboard shortcuts instead: Ctrl+; enters today's date as a static value, and Ctrl+Shift+; enters the current time.",
    detail:
      "**Volatile vs static, and why it matters**\n\nRecording when an order was entered with `=TODAY()` means every order appears to have been placed today, forever. This is a real data-integrity bug, not a nuance. Use the volatile functions for things that should move — an ageing calculation, a days-remaining countdown — and the shortcuts for anything that records a moment.\n\n| Need | Use |\n|---|---|\n| Days since an event, recalculated | `=TODAY()-A2` |\n| The date this row was created | Ctrl+; |\n| A live clock in a dashboard header | `=NOW()` |\n| An audit timestamp | Ctrl+Shift+; |\n\n**Performance note**\n\nVolatile functions force recalculation of everything that depends on them on every edit. A few are fine; hundreds in a large workbook make it sluggish. TODAY, NOW, RAND, RANDBETWEEN, OFFSET and INDIRECT are all volatile — a useful list to be able to name.\n\n**Extracting parts**\n\n`=TODAY()` combined with YEAR, MONTH, DAY, or with TEXT for a formatted label. `=NOW()-TODAY()` isolates the time portion, since NOW is the date plus a fraction of a day.",
    code: [
      { lang: "Excel", label: "Live — recalculates", code: "=TODAY()" },
      { lang: "Excel", label: "Days since an event", code: "=TODAY() - A2" },
      { lang: "Excel", label: "Just the time part of NOW", code: "=NOW() - TODAY()" },
    ],
    mistakes: [
      "Using TODAY() to record a fixed event date.",
      "Filling a large model with volatile functions and then wondering why it is slow.",
    ],
    followUps: [
      "Which Excel functions are volatile, and why does that matter?",
      "How would you record the date a row was entered so that it never changes?",
    ],
    tags: ["TODAY", "NOW", "volatile", "dates"],
    related: ["xl-c-dates", "xl-q-datedif"],
    sources: [GFG_EXCEL_DA],
  }),
  q({
    id: "xl-q-datedif",
    category: "Dates",
    title: "How do you use the DATEDIF function?",
    difficulty: "Medium",
    q: "How do you use the DATEDIF function in Excel?",
    hint: "Three arguments, and the third is a unit code. Note something unusual about the function itself.",
    answer:
      "DATEDIF(start_date, end_date, unit) returns the difference between two dates in whole units. The unit codes are \"Y\" for complete years, \"M\" for complete months, \"D\" for days, and the compound codes \"YM\", \"YD\" and \"MD\" for remainders. Age in years is =DATEDIF(A2, TODAY(), \"Y\"). The oddity worth mentioning is that DATEDIF is undocumented and does not appear in autocomplete — it is retained for Lotus 1-2-3 compatibility.",
    detail:
      "**The unit codes**\n\n| Code | Returns |\n|---|---|\n| `\"Y\"` | complete years between the dates |\n| `\"M\"` | complete months |\n| `\"D\"` | days |\n| `\"YM\"` | months remaining after whole years |\n| `\"YD\"` | days remaining after whole years |\n| `\"MD\"` | days remaining after whole months |\n\n**A full age string**\n\n`=DATEDIF(A2,TODAY(),\"Y\") & \"y \" & DATEDIF(A2,TODAY(),\"YM\") & \"m\"`\n\n**Why not just subtract?**\n\n`B2-A2` gives days, which is fine for durations. DATEDIF exists for *calendar-aware* differences — 'complete months' is not a fixed number of days, so month and year differences cannot be computed by subtraction and division without being wrong at boundaries.\n\n**Cautions**\n\nIt returns `#NUM!` if the start date is later than the end date, so guard the order. The `\"MD\"` unit is known to be unreliable across month-end boundaries and Microsoft advises against it. And because it does not autocomplete, you have to type the whole name and the quoted unit yourself — candidates sometimes conclude it does not exist.\n\n**Alternative**\n\nYEARFRAC gives a fractional year difference with a choice of day-count basis, which is what you want for financial calculations rather than whole-unit ages.",
    code: [
      { lang: "Excel", label: "Age in whole years", code: "=DATEDIF(A2, TODAY(), \"Y\")" },
      { lang: "Excel", label: "Years and months", code: "=DATEDIF(A2,TODAY(),\"Y\") & \"y \" & DATEDIF(A2,TODAY(),\"YM\") & \"m\"" },
      { lang: "Excel", label: "Fractional years, for finance", code: "=YEARFRAC(A2, B2, 1)" },
    ],
    mistakes: [
      "Passing the dates in the wrong order and getting #NUM!.",
      "Relying on the \"MD\" unit, which Microsoft documents as unreliable.",
    ],
    followUps: ["Why can't you compute complete months by subtracting and dividing by 30?"],
    tags: ["DATEDIF", "dates", "age", "YEARFRAC"],
    related: ["xl-c-dates", "xl-q-current-date"],
    sources: [GFG_EXCEL],
  }),
  q({
    id: "xl-q-networkdays",
    category: "Dates",
    title: "What is the NETWORKDAYS function?",
    difficulty: "Medium",
    q: "What is the NETWORKDAYS function in Excel?",
    hint: "It counts a specific kind of day, and it takes an optional third argument that matters.",
    answer:
      "NETWORKDAYS(start_date, end_date, [holidays]) counts working days between two dates, excluding Saturdays and Sundays, and excluding any dates in the optional holidays range. Both endpoints are inclusive. NETWORKDAYS.INTL adds a weekend parameter so you can define a non-Saturday/Sunday weekend, which matters for regions where the working week differs.",
    detail:
      "**The inclusive-endpoint detail**\n\n`=NETWORKDAYS(\"2026-08-03\", \"2026-08-07\")` returns 5, not 4 — Monday through Friday, both ends counted. Off-by-one errors here are common when computing SLA durations.\n\n**The holidays argument**\n\nMaintain a named range of holiday dates and pass it every time:\n\n`=NETWORKDAYS(A2, B2, Holidays)`\n\nWithout it the count is wrong for every period containing a public holiday. Building that list once and naming it is the practical habit worth describing.\n\n**NETWORKDAYS.INTL**\n\nThe weekend parameter takes a code (`1` = Sat/Sun, `7` = Fri/Sat, and so on) or a seven-character string of ones and zeros starting Monday:\n\n`=NETWORKDAYS.INTL(A2, B2, \"0000011\", Holidays)`\n\n**The counterpart**\n\nWORKDAY goes the other way: given a start date and a number of working days, it returns the resulting date. That is how you compute a delivery or SLA due date:\n\n`=WORKDAY(OrderDate, 5, Holidays)`\n\nWORKDAY.INTL takes the same custom-weekend parameter.",
    code: [
      { lang: "Excel", label: "Working days, inclusive of both ends", code: "=NETWORKDAYS(A2, B2, Holidays)" },
      { lang: "Excel", label: "Friday/Saturday weekend", code: "=NETWORKDAYS.INTL(A2, B2, 7, Holidays)" },
      { lang: "Excel", label: "Due date five working days out", code: "=WORKDAY(OrderDate, 5, Holidays)" },
    ],
    mistakes: [
      "Forgetting the holidays argument and reporting inflated working-day counts.",
      "Not realising both endpoints are counted.",
    ],
    followUps: ["How would you compute an SLA due date five working days after an order?"],
    tags: ["NETWORKDAYS", "WORKDAY", "business days", "dates"],
    related: ["xl-c-dates"],
    sources: [GFG_EXCEL],
  }),
  q({
    id: "xl-q-quarter-fiscal",
    category: "Dates",
    title: "Quarterly sales when the fiscal year starts in May",
    difficulty: "Hard",
    q: "You are given two years of data running January to December. Produce quarter-wise sales where the first quarter begins in May. How would you do it?",
    hint: "Shift the month before you divide it into quarters. Do not hardcode a lookup of twelve months.",
    answer:
      "Shift the calendar month by the fiscal offset, then bucket. With the year starting in May, subtract four months and wrap: fiscal month = MOD(MONTH(date) - 5, 12) + 1, and fiscal quarter = ROUNDUP(that / 3, 0). The fiscal year label also has to shift, since January to April belong to the previous fiscal year: YEAR(date) - (MONTH(date) < 5). Add both as columns, then pivot on fiscal year and quarter.",
    detail:
      "**Deriving the formula**\n\nMay must map to fiscal month 1. `MONTH(May)` is 5, so subtract 5 to get 0, take MOD 12 to wrap January–April round to 8–11, then add 1 to make it one-based:\n\n`=MOD(MONTH(A2) - 5, 12) + 1`\n\nCheck it: May → `MOD(0,12)+1` = 1. December → `MOD(7,12)+1` = 8. January → `MOD(-4,12)+1` = 9. Excel's MOD returns a non-negative result for a positive divisor, which is what makes the wrap work.\n\nThen quarters are groups of three:\n\n`=ROUNDUP(MOD(MONTH(A2)-5,12)+1) / 3, 0)` — or more readably, compute the fiscal month in its own column first and divide that.\n\n**The fiscal year label**\n\nA date in February 2025 belongs to fiscal year 2024, because that year began in May 2024:\n\n`=YEAR(A2) - (MONTH(A2) < 5)`\n\nThe comparison returns TRUE (1) or FALSE (0), so it subtracts one exactly when the month falls before May.\n\n**Putting it together**\n\n| Column | Formula |\n|---|---|\n| Fiscal month | `=MOD(MONTH(A2)-5,12)+1` |\n| Fiscal quarter | `=ROUNDUP(D2/3, 0)` |\n| Fiscal year | `=YEAR(A2)-(MONTH(A2)<5)` |\n| Label | `=\"FY\" & E2 & \" Q\" & F2` |\n\nThen a pivot with fiscal year in Rows, fiscal quarter in Columns and sales in Values.\n\n**Why the interviewer asks this**\n\nThe naive answers are a twelve-branch nested IF or a hardcoded lookup table. Both work and both are unmaintainable. Deriving it arithmetically, with a parameterised start month rather than a hardcoded 5, is the answer that demonstrates real modelling instinct. Making the offset a named cell means the same model serves an April or October fiscal year with one edit.\n\n**In Power Query**\n\nThe same logic as added columns, recorded once and applied on every refresh — the better answer when this data arrives repeatedly.",
    code: [
      { lang: "Excel", label: "Fiscal month, parameterised start", code: "=MOD(MONTH(A2) - FYStartMonth, 12) + 1" },
      { lang: "Excel", label: "Fiscal quarter", code: "=ROUNDUP((MOD(MONTH(A2) - FYStartMonth, 12) + 1) / 3, 0)" },
      { lang: "Excel", label: "Fiscal year label", code: "=YEAR(A2) - (MONTH(A2) < FYStartMonth)" },
    ],
    mistakes: [
      "Bucketing months into quarters without shifting the fiscal year label, so January–April land in the wrong year.",
      "A twelve-branch nested IF instead of arithmetic.",
      "Hardcoding the start month rather than parameterising it.",
    ],
    followUps: [
      "How would you change this for a fiscal year starting in April?",
      "How would you do the same thing in Power Query?",
    ],
    tags: ["fiscal year", "quarter", "MOD", "dates", "scenario"],
    related: ["xl-c-dates", "xl-c-pivot", "xl-q-power-query"],
    sources: [GH_DA],
  }),
];
