# AgenteIA Expert

Control plane para administrar agentes Hermes, equipos, workspaces, reuniones y
tools. El portal web usará esta API como fuente de verdad; Hermes permanece como
runtime desacoplado mediante un adapter.

## Estado

Primera fase: scaffold backend ejecutable con FastAPI, PostgreSQL, Redis,
SQLAlchemy async y contratos para agentes, tools, canales y reuniones.

## Inicio local

```bash
cp .env.example .env
docker compose up --build
curl http://localhost:8080/health
```

La documentación OpenAPI queda disponible en `http://localhost:8080/docs`.

## Desarrollo

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

## Límites de esta fase

- El portal React/Vite se implementará después de aprobar su concepto visual.
- Los gateways Telegram permanecen deshabilitados hasta configurar tokens.
- Las tools con efectos externos parten denegadas o requieren aprobación.
