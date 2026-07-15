import { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1';

function authHeaders() {
  const key = localStorage.getItem('adminKey') ?? '';
  return key ? { 'x-admin-key': key } : {};
}

export default function Admin() {
  const [logged, setLogged] = useState(Boolean(localStorage.getItem('adminKey')));
  const [keyInput, setKeyInput] = useState('');
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (logged) fetchProjects();
  }, [logged]);

  async function fetchProjects() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/projects`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setProjects(data);
    } catch (err: any) {
      setError(err?.message ?? 'Error');
    } finally {
      setLoading(false);
    }
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

  async function createProject() {
    const title = prompt('Title') || 'Nuevo proyecto';
    const slug = prompt('Slug') || `nuevo-${Date.now()}`;
    const shortDescription = prompt('Short description') || '';

    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ title, slug, shortDescription, published: false }),
    });

    if (res.ok) fetchProjects(); else alert('Failed to create (check admin key)');
  }

  async function deleteProject(id: string) {
    if (!confirm('Confirm delete?')) return;
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: { ...authHeaders() },
    });
    if (res.ok) fetchProjects(); else alert('Failed to delete');
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
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={logout} style={{ padding: '6px 10px' }}>Logout</button>
            <button onClick={fetchProjects} style={{ padding: '6px 10px' }}>Refrescar</button>
            <button onClick={createProject} style={{ padding: '6px 10px' }}>Nuevo proyecto</button>
          </div>

          <div style={{ marginTop: 16 }}>
            {loading ? <div>Loading…</div> : (
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
                        <button onClick={() => deleteProject(p.id)} style={{ marginRight: 8 }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {error && <div style={{ color: 'salmon' }}>{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
