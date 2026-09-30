import test from "node:test";
import assert from "node:assert/strict";
import { PLATFORMS } from "../src/lib/constants.js";
import { POST as downloadPostHandler, GET as downloadGetHandler } from "../src/app/api/download/route.js";
import { POST as infoPostHandler } from "../src/app/api/info/route.js";
import { createMediaResponse } from "../src/services/base.js";
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

// Helper to mock global fetch
function mockFetch(handler) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    return handler(url.toString(), options);
  };
  return () => {
    globalThis.fetch = originalFetch;
  };
}

// Sample valid URLs for all 12 supported platforms
const PLATFORM_TEST_URLS = [
  { slug: "facebook", name: "Facebook", url: "https://www.facebook.com/watch/?v=10158234857416789" },
  { slug: "instagram", name: "Instagram", url: "https://www.instagram.com/reel/C8xyz12345/" },
  { slug: "tiktok", name: "TikTok", url: "https://www.tiktok.com/@creator/video/7123456789012345678" },
  { slug: "twitter", name: "Twitter / X", url: "https://x.com/user/status/1789012345678901234" },
  { slug: "snapchat", name: "Snapchat", url: "https://www.snapchat.com/spotlight/W7_ED1YsX_sample" },
  { slug: "twitch", name: "Twitch", url: "https://clips.twitch.tv/SampleClipId-abc123" },
  { slug: "dailymotion", name: "Dailymotion", url: "https://www.dailymotion.com/video/x8sample" },
  { slug: "vimeo", name: "Vimeo", url: "https://vimeo.com/76979871" },
  { slug: "reddit", name: "Reddit", url: "https://www.reddit.com/r/videos/comments/123456/sample_video/" },
  { slug: "threads", name: "Threads", url: "https://www.threads.net/@user/post/CuSample123" },
  { slug: "linkedin", name: "LinkedIn", url: "https://www.linkedin.com/posts/user_sample-activity-7123456789/" },
  { slug: "pinterest", name: "Pinterest", url: "https://www.pinterest.com/pin/123456789012345678/" },
];

test("PLATFORMS constant has exactly 12 supported platforms", () => {
  assert.equal(PLATFORMS.length, 12);
  const slugs = PLATFORMS.map((p) => p.slug);
  for (const item of PLATFORM_TEST_URLS) {
    assert.ok(slugs.includes(item.slug), `Missing platform slug: ${item.slug}`);
  }
});

// Test POST /api/download for all 12 platforms
test("POST /api/download generates valid download and proxy URLs for all 12 platforms", async () => {
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
    assert.equal(data.success, true, `Success is not true for ${item.name}`);
    assert.equal(data.platform, item.name, `Platform mismatch for ${item.name}`);
    assert.equal(data.downloadUrl, item.url);
    assert.equal(data.quality, "1080p Full HD");

    // Validate proxyDownloadUrl format
    assert.ok(data.proxyDownloadUrl.startsWith("/api/download?url="));
    assert.ok(data.proxyDownloadUrl.includes(encodeURIComponent(item.url)));
    assert.ok(data.proxyDownloadUrl.includes(`SaveFromPro_${item.slug}_video.mp4`));

    // Verify proxyDownloadUrl is parseable as a valid search query
    const parsedProxyUrl = new URL("http://localhost" + data.proxyDownloadUrl);
    assert.equal(parsedProxyUrl.searchParams.get("url"), item.url);
    assert.equal(parsedProxyUrl.searchParams.get("filename"), `SaveFromPro_${item.slug}_video.mp4`);
  }
});

// Test validation & edge cases in POST /api/download
test("POST /api/download handles edge cases and rejects invalid URLs", async () => {
  // Empty body
  const emptyReq = new Request("http://localhost/api/download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  const emptyRes = await downloadPostHandler(emptyReq);
  assert.equal(emptyRes.status, 400);
  const emptyData = await emptyRes.json();
  assert.equal(emptyData.success, false);

  // Missing or non-string URL
  const nullReq = new Request("http://localhost/api/download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: 12345 }),
  });
  const nullRes = await downloadPostHandler(nullReq);
  assert.equal(nullRes.status, 400);

  // Invalid URL format
  const malformedReq = new Request("http://localhost/api/download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: "htp:/broken-url" }),
  });
  const malformedRes = await downloadPostHandler(malformedReq);
  assert.equal(malformedRes.status, 400);

  // Unsupported platform URL (e.g. YouTube or unknown site)
  const unsupportedReq = new Request("http://localhost/api/download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }),
  });
  const unsupportedRes = await downloadPostHandler(unsupportedReq);
  assert.equal(unsupportedRes.status, 400);
  const unsupportedData = await unsupportedRes.json();
  assert.match(unsupportedData.error, /supported/i);
});

