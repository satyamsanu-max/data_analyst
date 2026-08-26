import { prisma, getSettings } from "@/lib/db";
import { SettingsForm } from "@/components/settings-form";
import { requireUserPage } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await requireUserPage("/settings");
  const [settings, companies] = await Promise.all([
    getSettings(user.id),
    prisma.company.findMany({ orderBy: [{ bucket: "asc" }, { name: "asc" }] }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <div className="stat-label">Configuration</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Settings</h1>
      </div>

      <SettingsForm
        initial={{
          dailyMinutes: settings.dailyMinutes,
          difficultyMode: settings.difficultyMode,
          targetRole: settings.targetRole,
          targetCompanies: JSON.parse(settings.targetCompanies || "[]"),
        }}
        companies={companies.map((c) => ({ slug: c.slug, name: c.name, bucket: c.bucket }))}
      />
    </div>
  );
}
