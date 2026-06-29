#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "==> AgenteIA Expert — deploy nativo (team.maurocastro.cl)"
echo "    API:    127.0.0.1:8092"
echo "    Portal: 127.0.0.1:8093"

if [[ ! -f .env.native ]]; then
  echo "ERROR: falta .env.native (copia desde .env.production y ajusta sqlite)"
  exit 1
fi

echo "==> Build frontend"
cd frontend
VITE_API_BASE=/api npm run build
cd "$ROOT"

echo "==> Base de datos"
mkdir -p data
set -a
# shellcheck disable=SC1091
source .env.native
set +a
.venv/bin/alembic upgrade head

echo "==> Systemd user services"
mkdir -p "$HOME/.config/systemd/user"
cp deploy/systemd/agenteia-api.service "$HOME/.config/systemd/user/"
cp deploy/systemd/agenteia-portal.service "$HOME/.config/systemd/user/"
systemctl --user daemon-reload
systemctl --user enable agenteia-api.service agenteia-portal.service
systemctl --user restart agenteia-api.service agenteia-portal.service

sleep 2

echo "==> Health checks"
curl -fsS http://127.0.0.1:8092/health
echo
curl -fsS http://127.0.0.1:8093/api/health
echo
curl -fsS -o /dev/null -w "portal /: %{http_code}\n" http://127.0.0.1:8093/
curl -fsS -o /dev/null -w "group-chat: %{http_code}\n" \
  -X POST http://127.0.0.1:8093/api/group-chat/stream \
  -H 'Content-Type: application/json' \
  -d '{"participant_slugs":["agenteia-expert","devops-arquitecto"],"messages":[{"author":"deploy","speaker_type":"user","content":"ping"}]}'

echo
echo "==> Listo en este servidor:"
echo "    http://127.0.0.1:8093"
echo
echo "==> Para exponer en team.maurocastro.cl (requiere sudo en tu terminal):"
echo "    sudo cp deploy/nginx/team.maurocastro.cl.conf /etc/nginx/sites-available/team.maurocastro.cl"
echo "    sudo ln -sf /etc/nginx/sites-available/team.maurocastro.cl /etc/nginx/sites-enabled/"
echo "    sudo nginx -t && sudo systemctl reload nginx"
echo "    sudo certbot --nginx -d team.maurocastro.cl"
echo
echo "    (El nginx host apunta a 127.0.0.1:8093 — versión actual con chat y reunión)"
