# Launch Readiness Simulator

A strategic decision lab for product, operations, and engineering leaders.

This 6-week AI-augmented system dynamics simulation explores how launch readiness evolves under deadline pressure, resource constraints, and risk tradeoffs.

The goal is not to optimize a single metric — but to manage a system.

## 🎯 Objective

Reach 100% Readiness by Week 6 while keeping Regression Risk under control.

Success requires:

- Readiness ≥ 100%
- Regression Risk < 60

Hitting the milestone without stability is not considered a successful launch.

## 🤖 AI Strategic Coach

Beyond the deterministic simulation engine, the experience includes an AI-powered Strategic Coach.

The AI does not drive the math.
The core system remains transparent and deterministic.

Instead, the AI:

- Interprets system behavior in real time
- Explains feedback loops and delays
- Surfaces hidden tradeoffs
- Detects instability patterns
- Provides executive-level debriefs
- Adapts insight based on the selected leadership role

Example reflections:

- “Scope growth is compounding required coverage faster than current capacity can absorb.”
- “Short-term acceleration increased regression risk, which may reduce throughput in future weeks.”
- “Utilization is stable, but systemic fragility is rising.”

The AI transforms raw metrics into leadership insight.

## 🧠 What This Simulator Teaches

In 5 minutes, players experience:

- Delays matter — Capacity increases don’t help immediately.
- Scope compounds — Expanding requirements silently move the finish line.
- Risk reduces throughput — Instability converts progress into rework.
- Speed can create fragility — Short-term gains may erode long-term stability.
- Balanced decisions outperform panic — Stability beats heroics.

The simulator demonstrates how feedback loops and time delays shape outcomes in complex systems — with AI helping interpret those dynamics.

## 🎮 How It Works

Each week, the player:

1. Reviews system state:
   - Readiness
   - Capacity
   - Utilization
   - Regression Risk
   - Scope Growth
   - Forecast
2. Chooses one action:
   - Increase Capacity
   - Improve Scheduling
   - Freeze Scope
   - Push Release
   - Invest in Tooling
3. Advances the week and observes the system response.

The simulation runs for 6 weeks.

The mechanics are deterministic.
The learning layer is AI-augmented.

## 🏢 Role Lens

Players choose a leadership role:

- Operations Lead
- Engineering Lead
- Program Lead
- General Manager

Each role emphasizes different metrics and decision signals, reflecting how cross-functional leaders interpret the same system differently.

The underlying system remains constant — the interpretation shifts.

The AI adapts commentary based on this role perspective.

## 📊 System Model (Simplified)

Core state variables:

- Readiness (%)
- Capacity (units/week)
- Utilization (0–1)
- Regression Risk (0–100)
- Scope Growth (% per week)

Weekly update:

- Required coverage compounds with scope growth.
- Effective throughput = Capacity × Utilization × (1 − RiskFactor).
- Readiness increases based on effective throughput.
- Regression risk represents instability and rework tax on output.

AI interprets how these variables interact — especially delayed effects and compounding dynamics.

## 🧩 Design Principles

- Deterministic engine for credibility
- AI interpretation for clarity
- No randomness
- Clear cause → effect
- Executive framing
- Mobile responsive

This is a leadership learning tool, not a gamified toy.

## 💡 Why This Exists

Launch readiness problems are not unique to one industry.

They appear across:

- Software
- Hardware
- Infrastructure
- Logistics
- Regulated systems
- High-reliability environments

This simulator abstracts the structural dynamics behind those challenges — and uses AI to make those dynamics visible.

## 🛠 Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- AI integration layer (LLM-based strategic interpretation)
- Fully client-side for V1.
