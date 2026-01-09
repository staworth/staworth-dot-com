import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import SiteNavbar from '../../../src/components/page-general/SiteNavbar';
import SiteFooter from '../../../src/components/page-general/SiteFooter';

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

  return (
    <>
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