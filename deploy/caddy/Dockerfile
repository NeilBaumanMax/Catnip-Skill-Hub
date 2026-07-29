FROM alpine:3.23

RUN apk add --no-cache caddy=2.11.4-r0
COPY deploy/Caddyfile /etc/caddy/Caddyfile

USER caddy
EXPOSE 8080
ENTRYPOINT ["caddy"]
CMD ["run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
