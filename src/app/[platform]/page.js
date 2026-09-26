"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";
import { PLATFORMS } from "@/lib/constants";
import DownloadInput from "@/components/download/DownloadInput";
import DownloadResult from "@/components/download/DownloadResult";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import FAQ from "@/components/common/FAQ";
import { useDownload } from "@/hooks/useDownload";
import RecentDownloads from "@/components/home/RecentDownloads";
import FacebookPlatformView from "@/components/platform/FacebookPlatformView";
import InstagramPlatformView from "@/components/platform/InstagramPlatformView";
import TikTokPlatformView from "@/components/platform/TikTokPlatformView";
import TwitterPlatformView from "@/components/platform/TwitterPlatformView";
import SnapchatPlatformView from "@/components/platform/SnapchatPlatformView";
import TwitchPlatformView from "@/components/platform/TwitchPlatformView";
import DailymotionPlatformView from "@/components/platform/DailymotionPlatformView";
import RedditPlatformView from "@/components/platform/RedditPlatformView";
import LinkedInPlatformView from "@/components/platform/LinkedInPlatformView";
import PinterestPlatformView from "@/components/platform/PinterestPlatformView";
import VimeoPlatformView from "@/components/platform/VimeoPlatformView";
import ThreadsPlatformView from "@/components/platform/ThreadsPlatformView";
import {
  Video,
  Music,
  MessageCircle,
  AtSign,
  Ghost,
  Play,
  Pin,
  Download,
} from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterXIcon,
  LinkedInIcon,
} from "@/components/common/BrandIcons";

const iconMap = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  twitter: TwitterXIcon,
  linkedin: LinkedInIcon,
  music: Music,
  video: Video,
  "message-circle": MessageCircle,
  "at-sign": AtSign,
  pin: Pin,
  twitch: Video,
};

