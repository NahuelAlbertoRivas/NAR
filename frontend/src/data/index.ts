export type ProjectStatus = 'completed' | 'in-progress';

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  problem: string;
  architecture: string;
  solution: string;
  results: string;
  technologies: string[];
  languages: string[];
  frameworks: string[];
  category: string;
  status: ProjectStatus;
  year: number;
  featured: boolean;
  image: string;
  github?: string;
  demo?: string;
  videoUrl?: string;
  screenshots: string[];
  timeline: { date: string; event: string }[];
  challenges: string[];
  metrics?: { label: string; value: string }[];
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  description?: string;
  readTime: number;
  tags: string[];
  date: string;
  url?: string;
}

export const projects: Project[] = [
  {
    id: 'ai-pipeline-orchestrator',
    title: 'AI Pipeline Orchestrator',
    shortDescription: 'Plataforma de orquestación de pipelines de IA con integración de múltiples modelos LLM y procesamiento distribuido.',
    description: 'Sistema de orquestación empresarial que permite diseñar, desplegar y monitorear pipelines de inteligencia artificial con soporte para múltiples proveedores de modelos de lenguaje. Incluye un editor visual de flujos, métricas en tiempo real y sistema de alertas.',
    problem: 'Las empresas necesitaban integrar múltiples modelos de IA en sus flujos de trabajo sin depender de un único proveedor y con visibilidad completa del proceso.',
    architecture: 'Microservicios en Spring Boot con comunicación via Kafka. Frontend en Angular con WebSockets para actualizaciones en tiempo real. Orquestador central en Python con LangChain.',
    solution: 'Diseñé un sistema de plugins extensible donde cada nodo del pipeline es un microservicio independiente, permitiendo escalar y reemplazar componentes sin afectar el flujo completo.',
    results: 'Reducción del 60% en tiempo de integración de nuevos modelos de IA. Procesamiento de +500k requests/día con 99.9% de uptime.',
    technologies: ['Java', 'Python', 'Angular', 'Kafka', 'Docker', 'Kubernetes', 'PostgreSQL', 'Redis'],
    languages: ['Java', 'Python', 'TypeScript'],
    frameworks: ['Spring Boot', 'Angular', 'LangChain'],
    category: 'Inteligencia Artificial',
    status: 'completed',
    year: 2024,
    featured: true,
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=450&fit=crop&auto=format',
    github: 'https://github.com',
    demo: 'https://demo.example.com',
    screenshots: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop&auto=format',
    ],
    timeline: [
      { date: 'Mar 2024', event: 'Inicio del proyecto y diseño de arquitectura' },
      { date: 'May 2024', event: 'MVP con soporte para OpenAI y Anthropic' },
      { date: 'Jul 2024', event: 'Integración de Kafka para procesamiento asíncrono' },
      { date: 'Sep 2024', event: 'Lanzamiento en producción con 3 clientes enterprise' },
    ],
    challenges: [
      'Gestión de state distribuido entre múltiples instancias del orquestador',
      'Latencia variable entre proveedores de IA que afectaba tiempos de respuesta',
      'Serialización de grafos complejos con dependencias circulares',
    ],
    metrics: [
      { label: 'Requests/día', value: '500k+' },
      { label: 'Uptime', value: '99.9%' },
      { label: 'Reducción tiempo', value: '60%' },
      { label: 'Clientes', value: '3 enterprise' },
    ],
  },
  {
    id: 'integration-hub',
    title: 'Enterprise Integration Hub',
    shortDescription: 'Plataforma de integraciones B2B que conecta más de 40 sistemas empresariales con transformaciones ETL en tiempo real.',
    description: 'Hub centralizado de integraciones que permite a empresas conectar sus sistemas legacy con APIs modernas mediante conectores configurables, transformaciones de datos visuales y monitoreo granular de cada transacción.',
    problem: 'Empresas con sistemas legacy incompatibles necesitaban integrarse con socios comerciales que usaban APIs REST/GraphQL modernas sin reescribir sus sistemas core.',
    architecture: 'API Gateway en Spring Cloud Gateway. Motor de transformación ETL en Python. Base de datos de configuración en PostgreSQL y caché de transacciones en Redis. Monitoreo con ELK Stack.',
    solution: 'Desarrollé un sistema de conectores declarativos donde las transformaciones se definen en YAML, permitiendo al equipo de negocio configurar integraciones sin código.',
    results: 'Integración de 40+ sistemas en 6 meses. Reducción del 80% en tiempo de onboarding de nuevos socios comerciales.',
    technologies: ['Java', 'Python', 'Spring Boot', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'AWS'],
    languages: ['Java', 'Python'],
    frameworks: ['Spring Boot', 'Spring Cloud'],
    category: 'Integraciones',
    status: 'completed',
    year: 2024,
    featured: true,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop&auto=format',
    github: 'https://github.com',
    screenshots: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop&auto=format',
    ],
    timeline: [
      { date: 'Jan 2024', event: 'Análisis de requerimientos con 5 clientes' },
      { date: 'Mar 2024', event: 'Desarrollo del motor ETL core' },
      { date: 'Jun 2024', event: 'Primeras 10 integraciones en producción' },
      { date: 'Sep 2024', event: '40 sistemas integrados, expansión internacional' },
    ],
    challenges: [
      'Manejo de schemas XML legacy complejos con namespaces anidados',
      'Garantizar entrega exactamente-una-vez en transacciones financieras',
      'Performance bajo alta concurrencia con sistemas externos lentos',
    ],
    metrics: [
      { label: 'Sistemas integrados', value: '40+' },
      { label: 'Transacciones/hora', value: '100k' },
      { label: 'Reducción onboarding', value: '80%' },
    ],
  },
  {
    id: 'rpa-automation-suite',
    title: 'RPA Automation Suite',
    shortDescription: 'Suite de automatización robótica de procesos que elimina tareas manuales repetitivas en operaciones financieras.',
    description: 'Plataforma de RPA desarrollada a medida para automatizar procesos operativos en el sector financiero. Incluye grabador de acciones, editor visual de bots, scheduler y panel de control con métricas de ahorro de tiempo.',
    problem: 'El equipo de operaciones dedicaba 40+ horas semanales a tareas manuales repetitivas: conciliación de transacciones, generación de reportes y actualización de sistemas legados.',
    architecture: 'Backend Python con Playwright para automatización web. Scheduler con Celery y Redis. API REST en FastAPI. Dashboard en Angular con reportes en tiempo real.',
    solution: 'Implementé un sistema de bots configurables con retry logic, manejo de errores robusto y notificaciones automáticas cuando un proceso requiere intervención humana.',
    results: 'Automatización del 85% de tareas manuales. Ahorro de 160 horas/mes del equipo de operaciones.',
    technologies: ['Python', 'Angular', 'PostgreSQL', 'Redis', 'Docker', 'Azure'],
    languages: ['Python', 'TypeScript'],
    frameworks: ['FastAPI', 'Angular', 'Celery'],
    category: 'Automatización',
    status: 'completed',
    year: 2023,
    featured: true,
    image: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&h=450&fit=crop&auto=format',
    github: 'https://github.com',
    demo: 'https://demo.example.com',
    screenshots: [],
    timeline: [
      { date: 'Jun 2023', event: 'Levantamiento de procesos con el negocio' },
      { date: 'Aug 2023', event: 'Primeros 5 bots en producción' },
      { date: 'Nov 2023', event: 'Suite completa con 20 bots activos' },
    ],
    challenges: [
      'Estabilidad de selectores CSS en sistemas legados que cambiaban frecuentemente',
      'Manejo de CAPTCHAs y sesiones expiradas',
      'Coordinación de bots concurrentes sobre el mismo recurso',
    ],
    metrics: [
      { label: 'Automatización', value: '85%' },
      { label: 'Horas ahorradas/mes', value: '160' },
      { label: 'Bots activos', value: '20' },
    ],
  },
  {
    id: 'microservices-platform',
    title: 'Cloud-Native Microservices Platform',
    shortDescription: 'Plataforma de microservicios con service mesh, observabilidad completa y despliegues canary automatizados en Kubernetes.',
    description: 'Diseño e implementación de una plataforma de microservicios cloud-native con Istio service mesh, distributed tracing con Jaeger, métricas con Prometheus/Grafana y CI/CD con pipelines GitOps.',
    problem: 'La arquitectura monolítica existente limitaba la capacidad de escalar componentes individualmente y los despliegues requerían downtime.',
    architecture: 'Kubernetes con Istio service mesh. 15 microservicios en Spring Boot. Observabilidad con Prometheus, Grafana, Jaeger y ELK. CI/CD con ArgoCD y GitOps.',
    solution: 'Migración gradual del monolito usando el patrón strangler fig. Cada servicio extraído se validó con feature flags antes de reemplazar el código legacy.',
    results: 'Zero-downtime deployments. Reducción del 70% en tiempo de resolución de incidentes gracias a la observabilidad mejorada.',
    technologies: ['Java', 'Spring Boot', 'Kubernetes', 'Docker', 'AWS', 'PostgreSQL', 'MongoDB'],
    languages: ['Java'],
    frameworks: ['Spring Boot', 'Spring Cloud'],
    category: 'Infraestructura',
    status: 'completed',
    year: 2023,
    featured: false,
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=450&fit=crop&auto=format',
    github: 'https://github.com',
    screenshots: [],
    timeline: [
      { date: 'Jan 2023', event: 'Diseño de arquitectura target' },
      { date: 'Apr 2023', event: 'Primeros 5 servicios extraídos' },
      { date: 'Oct 2023', event: 'Migración completa del monolito' },
    ],
    challenges: [
      'Gestión de transacciones distribuidas entre múltiples servicios',
      'Migración de datos sin pérdida durante la transición',
    ],
    metrics: [
      { label: 'Servicios', value: '15' },
      { label: 'Resolución incidentes', value: '-70%' },
      { label: 'Downtime', value: '0' },
    ],
  },
  {
    id: 'nlp-document-processor',
    title: 'NLP Document Intelligence',
    shortDescription: 'Sistema de procesamiento inteligente de documentos con extracción de entidades, clasificación y resumen automático.',
    description: 'Motor de procesamiento de documentos que utiliza modelos NLP para extraer información estructurada de documentos no estructurados: contratos, facturas, informes técnicos y correspondencia.',
    problem: 'El área legal procesaba manualmente 500+ documentos por semana para extraer cláusulas relevantes, fechas y partes involucradas.',
    architecture: 'Python con spaCy y Transformers (BERT). API en FastAPI. Almacenamiento en MongoDB para documentos y PostgreSQL para metadata. Frontend en Angular.',
    solution: 'Fine-tuning de modelos BERT sobre corpus de documentos del dominio. Pipeline de procesamiento asíncrono con colas de prioridad.',
    results: 'Procesamiento de documentos reducido de 2 horas a 3 minutos. Precisión de extracción del 94%.',
    technologies: ['Python', 'MongoDB', 'PostgreSQL', 'Docker', 'Azure', 'Angular'],
    languages: ['Python', 'TypeScript'],
    frameworks: ['FastAPI', 'Angular'],
    category: 'Inteligencia Artificial',
    status: 'completed',
    year: 2023,
    featured: false,
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=450&fit=crop&auto=format',
    github: 'https://github.com',
    screenshots: [],
    timeline: [
      { date: 'Mar 2023', event: 'Recolección y etiquetado del corpus' },
      { date: 'Jun 2023', event: 'Fine-tuning del modelo base' },
      { date: 'Aug 2023', event: 'Producción con 500 docs/semana' },
    ],
    challenges: [
      'Escasez de datos anotados en el dominio legal',
      'Variabilidad en el formato de documentos escaneados',
    ],
    metrics: [
      { label: 'Precisión', value: '94%' },
      { label: 'Tiempo procesamiento', value: '3 min' },
      { label: 'Docs/semana', value: '500+' },
    ],
  },
  {
    id: 'devops-platform',
    title: 'Internal Developer Platform',
    shortDescription: 'Plataforma interna de desarrollo que estandariza el ciclo de vida de aplicaciones desde el scaffolding hasta el despliegue.',
    description: 'IDP (Internal Developer Platform) que permite a equipos de desarrollo crear, desplegar y operar microservicios sin conocimiento profundo de infraestructura. Incluye templates, pipelines CI/CD y self-service operations.',
    problem: 'Los equipos de desarrollo perdían 30% de su tiempo configurando entornos, pipelines y gestionando infraestructura en lugar de desarrollar features.',
    architecture: 'Portal en React + TypeScript. Backend en Go para operaciones de infraestructura. Integración con GitLab, ArgoCD, Kubernetes y Terraform.',
    solution: 'Golden paths para casos de uso comunes que abstrae la complejidad de infraestructura manteniendo la flexibilidad para equipos avanzados.',
    results: 'Tiempo de onboarding de nuevos proyectos reducido de 2 semanas a 1 día. Satisfacción del equipo dev aumentó 40%.',
    technologies: ['Docker', 'Kubernetes', 'AWS', 'PostgreSQL', 'Git'],
    languages: ['TypeScript', 'Go'],
    frameworks: ['React'],
    category: 'DevOps',
    status: 'in-progress',
    year: 2024,
    featured: false,
    image: 'https://images.unsplash.com/photo-1642132652075-3cb7f827c3cd?w=800&h=450&fit=crop&auto=format',
    github: 'https://github.com',
    screenshots: [],
    timeline: [
      { date: 'Jun 2024', event: 'Discovery y diseño del producto' },
      { date: 'Sep 2024', event: 'Beta con 3 equipos piloto' },
      { date: 'Dec 2024', event: 'Rollout completo — en progreso' },
    ],
    challenges: [
      'Balancear abstracción y flexibilidad para distintos niveles de madurez de equipos',
      'Migración de proyectos existentes al nuevo paradigma',
    ],
    metrics: [
      { label: 'Onboarding', value: '1 día' },
      { label: 'Satisfacción dev', value: '+40%' },
    ],
  },
];

