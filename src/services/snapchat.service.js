import {
  fetchWithTimeout,
  extractMetaTags,
  extractJsonLd,
  createMediaResponse,
  BOT_USER_AGENT,
} from "./base.js";

/**
 * Snapchat Spotlight & Story Downloader Service
 */
export async function extractSnapchatMedia(url) {
  try {
    const pageRes = await fetchWithTimeout(url, {
      headers: {
        "User-Agent": BOT_USER_AGENT,
      },
    });

    if (!pageRes.ok) {
      throw new Error("Could not access Snapchat content. The link might be invalid or expired.");
    }

    const html = await pageRes.text();
    const meta = extractMetaTags(html);
    const jsonLdList = extractJsonLd(html);

    let title = meta["og:title"] || meta["title"] || "Snapchat Video";
    let thumbnail = meta["og:image"] || null;
    let videoUrl =
      meta["og:video"] ||
      meta["og:video:url"] ||
      meta["twitter:player:stream"] ||
      null;

    // Try finding VideoObject in JSON-LD
    for (const json of jsonLdList) {
      if (json["@type"] === "VideoObject" || json.contentUrl) {
        if (json.contentUrl) videoUrl = json.contentUrl;
        if (json.thumbnailUrl) thumbnail = json.thumbnailUrl;
        if (json.name) title = json.name;
        break;
      }
    }

    // Try regex inside Next.js data or props
    if (!videoUrl) {
      const vidMatch =
        /"mediaUrl":"([^"]+\.mp4[^"]*)"/i.exec(html) ||
        /"streamingUrl":"([^"]+)"/i.exec(html) ||
        /<video[^>]+src=["']([^"']+)["']/i.exec(html);

      if (vidMatch && vidMatch[1]) {
        videoUrl = vidMatch[1].replace(/\\u002F/g, "/").replace(/\\\//g, "/");
      }
    }

    if (!videoUrl && !thumbnail) {
      throw new Error(
        "Could not find media in this Snapchat link. The story may have expired or is private."
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

    return createMediaResponse({
      platform: "Snapchat",
      platformSlug: "snapchat",
      title,
      thumbnail,
      media: mediaList,
    });
  } catch (error) {
    throw new Error(error.message || "Failed to process Snapchat media");
  }
}
