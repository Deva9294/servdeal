'use client';

import { useState, useRef, useEffect, useCallback, type ChangeEvent, type KeyboardEvent } from 'react';
import { Mic, MicOff, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function VoiceSearch() {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState('');
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const handleSearch = useCallback((query: string) => {
    if (query.trim()) {
      router.push(`/services?search=${encodeURIComponent(query.trim())}`);
    }
  }, [router]);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SR();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';
      recognition.onresult = (event: { results: { transcript: string }[][] }) => {
        const transcript = event.results[0][0].transcript;
        setText(transcript);
        handleSearch(transcript);
      };
      recognition.onerror = () => {
        setListening(false);
        toast.error('Voice recognition error');
      };
      recognition.onend = () => setListening(false);
      recognitionRef.current = recognition;
    }
  }, [handleSearch]);

  const toggle = () => {
    if (!recognitionRef.current) {
      toast.error('Voice search not supported in this browser');
      return;
    }
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      setText('');
      recognitionRef.current.start();
      setListening(true);
      toast.success('Listening... Speak now');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={text}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSearch(text)}
          placeholder="Search services..."
          className="w-full rounded-full border bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
        />
      </div>
      <button
        onClick={toggle}
        className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${listening ? 'bg-red-500 text-white animate-pulse' : 'bg-brand-orange text-white hover:bg-brand-orange/90'}`}
        title="Voice Search"
      >
        {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </button>
    </div>
  );
}
