/* Binod World portal — production script. Live UBC time, year wheel and menu; content is pre-rendered per page. */
(() => {
'use strict';
const D = window.BW, E = window.CalendarEngine;
const BASE = document.body.dataset.base || '';
const R = (n) => (n === 'home' ? (BASE || './') : BASE + n + '/');
const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = (n) => Number(n).toLocaleString('en-US');
const p2 = (n) => String(n).padStart(2, '0');
const NS = 'http://www.w3.org/2000/svg';
const polar = (cx, cy, r, deg) => { const a = (deg - 90) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };

/* ---------- emblem (13 ticks = 13 UBC months, 6 nodes = 6 nations, 8-point star = one world) ---------- */
(function drawEmblem() {
  const mk = (n, a) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); return e; };
  const t = $('#emb-ticks'), nd = $('#emb-nodes'), hx = $('#emb-hex');
  for (let i = 0; i < 13; i++) { const [x1, y1] = polar(50, 50, 39.6, i * 360 / 13), [x2, y2] = polar(50, 50, 44, i * 360 / 13); t.appendChild(mk('line', { x1, y1, x2, y2 })); }
  const pts = [];
  for (let i = 0; i < 6; i++) { const [x, y] = polar(50, 50, 25, i * 60); pts.push(x.toFixed(2) + ',' + y.toFixed(2)); nd.appendChild(mk('circle', { cx: x, cy: y, r: 2.6 })); }
  hx.appendChild(mk('polygon', { points: pts.join(' ') }));
})();

/* ---------- live time ---------- */
function atfInfo(nowMs) {
  const sh = new Date(nowMs + 5.5 * 3600e3);
  const secs = sh.getUTCHours() * 3600 + sh.getUTCMinutes() * 60 + sh.getUTCSeconds();
  const start = 20 * 3600, len = 7 * 3600, hms = (s) => `${p2(Math.floor(s / 3600))}:${p2(Math.floor(s % 3600 / 60))}:${p2(s % 60)}`;
  if (secs >= start || secs < 3 * 3600) { const el = secs >= start ? secs - start : secs + 86400 - start; return { active: true, text: 'Flow closes in ' + hms(len - el), pct: 100 * el / len }; }
  const until = start - secs; return { active: false, text: 'Flow opens in ' + hms(until) + ' (20:00 IST)', pct: 100 * (1 - until / (17 * 3600)) };
}
function earthLong(isoDate) { const [y, m, d] = isoDate.split('-').map(Number); const dt = new Date(Date.UTC(y, m - 1, d)); return dt.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }); }

let lastWheelKey = '';
function tick() {
  const st = E.computeState(), u = st.ubc, a = atfInfo(st.nowUtcMs);
  const set = (k, v) => document.querySelectorAll(`[data-live="${k}"]`).forEach((e) => { if (e.textContent !== v) e.textContent = v; });
  set('ubcDate', u.fullDate); set('ubcLong', `${u.weekdayName} · ${u.day} ${u.monthName} · Year ${u.year}`);
  set('ubcClock', `${p2(u.clock.hh)}:${p2(u.clock.mm)}:${p2(u.clock.ss)}`); set('earthDate', earthLong(st.ist.date)); set('earthTime', st.ist.time + ' IST');
  set('civilDay', fmt(u.N)); set('atfText', a.text); set('atfLabel', a.active ? 'ATF ACTIVE' : 'ATF PAUSED');
  set('chip', `UBC ${u.fullDate}`); set('bigYear', 'YEAR ' + u.year); set('bigMonth', `${u.monthName} · ${u.monthAbbr}`);
  document.querySelectorAll('[data-live="atfBadge"]').forEach((e) => { e.className = 'badge ' + (a.active ? 'on' : 'off'); });
  document.querySelectorAll('[data-live="atfBar"]').forEach((e) => { e.style.width = a.pct.toFixed(1) + '%'; });
  document.querySelectorAll('.dot').forEach((e) => e.classList.toggle('off', !a.active));
  document.querySelectorAll('.week div').forEach((e) => e.classList.toggle('now', e.dataset.w === u.weekdayName));
  const key = u.fullDate; if (key !== lastWheelKey) { lastWheelKey = key; document.querySelectorAll('[data-wheel]').forEach(drawWheel); }
  const chipTitle = $('#dateChip'); if (chipTitle) chipTitle.title = a.active ? 'Active Temporal Flow is running' : 'Calendar is paused until 20:00 IST';
}

