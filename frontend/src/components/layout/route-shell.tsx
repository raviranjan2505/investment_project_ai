import type { ReactElement, ReactNode } from 'react';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeaderContainer } from '@/components/layout/site-header-container';

interface RouteShellProps {
  children: ReactNode;
}

export function RouteShell({ children }: RouteShellProps): ReactElement {
  return (
    <div className="min-h-screen">
      <SiteHeaderContainer />
      {children}
      <SiteFooter />
    </div>
  );
}
