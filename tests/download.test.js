import test from "node:test";
import assert from "node:assert/strict";
import { PLATFORMS } from "../src/lib/constants.js";
import {
  POST as downloadPostHandler,
  GET as downloadGetHandler,
} from "../src/app/api/download/route.js";
import { POST as infoPostHandler } from "../src/app/api/info/route.js";
import { createMediaResponse, isAllowedMediaHost } from "../src/services/base.js";
import {
  serviceRegistry,
  extractFacebookVideo,
  extractInstagramMedia,
  extractTikTokVideo,
  extractTwitterMedia,
  extractSnapchatMedia,
  extractTwitchMedia,
  extractDailymotionMedia,
  extractVimeoMedia,
  extractRedditMedia,
  extractThreadsMedia,
  extractLinkedInMedia,
  extractPinterestMedia,
} from "../src/services/index.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mockFetch(handler) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => handler(url.toString(), options);
  return () => {
    globalThis.fetch = originalFetch;
  };
}

const PLATFORM_TEST_URLS = [
  { slug: "facebook",    name: "Facebook",     url: "https://www.facebook.com/watch/?v=10158234857416789" },
  { slug: "instagram",   name: "Instagram",    url: "https://www.instagram.com/reel/C8xyz12345/" },
  { slug: "tiktok",      name: "TikTok",       url: "https://www.tiktok.com/@creator/video/7123456789012345678" },
  { slug: "twitter",     name: "Twitter / X",  url: "https://x.com/user/status/1789012345678901234" },
  { slug: "snapchat",    name: "Snapchat",     url: "https://www.snapchat.com/spotlight/W7_ED1YsX_sample" },
  { slug: "twitch",      name: "Twitch",       url: "https://clips.twitch.tv/SampleClipId-abc123" },
  { slug: "dailymotion", name: "Dailymotion",  url: "https://www.dailymotion.com/video/x8sample" },
  { slug: "vimeo",       name: "Vimeo",        url: "https://vimeo.com/76979871" },
  { slug: "reddit",      name: "Reddit",       url: "https://www.reddit.com/r/videos/comments/123456/sample_video/" },
  { slug: "threads",     name: "Threads",      url: "https://www.threads.net/@user/post/CuSample123" },
  { slug: "linkedin",    name: "LinkedIn",     url: "https://www.linkedin.com/posts/user_sample-activity-7123456789/" },
  { slug: "pinterest",   name: "Pinterest",    url: "https://www.pinterest.com/pin/123456789012345678/" },
];

// ---------------------------------------------------------------------------
// PLATFORMS constant
// ---------------------------------------------------------------------------

test("PLATFORMS constant has exactly 12 supported platforms", () => {
  assert.equal(PLATFORMS.length, 12);
  const slugs = PLATFORMS.map((p) => p.slug);
  for (const item of PLATFORM_TEST_URLS) {
    assert.ok(slugs.includes(item.slug), `Missing platform slug: ${item.slug}`);
  }
});

// ---------------------------------------------------------------------------
// POST /api/download — now returns info pointer, not raw page URL
// ---------------------------------------------------------------------------

test("POST /api/download returns platform info and /api/info pointer for all 12 platforms", async () => {
  for (const item of PLATFORM_TEST_URLS) {
    const req = new Request("http://localhost/api/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: item.url,
        quality: "1080p Full HD",
        title: `Test ${item.name} Video`,
      }),
    });

    const res = await downloadPostHandler(req);
    assert.equal(res.status, 200, `Failed for ${item.name} with status ${res.status}`);

    const data = await res.json();
    assert.equal(data.success, true, `success not true for ${item.name}`);
    assert.equal(data.platform, item.name, `platform mismatch for ${item.name}`);
    assert.equal(data.quality, "1080p Full HD");

    // Must NOT expose the page URL as a downloadable file
    assert.ok(!data.downloadUrl, `downloadUrl must not be present for ${item.name}`);
    assert.ok(!data.proxyDownloadUrl, `proxyDownloadUrl must not be present for ${item.name}`);

    // Must point browser to /api/info
    assert.equal(data.infoEndpoint, "/api/info");
  }
});

