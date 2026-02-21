import { useNavigate } from "react-router-dom";
import type { Role } from "../app/types";
import { useSession } from "../app/store";

const ROLES: Array<{ role: Role; label: string; blurb: string }> = [
  { role: "OPERATIONS_LEAD", label: "Operations Lead", blurb: "Balance utilization and delivery cadence." },
  { role: "ENGINEERING_LEAD", label: "Engineering Lead", blurb: "Drive throughput while managing stability." },
  { role: "PROGRAM_LEAD", label: "Program Lead", blurb: "Control scope and sequencing across weeks." },
  { role: "GM", label: "GM", blurb: "Optimize outcome under uncertainty and tradeoffs." },
];

export default function RoleSelect() {
  const navigate = useNavigate();
  const { dispatch } = useSession();

  function pick(role: Role) {
    dispatch({ type: "SET_ROLE", role });
    dispatch({ type: "START_SIM" });
    navigate("/sim");
  }

  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight">Select your role</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {ROLES.map((r) => (
          <button
            key={r.role}
            className="rounded-lg border border-slate-200 bg-white p-4 text-left hover:border-slate-300"
            onClick={() => pick(r.role)}
          >
            <div className="font-medium">{r.label}</div>
            <div className="mt-1 text-sm text-slate-600">{r.blurb}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
