import React, { createContext, useContext, useMemo, useReducer } from "react";
import type { ForecastTag, SimState } from "../sim/types";
import type { ActionType } from "../sim/types";
import { initSimState, stepWeek, getOutcomeAtEndOfWeek6 } from "../sim/engine";
import { getCommentary, getForecastTag } from "../sim/commentary";
import type { DecisionLogEntry, Role } from "./types";

export type SessionState = {
  role: Role | null;
  sim: SimState | null;
  history: Array<{ week: number; readiness: number }>;
  decisionLog: DecisionLogEntry[];
  selectedAction: ActionType | null;
  forecast: ForecastTag | null;
  commentary: string[];
  outcome: { win: boolean; reason: string } | null;
};

type Action =
  | { type: "SET_ROLE"; role: Role }
  | { type: "START_SIM" }
  | { type: "SELECT_ACTION"; action: ActionType }
  | { type: "RUN_WEEK" }
  | { type: "RESET" };

const initialState: SessionState = {
  role: null,
  sim: null,
  history: [],
  decisionLog: [],
  selectedAction: null,
  forecast: null,
  commentary: [],
  outcome: null,
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
        history: [{ week: sim.week, readiness: sim.readiness }],
        decisionLog: [],
        selectedAction: null,
        forecast: getForecastTag(sim),
        commentary: [],
        outcome: null,
      };
    }
    case "SELECT_ACTION": {
      return { ...state, selectedAction: action.action };
    }
    case "RUN_WEEK": {
      if (!state.sim || !state.selectedAction) return state;

      const weekRan = state.sim.week;
      const { prev, next } = stepWeek(state.sim, state.selectedAction);

      const nextHistory = [...state.history, { week: next.week, readiness: next.readiness }];
      const nextDecisionLog: DecisionLogEntry[] = [
        ...state.decisionLog,
        { week: weekRan, action: state.selectedAction },
      ];

      const forecast = getForecastTag(next);
      const commentary = getCommentary(prev, next, state.selectedAction);

      const outcome = weekRan === 6 ? getOutcomeAtEndOfWeek6(next) : null;

      return {
        ...state,
        sim: next,
        history: nextHistory,
        decisionLog: nextDecisionLog,
        selectedAction: null,
        forecast,
        commentary,
        outcome,
      };
    }
    case "RESET": {
      return initialState;
    }
  }
}

const SessionContext = createContext<
  { state: SessionState; dispatch: React.Dispatch<Action> } | undefined
>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
