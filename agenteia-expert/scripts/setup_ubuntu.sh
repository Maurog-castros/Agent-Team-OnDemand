#!/usr/bin/env bash
set -euo pipefail

sudo apt-get update
sudo apt-get install -y --no-install-recommends ca-certificates curl docker.io docker-compose-plugin git
sudo usermod -aG docker "${USER}"

printf '%s\n' "Ubuntu prerequisites installed. Re-login before using Docker without sudo."
