import { NextResponse } from "next/server";
import { generateStrategyWithOpenAI } from "@/lib/openaiStrategy";
import { buildFallbackStrategy } from "@/lib/strategyFallback";
import type { GeneratorForm } from "@/lib/sheetSchema";

export const runtime = "nodejs";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isRecord(body)) {
    return NextResponse.json({ error: "Expected object body" }, { status: 400 });
  }

  const form = body as GeneratorForm;
  const key = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  let usedOpenAI = false;

  try {
    const strategy = key
      ? await generateStrategyWithOpenAI(form, key, model)
      : buildFallbackStrategy(form);
    usedOpenAI = Boolean(key);

    // #region agent log
    fetch("http://127.0.0.1:7557/ingest/9e99f3fd-edc5-4b60-901f-cf9d2c783281", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "80235b",
      },
      body: JSON.stringify({
        sessionId: "80235b",
        hypothesisId: "H_strategy",
        location: "api/strategy/route.ts:POST",
        message: "strategy_ok",
        data: { usedOpenAI },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    return NextResponse.json({ strategy, usedOpenAI });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Strategy generation failed";

    // #region agent log
    fetch("http://127.0.0.1:7557/ingest/9e99f3fd-edc5-4b60-901f-cf9d2c783281", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "80235b",
      },
      body: JSON.stringify({
        sessionId: "80235b",
        hypothesisId: "H_strategy",
        location: "api/strategy/route.ts:POST",
        message: "strategy_error",
        data: { error: msg.slice(0, 200) },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
