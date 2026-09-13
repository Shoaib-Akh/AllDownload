"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, ClipboardPaste, Sparkles, Loader2 } from "lucide-react";
import { PLATFORMS } from "@/lib/constants";
import { isValidUrl } from "@/lib/utils";
import { useDownload } from "@/hooks/useDownload";
import DownloadResult from "@/components/download/DownloadResult";
import RecentDownloads from "@/components/home/RecentDownloads";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import HowToDownlod from "@/components/home/HowToDownlod";

export default function Hero() {
  const [url, setUrl] = useState("");
  const {
    status,
    result,
    error: downloadError,
    isLoading,
    recents,
    fetchInfo,
    triggerDownload,
    clearRecents,
    removeRecent,
    reset,
  } = useDownload();

  const [inputError, setInputError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setInputError("");

    if (!url.trim()) {
      setInputError("Please paste a video URL");
      return;
    }

    if (!isValidUrl(url)) {
      setInputError("Please enter a valid URL");
      return;
    }

    const platform = PLATFORMS.find((p) => p.urlPattern.test(url));
    if (!platform) {
      setInputError("This platform is not supported. Please paste a link from one of our 12 supported platforms.");
      return;
    }

    fetchInfo(url, platform.slug);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setInputError("");
    } catch {
      setInputError("Unable to access clipboard. Please paste manually.");
    }
  };

  const activeError = inputError || downloadError;

  return (
    <section className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-100/40 via-slate-50 to-slate-50 dark:from-violet-950/20 dark:via-gray-950 dark:to-gray-950 transition-colors duration-200" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-violet-400/10 via-fuchsia-400/5 to-transparent dark:from-violet-500/10 dark:via-fuchsia-500/5 dark:to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 text-center">
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight transition-colors">
          Free Online Video{" "}
          <span className="gradient-text ml-2">
            Downloader
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed transition-colors">
          SaveFromPro is a free web tool for saving videos, reels, stories and photos from the social platforms you already scroll every day — no app install, no account, no watermark stamped on top of your download. 
        </p>

        {/* Search & Download Bar */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setInputError("");
                }}
                disabled={isLoading}
                placeholder="Paste video URL from any supported platform..."
                className="w-full px-5 py-4 bg-white dark:bg-gray-800/80 border border-slate-200 dark:border-gray-700/50 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 text-base shadow-sm transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={handlePaste}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors disabled:opacity-50"
                title="Paste from clipboard"
              >
                <ClipboardPaste className="w-5 h-5" />
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-violet-500/25 active:scale-95 disabled:opacity-50 min-w-[150px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Fetching...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Download</span>
                </>
              )}
            </button>
          </div>

          {activeError && (
            <div className="mt-4 text-left">
              <ErrorMessage message={activeError} onRetry={reset} />
            </div>
          )}
        </form>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="mt-8">
            <LoadingSpinner text="Fetching video details & stream qualities..." />
          </div>
        )}

        {/* Inline Result Card */}
        {result && (
          <DownloadResult
            result={result}
            onDownload={(item, title) => triggerDownload(item, title)}
          />
        )}

        {/* Recent Downloads Section */}
        <RecentDownloads
          recents={recents}
          onClear={clearRecents}
          onRemove={removeRecent}
        />

        {/* Supported platforms tags & trust indicators */}
        <div className="mt-8 space-y-4">
          <div className="inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-2.5 rounded-xl bg-white/80 dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 text-slate-700 dark:text-gray-300 text-xs sm:text-sm shadow-sm backdrop-blur-sm transition-colors">
            <span>✓ No login required</span>
            <span className="hidden sm:inline text-slate-300 dark:text-gray-700">•</span>
            <span>✓ No watermark added</span>
            <span className="hidden sm:inline text-slate-300 dark:text-gray-700">•</span>
            <span>✓ Nothing stored on our servers</span>
            <span className="hidden sm:inline text-slate-300 dark:text-gray-700">•</span>
            <span>✓ Works on mobile &amp; desktop</span>
          </div>

          <p className="text-slate-600 dark:text-gray-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed transition-colors">
            Platforms we supported Instagram, TikTok, Facebook, Twitter/X, Snapchat, Twitch, Dailymotion, Vimeo, Reddit, Threads, LinkedIn and Pinterest.
          </p>

          <p className="text-slate-500 dark:text-gray-500 text-xs">
            By using our service you accept our{" "}
            <Link href="/terms" className="text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 transition-colors underline underline-offset-2">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 transition-colors underline underline-offset-2">
              Privacy Policy
            </Link>
          </p>
        </div>

        {/* How to Download Section */}
        <div className="mt-16 pt-12 border-t border-slate-200 dark:border-gray-800/60 transition-colors">
          <HowToDownlod />
        </div>
      </div>
    </section>
  );
}
