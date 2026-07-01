'use client';

import { useEffect, useState, useRef } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { getSocket } from '@/lib/socket';
import { Send } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

type Message = { sender: string; text: string; createdAt?: string };

export default function ChatPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('booking');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: booking } = useQuery({
    queryKey: ['booking-chat', bookingId],
    queryFn: async () => {
      if (!bookingId) return null;
      const res = await api.get(`/bookings/${bookingId}`);
      return res.data.data;
    },
    enabled: !!bookingId,
  });

  useEffect(() => {
    if (!bookingId) return;
    const socket = getSocket();
    socket.connect();
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.emit('join:chat', bookingId);
    socket.on('chat:message', (payload: { message: Message }) => {
      setMessages((m) => [...m, payload.message]);
    });
    // Load existing messages
    api.get(`/chats/${bookingId}`).then(({ data }) => {
      setMessages(data.data?.messages || []);
    }).catch(() => {});
    return () => {
      socket.off('chat:message');
      socket.off('connect');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, [bookingId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!input.trim() || !bookingId) return;
    const msg = { sender: 'me', text: input, createdAt: new Date().toISOString() };
    setMessages((m) => [...m, msg]);
    getSocket().emit('chat:message', { chatId: bookingId, message: msg });
    setInput('');
  };

  if (!bookingId) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader title="Chat" description="Select a booking to start chatting" />
        <Card className="p-8 text-center text-slate-500">
          No booking selected. Please select a booking from your bookings page to chat with the provider.
        </Card>
      </div>
    );
  }

  const providerName = booking?.provider?.fullName || booking?.provider?.shopName || 'Provider';

  return (
    <div className="mx-auto flex h-[calc(100vh-12rem)] max-w-2xl flex-col">
      <PageHeader title="Chat with Provider" description={`${providerName} · ${booking?.service?.name || 'Service'}`} />
      <Card className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {!connected && <p className="text-xs text-slate-400 text-center">Connecting...</p>}
          {messages.length === 0 && connected && (
            <p className="text-sm text-slate-400 text-center py-8">No messages yet. Start the conversation!</p>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <span className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${m.sender === 'me' ? 'bg-brand-orange text-white' : 'bg-slate-100'}`}>
                {m.text}
              </span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="flex gap-2 border-t p-3">
          <Input placeholder="Type a message..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} />
          <Button onClick={send} disabled={!connected}><Send className="h-4 w-4" /></Button>
        </div>
      </Card>
    </div>
  );
}
