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
    <section id="pricing" className="relative py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-10 top-10 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(255,106,182,0.2),transparent_60%)] blur-2xl" />
        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(79,140,255,0.25),transparent_60%)] blur-[90px]" />
      </div>
      <div className="fx-container relative space-y-10">
        <div className="mx-auto flex max-w-2xl flex-col gap-3 text-center">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Pricing built to be fair</h2>
          <p className="text-white/70">
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
              <FxCard className="relative h-full overflow-hidden bg-gradient-to-br from-white/14 via-white/6 to-transparent p-8">
                <div className="pointer-events-none absolute -top-10 right-4 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(61,220,255,0.25),transparent_65%)] blur-lg" />
                <h3 className="text-xl font-semibold text-white">{perk.title}</h3>
                <p className="mt-3 text-sm text-white/70">{perk.description}</p>
              </FxCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
