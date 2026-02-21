import {
  ACTION_DELTAS,
  CLAMPS,
  DEFAULTS,
  FINAL_WEEK,
  PUSH_RELEASE_READINESS_BOOST,
  WIN_CONDITION,
} from "./config";
import type { ActionType, PendingEffect, SimState } from "./types";

export type WeekTelemetry = {
  week: number;
  action: string;
  readinessPrev: number;
  readinessNext: number;
  readinessDelta: number;
  capacity: number;
  utilization: number;
  regressionRisk: number;
  scopeGrowth: number;
  requiredCoveragePrev: number;
  requiredCoverageNext: number;
  throughput: number;
};

export function initSimState(): SimState {
  return { ...DEFAULTS, pendingEffects: [...DEFAULTS.pendingEffects] };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function clampReadiness(readiness: number): number {
  return clamp(readiness, CLAMPS.readinessMin, CLAMPS.readinessMax);
}

function clampUtilization(utilization: number): number {
  return clamp(utilization, CLAMPS.utilizationMin, CLAMPS.utilizationMax);
}

function clampRisk(risk: number): number {
  return clamp(risk, CLAMPS.riskMin, CLAMPS.riskMax);
}

export function applyPendingEffects(state: SimState): SimState {
  const toApply = state.pendingEffects.filter((e) => e.applyAtWeek === state.week);
  const remaining = state.pendingEffects.filter((e) => e.applyAtWeek !== state.week);

  let next: SimState = { ...state, pendingEffects: remaining };

  for (const effect of toApply) {
    next = applyEffect(next, effect);
  }

  return next;
}

function applyEffect(state: SimState, effect: PendingEffect): SimState {
  switch (effect.type) {
    case "ADD_CAPACITY": {
      return { ...state, capacity: state.capacity + effect.value };
    }
    case "SET_SCOPE_GROWTH": {
      return { ...state, scopeGrowth: effect.value };
    }
    case "DELTA_UTILIZATION": {
      return { ...state, utilization: clampUtilization(state.utilization + effect.value) };
    }
    case "DELTA_RISK": {
      return { ...state, regressionRisk: clampRisk(state.regressionRisk + effect.value) };
    }
  }
}

export function applyAction(state: SimState, action: ActionType): SimState {
  const deltas = ACTION_DELTAS[action];

  let next: SimState = { ...state, pendingEffects: [...state.pendingEffects] };

  for (const effect of deltas.immediate) {
    next = applyEffect(next, { ...effect, applyAtWeek: state.week });
  }

  if (action === "PUSH_RELEASE") {
    next = { ...next, readiness: clampReadiness(next.readiness + PUSH_RELEASE_READINESS_BOOST) };
  }

  for (const effect of deltas.delayed) {
    next.pendingEffects.push({
      applyAtWeek: state.week + effect.delayWeeks,
      type: effect.type,
      value: effect.value,
    });
  }

  return next;
}

export function stepWeek(
  state: SimState,
  action: ActionType,
): { prev: SimState; next: SimState; throughput: number; telemetry: WeekTelemetry } {
  const prev = state;

  const readinessPrev = state.readiness;
  const requiredCoveragePrev = state.requiredCoverage;

  let next = applyPendingEffects(prev);
  next = applyAction(next, action);

  const nextRequiredCoverage = next.requiredCoverage * (1 + next.scopeGrowth);

  const throughput = next.capacity * next.utilization * (1 - next.regressionRisk / 150);

  const readinessIncrease = (throughput / nextRequiredCoverage) * 100;
  const nextReadiness = clampReadiness(next.readiness + readinessIncrease);

  next = {
    ...next,
    requiredCoverage: nextRequiredCoverage,
    readiness: nextReadiness,
    week: next.week + 1,
  };

  const telemetry: WeekTelemetry = {
    week: prev.week,
    action,
    readinessPrev,
    readinessNext: next.readiness,
    readinessDelta: next.readiness - readinessPrev,
    capacity: next.capacity,
    utilization: next.utilization,
    regressionRisk: next.regressionRisk,
    scopeGrowth: next.scopeGrowth,
    requiredCoveragePrev,
    requiredCoverageNext: next.requiredCoverage,
    throughput,
  };

  return { prev, next, throughput, telemetry };
}

export function isFinalWeek(state: SimState): boolean {
  return state.week === FINAL_WEEK + 1;
}

export function getOutcomeAtEndOfWeek6(stateAfterWeek6: SimState): { win: boolean; reason: string } {
  const win =
    stateAfterWeek6.readiness >= WIN_CONDITION.readinessAtLeast &&
    stateAfterWeek6.regressionRisk < WIN_CONDITION.regressionRiskBelow;

  if (win) {
    return { win: true, reason: "Readiness reached 100 with regression risk contained." };
  }

  if (stateAfterWeek6.readiness < WIN_CONDITION.readinessAtLeast) {
    return { win: false, reason: "Readiness did not reach 100 by the end of week 6." };
  }

  return { win: false, reason: "Regression risk exceeded the acceptable threshold." };
}
