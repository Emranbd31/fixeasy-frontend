"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const services = [
  { name: "Cleaning", gradient: "from-blue-400 via-blue-500 to-cyan-500" },
  { name: "Handyman", gradient: "from-cyan-400 via-sky-500 to-blue-500" },
  { name: "Plumbing", gradient: "from-sky-400 via-blue-500 to-indigo-500" },
  { name: "Electrical", gradient: "from-indigo-400 via-purple-500 to-blue-500" },
  { name: "Painting", gradient: "from-purple-400 via-violet-500 to-blue-500" },
  { name: "Carpentry", gradient: "from-blue-500 via-sky-500 to-teal-500" },
  { name: "Appliance Repair", gradient: "from-cyan-500 via-blue-500 to-indigo-500" },
  { name: "Landscaping", gradient: "from-teal-400 via-emerald-500 to-cyan-500" },
  { name: "Pest Control", gradient: "from-blue-400 via-indigo-500 to-purple-500" },
  { name: "Roofing", gradient: "from-sky-400 via-cyan-500 to-blue-500" },
  { name: "HVAC", gradient: "from-blue-400 via-sky-500 to-cyan-500" },
  { name: "Flooring", gradient: "from-indigo-400 via-blue-500 to-cyan-500" },
  { name: "Smart Home", gradient: "from-cyan-400 via-blue-500 to-indigo-500" },
  { name: "Locksmith", gradient: "from-blue-500 via-indigo-500 to-purple-500" },
  { name: "Moving", gradient: "from-sky-500 via-blue-500 to-indigo-500" },
];

const steps = [
  {
    title: "Tell us what you need",
    gradient: "from-blue-500 via-sky-500 to-cyan-500",
  },
  {
    title: "Select a top-rated pro",
    gradient: "from-sky-500 via-cyan-500 to-blue-500",
  },
  {
    title: "Relax while we handle it",
    gradient: "from-cyan-500 via-sky-500 to-blue-500",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.1),_transparent_45%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-20 px-6 py-16 sm:py-24">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]"
        >
          <div className="space-y-8 text-slate-900">
            <span className="inline-flex items-center rounded-full bg-white/60 px-4 py-1 text-sm font-semibold text-sky-700 shadow-lg shadow-sky-100 backdrop-blur">
              FixEasy Services
            </span>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Home repairs and maintenance made effortless.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-slate-600">
              From quick fixes to full renovations, our trusted professionals bring
              3D-gradient polish to every service. Book in minutes and enjoy a
              seamless home-care experience.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#services"
                className="group inline-flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-500 px-6 py-3 text-base font-semibold text-white shadow-xl shadow-sky-200 transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                Explore Services
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-full border border-sky-200 bg-white/80 px-6 py-3 text-base font-semibold text-sky-600 shadow-lg shadow-sky-100 backdrop-blur transition-colors duration-200 hover:border-sky-300"
              >
                How FixEasy Works
              </a>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="absolute -left-10 top-6 h-32 w-32 rounded-full bg-gradient-to-br from-sky-400/30 via-blue-500/20 to-indigo-500/10 blur-3xl" />
            <div className="absolute -right-8 bottom-4 h-28 w-28 rounded-full bg-gradient-to-br from-cyan-400/20 via-sky-500/10 to-blue-500/5 blur-3xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-6 shadow-2xl shadow-sky-200 backdrop-blur">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_55%)]" />
              <div className="relative flex flex-col items-center gap-6">
                <div className="rounded-full bg-gradient-to-br from-blue-500 via-sky-500 to-cyan-500 p-4 shadow-2xl shadow-sky-200">
                  <Image
                    src="/images/worker-illustration.png"
                    alt="FixEasy professionals illustration"
                    width={280}
                    height={280}
                    className="h-48 w-48 object-contain"
                    priority
                  />
                </div>
                <div className="text-center space-y-3">
                  <h2 className="text-2xl font-semibold text-slate-900">
                    Trusted professionals, ready for any task
                  </h2>
                  <p className="text-slate-600">
                    Every expert is vetted for quality, reliability, and that signature FixEasy finish.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        <motion.section
          id="services"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-12"
        >
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Choose from our most requested services
            </h2>
            <p className="text-lg text-slate-600">
              Gradient-powered icons reveal our core offerings with a single glance.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.03, duration: 0.6, ease: "easeOut" }}
                className="group relative overflow-hidden rounded-3xl border border-white/50 bg-white/80 p-6 shadow-lg shadow-sky-100 backdrop-blur-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div
                      aria-hidden
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.gradient} opacity-60 blur-xl transition-opacity duration-200 group-hover:opacity-80`}
                    />
                    <div
                      className={`relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${service.gradient} text-2xl font-semibold text-white shadow-xl shadow-sky-200 transition-transform duration-200 group-hover:-translate-y-0.5`}
                    >
                      {service.name.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{service.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      On-demand professionals delivering premium results with FixEasy polish.
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="how-it-works"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="grid gap-10 lg:grid-cols-[1fr_1.2fr]"
        >
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Choose your service in three simple steps
            </h2>
            <p className="text-lg text-slate-600">
              Seamless booking from start to finish with live updates and professional results.
            </p>
            <div className="grid gap-6 sm:grid-cols-3">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="relative overflow-hidden rounded-3xl border border-white/50 bg-white/80 p-6 text-center shadow-lg shadow-sky-100 backdrop-blur"
                >
                  <div
                    className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} text-lg font-bold text-white shadow-lg shadow-sky-200`}
                  >
                    {index + 1}
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">{step.title}</h3>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/80 p-10 shadow-2xl shadow-sky-200 backdrop-blur">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.12),_transparent_55%)]" />
            <div className="relative grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-slate-900">Real-time updates</h3>
                <p className="text-slate-600">
                  Track arrival times, approvals, and completions without refreshing the page.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-slate-900">Flexible scheduling</h3>
                <p className="text-slate-600">
                  Pick the perfect time slot and your FixEasy pro will arrive ready with the right tools.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-slate-900">Seamless payments</h3>
                <p className="text-slate-600">
                  Secure digital payments with receipts delivered instantly to your inbox.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-slate-900">Guaranteed satisfaction</h3>
                <p className="text-slate-600">
                  We stand by every job. If it isn&apos;t perfect, we&apos;ll make it right fast.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/80 px-8 py-12 text-center shadow-2xl shadow-sky-200 backdrop-blur"
        >
          <div className="absolute -left-12 top-0 h-32 w-32 rounded-full bg-gradient-to-br from-blue-400/30 via-sky-500/20 to-cyan-500/20 blur-3xl" />
          <div className="absolute -right-16 bottom-0 h-36 w-36 rounded-full bg-gradient-to-br from-cyan-400/25 via-sky-500/15 to-blue-500/10 blur-3xl" />
          <div className="relative mx-auto max-w-3xl space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Ready to experience the FixEasy finish?
            </h2>
            <p className="text-lg text-slate-600">
              Let our professionals bring gradient-perfect care to your home. Book now and
              step into a fresher space.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="https://www.fixeasy.irish/book"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-500 px-6 py-3 text-base font-semibold text-white shadow-xl shadow-sky-200 transition-transform duration-200 hover:-translate-y-0.5"
              >
                Book a Service
              </a>
              <a
                href="mailto:hello@fixeasy.irish"
                className="inline-flex items-center justify-center rounded-full border border-sky-200 bg-white/80 px-6 py-3 text-base font-semibold text-sky-600 shadow-lg shadow-sky-100 backdrop-blur transition-colors duration-200 hover:border-sky-300"
              >
                Talk to Us
              </a>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
