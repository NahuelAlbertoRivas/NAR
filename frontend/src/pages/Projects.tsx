import { useEffect, useState } from 'react';
import { type Project } from '../data';
import ProjectCard from '../components/ProjectCard';
import { getProjects } from '../services/portfolioApi';

interface ProjectsProps {
  filters: Record<string, string>;
  search: string;
  onViewProject: (id: string) => void;
}

function matchesFilters(project: Project, filters: Record<string, string>, search: string): boolean {
  const q = search.toLowerCase();
  if (q && !project.title.toLowerCase().includes(q) && !project.shortDescription.toLowerCase().includes(q) && !project.technologies.some(t => t.toLowerCase().includes(q))) return false;
  if (filters.technology && !project.technologies.includes(filters.technology)) return false;
  if (filters.language && !project.languages.includes(filters.language)) return false;
  if (filters.framework && !project.frameworks.includes(filters.framework)) return false;
  if (filters.category && project.category !== filters.category) return false;
  if (filters.status) {
    const statusMap: Record<string, string> = { 'Finalizado': 'completed', 'En progreso': 'in-progress' };
    if (project.status !== statusMap[filters.status]) return false;
  }
  if (filters.year && project.year !== parseInt(filters.year)) return false;
  return true;
}

export default function Projects({ filters, search, onViewProject }: ProjectsProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getProjects().then((data) => {
      if (mounted) {
        setProjects(data);
        setLoading(false);
      }
    }).catch(() => {
      if (mounted) {
        setProjects([]);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = projects.filter((p) => matchesFilters(p, filters, search));
  const featured = projects.filter((project) => project.featured).slice(0, 2);
  const summaryStats = [
    { label: 'Proyectos', value: projects.length.toString() },
    { label: 'Destacados', value: featured.length.toString() },
    { label: 'En progreso', value: projects.filter((project) => project.status === 'in-progress').length.toString() },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ padding: '40px 0 24px' }}>
        <h1 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 800, color: '#e8edf5', letterSpacing: '-0.02em' }}>Proyectos</h1>
        <p style={{ margin: 0, fontSize: 14, color: '#64748b' }}>
          {filtered.length} proyecto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
          {Object.values(filters).some(Boolean) || search ? ' · Filtros aplicados' : ''}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        {summaryStats.map((stat) => (
          <div key={stat.label} style={{ background: '#0b0e18', border: '1px solid #1a2234', borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#e8edf5' }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {featured.length > 0 && (
        <div style={{ marginBottom: 24, background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(6,182,212,0.08))', border: '1px solid rgba(37,99,235,0.25)', borderRadius: 14, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Destacados</div>
              <h2 style={{ margin: '4px 0 0', fontSize: 16, fontWeight: 700, color: '#e8edf5' }}>Proyectos que mejor reflejan mi enfoque</h2>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {featured.map((project) => (
              <button
                key={project.id}
                onClick={() => onViewProject(project.id)}
                style={{ textAlign: 'left', background: '#0b0e18', border: '1px solid #1a2234', borderRadius: 10, padding: '12px 14px', cursor: 'pointer', color: '#e8edf5' }}
              >
                <div style={{ fontSize: 12, color: '#06b6d4', fontWeight: 600, marginBottom: 6 }}>{project.category}</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{project.title}</div>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{project.shortDescription}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>Cargando proyectos…</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', border: '1px dashed #1a2234', borderRadius: 14, background: 'rgba(11,14,24,0.6)' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
          <p style={{ color: '#64748b', fontSize: 15, marginBottom: 6 }}>No se encontraron proyectos con los filtros actuales.</p>
          <p style={{ color: '#475569', fontSize: 13, margin: 0 }}>Prueba con otro término de búsqueda o limpia los filtros.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, paddingBottom: 48 }}>
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} onView={onViewProject} />
          ))}
        </div>
      )}
    </div>
  );
}
