import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Presence | Staworth - Our Digital Footprint & Community Engagement',
  description: 'Discover where Staworth engages with digital communities across Web3. Explore our presence on governance forums, social platforms, and decentralized protocols.',
  keywords: ['Web3', 'presence', 'digital footprint', 'community engagement', 'DeFi', 'DAOs', 'governance participation', 'decentralized platforms'],
  authors: [{ name: 'Staworth Limited' }],
  openGraph: {
    title: 'Presence | Staworth',
    description: 'Explore our digital footprint and learn where we engage with Web3 communities and decentralized organizations.',
    url: 'https://www.staworth.com/presence',
    siteName: 'Staworth',
    images: [
      {
        url: 'https://www.staworth.com/images/articles/introducing/Staworth_16_9_Black.webp',
        width: 1200,
        height: 630,
        alt: 'Staworth Presence',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Presence | Staworth',
    description: 'Explore our digital footprint and Web3 community engagement across governance forums and decentralized platforms.',
    images: ['https://www.staworth.com/images/articles/introducing/Staworth_16_9_Black.webp'],
  },
  alternates: {
    canonical: 'https://www.staworth.com/presence',
  },
};

export default function PresenceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
