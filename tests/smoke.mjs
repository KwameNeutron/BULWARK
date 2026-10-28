#!/usr/bin/env node
/* Bulwark smoke test — drives the real app in headless Chromium at iPhone size.
 *
 *   node tests/smoke.mjs
 *
 * Needs Playwright with Chromium, installed either locally or globally
 * (npm i -g playwright && npx playwright install chromium). No other deps:
 * it serves the repo root itself on a random localhost port.
 * Exit code 0 = all checks passed.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function loadPlaywright() {
  try { return await import('playwright'); } catch {}
  // createRequire also searches NODE_PATH / global installs, which ESM import does not.
  try { return createRequire(import.meta.url)('playwright'); } catch {}
  console.error('Playwright not found. Install it: npm i -g playwright && npx playwright install chromium');
  process.exit(2);
}
const { chromium, devices } = await loadPlaywright();

/* ---- tiny static server ---- */
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.webmanifest': 'application/manifest+json', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}/`;

/* ---- harness ---- */
let failed = 0;
const results = [];
async function check(name, fn) {
  try { await fn(); results.push(`  ✓ ${name}`); }
  catch (e) { failed++; results.push(`  ✗ ${name}\n      ${String(e.message || e).split('\n')[0]}`); }
}
const assert = (cond, msg) => { if (!cond) throw new Error(msg); };

const browser = await chromium.launch();
const PICKS = ['suitcasecarry', 'pallof', 'glutebridge', 'seatedrow', 'machinepress']; // deliberately not slot order

async function newPhone(device = 'iPhone 13', opts = {}) {
  const ctx = await browser.newContext({ ...devices[device], timezoneId: 'America/New_York', ...opts });
  ctx.setDefaultTimeout(5000);   // fail fast instead of Playwright's 30 s
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('dialog', d => d.accept());
  return { ctx, page, errors };
}
async function setup(page) {
  await page.goto(BASE + 'index.html');
  for (const id of PICKS) await page.click('#opt-' + id);
  await page.click('#saveBtn');
}
async function logAll(page) {
  for (let r = 0; r < 3; r++) {
    await page.locator('.rpill').nth(r).click();
    while (await page.locator('.logbtn').count()) {
      await page.locator('.logbtn').first().click();
      await page.evaluate(() => skipRest());
    }
  }
}
async function tapTargetsOK(page) {
  const small = await page.evaluate(() => [...document.querySelectorAll('button,[role=button],select,textarea')]
    .filter(el => el.offsetParent)
    .map(el => { const r = el.getBoundingClientRect(); return { t: (el.getAttribute('aria-label') || el.textContent).trim().slice(0, 20), w: r.width, h: r.height }; })
    .filter(x => x.w < 44 || x.h < 44));
  assert(!small.length, 'targets under 44px: ' + JSON.stringify(small));
}
const noHScroll = page => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)
  .then(ok => assert(ok, 'page scrolls horizontally'));

/* ================= main flow ================= */
const A = await newPhone();
let backup;

await check('Setup: pick 5 moves, Save enables, Train lists them in slot order', async () => {
  await setup(A.page);
  const names = await A.page.$$eval('.ex .name', n => n.map(x => x.textContent));
  assert(names.join() === 'Pallof Press,Glute Bridge,Seated Cable Row,Machine Chest Press,Suitcase Carry', names.join());
  await tapTargetsOK(A.page);
  await noHScroll(A.page);
});

await check('Train: ＋ on a bodyweight move switches BW to a weight', async () => {
  await A.page.locator('.card.ex').nth(1).getByRole('button', { name: /Add 5 lb/ }).click();
  assert(await A.page.textContent('#w-glutebridge') === '5', 'expected 5 lb');
  await A.page.getByRole('button', { name: '5 lb less for Glute Bridge' }).click();
  assert(await A.page.locator('.card.ex').nth(1).locator('.val').first().textContent() === 'BW', 'back to BW at 0');
});

await check('Train: adjusted values survive logging a different move', async () => {
  await A.page.getByRole('button', { name: '5 lb more for Pallof Press' }).click();
  await A.page.getByRole('button', { name: /Log Suitcase Carry/ }).click();
  assert(await A.page.textContent('#w-pallof') === '20', 'Pallof weight was reset');
});

await check('Train: rest timer starts and does not cover the last card', async () => {
  assert(await A.page.isVisible('#timer'), 'timer not shown after logging');
  await A.page.evaluate(() => scrollTo(0, document.body.scrollHeight));
  const covered = await A.page.evaluate(() => {
    const cards = document.querySelectorAll('#app .card'); const last = cards[cards.length - 1].getBoundingClientRect();
    return last.bottom > document.getElementById('timer').getBoundingClientRect().top;
  });
  assert(!covered, 'last card is under the timer');
  await A.page.click('#timer button');
  assert(!(await A.page.isVisible('#timer')), 'Skip did not hide timer');
});

await check('Train: log all 15 sets, finish and save session', async () => {
  await logAll(A.page);
  assert((await A.page.textContent('.ring text')) === '15/15', 'ring not 15/15');
  await A.page.click('text=Finish & save session');
  await A.page.waitForSelector('text=Session saved ✓');
});

