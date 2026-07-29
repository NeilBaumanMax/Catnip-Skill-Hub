#!/bin/sh
set -eu

project_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$project_dir"

backup_input=${1:-}
if [ -z "$backup_input" ]; then
  echo "用法：CATNIP_RESTORE_CONFIRM=restore-catnip-local scripts/restore-local.sh backups/<timestamp>" >&2
  exit 1
fi

backup_dir=$(CDPATH= cd -- "$backup_input" 2>/dev/null && pwd) || {
  echo "备份目录不存在。" >&2
  exit 1
}

case "$backup_dir" in
  "$project_dir"/backups/*) ;;
  *) echo "只允许恢复本项目 backups/ 下的显式目录。" >&2; exit 1 ;;
esac

if [ "${CATNIP_RESTORE_CONFIRM:-}" != "restore-catnip-local" ]; then
  echo "恢复会覆盖本地数据库与对象卷；未提供精确确认值，已停止。" >&2
  exit 1
fi

test -s "$backup_dir/postgres.dump"
test -s "$backup_dir/seaweed-data.tar.gz"
test -f .env.local

docker compose --env-file .env.local stop caddy app seaweedfs
docker compose --env-file .env.local exec -T postgres \
  pg_restore -U catnip -d catnip --clean --if-exists --no-owner --no-privileges < "$backup_dir/postgres.dump"

docker run --rm -v catnip_seaweed_data:/target alpine:3.23 \
  sh -c 'find /target -mindepth 1 -delete'
restore_container="catnip-seaweed-restore-$$"
docker create --name "$restore_container" -v catnip_seaweed_data:/target \
  alpine:3.23 tar -C /target -xzf /tmp/seaweed-data.tar.gz
docker cp "$backup_dir/seaweed-data.tar.gz" "$restore_container:/tmp/seaweed-data.tar.gz"
docker start --attach "$restore_container"
docker rm "$restore_container"

docker compose --env-file .env.local up -d seaweedfs app caddy
echo "本地恢复完成；请立即执行健康检查和功能复测。"
