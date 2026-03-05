import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center animate-in fade-in duration-500">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gold/20 mb-6">
          <Sparkles className="w-12 h-12 text-gold" />
        </div>
        <h1 className="font-serif text-6xl font-bold text-gold mb-2">404</h1>
        <p className="text-xl text-white/80 mb-8">The cards have gone astray...</p>
        <p className="text-white/60 mb-8 max-w-md mx-auto">
          Page not found. Perhaps the universe is guiding you elsewhere.
        </p>
        <Link href="/">
          <Button size="lg" className="shadow-glow">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
