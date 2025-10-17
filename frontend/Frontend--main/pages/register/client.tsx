import { ChangeEvent, FormEvent, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

import { NavBar } from '../../components/NavBar'
import { Footer } from '../../components/Footer'
import { getCsrfToken } from '../../lib/csrfClient'

const initialState = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  eircode: '',
  password: '',
  acceptTerms: false,
}

type FormState = typeof initialState

type SubmitStatus = {
  type: 'idle' | 'error' | 'success'
  message?: string
}

export default function ClientRegistrationPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(initialState)
  const [status, setStatus] = useState<SubmitStatus>({ type: 'idle' })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.currentTarget
    setForm((prev) => ({ ...prev, [field]: target.type === 'checkbox' ? target.checked : target.value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return

    if (!form.acceptTerms) {
      setStatus({ type: 'error', message: 'Please accept the FixEasy terms to continue.' })
      return
    }

    setSubmitting(true)
    setStatus({ type: 'idle' })

    try {
      const response = await fetch('/api/register/client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': getCsrfToken(),
        },
        body: JSON.stringify({
          full_name: form.fullName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          eircode: form.eircode,
          password: form.password,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload?.detail || payload?.message || 'Unable to create account. Please try again.')
      }

      setStatus({ type: 'success', message: 'Account created! Redirecting to your dashboard…' })
      await router.push('/dashboard/client')
    } catch (error) {
      setStatus({ type: 'error', message: error instanceof Error ? error.message : 'An unexpected error occurred.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-slate-950">
      <Head>
        <title>Register as a FixEasy Client</title>
      </Head>
      <NavBar />
      <main className="section-spacing flex-1 bg-slate-50 dark:bg-slate-950">
        <div className="container grid gap-12 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6 lg:col-span-5"
          >
            <span className="inline-flex items-center rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-brand shadow-brand-soft dark:bg-slate-900/70 dark:text-accent-cyan">
              Clients
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Create your FixEasy account</h1>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Book trusted professionals with transparent pricing, live progress updates, and priority support across Ireland.
            </p>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li>• Verified pros matched to your property profile</li>
              <li>• Digital job history and downloadable invoices</li>
              <li>• Emergency support with guaranteed response windows</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <form
              onSubmit={handleSubmit}
              className="card-surface border border-slate-200/60 p-8 shadow-brand-soft dark:border-slate-800"
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="fullName">
                    Full name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={form.fullName}
                    onChange={handleChange('fullName')}
                    className="mt-2 block w-full rounded-xl border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-brand focus:ring-brand dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange('email')}
                    className="mt-2 block w-full rounded-xl border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-brand focus:ring-brand dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="phone">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={handleChange('phone')}
                    className="mt-2 block w-full rounded-xl border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-brand focus:ring-brand dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="address">
                    Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    value={form.address}
                    onChange={handleChange('address')}
                    className="mt-2 block w-full rounded-xl border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-brand focus:ring-brand dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="eircode">
                    Eircode
                  </label>
                  <input
                    id="eircode"
                    name="eircode"
                    type="text"
                    required
                    value={form.eircode}
                    onChange={handleChange('eircode')}
                    className="mt-2 block w-full rounded-xl border-slate-200 bg-white/80 px-4 py-3 text-sm uppercase tracking-widest text-slate-900 shadow-sm focus:border-brand focus:ring-brand dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    value={form.password}
                    onChange={handleChange('password')}
                    className="mt-2 block w-full rounded-xl border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-brand focus:ring-brand dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100"
                  />
                </div>
              </div>

              <label className="mt-6 flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={form.acceptTerms}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, acceptTerms: event.currentTarget.checked }))
                  }
                  className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
                />
                I agree to the FixEasy <a href="/terms" className="underline">Terms of Service</a> and{' '}
                <a href="/privacy" className="underline">
                  Privacy Policy
                </a>
                .
              </label>

              {status.type === 'error' ? (
                <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
                  {status.message}
                </p>
              ) : null}

              {status.type === 'success' ? (
                <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200">
                  {status.message}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-brand to-accent-cyan px-6 py-3 text-base font-semibold text-white shadow-brand-card transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? 'Creating account…' : 'Create account'}
              </button>
            </form>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
