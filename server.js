/**
 * نقطهٔ ورود اجرای Next.js روی Passenger (cPanel / CloudLinux).
 *
 * چرا این فایل لازم است: Passenger یک سرگردانِ Node را از یک فایل ورودی اجرا
 * می‌کند و پورت/سوکت را در `process.env.PORT` می‌گذارد. اینجا همان قرارداد را
 * رعایت می‌کنیم تا سایت بدون نیاز به pm2 یا پورت ثابت بالا بیاید.
 */
const { createServer } = require("node:http");
const next = require("next");

const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || "0.0.0.0";

const app = next({ dev: false, dir: __dirname });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => {
      handle(req, res).catch((error) => {
        console.error("[next] request failed", error);
        res.statusCode = 500;
        res.end("Internal Server Error");
      });
    }).listen(port, hostname, () => {
      console.log(`> alavi-fars front ready on ${hostname}:${port}`);
    });
  })
  .catch((error) => {
    console.error("[next] failed to start", error);
    process.exit(1);
  });
