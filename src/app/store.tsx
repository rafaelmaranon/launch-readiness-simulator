import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import type { ForecastTag, SimState } from "../sim/types";
import type { ActionType } from "../sim/types";
import type { WeekTelemetry } from "../sim/engine";
import { initSimState, stepWeek, getOutcomeAtEndOfWeek6 } from "../sim/engine";
import { getCommentary, getForecastTag } from "../sim/commentary";
import type { DecisionLogEntry, Role } from "./types";

export type SessionState = {
  role: Role | null;
  sim: SimState | null;
  history: Array<{ week: number; readiness: number | null }>;
  stateHistory: Array<{
    week: number;
    readiness: number | null;
    regressionRisk: number | null;
    capacity: number | null;
    utilization: number | null;
    scopeGrowth: number | null;
    requiredCoverage: number | null;
  }>;
  throughputHistory: Array<{ week: number; throughput: number | null }>;
  decisionLog: DecisionLogEntry[];
  selectedAction: ActionType | null;
  forecast: ForecastTag | null;
  commentary: string[];
  outcome: { win: boolean; reason: string } | null;
  telemetry: WeekTelemetry | null;
  telemetryLog: WeekTelemetry[];
  coachResponse: string | null;
};

type Action =
  | { type: "SET_ROLE"; role: Role }
  | { type: "START_SIM" }
  | { type: "SELECT_ACTION"; action: ActionType }
  | { type: "RUN_WEEK" }
  | { type: "ASK_COACH"; question: string }
  | { type: "COACH_RESPONSE"; text: string }
  | { type: "RESET" };

const initialState: SessionState = {
  role: null,
  sim: null,
  history: [],
  stateHistory: [],
  throughputHistory: [],
  decisionLog: [],
  selectedAction: null,
  forecast: null,
  commentary: [],
  outcome: null,
  telemetry: null,
  telemetryLog: [],
  coachResponse: null,
};

function reducer(state: SessionState, action: Action): SessionState {
  switch (action.type) {
    case "SET_ROLE": {
      return { ...state, role: action.role };
    }
    case "START_SIM": {
      const sim = initSimState();
      return {
        ...state,
        sim,
        history: [{ week: 1, readiness: sim.readiness }],
        stateHistory: [
          {
            week: 1,
            readiness: sim.readiness,
            regressionRisk: sim.regressionRisk,
            capacity: sim.capacity,
            utilization: sim.utilization,
            scopeGrowth: sim.scopeGrowth,
            requiredCoverage: sim.requiredCoverage,
          },
        ],
        throughputHistory: [{ week: 1, throughput: null }],
        decisionLog: [],
        selectedAction: null,
        forecast: getForecastTag(sim),
        commentary: [],
        outcome: null,
        telemetry: null,
        telemetryLog: [],
        coachResponse: null,
      };
    }
    case "SELECT_ACTION": {
      return { ...state, selectedAction: action.action };
    }
    case "RUN_WEEK": {
      if (!state.sim || !state.selectedAction) return state;

      const actionTaken = state.selectedAction;
      const prevWeek = state.sim.week;

      const { prev, next, telemetry } = stepWeek(state.sim, actionTaken);

      const prevTelemetry = state.telemetryLog[state.telemetryLog.length - 1] ?? null;
      const throughputPrev = prevTelemetry ? prevTelemetry.throughput : telemetry.throughput;

      const forecast = getForecastTag(next);
      const commentary = getCommentary(prev, next, actionTaken);

      const decisionLog = [
        ...state.decisionLog,
        {
          week: prevWeek,
          action: actionTaken,
          deltas: {
            readiness: telemetry.readinessDelta,
            capacity: next.capacity - prev.capacity,
            utilization: next.utilization - prev.utilization,
            regressionRisk: next.regressionRisk - prev.regressionRisk,
            scopeGrowth: next.scopeGrowth - prev.scopeGrowth,
            requiredCoverage: telemetry.requiredCoverageNext - telemetry.requiredCoveragePrev,
            throughput: telemetry.throughput - throughputPrev,
          },
        },
      ];
      const history = appendHistoryPoint(state.history, next);

      const stateHistory = appendStateSnapshot(state.stateHistory, next);
      const throughputHistory = appendThroughputSnapshot(state.throughputHistory, next.week, telemetry.throughput);

      const telemetryLog = [...state.telemetryLog, telemetry];

      const outcome = prevWeek === 6 ? getOutcomeAtEndOfWeek6(next) : state.outcome;

      return {
        ...state,
        sim: next,
        decisionLog,
        history,
        stateHistory,
        throughputHistory,
        forecast,
        commentary,
        selectedAction: null,
        outcome,
        telemetry,
        telemetryLog,
        coachResponse: null,
      };
    }
    case "COACH_RESPONSE": {
      return { ...state, coachResponse: action.text };
    }
    case "ASK_COACH": {
      return state;
    }
    case "RESET": {
      return initialState;
    }
  }
}

function appendHistoryPoint(
  history: Array<{ week: number; readiness: number | null }>,
  next: { week: number; readiness: number },
) {
  const chartWeek = Math.min(next.week, 6);
  const filtered = history.filter((p) => p.week !== chartWeek);
  return [...filtered, { week: chartWeek, readiness: next.readiness }].sort((a, b) => a.week - b.week);
}

function appendStateSnapshot(
  history: SessionState["stateHistory"],
  next: {
    week: number;
    readiness: number;
    regressionRisk: number;
    capacity: number;
    utilization: number;
    scopeGrowth: number;
    requiredCoverage: number;
  },
): SessionState["stateHistory"] {
  const chartWeek = Math.min(next.week, 6);
  const filtered = history.filter((p) => p.week !== chartWeek);
  return [
    ...filtered,
    {
      week: chartWeek,
      readiness: next.readiness,
      regressionRisk: next.regressionRisk,
      capacity: next.capacity,
      utilization: next.utilization,
      scopeGrowth: next.scopeGrowth,
      requiredCoverage: next.requiredCoverage,
    },
  ].sort((a, b) => a.week - b.week);
}

function appendThroughputSnapshot(
  history: SessionState["throughputHistory"],
  nextWeek: number,
  throughput: number,
): SessionState["throughputHistory"] {
  const chartWeek = Math.min(nextWeek, 6);
  const filtered = history.filter((p) => p.week !== chartWeek);
  return [...filtered, { week: chartWeek, throughput }].sort((a, b) => a.week - b.week);
}

const SessionContext = createContext<
  { state: SessionState; dispatch: (action: Action) => void } | undefined
>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, innerDispatch] = useReducer(reducer, initialState);
  const [coachRequest, setCoachRequest] = useState<{ telemetry: WeekTelemetry; question: string } | null>(null);

  useEffect(() => {
    if (!coachRequest) return;

    fetch("/api/coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(coachRequest),
    })
      .then((r) => r.json())
      .then((d) => {
        const text = typeof d?.text === "string" ? d.text : "";
        const error = typeof d?.error === "string" ? d.error : "";
        innerDispatch({ type: "COACH_RESPONSE", text: error ? `Error: ${error}` : text });
      });

    setCoachRequest(null);
  }, [coachRequest]);

  const dispatch = useMemo(() => {
    return (action: Action) => {
      if (action.type === "ASK_COACH") {
        if (!state.telemetry) return;
        setCoachRequest({ telemetry: state.telemetry, question: action.question });
        return;
      }
      innerDispatch(action);
    };
  }, [innerDispatch, state.telemetry]);

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
