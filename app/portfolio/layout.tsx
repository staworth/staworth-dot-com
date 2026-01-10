import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio | Staworth - Transparent DeFi Investments & Holdings',
  description: 'Explore Staworth\'s portfolio of governance tokens, DeFi positions, and core assets. Full transparency on our Web3 investments and digital community holdings.',
  keywords: ['Web3', 'portfolio', 'governance tokens', 'DeFi', 'DAOs', 'crypto holdings', 'transparent investing', 'onchain equity'],
  authors: [{ name: 'Staworth Limited' }],
  openGraph: {
    title: 'Portfolio | Staworth',
    description: 'Explore our interests, investments, and holdings in Web3 with full transparency. Governance tokens, DeFi positions, and core assets.',
    url: 'https://www.staworth.com/portfolio',
    siteName: 'Staworth',
    images: [
      {
        url: 'https://www.staworth.com/images/articles/introducing/Staworth_16_9_Black.webp',
        width: 1200,
        height: 630,
        alt: 'Staworth Portfolio',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio | Staworth',
    description: 'Explore our Web3 portfolio with full transparency - governance tokens, DeFi positions, and core assets.',
    images: ['https://www.staworth.com/images/articles/introducing/Staworth_16_9_Black.webp'],
  },
  alternates: {
    canonical: 'https://www.staworth.com/portfolio',
  },
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
