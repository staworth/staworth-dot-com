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
  const updated = items[0]?.date ?? new Date();

  const entries = items
    .map((item) => {
      const categories = item.tags.map((tag) => `    <category term="${escapeXml(tag)}" />`).join('\n');
      const summary = item.summaryHtml
        ? `    <summary type="html">${escapeXml(item.summaryHtml)}</summary>`
        : '';
      const content = item.contentHtml
        ? `    <content type="html">${escapeXml(item.contentHtml)}</content>`
        : '';
      const enclosureMime = item.imageUrl ? enclosureType(item.imageUrl) : undefined;
      const imageLink = item.imageUrl && enclosureMime
        ? `    <link rel="enclosure" href="${escapeXml(item.imageUrl)}" type="${enclosureMime}" />`
        : '';

      return `  <entry>
    <title>${escapeXml(item.title)}</title>
    <id>${escapeXml(item.url)}</id>
    <link href="${escapeXml(item.url)}" />
    <updated>${item.date.toISOString()}</updated>
    <author>
      <name>${escapeXml(item.author)}</name>
    </author>
${categories}
${summary}
${content}
${imageLink}
  </entry>`;
    })
    .join('\n');

  const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Staworth Articles</title>
  <id>${feedBaseUrl}/atom.xml</id>
  <link href="${feedBaseUrl}/atom.xml" rel="self" />
  <link href="${feedBaseUrl}/articles" rel="alternate" type="text/html" />
  <updated>${updated.toISOString()}</updated>
  <author>
    <name>Staworth</name>
  </author>
${entries}
</feed>`;

  return new NextResponse(atom, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
    },
  });
}
