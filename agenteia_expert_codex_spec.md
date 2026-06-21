# Proyecto: AgenteIA Expert — Equipo Autónomo de Agentes con Scrum Diario por Telegram

## 1. Objetivo del proyecto

Construir una plataforma inicial en Ubuntu Server donde un agente principal llamado **AgenteIA Expert** pueda crear, configurar, coordinar y supervisar equipos de agentes especializados.

El primer caso de uso será permitir que Mauro solicite la creación de un equipo de 3 agentes:

1. **DesarrolladorFullStack**
2. **DevOpsArquitectoSoluciones**
3. **ScrumMasterProjectManager**

Cada agente debe tener:

- Un espacio de trabajo personal.
- Un espacio de trabajo compartido con el resto del equipo.
- Su propio chatbot vía Telegram.
- Skills, tools, plugins, MCP servers o capacidades necesarias según su rol.
- Capacidad de participar en reuniones diarias de lunes a viernes de 09:00 a 10:00.
- Capacidad de dejar trazabilidad completa de decisiones, tareas, bloqueos y acuerdos.

La reunión diaria debe ocurrir en un grupo de Telegram donde participen Mauro y los agentes. El diálogo debe quedar registrado y documentado como si fuera una ceremonia Scrum real.

---

## 2. Principios de arquitectura

Implementar el sistema usando una arquitectura limpia, modular y mantenible.

### Patrones obligatorios

- **Service Layer**
- **Repository Pattern**
- **Adapter Pattern** para canales externos como Telegram, WhatsApp o Web.
- **Agent Orchestrator** para coordinar agentes.
- **Tool Registry** para registrar herramientas, MCP servers y permisos.
- **Workspace Manager** para separar archivos personales y compartidos.
- **Event Log / Audit Log** para trazabilidad.
- **Scheduler Service** para reuniones automáticas.
- **Memory Layer** para memoria de corto, mediano y largo plazo.

### Principios de seguridad

- Ningún agente debe ejecutar comandos arbitrarios sin política de autorización.
- Las herramientas deben estar registradas explícitamente.
- Cada agente debe operar con permisos mínimos.
- Las credenciales deben vivir en `.env`, nunca hardcodeadas.
- Los logs deben separar:
  - eventos operativos,
  - prompts,
  - outputs,
  - errores,
  - decisiones,
  - ejecución de tools.

---

## 3. Stack técnico sugerido

### Backend

- Python 3.11+
- FastAPI
- Pydantic v2
- SQLAlchemy
- PostgreSQL
- Redis
- APScheduler o Celery Beat
- Docker + Docker Compose
- LiteLLM como gateway de modelos
- LangGraph o implementación propia simple de orquestación
- python-telegram-bot o aiogram

### Persistencia

- PostgreSQL:
  - agentes,
  - equipos,
  - reuniones,
  - mensajes,
  - tareas,
  - tools,
  - workspaces,
  - auditoría.
- Redis:
  - estado temporal de conversaciones,
  - locks de reuniones,
  - cache semántica futura.
- Sistema de archivos:
  - workspace personal de cada agente,
  - workspace compartido por equipo.

### Modelos LLM

Diseñar para soportar proveedores múltiples:

- OpenAI-compatible APIs
- LiteLLM Proxy
- LM Studio local
- Ollama local
- OpenRouter
- Anthropic-compatible vía LiteLLM si aplica

No acoplar la lógica de negocio a un proveedor específico.

---

## 4. Estructura inicial de repositorio

Crear esta estructura:

