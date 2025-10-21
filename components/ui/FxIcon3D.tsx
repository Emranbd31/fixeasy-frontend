'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  BadgeCheck,
  BaggageClaim,
  Camera,
  Drill,
  Hammer,
  Paintbrush,
  PlugZap,
  ShieldCheck,
  Sparkles,
  Sprout,
  Truck,
  Wrench,
  Cpu,
} from 'lucide-react';

import { cn, fxTransition } from '@/lib/utils';

const iconMap = {
  plumbing: Wrench,
  electrical: PlugZap,
  cleaning: Sparkles,
  painting: Paintbrush,
  gardening: Sprout,
  security: Camera,
  it: Cpu,
  moving: Truck,
  appliances: Drill,
  maintenance: Hammer,
  premium: BadgeCheck,
  concierge: BaggageClaim,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconMap;

const gradientMap: Record<IconName, string> = {
  plumbing: 'linear-gradient(135deg, rgba(79,140,255,1), rgba(61,220,255,0.9))',
  electrical: 'linear-gradient(135deg, rgba(255,181,71,1), rgba(79,140,255,0.85))',
  cleaning: 'linear-gradient(135deg, rgba(255,106,182,0.95), rgba(79,140,255,0.85))',
  painting: 'linear-gradient(135deg, rgba(255,118,102,0.95), rgba(255,181,71,0.85))',
  gardening: 'linear-gradient(135deg, rgba(31,221,159,1), rgba(79,140,255,0.7))',
  security: 'linear-gradient(135deg, rgba(79,140,255,1), rgba(132,178,255,0.85))',
  it: 'linear-gradient(135deg, rgba(61,220,255,1), rgba(79,140,255,0.8))',
  moving: 'linear-gradient(135deg, rgba(255,106,182,0.95), rgba(31,221,159,0.85))',
  appliances: 'linear-gradient(135deg, rgba(132,178,255,0.95), rgba(61,220,255,0.85))',
  maintenance: 'linear-gradient(135deg, rgba(130,146,255,0.95), rgba(79,140,255,0.8))',
  premium: 'linear-gradient(135deg, rgba(255,181,71,0.95), rgba(255,106,182,0.85))',
  concierge: 'linear-gradient(135deg, rgba(31,221,159,0.95), rgba(61,220,255,0.85))',
};

export interface FxIcon3DProps {
  name: IconName;
  className?: string;
  size?: number;
  label?: string;
}

export function FxIcon3D({ name, className, size = 28, label }: FxIcon3DProps) {
  const IconComponent = iconMap[name] ?? Wrench;
  const background = gradientMap[name] ?? gradientMap.plumbing;

  return (
    <motion.div
      aria-hidden={label ? undefined : true}
      className={cn('relative flex h-16 w-16 items-center justify-center rounded-2xl', className)}
      style={{
        background,
        boxShadow: '0 22px 40px rgba(5, 17, 47, 0.45), inset 0 1px 0 rgba(255,255,255,0.22)',
        border: '2px solid rgba(255,255,255,0.2)',
      }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={fxTransition}
    >
      <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/45 via-transparent to-transparent opacity-70 mix-blend-screen" />
      <span className="absolute inset-[2px] rounded-[18px] border border-white/15" />
      <IconComponent
        aria-label={label}
        className="relative text-white drop-shadow-[0_6px_16px_rgba(5,17,47,0.6)]"
        size={size}
      />
    </motion.div>
  );
}
