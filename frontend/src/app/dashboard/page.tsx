'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MessageCircle, Star } from 'lucide-react';
import { getApiUrl } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Booking {
  id: string;
  status: string;
  scheduledAt: string | null;
  service: { name: string; slug: string; price: string };
  payment?: { status: string };
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push('/login?redirect=/dashboard');
      return;
    }
    fetch(getApiUrl('/api/bookings'), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setBookings)
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [token, router]);

  const success = searchParams.get('success');

  if (!user) return null;

  return (
    <div className="py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {success && (
            <div className="rounded-xl bg-gold/20 border border-gold/30 p-4 text-gold text-center">
              Payment successful! Your reading has been scheduled.
            </div>
          )}

          <div>
            <h1 className="font-serif text-4xl font-bold text-white mb-2">
              Welcome, {user.name}
            </h1>
            <p className="text-white/70">Manage your tarot readings</p>
          </div>

          <div className="flex gap-4">
            <Link href="/book">
              <Button className="shadow-glow">Book New Reading</Button>
            </Link>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-white mb-4">Your Bookings</h2>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 rounded-2xl bg-primary-50/20 animate-pulse" />
                ))}
              </div>
            ) : bookings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-white/70 mb-4">No bookings yet</p>
                  <Link href="/book">
                    <Button>Book Your First Reading</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <Card key={b.id} className="hover:border-gold/40 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-gold">{b.service.name}</CardTitle>
                        <CardDescription>
                          Status: {b.status} • {b.payment?.status === 'COMPLETED' ? 'Paid' : 'Pending'}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {b.status === 'SCHEDULED' && b.payment?.status === 'COMPLETED' && (
                          <Link href={`/chat/${b.id}`}>
                            <Button variant="secondary" size="sm">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              Chat
                            </Button>
                          </Link>
                        )}
                        {b.status === 'COMPLETED' && (
                          <Link href={`/review/${b.id}`}>
                            <Button variant="secondary" size="sm">
                              <Star className="w-4 h-4 mr-1" />
                              Review
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardHeader>
                    {b.scheduledAt && (
                      <CardContent className="pt-0">
                        <p className="text-sm text-white/70 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(b.scheduledAt).toLocaleString()}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="py-24 px-4"><div className="container mx-auto max-w-4xl h-96 rounded-2xl bg-primary-50/20 animate-pulse" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}
