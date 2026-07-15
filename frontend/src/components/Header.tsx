import { useState } from 'react';
import { Search, Download, Mail, X } from 'lucide-react';
import NARLogo from './NARLogo';

type Page = 'home' | 'projects' | 'articles' | 'about' | 'tech' | 'contact';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  globalSearch: string;
  onGlobalSearch: (q: string) => void;
}

const navItems: { key: Page; label: string }[] = [
  { key: 'home', label: 'Inicio' },
  { key: 'projects', label: 'Proyectos' },
  { key: 'articles', label: 'Artículos' },
  { key: 'about', label: 'Sobre mí' },
  { key: 'tech', label: 'Tech Stack' },
];

export default function Header({ currentPage, onNavigate, globalSearch, onGlobalSearch }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 56,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 16,
        paddingRight: 24,
        gap: 0,
        borderBottom: '1px solid #1a2234',
        background: 'rgba(6,8,16,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      {/* Logo */}
      <button
        onClick={() => onNavigate('home')}
        style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: '0 8px 0 0', flexShrink: 0 }}
      >
        <NARLogo size={30} />
        <span style={{ fontWeight: 600, fontSize: 14, color: '#e8edf5', letterSpacing: '-0.01em' }}>
          NAR
          <span style={{ color: '#64748b', fontWeight: 400, marginLeft: 4 }}>/ Development</span>
        </span>
      </button>

      <div style={{ width: '1px', height: 28, background: '#1a2234', margin: '0 20px' }} />

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            style={{
              padding: '5px 12px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: currentPage === item.key ? 500 : 400,
              color: currentPage === item.key ? '#e8edf5' : '#64748b',
              borderRadius: 6,
              transition: 'all 0.15s',
              position: 'relative',
            }}
            onMouseEnter={(e) => { if (currentPage !== item.key) (e.currentTarget as HTMLElement).style.color = '#94a3b8'; }}
            onMouseLeave={(e) => { if (currentPage !== item.key) (e.currentTarget as HTMLElement).style.color = '#64748b'; }}
          >
            {item.label}
            {currentPage === item.key && (
              <span style={{
                position: 'absolute',
                bottom: -1,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60%',
                height: 2,
                background: 'linear-gradient(90deg, #2563eb, #06b6d4)',
                borderRadius: 2,
              }} />
            )}
          </button>
        ))}
      </nav>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {searchOpen ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0b0e18', border: '1px solid #2563eb', borderRadius: 8, padding: '5px 10px' }}>
            <Search size={13} color="#64748b" />
            <input
              autoFocus
              placeholder="Buscar proyectos, artículos..."
              value={globalSearch}
              onChange={(e) => onGlobalSearch(e.target.value)}
              style={{ background: 'none', border: 'none', outline: 'none', color: '#e8edf5', fontSize: 13, width: 200 }}
            />
            <button onClick={() => { setSearchOpen(false); onGlobalSearch(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
              <X size={13} color="#64748b" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0b0e18', border: '1px solid #1a2234', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', color: '#64748b', fontSize: 13 }}
          >
            <Search size={13} />
            <span>Buscar</span>
            <kbd style={{ fontSize: 10, background: '#1a2234', padding: '1px 5px', borderRadius: 4, color: '#475569' }}>⌘K</kbd>
          </button>
        )}

        <button
          onClick={() => onNavigate('contact')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            border: '1px solid rgba(37,99,235,0.5)',
            borderRadius: 8, padding: '6px 14px',
            cursor: 'pointer', color: '#fff', fontSize: 13, fontWeight: 500,
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
        >
          <Mail size={13} />
          Contacto
        </button>

        <button
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'transparent',
            border: '1px solid #1a2234',
            borderRadius: 8, padding: '6px 12px',
            cursor: 'pointer', color: '#64748b', fontSize: 13,
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#2563eb'; (e.currentTarget as HTMLElement).style.color = '#e8edf5'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#1a2234'; (e.currentTarget as HTMLElement).style.color = '#64748b'; }}
        >
          <Download size={13} />
          CV
        </button>
      </div>
    </header>
  );
}
