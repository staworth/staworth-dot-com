import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products | Staworth - Web3 Professional Services',
  description: 'Discover Staworth\'s professional services for Web3 organizations. Strategic advisory, governance consulting, and value alignment through onchain equity.',
  keywords: ['Web3', 'professional services', 'DeFi', 'DAOs', 'governance consulting', 'strategic advisory', 'onchain equity', 'value alignment'],
  authors: [{ name: 'Staworth Limited' }],
  openGraph: {
    title: 'Products | Staworth',
    description: 'Professional services for Web3 organizations focused on value alignment and digital community advocacy.',
    url: 'https://www.staworth.com/products',
    siteName: 'Staworth',
    images: [
      {
        url: 'https://www.staworth.com/images/articles/introducing/Staworth_16_9_Black.webp',
        width: 1200,
        height: 630,
        alt: 'Staworth Products & Services',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Products | Staworth',
    description: 'Professional services for Web3 organizations focused on value alignment and digital community advocacy.',
    images: ['https://www.staworth.com/images/articles/introducing/Staworth_16_9_Black.webp'],
  },
  alternates: {
    canonical: 'https://www.staworth.com/products',
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
