# SaveFromPro 🚀
> Premium, Lightning-Fast Video Downloader built for Cloudflare Edge & Next.js

SaveFromPro is a modern, high-performance online video downloader supporting **12 major social media & video platforms**. Built with Next.js 14 App Router, Tailwind CSS, Edge Runtime, and optimized specifically for deployment on **Cloudflare Pages** and **Cloudflare D1**.

---

## 🌟 Supported Platforms (12 Total)
1. **Facebook** (`/facebook`) - HD/SD Videos, Reels & Stories
2. **Instagram** (`/instagram`) - Reels, Posts, Stories & IGTV
3. **TikTok** (`/tiktok`) - Watermark-Free HD Videos & MP3 Audio
4. **Twitter / X** (`/twitter`) - Multi-resolution MP4 Videos & GIFs
5. **Snapchat** (`/snapchat`) - Spotlight & Public Story Videos
6. **Twitch** (`/twitch`) - Clips & High-Quality VODs
7. **Dailymotion** (`/dailymotion`) - 1080p, 720p, 480p Progressive MP4s
8. **Vimeo** (`/vimeo`) - HD, Full HD & 4K Streams
9. **Reddit** (`/reddit`) - Videos with Audio stream merge
10. **Threads** (`/threads`) - Videos and High-Res Images
11. **LinkedIn** (`/linkedin`) - Professional Posts & Video clips
12. **Pinterest** (`/pinterest`) - High-Res Pins & Videos

---

## ⚡ Tech Stack & Architecture
- **Framework**: Next.js 14 (App Router, Edge Runtime)
- **Styling**: Tailwind CSS + Custom Animations & Dark Glassmorphism Theme
- **Hosting**: [Cloudflare Pages](https://dash.cloudflare.com) (via `@cloudflare/next-on-pages`)
- **Database**: [Cloudflare D1](https://developers.cloudflare.com/d1/) (Serverless distributed SQL)
- **ORM & Migrations**: Drizzle ORM + raw SQL migrations
- **Icons**: Lucide Icons + Custom SVG Brand Icons
- **SEO**: Dynamic Sitemap (`/sitemap.xml`), Robots (`/robots.txt`), OpenGraph, JSON-LD Schema (WebApplication & FAQPage)
- **Testing**: Native Node.js Test Runner (38 automated unit & integration tests)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Automated Tests
```bash
npm test
```

### 4. Build for Cloudflare Pages
```bash
npm run pages:build
```

---

## 📖 Deployment Guide
Full deployment documentation is available in [DEPLOYMENT.md](./DEPLOYMENT.md).

Quick Deploy to Cloudflare Pages:
```bash
# Authenticate
npx wrangler login

# Create D1 database
npx wrangler d1 create savefrompro-db

# Run database migrations
npm run d1:migrate:remote

# Build & Deploy
npm run pages:deploy
```

---

## 🛡️ License & Disclaimer
This tool is for personal and educational use. Please respect copyright laws and the terms of service of each respective platform.
# AllDownload
