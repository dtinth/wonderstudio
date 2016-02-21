
// https://jakearchibald.com/2014/offline-cookbook/#stale-while-revalidate
/* global self, caches, fetch */

// Install service worker
self.addEventListener('install', function (event) {
  event.waitUntil(caches.open('wonderstudio-app')
    .then(function (cache) {
      return cache.addAll([
        '/index.html'
      ])
    })
  )
})

// Ok
self.addEventListener('fetch', function (event) {
  event.respondWith(caches.open('wonderstudio-app')
    .then(function (cache) {
      return (fetch(event.request)
        .then(function (response) {
          // If response is not OK, prefer a cache
          if (!response.ok) {
            return cache.match(event.request).then(cached => cached || response)
          }
          cache.put(event.request, response.clone())
          return response
        })
        .catch(function () {
          return cache.match(event.request)
        })
      )
    })
  )
})
