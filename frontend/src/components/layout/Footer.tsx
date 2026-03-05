import Link from 'next/link';
import { Mail, Phone, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t mt-24 relative overflow-hidden" style={{ borderColor: 'var(--border)' }}>
      <div className="absolute inset-0 bg-gradient-to-t from-primary-50/20 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 py-16 relative">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-accent" />
              <h3 className="font-display text-2xl font-semibold text-accent">A One Tarot</h3>
            </div>
            <p className="text-[var(--text-muted)] text-base leading-relaxed max-w-md">
              Experience the mystical wisdom of tarot. Professional readings for love, career, and life guidance.
            </p>
          </div>
          <div>
            <h4 className="font-display text-lg font-semibold text-accent mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm text-[var(--text-muted)]">
              <li><Link href="/" className="hover:text-accent transition-colors duration-200">Home</Link></li>
              <li><Link href="/about" className="hover:text-accent transition-colors duration-200">About</Link></li>
              <li><Link href="/services" className="hover:text-accent transition-colors duration-200">Service</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors duration-200">Contact</Link></li>
              <li><Link href="/book" className="hover:text-accent transition-colors duration-200">Book Reading</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-lg font-semibold text-accent mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-[var(--text-muted)]">
              <li>
                <a
                  href="mailto:hello@aonetarot.com"
                  className="flex items-center gap-2 hover:text-accent transition-colors duration-200"
                >
                  <Mail size={16} className="text-accent flex-shrink-0" />
                  hello@aonetarot.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+919408083147"
                  className="flex items-center gap-2 hover:text-accent transition-colors duration-200"
                >
                  <Phone size={16} className="text-accent flex-shrink-0" />
                  +91 9408083147
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t text-center text-sm opacity-70" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} A One Tarot. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
