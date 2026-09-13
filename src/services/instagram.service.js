import {
  fetchWithTimeout,
  extractMetaTags,
  createMediaResponse,
  decodeHtmlEntities,
  BOT_USER_AGENT,
} from "./base.js";

/**
 * Instagram Video & Reel Downloader Service
 */
export async function extractInstagramMedia(url) {
  try {
    const shortcodeMatch = url.match(/(?:reel|p|tv)\/([A-Za-z0-9_-]+)/i);
    const shortcode = shortcodeMatch ? shortcodeMatch[1] : null;

    let videoUrl = null;
    let thumbnailUrl = null;
    let title = "Instagram Video";

    // Method 1: Instagram Embed Page (no login required)
    if (shortcode) {
      try {
        const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/captioned/`;
        const embedRes = await fetchWithTimeout(embedUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
          },
        });

        if (embedRes.ok) {
          const embedHtml = await embedRes.text();
          // Extract video_url
          const videoMatch =
            /"video_url"\s*:\s*"([^"]+)"/i.exec(embedHtml) ||
            /video_url:\s*['"]([^'"]+)['"]/i.exec(embedHtml) ||
            /<video[^>]+src=["']([^"']+)["']/i.exec(embedHtml);

          if (videoMatch && videoMatch[1]) {
            videoUrl = decodeHtmlEntities(videoMatch[1].replace(/\\u0026/g, "&").replace(/\\\//g, "/"));
          }

          const imgMatch =
            /"display_url"\s*:\s*"([^"]+)"/i.exec(embedHtml) ||
            /<img[^>]+class=["'][^"']*EmbeddedMediaImage[^"']*["'][^>]+src=["']([^"']+)["']/i.exec(embedHtml);
          if (imgMatch && imgMatch[1]) {
            thumbnailUrl = decodeHtmlEntities(imgMatch[1].replace(/\\u0026/g, "&").replace(/\\\//g, "/"));
          }

          const captionMatch = /class="Caption"[^>]*>([\s\S]*?)<\/div>/i.exec(embedHtml);
          if (captionMatch && captionMatch[1]) {
            title = captionMatch[1].replace(/<[^>]+>/g, "").trim().slice(0, 80) || "Instagram Reel";
          }
        }
      } catch {
        // Fallback to Method 2
      }
    }

    // Method 2: Bot scrape / Direct scrape for Meta tags
    if (!videoUrl) {
      const pageRes = await fetchWithTimeout(url, {
        headers: {
          "User-Agent": BOT_USER_AGENT,
        },
      });

      if (pageRes.ok) {
        const html = await pageRes.text();
        const meta = extractMetaTags(html);

        videoUrl = meta["og:video:secure_url"] || meta["og:video"] || meta["twitter:player:stream"];
        thumbnailUrl = meta["og:image"] || thumbnailUrl;
        title = meta["og:title"] || meta["title"] || title;
      }
    }

    if (!videoUrl && !thumbnailUrl) {
      throw new Error(
        "Could not retrieve Instagram media. The account might be private or the link is expired."
      );
    }

    const mediaList = [];
    if (videoUrl) {
      mediaList.push({
        quality: "HD Video (Original)",
        type: "video",
        format: "mp4",
        url: videoUrl,
      });
    }

    if (thumbnailUrl) {
      mediaList.push({
        quality: "Cover Image (High Res)",
        type: "image",
        format: "jpg",
        url: thumbnailUrl,
      });
    }

    return createMediaResponse({
      platform: "Instagram",
      platformSlug: "instagram",
      title,
      thumbnail: thumbnailUrl,
      media: mediaList,
    });
  } catch (error) {
    throw new Error(error.message || "Failed to process Instagram link");
  }
}
