"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Props {
  data: { month: string; count: number }[];
}

export function WorkoutsChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} barSize={24}>
        <XAxis
          dataKey="month"
          tick={{ fill: "#64748b", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis hide allowDecimals={false} />
        <Tooltip
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
          contentStyle={{
            background: "#0d1117",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            color: "#f1f5f9",
            fontSize: 12,
          }}
          labelStyle={{ color: "#94a3b8" }}
        />
        <Bar dataKey="count" name="Workouts" radius={[4, 4, 0, 0]}>
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={i === data.length - 1 ? "#f97316" : "#334155"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
