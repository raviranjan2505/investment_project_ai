export function getApiBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (baseUrl === undefined || baseUrl.length === 0) {
    return 'http://localhost:4041/api';
  }

  return baseUrl;
}

export function getApiOrigin(): string {
  const apiBaseUrl = getApiBaseUrl();
  const origin = apiBaseUrl.endsWith('/api') ? apiBaseUrl.slice(0, -4) : apiBaseUrl;

  try {
    const parsed = new URL(origin);
    const isLocalHost =
      parsed.hostname === 'localhost' ||
      parsed.hostname === '127.0.0.1' ||
      parsed.hostname === '::1';

    if (isLocalHost && typeof window !== 'undefined') {
      const { protocol, hostname } = window.location;
      parsed.protocol = protocol;
      parsed.hostname = hostname;
      return parsed.toString().replace(/\/$/, '');
    }
  } catch {
    return origin;
  }

  return origin;
}

export function getSiteUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (siteUrl === undefined || siteUrl.length === 0) {
    return 'http://localhost:3001';
  }

  return siteUrl;
}

export function resolveApiAssetUrl(value: string): string {
  if (value.startsWith('http://') || value.startsWith('https://')) {
    try {
      const parsed = new URL(value);
      const isLocalHost =
        parsed.hostname === 'localhost' ||
        parsed.hostname === '127.0.0.1' ||
        parsed.hostname === '::1';

      if (isLocalHost && typeof window !== 'undefined') {
        const { protocol, hostname } = window.location;

        // Keep backend port/path, but point at the host users are actually visiting.
        parsed.protocol = protocol;
        parsed.hostname = hostname;

        return parsed.toString();
      }
    } catch {
      return value;
    }

    return value;
  }

  if (value.startsWith('/')) {
    return `${getApiOrigin()}${value}`;
  }

  return value;
}