test("POST /api/download handles edge cases and rejects invalid URLs", async () => {
  // Empty body
  const emptyRes = await downloadPostHandler(
    new Request("http://localhost/api/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
  );
  assert.equal(emptyRes.status, 400);
  assert.equal((await emptyRes.json()).success, false);

  // Non-string URL
  const nullRes = await downloadPostHandler(
    new Request("http://localhost/api/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: 12345 }),
    })
  );
  assert.equal(nullRes.status, 400);

  // Malformed URL
  const malformedRes = await downloadPostHandler(
    new Request("http://localhost/api/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: "htp:/broken-url" }),
    })
  );
  assert.equal(malformedRes.status, 400);

  // Unsupported platform (YouTube)
  const unsupportedRes = await downloadPostHandler(
    new Request("http://localhost/api/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }),
    })
  );
  assert.equal(unsupportedRes.status, 400);
  assert.match((await unsupportedRes.json()).error, /supported/i);
});

// ---------------------------------------------------------------------------
// GET /api/download — now returns 302 to allowlisted hosts only
// ---------------------------------------------------------------------------

test("GET /api/download validates query parameters", async () => {
  // Missing url param
  const resNoParam = await downloadGetHandler(new Request("http://localhost/api/download"));
  assert.equal(resNoParam.status, 400);
  assert.equal(await resNoParam.text(), "Missing url query parameter");

  // Invalid url param
  const resInvalid = await downloadGetHandler(
    new Request("http://localhost/api/download?url=not-a-valid-url")
  );
  assert.equal(resInvalid.status, 400);
  assert.equal(await resInvalid.text(), "Invalid media url query parameter");
});

test("GET /api/download returns 302 for an allowlisted CDN host", async () => {
  const allowedUrl = "https://tikwm.com/video/abc123.mp4";
  const req = new Request(
    `http://localhost/api/download?url=${encodeURIComponent(allowedUrl)}`
  );
  const res = await downloadGetHandler(req);
  assert.equal(res.status, 302);
  assert.equal(res.headers.get("location"), allowedUrl);
});

test("GET /api/download returns 400 for a disallowed host", async () => {
  const blockedUrl = "https://cdn.example.com/videos/stream123.mp4";
  const req = new Request(
    `http://localhost/api/download?url=${encodeURIComponent(blockedUrl)}`
  );
  const res = await downloadGetHandler(req);
  assert.equal(res.status, 400);
  assert.match(await res.text(), /recognised media host/i);
});

test("GET /api/download returns 400 for an open-proxy attempt", async () => {
  const maliciousUrl = "https://attacker.example/payload.exe";
  const req = new Request(
    `http://localhost/api/download?url=${encodeURIComponent(maliciousUrl)}`
  );
  const res = await downloadGetHandler(req);
  assert.equal(res.status, 400);
});

// ---------------------------------------------------------------------------
// isAllowedMediaHost utility
// ---------------------------------------------------------------------------

test("isAllowedMediaHost accepts known CDN hosts and rejects unknown ones", () => {
  const allowed = [
    "https://video.cdninstagram.com/reel.mp4",
    "https://tikwm.com/video.mp4",
    "https://v.redd.it/abc.mp4",
    "https://i.pinimg.com/originals/img.jpg",
    "https://proxy.dailymotion.com/720.mp4",
    "https://video.twimg.com/tweet.mp4",
    "https://cdn.sc-cdn.net/snap.mp4",
    "https://vod-cdn.vimeocdn.com/1080.mp4",
  ];
  for (const url of allowed) {
    assert.ok(isAllowedMediaHost(url), `Expected allowed: ${url}`);
  }

  const blocked = [
    "https://cdn.example.com/file.mp4",
    "https://attacker.site/payload.exe",
    "https://randomhost.io/media.webm",
  ];
  for (const url of blocked) {
    assert.ok(!isAllowedMediaHost(url), `Expected blocked: ${url}`);
  }
});

// ---------------------------------------------------------------------------
// createMediaResponse — direct URLs, HLS filtering, no proxy in downloadUrl
// ---------------------------------------------------------------------------

test("createMediaResponse sets downloadUrl = direct url (no /api/download proxy)", () => {
  const response = createMediaResponse({
    platform: "TikTok",
    platformSlug: "tiktok",
    title: "Awesome Dancer #Viral 2026!",
    media: [
      { quality: "HD Without Watermark", type: "video", format: "mp4",  url: "https://tikwm.com/video_hd.mp4" },
      { quality: "Audio MP3",            type: "audio", format: "mp3",  url: "https://tikwm.com/audio.mp3" },
      { quality: "Thumbnail Cover",      type: "image", format: "jpg",  url: "https://tikwm.com/cover.jpg" },
    ],
  });

  assert.equal(response.success, true);
  assert.equal(response.media.length, 3);

  for (const m of response.media) {
    // downloadUrl must be the direct CDN URL, not a /api/download proxy
    assert.equal(m.downloadUrl, m.url, `downloadUrl should equal url for ${m.format}`);
    assert.ok(!m.downloadUrl.startsWith("/api/download"), `Unexpected proxy URL for ${m.format}`);
  }
});

