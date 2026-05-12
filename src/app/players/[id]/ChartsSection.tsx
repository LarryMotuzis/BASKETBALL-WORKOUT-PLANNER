"use client";

import dynamic from "next/dynamic";

const WorkoutsChart = dynamic(
  () => import("./WorkoutsChart").then((m) => m.WorkoutsChart),
  { ssr: false }
);
const DrillsChart = dynamic(
  () => import("./DrillsChart").then((m) => m.DrillsChart),
  { ssr: false }
);

interface Props {
  workoutsChartData: { month: string; count: number }[];
  drillsChartData: { name: string; value: number }[];
  hasWorkouts: boolean;
}

export function ChartsSection({ workoutsChartData, drillsChartData, hasWorkouts }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 mb-8">
      <div className="rounded-xl bg-white/4 border border-white/8 p-6">
        <h2 className="text-sm font-semibold text-slate-300 mb-4">Workouts / Month</h2>
        {!hasWorkouts ? (
          <p className="text-sm text-slate-500">No data yet.</p>
        ) : (
          <WorkoutsChart data={workoutsChartData} />
        )}
      </div>
      <div className="rounded-xl bg-white/4 border border-white/8 p-6">
        <h2 className="text-sm font-semibold text-slate-300 mb-4">Drill Categories</h2>
        {drillsChartData.length === 0 ? (
          <p className="text-sm text-slate-500">No drills logged yet.</p>
        ) : (
          <DrillsChart data={drillsChartData} />
        )}
      </div>
    </div>
  );
}
