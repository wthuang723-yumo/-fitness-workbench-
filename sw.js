const CACHE='fitness-workbench-v1';
const CORE=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET') return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin) return; // 外部真人视频保持联网加载
  event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(resp=>{const clone=resp.clone();caches.open(CACHE).then(c=>c.put(req,clone));return resp}).catch(()=>caches.match('./index.html'))));
});
