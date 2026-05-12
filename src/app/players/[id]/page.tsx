import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";

const WorkoutsChart = dynamic(
  () => import("./WorkoutsChart").then((m) => m.WorkoutsChart),
  { ssr: false }
);
const DrillsChart = dynamic(
  () => import("./DrillsChart").then((m) => m.DrillsChart),
  { ssr: false }
);

export default async function PlayerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const player = await prisma.player.findUnique({ where: { id } });
  if (!player) notFound();

  const workouts = await prisma.workout.findMany({
    where: { workoutPlayers: { some: { playerId: id } } },
    include: { workoutDrills: { include: { drill: true } } },
    orderBy: { workoutDate: "desc" },
  });

  // Workouts per month (last 6 months)
  const now = new Date();
  const monthLabels = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleString("en-US", { month: "short" }),
      count: 0,
    };
  });
  for (const w of workouts) {
    const key = `${w.workoutDate.getFullYear()}-${String(w.workoutDate.getMonth() + 1).padStart(2, "0")}`;
    const slot = monthLabels.find((m) => m.key === key);
    if (slot) slot.count++;
  }
  const workoutsChartData = monthLabels.map(({ label, count }) => ({ month: label, count }));

  // Drill category breakdown
  const categoryCounts: Record<string, number> = {};
  for (const w of workouts) {
    for (const wd of w.workoutDrills) {
      const cat = wd.drill.category;
      categoryCounts[cat] = (categoryCounts[cat] ?? 0) + 1;
    }
  }
  const drillsChartData = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));

  const totalDrillReps = workouts.reduce((sum, w) => sum + w.workoutDrills.length, 0);
  const lastSession = workouts[0]?.workoutDate;

  return (
    <main className="min-h-screen bg-[#0a0e1a] p-8">
      <section className="mx-auto max-w-5xl">
        <Link href="/players" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          All Players
        </Link>

        <div className="flex items-start gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight text-slate-100" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              {player.firstName} {player.lastName}
            </h1>
            {player.position && (
              <span className="mt-1 inline-block text-xs font-bold tracking-widest uppercase text-orange-400 bg-orange-400/10 border border-orange-400/25 px-3 py-1 rounded">
                {player.position}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Workouts", value: workouts.length },
            { label: "Drill Reps", value: totalDrillReps },
            {
              label: "Last Session",
              value: lastSession
                ? lastSession.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                : "—",
            },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl bg-white/4 border border-white/8 p-5">
              <p className="text-3xl font-bold text-slate-100" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                {stat.value}
              </p>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <div className="rounded-xl bg-white/4 border border-white/8 p-6">
            <h2 className="text-sm font-semibold text-slate-300 mb-4">Workouts / Month</h2>
            {workouts.length === 0 ? (
              <p className="text-sm text-slate-500">No data yet.</p>
            ) : (
              <WorkoutsChart data={workoutsChartData} />
            )}
          </div>
          <div className="rounded-xl bg-white/4 border border-white/8 p-6">
            <h2 className="text-sm font-semibold text-slate-300 mb-4">Drill Categories</h2>
            {drillsChartData.length === 0 ? (
              <p className="text-sm text-slate-500">No drills logged yet.</p>
            ) : (
              <DrillsChart data={drillsChartData} />
            )}
          </div>
        </div>

        <div className="rounded-xl bg-white/4 border border-white/8 p-6">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">Session History</h2>
          {workouts.length === 0 ? (
            <p className="text-sm text-slate-500">No sessions yet.</p>
          ) : (
            <div className="space-y-3">
              {workouts.map((workout) => (
                <div key={workout.id} className="flex items-start justify-between rounded-lg border border-white/8 p-4 gap-4">
                  <div>
                    <p className="font-medium text-slate-100">{workout.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {workout.workoutDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                    {workout.workoutDrills.length > 0 && (
                      <p className="text-xs text-slate-500 mt-1">{workout.workoutDrills.map((wd) => wd.drill.name).join(" · ")}</p>
                    )}
                  </div>
                  <span className="shrink-0 rounded-full bg-orange-500/15 text-orange-400 px-3 py-1 text-xs font-medium">
                    {workout.focus}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
