import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AuthForm } from "@/components/auth-form";

export const dynamic = "force-dynamic";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string; next?: string }>;
}) {
  if (await getCurrentUser()) redirect("/");
  const { reset, next } = await searchParams;
  return (
    <AuthForm
      mode="signin"
      notice={reset ? "Password updated. Sign in with your new password." : undefined}
      next={next}
    />
  );
}
