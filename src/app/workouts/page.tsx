import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { createWorkout, deleteWorkout } from "@/actions/workout-actions";
import { SubmitButton } from "@/app/components/SubmitButton";
import { DeleteButton } from "@/app/components/DeleteButton";

const inputClass =
  "rounded-lg bg-white/5 border border-white/10 p-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50";

export default async function WorkoutsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [players, drills, workouts] = await Promise.all([
    prisma.player.findMany({ where: { userId }, orderBy: { firstName: "asc" } }),
    prisma.drill.findMany({ where: { userId }, orderBy: { name: "asc" } }),
    prisma.workout.findMany({
      where: { userId },
      include: {
        workoutPlayers: { include: { player: true } },
        workoutDrills: { include: { drill: true }, orderBy: { order: "asc" } },
      },
      orderBy: { workoutDate: "desc" },
    }),
  ]);

  return (
    <main className="min-h-screen bg-[#0a0e1a] p-8">
      <section className="mx-auto max-w-6xl">
        <h1
          className="text-4xl font-black uppercase tracking-tight text-slate-100"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Workouts
        </h1>
        <p className="mt-2 text-slate-400">
          Create workouts and assign drills to players.
        </p>

        <div className="mt-8 rounded-xl bg-white/4 border border-white/8 p-6">
          <h2 className="text-xl font-semibold text-slate-100">
            Create Workout
          </h2>

          <form action={createWorkout} className="mt-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                name="title"
                placeholder="Workout Title"
                className={inputClass}
                required
              />
              <input
                type="text"
                name="focus"
                placeholder="Focus Area (e.g. Shooting)"
                className={inputClass}
                required
              />
            </div>

            <input
              type="date"
              name="workoutDate"
              className={inputClass}
              required
            />

            <div>
              <h3 className="text-sm font-medium text-slate-300 mb-3">
                Players
              </h3>
              {players.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No players yet — add some first.
                </p>
              ) : (
                <div className="grid gap-3 md:grid-cols-3">
                  {players.map((player) => (
                    <label
                      key={player.id}
                      className="flex items-center gap-3 rounded-lg border border-white/8 p-3 cursor-pointer hover:border-white/15 transition-colors"
                    >
                      <input
                        type="checkbox"
                        name="playerIds"
                        value={player.id}
                        className="accent-orange-500"
                      />
                      <span className="text-sm text-slate-200">
                        {player.firstName} {player.lastName}
                        {player.position && (
                          <span className="ml-1 text-slate-500">
                            · {player.position}
                          </span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-300 mb-3">
                Drills
              </h3>
              {drills.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No drills yet — add some first.
                </p>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {drills.map((drill) => (
                    <label
                      key={drill.id}
                      className="flex items-center gap-3 rounded-lg border border-white/8 p-3 cursor-pointer hover:border-white/15 transition-colors"
                    >
                      <input
                        type="checkbox"
                        name="drillIds"
                        value={drill.id}
                        className="accent-orange-500"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-200">
                          {drill.name}
                        </p>
                        <p className="text-xs text-slate-500">{drill.category}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <textarea
              name="notes"
              placeholder="Workout notes (optional)"
              className={`min-h-24 w-full ${inputClass}`}
            />

            <SubmitButton label="Create Workout" pendingLabel="Creating..." />
          </form>
        </div>

        <div className="mt-8 rounded-xl bg-white/4 border border-white/8 p-6">
          <h2 className="text-xl font-semibold text-slate-100">
            Workout History{" "}
            <span className="text-sm font-normal text-slate-500">
              ({workouts.length})
            </span>
          </h2>

          <div className="mt-4 space-y-4">
            {workouts.length === 0 ? (
              <p className="text-sm text-slate-500">No workouts yet.</p>
            ) : (
              workouts.map((workout) => (
                <div
                  key={workout.id}
                  className="rounded-lg border border-white/8 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-100">
                        {workout.title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {new Date(workout.workoutDate).toLocaleDateString(
                          "en-US",
                          { month: "long", day: "numeric", year: "numeric" }
                        )}
                        {workout.workoutPlayers.length > 0 && (
                          <>
                            {" · "}
                            {workout.workoutPlayers
                              .map(
                                (wp) =>
                                  `${wp.player.firstName} ${wp.player.lastName}`
                              )
                              .join(", ")}
                          </>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="rounded-full bg-orange-500/15 text-orange-400 px-3 py-1 text-xs font-medium">
                        {workout.focus}
                      </span>
                      <DeleteButton
                        action={deleteWorkout.bind(null, workout.id)}
                        successMessage="Workout deleted"
                      />
                    </div>
                  </div>

                  {workout.workoutDrills.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-2">
                        Drills
                      </p>
                      <ul className="space-y-1">
                        {workout.workoutDrills.map((item) => (
                          <li
                            key={item.id}
                            className="text-sm text-slate-300 flex items-center gap-2"
                          >
                            <span className="text-slate-600 w-4 text-right">
                              {item.order}.
                            </span>
                            {item.drill.name}
                            <span className="text-slate-600 text-xs">
                              {item.drill.category}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {workout.notes && (
                    <div className="mt-4 border-t border-white/5 pt-4">
                      <p className="text-sm text-slate-400">{workout.notes}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
