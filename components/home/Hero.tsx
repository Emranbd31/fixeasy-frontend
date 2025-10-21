'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import { fxTransition } from '@/lib/utils';
import { FxButton } from '@/components/ui/FxButton';

const heroTiles = [
  {
    label: 'Plumbing experts',
    description: '24/7 emergency cover',
    background:
      'linear-gradient(135deg, rgba(46,107,255,0.9), rgba(22,163,74,0.75)), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Cpath fill=\'%230f1b3d\' fill-opacity=\'0.2\' d=\'M0 40h200v10H0zM0 100h200v10H0zM0 160h200v10H0zM40 0h10v200H40zM100 0h10v200h-10zM160 0h10v200h-10z\'/%3E%3C/svg%3E")',
  },
  {
    label: 'Certified electricians',
    description: 'Safe Electric registered',
    background:
      'linear-gradient(135deg, rgba(245,158,11,0.9), rgba(46,107,255,0.75)), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Ccircle cx=\'100\' cy=\'100\' r=\'60\' fill=\'%230f152c\' fill-opacity=\'0.16\'/%3E%3C/svg%3E")',
  },
  {
    label: 'Five-star cleaners',
    description: 'Hotel-grade finishing',
    background:
      'linear-gradient(135deg, rgba(16,185,129,0.85), rgba(59,130,246,0.75)), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'240\' height=\'240\'%3E%3Cpath d=\'M0 120h240v2H0zM120 0h2v240h-2z\' fill=\'%230f1b3d\' fill-opacity=\'0.18\'/%3E%3C/svg%3E")',
  },
];

export function Hero(): JSX.Element {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [0, 16]);

  return (
    <section ref={ref} className="relative overflow-hidden pb-16 pt-24 sm:pt-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={fxTransition}
        className="fx-container grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center"
      >
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/70">
            Trusted home services across Ireland
          </div>
          <h1 className="text-4xl leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            Trusted home services in minutes.
          </h1>
          <p className="max-w-xl text-base text-white/70 sm:text-lg">
            Book vetted pros across Ireland. Transparent pricing. On-time, insured. From emergency fixes to long-term maintenance, FixEasy handles it all with premium support.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <FxButton href="/book" aria-label="Book a FixEasy service">
              Book a service
            </FxButton>
            <FxButton
              href="/pro/register"
              variant="secondary"
              aria-label="Create a professional account"
            >
              I’m a professional
            </FxButton>
          </div>
          <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg">⭐⭐⭐⭐⭐</span>
              <div className="flex flex-col leading-tight">
                <span className="text-white">4.9/5 satisfaction</span>
                <span>From 2,300+ completed bookings</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-white/60">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Apple login ready</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Google login ready</span>
            </div>
          </div>
        </div>
        <motion.div
          style={{ translateY }}
          className="relative flex w-full items-center justify-center"
        >
          <div className="grid w-full max-w-xl gap-4 sm:max-w-2xl sm:grid-cols-3">
            {heroTiles.map((tile, index) => (
              <motion.div
                key={tile.label}
                className="group relative overflow-hidden rounded-3xl border border-white/10 shadow-3d"
                whileHover={{ y: -6 }}
                transition={fxTransition}
              >
                <div
                  className="relative flex h-48 w-full flex-col justify-end overflow-hidden rounded-3xl sm:h-56"
                  style={{ backgroundImage: tile.background, backgroundSize: 'cover', backgroundBlendMode: 'overlay' }}
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent" />
                  <div className="relative z-10 flex flex-col gap-1 p-5">
                    <span className="text-sm uppercase tracking-[0.3em] text-white/60">{tile.description}</span>
                    <span className="text-lg font-semibold text-white">{tile.label}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
