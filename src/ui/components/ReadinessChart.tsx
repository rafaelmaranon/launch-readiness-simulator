import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card from "./Card";

export type ReadinessPoint = { week: number; readiness: number };

export default function ReadinessChart({ data }: { data: ReadinessPoint[] }) {
  return (
    <Card>
      <div className="mb-3 text-sm font-medium">Readiness</div>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#64748b" />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#64748b" />
            <Tooltip />
            <Line type="monotone" dataKey="readiness" stroke="#0f172a" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
