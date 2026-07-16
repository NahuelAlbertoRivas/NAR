import { ChangeEvent, useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1';

function authHeaders(): Record<string, string> {
  const key = localStorage.getItem('adminKey') ?? '';
  return key ? { 'x-admin-key': key, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

type Tab = 'projects' | 'articles' | 'tech';
type ModalType =
  | 'project-create'
  | 'project-edit'
  | 'project-delete'
  | 'article-create'
  | 'article-edit'
  | 'article-delete'
  | 'tech-create'
  | 'tech-edit'
  | 'tech-delete';

interface ProjectRecord {
  id: string;
  title: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  problem?: string;
  architecture?: string;
  solution?: string;
  results?: string;
  technologies?: string[];
  languages?: string[];
  frameworks?: string[];
  category?: string;
  status?: string;
  year?: number;
  featured?: boolean;
  image?: string;
  github?: string;
  demo?: string;
  videoUrl?: string;
  screenshots?: string[];
  timeline?: Array<{ date: string; event: string }>;
  challenges?: string[];
  metrics?: Array<{ label: string; value: string }>;
  tags?: string[];
  readTime?: number;
  date?: string;
  url?: string;
  published?: boolean;
}

interface ArticleRecord {
  id: string;
  title: string;
  slug?: string;
  summary?: string;
  description?: string;
  readTime?: number;
  tags?: string[];
  date?: string;
  url?: string;
  image?: string;
  featured?: boolean;
  category?: string;
}

interface TechRecord {
  name: string;
  category: string;
  icon: string;
  level: number;
}

const defaultProjectForm = {
  id: '',
  title: '',
  slug: '',
  shortDescription: '',
  description: '',
  problem: '',
  architecture: '',
  solution: '',
  results: '',
  technologies: '',
  languages: '',
  frameworks: '',
  category: '',
  status: 'completed',
  year: new Date().getFullYear(),
  featured: false,
  image: '',
  github: '',
  demo: '',
  videoUrl: '',
  screenshots: '',
  timeline: '[]',
  challenges: '',
  metrics: '[]',
  tags: '',
  readTime: 0,
  date: new Date().toISOString().slice(0, 10),
  url: '',
  published: false,
};

const defaultArticleForm = {
  id: '',
  title: '',
  slug: '',
  summary: '',
  description: '',
  readTime: 0,
  tags: '',
  date: new Date().toISOString().slice(0, 10),
  url: '',
  image: '',
  featured: false,
  category: '',
};

const defaultTechForm = {
  name: '',
  category: '',
  icon: '',
  level: 50,
};

function parseList(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function Modal({
  title,
  children,
  onClose,
  onConfirm,
  confirmText = 'Guardar',
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
}) {
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={modalHeaderStyle}>
          <h2>{title}</h2>
          <button style={closeButtonStyle} onClick={onClose} aria-label="Cerrar modal">
            ×
          </button>
        </div>
        <div>{children}</div>
        {onConfirm && (
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button onClick={onClose} style={secondaryButtonStyle}>
              Cancelar
            </button>
            <button onClick={onConfirm} style={primaryButtonStyle}>
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.65)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 16,
};

const modalStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 900,
  maxHeight: '90vh',
  overflowY: 'auto',
  backgroundColor: '#0f1724',
  border: '1px solid #1f2937',
  borderRadius: 12,
  padding: 20,
  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
};

const modalHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 16,
};

const closeButtonStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: '#cbd5e1',
  fontSize: 22,
  cursor: 'pointer',
};

const primaryButtonStyle: React.CSSProperties = {
  backgroundColor: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  padding: '10px 16px',
  cursor: 'pointer',
};

const secondaryButtonStyle: React.CSSProperties = {
  backgroundColor: '#1f2937',
  color: '#cbd5e1',
  border: '1px solid #374151',
  borderRadius: 6,
  padding: '10px 16px',
  cursor: 'pointer',
};

export default function Admin() {
  const [logged, setLogged] = useState(Boolean(localStorage.getItem('adminKey')));
  const [keyInput, setKeyInput] = useState('');
  const [tab, setTab] = useState<Tab>('projects');

  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [articles, setArticles] = useState<ArticleRecord[]>([]);
  const [tech, setTech] = useState<TechRecord[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [modalData, setModalData] = useState<any>(null);
  const [formState, setFormState] = useState<Record<string, any>>({});

  useEffect(() => {
    if (logged) refreshAll();
  }, [logged]);

  async function refreshAll() {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchProjects(), fetchArticles(), fetchTech()]);
    } catch (e: any) {
      setError(e?.message ?? 'Error');
    } finally {
      setLoading(false);
    }
  }

  async function fetchProjects() {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    setProjects(await res.json());
  }

  async function fetchArticles() {
    const res = await fetch(`${API_BASE}/content/articles`);
    if (!res.ok) throw new Error('Failed to fetch articles');
    setArticles(await res.json());
  }

  async function fetchTech() {
    const res = await fetch(`${API_BASE}/content/tech`);
    if (!res.ok) throw new Error('Failed to fetch tech');
    setTech(await res.json());
  }

  function login() {
    localStorage.setItem('adminKey', keyInput);
    setLogged(true);
    setKeyInput('');
  }

  function logout() {
    localStorage.removeItem('adminKey');
    setLogged(false);
  }

  function openProjectModal(type: 'project-create' | 'project-edit' | 'project-delete', project?: ProjectRecord) {
    setModalType(type);
    setModalData(project ?? null);
    setFormState(
      type === 'project-edit' && project
        ? {
            ...project,
            shortDescription: project.shortDescription ?? '',
            technologies: (project.technologies ?? []).join(', '),
            languages: (project.languages ?? []).join(', '),
            frameworks: (project.frameworks ?? []).join(', '),
            screenshots: (project.screenshots ?? []).join(', '),
            challenges: (project.challenges ?? []).join(', '),
            tags: (project.tags ?? []).join(', '),
            timeline: JSON.stringify(project.timeline ?? [], null, 2),
            metrics: JSON.stringify(project.metrics ?? [], null, 2),
            featured: Boolean(project.featured),
            readTime: project.readTime ?? 0,
            published: Boolean(project.published),
          }
        : defaultProjectForm,
    );
  }

  function openArticleModal(type: 'article-create' | 'article-edit' | 'article-delete', article?: ArticleRecord) {
    setModalType(type);
    setModalData(article ?? null);
    setFormState(
      type === 'article-edit' && article
        ? {
            ...article,
            summary: article.summary ?? '',
            tags: (article.tags ?? []).join(', '),
            featured: Boolean(article.featured),
            readTime: article.readTime ?? 0,
          }
        : defaultArticleForm,
    );
  }

  function openTechModal(type: 'tech-create' | 'tech-edit' | 'tech-delete', item?: TechRecord) {
    setModalType(type);
    setModalData(item ?? null);
    setFormState(type === 'tech-edit' && item ? { ...item } : defaultTechForm);
  }

  function closeModal() {
    setModalType(null);
    setModalData(null);
    setFormState({});
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const target = event.target;
    const { name, type, value } = target;
    const checked = 'checked' in target ? target.checked : false;
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function submitProject() {
    const payload: any = {
      title: formState.title,
      slug: formState.slug,
      shortDescription: formState.shortDescription,
      description: formState.description,
      problem: formState.problem,
      architecture: formState.architecture,
      solution: formState.solution,
      results: formState.results,
      technologies: parseList(String(formState.technologies ?? '')),
      languages: parseList(String(formState.languages ?? '')),
      frameworks: parseList(String(formState.frameworks ?? '')),
      category: formState.category,
      status: formState.status,
      year: Number(formState.year || 0) || undefined,
      featured: Boolean(formState.featured),
      image: formState.image,
      github: formState.github,
      demo: formState.demo,
      screenshots: parseList(String(formState.screenshots ?? '')),
      timeline: parseJson<Array<{ date: string; event: string }>>(String(formState.timeline || '[]'), []),
      challenges: parseList(String(formState.challenges ?? '')),
      metrics: parseJson<Array<{ label: string; value: string }>>(String(formState.metrics || '[]'), []),
      tags: parseList(String(formState.tags ?? '')),
      readTime: Number(formState.readTime || 0) || undefined,
      date: formState.date,
      url: formState.url,
      published: Boolean(formState.published),
    };

    try {
      const res = await fetch(
        modalType === 'project-create' ? `${API_BASE}/projects` : `${API_BASE}/projects/${modalData.id}`,
        {
          method: modalType === 'project-create' ? 'POST' : 'PATCH',
          headers: { 'Content-Type': 'application/json', ...authHeaders() },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) throw new Error('Failed to save project');
      await fetchProjects();
      closeModal();
    } catch (e: any) {
      setError(e?.message ?? 'Error saving project');
    }
  }

  async function submitArticle() {
    const payload: any = {
      title: formState.title,
      slug: formState.slug,
      summary: formState.summary,
      description: formState.description,
      readTime: Number(formState.readTime || 0) || undefined,
      tags: parseList(String(formState.tags ?? '')),
      date: formState.date,
      url: formState.url,
      image: formState.image,
      featured: Boolean(formState.featured),
      category: formState.category,
    };

    try {
      const res = await fetch(
        modalType === 'article-create' ? `${API_BASE}/content/articles` : `${API_BASE}/content/articles/${modalData.id}`,
        {
          method: modalType === 'article-create' ? 'POST' : 'PATCH',
          headers: { 'Content-Type': 'application/json', ...authHeaders() },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) throw new Error('Failed to save article');
      await fetchArticles();
      closeModal();
    } catch (e: any) {
      setError(e?.message ?? 'Error saving article');
    }
  }

  async function submitTech() {
    const payload: any = {
      name: formState.name,
      category: formState.category,
      icon: formState.icon,
      level: Number(formState.level || 0),
    };

    try {
      const res = await fetch(
        modalType === 'tech-create' ? `${API_BASE}/content/tech` : `${API_BASE}/content/tech/${encodeURIComponent(modalData.name)}`,
        {
          method: modalType === 'tech-create' ? 'POST' : 'PATCH',
          headers: { 'Content-Type': 'application/json', ...authHeaders() },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) throw new Error('Failed to save tech');
      await fetchTech();
      closeModal();
    } catch (e: any) {
      setError(e?.message ?? 'Error saving tech');
    }
  }

  async function confirmDelete() {
    try {
      if (modalType === 'project-delete') {
        const res = await fetch(`${API_BASE}/projects/${modalData.id}`, { method: 'DELETE', headers: authHeaders() });
        if (!res.ok) throw new Error('Failed to delete project');
        await fetchProjects();
      }
      if (modalType === 'article-delete') {
        const res = await fetch(`${API_BASE}/content/articles/${modalData.id}`, { method: 'DELETE', headers: authHeaders() });
        if (!res.ok) throw new Error('Failed to delete article');
        await fetchArticles();
      }
      if (modalType === 'tech-delete') {
        const res = await fetch(`${API_BASE}/content/tech/${encodeURIComponent(modalData.name)}`, { method: 'DELETE', headers: authHeaders() });
        if (!res.ok) throw new Error('Failed to delete tech');
        await fetchTech();
      }
      closeModal();
    } catch (e: any) {
      setError(e?.message ?? 'Error deleting item');
    }
  }

  return (
    <div style={{ color: '#e6eef8', padding: 20 }}>
      <h1>Admin</h1>
      {!logged ? (
        <div style={{ maxWidth: 420, marginTop: 20 }}>
          <p>Introduce tu clave admin:</p>
          <input
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            style={{ padding: 10, width: '100%', borderRadius: 8, border: '1px solid #334155', background: '#0f1724', color: '#e2e8f0' }}
          />
          <div style={{ marginTop: 12 }}>
            <button onClick={login} style={primaryButtonStyle}>
              Entrar
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 18, flexWrap: 'wrap' }}>
            <button onClick={logout} style={secondaryButtonStyle}>
              Logout
            </button>
            <button onClick={refreshAll} style={secondaryButtonStyle}>
              Refrescar
            </button>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={() => setTab('projects')} style={secondaryButtonStyle}>
                Projects
              </button>
              <button onClick={() => setTab('articles')} style={secondaryButtonStyle}>
                Articles
              </button>
              <button onClick={() => setTab('tech')} style={secondaryButtonStyle}>
                Tech
              </button>
            </div>
          </div>

          {loading && <div>Loading…</div>}
          {error && <div style={{ color: 'salmon', marginBottom: 12 }}>{error}</div>}

          {tab === 'projects' && (
            <div>
              <div style={{ marginBottom: 12 }}>
                <button onClick={() => openProjectModal('project-create')} style={primaryButtonStyle}>
                  Nuevo proyecto
                </button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid #1a2234' }}>
                    <th style={{ padding: '10px 8px' }}>ID</th>
                    <th style={{ padding: '10px 8px' }}>Title</th>
                    <th style={{ padding: '10px 8px' }}>Slug</th>
                    <th style={{ padding: '10px 8px' }}>Published</th>
                    <th style={{ padding: '10px 8px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #0f1724' }}>
                      <td style={{ padding: '10px 8px' }}>{p.id}</td>
                      <td style={{ padding: '10px 8px' }}>{p.title}</td>
                      <td style={{ padding: '10px 8px' }}>{p.slug}</td>
                      <td style={{ padding: '10px 8px' }}>{String(p.published)}</td>
                      <td style={{ padding: '10px 8px' }}>
                        <button onClick={() => openProjectModal('project-edit', p)} style={{ ...secondaryButtonStyle, marginRight: 8 }}>
                          Edit
                        </button>
                        <button onClick={() => openProjectModal('project-delete', p)} style={secondaryButtonStyle}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'articles' && (
            <div>
              <div style={{ marginBottom: 12 }}>
                <button onClick={() => openArticleModal('article-create')} style={primaryButtonStyle}>
                  Nuevo artículo
                </button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid #1a2234' }}>
                    <th style={{ padding: '10px 8px' }}>ID</th>
                    <th style={{ padding: '10px 8px' }}>Title</th>
                    <th style={{ padding: '10px 8px' }}>Summary</th>
                    <th style={{ padding: '10px 8px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((a) => (
                    <tr key={a.id} style={{ borderBottom: '1px solid #0f1724' }}>
                      <td style={{ padding: '10px 8px' }}>{a.id}</td>
                      <td style={{ padding: '10px 8px' }}>{a.title}</td>
                      <td style={{ padding: '10px 8px' }}>{a.summary}</td>
                      <td style={{ padding: '10px 8px' }}>
                        <button onClick={() => openArticleModal('article-edit', a)} style={{ ...secondaryButtonStyle, marginRight: 8 }}>
                          Edit
                        </button>
                        <button onClick={() => openArticleModal('article-delete', a)} style={secondaryButtonStyle}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'tech' && (
            <div>
              <div style={{ marginBottom: 12 }}>
                <button onClick={() => openTechModal('tech-create')} style={primaryButtonStyle}>
                  Nuevo tech
                </button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid #1a2234' }}>
                    <th style={{ padding: '10px 8px' }}>Name</th>
                    <th style={{ padding: '10px 8px' }}>Category</th>
                    <th style={{ padding: '10px 8px' }}>Level</th>
                    <th style={{ padding: '10px 8px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tech.map((t) => (
                    <tr key={t.name} style={{ borderBottom: '1px solid #0f1724' }}>
                      <td style={{ padding: '10px 8px' }}>{t.name}</td>
                      <td style={{ padding: '10px 8px' }}>{t.category}</td>
                      <td style={{ padding: '10px 8px' }}>{t.level}</td>
                      <td style={{ padding: '10px 8px' }}>
                        <button onClick={() => openTechModal('tech-edit', t)} style={{ ...secondaryButtonStyle, marginRight: 8 }}>
                          Edit
                        </button>
                        <button onClick={() => openTechModal('tech-delete', t)} style={secondaryButtonStyle}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {modalType?.startsWith('project') && (
        <Modal
          title={modalType === 'project-create' ? 'Crear proyecto' : modalType === 'project-edit' ? 'Editar proyecto' : 'Eliminar proyecto'}
          onClose={closeModal}
          onConfirm={modalType === 'project-delete' ? confirmDelete : submitProject}
          confirmText={modalType === 'project-delete' ? 'Eliminar' : 'Guardar'}
        >
          {modalType === 'project-delete' ? (
            <p>¿Confirmas eliminar el proyecto <strong>{modalData?.title}</strong>?</p>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {['title', 'slug', 'shortDescription', 'description', 'problem', 'architecture', 'solution', 'results'].map((field) => (
                <label key={field} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span>{field.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())}</span>
                  <input
                    name={field}
                    value={formState[field] ?? ''}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                </label>
              ))}
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span>Tecnologías (coma separada)</span>
                <input name="technologies" value={formState.technologies ?? ''} onChange={handleInputChange} style={inputStyle} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span>Languages (coma separada)</span>
                <input name="languages" value={formState.languages ?? ''} onChange={handleInputChange} style={inputStyle} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span>Frameworks (coma separada)</span>
                <input name="frameworks" value={formState.frameworks ?? ''} onChange={handleInputChange} style={inputStyle} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span>Category</span>
                <input name="category" value={formState.category ?? ''} onChange={handleInputChange} style={inputStyle} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span>Status</span>
                <input name="status" value={formState.status ?? ''} onChange={handleInputChange} style={inputStyle} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span>Year</span>
                <input type="number" name="year" value={formState.year ?? ''} onChange={handleInputChange} style={inputStyle} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span>Featured</span>
                <input type="checkbox" name="featured" checked={Boolean(formState.featured)} onChange={handleInputChange} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span>Published</span>
                <input type="checkbox" name="published" checked={Boolean(formState.published)} onChange={handleInputChange} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span>Image</span>
                <input name="image" value={formState.image ?? ''} onChange={handleInputChange} style={inputStyle} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span>Github</span>
                <input name="github" value={formState.github ?? ''} onChange={handleInputChange} style={inputStyle} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span>Demo</span>
                <input name="demo" value={formState.demo ?? ''} onChange={handleInputChange} style={inputStyle} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span>Video URL</span>
                <input name="videoUrl" value={formState.videoUrl ?? ''} onChange={handleInputChange} style={inputStyle} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span>Screenshots (coma separada)</span>
                <input name="screenshots" value={formState.screenshots ?? ''} onChange={handleInputChange} style={inputStyle} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span>Challenges (coma separada)</span>
                <input name="challenges" value={formState.challenges ?? ''} onChange={handleInputChange} style={inputStyle} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span>Tags (coma separada)</span>
                <input name="tags" value={formState.tags ?? ''} onChange={handleInputChange} style={inputStyle} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span>Read time</span>
                <input type="number" name="readTime" value={formState.readTime ?? 0} onChange={handleInputChange} style={inputStyle} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span>Date</span>
                <input type="date" name="date" value={formState.date ?? ''} onChange={handleInputChange} style={inputStyle} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span>URL</span>
                <input name="url" value={formState.url ?? ''} onChange={handleInputChange} style={inputStyle} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span>Timeline JSON</span>
                <textarea name="timeline" value={formState.timeline ?? '[]'} onChange={handleInputChange} style={textareaStyle} rows={4} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span>Metrics JSON</span>
                <textarea name="metrics" value={formState.metrics ?? '[]'} onChange={handleInputChange} style={textareaStyle} rows={4} />
              </label>
            </div>
          )}
        </Modal>
      )}

      {modalType?.startsWith('article') && (
        <Modal
          title={modalType === 'article-create' ? 'Crear artículo' : modalType === 'article-edit' ? 'Editar artículo' : 'Eliminar artículo'}
          onClose={closeModal}
          onConfirm={modalType === 'article-delete' ? confirmDelete : submitArticle}
          confirmText={modalType === 'article-delete' ? 'Eliminar' : 'Guardar'}
        >
          {modalType === 'article-delete' ? (
            <p>¿Confirmas eliminar el artículo <strong>{modalData?.title}</strong>?</p>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {['title', 'slug', 'summary', 'description', 'category', 'url', 'image'].map((field) => (
                <label key={field} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span>{field.replace(/_/g, ' ')}</span>
                  {field === 'description' ? (
                    <textarea name={field} value={formState[field] ?? ''} onChange={handleInputChange} style={textareaStyle} rows={4} />
                  ) : (
                    <input name={field} value={formState[field] ?? ''} onChange={handleInputChange} style={inputStyle} />
                  )}
                </label>
              ))}
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span>Tags (coma separada)</span>
                <input name="tags" value={formState.tags ?? ''} onChange={handleInputChange} style={inputStyle} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span>Date</span>
                <input type="date" name="date" value={formState.date ?? ''} onChange={handleInputChange} style={inputStyle} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span>Read time</span>
                <input type="number" name="readTime" value={formState.readTime ?? 0} onChange={handleInputChange} style={inputStyle} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span>Featured</span>
                <input type="checkbox" name="featured" checked={Boolean(formState.featured)} onChange={handleInputChange} />
              </label>
            </div>
          )}
        </Modal>
      )}

      {modalType?.startsWith('tech') && (
        <Modal
          title={modalType === 'tech-create' ? 'Crear tecnología' : modalType === 'tech-edit' ? 'Editar tecnología' : 'Eliminar tecnología'}
          onClose={closeModal}
          onConfirm={modalType === 'tech-delete' ? confirmDelete : submitTech}
          confirmText={modalType === 'tech-delete' ? 'Eliminar' : 'Guardar'}
        >
          {modalType === 'tech-delete' ? (
            <p>¿Confirmas eliminar la tecnología <strong>{modalData?.name}</strong>?</p>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {['name', 'category', 'icon'].map((field) => (
                <label key={field} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span>{field}</span>
                  <input name={field} value={formState[field] ?? ''} onChange={handleInputChange} style={inputStyle} />
                </label>
              ))}
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span>Level</span>
                <input type="number" name="level" value={formState.level ?? 0} onChange={handleInputChange} style={inputStyle} />
              </label>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: 10,
  borderRadius: 8,
  border: '1px solid #334155',
  background: '#0f1724',
  color: '#e2e8f0',
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: 100,
  fontFamily: 'inherit',
};