function PlatformPageContent({ platform }) {
  const searchParams = useSearchParams();
  const {
    status,
    result,
    error,
    isLoading,
    recents,
    fetchInfo,
    triggerDownload,
    clearRecents,
    removeRecent,
    reset,
  } = useDownload();

  const IconComponent = iconMap[platform.icon] || Video;

  const handleDownload = useCallback((url) => {
    fetchInfo(url, platform.slug);
  }, [fetchInfo, platform.slug]);

  // Auto-fill URL from query param
  useEffect(() => {
    const urlParam = searchParams.get("url");
    if (urlParam) {
      handleDownload(urlParam);
    }
  }, [searchParams, handleDownload]);

  const platformFaqs = [
    {
      question: `How to download ${platform.name} videos?`,
      answer: `Simply copy the ${platform.name} video URL, paste it in the input field above, and click Download. We'll fetch the video and provide download links in various qualities.`,
    },
    {
      question: `Is it free to download ${platform.name} videos?`,
      answer: `Yes! SaveFromPro is completely free. You can download unlimited ${platform.name} videos without any charges or registration.`,
    },
    {
      question: `What quality options are available for ${platform.name}?`,
      answer: `We offer the highest quality available from ${platform.name}, including HD (720p), Full HD (1080p), and sometimes higher depending on the original upload quality.`,
    },
    {
      question: `Can I download ${platform.name} videos on mobile?`,
      answer: `Absolutely! SaveFromPro works on all devices — Android, iPhone, iPad, and desktop browsers. No app installation needed.`,
    },
  ];

  if (platform.slug === "facebook") {
    return (
      <FacebookPlatformView
        platform={platform}
        handleDownload={handleDownload}
        isLoading={isLoading}
        error={error}
        reset={reset}
        result={result}
        triggerDownload={triggerDownload}
        recents={recents}
        clearRecents={clearRecents}
        removeRecent={removeRecent}
      />
    );
  }

  if (platform.slug === "instagram") {
    return (
      <InstagramPlatformView
        platform={platform}
        handleDownload={handleDownload}
        isLoading={isLoading}
        error={error}
        reset={reset}
        result={result}
        triggerDownload={triggerDownload}
        recents={recents}
        clearRecents={clearRecents}
        removeRecent={removeRecent}
      />
    );
  }

  if (platform.slug === "tiktok") {
    return (
      <TikTokPlatformView
        platform={platform}
        handleDownload={handleDownload}
        isLoading={isLoading}
        error={error}
        reset={reset}
        result={result}
        triggerDownload={triggerDownload}
        recents={recents}
        clearRecents={clearRecents}
        removeRecent={removeRecent}
      />
    );
  }

  if (platform.slug === "twitter") {
    return (
      <TwitterPlatformView
        platform={platform}
        handleDownload={handleDownload}
        isLoading={isLoading}
        error={error}
        reset={reset}
        result={result}
        triggerDownload={triggerDownload}
        recents={recents}
        clearRecents={clearRecents}
        removeRecent={removeRecent}
      />
    );
  }

  if (platform.slug === "snapchat") {
    return (
      <SnapchatPlatformView
        platform={platform}
        handleDownload={handleDownload}
        isLoading={isLoading}
        error={error}
        reset={reset}
        result={result}
        triggerDownload={triggerDownload}
        recents={recents}
        clearRecents={clearRecents}
        removeRecent={removeRecent}
      />
    );
  }

  if (platform.slug === "twitch") {
    return (
      <TwitchPlatformView
        platform={platform}
        handleDownload={handleDownload}
        isLoading={isLoading}
        error={error}
        reset={reset}
        result={result}
        triggerDownload={triggerDownload}
        recents={recents}
        clearRecents={clearRecents}
        removeRecent={removeRecent}
      />
    );
  }

  if (platform.slug === "dailymotion") {
    return (
      <DailymotionPlatformView
        platform={platform}
        handleDownload={handleDownload}
        isLoading={isLoading}
        error={error}
        reset={reset}
        result={result}
        triggerDownload={triggerDownload}
        recents={recents}
        clearRecents={clearRecents}
        removeRecent={removeRecent}
      />
    );
  }

  if (platform.slug === "reddit") {
    return (
      <RedditPlatformView
        platform={platform}
        handleDownload={handleDownload}
        isLoading={isLoading}
        error={error}
        reset={reset}
        result={result}
        triggerDownload={triggerDownload}
        recents={recents}
        clearRecents={clearRecents}
        removeRecent={removeRecent}
      />
    );
  }

  if (platform.slug === "linkedin") {
    return (
      <LinkedInPlatformView
        platform={platform}
        handleDownload={handleDownload}
        isLoading={isLoading}
        error={error}
        reset={reset}
        result={result}
        triggerDownload={triggerDownload}
        recents={recents}
        clearRecents={clearRecents}
        removeRecent={removeRecent}
      />
    );
  }

  if (platform.slug === "pinterest") {
    return (
      <PinterestPlatformView
        platform={platform}
        handleDownload={handleDownload}
        isLoading={isLoading}
        error={error}
        reset={reset}
        result={result}
        triggerDownload={triggerDownload}
        recents={recents}
        clearRecents={clearRecents}
        removeRecent={removeRecent}
      />
    );
  }

  if (platform.slug === "vimeo") {
    return (
      <VimeoPlatformView
        platform={platform}
        handleDownload={handleDownload}
        isLoading={isLoading}
        error={error}
        reset={reset}
        result={result}
        triggerDownload={triggerDownload}
        recents={recents}
        clearRecents={clearRecents}
        removeRecent={removeRecent}
      />
    );
  }

  if (platform.slug === "threads") {
    return (
      <ThreadsPlatformView
        platform={platform}
        handleDownload={handleDownload}
        isLoading={isLoading}
        error={error}
        reset={reset}
        result={result}
        triggerDownload={triggerDownload}
        recents={recents}
        clearRecents={clearRecents}
        removeRecent={removeRecent}
      />
    );
  }

  return (
    <>
      {/* Platform Hero */}
      <section className="relative overflow-hidden transition-colors duration-200">
        <div
          className={`absolute inset-0 bg-gradient-to-b ${platform.gradient} opacity-5`}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-violet-500/10 to-transparent rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
          {/* Platform Icon */}
          <div
            className={`inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br ${platform.gradient} items-center justify-center mb-6 shadow-lg`}
          >
            <IconComponent className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 transition-colors">
            {platform.name}{" "}
            <span className="gradient-text">Video Downloader</span>
          </h1>

          <p className="text-lg text-slate-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto transition-colors">
            {platform.description}
          </p>

          {/* Download Input */}
          <DownloadInput
            onSubmit={handleDownload}
            isLoading={isLoading}
            platform={platform}
          />

          {/* Result / Error / Loading */}
          {isLoading && <LoadingSpinner text="Fetching video info..." />}
          {error && (
            <div className="mt-6 max-w-2xl mx-auto">
              <ErrorMessage message={error} onRetry={reset} />
            </div>
          )}
          {result && (
            <DownloadResult
              result={result}
              onDownload={(item, title) => triggerDownload(item, title)}
            />
          )}

          <RecentDownloads
            recents={recents}
            onClear={clearRecents}
            onRemove={removeRecent}
          />
        </div>
      </section>

      {/* Features Strip */}
      <section className="py-12 bg-slate-100/80 dark:bg-gray-900/30 border-y border-slate-200 dark:border-gray-800/30 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {platform.features.map((feature) => (
            <div key={feature} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-600/10 border border-violet-200 dark:border-violet-500/20 flex items-center justify-center">
                <Download className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <span className="text-slate-900 dark:text-white text-sm font-medium transition-colors">{feature}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How to Use */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-10 transition-colors">
            How to Download {platform.name} Videos
          </h2>
          <div className="space-y-6">
            {[
              {
                step: 1,
                icon: "📋",
                title: "Copy the URL",
                desc: `Open ${platform.name}, find the video you want, and copy its URL/link.`,
              },
              {
                step: 2,
                icon: "📥",
                title: "Paste & Fetch",
                desc: "Paste the URL in the input field above and click the Download button.",
              },
              {
                step: 3,
                icon: "✅",
                title: "Download",
                desc: "Choose your preferred quality and download the video to your device.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-4 items-start bg-white dark:bg-gray-900/50 border border-slate-200 dark:border-gray-800/50 rounded-xl p-5 shadow-sm transition-colors"
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h3 className="text-slate-900 dark:text-white font-semibold mb-1 transition-colors">
                    Step {item.step}: {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-gray-400 text-sm transition-colors">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform FAQ */}
      <FAQ
        faqs={platformFaqs}
        title={`${platform.name} Downloader FAQ`}
        subtitle={`Common questions about downloading ${platform.name} videos.`}
      />
    </>
  );
}

export default function PlatformPage({ params }) {
  const platform = PLATFORMS.find((p) => p.slug === params.platform);

  if (!platform) {
    notFound();
  }

  return (
    <Suspense fallback={<LoadingSpinner text="Loading..." />}>
      <PlatformPageContent platform={platform} />
    </Suspense>
  );
}
