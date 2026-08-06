#!/bin/sh
set -u

section() {
  printf '\n== %s ==\n' "$1"
}

run_optional() {
  label=$1
  shift
  printf '%s\n' "-- $label"
  "$@" 2>&1 || printf '[unavailable or failed: exit %s]\n' "$?"
}

section "identity and operating system"
run_optional "identity" id
run_optional "kernel" uname -a
if [ -r /etc/os-release ]; then
  run_optional "release" sh -c '. /etc/os-release; printf "ID=%s\nVERSION_ID=%s\nPRETTY_NAME=%s\n" "$ID" "$VERSION_ID" "$PRETTY_NAME"'
else
  printf '%s\n' "-- release" "[unavailable: /etc/os-release is not readable]"
fi

section "capacity"
run_optional "cpu" sh -c 'getconf _NPROCESSORS_ONLN; uname -m'
run_optional "memory" free -h
run_optional "swap" swapon --show
run_optional "root filesystem" df -h /

section "runtime and services"
if command -v docker >/dev/null 2>&1; then
  run_optional "docker" docker version
  run_optional "compose" docker compose version
else
  printf '%s\n' "-- docker" "not installed"
fi
run_optional "nginx unit" systemctl is-active nginx
run_optional "enabled units" systemctl list-unit-files --state=enabled --no-pager
if command -v sudo >/dev/null 2>&1 && sudo -n true >/dev/null 2>&1; then
  run_optional "nginx configuration" sudo -n nginx -t
  if command -v ufw >/dev/null 2>&1; then
    run_optional "ufw status" sudo -n ufw status verbose
  fi
else
  printf '%s\n' "-- passwordless sudo" "unavailable"
fi
run_optional "pending package upgrades" sh -c 'apt list --upgradable 2>/dev/null | sed "1d" | wc -l'
if [ -e /var/run/reboot-required ]; then
  printf '%s\n' "reboot_required=yes"
else
  printf '%s\n' "reboot_required=no"
fi

section "listeners"
run_optional "TCP listeners" ss -ltnp

section "protected legacy workspace"
if [ -d /home/ubuntu/catnip-intro ]; then
  printf '%s\n' "workspace_present=yes"
  if command -v git >/dev/null 2>&1 && git -C /home/ubuntu/catnip-intro rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    run_optional "legacy git status (read-only)" git -C /home/ubuntu/catnip-intro status --short
  else
    printf '%s\n' "legacy_git_repository=no-or-unreadable"
  fi
else
  printf '%s\n' "workspace_present=no"
fi

section "deployment gates"
printf '%s\n' \
  "required_architecture=x86_64-or-amd64" \
  "required_free_host_port=18080-loopback" \
  "required_public_preview_port=8080-via-host-nginx" \
  "required_recovery_point=tencent-cloud-snapshot-or-approved-off-host-backup" \
  "protected_ports=80,3000,4000" \
  "protected_path=/home/ubuntu/catnip-intro"

printf '\nPreflight completed without intentional host changes.\n'
