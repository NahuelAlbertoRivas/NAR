import { useState } from 'react';
import { GitFork, Link, Mail, Download, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1500);
  };

  return (
    <div style={{ maxWidth: 880, margin: '0 auto' }}>
      <div style={{ padding: '40px 0 40px' }}>
        <h1 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 800, color: '#e8edf5', letterSpacing: '-0.02em' }}>Contacto</h1>
        <p style={{ margin: 0, fontSize: 14, color: '#64748b' }}>Hablemos de tu próximo proyecto o simplemente saluda.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, paddingBottom: 64 }}>
        {/* Form */}
        <div style={{ background: '#0b0e18', border: '1px solid #1a2234', borderRadius: 14, padding: 32 }}>
          {sent ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '40px 0' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={24} color="#22c55e" />
              </div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#e8edf5' }}>¡Mensaje enviado!</h3>
              <p style={{ margin: 0, fontSize: 14, color: '#64748b', textAlign: 'center' }}>Te respondo dentro de las próximas 24–48 horas. ¡Gracias por escribirme!</p>
              <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }} style={{ marginTop: 8, background: 'none', border: '1px solid #1a2234', borderRadius: 8, padding: '8px 20px', cursor: 'pointer', color: '#64748b', fontSize: 13 }}>
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <FormField label="Nombre" type="text" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Tu nombre" required />
                <FormField label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="correo@ejemplo.com" required />
              </div>
              <FormField label="Asunto" type="text" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} placeholder="¿De qué quieres hablar?" required />
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>Mensaje</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Cuéntame sobre tu proyecto, idea o consulta..."
                  required
                  rows={6}
                  style={{
                    width: '100%', background: '#060810', border: '1px solid #1a2234',
                    borderRadius: 8, padding: '10px 14px', color: '#e8edf5', fontSize: 13,
                    outline: 'none', resize: 'vertical', fontFamily: 'Inter, system-ui, sans-serif',
                    lineHeight: 1.6, boxSizing: 'border-box',
                  }}
                  onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#2563eb'; }}
                  onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#1a2234'; }}
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: sending ? '#1e3a8a' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  border: '1px solid rgba(37,99,235,0.5)',
                  borderRadius: 10, padding: '12px 24px',
                  cursor: sending ? 'not-allowed' : 'pointer', color: '#fff',
                  fontSize: 14, fontWeight: 600, transition: 'all 0.15s',
                }}
              >
                <Send size={14} />
                {sending ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          )}
        </div>

        {/* Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <ContactLink
            icon={<Link size={18} />}
            label="LinkedIn"
            handle="/in/nombre-apellido"
            url="https://linkedin.com"
            color="#0077b5"
          />
          <ContactLink
            icon={<GitFork size={18} />}
            label="GitHub"
            handle="/nombre-usuario"
            url="https://github.com"
            color="#e8edf5"
          />
          <ContactLink
            icon={<Mail size={18} />}
            label="Email directo"
            handle="nombre@email.com"
            url="mailto:nombre@email.com"
            color="#06b6d4"
          />

          <div style={{ height: 1, background: '#1a2234', margin: '4px 0' }} />

          <button
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: '#0b0e18', border: '1px solid #1a2234',
              borderRadius: 12, padding: '16px 18px',
              cursor: 'pointer', color: '#e8edf5', fontSize: 14, fontWeight: 500,
              transition: 'all 0.15s', width: '100%', textAlign: 'left',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#2563eb'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#1a2234'; }}
          >
            <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Download size={16} color="#2563eb" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#e8edf5' }}>Descargar CV</p>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: '#64748b' }}>PDF · Actualizado julio 2025</p>
            </div>
          </button>

          <div style={{ background: '#0b0e18', border: '1px solid #1a2234', borderRadius: 12, padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#e8edf5' }}>Disponible ahora</span>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>
              Abierto a proyectos freelance, consultoría técnica y oportunidades de empleo remoto full-time o part-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, type, value, onChange, placeholder, required }: { label: string; type: string; value: string; onChange: (v: string) => void; placeholder: string; required?: boolean }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        style={{
          width: '100%', background: '#060810', border: '1px solid #1a2234',
          borderRadius: 8, padding: '10px 14px', color: '#e8edf5', fontSize: 13,
          outline: 'none', boxSizing: 'border-box',
        }}
        onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#2563eb'; }}
        onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#1a2234'; }}
      />
    </div>
  );
}

function ContactLink({ icon, label, handle, url, color }: { icon: React.ReactNode; label: string; handle: string; url: string; color: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none' }}
    >
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 14,
          background: '#0b0e18', border: '1px solid #1a2234',
          borderRadius: 12, padding: '14px 18px', cursor: 'pointer',
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = color; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#1a2234'; }}
      >
        <div style={{ width: 38, height: 38, borderRadius: 8, background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color }}>
          {icon}
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#e8edf5' }}>{label}</p>
          <p style={{ margin: '2px 0 0', fontSize: 11, color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>{handle}</p>
        </div>
      </div>
    </a>
  );
}
