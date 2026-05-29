'use client';

import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Hi! I am ServDeal Assistant. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: userMsg }]);
    setLoading(true);
    try {
      const { data } = await api.post('/ai/chatbot', { message: userMsg });
      setMessages((m) => [...m, { role: 'bot', text: data.reply }]);
    } catch {
      setMessages((m) => [...m, { role: 'bot', text: 'Sorry, please try again or contact support.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-navy text-white shadow-lg"
        aria-label="AI Assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 z-50 flex h-96 w-80 flex-col overflow-hidden rounded-2xl bg-white card-shadow"
          >
            <div className="flex items-center justify-between bg-brand-navy px-4 py-3 text-white">
              <span className="font-semibold">ServDeal AI</span>
              <button onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`text-sm ${m.role === 'user' ? 'ml-8 text-right' : 'mr-8'}`}>
                  <span className={`inline-block rounded-xl px-3 py-2 ${m.role === 'user' ? 'bg-brand-orange text-white' : 'bg-slate-100'}`}>
                    {m.text}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 border-t p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Ask anything..."
                className="flex-1 rounded-lg border px-3 py-2 text-sm"
              />
              <button onClick={send} disabled={loading} className="rounded-lg bg-brand-orange p-2 text-white">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
