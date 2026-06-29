#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "==> AgenteIA Expert deploy (team.maurocastro.cl)"

if [[ ! -f .env ]]; then
  echo "Creando .env desde .env.production..."
  cp .env.production .env
fi

# Preservar LLM_API_KEY si ya existe en .env local
if grep -q '^LLM_API_KEY=.\+' .env 2>/dev/null; then
  echo "LLM_API_KEY ya configurada en .env"
elif [[ -f .env.production ]] && grep -q '^LLM_API_KEY=.\+' .env.production; then
  echo "Usando LLM_API_KEY de .env.production"
else
  echo "AVISO: configura LLM_API_KEY en .env antes de usar chat en producción"
fi

echo "==> Build y arranque Docker (producción)"
docker compose -f docker-compose.prod.yml build --pull
docker compose -f docker-compose.prod.yml up -d

echo "==> Migraciones DB"
docker compose -f docker-compose.prod.yml exec -T api alembic upgrade head

echo "==> Health checks"
curl -fsS http://127.0.0.1:8080/health | tee /tmp/agenteia-health.json
echo
curl -fsS http://127.0.0.1:8081/api/health | tee /tmp/agenteia-portal-health.json
echo
curl -fsS -o /dev/null -w "group-chat probe: %{http_code}\n" \
  -X POST http://127.0.0.1:8081/api/group-chat/stream \
  -H 'Content-Type: application/json' \
  -d '{"participant_slugs":["agenteia-expert","devops-arquitecto"],"messages":[{"author":"deploy","speaker_type":"user","content":"ping"}]}'

echo
echo "==> Portal interno: http://127.0.0.1:8081"
echo "==> Para público en team.maurocastro.cl, instala nginx host:"
echo "    sudo cp deploy/nginx/team.maurocastro.cl.conf /etc/nginx/sites-available/team.maurocastro.cl"
echo "    sudo ln -sf /etc/nginx/sites-available/team.maurocastro.cl /etc/nginx/sites-enabled/"
echo "    sudo nginx -t && sudo systemctl reload nginx"
echo "    sudo certbot --nginx -d team.maurocastro.cl"
