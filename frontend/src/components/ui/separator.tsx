import type { HTMLAttributes, ReactElement } from 'react';
import { cn } from '@/lib/utils';

export function Separator({ className, ...props }: HTMLAttributes<HTMLDivElement>): ReactElement {
  return <div className={cn('h-px w-full bg-slate-200/70', className)} {...props} />;
}
