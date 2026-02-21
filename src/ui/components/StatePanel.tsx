import type { SimState } from "../../sim/types";
import Card from "./Card";
import MetricCard from "./MetricCard";

export default function StatePanel({ state }: { state: SimState }) {
  return (
    <Card>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <MetricCard label="Readiness" value={`${state.readiness.toFixed(1)}%`} />
        <MetricCard label="Capacity" value={state.capacity.toFixed(1)} />
        <MetricCard label="Utilization" value={state.utilization.toFixed(2)} />
        <MetricCard label="Regression Risk" value={state.regressionRisk.toFixed(1)} />
        <MetricCard label="Scope Growth" value={`${(state.scopeGrowth * 100).toFixed(1)}%`} />
      </div>
    </Card>
  );
}
