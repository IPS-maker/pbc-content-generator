import type { GeneratorForm, StrategyResult } from "./sheetSchema";

const REGION = "South Canterbury and Timaru";

function clean(s: string, max: number): string {
  const t = s.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max - 1).trimEnd()}…`;
}

/** Deterministic pillar + cluster titles when no AI key is configured. */
export function buildFallbackStrategy(form: GeneratorForm): StrategyResult {
  const topic = clean(form.topic || "your business growth", 80);
  const audience = clean(form.audience || "local customers", 60);
  const pillar_title = clean(
    `${topic}: a practical guide for ${audience} in ${REGION}`,
    120,
  );

  const clusters: string[] = [
    `What ${audience} in ${REGION} need to know first about ${topic}`,
    `Common mistakes ${audience} make with ${topic} (and what to do instead)`,
    `A simple step-by-step plan to improve ${topic} without overwhelm`,
    `How to choose the right help with ${topic} in ${REGION}`,
    `Your next step: a clear call to action for ${topic}`,
  ].map((t) => clean(t, 120));

  return {
    pillar_title,
    cluster_1: clusters[0]!,
    cluster_2: clusters[1]!,
    cluster_3: clusters[2]!,
    cluster_4: clusters[3]!,
    cluster_5: clusters[4]!,
  };
}
