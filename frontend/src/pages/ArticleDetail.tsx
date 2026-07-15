import { ArrowLeft, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Article } from '../data';
import { getArticleById } from '../services/portfolioApi';

interface ArticleDetailProps {
  articleId: string;
  onBack: () => void;
}

export default function ArticleDetail({ articleId, onBack }: ArticleDetailProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    getArticleById(articleId).then((data) => {
      if (mounted) {
        setArticle(data);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [articleId]);

  if (loading) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 0 48px' }}>
        <p style={{ color: '#94a3b8' }}>Cargando artículo…</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 0 48px' }}>
        <button
          type="button"
          onClick={onBack}
          style={{ background: 'transparent', border: '1px solid #1a2234', color: '#e8edf5', borderRadius: 999, padding: '8px 12px', cursor: 'pointer', marginBottom: 24 }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <ArrowLeft size={16} />
            Volver a artículos
          </span>
        </button>
        <p style={{ color: '#94a3b8' }}>No se pudo encontrar este artículo.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 0 48px' }}>
      <button
        type="button"
        onClick={onBack}
        style={{ background: 'transparent', border: '1px solid #1a2234', color: '#e8edf5', borderRadius: 999, padding: '8px 12px', cursor: 'pointer', marginBottom: 24 }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <ArrowLeft size={16} />
          Volver a artículos
        </span>
      </button>

      <div style={{ border: '1px solid #1a2234', borderRadius: 20, background: '#0b0e18', padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#64748b' }}>
            {new Date(article.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#334155' }} />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
            <Clock size={12} />
            {article.readTime} min de lectura
          </span>
        </div>

        <h1 style={{ margin: '0 0 12px', fontSize: 32, fontWeight: 800, color: '#e8edf5', lineHeight: 1.2 }}>
          {article.title}
        </h1>

        <p style={{ margin: '0 0 20px', fontSize: 16, color: '#94a3b8', lineHeight: 1.8 }}>
          {article.description ?? article.summary}
        </p>

        {article.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
            {article.tags.map((tag) => (
              <span key={tag} style={{ fontSize: 12, background: '#111827', border: '1px solid #1e293b', borderRadius: 999, padding: '6px 10px', color: '#94a3b8' }}>
                {tag}
              </span>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
