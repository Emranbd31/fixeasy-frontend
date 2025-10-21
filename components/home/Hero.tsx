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
      'linear-gradient(140deg, rgba(79,140,255,0.85), rgba(61,220,255,0.78)), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'220\' height=\'220\'%3E%3Cdefs%3E%3ClinearGradient id=\'g1\' x1=\'0%25\' y1=\'0%25\' x2=\'100%25\' y2=\'100%25\'%3E%3Cstop offset=\'0%25\' stop-color=\'%23ffffff\' stop-opacity=\'0.08\'/%3E%3Cstop offset=\'100%25\' stop-color=\'%23ffffff\' stop-opacity=\'0\'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d=\'M0 44h220v4H0zM0 110h220v4H0zM0 176h220v4H0zM44 0h4v220h-4zM110 0h4v220h-4zM176 0h4v220h-4z\' fill=\'url(%23g1)\'/%3E%3C/svg%3E")',
  },
  {
    label: 'Certified electricians',
    description: 'Safe Electric registered',
    background:
      'linear-gradient(140deg, rgba(255,106,182,0.88), rgba(79,140,255,0.82)), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'240\' height=\'240\'%3E%3Cpath d=\'M120 0l12 32 32 12-32 12-12 32-12-32-32-12 32-12 12-32z\' fill=\'rgba(255,255,255,0.12)\'/%3E%3C/svg%3E")',
  },
  {
    label: 'Five-star cleaners',
    description: 'Hotel-grade finishing',
    background:
      'linear-gradient(140deg, rgba(31,221,159,0.9), rgba(79,140,255,0.78)), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'260\' height=\'260\'%3E%3Ccircle cx=\'130\' cy=\'130\' r=\'70\' fill=\'none\' stroke=\'rgba(255,255,255,0.12)\' stroke-width=\'12\'/%3E%3C/svg%3E")',
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
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-8 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(79,140,255,0.35),transparent_65%)] blur-3xl" />
        <div className="absolute -right-24 top-20 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(255,106,182,0.28),transparent_60%)] blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-[120%] -translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(31,221,159,0.18),transparent_70%)] blur-3xl" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={fxTransition}
        className="fx-container relative grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center"
      >
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/80 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
            Trusted home services across Ireland
          </div>
          <h1 className="text-4xl leading-[1.08] text-white drop-shadow-[0_18px_40px_rgba(5,17,47,0.45)] sm:text-5xl lg:text-6xl">
            Trusted home services in minutes.
          </h1>
          <p className="max-w-xl text-base text-white/75 sm:text-lg">
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
          <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-white/75 shadow-[0_12px_40px_rgba(5,17,47,0.35)] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg">⭐⭐⭐⭐⭐</span>
              <div className="flex flex-col leading-tight">
                <span className="text-white">4.9/5 satisfaction</span>
                <span>From 2,300+ completed bookings</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-white/70">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">Apple login ready</span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">Google login ready</span>
            </div>
          </div>
        </div>
        <motion.div
          style={{ translateY }}
          className="relative flex w-full items-center justify-center"
        >
          <div className="pointer-events-none absolute -top-10 right-10 h-24 w-24 rounded-full opacity-80 blur-xl fx-gradient-ring" />
          <div className="grid w-full max-w-xl gap-4 sm:max-w-2xl sm:grid-cols-3">
            {heroTiles.map((tile) => (
              <motion.div
                key={tile.label}
                className="group relative overflow-hidden rounded-3xl border border-white/12 shadow-[0_25px_60px_rgba(5,17,47,0.45)]"
                whileHover={{ y: -6 }}
                transition={fxTransition}
              >
                <div
                  className="relative flex h-48 w-full flex-col justify-end overflow-hidden rounded-3xl sm:h-56"
                  style={{ backgroundImage: tile.background, backgroundSize: 'cover', backgroundBlendMode: 'overlay' }}
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.24),transparent_65%)] opacity-60 transition-opacity duration-500 group-hover:opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/10 mix-blend-overlay" />
                  <div className="relative z-10 flex flex-col gap-1 p-5">
                    <span className="text-sm uppercase tracking-[0.3em] text-white/70">{tile.description}</span>
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
