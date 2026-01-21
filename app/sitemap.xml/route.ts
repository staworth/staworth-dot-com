import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://www.staworth.com';

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-main.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://beefy.staworth.com/sitemap.xml</loc>
  </sitemap>
</sitemapindex>`;

  return new NextResponse(sitemapIndex, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