```txt
agenteia-expert/
├── README.md
├── .env.example
├── docker-compose.yml
├── Dockerfile
├── Makefile
├── pyproject.toml
├── scripts/
│   ├── setup_ubuntu.sh
│   ├── init_db.sh
│   └── create_telegram_webhook.sh
├── app/
│   ├── main.py
│   ├── core/
│   │   ├── config.py
│   │   ├── logging.py
│   │   ├── security.py
│   │   └── exceptions.py
│   ├── db/
│   │   ├── session.py
│   │   ├── base.py
│   │   └── migrations/
│   ├── models/
│   │   ├── agent.py
│   │   ├── team.py
│   │   ├── workspace.py
│   │   ├── meeting.py
│   │   ├── task.py
│   │   ├── message.py
│   │   └── tool.py
│   ├── schemas/
│   │   ├── agent_schema.py
│   │   ├── team_schema.py
│   │   ├── meeting_schema.py
│   │   └── task_schema.py
│   ├── repositories/
│   │   ├── agent_repository.py
│   │   ├── team_repository.py
│   │   ├── meeting_repository.py
│   │   ├── task_repository.py
│   │   ├── message_repository.py
│   │   └── workspace_repository.py
│   ├── services/
│   │   ├── agent_factory_service.py
│   │   ├── agent_runtime_service.py
│   │   ├── team_service.py
│   │   ├── meeting_service.py
│   │   ├── scrum_service.py
│   │   ├── scheduler_service.py
│   │   ├── workspace_service.py
│   │   ├── memory_service.py
│   │   ├── llm_service.py
│   │   └── tool_registry_service.py
│   ├── agents/
│   │   ├── base_agent.py
│   │   ├── agenteia_expert.py
│   │   ├── desarrollador_fullstack.py
│   │   ├── devops_arquitecto.py
│   │   └── scrum_master_pm.py
│   ├── channels/
│   │   ├── telegram/
│   │   │   ├── bot_adapter.py
│   │   │   ├── group_adapter.py
│   │   │   ├── router.py
│   │   │   └── handlers.py
│   │   └── web/
│   │       └── placeholder.py
│   ├── tools/
│   │   ├── base_tool.py
│   │   ├── shell_tool.py
│   │   ├── git_tool.py
│   │   ├── file_tool.py
│   │   ├── docker_tool.py
│   │   ├── mcp_registry.py
│   │   └── tool_policy.py
│   ├── prompts/
│   │   ├── agenteia_expert.md
│   │   ├── desarrollador_fullstack.md
│   │   ├── devops_arquitecto.md
│   │   ├── scrum_master_pm.md
│   │   └── meeting_facilitator.md
│   └── api/
│       ├── health.py
│       ├── agents.py
│       ├── teams.py
│       ├── meetings.py
│       └── tasks.py
├── workspaces/
│   ├── shared/
│   └── agents/
│       ├── agenteia_expert/
│       ├── desarrollador_fullstack/
│       ├── devops_arquitecto/
│       └── scrum_master_pm/
└── tests/
    ├── test_agent_factory.py
    ├── test_scrum_meeting.py
    ├── test_workspace_service.py
    └── test_telegram_adapter.py
```

---

## 5. Entidades principales

### Agent

Campos mínimos:

```txt
id
name
slug
role
description
system_prompt
telegram_bot_token_env_name
workspace_path
shared_workspace_path
llm_model
llm_provider
status
created_at
updated_at
```

### Team

```txt
id
name
description
owner_user_id
telegram_group_id
shared_workspace_path
created_at
updated_at
```

### Meeting

```txt
id
team_id
title
meeting_type
scheduled_start
scheduled_end
status
telegram_group_id
summary_path
created_at
updated_at
```

### MeetingMessage

```txt
id
meeting_id
agent_id nullable
speaker_name
message_text
message_type
created_at
```

### Task

```txt
id
team_id
assigned_to_agent_id
created_by_agent_id
title
description
status
priority
due_date
source_meeting_id
created_at
updated_at
```

### Tool

```txt
id
name
description
tool_type
required_role
enabled
config_json
created_at
updated_at
```

---

## 6. Comportamiento del AgenteIA Expert

El agente **AgenteIA Expert** será el agente raíz del sistema.

Debe poder:

1. Interpretar solicitudes de Mauro para crear equipos de agentes.
2. Crear definiciones de agentes.
3. Asignar roles, prompts, herramientas y workspaces.
4. Registrar agentes en base de datos.
5. Crear carpetas personales y compartidas.
6. Asociar cada agente a su bot de Telegram.
7. Asociar el equipo a un grupo de Telegram.
8. Programar reuniones Scrum.
9. Validar que cada agente tenga las tools mínimas para cumplir su rol.
10. Supervisar la reunión diaria.
11. Exigir que se documenten acuerdos, tareas y bloqueos.
12. Generar resumen final de cada reunión.
13. Guardar la minuta en el workspace compartido.
14. Registrar todas las acciones en audit log.

