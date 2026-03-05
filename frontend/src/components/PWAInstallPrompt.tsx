'use client';

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: boolean }).MSStream);
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
  }, []);

  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const dismissed = localStorage.getItem('aone-tarot-pwa-dismissed');
      if (!dismissed) setShowPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShowPrompt(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('aone-tarot-pwa-dismissed', '1');
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 p-4 rounded-2xl border shadow-xl animate-fade-in"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 rounded-lg opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" style={{ color: 'var(--text)' }} />
      </button>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
          <Download className="w-5 h-5 text-accent" />
        </div>
        <div>
          <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
            Install A One Tarot
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {isIOS
              ? 'Tap Share → Add to Home Screen'
              : 'Add to your home screen for quick access'}
          </p>
          {!isIOS && deferredPrompt && (
            <button
              onClick={handleInstall}
              className="mt-2 text-xs font-medium text-accent hover:underline"
            >
              Install now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
