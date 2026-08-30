import { redirect, notFound } from "next/navigation";
import { SECTION_BY_SLUG } from "@/data/deep-dive/types";

/**
 * Legacy redirect for the old per-section landing page
 * (/deep-dive/[section], with no /concepts or /questions suffix).
 * See the sibling [kind] route for the fuller explanation.
 */
export default async function LegacyDeepDiveSectionRedirect({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!SECTION_BY_SLUG[section]) notFound();
  redirect(`/deep-dive/learn?topic=${section}`);
}
