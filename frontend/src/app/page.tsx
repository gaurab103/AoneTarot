'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Star,
  ArrowRight,
  ChevronRight,
  Heart,
  Briefcase,
  HelpCircle,
  Moon,
  Quote,
  Shield,
  Zap,
  CheckCircle2,
  BookOpen,
  MessageCircle,
  Award,
  CreditCard,
  Mail,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getApiUrl } from '@/lib/api';

const fadeUp = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 } };
const stagger = { animate: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } };

const services = [
  {
    name: 'Yes/No Tarot',
    price: 'From $4.99',
    desc: '1, 2, 5, or 7 questions',
    slug: 'yes-no-tarot',
    icon: HelpCircle,
    color: 'from-violet-500/20 to-fuchsia-500/20',
    bgIcon: '✦',
  },
  {
    name: 'Detailed Reading',
    price: 'From $14.99',
    desc: '3-Card to Full Reading',
    slug: 'detailed-reading',
    icon: Moon,
    color: 'from-amber-500/20 to-orange-500/20',
    bgIcon: '☽',
  },
  {
    name: 'Love Reading',
    price: '$24.99',
    desc: 'Matters of the heart',
    slug: 'love-reading',
    icon: Heart,
    color: 'from-rose-500/20 to-pink-500/20',
    bgIcon: '♥',
  },
  {
    name: 'Career Reading',
    price: '$24.99',
    desc: 'Professional clarity',
    slug: 'career-reading',
    icon: Briefcase,
    color: 'from-emerald-500/20 to-teal-500/20',
    bgIcon: '★',
  },
];

const features = [
  { icon: Shield, title: '100% Confidential', desc: 'Your readings stay private' },
  { icon: Zap, title: '24–48hr Delivery', desc: 'Fast, thoughtful responses' },
  { icon: Award, title: 'Expert Readers', desc: 'Trained & experienced' },
  { icon: MessageCircle, title: 'Direct Chat', desc: 'Ask follow-up questions' },
];

const steps = [
  { icon: BookOpen, num: '01', title: 'Choose Your Reading', desc: 'Pick from Yes/No, Detailed, Love, or Career readings.' },
  { icon: CreditCard, num: '02', title: 'Secure Payment', desc: 'Pay safely with PayPal. Instant confirmation.' },
  { icon: Mail, num: '03', title: 'Receive Your Reading', desc: 'Get your personalized reading within 24–48 hours.' },
  { icon: Clock, num: '04', title: 'Optional Follow-up', desc: 'Chat with your reader for any clarifications.' },
];

