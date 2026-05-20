#!/usr/bin/env sh
# Build plugin zip: build/distributions/ai-chat-file-links-<version>.zip
# Logs: log.1main.log (stdout), log.1err.log (stderr)

set -eu

cd "$(dirname "$0")"

if [ ! -x "./gradlew" ]; then
  chmod +x ./gradlew
fi

./gradlew buildPlugin >log.1main.log 2>log.1err.log
status=$?

if [ "$status" -eq 0 ]; then
  echo "BUILD SUCCESSFUL — see log.1main.log"
  ls -1 build/distributions/*.zip 2>/dev/null || true
else
  echo "BUILD FAILED ($status) — see log.1main.log and log.1err.log" >&2
fi

exit "$status"
