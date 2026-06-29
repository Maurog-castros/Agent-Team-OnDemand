#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOMAIN="team.maurocastro.cl"
PORTAL_PORT="${PORTAL_PORT:-8093}"

if [[ "${EUID:-$(id -u)}" -ne 0 ]]; then
  echo "Ejecuta con sudo: sudo $0"
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y nginx certbot python3-certbot-nginx

cp "$ROOT/deploy/nginx/team.maurocastro.cl.conf" "/etc/nginx/sites-available/${DOMAIN}"
sed -i "s|127.0.0.1:8093|127.0.0.1:${PORTAL_PORT}|g" "/etc/nginx/sites-available/${DOMAIN}"
ln -sf "/etc/nginx/sites-available/${DOMAIN}" "/etc/nginx/sites-enabled/${DOMAIN}"
rm -f /etc/nginx/sites-enabled/default

mkdir -p /var/www/html/.well-known/acme-challenge
chown -R www-data:www-data /var/www/html

nginx -t
systemctl enable nginx
systemctl reload nginx

if ! certbot certificates 2>/dev/null | grep -q "${DOMAIN}"; then
  certbot --nginx -d "${DOMAIN}" --non-interactive --agree-tos --register-unsafely-without-email --redirect
else
  certbot renew --quiet || true
fi

echo "==> https://${DOMAIN}/"
