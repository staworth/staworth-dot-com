import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { getArticleFeedItems } from './feed';

const BASE_URL = 'https://example.com';

function writeFixture(dir: string, filename: string, content: string) {
  fs.writeFileSync(path.join(dir, filename), content, 'utf8');
}

describe('getArticleFeedItems', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'feed-test-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('parses frontmatter and generates HTML content with absolute URLs', async () => {
    writeFixture(
      tempDir,
      'sample.md',
      `---
title: "Hello World"
author: "Jack"
date: 2024-05-31T12:00:00Z
short_description: "A **bold** intro"
tags: [alpha, beta]
preview_image: "../../../public/images/articles/hello/cover.webp"
---

# Heading

Welcome to [the article](/articles/sample).

![Cover](../../../public/images/articles/hello/cover.webp)
`
    );

    const items = await getArticleFeedItems({ articlesDirectory: tempDir, baseUrl: BASE_URL });

    expect(items).toHaveLength(1);
    const item = items[0];

    expect(item.title).toBe('Hello World');
    expect(item.author).toBe('Jack');
    expect(item.tags).toEqual(['alpha', 'beta']);
    expect(item.url).toBe(`${BASE_URL}/articles/sample`);
    expect(item.imageUrl).toBe(`${BASE_URL}/images/articles/hello/cover.webp`);

    expect(item.summaryHtml).toContain('<strong>bold</strong>');
    expect(item.contentHtml).toContain('<h1>Heading</h1>');
    expect(item.contentHtml).toContain(`${BASE_URL}/articles/sample`);
    expect(item.contentHtml).toContain(`${BASE_URL}/images/articles/hello/cover.webp`);
  });

  it('sanitizes dangerous HTML', async () => {
    writeFixture(
      tempDir,
      'unsafe.md',
      `---
title: "Unsafe"
date: 2024-06-01T12:00:00Z
short_description: "Intro"
---

<script>alert('nope')</script>
<img src="/images/unsafe.png" onerror="alert('xss')" />
`
    );

    const items = await getArticleFeedItems({ articlesDirectory: tempDir, baseUrl: BASE_URL });
    const item = items[0];

    expect(item.contentHtml).not.toContain('<script>');
    expect(item.contentHtml).not.toContain('onerror');
    expect(item.contentHtml).toContain(`${BASE_URL}/images/unsafe.png`);
  });
});
