import type { ReactNode } from "react";

export default function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="text-lg font-semibold tracking-tight">Launch Readiness Simulator</div>
        </div>
        {children}
      </div>
    </div>
  );
}
