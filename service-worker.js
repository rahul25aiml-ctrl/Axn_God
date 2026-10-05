const CACHE_NAME = "practical-hub-v2";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json",

    // OS Practicals
    "./DOC-20260907-WA0013.pdf",
    "./DOC-20260907-WA0014.pdf",
    "./DOC-20260907-WA0015.pdf",
    "./DOC-20260907-WA0017.pdf",
    "./DOC-20260907-WA0018.pdf",
    "./DOC-20260907-WA0020.pdf",
    "./DOC-20260907-WA0022.pdf",
    "./DOC-20260907-WA0023.pdf",
    "./DOC-20260907-WA0024.pdf",
    "./DOC-20260907-WA0025.pdf",
    "./p10S%20%281%29.pdf"
];


// INSTALL
self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => {

                return cache.addAll(FILES_TO_CACHE);

            })

    );

    self.skipWaiting();
});


// ACTIVATE
self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys => {

            return Promise.all(

                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))

            );

        })

    );

    self.clients.claim();
});


// FETCH
self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)
            .then(cachedResponse => {

                if (cachedResponse) {

                    return cachedResponse;

                }

                return fetch(event.request)
                    .then(response => {

                        // Save new files/resources into cache
                        const responseClone = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {

                                cache.put(event.request, responseClone);

                            });

                        return response;

                    });

            })

    );

});
