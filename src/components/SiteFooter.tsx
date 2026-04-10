import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50/80 py-8 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="max-w-xl leading-relaxed">
          Assistive outputs may be inaccurate. Check facts before you publish.
          When you generate titles or submit to Google, inputs are processed on
          this application&apos;s server.
        </p>
        <Link
          href="/generator"
          className="shrink-0 font-medium text-teal-800 underline-offset-4 hover:underline dark:text-teal-400"
        >
          Open generator
        </Link>
      </div>
    </footer>
  );
}
