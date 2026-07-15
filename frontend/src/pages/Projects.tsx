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

  useEffect(() => {
    let mounted = true;

    getProjects().then((data) => {
      if (mounted) {
        setProjects(data);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = projects.filter((p) => matchesFilters(p, filters, search));

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ padding: '40px 0 32px' }}>
        <h1 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 800, color: '#e8edf5', letterSpacing: '-0.02em' }}>Proyectos</h1>
        <p style={{ margin: 0, fontSize: 14, color: '#64748b' }}>
          {filtered.length} proyecto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
          {Object.values(filters).some(Boolean) || search ? ' · Filtros aplicados' : ''}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
          <p style={{ color: '#64748b', fontSize: 15 }}>No se encontraron proyectos con los filtros actuales.</p>
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
