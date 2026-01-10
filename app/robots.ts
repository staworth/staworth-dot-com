import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.staworth.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/loading/'], // Prevent crawling API routes and loading states
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
