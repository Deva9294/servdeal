'use client';

import { useSocketNotifications } from '@/hooks/useSocketNotifications';

export function SocketNotifications() {
  useSocketNotifications();
  return null;
}
