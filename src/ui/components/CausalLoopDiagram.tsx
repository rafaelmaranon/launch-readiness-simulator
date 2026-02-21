import Card from "./Card";

export default function CausalLoopDiagram() {
  return (
    <Card>
      <div className="text-sm font-medium">Causal Loop Diagram</div>
      <div className="mt-1 text-xs text-slate-600">How the system drives readiness (loops and tradeoffs)</div>

      <div className="mt-4 w-full overflow-x-auto">
        <svg viewBox="0 0 900 360" className="min-w-[900px]">
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#334155" />
            </marker>
          </defs>

          {/** Nodes */}
          <g fontFamily="ui-sans-serif" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1">
            <rect x="60" y="50" width="140" height="46" rx="10" fill="#ffffff" />
            <text x="130" y="78" textAnchor="middle" fontSize="14">
              Capacity
            </text>

            <rect x="60" y="132" width="140" height="46" rx="10" fill="#ffffff" />
            <text x="130" y="160" textAnchor="middle" fontSize="14">
              Utilization
            </text>

            <rect x="270" y="92" width="170" height="56" rx="10" fill="#ffffff" />
            <text x="355" y="118" textAnchor="middle" fontSize="14">
              Effective
            </text>
            <text x="355" y="138" textAnchor="middle" fontSize="14">
              Throughput
            </text>

            <rect x="510" y="92" width="160" height="56" rx="10" fill="#ffffff" />
            <text x="590" y="118" textAnchor="middle" fontSize="14">
              Readiness
            </text>
            <text x="590" y="138" textAnchor="middle" fontSize="12" fill="#475569">
              (progress)
            </text>

            <rect x="270" y="232" width="170" height="56" rx="10" fill="#ffffff" />
            <text x="355" y="258" textAnchor="middle" fontSize="14">
              Required
            </text>
            <text x="355" y="278" textAnchor="middle" fontSize="14">
              Coverage
            </text>

            <rect x="60" y="242" width="140" height="46" rx="10" fill="#ffffff" />
            <text x="130" y="270" textAnchor="middle" fontSize="14">
              Scope Growth
            </text>

            <rect x="510" y="232" width="160" height="56" rx="10" fill="#ffffff" />
            <text x="590" y="258" textAnchor="middle" fontSize="14">
              Regression Risk
            </text>
            <text x="590" y="278" textAnchor="middle" fontSize="12" fill="#475569">
              (instability)
            </text>

            <rect x="720" y="232" width="140" height="56" rx="10" fill="#ffffff" />
            <text x="790" y="258" textAnchor="middle" fontSize="14">
              Rework
            </text>
            <text x="790" y="278" textAnchor="middle" fontSize="14">
              Tax
            </text>
          </g>

          {/** Arrows */}
          <g stroke="#334155" strokeWidth="2" fill="none" markerEnd="url(#arrow)">
            <path d="M 200 73 C 235 73 240 100 270 110" />
            <path d="M 200 155 C 235 155 240 135 270 130" />
            <path d="M 440 120 C 470 120 480 120 510 120" />

            <path d="M 200 265 C 235 265 245 255 270 255" />
            <path d="M 440 260 C 470 260 485 245 510 145" />

            <path d="M 670 260 C 695 260 700 260 720 260" />
            <path d="M 720 250 C 650 210 520 210 440 120" />

            <path d="M 590 148 C 590 185 590 200 590 232" />
          </g>

          {/** +/- labels */}
          <g fontFamily="ui-sans-serif" fontSize="14" fill="#0f172a">
            <text x="235" y="82">
              +
            </text>
            <text x="235" y="150">
              +
            </text>
            <text x="480" y="112">
              +
            </text>

            <text x="235" y="258">
              +
            </text>
            <text x="485" y="205">
              −
            </text>

            <text x="695" y="252">
              +
            </text>
            <text x="540" y="205">
              −
            </text>

            <text x="602" y="195">
              −
            </text>
          </g>

          {/** Loop labels */}
          <g fontFamily="ui-sans-serif" fontSize="12" fill="#475569">
            <text x="300" y="72">
              R1: Tooling/Capacity → Throughput → Readiness
            </text>
            <text x="560" y="320">
              B1: Readiness −→ Risk +→ Rework Tax −→ Throughput
            </text>
          </g>
        </svg>
      </div>
    </Card>
  );
}
