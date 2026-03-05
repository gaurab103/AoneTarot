import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | A One Tarot',
  description: 'Learn about A One Tarot. Ancient tarot wisdom with a modern, compassionate approach.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
