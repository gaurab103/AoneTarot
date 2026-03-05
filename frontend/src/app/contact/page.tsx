'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getApiUrl } from '@/lib/api';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/contact'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative py-24 px-4">
      <div className="absolute inset-0 -z-10 bg-gradient-mystical opacity-50" />

      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-xl text-white/80">
            Have questions? We&apos;d love to hear from you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-gold/20 bg-primary-50/20 backdrop-blur-xl p-8 glass-card"
        >
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
                <Mail className="w-6 h-6 text-gold" />
              </div>
              <div>
                <p className="font-medium text-gold">Email</p>
                <a href="mailto:hello@aonetarot.com" className="text-white/80 hover:text-gold transition-colors">
                  hello@aonetarot.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
                <Phone className="w-6 h-6 text-gold" />
              </div>
              <div>
                <p className="font-medium text-gold">Phone</p>
                <a href="tel:+919408083147" className="text-white/80 hover:text-gold transition-colors">
                  +91 9408083147
                </a>
              </div>
            </div>
          </div>

          {sent ? (
            <div className="text-center py-12 rounded-xl bg-gold/10 border border-gold/30">
              <p className="text-gold font-medium">Thank you for your message!</p>
              <p className="text-white/70 text-sm mt-1">We&apos;ll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Your name" required className="mt-2" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="your@email.com" required className="mt-2" />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  placeholder="Your message..."
                  className="mt-2 flex w-full rounded-xl border border-gold/30 bg-primary-50/20 px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                <Send className="w-4 h-4 mr-2" />
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
