import type { ActionType } from "../sim/types";

export type Role = "OPERATIONS_LEAD" | "ENGINEERING_LEAD" | "PROGRAM_LEAD" | "GM";

export type DecisionLogEntry = { week: number; action: ActionType };
