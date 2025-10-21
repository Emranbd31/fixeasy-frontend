'use client';

import { motion } from 'framer-motion';
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
} from 'lucide-react';

import { cn, fxTransition } from '@/lib/utils';

const iconMap = {
  plumbing: Wrench,
  electrical: PlugZap,
  cleaning: Sparkles,
  painting: Paintbrush,
  gardening: Sprout,
  security: Camera,
  it: ShieldCheck,
  moving: Truck,
  appliances: Drill,
  maintenance: Hammer,
  premium: BadgeCheck,
  concierge: BaggageClaim,
};

export type IconName = keyof typeof iconMap;

const gradientMap: Record<IconName, string> = {
  plumbing: 'linear-gradient(135deg, rgba(46,107,255,0.95), rgba(22,163,74,0.75))',
  electrical: 'linear-gradient(135deg, rgba(245,158,11,0.95), rgba(46,107,255,0.65))',
  cleaning: 'linear-gradient(135deg, rgba(59,130,246,0.92), rgba(236,72,153,0.7))',
  painting: 'linear-gradient(135deg, rgba(99,102,241,0.92), rgba(219,39,119,0.7))',
  gardening: 'linear-gradient(135deg, rgba(22,163,74,0.92), rgba(16,185,129,0.68))',
  security: 'linear-gradient(135deg, rgba(46,107,255,0.95), rgba(59,130,246,0.68))',
  it: 'linear-gradient(135deg, rgba(14,116,144,0.92), rgba(46,107,255,0.68))',
  moving: 'linear-gradient(135deg, rgba(248,113,113,0.92), rgba(245,158,11,0.75))',
  appliances: 'linear-gradient(135deg, rgba(56,189,248,0.88), rgba(59,130,246,0.78))',
  maintenance: 'linear-gradient(135deg, rgba(107,114,128,0.95), rgba(37,99,235,0.7))',
  premium: 'linear-gradient(135deg, rgba(217,119,6,0.95), rgba(59,130,246,0.75))',
  concierge: 'linear-gradient(135deg, rgba(45,212,191,0.92), rgba(56,189,248,0.78))',
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
        boxShadow: '0 18px 30px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.18)',
        border: '2px solid rgba(255,255,255,0.18)',
      }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={fxTransition}
    >
      <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/35 via-transparent to-transparent opacity-60 mix-blend-screen" />
      <span className="absolute inset-[2px] rounded-[18px] border border-white/10" />
      <IconComponent
        aria-label={label}
        className="relative text-white drop-shadow-[0_4px_12px_rgba(15,21,44,0.65)]"
        size={size}
      />
    </motion.div>
  );
}
