"use client";

import { useState } from "react";
import { updatePlayer } from "@/actions/player-actions";

interface Player {
  id: string;
  firstName: string;
  lastName: string;
  position: string | null;
}

const inputClass =
  "rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50 w-full";

export function EditPlayerForm({ player }: { player: Player }) {
  const [editing, setEditing] = useState(false);

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
      >
        Edit
      </button>
    );
  }

  return (
    <form
      action={async (formData) => {
        await updatePlayer(player.id, formData);
        setEditing(false);
      }}
      className="flex items-center gap-2 flex-wrap"
    >
      <input
        type="text"
        name="firstName"
        defaultValue={player.firstName}
        placeholder="First Name"
        required
        className={inputClass}
        style={{ width: "120px" }}
      />
      <input
        type="text"
        name="lastName"
        defaultValue={player.lastName}
        placeholder="Last Name"
        required
        className={inputClass}
        style={{ width: "120px" }}
      />
      <input
        type="text"
        name="position"
        defaultValue={player.position ?? ""}
        placeholder="Position"
        className={inputClass}
        style={{ width: "100px" }}
      />
      <button
        type="submit"
        className="text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors px-2 py-1"
      >
        Save
      </button>
      <button
        type="button"
        onClick={() => setEditing(false)}
        className="text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-1"
      >
        Cancel
      </button>
    </form>
  );
}
