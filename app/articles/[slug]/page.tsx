import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Image from 'next/image';
import { Metadata } from 'next';
import SiteNavbar from '../../../src/components/page-general/SiteNavbar';
import SiteFooter from '../../../src/components/page-general/SiteFooter';
import ArticleHeader from '../../../src/components/page-specific/ArticleHeader';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'src/content/articles', `${slug}.md`);

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);

    // Clean up the image path for Open Graph - prefer preview_image for social sharing
    const ogImage = data.preview_image
      ? data.preview_image.replace(/^\.\.\/\.\.\/\.\.\/public/, '')
      : data.header_image
        ? data.header_image.replace(/^\.\.\/\.\.\/\.\.\/public/, '')
        : '/images/articles/introducing/Staworth_16_9_Black.webp';

    return {
      title: data.title || 'Staworth Article',
      description: data.short_description || '',
      authors: [{ name: data.author || 'Staworth' }],
      alternates: {
        canonical: `https://www.staworth.com/articles/${slug}`,
      },
      openGraph: {
        title: data.title || 'Staworth Article',
        description: data.short_description || '',
        type: 'article',
        publishedTime: data.date || undefined,
        authors: [data.author || 'Staworth'],
        images: [
          {
            url: `https://www.staworth.com${ogImage}`,
            width: 1200,
            height: 630,
            alt: data.title || 'Article header image',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: data.title || 'Staworth Article',
        description: data.short_description || '',
        images: [`https://www.staworth.com${ogImage}`],
      },
    };
  } catch {
    return {
      title: 'Article Not Found',
      description: 'This article could not be found.',
    };
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'src/content/articles', `${slug}.md`);
  let fileContent;
  try {
    fileContent = fs.readFileSync(filePath, 'utf8');
  } catch {
    return <div>Article not found</div>;
  }
  const { content, data } = matter(fileContent);

  // Clean up the header image path for structured data
  const ogImage = data.header_image
    ? data.header_image.replace(/^\.\.\/\.\.\/\.\.\/public/, '')
    : '/images/articles/introducing/Staworth_16_9_Black.webp';

  // JSON-LD structured data for Article, Organization, and Author
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `https://www.staworth.com/articles/${slug}#article`,
        headline: data.title || 'Staworth Article',
        description: data.short_description || '',
        image: `https://www.staworth.com${ogImage}`,
        datePublished: data.date || new Date().toISOString(),
        dateModified: data.date || new Date().toISOString(),
        author: {
          '@type': 'Person',
          '@id': 'https://www.staworth.com/#author',
          name: data.author || 'Staworth',
        },
        publisher: {
          '@type': 'Organization',
          '@id': 'https://www.staworth.com/#organization',
          name: 'Staworth Limited',
          url: 'https://www.staworth.com',
          logo: {
            '@type': 'ImageObject',
            url: 'https://www.staworth.com/logos/staworth-logo.png',
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://www.staworth.com/articles/${slug}`,
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://www.staworth.com/#organization',
        name: 'Staworth Limited',
        url: 'https://www.staworth.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.staworth.com/logos/staworth-logo.png',
        },
        description: 'Staunch advocacy for digital communities',
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'hello@staworth.com',
          contactType: 'customer service',
        },
      },
      {
        '@type': 'Person',
        '@id': 'https://www.staworth.com/#author',
        name: data.author || 'Staworth',
        url: 'https://www.staworth.com',
      },
    ],
  };

  // Clean up header image path for the ArticleHeader component
  // Use header_image if specified, otherwise fall back to preview_image
  const headerImagePath = data.header_image
    ? data.header_image.replace(/^\.\.\/\.\.\/\.\.\/public/, '')
    : data.preview_image
      ? data.preview_image.replace(/^\.\.\/\.\.\/\.\.\/public/, '')
      : '/images/articles/introducing/Staworth_16_9_Black.webp';

  const headerMediaType = typeof data.header_media_type === 'string' ? data.header_media_type : undefined;
  const headerMediaUrl = typeof data.header_media_url === 'string' ? data.header_media_url : undefined;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SiteNavbar />
      <main className="p-6 max-w-3xl mx-auto">
        <ArticleHeader
          title={data.title || 'Untitled Article'}
          date={data.date || new Date().toISOString()}
          author={data.author || 'Staworth'}
          headerImage={headerImagePath}
          headerMediaType={headerMediaType}
          headerMediaUrl={headerMediaUrl}
        />
        <div className="leading-normal article-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              p: ({ children, ...props }) => (
                <p className="mb-6" {...props}>{children}</p>
              ),
              img: ({ src, alt }) => {
                if (!src || typeof src !== 'string') return null;
                const imagePath = src.replace(/^\.\.\/\.\.\/\.\.\/public/, '');
                const isGif = imagePath.toLowerCase().endsWith('.gif');
                const isMp4 = imagePath.toLowerCase().endsWith('.mp4');
                if (isMp4) {
                  return (
                    <span className="block my-8">
                      <video
                        src={imagePath}
                        className="w-full h-auto article-content-image"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    </span>
                  );
                }
                if (isGif) {
                  return (
                    <span className="block my-8">
                      <img
                        src={imagePath}
                        alt={alt || ''}
                        className="w-full h-auto article-content-image"
                        loading="lazy"
                      />
                    </span>
                  );
                }
                return (
                  <span className="block my-8">
                    <Image
                      src={imagePath}
                      alt={alt || ''}
                      width={800}
                      height={450}
                      className="w-full h-auto article-content-image"
                    />
                  </span>
                );
              },
              table: ({ children, ...props }) => (
                <div className="my-6 article-table-wrapper">
                  <table className="w-full text-white article-table" {...props}>{children}</table>
                </div>
              ),
              thead: ({ children, ...props }) => (
                <thead {...props}>{children}</thead>
              ),
              tbody: ({ children, ...props }) => (
                <tbody {...props}>{children}</tbody>
              ),
              tr: ({ children, ...props }) => (
                <tr {...props}>{children}</tr>
              ),
              th: ({ children, ...props }) => (
                <th className="text-left font-bold" {...props}>{children}</th>
              ),
              td: ({ children, ...props }) => (
                <td {...props}>{children}</td>
              ),
              blockquote: ({ children, ...props }) => (
                <blockquote className="article-blockquote" {...props}>{children}</blockquote>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