test("createMediaResponse filters out HLS and DASH playlist entries", () => {
  assert.throws(
    () =>
      createMediaResponse({
        platform: "Dailymotion",
        platformSlug: "dailymotion",
        title: "Only HLS",
        media: [
          { quality: "Adaptive", type: "video", format: "m3u8", url: "https://dailymotion.com/stream.m3u8" },
          { quality: "DASH",     type: "video", format: "mpd",  url: "https://dailymotion.com/stream.mpd" },
        ],
      }),
    /only available as a stream/i
  );
});

test("createMediaResponse keeps direct MP4 files and drops HLS entries", () => {
  const result = createMediaResponse({
    platform: "Dailymotion",
    platformSlug: "dailymotion",
    title: "Mixed",
    media: [
      { quality: "720p",    type: "video", format: "mp4",  url: "https://proxy.dailymotion.com/720.mp4" },
      { quality: "Adaptive",type: "video", format: "m3u8", url: "https://proxy.dailymotion.com/stream.m3u8" },
    ],
  });
  assert.equal(result.media.length, 1);
  assert.equal(result.media[0].format, "mp4");
});

// ---------------------------------------------------------------------------
// All 12 extractors: direct http URLs, real extensions, no .m3u8
// ---------------------------------------------------------------------------

test("All 12 platform extractors return direct file URLs with no .m3u8", async () => {

  // 1. Facebook
  {
    const restore = mockFetch(() =>
      new Response(
        `<html><body><script>var videoData = {"playable_url_quality_hd":"https:\\/\\/fbcdn.net\\/hd.mp4","playable_url":"https:\\/\\/fbcdn.net\\/sd.mp4"};</script></body></html>`,
        { status: 200 }
      )
    );
    try {
      const res = await extractFacebookVideo("https://www.facebook.com/watch/?v=123");
      assert.equal(res.success, true);
      assert.ok(res.media.length > 0);
      for (const m of res.media) {
        assert.ok(m.url.startsWith("http"), `url must be http: ${m.url}`);
        assert.ok(!m.url.includes(".m3u8"), `must not be HLS: ${m.url}`);
        assert.equal(m.downloadUrl, m.url, "downloadUrl must equal url (no proxy)");
      }
    } finally { restore(); }
  }

  // 2. Instagram
  {
    const restore = mockFetch(() =>
      new Response(
        `<script>window.__context = {"video_url":"https:\\/\\/cdn.instagram.com\\/reel.mp4"};</script>`,
        { status: 200 }
      )
    );
    try {
      const res = await extractInstagramMedia("https://www.instagram.com/reel/12345/");
      assert.equal(res.success, true);
      for (const m of res.media) {
        assert.ok(m.url.startsWith("http"));
        assert.ok(!m.url.includes(".m3u8"));
        assert.equal(m.downloadUrl, m.url);
      }
    } finally { restore(); }
  }

  // 3. TikTok
  {
    const restore = mockFetch(() =>
      new Response(
        JSON.stringify({
          code: 0,
          data: {
            title: "TikTok Video",
            play:   "https://tikwm.com/v.mp4",
            hdplay: "https://tikwm.com/v_hd.mp4",
            music:  "https://tikwm.com/m.mp3",
          },
        }),
        { status: 200 }
      )
    );
    try {
      const res = await extractTikTokVideo("https://www.tiktok.com/@user/video/12345");
      assert.equal(res.success, true);
      assert.ok(res.media.length >= 2);
      for (const m of res.media) {
        assert.ok(m.url.startsWith("http"));
        assert.ok(!m.url.includes(".m3u8"));
        assert.equal(m.downloadUrl, m.url);
      }
    } finally { restore(); }
  }

  // 4. Twitter / X
  {
    const restore = mockFetch(() =>
      new Response(
        JSON.stringify({
          text: "Tweet text",
          mediaDetails: [{
            type: "video",
            video_info: {
              variants: [
                { bitrate: 832000, content_type: "video/mp4", url: "https://video.twimg.com/720p.mp4" },
              ],
            },
          }],
        }),
        { status: 200 }
      )
    );
    try {
      const res = await extractTwitterMedia("https://x.com/user/status/12345678");
      assert.equal(res.success, true);
      for (const m of res.media) {
        assert.ok(m.url.startsWith("http"));
        assert.ok(!m.url.includes(".m3u8"));
        assert.equal(m.downloadUrl, m.url);
      }
    } finally { restore(); }
  }

  // 5. Snapchat
  {
    const restore = mockFetch(() =>
      new Response(
        `<html><head><script type="application/ld+json">{"@type":"VideoObject","contentUrl":"https://cf-st.sc-cdn.net/video.mp4","name":"Snap"}</script></head></html>`,
        { status: 200 }
      )
    );
    try {
      const res = await extractSnapchatMedia("https://www.snapchat.com/spotlight/123");
      assert.equal(res.success, true);
      for (const m of res.media) {
        assert.ok(m.url.startsWith("http"));
        assert.ok(!m.url.includes(".m3u8"));
        assert.equal(m.downloadUrl, m.url);
      }
    } finally { restore(); }
  }

  // 6. Twitch
  {
    const restore = mockFetch(() =>
      new Response(
        JSON.stringify({
          data: {
            clip: {
              title: "Twitch Clip",
              playbackAccessToken: { signature: "sig", value: "{}" },
              videoQualities: [{ quality: "1080", frameRate: 60, sourceURL: "https://clips-media-assets2.twitch.tv/clip.mp4" }],
            },
          },
        }),
        { status: 200 }
      )
    );
    try {
      const res = await extractTwitchMedia("https://clips.twitch.tv/SampleClip");
      assert.equal(res.success, true);
      for (const m of res.media) {
        assert.ok(m.url.startsWith("http"));
        assert.ok(!m.url.includes(".m3u8"));
        assert.equal(m.downloadUrl, m.url);
      }
    } finally { restore(); }
  }

  // 7. Dailymotion — only mp4 qualities, no auto/m3u8
  {
    const restore = mockFetch(() =>
      new Response(
        JSON.stringify({
          title: "Dailymotion Video",
          qualities: {
            "720": [{ type: "video/mp4", url: "https://proxy.dailymotion.com/720.mp4" }],
            // auto / m3u8 intentionally omitted — should not appear in output
          },
        }),
        { status: 200 }
      )
    );
    try {
      const res = await extractDailymotionMedia("https://www.dailymotion.com/video/x12345");
      assert.equal(res.success, true);
      for (const m of res.media) {
        assert.ok(m.url.startsWith("http"));
        assert.ok(!m.url.includes(".m3u8"), `Dailymotion must not return m3u8: ${m.url}`);
        assert.equal(m.downloadUrl, m.url);
      }
    } finally { restore(); }
  }

  // 8. Vimeo
  {
    const restore = mockFetch(() =>
      new Response(
        JSON.stringify({
          video: { title: "Vimeo Video" },
          request: {
            files: {
              progressive: [{ quality: "1080p", width: 1920, height: 1080, url: "https://vod-cdn.vimeocdn.com/1080.mp4" }],
            },
          },
        }),
        { status: 200 }
      )
    );
    try {
      const res = await extractVimeoMedia("https://vimeo.com/12345678");
      assert.equal(res.success, true);
      for (const m of res.media) {
        assert.ok(m.url.startsWith("http"));
        assert.ok(!m.url.includes(".m3u8"));
        assert.equal(m.downloadUrl, m.url);
      }
    } finally { restore(); }
  }

  // 9. Reddit
  {
    const restore = mockFetch(() =>
      new Response(
        JSON.stringify([{
          data: {
            children: [{
              data: {
                title: "Reddit Video",
                secure_media: {
                  reddit_video: {
                    fallback_url: "https://v.redd.it/video.mp4",
                    height: 720,
                    width: 1280,
                  },
                },
              },
            }],
          },
        }]),
        { status: 200 }
      )
    );
    try {
      const res = await extractRedditMedia("https://www.reddit.com/r/funny/comments/123/clip/");
      assert.equal(res.success, true);
      for (const m of res.media) {
        assert.ok(m.url.startsWith("http"));
        assert.ok(!m.url.includes(".m3u8"));
        assert.equal(m.downloadUrl, m.url);
      }
    } finally { restore(); }
  }

  // 10. Threads
  {
    const restore = mockFetch(() =>
      new Response(
        `<html><head><meta property="og:video" content="https://threads.net/video.mp4" /><meta property="og:title" content="Threads Post" /></head></html>`,
        { status: 200 }
      )
    );
    try {
      const res = await extractThreadsMedia("https://www.threads.net/@user/post/123");
      assert.equal(res.success, true);
      for (const m of res.media) {
        assert.ok(m.url.startsWith("http"));
        assert.ok(!m.url.includes(".m3u8"));
        assert.equal(m.downloadUrl, m.url);
      }
    } finally { restore(); }
  }

  // 11. LinkedIn
  {
    const restore = mockFetch(() =>
      new Response(
        `<html><head><meta property="og:video" content="https://dms.licdn.com/video.mp4" /><meta property="og:title" content="LinkedIn Post" /></head></html>`,
        { status: 200 }
      )
    );
    try {
      const res = await extractLinkedInMedia("https://www.linkedin.com/posts/user-activity-123456/");
      assert.equal(res.success, true);
      for (const m of res.media) {
        assert.ok(m.url.startsWith("http"));
        assert.ok(!m.url.includes(".m3u8"));
        assert.equal(m.downloadUrl, m.url);
      }
    } finally { restore(); }
  }

  // 12. Pinterest — V_HLSV4 must be excluded
  {
    const restore = mockFetch((url) => {
      if (url.includes("api.pinterest.com")) {
        return new Response(
          JSON.stringify({
            data: {
              pins: [{
                description: "Pin Title",
                videos: {
                  video_list: {
                    V_720P: { url: "https://v.pinimg.com/720p.mp4" },
                    // V_HLSV4 intentionally present in mock — should be dropped
                    V_HLSV4: { url: "https://v.pinimg.com/hls/stream.m3u8" },
                  },
                },
                images: { orig: { url: "https://i.pinimg.com/orig.jpg" } },
              }],
            },
          }),
          { status: 200 }
        );
      }
      return new Response("Not found", { status: 404 });
    });
    try {
      const res = await extractPinterestMedia("https://www.pinterest.com/pin/123456789/");
      assert.equal(res.success, true);
      assert.ok(res.media.length > 0);
      for (const m of res.media) {
        assert.ok(m.url.startsWith("http"), `url must be http: ${m.url}`);
        assert.ok(!m.url.includes(".m3u8"), `Pinterest must not return m3u8: ${m.url}`);
        assert.equal(m.downloadUrl, m.url);
      }
    } finally { restore(); }
  }
});

