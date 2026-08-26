/**
 * Numeric answer grading.
 *
 * The parser is deliberately generous about FORM and strict about VALUE: an
 * interviewer does not care whether you say "1/6", "0.167" or "16.7%", but they
 * do care that the number is right.
 */

import type { AnswerSpec } from "@/data/answers";

export type NumericGrade = {
  correct: boolean;
  parsed: number | null;
  feedback: string;
  /** Populated only once the attempt is graded, so the key is never leaked early. */
  expected?: number;
  note?: string;
};

/**
 * Ordered longest-first so "million" is never truncated to "m".
 * The suffix may be attached to the digits ("2.5m") or spaced ("2.5 million").
 */
const MULTIPLIERS: [string, number][] = [
  ["thousand", 1e3],
  ["trillion", 1e12],
  ["billion", 1e9],
  ["million", 1e6],
  ["crore", 1e7],
  ["lakh", 1e5],
  ["lac", 1e5],
  ["mn", 1e6],
  ["bn", 1e9],
  ["tn", 1e12],
  ["cr", 1e7],
  ["k", 1e3],
  ["m", 1e6],
  ["b", 1e9],
];

/**
 * Parse the numeric forms people actually type.
 * Returns null when nothing usable is present.
 */
export function parseAnswer(raw: string): number | null {
  if (!raw) return null;
  let s = raw.trim().toLowerCase();

  // Thousand separators vanish entirely ("5,040" -> "5040"); other punctuation
  // becomes whitespace so it cannot glue tokens together.
  s = s.replace(/(\d),(?=\d{3}(\D|$))/g, "$1");
  s = s.replace(/[$₹€£,]/g, " ").replace(/\s+/g, " ").trim();
  if (!s) return null;

  const isPercent = /%|percent/.test(s);

  let multiplier = 1;
  for (const [word, m] of MULTIPLIERS) {
    // Must follow a digit or space, and must not be the prefix of a longer word.
    const re = new RegExp(`(?<=[\\d\\s])${word}(?![a-z])`, "i");
    if (re.test(s)) {
      multiplier = m;
      s = s.replace(re, " ");
      break;
    }
  }

  s = s.replace(/%|\bpercent\b/g, " ").trim();

  // e^-2 style
  const eNeg = s.match(/^e\s*\^?\s*(-?\d+(?:\.\d+)?)$/);
  if (eNeg) return Math.exp(Number(eNeg[1])) * multiplier;

  // Fractions: "1/6", "671/1296", "-3/4"
  const frac = s.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)$/);
  if (frac) {
    const denom = Number(frac[2]);
    if (denom === 0) return null;
    const v = (Number(frac[1]) / denom) * multiplier;
    return isPercent ? v / 100 : v;
  }

  // Scientific notation and plain decimals, including "5 x 10^9" / "5e9"
  const sci = s.match(/^(-?\d+(?:\.\d+)?)\s*(?:x|\*)\s*10\s*\^?\s*(-?\d+)$/);
  if (sci) return Number(sci[1]) * Math.pow(10, Number(sci[2])) * multiplier;

  const first = s.match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/);
  if (!first) return null;

  // Reject inputs that are mostly prose with an incidental number.
  const leftover = s.replace(first[0], "").replace(/[^a-z]/g, "");
  if (leftover.length > 12) return null;

  const v = Number(first[0]) * multiplier;
  if (!Number.isFinite(v)) return null;
  return isPercent ? v / 100 : v;
}

function withinTolerance(actual: number, spec: AnswerSpec): boolean {
  const expected = spec.value;

  // Order-of-magnitude grading: the answer must sit inside a multiplicative band.
  if (spec.factor && spec.factor > 1) {
    if (expected === 0) return actual === 0;
    if (actual === 0) return false;
    if (Math.sign(actual) !== Math.sign(expected)) return false;
    const ratio = Math.abs(actual / expected);
    return ratio >= 1 / spec.factor && ratio <= spec.factor;
  }

  if (expected === 0) return Math.abs(actual) <= spec.tolerance;
  return Math.abs(actual - expected) / Math.abs(expected) <= spec.tolerance;
}

function fmt(n: number): string {
  if (Number.isInteger(n) && Math.abs(n) < 1e6) return String(n);
  if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(2).replace(/\.?0+$/, "") + " billion";
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(2).replace(/\.?0+$/, "") + " million";
  if (Math.abs(n) < 0.01) return n.toExponential(2);
  return String(Math.round(n * 10000) / 10000);
}

export function gradeNumeric(input: string, spec: AnswerSpec): NumericGrade {
  const trimmed = input.trim();

  // Accept exact alternate forms verbatim, e.g. "1/6" or "C(10,3)".
  if (spec.alternates?.some((a) => a.toLowerCase() === trimmed.toLowerCase())) {
    return {
      correct: true,
      parsed: spec.value,
      feedback: "Correct.",
      expected: spec.value,
      note: spec.note,
    };
  }

  const parsed = parseAnswer(trimmed);
  if (parsed === null) {
    return {
      correct: false,
      parsed: null,
      feedback:
        "Could not read a number from that. Try a plain value, a fraction, or a percentage — for example 0.167, 1/6, or 16.7%.",
    };
  }

  // Percentage/proportion mix-ups are the most common near-miss; catch them
  // explicitly rather than just marking the answer wrong.
  if (withinTolerance(parsed, spec)) {
    return {
      correct: true,
      parsed,
      feedback: spec.unit ? `Correct — ${fmt(parsed)} ${spec.unit}.` : "Correct.",
      expected: spec.value,
      note: spec.note,
    };
  }

  // Percent/proportion confusion is only a meaningful diagnosis for exact
  // answers. On an order-of-magnitude question a factor of 100 is simply wrong,
  // and calling it a "scale" error would be misleading.
  const exactlyGraded = !spec.factor;

  if (exactlyGraded && withinTolerance(parsed / 100, spec)) {
    return {
      correct: false,
      parsed,
      feedback: `Right figure, wrong scale — you gave a percentage where a proportion was expected. ${fmt(parsed)}% is ${fmt(parsed / 100)}.`,
      expected: spec.value,
      note: spec.note,
    };
  }
  if (exactlyGraded && withinTolerance(parsed * 100, spec)) {
    return {
      correct: false,
      parsed,
      feedback: `Right figure, wrong scale — that looks like a proportion where a percentage was expected.`,
      expected: spec.value,
      note: spec.note,
    };
  }

  const ratio = spec.value === 0 ? Infinity : parsed / spec.value;
  const orderOff = Math.abs(Math.log10(Math.abs(ratio || 1e-12)));
  const hint =
    orderOff >= 0.9
      ? `That is off by about ${Math.round(Math.abs(ratio) > 1 ? Math.abs(ratio) : 1 / Math.abs(ratio))}x — check your units and your multiplication chain.`
      : "Close, but outside the accepted tolerance. Re-check the arithmetic.";

  return { correct: false, parsed, feedback: hint, expected: spec.value, note: spec.note };
}
