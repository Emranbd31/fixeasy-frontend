import { motion } from 'framer-motion'

const partners = ['Irish Life', 'Securitas Ireland', 'AIB Facilities', 'Dublin City Council']

export function TrustSection() {
  return (
    <section id="about" className="section-spacing bg-slate-50 dark:bg-slate-950">
      <div className="container space-y-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Verified Pros. Transparent Standards.</h2>
            <p className="text-base text-slate-600 dark:text-slate-300">
              FixEasy’s compliance engine ensures every professional is insured, Garda vetted, and performance scored after each job. Row-level security protects client data, while real-time dashboards give you visibility across properties and works orders.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="card-surface border border-slate-200/60 p-6 text-sm dark:border-slate-800">
                <p className="font-semibold text-slate-900 dark:text-white">Live background checks</p>
                <p className="mt-2 text-slate-600 dark:text-slate-300">Automated watch-list scanning, insurance expiry alerts, and compliance scoring every 30 days.</p>
              </div>
              <div className="card-surface border border-slate-200/60 p-6 text-sm dark:border-slate-800">
                <p className="font-semibold text-slate-900 dark:text-white">Service level guarantees</p>
                <p className="mt-2 text-slate-600 dark:text-slate-300">On-time arrivals, digital job reports, and payment protection backed by the FixEasy platform.</p>
              </div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/90 p-10 shadow-brand-card dark:border-slate-800 dark:bg-slate-900/80"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-accent-cyan/20" />
            <div className="relative space-y-6 text-slate-700 dark:text-slate-200">
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Why teams partner with FixEasy</h3>
              <ul className="space-y-4">
                <li>• Dedicated account manager with national coverage</li>
                <li>• Digital job files with photos, risk assessments, and sign-offs</li>
                <li>• API-first platform with FastAPI backend and Supabase auditing</li>
              </ul>
              <div id="contact" className="gradient-divider" />
              <p className="text-sm">Talk to our enterprise onboarding team at <a href="mailto:hello@fixeasy.irish" className="underline">hello@fixeasy.irish</a></p>
            </div>
          </motion.div>
        </div>
        <div className="card-surface border border-slate-200/60 p-8 text-center dark:border-slate-800">
          <p className="text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400">Trusted by teams across Ireland</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {partners.map((partner) => (
              <motion.div
                key={partner}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-slate-200/60 bg-white/80 p-6 text-base font-semibold text-slate-600 shadow-brand-soft dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200"
              >
                {partner}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