// ---------------------------------------------------------------------------
// End-to-end: POST /api/info → direct file URL → GET /api/download 302
// ---------------------------------------------------------------------------

test("End-to-End: POST /api/info extracts direct file URL and GET /api/download 302-redirects to it", async () => {
  const remoteVideoUrl = "https://tikwm.com/stream_sample.mp4";

  const restore = mockFetch((url) => {
    if (url.includes("tikwm.com/api/")) {
      return new Response(
        JSON.stringify({
          code: 0,
          data: {
            title: "Viral TikTok Dance",
            play: remoteVideoUrl,
            music: "https://tikwm.com/music.mp3",
          },
        }),
        { status: 200 }
      );
    }
    return new Response("Not found", { status: 404 });
  });

  try {
    // 1. User submits URL to POST /api/info
    const infoRes = await infoPostHandler(
      new Request("http://localhost/api/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: "https://www.tiktok.com/@dancer/video/9876543210" }),
      })
    );
    assert.equal(infoRes.status, 200);
    const infoData = await infoRes.json();
    assert.equal(infoData.success, true);
    assert.equal(infoData.platform, "TikTok");
    assert.ok(infoData.media.length > 0);

    // 2. Select first media item — downloadUrl must be a direct CDN URL
    const selectedMedia = infoData.media[0];
    assert.ok(selectedMedia.downloadUrl, "downloadUrl must be present");
    assert.ok(selectedMedia.downloadUrl.startsWith("http"), "downloadUrl must be a direct http URL");
    assert.ok(!selectedMedia.downloadUrl.startsWith("/api/download"), "downloadUrl must not be a proxy URL");

    // 3. Browser uses GET /api/download?url=<cdn-url> — should 302-redirect
    const downloadRes = await downloadGetHandler(
      new Request(`http://localhost/api/download?url=${encodeURIComponent(selectedMedia.downloadUrl)}`)
    );
    assert.equal(downloadRes.status, 302);
    assert.equal(downloadRes.headers.get("location"), selectedMedia.downloadUrl);
  } finally {
    restore();
  }
});
