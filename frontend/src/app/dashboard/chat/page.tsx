'use client';

import { useEffect, useState, useRef } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { getSocket } from '@/lib/socket';
import { Send } from 'lucide-react';

type Message = { sender: string; text: string; createdAt?: string };

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'provider', text: 'Hello! I am on my way to your location.' },
    { sender: 'me', text: 'Thanks! Please call when you arrive.' },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = getSocket();
    socket.connect();
    socket.emit('join:chat', 'demo-chat');
    socket.on('chat:message', (payload: { message: Message }) => {
      setMessages((m) => [...m, payload.message]);
    });
    return () => {
      socket.off('chat:message');
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const msg = { sender: 'me', text: input, createdAt: new Date().toISOString() };
    setMessages((m) => [...m, msg]);
    getSocket().emit('chat:message', { chatId: 'demo-chat', message: msg });
    setInput('');
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-12rem)] max-w-2xl flex-col">
      <PageHeader title="Chat with Provider" description="Rohit Kumar · Electrician" />
      <Card className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
          <Button onClick={send}><Send className="h-4 w-4" /></Button>
        </div>
      </Card>
    </div>
  );
}
