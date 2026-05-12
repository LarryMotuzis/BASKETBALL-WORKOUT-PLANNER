import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";

export default async function HomePage() {
  const session = await auth();
  const userId = session?.user?.id;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const [playerCount, workoutCount, drillCount, thisWeekCount, recentWorkouts] =
    await Promise.all([
      prisma.player.count({ where: { userId } }),
      prisma.workout.count({ where: { userId } }),
      prisma.drill.count({ where: { userId } }),
      prisma.workout.count({ where: { userId, workoutDate: { gte: oneWeekAgo } } }),
      prisma.workout.findMany({
        where: { userId },
        include: {
          workoutPlayers: { include: { player: { select: { firstName: true, lastName: true } } } },
        },
        orderBy: { workoutDate: "desc" },
        take: 4,
      }),
    ]);

  const stats = [
    { value: String(playerCount), label: "Players" },
    { value: String(workoutCount), label: "Workouts" },
    { value: String(drillCount), label: "Drills" },
    { value: String(thisWeekCount), label: "This week" },
  ];

  return (
    <main className="min-h-screen bg-[#0a0e1a] p-4 sm:p-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
        <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <rect x="60" y="40" width="1080" height="720" rx="8" fill="none" stroke="white" strokeWidth="2" />
          <circle cx="600" cy="400" r="90" fill="none" stroke="white" strokeWidth="2" />
          <line x1="600" y1="40" x2="600" y2="760" stroke="white" strokeWidth="1.5" />
          <rect x="60" y="240" width="200" height="320" fill="none" stroke="white" strokeWidth="1.5" />
          <rect x="940" y="240" width="200" height="320" fill="none" stroke="white" strokeWidth="1.5" />
          <path d="M 260 240 Q 290 400 260 560" fill="none" stroke="white" strokeWidth="1.5" />
          <path d="M 940 240 Q 910 400 940 560" fill="none" stroke="white" strokeWidth="1.5" />
          <circle cx="600" cy="400" r="6" fill="white" />
          <circle cx="180" cy="400" r="45" fill="none" stroke="white" strokeWidth="1.5" />
          <circle cx="1020" cy="400" r="45" fill="none" stroke="white" strokeWidth="1.5" />
        </svg>
      </div>

      <section className="relative mx-auto max-w-5xl">
        <div className="mb-8">
          <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-orange-400 bg-orange-400/10 border border-orange-400/25 px-3 py-1 rounded mb-4">
            Season 2025–26
          </span>
          <h1
            className="text-6xl font-black uppercase leading-none tracking-tight text-slate-100"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Basketball<br />
            <span className="text-orange-400">Workout</span><br />
            Planner
          </h1>
          <p className="mt-4 text-slate-400 font-light max-w-md leading-relaxed">
            Plan workouts, assign them to players, and track development over time.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center sm:gap-6 gap-4 mb-8">
          {stats.map((stat, i, arr) => (
            <div key={stat.label} className="flex items-center gap-6">
              <div>
                <p className="text-3xl font-bold text-slate-100 leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {stat.value}
                </p>
                <p className="text-[11px] uppercase tracking-widest text-slate-500 font-medium mt-1">
                  {stat.label}
                </p>
              </div>
              {i < arr.length - 1 && <div className="w-px h-8 bg-white/10 hidden sm:block" />}
            </div>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-3 mb-8">
          <Link href="/players" className="group relative rounded-xl bg-white/4 border border-white/8 p-5 hover:bg-white/[0.07] hover:border-white/15 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500" />
            <div className="w-9 h-9 rounded-lg bg-blue-500/15 flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h2 className="text-lg font-bold uppercase tracking-wide text-slate-100 mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Players</h2>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">Manage player profiles, positions, and individual development goals.</p>
            <span className="text-xs font-medium text-blue-400 flex items-center gap-1 group-hover:gap-2 transition-all">
              View roster
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </span>
          </Link>

          <Link href="/workouts" className="group relative rounded-xl bg-white/4 border border-white/8 p-5 hover:bg-white/[0.07] hover:border-white/15 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-orange-500" />
            <div className="w-9 h-9 rounded-lg bg-orange-500/15 flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h2 className="text-lg font-bold uppercase tracking-wide text-slate-100 mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Workouts</h2>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">Build workouts by date, focus area, and drill sequence.</p>
            <span className="text-xs font-medium text-orange-400 flex items-center gap-1 group-hover:gap-2 transition-all">
              View schedule
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </span>
          </Link>

          <Link href="/drills" className="group relative rounded-xl bg-white/4 border border-white/8 p-5 hover:bg-white/[0.07] hover:border-white/15 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-green-500" />
            <div className="w-9 h-9 rounded-lg bg-green-500/15 flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <h2 className="text-lg font-bold uppercase tracking-wide text-slate-100 mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Drills</h2>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">Browse and manage your drill library by skill category.</p>
            <span className="text-xs font-medium text-green-400 flex items-center gap-1 group-hover:gap-2 transition-all">
              View drills
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-10">
          <Link href="/workouts" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-sm font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg transition-all duration-150" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
            New workout
          </Link>
          <Link href="/players" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-100 border border-white/10 hover:border-white/25 text-sm font-semibold uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all duration-150" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Add player
          </Link>
        </div>

        {recentWorkouts.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Recent Activity</h2>
            <div className="space-y-2">
              {recentWorkouts.map((workout) => (
                <div key={workout.id} className="flex items-center justify-between rounded-xl bg-white/4 border border-white/8 px-5 py-3.5 hover:bg-white/[0.07] transition-colors">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="shrink-0 text-center">
                      <p className="text-lg font-bold text-slate-100 leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                        {workout.workoutDate.toLocaleDateString("en-US", { day: "numeric" })}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500">
                        {workout.workoutDate.toLocaleDateString("en-US", { month: "short" })}
                      </p>
                    </div>
                    <div className="w-px h-8 bg-white/8 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-100 truncate">{workout.title}</p>
                      {workout.workoutPlayers.length > 0 && (
                        <p className="text-xs text-slate-500 truncate">
                          {workout.workoutPlayers.map((wp) => `${wp.player.firstName} ${wp.player.lastName}`).join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="shrink-0 ml-4 rounded-full bg-orange-500/15 text-orange-400 px-3 py-1 text-xs font-medium">
                    {workout.focus}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
