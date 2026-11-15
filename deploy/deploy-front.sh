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
# نکته: اسکریپت activate خودِ cPanel با set -u سازگار نیست، پس موقتاً خاموش می‌شود.
set +u
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
set -u
if ! command -v node >/dev/null 2>&1; then
  export PATH="/opt/alt/alt-nodejs22/root/usr/bin:$PATH"
fi
command -v node >/dev/null 2>&1 || { echo "خطا: node پیدا نشد." >&2; exit 1; }

# NODE_ENV عمداً اینجا ست نمی‌شود: با NODE_ENV=production دستور npm ci
# وابستگی‌های dev (tailwind و typescript) را نصب نمی‌کند و build می‌شکند.
export NEXT_TELEMETRY_DISABLED=1

step "۱/۶ بررسی پوشهٔ برنامه (node $(node -v))"
AVAIL_KB=$(df -Pk "$HOME" 2>/dev/null | awk 'NR==2{print $4}')
AVAIL_MB=$(( AVAIL_KB / 1024 ))
echo "فضای آزاد قابل استفاده: ${AVAIL_MB}MB"
if [ "$AVAIL_MB" -lt 1200 ]; then
  cat >&2 <<'MSG'
خطا: فضای آزاد کافی نیست (کمتر از ۱٫۲ گیگابایت).
node_modules کامل (Next + swc + ابزار تست) حدود ۱ گیگابایت می‌خواهد.
برای آزادسازی:
  rm -rf ~/Crowdfunding-Front/node_modules ~/Crowdfunding-Front/.next
  npm cache clean --force
  rm -rf ~/nodevenv/Crowdfunding-Front/22/lib/node_modules
سپس دوباره اجرا کنید.
MSG
  exit 1
fi
[ -d "$APP_DIR/.git" ] || { echo "خطا: $APP_DIR مخزن گیت نیست." >&2; exit 1; }
cd "$APP_DIR"

step "۲/۶ واکشی آخرین تغییرات ($BRANCH)"
git fetch --prune origin
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"

step "۳/۶ نصب وابستگی‌ها (npm ci --omit=dev)"
# چرا omit=dev: سهمیهٔ دیسک این حساب کوچک است و ابزارهای توسعه (eslint، vitest،
# playwright، testing-library) حدود ۱۵۰ مگابایت اضافه می‌کنند. هرچه برای build
# لازم است (typescript، tailwindcss، @tailwindcss/postcss، @types/*) در
# dependencies تعریف شده تا با نصب تولیدی هم بیاید. کیفیت در CI سنجیده می‌شود.
NODE_ENV=production npm ci --omit=dev --no-audit --no-fund

step "۳٫۴/۶ حذف باینری‌های swc که روی این هاست بارگذاری نمی‌شوند"
# glibc این سرور قدیمی‌تر از ۲.۲۹ است، پس نسخهٔ gnu/musl هرگز بالا نمی‌آید و
# Next خودش به بایندینگ WASM برمی‌گردد. حذفشان ~۸۵ مگابایت آزاد می‌کند و لاگ را
# از هشدارهای تکراری پاک می‌کند.
rm -rf "$APP_DIR/node_modules/@next/swc-linux-x64-gnu" \
       "$APP_DIR/node_modules/@next/swc-linux-x64-musl"
# ابزار e2e روی هاست لازم نیست (آزمون‌های مرورگر در CI اجرا می‌شوند)
rm -rf "$APP_DIR/node_modules/@playwright" "$APP_DIR/node_modules/playwright" "$APP_DIR/node_modules/playwright-core"

step "۳٫۵/۶ بررسی بسته‌های لازم برای بیلد"
missing=""
for pkg in typescript "@tailwindcss/postcss" next react; do
  [ -d "$APP_DIR/node_modules/$pkg" ] || missing="$missing $pkg"
done
if [ -n "$missing" ]; then
  echo "خطا: این بسته‌ها پس از npm ci موجود نیستند:$missing" >&2
  exit 1
fi
echo "بسته‌های بیلد کامل‌اند."

# اولویت به next خودِ پروژه (نه نسخهٔ داخل virtualenv)
export PATH="$APP_DIR/node_modules/.bin:$PATH"

step "۴/۶ ساخت تولیدی (next build)"
if ! NODE_ENV=production PATH="$APP_DIR/node_modules/.bin:$PATH" npm run build; then
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
