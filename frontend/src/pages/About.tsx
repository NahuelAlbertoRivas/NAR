import { MapPin, Globe, Award } from 'lucide-react';

const skills = [
  { name: 'Backend Development', level: 80 },
  { name: 'Integraciones & APIs', level: 60 },
  { name: 'Inteligencia Artificial / LLMs', level: 50 },
  { name: 'DevOps & Cloud', level: 60 },
  { name: 'Frontend', level: 30 },
];

const experience = [
  {
    role: 'DB Backend Developer',
    company: 'WonderLab',
    period: 'Jul. 2023 – Ene. 2025',
    description: 'Desarrollo de scripts y mantenimiento de servicio cloud.',
  }
];

const certifications: Array<{ name: string; issuer: string; year: string }> = [];

const languages = [
  { lang: 'Español', level: 'Nativo', code: '🇪🇸' },
  { lang: 'Inglés', level: 'Intermedio (B1)', code: '🇺🇸' }
];

export default function About() {
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ padding: '40px 0 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 40, alignItems: 'start' }}>
          {/* Profile card */}
          <div>
            <div style={{ background: '#0b0e18', border: '1px solid #1a2234', borderRadius: 14, overflow: 'hidden', position: 'sticky', top: 80 }}>
              {/* Photo placeholder */}
              <div style={{
                height: 220, background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(6,182,212,0.08))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderBottom: '1px solid #1a2234',
              }}>
                <div style={{
                  width: 100, height: 100, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 36, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em',
                }}>
                  NAR
                </div>
              </div>
              <div style={{ padding: '20px 22px' }}>
                <h2 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 700, color: '#e8edf5', letterSpacing: '-0.01em' }}>Nahuel Alberto Rivas</h2>
                <p style={{ margin: '0 0 14px', fontSize: 13, color: '#06b6d4', fontWeight: 500 }}>Jr Developer</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#64748b' }}>
                    <MapPin size={12} color="#475569" />
                    Buenos Aires · Argentina
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#64748b' }}>
                    <Globe size={12} color="#475569" />
                    Disponible internacionalmente
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #1a2234', paddingTop: 16, marginTop: 4 }}>
                  <p style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#475569' }}>Idiomas</p>
                  {languages.map((l) => (
                    <div key={l.lang} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>{l.code} {l.lang}</span>
                      <span style={{ fontSize: 10, color: '#475569', fontFamily: 'JetBrains Mono, monospace' }}>{l.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {/* Bio */}
            <section>
              <h1 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 800, color: '#e8edf5', letterSpacing: '-0.02em' }}>Sobre mí</h1>
              <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.75, margin: '0 0 16px' }}>
                Soy estudiante avanzado de Ingeniería en Informática apasionado por el diseño y desarrollo de software, la arquitectura de sistemas y la creación de soluciones tecnológicas que transformen ideas en productos funcionales.
              </p>
              <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.75, margin: 0 }}>
                Mi enfoque combina ingeniería, pensamiento crítico y creatividad para resolver problemas complejos mediante software robusto, escalable y mantenible. Me interesa especialmente el desarrollo backend, la automatización de procesos, la inteligencia artificial y las tecnologías emergentes que impulsan la evolución digital de las organizaciones.<br></br>
                A lo largo de mi recorrido académico y profesional he fortalecido no solo mis habilidades técnicas, sino también mi capacidad para comunicar, colaborar y adaptarme a nuevos desafíos. Disfruto aprender continuamente, explorar nuevas áreas del conocimiento y conectar conceptos de diferentes disciplinas para encontrar soluciones innovadoras.<br></br>
                Creo en la tecnología como una herramienta para generar impacto real: simplificar procesos, mejorar experiencias y construir sistemas que aporten valor a las personas y organizaciones.
              </p>
            </section>

            {/* Skills */}
            <section>
              <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700, color: '#e8edf5', letterSpacing: '-0.01em' }}>Habilidades técnicas</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {skills.map((skill) => (
                  <div key={skill.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: '#94a3b8' }}>{skill.name}</span>
                      <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: '#475569' }}>{skill.level}%</span>
                    </div>
                    <div style={{ height: 4, background: '#1a2234', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${skill.level}%`,
                        background: 'linear-gradient(90deg, #2563eb, #06b6d4)',
                        borderRadius: 4,
                        transition: 'width 0.6s ease',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Experience */}
            <section>
              <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700, color: '#e8edf5', letterSpacing: '-0.01em' }}>Experiencia</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {experience.map((exp, i) => (
                  <div key={i} style={{ display: 'flex', gap: 16, paddingBottom: i < experience.length - 1 ? 24 : 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: i === 0 ? '#2563eb' : '#334155', border: `2px solid ${i === 0 ? '#2563eb' : '#1a2234'}`, flexShrink: 0, marginTop: 5 }} />
                      {i < experience.length - 1 && <div style={{ width: 1, flex: 1, background: '#1a2234', marginTop: 6 }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
                        <div>
                          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#e8edf5' }}>{exp.role}</h3>
                          <p style={{ margin: '2px 0 0', fontSize: 13, color: '#06b6d4', fontWeight: 500 }}>{exp.company}</p>
                        </div>
                        <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: '#475569', flexShrink: 0 }}>{exp.period}</span>
                      </div>
                      <p style={{ margin: '8px 0 0', fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Certifications */}
            <section style={{ paddingBottom: 48 }}>
              <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700, color: '#e8edf5', letterSpacing: '-0.01em' }}>Certificaciones</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {certifications?.map((cert, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#0b0e18', border: '1px solid #1a2234', borderRadius: 10, padding: '14px 18px' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Award size={16} color="#f59e0b" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#e8edf5' }}>{cert.name}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>{cert.issuer}</p>
                    </div>
                    <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: '#475569' }}>{cert.year}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