---

## 7. Roles iniciales de agentes

### 7.1 DesarrolladorFullStack

Responsabilidades:

- Diseñar e implementar backend.
- Diseñar endpoints FastAPI.
- Trabajar con modelos SQLAlchemy.
- Implementar integraciones.
- Crear tests.
- Revisar bugs.
- Documentar decisiones técnicas.

Tools iniciales:

- FileTool
- GitTool
- ShellTool con permisos restringidos
- DockerTool con permisos restringidos
- LLMTool
- CodeReviewTool futuro

Prompt base:

```md
Eres DesarrolladorFullStack, miembro de un equipo de agentes autónomos.
Tu objetivo es implementar funcionalidades de backend, APIs, integraciones y pruebas.
Debes comunicar avances, bloqueos y próximos pasos en lenguaje técnico claro.
No ejecutes acciones destructivas sin autorización explícita.
Cada propuesta debe incluir archivos afectados, riesgos y criterios de aceptación.
```

---

### 7.2 DevOpsArquitectoSoluciones

Responsabilidades:

- Diseñar arquitectura de despliegue.
- Mantener Docker Compose.
- Preparar configuración para Ubuntu Server.
- Diseñar observabilidad.
- Revisar seguridad.
- Proponer CI/CD.
- Gestionar configuración de LiteLLM, Redis y PostgreSQL.
- Evaluar MCP servers necesarios.

Tools iniciales:

- FileTool
- GitTool
- ShellTool con permisos restringidos
- DockerTool
- LogTool futuro
- InfraReviewTool futuro

Prompt base:

```md
Eres DevOpsArquitectoSoluciones, miembro de un equipo de agentes autónomos.
Tu objetivo es diseñar infraestructura segura, reproducible y observable.
Debes priorizar Docker, Docker Compose, variables de entorno, logs, healthchecks y despliegue en Ubuntu Server.
Cada propuesta debe incluir impacto, comandos sugeridos, riesgos y rollback.
No ejecutes comandos destructivos sin autorización explícita.
```

---

### 7.3 ScrumMasterProjectManager

Responsabilidades:

- Facilitar reuniones.
- Solicitar actualización a cada agente.
- Detectar bloqueos.
- Transformar conversación en tareas.
- Asignar responsables.
- Generar minuta diaria.
- Mantener backlog.
- Cerrar la reunión con acuerdos claros.

Tools iniciales:

- MeetingTool
- TaskTool
- FileTool
- TelegramGroupTool
- SummaryTool

Prompt base:

```md
Eres ScrumMasterProjectManager, facilitador del equipo de agentes.
Tu objetivo es coordinar reuniones, ordenar prioridades, detectar bloqueos y generar tareas claras.
Durante la daily debes pedir a cada agente:
1. Qué hizo.
2. Qué hará.
3. Qué bloqueos tiene.
4. Qué necesita del resto del equipo.
Al final debes generar una minuta con acuerdos, tareas, responsables y riesgos.
```

---

## 8. Flujo de creación de equipo

Ejemplo de conversación esperada:

```txt
Mauro:
Hola AgenteIA Expert, necesito crear un equipo de 3 agentes:
1. DesarrolladorFullStack
2. DevOps Arquitecto de Soluciones
3. Scrum Master - Project Manager

Cada uno debe tener workspace personal, workspace compartido, chatbot Telegram individual y reunión diaria de lunes a viernes de 09:00 a 10:00 en un grupo Telegram.
```

Flujo esperado:

```txt
1. AgenteIA Expert recibe solicitud.
2. Valida roles solicitados.
3. Crea Team.
4. Crea Agent records.
5. Crea workspaces.
6. Asigna prompts base.
7. Asigna tools por rol.
8. Solicita o valida tokens Telegram.
9. Registra grupo Telegram del equipo.
10. Programa daily Scrum.
11. Genera resumen de configuración.
12. Confirma equipo listo.
```

---

## 9. Reunión diaria automática

### Reglas

