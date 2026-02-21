import type { ActionType, PendingEffect, SimState } from "./types";

export const DEFAULTS: Omit<SimState, "pendingEffects"> & { pendingEffects: PendingEffect[] } = {
  week: 1,
  readiness: 45,
  capacity: 20,
  utilization: 0.75,
  regressionRisk: 10,
  scopeGrowth: 0.05,
  requiredCoverage: 100,
  pendingEffects: [],
};

export const CLAMPS = {
  readinessMin: 0,
  readinessMax: 100,
  utilizationMin: 0,
  utilizationMax: 1,
  riskMin: 0,
  riskMax: 100,
} as const;

export const FINAL_WEEK = 6;

export const ACTION_DELTAS: Record<
  ActionType,
  {
    immediate: Array<Omit<PendingEffect, "applyAtWeek">>;
    delayed: Array<{ delayWeeks: number } & Omit<PendingEffect, "applyAtWeek">>;
  }
> = {
  INCREASE_CAPACITY: {
    immediate: [{ type: "DELTA_UTILIZATION", value: -0.03 }],
    delayed: [{ delayWeeks: 1, type: "ADD_CAPACITY", value: 3 }],
  },
  IMPROVE_SCHEDULING: {
    immediate: [{ type: "DELTA_UTILIZATION", value: 0.05 }],
    delayed: [],
  },
  FREEZE_SCOPE: {
    immediate: [{ type: "DELTA_RISK", value: -3 }],
    delayed: [{ delayWeeks: 1, type: "SET_SCOPE_GROWTH", value: 0 }],
  },
  PUSH_RELEASE: {
    immediate: [{ type: "DELTA_RISK", value: 10 }],
    delayed: [],
  },
  INVEST_TOOLING: {
    immediate: [{ type: "DELTA_UTILIZATION", value: -0.02 }],
    delayed: [
      { delayWeeks: 1, type: "DELTA_UTILIZATION", value: 0.04 },
      { delayWeeks: 1, type: "DELTA_RISK", value: -6 },
    ],
  },
};

export const PUSH_RELEASE_READINESS_BOOST = 6;

export const WIN_CONDITION = {
  readinessAtLeast: 100,
  regressionRiskBelow: 60,
} as const;
