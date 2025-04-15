import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Wow Pet Community',
    short_name: 'WoWPetComm',
    description:
      'WoW Pet Community for all things pet battling and battle pets related',
    start_url: '/',
    theme_color: '#202020',
    background_color: '#202020',
    display: 'standalone',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
