const CACHE_NAME = 'ice-rank-cache-v2';
// キャッシュするファイル一覧（ルート絶対パスで指定）
const urlsToCache = [
  'index.html',
  'manifest.json',
  // コンビニ画像
  'images/7eleven.jpg',
  'images/familymart.jpg',
  'images/lawson.jpg',
  // アイス画像
  'images/choco_monaka.jpg',
  'images/coolish.jpg',
  'images/essel_supercup.jpg',
  'images/gari_gari_kun.jpg',
  'images/tabete_bokujo.jpg',
  'images/giant_corn.jpg',
  //アイコン画像
  'icons/icon-192.jpg',
  'icons/icon-512.jpg
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    }).catch(err => {
      console.error('Cache addAll error:', err);
    })
  );
  self.skipWaiting();
});

// ネットワークファースト、キャッシュはバックアップ
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // ネットワークから取得できたらキャッシュを更新（オプション）
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // ネットワーク失敗時はキャッシュから返す
        return caches.match(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});