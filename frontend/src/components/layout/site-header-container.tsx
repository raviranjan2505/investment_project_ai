import type { ReactElement } from 'react';
import { SiteHeader } from '@/components/layout/site-header';

export async function SiteHeaderContainer(): Promise<ReactElement> {
  return <SiteHeader />;
}
