import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
      {
        protocol: 'https',
        hostname: 'pet-tourneys.vercel.app',
        port: '',
        pathname: '/images/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
