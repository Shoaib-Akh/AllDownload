import {
  fetchWithTimeout,
  extractMetaTags,
  createMediaResponse,
  BOT_USER_AGENT,
} from "./base.js";

/**
 * Twitch Clip & VOD Downloader Service
 */
export async function extractTwitchMedia(url) {
  try {
    const clipMatch =
      url.match(/clips\.twitch\.tv\/([A-Za-z0-9_-]+)/i) ||
      url.match(/twitch\.tv\/[^/]+\/clip\/([A-Za-z0-9_-]+)/i);

    const slug = clipMatch ? clipMatch[1] : null;

    let title = "Twitch Clip";
    let thumbnail = null;
    let author = null;
    let duration = null;
    const mediaList = [];

    // Method 1: Public Twitch GQL query for Clips
    if (slug) {
      try {
        const gqlQuery = {
          query: `query {
            clip(slug: "${slug}") {
              id
              title
              thumbnailURL
              durationSeconds
              broadcaster {
                displayName
              }
              videoQualities {
                frameRate
                quality
                sourceURL
              }
            }
          }`,
        };

        const gqlRes = await fetchWithTimeout("https://gql.twitch.tv/gql", {
          method: "POST",
          headers: {
            "Client-Id": "kimne78kx3ncx6brgo4mv6wki5h1ko",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(gqlQuery),
        });

        if (gqlRes.ok) {
          const gqlData = await gqlRes.json();
          const clip = gqlData?.data?.clip;

          if (clip) {
            title = clip.title || title;
            thumbnail = clip.thumbnailURL || thumbnail;
            author = clip.broadcaster?.displayName ? `@${clip.broadcaster.displayName}` : null;
            duration = clip.durationSeconds ? `${clip.durationSeconds}s` : null;

            if (Array.isArray(clip.videoQualities)) {
              for (const q of clip.videoQualities) {
                if (q.sourceURL) {
                  mediaList.push({
                    quality: `${q.quality}p (${q.frameRate}fps)`,
                    type: "video",
                    format: "mp4",
                    url: q.sourceURL,
                  });
                }
              }
            }
          }
        }
      } catch {
        // Fallback to meta tags
      }
    }

    // Method 2: Meta Tags fallback
    if (mediaList.length === 0) {
      const pageRes = await fetchWithTimeout(url, {
        headers: { "User-Agent": BOT_USER_AGENT },
      });

      if (pageRes.ok) {
        const html = await pageRes.text();
        const meta = extractMetaTags(html);

        title = meta["og:title"] || meta["title"] || title;
        thumbnail = meta["og:image"] || thumbnail;

        const videoUrl =
          meta["og:video"] ||
          meta["og:video:url"] ||
          meta["twitter:player:stream"];

        if (videoUrl) {
          mediaList.push({
            quality: "HD Video (Original)",
            type: "video",
            format: "mp4",
            url: videoUrl,
          });
        }
      }
    }

    if (mediaList.length === 0) {
      throw new Error("Could not extract Twitch clip stream. Please check the clip link.");
    }

    return createMediaResponse({
      platform: "Twitch",
      platformSlug: "twitch",
      title,
      thumbnail,
      author,
      duration,
      media: mediaList,
    });
  } catch (error) {
    throw new Error(error.message || "Failed to process Twitch clip");
  }
}
