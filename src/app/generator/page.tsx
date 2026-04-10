"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import {
  GOALS,
  INDUSTRIES,
  PLATFORM_OPTIONS,
  TONES,
  type GeneratorForm,
  type StrategyResult,
} from "@/lib/sheetSchema";

const emptyForm = (): GeneratorForm => ({
  business_name: "",
  industry: "professional",
  email: "",
  phone: "",
  website: "",
  topic: "",
  topic_desc: "",
  audience: "",
  goal: "awareness",
  tone: "professional",
  platforms: "",
  keywords: "",
  competitors: "",
  avatar_who: "",
  avatar_pain: "",
  avatar_tried: "",
});

export default function GeneratorPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<GeneratorForm>(emptyForm);
  const [platformSet, setPlatformSet] = useState<Set<string>>(new Set());
  const [strategy, setStrategy] = useState<StrategyResult | null>(null);
  const [usedOpenAI, setUsedOpenAI] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitOk, setSubmitOk] = useState<string | null>(null);

  const syncPlatforms = useCallback((next: Set<string>) => {
    setPlatformSet(next);
    setForm((f) => ({ ...f, platforms: [...next].join(",") }));
  }, []);

  const togglePlatform = (key: string) => {
    const next = new Set(platformSet);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    syncPlatforms(next);
  };

  const update =
    (field: keyof GeneratorForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
    };

  const canStep1 = useMemo(() => {
    return (
      form.business_name.trim().length > 0 &&
      form.email.trim().length > 0 &&
      form.industry.length > 0
    );
  }, [form.business_name, form.email, form.industry]);

  const canStep2 = useMemo(() => {
    return (
      form.topic.trim().length > 0 &&
      form.topic_desc.trim().length > 0 &&
      form.audience.trim().length > 0
    );
  }, [form.topic, form.topic_desc, form.audience]);

  const runStrategy = async () => {
    setError(null);
    setSubmitOk(null);
    setLoading(true);
    try {
      const res = await fetch("/api/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as {
        strategy?: StrategyResult;
        usedOpenAI?: boolean;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Strategy request failed");
      if (!data.strategy) throw new Error("No strategy returned");
      setStrategy(data.strategy);
      setUsedOpenAI(Boolean(data.usedOpenAI));
      setStep(3);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const submitSheet = async () => {
    if (!strategy) return;
    setError(null);
    setSubmitOk(null);
    setLoading(true);
    try {
      const res = await fetch("/api/submit-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form, strategy }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Submit failed");
      setSubmitOk("Submitted to Google Sheet.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submit failed");
    } finally {
      setLoading(false);
    }
  };

  const downloadMarkdown = () => {
    if (!strategy) return;
    const md = [
      `# ${strategy.pillar_title}`,
      "",
      `**Business:** ${form.business_name}`,
      `**Topic:** ${form.topic}`,
      "",
      "## Cluster articles",
      "",
      `1. ${strategy.cluster_1}`,
      `2. ${strategy.cluster_2}`,
      `3. ${strategy.cluster_3}`,
      `4. ${strategy.cluster_4}`,
      `5. ${strategy.cluster_5}`,
      "",
    ].join("\n");
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pbc-strategy-titles.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto flex min-h-full max-w-2xl flex-col gap-6 px-4 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Content generator
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Titles are assistive only. Verify local claims before you publish.
          Use <Link href="/" className="text-teal-800 underline-offset-4 hover:underline dark:text-teal-400">Home</Link>{" "}
          for the sample test data. Submit sends a row to your Google Sheet when
          configured.
        </p>
        <ol className="mt-2 flex gap-2 text-xs text-zinc-500">
          <li className={step === 1 ? "font-semibold text-zinc-900" : ""}>
            1. Business
          </li>
          <li>·</li>
          <li className={step === 2 ? "font-semibold text-zinc-900" : ""}>
            2. Strategy and avatar
          </li>
          <li>·</li>
          <li className={step === 3 ? "font-semibold text-zinc-900" : ""}>
            3. Titles
          </li>
        </ol>
      </header>

      {error && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          role="alert"
        >
          {error}
        </div>
      )}
      {submitOk && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {submitOk}
        </div>
      )}

      {step === 1 && (
        <section className="flex flex-col gap-4">
          <Field label="Business name" required>
            <input
              className="w-full rounded border border-zinc-300 px-3 py-2 text-sm"
              value={form.business_name}
              onChange={update("business_name")}
              autoComplete="organization"
            />
          </Field>
          <Field label="Industry" required>
            <select
              className="w-full rounded border border-zinc-300 px-3 py-2 text-sm"
              value={form.industry}
              onChange={update("industry")}
            >
              {INDUSTRIES.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Email" required>
            <input
              type="email"
              className="w-full rounded border border-zinc-300 px-3 py-2 text-sm"
              value={form.email}
              onChange={update("email")}
              autoComplete="email"
            />
          </Field>
          <Field label="Phone">
            <input
              className="w-full rounded border border-zinc-300 px-3 py-2 text-sm"
              value={form.phone}
              onChange={update("phone")}
              autoComplete="tel"
            />
          </Field>
          <Field label="Website">
            <input
              className="w-full rounded border border-zinc-300 px-3 py-2 text-sm"
              value={form.website}
              onChange={update("website")}
              placeholder="https://"
            />
          </Field>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
              disabled={!canStep1}
              onClick={() => setStep(2)}
            >
              Next
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="flex flex-col gap-4">
          <Field label="Main topic" required>
            <input
              className="w-full rounded border border-zinc-300 px-3 py-2 text-sm"
              value={form.topic}
              onChange={update("topic")}
            />
          </Field>
          <Field label="Topic description" required>
            <textarea
              className="min-h-[88px] w-full rounded border border-zinc-300 px-3 py-2 text-sm"
              value={form.topic_desc}
              onChange={update("topic_desc")}
            />
          </Field>
          <Field label="Target audience" required>
            <textarea
              className="min-h-[72px] w-full rounded border border-zinc-300 px-3 py-2 text-sm"
              value={form.audience}
              onChange={update("audience")}
            />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Business goal">
              <select
                className="w-full rounded border border-zinc-300 px-3 py-2 text-sm"
                value={form.goal}
                onChange={update("goal")}
              >
                {GOALS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Tone">
              <select
                className="w-full rounded border border-zinc-300 px-3 py-2 text-sm"
                value={form.tone}
                onChange={update("tone")}
              >
                {TONES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Platforms">
            <div className="flex flex-wrap gap-3 text-sm">
              {PLATFORM_OPTIONS.map((p) => (
                <label key={p.key} className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={platformSet.has(p.key)}
                    onChange={() => togglePlatform(p.key)}
                  />
                  {p.label}
                </label>
              ))}
            </div>
          </Field>
          <Field label="Keywords (comma-separated)">
            <input
              className="w-full rounded border border-zinc-300 px-3 py-2 text-sm"
              value={form.keywords}
              onChange={update("keywords")}
            />
          </Field>
          <Field label="Competitors">
            <textarea
              className="min-h-[64px] w-full rounded border border-zinc-300 px-3 py-2 text-sm"
              value={form.competitors}
              onChange={update("competitors")}
            />
          </Field>
          <h2 className="text-sm font-semibold text-zinc-900">
            Ideal customer avatar
          </h2>
          <Field label="Who is your ideal customer?">
            <textarea
              className="min-h-[72px] w-full rounded border border-zinc-300 px-3 py-2 text-sm"
              value={form.avatar_who}
              onChange={update("avatar_who")}
            />
          </Field>
          <Field label="Their biggest pain points?">
            <textarea
              className="min-h-[72px] w-full rounded border border-zinc-300 px-3 py-2 text-sm"
              value={form.avatar_pain}
              onChange={update("avatar_pain")}
            />
          </Field>
          <Field label="What have they already tried?">
            <textarea
              className="min-h-[72px] w-full rounded border border-zinc-300 px-3 py-2 text-sm"
              value={form.avatar_tried}
              onChange={update("avatar_tried")}
            />
          </Field>
          <div className="flex justify-between gap-2">
            <button
              type="button"
              className="rounded-full border border-zinc-300 px-4 py-2 text-sm"
              onClick={() => setStep(1)}
            >
              Back
            </button>
            <button
              type="button"
              className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
              disabled={!canStep2 || loading}
              onClick={() => void runStrategy()}
            >
              {loading ? "Working…" : "Generate titles"}
            </button>
          </div>
        </section>
      )}

      {step === 3 && strategy && (
        <section className="flex flex-col gap-4">
          <p className="text-sm text-zinc-600">
            {usedOpenAI
              ? "Titles generated with OpenAI (see OPENAI_API_KEY)."
              : "Titles generated with the built-in Timaru / South Canterbury template. Set OPENAI_API_KEY for richer titles."}
          </p>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm">
            <p className="font-semibold text-zinc-900">Pillar</p>
            <p className="mt-1 text-zinc-800">{strategy.pillar_title}</p>
          </div>
          <ul className="list-decimal space-y-2 pl-5 text-sm text-zinc-800">
            <li>{strategy.cluster_1}</li>
            <li>{strategy.cluster_2}</li>
            <li>{strategy.cluster_3}</li>
            <li>{strategy.cluster_4}</li>
            <li>{strategy.cluster_5}</li>
          </ul>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-full border border-zinc-300 px-4 py-2 text-sm"
              onClick={() => setStep(2)}
            >
              Back to edit
            </button>
            <button
              type="button"
              className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
              disabled={loading}
              onClick={() => void submitSheet()}
            >
              Submit to Google Sheet
            </button>
            <button
              type="button"
              className="rounded-full border border-zinc-300 px-4 py-2 text-sm"
              onClick={downloadMarkdown}
            >
              Download titles (.md)
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-zinc-800">
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </span>
      {children}
    </label>
  );
}
