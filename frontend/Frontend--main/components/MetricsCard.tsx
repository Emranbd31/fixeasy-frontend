import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../lib/cn'

type MetricsCardProps = {
  label: string
  value: ReactNode
  icon?: ReactNode
  accent?: 'brand' | 'emerald' | 'amber' | 'rose'
}

const accentClasses: Record<NonNullable<MetricsCardProps['accent']>, string> = {
  brand: 'from-brand to-accent-cyan text-white',
  emerald: 'from-emerald-500 to-emerald-400 text-white',
  amber: 'from-amber-400 to-amber-300 text-slate-900',
  rose: 'from-rose-500 to-rose-400 text-white',
}

export function MetricsCard({ label, value, icon, accent = 'brand' }: MetricsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className={cn(
        'flex flex-col justify-between rounded-2xl bg-gradient-to-br p-6 shadow-brand-card transition-transform duration-300 hover:-translate-y-1',
        accentClasses[accent]
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-widest">{label}</p>
        {icon ? <span className="text-white/80">{icon}</span> : null}
      </div>
      <div className="mt-6 text-3xl font-bold tracking-tight">{value}</div>
    </motion.div>
  )
}