// Test GET /api/download streaming and proxying
test("GET /api/download validates query parameters", async () => {
  // Missing url param
  const reqNoParam = new Request("http://localhost/api/download");
  const resNoParam = await downloadGetHandler(reqNoParam);
  assert.equal(resNoParam.status, 400);
  assert.equal(await resNoParam.text(), "Missing url query parameter");

  // Invalid url param
  const reqInvalid = new Request("http://localhost/api/download?url=not-a-valid-url");
  const resInvalid = await downloadGetHandler(reqInvalid);
  assert.equal(resInvalid.status, 400);
  assert.equal(await resInvalid.text(), "Invalid media url query parameter");
});

test("GET /api/download streams media with correct attachment headers and content", async () => {
  const sampleMediaContent = "dummy-video-binary-content-mp4";
  const remoteMediaUrl = "https://cdn.example.com/videos/stream123.mp4";

  const restore = mockFetch((url, options) => {
    if (url === remoteMediaUrl) {
      return new Response(sampleMediaContent, {
        status: 200,
        headers: {
          "content-type": "video/mp4",
          "content-length": String(sampleMediaContent.length),
        },
      });
    }
    return new Response("Not found", { status: 404 });
  });

  try {
    const req = new Request(
      `http://localhost/api/download?url=${encodeURIComponent(remoteMediaUrl)}&filename=my_awesome_video.mp4`
    );
    const res = await downloadGetHandler(req);

    assert.equal(res.status, 200);
    assert.equal(res.headers.get("content-type"), "video/mp4");
    assert.equal(res.headers.get("content-disposition"), 'attachment; filename="my_awesome_video.mp4"');
    assert.equal(res.headers.get("content-length"), String(sampleMediaContent.length));
    assert.equal(res.headers.get("cache-control"), "public, max-age=3600");

    const text = await res.text();
    assert.equal(text, sampleMediaContent);
  } finally {
    restore();
  }
});

test("GET /api/download cleans filenames and appends default .mp4 extension if missing", async () => {
  const remoteMediaUrl = "https://cdn.example.com/videos/test.mp4";
  const restore = mockFetch(() => {
    return new Response("content", {
      status: 200,
      headers: { "content-type": "video/mp4" },
    });
  });

  try {
    // Filename with illegal characters and no extension
    const req = new Request(
      `http://localhost/api/download?url=${encodeURIComponent(remoteMediaUrl)}&filename=My%20Cool%20Video%20%231%20!`
    );
    const res = await downloadGetHandler(req);
    assert.equal(res.status, 200);

    const disposition = res.headers.get("content-disposition");
    // Spaces, '#' and '!' should be sanitized to '_' and '.mp4' added
    assert.equal(disposition, 'attachment; filename="My_Cool_Video__1__.mp4"');
  } finally {
    restore();
  }
});

test("GET /api/download redirects to direct mediaUrl when remote fetch fails (fallback)", async () => {
  const remoteMediaUrl = "https://cdn.example.com/videos/expired-link.mp4";
  const restore = mockFetch(() => {
    return new Response("Forbidden or Expired", { status: 403 });
  });

  try {
    const req = new Request(`http://localhost/api/download?url=${encodeURIComponent(remoteMediaUrl)}`);
    const res = await downloadGetHandler(req);

    // Should return 302 Redirect to the original direct mediaUrl as graceful fallback
    assert.equal(res.status, 302);
    assert.equal(res.headers.get("location"), remoteMediaUrl);
  } finally {
    restore();
  }
});

test("GET /api/download returns 500 when remote fetch throws an exception", async () => {
  const remoteMediaUrl = "https://cdn.example.com/videos/crash.mp4";
  const restore = mockFetch(() => {
    throw new Error("DNS lookup failed");
  });

  try {
    const req = new Request(`http://localhost/api/download?url=${encodeURIComponent(remoteMediaUrl)}`);
    const res = await downloadGetHandler(req);
    assert.equal(res.status, 500);
    assert.equal(await res.text(), "Error streaming media file");
  } finally {
    restore();
  }
});

