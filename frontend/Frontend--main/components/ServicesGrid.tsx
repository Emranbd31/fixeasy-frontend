import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Wrench, PlugZap, Trees, Hammer, Truck } from 'lucide-react'

const categories = [
  {
    id: 'home-maintenance',
    label: 'Home Maintenance',
    icon: Wrench,
    description: 'Responsive specialists for everyday fixes across the home.',
    services: [
      { name: 'Handyman Support', blurb: 'Door adjustments, fixture replacements, general repairs.' },
      { name: 'Appliance Installations', blurb: 'Manufacturer-approved installs with full safety testing.' },
      { name: 'Locksmith Services', blurb: 'Smart lock upgrades, rekeying, emergency lockouts.' },
    ],
  },
  {
    id: 'electrical',
    label: 'Electrical',
    icon: PlugZap,
    description: 'Certified electricians and smart-home specialists.',
    services: [
      { name: 'EV & Charging', blurb: 'Safe, SEAI-compliant installs with load balancing.' },
      { name: 'Smart Home', blurb: 'Lighting, CCTV, thermostats, and connected security.' },
      { name: 'Safety Inspections', blurb: 'Periodic testing and rewiring for every property type.' },
    ],
  },
  {
    id: 'outdoor',
    label: 'Outdoor',
    icon: Trees,
    description: 'Landscaping and exterior care for every season.',
    services: [
      { name: 'Garden Care', blurb: 'Seasonal tidy-ups, planting plans, lawn care programs.' },
      { name: 'Roof & Gutter', blurb: 'Safe moss removal, gutter repairs, exterior cleaning.' },
      { name: 'Power Washing', blurb: 'Driveways, patios, and stone restoration without damage.' },
    ],
  },
  {
    id: 'trades',
    label: 'Trades',
    icon: Hammer,
    description: 'Skilled professionals for renovation and specialised works.',
    services: [
      { name: 'Plumbing & Heating', blurb: 'Emergency leaks, boiler maintenance, bathroom fit-outs.' },
      { name: 'Carpentry & Fit-Out', blurb: 'Custom storage, flooring, office and retail refurbishments.' },
      { name: 'Painting & Decorating', blurb: 'Interior refresh, exterior weather protection, commercial jobs.' },
    ],
  },
  {
    id: 'logistics',
    label: 'Logistics',
    icon: Truck,
    description: 'Reliable support for moves, deliveries, and storage.',
    services: [
      { name: 'Moving Assistance', blurb: 'Apartment or office relocations with insured crews.' },
      { name: 'Specialist Transport', blurb: 'Piano, art, and sensitive item handling with care.' },
      { name: 'Waste & Clearance', blurb: 'Licensed disposals, garden clear-outs, post-renovation tidy-ups.' },
    ],
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.08, duration: 0.45 },
  }),
}

export function ServicesGrid() {
  const [active, setActive] = useState(categories[0])
  const Icon = active.icon

  const services = useMemo(() => active.services, [active])

  return (
    <section id="services" className="section-spacing bg-slate-50 dark:bg-slate-950">
      <div className="container grid gap-12 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-4">
          <div className="inline-flex items-center rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-brand shadow-brand-card shadow-brand-soft dark:bg-slate-900/80 dark:text-accent-cyan">
            Services
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Everything your property needs.</h2>
          <p className="text-base text-slate-600 dark:text-slate-300">
            Choose from curated categories built for homes, offices, and managed estates. Every FixEasy professional is Garda-vetted, insured, and tracked via our compliance dashboards.
          </p>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const CategoryIcon = category.icon
              const isActive = category.id === active.id
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActive(category)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? 'border-transparent bg-gradient-to-r from-brand to-accent-cyan text-white shadow-brand-card'
                      : 'border-slate-200 bg-white/80 text-slate-600 hover:border-brand hover:text-brand dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300'
                  }`}
                >
                  <CategoryIcon className="h-4 w-4" />
                  {category.label}
                </button>
              )
            })}
          </div>
          <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-6 text-sm text-slate-600 shadow-brand-soft dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200">
            <p className="font-semibold text-slate-900 dark:text-white">Quality promise</p>
            <p>
              Need something bespoke? Our concierge team will scope, price, and dispatch vetted specialists within hours.
            </p>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="card-surface border border-slate-200/60 p-8 dark:border-slate-800">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400">Active category</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{active.label}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{active.description}</p>
              </div>
              <span className="hidden rounded-full bg-gradient-to-r from-brand to-accent-cyan p-3 text-white shadow-brand-card md:inline-flex">
                <Icon className="h-6 w-6" />
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <AnimatePresence initial={false}>
                {services.map((service, index) => (
                  <motion.div
                    key={`${active.id}-${service.name}`}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    custom={index}
                    className="group flex flex-col justify-between rounded-2xl border border-slate-200/60 bg-white/90 p-6 shadow-brand-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-brand-card dark:border-slate-800 dark:bg-slate-900/70"
                  >
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 transition-colors duration-300 group-hover:text-brand dark:text-white">
                        {service.name}
                      </h4>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{service.blurb}</p>
                    </div>
                    <div className="mt-6">
                      <Link
                        href="/book"
                        className="inline-flex items-center text-sm font-semibold text-brand transition-colors duration-300 group-hover:text-accent-cyan"
                      >
                        Book Now →
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
