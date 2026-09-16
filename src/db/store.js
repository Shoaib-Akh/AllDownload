/**
 * In-Memory & Persistent Reactive Store for SaveFromPro
 * Tracks downloads (success & error), error logs, active visitors, and custom blog posts.
 */

class SaveFromStore {
  constructor() {
    this.init();
  }

  init() {
    // Initial users map (empty by default - populated on real visits)
    this.users = new Map();

    // Initial recent download records (empty by default - populated on real downloads)
    this.downloads = [];

    // Initial error diagnostic logs (empty by default - populated on real failures)
    this.errors = [];

    // Real high level metrics counters
    this.counters = {
      totalDownloads: 0,
      todayDownloads: 0,
      successfulDownloads: 0,
      failedDownloads: 0,
      platformTotals: {
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
    };

    // User / Admin created custom blogs (starts clean)
    this.customBlogs = [];

    // Real daily aggregated stats (keyed by 'YYYY-MM-DD')
    this.dailyStats = new Map();
  }

  // --- Visitor & User tracking ---
  recordUserVisit({ ipHash = "anon", userAgent = "Browser", country = "Global" } = {}) {
    const existing = this.users.get(ipHash);
    const now = new Date().toISOString();

    if (existing) {
      existing.last_seen = now;
      existing.visits_count = (existing.visits_count || 1) + 1;
      existing.user_agent = userAgent;
      if (country && country !== "Global") {
        existing.country = country;
      }
      this.users.set(ipHash, existing);
    } else {
      const newUser = {
        id: "usr_" + Math.random().toString(36).substring(2, 9),
        ip_hash: ipHash,
        user_agent: userAgent,
        country: country,
        first_seen: now,
        last_seen: now,
        visits_count: 1,
      };
      this.users.set(ipHash, newUser);
    }

    // Record visitor in daily stats
    const today = now.split("T")[0];
    if (!this.dailyStats.has(today)) {
      this.dailyStats.set(today, { date: today, downloads: 0, errors: 0, visitors: new Set() });
    }
    this.dailyStats.get(today).visitors.add(ipHash);

    return this.getUserStats();
  }

  getUserStats() {
    const now = Date.now();
    const fifteenMinutesAgo = now - 15 * 60 * 1000;

    let activeNow = 0;
    let repeatVisitors = 0;
    for (const u of this.users.values()) {
      if (new Date(u.last_seen).getTime() > fifteenMinutesAgo) {
        activeNow++;
      }
      if ((u.visits_count || 1) > 1) {
        repeatVisitors++;
      }
    }

    const totalUsers = this.users.size;
    const repeatRate = totalUsers > 0 ? parseFloat(((repeatVisitors / totalUsers) * 100).toFixed(1)) : 0.0;

    return {
      activeNow,
      totalUsers,
      repeatVisitors,
      repeatRate,
      recentUsers: Array.from(this.users.values()).slice(-15).reverse(),
    };
  }

  // --- Download & Error Logging ---
  recordDownload({
    url,
    platform = "other",
    mediaTitle = "Media Item",
    quality = "HD",
    fileSize = null,
    status = "success",
    errorMessage = null,
    ipHash = "anon",
    userAgent = "Browser",
    country = "Global",
  }) {
    const timestamp = new Date().toISOString();
    const id = "dl_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5);

    const record = {
      id,
      url,
      platform: platform ? platform.toLowerCase() : "other",
      media_title: mediaTitle,
      quality,
      file_size: fileSize,
      status: status === "success" ? "success" : "error",
      error_message: errorMessage,
      ip_hash: ipHash,
      user_agent: userAgent,
      country,
      created_at: timestamp,
    };

    this.downloads.unshift(record);
    if (this.downloads.length > 500) {
      this.downloads.pop();
    }

    // Update metrics
    if (status === "success") {
      this.counters.totalDownloads += 1;
      this.counters.todayDownloads += 1;
      this.counters.successfulDownloads += 1;

      const slug = record.platform;
      if (this.counters.platformTotals[slug] !== undefined) {
        this.counters.platformTotals[slug] += 1;
      }
    } else {
      this.counters.failedDownloads += 1;
      this.recordError({
        type: "DOWNLOAD_FAILURE",
        message: errorMessage || "Download failed",
        platform: record.platform,
        url,
        ipHash,
      });
    }

    // Update daily stats
    const today = timestamp.split("T")[0];
    if (!this.dailyStats.has(today)) {
      this.dailyStats.set(today, { date: today, downloads: 0, errors: 0, visitors: new Set() });
    }
    const dayEntry = this.dailyStats.get(today);
    dayEntry.visitors.add(ipHash);
    if (status === "success") {
      dayEntry.downloads += 1;
    } else {
      dayEntry.errors += 1;
    }

    // Also record user activity
    this.recordUserVisit({ ipHash, userAgent, country });

    return record;
  }

  recordError({ type = "GENERAL_ERROR", message, platform = "other", url = "", ipHash = "anon" }) {
    const timestamp = new Date().toISOString();
    const id = "err_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5);

    const errorItem = {
      id,
      type,
      message,
      platform,
      url,
      ip_hash: ipHash,
      timestamp,
    };

    this.errors.unshift(errorItem);
    if (this.errors.length > 200) {
      this.errors.pop();
    }

    return errorItem;
  }

  // --- Analytics Overview ---
  getAnalytics() {
    const userStats = this.getUserStats();
    const totalDls = this.counters.totalDownloads;
    const successDls = this.counters.successfulDownloads;
    const failedDls = this.counters.failedDownloads;
    const totalAttempts = successDls + failedDls;
    const successRate = totalAttempts > 0 ? parseFloat(((successDls / totalAttempts) * 100).toFixed(1)) : 100.0;

    return {
      totalDownloads: totalDls,
      todayDownloads: this.counters.todayDownloads,
      successfulDownloads: successDls,
      failedDownloads: failedDls,
      successRate,
      activeUsers: userStats.activeNow,
      totalUsers: userStats.totalUsers,
      repeatVisitors: userStats.repeatVisitors,
      repeatRate: userStats.repeatRate,
      platforms: this.counters.platformTotals,
      recentDownloads: this.downloads.slice(0, 20),
      recentErrors: this.errors.slice(0, 15),
    };
  }

  // --- Database Table Inspector ("admin can check the db") ---
  getTableList() {
    return [
      { name: "downloads", description: "Download records with success & error status, file metadata and IP hashes", rowCount: this.downloads.length },
      { name: "errors", description: "Failure logs, extraction errors, unsupported platforms, and rate limit triggers", rowCount: this.errors.length },
      { name: "users", description: "Active users, unique visitors, browser fingerprints, and session timestamps", rowCount: this.users.size },
      { name: "blogs", description: "User and admin published articles, including custom HTML & CSS payloads", rowCount: this.customBlogs.length },
      { name: "platforms", description: "Supported platform extractors, status flags, and cumulative metrics", rowCount: Object.keys(this.counters.platformTotals).length },
      { name: "daily_stats", description: "Daily aggregated download totals, unique visitor counts, and error tallies", rowCount: Math.max(this.dailyStats.size, 1) },
    ];
  }

  getTableData(tableName, { limit = 50, offset = 0, search = "", status = "all", platform = "all" } = {}) {
    let rows = [];
    let schema = [];

    switch (tableName) {
      case "downloads":
        schema = [
          { name: "id", type: "TEXT PRIMARY KEY" },
          { name: "platform", type: "TEXT" },
          { name: "media_title", type: "TEXT" },
          { name: "quality", type: "TEXT" },
          { name: "status", type: "TEXT ('success' | 'error')" },
          { name: "error_message", type: "TEXT" },
          { name: "url", type: "TEXT" },
          { name: "ip_hash", type: "TEXT" },
          { name: "created_at", type: "DATETIME" },
        ];
        rows = [...this.downloads];
        if (status !== "all") {
          rows = rows.filter((r) => r.status === status);
        }
        if (platform !== "all") {
          rows = rows.filter((r) => r.platform.toLowerCase() === platform.toLowerCase());
        }
        if (search) {
          const q = search.toLowerCase();
          rows = rows.filter(
            (r) =>
              (r.media_title && r.media_title.toLowerCase().includes(q)) ||
              (r.url && r.url.toLowerCase().includes(q)) ||
              (r.platform && r.platform.toLowerCase().includes(q)) ||
              (r.error_message && r.error_message.toLowerCase().includes(q))
          );
        }
        break;

      case "errors":
        schema = [
          { name: "id", type: "TEXT PRIMARY KEY" },
          { name: "type", type: "TEXT" },
          { name: "message", type: "TEXT" },
          { name: "platform", type: "TEXT" },
          { name: "url", type: "TEXT" },
          { name: "ip_hash", type: "TEXT" },
          { name: "timestamp", type: "DATETIME" },
        ];
        rows = [...this.errors];
        if (platform !== "all") {
          rows = rows.filter((r) => r.platform.toLowerCase() === platform.toLowerCase());
        }
        if (search) {
          const q = search.toLowerCase();
          rows = rows.filter(
            (r) =>
              (r.message && r.message.toLowerCase().includes(q)) ||
              (r.url && r.url.toLowerCase().includes(q)) ||
              (r.type && r.type.toLowerCase().includes(q))
          );
        }
        break;

      case "users":
        schema = [
          { name: "id", type: "TEXT PRIMARY KEY" },
          { name: "ip_hash", type: "TEXT" },
          { name: "user_agent", type: "TEXT" },
          { name: "country", type: "TEXT" },
          { name: "visits_count", type: "INTEGER" },
          { name: "first_seen", type: "DATETIME" },
          { name: "last_seen", type: "DATETIME" },
        ];
        rows = Array.from(this.users.values());
        if (search) {
          const q = search.toLowerCase();
          rows = rows.filter(
            (u) =>
              (u.ip_hash && u.ip_hash.toLowerCase().includes(q)) ||
              (u.country && u.country.toLowerCase().includes(q)) ||
              (u.user_agent && u.user_agent.toLowerCase().includes(q))
          );
        }
        break;

      case "blogs":
        schema = [
          { name: "id", type: "TEXT PRIMARY KEY" },
          { name: "slug", type: "TEXT UNIQUE" },
          { name: "title", type: "TEXT" },
          { name: "category", type: "TEXT" },
          { name: "createdBy", type: "TEXT ('user' | 'admin')" },
          { name: "has_custom_html", type: "BOOLEAN" },
          { name: "has_custom_css", type: "BOOLEAN" },
          { name: "is_published", type: "BOOLEAN" },
          { name: "created_at", type: "DATETIME" },
        ];
        rows = this.customBlogs.map((b) => ({
          id: b.id,
          slug: b.slug,
          title: b.title,
          category: b.category,
          createdBy: b.createdBy || "user",
          has_custom_html: Boolean(b.custom_html && b.custom_html.trim()),
          has_custom_css: Boolean(b.custom_css && b.custom_css.trim()),
          is_published: b.is_published,
          created_at: b.created_at,
        }));
        if (search) {
          const q = search.toLowerCase();
          rows = rows.filter((b) => b.title.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q));
        }
        break;

      case "platforms":
        schema = [
          { name: "slug", type: "TEXT PRIMARY KEY" },
          { name: "total_downloads", type: "INTEGER" },
          { name: "status", type: "TEXT" },
        ];
        rows = Object.entries(this.counters.platformTotals).map(([slug, count]) => ({
          slug,
          total_downloads: count,
          status: "active",
        }));
        break;

      case "daily_stats":
        schema = [
          { name: "date", type: "TEXT" },
          { name: "downloads", type: "INTEGER" },
          { name: "errors", type: "INTEGER" },
          { name: "visitors", type: "INTEGER" },
        ];
        if (this.dailyStats.size === 0) {
          const today = new Date().toISOString().split("T")[0];
          rows = [
            {
              date: today,
              downloads: this.counters.todayDownloads,
              errors: this.counters.failedDownloads,
              visitors: this.users.size,
            },
          ];
        } else {
          rows = Array.from(this.dailyStats.values())
            .map((d) => ({
              date: d.date,
              downloads: d.downloads,
              errors: d.errors,
              visitors: d.visitors instanceof Set ? d.visitors.size : (d.visitors || 0),
            }))
            .sort((a, b) => b.date.localeCompare(a.date));
        }
        break;

      default:
        return { error: `Table '${tableName}' not found` };
    }

    const totalCount = rows.length;
    const paginated = rows.slice(offset, offset + limit);

    return {
      table: tableName,
      schema,
      totalCount,
      limit,
      offset,
      rows: paginated,
    };
  }

