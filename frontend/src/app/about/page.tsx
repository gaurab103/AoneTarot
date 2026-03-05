'use client';

import { motion } from 'framer-motion';
import { Heart, Eye, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 bg-gradient-mystical opacity-50" />

      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="font-display text-5xl font-bold text-white mb-4">About A One Tarot</h1>
            <p className="text-xl text-white/80">Your guide to mystical wisdom</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="prose prose-invert prose-lg max-w-none"
          >
            <p className="text-white/80 leading-relaxed mb-6">
              A One Tarot brings together ancient tarot wisdom with a modern, compassionate approach. 
              Our readings are designed to provide clarity, guidance, and insight into the questions 
              that matter most to you.
            </p>
            <p className="text-white/80 leading-relaxed mb-6">
              Whether you seek answers about love, career, or life&apos;s bigger questions, we offer 
              a sacred space for reflection and discovery. Each reading is conducted with care, 
              respect, and a deep connection to the cards.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-8 mt-16"
          >
            {[
              { icon: Heart, title: 'Compassionate', desc: 'Readings delivered with empathy and understanding' },
              { icon: Eye, title: 'Insightful', desc: 'Deep interpretations that illuminate your path' },
              { icon: Sparkles, title: 'Transformative', desc: 'Experience that can shift your perspective' },
            ].map((item, i) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gold/20 bg-primary-50/30 p-6 text-center"
              >
                <item.icon className="w-12 h-12 text-gold mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-gold mb-2">{item.title}</h3>
                <p className="text-white/70 text-sm">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
