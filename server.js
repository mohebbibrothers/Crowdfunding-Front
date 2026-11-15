/**
 * نقطهٔ ورود اجرای سایت روی Passenger (cPanel / CloudLinux).
 *
 * معماری استقرار: بیلد در GitHub Actions انجام می‌شود و خروجی خودبسندهٔ Next
 * (`output: "standalone"`) به‌صورت آرتیفکت منتشر می‌شود. اسکریپت استقرار آن را
 * در `runtime/` باز می‌کند و همین فایل آن را بالا می‌آورد؛ بنابراین روی هاست
 * نه `node_modules` لازم است و نه زنجیرهٔ ابزار بیلد.
 *
 * اگر `runtime/` موجود نباشد (مثلاً اجرای محلی با `npm run build`)، به حالت
 * توسعه‌ای/معمولی برمی‌گردیم تا اجرای محلی هم کار کند.
 */
const fs = require("node:fs");
const path = require("node:path");

const runtimeEntry = path.join(__dirname, "runtime", "server.js");

if (fs.existsSync(runtimeEntry)) {
  process.env.NODE_ENV = "production";
  require(runtimeEntry);
} else {
  const { createServer } = require("node:http");
  const next = require("next");

  const rawPort = process.env.PORT || "3000";
  const isSocket = typeof rawPort === "string" && rawPort.startsWith("/");

  const app = next({ dev: false, dir: __dirname });
  const handle = app.getRequestHandler();

  app
    .prepare()
    .then(() => {
      const server = createServer((req, res) => {
        handle(req, res).catch((error) => {
          console.error("[next] request failed", error);
          if (!res.headersSent) res.statusCode = 500;
          res.end("Internal Server Error");
        });
      });

      const onListening = () => {
        console.log(`> alavi-fars front (local build) on ${rawPort}`);
      };

      if (isSocket) {
        server.listen(rawPort, onListening);
      } else {
        server.listen(Number(rawPort) || 3000, "0.0.0.0", onListening);
      }
    })
    .catch((error) => {
      console.error("[next] failed to start", error);
      process.exit(1);
    });
}
