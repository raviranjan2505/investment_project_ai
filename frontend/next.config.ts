import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    cpus: 1,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4041',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '4041',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
