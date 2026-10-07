// Testes de fluxo ponta a ponta (dados de teste fictícios). uso: node tools/flows.mjs [width] [only]
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
let puppeteer;
try { puppeteer = require("puppeteer-core"); } catch { puppeteer = require("C:/Estudo/Claude/ink-studio/node_modules/puppeteer-core"); }
const W = +(process.argv[2] || 1440), H = W < 768 ? 844 : 900;
const only = process.argv[3];
const out = `.shots/flows-${W}`;
fs.mkdirSync(out, { recursive: true });
const b = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new" });
const p = await b.newPage();
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => { if (m.type() === "error" && !m.text().includes("404")) errs.push("console: " + m.text()); });
await p.setViewport({ width: W, height: H, isMobile: W < 768, hasTouch: W < 768 });
await p.evaluateOnNewDocument(() => localStorage.setItem("vf:consent", JSON.stringify({ essential: true, analytics: false, marketing: false, decidedAt: "x" })));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const go = async (path) => { await p.goto("http://localhost:3016" + path, { waitUntil: "networkidle0", timeout: 120000 }); await wait(600); };
const shot = async (name, el) => {
  if (el) { const h = await p.$(el); if (h) { await h.scrollIntoView(); await p.evaluate(() => window.scrollBy(0, -90)); await wait(300); } }
  await p.screenshot({ path: `${out}/${name}.png` });
};
const clickText = async (text, sel = "button, a") => {
  const ok = await p.evaluate((text, sel) => {
    const el = [...document.querySelectorAll(sel)].find((e) => e.textContent.trim().includes(text) && e.offsetParent !== null && !e.disabled);
    if (el) { el.scrollIntoView({ block: "center" }); el.click(); return true; }
    return false;
  }, text, sel);
  if (!ok) throw new Error("not found: " + text);
};
const type = async (sel, text) => { await p.$eval(sel, (el) => { const set = Object.getOwnPropertyDescriptor(el.__proto__, "value").set; set.call(el, ""); el.dispatchEvent(new Event("input", { bubbles: true })); }); await p.type(sel, text); };
const waitText = (t, timeout = 9000) => p.waitForFunction((t) => document.body.innerText.includes(t), { timeout }, t);
const step = async (name, fn) => {
  if (only && !name.includes(only)) return;
  try { await fn(); console.log("OK  ", name); } catch (e) { console.log("FAIL", name, e.message); await shot("FAIL-" + name.replace(/\W+/g, "_")); }
};

