import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/auth";
import { createPlayer, deletePlayer } from "@/actions/player-actions";
import { SubmitButton } from "@/app/components/SubmitButton";
import { DeleteButton } from "@/app/components/DeleteButton";

const inputClass =
  "rounded-lg bg-white/5 border border-white/10 p-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50";

export default async function PlayersPage() {
  const session = await auth();
  const players = await prisma.player.findMany({
    where: { userId: session?.user?.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-[#0a0e1a] p-8">
      <section className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-black uppercase tracking-tight text-slate-100" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          Players
        </h1>
        <p className="mt-2 text-slate-400">Create and manage player profiles.</p>

        <div className="mt-8 rounded-xl bg-white/4 border border-white/8 p-6">
          <h2 className="text-xl font-semibold text-slate-100">Add Player</h2>
          <form action={createPlayer} className="mt-4 grid gap-4 md:grid-cols-3">
            <input type="text" name="firstName" placeholder="First Name" className={inputClass} required />
            <input type="text" name="lastName" placeholder="Last Name" className={inputClass} required />
            <input type="text" name="position" placeholder="Position (optional)" className={inputClass} />
            <SubmitButton label="Add Player" pendingLabel="Adding..." />
          </form>
        </div>

        <div className="mt-8 rounded-xl bg-white/4 border border-white/8 p-6">
          <h2 className="text-xl font-semibold text-slate-100">
            Roster <span className="text-sm font-normal text-slate-500">({players.length})</span>
          </h2>
          <div className="mt-4 space-y-3">
            {players.length === 0 ? (
              <p className="text-sm text-slate-500">No players yet.</p>
            ) : (
              players.map((player) => (
                <div key={player.id} className="flex items-center justify-between rounded-lg border border-white/8 p-4">
                  <div>
                    <Link href={`/players/${player.id}`} className="font-medium text-slate-100 hover:text-orange-400 transition-colors">
                      {player.firstName} {player.lastName}
                    </Link>
                    <p className="text-sm text-slate-500">{player.position || "No position listed"}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link href={`/players/${player.id}`} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                      View profile →
                    </Link>
                    <DeleteButton action={deletePlayer.bind(null, player.id)} label="Remove" successMessage="Player removed" />
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
