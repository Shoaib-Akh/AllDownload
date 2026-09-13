// Drizzle ORM Schema for Cloudflare D1
// This will be fully activated when D1 database is created

/**
 * Schema definitions for SaveFromPro database.
 * Tables: platforms, downloads, daily_stats, rate_limits, faqs
 *
 * To use with D1:
 * 1. Run: wrangler d1 create savefrompro-db
 * 2. Update wrangler.toml with the database_id
 * 3. Run migrations: wrangler d1 execute savefrompro-db --file=./drizzle/0001_create_tables.sql
 */

export const schema = {
  platforms: {
    tableName: "platforms",
    columns: {
      id: "INTEGER PRIMARY KEY AUTOINCREMENT",
      slug: "TEXT UNIQUE NOT NULL",
      name: "TEXT NOT NULL",
      icon: "TEXT",
      color: "TEXT",
      base_url: "TEXT",
      is_active: "BOOLEAN DEFAULT 1",
      total_downloads: "INTEGER DEFAULT 0",
      updated_at: "DATETIME DEFAULT CURRENT_TIMESTAMP",
    },
  },
  downloads: {
    tableName: "downloads",
    columns: {
      id: "INTEGER PRIMARY KEY AUTOINCREMENT",
      url: "TEXT NOT NULL",
      platform: "TEXT NOT NULL",
      media_title: "TEXT",
      thumbnail_url: "TEXT",
      media_type: "TEXT DEFAULT 'video'",
      quality: "TEXT",
      download_url: "TEXT",
      file_size: "INTEGER",
      ip_hash: "TEXT",
      user_agent: "TEXT",
      country: "TEXT",
      created_at: "DATETIME DEFAULT CURRENT_TIMESTAMP",
    },
  },
  daily_stats: {
    tableName: "daily_stats",
    columns: {
      id: "INTEGER PRIMARY KEY AUTOINCREMENT",
      date: "TEXT NOT NULL",
      platform: "TEXT NOT NULL",
      download_count: "INTEGER DEFAULT 0",
      unique_visitors: "INTEGER DEFAULT 0",
      errors: "INTEGER DEFAULT 0",
    },
  },
  rate_limits: {
    tableName: "rate_limits",
    columns: {
      id: "INTEGER PRIMARY KEY AUTOINCREMENT",
      ip_hash: "TEXT NOT NULL",
      request_count: "INTEGER DEFAULT 1",
      window_start: "DATETIME DEFAULT CURRENT_TIMESTAMP",
    },
  },
  faqs: {
    tableName: "faqs",
    columns: {
      id: "INTEGER PRIMARY KEY AUTOINCREMENT",
      platform: "TEXT",
      question: "TEXT NOT NULL",
      answer: "TEXT NOT NULL",
      sort_order: "INTEGER DEFAULT 0",
      is_active: "BOOLEAN DEFAULT 1",
    },
  },
};
