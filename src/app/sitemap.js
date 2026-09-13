import { PLATFORMS, SITE_URL } from "../lib/constants.js";

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
      url: `${baseUrl}/how-it-works`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
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

  return [...staticRoutes, ...platformRoutes];
}