- Días: lunes a viernes.
- Hora: 09:00 a 10:00.
- Zona horaria: America/Santiago.
- Canal: grupo Telegram del equipo.
- Participantes:
  - Mauro
  - AgenteIA Expert
  - DesarrolladorFullStack
  - DevOpsArquitectoSoluciones
  - ScrumMasterProjectManager

### Secuencia de la reunión

```txt
09:00 - ScrumMasterProjectManager abre la reunión.
09:02 - Lee el desafío actual de Mauro.
09:05 - Pregunta al DesarrolladorFullStack.
09:15 - Pregunta al DevOpsArquitectoSoluciones.
09:25 - Pregunta al AgenteIA Expert.
09:35 - Debate controlado entre agentes.
09:50 - ScrumMasterProjectManager genera acuerdos y tareas.
09:55 - AgenteIA Expert valida si faltan tools, skills o permisos.
10:00 - Se publica minuta final en Telegram y se guarda en workspace compartido.
```

### Salida esperada en Telegram

```md
# Daily Scrum — YYYY-MM-DD

## Desafío actual
...

## Participantes
- Mauro
- AgenteIA Expert
- DesarrolladorFullStack
- DevOpsArquitectoSoluciones
- ScrumMasterProjectManager

## Avances
...

## Bloqueos
...

## Decisiones
...

## Tareas asignadas
| Tarea | Responsable | Prioridad | Fecha |
|---|---|---|---|

## Riesgos
...

## Próximos pasos
...
```

---

## 10. Workspaces

Cada agente debe tener su propio espacio:

```txt
workspaces/agents/<agent_slug>/
├── memory.md
├── notes.md
├── tasks.md
├── decisions.md
├── tools.md
└── artifacts/
```

Cada proyecto debe tener un espacio compartido. Cada reunión debe conservar sus
participantes y minuta en una carpeta propia:

```txt
workspaces/shared/<project_slug>/
├── README.md
├── backlog.md
├── meetings/
│   └── YYYY-MM-DD_HH-mm--<meeting_slug>/
│       ├── participantes.md
│       └── minuta.md
├── decisions/
├── architecture/
├── tasks/
└── artifacts/
```

Ejemplo:

```txt
workspaces/shared/agenteia-expert/meetings/2026-06-21_09-00--daily-scrum/
├── participantes.md
└── minuta.md
```

Reglas de nombres:

- `project_slug` y `meeting_slug` deben usar minúsculas, números y guiones.
- La fecha y hora deben usar `YYYY-MM-DD_HH-mm` en `America/Santiago`.
- No usar `:` en nombres de archivos o carpetas para mantener compatibilidad
  entre Ubuntu, Windows y volúmenes Docker.
- `participantes.md` registra identidad, rol, asistencia y canal de cada
  participante.
- `minuta.md` contiene desafío, avances, bloqueos, decisiones, tareas, riesgos
  y próximos pasos.

Reglas:

- Los agentes pueden escribir en su workspace personal.
- Todos los agentes asignados al proyecto pueden leer su workspace compartido.
- Solo ScrumMasterProjectManager y AgenteIA Expert pueden cerrar minutas oficiales.
- Una minuta cerrada no se sobrescribe; cualquier corrección crea una nueva
  versión auditada.
- Las decisiones arquitectónicas deben guardarse como ADRs en `architecture/adr-XXXX.md`.

---

## 11. Telegram

### Requisitos

Cada agente tendrá su propio bot token:

```env
TELEGRAM_BOT_TOKEN_AGENTEIA_EXPERT=
TELEGRAM_BOT_TOKEN_FULLSTACK=
TELEGRAM_BOT_TOKEN_DEVOPS=
TELEGRAM_BOT_TOKEN_SCRUM=
TELEGRAM_GROUP_ID_MAIN=
```

### Modo inicial recomendado

Para el MVP usar polling en vez de webhook.

Motivo:

- Más simple para desarrollo local.
- Menos configuración inicial.
- Evita depender de dominio HTTPS al comienzo.

Luego migrar a webhook con Caddy/Nginx.

### Comandos mínimos

```txt
/start
/help
/status
/workspace
/tasks
/daily
/create_team
/create_agent
/tools
```

