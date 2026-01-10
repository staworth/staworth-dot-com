import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { Metadata } from 'next';
import SiteNavbar from '../../../src/components/page-general/SiteNavbar';
import SiteFooter from '../../../src/components/page-general/SiteFooter';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'src/content/articles', `${slug}.md`);

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);

    // Clean up the header image path for Open Graph
    const ogImage = data.header_image
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SiteNavbar />
      <main className="p-6 max-w-3xl mx-auto">
        <div className="leading-normal">
          <ReactMarkdown
            components={{
              p: ({ children, ...props }) => (
                <p className="mb-6" {...props}>{children}</p>
              ),
              img: ({ src, alt }) => {
                if (!src || typeof src !== 'string') return null;
                const imagePath = src.replace(/^\.\.\/\.\.\/\.\.\/public/, '');
                return (
                  <span className="block my-8">
                    <Image
                      src={imagePath}
                      alt={alt || ''}
                      width={800}
                      height={450}
                      className="w-full h-auto"
                    />
                  </span>
                );
              },
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