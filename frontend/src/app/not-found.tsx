import type { ReactElement } from 'react';
import Link from 'next/link';

export default function NotFound(): ReactElement {
  return (
    <main className="shell space-y-6 pb-16 pt-14 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
        404
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
        This gift page does not exist
      </h1>
      <p className="mx-auto max-w-xl text-base leading-7 text-slate-600">
        The product may have been removed, renamed, or is not available in the current catalog.
      </p>
      <Link
        href="/gifts"
        className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Browse all gifts
      </Link>
    </main>
  );
}


