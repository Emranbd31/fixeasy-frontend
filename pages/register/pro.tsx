import { ChangeEvent, FormEvent, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

import { NavBar } from '../../components/NavBar'
import { Footer } from '../../components/Footer'
import { getCsrfToken } from '../../lib/csrfClient'

const serviceCategories = [
  'Plumbing & Heating',
  'Electrical & EV',
  'Cleaning & Facilities',
  'Carpentry & Fit-Out',
  'Landscaping & Outdoors',
  'Painting & Decorating',
  'Logistics & Moves',
]

type FormState = {
  fullName: string
  businessName: string
  email: string
  phone: string
  coverageArea: string
  categories: string[]
  idDocument?: File | null
}

const initialState: FormState = {
  fullName: '',
  businessName: '',
  email: '',
  phone: '',
  coverageArea: '',
  categories: [],
  idDocument: null,
}

type SubmitStatus = {
  type: 'idle' | 'error' | 'success'
  message?: string
}

export default function ProfessionalRegistrationPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(initialState)
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<SubmitStatus>({ type: 'idle' })

  const toggleCategory = (category: string) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((item) => item !== category)
        : [...prev.categories, category],
    }))
  }

  const handleInputChange = (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      setForm((prev) => ({ ...prev, idDocument: null }))
      return
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      setStatus({ type: 'error', message: 'ID upload must be a PDF, JPG, or PNG file.' })
      event.target.value = ''
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setStatus({ type: 'error', message: 'File size must be below 10 MB.' })
      event.target.value = ''
      return
    }

    setStatus({ type: 'idle' })
    setForm((prev) => ({ ...prev, idDocument: file }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return

    if (form.categories.length === 0) {
      setStatus({ type: 'error', message: 'Select at least one service category.' })
      return
    }

    setSubmitting(true)
    setStatus({ type: 'idle' })

    try {
      const payload = new FormData()
      payload.append('full_name', form.fullName)
      payload.append('business_name', form.businessName)
      payload.append('email', form.email)
      payload.append('phone', form.phone)
      payload.append('coverage_area', form.coverageArea)
      payload.append('categories', JSON.stringify(form.categories))
      payload.append('status', 'pending_approval')
      if (form.idDocument) {
        payload.append('id_document', form.idDocument)
      }

      const response = await fetch('/api/register/pro', {
        method: 'POST',
        headers: {
          'x-csrf-token': getCsrfToken(),
        },
        body: payload,
      })

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}))
        throw new Error(errorBody?.detail || errorBody?.message || 'Unable to submit registration. Please try again.')
      }

      setStatus({ type: 'success', message: 'Registration received! Redirecting to your dashboard…' })
      await router.push('/dashboard/pro')
    } catch (error) {
      setStatus({ type: 'error', message: error instanceof Error ? error.message : 'An unexpected error occurred.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-slate-950">
      <Head>
        <title>Join FixEasy as a Professional</title>
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
              Professionals
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Grow with FixEasy</h1>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Access high-quality jobs, managed payments, and compliance support. We partner with independent pros and established teams across Ireland.
            </p>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li>• Dedicated partner manager with national coverage</li>
              <li>• Weekly payouts with line-item job summaries</li>
              <li>• Optional ID uploads to fast-track verification</li>
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
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="fullName">
                    Full name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={form.fullName}
                    onChange={handleInputChange('fullName')}
                    className="mt-2 block w-full rounded-xl border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-brand focus:ring-brand dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="businessName">
                    Business name
                  </label>
                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    required
                    value={form.businessName}
                    onChange={handleInputChange('businessName')}
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
                    onChange={handleInputChange('email')}
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
                    onChange={handleInputChange('phone')}
                    className="mt-2 block w-full rounded-xl border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-brand focus:ring-brand dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="coverageArea">
                    Coverage area
                  </label>
                  <input
                    id="coverageArea"
                    name="coverageArea"
                    type="text"
                    required
                    placeholder="Counties, towns, or service radius"
                    value={form.coverageArea}
                    onChange={handleInputChange('coverageArea')}
                    className="mt-2 block w-full rounded-xl border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-brand focus:ring-brand dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Service categories</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {serviceCategories.map((category) => (
                    <label key={category} className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white/70 px-4 py-3 text-sm text-slate-600 transition-all duration-300 hover:border-brand hover:text-brand dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={form.categories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
                      />
                      {category}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Optional photo ID upload</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Uploading a government-issued ID speeds up compliance checks but isn’t mandatory.
                </p>
                <input
                  type="file"
                  accept="application/pdf,image/jpeg,image/png"
                  onChange={handleFileChange}
                  className="block w-full rounded-xl border border-dashed border-slate-300 bg-white/60 px-4 py-4 text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-brand file:to-accent-cyan file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-brand focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300"
                />
              </div>

              {status.type === 'error' ? (
                <p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
                  {status.message}
                </p>
              ) : null}

              {status.type === 'success' ? (
                <p className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200">
                  {status.message}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-brand to-accent-cyan px-6 py-3 text-base font-semibold text-white shadow-brand-card transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? 'Submitting…' : 'Submit registration'}
              </button>
            </form>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
