#!/usr/bin/env bash
# Usage: ./deploy.sh https://github.com/<user>/<repo>.git
set -euo pipefail
REPO="${1:?Pass your GitHub repo URL, e.g. https://github.com/user/portfolio.git}"
cd "$(dirname "$0")"
[ -d .git ] || git init -q -b main
git add -A
git commit -qm "Update portfolio site" || echo "Nothing new to commit"
git remote get-url origin >/dev/null 2>&1 || git remote add origin "$REPO"
git push -u origin main
echo "Pushed. Enable Pages: repo Settings → Pages → Deploy from branch → main / (root)."
