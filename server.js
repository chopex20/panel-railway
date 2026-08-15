/**
 * server.js — نقطه‌ی ورود برای Railway
 *
 * برخلاف Vercel (سرورلس، هر function جدا و بی‌حافظه)، Railway یک پروسه‌ی
 * Node.js عادی و درازمدت اجرا می‌کنه — دقیقاً همون مدلی که این کد
 * (http.Server خام + کتابخانه‌ی ws) از اول براش نوشته شده بود. یعنی هیچ‌کدوم
 * از محدودیت‌های Vercel که در api/server.js قبلی مستندسازی شده بودن اینجا
 * وجود ندارن:
 *   - سقف زمانی روی اتصال WebSocket نیست؛ اتصال VLESS تا وقتی کلاینت یا
 *     سرور نبنده‌ش باز می‌مونه (نه محدود به ۳۰ دقیقه).
 *   - نیازی به فعال‌سازی «Fluid Compute» یا «Extended function duration»
 *     (Beta) نیست — این‌ها فقط مفاهیم Vercel بودن.
 *
 * منطق خودِ برنامه (روتینگ در src/index.js، رله‌ی VLESS در src/wsrelay.js،
 * ذخیره‌سازی در src/store.js و بقیه) عیناً بدون هیچ تغییری همینه که بود؛
 * این فایل فقط همون http.Server رو می‌سازه و روی PORT گوش می‌ده.
 */
import http from "node:http";
import { WebSocketServer } from "ws";
import app from "./src/index.js";
import { runSession, clientIpFromNodeRequest } from "./src/wsrelay.js";
import { nodeRequestToWebRequest, sendWebResponse } from "./src/webadapter.js";

const WS_PATH = "/ws";

const server = http.createServer(async (req, res) => {
  try {
    const webRequest = await nodeRequestToWebRequest(req);
    const ctx = { waitUntil: (p) => { Promise.resolve(p).catch(() => {}); } };
    const response = await app.fetch(webRequest, process.env, ctx);
    await sendWebResponse(res, response);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ detail: err && err.message ? err.message : "internal error" }));
  }
});

// perMessageDeflate خاموشه: ترافیک VLESS از قبل رمزنگاری‌شده (تصادفی/بی‌الگو)
// است، پس فشرده‌سازی نه‌تنها چیزی رو کوچیک‌تر نمی‌کنه، بلکه هم CPU مصرف
// می‌کنه و هم تأخیر اضافه می‌کنه.
const wss = new WebSocketServer({ noServer: true, perMessageDeflate: false });

server.on("upgrade", (req, socket, head) => {
  const path = (req.url || "").split("?")[0];
  if (path !== WS_PATH) {
    socket.destroy();
    return;
  }
  socket.setNoDelay(true); // خاموش کردن الگوریتم Nagle: بسته‌های کوچیک رو فوری بفرست
  wss.handleUpgrade(req, socket, head, (ws) => {
    const clientIp = clientIpFromNodeRequest(req);
    runSession(ws, clientIp).catch(() => {
      try {
        ws.close(1011, "internal error");
      } catch {
        /* ignore */
      }
    });
  });
});

// Railway پورت گوش‌دادن رو از طریق متغیر محیطی PORT تزریق می‌کنه؛ باید
// حتماً روی 0.0.0.0 بایند بشه (نه localhost/127.0.0.1) تا ترافیک ورودی از
// بیرون container بهش برسه.
const port = Number(process.env.PORT) || 3000;
server.listen(port, "0.0.0.0", () => {
  console.log(`Chop server listening on 0.0.0.0:${port} (ws path: ${WS_PATH})`);
});

export default server;
