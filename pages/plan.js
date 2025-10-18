import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Plan.module.css'
import relationships from '../data/relationships.json'

const PLAN_PHASES = [
  {
    id: 'phase-0',
    badge: 'Phase 0',
    title: 'Stabilise & instrument',
    summary: 'Double down on reliability before the next growth push.',
    items: [
      'Audit logging parity across frontend, backend, and Supabase.',
      'Uptime SLO dashboards (BetterStack + Vercel Analytics).',
      'Tighten error budgets and deploy guardrails in CI/CD.'
    ]
  },
  {
    id: 'phase-1',
    badge: 'Phase 1',
    title: 'Growth-ready client funnels',
    summary: 'Sharpen SEO, conversion, and booking speed end to end.',
    items: [
      'Launch guided intake with photo uploads & quote simulator.',
      'Ship landing-page CMS blocks and structured data.',
      'Instrument funnel analytics via PostHog event pipelines.'
    ]
  },
  {
    id: 'phase-2',
    badge: 'Phase 2',
    title: 'Provider excellence',
    summary: 'Delight pros with faster payouts and transparent performance.',
    items: [
      'Stripe Connect Express payouts with dispute automation.',
      'Availability calendar with route density insights.',
      'Quality KPIs, coaching prompts, and NPS feedback loops.'
    ]
  },
  {
    id: 'phase-3',
    badge: 'Phase 3',
    title: 'Enterprise-grade governance',
    summary: 'Codify trust, compliance, and resilience from the start.',
    items: [
      'Row Level Security review with quarterly access recertification.',
      'Turnstile + device trust across every public form.',
      'Incident simulations and tabletop exercises each quarter.'
    ]
  }
]

const NORTH_STAR_METRICS = [
  { label: 'Net promoter score', value: '≥ 55', description: 'Quarterly blended NPS across clients and professionals.' },
  { label: 'First response SLA', value: '≤ 5 min', description: 'Concierge acknowledgement window for every inbound job.' },
  {
    label: 'Same-day completion',
    value: '40%',
    description: 'Share of emergency jobs completed within the request day in Dublin city.'
  }
]

const DELIVERY_GUARDRAILS = [
  {
    title: 'Security & privacy',
    bullets: [
      'Encrypt PII at rest and enforce signed URLs for documents.',
      'Apply least-privilege API keys, rotate secrets quarterly.',
      'Mandatory MFA for admin and operations accounts.'
    ]
  },
  {
    title: 'Operational excellence',
    bullets: [
      'Every feature ships with monitoring, runbooks, and on-call ownership.',
      'Red/black deploy playbooks with 1-click rollback via Vercel.',
      'Dedicated warm-up environment before every major launch.'
    ]
  },
  {
    title: 'Customer experience',
    bullets: [
      'Inclusive copy, accessible components, and responsive breakpoints.',
      'Concierge updates at every milestone: matched, en route, completed.',
      'Real-time satisfaction prompts for continuous quality feedback.'
    ]
  }
]

const ENTITY_TITLES = relationships.entities.reduce((acc, entity) => {
  acc[entity.id] = entity.title
  return acc
}, {})

export default function PlanPage() {
  return (
    <div className={styles.page}>
      <Head>
        <title>FixEasy Rollout Plan — Execution Blueprint</title>
        <meta
          name="description"
          content="Roadmap for stabilising FixEasy, accelerating growth, and reinforcing trust across clients, professionals, and ops."
        />
      </Head>

      <main className="container">
        <section className={styles.hero}>
          <div className={styles.heroPills}>
            <span className={styles.pill}>2025 Delivery</span>
            <span className={styles.pill}>Operations & Trust</span>
            <span className={styles.pill}>Growth Flywheel</span>
          </div>
          <h1 className={styles.heroTitle}>Rollout blueprint for the next FixEasy chapter</h1>
          <p className={styles.heroLead}>
            Align product, operations, and security so every release deepens trust. Four focused phases bring the marketplace to
            national scale without compromising governance.
          </p>
          <div className={styles.linkRow}>
            <Link href="/dashboard" className={styles.linkButton}>
              Review dashboards
            </Link>
          </div>
        </section>

        <section className={styles.section}>
          <header className={styles.sectionHeader}>
            <h2>Execution phases</h2>
            <p>Sequenced initiatives that keep the platform reliable while unlocking rapid growth.</p>
          </header>

          <div className={styles.phaseGrid}>
            {PLAN_PHASES.map((phase) => (
              <article key={phase.id} className={styles.phaseCard}>
                <span className={styles.phaseBadge}>{phase.badge}</span>
                <h3>{phase.title}</h3>
                <p>{phase.summary}</p>
                <ul className={styles.phaseList}>
                  {phase.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className={styles.metricsStrip}>
            {NORTH_STAR_METRICS.map((metric) => (
              <div key={metric.label} className={styles.metric}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
                <p>{metric.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <header className={styles.sectionHeader}>
            <h2>Guardrails that protect the experience</h2>
            <p>Every team shares ownership of security, performance, and empathy for the people who rely on FixEasy.</p>
          </header>

          <div className={styles.guardrailGrid}>
            {DELIVERY_GUARDRAILS.map((guardrail) => (
              <article key={guardrail.title} className={styles.guardrailCard}>
                <h3>{guardrail.title}</h3>
                <ul>
                  {guardrail.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className={`${styles.section} ${styles.relationshipSection}`}>
          <header className={styles.sectionHeader}>
            <h2>How the platform connects the journey</h2>
            <p>Shared data contracts keep clients, professionals, and operations teams in sync.</p>
          </header>

          <div className={styles.relationshipGrid}>
            {relationships.entities.map((entity) => (
              <article key={entity.id} className={styles.entityCard}>
                <h4>{entity.title}</h4>
                <p>{entity.description}</p>
              </article>
            ))}
          </div>

          <div className={styles.relationshipMap}>
            {relationships.relationships.map((rel) => {
              const from = ENTITY_TITLES[rel.from] ?? rel.from
              const to = ENTITY_TITLES[rel.to] ?? rel.to
              return (
                <span key={`${rel.from}-${rel.to}`}>
                  <strong>{from}</strong>
                  <span aria-hidden="true">→</span>
                  <strong>{to}</strong>
                  <em>{rel.label}</em>
                </span>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}
