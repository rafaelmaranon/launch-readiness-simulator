import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight">Launch Readiness Simulator</h1>
      <p className="mt-3 text-slate-600">
        A deterministic, 6-week executive simulation to manage readiness, scope, utilization, and risk.
      </p>
      <button
        className="mt-6 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        onClick={() => navigate("/role")}
      >
        Start Simulation
      </button>
    </div>
  );
}
