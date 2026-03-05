'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getApiUrl } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ServiceOption {
  id: string;
  slug: string;
  label: string;
  questionCount: number;
  price: string;
}

interface Service {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: string | null;
  options: ServiceOption[];
}

function getPriceDisplay(s: Service): string {
  if (s.options?.length > 0) {
    const min = Math.min(...s.options.map((o) => Number(o.price)));
    return `From $${min.toFixed(2)}`;
  }
  return s.price ? `$${Number(s.price).toFixed(2)}` : '—';
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(getApiUrl('/api/services'))
      .then((r) => r.json())
      .then(setServices)
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-24 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-primary-50/20 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative py-24 px-4">
      <div className="absolute inset-0 -z-10 bg-gradient-mystical opacity-50" />

      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-serif text-5xl font-bold text-white mb-4">Our Services</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Choose from our range of tarot readings. Each session is tailored to your needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full flex flex-col hover:border-gold/40 hover:shadow-glow transition-all overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-gold">{s.name}</CardTitle>
                  <CardDescription>{s.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto space-y-4">
                  {s.options?.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gold font-medium">Pricing options:</p>
                      <div className="flex flex-wrap gap-2">
                        {s.options.map((opt) => (
                          <span
                            key={opt.id}
                            className="px-3 py-1 rounded-lg bg-gold/10 text-gold text-sm"
                          >
                            {opt.label}: ${Number(opt.price).toFixed(2)}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-gold">{getPriceDisplay(s)}</p>
                  )}
                  <Link href={`/book?service=${s.slug}`}>
                    <Button variant="secondary" className="w-full">
                      Book Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center py-16 text-white/70">
            <p>Services will be available soon. Please check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}
