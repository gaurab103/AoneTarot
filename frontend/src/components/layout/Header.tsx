'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';
import { useTheme } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Service' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl"
      style={{ background: 'var(--header-bg)', borderColor: 'var(--border)' }}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-12 w-12 md:h-14 md:w-14 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="A One Tarot"
              width={56}
              height={56}
              className="h-full w-full object-contain drop-shadow-[0_0_12px_rgba(201,162,39,0.3)]"
              style={{ filter: 'drop-shadow(0 0 12px rgba(201,162,39,0.25))' }}
              unoptimized
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden absolute inset-0 items-center justify-center text-2xl font-bold text-accent">
              ✦
            </div>
          </div>
          <span className="font-display text-xl md:text-2xl font-semibold tracking-wide text-accent transition-colors duration-300 group-hover:text-accent-light">
            A One Tarot
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <span
                className={cn(
                  'relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
                  pathname === link.href
                    ? 'text-accent'
                    : 'text-[var(--text-muted)] hover:text-accent hover:bg-accent/5'
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg bg-accent/10 -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </span>
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-lg text-accent hover:bg-accent/10 transition-colors"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {user ? (
            <>
              <Link href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}>
                <Button variant="ghost" size="sm" className="hover:bg-accent/10">
                  Dashboard
                </Button>
              </Link>
              <Button variant="secondary" size="sm" onClick={logout} className="btn-glow">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="hover:bg-accent/10">
                  Login
                </Button>
              </Link>
              <Link href="/book">
                <Button size="sm" className="btn-glow">Book Your Reading</Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2.5 rounded-lg text-accent hover:bg-accent/10 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t overflow-hidden"
            style={{ borderColor: 'var(--border)' }}
          >
            <nav className="flex flex-col p-4 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'py-3 px-4 rounded-xl text-sm font-medium transition-all',
                    pathname === link.href ? 'text-accent bg-accent/10' : 'text-[var(--text-muted)] hover:bg-accent/5'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => { toggleTheme(); setMobileOpen(false); }}
                className="py-3 px-4 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:bg-accent/5 hover:text-accent flex items-center gap-2"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
              <div className="mt-4 pt-4 border-t flex flex-col gap-2" style={{ borderColor: 'var(--border)' }}>
                {user ? (
                  <>
                    <Link href={user.role === 'ADMIN' ? '/admin' : '/dashboard'} onClick={() => setMobileOpen(false)}>
                      <Button variant="ghost" className="w-full justify-center">Dashboard</Button>
                    </Link>
                    <Button variant="secondary" className="w-full" onClick={() => { logout(); setMobileOpen(false); }}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <Button variant="ghost" className="w-full justify-center">Login</Button>
                    </Link>
                    <Link href="/book" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full btn-glow">Book Your Reading</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
