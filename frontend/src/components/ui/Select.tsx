import type { ChangeEventHandler, ReactElement } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type OptionItem = {
  value: string;
  label: string;
};

interface SelectProps {
  label?: string;
  value: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  options: OptionItem[];
  className?: string;
}

export default function Select({ label, value, onChange, options, className }: SelectProps): ReactElement {
  return (
    <div className={cn('space-y-2', className)}>
      {label ? <label className='block text-sm font-medium text-slate-700'>{label}</label> : null}
      <div className='relative'>
        <select
          value={value}
          onChange={onChange}
          className='flex h-11 w-full appearance-none rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 pr-10 text-sm text-slate-900 shadow-sm outline-none transition focus-visible:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-300/40 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
      </div>
    </div>
  );
}
