import { useEffect, useState } from 'react';
import { getTechStack } from '../services/portfolioApi';

const categories = ['Lenguaje', 'Framework', 'DevOps', 'Cloud', 'Base de datos', 'Mensajería', 'IA', 'Herramientas'];

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  Lenguaje: { bg: 'rgba(37,99,235,0.08)', text: '#93c5fd', border: 'rgba(37,99,235,0.2)' },
  Framework: { bg: 'rgba(6,182,212,0.08)', text: '#67e8f9', border: 'rgba(6,182,212,0.2)' },
  DevOps: { bg: 'rgba(139,92,246,0.08)', text: '#c4b5fd', border: 'rgba(139,92,246,0.2)' },
  Cloud: { bg: 'rgba(245,158,11,0.08)', text: '#fcd34d', border: 'rgba(245,158,11,0.2)' },
  'Base de datos': { bg: 'rgba(34,197,94,0.08)', text: '#86efac', border: 'rgba(34,197,94,0.2)' },
  Mensajería: { bg: 'rgba(239,68,68,0.08)', text: '#fca5a5', border: 'rgba(239,68,68,0.2)' },
  IA: { bg: 'rgba(236,72,153,0.08)', text: '#f9a8d4', border: 'rgba(236,72,153,0.2)' },
  Herramientas: { bg: 'rgba(100,116,139,0.08)', text: '#94a3b8', border: 'rgba(100,116,139,0.2)' },
};

export default function Tech() {
  const [techStack, setTechStack] = useState<Array<{ name: string; category: string; icon: string; level: number }>>([]);

  useEffect(() => {
    let mounted = true;

    getTechStack().then((data) => {
      if (mounted) {
        setTechStack(data);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ padding: '40px 0 32px' }}>
        <h1 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 800, color: '#e8edf5', letterSpacing: '-0.02em' }}>Tech Stack</h1>
        <p style={{ margin: 0, fontSize: 14, color: '#64748b' }}>Tecnologías con las que diseño, construyo y opero sistemas de software.</p>
      </div>

      {categories.map((cat) => {
        const items = techStack.filter((t) => t.category === cat);
        if (items.length === 0) return null;
        const colors = categoryColors[cat] || categoryColors.Herramientas;

        return (
          <div key={cat} style={{ marginBottom: 36 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`,
                borderRadius: 4, padding: '3px 8px',
              }}>
                {cat}
              </span>
              <div style={{ flex: 1, height: 1, background: '#1a2234' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
              {items.map((tech) => (
                <div
                  key={tech.name}
                  style={{
                    background: '#0b0e18', border: '1px solid #1a2234', borderRadius: 10,
                    padding: '16px 18px', transition: 'all 0.2s', cursor: 'default',
                  }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = colors.border; el.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#1a2234'; el.style.transform = 'none'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 20 }}>{tech.icon}</span>
                    <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: colors.text, fontWeight: 600 }}>{tech.level}%</span>
                  </div>
                  <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: '#e8edf5' }}>{tech.name}</p>
                  <div style={{ height: 3, background: '#1a2234', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${tech.level}%`,
                      background: `linear-gradient(90deg, ${colors.text}, ${colors.text}99)`,
                      borderRadius: 3,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div style={{ paddingBottom: 48 }} />
    </div>
  );
}
