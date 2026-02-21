import OpenAI from "openai";
import fs from "node:fs";
import path from "node:path";

function readEnvLocalValue(key: string): string | null {
  try {
    const filePath = path.join(process.cwd(), ".env.local");
    const raw = fs.readFileSync(filePath, "utf8");
    const lines = raw.split(/\r?\n/);

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const idx = trimmed.indexOf("=");
      if (idx <= 0) continue;

      const k = trimmed.slice(0, idx).trim();
      if (k !== key) continue;

      let v = trimmed.slice(idx + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      return v || null;
    }

    return null;
  } catch {
    return null;
  }
}

export default async function handler(req: any, res: any) {
  try {
    const apiKey = process.env.OPENAI_API_KEY || readEnvLocalValue("OPENAI_API_KEY");
    if (!apiKey) {
      res.status(500).json({
        text: "",
        error: "OPENAI_API_KEY is missing. Add it to .env.local for vercel dev, then restart vercel dev.",
      });
      return;
    }

    const client = new OpenAI({ apiKey });

    const { telemetry, question } = req.body ?? {};

    const prompt = `
You are an executive launch readiness coach.

Use ONLY this telemetry (do not use outside knowledge):
${JSON.stringify(telemetry, null, 2)}

Your job: explain this week using cause → effect chains grounded in the telemetry fields.

Hard rules:
- Do NOT invent numbers.
- Do NOT recompute math.
- Do NOT reference metrics not present in the telemetry.
- Keep it short: 5–7 bullets total.
- Tone: boardroom, analytical.

Required structure (bullets):
1) One-sentence headline on what moved and why.
2) “Because → Therefore” chain explaining the readiness movement using the telemetry fields (capacity, utilization, regressionRisk, scopeGrowth, requiredCoveragePrev/Next, throughput, readinessPrev/Next).
3) Downside of the chosen action this week (must be specific; tie to the telemetry and/or common tradeoff of the action, without inventing values).
4) Biggest risk signal right now (choose ONE; reference the exact telemetry field).
5) ONE alternative action for next week (pick from: INCREASE_CAPACITY, IMPROVE_SCHEDULING, FREEZE_SCOPE, PUSH_RELEASE, INVEST_TOOLING) and justify with “Because → Therefore” grounded in the telemetry.

User question: ${question || "Explain this week."}
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: prompt }],
    });

    res.json({ text: completion.choices[0]?.message?.content ?? "" });
  } catch (err: any) {
    res.status(500).json({ text: "", error: err?.message ?? "Coach request failed" });
  }
}
