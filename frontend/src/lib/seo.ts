import type { Metadata } from 'next';
import { APP_NAME } from './constants';
import { getSiteUrl } from './api/config';

interface MetadataOptions {
  title: string;
  description: string;
  path: string;
}

export function buildMetadata(options: MetadataOptions): Metadata {
  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}${options.path}`;

  return {
    title: `${options.title} | ${APP_NAME}`,
    description: options.description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${options.title} | ${APP_NAME}`,
      description: options.description,
      url: canonicalUrl,
      siteName: APP_NAME,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${options.title} | ${APP_NAME}`,
      description: options.description,
    },
  };
}
