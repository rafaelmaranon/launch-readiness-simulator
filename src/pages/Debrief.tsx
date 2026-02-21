import { useNavigate } from "react-router-dom";
import { useSession } from "../app/store";
import { getDebriefInsights } from "../sim/debrief";
import ReadinessChart from "../ui/components/ReadinessChart";
import Card from "../ui/components/Card";
import { getOutcomeNarrative } from "../ui/uiHelpers";

export default function Debrief() {
  const navigate = useNavigate();
  const { state, dispatch } = useSession();

  if (!state.sim || !state.outcome) {
    return (
      <div className="text-sm text-slate-600">
        No completed simulation. <button className="underline" onClick={() => navigate("/")}>Return home</button>
      </div>
    );
  }

  const finalState = state.sim;
  const insights = getDebriefInsights(finalState, state.decisionLog);
  const narrative = getOutcomeNarrative(finalState);

  const throughputByWeek: Record<number, number | null> = Object.fromEntries(
    state.throughputHistory.map((p) => [p.week, p.throughput]),
  );
  const chartData = state.stateHistory.map((p) => ({
    ...p,
    throughput: throughputByWeek[p.week] ?? null,
  }));

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-sm font-medium text-slate-600">Outcome</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight">
            {narrative.label}
          </div>
          <div className="mt-2 text-sm text-slate-700">{narrative.explanation}</div>
        </div>
        <button
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm hover:border-slate-300"
          onClick={() => {
            dispatch({ type: "RESET" });
            navigate("/");
          }}
        >
          Restart
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="grid gap-3 sm:grid-cols-2">
            <Stat label="Final Readiness" value={`${finalState.readiness.toFixed(1)}%`} />
            <Stat label="Final Regression Risk" value={finalState.regressionRisk.toFixed(1)} />
          </div>
        </Card>

        <ReadinessChart data={chartData} />
      </div>

      <Card className="mt-6">
        <div className="text-sm font-medium">Top drivers</div>
        <ul className="mt-3 list-disc pl-5 text-sm text-slate-700">
          {insights.slice(0, 2).map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>

        <div className="mt-5 text-sm font-medium">Debrief insights</div>
        <ul className="mt-3 list-disc pl-5 text-sm text-slate-700">
          {insights.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-semibold tabular-nums">{value}</div>
    </div>
  );
}
