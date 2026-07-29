FROM alpine:3.23

RUN apk add --no-cache \
  postgresql18=18.4-r0 \
  postgresql18-client=18.4-r0 \
  su-exec=0.3-r0

ENV PGDATA=/var/lib/postgresql/data
COPY deploy/postgres/entrypoint.sh /usr/local/bin/catnip-postgres-entrypoint
RUN chmod 755 /usr/local/bin/catnip-postgres-entrypoint

EXPOSE 5432
ENTRYPOINT ["catnip-postgres-entrypoint"]
