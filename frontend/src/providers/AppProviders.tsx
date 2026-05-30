'use client';

import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { store } from '@/store';
import { AuthInit } from '@/components/auth/AuthInit';
import { SocketNotifications } from '@/components/notifications/SocketNotifications';
import { useState, type ReactNode } from 'react';

const ThemeProvider = NextThemesProvider as React.FC<{
  children: ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
}>;

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthInit />
          <SocketNotifications />
          {children}
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}
