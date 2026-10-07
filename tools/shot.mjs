// uso: node tools/shot.mjs <path> <outdir> [width=1440] [height=900] [maxShots=30]
// Captura a página em blocos do tamanho da viewport (revisão visual).
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let puppeteer;
try { puppeteer = require('puppeteer-core'); } catch { puppeteer = require('C:/Estudo/Claude/ink-studio/node_modules/puppeteer-core'); }
import fs from 'fs';
const [path = '/', out = 'shots', w = '1440', h = '900', max = '30'] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
const p = await b.newPage();
const errs = [];
p.on('pageerror', e => errs.push('pageerror: ' + e.message));
p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
await p.setViewport({ width: +w, height: +h, isMobile: +w < 768, hasTouch: +w < 768 });
await p.evaluateOnNewDocument(() => {
  localStorage.setItem('vf:consent', JSON.stringify({ essential: true, analytics: false, marketing: false, decidedAt: 'x' }));
});
await p.goto('http://localhost:3016/' + path.replace(/^\/+/, ''), { waitUntil: 'networkidle0', timeout: 180000 });
await new Promise(r => setTimeout(r, 1500));
const total = await p.evaluate(() => document.documentElement.scrollHeight);
const sw = await p.evaluate(() => document.documentElement.scrollWidth);
let n = 0;
for (let y = 0; y < total && n < +max; y += +h - 60) {
  await p.evaluate(y => window.scrollTo(0, y), y);
  await new Promise(r => setTimeout(r, 900));
  await p.screenshot({ path: `${out}/${String(n++).padStart(2, '0')}.png` });
}
console.log(errs.join('\n') || 'no errors', `\nheight ${total} scrollWidth ${sw} (viewport ${w}) shots ${n}`);
await b.close();
