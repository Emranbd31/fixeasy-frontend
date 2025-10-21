'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

import { fxTransition } from '@/lib/utils';
import { FxCard } from '@/components/ui/FxCard';
import { FxIcon3D, type IconName } from '@/components/ui/FxIcon3D';

const services: Array<{ key: IconName; label: string; price: string }> = [
  { key: 'plumbing', label: 'Plumbing', price: 'From €89' },
  { key: 'electrical', label: 'Electrical', price: 'From €95' },
  { key: 'cleaning', label: 'Cleaning', price: 'From €65' },
  { key: 'painting', label: 'Painting', price: 'From €120' },
  { key: 'gardening', label: 'Gardening', price: 'From €70' },
  { key: 'security', label: 'CCTV & Alarms', price: 'From €140' },
  { key: 'it', label: 'IT Support', price: 'From €75' },
  { key: 'moving', label: 'Moving Help', price: 'From €160' },
];

export function ServiceGrid(): JSX.Element {
  return (
    <section id="services" className="fx-container space-y-8 py-16">
      <div className="flex flex-col gap-4 text-center">
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">
          Everything your home needs, on call.
        </h2>
        <p className="text-white/60">
          Premium vetted professionals for urgent fixes and scheduled care. Tap a service to start booking instantly.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {services.map((service, index) => (
          <motion.div
            key={service.key}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ ...fxTransition, delay: index * 0.05 }}
          >
            <Link href={`/book?service=${service.key}`} aria-label={`Book ${service.label}`} className="block h-full">
              <FxCard className="group relative h-full bg-white/10 p-7">
                <div className="relative flex h-full flex-col gap-6">
                  <FxIcon3D name={service.key} />
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-semibold text-white">{service.label}</h3>
                    <p className="text-sm text-white/60">{service.price}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between text-sm text-white/70">
                    <span>Tap to book</span>
                    <span className="text-white">→</span>
                  </div>
                </div>
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
              </FxCard>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
