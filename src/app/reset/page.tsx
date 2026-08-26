import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { checkResetToken } from "@/lib/reset";
import { ResetForm } from "@/components/reset-forms";

export const dynamic = "force-dynamic";

export default async function ResetPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  if (await getCurrentUser()) redirect("/");

  const { token } = await searchParams;
  const check = await checkResetToken(token ?? "");

  // Validate before rendering the form, so a dead link says so immediately
  // rather than after the user has typed a new password twice.
  if (!check.valid) {
    return (
      <div className="mx-auto w-full max-w-sm text-center">
        <div className="surface p-6">
          <h1 className="text-xl font-semibold tracking-tight">Link not usable</h1>
          <p className="mt-2 text-sm text-muted-foreground">{check.reason}</p>
          <Link href="/forgot" className="mt-4 inline-block text-sm text-primary hover:underline">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return <ResetForm token={token!} />;
}
