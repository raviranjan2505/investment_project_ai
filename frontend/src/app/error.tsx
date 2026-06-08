'use client';

import { useEffect, type ReactElement } from 'react';
import { ErrorState } from '@/components/ui/error-state';

interface ErrorPageProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps): ReactElement {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="shell pb-16 pt-10">
      <ErrorState description={error.message || 'Unexpected application error.'} />
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Try again
      </button>
    </main>
  );
}

