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
APP_NAME="${APP_NAME:-Crowdfunding-Front}"
BRANCH="${1:-main}"
LOG_PREFIX="[deploy-front]"

step() { printf '\n%s %s\n' "$LOG_PREFIX" "$1"; }

# --- فعال‌سازی محیط Node ---------------------------------------------------
# اول virtualenv خودِ اپ در cPanel، بعد مسیر سیستمی CloudLinux.
if [ -f "$HOME/nodevenv/$APP_NAME/22/bin/activate" ]; then
  # shellcheck disable=SC1091
  source "$HOME/nodevenv/$APP_NAME/22/bin/activate"
else
  for activate in "$HOME"/nodevenv/"$APP_NAME"/*/bin/activate; do
    if [ -f "$activate" ]; then
      # shellcheck disable=SC1090
      source "$activate"
      break
    fi
  done
fi
if ! command -v node >/dev/null 2>&1; then
  export PATH="/opt/alt/alt-nodejs22/root/usr/bin:$PATH"
fi
command -v node >/dev/null 2>&1 || { echo "خطا: node پیدا نشد." >&2; exit 1; }

export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1

step "۱/۶ بررسی پوشهٔ برنامه (node $(node -v))"
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
  echo "خطا: ساخت شکست خورد. نسخهٔ قبلی همچنان سرو می‌شود." >&2
  exit 1
fi

step "۵/۶ ری‌استارت برنامهٔ Node"
mkdir -p "$APP_DIR/tmp"
touch "$APP_DIR/tmp/restart.txt"

step "۶/۶ بررسی سلامت"
sleep 5
SITE_URL="${SITE_URL:-https://alavi-fars.ir}"
CODE=$(curl -sk -o /dev/null -w '%{http_code}' --max-time 25 --resolve "alavi-fars.ir:443:${SRV_IP:-5.9.155.50}" "$SITE_URL/" || echo 000)
echo "کد پاسخ $SITE_URL → $CODE"
if [ "$CODE" = "200" ]; then
  echo "✅ به‌روزرسانی با موفقیت انجام شد."
else
  echo "⚠️ سایت ۲۰۰ برنگرداند. Passenger log: ~/logs/passenger-front.log"
  exit 1
fi
