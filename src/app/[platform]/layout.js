import { PLATFORMS, SITE_URL } from "@/lib/constants";

export async function generateMetadata({ params }) {
  const platform = PLATFORMS.find((p) => p.slug === params.platform);
  if (!platform) {
    return { title: "Platform Not Found" };
  }

  const pageUrl = `${SITE_URL}/${platform.slug}`;
  const title = `${platform.name} Video Downloader — Download ${platform.name} Videos in HD Free`;
  const description = `${platform.description} Fast, free online ${platform.name} video downloader without software installation.`;

  return {
    title,
    description,
    keywords: [
      `${platform.name} video downloader`,
      `download ${platform.name} videos`,
      `${platform.name} reels download`,
      `free ${platform.name} downloader`,
      `save ${platform.name} video`,
      `${platform.name} hd download`,
    ],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: "website",
      url: pageUrl,
      title: `${platform.name} Video Downloader — SaveFromPro`,
      description,
      siteName: "SaveFromPro",
      images: [
        {
          url: `/icons/${platform.slug}.svg`,
          width: 1200,
          height: 630,
          alt: `${platform.name} Video Downloader`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${platform.name} Video Downloader — SaveFromPro`,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export async function generateStaticParams() {
  return PLATFORMS.map((p) => ({ platform: p.slug }));
}

export default function PlatformLayout({ children }) {
  return children;
}