export const articles: Article[] = [
  {
    id: 'distributed-transactions',
    title: 'Transacciones Distribuidas en Microservicios: Sagas y Outbox Pattern',
    summary: 'Cómo garantizar consistencia eventual en arquitecturas de microservicios sin two-phase commit. Un análisis profundo del patrón Saga coreografiado vs orquestado y la implementación del Outbox Pattern con Debezium.',
    readTime: 12,
    tags: ['Microservicios', 'Java', 'Spring Boot', 'Arquitectura'],
    date: '2024-11-15',
  },
  {
    id: 'llm-production',
    title: 'Llevar LLMs a Producción: Lecciones Aprendidas',
    summary: 'Reflexiones prácticas sobre desafíos reales al operar modelos de lenguaje en entornos enterprise: latencia, costos, hallucinations, y cómo construir guardrails efectivos sin sacrificar utilidad.',
    readTime: 8,
    tags: ['IA', 'LLM', 'Python', 'MLOps'],
    date: '2024-09-20',
  },
  {
    id: 'kubernetes-patterns',
    title: 'Patrones Avanzados de Kubernetes para Equipos de Producto',
    summary: 'Más allá de los deployments básicos: cómo usar Init Containers, Sidecars, Pod Disruption Budgets y Custom Resources para construir plataformas resilientes que los equipos de producto puedan operar de forma autónoma.',
    readTime: 15,
    tags: ['Kubernetes', 'DevOps', 'Infraestructura', 'Cloud'],
    date: '2024-07-08',
  },
  {
    id: 'rpa-vs-apis',
    title: 'RPA vs APIs: Cuándo Automatizar con Robots y Cuándo Integrar',
    summary: 'Un framework de decisión para elegir entre automatización robótica y integración via APIs. Análisis de costos, mantenibilidad y casos de uso donde cada enfoque tiene ventaja estratégica.',
    readTime: 6,
    tags: ['RPA', 'Automatización', 'Integraciones', 'Arquitectura'],
    date: '2024-04-22',
  },
  {
    id: 'event-driven',
    title: 'Event-Driven Architecture con Kafka: Más Allá del Hello World',
    summary: 'Implementación de patrones event sourcing y CQRS con Apache Kafka en sistemas de alta disponibilidad. Manejo de schema evolution, exactly-once semantics y estrategias de dead letter queues.',
    readTime: 10,
    tags: ['Kafka', 'Event-Driven', 'Java', 'Arquitectura'],
    date: '2024-02-14',
  },
];

