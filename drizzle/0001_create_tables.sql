-- SaveFromPro Database Migration: Create Tables
-- Run with: wrangler d1 execute savefrompro-db --file=./drizzle/0001_create_tables.sql

CREATE TABLE IF NOT EXISTS platforms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    icon TEXT,
    color TEXT,
    base_url TEXT,
    is_active BOOLEAN DEFAULT 1,
    total_downloads INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS downloads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    platform TEXT NOT NULL,
    media_title TEXT,
    thumbnail_url TEXT,
    media_type TEXT DEFAULT 'video',
    quality TEXT,
    download_url TEXT,
    file_size INTEGER,
    ip_hash TEXT,
    user_agent TEXT,
    country TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (platform) REFERENCES platforms(slug)
);

CREATE TABLE IF NOT EXISTS daily_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    platform TEXT NOT NULL,
    download_count INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    errors INTEGER DEFAULT 0,
    UNIQUE(date, platform)
);

CREATE TABLE IF NOT EXISTS rate_limits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_hash TEXT NOT NULL,
    request_count INTEGER DEFAULT 1,
    window_start DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS faqs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform TEXT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_downloads_platform ON downloads(platform);
CREATE INDEX IF NOT EXISTS idx_downloads_created ON downloads(created_at);
CREATE INDEX IF NOT EXISTS idx_downloads_ip ON downloads(ip_hash);
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats(date);
CREATE INDEX IF NOT EXISTS idx_rate_limits_ip ON rate_limits(ip_hash);

-- Seed platform data
INSERT OR IGNORE INTO platforms (slug, name, icon, color, base_url) VALUES
    ('facebook', 'Facebook', 'facebook.svg', '#1877F2', 'https://facebook.com'),
    ('instagram', 'Instagram', 'instagram.svg', '#E4405F', 'https://instagram.com'),
    ('tiktok', 'TikTok', 'tiktok.svg', '#000000', 'https://tiktok.com'),
    ('twitter', 'Twitter / X', 'twitter.svg', '#000000', 'https://x.com'),
    ('snapchat', 'Snapchat', 'snapchat.svg', '#FFFC00', 'https://snapchat.com'),
    ('twitch', 'Twitch', 'twitch.svg', '#9146FF', 'https://twitch.tv'),
    ('dailymotion', 'Dailymotion', 'dailymotion.svg', '#00AAFF', 'https://dailymotion.com'),
    ('vimeo', 'Vimeo', 'vimeo.svg', '#1AB7EA', 'https://vimeo.com'),
    ('reddit', 'Reddit', 'reddit.svg', '#FF4500', 'https://reddit.com'),
    ('threads', 'Threads', 'threads.svg', '#000000', 'https://threads.net'),
    ('linkedin', 'LinkedIn', 'linkedin.svg', '#0A66C2', 'https://linkedin.com'),
    ('pinterest', 'Pinterest', 'pinterest.svg', '#E60023', 'https://pinterest.com');
