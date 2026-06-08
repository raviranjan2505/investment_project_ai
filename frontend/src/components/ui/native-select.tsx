import type { SelectHTMLAttributes, ReactElement } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type NativeSelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function NativeSelect({ className, children, ...props }: NativeSelectProps): ReactElement {
  return (
    <div className="relative">
      <select
        className={cn(
          'flex h-11 w-full appearance-none rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 pr-10 text-sm text-slate-900 shadow-sm outline-none transition focus-visible:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-300/40 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}