await step("cobertura por bairro", async () => {
  await go("/cobertura");
  await p.select(".page-hero__aside select[name=city]", "santa-aurora");
  await p.select(".page-hero__aside select[name=neighborhood]", "santa-aurora:centro");
  await clickText("Consultar disponibilidade");
  await waitText("Temos cobertura!");
  await shot("01-cobertura-ok", ".coverage-result");
});
await step("cobertura por CEP expansao", async () => {
  await clickText("Fazer nova consulta");
  await clickText("Pelo endereço");
  await clickText("12950-300");
  await clickText("Consultar cobertura", "button[type=submit]");
  await waitText("Estamos chegando!");
  await clickText("Quero ser avisado");
  await wait(300);
  await shot("02-expansao-erros", ".coverage-result");
});
await step("erro de consulta", async () => {
  await clickText("Fazer nova consulta");
  await clickText("Pelo endereço");
  await type(".page-hero__aside input[name=cep]", "00000000");
  await type(".page-hero__aside input[name=number]", "10");
  await clickText("Consultar cobertura", "button[type=submit]");
  await waitText("Não conseguimos consultar");
  await shot("03-cobertura-erro", ".coverage-form");
});
await step("contratacao completa", async () => {
  await go("/assine?plano=1000");
  await type("input[name=cep]", "12900100");
  await p.waitForFunction(() => document.querySelector("input[name=street]").value.length > 3, { timeout: 6000 });
  await type("input[name=number]", "128");
  await shot("04-assine-endereco", ".contract__card");
  await clickText("Verificar disponibilidade");
  await waitText("Ótimo! Temos cobertura");
  await shot("05-assine-plano", ".contract__card");
  await clickText("Continuar");
  await wait(400);
  await clickText("Continuar", "button[type=submit]");
  await wait(300);
  await shot("06-assine-erros", ".contract__card");
  await type("input[name=name]", "Carla Mendes Teste");
  await type("input[name=cpf]", "52998224725");
  await type("input[name=birthDate]", "12051990");
  await type("input[name=phone]", "00991234567");
  await type("input[name=email]", "carla.teste@example.com");
  await p.click("input[name=terms]");
  await clickText("Continuar", "button[type=submit]");
  await waitText("Agende sua instalação", 4000);
  const btn = await p.$(".slot__btn:not(:disabled)");
  await btn.click();
  await shot("07-assine-agenda", ".contract__card");
  await clickText("Continuar");
  await waitText("Confira seu pedido", 4000);
  await shot("08-assine-resumo", ".contract__card");
  await clickText("Finalizar contratação");
  await waitText("Pedido recebido!");
  await shot("09-assine-sucesso", ".contract__success");
});
await step("segunda via", async () => {
  await go("/segunda-via");
  await clickText("123.456.789-09");
  await waitText("Copiar código PIX");
  await clickText("Copiar código PIX");
  await wait(400);
  await shot("10-segunda-via", ".invoice");
  await p.evaluate(() => window.scrollTo(0, 0));
  await clickText("987.654.321-00");
  await waitText("Nenhuma fatura pendente");
  await shot("11-segunda-via-em-dia", ".lookup__result");
});
await step("speed test", async () => {
  await go("/teste-de-velocidade");
  await clickText("Iniciar teste");
  await wait(7000);
  await shot("12-speed-meio", ".speedtest");
  await waitText("excelente", 12000);
  await shot("13-speed-fim", ".speedtest");
});
await step("status cenarios", async () => {
  await go("/status");
  await waitText("Todos os sistemas");
  await clickText("Instabilidade", ".demo-switch button");
  await waitText("Instabilidade identificada em parte");
  await p.evaluate(() => window.scrollTo(0, 0));
  await wait(300);
  await shot("14-status-instavel");
  await clickText("Interrupção", ".demo-switch button");
  await waitText("Interrupção identificada em uma");
  await shot("15-status-queda", ".services");
  await clickText("Operando", ".demo-switch button");
  await wait(1500);
});
await step("suporte busca diagnostico", async () => {
  await go("/suporte");
  await p.type("#help-q", "roteador");
  await wait(400);
  await shot("16-suporte-busca", ".support__results");
  for (const el of await p.$$(".diag__step")) await el.click();
  await clickText("Sim, continua");
  await shot("17-diagnostico", ".diag");
});
await step("login painel", async () => {
  await go("/area-do-cliente/painel");
  await p.waitForFunction(() => location.pathname === "/area-do-cliente", { timeout: 8000 });
  await clickText("123.456.789-09");
  await clickText("Entrar", "button[type=submit]");
  await waitText("Olá, João", 15000);
  await wait(1500);
  await shot("18-painel");
  await p.click(".bell__btn");
  await wait(300);
  await shot("19-notificacoes");
  await p.click(".bell__btn");
});
await step("upgrade de plano", async () => {
  await go("/area-do-cliente/plano");
  await waitText("Planos disponíveis");
  await clickText("Fazer upgrade");
  await wait(400);
  await shot("20-upgrade-modal");
  await clickText("Confirmar upgrade");
  await waitText("Upgrade solicitado");
  await shot("21-upgrade-ok");
});
await step("abrir chamado", async () => {
  await go("/area-do-cliente/suporte");
  await waitText("Abrir atendimento");
  await wait(900);
  await shot("22-suporte-vazio");
  await p.select("select[name=subject]", "Internet lenta");
  await p.type("textarea[name=description]", "A velocidade cai bastante à noite no quarto.");
  await clickText("Abrir atendimento", "button[type=submit]");
  await waitText("Atendimento aberto");
  await shot("23-chamado-criado");
});
await step("telas do dashboard", async () => {
  for (const r of ["faturas", "internet", "servicos", "dados", "teste-de-velocidade"]) {
    await go("/area-do-cliente/" + r);
    await wait(1400);
    await shot("24-dash-" + r);
  }
});
console.log(errs.join("\n") || "no errors");
await b.close();
