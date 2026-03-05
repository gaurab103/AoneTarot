'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { Send } from 'lucide-react';
import { getApiUrl } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: { id: string; name: string };
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const bookingId = params.id as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token || !user) {
      router.push('/login');
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const s = io(apiUrl, { auth: { token } });
    setSocket(s);

    s.on('connect', () => {
      s.emit('join-booking', bookingId);
    });

    s.on('new-message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      s.disconnect();
    };
  }, [token, user, bookingId, router]);

  useEffect(() => {
    if (!token) return;
    fetch(getApiUrl(`/api/messages/${bookingId}`), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setMessages)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, bookingId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!input.trim() || !socket) return;
    socket.emit('send-message', { bookingId, content: input.trim() });
    setInput('');
  };

  if (!user) return null;

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col py-4 px-4">
      <div className="container mx-auto max-w-2xl flex-1 flex flex-col">
        <div className="rounded-2xl border border-gold/20 bg-primary-50/30 flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gold/20">
            <h1 className="font-serif text-xl font-semibold text-gold">Chat</h1>
            <p className="text-sm text-white/70">Booking: {bookingId.slice(0, 8)}...</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 rounded-lg bg-primary-50/20 animate-pulse w-3/4" />
                ))}
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender.id === user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-2 ${
                      m.sender.id === user.id
                        ? 'bg-gold/30 text-white'
                        : 'bg-primary-50/50 text-white'
                    }`}
                  >
                    <p className="text-xs text-gold mb-1">{m.sender.name}</p>
                    <p>{m.content}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>
          <div className="p-4 border-t border-gold/20 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Type a message..."
            />
            <Button onClick={send} size="icon">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
