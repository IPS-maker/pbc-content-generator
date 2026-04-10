import Link from "next/link";

const steps = [
  {
    n: "1",
    title: "Your business",
    body: "Name, industry, and contact details so we can keep submissions organised.",
  },
  {
    n: "2",
    title: "Topic and ideal customer",
    body: "What you want to be known for, who you serve, and a short ideal customer avatar.",
  },
  {
    n: "3",
    title: "Titles you can use",
    body: "One pillar title and five cluster titles tuned for South Canterbury and Timaru. Download them or send the row to your Google Sheet.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-950/[0.06] via-white to-white dark:from-teal-950/30 dark:via-zinc-950 dark:to-zinc-950">
        <div className="mx-auto max-w-5xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal-900/80 dark:text-teal-300/90">
            Pivot Business Consulting
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl sm:leading-[1.1]">
            Content titles built for small businesses in South Canterbury
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            Run the guided generator to produce a pillar article title and five
            supporting cluster titles. Use it for coaching clients, internal
            tests, or your own marketing plan before you write the full
            articles.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/generator"
              className="inline-flex items-center justify-center rounded-full bg-teal-800 px-7 py-3.5 text-base font-medium text-white shadow-sm transition hover:bg-teal-900 dark:bg-teal-700 dark:hover:bg-teal-600"
            >
              Run test data
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white/80 px-6 py-3.5 text-base font-medium text-zinc-800 backdrop-blur hover:bg-white dark:border-zinc-600 dark:bg-zinc-900/80 dark:text-zinc-100 dark:hover:bg-zinc-900"
            >
              How it works
            </a>
          </div>
          <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-500">
            Local focus: Timaru, South Canterbury, and the surrounding district.
          </p>
        </div>
      </section>

      <section
        id="how-it-works"
        className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6"
      >
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          How it works
        </h2>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Three short steps. Most people finish in a few minutes.
        </p>
        <ul className="mt-10 grid gap-6 sm:grid-cols-3">
          {steps.map((s) => (
            <li
              key={s.n}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-900 dark:bg-teal-900/40 dark:text-teal-100">
                {s.n}
              </span>
              <h3 className="mt-4 font-semibold text-zinc-900 dark:text-zinc-50">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {s.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50/90 py-14 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Sample data for testing
          </h2>
          <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
            Paste or adapt these values in the generator to exercise the flow and
            your Google Sheet connection. Replace contacts with fictitious
            details if you prefer.
          </p>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-950">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Step 1 — Business
              </h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="font-medium text-zinc-800 dark:text-zinc-200">
                    Business name
                  </dt>
                  <dd className="mt-0.5 text-zinc-600 dark:text-zinc-400">
                    Timaru Test Bakery Ltd
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-zinc-800 dark:text-zinc-200">
                    Industry
                  </dt>
                  <dd className="mt-0.5 text-zinc-600 dark:text-zinc-400">
                    retail
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-zinc-800 dark:text-zinc-200">
                    Email / phone
                  </dt>
                  <dd className="mt-0.5 text-zinc-600 dark:text-zinc-400">
                    hello@timarutestbakery.example · 03 000 0000
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-zinc-800 dark:text-zinc-200">
                    Website
                  </dt>
                  <dd className="mt-0.5 text-zinc-600 dark:text-zinc-400">
                    https://example.org/timarutestbakery
                  </dd>
                </div>
              </dl>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-950">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Step 2 — Topic and avatar
              </h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="font-medium text-zinc-800 dark:text-zinc-200">
                    Main topic
                  </dt>
                  <dd className="mt-0.5 text-zinc-600 dark:text-zinc-400">
                    Ordering wholesale for a small food retail shop
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-zinc-800 dark:text-zinc-200">
                    Topic description
                  </dt>
                  <dd className="mt-0.5 text-zinc-600 dark:text-zinc-400">
                    How independent retailers in South Canterbury choose
                    suppliers, manage stock, and avoid waste without a big head
                    office team.
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-zinc-800 dark:text-zinc-200">
                    Target audience
                  </dt>
                  <dd className="mt-0.5 text-zinc-600 dark:text-zinc-400">
                    Owner-operators of cafés and small food shops in Timaru and
                    Geraldine.
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-zinc-800 dark:text-zinc-200">
                    Ideal customer (short)
                  </dt>
                  <dd className="mt-0.5 text-zinc-600 dark:text-zinc-400">
                    <strong className="font-medium text-zinc-800 dark:text-zinc-200">
                      Who:
                    </strong>{" "}
                    Sam, early forties, runs a high-street café.{" "}
                    <strong className="font-medium text-zinc-800 dark:text-zinc-200">
                      Pain:
                    </strong>{" "}
                    Unreliable deliveries and rising costs.{" "}
                    <strong className="font-medium text-zinc-800 dark:text-zinc-200">
                      Tried:
                    </strong>{" "}
                    Switching suppliers often without a clear system.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-500">
            Suggested options for dropdowns: goal <strong>leads</strong>, tone{" "}
            <strong>friendly</strong>, platforms{" "}
            <strong>website</strong> and <strong>instagram</strong>, keywords{" "}
            <strong>
              timaru wholesale, south canterbury suppliers, small retail stock
            </strong>
            .
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Before you go live with clients
        </h2>
        <ul className="mt-4 max-w-2xl list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          <li>
            Set <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">GOOGLE_SCRIPT_WEB_APP_URL</code>{" "}
            in <code className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800">.env.local</code>{" "}
            after your Apps Script web app is deployed and tested.
          </li>
          <li>
            Optional: add <code className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800">OPENAI_API_KEY</code>{" "}
            for richer title suggestions. Without it, the app uses a South
            Canterbury template.
          </li>
        </ul>
        <div className="mt-8">
          <Link
            href="/generator"
            className="inline-flex items-center justify-center rounded-full bg-teal-800 px-7 py-3.5 text-base font-medium text-white hover:bg-teal-900 dark:bg-teal-700 dark:hover:bg-teal-600"
          >
            Open the generator
          </Link>
        </div>
      </section>
    </div>
  );
}
