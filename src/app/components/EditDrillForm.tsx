"use client";

import { useState } from "react";
import { updateDrill } from "@/actions/drill-actions";
import { CATEGORIES, PERSONNEL, CONCEPTS } from "@/app/drills/DrillCategoryFilter";

interface Drill {
  id: string;
  name: string;
  category: string;
  personnel: string | null;
  concept: string | null;
  description: string | null;
}

const inputClass =
  "rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50 w-full";

const selectClass =
  "rounded-lg bg-[#0d1117] border border-white/10 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-orange-500/50 w-full";

export function EditDrillForm({ drill }: { drill: Drill }) {
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
        await updateDrill(drill.id, formData);
        setEditing(false);
      }}
      className="mt-3 space-y-2"
    >
      <div className="grid gap-2 sm:grid-cols-2">
        <input
          type="text"
          name="name"
          defaultValue={drill.name}
          placeholder="Drill Name"
          required
          className={inputClass}
        />
        <select name="category" defaultValue={drill.category} required className={selectClass}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <select name="personnel" defaultValue={drill.personnel ?? ""} className={selectClass}>
          <option value="">Format (optional)</option>
          {PERSONNEL.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select name="concept" defaultValue={drill.concept ?? ""} className={selectClass}>
          <option value="">Concept (optional)</option>
          {CONCEPTS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <textarea
        name="description"
        defaultValue={drill.description ?? ""}
        placeholder="Description (optional)"
        rows={2}
        className={inputClass}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors px-3 py-1.5 rounded border border-orange-500/30 hover:border-orange-500/60"
        >
          Save changes
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors px-3 py-1.5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