/* ---------- year wheel ---------- */
function drawWheel(host) {
  const u = E.computeUBCDate(Date.now()), cx = 200, cy = 200, ro = 170, ri = 112, gap = 1.1, n = 13, seg = 360 / n;
  let s = `<svg viewBox="0 0 400 400" role="img" aria-label="Year wheel: 13 months of 28 days. Today is ${esc(u.fullDate)}, ${esc(u.monthName)}, day ${u.day}."><g class="wheel">`;
  for (let i = 0; i < n; i++) {
    const a0 = i * seg + gap / 2, a1 = (i + 1) * seg - gap / 2, [x0, y0] = polar(cx, cy, ro, a0), [x1, y1] = polar(cx, cy, ro, a1), [x2, y2] = polar(cx, cy, ri, a1), [x3, y3] = polar(cx, cy, ri, a0);
    const cur = i + 1 === u.month, past = i + 1 < u.month, [lx, ly] = polar(cx, cy, (ro + ri) / 2, (a0 + a1) / 2);
    s += `<path d="M${x0} ${y0} A${ro} ${ro} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${ri} ${ri} 0 0 0 ${x3} ${y3}Z" fill="${cur ? '#d8b755' : past ? '#1c3260' : '#101c38'}" stroke="${cur ? '#f3dc92' : 'rgba(201,168,76,.35)'}" stroke-width="1"/>`;
    s += `<text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle" font-size="11" font-weight="600" letter-spacing="1" fill="${cur ? '#1a1405' : '#c3ccdd'}" transform="rotate(${(a0 + a1) / 2} ${lx} ${ly})">${E.MONTHS[i][1]}</text>`;
  }
  const mid = (u.month - 1) * seg + gap / 2 + (seg - gap) * ((u.day - 0.5) / 28), [mx, my] = polar(cx, cy, ro + 11, mid);
  s += `<circle cx="${mx}" cy="${my}" r="5" fill="#f3dc92"/><circle cx="${mx}" cy="${my}" r="9" fill="none" stroke="#f3dc92" opacity=".5"/>`;
  s += `<text x="200" y="176" text-anchor="middle" font-size="12" letter-spacing="3" fill="#c9a84c">YEAR</text><text x="200" y="218" text-anchor="middle" font-family="Playfair Display,Georgia,serif" font-size="44" font-weight="700" fill="#f5f2ea">${u.year}</text>`;
  s += `<text x="200" y="244" text-anchor="middle" font-size="12" fill="#a9b4c8">${esc(u.fullDate)}</text></g></svg>`;
  host.innerHTML = s;
}

