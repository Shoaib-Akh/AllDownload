import { PLATFORMS, SITE_URL } from "../lib/constants.js";
import { BLOG_POSTS } from "../lib/blog-data.js";

export default function sitemap() {
  const baseUrl = SITE_URL || "https://savefrompro.com";
  const now = new Date();

  // Static pages
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/platforms`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Dynamic platform pages
  const platformRoutes = PLATFORMS.map((platform) => ({
    url: `${baseUrl}/${platform.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.9,
  }));

  // Dynamic blog post routes
  const blogRoutes = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...platformRoutes, ...blogRoutes];
}
