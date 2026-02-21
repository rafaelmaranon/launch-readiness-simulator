import Card from "./Card";

type DeltaValue = {
  label: string;
  value: number;
  goodWhen: "up" | "down";
  format?: (v: number) => string;
};

function classifyDelta(value: number, goodWhen: "up" | "down"): "good" | "bad" | "neutral" {
  if (Math.abs(value) < 1e-6) return "neutral";
  const isUp = value > 0;
  const good = goodWhen === "up" ? isUp : !isUp;
  return good ? "good" : "bad";
}

function colorClass(kind: "good" | "bad" | "neutral"): string {
  if (kind === "good") return "text-emerald-700";
  if (kind === "bad") return "text-red-700";
  return "text-slate-500";
}

function fmtSigned(value: number, digits = 2): string {
  if (Math.abs(value) < 1e-6) return "±0";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}`;
}

export default function WeekDeltaStrip({
  week,
  deltas,
}: {
  week: number;
  deltas: {
    readiness: number;
    capacity: number;
    utilization: number;
    regressionRisk: number;
    scopeGrowth: number;
    requiredCoverage: number;
    throughput: number;
  };
}) {
  const items: DeltaValue[] = [
    { label: "Readiness", value: deltas.readiness, goodWhen: "up", format: (v) => `${fmtSigned(v, 1)}%` },
    { label: "Capacity", value: deltas.capacity, goodWhen: "up", format: (v) => fmtSigned(v, 2) },
    {
      label: "Utilization",
      value: deltas.utilization,
      goodWhen: "up",
      format: (v) => fmtSigned(v, 2),
    },
    {
      label: "Regression Risk",
      value: deltas.regressionRisk,
      goodWhen: "down",
      format: (v) => fmtSigned(v, 1),
    },
    {
      label: "Scope Growth",
      value: deltas.scopeGrowth,
      goodWhen: "down",
      format: (v) => fmtSigned(v, 3),
    },
    {
      label: "Required Coverage",
      value: deltas.requiredCoverage,
      goodWhen: "down",
      format: (v) => fmtSigned(v, 1),
    },
    { label: "Throughput", value: deltas.throughput, goodWhen: "up", format: (v) => fmtSigned(v, 2) },
  ];

  return (
    <Card>
      <div className="flex items-baseline justify-between gap-3">
        <div className="text-sm font-medium">Week {week} Deltas</div>
        <div className="text-xs text-slate-500">vs prior week</div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-4">
        {items.map((it) => {
          const kind = classifyDelta(it.value, it.goodWhen);
          return (
            <div key={it.label} className="min-w-0">
              <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{it.label}</div>
              <div className={`truncate text-sm font-medium ${colorClass(kind)}`}>{it.format?.(it.value)}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
