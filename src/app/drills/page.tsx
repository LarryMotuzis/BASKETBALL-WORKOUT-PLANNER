import { prisma } from "@/lib/prisma";
import { createDrill } from "@/actions/drill-actions";

export default async function DrillsPage() {
  const drills = await prisma.drill.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <section className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-900">Drills</h1>

        <p className="mt-2 text-gray-600">
          Build a reusable library of player development drills.
        </p>

        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Create Drill</h2>

          <form action={createDrill} className="mt-4 grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                name="name"
                placeholder="Drill Name"
                className="rounded-lg border border-gray-300 p-3 text-gray-900 placeholder:text-gray-400"
                required
              />

              <select
                name="category"
                className="rounded-lg border border-gray-300 p-3 text-gray-900"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option value="Shooting">Shooting</option>
                <option value="Finishing">Finishing</option>
                <option value="Ball Handling">Ball Handling</option>
                <option value="Footwork">Footwork</option>
                <option value="Passing">Passing</option>
                <option value="Defense">Defense</option>
                <option value="Conditioning">Conditioning</option>
              </select>
            </div>

            <textarea
              name="description"
              placeholder="Description / coaching points"
              className="min-h-28 rounded-lg border border-gray-300 p-3 text-gray-900 placeholder:text-gray-400"
            />

            <button
              type="submit"
              className="w-fit rounded-lg bg-black px-5 py-3 text-white"
            >
              Create Drill
            </button>
          </form>
        </div>

        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Drill Library</h2>

          <div className="mt-4 space-y-3">
            {drills.length === 0 ? (
              <p className="text-sm text-gray-500">No drills yet.</p>
            ) : (
              drills.map((drill) => (
                <div
                  key={drill.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-gray-900">{drill.name}</p>

                      {drill.description && (
                        <p className="mt-2 text-sm text-gray-600">
                          {drill.description}
                        </p>
                      )}
                    </div>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {drill.category}
                    </span>
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