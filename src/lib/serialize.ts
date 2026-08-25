import type { FullPlan } from "./plan-service";
import type { TaskCardData } from "@/components/task-card";

export function slotLabelFor(category: string): string {
  if (category === "Probability" || category === "Statistics") return "Probability/Statistics";
  if (category === "ML" || category === "Python") return "ML/Python";
  return category;
}

export function toTaskCards(plan: FullPlan): TaskCardData[] {
  return plan.tasks.map((t) => ({
    id: t.id,
    planId: t.planId,
    position: t.position,
    plannedMinutes: t.plannedMinutes,
    status: t.status,
    outcome: t.outcome,
    elapsedSeconds: t.elapsedSeconds,
    swapped: t.swapped,
    slotLabel: slotLabelFor(t.question.category),
    question: {
      id: t.question.id,
      title: t.question.title,
      category: t.question.category,
      topicName: t.question.topic.name,
      pattern: t.question.pattern,
      difficulty: t.question.difficulty,
      estimatedMinutes: t.question.estimatedMinutes,
      frequencyScore: t.question.frequencyScore,
      patternValue: t.question.patternValue,
      sourceName: t.question.source?.name ?? null,
      sourceUrl: t.question.sourceUrl,
      sourceNote: t.question.sourceNote,
      companies: t.question.companies.map((c) => c.company.name),
      prompt: t.question.prompt,
      hint: t.question.hint,
      masteryScore: t.question.progress?.masteryScore ?? 0,
      status: t.question.progress?.status ?? "not_started",
      attemptCount: t.question.progress?.attemptCount ?? 0,
    },
  }));
}

/** Minutes grouped by the slot each task belongs to. */
export function slotBreakdown(cards: TaskCardData[]) {
  const map = new Map<string, { slot: string; minutes: number; count: number }>();
  for (const c of cards) {
    const e = map.get(c.slotLabel) ?? { slot: c.slotLabel, minutes: 0, count: 0 };
    e.minutes += c.plannedMinutes;
    e.count += 1;
    map.set(c.slotLabel, e);
  }
  const order = ["DSA", "SQL", "Probability/Statistics", "ML/Python", "Guesstimate"];
  const rank = (s: string) => {
    const i = order.indexOf(s);
    return i === -1 ? order.length : i;
  };
  return [...map.values()].sort((a, b) => rank(a.slot) - rank(b.slot));
}
