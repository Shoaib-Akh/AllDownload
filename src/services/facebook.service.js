import {
  fetchWithTimeout,
  extractMetaTags,
  createMediaResponse,
  decodeHtmlEntities,
  DEFAULT_USER_AGENT,
} from "./base.js";

/**
 * Facebook Video Downloader Service
 * Extracts HD & SD direct mp4 links from Facebook videos, reels, and watch posts.
 * Pure Edge-runtime compatible — zero Node.js built-ins.
 */
export async function extractFacebookVideo(url) {
  try {
    const reelMatch = url.match(/(?:reel|videos|watch\/?[\?&]v=)(\d+)/i);
    const videoId = reelMatch ? reelMatch[1] : null;

    // Standardize URL candidates to try
    const cleanUrl = url.replace(/m\.facebook\.com/, "www.facebook.com");
    const urlsToTry = [cleanUrl];
    if (videoId && url.includes("/reel/")) {
      urlsToTry.push(`https://www.facebook.com/watch/?v=${videoId}`);
      urlsToTry.push(`https://mbasic.facebook.com/video/video.php?v=${videoId}`);
    }

    const headers = {
      "User-Agent": DEFAULT_USER_AGENT,
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "sec-fetch-site": "none",
      "sec-fetch-mode": "navigate",
      "sec-fetch-user": "?1",
      "sec-fetch-dest": "document",
      "upgrade-insecure-requests": "1",
    };

// Fallback cookie session provided by user
const DEFAULT_FB_COOKIE =
  "sb=6RRJaHWbT9yUQ1m1pffyv5MB; datr=HF5faWjw00cA0hfsUENeiQSM; ps_l=1; ps_n=1; b_user=100015940210489; c_user=100015940210489; oo=v1; fr=1BSyVVj465XHxECH1.AWd1zfbhraXHhxD4Gx0PpC4G0OWB9hfvpWp-FTdzPFWZkrnUcTU.BqvIBt..AAA.0.0.BqvIBt.AWfdWC3kye59lSD0mFMujDrzUx8; xs=13%3AwswQLxw3sYRV9g%3A2%3A1790082718%3A-1%3A-1%3A%3AAcx_DPSPk93Y11wa5mRatEwR3ZMpgZlF_wPSOETJb7A; presence=C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1790741156025%2C%22v%22%3A1%7D; wd=1792x907";

    const cookieVal = (typeof process !== "undefined" && process.env?.FACEBOOK_COOKIE)
      ? process.env.FACEBOOK_COOKIE
      : DEFAULT_FB_COOKIE;

    if (cookieVal) {
      headers["Cookie"] = cookieVal.replace(/^"|"$/g, "").trim();
    }

    let html = "";
    let meta = {};
    let isLoginBlocked = false;
    let isServerBlocked = false;

    // ─── Direct page scrape with session cookie & browser headers ────────────
    for (const targetUrl of urlsToTry) {
      try {
        const response = await fetchWithTimeout(targetUrl, { headers });

        if (response.status === 400 || response.status === 429) {
          isServerBlocked = true;
          continue;
        }
        if (!response.ok) continue;

        const pageHtml = await response.text();

        if (
          pageHtml.includes("<title>Error</title>") &&
          pageHtml.includes("noindex,nofollow")
        ) {
          isServerBlocked = true;
          continue;
        }

        if (
          pageHtml.includes("Log in to Facebook") ||
          pageHtml.includes('id="login_form"')
        ) {
          isLoginBlocked = true;
        }

        html = pageHtml;
        meta = extractMetaTags(html);
        if (
          html.includes(".mp4") ||
          html.includes("playable_url") ||
          html.includes("browser_native") ||
          html.includes("hd_src") ||
          html.includes("sd_src")
        ) {
          break;
        }
      } catch {
        // try next candidate
      }
    }

    // Unescape JSON string escapes & HTML entities
    const unescaped = html.replaceAll("\\/", "/").replaceAll("\\u0026", "&");
    const decodedHtml = decodeHtmlEntities(unescaped)
      .replace(/&quot;/g, '"')
      .replace(/\\u003C/g, "<")
      .replace(/\\u003E/g, ">")
      .replace(/\\u0025/g, "%");

    const title =
      meta["og:title"] ||
      meta["title"] ||
      "Facebook Video";
    const thumbnail =
      meta["og:image"] ||
      meta["og:image:secure_url"] ||
      null;

    const mediaList = [];

    // Search for direct fbcdn mp4 URLs (matches both unescaped and escaped forms)
    const rawMatches = [
      ...html.matchAll(/https:(?:\\\/|\/)[^"'<>\s]+?\.mp4\?[^"'<>\s]+/gi),
    ];
    const rawMp4s = rawMatches.map((m) => {
      let u = m[0].replaceAll("\\/", "/").replaceAll("\\u0026", "&");
      return u.split(/\\u003C|<|&quot;|"|'|\s/)[0];
    });

    if (rawMp4s.length > 0) {
      const seenBases = new Set();
      const uniqueVideos = [];
      const uniqueAudios = [];

      for (const rawUrl of rawMp4s) {
        const cleanUrl = decodeHtmlEntities(rawUrl);
        const basePath = cleanUrl.split("?")[0];
        if (seenBases.has(basePath)) continue;
        seenBases.add(basePath);

        if (cleanUrl.includes("audio") || cleanUrl.includes("/m412/")) {
          uniqueAudios.push(cleanUrl);
        } else {
          uniqueVideos.push(cleanUrl);
        }
      }

      if (uniqueVideos.length > 0) {
        mediaList.push({
          quality: "HD Video (Original)",
          type: "video",
          format: "mp4",
          url: uniqueVideos[0],
        });
        if (uniqueVideos.length > 1) {
          mediaList.push({
            quality: "SD Video",
            type: "video",
            format: "mp4",
            url: uniqueVideos[uniqueVideos.length - 1],
          });
        }
      }

      if (uniqueAudios.length > 0) {
        mediaList.push({
          quality: "Audio MP3",
          type: "audio",
          format: "mp3",
          url: uniqueAudios[0],
        });
      }
    }

    // HD patterns (legacy)
    if (mediaList.length === 0) {
      const hdMatch =
        /"browser_native_hd_url"\s*:\s*"([^"]+)"/i.exec(decodedHtml) ||
        /"playable_url_quality_hd"\s*:\s*"([^"]+)"/i.exec(decodedHtml) ||
        /"hd_src"\s*:\s*"([^"]+)"/i.exec(decodedHtml) ||
        /"hd_src_no_ratelimit"\s*:\s*"([^"]+)"/i.exec(decodedHtml) ||
        /"hdUrl"\s*:\s*"([^"]+)"/i.exec(decodedHtml);

      const sdMatch =
        /"browser_native_sd_url"\s*:\s*"([^"]+)"/i.exec(decodedHtml) ||
        /"playable_url"\s*:\s*"([^"]+)"/i.exec(decodedHtml) ||
        /"sd_src"\s*:\s*"([^"]+)"/i.exec(decodedHtml) ||
        /"sd_src_no_ratelimit"\s*:\s*"([^"]+)"/i.exec(decodedHtml) ||
        /"playback_url"\s*:\s*"([^"]+)"/i.exec(decodedHtml) ||
        /"sdUrl"\s*:\s*"([^"]+)"/i.exec(decodedHtml);

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
    }

    // og:video fallback
    if (mediaList.length === 0 && (meta["og:video"] || meta["og:video:url"])) {
      const ogVid =
        meta["og:video:secure_url"] || meta["og:video"] || meta["og:video:url"];
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
      const isEmptyShell =
        html.length > 0 &&
        !html.includes("playable_url") &&
        !html.includes("hd_src") &&
        !html.includes("sd_src") &&
        !html.includes(".mp4") &&
        !meta["og:video"] &&
        !meta["og:title"];

      if (isServerBlocked || isEmptyShell) {
        throw new Error(
          "Facebook videos cannot be extracted without a login session from this server. " +
          "Facebook now requires authentication for Reel/video access. " +
          "Set the FACEBOOK_COOKIE environment variable (c_user + xs cookie values) to enable downloads."
        );
      }
      if (isLoginBlocked) {
        throw new Error(
          "Facebook requires login to access this Reel/video. The post may be " +
          "restricted to logged-in users, private, or region-locked."
        );
      }
      throw new Error(
        "Could not extract video from this Facebook URL. The post might be " +
        "private, region-restricted, or removed."
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
