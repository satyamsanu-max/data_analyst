import { common, gfg, github, questionsFor, URLS } from "../helpers";
import type { DeepDiveItem } from "../types";

const q = questionsFor("DATA", "excel");

/**
 * Excel interview questions.
 *
 * Sourcing note: the great majority of these are questions published verbatim
 * in public interview-preparation resources — chiefly the two GeeksforGeeks
 * Excel interview articles and the GitHub data-analyst question list. Those are
 * labelled COMMON_INTERVIEW_QUESTION: they are demonstrably asked and
 * demonstrably published, but no public source ties them to one specific named
 * interview, so we do not claim one. Where the same question appears in more
 * than one source it stays ONE record carrying both citations.
 *
 * No company or role is attached to any question here, because none of the
 * sources attach one. That absence is deliberate, not an oversight.
 */

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

export const EXCEL_QUESTIONS: DeepDiveItem[] = [
  // =========================================================== FUNDAMENTALS
  q({
    id: "xl-q-spreadsheet-components",
    category: "Fundamentals",
    title: "What is a spreadsheet and what are its components?",
    difficulty: "Easy",
    q: "What is a spreadsheet, and what are its fundamental components?",
    hint: "Work outwards from the smallest unit. What is the container, what is inside it, and what makes it a spreadsheet rather than a table in a document?",
    answer:
      "A spreadsheet is a grid-based application for storing, calculating and analysing data. The workbook is the file; each worksheet is a tab within it; each worksheet is a grid of columns (letters) and rows (numbers) whose intersections are cells, addressed as B7. Cells hold values or formulas, and a rectangular block of them is a range. What makes it a spreadsheet rather than a static table is that cells can reference other cells, so a change propagates automatically through everything that depends on it.",
    detail:
      "**The hierarchy**\n\nWorkbook → worksheet → row/column → cell → range. Say it in that order and the answer sounds structured rather than recalled.\n\n**What actually distinguishes a spreadsheet**\n\nThe defining feature is the dependency graph. When you write `=B2*C2`, Excel records that this cell depends on B2 and C2; changing either recalculates the result and everything downstream. That is why spreadsheets took over financial modelling — the model updates itself.\n\n**Worth adding**\n\nAlongside the grid, the components an interviewer expects you to name are the formula bar (where a cell's real contents live, as opposed to its displayed value), the Ribbon, and the Name Box. The distinction between a cell's underlying value and its formatted display is the one that matters analytically: a cell showing `1,234` might contain `1234.4`, and a cell showing a date might contain text.\n\n**Edge case worth mentioning**\n\nA worksheet is limited to 1,048,576 rows and 16,384 columns. Knowing this is a good bridge to the follow-up about what you do with data that exceeds it — Power Query and the Data Model.",
    mistakes: [
      "Describing the grid but never mentioning formulas or cell references, which is what makes it a spreadsheet.",
      "Using 'workbook' and 'worksheet' interchangeably.",
    ],
    followUps: [
      "What is the row limit of a worksheet, and what would you do with a larger dataset?",
      "What is the difference between what a cell displays and what it contains?",
    ],
    tags: ["fundamentals", "workbook", "worksheet", "cell"],
    related: ["xl-c-workbook"],
    sources: [GFG_EXCEL_DA, GFG_EXCEL],
  }),
  q({
    id: "xl-q-cell",
    category: "Fundamentals",
    title: "What is a cell in Excel?",
    difficulty: "Easy",
    q: "What is a cell in Excel?",
    hint: "Define it by its address and by what it can hold — and note that what you see is not always what is stored.",
    answer:
      "A cell is the intersection of one row and one column, and the smallest unit that can hold data. It is addressed column-then-row, so B7 is column B, row 7. A cell can hold a number, text, a date, a boolean or a formula, and it carries formatting independently of its content — which is why the displayed value and the stored value can differ.",
    detail:
      "**Address forms**\n\nA1 notation (`B7`) is the default. R1C1 notation (`R7C2`) exists and is what VBA often uses. Absolute forms add dollar signs: `$B$7`.\n\n**Stored value vs displayed value**\n\nThis is the part worth volunteering. Formatting a cell to two decimal places does not round the stored number — `1234.4` displayed as `1,234` is still `1234.4` in every calculation. If you need the value itself rounded, use `ROUND()`. Analysts get caught by this when a column of displayed values does not add up to the displayed total.\n\n**How to tell what type a cell holds**\n\nBy default Excel right-aligns numbers and dates and left-aligns text. A column of left-aligned 'dates' is text, which is the fastest visual diagnosis of the most common data-import problem there is.\n\n**Related trap**\n\nAn empty-looking cell is not necessarily empty. A formula returning `\"\"` looks blank, is counted by COUNTA, and is not counted by COUNT.",
    mistakes: [
      "Saying formatting changes the value — it does not.",
      "Assuming a blank-looking cell is genuinely empty.",
    ],
    followUps: [
      "How can you tell at a glance whether a column contains real dates or text?",
      "Why might a column of displayed values not sum to the displayed total?",
    ],
    tags: ["cell", "fundamentals", "formatting"],
    related: ["xl-c-workbook", "xl-c-dates"],
    sources: [GFG_EXCEL, GFG_EXCEL_DA],
  }),
  q({
    id: "xl-q-workbook",
    category: "Fundamentals",
    title: "What is a workbook, and how does it relate to a worksheet?",
    difficulty: "Easy",
    q: "What is a workbook in Excel, and how is it different from a worksheet?",
    hint: "One is the file on disk. The other is a tab inside it.",
    answer:
      "A workbook is the Excel file itself — what you save as .xlsx, .xlsm or .csv. A worksheet is a single tab inside that workbook. One workbook contains many worksheets, and formulas can reference across them using the sheet name followed by an exclamation mark, as in =Sales!B2. Cross-workbook references are possible too but create external links that break when the other file moves.",
    detail:
      "**File extensions worth knowing**\n\n`.xlsx` is the standard format. `.xlsm` is required if the workbook contains macros — saving a macro workbook as .xlsx silently discards the code. `.xlsb` is a binary format that is smaller and faster for very large workbooks. `.csv` holds one sheet of plain text with no formulas or formatting at all.\n\n**Cross-sheet and cross-workbook references**\n\nWithin a workbook: `=Sales!B2`. Sheet names containing spaces need quotes: `='Q1 Sales'!B2`. Across workbooks the reference includes the file path, and those links are fragile — they break when the source file is moved or renamed, and they are a frequent cause of `#REF!` in shared models.\n\n**Practical implication**\n\nWhen designing anything that will be handed to someone else, prefer one workbook with several sheets over several linked workbooks. External links are the most common reason an inherited model does not open cleanly.",
    mistakes: [
      "Saving a macro-enabled workbook as .xlsx and losing the macros.",
      "Building a model on cross-workbook links, which break on the first file move.",
    ],
    followUps: [
      "What happens to macros if you save as .xlsx?",
      "How would you reference a sheet whose name contains a space?",
    ],
    tags: ["workbook", "worksheet", "file formats"],
    related: ["xl-c-workbook", "xl-q-macro"],
    sources: [GFG_EXCEL],
  }),
  q({
    id: "xl-q-ribbon",
    category: "Fundamentals",
    title: "What is the Ribbon in Excel?",
    difficulty: "Easy",
    q: "What is the Ribbon in Excel?",
    hint: "It is the command surface. Name how it is organised and how you would hide it.",
    answer:
      "The Ribbon is the tabbed command bar across the top of Excel, organising commands into tabs (Home, Insert, Data, Formulas, Review, View) and groups within each tab. It is contextual — selecting a chart or a pivot table adds tool tabs that only appear when relevant. Ctrl+F1 collapses and restores it, and it can be customised through File → Options → Customize Ribbon.",
    detail:
      "**Structure**\n\nTabs contain groups, groups contain commands. The tabs that matter most for analyst work are **Data** (sorting, filtering, Get & Transform, Data Validation, What-If) and **Formulas** (Name Manager, formula auditing).\n\n**Contextual tabs**\n\nSelect a pivot table and PivotTable Analyse and Design appear. Select a chart and Chart Design and Format appear. Candidates sometimes say a feature 'is not there' when they simply have not selected the object that reveals its tab.\n\n**Worth knowing**\n\nAlt reveals keyboard accelerators for every Ribbon command, which is how power users navigate without a mouse. The Quick Access Toolbar above or below the Ribbon holds commands you want available from every tab.\n\nThis question is a warm-up. Answer it in two sentences and let the interviewer move on — over-explaining the Ribbon signals you have nothing stronger to talk about.",
    mistakes: ["Spending a long time on it. It is a warm-up question."],
    followUps: ["How would you add a frequently used command to the Quick Access Toolbar?"],
    tags: ["ribbon", "interface", "fundamentals"],
    related: ["xl-c-workbook"],
    sources: [GFG_EXCEL, GFG_EXCEL_DA],
  }),
  q({
    id: "xl-q-formula-bar",
    category: "Fundamentals",
    title: "What is the formula bar, and why does it matter analytically?",
    difficulty: "Easy",
    q: "What is the formula bar in Excel?",
    hint: "It shows what a cell really contains, which is not always what the cell shows.",
    answer:
      "The formula bar sits above the grid and displays the actual contents of the selected cell — the formula, or the underlying unformatted value. It matters analytically because the grid shows the formatted result while the formula bar shows the truth: a cell displaying 1,234 may contain 1234.4, and a cell displaying a date may contain text. It is the first place to look when a number does not behave as expected.",
    detail:
      "**The diagnostic use**\n\nThree checks the formula bar answers instantly:\n\n1. **Is this a value or a formula?** Hardcoded numbers sitting in a column of formulas are one of the most common sources of a broken model.\n2. **Is this really a number?** If the formula bar shows `1234` but the cell is left-aligned, it is text that looks numeric.\n3. **Is this really a date?** Same test. Real dates right-align and show as a date in the bar.\n\n**Expanding it**\n\nCtrl+Shift+U expands the formula bar for long formulas. Alt+Enter inserts line breaks inside a formula, which makes a nested IF readable — a habit worth demonstrating if you are asked to write anything long.\n\n**F9 trick**\n\nSelecting part of a formula in the formula bar and pressing F9 evaluates just that fragment, showing its result inline. This is the fastest way to debug a formula that returns the wrong answer without an obvious error. Press Escape rather than Enter afterwards, or you will overwrite the fragment with its value.",
    mistakes: [
      "Pressing Enter after an F9 evaluation, which permanently replaces the formula fragment with a hardcoded value.",
      "Trusting the displayed value when diagnosing a numeric problem.",
    ],
    followUps: ["How would you debug a long nested formula that returns the wrong number?"],
    tags: ["formula bar", "debugging", "fundamentals"],
    related: ["xl-c-workbook", "xl-c-errors"],
    sources: [GFG_EXCEL],
  }),
  q({
    id: "xl-q-references",
    category: "Fundamentals",
    title: "What are cell references?",
    difficulty: "Easy",
    q: "What are cell references in Excel?",
    hint: "There are three kinds, and the difference only reveals itself when you copy the formula.",
    answer:
      "A cell reference points a formula at another cell. There are three kinds, distinguished by what happens when the formula is copied: relative (A1) shifts both row and column; absolute ($A$1) shifts neither; mixed ($A1 or A$1) locks one and lets the other move. F4 cycles the four states while editing. References can also point at other sheets (Sales!B2) or other workbooks.",
    detail:
      "**Why the distinction exists**\n\nCopying a formula does not copy its text — Excel rewrites the references relative to how far the formula moved. That is the behaviour you almost always want when filling a column, and exactly what you do not want when every row should reference the same tax rate.\n\n**The test that reveals understanding**\n\nBuild a multiplication table. Row headers in A2:A11, column headers in B1:K1. A single formula in B2, filled across and down:\n\n`=$A2*B$1`\n\nThe column is locked to A for the row header, the row is locked to 1 for the column header, and everything else moves. Anyone who only knows `$A$1` cannot build this, which is why it is the standard follow-up.\n\n**Structured references**\n\nInside an Excel Table, references become names: `Sales[Amount]`, or `[@Amount]` for the current row. These behave absolutely by default and expand automatically as the table grows, which is usually better than either relative or absolute for real work.",
    code: [
      { lang: "Excel", label: "One formula, fills a whole multiplication grid", code: "=$A2*B$1" },
      { lang: "Excel", label: "Structured reference inside a Table", code: "=[@Quantity] * [@UnitPrice]" },
    ],
    mistakes: [
      "Locking everything with $ 'to be safe', which breaks filling.",
      "Typing dollar signs by hand instead of using F4.",
    ],
    followUps: [
      "Build a multiplication table with a single formula.",
      "What is a structured reference and when is it better than $A$1?",
    ],
    tags: ["references", "absolute", "relative", "mixed"],
    related: ["xl-c-references", "xl-q-dollar-symbol"],
    sources: [GFG_EXCEL, GFG_EXCEL_DA],
  }),
  q({
    id: "xl-q-dollar-symbol",
    category: "Fundamentals",
    title: "What does the dollar symbol mean in a formula?",
    difficulty: "Easy",
    q: "When working with Excel, what does the dollar symbol mean?",
    hint: "It has nothing to do with currency.",
    answer:
      "The dollar sign locks part of a reference so it does not shift when the formula is copied. $ before the column letter locks the column; $ before the row number locks the row; both locks the cell entirely. It has nothing to do with currency formatting — that is applied through the number format, not the formula.",
    detail:
      "**The four states**\n\n| Written | Column | Row | Behaviour on copy |\n|---|---|---|---|\n| `A1` | free | free | both shift |\n| `$A$1` | locked | locked | never changes |\n| `$A1` | locked | free | moves down only |\n| `A$1` | free | locked | moves across only |\n\nF4 cycles through them while the reference is selected in the formula bar.\n\n**When each is right**\n\n- **Absolute** for a single constant every row must use — a tax rate, an exchange rate, a target.\n- **Mixed** whenever a formula fills in two directions across a grid.\n- **Relative** for everything else, which is most formulas.\n\n**The interview trap**\n\nBecause the symbol is a dollar sign, candidates occasionally answer 'currency'. Being crisp that it is reference locking, and that currency is a number format applied from the Home tab, takes five seconds and avoids an easy stumble.",
    code: [{ lang: "Excel", label: "Every row against one fixed rate", code: "=B2*$F$1" }],
    mistakes: ["Answering that it formats currency."],
    followUps: ["Which state would you use for a formula that fills both across and down?"],
    tags: ["dollar sign", "absolute reference", "F4"],
    related: ["xl-c-references", "xl-q-references"],
    sources: [GFG_EXCEL_DA],
  }),
  q({
    id: "xl-q-formula-vs-function",
    category: "Fundamentals",
    title: "Difference between a function and a formula",
    difficulty: "Easy",
    q: "What is the difference between a function and a formula in Excel?",
    hint: "One contains the other.",
    answer:
      "A formula is any expression you enter that begins with an equals sign. A function is a named, built-in operation that a formula can call. =A1+A2+A3 is a formula containing no function; =SUM(A1:A3) is a formula that calls the SUM function. Every function appears inside a formula, but plenty of formulas contain none.",
    detail:
      "**Why the distinction is worth being precise about**\n\nIt is a vocabulary check, and the reason interviewers use it is that precise vocabulary predicts precise thinking. Answer in one sentence with one example of each.\n\n**A useful extension**\n\nFunctions come in categories — logical (IF, AND), lookup (VLOOKUP, INDEX), text (LEFT, TRIM), date (TODAY, EOMONTH), statistical (AVERAGE, STDEV), financial (PMT, NPV), and in modern Excel the dynamic array family (FILTER, UNIQUE, SORT). You can also write your own with a VBA Function or a LAMBDA, which is where 'built-in' stops being the whole story.\n\n**Practical note**\n\nThe categorisation matters when you are hunting for a function you half-remember: the Formulas tab groups them exactly this way, and the Insert Function dialog searches by description.",
    mistakes: ["Using the two terms interchangeably.", "Over-answering a one-sentence question."],
    followUps: ["Can you create your own function? How?"],
    tags: ["formula", "function", "vocabulary"],
    related: ["xl-c-formula-vs-function", "xl-q-macro"],
    sources: [GFG_EXCEL_DA, GFG_EXCEL],
  }),
  q({
    id: "xl-q-merge-cells",
    category: "Fundamentals",
    title: "How do you merge cells, and why should you usually not?",
    difficulty: "Easy",
    q: "How do you merge cells in Excel?",
    hint: "Give the mechanic, then the reason an analyst avoids it.",
    answer:
      "Home → Merge & Center, or Alt+H+M+C. Merging combines selected cells into one and keeps only the top-left value, discarding the rest. In analytical work you should generally avoid it: merged cells break sorting, filtering, pivot tables and structured references. Where you only want a heading to appear centred across a span, use Format Cells → Alignment → Center Across Selection, which looks identical but leaves the cells intact.",
    detail:
      "**What merging actually costs you**\n\n- **Sorting** fails outright with a 'requires identically sized merged cells' error.\n- **Filtering** treats the merged block as one cell, so only the first row of it is returned.\n- **Pivot tables** cannot use a merged header row as a field name.\n- **VBA and formulas** referencing the merged range see only the anchor cell; the rest are empty.\n\n**The alternative to name**\n\nCenter Across Selection produces the same visual result with none of the structural damage. Volunteering this is a strong signal — it shows you have hit the sorting error and learned from it.\n\n**Where merging is fine**\n\nA presentation layer that nobody sorts, filters or pivots: a title bar, a printed report header. The rule is that merged cells belong in the output, never in the data.",
    mistakes: [
      "Merging cells inside a data table, then being unable to sort it.",
      "Not knowing Center Across Selection exists.",
    ],
    followUps: ["Why would a sort fail on a range containing merged cells?"],
    tags: ["merge", "formatting", "data hygiene"],
    related: ["xl-c-workbook", "xl-c-cleaning-workflow"],
    sources: [GFG_EXCEL],
  }),
  q({
    id: "xl-q-wrap-text",
    category: "Fundamentals",
    title: "How do you wrap text in a cell?",
    difficulty: "Easy",
    q: "How do you wrap text in Excel?",
    hint: "There is an automatic way and a manual way. Name both.",
    answer:
      "Home → Wrap Text (Alt+H+W) makes long text wrap onto multiple lines within the cell, with the row height adjusting to fit. For a break at a specific point rather than wherever the column edge falls, put the cursor in the formula bar and press Alt+Enter. Inside a formula, CHAR(10) inserts the same line break — though wrap text must be on for it to display.",
    detail:
      "**Three mechanisms, three uses**\n\n1. **Wrap Text** — automatic reflow at the column boundary. Good for comment columns.\n2. **Alt+Enter** — a manual break at a chosen point while editing.\n3. **CHAR(10)** inside a formula — a break in generated text, e.g. building an address block:\n\n`=A2 & CHAR(10) & B2 & CHAR(10) & C2`\n\nOn Mac, CHAR(13) is used instead.\n\n**The gotcha**\n\nCHAR(10) does nothing visible unless Wrap Text is enabled on that cell. Candidates often conclude the formula is broken when the formatting is simply off.\n\n**When it does not apply**\n\nWrapped text is a display setting only — it does not alter the stored value, so a wrapped cell exports to CSV as one continuous string with an embedded newline, which can break naive downstream parsers. Worth mentioning if the interviewer is probing data pipelines.",
    code: [{ lang: "Excel", label: "Line breaks inside generated text", code: "=A2 & CHAR(10) & B2 & CHAR(10) & C2" }],
    mistakes: ["Using CHAR(10) without enabling Wrap Text, then assuming the formula failed."],
    followUps: ["How would you build a multi-line address in a single cell with a formula?"],
    tags: ["wrap text", "formatting", "CHAR"],
    related: ["xl-c-text-clean"],
    sources: [GFG_EXCEL, GFG_EXCEL_DA],
  }),
  q({
    id: "xl-q-freeze-panes",
    category: "Fundamentals",
    title: "What are Freeze Panes?",
    difficulty: "Easy",
    q: "What are Freeze Panes in Excel?",
    hint: "The rule for which rows freeze depends entirely on which cell is selected first.",
    answer:
      "Freeze Panes locks rows or columns so they stay visible while you scroll. View → Freeze Panes offers Freeze Top Row, Freeze First Column, or Freeze Panes, which locks everything above and to the left of the currently selected cell. So to freeze the first row and the first two columns, select C2 first, then Freeze Panes.",
    detail:
      "**The selection rule**\n\nThis is the part people get wrong. Freeze Panes freezes **above and left of the active cell** — the active cell itself is the first unfrozen one. Selecting B2 freezes row 1 and column A. Selecting C2 freezes row 1 and columns A and B. Selecting A1 freezes nothing.\n\n**Split vs Freeze**\n\nView → Split creates independently scrollable panes rather than locked ones, which is how you compare row 5 against row 5,000 in the same sheet. Freeze is for headers; Split is for comparison.\n\n**Print equivalent**\n\nFreeze Panes affects the screen only. To repeat header rows on every printed page you need Page Layout → Print Titles → Rows to repeat at top. Interviewers occasionally follow up with this, and treating them as the same feature is a small but visible error.",
    mistakes: [
      "Selecting the header row itself instead of the row below it.",
      "Expecting Freeze Panes to repeat headers when printing.",
    ],
    followUps: [
      "Which cell would you select to freeze the top row and first two columns?",
      "How do you repeat headers on every printed page?",
    ],
    tags: ["freeze panes", "navigation", "printing"],
    related: ["xl-c-workbook"],
    sources: [GFG_EXCEL_DA],
  }),
  q({
    id: "xl-q-name-box",
    category: "Fundamentals",
    title: "How do you use the Name Box?",
    difficulty: "Easy",
    q: "How do you use the Name Box function?",
    hint: "It does three distinct jobs, not one.",
    answer:
      "The Name Box sits to the left of the formula bar and does three things. It shows the address of the active cell. Typing an address into it (D5000, or a range like A1:C50) jumps to and selects that range instantly. And typing a name while a range is selected creates a named range, which you can then use in formulas — =SUM(Revenue) instead of =SUM(C2:C500).",
    detail:
      "**Why the navigation use matters**\n\nOn a large sheet, typing `A50000` into the Name Box is far faster and more reliable than scrolling or Ctrl+Down, which stops at the first blank. It also selects a range without dragging: type `A1:D5000` and press Enter.\n\n**Creating names**\n\nSelect the range, click the Name Box, type a name, press Enter. Rules: no spaces, cannot look like a cell address (`Q1` is rejected because it is a valid reference), and it is workbook-scoped by default. Formulas → Name Manager is where you edit or delete them.\n\n**Why named ranges are worth using**\n\n`=Revenue - Costs` is self-documenting in a way `=C2-D2` never is, and a constant defined once can be changed in one place. They are absolute by default, so no dollar signs needed.\n\n**The limitation to mention**\n\nA static named range does not grow with the data. If the range will expand, either define it dynamically or — better — convert the data to a Table and use structured references, which handle growth automatically.",
    mistakes: [
      "Naming a range something that looks like a cell address, which Excel rejects.",
      "Assuming a named range expands as data is added.",
    ],
    followUps: [
      "What are the naming rules for a named range?",
      "How do you make a range that grows automatically?",
    ],
    tags: ["name box", "named range", "navigation"],
    related: ["xl-c-named-ranges"],
    sources: [GFG_EXCEL_DA],
  }),
  q({
    id: "xl-q-clear-formatting",
    category: "Fundamentals",
    title: "How do you clear formatting without removing content?",
    difficulty: "Easy",
    q: "How do you clear formatting in Excel without removing the cell content?",
    hint: "There is a menu with several 'Clear' options that do different things.",
    answer:
      "Home → Editing → Clear → Clear Formats. That strips fonts, fills, borders, number formats and conditional formatting while leaving values and formulas intact. The same menu also offers Clear Contents (the opposite — removes data, keeps formatting), Clear Comments, Clear Hyperlinks and Clear All. Pressing Delete is equivalent to Clear Contents only.",
    detail:
      "**The distinction that gets tested**\n\n| Action | Removes values | Removes formatting |\n|---|---|---|\n| Delete key | yes | no |\n| Clear Contents | yes | no |\n| Clear Formats | no | yes |\n| Clear All | yes | yes |\n\n**Why it comes up in real work**\n\nInherited files carry accumulated formatting — stray fills, custom number formats that display a number as something else entirely, conditional formatting rules layered on rules. Clearing formats on a data range is a standard first step when a file behaves strangely.\n\n**A number-format caveat**\n\nClear Formats resets number formats to General, which will change how dates display — a real date will suddenly show as a five-digit serial. That is not data loss; it is the underlying value revealing itself. Reapply a date format and it is back.\n\n**Related tool**\n\nThe Format Painter (double-click it to keep it active for multiple targets) is the reverse operation, copying formatting without values.",
    mistakes: [
      "Using Clear All when only formatting was the problem.",
      "Panicking when dates show as serial numbers after clearing formats.",
    ],
    followUps: ["What happens to dates when you clear formats, and why?"],
    tags: ["clear formatting", "formatting", "cleaning"],
    related: ["xl-c-dates", "xl-c-cleaning-workflow"],
    sources: [GFG_EXCEL_DA],
  }),
  q({
    id: "xl-q-cell-formats",
    category: "Fundamentals",
    title: "How many cell formats are available in Excel?",
    difficulty: "Easy",
    q: "How many cell formats are possible in Microsoft Excel? What are the main data formats?",
    hint: "Name the built-in categories rather than trying to give an exact count.",
    answer:
      "Excel's Format Cells dialog offers twelve built-in categories: General, Number, Currency, Accounting, Date, Time, Percentage, Fraction, Scientific, Text, Special and Custom. Custom is unbounded — you define your own format string — so the honest answer is twelve categories with an open-ended custom option, rather than a fixed number.",
    detail:
      "**The ones that matter analytically**\n\n- **General** — Excel guesses. Fine for input, risky for anything you care about.\n- **Text** — forces the cell to store input as text. Essential for leading-zero identifiers like `007` or long numbers like credit-card IDs that would otherwise lose precision.\n- **Number vs Currency vs Accounting** — Accounting aligns currency symbols and decimal points in a column and shows zeros as dashes. Currency does not align.\n- **Custom** — format strings like `#,##0.0,,\"M\"` to display millions, or `[Red]-#,##0;[Green]#,##0` for conditional colouring by sign.\n\n**The trap this question sets up**\n\nFormat is display only. Formatting a text-stored number as Number does **not** convert it — the cell still holds text and will still fail arithmetic. Conversion requires `VALUE()`, Text to Columns, or Paste Special → Multiply by 1.\n\nThat point is usually the real target of the question, so volunteer it.",
    code: [
      { lang: "Excel", label: "Custom format — display thousands as K", code: "#,##0,\"K\"" },
      { lang: "Excel", label: "Convert text that looks numeric", code: "=VALUE(A2)" },
    ],
    mistakes: [
      "Believing that applying a Number format converts text to a number.",
      "Losing leading zeros by not formatting an ID column as Text before import.",
    ],
    followUps: [
      "How would you preserve leading zeros in a product code?",
      "How do you actually convert text that looks like a number?",
    ],
    tags: ["formatting", "number format", "custom format", "text"],
    related: ["xl-c-cleaning-workflow", "xl-q-data-formats"],
    sources: [GFG_EXCEL_DA],
  }),
];
