"use client";

import { useState, useRef, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Drill {
  id: string;
  name: string;
  category: string;
}

interface SelectedDrill extends Drill {
  duration: string;
  sets: string;
}

const categoryColors: Record<string, string> = {
  Shooting: "bg-orange-500/15 text-orange-400",
  Finishing: "bg-red-500/15 text-red-400",
  "Ball Handling": "bg-yellow-500/15 text-yellow-400",
  Footwork: "bg-blue-500/15 text-blue-400",
  Passing: "bg-green-500/15 text-green-400",
  Defense: "bg-purple-500/15 text-purple-400",
  Conditioning: "bg-pink-500/15 text-pink-400",
};

function SortableDrillItem({
  drill,
  index,
  onRemove,
  onUpdate,
}: {
  drill: SelectedDrill;
  index: number;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: "duration" | "sets", value: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: drill.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const inputClass =
    "w-full rounded bg-white/5 border border-white/10 px-2 py-1.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-orange-500/50";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-3 rounded-lg border border-white/8 bg-white/3 p-3"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="mt-0.5 shrink-0 cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-400 transition-colors"
        aria-label="Drag to reorder"
      >
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="5.5" cy="4" r="1.2" />
          <circle cx="10.5" cy="4" r="1.2" />
          <circle cx="5.5" cy="8" r="1.2" />
          <circle cx="10.5" cy="8" r="1.2" />
          <circle cx="5.5" cy="12" r="1.2" />
          <circle cx="10.5" cy="12" r="1.2" />
        </svg>
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-slate-600 w-4 shrink-0 text-right">{index + 1}.</span>
          <span className="text-sm font-medium text-slate-100 truncate">{drill.name}</span>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${categoryColors[drill.category] ?? "bg-white/10 text-slate-400"}`}>
            {drill.category}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-slate-600 mb-1">
              Duration (min)
            </label>
            <input
              type="number"
              min="1"
              max="120"
              placeholder="—"
              value={drill.duration}
              onChange={(e) => onUpdate(drill.id, "duration", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-slate-600 mb-1">
              Sets / Reps
            </label>
            <input
              type="number"
              min="1"
              max="100"
              placeholder="—"
              value={drill.sets}
              onChange={(e) => onUpdate(drill.id, "sets", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onRemove(drill.id)}
        className="shrink-0 text-slate-600 hover:text-red-400 transition-colors mt-0.5"
        aria-label="Remove drill"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

interface DefaultDrill extends Drill {
  duration: number | null;
  sets: number | null;
}

export function WorkoutDrillPicker({
  drills,
  defaultDrills,
}: {
  drills: Drill[];
  defaultDrills?: DefaultDrill[];
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<SelectedDrill[]>(
    defaultDrills?.map((d) => ({
      ...d,
      duration: d.duration?.toString() ?? "",
      sets: d.sets?.toString() ?? "",
    })) ?? []
  );
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const filtered = drills.filter(
    (d) =>
      !selected.some((s) => s.id === d.id) &&
      (d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.category.toLowerCase().includes(search.toLowerCase()))
  );

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function addDrill(drill: Drill) {
    setSelected((prev) => [...prev, { ...drill, duration: "", sets: "" }]);
    setSearch("");
    setOpen(false);
  }

  function removeDrill(id: string) {
    setSelected((prev) => prev.filter((d) => d.id !== id));
  }

  function updateDrill(id: string, field: "duration" | "sets", value: string) {
    setSelected((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSelected((prev) => {
        const oldIndex = prev.findIndex((d) => d.id === active.id);
        const newIndex = prev.findIndex((d) => d.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }

  const serialized = JSON.stringify(
    selected.map((d, i) => ({
      id: d.id,
      order: i + 1,
      duration: d.duration ? parseInt(d.duration) : null,
      sets: d.sets ? parseInt(d.sets) : null,
    }))
  );

  return (
    <div className="space-y-3">
      <input type="hidden" name="drillsData" value={serialized} />

      {/* Search */}
      <div ref={containerRef} className="relative">
        <input
          type="text"
          placeholder="Search and add drills…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50"
        />
        {open && search && filtered.length > 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-lg border border-white/10 bg-[#0d1117] shadow-xl overflow-hidden">
            {filtered.slice(0, 8).map((drill) => (
              <button
                key={drill.id}
                type="button"
                onMouseDown={() => addDrill(drill)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-white/5 transition-colors text-left"
              >
                <span className="text-slate-200">{drill.name}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${categoryColors[drill.category] ?? "bg-white/10 text-slate-400"}`}>
                  {drill.category}
                </span>
              </button>
            ))}
          </div>
        )}
        {open && search && filtered.length === 0 && drills.length > 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-lg border border-white/10 bg-[#0d1117] px-4 py-3 text-sm text-slate-500">
            No matching drills.
          </div>
        )}
      </div>

      {drills.length === 0 && (
        <p className="text-sm text-slate-500">No drills yet — add some in the Drills tab first.</p>
      )}

      {/* Sortable selected list */}
      {selected.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={selected.map((d) => d.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {selected.map((drill, index) => (
                <SortableDrillItem
                  key={drill.id}
                  drill={drill}
                  index={index}
                  onRemove={removeDrill}
                  onUpdate={updateDrill}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {selected.length === 0 && drills.length > 0 && (
        <p className="text-sm text-slate-500">
          No drills added yet. Search above to add drills to this workout.
        </p>
      )}
    </div>
  );
}
