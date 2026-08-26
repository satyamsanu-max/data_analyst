import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { Sidebar } from "@/components/nav";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Interview Prep — Data Analyst / Data Science",
  description:
    "A daily, time-budgeted interview preparation system. Maximum preparation value per 150 minutes.",
};

/**
 * The theme is stored in a cookie rather than localStorage so the server can
 * render the correct class on <html> directly. That removes both the
 * flash-of-wrong-theme AND the inline bootstrap script React warns about.
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [store, user] = await Promise.all([cookies(), getCurrentUser()]);
  const theme = store.get("theme")?.value === "light" ? "light" : "dark";

  return (
    <html lang="en" className={theme === "dark" ? "dark" : undefined} suppressHydrationWarning>
      <body>
        {user ? (
          <div className="flex min-h-screen flex-col lg:flex-row">
            <Sidebar initialTheme={theme} user={user} />
            <main className="min-w-0 flex-1">
              <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">{children}</div>
            </main>
          </div>
        ) : (
          // Signed out: no app chrome, just the auth screen.
          <main className="flex min-h-screen items-center justify-center px-4 py-12">{children}</main>
        )}
      </body>
    </html>
  );
}
