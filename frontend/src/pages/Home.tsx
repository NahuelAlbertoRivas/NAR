import {
  ArrowRight,
  Download,
  GitFork,
  ExternalLink,
  Cpu,
  Zap,
  GitBranch,
  BarChart3,
} from "lucide-react";
import { useEffect, useState } from "react";
import { type Project } from "../data";
import { getProjects } from "../services/portfolioApi";

interface HomeProps {
  onNavigate: (page: string) => void;
  onViewProject: (id: string) => void;
}

const metrics = [
  {
    label: "Tecnologías dominadas",
    value: "12+",
    icon: <Cpu size={16} />,
  },
  {
    label: "Años de experiencia",
    value: "3+",
    icon: <BarChart3 size={16} />,
  },
];

export default function Home({
  onNavigate,
  onViewProject,
}: HomeProps) {
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

  const featured = projects
    .filter((p) => p.featured)
    .slice(0, 3);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      {/* Hero */}
      <section style={{ padding: "64px 0 56px" }}>
        <div
          style={{
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(6,182,212,0.08)",
              border: "1px solid rgba(6,182,212,0.2)",
              borderRadius: 20,
              padding: "4px 12px",
              fontSize: 11,
              fontWeight: 600,
              color: "#06b6d4",
              letterSpacing: "0.06em",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#22c55e",
                display: "inline-block",
              }}
            />
            Disponible para nuevos proyectos
          </span>
        </div>

        <h1
          style={{
            fontSize: 52,
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            margin: "0 0 16px",
            color: "#e8edf5",
            maxWidth: 680,
          }}
        >
          ¡Bienvenida/o!
        </h1>

        <p
          style={{
            fontSize: 17,
            color: "#64748b",
            lineHeight: 1.7,
            maxWidth: 560,
            margin: "0 0 36px",
          }}
        >
          Diseño y construyo sistemas robustos que conectan
          tecnologías, automatizan procesos y potencian
          productos. Cada línea de
          código con intención.
        </p>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => onNavigate("projects")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background:
                "linear-gradient(135deg, #2563eb, #1d4ed8)",
              border: "1px solid rgba(37,99,235,0.5)",
              borderRadius: 10,
              padding: "11px 22px",
              cursor: "pointer",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.opacity =
                "0.85";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.opacity =
                "1";
            }}
          >
            Ver proyectos
            <ArrowRight size={15} />
          </button>
          
          <a
            href="https://drive.google.com/uc?export=download&id=1AuMrzBX8qtJBI_D2jCA2UbdzdPVr2SPq"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "transparent",
              border: "1px solid #1a2234",
              borderRadius: 9,
              padding: "10px 18px",
              cursor: "pointer",
              color: "#64748b",
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            <Download size={14} />
            Descargar CV
          </a>
        </div>
      </section>

      {/* Metrics */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 60,
        }}
      >
        {metrics.map((m) => (
          <div
            key={m.label}
            style={{
              background: "#0b0e18",
              border: "1px solid #1a2234",
              borderRadius: 10,
              padding: "18px 20px",
            }}
          >
            <div style={{ color: "#2563eb", marginBottom: 10 }}>
              {m.icon}
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "#e8edf5",
                letterSpacing: "-0.02em",
                marginBottom: 4,
              }}
            >
              {m.value}
            </div>
            <div style={{ fontSize: 12, color: "#64748b" }}>
              {m.label}
            </div>
          </div>
        ))}
      </section>

      {/* Featured projects */}
      <section style={{ marginBottom: 60 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 700,
                color: "#e8edf5",
                letterSpacing: "-0.02em",
              }}
            >
              Proyectos Destacados
            </h2>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: 13,
                color: "#64748b",
              }}
            >
              Trabajos más relevantes y con mayor impacto
            </p>
          </div>
          <button
            onClick={() => onNavigate("projects")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#06b6d4",
              fontSize: 13,
              fontWeight: 500,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.opacity =
                "0.7";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.opacity =
                "1";
            }}
          >
            Ver todos <ArrowRight size={13} />
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {featured.map((project, i) => (
            <FeaturedCard
              key={project.id}
              project={project}
              highlight={i === 0}
              onView={onViewProject}
            />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          background:
            "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(6,182,212,0.05) 100%)",
          border: "1px solid rgba(37,99,235,0.15)",
          borderRadius: 16,
          padding: "40px",
          marginBottom: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h3
            style={{
              margin: "0 0 8px",
              fontSize: 22,
              fontWeight: 700,
              color: "#e8edf5",
              letterSpacing: "-0.02em",
            }}
          >
            ¿Tenés algún proyecto en mente?
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: "#64748b",
              maxWidth: 480,
            }}
          >
            Estoy al tanto de todo desafío que se presente.
          </p>
        </div>
        <div
          style={{ display: "flex", gap: 10, flexShrink: 0 }}
        >
          <button
            onClick={() => onNavigate("contact")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background:
                "linear-gradient(135deg, #2563eb, #1d4ed8)",
              border: "1px solid rgba(37,99,235,0.5)",
              borderRadius: 9,
              padding: "10px 20px",
              cursor: "pointer",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Escribime
          </button>
          <a
            href="https://github.com/NahuelAlbertoRivas"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "transparent",
              border: "1px solid #1a2234",
              borderRadius: 9,
              padding: "10px 18px",
              cursor: "pointer",
              color: "#64748b",
              fontSize: 13,
              textDecoration: "none",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color =
                "#e8edf5";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color =
                "#64748b";
            }}
          >
            <GitFork size={14} />
            GitHub
          </a>
        </div>
      </section>
    </div>
  );
}

