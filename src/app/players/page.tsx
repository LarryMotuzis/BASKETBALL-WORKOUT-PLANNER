import { prisma } from "@/lib/prisma";
import { createPlayer } from "@/actions/player-actions";

export default async function PlayersPage() {
  const players = await prisma.player.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <section className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-900">Players</h1>

        <p className="mt-2 text-gray-600">Create and manage player profiles.</p>
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Create Player</h2>

          <form
            action={createPlayer}
            className="mt-4 grid gap-4 md:grid-cols-3"
          >
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="rounded-lg border border-gray-300 p-3"
              required
            />

            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="rounded-lg border border-gray-300 p-3"
              required
            />

            <input
              type="text"
              name="position"
              placeholder="Position"
              className="rounded-lg border border-gray-300 p-3"
            />

            <button
              type="submit"
              className="rounded-lg bg-black px-4 py-3 text-white"
            >
              Create Player
            </button>
          </form>
        </div>
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Player List</h2>

          <div className="mt-4 space-y-3">
            {players.length === 0 ? (
              <p className="text-sm text-gray-500">No players yet.</p>
            ) : (
              players.map((player) => (
                <div
                  key={player.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <p className="font-medium">
                    {player.firstName} {player.lastName}
                  </p>

                  <p className="text-sm text-gray-500">
                    {player.position || "No position listed"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