export const techStack = [
  { name: 'Java', category: 'Lenguaje', icon: '☕', level: 80 },
    { name: 'C++/C', category: 'Lenguaje', icon: '𝐂++', level: 80 },
    { name: 'Python', category: 'Lenguaje', icon: '🐍', level: 60 },
    { name: 'Prolog', category: 'Lenguaje', icon: '📜', level: 40 },
    { name: 'Haskell', category: 'Lenguaje', icon: 'λ', level: 40 },
    { name: 'TypeScript', category: 'Lenguaje', icon: '📘', level: 30 },
    { name: 'Kotlin', category: 'Lenguaje', icon: '🅺', level: 40 },
    { name: 'Bash', category: 'Lenguaje', icon: '🔧', level: 40 },
    { name: 'PowerShell', category: 'Lenguaje', icon: '🖥️', level: 40 },
    { name: 'SQL Server', category: 'Base de datos', icon: '🗄️', level: 70 },
    { name: 'MySQL', category: 'Base de datos', icon: '🐬', level: 70 },
    { name: 'Supabase', category: 'Base de datos', icon: '⚡️', level: 50 },
    { name: 'MongoDB', category: 'Base de datos', icon: '🍃', level: 50 },
    { name: 'Redis', category: 'Base de datos', icon: '🔴', level: 50 },
    { name: 'Git', category: 'DevOps', icon: '🐈‍⬛', level: 65 },
    { name: 'Docker', category: 'DevOps', icon: '🐳', level: 40 },
    { name: 'Linux', category: 'DevOps', icon: '🐧', level: 40 },
    { name: 'Render', category: 'Cloud', icon: '🚀', level: 60 },
    { name: 'Scikit-learn', category: 'IA', icon: '📚', level: 50 },
    { name: 'Pandas', category: 'IA', icon: '🐼', level: 50 },
    { name: 'Postman', category: 'Herramientas', icon: '🧪', level: 50 },
    { name: 'Cisco Packet Tracer', category: 'Herramientas', icon: '🌐', level: 40 },
    { name: 'JUnit', category: 'Herramientas', icon: '𝐉', level: 50 },
];
