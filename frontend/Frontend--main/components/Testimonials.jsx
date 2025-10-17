import dynamic from 'next/dynamic'

const testimonials = [
  {
    quote:
      'FixEasy matched us with a vetted electrician who upgraded our office lighting overnight. The communication, tracking, and aftercare were flawless.',
    name: 'Sarah Donnelly',
    role: 'Operations Manager, Dublin',
  },
  {
    quote:
      'I trust FixEasy for every renovation. Their pros arrive prepared, document everything, and payments are seamless through their platform.',
    name: 'Colm O’Reilly',
    role: 'Property Investor, Cork',
  },
  {
    quote:
      'As a busy family we needed a one-stop partner. FixEasy’s teams are punctual, polite, and the quality assurance calls make all the difference.',
    name: 'Niamh Gallagher',
    role: 'Homeowner, Galway',
  },
]

const TestimonialsCarousel = dynamic(
  () => import('./TestimonialsCarousel').then((mod) => mod.TestimonialsCarousel),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl bg-slate-900/80 p-10 text-white shadow-brand-card">
        <p className="text-sm text-slate-200">Loading testimonials…</p>
      </div>
    ),
  }
)

export function Testimonials() {
  return (
    <section className="section-spacing bg-white dark:bg-slate-950">
      <div className="container grid gap-12 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-4">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">What Clients Say</h2>
          <p className="text-base text-slate-600 dark:text-slate-300">
            Enterprise facilities, managed estates, and households across Ireland choose FixEasy for rapid response and transparent project management.
          </p>
        </div>
        <div className="lg:col-span-8">
          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </div>
    </section>
  )
}
