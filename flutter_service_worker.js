'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "ac08040f51837f41126c2c385c24471d",
"assets/assets/anonymous.png": "6374bb327237907f99ed264f4fd8f413",
"assets/assets/certificates/Krisna%2520-%2520The%2520Complete%2520Cyber%2520Security%2520Course%2520-%2520Volume%25201%2520-%2520Hackers%2520Exposed%2520Certificate.jpg": "db80695f68235a8d14a2bc150ebf7a4b",
"assets/assets/certificates/Krisna%2520-%2520The%2520Complete%2520Cyber%2520Security%2520Course%2520-%2520Volume%25204%2520-%2520End%2520Point%2520Protection%2520Certificate.jpg": "ab11d78ecf5a6e647998136daa970608",
"assets/assets/certificates/pranavcertificate1.jpg": "21e963d5ce3d6f2e692cd95f21c071f8",
"assets/assets/certificates/pranavcertificate11.jpg": "60f99b93d29c38ae12fb2f30604bd618",
"assets/assets/certificates/pranavcertificate12.jpg": "5648d03c7226e25e2e08481f4568ecde",
"assets/assets/certificates/pranavcertificate13.jpg": "db7f22fba8f7ec7b5bdefd849e4204f7",
"assets/assets/certificates/pranavcertificate14.jpg": "f3cef99671f9d8a6086e8e723f070171",
"assets/assets/certificates/pranavcertificate15.jpg": "cd1ebf169a23c573849b550a88d1f66c",
"assets/assets/certificates/pranavcertificate2.jpg": "5667301636cf45fb13e2159974b45145",
"assets/assets/certificates/pranavcertificate3.jpg": "b90ef8cd962670f14afcb8760be06150",
"assets/assets/certificates/pranavcertificate4.jpg": "fe71a64ae0065512482fca7cb3d85e53",
"assets/assets/certificates/pranavcertificate5.jpg": "3cf72d7436eaa94a9b0f208a53978090",
"assets/assets/certificates/pranavcertificate6.jpg": "77ef1c321ccd24d11edc128436e04fd8",
"assets/assets/certificates/pranavcertificate7.jpg": "49575340a74fd2e9f4e664bececea3b6",
"assets/assets/certificates/pranavcertificate8.jpg": "21d32a20dff0acb765dfd56d8541b9d7",
"assets/assets/facebook.png": "021ada146ffb7c1753557ff29618d04c",
"assets/assets/github.png": "d22ee3727a7216019c3848df6eafa024",
"assets/assets/linkedin.png": "926e2dcf5ab4220a359867614556df68",
"assets/assets/moon.png": "a270b8a10d1a9a52441bf5a322dd1b86",
"assets/assets/twitter.png": "8f35a40403a84631c4125c4f1859c7a6",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "a68d2a28c526b3b070aefca4bac93d25",
"assets/NOTICES": "ee46c3b5c9f21ead637e489c91bfd715",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "b14fcf3ee94e3ace300b192e9e7c8c5d",
"index.html": "9a3cb27d1657df060b452e804dccd1d7",
"/": "9a3cb27d1657df060b452e804dccd1d7",
"main.dart.js": "6b9274bc938201658629ac2467b9a7e5",
"manifest.json": "132b52890e73f04d8fb4abad432b3c77"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value + '?revision=' + RESOURCES[value], {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list, skip the cache.
  if (!RESOURCES[key]) {
    return event.respondWith(fetch(event.request));
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    return self.skipWaiting();
  }
  if (event.message === 'downloadOffline') {
    downloadOffline();
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey in Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