/* ---------- pieces ---------- */
const stLabel = { live: 'Live', opening: 'Opening', system: 'In-world system' };
function instCard(i, big) {
  const mark = i.seal ? `<img class="seal" src="${BASE}assets/img/${i.seal}" alt="" width="54" height="54">` : `<span class="vmark" aria-hidden="true">${i.id === 'vanta' ? 'V' : 'B'}</span>`;
  const head = `<div class="top">${mark}<div><h3>${esc(i.name)}</h3>${i.full ? `<div class="full">${esc(i.full)}</div>` : ''}</div></div>`;
  const foot = `<div class="foot"><span class="st ${i.status}">${stLabel[i.status]}</span><span>${i.host ? esc(i.host) : i.status === 'opening' ? 'Not yet published' : 'No public page'}</span></div>`;
  const body = `${head}<p>${esc(i.line)}</p>${foot}`;
  return i.url ? `<a class="card" style="--ac:${i.accent}" href="${i.url}">${body}</a>` : `<article class="card" style="--ac:${i.accent}">${body}</article>`;
}
const signalCard = () => `<article class="card signal" aria-label="Unknown signal"><div class="top"><span class="pulse" aria-hidden="true">?</span><div><h3>Unknown Signal</h3><div class="full">Source unidentified</div></div></div><p>A signal on the network that has not been identified.</p><div class="foot"><span class="st system" style="color:#b3a3ff;border-color:rgba(124,92,255,.45);background:rgba(124,92,255,.08)">Unidentified</span><span>No public page</span></div></article>`;
function nationCard(n, full) {
  const flag = `<img class="flag" src="${BASE}assets/img/flag-${n.id}.webp" alt="Flag of ${esc(n.name)}" width="400" height="250">`;
  if (!full) return `<a class="card nation" href="${R('world')}" aria-label="${esc(n.name)}">${flag}<h3>${esc(n.name)}</h3><p class="small">${esc(n.role)}</p></a>`;
  return `<article class="card nation" style="--ac:#c9a84c">${flag}<span class="tag">${esc(n.badge)}</span><h3>${esc(n.name)}</h3><dl><dt>Capital</dt><dd>${esc(n.capital)}</dd><dt>Role</dt><dd>${esc(n.role)}</dd><dt>Government</dt><dd>${esc(n.type)}</dd><dt>Established</dt><dd>${n.est}</dd><dt>Leader</dt><dd>${esc(n.leader)}</dd></dl></article>`;
}
function instrument(extra) {
  return `<div class="instrument" aria-label="World status instrument"><div class="ins-head"><span>World Status</span><span class="live-tag"><span class="dot" aria-hidden="true"></span>Live</span></div>
  <div class="ubc-big" data-live="ubcDate" aria-live="off">—</div><div class="ubc-sub" data-live="ubcLong"></div>
  <div class="dual"><div class="cell"><small>Binod World · UBC</small><strong data-live="ubcClock">—</strong><em>Civil day <span data-live="civilDay"></span></em></div>
  <div class="cell"><small>Earth · India time</small><strong data-live="earthTime">—</strong><em data-live="earthDate"></em></div></div>
  <div class="atf"><span class="badge off" data-live="atfBadge"><span data-live="atfLabel">ATF</span></span><span class="txt" data-live="atfText"></span></div>
  <div class="bar-track" aria-hidden="true"><div class="bar-fill" data-live="atfBar"></div></div>
  <div class="pres">World President <b>${esc(D.president.handle)}</b> · ${esc(D.president.nation)} · ${esc(D.president.term)}<br>In office since Day ${fmt(D.president.sinceDay)}</div>${extra || ''}</div>`;
}

/* relationships diagram (verified relationships only) */
function relDiagram() {
  const node = (x, y, w, t, sub, c) => `<g><rect x="${x - w / 2}" y="${y - 24}" width="${w}" height="48" rx="12" fill="#0d1a33" stroke="${c}" stroke-width="1.6"/><text x="${x}" y="${y - 3}" text-anchor="middle" font-size="14" font-weight="600" fill="#f5f2ea">${t}</text><text x="${x}" y="${y + 14}" text-anchor="middle" font-size="10.5" fill="#a9b4c8">${sub}</text></g>`;
  const lbl = (x, y, t, anchor) => `<text x="${x}" y="${y}" text-anchor="${anchor || 'middle'}" font-size="11.5" fill="#c3ccdd" paint-order="stroke" stroke="#0a1426" stroke-width="4">${t}</text>`;
  return `<svg viewBox="0 0 900 450" role="img" aria-labelledby="reld"><title id="reld">How the institutions connect</title>
  <desc id="relx">Government contains the Office of the President and six member nations. RIID reports to the Office of the President. BIASR is named keeper of the Unified Binod Calendar by LAW-008. BINOVA operates within BIASR. VANTA indexes the public records of the Government, BIASR and RIID.</desc>
  <g fill="none" stroke-width="2">
    <path d="M450 79 L450 126" stroke="#c9a84c"/><path d="M350 55 L250 55" stroke="#c9a84c"/>
    <path d="M450 174 C450 230 700 200 700 246" stroke="#c9a84c"/>
    <path d="M350 60 C240 70 200 150 200 246" stroke="#c9a84c"/>
    <path d="M200 294 L200 356" stroke="#c9a84c"/>
    <path d="M545 405 C880 410 880 90 550 58" stroke="#9b7cff" stroke-dasharray="6 6"/>
    <path d="M360 405 C250 405 215 380 205 300" stroke="#9b7cff" stroke-dasharray="6 6" opacity="0"/>
    <path d="M450 380 C450 330 700 340 700 296" stroke="#9b7cff" stroke-dasharray="6 6"/>
    <path d="M395 392 C300 380 250 330 235 296" stroke="#9b7cff" stroke-dasharray="6 6"/>
  </g>
  ${node(450, 55, 200, 'Binod World Government', 'Parent institution', '#c9a84c')}
  ${node(450, 150, 200, 'Office of the President', 'World President ' + esc(D.president.handle), '#c9a84c')}
  ${node(150, 55, 170, 'Six Nations', 'Member states', '#c9a84c')}
  ${node(200, 270, 220, 'BIASR', 'Astronomical &amp; Space Research', '#5b83ff')}
  ${node(700, 270, 220, 'RIID', 'Intelligence &amp; Investigation', '#1fd6c9')}
  ${node(200, 380, 220, 'BINOVA', 'Opening · not yet published', '#d9b86a')}
  ${node(450, 405, 190, 'VANTA', 'Public search', '#9b7cff')}
  ${lbl(560, 214, 'RIID reports to the Office of the President', 'start')}
  ${lbl(218, 214, 'LAW-008 names BIASR keeper of the UBC', 'start')}
  ${lbl(214, 332, 'BINOVA operates within BIASR', 'start')}
  ${lbl(690, 108, 'VANTA indexes public records', 'end')}
  </svg>`;
}
const relList = () => `<ul class="prov rel-list"><li><b>Government</b> includes the Office of the President and the six member nations.</li><li><b>RIID</b> reports to the Office of the President.</li><li><b>BIASR</b> is named keeper of the Unified Binod Calendar by LAW-008.</li><li><b>BINOVA</b> operates within BIASR (opening; not yet published).</li><li><b>VANTA</b> indexes the public records of the Government, BIASR and RIID.</li></ul>`;
const relBlock = () => `<div class="diagram">${relDiagram()}<div class="legend"><span>Structure</span><span class="dash">Search coverage</span></div>${relList()}</div>`;

