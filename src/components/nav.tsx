"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui";

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/today", label: "Today's Plan" },
  { section: "Question banks" },
  { href: "/bank/dsa", label: "DSA" },
  { href: "/bank/sql", label: "SQL" },
  { href: "/bank/probability", label: "Probability" },
  { href: "/bank/statistics", label: "Statistics" },
  { href: "/bank/ml", label: "ML" },
  { href: "/bank/python", label: "Python" },
  { href: "/bank/guesstimate", label: "Guesstimates" },
  { section: "Insight" },
  { href: "/progress", label: "Progress" },
  { href: "/patterns", label: "Pattern Coverage" },
  { href: "/review", label: "Weekly Review" },
  { href: "/companies", label: "Companies" },
  { href: "/settings", label: "Settings" },
] as const;

function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = (localStorage.getItem("theme") as "dark" | "light" | null) ?? "dark";
    setTheme(stored);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggle} className="w-full justify-start">
      {theme === "dark" ? "☾  Dark" : "☀  Light"}
    </Button>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between border-b border-border p-4 lg:hidden">
        <Link href="/" className="text-sm font-semibold">
          Interview Prep
        </Link>
        <Button variant="outline" size="sm" onClick={() => setOpen((o) => !o)}>
          Menu
        </Button>
      </div>

      <aside
        className={cn(
          "border-r border-border bg-card/40 lg:sticky lg:top-0 lg:block lg:h-screen lg:w-60 lg:shrink-0",
          open ? "block" : "hidden",
        )}
      >
        <div className="flex h-full flex-col p-4">
          <Link href="/" className="mb-6 hidden px-2 lg:block">
            <div className="text-sm font-semibold tracking-tight">Interview Prep</div>
            <div className="text-xs text-muted-foreground">Data Analyst / DS</div>
          </Link>

          <nav className="flex-1 space-y-0.5 overflow-y-auto">
            {NAV.map((item, i) =>
              "section" in item ? (
                <div key={i} className="stat-label px-3 pb-1 pt-4">
                  {item.section}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-1.5 text-sm transition-colors",
                    pathname === item.href
                      ? "bg-secondary font-medium text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="mt-4 border-t border-border pt-3">
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
}
