'use client';

import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

const getSocketUrl = () => {
  if (typeof window === 'undefined') return '';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl) return apiUrl.replace('/api/v1', '');
  const host = window.location.host;
  if (host.endsWith('.onrender.com')) {
    const name = host.replace('.onrender.com', '');
    return `https://${name}-backend.onrender.com`;
  }
  return 'http://localhost:5000';
};

export function useSocketNotifications() {
  const { user } = useSelector((s: RootState) => s.auth);

  useEffect(() => {
    if (!user?.id) return;

    const socketUrl = getSocketUrl();
    if (!socketUrl) return;

    const socket: Socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    socket.emit('join:user', user.id);

    socket.on('notification', ({ title, message }: { title: string; message: string }) => {
      toast.success(`${title}: ${message}`, { duration: 5000 });
    });

    socket.on('booking:update', (booking: { bookingId: string; status: string }) => {
      toast.success(`Booking ${booking.bookingId} is now ${booking.status}`, { duration: 4000 });
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.id]);
}
