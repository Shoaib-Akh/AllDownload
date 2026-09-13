import {
  fetchWithTimeout,
  extractMetaTags,
  createMediaResponse,
  decodeHtmlEntities,
  BOT_USER_AGENT,
} from "./base.js";

/**
 * LinkedIn Video Downloader Service
 */
export async function extractLinkedInMedia(url) {
  try {
    const pageRes = await fetchWithTimeout(url, {
      headers: {
        "User-Agent": BOT_USER_AGENT,
      },
    });

    if (!pageRes.ok) {
      throw new Error("Could not access LinkedIn post. Please verify the link is public.");
    }

    const html = await pageRes.text();
    const meta = extractMetaTags(html);

    let title = meta["og:title"] || meta["title"] || "LinkedIn Video";
    let thumbnail = meta["og:image"] || null;
    let videoUrl =
      meta["og:video"] ||
      meta["og:video:url"] ||
      meta["og:video:secure_url"] ||
      null;

    // Search in scripts or video data-sources
    if (!videoUrl) {
      const srcMatch =
        /"progressiveStreams":\[\{[^}]*?"streamingLocations":\[\{"url":"([^"]+)"/i.exec(html) ||
        /"src":"([^"]+\.mp4[^"]*)"/i.exec(html) ||
        /<video[^>]+src=["']([^"']+)["']/i.exec(html);

      if (srcMatch && srcMatch[1]) {
        videoUrl = decodeHtmlEntities(srcMatch[1].replace(/\\\//g, "/").replace(/&amp;/g, "&"));
      }
    }

    if (!videoUrl && !thumbnail) {
      throw new Error("Could not find any video in this LinkedIn post.");
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
        quality: videoUrl ? "Preview Image" : "High Res Image",
        type: "image",
        format: "jpg",
        url: thumbnail,
      });
    }

    return createMediaResponse({
      platform: "LinkedIn",
      platformSlug: "linkedin",
      title: title.slice(0, 80),
      thumbnail,
      media: mediaList,
    });
  } catch (error) {
    throw new Error(error.message || "Failed to process LinkedIn video");
  }
}
