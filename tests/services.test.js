import test from "node:test";
import assert from "node:assert/strict";
import {
  extractMedia,
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

test("serviceRegistry contains all 12 platform extractors", () => {
  const expectedPlatforms = [
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

  for (const slug of expectedPlatforms) {
    assert.equal(typeof serviceRegistry[slug], "function", `Missing extractor for ${slug}`);
  }
});

test("Facebook Service extracts HD and SD video links", async () => {
  const restore = mockFetch((url) => {
    const html = `
      <html>
        <head>
          <meta property="og:title" content="Viral Facebook Video" />
          <meta property="og:image" content="https://facebook.com/thumb.jpg" />
        </head>
        <body>
          <script>
            var videoData = {
              "playable_url_quality_hd": "https:\\/\\/video.fbcdn.net\\/v\\/hd_sample.mp4",
              "playable_url": "https:\\/\\/video.fbcdn.net\\/v\\/sd_sample.mp4"
            };
          </script>
        </body>
      </html>
    `;
    return new Response(html, { status: 200 });
  });

  try {
    const result = await extractFacebookVideo("https://www.facebook.com/watch/?v=12345");
    assert.equal(result.success, true);
    assert.equal(result.platform, "Facebook");
    assert.equal(result.title, "Viral Facebook Video");
    assert.equal(result.thumbnail, "https://facebook.com/thumb.jpg");
    assert.ok(result.media.length >= 2);
    assert.equal(result.media[0].quality, "HD (720p/1080p)");
    assert.equal(result.media[0].url, "https://video.fbcdn.net/v/hd_sample.mp4");
  } finally {
    restore();
  }
});

test("Instagram Service extracts video from embed HTML", async () => {
  const restore = mockFetch((url) => {
    const embedHtml = `
      <div class="Caption">Sample Instagram Reel Caption</div>
      <script>
        window.__context = {
          "video_url": "https:\\/\\/instagram.fcdn.net\\/v\\/reel.mp4",
          "display_url": "https:\\/\\/instagram.fcdn.net\\/v\\/cover.jpg"
        };
      </script>
    `;
    return new Response(embedHtml, { status: 200 });
  });

  try {
    const result = await extractInstagramMedia("https://www.instagram.com/reel/Cx12345/");
    assert.equal(result.success, true);
    assert.equal(result.platform, "Instagram");
    assert.ok(result.media.some((m) => m.url === "https://instagram.fcdn.net/v/reel.mp4"));
  } finally {
    restore();
  }
});

test("TikTok Service extracts watermark-free video and MP3 audio", async () => {
  const restore = mockFetch((url) => {
    if (url.includes("tikwm.com")) {
      const data = {
        code: 0,
        data: {
          title: "Funny Cat Video",
          cover: "https://tiktok.com/cover.jpg",
          author: { unique_id: "catlover" },
          duration: 15,
          play: "https://tikwm.com/video_watermarkfree.mp4",
          hdplay: "https://tikwm.com/video_hd.mp4",
          music: "https://tikwm.com/audio.mp3",
        },
      };
      return new Response(JSON.stringify(data), { status: 200 });
    }
    return new Response("Not found", { status: 404 });
  });

  try {
    const result = await extractTikTokVideo("https://www.tiktok.com/@catlover/video/7123456789");
    assert.equal(result.success, true);
    assert.equal(result.platform, "TikTok");
    assert.equal(result.author, "@catlover");
    assert.equal(result.title, "Funny Cat Video");
    assert.ok(result.media.some((m) => m.quality === "HD Without Watermark"));
    assert.ok(result.media.some((m) => m.format === "mp3"));
  } finally {
    restore();
  }
});

test("Twitter / X Service extracts multi-resolution video variants", async () => {
  const restore = mockFetch((url) => {
    if (url.includes("syndication.twimg.com")) {
      const tweet = {
        text: "Rocket launch countdown successful!",
        user: { screen_name: "SpaceX" },
        mediaDetails: [
          {
            type: "video",
            media_url_https: "https://pbs.twimg.com/thumb.jpg",
            video_info: {
              variants: [
                { bitrate: 2176000, content_type: "video/mp4", url: "https://video.twimg.com/1080p.mp4" },
                { bitrate: 832000, content_type: "video/mp4", url: "https://video.twimg.com/720p.mp4" },
                { content_type: "application/x-mpegURL", url: "https://video.twimg.com/m3u8" },
              ],
            },
          },
        ],
      };
      return new Response(JSON.stringify(tweet), { status: 200 });
    }
    return new Response("Not found", { status: 404 });
  });

  try {
    const result = await extractTwitterMedia("https://x.com/SpaceX/status/1789012345678901234");
    assert.equal(result.success, true);
    assert.equal(result.platform, "Twitter / X");
    assert.equal(result.author, "@SpaceX");
    assert.equal(result.media[0].quality, "1080p Full HD");
    assert.equal(result.media[0].url, "https://video.twimg.com/1080p.mp4");
  } finally {
    restore();
  }
});

test("Snapchat Service extracts video via JSON-LD", async () => {
  const restore = mockFetch((url) => {
    const html = `
      <html>
        <head>
          <script type="application/ld+json">
            {
              "@type": "VideoObject",
              "name": "Snapchat Highlight",
              "thumbnailUrl": "https://snapchat.com/thumb.jpg",
              "contentUrl": "https://cf-st.sc-cdn.net/snap_video.mp4"
            }
          </script>
        </head>
      </html>
    `;
    return new Response(html, { status: 200 });
  });

  try {
    const result = await extractSnapchatMedia("https://www.snapchat.com/spotlight/W7_12345");
    assert.equal(result.success, true);
    assert.equal(result.platform, "Snapchat");
    assert.equal(result.media[0].url, "https://cf-st.sc-cdn.net/snap_video.mp4");
  } finally {
    restore();
  }
});

test("Twitch Service extracts clip via GQL response", async () => {
  const restore = mockFetch((url, options) => {
    if (url.includes("gql.twitch.tv")) {
      const gqlRes = {
        data: {
          clip: {
            title: "Insane Ace!",
            thumbnailURL: "https://twitch.tv/clip_thumb.jpg",
            durationSeconds: 30,
            broadcaster: { displayName: "Shroud" },
            videoQualities: [
              { quality: "1080", frameRate: 60, sourceURL: "https://clips.twitch.tv/1080.mp4" },
              { quality: "720", frameRate: 60, sourceURL: "https://clips.twitch.tv/720.mp4" },
            ],
          },
        },
      };
      return new Response(JSON.stringify(gqlRes), { status: 200 });
    }
    return new Response("Not found", { status: 404 });
  });

  try {
    const result = await extractTwitchMedia("https://clips.twitch.tv/GloriousBraveFalcon");
    assert.equal(result.success, true);
    assert.equal(result.platform, "Twitch");
    assert.equal(result.title, "Insane Ace!");
    assert.equal(result.author, "@Shroud");
    assert.equal(result.media[0].url, "https://clips.twitch.tv/1080.mp4");
  } finally {
    restore();
  }
});

test("Dailymotion Service extracts progressive streams via metadata API", async () => {
  const restore = mockFetch((url) => {
    if (url.includes("player/metadata/video")) {
      const data = {
        title: "Dailymotion Documentary",
        poster_url: "https://dailymotion.com/poster.jpg",
        duration: 120,
        qualities: {
          "1080": [{ type: "video/mp4", url: "https://dailymotion.com/1080.mp4" }],
          "720": [{ type: "video/mp4", url: "https://dailymotion.com/720.mp4" }],
        },
      };
      return new Response(JSON.stringify(data), { status: 200 });
    }
    return new Response("Not found", { status: 404 });
  });

  try {
    const result = await extractDailymotionMedia("https://www.dailymotion.com/video/x8abcde");
    assert.equal(result.success, true);
    assert.equal(result.platform, "Dailymotion");
    assert.equal(result.title, "Dailymotion Documentary");
    assert.equal(result.media[0].url, "https://dailymotion.com/1080.mp4");
  } finally {
    restore();
  }
});

test("Vimeo Service extracts progressive MP4 streams from config", async () => {
  const restore = mockFetch((url) => {
    if (url.includes("player.vimeo.com")) {
      const config = {
        video: {
          title: "Vimeo Masterpiece Film",
          thumbs: { base: "https://vimeo.com/thumb.jpg" },
          duration: 95,
        },
        request: {
          files: {
            progressive: [
              { quality: "1080p", height: 1080, fps: 60, url: "https://vimeo.com/progressive_1080.mp4" },
              { quality: "720p", height: 720, fps: 30, url: "https://vimeo.com/progressive_720.mp4" },
            ],
          },
        },
      };
      return new Response(JSON.stringify(config), { status: 200 });
    }
    return new Response("Not found", { status: 404 });
  });

  try {
    const result = await extractVimeoMedia("https://vimeo.com/76979871");
    assert.equal(result.success, true);
    assert.equal(result.platform, "Vimeo");
    assert.equal(result.title, "Vimeo Masterpiece Film");
    assert.equal(result.media[0].url, "https://vimeo.com/progressive_1080.mp4");
  } finally {
    restore();
  }
});

test("Reddit Service extracts video and audio streams", async () => {
  const restore = mockFetch((url) => {
    if (url.includes("reddit.com/comments")) {
      const data = [
        {
          data: {
            children: [
              {
                data: {
                  title: "A puppy playing in snow",
                  author: "dog_fan",
                  thumbnail: "https://reddit.com/thumb.jpg",
                  secure_media: {
                    reddit_video: {
                      fallback_url: "https://v.redd.it/123/DASH_720.mp4?source=fallback",
                      height: 720,
                      duration: 20,
                    },
                  },
                },
              },
            ],
          },
        },
      ];
      return new Response(JSON.stringify(data), { status: 200 });
    }
    return new Response("Not found", { status: 404 });
  });

  try {
    const result = await extractRedditMedia("https://www.reddit.com/r/aww/comments/123/puppy/");
    assert.equal(result.success, true);
    assert.equal(result.platform, "Reddit");
    assert.equal(result.author, "u/dog_fan");
    assert.ok(result.media.some((m) => m.type === "video"));
    assert.ok(result.media.some((m) => m.type === "audio"));
  } finally {
    restore();
  }
});

test("Threads Service extracts video via OpenGraph", async () => {
  const restore = mockFetch((url) => {
    const html = `
      <html>
        <head>
          <meta property="og:title" content="Threads Video Update" />
          <meta property="og:description" content="Check out the new features" />
          <meta property="og:image" content="https://threads.net/thumb.jpg" />
          <meta property="og:video" content="https://threads.net/video.mp4" />
        </head>
      </html>
    `;
    return new Response(html, { status: 200 });
  });

  try {
    const result = await extractThreadsMedia("https://www.threads.net/@zuck/post/Cx123456");
    assert.equal(result.success, true);
    assert.equal(result.platform, "Threads");
    assert.equal(result.media[0].url, "https://threads.net/video.mp4");
  } finally {
    restore();
  }
});

test("LinkedIn Service extracts video streams", async () => {
  const restore = mockFetch((url) => {
    const html = `
      <html>
        <head>
          <meta property="og:title" content="AI Keynote Session" />
          <meta property="og:image" content="https://linkedin.com/thumb.jpg" />
          <meta property="og:video" content="https://dms.licdn.com/playlist/vid.mp4" />
        </head>
      </html>
    `;
    return new Response(html, { status: 200 });
  });

  try {
    const result = await extractLinkedInMedia("https://www.linkedin.com/posts/microsoft_keynote");
    assert.equal(result.success, true);
    assert.equal(result.platform, "LinkedIn");
    assert.equal(result.media[0].url, "https://dms.licdn.com/playlist/vid.mp4");
  } finally {
    restore();
  }
});

test("Pinterest Service extracts high-res image and video pins", async () => {
  const restore = mockFetch((url) => {
    if (url.includes("api.pinterest.com")) {
      const data = {
        data: {
          pins: [
            {
              description: "Modern Living Room Interior",
              images: {
                orig: { url: "https://i.pinimg.com/originals/pin_art.jpg" },
              },
            },
          ],
        },
      };
      return new Response(JSON.stringify(data), { status: 200 });
    }
    return new Response("Not found", { status: 404 });
  });

  try {
    const result = await extractPinterestMedia("https://www.pinterest.com/pin/123456789/");
    assert.equal(result.success, true);
    assert.equal(result.platform, "Pinterest");
    assert.equal(result.media[0].url, "https://i.pinimg.com/originals/pin_art.jpg");
  } finally {
    restore();
  }
});

test("extractMedia central dispatcher handles auto-detection and errors", async () => {
  // Test invalid input
  await assert.rejects(async () => {
    await extractMedia("");
  }, /valid URL is required/);

  // Test unsupported domain
  await assert.rejects(async () => {
    await extractMedia("https://not-supported-platform.org/vid.mp4");
  }, /not supported/);
});
