/* eslint-disable no-restricted-globals */
/**
 * Service worker do L4D2 Áudios.
 *
 * Além de deixar o site utilizável offline (casca do app), a existência de um
 * service worker com handler de `fetch` é requisito do Chrome para disparar o
 * evento `beforeinstallprompt` — que é o que habilita o botão "Instalar app".
 */
const VERSION = "v3";
const SHELL_CACHE = `l4d2-shell-${VERSION}`;
const ASSETS_CACHE = `l4d2-assets-${VERSION}`;
const AUDIO_CACHE = `l4d2-audio-${VERSION}`;
const AUDIO_CACHE_LIMIT = 40;

const SHELL_URLS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_URLS))
      .catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("l4d2-") && !key.endsWith(VERSION))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxItems) return;
  await Promise.all(keys.slice(0, keys.length - maxItems).map((key) => cache.delete(key)));
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (!url.protocol.startsWith("http")) return;

  // Áudios do Firebase Storage: cache-first, para reouvir offline / gastar menos dados.
  // Requisições parciais (Range, usadas pelo <audio> ao buscar no meio da faixa)
  // não podem ser guardadas no Cache API, então passam direto.
  if (url.hostname === "firebasestorage.googleapis.com" && !request.headers.has("range")) {
    event.respondWith(
      caches.open(AUDIO_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.status === 200) {
          cache
            .put(request, response.clone())
            .then(() => trimCache(AUDIO_CACHE, AUDIO_CACHE_LIMIT))
            .catch(() => undefined);
        }
        return response;
      })
    );
    return;
  }

  // Demais chamadas externas (Firestore, Auth, fontes) passam direto.
  if (url.origin !== self.location.origin) return;

  // Navegação: rede primeiro, com o index.html em cache como plano B (SPA offline).
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(SHELL_CACHE).then((cache) => cache.put("/index.html", copy));
          return response;
        })
        .catch(async () => (await caches.match("/index.html")) || Response.error())
    );
    return;
  }

  // Estáticos do build: responde do cache e atualiza em segundo plano.
  event.respondWith(
    caches.open(ASSETS_CACHE).then(async (cache) => {
      const cached = await cache.match(request);
      const network = fetch(request)
        .then((response) => {
          if (response.ok) cache.put(request, response.clone());
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
