// uso: node tools/review-all.mjs <width> <height> <maxShotsPerPage> [rotas separadas por vírgula]
// Captura várias rotas, reporta erros de console e overflow horizontal.
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
let puppeteer;
try { puppeteer = require('puppeteer-core'); } catch { puppeteer = require('C:/Estudo/Claude/ink-studio/node_modules/puppeteer-core'); }
const [w = '1440', h = '900', max = '3', only] = process.argv.slice(2);
const routes = only ? only.split(',') : ['/', '/planos', '/empresas', '/cobertura', '/internet-fibra', '/internet-fibra/santa-aurora', '/internet-fibra/monte-alvo', '/teste-de-velocidade', '/status', '/suporte', '/segunda-via', '/sobre', '/contato', '/assine', '/trabalhe-conosco', '/politica-de-privacidade', '/termos-de-uso', '/rota-inexistente', '/area-do-cliente'];
const out = `.shots/${w}`;
fs.mkdirSync(out, { recursive: true });
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
const p = await b.newPage();
const errs = [];
p.on('pageerror', e => errs.push(`[${p.url()}] pageerror: ${e.message}`));
p.on('console', m => { if (m.type() === 'error' && !m.text().includes('404')) errs.push(`[${p.url()}] console: ${m.text()}`); });
await p.setViewport({ width: +w, height: +h, isMobile: +w < 768, hasTouch: +w < 768 });
await p.evaluateOnNewDocument(() => {
  localStorage.setItem('vf:consent', JSON.stringify({ essential: true, analytics: false, marketing: false, decidedAt: 'x' }));
  sessionStorage.setItem('vf:session', JSON.stringify({ customerId: 'c-10482' }));
});
for (const r of routes) {
  await p.goto('http://localhost:3016' + r, { waitUntil: 'networkidle0', timeout: 180000 });
  await new Promise(res => setTimeout(res, 1200));
  const info = await p.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const inFixed = el => { for (let e = el; e; e = e.parentElement) if (getComputedStyle(e).position === 'fixed') return true; return false; };
    const offenders = [...document.querySelectorAll('body *')].filter(el => { const rc = el.getBoundingClientRect(); return rc.right > vw + 1 && rc.width > 0 && !inFixed(el); }).slice(0, 5).map(el => el.tagName.toLowerCase() + '.' + [...el.classList].join('.'));
    return { sw: document.documentElement.scrollWidth, vw, total: document.documentElement.scrollHeight, h1: document.querySelectorAll('h1').length, title: document.title, offenders };
  });
  const name = r === '/' ? 'home' : r.slice(1).replace(/\//g, '_');
  let n = 0;
  for (let y = 0; y < info.total && n < +max; y += +h - 60) {
    await p.evaluate(y => window.scrollTo(0, y), y);
    await new Promise(res => setTimeout(res, 700));
    await p.screenshot({ path: `${out}/${name}-${n++}.png` });
  }
  console.log(`${r} | title="${info.title}" | h1=${info.h1} | overflow=${info.sw > info.vw ? 'YES ' + info.sw + ' ' + info.offenders.join(' ') : 'no'} | h=${info.total}`);
}
console.log(errs.join('\n') || 'no errors');
await b.close();
