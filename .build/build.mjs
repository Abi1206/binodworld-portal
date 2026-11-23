// Build the static portal: renders each page's content with the approved views (app.js) in real Chrome and writes
// plain HTML pages. Usage: node .build/build.mjs <path-to-node_modules-parent-with-playwright-core> <chrome.exe>
import { createRequire } from 'node:module'; import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.resolve(process.argv[2]) + path.sep); const { chromium } = require('playwright-core'); const CHROME = process.argv[3];
const TPL = fs.readFileSync(path.join(ROOT, '.build/template.html'), 'utf8');
const DESC = 'Binod World: the gateway to its government, institutions, nations and records. A fictional Minecraft world and roleplay civilization.';
const PAGES = [
  { page: 'home', dir: '', title: 'Binod World — The Central Gateway', desc: DESC, path: '/', base: '' },
  { page: 'institutions', dir: 'institutions', title: 'Institutions — Binod World', desc: 'The institutions of Binod World: the Government, BIASR, RIID, VANTA, BINOVA and BWSE, and how they connect.', path: '/institutions/', base: '../' },
  { page: 'world', dir: 'world', title: 'The World — Binod World', desc: 'Six nations, one world: the nations of Binod World, its calendar and its timeline.', path: '/world/', base: '../' },
  { page: 'status', dir: 'status', title: 'Status — Binod World', desc: 'World status: the Unified Binod Calendar date, Earth time and the Active Temporal Flow, live.', path: '/status/', base: '../' }
];
const fill = (p, main) => TPL.replace(/\{\{MAIN\}\}/g, () => main).replace(/\{\{(TITLE|DESC|PATH|BASE|PAGE)\}\}/g, (_, k) => ({ TITLE: p.title, DESC: p.desc, PATH: p.path, BASE: p.base, PAGE: p.page }[k]))
  .replace(/\{\{HOME\}\}/g, p.base || './').replace(/\{\{INST\}\}/g, p.base + 'institutions/').replace(/\{\{WORLD\}\}/g, p.base + 'world/').replace(/\{\{STATUS\}\}/g, p.base + 'status/').replace('data-r="' + p.page + '"', 'data-r="' + p.page + '" aria-current="page"');
const write = (rel, s) => { const f = path.join(ROOT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, s); };
// pass 1: empty shells
for (const p of PAGES) write(path.join(p.dir, 'index.html'), fill(p, ''));
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.png': 'image/png' };
const srv = http.createServer((q, r) => { let f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); if (!fs.existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(fs.readFileSync(f)); });
await new Promise((r) => srv.listen(0, '127.0.0.1', r)); const O = `http://127.0.0.1:${srv.address().port}`;
const b = await chromium.launch({ executablePath: CHROME }); const pg = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
const mains = {};
for (const p of PAGES) {
  await pg.goto(`${O}/${p.dir ? p.dir + '/' : ''}`); await pg.waitForTimeout(600);
  mains[p.page] = await pg.evaluate(() => { const m = document.querySelector('#main').cloneNode(true);
    m.querySelectorAll('[data-live]').forEach((e) => { e.textContent = ''; e.removeAttribute('style'); });
    m.querySelectorAll('[data-wheel]').forEach((e) => { e.innerHTML = ''; }); m.querySelectorAll('.week .now').forEach((e) => e.classList.remove('now'));
    m.querySelectorAll('.dot.off').forEach((e) => e.classList.remove('off')); m.querySelectorAll('[data-live="atfBadge"]').forEach((e) => { e.className = 'badge off'; });
    return m.innerHTML; });
}
// 404 page (root-absolute assets: it is served from arbitrary paths on the final domain)
const nf = { page: 'notfound', dir: '', title: 'Page not found — Binod World', desc: 'This page could not be found.', path: '/404.html', base: '/' };
const nfMain = '<div class="wrap page-hero" style="min-height:50vh"><span class="eyebrow">404</span><h1 style="font-size:clamp(2rem,5vw,3.4rem)">This signal leads nowhere</h1><p class="lede" style="margin-top:1rem">The page you were looking for is not part of the gateway.</p><div class="cta"><a class="btn primary" href="/">Return to the gateway</a></div></div>';
write('404.html', fill(nf, nfMain).replace('<meta name="description"', '<meta name="robots" content="noindex"><meta name="description"'));
for (const p of PAGES) write(path.join(p.dir, 'index.html'), fill(p, mains[p.page]));
// social / touch images from the approved emblem
const emb = fs.readFileSync(path.join(ROOT, 'assets/emblem.svg'), 'utf8');
const shot = async (w, h, html, out, omit) => { const c = await b.newContext({ viewport: { width: w, height: h } }); const q = await c.newPage(); await q.setContent(html); await q.waitForTimeout(300); await q.screenshot({ path: path.join(ROOT, out), omitBackground: !!omit }); await c.close(); };
const dataEmb = 'data:image/svg+xml;base64,' + Buffer.from(emb).toString('base64');
await shot(180, 180, `<body style="margin:0;background:#0a1628"><img src="${dataEmb}" style="width:180px;height:180px;display:block"></body>`, 'assets/apple-touch-icon.png');
await shot(1200, 630, `<body style="margin:0;width:1200px;height:630px;background:radial-gradient(900px 500px at 80% 0,#17306a,#060d1a 70%);display:flex;align-items:center;gap:56px;padding:0 90px;box-sizing:border-box;color:#f5f2ea;font-family:Georgia,serif"><img src="${dataEmb}" style="width:300px;height:300px"><div><div style="font-size:92px;font-weight:700;letter-spacing:.2em">BINOD</div><div style="font:600 30px system-ui;letter-spacing:.62em;color:#c9a84c;margin-top:6px">WORLD</div><div style="font-size:30px;color:#e8c96a;margin-top:44px">One World • Many Nations • Shared Prosperity</div></div></body>`, 'assets/og-image.png');
await b.close(); srv.close();
const urls = PAGES.map((p) => `  <url><loc>https://binodworld.in${p.path}</loc></url>`).join('\n');
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
write('robots.txt', 'User-agent: *\nAllow: /\n\nSitemap: https://binodworld.in/sitemap.xml\n');
write('.nojekyll', '');
console.log('built', PAGES.length, 'pages + 404');
