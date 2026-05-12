"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createAccount } from "@/actions/auth-actions";

export default function SignUpPage() {
  const [error, formAction, pending] = useActionState(createAccount, undefined);

  return (
    <main className="min-h-screen bg-[#0a0e1a] flex items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-black uppercase tracking-tight text-slate-100"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Basketball
            <br />
            <span className="text-orange-400">Workout</span>
            <br />
            Planner
          </h1>
          <p className="mt-3 text-slate-400 text-sm">Create your account</p>
        </div>

        <div className="rounded-xl bg-white/4 border border-white/8 p-6">
          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/25 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form action={formAction} className="space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50"
            />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50"
            />
            <input
              type="password"
              name="password"
              placeholder="Password (min. 8 characters)"
              required
              minLength={8}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50"
            />
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-60 px-5 py-3 text-white font-semibold transition-colors"
            >
              {pending ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-orange-400 hover:text-orange-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
