import type { ReactElement } from 'react';
import { LoadingCards } from '@/components/ui/loading-cards';

export default function Loading(): ReactElement {
  return (
    <main className="shell space-y-8 pb-16 pt-8">
      <div className="space-y-4">
        <div className="h-4 w-32 animate-pulse rounded-full bg-amber-100" />
        <div className="h-12 w-2/3 animate-pulse rounded-full bg-slate-200" />
        <div className="h-6 w-full animate-pulse rounded-full bg-slate-200/80" />
      </div>
      <LoadingCards />
    </main>
  );
}


