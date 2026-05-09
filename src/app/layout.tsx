import type { Metadata } from "next";
import Link from "next/link";
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
      <body>
        <nav className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
            <Link href="/" className="font-bold text-gray-900">
              Basketball Workout Planner
            </Link>

            <div className="flex gap-6 text-sm text-gray-600">
              <Link href="/players" className="hover:text-gray-900">
                Players
              </Link>
              <Link href="/drills" className="hover:text-gray-900">
                Drills
              </Link>
              <Link href="/workouts" className="hover:text-gray-900">
                Workouts
              </Link>
            </div>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}