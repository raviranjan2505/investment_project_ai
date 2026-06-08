import type { Metadata } from 'next';
import type { ReactElement, ReactNode } from 'react';
import { SiteHeaderContainer } from '@/components/layout/site-header-container';
import { SiteFooter } from '@/components/layout/site-footer';
import { LayoutWrapper } from '@/components/layout/layout-wrapper';
import { APP_NAME } from '@/lib/constants';
import { buildMetadata } from '@/lib/seo';
import './globals.css';

export const metadata: Metadata = buildMetadata({
  title: APP_NAME,
  description:
    'Grow your wealth with smart investments. Invest in high-yield plans and earn competitive returns with our secure investment platform.',
  path: '/',
});

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({
  children,
}: RootLayoutProps): Promise<ReactElement> {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <LayoutWrapper
          header={<SiteHeaderContainer />}
          footer={<SiteFooter />}
        >
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
