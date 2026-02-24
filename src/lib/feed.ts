import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { visit } from 'unist-util-visit';
import type { Schema } from 'hast-util-sanitize';

const BASE_URL = 'https://www.staworth.com';

export type FeedItem = {
  slug: string;
  url: string;
  title: string;
  author: string;
  date: Date;
  tags: string[];
  summaryHtml: string;
  contentHtml: string;
  imageUrl?: string;
};

const sanitizeSchema: Schema = {
  ...defaultSchema,
  tagNames: Array.from(
    new Set([
      ...(defaultSchema.tagNames ?? []),
      'img',
      'video',
      'source',
      'figure',
      'figcaption',
      'span',
    ])
  ),
  attributes: {
    ...defaultSchema.attributes,
    a: Array.from(
      new Set([...(defaultSchema.attributes?.a ?? []), 'href', 'title', 'target', 'rel'])
    ),
    img: Array.from(
      new Set([...(defaultSchema.attributes?.img ?? []), 'src', 'alt', 'title', 'width', 'height', 'loading'])
    ),
    video: ['src', 'poster', 'controls', 'autoplay', 'loop', 'muted', 'playsinline'],
    source: ['src', 'type'],
  },
};

function normalizeUrl(url: string, baseUrl: string): string {
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:') || url.startsWith('tel:')) {
    return url;
  }

  if (url.startsWith('#')) {
    return url;
  }

  const publicIndex = url.indexOf('/public/');
  if (publicIndex !== -1) {
    const stripped = url.slice(publicIndex + '/public'.length);
    return `${baseUrl}${stripped}`;
  }

  if (url.startsWith('/')) {
    return `${baseUrl}${url}`;
  }

  const cleaned = url.replace(/^\.\//, '').replace(/^\.\.\//, '');
  return `${baseUrl}/${cleaned}`;
}

function rehypeAbsoluteUrls(options: { baseUrl: string }) {
  return (tree: unknown) => {
    visit(tree as any, 'element', (node: { tagName?: string; properties?: Record<string, unknown> }) => {
      if (!node.properties) return;
      if (node.tagName === 'a' && typeof node.properties.href === 'string') {
        node.properties.href = normalizeUrl(node.properties.href, options.baseUrl);
      }
      if ((node.tagName === 'img' || node.tagName === 'video' || node.tagName === 'source') && typeof node.properties.src === 'string') {
        node.properties.src = normalizeUrl(node.properties.src, options.baseUrl);
      }
    });
  };
}

async function markdownToHtml(markdown: string, baseUrl: string): Promise<string> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeAbsoluteUrls, { baseUrl })
    .use(rehypeStringify);

  const file = await processor.process(markdown);
  return String(file);
}

function parseDate(dateValue: unknown, fallback: Date): Date {
  if (typeof dateValue === 'string') {
    const parsed = new Date(dateValue);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return fallback;
}

function imageToAbsolute(imagePath: string | undefined, baseUrl: string): string | undefined {
  if (!imagePath || typeof imagePath !== 'string') return undefined;
  const cleaned = imagePath.replace(/^\.\.\/\.\.\/\.\.\/public/, '');
  return normalizeUrl(cleaned, baseUrl);
}

export async function getArticleFeedItems(options?: {
  articlesDirectory?: string;
  baseUrl?: string;
}): Promise<FeedItem[]> {
  const baseUrl = options?.baseUrl ?? BASE_URL;
  const articlesDirectory = options?.articlesDirectory
    ?? path.join(process.cwd(), 'src/content/articles');
  const filenames = fs.readdirSync(articlesDirectory).filter((filename) => filename.endsWith('.md'));

  const items = await Promise.all(
    filenames.map(async (filename) => {
      const slug = filename.replace(/\.md$/, '');
      const filePath = path.join(articlesDirectory, filename);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);
      const stats = fs.statSync(filePath);

      const date = parseDate(data.date, stats.mtime);
      const title = typeof data.title === 'string' ? data.title : slug;
      const author = typeof data.author === 'string' ? data.author : 'Staworth';
      const tags = Array.isArray(data.tags) ? data.tags.map((tag) => String(tag)) : [];
      const summarySource = typeof data.short_description === 'string' ? data.short_description : '';

      const summaryHtml = summarySource ? await markdownToHtml(summarySource, baseUrl) : '';
      const contentHtml = await markdownToHtml(content, baseUrl);

      return {
        slug,
        url: `${baseUrl}/articles/${slug}`,
        title,
        author,
        date,
        tags,
        summaryHtml,
        contentHtml,
        imageUrl: imageToAbsolute(data.preview_image || data.header_image, baseUrl),
      } satisfies FeedItem;
    })
  );

  return items.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export const feedBaseUrl = BASE_URL;
