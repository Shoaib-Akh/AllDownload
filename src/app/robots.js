import { SITE_URL } from "../lib/constants.js";

export default function robots() {
  const baseUrl = SITE_URL || "https://savefrompro.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
