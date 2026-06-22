const AGENTS = [
  {
    id: "agentia-expert",
    name: "AgenteIA Expert",
    role: "Creador y coordinador de agentes",
    icon: "🧠",
    status: "online",
    workspace: "/workspace/agents/agentia-expert",
    skills: ["Agent Factory", "MCP", "Tools", "RAG"]
  },
  {
    id: "fullstack",
    name: "DesarrolladorFullStack",
    role: "Construye frontend, backend, APIs y bots Telegram.",
    icon: "💻",
    status: "online",
    workspace: "/workspace/agents/fullstack",
    skills: ["FastAPI", "React", "Node", "Telegram"]
  },
  {
    id: "devops",
    name: "DevOps Arquitecto",
    role: "Diseña infraestructura, Docker, CI/CD y observabilidad.",
    icon: "🛠️",
    status: "online",
    workspace: "/workspace/agents/devops",
    skills: ["Docker", "Nginx", "CI/CD", "Logs"]
  },
  {
    id: "scrum",
    name: "Scrum Master",
    role: "Facilita daily, documenta acuerdos y asigna actividades.",
    icon: "📋",
    status: "online",
    workspace: "/workspace/agents/scrum-master",
    skills: ["Scrum", "Planning", "Backlog", "Reportes"]
  }
];

const DAILY_MESSAGES = [
  {
    agent: "Scrum Master",
    time: "09:00",
    icon: "📋",
    text: "Inicio Daily Scrum. Objetivo del día: levantar el portal de agentes con mock data, arquitectura base y registro del diálogo en Telegram."
  },
  {
    agent: "AgenteIA Expert",
    time: "09:08",
    icon: "🧠",
    text: "Validaré que cada agente tenga workspace, skills mínimos, configuración de modelo y herramientas MCP necesarias para operar."
  },
  {
    agent: "DesarrolladorFullStack",
    time: "09:21",
    icon: "💻",
    text: "Crearé la interfaz del portal, componentes para tarjetas de agentes, timeline de reunión y panel de tareas."
  },
  {
    agent: "DevOps Arquitecto",
    time: "09:34",
    icon: "🛠️",
    text: "Prepararé Docker Compose, variables .env, estructura de logs y healthchecks para el despliegue inicial en Ubuntu."
  }
];

const TASKS = [
  { title: "Portal web inicial", owner: "DesarrolladorFullStack", state: "En progreso" },
  { title: "Dockerización base", owner: "DevOps Arquitecto", state: "Pendiente" },
  { title: "Acta Daily Scrum", owner: "Scrum Master", state: "Documentado" },
  { title: "Skill registry", owner: "AgenteIA Expert", state: "En análisis" }
];
