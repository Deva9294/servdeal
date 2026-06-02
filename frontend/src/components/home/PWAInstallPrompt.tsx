'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!localStorage.getItem('pwa-prompt-dismissed')) {
        setVisible(true);
      }
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    (deferredPrompt as unknown as { prompt: () => void }).prompt();
    const { outcome } = await (deferredPrompt as unknown as { userChoice: Promise<{ outcome: string }> }).userChoice;
    if (outcome === 'accepted') {
      setVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-orange-200 bg-white p-4 shadow-2xl md:bottom-6 md:right-6 md:left-auto"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100">
              <Smartphone className="h-5 w-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900">Install ServDeal App</p>
              <p className="mt-1 text-sm text-slate-600">Add to your home screen for faster booking and offline access.</p>
              <button
                onClick={handleInstall}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
              >
                <Download className="h-4 w-4" />
                Install App
              </button>
            </div>
            <button
              onClick={handleDismiss}
              className="shrink-0 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label="Dismiss"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
