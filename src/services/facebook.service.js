import {
  fetchWithTimeout,
  extractMetaTags,
  createMediaResponse,
  decodeHtmlEntities,
  BOT_USER_AGENT,
} from "./base.js";

/**
 * Facebook Video Downloader Service
 * Extracts HD & SD direct mp4 links from Facebook videos, reels, and watch posts.
 */
export async function extractFacebookVideo(url) {
  try {
    // Standardize URL: use mobile/basic or desktop
    const cleanUrl = url.replace(/m\.facebook\.com/, "www.facebook.com");

    const response = await fetchWithTimeout(cleanUrl, {
      headers: {
        "User-Agent": BOT_USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    const html = await response.text();
    const meta = extractMetaTags(html);

    const title =
      meta["og:title"] ||
      meta["title"] ||
      "Facebook Video";
    const thumbnail =
      meta["og:image"] ||
      meta["og:image:secure_url"] ||
      null;

    const mediaList = [];

    // Search for playable URLs inside scripts / page payload
    // Facebook embeds: "playable_url_quality_hd":"https:..." and "playable_url":"https:..."
    const hdMatch =
      /"playable_url_quality_hd"\s*:\s*"([^"]+)"/i.exec(html) ||
      /"hd_src"\s*:\s*"([^"]+)"/i.exec(html) ||
      /"browser_native_hd_url"\s*:\s*"([^"]+)"/i.exec(html);

    const sdMatch =
      /"playable_url"\s*:\s*"([^"]+)"/i.exec(html) ||
      /"sd_src"\s*:\s*"([^"]+)"/i.exec(html) ||
      /"browser_native_sd_url"\s*:\s*"([^"]+)"/i.exec(html);

    if (hdMatch && hdMatch[1]) {
      const hdUrl = decodeHtmlEntities(hdMatch[1].replace(/\\\//g, "/"));
      mediaList.push({
        quality: "HD (720p/1080p)",
        type: "video",
        format: "mp4",
        url: hdUrl,
      });
    }

    if (sdMatch && sdMatch[1]) {
      const sdUrl = decodeHtmlEntities(sdMatch[1].replace(/\\\//g, "/"));
      if (!mediaList.some((m) => m.url === sdUrl)) {
        mediaList.push({
          quality: "SD (480p/360p)",
          type: "video",
          format: "mp4",
          url: sdUrl,
        });
      }
    }

    // Fallback: og:video tag
    if (mediaList.length === 0 && (meta["og:video"] || meta["og:video:url"])) {
      const ogVid = meta["og:video:secure_url"] || meta["og:video"] || meta["og:video:url"];
      mediaList.push({
        quality: "Standard Video",
        type: "video",
        format: "mp4",
        url: ogVid,
      });
    }

    if (mediaList.length === 0) {
      throw new Error(
        "Could not extract video from this Facebook URL. The post might be private or removed."
      );
    }

    return createMediaResponse({
      platform: "Facebook",
      platformSlug: "facebook",
      title,
      thumbnail,
      media: mediaList,
    });
  } catch (error) {
    throw new Error(error.message || "Failed to process Facebook video");
  }
}
