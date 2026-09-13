import test from "node:test";
import assert from "node:assert/strict";
import {
  extractMetaTags,
  extractJsonLd,
  decodeHtmlEntities,
  createMediaResponse,
} from "../src/services/base.js";
import { formatFileSize, formatDuration } from "../src/lib/utils.js";

test("decodeHtmlEntities properly decodes HTML and Unicode entities", () => {
  assert.equal(decodeHtmlEntities("Foo &amp; Bar"), "Foo & Bar");
  assert.equal(decodeHtmlEntities("&quot;Hello&#39;s World&quot;"), '"Hello\'s World"');
  assert.equal(decodeHtmlEntities("https:&#x2F;&#x2F;cdn.example.com"), "https://cdn.example.com");
  assert.equal(decodeHtmlEntities("key\\u0026value"), "key&value");
  assert.equal(decodeHtmlEntities(""), "");
});

test("extractMetaTags extracts OpenGraph, Twitter and Title tags", () => {
  const sampleHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Sample Video Title</title>
        <meta property="og:title" content="Awesome Clip &amp; Reel" />
        <meta property="og:description" content="Watch this viral video" />
        <meta property="og:video" content="https://cdn.example.com/video.mp4" />
        <meta property="og:image" content="https://cdn.example.com/thumb.jpg" />
        <meta name="twitter:player:stream" content="https://cdn.example.com/stream.mp4" />
      </head>
      <body></body>
    </html>
  `;

  const meta = extractMetaTags(sampleHtml);
  assert.equal(meta["og:title"], "Awesome Clip & Reel");
  assert.equal(meta["og:description"], "Watch this viral video");
  assert.equal(meta["og:video"], "https://cdn.example.com/video.mp4");
  assert.equal(meta["og:image"], "https://cdn.example.com/thumb.jpg");
  assert.equal(meta["twitter:player:stream"], "https://cdn.example.com/stream.mp4");
});

test("extractJsonLd extracts VideoObject schema blocks", () => {
  const sampleHtml = `
    <html>
      <head>
        <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "VideoObject",
            "name": "Snapchat Spotlight Video",
            "thumbnailUrl": "https://images.snapchat.com/thumb.jpg",
            "contentUrl": "https://cf-st.sc-cdn.net/video.mp4",
            "duration": "PT30S"
          }
        </script>
      </head>
    </html>
  `;

  const jsonLd = extractJsonLd(sampleHtml);
  assert.equal(jsonLd.length, 1);
  assert.equal(jsonLd[0]["@type"], "VideoObject");
  assert.equal(jsonLd[0].name, "Snapchat Spotlight Video");
  assert.equal(jsonLd[0].contentUrl, "https://cf-st.sc-cdn.net/video.mp4");
});

test("createMediaResponse builds unified response structure with downloadUrl", () => {
  const result = createMediaResponse({
    platform: "TikTok",
    platformSlug: "tiktok",
    title: "Trending Dance",
    thumbnail: "https://p16.tiktokcdn.com/thumb.jpg",
    duration: "15s",
    author: "@dancer",
    media: [
      {
        quality: "HD Without Watermark",
        type: "video",
        format: "mp4",
        url: "https://tikwm.com/video_hd.mp4",
        size: 10485760,
      },
    ],
  });

  assert.equal(result.success, true);
  assert.equal(result.platform, "TikTok");
  assert.equal(result.platformSlug, "tiktok");
  assert.equal(result.title, "Trending Dance");
  assert.equal(result.author, "@dancer");
  assert.equal(result.media.length, 1);

  const mediaItem = result.media[0];
  assert.equal(mediaItem.quality, "HD Without Watermark");
  assert.equal(mediaItem.format, "mp4");
  assert.equal(mediaItem.size, 10485760);
  assert.ok(mediaItem.downloadUrl.startsWith("/api/download?url="));
});

test("formatFileSize and formatDuration format metrics appropriately", () => {
  assert.equal(formatFileSize(1024), "1.0 KB");
  assert.equal(formatFileSize(10485760), "10.0 MB");
  assert.equal(formatFileSize(1073741824), "1.0 GB");
  assert.equal(formatFileSize(0), "Unknown");

  assert.equal(formatDuration(65), "1:05");
  assert.equal(formatDuration(180), "3:00");
  assert.equal(formatDuration(0), "");
});
