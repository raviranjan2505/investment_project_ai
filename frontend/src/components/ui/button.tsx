import type { ReactElement, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
  {
    variants: {
      variant: {
        default: 'bg-slate-950 text-white shadow-sm hover:bg-slate-800',
        secondary: 'border border-slate-200 bg-white/90 text-slate-900 hover:bg-slate-100',
        outline: 'border border-slate-200 bg-transparent text-slate-900 hover:bg-slate-50',
        ghost: 'text-slate-900 hover:bg-slate-50',
        accent: 'bg-amber-700 text-white shadow-sm hover:bg-amber-800'
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-12 px-6 text-sm',
        icon: 'h-10 w-10 rounded-full'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  children: ReactNode;
}

export function Button({ className, variant, size, asChild = false, children, ...props }: ButtonProps): ReactElement {
  const Component = asChild ? Slot : 'button';

  return (
    <Component className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </Component>
  );
}

export { buttonVariants };