// Test createMediaResponse download URL formatting
test("createMediaResponse builds valid downloadUrl for video, audio, and image assets", () => {
  const response = createMediaResponse({
    platform: "TikTok",
    platformSlug: "tiktok",
    title: "Awesome Dancer #Viral 2026!",
    media: [
      {
        quality: "HD Without Watermark",
        type: "video",
        format: "mp4",
        url: "https://tikwm.com/video_hd.mp4",
      },
      {
        quality: "Audio MP3",
        type: "audio",
        format: "mp3",
        url: "https://tikwm.com/audio.mp3",
      },
      {
        quality: "Thumbnail Cover",
        type: "image",
        format: "jpg",
        url: "https://tikwm.com/cover.jpg",
      },
    ],
  });

  assert.equal(response.success, true);
  assert.equal(response.media.length, 3);

  // Video downloadUrl
  const video = response.media[0];
  assert.ok(video.downloadUrl.startsWith("/api/download?url="));
  assert.ok(video.downloadUrl.includes(encodeURIComponent("https://tikwm.com/video_hd.mp4")));
  assert.ok(video.downloadUrl.endsWith(".mp4"));

  // Audio downloadUrl
  const audio = response.media[1];
  assert.ok(audio.downloadUrl.startsWith("/api/download?url="));
  assert.ok(audio.downloadUrl.includes(encodeURIComponent("https://tikwm.com/audio.mp3")));
  assert.ok(audio.downloadUrl.endsWith(".mp3"));

  // Image downloadUrl
  const image = response.media[2];
  assert.ok(image.downloadUrl.startsWith("/api/download?url="));
  assert.ok(image.downloadUrl.includes(encodeURIComponent("https://tikwm.com/cover.jpg")));
  assert.ok(image.downloadUrl.endsWith(".jpg"));
});

