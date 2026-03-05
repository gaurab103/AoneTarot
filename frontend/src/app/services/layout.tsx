import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Services | A One Tarot',
  description: 'Explore our tarot reading services: Yes/No, Love, Career, and Detailed readings. Professional guidance for your journey.',
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
