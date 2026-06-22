#!/usr/bin/env bash
set -euo pipefail

: "${TELEGRAM_BOT_TOKEN:?TELEGRAM_BOT_TOKEN is required}"
: "${TELEGRAM_WEBHOOK_URL:?TELEGRAM_WEBHOOK_URL is required}"

curl --fail-with-body --silent --show-error \
  --request POST \
  --url "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook" \
  --data-urlencode "url=${TELEGRAM_WEBHOOK_URL}"
