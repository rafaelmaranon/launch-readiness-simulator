export type ActionType =
  | "INCREASE_CAPACITY"
  | "IMPROVE_SCHEDULING"
  | "FREEZE_SCOPE"
  | "PUSH_RELEASE"
  | "INVEST_TOOLING";

export type ForecastTag = "ON_TRACK" | "AT_RISK" | "MISS_LIKELY";

export type PendingEffect = {
  applyAtWeek: number;
  type: "ADD_CAPACITY" | "SET_SCOPE_GROWTH" | "DELTA_UTILIZATION" | "DELTA_RISK";
  value: number;
};

export type SimState = {
  week: number;
  readiness: number;
  capacity: number;
  utilization: number;
  regressionRisk: number;
  scopeGrowth: number;
  requiredCoverage: number;
  pendingEffects: PendingEffect[];
};

export type WeekResult = {
  prev: SimState;
  next: SimState;
  action: ActionType;
  throughput: number;
  forecast: ForecastTag;
  commentary: string[];
};