### En grupo Telegram

El sistema debe poder publicar mensajes con identidad del agente correspondiente.

Si Telegram no permite múltiples identidades desde un único bot, usar un bot por agente. Esta será la estrategia inicial.

---

## 12. LLM Gateway

Crear una capa `LLMService` que permita cambiar modelos sin tocar la lógica del agente.

Variables sugeridas:

```env
LLM_PROVIDER=litellm
LITELLM_BASE_URL=http://localhost:4000/v1
LITELLM_API_KEY=sk-local-dev
DEFAULT_MODEL=local-qwen-fast
AGENTEIA_EXPERT_MODEL=local-qwen-reasoning
FULLSTACK_MODEL=local-qwen-coder
DEVOPS_MODEL=local-qwen-coder
SCRUM_MODEL=local-qwen-fast
```

Contrato mínimo:

```python
class LLMService:
    async def chat(self, agent_slug: str, messages: list[dict], tools: list | None = None) -> str:
        ...
```

---

## 13. Scheduler

Implementar `SchedulerService` con APScheduler.

Debe cargar reuniones activas desde base de datos al iniciar.

Configuración de daily:

```txt
FREQ=WEEKLY
BYDAY=MO,TU,WE,TH,FR
START=09:00
END=10:00
TIMEZONE=America/Santiago
```

Pseudocódigo:

```python
scheduler.add_job(
    meeting_service.run_daily_scrum,
    trigger="cron",
    day_of_week="mon-fri",
    hour=9,
    minute=0,
    timezone="America/Santiago",
    args=[team_id],
)
```

---

## 14. Motor de reunión entre agentes

Implementar `MeetingService.run_daily_scrum(team_id)`.

Flujo interno:

```txt
1. Crear registro Meeting.
2. Publicar apertura en Telegram.
3. Cargar contexto:
   - desafío actual,
   - backlog,
   - últimas minutas,
   - tareas abiertas,
   - bloqueos.
4. Invocar ScrumMasterProjectManager.
5. Invocar cada agente por turno.
6. Permitir una ronda de debate.
7. Generar minuta.
8. Crear tareas.
9. Guardar todo en DB.
10. Guardar markdown en workspace compartido.
11. Publicar resumen final en Telegram.
```

Los agentes no deben hablar todos al mismo tiempo. La orquestación debe ser secuencial para el MVP.

---

## 15. Tools y políticas

Crear tools como clases desacopladas.

Contrato base:

```python
class BaseTool:
    name: str
    description: str

    async def run(self, input: dict, context: dict) -> dict:
        raise NotImplementedError
```

### ToolPolicy

Debe validar:

- agente solicitante,
- rol,
- tool solicitada,
- acción,
- workspace permitido,
- si requiere aprobación humana.

Ejemplo:

```yaml
policies:
  DesarrolladorFullStack:
    allow:
      - file.read
      - file.write_own_workspace
      - git.status
      - git.diff
    require_approval:
      - shell.run
      - docker.compose_up

  DevOpsArquitectoSoluciones:
    allow:
      - file.read
      - file.write_own_workspace
      - file.write_shared_workspace
      - git.status
      - docker.logs
    require_approval:
      - shell.run
      - docker.compose_down

  ScrumMasterProjectManager:
    allow:
      - task.create
      - task.update
      - meeting.summarize
      - telegram.post_group
    require_approval: []
```

---

## 16. Memoria

Implementar memoria en 3 niveles:

### Memoria corta

- Mensajes recientes de conversación.
- Estado temporal en Redis.

### Memoria media

- Minutas recientes.
- Tareas abiertas.
- Decisiones activas.
- Guardado en PostgreSQL.

### Memoria larga

- `memory.md` de cada agente.
- ADRs.
- Documentos oficiales.
- Backlog histórico.
- Posible vector DB futura.

Para el MVP, no implementar vector DB todavía. Dejar interfaz preparada:

```python
class MemoryService:
    async def get_context_for_agent(self, agent_slug: str, team_id: str) -> dict:
        ...

    async def save_agent_memory(self, agent_slug: str, content: str) -> None:
        ...
```

---

## 17. Observabilidad

Implementar logs estructurados en JSON.

