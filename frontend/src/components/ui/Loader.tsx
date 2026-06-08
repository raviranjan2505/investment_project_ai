import type { ReactElement } from 'react';
import { cn } from '@/lib/utils';

interface LoaderProps {
  fullPage?: boolean;
  className?: string;
}

export default function Loader({ fullPage = false, className }: LoaderProps): ReactElement {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        fullPage ? 'min-h-[calc(100vh-4rem)]' : 'h-full',
        className,
      )}
    >
      <div className='inline-flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-slate-200 border-t-slate-900' />
    </div>
  );
}