// Test all 12 platform services produce valid download URLs for each media item
test("All 12 platform extractors generate valid, parseable download URLs on all media items", async () => {
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
        assert.ok(m.downloadUrl.startsWith("/api/download?url="));
        const urlObj = new URL("http://localhost" + m.downloadUrl);
        assert.equal(urlObj.searchParams.get("url"), m.url);
      }
    } finally {
      restore();
    }
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
      assert.ok(res.media.length > 0);
      for (const m of res.media) {
        assert.ok(m.downloadUrl.startsWith("/api/download?url="));
        const urlObj = new URL("http://localhost" + m.downloadUrl);
        assert.equal(urlObj.searchParams.get("url"), m.url);
      }
    } finally {
      restore();
    }
  }

  // 3. TikTok
  {
    const restore = mockFetch(() =>
      new Response(
        JSON.stringify({
          code: 0,
          data: {
            title: "TikTok Video",
            play: "https://tikwm.com/v.mp4",
            hdplay: "https://tikwm.com/v_hd.mp4",
            music: "https://tikwm.com/m.mp3",
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
        assert.ok(m.downloadUrl.startsWith("/api/download?url="));
        const urlObj = new URL("http://localhost" + m.downloadUrl);
        assert.equal(urlObj.searchParams.get("url"), m.url);
      }
    } finally {
      restore();
    }
  }

  // 4. Twitter / X
  {
    const restore = mockFetch(() =>
      new Response(
        JSON.stringify({
          text: "Tweet text",
          mediaDetails: [
            {
              type: "video",
              video_info: {
                variants: [
                  { bitrate: 832000, content_type: "video/mp4", url: "https://video.twimg.com/720p.mp4" },
                ],
              },
            },
          ],
        }),
        { status: 200 }
      )
    );
    try {
      const res = await extractTwitterMedia("https://x.com/user/status/12345678");
      assert.equal(res.success, true);
      for (const m of res.media) {
        assert.ok(m.downloadUrl.startsWith("/api/download?url="));
        const urlObj = new URL("http://localhost" + m.downloadUrl);
        assert.equal(urlObj.searchParams.get("url"), m.url);
      }
    } finally {
      restore();
    }
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
        assert.ok(m.downloadUrl.startsWith("/api/download?url="));
        const urlObj = new URL("http://localhost" + m.downloadUrl);
        assert.equal(urlObj.searchParams.get("url"), m.url);
      }
    } finally {
      restore();
    }
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
              videoQualities: [{ quality: "1080", frameRate: 60, sourceURL: "https://twitch.tv/clip.mp4" }],
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
        assert.ok(m.downloadUrl.startsWith("/api/download?url="));
        const urlObj = new URL("http://localhost" + m.downloadUrl);
        assert.equal(urlObj.searchParams.get("url"), m.url);
      }
    } finally {
      restore();
    }
  }

  // 7. Dailymotion
  {
    const restore = mockFetch(() =>
      new Response(
        JSON.stringify({
          title: "Dailymotion Video",
          qualities: {
            "720": [{ type: "video/mp4", url: "https://proxy.dailymotion.com/720.mp4" }],
          },
        }),
        { status: 200 }
      )
    );
    try {
      const res = await extractDailymotionMedia("https://www.dailymotion.com/video/x12345");
      assert.equal(res.success, true);
      for (const m of res.media) {
        assert.ok(m.downloadUrl.startsWith("/api/download?url="));
        const urlObj = new URL("http://localhost" + m.downloadUrl);
        assert.equal(urlObj.searchParams.get("url"), m.url);
      }
    } finally {
      restore();
    }
  }

  // 8. Vimeo
  {
    const restore = mockFetch(() =>
      new Response(
        JSON.stringify({
          video: { title: "Vimeo Video" },
          request: {
            files: {
              progressive: [{ quality: "1080p", width: 1920, height: 1080, url: "https://vimeo.com/1080.mp4" }],
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
        assert.ok(m.downloadUrl.startsWith("/api/download?url="));
        const urlObj = new URL("http://localhost" + m.downloadUrl);
        assert.equal(urlObj.searchParams.get("url"), m.url);
      }
    } finally {
      restore();
    }
  }

  // 9. Reddit
  {
    const restore = mockFetch(() =>
      new Response(
        JSON.stringify([
          {
            data: {
              children: [
                {
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
                },
              ],
            },
          },
        ]),
        { status: 200 }
      )
    );
    try {
      const res = await extractRedditMedia("https://www.reddit.com/r/funny/comments/123/clip/");
      assert.equal(res.success, true);
      for (const m of res.media) {
        assert.ok(m.downloadUrl.startsWith("/api/download?url="));
        const urlObj = new URL("http://localhost" + m.downloadUrl);
        assert.equal(urlObj.searchParams.get("url"), m.url);
      }
    } finally {
      restore();
    }
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
        assert.ok(m.downloadUrl.startsWith("/api/download?url="));
        const urlObj = new URL("http://localhost" + m.downloadUrl);
        assert.equal(urlObj.searchParams.get("url"), m.url);
      }
    } finally {
      restore();
    }
  }

  // 11. LinkedIn
  {
    const restore = mockFetch(() =>
      new Response(
        `<html><head><meta property="og:video" content="https://linkedin.com/video.mp4" /><meta property="og:title" content="LinkedIn Post" /></head></html>`,
        { status: 200 }
      )
    );
    try {
      const res = await extractLinkedInMedia("https://www.linkedin.com/posts/user-activity-123456/");
      assert.equal(res.success, true);
      for (const m of res.media) {
        assert.ok(m.downloadUrl.startsWith("/api/download?url="));
        const urlObj = new URL("http://localhost" + m.downloadUrl);
        assert.equal(urlObj.searchParams.get("url"), m.url);
      }
    } finally {
      restore();
    }
  }

  // 12. Pinterest
  {
    const restore = mockFetch((url) => {
      if (url.includes("api.pinterest.com")) {
        return new Response(
          JSON.stringify({
            data: {
              pins: [
                {
                  description: "Pin Title",
                  videos: {
                    video_list: {
                      V_720P: { url: "https://pinterest.com/720p.mp4" },
                    },
                  },
                  images: {
                    orig: { url: "https://i.pinimg.com/orig.jpg" },
                  },
                },
              ],
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
        assert.ok(m.downloadUrl.startsWith("/api/download?url="));
        const urlObj = new URL("http://localhost" + m.downloadUrl);
        assert.equal(urlObj.searchParams.get("url"), m.url);
      }
    } finally {
      restore();
    }
  }
});

// Full end-to-end integration: POST /api/info -> extract media item -> trigger GET /api/download
test("End-to-End download flow: POST /api/info extracts media and GET /api/download streams it", async () => {
  const remoteVideoUrl = "https://tikwm.com/stream_sample.mp4";
  const videoBinaryData = "binary-video-stream-content-12345";

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
    if (url === remoteVideoUrl) {
      return new Response(videoBinaryData, {
        status: 200,
        headers: {
          "content-type": "video/mp4",
          "content-length": String(videoBinaryData.length),
        },
      });
    }
    return new Response("Not found", { status: 404 });
  });

  try {
    // 1. User submits URL to POST /api/info
    const infoReq = new Request("http://localhost/api/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: "https://www.tiktok.com/@dancer/video/9876543210" }),
    });

    const infoRes = await infoPostHandler(infoReq);
    assert.equal(infoRes.status, 200);
    const infoData = await infoRes.json();
    assert.equal(infoData.success, true);
    assert.equal(infoData.platform, "TikTok");
    assert.ok(infoData.media.length > 0);

    // 2. Select the first media item
    const selectedMedia = infoData.media[0];
    assert.ok(selectedMedia.downloadUrl);
    assert.ok(selectedMedia.downloadUrl.startsWith("/api/download?url="));

    // 3. Client clicks the download URL, which requests GET /api/download
    const downloadReq = new Request("http://localhost" + selectedMedia.downloadUrl);
    const downloadRes = await downloadGetHandler(downloadReq);

    assert.equal(downloadRes.status, 200);
    assert.equal(downloadRes.headers.get("content-type"), "video/mp4");
    assert.ok(downloadRes.headers.get("content-disposition").includes("attachment; filename="));
    assert.equal(await downloadRes.text(), videoBinaryData);
  } finally {
    restore();
  }
});