Eventos mínimos:

```txt
agent.created
team.created
workspace.created
telegram.message.received
telegram.message.sent
meeting.started
meeting.agent_turn.started
meeting.agent_turn.completed
meeting.completed
task.created
tool.requested
tool.approved
tool.rejected
llm.request.started
llm.request.completed
llm.error
```

Cada log debe incluir:

```txt
timestamp
event_name
agent_slug
team_id
meeting_id
trace_id
status
metadata
```

---

## 18. Docker Compose inicial

Servicios:

```yaml
services:
  api:
    build: .
    env_file:
      - .env
    ports:
      - "8080:8080"
    volumes:
      - ./workspaces:/app/workspaces
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: agenteia
      POSTGRES_PASSWORD: agenteia
      POSTGRES_DB: agenteia
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

---

## 19. Dockerfile recomendado

Usar multi-stage build.

```dockerfile
FROM python:3.11-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml ./
RUN pip install --upgrade pip && pip install poetry

COPY . .
RUN poetry export -f requirements.txt --output requirements.txt --without-hashes

FROM python:3.11-slim AS runtime

WORKDIR /app

RUN useradd -m appuser

COPY --from=builder /app/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 8080

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
```

---

## 20. Variables `.env.example`

```env
APP_ENV=development
APP_HOST=0.0.0.0
APP_PORT=8080
LOG_LEVEL=INFO

DATABASE_URL=postgresql+asyncpg://agenteia:agenteia@postgres:5432/agenteia
REDIS_URL=redis://redis:6379/0

TIMEZONE=America/Santiago

LLM_PROVIDER=litellm
LITELLM_BASE_URL=http://host.docker.internal:4000/v1
LITELLM_API_KEY=sk-local-dev
DEFAULT_MODEL=local-qwen-fast

AGENTEIA_EXPERT_MODEL=local-qwen-reasoning
FULLSTACK_MODEL=local-qwen-coder
DEVOPS_MODEL=local-qwen-coder
SCRUM_MODEL=local-qwen-fast

TELEGRAM_BOT_TOKEN_AGENTEIA_EXPERT=
TELEGRAM_BOT_TOKEN_FULLSTACK=
TELEGRAM_BOT_TOKEN_DEVOPS=
TELEGRAM_BOT_TOKEN_SCRUM=
TELEGRAM_GROUP_ID_MAIN=

WORKSPACE_ROOT=/app/workspaces
```

---

## 21. API mínima

Crear endpoints:

```txt
GET  /health
POST /agents
GET  /agents
GET  /agents/{agent_id}
POST /teams
GET  /teams
POST /teams/{team_id}/daily
POST /teams/{team_id}/meetings/run-now
GET  /meetings/{meeting_id}
GET  /tasks
POST /tasks
PATCH /tasks/{task_id}
```

---

## 22. Criterios de aceptación del MVP

El MVP se considera listo cuando:

1. `docker compose up -d` levanta API, PostgreSQL y Redis.
2. `/health` responde OK.
3. Se puede crear un equipo desde endpoint o comando Telegram.
4. Se crean los 4 agentes iniciales:
   - AgenteIA Expert
   - DesarrolladorFullStack
   - DevOpsArquitectoSoluciones
   - ScrumMasterProjectManager
5. Se crean workspaces personales.
6. Se crea workspace compartido.
7. Se puede enviar mensaje a cada agente por Telegram.
8. Se puede enviar mensaje al grupo de Telegram.
9. El scheduler ejecuta una daily manual con `/daily` o endpoint `run-now`.
10. La reunión genera:
    - mensajes en Telegram,
    - registros en DB,
    - minuta markdown,
    - tareas asignadas.
11. Los logs muestran trazabilidad por `trace_id`.

---

## 23. Prompt para Codex

Usa este prompt como instrucción principal para Codex:

```md
Actúa como un Senior Python Backend Engineer, Cloud MLOps Engineer y Arquitecto de Sistemas Multiagente.

Necesito que inicialices un proyecto llamado `agenteia-expert` en un servidor Ubuntu nuevo.

El objetivo es construir una plataforma de agentes autónomos donde un agente raíz llamado `AgenteIA Expert` pueda crear, configurar y coordinar equipos de agentes especializados.

