/* NKC Score — service worker: tudo em cache para funcionar sem internet */
const V='nkcscore-v1';
const CORE=['./','index.html','painel.html','sumula.html','manifest.json','logo.webp','icon-192.png','icon-512.png','icon-maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url);
  if(u.origin===location.origin){
    e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>hit||fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));return res;}).catch(()=>caches.match('index.html'))));
    return;
  }
  if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
    e.respondWith(caches.open(V).then(c=>c.match(r).then(hit=>{const net=fetch(r).then(res=>{c.put(r,res.clone());return res;}).catch(()=>hit);return hit||net;})));
  }
});
