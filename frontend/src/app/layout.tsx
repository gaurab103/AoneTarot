import type { Metadata } from 'next';
import Script from 'next/script';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'A One Tarot | Professional Tarot Readings',
  description:
    'Experience mystical tarot readings with A One Tarot. Yes/No, Love, Career, and Detailed readings. Book your session today.',
  keywords: ['tarot', 'reading', 'spiritual', 'guidance', 'love reading', 'career reading'],
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#c9a227' }, { media: '(prefers-color-scheme: light)', color: '#a67c00' }],
  openGraph: {
    title: 'A One Tarot | Professional Tarot Readings',
    description: 'Experience mystical tarot readings. Book your session today.',
  },
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'A One Tarot' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="min-h-screen font-body antialiased">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('aone-tarot-theme');document.documentElement.classList.add(t==='light'?'light':'dark');})();`,
          }}
        />
        <ThemeProvider>
          <Header />
          <main className="pt-20">{children}</main>
          <Footer />
          <PWAInstallPrompt />
        </ThemeProvider>
      </body>
    </html>
  );
}
