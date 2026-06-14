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
        hostname: 'render.worldofwarcraft.com',
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2678400, // 31 days
    maximumResponseBody: 5_000_000, // image size limitation set to 5MB instead of 50MB
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // serves for uploading the images to Cloudinary
    },
  },
};

export default nextConfig;