Implementa un MVP funcional con:

- FastAPI.
- PostgreSQL.
- Redis.
- Docker Compose.
- SQLAlchemy async.
- Pydantic v2.
- APScheduler.
- Integración Telegram usando polling para desarrollo.
- Service Layer.
- Repository Pattern.
- Agentes desacoplados de los canales.
- Workspaces por agente y workspace compartido.
- Scheduler para Daily Scrum de lunes a viernes 09:00 a 10:00 America/Santiago.
- Reunión manual ejecutable vía endpoint y comando Telegram.
- LLMService compatible con LiteLLM/OpenAI-compatible API.
- ToolRegistry básico.
- ToolPolicy básico.
- Logs estructurados en JSON.

Crea la estructura de carpetas indicada en este documento.

Primera meta:
1. Crear scaffolding completo.
2. Crear modelos SQLAlchemy.
3. Crear repositorios.
4. Crear servicios principales.
5. Crear agentes iniciales:
   - AgenteIA Expert.
   - DesarrolladorFullStack.
   - DevOpsArquitectoSoluciones.
   - ScrumMasterProjectManager.
6. Crear prompts markdown para cada agente.
7. Crear Dockerfile multi-stage.
8. Crear docker-compose.yml.
9. Crear .env.example.
10. Crear endpoints mínimos.
11. Crear comando para ejecutar daily manual.
12. Crear README con instrucciones de instalación en Ubuntu.

Restricciones:
- No hardcodear tokens.
- No ejecutar comandos destructivos.
- No acoplar lógica de agentes directamente a Telegram.
- No depender de un proveedor LLM específico.
- Todo debe ser editable en vi/vim.
- Todo debe estar preparado para correr en Ubuntu Server.

Prioriza código simple, funcional y extensible antes que abstracciones innecesarias.

Al finalizar, muestra:
- árbol de archivos creado,
- comandos para levantar el proyecto,
- cómo configurar Telegram,
- cómo configurar LiteLLM,
- cómo probar la daily manual,
- próximos pasos recomendados.
```

---

## 24. Comandos esperados para Ubuntu

```bash
sudo apt update
sudo apt install -y git curl ca-certificates docker.io docker-compose-plugin

sudo usermod -aG docker ${USER}
newgrp docker

git clone <REPO_URL> agenteia-expert
cd agenteia-expert

cp .env.example .env
vi .env

docker compose up -d --build

curl http://localhost:8080/health
```

---

## 25. Roadmap posterior al MVP

### Fase 1 — MVP local

- API funcional.
- Telegram polling.
- Daily manual.
- Workspaces.
- Minutas markdown.
- Tareas básicas.

### Fase 2 — Daily automática

- Scheduler persistente.
- Daily real lunes a viernes.
- Reintentos.
- Logs robustos.
- Estado de reuniones.

### Fase 3 — Herramientas reales

- GitTool.
- FileTool.
- DockerTool.
- ShellTool con aprobación humana.
- MCP registry.
- Tool audit.

### Fase 4 — Memoria avanzada

- Vector DB.
- Embeddings.
- Recuperación semántica.
- Memoria por agente.
- Memoria compartida por equipo.

### Fase 5 — Canales adicionales

- Web UI.
- WhatsApp.
- Dashboard operativo.
- Streaming de respuestas.

### Fase 6 — Evaluación y calidad

- Tests de agentes.
- Evaluación de reuniones.
- Métricas de productividad.
- Detección de alucinaciones.
- MLflow para evaluación de prompts/modelos.

---

## 26. Consideraciones importantes

Este proyecto debe construirse primero como una plataforma controlada y observable, no como agentes completamente libres.

La prioridad inicial es:

1. Crear agentes.
2. Coordinar conversaciones.
3. Registrar trazabilidad.
4. Generar tareas.
5. Ejecutar ceremonias Scrum.
6. Mantener separación clara de responsabilidades.

La autonomía real debe aumentar gradualmente cuando existan:

- logs,
- permisos,
- auditoría,
- rollback,
- aprobaciones humanas,
- tests,
- sandboxing de tools.
