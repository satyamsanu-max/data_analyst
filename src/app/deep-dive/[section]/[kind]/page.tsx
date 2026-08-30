import { redirect, notFound } from "next/navigation";
import { SECTION_BY_SLUG } from "@/data/deep-dive/types";

/**
 * Legacy redirect.
 *
 * Deep Dive used to live at /deep-dive/[section]/concepts and
 * /deep-dive/[section]/questions before it was flattened into the Learn and
 * Practice pages. Anyone who bookmarked or was linked one of those old URLs —
 * including from before this app was ever deployed — would otherwise land on
 * a 404. This sends them to the equivalent Learn or Practice view instead.
 *
 * Next's router prefers a matching static segment over a dynamic one, so this
 * never shadows the real /deep-dive/learn, /deep-dive/practice, etc.
 */
export default async function LegacyDeepDiveRedirect({
  params,
}: {
  params: Promise<{ section: string; kind: string }>;
}) {
  const { section, kind } = await params;
  if (!SECTION_BY_SLUG[section]) notFound();

  if (kind === "concepts") redirect(`/deep-dive/learn?topic=${section}`);
  if (kind === "questions") redirect(`/deep-dive/practice?topic=${section}`);
  notFound();
}