  // --- Blog Management (User & Admin) ---
  getAllCustomBlogs() {
    return [...this.customBlogs];
  }

  getCustomBlogBySlug(slug) {
    return this.customBlogs.find((b) => b.slug === slug);
  }

  createBlog({
    title,
    excerpt,
    category = "Tutorials",
    authorName = "User Contributor",
    authorRole = "Community Member",
    tags = [],
    content = [],
    custom_html = "",
    custom_css = "",
    createdBy = "user",
    featured = false,
  }) {
    if (!title || !title.trim()) {
      throw new Error("Blog title is required");
    }

    // Generate clean slug
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    let slug = baseSlug || "post-" + Date.now().toString(36);

    // Ensure slug uniqueness
    const exists = this.customBlogs.find((b) => b.slug === slug);
    if (exists) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    // Form avatar initials
    const initials = (authorName || "User")
      .split(" ")
      .map((p) => p[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "UC";

    const newBlog = {
      id: "blog_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      slug,
      title: title.trim(),
      excerpt: excerpt?.trim() || title.trim(),
      category: category || "Guides",
      date: new Date().toISOString().split("T")[0],
      readTime: "3 min read",
      author: {
        name: authorName.trim(),
        role: authorRole.trim(),
        avatar: initials,
      },
      tags: Array.isArray(tags) ? tags : String(tags || "").split(",").map((t) => t.trim()).filter(Boolean),
      gradient: "from-violet-600 to-fuchsia-600",
      featured: Boolean(featured),
      content: Array.isArray(content) && content.length > 0 ? content : [
        {
          type: "intro",
          text: excerpt || title,
        },
      ],
      custom_html: custom_html || "",
      custom_css: custom_css || "",
      createdBy,
      is_published: true,
      created_at: new Date().toISOString(),
    };

    this.customBlogs.unshift(newBlog);
    return newBlog;
  }

  deleteBlog(idOrSlug) {
    const idx = this.customBlogs.findIndex((b) => b.id === idOrSlug || b.slug === idOrSlug);
    if (idx !== -1) {
      const removed = this.customBlogs.splice(idx, 1);
      return removed[0];
    }
    return null;
  }
}

// Export singleton instance
const globalStoreKey = Symbol.for("savefrompro.store");
if (!global[globalStoreKey]) {
  global[globalStoreKey] = new SaveFromStore();
}

export const store = global[globalStoreKey];
