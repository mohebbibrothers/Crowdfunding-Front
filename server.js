/**
 * نقطهٔ ورود اجرای Next.js روی Passenger (cPanel / CloudLinux).
 *
 * چرا این فایل لازم است: Passenger یک سرگردانِ Node را از یک فایل ورودی اجرا
 * می‌کند و پورت/سوکت را در `process.env.PORT` می‌گذارد. اگر مقدار یک مسیر سوکت
 * یونیکس باشد (حالت رایج Passenger) باید همان را به listen بدهیم؛ اگر عدد بود،
 * روی 0.0.0.0 گوش می‌دهیم تا پیش‌نمایش سندباکس هم کار کند.
 */
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
      console.log(`> alavi-fars front ready on ${isSocket ? "socket " : ""}${rawPort}`);
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
