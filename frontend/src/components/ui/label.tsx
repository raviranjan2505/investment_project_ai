import type { HTMLAttributes, ReactElement } from 'react';
import { cn } from '@/lib/utils';

export function Label({ className, ...props }: HTMLAttributes<HTMLSpanElement>): ReactElement {
  return <span className={cn('text-sm font-medium leading-none text-slate-700', className)} {...props} />;
}
