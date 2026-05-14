"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES, PERSONNEL, CONCEPTS } from "./drill-constants";

export { CATEGORIES, PERSONNEL, CONCEPTS };

interface Props {
  activeCategory: string | null;
  activePersonnel: string | null;
  activeConcept: string | null;
}

function FilterRow({
  label,
  items,
  activeKey,
  paramKey,
}: {
  label: string;
  items: string[];
  activeKey: string | null;
  paramKey: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function select(value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(paramKey, value);
    } else {
      params.delete(paramKey);
    }
    router.push(`/drills?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider w-20 shrink-0">
        {label}
      </span>
      <button
        onClick={() => select(null)}
        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
          !activeKey
            ? "bg-orange-500 text-white"
            : "bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20"
        }`}
      >
        All
      </button>
      {items.map((item) => (
        <button
          key={item}
          onClick={() => select(item)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            activeKey === item
              ? "bg-orange-500 text-white"
              : "bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export function DrillFilters({ activeCategory, activePersonnel, activeConcept }: Props) {
  return (
    <div className="space-y-2">
      <FilterRow label="Skill" items={CATEGORIES} activeKey={activeCategory} paramKey="category" />
      <FilterRow label="Format" items={PERSONNEL} activeKey={activePersonnel} paramKey="personnel" />
      <FilterRow label="Concept" items={CONCEPTS} activeKey={activeConcept} paramKey="concept" />
    </div>
  );
}
