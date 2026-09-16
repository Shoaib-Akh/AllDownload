/**
 * Reusable DB Queries for SaveFromPro
 * Works with Cloudflare D1 and falls back to reactive store.
 */

import { store } from "./store.js";

export async function getPlatforms(db) {
  if (db && typeof db.prepare === "function") {
    const { results } = await db
      .prepare("SELECT * FROM platforms WHERE is_active = 1 ORDER BY total_downloads DESC")
      .all();
    if (results && results.length > 0) return results;
  }
  return Object.entries(store.counters.platformTotals).map(([slug, count]) => ({
    slug,
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
    total_downloads: count,
    is_active: 1,
  }));
}

export async function getPlatformBySlug(db, slug) {
  if (db && typeof db.prepare === "function") {
    const res = await db
      .prepare("SELECT * FROM platforms WHERE slug = ?")
      .bind(slug)
      .first();
    if (res) return res;
  }
  return {
    slug,
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
    total_downloads: store.counters.platformTotals[slug] || 0,
    is_active: 1,
  };
}

export async function logDownload(
  db,
  {
    url,
    platform,
    mediaTitle,
    thumbnailUrl,
    mediaType,
    quality,
    downloadUrl,
    fileSize,
    ipHash,
    userAgent,
    country,
    status = "success",
    errorMessage = null,
  }
) {
  // Always log to reactive store
  store.recordDownload({
    url,
    platform,
    mediaTitle,
    quality,
    fileSize,
    status,
    errorMessage,
    ipHash,
    userAgent,
    country,
  });

  // Also log to D1 if available
  if (db && typeof db.prepare === "function") {
    try {
      await db
        .prepare(
          `INSERT INTO downloads (url, platform, media_title, thumbnail_url, media_type, quality, download_url, file_size, ip_hash, user_agent, country)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(url, platform, mediaTitle, thumbnailUrl, mediaType, quality, downloadUrl, fileSize, ipHash, userAgent, country)
        .run();

      if (status === "success") {
        await db
          .prepare("UPDATE platforms SET total_downloads = total_downloads + 1, updated_at = CURRENT_TIMESTAMP WHERE slug = ?")
          .bind(platform)
          .run();

        const today = new Date().toISOString().split("T")[0];
        await db
          .prepare(
            `INSERT INTO daily_stats (date, platform, download_count, unique_visitors)
             VALUES (?, ?, 1, 1)
             ON CONFLICT(date, platform) DO UPDATE SET download_count = download_count + 1`
          )
          .bind(today, platform)
          .run();
      }
    } catch (e) {
      console.warn("D1 write warning:", e.message);
    }
  }
}

export async function getStats(db) {
  const storeAnalytics = store.getAnalytics();
  if (db && typeof db.prepare === "function") {
    try {
      const totalResult = await db.prepare("SELECT SUM(total_downloads) as total FROM platforms").first();
      const todayDate = new Date().toISOString().split("T")[0];
      const todayResult = await db.prepare("SELECT SUM(download_count) as today FROM daily_stats WHERE date = ?").bind(todayDate).first();
      const platformStats = await db.prepare("SELECT slug, total_downloads FROM platforms ORDER BY total_downloads DESC").all();

      if (totalResult?.total) {
        return {
          totalDownloads: totalResult.total,
          todayDownloads: todayResult?.today || 0,
          platforms: platformStats.results || [],
          successRate: storeAnalytics.successRate,
          activeUsers: storeAnalytics.activeUsers,
        };
      }
    } catch (e) {
      // fallback to store
    }
  }

  return {
    totalDownloads: storeAnalytics.totalDownloads,
    todayDownloads: storeAnalytics.todayDownloads,
    platforms: Object.entries(storeAnalytics.platforms).map(([slug, total_downloads]) => ({
      slug,
      total_downloads,
    })),
    successRate: storeAnalytics.successRate,
    activeUsers: storeAnalytics.activeUsers,
  };
}

export async function checkRateLimit(db, ipHash, maxRequests = 30, windowMinutes = 60) {
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

  if (db && typeof db.prepare === "function") {
    try {
      const existing = await db
        .prepare("SELECT * FROM rate_limits WHERE ip_hash = ? AND window_start > ?")
        .bind(ipHash, windowStart)
        .first();

      if (existing) {
        if (existing.request_count >= maxRequests) {
          return { allowed: false, remaining: 0 };
        }
        await db
          .prepare("UPDATE rate_limits SET request_count = request_count + 1 WHERE id = ?")
          .bind(existing.id)
          .run();
        return { allowed: true, remaining: maxRequests - existing.request_count - 1 };
      }

      await db
        .prepare("INSERT INTO rate_limits (ip_hash, request_count) VALUES (?, 1)")
        .bind(ipHash)
        .run();

      return { allowed: true, remaining: maxRequests - 1 };
    } catch (e) {
      // fallback
    }
  }

  return { allowed: true, remaining: maxRequests - 1 };
}
