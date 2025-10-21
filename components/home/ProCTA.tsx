'use client';

import { motion } from 'framer-motion';

import { fxTransition } from '@/lib/utils';
import { FxCard } from '@/components/ui/FxCard';
import { FxButton } from '@/components/ui/FxButton';
import { FxIcon3D } from '@/components/ui/FxIcon3D';

export function ProCTA(): JSX.Element {
  return (
    <section id="professionals" className="fx-container py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={fxTransition}
      >
        <FxCard className="relative overflow-hidden bg-white/10 p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(46,107,255,0.25),transparent)]" />
          <div className="relative grid gap-8 lg:grid-cols-[auto,1fr] lg:items-center">
            <FxIcon3D name="premium" className="h-20 w-20" size={36} />
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                Earn more with FixEasy.
              </h2>
              <p className="text-white/60">
                Verified professionals enjoy guaranteed payouts, repeat clients and dedicated KYC support. Bring your skills, we’ll handle the rest.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <FxButton href="/pro/register" aria-label="Create FixEasy professional account">
                  Create Professional Account
                </FxButton>
                <span className="text-xs text-white/50">
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
