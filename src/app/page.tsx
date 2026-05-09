export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <section className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-900">
          Basketball Workout Planner
        </h1>

        <p className="mt-3 text-gray-600">
          Plan workouts, assign them to players, and track development over time.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">Players</h2>
            <p className="mt-2 text-sm text-gray-600">
              Manage player profiles and development goals.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">Workouts</h2>
            <p className="mt-2 text-sm text-gray-600">
              Build workouts by date, focus area, and drill sequence.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">Progress</h2>
            <p className="mt-2 text-sm text-gray-600">
              Review notes, results, and improvement trends.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
