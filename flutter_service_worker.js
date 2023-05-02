'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "5c88900639fe740e70f2c58cdc6849a0",
"index.html": "3adbf395f2713d9a824d594ddb0ebf98",
"/": "3adbf395f2713d9a824d594ddb0ebf98",
"style.sass": "e029d4c59c7df8ad2e7c986ca176bc10",
"main.dart.js": "ef63875bde58331e4b9e893dc1bf447f",
"style.css.map": "0613c67b854dd49e7ea53d4c88d8eaa6",
"icons/favicon-16x16.png": "622bfd9a73cfd80f4419e4cd9be100f1",
"icons/favicon.ico": "efcd46ec0abcf61f24656454f1f2f42f",
"icons/apple-icon.png": "16257d8e8c53a7387c5a2825e9456ea4",
"icons/apple-icon-144x144.png": "f3cb725a3518c4f8324272e8509caf46",
"icons/android-icon-192x192.png": "66881777171b9e2a794a28cd703524d5",
"icons/apple-icon-precomposed.png": "16257d8e8c53a7387c5a2825e9456ea4",
"icons/apple-icon-114x114.png": "5e31ac635c539797131c1bac218e854e",
"icons/ms-icon-310x310.png": "745a7fb4ec8152d633b8b2c745254993",
"icons/ms-icon-144x144.png": "f3cb725a3518c4f8324272e8509caf46",
"icons/apple-icon-57x57.png": "eecdf75a4183854708f095c0d52ad018",
"icons/apple-icon-152x152.png": "ed7bebcc49eaa0a5d2edc59f60c03850",
"icons/ms-icon-150x150.png": "47ca49e2215710743712a86a0381b4f1",
"icons/android-icon-72x72.png": "43e48088054f7f622b5d3d17966ed5e6",
"icons/android-icon-96x96.png": "0ca9518156827098bf8a4f3d7a4ac99f",
"icons/android-icon-36x36.png": "d42e2117b16faa8ce0ebead968d7da62",
"icons/apple-icon-180x180.png": "fa8327e3b46248abf5aee6b3b9d0ab01",
"icons/favicon-96x96.png": "0ca9518156827098bf8a4f3d7a4ac99f",
"icons/manifest.json": "b58fcfa7628c9205cb11a1b2c3e8f99a",
"icons/android-icon-48x48.png": "1095c6e3edfb70d63c67600ccada4783",
"icons/apple-icon-76x76.png": "262e0eb5ce8a7ce947f0f5280789174b",
"icons/apple-icon-60x60.png": "18c437bd24f5de073dbcec678ae802aa",
"icons/browserconfig.xml": "653d077300a12f09a69caeea7a8947f8",
"icons/android-icon-144x144.png": "f3cb725a3518c4f8324272e8509caf46",
"icons/apple-icon-72x72.png": "43e48088054f7f622b5d3d17966ed5e6",
"icons/apple-icon-120x120.png": "241b977633162452b54166eadaa54c25",
"icons/favicon-32x32.png": "e7362c379567e724f3c5699ad566c599",
"icons/ms-icon-70x70.png": "5423e4e0d1083c60b225039152bbfb8a",
"style.css": "ea14c82542cebe5c0a3d5d8e2c79f3d2",
"manifest.json": "f5b90991091c6a308dc066c6d7b21cc2",
"assets/AssetManifest.json": "da039138f71a95a457c2f7ad78cd08c9",
"assets/NOTICES": "52ae4a6d923cee53b25a77f7838bffc4",
"assets/FontManifest.json": "cd60659878a00edd01e9c4db747bf319",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/flutter_icons/fonts/Octicons.ttf": "73b8cff012825060b308d2162f31dbb2",
"assets/packages/flutter_icons/fonts/Feather.ttf": "6beba7e6834963f7f171d3bdd075c915",
"assets/packages/flutter_icons/fonts/Entypo.ttf": "744ce60078c17d86006dd0edabcd59a7",
"assets/packages/flutter_icons/fonts/FontAwesome5_Brands.ttf": "c39278f7abfc798a241551194f55e29f",
"assets/packages/flutter_icons/fonts/MaterialCommunityIcons.ttf": "3c851d60ad5ef3f2fe43ebd263490d78",
"assets/packages/flutter_icons/fonts/AntDesign.ttf": "3a2ba31570920eeb9b1d217cabe58315",
"assets/packages/flutter_icons/fonts/Foundation.ttf": "e20945d7c929279ef7a6f1db184a4470",
"assets/packages/flutter_icons/fonts/weathericons.ttf": "4618f0de2a818e7ad3fe880e0b74d04a",
"assets/packages/flutter_icons/fonts/Ionicons.ttf": "b2e0fc821c6886fb3940f85a3320003e",
"assets/packages/flutter_icons/fonts/FontAwesome5_Solid.ttf": "b70cea0339374107969eb53e5b1f603f",
"assets/packages/flutter_icons/fonts/FontAwesome5_Regular.ttf": "f6c6f6c8cb7784254ad00056f6fbd74e",
"assets/packages/flutter_icons/fonts/FontAwesome.ttf": "b06871f281fee6b241d60582ae9369b9",
"assets/packages/flutter_icons/fonts/Zocial.ttf": "5cdf883b18a5651a29a4d1ef276d2457",
"assets/packages/flutter_icons/fonts/EvilIcons.ttf": "140c53a7643ea949007aa9a282153849",
"assets/packages/flutter_icons/fonts/SimpleLineIcons.ttf": "d2285965fe34b05465047401b8595dd0",
"assets/packages/flutter_icons/fonts/MaterialIcons.ttf": "a37b0c01c0baf1888ca812cc0508f6e2",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "dffd9504fcb1894620fa41c700172994",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "4b6a9b7c20913279a3ad3dd9c96e155b",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "00bb2b684be61e89d1bc7d75dee30b58",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/assets/godzilla.png": "92ae162cbb1cf5fdffa96d293aab53c5",
"assets/assets/flash.png": "1386612c5f5d488b0c903e0b79dddcc3",
"assets/assets/programmer.png": "81d4a5f13dfe85b90399f409d471c224",
"assets/assets/pranaOS.png": "4ce2794bd5b40704b10a6c93b8078b98",
"assets/assets/logo.png": "93386603f606e6bb8b5c3c37d681f1f3",
"assets/assets/BGM.jpeg": "833209e5f38b4a0ea2ba49b805f67dc4",
"assets/assets/fonts/OpenSans-ExtraBold.ttf": "fb7e3a294cb07a54605a8bb27f0cd528",
"assets/assets/fonts/OpenSans-Regular.ttf": "3ed9575dcc488c3e3a5bd66620bdf5a4",
"assets/assets/mask.jpeg": "c12739e4c3ea51f21c531fd136f747b5",
"assets/assets/BG.jpg": "3a93bbf1c97922602b78c6ac4ce694be"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
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
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
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
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
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
  for (var resourceKey of Object.keys(RESOURCES)) {
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
