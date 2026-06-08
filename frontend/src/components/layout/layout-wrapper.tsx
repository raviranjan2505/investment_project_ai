'use client';

import type { ReactElement, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface LayoutWrapperProps {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
}

export function LayoutWrapper({
  children,
  header,
  footer,
}: LayoutWrapperProps): ReactElement {
  const pathname = usePathname();
  
  // Don't show header/footer on dashboard and admin routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen">
      {header}
      {children}
      {footer}
    </div>
  );
}
