/* TED 精读 service worker — cache-first app shell, works offline */
const CACHE = "tedjd-1.8.0-76b4f86d59";
const PRECACHE = ["./", "index.html", "app.css", "app.js", "data.js", "manifest.webmanifest", "icons/icon.svg", "icons/favicon-32.png", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-192.png", "icons/maskable-512.png", "icons/apple-touch-icon.png", "fonts/literata-400.woff2", "fonts/literata-600.woff2", "vendor/jspdf.umd.min.js", "vendor/html2canvas.min.js", "vendor/xlsx.full.min.js", "vendor/compromise.min.js", "vendor/pdf.min.js", "vendor/pdf.worker.min.js", "dict.json", "align-worker.js"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE.map(u => new Request(u, { cache: "reload" })))));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("tedjd-") && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("message", e => { if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting(); });
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (req.mode === "navigate") {
    e.respondWith(caches.match("index.html", { cacheName: CACHE }).then(r => r || fetch(req)));
    return;
  }
  if (/\/(models\/|vendor\/ort\/|vendor\/transformers\.min\.js)/.test(url.pathname)) {
    e.respondWith(caches.open("tedml-1").then(c => c.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => { if (res.ok) c.put(req, res.clone()); return res; }))));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => {
    if (hit) return hit;
    return fetch(req).then(res => {
      if (res.ok && (url.pathname.includes("/icons/") || url.pathname.includes("/splash/") || url.pathname.includes("/screenshots/"))) {
        const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    });
  }));
});
