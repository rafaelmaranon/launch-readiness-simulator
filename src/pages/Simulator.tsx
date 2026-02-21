import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../app/store";
import type { ActionType } from "../sim/types";
import Page from "../ui/layout/Page";
import StatePanel from "../ui/components/StatePanel";
import ReadinessChart from "../ui/components/ReadinessChart";
import ForecastTag from "../ui/components/ForecastTag";
import ActionGrid from "../ui/components/ActionGrid";
import Card from "../ui/components/Card";
import Button from "../ui/components/Button";
import DecisionLog from "../ui/components/DecisionLog";
import CommentaryBox from "../ui/components/CommentaryBox";
import WeekDeltaStrip from "../ui/components/WeekDeltaStrip";
import CausalLoopDiagram from "../ui/components/CausalLoopDiagram";
import { ModelFormulas } from "../ui/components/ModelFormulas";
import { formatForecastLabel, getForecastProjection, getRiskStatus, getRoleLensConfig } from "../ui/uiHelpers";

export default function Simulator() {
  const navigate = useNavigate();
  const { state, dispatch } = useSession();

  const [question, setQuestion] = useState("");

  const sim = state.sim;

  if (!sim) {
    return (
      <div className="text-sm text-slate-600">
        No active session. <button className="underline" onClick={() => navigate("/")}>Return home</button>
      </div>
    );
  }

  function runWeek() {
    dispatch({ type: "RUN_WEEK" });
  }

  useEffect(() => {
    if (state.outcome) navigate("/debrief");
  }, [state.outcome, navigate]);

  const lens = getRoleLensConfig(state.role);
  const risk = getRiskStatus(sim.regressionRisk);
  const forecastHighlighted = !!lens?.highlights.includes("FORECAST");
  const selectedAction = state.selectedAction;
  const latestDecision = state.decisionLog[state.decisionLog.length - 1] ?? null;

  const throughputByWeek: Record<number, number | null> = Object.fromEntries(
    state.throughputHistory.map((p) => [p.week, p.throughput]),
  );
  const chartData = state.stateHistory.map((p) => ({
    ...p,
    throughput: throughputByWeek[p.week] ?? null,
  }));

  return (
    <Page>
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-slate-600">Week {sim.week}/6</div>
        {state.forecast ? (
          <ForecastTag
            tag={state.forecast}
            label={formatForecastLabel(
              state.forecast,
              getForecastProjection(state.history, sim.readiness, sim.week),
            )}
            highlight={forecastHighlighted}
          />
        ) : null}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="text-sm font-medium">Success Criteria</div>
          <div className="mt-1 text-sm text-slate-700">
            Goal by Week 6: <span className="font-medium">Readiness ≥ 100%</span> AND{" "}
            <span className="font-medium">Regression Risk &lt; 60</span>
          </div>
          <div className="mt-3 text-xs text-slate-600">
            Week {sim.week}/6 • Readiness: {sim.readiness.toFixed(0)}% • Risk: {sim.regressionRisk.toFixed(0)} ({risk.label})
          </div>
        </Card>

        {lens ? (
          <Card>
            <div className="text-sm font-medium">Role Lens</div>
            <div className="mt-1 text-sm text-slate-700">{lens.name}</div>
            <div className="mt-2 text-xs text-slate-600">{lens.focus}</div>
          </Card>
        ) : null}
      </div>

      <div className="mt-6 space-y-6">
        <Card>
          <div className="mb-3 text-sm font-medium">Trajectory</div>
          <ReadinessChart data={chartData} />
        </Card>

        {latestDecision ? <WeekDeltaStrip week={latestDecision.week} deltas={latestDecision.deltas} /> : null}

        <StatePanel
          state={sim}
          highlight={(() => {
            const map: Record<string, boolean> = {};
            if (!lens) return undefined;
            if (lens.highlights.includes("READINESS")) map.READINESS = true;
            if (lens.highlights.includes("CAPACITY")) map.CAPACITY = true;
            if (lens.highlights.includes("UTILIZATION")) map.UTILIZATION = true;
            if (lens.highlights.includes("RISK") || lens.highlights.includes("HEALTH")) map.RISK = true;
            if (lens.highlights.includes("SCOPE_GROWTH")) map.SCOPE_GROWTH = true;
            return map;
          })()}
        />
      </div>

      <div className="mt-6 pb-24 sm:pb-0">
        <div className="text-sm font-medium">Select an action</div>
        <div className="mt-3">
          <ActionGrid
            selected={selectedAction}
            onSelect={(action: ActionType) => dispatch({ type: "SELECT_ACTION", action })}
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="text-sm text-slate-500">Select one action for this week, then run the week.</div>

          <button
            className="px-4 py-2 rounded-md bg-slate-900 text-white disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={!selectedAction}
            onClick={() => dispatch({ type: "RUN_WEEK" })}
          >
            Run Week
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <DecisionLog entries={state.decisionLog} />
        <div>
          <CommentaryBox lines={state.commentary} />

          <Card className="mt-4">
            <div className="text-sm font-medium mb-2">Strategic Coach</div>

            {state.coachResponse ? (
              <div className="text-sm whitespace-pre-line">{state.coachResponse}</div>
            ) : (
              <div className="text-sm text-slate-500">Run a week to receive coaching insight.</div>
            )}

            <div className="mt-3 flex gap-2">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask about your strategy..."
                className="flex-1 border rounded px-2 py-1 text-sm"
              />

              <Button disabled={!state.telemetry} onClick={() => dispatch({ type: "ASK_COACH", question })}>
                Ask
              </Button>
            </div>

            <div className="mt-2 flex gap-2 text-xs">
              <button
                onClick={() => dispatch({ type: "ASK_COACH", question: "Why did readiness change this week?" })}
              >
                Why readiness?
              </button>
              <button onClick={() => dispatch({ type: "ASK_COACH", question: "What is my biggest risk right now?" })}>
                Biggest risk?
              </button>
              <button onClick={() => dispatch({ type: "ASK_COACH", question: "What should I prioritize next week?" })}>
                What next?
              </button>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <CausalLoopDiagram />
      </div>

      <ModelFormulas />

      <div className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/90 backdrop-blur sm:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Selected</div>
            <div className="truncate text-sm font-medium text-slate-900">
              {state.selectedAction ? state.selectedAction.replace(/_/g, " ") : "Pick an action"}
            </div>
          </div>
          <Button className="px-5 py-3" disabled={!state.selectedAction} onClick={runWeek}>
            Run Week
          </Button>
        </div>
      </div>
    </Page>
  );
}
