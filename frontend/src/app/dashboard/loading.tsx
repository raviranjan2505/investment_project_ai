import type { ReactElement } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading(): ReactElement {
  return (
    <main className="shell space-y-8 pb-16 pt-8">
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="h-5 w-40 animate-pulse rounded-full bg-amber-100" />
          <div className="mt-6 h-10 w-2/3 animate-pulse rounded-full bg-slate-200" />
          <div className="mt-4 h-4 w-full animate-pulse rounded-full bg-slate-200/80" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <Skeleton className="h-4 w-28 bg-amber-100" />
              <div className="mt-6 space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
