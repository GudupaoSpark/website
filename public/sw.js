// Service Worker for advanced caching - Optimized for Astro Client Router
const CACHE_VERSION = 'v1';
const CACHE_NAME = `gudupao-website-${CACHE_VERSION}`;

// Assets to cache immediately
const STATIC_CACHE = [
  '/',
  '/fonts/Roboto-Bold.woff2',
  '/icon/icon.png',
];

// Cache strategies
const CACHE_STRATEGIES = {
  // Cache first, fallback to network
  cacheFirst: [
    /\.woff2?$/,
    /\.ttf$/,
    /\.png$/,
    /\.jpg$/,
    /\.jpeg$/,
    /\.svg$/,
    /\.ico$/,
  ],
  // Network first, fallback to cache
  networkFirst: [
    /\.html?$/,
    /\.astro$/,
  ],
  // Network only
  networkOnly: [
    /\/api\//,
  ],
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('gudupao-website-') && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Determine strategy
  let strategy = 'networkFirst'; // default

  for (const [strategyName, patterns] of Object.entries(CACHE_STRATEGIES)) {
    if (patterns.some((pattern) => pattern.test(url.pathname))) {
      strategy = strategyName;
      break;
    }
  }

  // Apply strategy
  if (strategy === 'cacheFirst') {
    event.respondWith(cacheFirstStrategy(request));
  } else if (strategy === 'networkFirst') {
    event.respondWith(networkFirstStrategy(request));
  } else if (strategy === 'networkOnly') {
    event.respondWith(fetch(request));
  }
});

// Cache first strategy
async function cacheFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Return offline fallback if available
    return new Response('Offline', { status: 503 });
  }
}

// Network first strategy
async function networkFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    return new Response('Offline', { status: 503 });
  }
}
