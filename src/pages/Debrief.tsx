import { useNavigate } from "react-router-dom";
import { useSession } from "../app/store";
import { getDebriefInsights } from "../sim/debrief";

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

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-sm font-medium text-slate-600">Outcome</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight">
            {state.outcome.win ? "WIN" : "LOSE"}
          </div>
          <div className="mt-2 text-sm text-slate-700">{state.outcome.reason}</div>
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

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Stat label="Final Readiness" value={`${finalState.readiness.toFixed(1)}%`} />
          <Stat label="Final Regression Risk" value={finalState.regressionRisk.toFixed(1)} />
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
        <div className="text-sm font-medium">Debrief insights</div>
        <ul className="mt-3 list-disc pl-5 text-sm text-slate-700">
          {insights.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </div>
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
