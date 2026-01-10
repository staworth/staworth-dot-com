import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Articles | Staworth - Insights on Web3, DeFi & Decentralized Governance',
  description: 'Read Staworth\'s articles on Web3, onchain equity, value alignment, and decentralized governance. Insights from our journey in digital community advocacy.',
  keywords: ['Web3', 'articles', 'onchain equity', 'value alignment', 'DeFi', 'DAOs', 'decentralized governance', 'blockchain', 'digital communities'],
  authors: [{ name: 'Staworth Limited' }],
  openGraph: {
    title: 'Articles | Staworth',
    description: 'Read our insights on Web3, value alignment, and digital community advocacy. Articles on onchain equity and decentralized governance.',
    url: 'https://www.staworth.com/articles',
    siteName: 'Staworth',
    images: [
      {
        url: 'https://www.staworth.com/images/articles/introducing/Staworth_16_9_Black.webp',
        width: 1200,
        height: 630,
        alt: 'Staworth Articles',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Articles | Staworth',
    description: 'Insights on Web3, value alignment, and digital community advocacy from Staworth.',
    images: ['https://www.staworth.com/images/articles/introducing/Staworth_16_9_Black.webp'],
  },
  alternates: {
    canonical: 'https://www.staworth.com/articles',
  },
};

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
