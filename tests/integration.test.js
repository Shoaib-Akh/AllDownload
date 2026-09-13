import test from "node:test";
import assert from "node:assert/strict";
import {
  mediaCache,
  statsTracker,
  fetchWithRetry,
} from "../src/services/base.js";
import { extractMedia } from "../src/services/index.js";
import { GET as statsHandler } from "../src/app/api/stats/route.js";

// Helper to mock fetch temporarily
function mockFetch(handler) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    return handler(url.toString(), options);
  };
  return () => {
    globalThis.fetch = originalFetch;
  };
}

test("mediaCache stores and retrieves data within TTL", () => {
  mediaCache.clear();
  const testUrl = "media:https://example.com/video1";
  const testData = { success: true, title: "Cached Video" };

  assert.equal(mediaCache.get(testUrl), null);
  mediaCache.set(testUrl, testData, 1000); // 1s TTL

  const retrieved = mediaCache.get(testUrl);
  assert.deepEqual(retrieved, testData);
});

test("mediaCache expires entries after TTL", async () => {
  mediaCache.clear();
  const testUrl = "media:https://example.com/short_lived";
  mediaCache.set(testUrl, { data: 123 }, 20); // 20ms TTL

  assert.ok(mediaCache.get(testUrl));

  // Wait 35ms for expiration
  await new Promise((r) => setTimeout(r, 35));
  assert.equal(mediaCache.get(testUrl), null);
});

test("extractMedia returns cached result with fromCache: true flag", async () => {
  let networkFetchCount = 0;
  const restore = mockFetch((url) => {
    networkFetchCount++;
    if (url.includes("tikwm.com")) {
      return new Response(
        JSON.stringify({
          code: 0,
          data: {
            title: "Viral TikTok Cached",
            play: "https://tikwm.com/video.mp4",
          },
        }),
        { status: 200 }
      );
    }
    return new Response("Not found", { status: 404 });
  });

  try {
    const videoUrl = "https://www.tiktok.com/@creator/video/9999999999";

    // 1st request -> fetches over network and caches
    const firstCall = await extractMedia(videoUrl);
    assert.equal(firstCall.success, true);
    assert.equal(firstCall.title, "Viral TikTok Cached");
    assert.equal(firstCall.fromCache, undefined);
    assert.equal(networkFetchCount, 1);

    // 2nd request -> returned directly from cache in 0ms!
    const secondCall = await extractMedia(videoUrl);
    assert.equal(secondCall.success, true);
    assert.equal(secondCall.fromCache, true);
    assert.equal(networkFetchCount, 1); // no extra network request!
  } finally {
    restore();
  }
});

test("fetchWithRetry retries on 5xx errors and succeeds when server recovers", async () => {
  let callCount = 0;
  const restore = mockFetch(() => {
    callCount++;
    if (callCount < 2) {
      return new Response("Internal Server Error", { status: 503 });
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  });

  try {
    const res = await fetchWithRetry("https://flaky-api.com/status", {}, 2, 10);
    assert.equal(res.ok, true);
    assert.equal(callCount, 2);
  } finally {
    restore();
  }
});

test("statsTracker records download events by platform and maintains recent history", () => {
  const initialTotal = statsTracker.getStats().totalDownloads;

  statsTracker.recordDownload("tiktok", "Dance Challenge", "https://tikwm.com/video.mp4");

  const updatedStats = statsTracker.getStats();
  assert.equal(updatedStats.totalDownloads, initialTotal + 1);
  assert.ok(updatedStats.recentDownloads.length > 0);
  assert.equal(updatedStats.recentDownloads[0].title, "Dance Challenge");
  assert.equal(updatedStats.recentDownloads[0].platform, "tiktok");
});

test("GET /api/stats returns current download analytics", async () => {
  const response = await statsHandler();
  assert.equal(response.status, 200);

  const data = await response.json();
  assert.equal(data.success, true);
  assert.ok(data.stats.totalDownloads > 0);
  assert.ok(data.stats.todayDownloads > 0);
  assert.equal(typeof data.stats.platforms.facebook, "number");
  assert.equal(typeof data.stats.platforms.instagram, "number");
  assert.ok(Array.isArray(data.stats.recentDownloads));
});
