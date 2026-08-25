import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/nav";

export const metadata: Metadata = {
  title: "Interview Prep — Data Analyst / Data Science",
  description:
    "A daily, time-budgeted interview preparation system. Maximum preparation value per 150 minutes.",
};

const themeScript = `
try {
  var t = localStorage.getItem('theme') || 'dark';
  if (t === 'dark') document.documentElement.classList.add('dark');
} catch (e) {
  document.documentElement.classList.add('dark');
}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <div className="flex min-h-screen flex-col lg:flex-row">
          <Sidebar />
          <main className="min-w-0 flex-1">
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
