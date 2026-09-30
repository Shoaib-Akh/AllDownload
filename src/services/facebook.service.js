import {
  fetchWithTimeout,
  extractMetaTags,
  createMediaResponse,
  decodeHtmlEntities,
  BOT_USER_AGENT,
  DEFAULT_USER_AGENT,
} from "./base.js";

/**
 * Facebook Video Downloader Service
 * Extracts HD & SD direct mp4 links from Facebook videos, reels, and watch posts.
 */
export async function extractFacebookVideo(url) {
  try {
    const reelMatch = url.match(/(?:reel|videos|watch\/?\?v=)(\d+)/i);
    const videoId = reelMatch ? reelMatch[1] : null;

    // Standardize URL candidates to try
    const cleanUrl = url.replace(/m\.facebook\.com/, "www.facebook.com");
    const urlsToTry = [cleanUrl];
    if (videoId && url.includes("/reel/")) {
      urlsToTry.push(`https://www.facebook.com/watch/?v=${videoId}`);
      urlsToTry.push(`https://mbasic.facebook.com/video/video.php?v=${videoId}`);
    }

    const headers = {
      "User-Agent": BOT_USER_AGENT,
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    };

    // If a Facebook cookie is provided in environment variables, attach it
    if (typeof process !== "undefined" && process.env?.FACEBOOK_COOKIE) {
      headers["Cookie"] = process.env.FACEBOOK_COOKIE;
      headers["User-Agent"] = DEFAULT_USER_AGENT;
    }

    let html = "";
    let meta = {};
    let isLoginBlocked = false;

    for (const targetUrl of urlsToTry) {
      try {
        const response = await fetchWithTimeout(targetUrl, { headers });
        if (!response.ok && response.status !== 200) continue;
        const pageHtml = await response.text();

        if (pageHtml.includes("Log in to Facebook") || pageHtml.includes("id=\"login_form\"")) {
          isLoginBlocked = true;
        }

        html = pageHtml;
        meta = extractMetaTags(html);
        if (
          html.includes("playable_url") ||
          html.includes("browser_native") ||
          html.includes("hd_src") ||
          html.includes("sd_src") ||
          html.includes("fbcdn.net")
        ) {
          break;
        }
      } catch {
        // try next candidate
      }
    }

    // Decode HTML entities so patterns inside &quot;...&quot; are matched properly
    const decodedHtml = decodeHtmlEntities(html).replace(/&quot;/g, '"');

    const title =
      meta["og:title"] ||
      meta["title"] ||
      "Facebook Video";
    const thumbnail =
      meta["og:image"] ||
      meta["og:image:secure_url"] ||
      null;

    const mediaList = [];

    // Search for HD playable URLs inside scripts / page payload
    const hdMatch =
      /"browser_native_hd_url"\s*:\s*"([^"]+)"/i.exec(decodedHtml) ||
      /"playable_url_quality_hd"\s*:\s*"([^"]+)"/i.exec(decodedHtml) ||
      /"hd_src"\s*:\s*"([^"]+)"/i.exec(decodedHtml) ||
      /"hd_src_no_ratelimit"\s*:\s*"([^"]+)"/i.exec(decodedHtml);

    // Search for SD playable URLs
    const sdMatch =
      /"browser_native_sd_url"\s*:\s*"([^"]+)"/i.exec(decodedHtml) ||
      /"playable_url"\s*:\s*"([^"]+)"/i.exec(decodedHtml) ||
      /"sd_src"\s*:\s*"([^"]+)"/i.exec(decodedHtml) ||
      /"sd_src_no_ratelimit"\s*:\s*"([^"]+)"/i.exec(decodedHtml) ||
      /"playback_url"\s*:\s*"([^"]+)"/i.exec(decodedHtml);

    if (hdMatch && hdMatch[1]) {
      const hdUrl = decodeHtmlEntities(hdMatch[1].replace(/\\\//g, "/"));
      if (hdUrl.startsWith("http")) {
        mediaList.push({
          quality: "HD (720p/1080p)",
          type: "video",
          format: "mp4",
          url: hdUrl,
        });
      }
    }

    if (sdMatch && sdMatch[1]) {
      const sdUrl = decodeHtmlEntities(sdMatch[1].replace(/\\\//g, "/"));
      if (sdUrl.startsWith("http") && !mediaList.some((m) => m.url === sdUrl)) {
        mediaList.push({
          quality: "SD (480p/360p)",
          type: "video",
          format: "mp4",
          url: sdUrl,
        });
      }
    }

    // Direct fbcdn mp4 stream fallback inside page scripts
    if (mediaList.length === 0) {
      const directFbcdnMatch = /(https?:\\\/\\\/[^"'\\s]*?fbcdn\.net[^"'\\s]*?\.mp4[^"'\\s]*)/i.exec(html) ||
                               /(https:\/\/[^"'\s]*?fbcdn\.net[^"'\s]*?\.mp4[^"'\s]*)/i.exec(decodedHtml);
      if (directFbcdnMatch && directFbcdnMatch[1]) {
        const streamUrl = decodeHtmlEntities(directFbcdnMatch[1].replace(/\\\//g, "/"));
        mediaList.push({
          quality: "HD Video",
          type: "video",
          format: "mp4",
          url: streamUrl,
        });
      }
    }

    // Fallback: og:video tag
    if (mediaList.length === 0 && (meta["og:video"] || meta["og:video:url"])) {
      const ogVid = meta["og:video:secure_url"] || meta["og:video"] || meta["og:video:url"];
      if (ogVid && ogVid.startsWith("http")) {
        mediaList.push({
          quality: "Standard Video",
          type: "video",
          format: "mp4",
          url: ogVid,
        });
      }
    }

    if (mediaList.length === 0) {
      if (isLoginBlocked) {
        throw new Error(
          "Facebook requires login or session authentication to access this Reel/video. The post may be restricted to logged-in users, private, or region-locked."
        );
      }
      throw new Error(
        "Could not extract video from this Facebook URL. The post might be private, region-restricted, or removed."
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
