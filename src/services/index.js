import { getPlatformFromUrl } from "../lib/validators.js";
import { extractFacebookVideo } from "./facebook.service.js";
import { extractInstagramMedia } from "./instagram.service.js";
import { extractTikTokVideo } from "./tiktok.service.js";
import { extractTwitterMedia } from "./twitter.service.js";
import { extractSnapchatMedia } from "./snapchat.service.js";
import { extractTwitchMedia } from "./twitch.service.js";
import { extractDailymotionMedia } from "./dailymotion.service.js";
import { extractVimeoMedia } from "./vimeo.service.js";
import { extractRedditMedia } from "./reddit.service.js";
import { extractThreadsMedia } from "./threads.service.js";
import { extractLinkedInMedia } from "./linkedin.service.js";
import { extractPinterestMedia } from "./pinterest.service.js";

/**
 * Service registry mapping platform slug to its extractor function
 */
export const serviceRegistry = {
  facebook: extractFacebookVideo,
  instagram: extractInstagramMedia,
  tiktok: extractTikTokVideo,
  twitter: extractTwitterMedia,
  snapchat: extractSnapchatMedia,
  twitch: extractTwitchMedia,
  dailymotion: extractDailymotionMedia,
  vimeo: extractVimeoMedia,
  reddit: extractRedditMedia,
  threads: extractThreadsMedia,
  linkedin: extractLinkedInMedia,
  pinterest: extractPinterestMedia,
};

import { mediaCache, statsTracker } from "./base.js";

/**
 * Main dispatcher to fetch media info from any supported platform
 *
 * @param {string} url - The media URL to download
 * @param {string|null} platformSlug - Optional explicit platform slug
 * @returns {Promise<Object>} Standardized media response
 */
export async function extractMedia(url, platformSlug = null) {
  if (!url || typeof url !== "string") {
    throw new Error("A valid URL is required");
  }

  const normalizedUrl = url.trim();
  const cacheKey = `media:${normalizedUrl.toLowerCase()}`;
  const cached = mediaCache.get(cacheKey);
  if (cached) {
    return { ...cached, fromCache: true };
  }

  // Determine platform
  let slug = platformSlug;
  if (!slug) {
    const platform = getPlatformFromUrl(normalizedUrl);
    if (!platform) {
      throw new Error("This URL is not supported. Please paste a link from one of our 12 supported platforms.");
    }
    slug = platform.slug;
  }

  const extractor = serviceRegistry[slug];
  if (!extractor) {
    throw new Error(`No extractor available for platform: ${slug}`);
  }

  const result = await extractor(normalizedUrl);
  if (result && result.success) {
    mediaCache.set(cacheKey, result);
  }
  return result;
}

export {
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
};
