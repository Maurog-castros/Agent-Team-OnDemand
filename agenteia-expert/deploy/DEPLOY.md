# Despliegue — AgenteIA Expert → team.maurocastro.cl

Portal público: **https://team.maurocastro.cl**

Pipeline CI/CD: **https://jenkins.maurocastro.cl/job/AgenteIA-Team-Deploy/**

## Arquitectura

```
Internet
  → router DMZ (190.162.17.135:443 / :8080)
  → maurocastro-dmz-proxy (nginx)
  → host.docker.internal:8093 (portal Starlette + estáticos)
       └─ proxy /api → 127.0.0.1:8092 (FastAPI, systemd user)
```

| Componente | Ubicación | Puerto |
|------------|-----------|--------|
| Servidor producción | ZenBook `192.168.1.12` | — |
| API | `systemd --user` `agenteia-api` | `127.0.0.1:8092` |
| Portal | `systemd --user` `agenteia-portal` | `0.0.0.0:8093` |
| Proxy TLS | Docker `maurocastro-dmz-proxy` | `443` → portal |
| Jenkins | Docker `jenkins-devops` | `jenkins.maurocastro.cl` |

## Jenkins (recomendado)

### Job: `AgenteIA-Team-Deploy`

1. Checkout desde `https://github.com/Maurog-castros/Agent-Team-OnDemand.git` (rama `main`)
2. Tests opcionales (frontend en `node:22-alpine`, backend `pytest`)
3. Sync `agenteia-expert/` al host vía SSH (`jenkins` → `mauro@172.17.0.1`)
4. Ejecuta `scripts/deploy-remote.sh` en el host
5. Smoke test HTTPS en `team.maurocastro.cl`

### Instalar / actualizar el job

En el ZenBook (`192.168.1.12`):

```bash
cd ~/Dev/Agent-Team-OnDemand/agenteia-expert
chmod +x deploy/jenkins/install-job.sh
./deploy/jenkins/install-job.sh
```

Luego en Jenkins: **Build Now** (o push a `main` si configuras webhook).

### Parámetros del pipeline

| Parámetro | Default | Descripción |
|-----------|---------|-------------|
| `GIT_BRANCH` | `main` | Rama a desplegar |
| `RUN_TESTS` | `true` | Tests antes del deploy |
| `EXPAND_CERT` | `false` | Ampliar cert Let's Encrypt DMZ (solo al agregar subdominios) |

### Secretos (no en Git)

| Archivo | Dónde | Contenido |
|---------|-------|-----------|
| `.env.native` | Host `~/Dev/.../agenteia-expert/` | `LLM_API_KEY`, DB, modelos |

El pipeline **no sobrescribe** `.env.native`. Configúralo una vez en el servidor.

### Clave SSH Jenkins → host

Jenkins usa `/var/jenkins_home/.ssh/id_ed25519` (`jenkins-labfull`), ya autorizada en `~mauro/.ssh/authorized_keys`.

## Deploy manual (sin Jenkins)

### Desde tu máquina de desarrollo

```bash
rsync -az \
  --exclude node_modules --exclude .venv --exclude '/data' \
  --exclude 'frontend/dist' --exclude '.git' --exclude '*.db' \
  ~/Dev/Agent-Team-OnDemand/agenteia-expert/ \
  mauro@192.168.1.12:~/Dev/Agent-Team-OnDemand/agenteia-expert/

ssh mauro@192.168.1.12 \
  '~/Dev/Agent-Team-OnDemand/agenteia-expert/scripts/deploy-remote.sh'
```

### En el servidor

```bash
cd ~/Dev/Agent-Team-OnDemand/agenteia-expert
./scripts/deploy-remote.sh
```

Variables útiles:

```bash
SKIP_CERT_EXPAND=1 ./scripts/deploy-remote.sh   # deploy rutinario (default en Jenkins)
EXPAND_CERT=1 ./scripts/deploy-remote.sh       # incluye ampliación TLS DMZ
```

## Primera configuración en servidor

```bash
cp .env.production .env.native
# Editar LLM_API_KEY y revisar DATABASE_URL (sqlite nativo por defecto)
nano .env.native
./scripts/deploy-remote.sh
```

DMZ nginx: `~/Dev/infra/maurocastro-dmz/proxy/conf.d/team.conf`  
Plantilla en `deploy/nginx/team-dmz.conf`.

## Verificación

```bash
curl -fsS https://team.maurocastro.cl/api/health
systemctl --user status agenteia-api agenteia-portal
journalctl --user -u agenteia-api -u agenteia-portal -n 50
```

## Operación

| Acción | Comando |
|--------|---------|
| Logs API | `journalctl --user -u agenteia-api -f` |
| Logs portal | `journalctl --user -u agenteia-portal -f` |
| Reiniciar | `systemctl --user restart agenteia-api agenteia-portal` |
| Recargar DMZ | `docker exec maurocastro-dmz-proxy nginx -s reload` |

## Archivos relevantes

| Archivo | Rol |
|---------|-----|
| `Jenkinsfile` | Pipeline declarativo |
| `scripts/jenkins-deploy.sh` | Sync + SSH deploy (desde Jenkins) |
| `scripts/deploy-remote.sh` | Build, migrate, systemd, DMZ |
| `deploy/nginx/team-dmz.conf` | Virtual host DMZ |
| `deploy/systemd/*.service` | Units usuario systemd |
| `.env.native` | Config producción (gitignored) |

## Notas

- El DellVostro (`192.168.1.38`) **no** sirve el tráfico público; el DNS apunta al ZenBook vía DMZ.
- Deploy Docker (`docker-compose.prod.yml`) es alternativa si el host tiene acceso al grupo `docker`; producción actual es **nativa + systemd**.
- Tras cambios en `Jenkinsfile`, haz push a GitHub o re-ejecuta `deploy/jenkins/install-job.sh` para re-embed del script.
