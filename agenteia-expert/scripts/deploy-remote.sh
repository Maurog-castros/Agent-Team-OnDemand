#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DMZ_CONF_DIR="${DMZ_CONF_DIR:-$HOME/Dev/infra/maurocastro-dmz/proxy/conf.d}"
DMZ_CONTAINER="${DMZ_CONTAINER:-maurocastro-dmz-proxy}"
PORTAL_PORT="${PORTAL_PORT:-8093}"
API_PORT="${API_PORT:-8092}"

cd "$ROOT"

echo "==> Deploy AgenteIA Expert en $(hostname) para team.maurocastro.cl"

if [[ ! -f .env.native ]]; then
  echo "ERROR: falta .env.native"
  exit 1
fi

if [[ ! -d .venv ]]; then
  python3 -m venv .venv
fi

.venv/bin/pip install -q -e .

echo "==> Build frontend"
cd frontend
if [[ ! -d node_modules ]]; then
  npm ci
fi
VITE_API_BASE=/api npm run build
cd "$ROOT"

mkdir -p data
set -a
# shellcheck disable=SC1091
source .env.native
set +a
.venv/bin/alembic upgrade head

echo "==> Systemd user services (portal en 0.0.0.0:${PORTAL_PORT})"
mkdir -p "$HOME/.config/systemd/user"
sed "s|127.0.0.1 --port 8093|0.0.0.0 --port ${PORTAL_PORT}|g" deploy/systemd/agenteia-portal.service > "$HOME/.config/systemd/user/agenteia-portal.service"
cp deploy/systemd/agenteia-api.service "$HOME/.config/systemd/user/"
systemctl --user daemon-reload
systemctl --user enable agenteia-api.service agenteia-portal.service
systemctl --user restart agenteia-api.service agenteia-portal.service
loginctl enable-linger "$USER" 2>/dev/null || true

sleep 2

echo "==> DMZ proxy: team.maurocastro.cl"
mkdir -p "$DMZ_CONF_DIR"
sed "s|host.docker.internal:8093|host.docker.internal:${PORTAL_PORT}|g" deploy/nginx/team-dmz.conf > "$DMZ_CONF_DIR/team.conf"
docker exec "$DMZ_CONTAINER" nginx -t
docker exec "$DMZ_CONTAINER" nginx -s reload

DMZ_PROXY_DIR="$(dirname "$DMZ_CONF_DIR")"
if [[ -d "$DMZ_PROXY_DIR" ]] && [[ "${SKIP_CERT_EXPAND:-0}" != "1" ]] && [[ "${EXPAND_CERT:-0}" == "1" ]]; then
  echo "==> Ampliar certificado TLS con team.maurocastro.cl"
  (
    cd "$DMZ_PROXY_DIR"
    docker compose run --rm --entrypoint certbot certbot-renew certonly \
      --webroot -w /var/www/certbot \
      --cert-name maurocastro-dmz \
      --expand \
      --email "${CERTBOT_EMAIL:-maurocastro.cl@gmail.com}" \
      --agree-tos \
      --no-eff-email \
      -d openclaw.maurocastro.cl \
      -d webui.maurocastro.cl \
      -d jenkins.maurocastro.cl \
      -d alexa.maurocastro.cl \
      -d team.maurocastro.cl
    docker compose exec dmz-proxy nginx -s reload
  )
fi

echo "==> Health checks"
curl -fsS "http://127.0.0.1:${API_PORT}/health"
echo
curl -fsS "http://127.0.0.1:${PORTAL_PORT}/api/health"
echo
curl -fsS -o /dev/null -w "portal /: %{http_code}\n" "http://127.0.0.1:${PORTAL_PORT}/"
curl -fsS -o /dev/null -w "reunion: %{http_code}\n" "http://127.0.0.1:${PORTAL_PORT}/reunion"

echo
echo "==> Deploy listo. Público: https://team.maurocastro.cl/"
