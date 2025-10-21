'use client';

import { motion } from 'framer-motion';

import { fxTransition } from '@/lib/utils';
import { FxCard } from '@/components/ui/FxCard';
import { FxIcon3D } from '@/components/ui/FxIcon3D';

const steps = [
  {
    title: 'Choose a service',
    description: 'Tell us what you need and add a quick summary so we can match the right pro.',
    icon: 'premium',
  },
  {
    title: 'Pick a time',
    description: 'Schedule instantly or request availability. We’ll confirm in minutes.',
    icon: 'concierge',
  },
  {
    title: 'Get it done',
    description: 'A vetted FixEasy professional arrives on time, fully insured and prepared.',
    icon: 'maintenance',
  },
] as const;

export function HowItWorks(): JSX.Element {
  return (
    <section id="help" className="fx-container space-y-10 py-16">
      <div className="mx-auto flex max-w-2xl flex-col gap-3 text-center">
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">How it works</h2>
        <p className="text-white/60">
          Three simple steps to book a pro. Real humans available via live chat and phone when you need help.
        </p>
      </div>
      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-6 md:flex-row md:items-stretch">
        <span className="pointer-events-none absolute left-1/2 top-12 hidden h-1 w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent md:block" />
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            className="flex-1"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ ...fxTransition, delay: index * 0.1 }}
          >
            <FxCard className="flex h-full flex-col gap-5 p-8 text-left">
              <div className="flex items-center gap-4">
                <FxIcon3D name={step.icon} className="shrink-0" />
                <div>
                  <span className="text-sm uppercase tracking-[0.3em] text-white/50">Step {index + 1}</span>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{step.title}</h3>
                </div>
              </div>
              <p className="text-sm text-white/60">{step.description}</p>
            </FxCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
