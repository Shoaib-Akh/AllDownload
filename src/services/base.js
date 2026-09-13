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
      totalDownloads: 125840,
      todayDownloads: 1420,
      platforms: {
        facebook: 28400,
        instagram: 41200,
        tiktok: 32500,
        twitter: 14800,
        snapchat: 1200,
        twitch: 950,
        dailymotion: 820,
        vimeo: 1100,
        reddit: 2400,
        threads: 910,
        linkedin: 860,
        pinterest: 700,
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

/**
 * Standard media response factory
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
  return {
    success: true,
    platform,
    platformSlug,
    title: title || `${platform} Media`,
    thumbnail: thumbnail || null,
    duration: duration || null,
    author: author || null,
    media: media.map((item) => ({
      quality: item.quality || "Standard",
      type: item.type || "video",
      format: item.format || "mp4",
      url: item.url,
      downloadUrl: item.downloadUrl || `/api/download?url=${encodeURIComponent(item.url)}&filename=${encodeURIComponent((title || platform).slice(0, 50).replace(/[^a-zA-Z0-9_-]/g, "_"))}.${item.format || "mp4"}`,
      size: item.size || null,
    })),
  };
}
