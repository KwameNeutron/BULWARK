/* Bump VERSION on every release (keep APP_VERSION in index.html in sync).
   Any byte change to this file makes installed phones fetch the new worker,
   which re-caches the assets and drops the old cache. */
const VERSION = '1.1.0';
const PREFIX = 'bulwark-';
const CACHE = PREFIX + VERSION;
const ASSETS = ['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];

self.addEventListener('install', e => {
  // cache:'reload' skips the HTTP cache, so a new worker never stores stale copies.
  e.waitUntil(caches.open(CACHE)
    .then(c => c.addAll(ASSETS.map(u => new Request(u, {cache: 'reload'}))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  // Only touch our own caches: other apps on the same github.io origin have theirs.
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k.startsWith(PREFIX) && k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});

// BULWARK's own pages. Other apps share this scope (connections/, ost-history/):
// their pages are left to the browser and their own workers, so offline they never
// get BULWARK's index.html by mistake.
const ROOT = new URL('./', location).pathname;
const OWN_PAGES = [ROOT, ROOT + 'index.html'];

// Page loads: network first (3 s timeout) so a deploy shows up on the next launch;
// fall back to the cached copy offline. Everything else: cache first.
self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  if (req.mode === 'navigate') {
    if (!OWN_PAGES.includes(url.pathname)) return;
    e.respondWith(networkFirst(req));
  } else {
    e.respondWith(caches.match(req).then(r => r || fetch(req)));
  }
});

function networkFirst(req) {
  const net = fetch(req, {cache: 'no-cache'}).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  });
  const timeout = new Promise((_, rej) => setTimeout(rej, 3000));
  return Promise.race([net, timeout])
    .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    .then(r => r || net);
}
