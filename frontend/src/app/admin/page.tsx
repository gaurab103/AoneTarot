'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BarChart3, Calendar, MessageCircle, Star, Settings } from 'lucide-react';
import { getApiUrl } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface Booking {
  id: string;
  status: string;
  scheduledAt: string | null;
  user: { name: string; email: string };
  service: { name: string; price: string };
  payment?: { status: string; amount: string };
}

interface Analytics {
  totalRevenue: number;
  monthlyRevenue: { month: string; amount: number }[];
  bookingCounts: Record<string, number>;
}

export default function AdminPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    Promise.all([
      fetch(getApiUrl('/api/admin/bookings'), {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
      fetch(getApiUrl('/api/admin/analytics'), {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
    ])
      .then(([b, a]) => {
        setBookings(b);
        setAnalytics(a);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, user, router]);

  const updateBooking = async (id: string, data: { status?: string; scheduledAt?: string }) => {
    try {
      const res = await fetch(getApiUrl(`/api/admin/bookings/${id}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated = await res.json();
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...updated } : b)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!user) return null;

  return (
    <div className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex gap-4 items-center">
            <h1 className="font-serif text-4xl font-bold text-white">Admin Dashboard</h1>
            <Link href="/">
              <Button variant="ghost">Back to Site</Button>
            </Link>
          </div>

          {analytics && (
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-gold flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Total Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-white">
                    ${analytics.totalRevenue.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-gold">Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    {Object.entries(analytics.bookingCounts).map(([status, count]) => (
                      <p key={status} className="text-white/80">
                        {status}: {count}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-gold">Monthly Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics.monthlyRevenue.length > 0 ? (
                    <ResponsiveContainer width="100%" height={120}>
                      <BarChart data={analytics.monthlyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.2)" />
                        <XAxis dataKey="month" stroke="#d4af37" fontSize={12} />
                        <YAxis stroke="#d4af37" fontSize={12} />
                        <Tooltip
                          contentStyle={{ background: '#1a0f2e', border: '1px solid rgba(212,175,55,0.3)' }}
                          labelStyle={{ color: '#d4af37' }}
                        />
                        <Bar dataKey="amount" fill="#d4af37" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-white/70 text-sm">No data yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          <div>
            <h2 className="font-serif text-2xl font-bold text-white mb-4">All Bookings</h2>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-24 rounded-2xl bg-primary-50/20 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <Card key={b.id} className="hover:border-gold/40">
                    <CardHeader className="flex flex-row items-start justify-between flex-wrap gap-4">
                      <div>
                        <CardTitle className="text-gold">{b.service.name}</CardTitle>
                        <CardDescription>
                          {b.user.name} • {b.user.email}
                        </CardDescription>
                        <p className="text-sm text-white/70 mt-1">
                          Status: {b.status} • {b.payment?.status === 'COMPLETED' ? 'Paid' : 'Pending'}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Link href={`/chat/${b.id}`}>
                          <Button variant="secondary" size="sm">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Chat
                          </Button>
                        </Link>
                        <select
                          value={b.status}
                          onChange={(e) =>
                            updateBooking(b.id, { status: e.target.value })}
                          className="rounded-lg border border-gold/30 bg-primary-50/20 px-3 py-2 text-sm text-white"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="SCHEDULED">Scheduled</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
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
