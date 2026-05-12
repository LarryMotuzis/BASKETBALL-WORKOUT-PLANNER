"use client";

import { useState } from "react";
import { NavLink } from "./NavLink";

interface Props {
  userName: string | null;
  signOutAction: () => Promise<void>;
}

export function NavLinks({ userName, signOutAction }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-6">
        <NavLink href="/players">Players</NavLink>
        <NavLink href="/drills">Drills</NavLink>
        <NavLink href="/workouts">Workouts</NavLink>
        {userName && (
          <div className="flex items-center gap-3 border-l border-white/10 pl-6">
            <span className="text-sm text-slate-400 max-w-[140px] truncate">{userName}</span>
            <form action={signOutAction}>
              <button type="submit" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                Sign out
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden text-slate-400 hover:text-slate-100 transition-colors p-1"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        {open ? (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#0d1117] border-b border-white/[0.08] px-6 py-4 space-y-1 z-20">
          {[
            { href: "/players", label: "Players" },
            { href: "/drills", label: "Drills" },
            { href: "/workouts", label: "Workouts" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-sm font-medium text-slate-300 hover:text-slate-100 transition-colors"
            >
              {label}
            </a>
          ))}
          {userName && (
            <div className="pt-3 mt-3 border-t border-white/8 flex items-center justify-between">
              <span className="text-sm text-slate-500 truncate">{userName}</span>
              <form action={signOutAction}>
                <button type="submit" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
                  Sign out
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
}
