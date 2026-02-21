import type { DecisionLogEntry } from "../../app/types";
import Card from "./Card";
import { useEffect, useState } from "react";

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

function DeltaChip({
  label,
  value,
  goodWhen,
  unit,
  digits,
}: {
  label: string;
  value: number;
  goodWhen: "up" | "down";
  unit?: string;
  digits?: number;
}) {
  const kind = classifyDelta(value, goodWhen);
  return (
    <div className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
      <div className="text-[10px] font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`text-xs font-medium ${colorClass(kind)}`}>{`${fmtSigned(value, digits)}${unit ?? ""}`}</div>
    </div>
  );
}

export default function DecisionLog({ entries }: { entries: DecisionLogEntry[] }) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 640px)").matches) setOpen(false);
  }, []);

  return (
    <Card>
      <button
        type="button"
        className="flex w-full items-center justify-between text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="text-sm font-medium">Decision Log ({entries.length})</div>
        <div className="text-xs text-slate-500">{open ? "▾" : "▸"}</div>
      </button>

      {open ? (
        <div className="mt-3 space-y-2 text-sm text-slate-700">
          {entries.length === 0 ? (
            <div className="text-slate-500">No decisions yet.</div>
          ) : (
            entries.map((d) => (
              <div key={`${d.week}-${d.action}`} className="flex items-baseline justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium">Week {d.week}</div>
                  <div className="text-slate-600">{d.action.replace(/_/g, " ")}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <DeltaChip label="Readiness" value={d.deltas.readiness} goodWhen="up" unit="%" digits={1} />
                  <DeltaChip label="Capacity" value={d.deltas.capacity} goodWhen="up" digits={2} />
                  <DeltaChip label="Utilization" value={d.deltas.utilization} goodWhen="up" digits={2} />
                  <DeltaChip label="Risk" value={d.deltas.regressionRisk} goodWhen="down" digits={1} />
                  <DeltaChip label="Scope" value={d.deltas.scopeGrowth} goodWhen="down" digits={3} />
                  <DeltaChip label="Coverage" value={d.deltas.requiredCoverage} goodWhen="down" digits={1} />
                  <DeltaChip label="Throughput" value={d.deltas.throughput} goodWhen="up" digits={2} />
                </div>
              </div>
            ))
          )}
        </div>
      ) : null}
    </Card>
  );
}
