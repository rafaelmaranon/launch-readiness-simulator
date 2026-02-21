import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type Point = {
  week: number;
  readiness?: number | null;
  regressionRisk?: number | null;
  capacity?: number | null;
  utilization?: number | null;
  scopeGrowth?: number | null;
  requiredCoverage?: number | null;
  throughput?: number | null;
};

export default function ReadinessChart({ data }: { data: Point[] }) {
  const full: Point[] = Array.from({ length: 6 }, (_, i) => {
    const week = i + 1;
    const found = data.find((d) => d.week === week);
    return found ? { ...found, week } : { week };
  });

  return (
    <div className="w-full">
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={full} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" tickFormatter={(v) => `${v}`} />
            <YAxis yAxisId="left" domain={[0, "auto"]} />
            <YAxis yAxisId="right" orientation="right" domain={[0, "auto"]} />
            <Tooltip />
            <Legend />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="readiness"
              name="Readiness"
              stroke="#111827"
              strokeWidth={2}
              dot
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="regressionRisk"
              name="Regression Risk"
              stroke="#ef4444"
              dot={false}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="utilization"
              name="Utilization"
              stroke="#3b82f6"
              dot={false}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="scopeGrowth"
              name="Scope Growth"
              stroke="#f59e0b"
              dot={false}
            />

            <Line yAxisId="right" type="monotone" dataKey="capacity" name="Capacity" stroke="#10b981" dot={false} />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="requiredCoverage"
              name="Required Coverage"
              stroke="#8b5cf6"
              dot={false}
            />
            <Line yAxisId="right" type="monotone" dataKey="throughput" name="Throughput" stroke="#06b6d4" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
