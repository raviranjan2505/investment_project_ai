import type { InputHTMLAttributes, ReactElement } from 'react';
import { cn } from '@/lib/utils';

export function Input({ className, type = 'text', ...props }: InputHTMLAttributes<HTMLInputElement>): ReactElement {
  return (
    <input
      type={type}
      className={cn(
        'flex h-11 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus-visible:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-300/40 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export default Input;
