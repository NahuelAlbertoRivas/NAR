import { Clock, ArrowRight } from 'lucide-react';
import { articles } from '../data';

export default function Articles() {
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ padding: '40px 0 32px' }}>
        <h1 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 800, color: '#e8edf5', letterSpacing: '-0.02em' }}>Artículos</h1>
        <p style={{ margin: 0, fontSize: 14, color: '#64748b' }}>Reflexiones técnicas sobre arquitectura, IA y automatización.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, paddingBottom: 48 }}>
        {articles.map((article, i) => (
          <a
            key={article.id}
            href={article.url || '#'}
            target={article.url ? '_blank' : undefined}
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <div
              style={{
                background: i % 2 === 0 ? '#0b0e18' : 'transparent',
                border: '1px solid #1a2234',
                borderRadius: 12, marginBottom: 8,
                padding: '24px 28px',
                display: 'flex', gap: 24, alignItems: 'flex-start',
                transition: 'all 0.15s', cursor: 'pointer',
              }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#2563eb'; el.style.background = '#0b0e18'; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#1a2234'; el.style.background = i % 2 === 0 ? '#0b0e18' : 'transparent'; }}
            >
              <div style={{ width: 48, height: 48, flexShrink: 0, background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                📄
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: '#475569' }}>
                    {new Date(article.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#334155', display: 'inline-block' }} />
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#475569' }}>
                    <Clock size={11} />
                    {article.readTime} min de lectura
                  </span>
                </div>

                <h2 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 600, color: '#e8edf5', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                  {article.title}
                </h2>

                <p style={{ margin: '0 0 14px', fontSize: 14, color: '#64748b', lineHeight: 1.65 }}>
                  {article.summary}
                </p>

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {article.tags.map((tag) => (
                    <span key={tag} style={{
                      fontSize: 11, background: '#111827', border: '1px solid #1e293b',
                      borderRadius: 4, padding: '3px 8px', color: '#94a3b8',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ flexShrink: 0, color: '#334155', paddingTop: 4 }}>
                <ArrowRight size={16} />
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
