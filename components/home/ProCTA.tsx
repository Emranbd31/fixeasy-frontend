'use client';

import { motion } from 'framer-motion';

import { fxTransition } from '@/lib/utils';
import { FxCard } from '@/components/ui/FxCard';
import { FxButton } from '@/components/ui/FxButton';
import { FxIcon3D } from '@/components/ui/FxIcon3D';

export function ProCTA(): JSX.Element {
  return (
    <section id="professionals" className="relative py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(79,140,255,0.28),transparent_65%)] blur-3xl" />
        <div className="absolute bottom-0 right-10 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(61,220,255,0.24),transparent_60%)] blur-3xl" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={fxTransition}
        className="fx-container relative"
      >
        <FxCard className="relative overflow-hidden bg-gradient-to-br from-white/12 via-white/4 to-transparent p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(79,140,255,0.25),transparent_70%)]" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(255,106,182,0.24),transparent_60%)] blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[auto,1fr] lg:items-center">
            <FxIcon3D name="premium" className="h-20 w-20" size={36} />
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                Earn more with FixEasy.
              </h2>
              <p className="text-white/75">
                Verified professionals enjoy guaranteed payouts, repeat clients and dedicated KYC support. Bring your skills, we’ll handle the rest.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <FxButton href="/pro/register" aria-label="Create FixEasy professional account">
                  Create Professional Account
                </FxButton>
                <span className="text-xs text-white/70">
                  Required: Photo ID + Irish document · Insurance optional
                </span>
              </div>
            </div>
          </div>
        </FxCard>
      </motion.div>
    </section>
  );
}
