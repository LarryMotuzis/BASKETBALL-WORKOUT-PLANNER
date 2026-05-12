import type { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "sonner";
import { NavLink } from "./components/NavLink";
import "./globals.css";

export const metadata: Metadata = {
  title: "Basketball Workout Planner",
  description: "Plan workouts and track player development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0a0e1a] min-h-screen">
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#0d1117",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#f1f5f9",
            },
          }}
        />

        <nav className="border-b border-white/[0.08] bg-[#0d1117]/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
            <Link
              href="/"
              className="font-black uppercase tracking-tight text-slate-100"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Basketball Workout Planner
            </Link>

            <div className="flex gap-6">
              <NavLink href="/players">Players</NavLink>
              <NavLink href="/drills">Drills</NavLink>
              <NavLink href="/workouts">Workouts</NavLink>
            </div>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}
