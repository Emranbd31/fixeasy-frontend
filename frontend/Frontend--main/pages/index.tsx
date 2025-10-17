import Head from 'next/head'
import { motion } from 'framer-motion'

import { NavBar } from '../components/NavBar'
import { Hero } from '../components/Hero'
import { ServicesGrid } from '../components/ServicesGrid'
import { Testimonials } from '../components/Testimonials'
import { TrustSection } from '../components/TrustSection'
import { Footer } from '../components/Footer'

const serviceHighlights = [
  {
    title: 'Verified & Vetted Pros',
    description: 'All professionals pass Garda vetting, insurance checks, and continuous quality scoring.',
  },
  {
    title: 'Seamless Digital Experience',
    description: 'Book, track, and rate every job with live notifications and transparent pricing.',
  },
  {
    title: 'Nationwide Coverage',
    description: 'Serving Dublin, Cork, Galway, Limerick, and beyond with locally managed teams.',
  },
]

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-slate-950">
      <Head>
        <title>FixEasy | Trusted Home Services Across Ireland</title>
        <meta
          name="description"
          content="Book plumbers, electricians, decorators, and more across Ireland with FixEasy’s vetted professional network."
        />
      </Head>
      <NavBar />
      <main className="flex-1">
        <Hero />
        <section className="section-spacing bg-white dark:bg-slate-950">
          <div className="container grid gap-10 lg:grid-cols-3">
            {serviceHighlights.map((highlight, index) => (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="card-surface border border-slate-200/60 p-6 shadow-brand-soft dark:border-slate-800"
              >
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{highlight.title}</h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{highlight.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
        <ServicesGrid />
        <Testimonials />
        <TrustSection />
        <section className="section-spacing bg-gradient-to-br from-brand to-accent-cyan">
          <div className="container grid gap-10 text-white lg:grid-cols-12 lg:items-center">
            <div className="space-y-6 lg:col-span-7">
              <h2 className="text-3xl font-bold tracking-tight">Ready to experience enterprise-grade home services?</h2>
              <p className="text-base text-white/80">
                Whether you manage hundreds of properties or simply need trusted help at home, FixEasy delivers responsive, auditable work orders backed by real humans.
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-white/10 p-6 text-sm backdrop-blur">
                <p className="font-semibold">Need urgent support?</p>
                <p className="mt-2 text-white/80">Call our 24/7 team on <a href="tel:+35315512345" className="underline">+353 1 551 2345</a>.</p>
                <p className="mt-4 font-semibold">Partner enquiries</p>
                <p className="mt-2 text-white/80">Email <a href="mailto:partnerships@fixeasy.irish" className="underline">partnerships@fixeasy.irish</a> to book an onboarding session.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
