import type { ReactElement } from 'react';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps): ReactElement {
  return (
    <div className="max-w-2xl space-y-4">
      <p className="inline-flex rounded-full border border-amber-200/80 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
      <p className="text-base leading-7 text-slate-600 sm:text-lg">{description}</p>
    </div>
  );
}
