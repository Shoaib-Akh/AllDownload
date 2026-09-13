"use client";

import { useState } from "react";
import { Download, ClipboardPaste, Sparkles, Loader2 } from "lucide-react";
import { PLATFORMS } from "@/lib/constants";
import { isValidUrl } from "@/lib/utils";
import { useDownload } from "@/hooks/useDownload";
import DownloadResult from "@/components/download/DownloadResult";
import RecentDownloads from "@/components/home/RecentDownloads";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";

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
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 via-gray-950 to-gray-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-violet-500/10 via-fuchsia-500/5 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-8">
          <Sparkles className="w-4 h-4" />
          Free Online Video Downloader
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
          Download Videos From{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">
            Any Platform
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Paste a video link from Facebook, Instagram, TikTok, Twitter/X, and 8 more platforms.
          Download in HD quality — free, fast, no signup required.
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
                className="w-full px-5 py-4 bg-gray-800/80 border border-gray-700/50 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 text-base transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={handlePaste}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-violet-400 transition-colors disabled:opacity-50"
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

        {/* Supported platforms tags */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5">
          <span className="text-gray-500 text-xs sm:text-sm">Supports:</span>
          {PLATFORMS.map((p) => (
            <a
              key={p.slug}
              href={`/${p.slug}`}
              className="text-xs px-3 py-1 rounded-full bg-gray-800/50 hover:bg-gray-700/60 text-gray-400 hover:text-white border border-gray-700/50 transition-colors"
            >
              {p.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
