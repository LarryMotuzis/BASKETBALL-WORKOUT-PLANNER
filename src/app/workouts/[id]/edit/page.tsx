import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateWorkout } from "@/actions/workout-actions";
import { SubmitButton } from "@/app/components/SubmitButton";
import { WorkoutDrillPicker } from "../../WorkoutDrillPicker";

const inputClass =
  "rounded-lg bg-white/5 border border-white/10 p-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50";

export default async function EditWorkoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const [workout, players, drills] = await Promise.all([
    prisma.workout.findUnique({
      where: { id, userId: session?.user?.id },
      include: {
        workoutPlayers: true,
        workoutDrills: {
          include: { drill: true },
          orderBy: { order: "asc" },
        },
      },
    }),
    prisma.player.findMany({
      where: { userId: session?.user?.id },
      orderBy: { firstName: "asc" },
    }),
    prisma.drill.findMany({
      where: { userId: session?.user?.id },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!workout) notFound();

  const assignedPlayerIds = new Set(workout.workoutPlayers.map((wp) => wp.playerId));
  const defaultDrills = workout.workoutDrills.map((wd) => ({
    id: wd.drill.id,
    name: wd.drill.name,
    category: wd.drill.category,
    duration: wd.duration,
    sets: wd.sets,
  }));

  const updateWithId = updateWorkout.bind(null, id);
  const dateValue = workout.workoutDate.toISOString().slice(0, 10);

  return (
    <main className="min-h-screen bg-[#0a0e1a] p-6">
      <section className="mx-auto max-w-4xl">
        <Link
          href="/workouts"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          All Workouts
        </Link>

        <h1
          className="text-4xl font-black uppercase tracking-tight text-slate-100 mb-8"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Edit Workout
        </h1>

        <div className="rounded-xl bg-white/4 border border-white/8 p-6">
          <form action={updateWithId} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                name="title"
                defaultValue={workout.title}
                placeholder="Workout Title"
                required
                className={inputClass}
              />
              <input
                type="text"
                name="focus"
                defaultValue={workout.focus}
                placeholder="Focus Area"
                required
                className={inputClass}
              />
            </div>

            <input
              type="date"
              name="workoutDate"
              defaultValue={dateValue}
              required
              className={inputClass}
            />

            <div>
              <h3 className="text-sm font-medium text-slate-300 mb-3">Players</h3>
              {players.length === 0 ? (
                <p className="text-sm text-slate-500">No players yet.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {players.map((player) => (
                    <label
                      key={player.id}
                      className="flex items-center gap-3 rounded-lg border border-white/8 p-3 cursor-pointer hover:border-white/15 transition-colors"
                    >
                      <input
                        type="checkbox"
                        name="playerIds"
                        value={player.id}
                        defaultChecked={assignedPlayerIds.has(player.id)}
                        className="accent-orange-500"
                      />
                      <span className="text-sm text-slate-200">
                        {player.firstName} {player.lastName}
                        {player.position && (
                          <span className="ml-1 text-slate-500">· {player.position}</span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-300 mb-3">Drills</h3>
              <WorkoutDrillPicker drills={drills} defaultDrills={defaultDrills} />
            </div>

            <textarea
              name="notes"
              defaultValue={workout.notes ?? ""}
              placeholder="Workout notes (optional)"
              className={`min-h-24 w-full ${inputClass}`}
            />

            <div className="flex gap-3">
              <SubmitButton label="Save changes" pendingLabel="Saving..." />
              <Link
                href="/workouts"
                className="rounded-lg border border-white/10 px-5 py-3 text-sm text-slate-400 hover:text-slate-200 hover:border-white/20 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
