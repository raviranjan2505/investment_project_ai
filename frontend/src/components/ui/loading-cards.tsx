import type { ReactElement } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingCardsProps {
  count?: number;
}

export function LoadingCards({ count = 6 }: LoadingCardsProps): ReactElement {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={`loading-card-${index}`} className="glass-panel overflow-hidden">
          <CardContent className="space-y-4 p-5">
            <Skeleton className="h-52 rounded-[1.5rem] bg-amber-100/80" />
            <Skeleton className="h-4 w-20 rounded-full bg-amber-100/80" />
            <Skeleton className="h-7 w-3/4 rounded-full" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-2/3 rounded-full" />
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-10 flex-1 rounded-full" />
              <Skeleton className="h-10 w-28 rounded-full bg-amber-100/80" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
