import { NextResponse } from 'next/server';
import { feedBaseUrl, getArticleFeedItems } from '../../src/lib/feed';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapCdata(value: string): string {
  if (!value) return '';
  return `<![CDATA[${value.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;
}

function enclosureType(url: string): string | undefined {
  const lower = url.toLowerCase();
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.gif')) return 'image/gif';
  if (lower.endsWith('.svg')) return 'image/svg+xml';
  return undefined;
}

export async function GET() {
  const items = await getArticleFeedItems();
  const lastBuildDate = items[0]?.date ?? new Date();

  const rssItems = items
    .map((item) => {
      const categories = item.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('');
      const description = item.summaryHtml ? `<description>${wrapCdata(item.summaryHtml)}</description>` : '';
      const content = item.contentHtml
        ? `<content:encoded>${wrapCdata(item.contentHtml)}</content:encoded>`
        : '';
      const enclosureMime = item.imageUrl ? enclosureType(item.imageUrl) : undefined;
      const enclosure = item.imageUrl && enclosureMime
        ? `<enclosure url="${escapeXml(item.imageUrl)}" type="${enclosureMime}" />`
        : '';

      return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.url)}</link>
      <guid isPermaLink="true">${escapeXml(item.url)}</guid>
      <pubDate>${item.date.toUTCString()}</pubDate>
      <author>${escapeXml(item.author)}</author>
      ${categories}
      ${description}
      ${content}
      ${enclosure}
    </item>`;
    })
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Staworth Articles</title>
    <link>${feedBaseUrl}/articles</link>
    <description>Updates from Staworth's articles library.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>
    <atom:link href="${feedBaseUrl}/rss.xml" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
