/**
 * Base HTTP & Scraper Utilities for SaveFromPro Services
 */

export const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

export const BOT_USER_AGENT =
  "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)";

/**
 * Perform an HTTP request with timeout and custom headers
 */
export async function fetchWithTimeout(url, options = {}) {
  const { timeout = 10000, headers = {}, ...rest } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...rest,
      signal: controller.signal,
      headers: {
        "User-Agent": DEFAULT_USER_AGENT,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        ...headers,
      },
    });

    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Perform an HTTP request with automated retry logic
 */
export async function fetchWithRetry(url, options = {}, retries = 2, backoff = 300) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchWithTimeout(url, options);
      if (res.ok || attempt === retries) {
        return res;
      }
      // Retry on 5xx server errors
      if (res.status >= 500) {
        await new Promise((r) => setTimeout(r, backoff * Math.pow(2, attempt)));
        continue;
      }
      return res;
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, backoff * Math.pow(2, attempt)));
      }
    }
  }
  throw lastError || new Error("Failed after retries");
}

/**
 * Fast in-memory cache for media responses with TTL
 */
class MemoryCache {
  constructor(defaultTtl = 5 * 60 * 1000, maxSize = 1000) {
    this.cache = new Map();
    this.defaultTtl = defaultTtl;
    this.maxSize = maxSize;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }

  set(key, data, ttl = this.defaultTtl) {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttl,
    });
  }

  has(key) {
    return this.get(key) !== null;
  }

  clear() {
    this.cache.clear();
  }
}

export const mediaCache = new MemoryCache();

/**
 * In-memory global stats accumulator (synced with DB when available)
 */
class GlobalStatsTracker {
  constructor() {
    this.stats = {
      totalDownloads: 0,
      todayDownloads: 0,
      platforms: {
        facebook: 0,
        instagram: 0,
        tiktok: 0,
        twitter: 0,
        snapchat: 0,
        twitch: 0,
        dailymotion: 0,
        vimeo: 0,
        reddit: 0,
        threads: 0,
        linkedin: 0,
        pinterest: 0,
      },
      recentDownloads: [],
    };
  }

  recordDownload(platformSlug, title, mediaUrl) {
    this.stats.totalDownloads += 1;
    this.stats.todayDownloads += 1;
    const slug = platformSlug ? platformSlug.toLowerCase() : "other";
    if (this.stats.platforms[slug] !== undefined) {
      this.stats.platforms[slug] += 1;
    }

    if (title) {
      this.stats.recentDownloads.unshift({
        id: Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
        title,
        platform: slug,
        url: mediaUrl || "",
        timestamp: new Date().toISOString(),
      });
      if (this.stats.recentDownloads.length > 20) {
        this.stats.recentDownloads.pop();
      }
    }
  }

  getStats() {
    return { ...this.stats };
  }
}

export const statsTracker = new GlobalStatsTracker();

/**
 * Extract OpenGraph and Twitter meta tags from HTML text
 */
export function extractMetaTags(html) {
  const meta = {};
  if (!html || typeof html !== "string") return meta;

  const tagRegex =
    /<meta\s+(?:[^>]*?\s+)?(?:name|property)=["']([^"']+)["']\s+(?:[^>]*?\s+)?content=["']([^"']+)["']/gi;
  let match;

  while ((match = tagRegex.exec(html)) !== null) {
    const key = match[1].toLowerCase();
    const value = decodeHtmlEntities(match[2]);
    meta[key] = value;
  }

  // Also extract title if available
  const titleMatch = /<title[^>]*>([^<]+)<\/title>/i.exec(html);
  if (titleMatch && !meta["og:title"]) {
    meta["title"] = decodeHtmlEntities(titleMatch[1].trim());
  }

  return meta;
}

/**
 * Extract JSON-LD script blocks from HTML
 */
