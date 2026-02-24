import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Staworth',
  description: 'Reach out to Staworth Limited to discuss opportunities or ask questions.',
  alternates: {
    canonical: 'https://www.staworth.com/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
