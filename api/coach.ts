import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: any, res: any) {
  const { telemetry, question } = req.body ?? {};

  const prompt = `
You are an executive launch readiness coach.

Use ONLY this telemetry:
${JSON.stringify(telemetry, null, 2)}

Rules:
- Do NOT invent numbers.
- Do NOT recompute math.
- Explain causality and feedback loops.
- Tone: boardroom, analytical.
- Respond in 4–6 bullets.

User question: ${question || "Explain this week."}
`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: prompt }],
  });

  res.json({ text: completion.choices[0]?.message?.content ?? "" });
}
