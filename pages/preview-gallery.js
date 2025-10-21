export default function PreviewGallery() {
  const designs = [
    {
      id: 1,
      name: "Bold Gradient Hero",
      description: "Purple to pink gradient with floating animations",
      colors: ["#8B5CF6", "#EC4899", "#F59E0B"],
      preview: "/design1"
    },
    {
      id: 2,
      name: "Minimalist Clean",
      description: "White space with blue accents and clean typography",
      colors: ["#3B82F6", "#FFFFFF", "#F3F4F6"],
      preview: "/design2"
    },
    {
      id: 3,
      name: "Dark Mode Premium",
      description: "Dark background with gold and emerald accents",
      colors: ["#1F2937", "#F59E0B", "#10B981"],
      preview: "/design3"
    },
    {
      id: 4,
      name: "Playful & Friendly",
      description: "Rounded corners, soft colors, cheerful vibe",
      colors: ["#F59E0B", "#EC4899", "#8B5CF6"],
      preview: "/design4"
    },
    {
      id: 5,
      name: "Professional Corporate",
      description: "Navy blue with structured layout",
      colors: ["#1E40AF", "#60A5FA", "#FFFFFF"],
      preview: "/design5"
    },
    {
      id: 6,
      name: "Green & Eco",
      description: "Nature-inspired with green tones",
      colors: ["#059669", "#10B981", "#D1FAE5"],
      preview: "/design6"
    },
    {
      id: 7,
      name: "Orange Energy",
      description: "High energy with orange and yellow",
      colors: ["#F97316", "#FBBF24", "#FEF3C7"],
      preview: "/design7"
    },
    {
      id: 8,
      name: "Teal Modern",
      description: "Teal and cyan for tech-forward look",
      colors: ["#0891B2", "#06B6D4", "#CFFAFE"],
      preview: "/design8"
    },
    {
      id: 9,
      name: "Rose Elegant",
      description: "Rose pink with elegant serif fonts",
      colors: ["#E11D48", "#FB7185", "#FFE4E6"],
      preview: "/design9"
    },
    {
      id: 10,
      name: "Slate Professional",
      description: "Slate gray with modern minimalism",
      colors: ["#475569", "#64748B", "#F1F5F9"],
      preview: "/design10"
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #F9FAFB, #F3F4F6)',
      padding: '2rem'
    }}>
      <style jsx global>{`
        body { font-family: system-ui, -apple-system, sans-serif; }
        .design-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .design-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }
        .color-dot {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>
      
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '800',
            background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem'
          }}>
            Choose Your Design
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            color: '#6B7280',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Select from 10 modern homepage designs. Click on any design to preview it in full.
          </p>
        </div>

        {/* Design Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {designs.map((design) => (
            <div
              key={design.id}
              className="design-card"
              onClick={() => window.location.href = design.preview}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <div style={{
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '50px',
                    marginBottom: '0.75rem'
                  }}>
                    Design {design.id}
                  </div>
                  <h3 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '700',
                    color: '#111827',
                    marginBottom: '0.5rem'
                  }}>
                    {design.name}
                  </h3>
                  <p style={{ 
                    color: '#6B7280',
                    fontSize: '0.95rem',
                    lineHeight: '1.6'
                  }}>
                    {design.description}
                  </p>
                </div>
              </div>

              {/* Color Palette */}
              <div style={{ 
                display: 'flex', 
                gap: '0.5rem',
                marginBottom: '1.5rem'
              }}>
                {design.colors.map((color, idx) => (
                  <div
                    key={idx}
                    className="color-dot"
                    style={{ background: color }}
                  />
                ))}
              </div>

              {/* Preview Button */}
              <button style={{
                width: '100%',
                padding: '0.875rem',
                background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
                Preview Design →
              </button>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          textAlign: 'center',
          border: '2px solid #8B5CF6'
        }}>
          <div style={{ 
            fontSize: '2rem',
            marginBottom: '1rem'
          }}>
            💡
          </div>
          <h3 style={{ 
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '0.5rem',
            color: '#111827'
          }}>
            How It Works
          </h3>
          <p style={{ 
            color: '#6B7280',
            fontSize: '1rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Click on any design card to see a full preview. Once you find the perfect design, 
            let me know the number and I'll deploy it to your live site immediately!
          </p>
        </div>
      </div>
    </div>
  );
}
