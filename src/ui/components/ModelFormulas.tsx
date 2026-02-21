export function ModelFormulas() {
  return (
    <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-sm font-semibold text-slate-900">Model Formulas</div>
      <div className="mt-1 text-sm text-slate-600">
        This diagram reflects how the simulator variables affect each other (based on the formulas in{" "}
        <code>src/sim/engine.ts</code>).
      </div>

      <div className="mt-4 space-y-3 text-sm">
        <div className="rounded-lg bg-slate-50 p-3">
          <div className="font-medium text-slate-900">Throughput driver</div>
          <div className="mt-1 text-slate-700">
            Throughput increases with <b>Capacity</b> and <b>Utilization</b>, and decreases with <b>Regression Risk</b>
            (rework / instability tax).
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 p-3">
          <div className="font-medium text-slate-900">Readiness update</div>
          <div className="mt-1 text-slate-700">
            Readiness increases with Throughput, and is harder to improve when <b>Required Coverage</b> grows (more work to
            finish).
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 p-3">
          <div className="font-medium text-slate-900">Scope pressure</div>
          <div className="mt-1 text-slate-700">
            <b>Scope Growth</b> increases <b>Required Coverage</b>, which reduces readiness gain rate unless throughput rises
            to match.
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Tip: If you want this to be 100% literal, copy/paste the exact formulas from <code>src/sim/engine.ts</code> into
          this card (no behavior change).
        </div>
      </div>
    </div>
  );
}
