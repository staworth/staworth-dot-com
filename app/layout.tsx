import '../styles/globals.css';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Staworth | Advocating For Decentralized Communities',
  description: 'Staworth Limited provides professional services to Web3 organizations with staunch advocacy for digital communities. Discover our approach to value alignment through onchain equity and decentralized governance.',
  keywords: ['Web3', 'professional services', 'DeFi', 'DAOs', 'onchain equity', 'value alignment', 'decentralized governance', 'blockchain', 'governance tokens'],
  authors: [{ name: 'Staworth Limited' }],
  openGraph: {
    title: 'Staworth | Web3 Professional Services',
    description: 'Professional services for Web3 organizations. Staunch advocacy for digital communities through value alignment and onchain equity.',
    url: 'https://www.staworth.com',
    siteName: 'Staworth',
    images: [
      {
        url: 'https://www.staworth.com/images/articles/introducing/Staworth_16_9_Black.webp',
        width: 1200,
        height: 630,
        alt: 'Staworth Limited brand header',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Staworth | Web3 Professional Services',
    description: 'Professional services for Web3 organizations. Staunch advocacy for digital communities.',
    images: ['https://www.staworth.com/images/articles/introducing/Staworth_16_9_Black.webp'],
  },
  alternates: {
    canonical: 'https://www.staworth.com',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const contactEmail = process.env.CONTACT_TO_EMAIL || '';

  // Organization structured data for homepage
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://www.staworth.com/#organization',
    name: 'Staworth Limited',
    url: 'https://www.staworth.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.staworth.com/logos/staworth-logo.png',
    },
    description: 'Web3 professional services firm dedicated to staunch advocacy for digital communities',
    slogan: 'Staunch advocacy for digital communities',
    foundingDate: '2024',
    email: contactEmail,
    contactPoint: {
      '@type': 'ContactPoint',
      email: contactEmail,
      contactType: 'customer service',
    },
    sameAs: [
      'https://x.com/staworth',
      'https://github.com/staworth',
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Staworth Articles (RSS)"
          href="https://www.staworth.com/rss.xml"
        />
        <link
          rel="alternate"
          type="application/atom+xml"
          title="Staworth Articles (Atom)"
          href="https://www.staworth.com/atom.xml"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
