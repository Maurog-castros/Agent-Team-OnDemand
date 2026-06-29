# AgenteIA Expert

Control plane para administrar agentes Hermes, equipos, workspaces, reuniones y
tools. El portal web usará esta API como fuente de verdad; Hermes permanece como
runtime desacoplado mediante un adapter.

## Estado

Backend ejecutable con FastAPI, PostgreSQL, Redis y portal React/Vite en
`frontend/` con ocho vistas operativas.

## Inicio local

```bash
cp .env.example .env
docker compose up --build
curl http://localhost:8080/health
curl http://localhost:8081/
```

Portal: `http://localhost:8081` · API: `http://localhost:8080/docs`

**Producción:** https://team.maurocastro.cl — ver [`deploy/DEPLOY.md`](./deploy/DEPLOY.md) y Jenkins
https://jenkins.maurocastro.cl/job/AgenteIA-Team-Deploy/

## Portal frontend

```bash
cd frontend
npm install
npm run dev
```

Ver [`frontend/README.md`](./frontend/README.md) para lint, tests, Docker y K3s.

## Desarrollo backend

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'
pytest
ruff check .
```

En Windows PowerShell use `.venv\Scripts\Activate.ps1`.

## Configuración LLM

- Base URL: `https://ia.iamiko.cl/v1`
- Modelo: `auto-hermes`
- API key: solo mediante `LLM_API_KEY`; nunca en Git, logs o base de datos.

## Límites actuales

- Chat web conectado a FastAPI (`POST /agents/{slug}/chat`) y gateway `auto-hermes`.
  Herramientas kubectl del mock demo requieren `VITE_USE_DEMO_CHAT=true` o adapter Hermes CLI.
- Los gateways Telegram permanecen deshabilitados hasta configurar tokens.
- Las tools con efectos externos parten denegadas o requieren aprobación.
