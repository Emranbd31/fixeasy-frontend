import { motion, useReducedMotion } from "framer-motion";

const checklist = [
  "Same-day availability across Ireland",
  "Screened, insured home service pros",
  "Live updates and transparent pricing",
];

const jobs = [
  {
    title: "Boiler Tune-Up",
    meta: "Scheduled • Tomorrow 09:30",
    price: "€129",
  },
  {
    title: "Garden Maintenance",
    meta: "En route • Pro arrives in 12 min",
    price: "€79",
  },
];

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const ease = [0.24, 0.82, 0.13, 1];

  const heroVariants = shouldReduceMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease },
        },
      };

  const contentVariants = shouldReduceMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 18 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease, staggerChildren: 0.12 },
        },
      };

  const contentItem = shouldReduceMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 14 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease },
        },
      };

  const listVariants = shouldReduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.12, delayChildren: 0.1 },
        },
      };

  const listItem = shouldReduceMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease },
        },
      };

  const panelVariants = shouldReduceMotion
    ? { hidden: { opacity: 1, scale: 1, y: 0 }, visible: { opacity: 1, scale: 1, y: 0 } }
    : {
        hidden: { opacity: 0, scale: 0.95, y: 24 },
        visible: {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: { duration: 0.85, ease },
        },
      };

  const jobItem = shouldReduceMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease },
        },
      };

  return (
    <motion.section
      className="hero"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.45 }}
      variants={heroVariants}
    >
      <motion.div className="hero__inner" variants={heroVariants}>
        <motion.div className="hero__content" variants={contentVariants}>
          <motion.span className="hero__eyebrow" variants={contentItem}>
            Ireland's trusted home services marketplace
          </motion.span>
          <motion.h1 className="hero__title" variants={contentItem}>
            Book trusted experts for every FixEasy project
          </motion.h1>
          <motion.p className="hero__description" variants={contentItem}>
            Compare upfront prices, reserve instantly, and track every stage of the job from
            one dashboard. FixEasy connects you to dependable professionals ready for any
            project across Ireland.
          </motion.p>

          <motion.div className="hero__actions" variants={contentItem}>
            <motion.a className="hero__cta" href="/book" variants={contentItem}>
              Book a service
            </motion.a>
            <motion.a className="hero__secondary" href="#services" variants={contentItem}>
              Browse services
            </motion.a>
          </motion.div>

          <motion.ul className="hero__points" variants={listVariants}>
            {checklist.map((item) => (
              <motion.li key={item} variants={listItem}>
                <span className="hero__bullet" aria-hidden="true">
                  <svg viewBox="0 0 16 16" role="presentation">
                    <circle cx="8" cy="8" r="8" fill="var(--primary-light)" />
                    <path
                      d="M6.7 10.6 4.5 8.3l1.1-1.1 1.1 1.1 3-3 1.1 1.1-4.1 4.1z"
                      fill="var(--primary)"
                    />
                  </svg>
                </span>
                <span>{item}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div className="hero__visual" variants={panelVariants}>
          <motion.div className="hero__panel" variants={panelVariants}>
            <header className="hero__panel-header">
              <span className="hero__panel-pill">Live booking board</span>
              <span className="hero__panel-status">4.9★ rated local pros</span>
            </header>
            <motion.ul className="hero__panel-list" variants={listVariants}>
              {jobs.map((job) => (
                <motion.li key={job.title} variants={jobItem}>
                  <div className="hero__panel-title">{job.title}</div>
                  <div className="hero__panel-meta">{job.meta}</div>
                  <div className="hero__panel-price">{job.price}</div>
                </motion.li>
              ))}
            </motion.ul>
            <motion.footer className="hero__panel-footer" variants={contentItem}>
              <span className="hero__panel-dot" />
              Last updated 2 mins ago
            </motion.footer>
          </motion.div>

          <motion.div className="hero__floating-card" variants={panelVariants}>
            <span className="hero__floating-pill">Customer spotlight</span>
            <strong>“The FixEasy crew had our leak sorted in under an hour.”</strong>
            <p>
              Rated <span>4.9/5</span> across 1,200 home service visits this month.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
