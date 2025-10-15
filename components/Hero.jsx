import { motion } from "framer-motion";

const checklist = [
  "Same-day availability across Ireland",
  "Screened, insured home service pros",
  "Live updates and transparent pricing",
];

const jobs = [
  {
    title: "Eco Boiler Tune-Up",
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
  return (
    <motion.section
      className="hero"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9 }}
    >
      <div className="hero__inner">
        <div className="hero__content">
          <span className="hero__eyebrow">Ireland's trusted home services marketplace</span>
          <h1 className="hero__title">Book vetted experts with a greener FixEasy experience</h1>
          <p className="hero__description">
            Compare upfront prices, reserve instantly, and track every stage of the job from
            one dashboard. FixEasy connects you to professionals that put sustainability
            first—so every fix feels good.
          </p>

          <div className="hero__actions">
            <a className="hero__cta" href="/book">
              Book a service
            </a>
            <a className="hero__secondary" href="#services">
              Browse services
            </a>
          </div>

          <ul className="hero__points">
            {checklist.map((item) => (
              <li key={item}>
                <span className="hero__bullet" aria-hidden="true">
                  <svg viewBox="0 0 16 16" role="presentation">
                    <circle cx="8" cy="8" r="8" fill="var(--green-light)" />
                    <path
                      d="M6.7 10.6 4.5 8.3l1.1-1.1 1.1 1.1 3-3 1.1 1.1-4.1 4.1z"
                      fill="var(--green)"
                    />
                  </svg>
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <motion.div
          className="hero__visual"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.1 }}
        >
          <div className="hero__panel">
            <header className="hero__panel-header">
              <span className="hero__panel-pill">Live booking board</span>
              <span className="hero__panel-status">98% green-rated pros</span>
            </header>
            <ul className="hero__panel-list">
              {jobs.map((job) => (
                <li key={job.title}>
                  <div className="hero__panel-title">{job.title}</div>
                  <div className="hero__panel-meta">{job.meta}</div>
                  <div className="hero__panel-price">{job.price}</div>
                </li>
              ))}
            </ul>
            <footer className="hero__panel-footer">
              <span className="hero__panel-dot" />
              Last updated 2 mins ago
            </footer>
          </div>

          <div className="hero__floating-card">
            <span className="hero__floating-pill">Customer spotlight</span>
            <strong>“The FixEasy crew had our leak sorted in under an hour.”</strong>
            <p>
              Rated <span>4.9/5</span> across 1,200 eco-friendly service visits this month.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
