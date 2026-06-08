import type { HTMLAttributes, ReactElement } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-slate-900 text-white',
        secondary: 'border-transparent bg-slate-100 text-slate-700',
        accent: 'border-transparent bg-amber-100 text-amber-800',
        success: 'border-transparent bg-emerald-100 text-emerald-700',
        outline: 'border-slate-200 bg-white/60 text-slate-700'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

interface BadgeProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps): ReactElement {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
