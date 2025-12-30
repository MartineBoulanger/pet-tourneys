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
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        port: '',
        pathname: '/**',
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
        hostname: '*.petmastersleague.com',
        port: '',
        pathname: '/images/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net', // Contentful images may not be needed anymore soon
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
