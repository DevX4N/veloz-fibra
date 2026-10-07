// Coleta todos os links internos das páginas e verifica status HTTP + âncoras.
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const puppeteer = require("C:/Estudo/Claude/ink-studio/node_modules/puppeteer-core");
const routes = ["/", "/planos", "/empresas", "/cobertura", "/internet-fibra", "/internet-fibra/santa-aurora", "/teste-de-velocidade", "/status", "/suporte", "/segunda-via", "/sobre", "/contato", "/assine", "/trabalhe-conosco", "/politica-de-privacidade", "/termos-de-uso", "/area-do-cliente", "/area-do-cliente/painel", "/area-do-cliente/internet", "/area-do-cliente/servicos"];
const b = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new" });
const p = await b.newPage();
await p.evaluateOnNewDocument(() => sessionStorage.setItem("vf:session", JSON.stringify({ customerId: "c-10482" })));
const links = new Set();
for (const r of routes) {
  await p.goto("http://localhost:3016" + r, { waitUntil: "networkidle0" });
  await new Promise((res) => setTimeout(res, 1200));
  (await p.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")))).forEach((h) => links.add(h));
}
const internal = [...links].filter((h) => h.startsWith("/") || h.startsWith("#"));
const external = [...links].filter((h) => !internal.includes(h));
let bad = 0;
for (const h of internal.filter((h) => h.startsWith("/"))) {
  const [path, hash] = h.split("#");
  const res = await fetch("http://localhost:3016" + path);
  let anchorOk = true;
  if (hash) {
    await p.goto("http://localhost:3016" + path, { waitUntil: "networkidle0" });
    await new Promise((res) => setTimeout(res, 900));
    anchorOk = await p.evaluate((id) => !!document.getElementById(id), hash);
  }
  if (res.status !== 200 || !anchorOk) { bad++; console.log("BROKEN", h, res.status, anchorOk ? "" : "(âncora ausente)"); }
}
console.log(`internos verificados: ${internal.length}, quebrados: ${bad}`);
console.log("externos:", [...new Set(external.map((e) => e.replace(/\?.*/, "")))].join("  "));
await b.close();
