import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata = {
  title: "Supported Platforms — Free Video Downloader for 12+ Sites",
  description:
    "Browse all supported platforms on SaveFromPro. Download videos, reels, stories, and audio from Facebook, Instagram, TikTok, Twitter/X, Snapchat, Twitch, Dailymotion, Vimeo, Reddit, Threads, LinkedIn, and Pinterest.",
  alternates: {
    canonical: `${SITE_URL}/platforms`,
  },
  openGraph: {
    title: "Supported Platforms — SaveFromPro",
    description:
      "Download HD videos from Facebook, Instagram, TikTok, Twitter/X, and 8+ more platforms for free.",
    url: `${SITE_URL}/platforms`,
    siteName: SITE_NAME,
  },
};

export default function PlatformsLayout({ children }) {
  return children;
}
