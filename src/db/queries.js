/**
 * Reusable DB Queries for SaveFromPro
 * These will work with Cloudflare D1 once the database is created.
 */

export async function getPlatforms(db) {
  const { results } = await db
    .prepare("SELECT * FROM platforms WHERE is_active = 1 ORDER BY total_downloads DESC")
    .all();
  return results;
}

export async function getPlatformBySlug(db, slug) {
  return await db
    .prepare("SELECT * FROM platforms WHERE slug = ?")
    .bind(slug)
    .first();
}

export async function logDownload(db, { url, platform, mediaTitle, thumbnailUrl, mediaType, quality, downloadUrl, fileSize, ipHash, userAgent, country }) {
  // Insert download record
  await db
    .prepare(
      `INSERT INTO downloads (url, platform, media_title, thumbnail_url, media_type, quality, download_url, file_size, ip_hash, user_agent, country)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(url, platform, mediaTitle, thumbnailUrl, mediaType, quality, downloadUrl, fileSize, ipHash, userAgent, country)
    .run();

  // Update platform total downloads
  await db
    .prepare("UPDATE platforms SET total_downloads = total_downloads + 1, updated_at = CURRENT_TIMESTAMP WHERE slug = ?")
    .bind(platform)
    .run();

  // Update daily stats
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

export async function getStats(db) {
  const totalResult = await db
    .prepare("SELECT SUM(total_downloads) as total FROM platforms")
    .first();

  const todayDate = new Date().toISOString().split("T")[0];
  const todayResult = await db
    .prepare("SELECT SUM(download_count) as today FROM daily_stats WHERE date = ?")
    .bind(todayDate)
    .first();

  const platformStats = await db
    .prepare("SELECT slug, total_downloads FROM platforms ORDER BY total_downloads DESC")
    .all();

  return {
    totalDownloads: totalResult?.total || 0,
    todayDownloads: todayResult?.today || 0,
    platforms: platformStats.results || [],
  };
}

export async function checkRateLimit(db, ipHash, maxRequests = 30, windowMinutes = 60) {
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

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
}
