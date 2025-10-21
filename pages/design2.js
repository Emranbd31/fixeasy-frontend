export default function Design2() {
  const services = [
    { name: 'Electricians', icon: '⚡', color: '#F59E0B' },
    { name: 'Cleaning Crews', icon: '✨', color: '#10B981' },
    { name: 'Gardeners', icon: '🌱', color: '#22C55E' },
    { name: 'Carpenters', icon: '🔨', color: '#F97316' },
    { name: 'Roofing Teams', icon: '🏠', color: '#3B82F6' },
    { name: 'Tech Support', icon: '💻', color: '#8B5CF6' },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: system-ui, -apple-system, sans-serif; overflow-x: hidden; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .service-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 60px rgba(139, 92, 246, 0.3) !important;
        }
        .service-card:hover .service-icon {
          transform: rotate(10deg);
          background: linear-gradient(135deg, #8B5CF6, #EC4899) !important;
        }
      `}} />

      {/* Navigation */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto', padding: '1rem 2rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{
            fontSize: '1.5rem', fontWeight: '700',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            FixEasy
          </div>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <a href="#services" style={{ color: '#6B7280', textDecoration: 'none', fontWeight: '500' }}>Services</a>
            <a href="#how" style={{ color: '#6B7280', textDecoration: 'none', fontWeight: '500' }}>How It Works</a>
            <a href="#contact" style={{ color: '#6B7280', textDecoration: 'none', fontWeight: '500' }}>Contact</a>
            <button style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
              color: 'white', border: 'none', padding: '0.75rem 2rem',
              borderRadius: '50px', fontWeight: '600', cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
            }}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #F59E0B 100%)',
        minHeight: '90vh', display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem',
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '4rem', alignItems: 'center', position: 'relative', zIndex: 1,
        }}>
          <div>
            <div style={{
              display: 'inline-block',
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '0.5rem 1.5rem', borderRadius: '50px',
              color: 'white', fontWeight: '600', marginBottom: '1.5rem',
            }}>
              🚀 Ireland's #1 Home Services
            </div>

            <h1 style={{
              fontSize: '4rem', fontWeight: '900', color: 'white',
              lineHeight: '1.1', marginBottom: '1.5rem',
            }}>
              Trusted Professionals
              <br />At Your Doorstep
            </h1>

            <p style={{
              fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.95)',
              marginBottom: '2.5rem', lineHeight: '1.8',
            }}>
              Book verified home service professionals in minutes. From electricians to cleaners, we've got your home covered.
            </p>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
              <button style={{
                background: 'white', color: '#8B5CF6',
                border: 'none', padding: '1rem 2.5rem',
                borderRadius: '50px', fontWeight: '700', fontSize: '1.1rem',
                cursor: 'pointer', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              }}>
                Find a Pro →
              </button>
              <button style={{
                background: 'transparent', color: 'white',
                border: '2px solid white', padding: '1rem 2.5rem',
                borderRadius: '50px', fontWeight: '700', fontSize: '1.1rem',
                cursor: 'pointer',
              }}>
                Learn More
              </button>
            </div>

            <div style={{ display: 'flex', gap: '3rem' }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white' }}>1,200+</div>
                <div style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: '600' }}>Vetted Pros</div>
              </div>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white' }}>150+</div>
                <div style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: '600' }}>Cities</div>
              </div>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white' }}>45+</div>
                <div style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: '600' }}>Services</div>
              </div>
            </div>
          </div>

          <div style={{
            width: '500px', height: '500px',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '50%', backdropFilter: 'blur(20px)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '8rem', animation: 'pulse 4s ease-in-out infinite',
            margin: '0 auto',
          }}>
            🏠
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" style={{ padding: '6rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{
            fontSize: '3rem', fontWeight: '900', marginBottom: '1rem',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Popular Services
          </h2>
          <p style={{ fontSize: '1.25rem', color: '#6B7280' }}>
            Premium support for every booking
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          {services.map((service) => (
            <div key={service.name} className="service-card" style={{
              background: 'white', padding: '2.5rem', borderRadius: '24px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              border: '2px solid transparent',
            }}>
              <div className="service-icon" style={{
                width: '80px', height: '80px', background: '#F3F4F6',
                borderRadius: '20px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '2.5rem', marginBottom: '1.5rem', transition: 'all 0.3s',
              }}>
                {service.icon}
              </div>
              <h3 style={{
                fontSize: '1.5rem', fontWeight: '700',
                marginBottom: '0.75rem', color: '#111827',
              }}>
                {service.name}
              </h3>
              <p style={{ color: '#6B7280', lineHeight: '1.6', marginBottom: '1rem' }}>
                Professional service available 24/7 with verified experts.
              </p>
              <div style={{
                display: 'flex', alignItems: 'center',
                color: '#8B5CF6', fontWeight: '600',
              }}>
                Book Now →
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
        color: 'white', padding: '3rem 2rem', textAlign: 'center',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
            FixEasy
          </div>
          <p style={{ opacity: 0.9, marginBottom: '2rem' }}>
            © {new Date().getFullYear()} FixEasy Ireland. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
            <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.9 }}>Privacy</a>
            <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.9 }}>Terms</a>
            <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.9 }}>Support</a>
          </div>
        </div>
      </footer>
    </>
  );
}
