# Agent-Team-OnDemand

Plataforma para crear, configurar y coordinar equipos de agentes autónomos bajo
la supervisión del agente principal **AgenteIA Expert**.

La definición funcional y arquitectónica está en
[`agenteia_expert_codex_spec.md`](./agenteia_expert_codex_spec.md).

## LLM oficial del proyecto

El backend consumirá directamente el gateway OpenAI-compatible de IAmiko:

| Parámetro | Valor |
|---|---|
| Base URL | `https://ia.iamiko.cl/v1` |
| Modelo | `auto-hermes` |
| Protocolo | OpenAI-compatible API |
| Autenticación | `Authorization: Bearer <API_KEY>` |

Esta configuración aplica inicialmente a **AgenteIA Expert** y a los agentes
especializados. `LLMService` debe conservar su interfaz desacoplada para permitir
modelos distintos por agente en el futuro.

### Variables de entorno

```env
LLM_PROVIDER=openai_compatible
LLM_BASE_URL=https://ia.iamiko.cl/v1
LLM_API_KEY=
DEFAULT_MODEL=auto-hermes

AGENTEIA_EXPERT_MODEL=auto-hermes
FULLSTACK_MODEL=auto-hermes
DEVOPS_MODEL=auto-hermes
SCRUM_MODEL=auto-hermes
```

No guardar `LLM_API_KEY` en Git, base de datos, prompts ni logs. El dashboard
solo debe mostrar estado de configuración; nunca el valor del secreto.

### Validación del gateway

Listar modelos disponibles:

```bash
curl --fail-with-body \
  -H "Authorization: Bearer ${LLM_API_KEY}" \
  "${LLM_BASE_URL}/models"
```

Probar `auto-hermes`:

```bash
curl --fail-with-body \
  -H "Authorization: Bearer ${LLM_API_KEY}" \
  -H "Content-Type: application/json" \
  "${LLM_BASE_URL}/chat/completions" \
  -d '{
    "model": "auto-hermes",
    "messages": [{"role": "user", "content": "Responde exactamente: OK"}],
    "temperature": 0,
    "max_tokens": 8
  }'
```

Verificación realizada el **2026-06-21**:

- `GET /v1/models`: autenticación requerida y respuesta correcta con API key.
- `auto-hermes`: publicado en el catálogo.
- `POST /v1/chat/completions`: respuesta correcta usando `auto-hermes`.

La disponibilidad del endpoint y el catálogo de modelos deben verificarse en
cada despliegue mediante un healthcheck; no deben asumirse como estado permanente.

## Baseline remoto de Hermes

Instalación validada el **2026-06-21**:

| Parámetro | Estado |
|---|---|
| Host | `mauro@192.168.1.38` (`DellVostro`) |
| Proyecto | `/home/mauro/Dev/Agent-Team-OnDemand` |
| Hermes | `v0.17.0` |
| Python administrado por Hermes | `3.11.15` |
| Modelo común | `auto-hermes` |
| Gateway LLM | `https://ia.iamiko.cl/v1` |
| Zona horaria | `America/Santiago` |
| Aprobaciones | `manual` |

Profiles disponibles:

| Profile Hermes | Agente de dominio | Alias CLI |
|---|---|---|
| `default` | AgenteIA Expert | `agenteia` |
| `fullstack` | DesarrolladorFullStack | `fullstack` |
| `devops` | DevOpsArquitectoSoluciones | `devops` |
| `scrum` | ScrumMasterProjectManager | `scrum` |

Los cuatro profiles fueron probados contra `auto-hermes`. Los archivos de
configuración que contienen credenciales tienen permisos `600` y propietario
`mauro:mauro`.

Comandos operacionales:

```bash
ssh mauro@192.168.1.38
export PATH="$HOME/.local/bin:$PATH"

hermes --version
hermes profile list
agenteia chat
fullstack chat
devops chat
scrum chat
```

Estado pendiente:

- Gateways de mensajería detenidos hasta configurar tokens Telegram.
- Browser/Chromium de Hermes no instalado todavía.
- Falta personalizar `SOUL.md`, tools y permisos de cada profile.
- Falta asociar workspaces personales y compartidos del proyecto.
- Falta instalar servicios `systemd --user` para operación persistente.
