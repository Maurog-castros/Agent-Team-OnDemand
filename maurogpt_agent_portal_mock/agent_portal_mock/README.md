# MauroGPT Plus · Agent Portal Mock

Portal frontend estático inspirado en la imagen de referencia, pensado como dashboard inicial para el proyecto **Agent-Team-OnDemand**.

## Contenido

- `index.html`: estructura del portal.
- `styles.css`: diseño visual dark, sidebar, hero, tarjetas y paneles.
- `mock-data.js`: agentes, mensajes Daily Scrum y tareas simuladas.
- `app.js`: render dinámico e interacción básica del prompt.

## Cómo ejecutarlo

Desde la carpeta del proyecto:

```bash
python3 -m http.server 8080
```

Luego abre:

```txt
http://localhost:8080
```

## Integración futura sugerida

Este mock puede conectarse luego a:

- FastAPI backend.
- WebSocket para streaming de conversaciones.
- Telegram Bot API.
- Scheduler para Daily Scrum.
- Base de datos PostgreSQL para logs, workspaces, tareas y memoria.
- AgenteIA Expert como orchestrator.
