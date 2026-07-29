#!/bin/sh
set -eu

project_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$project_dir"

if [ ! -f .env.local ]; then
  echo ".env.local 不存在，无法连接本地部署。" >&2
  exit 1
fi

timestamp=$(date '+%Y%m%d-%H%M%S')
backup_dir="backups/$timestamp"
mkdir -p "$backup_dir"

docker compose --env-file .env.local exec -T postgres \
  pg_dump -U catnip -d catnip --format=custom > "$backup_dir/postgres.dump"

docker run --rm -v catnip_seaweed_data:/source:ro \
  alpine:3.23 tar -C /source -czf - . > "$backup_dir/seaweed-data.tar.gz"

git_revision=$(git rev-parse HEAD 2>/dev/null || printf 'unknown')
{
  printf 'created_at=%s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
  printf 'git_revision=%s\n' "$git_revision"
  printf 'database=postgres.dump\n'
  printf 'object_data=seaweed-data.tar.gz\n'
} > "$backup_dir/manifest.txt"

echo "本地备份完成：$backup_dir"
