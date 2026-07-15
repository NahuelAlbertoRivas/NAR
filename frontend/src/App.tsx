import { useEffect, useRef, useState } from 'react';
import type { Page } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import About from './pages/About';
import Tech from './pages/Tech';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import SplashScreen from './components/SplashScreen';

const SIDEBAR_WIDTH = 240;
const HEADER_HEIGHT = 56;

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [detailId, setDetailId] = useState<string | null>(null);
  const [articleDetailId, setArticleDetailId] = useState<string | null>(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [isBooting, setIsBooting] = useState(true);
  const [isBackendPending, setIsBackendPending] = useState(false);
  const pendingFetchesRef = useRef(0);
  const pendingTimerRef = useRef<number | null>(null);
  const [filters, setFilters] = useState({
    technology: '',
    language: '',
    framework: '',
    category: '',
    status: '',
    year: '',
  });

  const navigate = (page: string) => {
    setCurrentPage(page as Page);
    // update URL for direct access
    try {
      const path = page === 'home' ? '/' : `/${page}`;
      window.history.replaceState({}, '', path);
    } catch (e) {
      // ignore during SSR or restricted environments
    }
    setDetailId(null);
    setArticleDetailId(null);
  };

  useEffect(() => {
    const splashTimeout = window.setTimeout(() => setIsBooting(false), 800);
    const originalFetch = window.fetch.bind(window);

    const clearPendingTimer = () => {
      if (pendingTimerRef.current !== null) {
        window.clearTimeout(pendingTimerRef.current);
        pendingTimerRef.current = null;
      }
    };

    const beginPendingRequest = () => {
      pendingFetchesRef.current += 1;
      if (pendingFetchesRef.current === 1) {
        clearPendingTimer();
        pendingTimerRef.current = window.setTimeout(() => setIsBackendPending(true), 2000);
      }
    };

    const finishPendingRequest = () => {
      pendingFetchesRef.current = Math.max(0, pendingFetchesRef.current - 1);
      if (pendingFetchesRef.current === 0) {
        clearPendingTimer();
        setIsBackendPending(false);
      }
    };

    const wrappedFetch: typeof window.fetch = (input, init) => {
      beginPendingRequest();
      return originalFetch(input as RequestInfo | URL, init)
        .then((response) => {
          finishPendingRequest();
          return response;
        })
        .catch((error) => {
          finishPendingRequest();
          throw error;
        });
    };

    window.fetch = wrappedFetch;

    try {
      const p = window.location.pathname.replace(/^\//, '');
      if (!p) return;
      if (p === 'admin') setCurrentPage('admin');
      // for project detail paths like /projects/:slug we keep default behavior
    } catch (e) {
      // ignore
    }

    return () => {
      window.clearTimeout(splashTimeout);
      clearPendingTimer();
      window.fetch = originalFetch;
    };
  }, []);

  const viewProject = (id: string) => {
    setDetailId(id);
    setCurrentPage('projects');
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const viewArticle = (id: string) => {
    setArticleDetailId(id);
    setCurrentPage('articles');
  };

  const renderContent = () => {
    if (currentPage === 'projects' && detailId) {
      return <ProjectDetail projectId={detailId} onBack={() => setDetailId(null)} />;
    }
    if (currentPage === 'articles' && articleDetailId) {
      return <ArticleDetail articleId={articleDetailId} onBack={() => setArticleDetailId(null)} />;
    }
    switch (currentPage) {
      case 'home': return <Home onNavigate={navigate} onViewProject={viewProject} />;
      case 'projects': return <Projects filters={filters} search={sidebarSearch || globalSearch} onViewProject={viewProject} />;
      case 'articles': return <Articles onViewArticle={viewArticle} />;
      case 'about': return <About />;
      case 'tech': return <Tech />;
      case 'contact': return <Contact />;
      case 'admin': return <Admin />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#060810' }}>
      <SplashScreen visible={isBooting || isBackendPending} />
      <Header
        currentPage={currentPage}
        onNavigate={navigate}
        globalSearch={globalSearch}
        onGlobalSearch={setGlobalSearch}
      />
      <Sidebar
        currentPage={currentPage}
        onNavigate={navigate}
        filters={filters}
        onFilterChange={handleFilterChange}
        search={sidebarSearch}
        onSearch={setSidebarSearch}
      />

      {/* Main content */}
      <main
        style={{
          marginLeft: SIDEBAR_WIDTH,
          marginTop: HEADER_HEIGHT,
          minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
          padding: '0 40px',
          position: 'relative',
        }}
      >
        {renderContent()}

        {/* Footer */}
        <footer style={{
          borderTop: '1px solid #1a2234',
          padding: '24px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#334155' }}>© 2026 NAR Development</span>
            <span style={{ fontSize: 12, color: '#1e293b' }}>·</span>
            <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: '#1e293b', background: '#0b0e18', border: '1px solid #1a2234', borderRadius: 4, padding: '2px 6px' }}>v1.0.0</span>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            {(['home', 'projects', 'articles', 'about', 'tech', 'contact'] as Page[]).map((p) => (
              <button
                key={p}
                onClick={() => navigate(p)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#334155', textTransform: 'capitalize', transition: 'color 0.15s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#64748b'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#334155'; }}
              >
                {p === 'about' ? 'Sobre mí' : p === 'tech' ? 'Tech Stack' : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </footer>
      </main>
    </div>
  );
}
