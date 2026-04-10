import type { GeneratorForm, StrategyResult } from "./sheetSchema";

const SYSTEM = `You are a content strategist for Pivot Business Consulting in New Zealand.
Output JSON only. British English spelling in titles.
Titles must suit small businesses in South Canterbury and Timaru.
Use StoryBrand thinking: customer as hero, business as guide (do not put the business name in every title).
No semicolons or em dashes in titles. No jargon words: leverage, optimise, robust, seamless, synergy, innovative, holistic, utilise, facilitate.
Return exactly one pillar title and five cluster article titles. Cluster titles should support the pillar and be distinct angles.
JSON shape: {"pillar_title":"...","cluster_1":"...","cluster_2":"...","cluster_3":"...","cluster_4":"...","cluster_5":"..."}
Each title max 120 characters.`;

export async function generateStrategyWithOpenAI(
  form: GeneratorForm,
  apiKey: string,
  model: string,
): Promise<StrategyResult> {
  const user = JSON.stringify({
    business_name: form.business_name,
    industry: form.industry,
    topic: form.topic,
    topic_desc: form.topic_desc,
    audience: form.audience,
    goal: form.goal,
    tone: form.tone,
    platforms: form.platforms,
    keywords: form.keywords,
    competitors: form.competitors,
    avatar_who: form.avatar_who,
    avatar_pain: form.avatar_pain,
    avatar_tried: form.avatar_tried,
    region: "South Canterbury, Timaru, New Zealand",
  });

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: `Generate pillar and cluster titles for:\n${user}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${err.slice(0, 500)}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const raw = data.choices?.[0]?.message?.content;
  if (!raw) throw new Error("Empty OpenAI response");

  const parsed = JSON.parse(raw) as Record<string, string>;
  const out: StrategyResult = {
    pillar_title: String(parsed.pillar_title ?? "").trim(),
    cluster_1: String(parsed.cluster_1 ?? "").trim(),
    cluster_2: String(parsed.cluster_2 ?? "").trim(),
    cluster_3: String(parsed.cluster_3 ?? "").trim(),
    cluster_4: String(parsed.cluster_4 ?? "").trim(),
    cluster_5: String(parsed.cluster_5 ?? "").trim(),
  };

  if (
    !out.pillar_title ||
    !out.cluster_1 ||
    !out.cluster_2 ||
    !out.cluster_3 ||
    !out.cluster_4 ||
    !out.cluster_5
  ) {
    throw new Error("Model returned incomplete strategy JSON");
  }

  return out;
}
