import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        port: '',
        pathname: '/avatars/**',
        search: '',
      },
      {
        protocol: 'http',
        hostname: 'localhost', // only for local development
        port: '3000',
        pathname: '/images/**',
        search: '',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
