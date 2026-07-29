#!/bin/sh
set -eu

chown -R seaweed:seaweed /data
exec su-exec seaweed weed "$@"