function FeaturedCard({
  project,
  highlight,
  onView,
}: {
  project: any;
  highlight: boolean;
  onView: (id: string) => void;
}) {
  return (
    <div
      onClick={() => onView(project.id)}
      style={{
        background: "#0b0e18",
        border: `1px solid ${highlight ? "rgba(37,99,235,0.3)" : "#1a2234"}`,
        borderRadius: 12,
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.2s",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "#2563eb";
        el.style.transform = "translateY(-2px)";
        el.style.boxShadow = "0 8px 32px rgba(37,99,235,0.15)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = highlight
          ? "rgba(37,99,235,0.3)"
          : "#1a2234";
        el.style.transform = "none";
        el.style.boxShadow = "none";
      }}
    >
      {highlight && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 2,
          }}
        >
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.1em",
              background: "rgba(37,99,235,0.9)",
              color: "#fff",
              borderRadius: 4,
              padding: "3px 7px",
              textTransform: "uppercase",
            }}
          >
            Destacado
          </span>
        </div>
      )}
      <div
        style={{
          height: 130,
          overflow: "hidden",
          background: "#0f1420",
        }}
      >
        <img
          src={project.image}
          alt={project.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.75,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 130,
            background:
              "linear-gradient(to bottom, transparent 30%, #0b0e18)",
          }}
        />
      </div>
      <div style={{ padding: "14px 16px 16px" }}>
        <p
          style={{
            margin: "0 0 4px",
            fontSize: 10,
            fontWeight: 600,
            color: "#06b6d4",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {project.category}
        </p>
        <h3
          style={{
            margin: "0 0 8px",
            fontSize: 14,
            fontWeight: 600,
            color: "#e8edf5",
            letterSpacing: "-0.01em",
          }}
        >
          {project.title}
        </h3>
        <p
          style={{
            margin: "0 0 12px",
            fontSize: 12,
            color: "#64748b",
            lineHeight: 1.5,
          }}
        >
          {project.shortDescription.slice(0, 90)}…
        </p>
        {project.metrics && (
          <div style={{ display: "flex", gap: 12 }}>
            {project.metrics.slice(0, 2).map((m: any) => (
              <div key={m.label}>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#e8edf5",
                  }}
                >
                  {m.value}
                </div>
                <div style={{ fontSize: 10, color: "#475569" }}>
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
          {project.technologies.slice(0, 3).map((t: string) => (
            <span
              key={t}
              style={{
                fontSize: 10,
                fontFamily: "JetBrains Mono, monospace",
                background: "#111827",
                border: "1px solid #1e293b",
                borderRadius: 4,
                padding: "2px 6px",
                color: "#94a3b8",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <div
        style={{
          padding: "10px 16px 14px",
          borderTop: "1px solid #1a2234",
          display: "flex",
          gap: 8,
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 12,
            color: "#93c5fd",
            fontWeight: 500,
          }}
        >
          <ExternalLink size={11} /> Ver detalle
        </span>
      </div>
    </div>
  );
}