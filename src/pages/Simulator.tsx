import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../app/store";
import type { ActionType } from "../sim/types";
import Page from "../ui/layout/Page";
import StatePanel from "../ui/components/StatePanel";
import ReadinessChart from "../ui/components/ReadinessChart";
import ForecastTag from "../ui/components/ForecastTag";
import ActionGrid from "../ui/components/ActionGrid";
import Button from "../ui/components/Button";
import DecisionLog from "../ui/components/DecisionLog";
import CommentaryBox from "../ui/components/CommentaryBox";

export default function Simulator() {
  const navigate = useNavigate();
  const { state, dispatch } = useSession();

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

  return (
    <Page>
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">Week {sim.week}</div>
        {state.forecast ? <ForecastTag tag={state.forecast} /> : null}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <StatePanel state={sim} />
        <ReadinessChart data={state.history} />
      </div>

      <div className="mt-6">
        <div className="text-sm font-medium">Select an action</div>
        <div className="mt-3">
          <ActionGrid
            selected={state.selectedAction}
            onSelect={(action: ActionType) => dispatch({ type: "SELECT_ACTION", action })}
          />
        </div>
        <div className="mt-4">
          <Button disabled={!state.selectedAction} onClick={runWeek}>
            Run Week
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <DecisionLog entries={state.decisionLog} />
        <CommentaryBox lines={state.commentary} />
      </div>
    </Page>
  );
}