type Review = {
  id: string;
  rating: number;
  comment: string;
  userName: string;
  serviceName: string;
  verified: boolean;
  createdAt: string;
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function HomePage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    fetch(getApiUrl('/api/reviews'))
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setReviews(data.filter((r: Review) => r.comment && r.comment.trim().length >= 10));
        } else setReviews([]);
      })
      .catch(() => setReviews([]))
      .finally(() => setReviewsLoading(false));
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Ambient layer */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, var(--accent-muted) 0%, transparent 40%),
              radial-gradient(circle at 80% 70%, rgba(201,162,39,0.08) 0%, transparent 35%)`,
          }}
        />
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-accent star"
            style={{
              left: `${3 + (i * 7) % 94}%`,
              top: `${5 + (i % 8) * 12}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Hero */}
      <section className="relative min-h-[95vh] flex items-center justify-center px-4 py-20">
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0 opacity-25"
            style={{
              background:
                'radial-gradient(ellipse 90% 60% at 50% 15%, var(--accent-muted) 0%, transparent 55%)',
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/80 to-transparent" />
        </div>

        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="text-center max-w-5xl mx-auto relative"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border bg-accent/10 mb-6"
            style={{ borderColor: 'var(--border)' }}
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent tracking-wide">
              Mystical Guidance Awaits
            </span>
          </motion.div>

          <motion.div variants={fadeUp} className="mb-8">
            <div className="relative inline-block">
              <div
                className="absolute -inset-4 rounded-full opacity-20 blur-2xl"
                style={{ background: 'var(--accent)' }}
              />
              <Image
                src="/logo.png"
                alt="A One Tarot"
                width={160}
                height={160}
                className="relative mx-auto object-contain drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 0 32px rgba(201,162,39,0.4))' }}
                unoptimized
              />
            </div>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.05] tracking-tight"
            style={{ color: 'var(--text)' }}
          >
            Discover Your Path
            <br />
            <span
              className="bg-gradient-to-r from-accent via-accent-light to-accent bg-clip-text text-transparent"
              style={{ backgroundSize: '200% auto' }}
            >
              Through the Cards
            </span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            Professional tarot readings for love, career, and life decisions. Connect with ancient
            wisdom and gain clarity from real clients worldwide.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
            <Link href="/book">
              <Button size="lg" className="btn-glow group text-base px-10 py-6 rounded-xl">
                Book Your Reading
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/services">
              <Button
                variant="secondary"
                size="lg"
                className="text-base px-10 py-6 rounded-xl border-2"
              >
                Explore Services
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span
              className="inline-block text-sm font-medium tracking-widest uppercase mb-4"
              style={{ color: 'var(--accent)' }}
            >
              Simple Process
            </span>
            <h2
              className="font-display text-4xl md:text-5xl font-bold"
              style={{ color: 'var(--text)' }}
            >
              How It Works
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  {i < steps.length - 1 && (
                    <div
                      className="hidden lg:block absolute top-8 left-1/2 w-full h-px -translate-x-1/2"
                      style={{ background: 'linear-gradient(90deg, var(--border), transparent)' }}
                    />
                  )}
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-accent" />
                    </div>
                    <span
                      className="text-4xl font-display font-bold block mb-2 opacity-30"
                      style={{ color: 'var(--accent)' }}
                    >
                      {s.num}
                    </span>
                    <h3 className="font-display text-xl font-semibold mb-2" style={{ color: 'var(--text)' }}>
                      {s.title}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {s.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section
        className="py-10 px-4 border-y"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--section-alt)' }}
      >
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-accent/15 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-7 h-7 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--text)' }}>
                      {f.title}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {f.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-28 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            className="text-center mb-20"
          >
            <span
              className="inline-block text-sm font-medium tracking-widest uppercase mb-4"
              style={{ color: 'var(--accent)' }}
            >
              Our Services
            </span>
            <h2
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
              style={{ color: 'var(--text)' }}
            >
              Choose Your Reading
            </h2>
            <p className="max-w-xl mx-auto text-lg" style={{ color: 'var(--text-muted)' }}>
              From quick yes/no answers to in-depth guidance—find the reading that calls to you.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.slug}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={`/book?service=${s.slug}`}>
                    <Card className="h-full glass-card hover:shadow-glow transition-all duration-300 group cursor-pointer overflow-hidden relative">
                      <div
                        className={`absolute top-0 right-0 w-28 h-28 rounded-bl-[4rem] bg-gradient-to-br ${s.color} opacity-70 group-hover:opacity-90 transition-opacity`}
                      />
                      <div className="absolute top-4 right-4 text-3xl opacity-20 group-hover:opacity-40 transition-opacity font-display">
                        {s.bgIcon}
                      </div>
                      <div className="relative p-6">
                        <div className="w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center mb-5 group-hover:bg-accent/25 group-hover:scale-105 transition-all">
                          <Icon className="w-8 h-8 text-accent" />
                        </div>
                        <CardHeader className="p-0 pb-2">
                          <CardTitle className="font-display text-xl text-accent group-hover:text-accent-light transition-colors">
                            {s.name}
                          </CardTitle>
                          <CardDescription>{s.desc}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 pt-4">
                          <p className="text-2xl font-bold text-accent mb-4">{s.price}</p>
                          <span className="inline-flex items-center text-sm font-semibold text-accent/90 group-hover:text-accent transition-colors">
                            Select reading
                            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </CardContent>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Real Client Reviews - Only written reviews */}
      <section
        className="py-28 px-4"
        style={{ backgroundColor: 'var(--section-alt)' }}
      >
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span
              className="inline-flex items-center gap-2 text-sm font-medium tracking-widest uppercase mb-4"
              style={{ color: 'var(--accent)' }}
            >
              <Quote className="w-4 h-4" />
              Real Client Reviews
            </span>
            <h2
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
              style={{ color: 'var(--text)' }}
            >
              What Clients Write
            </h2>
            <p className="max-w-xl mx-auto text-lg" style={{ color: 'var(--text-muted)' }}>
              Genuine experiences from people who&apos;ve had their readings. No fake reviews.
            </p>
          </motion.div>

          {reviewsLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-12 h-12 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
            </div>
          ) : reviews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 max-w-lg mx-auto"
            >
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-accent" />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-3" style={{ color: 'var(--text)' }}>
                Be the First to Share
              </h3>
              <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
                After your reading, you&apos;ll be able to leave a review. Your experience helps others
                discover our service.
              </p>
              <Link href="/book">
                <Button size="lg" className="btn-glow rounded-xl">
                  Book Your Reading
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.slice(0, 6).map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card className="h-full glass-card overflow-hidden group hover:shadow-glow transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
                          style={{
                            background: 'var(--accent-muted)',
                            color: 'var(--accent)',
                          }}
                        >
                          {getInitials(r.userName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex gap-1 mb-1">
                            {Array.from({ length: r.rating }).map((_, j) => (
                              <Star key={j} className="w-5 h-5 fill-accent text-accent" />
                            ))}
                          </div>
                          <p className="font-semibold text-accent">{r.userName}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {r.serviceName}
                          </p>
                          {r.verified && (
                            <span className="inline-flex items-center gap-1 text-xs mt-1 text-accent">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Verified client
                            </span>
                          )}
                        </div>
                      </div>
                      <p
                        className="leading-relaxed text-base"
                        style={{ color: 'var(--text)' }}
                      >
                        &ldquo;{r.comment}&rdquo;
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="container mx-auto"
        >
          <Card className="max-w-4xl mx-auto glass-card overflow-hidden relative">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  'radial-gradient(ellipse 80% 80% at 50% 50%, var(--accent-muted) 0%, transparent 70%)',
              }}
            />
            <div className="relative p-10 md:p-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-accent mb-4">
                Ready for Your Reading?
              </h2>
              <p
                className="text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed"
                style={{ color: 'var(--text-muted)' }}
              >
                Connect with the cards and discover the guidance that awaits you. Book now and
                receive your personalized reading within 24–48 hours.
              </p>
              <Link href="/book">
                <Button size="lg" className="btn-glow text-base px-12 py-6 rounded-xl">
                  Book Your Reading
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}
