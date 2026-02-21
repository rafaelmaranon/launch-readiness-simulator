import type { ActionType } from "../sim/types";

export type Role = "OPERATIONS_LEAD" | "ENGINEERING_LEAD" | "PROGRAM_LEAD" | "GM";

export type DecisionLogEntry = {
  week: number;
  action: ActionType;
  deltas: {
    readiness: number;
    capacity: number;
    utilization: number;
    regressionRisk: number;
    scopeGrowth: number;
    requiredCoverage: number;
    throughput: number;
  };
};
