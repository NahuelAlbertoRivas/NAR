import { Home, FolderOpen, BookOpen, Cpu, User, Mail, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useState } from 'react';

type Page = 'home' | 'projects' | 'articles' | 'about' | 'tech' | 'contact';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  filters: {
    technology: string;
    language: string;
    framework: string;
    category: string;
    status: string;
    year: string;
  };
  onFilterChange: (key: string, value: string) => void;
  search: string;
  onSearch: (q: string) => void;
}

const navLinks: { key: Page; label: string; icon: React.ReactNode }[] = [
  { key: 'home', label: 'Inicio', icon: <Home size={15} /> },
  { key: 'projects', label: 'Proyectos', icon: <FolderOpen size={15} /> },
  { key: 'articles', label: 'Artículos', icon: <BookOpen size={15} /> },
  { key: 'about', label: 'Sobre mí', icon: <User size={15} /> },
  { key: 'tech', label: 'Tech Stack', icon: <Cpu size={15} /> },
  { key: 'contact', label: 'Contacto', icon: <Mail size={15} /> },
];

const CATEGORIES = ['Inteligencia Artificial', 'Automatización', 'Integraciones', 'Infraestructura', 'DevOps'];
const LANGUAGES = ['Java', 'Python', 'TypeScript', 'Go'];
const FRAMEWORKS = ['Spring Boot', 'Angular', 'FastAPI', 'React', 'Celery'];
const TECHNOLOGIES = ['Docker', 'Kubernetes', 'AWS', 'Azure', 'Kafka', 'PostgreSQL', 'MongoDB'];
const YEARS = ['2024', '2023'];

export default function Sidebar({ currentPage, onNavigate, filters, onFilterChange, search, onSearch }: SidebarProps) {
  const [filtersOpen, setFiltersOpen] = useState(true);

  const activeFilters = Object.values(filters).filter(Boolean).length;

  const clearAll = () => {
    ['technology', 'language', 'framework', 'category', 'status', 'year'].forEach(k => onFilterChange(k, ''));
    onSearch('');
  };

  return (
    <aside
      style={{
        position: 'fixed',
        top: 56,
        left: 0,
        bottom: 0,
        width: 240,
        borderRight: '1px solid #1a2234',
        background: '#060810',
        overflowY: 'auto',
        padding: '16px 0',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}
    >
      {/* Project search */}
      <div style={{ padding: '0 12px 12px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#0b0e18', border: '1px solid #1a2234',
          borderRadius: 8, padding: '7px 10px',
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            placeholder="Buscar proyectos..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            style={{ background: 'none', border: 'none', outline: 'none', color: '#e8edf5', fontSize: 12, width: '100%' }}
          />
          {search && (
            <button onClick={() => onSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <X size={12} color="#64748b" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ padding: '0 8px 16px' }}>
        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', color: '#334155', padding: '0 8px 6px', textTransform: 'uppercase' }}>Accesos rápidos</p>
        {navLinks.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 9,
              width: '100%', padding: '7px 10px',
              background: currentPage === item.key ? '#0f1420' : 'none',
              border: 'none', borderRadius: 7,
              cursor: 'pointer',
              color: currentPage === item.key ? '#e8edf5' : '#64748b',
              fontSize: 13, fontWeight: currentPage === item.key ? 500 : 400,
              transition: 'all 0.15s',
              textAlign: 'left',
              borderLeft: currentPage === item.key ? '2px solid #2563eb' : '2px solid transparent',
            }}
            onMouseEnter={(e) => { if (currentPage !== item.key) { (e.currentTarget as HTMLElement).style.color = '#94a3b8'; (e.currentTarget as HTMLElement).style.background = '#0b0e18'; } }}
            onMouseLeave={(e) => { if (currentPage !== item.key) { (e.currentTarget as HTMLElement).style.color = '#64748b'; (e.currentTarget as HTMLElement).style.background = 'none'; } }}
          >
            <span style={{ color: currentPage === item.key ? '#2563eb' : 'inherit' }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ height: 1, background: '#1a2234', margin: '0 12px 16px' }} />

      {/* Filters */}
      <div style={{ padding: '0 12px' }}>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', background: 'none', border: 'none', cursor: 'pointer',
            color: '#64748b', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', padding: '0 0 8px',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            FILTROS
            {activeFilters > 0 && (
              <span style={{ background: '#2563eb', color: '#fff', borderRadius: 10, padding: '1px 6px', fontSize: 9, fontWeight: 700 }}>{activeFilters}</span>
            )}
          </span>
          {filtersOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>

        {filtersOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {activeFilters > 0 && (
              <button onClick={clearAll} style={{ fontSize: 11, color: '#06b6d4', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                Limpiar filtros
              </button>
            )}

            <FilterGroup label="Tecnología" options={TECHNOLOGIES} value={filters.technology} onChange={(v) => onFilterChange('technology', v)} />
            <FilterGroup label="Lenguaje" options={LANGUAGES} value={filters.language} onChange={(v) => onFilterChange('language', v)} />
            <FilterGroup label="Framework" options={FRAMEWORKS} value={filters.framework} onChange={(v) => onFilterChange('framework', v)} />
            <FilterGroup label="Categoría" options={CATEGORIES} value={filters.category} onChange={(v) => onFilterChange('category', v)} />
            <FilterGroup label="Estado" options={['Finalizado', 'En progreso']} value={filters.status} onChange={(v) => onFilterChange('status', v)} />
            <FilterGroup label="Año" options={YEARS} value={filters.year} onChange={(v) => onFilterChange('year', v)} />
          </div>
        )}
      </div>
    </aside>
  );
}

function FilterGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 500, color: '#475569', marginBottom: 6 }}>{label}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(value === opt ? '' : opt)}
            style={{
              textAlign: 'left', background: value === opt ? 'rgba(37,99,235,0.12)' : 'none',
              border: value === opt ? '1px solid rgba(37,99,235,0.3)' : '1px solid transparent',
              borderRadius: 5, padding: '4px 8px',
              cursor: 'pointer',
              color: value === opt ? '#93c5fd' : '#64748b',
              fontSize: 12, transition: 'all 0.12s',
            }}
            onMouseEnter={(e) => { if (value !== opt) (e.currentTarget as HTMLElement).style.color = '#94a3b8'; }}
            onMouseLeave={(e) => { if (value !== opt) (e.currentTarget as HTMLElement).style.color = '#64748b'; }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
