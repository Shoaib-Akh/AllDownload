import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CookieConsent from "@/components/common/CookieConsent";
import { WebAppJsonLd } from "@/components/seo/JsonLd";

export const metadata = {
  metadataBase: new URL("https://savefrompro.com"),
  title: {
    default: "SaveFromPro — Free Online Video Downloader | HD Quality",
    template: "%s | SaveFromPro",
  },
  description:
    "Download videos from Facebook, Instagram, TikTok, Twitter/X, Snapchat, Twitch, Dailymotion, Vimeo, Reddit, Threads, LinkedIn, Pinterest. Free, fast, HD quality.",
  keywords: [
    "video downloader",
    "facebook video downloader",
    "instagram downloader",
    "tiktok downloader",
    "twitter video downloader",
    "online video downloader",
    "free video downloader",
    "HD video download",
    "savefrompro",
  ],
  authors: [{ name: "SaveFromPro" }],
  creator: "SaveFromPro",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://savefrompro.com",
    siteName: "SaveFromPro",
    title: "SaveFromPro — Free Online Video Downloader",
    description:
      "Download videos from 12+ platforms in HD quality. Free, fast, no signup required.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SaveFromPro — Free Online Video Downloader",
    description:
      "Download videos from 12+ platforms in HD quality. Free, fast, no signup required.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans bg-gray-950 text-white antialiased">
        <WebAppJsonLd />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <CookieConsent />
      </body>
    </html>
  );
}
