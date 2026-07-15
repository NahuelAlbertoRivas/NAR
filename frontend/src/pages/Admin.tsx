import { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1';

function authHeaders() {
  const key = localStorage.getItem('adminKey') ?? '';
  return key ? { 'x-admin-key': key } : {};
}

type Tab = 'projects' | 'articles' | 'tech';

export default function Admin() {
  const [logged, setLogged] = useState(Boolean(localStorage.getItem('adminKey')));
  const [keyInput, setKeyInput] = useState('');
  const [tab, setTab] = useState<Tab>('projects');

  const [projects, setProjects] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [tech, setTech] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // CRUD actions
  async function createProject() {
    const title = prompt('Title') || 'Nuevo proyecto';
    const slug = prompt('Slug') || `nuevo-${Date.now()}`;
    const shortDescription = prompt('Short description') || '';
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ title, slug, shortDescription, published: false }),
    });
    if (res.ok) await fetchProjects(); else alert('Failed to create (check admin key)');
  }

  async function editProject(p: any) {
    const json = prompt('Edit full project JSON', JSON.stringify(p, null, 2));
    if (!json) return;
    try {
      const parsed = JSON.parse(json);
      const res = await fetch(`${API_BASE}/projects/${p.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(parsed),
      });
      if (res.ok) await fetchProjects(); else alert('Failed to update');
    } catch (e: any) {
      alert('Invalid JSON');
    }
  }

  async function deleteProject(id: string) {
    if (!confirm('Confirm delete?')) return;
    const res = await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE', headers: { ...authHeaders() } });
    if (res.ok) await fetchProjects(); else alert('Failed to delete');
  }

  async function createArticle() {
    const maybe = prompt('Create article: enter JSON object or just a title');
    if (!maybe) return;
    let body: any;
    try {
      body = JSON.parse(maybe);
    } catch {
      body = { title: maybe, summary: '' };
    }
    const res = await fetch(`${API_BASE}/content/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(body),
    });
    if (res.ok) await fetchArticles(); else alert('Failed to create article');
  }

  async function editArticle(a: any) {
    const json = prompt('Edit full article JSON', JSON.stringify(a, null, 2));
    if (!json) return;
    try {
      const parsed = JSON.parse(json);
      const res = await fetch(`${API_BASE}/content/articles/${a.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(parsed),
      });
      if (res.ok) await fetchArticles(); else alert('Failed to update article');
    } catch (e: any) {
      alert('Invalid JSON');
    }
  }

  async function deleteArticle(id: string) {
    if (!confirm('Confirm delete?')) return;
    const res = await fetch(`${API_BASE}/content/articles/${id}`, { method: 'DELETE', headers: { ...authHeaders() } });
    if (res.ok) await fetchArticles(); else alert('Failed to delete article');
  }

  async function createTech() {
    const name = prompt('Name') || `tech-${Date.now()}`;
    const category = prompt('Category') || 'Other';
    const level = Number(prompt('Level (0-100)') || '50');
    const res = await fetch(`${API_BASE}/content/tech`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ name, category, level }),
    });
    if (res.ok) await fetchTech(); else alert('Failed to create tech');
  }

  async function editTech(t: any) {
    const category = prompt('Category', t.category) || t.category;
    const level = Number(prompt('Level (0-100)', String(t.level)) || t.level);
    const res = await fetch(`${API_BASE}/content/tech/${encodeURIComponent(t.name)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ category, level }),
    });
    if (res.ok) await fetchTech(); else alert('Failed to update tech');
  }

  async function deleteTech(name: string) {
    if (!confirm('Confirm delete?')) return;
    const res = await fetch(`${API_BASE}/content/tech/${encodeURIComponent(name)}`, { method: 'DELETE', headers: { ...authHeaders() } });
    if (res.ok) await fetchTech(); else alert('Failed to delete tech');
  }

  return (
    <div style={{ color: '#e6eef8' }}>
      <h1>Admin</h1>
      {!logged ? (
        <div>
          <p>Introduce tu clave admin:</p>
          <input value={keyInput} onChange={(e) => setKeyInput(e.target.value)} style={{ padding: 8, width: 320 }} />
          <div style={{ marginTop: 8 }}>
            <button onClick={login} style={{ padding: '8px 12px' }}>Entrar</button>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
            <button onClick={logout} style={{ padding: '6px 10px' }}>Logout</button>
            <button onClick={refreshAll} style={{ padding: '6px 10px' }}>Refrescar</button>
            <div style={{ marginLeft: 'auto' }}>
              <button onClick={() => setTab('projects')} style={{ marginRight: 6 }}>Projects</button>
              <button onClick={() => setTab('articles')} style={{ marginRight: 6 }}>Articles</button>
              <button onClick={() => setTab('tech')}>Tech</button>
            </div>
          </div>

          {loading && <div>Loading…</div>}
          {error && <div style={{ color: 'salmon' }}>{error}</div>}

          {tab === 'projects' && (
            <div>
              <div style={{ marginBottom: 8 }}>
                <button onClick={createProject}>Nuevo proyecto</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid #1a2234' }}>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Slug</th>
                    <th>Published</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #0f1724' }}>
                      <td style={{ padding: '8px 4px' }}>{p.id}</td>
                      <td>{p.title}</td>
                      <td>{p.slug}</td>
                      <td>{String(p.published)}</td>
                      <td>
                        <button onClick={() => editProject(p)} style={{ marginRight: 8 }}>Edit</button>
                        <button onClick={() => deleteProject(p.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'articles' && (
            <div>
              <div style={{ marginBottom: 8 }}>
                <button onClick={createArticle}>Nuevo artículo</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid #1a2234' }}>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Summary</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((a) => (
                    <tr key={a.id} style={{ borderBottom: '1px solid #0f1724' }}>
                      <td style={{ padding: '8px 4px' }}>{a.id}</td>
                      <td>{a.title}</td>
                      <td>{a.summary}</td>
                      <td>
                        <button onClick={() => editArticle(a)} style={{ marginRight: 8 }}>Edit</button>
                        <button onClick={() => deleteArticle(a.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'tech' && (
            <div>
              <div style={{ marginBottom: 8 }}>
                <button onClick={createTech}>Nuevo tech</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid #1a2234' }}>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Level</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tech.map((t) => (
                    <tr key={t.name} style={{ borderBottom: '1px solid #0f1724' }}>
                      <td style={{ padding: '8px 4px' }}>{t.name}</td>
                      <td>{t.category}</td>
                      <td>{t.level}</td>
                      <td>
                        <button onClick={() => editTech(t)} style={{ marginRight: 8 }}>Edit</button>
                        <button onClick={() => deleteTech(t.name)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
