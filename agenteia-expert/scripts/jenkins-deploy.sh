#!/usr/bin/env bash
# Sincroniza el workspace de Jenkins al host y ejecuta deploy-remote.sh vía SSH.
# Diseñado para correr dentro del contenedor jenkins-devops (tiene docker.sock y clave SSH).
set -euo pipefail

DEPLOY_HOST="${DEPLOY_HOST:-172.17.0.1}"
DEPLOY_USER="${DEPLOY_USER:-mauro}"
DEPLOY_PATH="${DEPLOY_PATH:-/home/mauro/Dev/Agent-Team-OnDemand/agenteia-expert}"
SSH_KEY="${SSH_KEY:-/var/jenkins_home/.ssh/id_ed25519}"
SOURCE_DIR="${WORKSPACE:?WORKSPACE no definido}/agenteia-expert"

SSH_OPTS=(
  -o StrictHostKeyChecking=no
  -o UserKnownHostsFile=/dev/null
  -i "$SSH_KEY"
)

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "ERROR: no existe $SOURCE_DIR — el checkout debe incluir agenteia-expert/"
  exit 1
fi

if [[ ! -f "$SSH_KEY" ]]; then
  echo "ERROR: falta clave SSH en $SSH_KEY"
  exit 1
fi

echo "==> Sync $(basename "$SOURCE_DIR") → ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}"
tar -C "$SOURCE_DIR" -cf - \
  --exclude=node_modules \
  --exclude=.venv \
  --exclude=frontend/dist \
  --exclude=data \
  --exclude=.git \
  --exclude='*.db' \
  --exclude='pytest-cache-files-*' \
  . | ssh "${SSH_OPTS[@]}" "${DEPLOY_USER}@${DEPLOY_HOST}" "mkdir -p '${DEPLOY_PATH}' && tar -xf - -C '${DEPLOY_PATH}'"

echo "==> Deploy remoto"
ssh "${SSH_OPTS[@]}" "${DEPLOY_USER}@${DEPLOY_HOST}" bash -s <<REMOTE
set -euo pipefail
cd '${DEPLOY_PATH}'
chmod +x scripts/*.sh
export SKIP_CERT_EXPAND='${SKIP_CERT_EXPAND:-1}'
export EXPAND_CERT='${EXPAND_CERT:-0}'
./scripts/deploy-remote.sh
REMOTE

echo "==> Verificación pública"
curl -fsS -o /dev/null -w "https://team.maurocastro.cl/ → %{http_code}\n" https://team.maurocastro.cl/
curl -fsS https://team.maurocastro.cl/api/health
echo