const feed = () => `<ol class="feed">${D.developments.map((d) => `<li><div class="meta"><b>${esc(d.tag)}</b>${esc(d.when)}</div><a href="${d.href}">${esc(d.title)}</a><div class="by">${esc(d.by)}</div></li>`).join('')}</ol>`;
const timeline = () => `<ol class="tl">${D.timeline.map((t) => `<li class="${t.ubc ? 'ubc' : ''}"><b>${t.y}</b><span>${esc(t.t)}</span></li>`).join('')}</ol>`;
const records = () => `<div class="grid records">${D.records.map((r) => `<a class="card" href="${r.u}"><div class="n">${esc(r.n)}</div><div class="c">${esc(r.c)}</div></a>`).join('')}</div>`;
const secHead = (eb, h, p) => `<div class="sec-head"><span class="eyebrow">${eb}</span><h2>${h}</h2>${p ? `<p>${p}</p>` : ''}</div>`;

/* ---------- views ---------- */
const views = {
  home: () => `<div class="view">
  <section class="hero" aria-labelledby="h1"><div class="sky" aria-hidden="true">${sky()}</div>
    <div class="wrap hero-grid"><div><span class="eyebrow">The central gateway</span>
      <h1 id="h1">Binod World<span>An observatory of a civilization</span></h1>
      <p class="motto">${esc(D.motto)}</p>
      <p class="lede">One world, six nations, and the institutions that govern, study and record it — all in one place. The date below is not Earth's: it is the world's own.</p>
      <div class="cta"><a class="btn primary" href="${R('institutions')}">Explore the institutions</a><a class="btn" href="${R('world')}">Enter the world</a></div></div>
      ${instrument()}</div></section>
  <section class="s" aria-labelledby="h-inst"><div class="wrap">${secHead('Institutions', '<span id="h-inst">One sky, several worlds</span>', 'Each institution keeps its own seal, colour and voice. The gateway only connects them.')}
    <div class="grid g3">${D.institutions.map((i) => instCard(i)).join('')}${signalCard()}</div></div></section>
  <section class="s" aria-labelledby="h-rel"><div class="wrap">${secHead('Structure', '<span id="h-rel">How they connect</span>', 'Only relationships that are written down in the institutions’ own records are drawn here.')}${relBlock()}</div></section>
  <section class="s" aria-labelledby="h-nat"><div class="wrap">${secHead('The nations', '<span id="h-nat">Six nations, one world</span>')}
    <div class="grid nations-strip">${D.nations.map((n) => nationCard(n)).join('')}</div>
    <div class="stats"><div class="stat"><b>${D.counts.nations}</b><span>Nations</span></div><div class="stat"><b>${D.counts.laws}</b><span>Laws on record</span></div><div class="stat"><b>${D.counts.whitePapers}</b><span>White papers</span></div><div class="stat"><b>${D.counts.pressReleases}</b><span>Press releases</span></div></div></div></section>
  <section class="s" aria-labelledby="h-dev"><div class="wrap">${secHead('Recent developments', '<span id="h-dev">Latest from the records</span>', 'Snapshot of the government register, as of ' + D.asOf.label + '.')}${feed()}</div></section>
  <section class="s" aria-labelledby="h-tl"><div class="wrap">${secHead('Timeline', '<span id="h-tl">A civilization in dates</span>')}${timeline()}</div></section>
  <section class="s" aria-labelledby="h-rec"><div class="wrap">${secHead('Records', '<span id="h-rec">The public record</span>', 'Official publications live with the Government. Search all of them with VANTA.')}${records()}
    <div class="cta"><a class="btn primary" href="https://gov.binodworld.in/vanta/">Search with VANTA</a></div></div></section></div>`,

  institutions: () => `<div class="view"><div class="wrap page-hero"><span class="eyebrow">Institutions</span><h1 style="font-size:clamp(2rem,5vw,3.4rem)">The institutions of Binod World</h1><p class="lede" style="margin-top:1rem">Each institution has its own purpose, address and state. Their descriptions are the ones they use about themselves.</p></div>
  <section class="s" style="border:0" aria-label="Institutions"><div class="wrap"><h2 class="sr">The institutions</h2><div class="grid g2">${D.institutions.map((i) => instCard(i)).join('')}${signalCard()}</div></div></section>
  <section class="s" aria-labelledby="h-where"><div class="wrap">${secHead('Directory', '<span id="h-where">Where to find each one</span>')}
    <div class="tablewrap" role="region" tabindex="0" aria-label="Institution directory"><table class="t"><thead><tr><th scope="col">Institution</th><th scope="col">Address</th><th scope="col">State</th></tr></thead><tbody>
    ${D.institutions.map((i) => `<tr><th scope="row" style="color:var(--cream);font:600 .95rem var(--sans);letter-spacing:0;text-transform:none">${esc(i.name)}</th><td>${i.host ? `<a href="${i.url}">${esc(i.host)}</a>` : '<span style="color:var(--faint)">—</span>'}</td><td><span class="st ${i.status}">${stLabel[i.status]}</span></td></tr>`).join('')}
    </tbody></table></div>
    <p class="small" style="margin-top:1rem"><b>Live</b>: open and public. <b>Opening</b>: finished, not yet published. <b>In-world system</b>: exists inside the world, with no public page.</p></div></section>
  <section class="s" aria-labelledby="h-rel2"><div class="wrap">${secHead('Structure', '<span id="h-rel2">How they connect</span>')}${relBlock()}</div></section></div>`,

  world: () => `<div class="view"><div class="wrap page-hero"><span class="eyebrow">The World</span><h1 style="font-size:clamp(2rem,5vw,3.4rem)">Six nations. One world.</h1><p class="lede" style="margin-top:1rem">${esc(D.motto)}. Founded in 2014, the Binod World is governed under a constitution, with a World President chosen by election.</p></div>
  <section class="s" style="border:0" aria-labelledby="h-nn"><div class="wrap">${secHead('Nations', '<span id="h-nn">The six nations</span>', 'Leaders are as listed in the government register (' + D.asOf.label + ').')}<div class="grid g3">${D.nations.map((n) => nationCard(n, true)).join('')}</div></div></section>
  <section class="s" aria-labelledby="h-cal"><div class="wrap">${secHead('The calendar', '<span id="h-cal">The world keeps its own time</span>', 'The Unified Binod Calendar has 13 months of 28 days — a 364-day year — and runs only while the world is awake: during the Active Temporal Flow, 20:00 to 03:00 IST, at 20 real minutes per civil day. BIASR is its keeper.')}
    <div class="wheel-wrap"><div data-wheel aria-live="off"></div><div><div class="ubc-big" data-live="ubcDate">—</div><div class="ubc-sub" data-live="ubcLong"></div>
    <div class="week" aria-label="Weekdays">${E.WEEKDAYS.map((w) => `<div data-w="${esc(w[0])}">${esc(w[0])}</div>`).join('')}</div>
    <p class="small" style="margin-top:1rem">The Founding Epoch is 23 April 2021, 20:00 IST — day 01 of ${esc(E.MONTHS[0][0])}, Year 1.</p></div></div></div></section>
  <section class="s" aria-labelledby="h-tl2"><div class="wrap">${secHead('Timeline', '<span id="h-tl2">A civilization in dates</span>')}${timeline()}</div></section>
  <section class="s" aria-labelledby="h-gv"><div class="wrap">${secHead('Government', '<span id="h-gv">The public record</span>')}${records()}</div></section></div>`,

  status: () => `<div class="view"><div class="wrap page-hero"><span class="eyebrow">Status</span><h1 style="font-size:clamp(2rem,5vw,3.4rem)">World status</h1><p class="lede" style="margin-top:1rem">What time it is in Binod World, whether the world is awake, and how fresh the information on this gateway is.</p></div>
  <section class="s" style="border:0"><div class="wrap"><div class="grid g2" style="align-items:start">${instrument()}<div class="diagram"><div data-wheel aria-live="off"></div><div class="week" aria-label="Weekdays">${E.WEEKDAYS.map((w) => `<div data-w="${esc(w[0])}">${esc(w[0])}</div>`).join('')}</div></div></div></div></section>
  <section class="s" aria-labelledby="h-st"><div class="wrap">${secHead('Services', '<span id="h-st">Institutions at a glance</span>')}
    <div class="tablewrap" role="region" tabindex="0" aria-label="Institution states"><table class="t"><thead><tr><th scope="col">Institution</th><th scope="col">State</th><th scope="col">Address</th></tr></thead><tbody>
    ${D.institutions.map((i) => `<tr><th scope="row" style="color:var(--cream);font:600 .95rem var(--sans);letter-spacing:0;text-transform:none">${esc(i.name)}</th><td><span class="st ${i.status}">${stLabel[i.status]}</span></td><td>${i.host ? esc(i.host) : '—'}</td></tr>`).join('')}</tbody></table></div></div></section>
  <section class="s" aria-labelledby="h-fresh"><div class="wrap">${secHead('Freshness', '<span id="h-fresh">What is live, what is a snapshot</span>')}
    <div class="grid g2"><div class="note"><b>Live in your browser.</b> The UBC date and clock, the Active Temporal Flow state and the Earth (India) time are computed on this page from the official UBC Standard v2.0.0 engine. They need no server.</div>
    <div class="note"><b>Snapshot.</b> Nations, leaders, laws, press releases and the president are copied from the government register as of <b>${D.asOf.label}</b> (${esc(D.asOf.note)}). They change only when the gateway is republished.</div></div></div></section></div>`
};

