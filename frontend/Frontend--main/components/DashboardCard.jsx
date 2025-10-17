import { motion } from 'framer-motion'
import { cn } from '../lib/cn'

export function DashboardCard({ title, description, actions, children, className }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className={cn(
        'card-surface border border-slate-200/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-brand-card dark:border-slate-800',
        className
      )}
    >
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
          {description ? <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p> : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </header>
      <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">{children}</div>
    </motion.section>
  )
}
