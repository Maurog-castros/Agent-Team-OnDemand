# AgenteIA Expert — Portal

Portal React/Vite para el control plane. Ocho vistas: chat, dashboard, agentes,
workspaces, reuniones, tareas, herramientas/políticas y sistema/observabilidad.

## Desarrollo

```bash
cd agenteia-expert/frontend
npm install
npm run dev
```

Abrir `http://localhost:5173`. Las peticiones a `/api/*` se proxean a FastAPI
en `http://localhost:8080` (levantar la API por separado o con Docker Compose).

## Calidad

```bash
npm run lint
npm run test
npm run build
```

## Producción (Docker)

```bash
cd agenteia-expert
docker compose up --build portal api
```

Portal: `http://localhost:8081` · API: `http://localhost:8080/health`

## Seguridad UI

- Sin `innerHTML` ni `dangerouslySetInnerHTML` con datos de usuario o API.
- Chat conversacional separado del timeline de reuniones.
- La API key LLM nunca se muestra en el dashboard.

## IDs de agente

| ID | Agente |
|---|---|
| `agenteia_expert` | AgenteIA Expert |
| `desarrollador_fullstack` | Desarrollador FullStack |
| `devops_arquitecto` | DevOps Arquitecto Soluciones |
| `scrum_master_pm` | Scrum Master / PM |

## K3s

Manifiestos en [`../k8s/`](../k8s/):

```bash
kubectl apply -f k8s/api.yaml
kubectl apply -f k8s/portal.yaml
```

Verificar health checks:

```bash
kubectl get pods
curl -f http://agenteia.local/api/health
```