function sky() {
  let st = '', seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 70; i++) st += `<circle cx="${(rnd() * 900).toFixed(0)}" cy="${(rnd() * 900).toFixed(0)}" r="${(0.5 + rnd() * 1.4).toFixed(1)}" fill="#f3e7bd" opacity="${(0.25 + rnd() * 0.6).toFixed(2)}"/>`;
  let ticks = '', nodes = '', hx = [];
  for (let i = 0; i < 13; i++) { const [x1, y1] = polar(450, 450, 366, i * 360 / 13), [x2, y2] = polar(450, 450, 392, i * 360 / 13); ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`; }
  for (let i = 0; i < 6; i++) { const [x, y] = polar(450, 450, 250, i * 60); hx.push(x + ',' + y); nodes += `<circle cx="${x}" cy="${y}" r="6"/>`; }
  return `<svg viewBox="0 0 900 900" fill="none" stroke="#c9a84c" stroke-width="1.2" aria-hidden="true">${st}<g class="ring"><circle cx="450" cy="450" r="440" opacity=".25"/><circle cx="450" cy="450" r="355" opacity=".3"/><g stroke-width="2" opacity=".6">${ticks}</g></g><g class="ring r2"><circle cx="450" cy="450" r="250" opacity=".28" stroke-dasharray="3 9"/><polygon points="${hx.join(' ')}" opacity=".32"/><g fill="#e8c96a" stroke="none" opacity=".8">${nodes}</g></g><circle cx="450" cy="450" r="150" opacity=".2"/></svg>`;
}

/* ---------- boot (pages are pre-rendered at build time; render here only as a fallback) ---------- */
const PAGE = document.body.dataset.page || 'home';
const main = $('#main');
if (!main.children.length) main.innerHTML = views[PAGE]();
document.querySelectorAll('#nav a').forEach((a) => { if (a.dataset.r === PAGE) a.setAttribute('aria-current', 'page'); });
$('#menuBtn').addEventListener('click', () => { const o = $('#nav').classList.toggle('open'); $('#menuBtn').setAttribute('aria-expanded', String(o)); });
tick(); setInterval(tick, 1000);
})();
