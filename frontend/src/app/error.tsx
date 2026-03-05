'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-serif text-3xl font-bold text-gold mb-2">Something went wrong</h1>
        <p className="text-white/70 mb-6">An unexpected error occurred. Please try again.</p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => reset()}>Try again</Button>
          <Link href="/">
            <Button variant="secondary">Go home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
