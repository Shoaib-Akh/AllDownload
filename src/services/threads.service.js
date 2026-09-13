import {
  fetchWithTimeout,
  extractMetaTags,
  createMediaResponse,
  decodeHtmlEntities,
  BOT_USER_AGENT,
} from "./base.js";

/**
 * Meta Threads Video & Image Downloader Service
 */
export async function extractThreadsMedia(url) {
  try {
    const pageRes = await fetchWithTimeout(url, {
      headers: {
        "User-Agent": BOT_USER_AGENT,
      },
    });

    if (!pageRes.ok) {
      throw new Error("Could not access Threads post. Please check the URL.");
    }

    const html = await pageRes.text();
    const meta = extractMetaTags(html);

    let title = meta["og:description"] || meta["og:title"] || "Threads Post";
    let thumbnail = meta["og:image"] || null;
    let videoUrl =
      meta["og:video"] ||
      meta["og:video:url"] ||
      meta["og:video:secure_url"] ||
      null;

    // Search in scripts for video_versions or display_url
    if (!videoUrl) {
      const vidMatch =
        /"video_versions":\[\{"url":"([^"]+)"/i.exec(html) ||
        /"video_url":"([^"]+)"/i.exec(html) ||
        /<video[^>]+src=["']([^"']+)["']/i.exec(html);

      if (vidMatch && vidMatch[1]) {
        videoUrl = decodeHtmlEntities(vidMatch[1].replace(/\\u0026/g, "&").replace(/\\\//g, "/"));
      }
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

    if (thumbnail) {
      mediaList.push({
        quality: videoUrl ? "Cover Image" : "High Res Image",
        type: "image",
        format: "jpg",
        url: thumbnail,
      });
    }

    if (mediaList.length === 0) {
      throw new Error("Could not find any video or image in this Threads post.");
    }

    return createMediaResponse({
      platform: "Threads",
      platformSlug: "threads",
      title: title.slice(0, 80),
      thumbnail,
      media: mediaList,
    });
  } catch (error) {
    throw new Error(error.message || "Failed to process Threads post");
  }
}
