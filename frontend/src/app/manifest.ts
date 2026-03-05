import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'A One Tarot | Professional Tarot Readings',
    short_name: 'A One Tarot',
    description: 'Professional tarot readings for love, career, and life. Yes/No, Detailed, Love & Career readings.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0c0a14',
    theme_color: '#c9a227',
    orientation: 'portrait-primary',
    icons: [
      { src: '/logo.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/logo.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
    ],
    categories: ['lifestyle', 'entertainment'],
  };
}
