// Captura elementos específicos. uso: node tools/el.mjs <width> <path>::<selector>::<arquivo> [...]
// Ex.: node tools/el.mjs 1440 "/::.hero::hero" "/planos::.plans-grid::planos"
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
let puppeteer;
try { puppeteer = require("puppeteer-core"); } catch { puppeteer = require("C:/Estudo/Claude/ink-studio/node_modules/puppeteer-core"); }
const [w, ...jobs] = process.argv.slice(2);
const W = +w;
fs.mkdirSync(".shots/el", { recursive: true });
const b = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new" });
const p = await b.newPage();
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => { if (m.type() === "error" && !m.text().includes("404")) errs.push("console: " + m.text()); });
await p.setViewport({ width: W, height: W < 768 ? 844 : 900, isMobile: W < 768, hasTouch: W < 768 });
await p.evaluateOnNewDocument(() => {
  localStorage.setItem("vf:consent", JSON.stringify({ essential: true, analytics: false, marketing: false, decidedAt: "x" }));
  sessionStorage.setItem("vf:session", JSON.stringify({ customerId: "c-10482" }));
});
let last = "";
for (const job of jobs) {
  const [path, sel, name] = job.split("::");
  if (path !== last) {
    await p.goto("http://localhost:3016" + path, { waitUntil: "networkidle0", timeout: 180000 });
    await p.evaluate(() => document.querySelectorAll(".reveal").forEach((e) => e.classList.add("is-visible")));
    await new Promise((r) => setTimeout(r, 1500));
    last = path;
  }
  const el = await p.$(sel);
  if (!el) { console.log("missing", sel); continue; }
  await el.scrollIntoView();
  await new Promise((r) => setTimeout(r, 500));
  await el.screenshot({ path: `.shots/el/${name}-${W}.png` });
  console.log("ok", name);
}
console.log(errs.join("\n") || "no errors");
await b.close();
