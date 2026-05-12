"use client";

import { useRouter, useSearchParams } from "next/navigation";

const categories = [
  "Shooting",
  "Finishing",
  "Ball Handling",
  "Footwork",
  "Passing",
  "Defense",
  "Conditioning",
];

export function DrillCategoryFilter({ active }: { active: string | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function select(category: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    router.push(`/drills?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => select(null)}
        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
          !active
            ? "bg-orange-500 text-white"
            : "bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => select(cat)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            active === cat
              ? "bg-orange-500 text-white"
              : "bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
