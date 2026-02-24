import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Staworth',
  description: 'Staworth Limited privacy policy and information on personal data handling.',
  alternates: {
    canonical: 'https://www.staworth.com/privacy',
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
