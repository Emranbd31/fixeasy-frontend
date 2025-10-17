import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

const HERO_IMAGE =
  'https://images.pexels.com/photos/5588496/pexels-photo-5588496.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1600'
const HERO_BLUR_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9YV2UaoAAAAASUVORK5CYII='

const badges = [
  { label: '⭐ 4.9 Rating' },
  { label: '500+ Verified Pros' },
  { label: 'On-Time Guarantee' },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt="Verified FixEasy professional"
          placeholder="blur"
          blurDataURL={HERO_BLUR_DATA_URL}
          fill
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand/90 via-slate-900/90 to-accent-cyan/60" />
      </div>

      <div className="container relative grid gap-12 py-24 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur"
          >
            Trusted across Ireland
          </motion.div>

          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Trusted Home Services Across Ireland
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-lg text-slate-100/80 sm:max-w-xl"
            >
              Book plumbers, electricians, decorators, and more — fast, verified, and reliable. FixEasy connects you with vetted professionals ready to deliver exceptional service.
            </motion.p>
          </div>

          <motion.div
            className="flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link
              href="/book"
              className="inline-flex items-center rounded-full bg-gradient-to-r from-brand to-accent-cyan px-6 py-3 text-base font-semibold text-white shadow-brand-card transition-transform duration-300 hover:-translate-y-0.5"
            >
              Book a Service
            </Link>
            <Link
              href="/register/pro"
              className="inline-flex items-center rounded-full border border-white/60 px-6 py-3 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
            >
              Join as Professional
            </Link>
          </motion.div>

          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            {badges.map((badge) => (
              <span key={badge.label} className="badge border border-white/20 bg-white/10 text-white">
                {badge.label}
              </span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          viewport={{ once: true }}
          className="relative hidden h-[520px] overflow-hidden rounded-2xl border border-white/20 bg-white/5 shadow-brand-card lg:block"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-brand/30" />
          <Image
            src={HERO_IMAGE}
            alt="Verified FixEasy professional"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            placeholder="blur"
            blurDataURL={HERO_BLUR_DATA_URL}
            className="object-cover"
            priority
          />
          <div className="absolute bottom-6 left-6 right-6 space-y-3 rounded-2xl bg-slate-950/80 p-6 text-sm shadow-lg">
            <p className="font-semibold text-white">Why customers choose FixEasy</p>
            <ul className="space-y-2 text-slate-200/80">
              <li>• Verified local professionals with Garda-vetted backgrounds</li>
              <li>• Real-time job tracking and transparent pricing</li>
              <li>• Dedicated support team with 24/7 emergency line</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
