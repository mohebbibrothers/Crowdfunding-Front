#!/usr/bin/env bash
#
# استقرار فرانت‌اند روی هاست cPanel.
#   bash ~/deploy-front.sh            # آخرین بیلد شاخهٔ main
#   bash ~/deploy-front.sh <branch>   # شاخهٔ دیگر
#
# چرا این‌طور: سهمیهٔ دیسک این حساب ۱ گیگابایت است و نصب node_modules کامل
# (۶۲۵ مگابایت) به‌همراه کش swc در آن جا نمی‌شود. پس بیلد در GitHub Actions
# انجام می‌شود و این‌جا فقط بستهٔ آمادهٔ اجرا دانلود و جایگزین می‌شود.
# نتیجه: استقرار چند ثانیه‌ای، بدون build روی هاست، با کمترین مصرف دیسک.
set -euo pipefail

APP_DIR="${APP_DIR:-$HOME/Crowdfunding-Front}"
REPO="${REPO:-mohebbibrothers/Crowdfunding-Front}"
BRANCH="${1:-main}"
SITE_URL="${SITE_URL:-https://alavi-fars.ir}"
SERVER_IP="${SRV_IP:-5.9.155.50}"
LOG_PREFIX="[deploy-front]"

step() { printf '\n%s %s\n' "$LOG_PREFIX" "$1"; }
fail() { printf '\n❌ %s\n' "$1" >&2; exit 1; }

step "۱/۶ بررسی پوشهٔ برنامه"
[ -d "$APP_DIR/.git" ] || fail "پوشهٔ $APP_DIR مخزن گیت نیست."
cd "$APP_DIR"
AVAIL_MB=$(( $(df -Pk "$HOME" | awk 'NR==2{print $4}') / 1024 ))
echo "فضای آزاد: ${AVAIL_MB}MB"

step "۲/۶ واکشی کد (برای server.js و .env)"
git fetch --prune origin
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"

step "۳/۶ دانلود بستهٔ اجرا از Releases"
URL="https://github.com/$REPO/releases/download/build-latest/front-build.tar.gz"
TMP_TAR="$(mktemp -t front-build.XXXXXX.tar.gz)"
if ! curl -fsSL --retry 3 --max-time 180 -o "$TMP_TAR" "$URL"; then
  rm -f "$TMP_TAR"
  fail "دانلود بسته ناموفق بود: $URL
یعنی CI هنوز آرتیفکت را منتشر نکرده یا Workflow شکست خورده است."
fi
echo "اندازهٔ بسته: $(du -h "$TMP_TAR" | cut -f1)"

step "۴/۶ باز کردن بسته در runtime/"
rm -rf "$APP_DIR/runtime.new"
mkdir -p "$APP_DIR/runtime.new"
tar -xzf "$TMP_TAR" -C "$APP_DIR/runtime.new"
rm -f "$TMP_TAR"
[ -f "$APP_DIR/runtime.new/server.js" ] || fail "بستهٔ دانلودشده server.js ندارد."

# متغیرهای محیطی در زمان اجرا (مقادیر NEXT_PUBLIC_* در CI پخته شده‌اند)
if [ -f "$APP_DIR/.env" ]; then
  cp "$APP_DIR/.env" "$APP_DIR/runtime.new/.env"
else
  cat > "$APP_DIR/runtime.new/.env" <<'ENV'
API_BASE_URL=https://api.alavi-fars.ir
NEXT_PUBLIC_API_BASE_URL=https://api.alavi-fars.ir
NEXT_PUBLIC_SITE_URL=https://alavi-fars.ir
ENV
fi

rm -rf "$APP_DIR/runtime"
mv "$APP_DIR/runtime.new" "$APP_DIR/runtime"
echo "حجم runtime: $(du -sh "$APP_DIR/runtime" | cut -f1)"

step "۵/۶ ری‌استارت برنامهٔ Node"
mkdir -p "$APP_DIR/tmp"
touch "$APP_DIR/tmp/restart.txt"

step "۶/۶ بررسی سلامت"
for i in 1 2 3 4 5 6 7 8 9 10; do
  CODE=$(curl -sk -o /dev/null -w '%{http_code}' --max-time 20 \
    --resolve "alavi-fars.ir:443:$SERVER_IP" "$SITE_URL/" || echo 000)
  echo "تلاش $i → $CODE"
  [ "$CODE" = "200" ] && { printf '\n✅ استقرار با موفقیت انجام شد.\n'; exit 0; }
  sleep 6
done

printf '\n⚠️ سایت ۲۰۰ برنگرداند.\n' >&2
echo "لاگ Passenger: ~/logs/passenger-front.log" >&2
tail -15 ~/logs/passenger-front.log 2>/dev/null >&2 || true
exit 1
