import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.staworth.com';

  // Static pages with their priorities and change frequencies
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/presence`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // Dynamic article pages
  const articlesDirectory = path.join(process.cwd(), 'src/content/articles');
  let articlePages: MetadataRoute.Sitemap = [];

  try {
    const articleFiles = fs.readdirSync(articlesDirectory);

    articlePages = articleFiles
      .filter((file) => file.endsWith('.md'))
      .map((file) => {
        const slug = file.replace('.md', '');
        const filePath = path.join(articlesDirectory, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContent);

        // Use the article date from frontmatter if available
        const lastModified = data.date ? new Date(data.date) : new Date();

        return {
          url: `${baseUrl}/articles/${slug}`,
          lastModified,
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        };
      });
  } catch (error) {
    console.error('Error reading articles directory:', error);
  }

  return [...staticPages, ...articlePages];
}
