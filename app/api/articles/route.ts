import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export async function GET() {
  try {
    const articlesDirectory = path.join(process.cwd(), 'src/content/articles');
    const filenames = fs.readdirSync(articlesDirectory);

    const articles = filenames
      .filter(filename => filename.endsWith('.md'))
      .map(filename => {
        const slug = filename.replace(/\.md$/, '');
        const filePath = path.join(articlesDirectory, filename);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContent);

        const tags = data.tags?.map((tag: string) => tag.toUpperCase()) || ['ARTICLE'];

        return {
          href: data.external_url || `/articles/${slug}`,
          title: data.title || slug,
          date: data.date ? formatDate(data.date) : formatDate(new Date().toISOString()),
          category: tags[0],
          tags: tags,
          description: data.short_description || '',
          headerMediaType: data.header_media_type || null,
          image: data.preview_image?.replace(/^\.\.\/\.\.\/\.\.\/public/, '')
            || data.header_image?.replace(/^\.\.\/\.\.\/\.\.\/public/, '')
            || '/logos/Staworth_1_1_Black.webp',
        };
      });

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error reading markdown articles:', error);
    return NextResponse.json([]);
  }
}
