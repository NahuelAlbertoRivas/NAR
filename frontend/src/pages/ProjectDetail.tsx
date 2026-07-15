import { ArrowLeft, GitFork, ExternalLink, Clock, CheckCircle2, Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { type Project } from '../data';
import { getProjectById } from '../services/portfolioApi';

interface ProjectDetailProps {
  projectId: string;
  onBack: () => void;
}

export default function ProjectDetail({ projectId, onBack }: ProjectDetailProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    getProjectById(projectId).then((data) => {
      if (mounted) {
        setProject(data);
      }
    });

    return () => {
      mounted = false;
    };
  }, [projectId]);

  if (!project) return null;

  const openScreenshot = (index: number) => setSelectedScreenshotIndex(index);
  const closeScreenshot = () => setSelectedScreenshotIndex(null);
  const goToPreviousScreenshot = () => {
    if (project && selectedScreenshotIndex !== null && selectedScreenshotIndex > 0) {
      setSelectedScreenshotIndex(selectedScreenshotIndex - 1);
    }
  };
  const goToNextScreenshot = () => {
    if (project && selectedScreenshotIndex !== null && selectedScreenshotIndex < project.screenshots.length - 1) {
      setSelectedScreenshotIndex(selectedScreenshotIndex + 1);
    }
  };

  const statusConfig = {
    completed: { label: 'Finalizado', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    'in-progress': { label: 'En progreso', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  };
  const status = statusConfig[project.status];

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', paddingBottom: 64 }}>
      {/* Back */}
      <div style={{ padding: '32px 0 24px' }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#64748b', fontSize: 13, fontWeight: 500,
            transition: 'color 0.15s', padding: 0,
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#e8edf5'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#64748b'; }}
        >
          <ArrowLeft size={14} /> Volver a proyectos
        </button>
      </div>

      {/* Hero */}
      <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', marginBottom: 40, height: 360, background: '#0b0e18' }}>
        <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,8,16,0.2) 0%, rgba(6,8,16,0.85) 80%)' }} />
        <div style={{ position: 'absolute', bottom: 32, left: 36, right: 36 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#06b6d4', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{project.category}</span>
          <h1 style={{ margin: '8px 0 12px', fontSize: 34, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.15 }}>{project.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: status.bg, color: status.color,
              border: `1px solid ${status.color}33`, borderRadius: 20, padding: '4px 10px',
              fontSize: 11, fontWeight: 600,
            }}>
              {project.status === 'completed' ? <CheckCircle2 size={11} /> : <Clock size={11} />}
              {status.label}
            </span>
            <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace' }}>{project.year}</span>
          </div>
        </div>
        <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: 8 }}>
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 14px', color: '#e8edf5', fontSize: 12, fontWeight: 500, textDecoration: 'none', transition: 'all 0.15s' }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.8)'; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.6)'; }}>
              <GitFork size={13} /> GitHub
            </a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(37,99,235,0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(37,99,235,0.4)', borderRadius: 8, padding: '7px 14px', color: '#fff', fontSize: 12, fontWeight: 500, textDecoration: 'none' }}>
              <ExternalLink size={13} /> Demo
            </a>
          )}
        </div>
      </div>

      {/* Metrics */}
      {project.metrics && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 36 }}>
          {project.metrics.map((m) => (
            <div key={m.label} style={{ flex: 1, background: '#0b0e18', border: '1px solid #1a2234', borderRadius: 10, padding: '16px 18px' }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#e8edf5', letterSpacing: '-0.02em' }}>{m.value}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{m.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Main content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <Section title="Descripción">
            <p style={{ margin: 0, fontSize: 15, color: '#94a3b8', lineHeight: 1.75 }}>{project.description}</p>
          </Section>

          <Section title="El problema">
            <p style={{ margin: 0, fontSize: 15, color: '#94a3b8', lineHeight: 1.75 }}>{project.problem}</p>
          </Section>

          <Section title="Arquitectura">
            <div style={{ background: '#0b0e18', border: '1px solid #1a2234', borderRadius: 10, padding: 20, fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>
              {project.architecture}
            </div>
          </Section>

          <Section title="Solución implementada">
            <p style={{ margin: 0, fontSize: 15, color: '#94a3b8', lineHeight: 1.75 }}>{project.solution}</p>
          </Section>

          <Section title="Retos encontrados">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {project.challenges.map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#ef4444', fontWeight: 700, marginTop: 2 }}>{i + 1}</span>
                  <p style={{ margin: 0, fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>{c}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Resultados">
            <p style={{ margin: 0, fontSize: 15, color: '#94a3b8', lineHeight: 1.75 }}>{project.results}</p>
          </Section>

          {/* Video placeholder */}
          <Section title="Demo en video">
            <div style={{
              height: 220, background: '#0b0e18', border: '1px solid #1a2234', borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, cursor: 'pointer',
            }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Play size={20} color="#2563eb" />
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#475569' }}>Video demo próximamente</p>
            </div>
          </Section>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Tech stack */}
          <div style={{ background: '#0b0e18', border: '1px solid #1a2234', borderRadius: 10, padding: 18 }}>
            <h3 style={{ margin: '0 0 14px', fontSize: 12, fontWeight: 600, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Tecnologías</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {project.technologies.map((tech) => (
                <span key={tech} style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', background: '#111827', border: '1px solid #1e293b', borderRadius: 5, padding: '4px 8px', color: '#94a3b8' }}>{tech}</span>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div style={{ background: '#0b0e18', border: '1px solid #1a2234', borderRadius: 10, padding: 18 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 12, fontWeight: 600, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Timeline</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {project.timeline.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: i === project.timeline.length - 1 ? '#2563eb' : '#1a2234', border: `2px solid ${i === project.timeline.length - 1 ? '#2563eb' : '#334155'}`, flexShrink: 0, marginTop: 3 }} />
                    {i < project.timeline.length - 1 && <div style={{ width: 1, flex: 1, background: '#1a2234', marginTop: 4 }} />}
                  </div>
                  <div style={{ paddingBottom: i < project.timeline.length - 1 ? 0 : 0 }}>
                    <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: '#475569' }}>{t.date}</span>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>{t.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Screenshots */}
          {project.screenshots.length > 0 && (
            <div style={{ background: '#0b0e18', border: '1px solid #1a2234', borderRadius: 10, padding: 18 }}>
              <h3 style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 600, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Capturas</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {project.screenshots.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => openScreenshot(i)}
                    style={{ border: 'none', padding: 0, background: 'none', width: '100%', cursor: 'pointer', borderRadius: 8, overflow: 'hidden', height: 120 }}
                  >
                    <img src={s} alt={`Captura ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedScreenshotIndex !== null && project.screenshots[selectedScreenshotIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={closeScreenshot}
          style={{ position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}
        >
          <div onClick={(event) => event.stopPropagation()} style={{ position: 'relative', width: 'min(100%, 1100px)', maxWidth: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden', boxSizing: 'border-box', padding: '6px 0' }}>
            <button
              type="button"
              onClick={closeScreenshot}
              style={{ position: 'absolute', top: -12, right: -12, width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.16)', background: '#0f172a', color: '#e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 30px rgba(0,0,0,0.3)' }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <button
                type="button"
                onClick={goToPreviousScreenshot}
                disabled={selectedScreenshotIndex === 0}
                style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.16)', background: selectedScreenshotIndex === 0 ? 'rgba(255,255,255,0.08)' : '#0f172a', color: '#e2e8f0', cursor: selectedScreenshotIndex === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <ChevronLeft size={18} />
              </button>
              <span style={{ fontSize: 12, color: '#cbd5e1', fontFamily: 'JetBrains Mono, monospace' }}>
                {selectedScreenshotIndex + 1} / {project.screenshots.length}
              </span>
              <button
                type="button"
                onClick={goToNextScreenshot}
                disabled={selectedScreenshotIndex === project.screenshots.length - 1}
                style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.16)', background: selectedScreenshotIndex === project.screenshots.length - 1 ? 'rgba(255,255,255,0.08)' : '#0f172a', color: '#e2e8f0', cursor: selectedScreenshotIndex === project.screenshots.length - 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <img src={project.screenshots[selectedScreenshotIndex]} alt="Captura ampliada" style={{ width: '100%', maxHeight: '85vh', objectFit: 'contain', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)' }} />

            {project.screenshots.length > 1 && (
              <div style={{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 14, maxWidth: 'min(100%, 700px)', overflowX: 'auto', overflowY: 'hidden', paddingBottom: 4, scrollbarWidth: 'thin' as const }}>
                {project.screenshots.map((screenshot, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => openScreenshot(index)}
                    style={{
                      width: 76,
                      height: 48,
                      padding: 0,
                      border: index === selectedScreenshotIndex ? '2px solid #38bdf8' : '1px solid rgba(255,255,255,0.16)',
                      borderRadius: 8,
                      overflow: 'hidden',
                      background: '#0f172a',
                      cursor: 'pointer',
                      boxShadow: index === selectedScreenshotIndex ? '0 0 0 1px rgba(56,189,248,0.25)' : 'none',
                    }}
                  >
                    <img src={screenshot} alt={`Miniatura ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 700, color: '#e8edf5', letterSpacing: '-0.01em' }}>{title}</h2>
      {children}
    </div>
  );
}
