import test from "node:test";
import assert from "node:assert/strict";
import { GET as healthHandler } from "../src/app/api/health/route.js";
import { POST as infoHandler } from "../src/app/api/info/route.js";
import { POST as downloadPostHandler, GET as downloadGetHandler } from "../src/app/api/download/route.js";

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

test("GET /api/health returns status ok", async () => {
  const response = await healthHandler();
  assert.equal(response.status, 200);

  const data = await response.json();
  assert.equal(data.status, "ok");
  assert.equal(data.service, "SaveFromPro API");
  assert.equal(data.version, "1.0.0");
  assert.ok(data.timestamp);
});

test("POST /api/info validates missing and malformed URLs", async () => {
  // Missing URL
  const req1 = new Request("http://localhost/api/info", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  const res1 = await infoHandler(req1);
  assert.equal(res1.status, 400);
  const data1 = await res1.json();
  assert.equal(data1.success, false);

  // Malformed URL
  const req2 = new Request("http://localhost/api/info", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: "invalid-url-here" }),
  });
  const res2 = await infoHandler(req2);
  assert.equal(res2.status, 400);

  // Unsupported domain
  const req3 = new Request("http://localhost/api/info", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: "https://unknown-video-site.com/video" }),
  });
  const res3 = await infoHandler(req3);
  assert.equal(res3.status, 400);
  const data3 = await res3.json();
  assert.match(data3.error, /supported/i);
});

test("POST /api/info returns extracted media on valid platform URL", async () => {
  const restore = mockFetch((url) => {
    if (url.includes("tikwm.com")) {
      return new Response(
        JSON.stringify({
          code: 0,
          data: {
            title: "Viral Dance Video",
            cover: "https://tiktok.com/thumb.jpg",
            author: { unique_id: "creator" },
            play: "https://tikwm.com/video.mp4",
            hdplay: "https://tikwm.com/video_hd.mp4",
          },
        }),
        { status: 200 }
      );
    }
    return new Response("Not found", { status: 404 });
  });

  try {
    const req = new Request("http://localhost/api/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: "https://www.tiktok.com/@creator/video/7123456789" }),
    });

    const res = await infoHandler(req);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.platform, "TikTok");
    assert.equal(data.title, "Viral Dance Video");
    assert.ok(data.media.length >= 1);
  } finally {
    restore();
  }
});

test("POST /api/download generates download payload and proxy link", async () => {
  const req = new Request("http://localhost/api/download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: "https://www.youtube.com/watch?v=123", // invalid
    }),
  });
  const res = await downloadPostHandler(req);
  assert.equal(res.status, 400);

  const validReq = new Request("http://localhost/api/download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: "https://www.instagram.com/reel/CxABC12345/",
      quality: "HD",
    }),
  });
  const validRes = await downloadPostHandler(validReq);
  assert.equal(validRes.status, 200);
  const data = await validRes.json();
  assert.equal(data.success, true);
  assert.equal(data.platform, "Instagram");
  assert.ok(data.proxyDownloadUrl.includes("/api/download?url="));
});

test("GET /api/download requires url parameter", async () => {
  const req = new Request("http://localhost/api/download");
  const res = await downloadGetHandler(req);
  assert.equal(res.status, 400);
});
