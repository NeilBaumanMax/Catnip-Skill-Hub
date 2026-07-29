#!/bin/sh
set -eu

: "${POSTGRES_USER:?POSTGRES_USER is required}"
: "${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required}"
: "${POSTGRES_DB:?POSTGRES_DB is required}"
: "${PGDATA:=/var/lib/postgresql/data}"

mkdir -p "$PGDATA" /run/postgresql
chown -R postgres:postgres /var/lib/postgresql /run/postgresql
chmod 700 "$PGDATA"

if [ ! -s "$PGDATA/PG_VERSION" ]; then
  password_file=$(mktemp)
  chmod 600 "$password_file"
  printf '%s\n' "$POSTGRES_PASSWORD" > "$password_file"
  chown postgres:postgres "$password_file"
  su-exec postgres initdb \
    -D "$PGDATA" \
    --username="$POSTGRES_USER" \
    --pwfile="$password_file" \
    --auth-host=scram-sha-256 \
    --auth-local=trust
  rm -f "$password_file"

  su-exec postgres pg_ctl -D "$PGDATA" \
    -o "-c listen_addresses='' -c unix_socket_directories='/run/postgresql'" \
    -w start
  if [ "$POSTGRES_DB" != "postgres" ]; then
    su-exec postgres createdb -h /run/postgresql -U "$POSTGRES_USER" "$POSTGRES_DB"
  fi
  su-exec postgres pg_ctl -D "$PGDATA" -m fast -w stop
fi

hba_rule="host all all all scram-sha-256"
if ! grep -Fqx "$hba_rule" "$PGDATA/pg_hba.conf"; then
  printf '%s\n' "$hba_rule" >> "$PGDATA/pg_hba.conf"
fi

exec su-exec postgres postgres -D "$PGDATA" -c "listen_addresses=*"
