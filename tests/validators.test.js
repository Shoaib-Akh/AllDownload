import test from "node:test";
import assert from "node:assert/strict";
import { validateUrl, getPlatformFromUrl } from "../src/lib/validators.js";
import { PLATFORMS } from "../src/lib/constants.js";
import { detectPlatform, isValidUrl, slugToTitle } from "../src/lib/utils.js";

test("PLATFORMS constant contains all 12 required platforms", () => {
  assert.equal(PLATFORMS.length, 12);
  const expectedSlugs = [
    "facebook",
    "instagram",
    "tiktok",
    "twitter",
    "snapchat",
    "twitch",
    "dailymotion",
    "vimeo",
    "reddit",
    "threads",
    "linkedin",
    "pinterest",
  ];
  const actualSlugs = PLATFORMS.map((p) => p.slug);
  assert.deepEqual(actualSlugs, expectedSlugs);
});

test("validateUrl recognizes valid URLs for all 12 platforms", () => {
  const testCases = [
    { url: "https://www.facebook.com/watch/?v=123456789", platform: "facebook" },
    { url: "https://m.facebook.com/reel/987654321", platform: "facebook" },
    { url: "https://fb.watch/abcdef123/", platform: "facebook" },
    { url: "https://www.instagram.com/reel/CxABC12345/", platform: "instagram" },
    { url: "https://instagram.com/p/DFxyz9876/", platform: "instagram" },
    { url: "https://www.tiktok.com/@creator/video/7123456789012345678", platform: "tiktok" },
    { url: "https://vm.tiktok.com/ZM8abc123/", platform: "tiktok" },
    { url: "https://twitter.com/NASA/status/1789012345678901234", platform: "twitter" },
    { url: "https://x.com/SpaceX/status/1789012345678901234", platform: "twitter" },
    { url: "https://www.snapchat.com/spotlight/W7_ED1YxSR-abcdef", platform: "snapchat" },
    { url: "https://story.snapchat.com/s/username/12345", platform: "snapchat" },
    { url: "https://clips.twitch.tv/GloriousBraveFalcon", platform: "twitch" },
    { url: "https://www.twitch.tv/shroud/clip/GloriousBraveFalcon", platform: "twitch" },
    { url: "https://www.dailymotion.com/video/x8abcdef", platform: "dailymotion" },
    { url: "https://dai.ly/x8abcdef", platform: "dailymotion" },
    { url: "https://vimeo.com/76979871", platform: "vimeo" },
    { url: "https://player.vimeo.com/video/76979871", platform: "vimeo" },
    { url: "https://www.reddit.com/r/aww/comments/12345/cute_dog_video/", platform: "reddit" },
    { url: "https://redd.it/12345", platform: "reddit" },
    { url: "https://www.threads.net/@zuck/post/Cx123456", platform: "threads" },
    { url: "https://www.linkedin.com/posts/microsoft_tech-update-video_activity-7123456789", platform: "linkedin" },
    { url: "https://www.pinterest.com/pin/123456789012345678/", platform: "pinterest" },
    { url: "https://pin.it/abc1234", platform: "pinterest" },
  ];

  for (const tc of testCases) {
    const res = validateUrl(tc.url);
    assert.equal(res.valid, true, `URL should be valid: ${tc.url}`);
    assert.equal(res.error, null);

    const detected = getPlatformFromUrl(tc.url);
    assert.ok(detected, `Platform should be detected for ${tc.url}`);
    assert.equal(detected.slug, tc.platform, `Expected ${tc.platform} for ${tc.url}`);
  }
});

test("validateUrl rejects invalid or unsupported URLs", () => {
  // Empty or non-string
  assert.equal(validateUrl("").valid, false);
  assert.equal(validateUrl(null).valid, false);
  assert.equal(validateUrl(undefined).valid, false);

  // Malformed URL
  assert.equal(validateUrl("not a url").valid, false);
  assert.equal(validateUrl("http://").valid, false);

  // Unsupported domain
  const unsupported = validateUrl("https://example.com/video.mp4");
  assert.equal(unsupported.valid, false);
  assert.match(unsupported.error, /supported/i);
});

test("validateUrl with platformSlug parameter enforces platform match", () => {
  const fbUrl = "https://www.facebook.com/watch/?v=123456";
  const matchResult = validateUrl(fbUrl, "facebook");
  assert.equal(matchResult.valid, true);

  const mismatchResult = validateUrl(fbUrl, "tiktok");
  assert.equal(mismatchResult.valid, false);
  assert.match(mismatchResult.error, /TikTok/i);
});

test("detectPlatform and isValidUrl helper functions", () => {
  assert.equal(isValidUrl("https://instagram.com/reel/123"), true);
  assert.equal(isValidUrl("ftp://foo.bar"), true);
  assert.equal(isValidUrl("invalid-string"), false);

  const detected = detectPlatform("https://x.com/user/status/123");
  assert.equal(detected.slug, "twitter");
  assert.equal(detectPlatform("https://unknown.com"), null);

  assert.equal(slugToTitle("facebook"), "Facebook");
  assert.equal(slugToTitle("twitter"), "Twitter / X");
});
