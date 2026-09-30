/**
 * Live download test — verifies that each platform extractor returns a real
 * direct media file (video, audio, or image), not an HTML page or playlist.
 *
 * Run with:
 *   LIVE_DOWNLOAD=1 npm run test:live
 *
 * Never runs as part of the standard offline test suite (`npm test`).
 */

import test from "node:test";
import assert from "node:assert/strict";
import {
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

// Guard — only run when explicitly enabled
if (!process.env.LIVE_DOWNLOAD) {
  console.log("Live download tests skipped (set LIVE_DOWNLOAD=1 to run).");
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Known public URLs for each platform.
// Replace any of these with a fresher public post if a link expires.
// ---------------------------------------------------------------------------
const LIVE_TEST_CASES = [
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@tiktok/video/7106594312292453675",
    extractor: extractTikTokVideo,
  },
  {
    name: "Dailymotion",
    url: "https://www.dailymotion.com/video/x8p9w6i",
    extractor: extractDailymotionMedia,
  },
  {
    name: "Vimeo",
    url: "https://vimeo.com/76979871",
    extractor: extractVimeoMedia,
  },
  {
    name: "Reddit",
    url: "https://www.reddit.com/r/aww/comments/18a2pih/my_dog_loves_the_leaves/",
    extractor: extractRedditMedia,
  },
  {
    name: "Pinterest",
    url: "https://www.pinterest.com/pin/585487671496376563/",
    extractor: extractPinterestMedia,
  },
  // Platforms that frequently reject anonymous access should throw the
  // public-post error, NOT return the page URL or a fake file.
  {
    name: "Facebook",
    url: "https://www.facebook.com/watch/?v=856804279105430",
    extractor: extractFacebookVideo,
    mayRequireAuth: true,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/reel/C-0KhI8tUhP/",
    extractor: extractInstagramMedia,
    mayRequireAuth: true,
  },
  {
    name: "Twitter / X",
    url: "https://x.com/X/status/1785313799686246742",
    extractor: extractTwitterMedia,
    mayRequireAuth: true,
  },
  {
    name: "Snapchat",
    url: "https://www.snapchat.com/spotlight/W7_ED1YsX3cdqd3aBMLRwQAAYTEyODYyMjM3NTcwOTc2NjU4MQABBgAAAAA",
    extractor: extractSnapchatMedia,
    mayRequireAuth: true,
  },
  {
    name: "Twitch",
    url: "https://clips.twitch.tv/HeadlessCautiousCougarPanicVis-dFEfExMScb9LBCVR",
    extractor: extractTwitchMedia,
    mayRequireAuth: true,
  },
  {
    name: "Threads",
    url: "https://www.threads.net/@zuck/post/C4TChGNJqcM",
    extractor: extractThreadsMedia,
    mayRequireAuth: true,
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/posts/williamhgates_activity-7193973370783023104-9dvv",
    extractor: extractLinkedInMedia,
    mayRequireAuth: true,
  },
];

/**
 * Fetch the first few bytes of `url` and return the Content-Type.
 * Uses Range: bytes=0-1023 to avoid pulling the full file.
 */
async function probeContentType(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Range: "bytes=0-1023",
    },
    redirect: "follow",
  });
  return res.headers.get("content-type") || "";
}

// ---------------------------------------------------------------------------
// Live tests — one per platform
// ---------------------------------------------------------------------------

for (const tc of LIVE_TEST_CASES) {
  test(`[LIVE] ${tc.name}: extractor returns direct media files (not HTML or HLS)`, async () => {
    let result;
    try {
      result = await tc.extractor(tc.url);
    } catch (err) {
      if (tc.mayRequireAuth) {
        // Acceptable: platform rejected anonymous access
        assert.match(
          err.message,
          /public|private|login|unavailable|stream/i,
          `${tc.name} threw an unexpected error: ${err.message}`
        );
        console.log(`  ℹ  ${tc.name}: rejected anonymous access (expected) — "${err.message}"`);
        return;
      }
      throw err;
    }

    assert.equal(result.success, true, `${tc.name}: success must be true`);
    assert.ok(result.media.length > 0, `${tc.name}: must return at least one media item`);

    for (const m of result.media) {
      // downloadUrl must be a direct http URL, not a proxy
      assert.ok(
        m.url.startsWith("http"),
        `${tc.name}: url must start with http — got: ${m.url}`
      );
      assert.ok(
        !m.url.includes(".m3u8") && !m.url.includes(".mpd"),
        `${tc.name}: url must not be a playlist — got: ${m.url}`
      );
      assert.equal(
        m.downloadUrl,
        m.url,
        `${tc.name}: downloadUrl must equal url (no proxy)`
      );

      // Probe the first bytes — Content-Type must be video, audio, or image
      let contentType;
      try {
        contentType = await probeContentType(m.url);
      } catch {
        console.warn(`  ⚠  ${tc.name}: could not probe ${m.url} (network error)`);
        continue;
      }

      const isMediaType =
        contentType.startsWith("video/") ||
        contentType.startsWith("audio/") ||
        contentType.startsWith("image/") ||
        contentType === "application/octet-stream";

      assert.ok(
        isMediaType,
        `${tc.name}: Content-Type for ${m.url} is "${contentType}" — expected video, audio, or image`
      );

      console.log(`  ✓  ${tc.name} [${m.quality}] ${contentType} — ${m.url.slice(0, 80)}`);
    }
  });
}
