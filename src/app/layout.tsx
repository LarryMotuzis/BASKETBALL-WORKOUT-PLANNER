import type { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "sonner";
import { NavLinks } from "./components/NavLinks";
import { auth } from "@/auth";
import { signOutAction } from "@/actions/auth-actions";
import "./globals.css";

export const metadata: Metadata = {
  title: "Basketball Workout Planner",
  description: "Plan workouts and track player development.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const userName = session?.user?.name ?? session?.user?.email ?? null;

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

        <nav className="border-b border-white/8 bg-[#0d1117]/80 backdrop-blur-sm sticky top-0 z-10 isolate">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link
              href="/"
              className="font-black uppercase tracking-tight text-slate-100 shrink-0"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              <span className="hidden sm:inline">Basketball Workout Planner</span>
              <span className="sm:hidden">BWP</span>
            </Link>

            <NavLinks userName={userName} signOutAction={signOutAction} />
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}
