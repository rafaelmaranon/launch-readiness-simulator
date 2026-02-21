import type { ActionType, SimState } from "./types";

export type DecisionLogEntry = { week: number; action: ActionType };

export function getDebriefInsights(finalState: SimState, decisionLog: DecisionLogEntry[]): string[] {
  const insights: string[] = [];

  insights.push("Scope growth compounds required coverage; early control prevents an exponential finish line.");

  if (finalState.regressionRisk >= 60) {
    insights.push("Regression risk became the throughput bottleneck; shipping faster increased drag later.");
  } else {
    insights.push("Keeping regression risk contained preserved throughput and reduced late-stage volatility.");
  }

  insights.push("Utilization changes have outsized leverage because throughput is capacity × utilization.");

  const hadDelayedEffects = decisionLog.some((d) =>
    ["INCREASE_CAPACITY", "FREEZE_SCOPE", "INVEST_TOOLING"].includes(d.action),
  );
  if (hadDelayedEffects) {
    insights.push("Several actions pay off with a delay; sequencing matters more than single-week optimization.");
  }

  const pushCount = decisionLog.filter((d) => d.action === "PUSH_RELEASE").length;
  if (pushCount >= 2) {
    insights.push("Repeated panic pushing boosted readiness short-term but carried a compounding risk cost.");
  }

  return insights.slice(0, 5);
}
