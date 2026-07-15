import { GitFork, ExternalLink, Eye, Clock, CheckCircle2 } from 'lucide-react';
import { Project } from '../data';

interface ProjectCardProps {
  project: Project;
  onView: (id: string) => void;
}

const statusConfig = {
  completed: { label: 'Finalizado', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', icon: <CheckCircle2 size={11} /> },
  'in-progress': { label: 'En progreso', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: <Clock size={11} /> },
};

export default function ProjectCard({ project, onView }: ProjectCardProps) {
  const status = statusConfig[project.status];

  return (
    <div
      style={{
        background: '#0b0e18',
        border: '1px solid #1a2234',
        borderRadius: 12,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s',
        cursor: 'pointer',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = '#2563eb';
        el.style.transform = 'translateY(-2px)';
        el.style.boxShadow = '0 8px 32px rgba(37,99,235,0.15)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = '#1a2234';
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = 'none';
      }}
      onClick={() => onView(project.id)}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 160, overflow: 'hidden', background: '#0f1420' }}>
        <img
          src={project.image}
          alt={project.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8, transition: 'opacity 0.2s' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.8'; }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 40%, #0b0e18 100%)',
        }} />
        <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6 }}>
          <span style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: status.bg, color: status.color,
            border: `1px solid ${status.color}33`,
            borderRadius: 20, padding: '3px 8px', fontSize: 10, fontWeight: 600,
            backdropFilter: 'blur(8px)',
          }}>
            {status.icon}
            {status.label}
          </span>
        </div>
        <div style={{ position: 'absolute', bottom: 10, left: 12 }}>
          <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>{project.year}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          <span style={{ fontSize: 10, fontWeight: 600, color: '#06b6d4', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {project.category}
          </span>
          <h3 style={{ margin: '4px 0 0', fontSize: 15, fontWeight: 600, color: '#e8edf5', lineHeight: '1.3', letterSpacing: '-0.01em' }}>
            {project.title}
          </h3>
        </div>

        <p style={{ fontSize: 12, color: '#64748b', lineHeight: '1.6', margin: 0, flex: 1 }}>
          {project.shortDescription}
        </p>

        {/* Tech tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {project.technologies.slice(0, 4).map((tech) => (
            <span key={tech} style={{
              fontSize: 10, fontFamily: 'JetBrains Mono, monospace',
              background: '#111827', border: '1px solid #1e293b',
              borderRadius: 4, padding: '2px 6px', color: '#94a3b8',
            }}>
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: '#475569', padding: '2px 4px' }}>
              +{project.technologies.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid #1a2234',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <button
          onClick={(e) => { e.stopPropagation(); onView(project.id); }}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.3)',
            borderRadius: 6, padding: '6px 0', cursor: 'pointer',
            color: '#93c5fd', fontSize: 12, fontWeight: 500,
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(37,99,235,0.2)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(37,99,235,0.1)'; }}
        >
          <Eye size={12} />
          Ver detalle
        </button>

        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 32, height: 32, background: '#0f1420', border: '1px solid #1a2234',
              borderRadius: 6, color: '#64748b', transition: 'all 0.15s',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#e8edf5'; (e.currentTarget as HTMLElement).style.borderColor = '#334155'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#64748b'; (e.currentTarget as HTMLElement).style.borderColor = '#1a2234'; }}
          >
            <GitFork size={13} />
          </a>
        )}

        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 32, height: 32, background: '#0f1420', border: '1px solid #1a2234',
              borderRadius: 6, color: '#64748b', transition: 'all 0.15s',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#e8edf5'; (e.currentTarget as HTMLElement).style.borderColor = '#334155'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#64748b'; (e.currentTarget as HTMLElement).style.borderColor = '#1a2234'; }}
          >
            <ExternalLink size={13} />
          </a>
        )}
      </div>
    </div>
  );
}
