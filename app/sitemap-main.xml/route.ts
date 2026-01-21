import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET() {
  const baseUrl = 'https://www.staworth.com';

  // Static pages with their priorities and change frequencies
  const staticPages = [
    { url: baseUrl, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${baseUrl}/products`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/portfolio`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/presence`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/articles`, changeFrequency: 'weekly', priority: 0.9 },
  ];

  // Dynamic article pages
  const articlesDirectory = path.join(process.cwd(), 'src/content/articles');
  let articlePages: { url: string; lastModified?: string; changeFrequency: string; priority: number }[] = [];

  try {
    const articleFiles = fs.readdirSync(articlesDirectory);

    articlePages = articleFiles
      .filter((file) => file.endsWith('.md'))
      .map((file) => {
        const slug = file.replace('.md', '');
        const filePath = path.join(articlesDirectory, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContent);

        const lastModified = data.date ? new Date(data.date).toISOString() : undefined;

        return {
          url: `${baseUrl}/articles/${slug}`,
          lastModified,
          changeFrequency: 'monthly',
          priority: 0.7,
        };
      });
  } catch (error) {
    console.error('Error reading articles directory:', error);
  }

  const allPages = [...staticPages, ...articlePages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>${page.lastModified ? `\n    <lastmod>${page.lastModified}</lastmod>` : ''}
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
