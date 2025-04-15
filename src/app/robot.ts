import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const url = process.env.NEXT_PUBLIC_BASE_URL!;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/login',
        '/register',
        '/reset-password',
        '/forgot-password',
        '/admin',
        '/admin/*',
        '/auth/*',
      ],
    },
    sitemap: `${url}/sitemap.xml`,
    host: url,
  };
}
