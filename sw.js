/* CineStats — service worker
   Objetivo: o app abrir sem internet. Os filmes já ficam no IndexedDB do aparelho;
   faltava apenas guardar a própria página para ela conseguir se abrir offline.

   Estratégia:
   - HTML: rede primeiro (assim toda atualização publicada aparece na hora),
     caindo para o cache só quando não há conexão.
   - Ícones/manifest: cache primeiro (não mudam).
   - Domínios externos (TMDB, OMDb, Supabase, CDN): passam direto, sem cache.

   Ao publicar uma versão nova, troque o número em CACHE para limpar o cache antigo.
*/
const CACHE = 'cinestats-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => Promise.all(
      ASSETS.map(u => c.add(u).catch(() => {}))
    ))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (err) { return; }
  if (url.origin !== self.location.origin) return; // TMDB/OMDb/Supabase seguem direto

  const isDoc = req.mode === 'navigate' ||
                (req.headers.get('accept') || '').includes('text/html');

  if (isDoc) {
    // Rede primeiro: garante que atualizações publicadas cheguem imediatamente.
    e.respondWith(
      fetch(req)
        .then(r => {
          const copy = r.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
          return r;
        })
        .catch(() => caches.match(req).then(m => m || caches.match('./index.html')))
    );
    return;
  }

  // Demais arquivos locais: cache primeiro.
  e.respondWith(
    caches.match(req).then(m => m || fetch(req).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      return r;
    }))
  );
});
