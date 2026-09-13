"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Sparkles,
  ArrowRight,
  Download,
  Filter,
  Layers,
  Zap,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { PLATFORMS } from "@/lib/constants";
import PlatformCard from "@/components/home/PlatformCard";
import FAQ from "@/components/common/FAQ";

const CATEGORIES = [
  { id: "all", label: "All Platforms" },
  { id: "social", label: "Social Media" },
  { id: "short-video", label: "Reels & Shorts" },
  { id: "video-stream", label: "Video & Streaming" },
];

const CATEGORY_MAP = {
  social: ["facebook", "instagram", "twitter", "threads", "linkedin", "reddit"],
  "short-video": ["tiktok", "instagram", "snapchat", "pinterest"],
  "video-stream": ["twitch", "vimeo", "dailymotion", "reddit"],
};

export default function PlatformsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [quickUrl, setQuickUrl] = useState("");
  const [quickError, setQuickError] = useState("");

  const filteredPlatforms = useMemo(() => {
    return PLATFORMS.filter((platform) => {
      const matchesSearch =
        platform.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        platform.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        platform.features.some((f) =>
          f.toLowerCase().includes(searchQuery.toLowerCase())
        );

      if (!matchesSearch) return false;

      if (selectedCategory === "all") return true;

      const categorySlugs = CATEGORY_MAP[selectedCategory] || [];
      return categorySlugs.includes(platform.slug);
    });
  }, [searchQuery, selectedCategory]);

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    setQuickError("");

    if (!quickUrl.trim()) {
      setQuickError("Please paste a video link");
      return;
    }

    const matched = PLATFORMS.find((p) => p.urlPattern.test(quickUrl.trim()));
    if (!matched) {
      setQuickError(
        "Unsupported URL. Please paste a link from one of our supported platforms."
      );
      return;
    }

    // Navigate to the platform's dedicated page with url query param
    router.push(`/${matched.slug}?url=${encodeURIComponent(quickUrl.trim())}`);
  };

  const platformsFaqs = [
    {
      question: "Are all supported platform downloads completely free?",
      answer:
        "Yes, SaveFromPro allows unlimited video and audio downloads from all supported platforms without charging any fee or requiring registration.",
    },
    {
      question: "What resolution can I download from these platforms?",
      answer:
        "Depending on the source video, you can download in 720p HD, 1080p Full HD, 2K, 4K, or extract audio in MP3 format.",
    },
    {
      question: "Do I need to install any software or browser extensions?",
      answer:
        "No installation is required. Everything runs directly in your browser on desktop, iPhone, iPad, and Android devices.",
    },
    {
      question: "Will downloaded videos have watermarks?",
      answer:
        "For supported services like TikTok, videos are downloaded clean without watermarks whenever the platform stream allows.",
    },
  ];

  return (
    <div className="min-h-screen py-16 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-700 dark:text-violet-300 text-sm font-medium mb-6 transition-colors">
            <Layers className="w-4 h-4" />
            12+ Supported Platforms
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-5 tracking-tight transition-colors">
            Supported <span className="gradient-text">Platforms</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed transition-colors">
            Click on any platform to open its dedicated downloader, or paste a link below
            to navigate directly to its download page.
          </p>
        </div>

        {/* Quick URL Jump Box */}
        <div className="max-w-2xl mx-auto mb-14 bg-white/90 dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 rounded-2xl p-4 sm:p-5 shadow-sm dark:shadow-xl backdrop-blur-sm transition-colors">
          <form onSubmit={handleQuickSubmit} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                value={quickUrl}
                onChange={(e) => {
                  setQuickUrl(e.target.value);
                  setQuickError("");
                }}
                placeholder="Paste any video URL to go directly to its downloader..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-950/70 border border-slate-200 dark:border-gray-700/60 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-sm transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all text-sm shrink-0 shadow-md shadow-violet-600/20"
            >
              <span>Go to Downloader</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          {quickError && (
            <p className="text-rose-500 dark:text-red-400 text-xs mt-2.5 px-1">{quickError}</p>
          )}
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white/80 dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800/60 rounded-2xl p-4 shadow-sm transition-colors">
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search platforms, features..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-gray-950/60 border border-slate-200 dark:border-gray-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === cat.id
                    ? "bg-violet-600 text-white shadow-sm shadow-violet-500/20"
                    : "bg-slate-100 dark:bg-gray-800/60 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-gray-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Platforms */}
        {filteredPlatforms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredPlatforms.map((platform) => (
              <PlatformCard key={platform.slug} platform={platform} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-900/30 rounded-2xl border border-slate-200 dark:border-gray-800/50 shadow-sm">
            <Search className="w-10 h-10 text-slate-400 dark:text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No platforms found</h3>
            <p className="text-sm text-slate-600 dark:text-gray-400 mb-4">
              We couldn&apos;t find any platforms matching &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-sm text-slate-700 dark:text-gray-200 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Feature Highlights */}
        <div className="mt-20 pt-16 border-t border-slate-200 dark:border-gray-800/50 transition-colors">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3 transition-colors">
              Why Use SaveFromPro For Video Downloads?
            </h2>
            <p className="text-slate-600 dark:text-gray-400 text-sm transition-colors">
              Engineered for seamless performance and privacy across all platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800/50 rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-600/10 border border-violet-200 dark:border-violet-500/20 flex items-center justify-center mb-4 text-violet-600 dark:text-violet-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 transition-colors">Lightning Fast</h3>
              <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed transition-colors">
                Direct extraction server routes ensure immediate processing without queues or waiting times.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800/50 rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-fuchsia-100 dark:bg-fuchsia-600/10 border border-fuchsia-200 dark:border-fuchsia-500/20 flex items-center justify-center mb-4 text-fuchsia-600 dark:text-fuchsia-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 transition-colors">Maximum Quality</h3>
              <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed transition-colors">
                Always get the highest available resolution, from 720p HD up to Full HD and 4K, plus crystal clear audio.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800/50 rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-600/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 transition-colors">100% Free & Private</h3>
              <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed transition-colors">
                No signups, no credit cards, and no stored personal files. Safe and anonymous downloading.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <FAQ
            faqs={platformsFaqs}
            title="Platforms FAQ"
            subtitle="Common questions about downloading from our supported video platforms."
          />
        </div>
      </div>
    </div>
  );
}