await check('History: session, progress card and backup JSON', async () => {
  await A.page.click('nav button[data-v=history]');
  await A.page.waitForSelector('text=1 session');
  assert(await A.page.locator('.spark').count() === 5, 'expected 5 sparklines');
  backup = JSON.parse(await A.page.inputValue('#io'));
  assert(backup.log.length === 1 && backup.prefs.picks.core === 'pallof', 'backup JSON incomplete');
  assert(backup.log[0].entries.pallof[0].w === 20, 'logged adjusted weight missing from backup');
  await tapTargetsOK(A.page);
});

await check('Info: renders, version matches sw.js', async () => {
  await A.page.click('nav button[data-v=info]');
  const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8').match(/VERSION = '([^']+)'/)[1];
  await A.page.waitForSelector(`text=Bulwark v${sw}`);
});

await check('Setup: change rest time persists', async () => {
  await A.page.click('nav button[data-v=setup]');
  await A.page.selectOption('#restSel', '90');
  await A.page.reload();
  assert(await A.page.evaluate(() => prefs.rest) === 90, 'rest not saved');
});

await check('Offline: works from the service-worker cache', async () => {
  await A.page.evaluate(() => navigator.serviceWorker.ready);
  await A.page.reload();                       // now controlled by the worker
  await A.ctx.setOffline(true);
  await A.page.reload();
  await A.page.waitForSelector('nav button[data-v=train]');
  assert((await A.page.textContent('#app')).length > 50, 'empty page offline');
  await A.ctx.setOffline(false);
});

await check('Erase all data keeps other apps\' localStorage', async () => {
  await A.page.goto(BASE + 'index.html');
  await A.page.evaluate(() => localStorage.setItem('otherapp.key', 'keep'));
  await A.page.click('nav button[data-v=setup]');
  await A.page.click('text=Erase all data');
  await A.page.waitForSelector('#saveBtn');
  const keys = await A.page.evaluate(() => Object.keys(localStorage));
  assert(keys.includes('otherapp.key'), 'foreign key was wiped');
  assert(!keys.some(k => k === 'bw.log'), 'bw.log survived erase');
});

await check('Main flow: no console or page errors', async () => {
  assert(!A.errors.length, A.errors.join(' | '));
});
await A.ctx.close();

/* ================= restore / robustness ================= */
await check('Fresh phone: import backup restores everything', async () => {
  const B = await newPhone();
  await setup(B.page);
  await B.page.click('nav button[data-v=history]');
  await B.page.fill('#io', JSON.stringify(backup));
  await B.page.click('text=Import pasted backup');
  await B.page.waitForSelector('text=1 session');
  assert(!B.errors.length, B.errors.join(' | '));
  await B.ctx.close();
});

await check('Bad import: invalid picks + HTML in values → no crash, no injection', async () => {
  const C = await newPhone();
  await setup(C.page);
  await C.page.click('nav button[data-v=history]');
  await C.page.fill('#io', JSON.stringify({ prefs: { rest: 75, picks: { core: 'nope' } },
    log: [{ date: '2026-01-01', entries: { pallof: [null, { w: '<img src=x id=pwn>', r: 1 }] } }] }));
  await C.page.click('text=Import pasted backup');
  await C.page.waitForSelector('#saveBtn');   // incomplete picks → back to Setup
  for (const id of PICKS) await C.page.click('#opt-' + id);
  await C.page.click('#saveBtn');
  await C.page.click('nav button[data-v=history]');
  assert(await C.page.locator('#pwn').count() === 0, 'HTML from backup was rendered');
  assert(!C.errors.length, C.errors.join(' | '));
  await C.ctx.close();
});

await check('Corrupted storage: banner shown, original kept, app usable', async () => {
  const D = await newPhone();
  await setup(D.page);
  await D.page.evaluate(() => localStorage.setItem('bw.log', '{not json'));
  await D.page.reload();
  await D.page.waitForSelector('.notice');
  const keys = await D.page.evaluate(() => Object.keys(localStorage));
  assert(keys.some(k => k.startsWith('bw.corrupt.log.')), 'corrupted data not set aside');
  await D.page.locator('.logbtn').first().click();
  assert(!D.errors.length, D.errors.join(' | '));
  await D.ctx.close();
});

await check('Storage blocked: app still renders and warns', async () => {
  const E = await newPhone();
  await E.page.addInitScript(() => {
    Storage.prototype.setItem = () => { throw new DOMException('QuotaExceededError'); };
  });
  await setup(E.page);
  await E.page.waitForSelector('.notice');
  await E.page.locator('.logbtn').first().click();
  assert(!E.errors.length, E.errors.join(' | '));
  await E.ctx.close();
});

await check('Evening ET: 9:30 PM still counts as today (not tomorrow UTC)', async () => {
  const F = await newPhone();
  await F.page.clock.setFixedTime(new Date('2026-10-29T01:30:00Z')); // 9:30 PM EDT Oct 28
  await setup(F.page);
  await F.page.locator('.logbtn').first().click();
  assert(await F.page.evaluate(() => active.date) === '2026-10-28', 'session dated in UTC');
  await F.ctx.close();
});

await check('320px phone (iPhone SE): no horizontal scroll, targets ≥44px', async () => {
  const G = await newPhone('iPhone SE');
  await setup(G.page);
  await noHScroll(G.page);
  await tapTargetsOK(G.page);
  await G.ctx.close();
});

await browser.close();
server.close();
console.log(results.join('\n'));
console.log(failed ? `\nFAIL — ${failed} check(s) failed` : `\nPASS — ${results.length} checks`);
process.exit(failed ? 1 : 0);
