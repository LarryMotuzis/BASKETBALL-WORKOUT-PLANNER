import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChartsSection } from "./ChartsSection";

function getWeekStart(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d.getTime();
}

function getCurrentStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;
  const weeks = new Set(dates.map((d) => getWeekStart(d)));
  let streak = 0;
  let week = getWeekStart(new Date());
  while (weeks.has(week)) {
    streak++;
    week -= 7 * 24 * 60 * 60 * 1000;
  }
  return streak;
}

export default async function PlayerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const [player, workouts, totalUserWorkouts] = await Promise.all([
    prisma.player.findUnique({ where: { id, userId: session?.user?.id } }),
    prisma.workout.findMany({
      where: { workoutPlayers: { some: { playerId: id } } },
      include: { workoutDrills: { include: { drill: true } } },
      orderBy: { workoutDate: "desc" },
    }),
    prisma.workout.count({ where: { userId: session?.user?.id } }),
  ]);

  if (!player) notFound();

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
      categoryCounts[wd.drill.category] = (categoryCounts[wd.drill.category] ?? 0) + 1;
    }
  }
  const drillsChartData = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));

  // Top drills by frequency
  const drillCounts: Record<string, { name: string; count: number }> = {};
  for (const w of workouts) {
    for (const wd of w.workoutDrills) {
      const key = wd.drill.id;
      if (!drillCounts[key]) drillCounts[key] = { name: wd.drill.name, count: 0 };
      drillCounts[key].count++;
    }
  }
  const topDrills = Object.values(drillCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const maxDrillCount = topDrills[0]?.count ?? 1;

  const totalDrillReps = workouts.reduce((sum, w) => sum + w.workoutDrills.length, 0);
  const lastSession = workouts[0]?.workoutDate;
  const attendanceRate = totalUserWorkouts > 0 ? Math.round((workouts.length / totalUserWorkouts) * 100) : 0;
  const currentStreak = getCurrentStreak(workouts.map((w) => w.workoutDate));

  const stats = [
    { label: "Workouts", value: String(workouts.length) },
    { label: "Attendance", value: `${attendanceRate}%` },
    { label: "Week Streak", value: String(currentStreak) },
    {
      label: "Last Session",
      value: lastSession
        ? lastSession.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        : "—",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0a0e1a] p-4 sm:p-8">
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl bg-white/4 border border-white/8 p-5">
              <p className="text-3xl font-bold text-slate-100" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                {stat.value}
              </p>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Attendance progress bar */}
        {totalUserWorkouts > 0 && (
          <div className="rounded-xl bg-white/4 border border-white/8 p-5 mb-8">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-300">Attendance Rate</p>
              <p className="text-sm font-bold text-slate-100">{workouts.length} / {totalUserWorkouts} sessions</p>
            </div>
            <div className="h-2 rounded-full bg-white/8 overflow-hidden">
              <div
                className="h-full rounded-full bg-orange-500 transition-all duration-500"
                style={{ width: `${attendanceRate}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {attendanceRate >= 80
                ? "Excellent attendance"
                : attendanceRate >= 60
                ? "Good attendance"
                : attendanceRate >= 40
                ? "Moderate attendance"
                : "Needs improvement"}
            </p>
          </div>
        )}

        <ChartsSection
          workoutsChartData={workoutsChartData}
          drillsChartData={drillsChartData}
          hasWorkouts={workouts.length > 0}
        />

        {topDrills.length > 0 && (
          <div className="rounded-xl bg-white/4 border border-white/8 p-6 mt-6">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Top Drills</h2>
            <div className="space-y-3">
              {topDrills.map((drill) => (
                <div key={drill.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-slate-200">{drill.name}</span>
                    <span className="text-xs text-slate-500">{drill.count}×</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-orange-500/60"
                      style={{ width: `${Math.round((drill.count / maxDrillCount) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-600">{totalDrillReps} total drill reps across all sessions</p>
          </div>
        )}

        <div className="rounded-xl bg-white/4 border border-white/8 p-6 mt-6">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">Session History</h2>
          {workouts.length === 0 ? (
            <p className="text-sm text-slate-500">No sessions yet.</p>
          ) : (
            <div className="space-y-3">
              {workouts.map((workout) => (
                <div key={workout.id} className="flex items-start justify-between rounded-lg border border-white/8 p-4 gap-4">
                  <div>
                    <p className="font-medium text-slate-100">
                      {workout.workoutDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                    <p className="text-xs text-orange-400 mt-0.5">{workout.focus}</p>
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
