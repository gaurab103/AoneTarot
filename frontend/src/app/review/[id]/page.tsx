'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { getApiUrl } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';

const schema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'At least 10 characters').max(1000),
});

type FormData = z.infer<typeof schema>;

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const bookingId = params.id as string;

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 5 },
  });

  const rating = watch('rating');

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      const res = await fetch(getApiUrl('/api/reviews'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...data, bookingId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setSubmitted(true);
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to submit');
    }
  };

  if (!token) {
    router.push('/login');
    return null;
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <p className="text-2xl text-gold font-serif">Thank you for your review!</p>
          <p className="text-white/70 mt-2">Redirecting to dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-24 px-4">
      <div className="container mx-auto max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-gold/20 bg-primary-50/30 p-8"
        >
          <h1 className="font-serif text-3xl font-bold text-gold mb-2">Leave a Review</h1>
          <p className="text-white/70 mb-8">Share your experience with others</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 rounded-lg py-2 px-4">{error}</p>
            )}
            <div>
              <p className="text-sm text-white/80 mb-2">Rating</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setValue('rating', n)}
                    className="p-1"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        n <= rating ? 'fill-gold text-gold' : 'text-white/30'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <input type="hidden" {...register('rating')} />
            </div>
            <div>
              <label className="text-sm text-white/80 mb-2 block">Comment</label>
              <textarea
                {...register('comment')}
                rows={4}
                className="w-full rounded-xl border border-gold/30 bg-primary-50/20 px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="Tell us about your experience..."
              />
              {errors.comment && (
                <p className="text-red-400 text-sm mt-1">{errors.comment.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
