import { motion } from "framer-motion";

const quickServices = [
  /* Codex Redesign v1 */
  "Plumbing",
  "Deep Cleaning",
  "Electrical Repair",
  "Garden Care",
];

export default function Hero() {
  return (
    <motion.section
      /* Codex Redesign v1 */
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="hero-section"
    >
      {/* Codex Redesign v1 */}
      <div className="hero-shell">
        {/* Codex Redesign v1 */}
        <div className="hero-content">
          {/* Codex Redesign v1 */}
          <span className="hero-kicker">On-demand experts for every room in your home</span>
          {/* Codex Redesign v1 */}
          <h1 className="hero-heading">FixEasy connects you with trusted Irish professionals</h1>
          {/* Codex Redesign v1 */}
          <p className="hero-copy">
            Sustainable, vetted, and ready when you are. From sparkling cleans to emergency fixes,
            FixEasy keeps every space feeling its best.
          </p>
          {/* Codex Redesign v1 */}
          <form className="hero-search" role="search">
            {/* Codex Redesign v1 */}
            <label htmlFor="service" className="visually-hidden">
              Search for a home service
            </label>
            {/* Codex Redesign v1 */}
            <input
              id="service"
              name="service"
              type="search"
              placeholder="Search for a service (e.g. cleaner, electrician)"
              autoComplete="off"
            />
            {/* Codex Redesign v1 */}
            <button type="submit">Get Started</button>
          </form>
          {/* Codex Redesign v1 */}
          <div className="hero-tags" aria-label="Popular service suggestions">
            {quickServices.map((service) => (
              <button type="button" key={service} className="hero-tag">
                {/* Codex Redesign v1 */}
                {service}
              </button>
            ))}
          </div>
          {/* Codex Redesign v1 */}
          <div className="hero-trust">
            <div className="hero-trust__item">
              {/* Codex Redesign v1 */}
              <strong>Trusted by 1,000+ Irish homeowners</strong>
              <span>Verified reviews across Dublin, Cork, Galway &amp; beyond.</span>
            </div>
            <div className="hero-trust__item">
              {/* Codex Redesign v1 */}
              <strong>Verified &amp; insured professionals</strong>
              <span>All specialists are identity-checked and sustainability trained.</span>
            </div>
          </div>
        </div>
        {/* Codex Redesign v1 */}
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-visual__panel hero-visual__panel--primary" />
          <div className="hero-visual__panel hero-visual__panel--secondary" />
          <div className="hero-visual__floating">
            <span>Live nearby • Dublin 8</span>
            <strong>Cleaner arriving in 45 mins</strong>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
