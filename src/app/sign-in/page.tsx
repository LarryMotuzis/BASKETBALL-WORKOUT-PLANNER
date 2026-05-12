"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signInWithCredentials } from "@/actions/auth-actions";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SignInForm() {
  const [error, formAction, pending] = useActionState(signInWithCredentials, undefined);
  const searchParams = useSearchParams();
  const authError = searchParams.get("error");

  const errorMessage =
    error ??
    (authError === "OAuthSignin" || authError === "OAuthCallback"
      ? "OAuth sign-in failed. Check your provider credentials."
      : null);

  return (
    <div className="rounded-xl bg-white/4 border border-white/8 p-6 space-y-4">
      {errorMessage && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/25 px-4 py-3 text-sm text-red-400">
          {errorMessage}
        </div>
      )}

      <form action={formAction} className="space-y-3">
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
          placeholder="Password"
          required
          className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50"
        />
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-60 px-5 py-3 text-white font-semibold transition-colors"
        >
          {pending ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500">
        No account?{" "}
        <Link href="/sign-up" className="text-orange-400 hover:text-orange-300 transition-colors">
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function SignInPage() {
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
          <p className="mt-3 text-slate-400 text-sm">Sign in to manage your team</p>
        </div>

        <Suspense>
          <SignInForm />
        </Suspense>
      </div>
    </main>
  );
}
