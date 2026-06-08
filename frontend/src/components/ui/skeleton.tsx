import type { HTMLAttributes, ReactElement } from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>): ReactElement {
  return <div className={cn('animate-pulse rounded-md bg-slate-200/80', className)} {...props} />;
}