export function extractJsonLd(html) {
  if (!html) return [];
  const results = [];
  const jsonLdRegex =
    /<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;

  while ((match = jsonLdRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1].trim());
      results.push(parsed);
    } catch {
      // ignore invalid json
    }
  }

  return results;
}

/**
 * Simple HTML entity decoder
 */
export function decodeHtmlEntities(str) {
  if (!str) return "";
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/\\u0026/g, "&")
    .replace(/\\u003c/g, "<")
    .replace(/\\u003e/g, ">");
}

/** Hostname patterns that serve direct media files we can safely redirect to */
const ALLOWED_CDN_HOSTS = [
  /\.fbcdn\.net$/i,
  /\.cdninstagram\.com$/i,
  /tiktokcdn\.com$/i,
  /tikwm\.com$/i,
  /\.twimg\.com$/i,
  /snap\.com$/i,
  /sc-cdn\.net$/i,
  /\.jtvnw\.net$/i,
  /\.ttvnw\.net$/i,
  /\.dmcdn\.net$/i,
  /\.vimeocdn\.com$/i,
  /vimeo\.com$/i,
  /v\.redd\.it$/i,
  /\.redd\.it$/i,
  /redditmedia\.com$/i,
  /\.pinimg\.com$/i,
  /pinterest\.com$/i,
  /pinterest\.[a-z.]+$/i,
  /licdn\.com$/i,
  /\.threads\.net$/i,
  /threads\.net$/i,
  /dailymotion\.com$/i,
  /\.dm\.gg$/i,
  /proxy\.dailymotion\.com$/i,
  /\/\/[^/]*twitch\.tv/i,
];

/**
 * Returns true when `url` points to an allowed CDN host.
 */
export function isAllowedMediaHost(url) {
  try {
    const { hostname } = new URL(url);
    return ALLOWED_CDN_HOSTS.some((re) => re.test(hostname));
  } catch {
    return false;
  }
}

/**
 * Returns true when the URL looks like an HLS/DASH playlist, not a direct file.
 */
function isPlaylistUrl(url, format) {
  if (!url) return false;
  const u = url.toLowerCase().split("?")[0];
  return (
    u.endsWith(".m3u8") ||
    u.endsWith(".mpd") ||
    (typeof format === "string" &&
      (format.toLowerCase() === "m3u8" ||
        format.toLowerCase() === "mpd" ||
        format.toLowerCase() === "hls" ||
        format.toLowerCase() === "dash"))
  );
}

/**
 * Standard media response factory.
 *
 * Only direct MP4/WebM/MOV/MP3/audio/image files are included in the output.
 * HLS (.m3u8) and DASH (.mpd) playlist entries are silently dropped.
 * If **no** direct-file URLs remain after filtering, throws:
 *   "This video is only available as a stream, not a downloadable file."
 *
 * `downloadUrl` is now the direct CDN URL itself — the browser downloads it
 * straight from the platform CDN; no bytes pass through Cloudflare.
 */
export function createMediaResponse({
  platform,
  platformSlug,
  title,
  thumbnail,
  duration,
  author,
  media = [],
}) {
  // Drop HLS / DASH playlist entries
  const directMedia = media.filter(
    (item) => item.url && !isPlaylistUrl(item.url, item.format)
  );

  if (directMedia.length === 0) {
    throw new Error(
      "This video is only available as a stream, not a downloadable file."
    );
  }

  const safeTitle = (title || platform)
    .slice(0, 50)
    .replace(/[^a-zA-Z0-9_-]/g, "_");

  return {
    success: true,
    platform,
    platformSlug,
    title: title || `${platform} Media`,
    thumbnail: thumbnail || null,
    duration: duration || null,
    author: author || null,
    media: directMedia.map((item) => ({
      quality: item.quality || "Standard",
      type: item.type || "video",
      format: item.format || "mp4",
      url: item.url,
      // downloadUrl IS the direct CDN URL — browser fetches it directly.
      // No video bytes pass through Cloudflare Workers.
      downloadUrl: item.url,
      size: item.size || null,
    })),
  };
}
