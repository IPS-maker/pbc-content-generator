import { appendFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { NextResponse } from "next/server";
import type { GeneratorForm, StrategyResult } from "@/lib/sheetSchema";

export const runtime = "nodejs";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function writeDebugLog(payload: Record<string, unknown>) {
  const cwd = process.cwd();
  const lineObj = {
    sessionId: "80235b",
    timestamp: Date.now(),
    cwd,
    ...payload,
  };
  const line = `${JSON.stringify(lineObj)}\n`;
  console.error("[PBC_DEBUG]", lineObj);
  const paths = [
    join(cwd, "debug-80235b.log"),
    join(cwd, "..", "debug-80235b.log"),
    join(cwd, "pbc-web", "debug-80235b.log"),
    join(tmpdir(), "pbc-debug-80235b.log"),
  ];
  for (const p of paths) {
    try {
      appendFileSync(p, line, "utf8");
      break;
    } catch {
      /* try next path */
    }
  }
}

function responseLooksLikeHtml(text: string): boolean {
  const t = text.slice(0, 500).trimStart();
  return (
    t.startsWith("<") ||
    /<!DOCTYPE/i.test(text) ||
    /<html[\s>]/i.test(text)
  );
}

const AVATAR_MAX = 150;

function clip(s: string, max: number): string {
  const t = (s ?? "").trim();
  return t.length <= max ? t : t.slice(0, max);
}

/**
 * Query params for Apps Script doGet/doPost(e.parameter).
 * GET avoids POST body loss on Google's 302 redirect chain (see PBC spec).
 */
function toSheetParams(
  form: GeneratorForm,
  strategy: StrategyResult,
): URLSearchParams {
  const params = new URLSearchParams();
  params.set("business_name", form.business_name ?? "");
  params.set("industry", form.industry ?? "");
  params.set("email", form.email ?? "");
  params.set("phone", form.phone ?? "");
  params.set("website", form.website ?? "");
  params.set("topic", form.topic ?? "");
  params.set("topic_desc", clip(form.topic_desc, 500));
  params.set("audience", clip(form.audience, 400));
  params.set("goal", form.goal ?? "");
  params.set("tone", form.tone ?? "");
  params.set("platforms", form.platforms ?? "");
  params.set("keywords", clip(form.keywords, 300));
  params.set("competitors", clip(form.competitors, 300));
  params.set("avatar_who", clip(form.avatar_who, AVATAR_MAX));
  params.set("avatar_pain", clip(form.avatar_pain, AVATAR_MAX));
  params.set("avatar_tried", clip(form.avatar_tried, AVATAR_MAX));
  params.set("pillar_title", clip(strategy.pillar_title, 200));
  params.set("cluster_1", clip(strategy.cluster_1, 200));
  params.set("cluster_2", clip(strategy.cluster_2, 200));
  params.set("cluster_3", clip(strategy.cluster_3, 200));
  params.set("cluster_4", clip(strategy.cluster_4, 200));
  params.set("cluster_5", clip(strategy.cluster_5, 200));
  return params;
}

function buildGetUrl(scriptUrl: string, params: URLSearchParams): string {
  const u = new URL(scriptUrl);
  params.forEach((value, key) => {
    u.searchParams.append(key, value);
  });
  let href = u.toString();
  const maxLen = 1900;
  if (href.length > maxLen) {
    const trimKeys = [
      "topic_desc",
      "competitors",
      "audience",
      "keywords",
      "pillar_title",
      "cluster_1",
      "cluster_2",
      "cluster_3",
      "cluster_4",
      "cluster_5",
    ] as const;
    const p2 = new URLSearchParams(params);
    for (const k of trimKeys) {
      const v = p2.get(k);
      if (v && v.length > 80) {
        p2.set(k, `${v.slice(0, 77)}...`);
      }
      const u2 = new URL(scriptUrl);
      p2.forEach((val, key) => u2.searchParams.append(key, val));
      href = u2.toString();
      if (href.length <= maxLen) break;
    }
  }
  return href;
}

export async function POST(req: Request) {
  const scriptUrl = process.env.GOOGLE_SCRIPT_WEB_APP_URL?.trim();
  if (!scriptUrl) {
    writeDebugLog({
      hypothesisId: "H_sheet",
      location: "submit-sheet:POST",
      message: "missing_script_url",
      data: {},
    });
    return NextResponse.json(
      {
        error:
          "GOOGLE_SCRIPT_WEB_APP_URL is not set. Add it to .env.local (deployed Apps Script web app URL).",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isRecord(body) || !isRecord(body.form) || !isRecord(body.strategy)) {
    return NextResponse.json(
      { error: "Expected { form, strategy } in body" },
      { status: 400 },
    );
  }

  const form = body.form as GeneratorForm;
  const strategy = body.strategy as StrategyResult;
  const params = toSheetParams(form, strategy);

  let getUrl: string;
  try {
    getUrl = buildGetUrl(scriptUrl, params);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Bad script URL";
    writeDebugLog({
      hypothesisId: "H_url",
      location: "submit-sheet:POST",
      message: "invalid_script_url",
      data: { error: msg.slice(0, 120) },
    });
    return NextResponse.json(
      { error: "GOOGLE_SCRIPT_WEB_APP_URL is not a valid URL.", detail: msg },
      { status: 400 },
    );
  }

  writeDebugLog({
    hypothesisId: "H_redirect",
    location: "submit-sheet:POST",
    message: "sheet_get_prepared",
    data: {
      method: "GET",
      urlLength: getUrl.length,
      avatarClipped: AVATAR_MAX,
    },
  });

  try {
    const res = await fetch(getUrl, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
      headers: {
        Accept: "text/plain,*/*",
        "User-Agent": "Mozilla/5.0 (compatible; PBC-Content-Generator/1.0)",
      },
    });

    const text = await res.text();
    const ok = res.ok;
    const html = responseLooksLikeHtml(text);
    const trimmed = text.replace(/^\uFEFF/, "").trim();
    const plainOk = !html && /^OK$/i.test(trimmed);

    writeDebugLog({
      hypothesisId: "H_sheet",
      location: "submit-sheet:POST",
      message: "sheet_fetch_done",
      data: {
        method: "GET",
        status: res.status,
        ok,
        responseLooksLikeHtml: html,
        plainOk,
        responseSnippet: text.slice(0, 120),
      },
    });

    // #region agent log
    fetch("http://127.0.0.1:7557/ingest/9e99f3fd-edc5-4b60-901f-cf9d2c783281", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "80235b",
      },
      body: JSON.stringify({
        sessionId: "80235b",
        hypothesisId: "H_sheet",
        location: "api/submit-sheet/route.ts:POST",
        message: "sheet_fetch_done",
        data: {
          method: "GET",
          status: res.status,
          ok,
          responseLooksLikeHtml: html,
          plainOk,
          responseSnippet: text.slice(0, 80),
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    if (!ok) {
      return NextResponse.json(
        {
          error: `Google Script returned ${res.status}`,
          detail: text.slice(0, 500),
        },
        { status: 502 },
      );
    }

    if (html) {
      return NextResponse.json(
        {
          error:
            "Google returned a web page instead of plain text OK. Use the deployed Web app URL (ends with /exec), access set to Anyone, and redeploy if needed.",
          detail: text.slice(0, 400),
        },
        { status: 502 },
      );
    }

    if (!plainOk) {
      return NextResponse.json(
        {
          error:
            "Google Script response was not OK. Check Apps Script execution logs and that doPost returns ContentService.createTextOutput('OK').",
          detail: text.slice(0, 500),
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, status: res.status });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Submit failed";

    writeDebugLog({
      hypothesisId: "H_sheet",
      location: "submit-sheet:POST",
      message: "sheet_fetch_error",
      data: { error: msg.slice(0, 200) },
    });

    // #region agent log
    fetch("http://127.0.0.1:7557/ingest/9e99f3fd-edc5-4b60-901f-cf9d2c783281", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "80235b",
      },
      body: JSON.stringify({
        sessionId: "80235b",
        hypothesisId: "H_sheet",
        location: "api/submit-sheet/route.ts:POST",
        message: "sheet_fetch_error",
        data: { error: msg.slice(0, 200) },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
