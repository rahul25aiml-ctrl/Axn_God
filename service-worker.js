const CACHE_NAME = "practical-hub-v3";

const APP_FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json"
];

const PDF_FILES = [
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

        caches.open(CACHE_NAME).then(async cache => {

            // Cache website files
            await cache.addAll(APP_FILES);

            // Cache PDFs individually
            // If one PDF fails, the whole Service Worker won't fail
            for (const pdf of PDF_FILES) {

                try {
                    await cache.add(pdf);
                } catch (error) {
                    console.log("Could not cache:", pdf);
                }

            }

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

    // Handle opening/navigating to the website
    if (event.request.mode === "navigate") {

        event.respondWith(

            fetch(event.request)
                .catch(() => {

                    return caches.match("./index.html");

                })

        );

        return;
    }


    // Handle PDFs, CSS, JS, images, etc.
    event.respondWith(

        caches.match(event.request)
            .then(cachedResponse => {

                if (cachedResponse) {

                    return cachedResponse;

                }

                return fetch(event.request)
                    .then(response => {

                        if (
                            response &&
                            response.status === 200 &&
                            response.type === "basic"
                        ) {

                            const responseClone = response.clone();

                            caches.open(CACHE_NAME)
                                .then(cache => {

                                    cache.put(
                                        event.request,
                                        responseClone
                                    );

                                });

                        }

                        return response;

                    });

            })

    );

});
