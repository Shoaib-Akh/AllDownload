# SaveFromPro - Cloudflare Pages & D1 Database Deployment Guide 🚀

Yeh guide aapko **SaveFromPro** ko [Cloudflare Dashboard](https://dash.cloudflare.com) par deploy karne aur **Cloudflare D1 Database** setup karne ka complete tareeqa step-by-step batati hai.

---

## 📋 Table of Contents
1. [Prerequisites (Pehle se kya hona chahiye)](#1-prerequisites)
2. [Step 1: Cloudflare Login & CLI Setup](#step-1-cloudflare-login--cli-setup)
3. [Step 2: Cloudflare D1 Database Setup](#step-2-cloudflare-d1-database-setup)
4. [Step 3: Update `wrangler.toml`](#step-3-update-wranglertoml)
5. [Step 4: Run D1 Database Migrations](#step-4-run-d1-database-migrations)
6. [Step 5: Cloudflare Pages par Deploy Karne ke 2 Tareeqe](#step-5-cloudflare-pages-deploy)
   - Option A: Git Integration (GitHub / GitLab) - **Recommended**
   - Option B: Direct CLI Deploy (`wrangler pages deploy`)
7. [Step 6: Custom Domain Setup (savefrompro.com)](#step-6-custom-domain-setup)
8. [Available npm Commands & Verification](#available-npm-commands)

---

## 1. Prerequisites
- **Cloudflare Account**: [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up) (Free account kafi hai)
- **Node.js**: v18 ya v20+ installed
- **Git**: Installed and repository committed

---

## Step 1: Cloudflare Login & CLI Setup

Apne local terminal par Cloudflare CLI (Wrangler) ke zariye login karein:

```bash
npx wrangler login
```
Browser window open hogi, wahan **Allow** par click karein. Aapka terminal Cloudflare account se authenticate ho jayega.

---

## Step 2: Cloudflare D1 Database Setup

Cloudflare D1 ek serverless distributed SQLite database hai jo Edge locations par run hoti hai.

Terminal me yeh command run karein:

```bash
npx wrangler d1 create savefrompro-db
```

Output me aapko database details milengi:
```text
✅ Successfully created DB 'savefrompro-db'!

[[d1_databases]]
binding = "DB"
database_name = "savefrompro-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

Aap `database_id` ko copy kar lein.

---

## Step 3: Update `wrangler.toml`

Apne project ki `wrangler.toml` file open karein aur `database_id` replace karein:

```toml
name = "savefrompro"
compatibility_date = "2024-09-01"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".vercel/output/static"

[[d1_databases]]
binding = "DB"
database_name = "savefrompro-db"
database_id = "PASTE_YOUR_ACTUAL_DATABASE_ID_HERE"

[vars]
ENVIRONMENT = "production"
NEXT_PUBLIC_SITE_URL = "https://savefrompro.com"
```

---

## Step 4: Run D1 Database Migrations

Database tables create karne ke liye migration execute karein:

### Remote (Cloudflare Production DB):
```bash
npm run d1:migrate:remote
```
*(Wrangler `drizzle/0001_create_tables.sql` execute karega jisme `platforms`, `downloads`, `daily_stats`, `rate_limits`, aur `faqs` tables seed ho jayengi).*

### Database check karne ke liye:
```bash
npx wrangler d1 execute savefrompro-db --remote --command="SELECT * FROM platforms;"
```

---

## Step 5: Cloudflare Pages Deploy

### Option A: GitHub / Git Integration (Best Practice & Automatic CI/CD) ⭐

1. Apne project ko GitHub repository me push karein:
   ```bash
   git add .
   git commit -m "feat: complete SaveFromPro v1.0.0 ready for Cloudflare Pages"
   git push origin main
   ```

2. [https://dash.cloudflare.com](https://dash.cloudflare.com) par login karein.
3. Left sidebar me **Workers & Pages** par click karein.
4. **Create application** > **Pages** tab > **Connect to Git** select karein.
5. Apni GitHub repository (`savefrompro`) select karein.
6. **Build settings** configure karein:
   - **Framework preset**: `None` ya `Next.js`
   - **Build command**: `npx @cloudflare/next-on-pages`
   - **Build output directory**: `.vercel/output/static`
   - **Root directory**: `/` (ya agar subfolder me ho to folder path)
7. **Environment variables** add karein (Build time):
   - `NODE_VERSION` = `20`
8. **D1 Database Binding** link karein:
   - Project Settings > **Settings** > **Functions** > **D1 database bindings**
   - Variable name: `DB`
   - D1 Database: `savefrompro-db` select karein.
   - Compatibility Flag: `nodejs_compat` add karein.
9. **Save and Deploy** par click karein!

Aapka project automatically build ho kar live ho jayega! Har `git push` par automatically new deployment ban jayegi.

---

### Option B: Direct CLI Deploy (Fastest from Terminal)

Direct terminal se deploy karne ke liye:

```bash
# 1. Build next-on-pages package
npm run pages:build

# 2. Deploy to Cloudflare Pages
npx wrangler pages deploy .vercel/output/static --project-name savefrompro
```

Terminal aapko live preview URL de dega jaise:
`https://savefrompro.pages.dev`

---

## Step 6: Custom Domain Setup (savefrompro.com)

1. Cloudflare Dashboard me apne project par jayein:
   **Workers & Pages** > **savefrompro** > **Custom domains**.
2. **Set up a custom domain** par click karein.
3. Apna domain type karein: `savefrompro.com` (aur `www.savefrompro.com`).
4. Agar domain pehle se Cloudflare DNS par hai to automatically DNS records add ho jayenge aur Free SSL certificate 1 minute me activate ho jayega!

---

## Available npm Commands

| Command | Description |
|---|---|
| `npm run dev` | Local development server start karta hai (`localhost:3000`) |
| `npm test` | Automated test suite run karta hai (38 unit & integration tests) |
| `npm run build` | Next.js standard production build run karta hai |
| `npm run pages:build` | Cloudflare Pages ke liye Edge bundle banata hai (`@cloudflare/next-on-pages`) |
| `npm run pages:preview` | Local Cloudflare Pages environment me preview karta hai |
| `npm run pages:deploy` | Direct Cloudflare Pages par deploy karta hai |
| `npm run d1:migrate:remote` | Cloudflare D1 Remote Database par tables create karta hai |

---

## 🛡️ Security & Performance Included
- ✅ **Cloudflare Global Edge CDN**: 300+ Edge locations par instant loading.
- ✅ **Built-in In-Memory Caching**: Repeat video URL requests 0ms me respond hoti hain.
- ✅ **Rate Limiting**: Cloudflare Edge + Middleware abuse protection.
- ✅ **Security Headers**: HSTS, CSP, X-Frame-Options, Permissions-Policy configured.
- ✅ **Pure Client-Side / Edge Proxy**: Direct streaming proxy for instant download downloads without server lag.
