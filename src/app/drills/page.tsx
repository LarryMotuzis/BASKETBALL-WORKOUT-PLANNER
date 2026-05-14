import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { createDrill, deleteDrill } from "@/actions/drill-actions";
import { SubmitButton } from "@/app/components/SubmitButton";
import { DeleteButton } from "@/app/components/DeleteButton";
import { EditDrillForm } from "@/app/components/EditDrillForm";
import { DrillFilters, CATEGORIES, PERSONNEL, CONCEPTS } from "./DrillCategoryFilter";
import { Suspense } from "react";

const inputClass =
  "rounded-lg bg-white/5 border border-white/10 p-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50";

const selectClass =
  "rounded-lg bg-[#0d1117] border border-white/10 p-3 text-slate-100 focus:outline-none focus:border-orange-500/50";

const categoryColors: Record<string, string> = {
  Shooting: "bg-orange-500/15 text-orange-400",
  Finishing: "bg-red-500/15 text-red-400",
  "Ball Handling": "bg-yellow-500/15 text-yellow-400",
  Footwork: "bg-blue-500/15 text-blue-400",
  Passing: "bg-green-500/15 text-green-400",
  Defense: "bg-purple-500/15 text-purple-400",
  Conditioning: "bg-pink-500/15 text-pink-400",
};

const personnelColors: Record<string, string> = {
  "1-on-0": "bg-cyan-500/15 text-cyan-400",
  "1-on-1": "bg-cyan-500/15 text-cyan-400",
  "2-on-1": "bg-teal-500/15 text-teal-400",
  "2-on-2": "bg-teal-500/15 text-teal-400",
  "3-on-2": "bg-sky-500/15 text-sky-400",
  "3-on-3": "bg-sky-500/15 text-sky-400",
  "5-on-5": "bg-indigo-500/15 text-indigo-400",
  Team: "bg-indigo-500/15 text-indigo-400",
};

const conceptColors: Record<string, string> = {
  "Ball Screen Read": "bg-amber-500/15 text-amber-400",
  "DHO Read": "bg-amber-500/15 text-amber-400",
  Transition: "bg-lime-500/15 text-lime-400",
  "Backdoor Cut": "bg-violet-500/15 text-violet-400",
  "Post Play": "bg-rose-500/15 text-rose-400",
  "Drive & Kick": "bg-orange-500/15 text-orange-300",
  Closeout: "bg-purple-500/15 text-purple-300",
  "Pick & Pop": "bg-amber-500/15 text-amber-300",
  Iso: "bg-red-500/15 text-red-300",
  "Off-Ball Movement": "bg-emerald-500/15 text-emerald-400",
};

export default async function DrillsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();
  const params = await searchParams;

  const activeCategory = typeof params.category === "string" ? params.category : null;
  const activePersonnel = typeof params.personnel === "string" ? params.personnel : null;
  const activeConcept = typeof params.concept === "string" ? params.concept : null;

  const drills = await prisma.drill.findMany({
    where: {
      userId: session?.user?.id,
      ...(activeCategory ? { category: activeCategory } : {}),
      ...(activePersonnel ? { personnel: activePersonnel } : {}),
      ...(activeConcept ? { concept: activeConcept } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-[#0a0e1a] p-4 sm:p-8">
      <section className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-black uppercase tracking-tight text-slate-100" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          Drills
        </h1>
        <p className="mt-2 text-slate-400">Build a reusable library of player development drills.</p>

        <div className="mt-8 rounded-xl bg-white/4 border border-white/8 p-6">
          <h2 className="text-xl font-semibold text-slate-100">Create Drill</h2>
          <form action={createDrill} className="mt-4 grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input type="text" name="name" placeholder="Drill Name" className={inputClass} required />
              <select name="category" className={selectClass} required defaultValue="">
                <option value="" disabled>Skill Category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <select name="personnel" className={selectClass} defaultValue="">
                <option value="">Format (optional)</option>
                {PERSONNEL.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <select name="concept" className={selectClass} defaultValue="">
                <option value="">Concept (optional)</option>
                {CONCEPTS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <textarea name="description" placeholder="Description / coaching points" className={`min-h-28 ${inputClass}`} />
            <SubmitButton label="Create Drill" pendingLabel="Creating..." />
          </form>
        </div>

        <div className="mt-8 rounded-xl bg-white/4 border border-white/8 p-6">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-100">
                Drill Library <span className="text-sm font-normal text-slate-500">({drills.length})</span>
              </h2>
            </div>
            <Suspense>
              <DrillFilters
                activeCategory={activeCategory}
                activePersonnel={activePersonnel}
                activeConcept={activeConcept}
              />
            </Suspense>
          </div>
          <div className="space-y-3">
            {drills.length === 0 ? (
              <p className="text-sm text-slate-500">No drills match the selected filters.</p>
            ) : (
              drills.map((drill) => (
                <div key={drill.id} className="rounded-lg border border-white/8 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-100">{drill.name}</p>
                      {drill.description && (
                        <p className="mt-1 text-sm text-slate-400">{drill.description}</p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[drill.category] ?? "bg-white/10 text-slate-400"}`}>
                          {drill.category}
                        </span>
                        {drill.personnel && (
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${personnelColors[drill.personnel] ?? "bg-white/10 text-slate-400"}`}>
                            {drill.personnel}
                          </span>
                        )}
                        {drill.concept && (
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${conceptColors[drill.concept] ?? "bg-white/10 text-slate-400"}`}>
                            {drill.concept}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <EditDrillForm drill={drill} />
                      <DeleteButton action={deleteDrill.bind(null, drill.id)} successMessage="Drill deleted" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
