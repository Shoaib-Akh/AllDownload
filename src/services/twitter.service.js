import {
  fetchWithTimeout,
  extractMetaTags,
  createMediaResponse,
  BOT_USER_AGENT,
} from "./base.js";

/**
 * Twitter / X Video & GIF Downloader Service
 */
export async function extractTwitterMedia(url) {
  try {
    const idMatch = url.match(/status(?:es)?\/(\d+)/i);
    const tweetId = idMatch ? idMatch[1] : null;

    if (!tweetId) {
      throw new Error("Could not find a valid Tweet/X post ID in this link.");
    }

    let title = "Twitter / X Video";
    let thumbnail = null;
    let author = null;
    const mediaList = [];

    // Method 1: Twitter Syndication API (Public, high quality variants)
    try {
      // Generate a syndication token / direct query
      const syndicationUrl = `https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}&lang=en`;
      const synRes = await fetchWithTimeout(syndicationUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });

      if (synRes.ok) {
        const data = await synRes.json();
        title = data.text ? data.text.slice(0, 100) : title;
        author = data.user ? `@${data.user.screen_name}` : null;

        // Check mediaDetails
        if (Array.isArray(data.mediaDetails)) {
          for (const item of data.mediaDetails) {
            if (item.type === "video" || item.type === "animated_gif") {
              thumbnail = item.media_url_https || thumbnail;

              if (item.video_info && Array.isArray(item.video_info.variants)) {
                // Filter only mp4 variants and sort by bitrate descending
                const mp4Variants = item.video_info.variants
                  .filter((v) => v.content_type === "video/mp4" && v.url)
                  .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));

                for (const v of mp4Variants) {
                  // Determine label from bitrate or dimensions
                  let label = "MP4 Video";
                  if (v.bitrate >= 2000000) label = "1080p Full HD";
                  else if (v.bitrate >= 800000) label = "720p HD";
                  else if (v.bitrate >= 400000) label = "480p SD";
                  else if (v.bitrate > 0) label = "360p / Mobile";
                  else label = "GIF / MP4";

                  if (!mediaList.some((m) => m.url === v.url)) {
                    mediaList.push({
                      quality: label,
                      type: "video",
                      format: "mp4",
                      url: v.url,
                    });
                  }
                }
              }
            } else if (item.type === "photo") {
              if (!thumbnail) thumbnail = item.media_url_https;
              mediaList.push({
                quality: "Photo (Original)",
                type: "image",
                format: "jpg",
                url: item.media_url_https,
              });
            }
          }
        }
      }
    } catch {
      // Continue to fallback
    }

    // Method 2: Scrape / oEmbed fallback
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
            quality: "Standard Video",
            type: "video",
            format: "mp4",
            url: videoUrl,
          });
        }
      }
    }

    if (mediaList.length === 0) {
      throw new Error(
        "Could not find video in this Tweet. Please verify that this tweet contains a video or GIF."
      );
    }

    return createMediaResponse({
      platform: "Twitter / X",
      platformSlug: "twitter",
      title,
      thumbnail,
      author,
      media: mediaList,
    });
  } catch (error) {
    throw new Error(error.message || "Failed to process Twitter/X media");
  }
}
