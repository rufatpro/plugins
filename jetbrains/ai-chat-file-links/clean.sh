#!/usr/bin/env sh
# Remove build caches and logs (keeps src/, gradle/, gradlew*, *.gradle.kts, docs)

set -eu

cd "$(dirname "$0")"

echo "Cleaning plugin build artifacts..."

rm -rf build && echo "  [ok] build/"
rm -rf .gradle && echo "  [ok] .gradle/"
rm -rf .intellijPlatform && echo "  [ok] .intellijPlatform/"
rm -rf .kotlin && echo "  [ok] .kotlin/"

for f in log.1main.log log.1err.log; do
  if [ -f "$f" ]; then
    rm -f "$f"
    echo "  [ok] $f"
  fi
done

for pattern in /tmp/ai-chat-file-links-*.log /tmp/acp-path-opener-*.log; do
  # shellcheck disable=SC2086
  if ls $pattern 1>/dev/null 2>&1; then
    # shellcheck disable=SC2086
    rm -f $pattern
    echo "  [ok] $pattern"
  fi
done

echo ""
echo "Done. Kept: src/, gradle/, gradlew, gradlew.bat, build.sh, clean.sh, *.gradle.kts, *.properties, *.md, .gitignore"
