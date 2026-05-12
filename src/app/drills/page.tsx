import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { createDrill, deleteDrill } from "@/actions/drill-actions";
import { SubmitButton } from "@/app/components/SubmitButton";
import { DeleteButton } from "@/app/components/DeleteButton";
import { EditDrillForm } from "@/app/components/EditDrillForm";

const inputClass =
  "rounded-lg bg-white/5 border border-white/10 p-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50";

const categoryColors: Record<string, string> = {
  Shooting: "bg-orange-500/15 text-orange-400",
  Finishing: "bg-red-500/15 text-red-400",
  "Ball Handling": "bg-yellow-500/15 text-yellow-400",
  Footwork: "bg-blue-500/15 text-blue-400",
  Passing: "bg-green-500/15 text-green-400",
  Defense: "bg-purple-500/15 text-purple-400",
  Conditioning: "bg-pink-500/15 text-pink-400",
};

export default async function DrillsPage() {
  const session = await auth();
  const drills = await prisma.drill.findMany({
    where: { userId: session?.user?.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-[#0a0e1a] p-8">
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
              <select name="category" className="rounded-lg bg-[#0d1117] border border-white/10 p-3 text-slate-100 focus:outline-none focus:border-orange-500/50" required defaultValue="">
                <option value="" disabled>Select Category</option>
                <option value="Shooting">Shooting</option>
                <option value="Finishing">Finishing</option>
                <option value="Ball Handling">Ball Handling</option>
                <option value="Footwork">Footwork</option>
                <option value="Passing">Passing</option>
                <option value="Defense">Defense</option>
                <option value="Conditioning">Conditioning</option>
              </select>
            </div>
            <textarea name="description" placeholder="Description / coaching points" className={`min-h-28 ${inputClass}`} />
            <SubmitButton label="Create Drill" pendingLabel="Creating..." />
          </form>
        </div>

        <div className="mt-8 rounded-xl bg-white/4 border border-white/8 p-6">
          <h2 className="text-xl font-semibold text-slate-100">
            Drill Library <span className="text-sm font-normal text-slate-500">({drills.length})</span>
          </h2>
          <div className="mt-4 space-y-3">
            {drills.length === 0 ? (
              <p className="text-sm text-slate-500">No drills yet.</p>
            ) : (
              drills.map((drill) => (
                <div key={drill.id} className="rounded-lg border border-white/8 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-slate-100">{drill.name}</p>
                      {drill.description && <p className="mt-1 text-sm text-slate-400">{drill.description}</p>}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${categoryColors[drill.category] ?? "bg-white/10 text-slate-400"}`}>
                        {drill.category}
                      </span>
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
