#!/usr/bin/env bash
#
# به‌روزرسانی فرانت‌اند روی هاست cPanel.
#   bash ~/deploy-front.sh            # شاخهٔ main
#   bash ~/deploy-front.sh <branch>   # شاخهٔ دیگر
#
# کارها: واکشی کد، نصب دقیق وابستگی‌ها، ساخت تولیدی، ری‌استارت Passenger.
# هرگز فایل .env را دست نمی‌زند.
set -euo pipefail

APP_DIR="${APP_DIR:-$HOME/Crowdfunding-Front}"
BRANCH="${1:-main}"
NODE_DIR=/opt/alt/alt-nodejs22/root/usr/bin
LOG_PREFIX="[deploy-front]"

step() { printf '\n%s %s\n' "$LOG_PREFIX" "$1"; }

export PATH="$NODE_DIR:$PATH"
if ! command -v node >/dev/null 2>&1; then
  echo "خطا: node پیدا نشد. مسیر $NODE_DIR را بررسی کنید." >&2
  exit 1
fi

step "۱/۶ بررسی پوشهٔ برنامه"
[ -d "$APP_DIR/.git" ] || { echo "خطا: $APP_DIR مخزن گیت نیست." >&2; exit 1; }
cd "$APP_DIR"

step "۲/۶ واکشی آخرین تغییرات ($BRANCH)"
git fetch --prune origin
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"

step "۳/۶ نصب وابستگی‌ها (npm ci)"
npm ci --no-audit --no-fund

step "۴/۶ ساخت تولیدی (next build)"
if ! npm run build; then
  echo "خطا: ساخت شکست خورد. کد قبلی همچنان سرو می‌شود." >&2
  exit 1
fi

step "۵/۶ ری‌استارت برنامهٔ Node"
mkdir -p "$APP_DIR/tmp"
touch "$APP_DIR/tmp/restart.txt"

step "۶/۶ بررسی سلامت"
sleep 4
SITE_URL="${SITE_URL:-https://alavi-fars.ir}"
CODE=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$SITE_URL/" || echo 000)
echo "کد پاسخ $SITE_URL → $CODE"
if [ "$CODE" = "200" ]; then
  echo "✅ به‌روزرسانی با موفقیت انجام شد."
else
  echo "⚠️ سایت ۲۰۰ برنگرداند. لاگ را ببینید: ~/logs/*.log یا خطای Passenger."
fi
