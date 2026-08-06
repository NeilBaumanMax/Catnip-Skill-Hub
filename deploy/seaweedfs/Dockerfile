FROM alpine:3.23

ARG SEAWEEDFS_VERSION=4.29
ARG TARGETARCH
ARG SEAWEEDFS_SHA256_AMD64=f090992272353bbf0e00ea5a26c452beb81fb1deac6a240c768b5b22fcbb7202
ARG SEAWEEDFS_SHA256_ARM64=28f069a310a56f1d5ce5932085de01116b9b39f3dd1dee9fb1f73605dbe6c5bc
RUN case "${TARGETARCH}" in \
      amd64) seaweedfs_sha256="${SEAWEEDFS_SHA256_AMD64}" ;; \
      arm64) seaweedfs_sha256="${SEAWEEDFS_SHA256_ARM64}" ;; \
      *) echo "Unsupported TARGETARCH: ${TARGETARCH}" >&2; exit 1 ;; \
    esac \
  && wget -q -O /tmp/seaweedfs.tar.gz \
    "https://github.com/seaweedfs/seaweedfs/releases/download/${SEAWEEDFS_VERSION}/linux_${TARGETARCH}.tar.gz" \
  && printf '%s  %s\n' "${seaweedfs_sha256}" /tmp/seaweedfs.tar.gz | sha256sum -c - \
  && apk add --no-cache su-exec=0.3-r0 \
  && tar -xzf /tmp/seaweedfs.tar.gz -C /usr/local/bin weed \
  && rm /tmp/seaweedfs.tar.gz \
  && addgroup -S -g 10001 seaweed \
  && adduser -S -D -H -u 10001 -G seaweed seaweed \
  && mkdir -p /data \
  && chown seaweed:seaweed /data

COPY deploy/seaweedfs/entrypoint.sh /usr/local/bin/catnip-seaweedfs-entrypoint
RUN chmod 755 /usr/local/bin/catnip-seaweedfs-entrypoint

EXPOSE 7333 8080 8333 8888 9333 18080 18888 19333
ENTRYPOINT ["catnip-seaweedfs-entrypoint"]
CMD ["mini", "-dir=/data"]
