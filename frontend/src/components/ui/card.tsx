import type { HTMLAttributes, ReactElement } from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>): ReactElement {
  return (
    <div
      className={cn(
        'rounded-[2rem] border border-slate-200/70 bg-white/75 text-slate-950 shadow-lg shadow-amber-950/5 backdrop-blur-xl',
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>): ReactElement {
  return <div className={cn('flex flex-col space-y-2 p-6', className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>): ReactElement {
  return <h3 className={cn('text-xl font-semibold tracking-tight', className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>): ReactElement {
  return <p className={cn('text-sm leading-6 text-slate-600', className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>): ReactElement {
  return <div className={cn('p-6 pt-0', className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>): ReactElement {
  return <div className={cn('flex items-center p-6 pt-0', className)} {...props} />;
}
