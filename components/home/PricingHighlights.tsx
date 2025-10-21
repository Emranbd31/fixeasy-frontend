'use client';

import { motion } from 'framer-motion';

import { fxTransition } from '@/lib/utils';
import { FxCard } from '@/components/ui/FxCard';

const pricingPerks = [
  {
    title: 'Transparent quotes',
    description: 'See all fees upfront. No call-out surprises or hidden markups—ever.',
  },
  {
    title: 'Insurance included',
    description: 'Every booking is backed by €2M liability cover and punctuality guarantees.',
  },
  {
    title: 'Instant scheduling',
    description: 'Reserve a slot instantly or choose flexible windows at the same fair rates.',
  },
];

export function PricingHighlights(): JSX.Element {
  return (
    <section id="pricing" className="fx-container space-y-10 py-16">
      <div className="mx-auto flex max-w-2xl flex-col gap-3 text-center">
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">Pricing built to be fair</h2>
        <p className="text-white/60">
          Competitive rates with no hidden charges. Pay securely when the job is done.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {pricingPerks.map((perk, index) => (
          <motion.div
            key={perk.title}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ ...fxTransition, delay: index * 0.08 }}
          >
            <FxCard className="h-full bg-white/10 p-8">
              <h3 className="text-xl font-semibold text-white">{perk.title}</h3>
              <p className="mt-3 text-sm text-white/60">{perk.description}</p>
            </FxCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
