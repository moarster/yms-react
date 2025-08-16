const CACHE_NAME = 'carrier-portal-v1'
const RUNTIME_CACHE = 'runtime-cache-v1'

// Assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS)
        })
    )
    self.skipWaiting()
})

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
                    .map((name) => caches.delete(name))
            )
        })
    )
    self.clients.claim()
})

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
    const { request } = event
    const url = new URL(request.url)

    // Skip non-GET requests
    if (request.method !== 'GET') return

    // Skip API requests (let them go to network)
    if (url.pathname.startsWith('/api')) return

    // For navigation requests, try network first
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request).catch(() => {
                return caches.match('/index.html')
            })
        )
        return
    }

    // For static assets, use cache-first strategy
    if (isStaticAsset(url.pathname)) {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached

                return fetch(request).then((response) => {
                    if (!response || response.status !== 200) return response

                    const responseToCache = response.clone()
                    caches.open(RUNTIME_CACHE).then((cache) => {
                        cache.put(request, responseToCache)
                    })

                    return response
                })
            })
        )
        return
    }

    // For chunks and other assets, use network-first strategy
    event.respondWith(
        fetch(request)
            .then((response) => {
                if (!response || response.status !== 200) return response

                const responseToCache = response.clone()
                caches.open(RUNTIME_CACHE).then((cache) => {
                    cache.put(request, responseToCache)
                })

                return response
            })
            .catch(() => caches.match(request))
    )
})

function isStaticAsset(pathname) {
    const staticExtensions = [
        '.js',
        '.css',
        '.jpg',
        '.jpeg',
        '.png',
        '.gif',
        '.svg',
        '.woff',
        '.woff2',
        '.ttf',
        '.eot',
    ]
    return staticExtensions.some((ext) => pathname.endsWith(ext))
}