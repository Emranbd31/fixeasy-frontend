import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'

const ICON_STROKE = 1.8
const ICON_CLASS = 'service-card__svg'

// Icon outlines inspired by Tabler Icons (MIT License).
const iconPaths = {
  plumber: (
    <>
      <path d="M4 20.5 7.5 17 11 20.5" />
      <path d="m11 13 5-5 4 4-5 5" />
      <path d="M18 6V3" />
      <path d="M5 21h6" />
    </>
  ),
  electrician: (
    <>
      <path d="M13 3 6 14h7l-1 7 8-11h-7z" />
    </>
  ),
  handyman: (
    <>
      <path d="m5 16 6-6" />
      <path d="M9 8V5a2 2 0 0 1 2-2h2l3 3-2 2 4 4 2-2 3 3-5 5" />
      <path d="m7 18-2 2 3 3 2-2" />
    </>
  ),
  roofer: (
    <>
      <path d="m4 13 8-6 8 6" />
      <path d="M6 12v9h12v-9" />
      <path d="M10 21v-4h4v4" />
    </>
  ),
  carpenter: (
    <>
      <path d="M7 7h6v10H7z" />
      <path d="M13 12 20 19l-2 2-7-7" />
      <path d="m16 9 2-2 3 3-2 2" />
    </>
  ),
  cleaner: (
    <>
      <path d="M8 6h8l1 4H7z" />
      <rect x="7" y="10" width="10" height="12" rx="3" />
      <path d="M12 10V5" />
      <path d="M6 22h12" />
    </>
  ),
  window: (
    <>
      <rect x="5" y="4" width="14" height="16" rx="1.8" />
      <path d="M12 4v16M5 12h14" />
      <path d="m8 7 2 2m6-2-2 2" />
    </>
  ),
  gutter: (
    <>
      <path d="M4 6h16v3a5 5 0 0 1-5 5h-3a3 3 0 0 0-3 3v3" />
      <path d="M8 20h8" />
      <path d="M15 14v4" />
    </>
  ),
  appliance: (
    <>
      <rect x="5" y="4" width="14" height="16" rx="4" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <path d="M9 7h6" />
    </>
  ),
  gardener: (
    <>
      <path d="M9 19c0-4 2-8 6-10" />
      <path d="M15 9c-3 0-5-2-5-5 3 0 5 2 5 5Z" />
      <path d="M9 19c-2 0-4-2-4-4 2 0 4 2 4 4Z" />
      <path d="M12 16v6" />
    </>
  ),
  painter: (
    <>
      <rect x="15" y="4" width="4" height="8" />
      <path d="M5 13h14v4a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5z" />
      <path d="M9 13V6h6v7" />
    </>
  ),
  security: (
    <>
      <path d="M12 3 5 6v7c0 6 4 11 7 12 3-1 7-6 7-12V6z" />
      <path d="M12 10a2.5 2.5 0 0 1 2.5 2.5c0 1.5-2.5 3.5-2.5 3.5s-2.5-2-2.5-3.5A2.5 2.5 0 0 1 12 10z" />
    </>
  ),
  'smart-home': (
    <>
      <path d="m4 12 8-6 8 6v9H4z" />
      <path d="M9 18h6v-4H9z" />
      <path d="M16 9a4 4 0 0 1 4 4" />
      <path d="M8 9a4 4 0 0 0-4 4" />
    </>
  ),
  flooring: (
    <>
      <rect x="5" y="5" width="6" height="6" rx="1.4" />
      <rect x="13" y="13" width="6" height="6" rx="1.4" />
      <path d="M11 5h8v8h-8zM5 13h8v8H5z" />
    </>
  ),
  default: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v5l3 3" />
    </>
  )
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      delay: index * 0.05
    }
  }),
  hover: {
    y: -6,
    boxShadow: '0 24px 60px rgba(37, 99, 235, 0.18)',
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1]
    }
  }
}

const iconVariants = {
  hidden: { opacity: 0, scale: 0.75, rotate: -6 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
  },
  hover: {
    scale: 1.12,
    rotate: 4,
    transition: {
      duration: 0.7,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'mirror'
    }
  }
}

const glowVariants = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: { opacity: 0.75, scale: 1, transition: { delay: 0.2, duration: 0.6 } },
  hover: { opacity: 1, scale: 1.1, transition: { duration: 0.4 } }
}

const ServiceCardIcon = memo(function ServiceCardIcon({ type }) {
  const content = useMemo(() => iconPaths[type] ?? iconPaths.default, [type])
  return (
    <svg
      className={ICON_CLASS}
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={ICON_STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      role="img"
    >
      {content}
    </svg>
  )
})

function ServiceCard({ service, index }) {
  return (
    <motion.article
      className="service-card"
      custom={index}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, amount: 0.2 }}
      variants={cardVariants}
    >
      <motion.span className="service-card__glow" aria-hidden="true" variants={glowVariants} />
      <motion.div className="service-card__icon" variants={iconVariants}>
        <ServiceCardIcon type={service.icon} />
      </motion.div>
      <div className="service-card__content">
        {service.group ? <span className="service-card__eyebrow">{service.group}</span> : null}
        <h3>{service.name}</h3>
        <p>{service.summary}</p>
      </div>
    </motion.article>
  )
}

export default memo(ServiceCard)
