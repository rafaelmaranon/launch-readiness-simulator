import type { ActionType, ForecastTag, SimState } from "./types";

export function getForecastTag(state: SimState): ForecastTag {
  if (state.readiness >= 80 && state.regressionRisk < 45) return "ON_TRACK";
  if (state.readiness >= 65 && state.regressionRisk < 60) return "AT_RISK";
  return "MISS_LIKELY";
}

export function getCommentary(prev: SimState, next: SimState, action: ActionType): string[] {
  const lines: string[] = [];

  const scopeAcceleration = next.scopeGrowth > 0 && next.requiredCoverage > prev.requiredCoverage;
  if (scopeAcceleration) {
    lines.push("Scope is compounding and increasing the work needed to finish.");
  }

  if (next.regressionRisk >= 60) {
    lines.push("Regression risk is now in the danger zone; stability work is becoming the bottleneck.");
  } else if (next.regressionRisk - prev.regressionRisk >= 8) {
    lines.push("Regression risk jumped sharply this week; expect drag on throughput.");
  }

  if (next.utilization < 0.6) {
    lines.push("Utilization is low; capacity isn’t converting into throughput.");
  }

  if (next.regressionRisk < prev.regressionRisk && next.utilization > prev.utilization) {
    lines.push("Good trade: risk is down while utilization improved.");
  }

  if (lines.length === 0) {
    lines.push(`Action executed: ${action.replace(/_/g, " ").toLowerCase()}.`);
    lines.push("Keep pressure on scope growth and risk while maintaining sustainable utilization.");
  }

  return lines.slice(0, 4);
}
