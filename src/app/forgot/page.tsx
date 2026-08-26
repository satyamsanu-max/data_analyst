import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ForgotForm } from "@/components/reset-forms";

export const dynamic = "force-dynamic";

export default async function ForgotPage() {
  if (await getCurrentUser()) redirect("/");
  return <ForgotForm />;
}
