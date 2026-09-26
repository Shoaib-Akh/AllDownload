"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  Search,
  Copy,
  Download,
  FolderCheck,
  Video,
  Music,
  Pin,
  MessageCircle,
  AtSign,
  Ghost,
  Play,
  Layers,
} from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterXIcon,
  LinkedInIcon,
} from "@/components/common/BrandIcons";
import { PLATFORMS } from "@/lib/constants";

const PLATFORMS_DATA = [
  {
    code: "FB",
    slug: "facebook",
    name: "Facebook",
    icon: FacebookIcon,
    gradient: "from-[#1877F2] to-[#0a5dc2]",
    color: "#1877F2",
    tags: ["Videos", "Reels", "Stories"],
    description:
      "Download public Facebook videos, Reels, and Watch content in HD or SD — including videos shared in Groups and Pages that aren't set to private.",
    buttonText: "Facebook video downloader →",
  },
  {
    code: "IG",
    slug: "instagram",
    name: "Instagram",
    icon: InstagramIcon,
    gradient: "from-[#E4405F] via-[#FD1D1D] to-[#F77737]",
    color: "#E4405F",
    tags: ["Reels", "Stories", "Posts", "IGTV"],
    description:
      "Save Reels, feed videos, carousel posts, and public Stories. Works with both personal and creator/business accounts that are set to public.",
    buttonText: "Instagram video downloader →",
  },
  {
    code: "TT",
    slug: "tiktok",
    name: "TikTok",
    icon: Music,
    gradient: "from-[#00f2ea] to-[#ff0050]",
    color: "#00f2ea",
    tags: ["No Watermark", "MP3"],
    description:
      "Download TikTok videos without the logo watermark, in the original resolution, or extract just the audio track as an MP3 file.",
    buttonText: "TikTok video downloader →",
  },
  {
    code: "X",
    slug: "twitter",
    name: "Twitter / X",
    icon: TwitterXIcon,
    gradient: "from-[#1DA1F2] to-[#0d8bd9]",
    color: "#1DA1F2",
    tags: ["Videos", "GIFs"],
    description:
      "Save videos and GIFs from public posts on X. Paste the post link and choose from the available resolutions, from SD up to the original upload quality.",
    buttonText: "Twitter/X video downloader →",
  },
  {
    code: "SC",
    slug: "snapchat",
    name: "Snapchat",
    icon: Ghost,
    gradient: "from-[#FFFC00] to-[#e6e300]",
    color: "#FFFC00",
    iconColor: "text-black",
    tags: ["Spotlight", "Stories"],
    description:
      'Download public Spotlight videos and Stories set to "Everyone." Friends-only Stories and direct Snaps stay private and aren\'t accessible.',
    buttonText: "Snapchat video downloader →",
  },
  {
    code: "TW",
    slug: "twitch",
    name: "Twitch",
    icon: Video,
    gradient: "from-[#9146FF] to-[#772ce8]",
    color: "#9146FF",
    tags: ["Clips", "VODs"],
    description:
      "Save Twitch Clips and public VODs (past broadcasts) for offline viewing. Live streams need to finish or be clipped before they can be downloaded.",
    buttonText: "Twitch video downloader →",
  },
  {
    code: "DM",
    slug: "dailymotion",
    name: "Dailymotion",
    icon: Play,
    gradient: "from-[#00AAFF] to-[#0088cc]",
    color: "#00AAFF",
    tags: ["Videos", "HD"],
    description:
      "Download any publicly posted Dailymotion video in its available qualities, up to HD where the original upload supports it.",
    buttonText: "Dailymotion video downloader →",
  },
  {
    code: "VM",
    slug: "vimeo",
    name: "Vimeo",
    icon: Video,
    gradient: "from-[#1AB7EA] to-[#162221]",
    color: "#1AB7EA",
    tags: ["Videos", "HD"],
    description:
      "Save public Vimeo uploads in HD. Password-protected and private Vimeo videos can't be downloaded without the correct access.",
    buttonText: "Vimeo video downloader →",
  },
  {
    code: "RD",
    slug: "reddit",
    name: "Reddit",
    icon: MessageCircle,
    gradient: "from-[#FF4500] to-[#cc3700]",
    color: "#FF4500",
    tags: ["Videos", "GIFs"],
    description:
      "Download videos and GIFs posted directly to Reddit (v.redd.it links), including audio where the post has a separate sound track.",
    buttonText: "Reddit video downloader →",
  },
  {
    code: "TH",
    slug: "threads",
    name: "Threads",
    icon: AtSign,
    gradient: "from-[#333333] to-[#111111]",
    color: "#333333",
    tags: ["Videos", "Posts"],
    description:
      "Save videos shared in public Threads posts with a single pasted link — no Instagram account required.",
    buttonText: "Threads video downloader →",
  },
  {
    code: "LI",
    slug: "linkedin",
    name: "LinkedIn",
    icon: LinkedInIcon,
    gradient: "from-[#0A66C2] to-[#004182]",
    color: "#0A66C2",
    tags: ["Videos", "Posts"],
    description:
      "Download videos from public LinkedIn posts and articles — useful for saving webinars, talks, and company updates shared openly.",
    buttonText: "LinkedIn video downloader →",
  },
  {
    code: "PT",
    slug: "pinterest",
    name: "Pinterest",
    icon: Pin,
    gradient: "from-[#E60023] to-[#ad001a]",
    color: "#E60023",
    tags: ["Pins", "Videos"],
    description:
      "Save video Pins and Idea Pins from public boards in their original quality, without needing a Pinterest account.",
    buttonText: "Pinterest video downloader →",
  },
];

const HOW_IT_WORKS_PLATFORMS = [
  {
    num: "01",
    boldTitle: "Copy the link.",
    text: "Open the post, video, or Story you want and copy its public link from the Share menu or the browser address bar.",
    icon: Copy,
  },
  {
    num: "02",
    boldTitle: "Paste it into SaveFromPro.",
    text: "No sign-up or app install — just drop the link into the input field on the homepage.",
    icon: Search,
  },
  {
    num: "03",
    boldTitle: "Pick a quality and download.",
    text: "Choose the resolution or format (video or MP3, where available) and click Download.",
    icon: Download,
  },
  {
    num: "04",
    boldTitle: "Find your file.",
    text: "The download lands in your device's default Downloads folder or Gallery, ready to use offline.",
    icon: FolderCheck,
  },
];

export default function PlatformsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [quickUrl, setQuickUrl] = useState("");
  const [quickError, setQuickError] = useState("");

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return PLATFORMS_DATA;
    const q = searchQuery.toLowerCase();
    return PLATFORMS_DATA.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [searchQuery]);

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
        "Unsupported URL. Please paste a link from one of our 12 supported platforms."
      );
      return;
    }

    router.push(`/${matched.slug}?url=${encodeURIComponent(quickUrl.trim())}`);
  };

  return (
    <div className="py-16 sm:py-20 relative overflow-hidden transition-colors duration-200">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-violet-500/10 via-fuchsia-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-semibold uppercase tracking-wider mb-5 transition-colors">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SAVEFROMPRO · SUPPORTED PLATFORMS</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-5 leading-tight transition-colors">
            Download from 12 platforms.{" "}
            <span className="gradient-text">One tool, no app.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-gray-300 leading-relaxed transition-colors">
            Paste a public link from any of the platforms below and save the video, photo, or audio in seconds — no login, no watermark, no software to install.
          </p>
        </div>

        {/* Search & Quick Paste Bar */}
        <div className="max-w-2xl mx-auto mb-14">
          <form
            onSubmit={handleQuickSubmit}
            className="flex flex-col sm:flex-row gap-2.5 p-2 bg-white/90 dark:bg-gray-900/70 border border-slate-200 dark:border-gray-800/80 rounded-2xl shadow-sm dark:shadow-xl backdrop-blur-sm transition-colors"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={quickUrl}
                onChange={(e) => {
                  setQuickUrl(e.target.value);
                  setQuickError("");
                }}
                placeholder="Paste video URL from any platform or search..."
                className="w-full pl-10 pr-4 py-3 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all text-sm shrink-0 shadow-md shadow-violet-600/20 active:scale-95"
            >
              <span>Download</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          {quickError && (
            <p className="text-rose-500 dark:text-red-400 text-xs mt-2 px-3">{quickError}</p>
          )}
        </div>

        {/* 12 Platforms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {filtered.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.slug}
                className="group relative flex flex-col justify-between p-7 rounded-2xl bg-white dark:bg-gray-900/60 backdrop-blur-xl border border-slate-200 dark:border-gray-800/80 hover:border-violet-400 dark:hover:border-violet-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-950/10 dark:hover:shadow-violet-950/20 shadow-sm"
              >
                <div>
                  {/* Top Bar: Icon + Code Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-md p-3`}
                    >
                      <Icon className={`w-7 h-7 ${item.iconColor || "text-white"}`} />
                    </div>
                    <span className="px-3 py-1 rounded-xl text-xs font-black font-mono bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-700/60">
                      {item.code}
                    </span>
                  </div>

                  {/* Platform Name */}
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                    {item.name}
                  </h2>

                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-gray-800/80 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-700/40 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Platform Link */}
                <div className="pt-4 border-t border-slate-100 dark:border-gray-800/60">
                  <Link
                    href={`/${item.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-violet-600 dark:text-violet-400 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors"
                  >
                    <span>{item.buttonText}</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* How It Works, On Every Platform Section */}
        <div className="mt-16 pt-16 border-t border-slate-200 dark:border-gray-800/60">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight transition-colors">
              How it works, on every platform
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS_PLATFORMS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="p-6 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm hover:border-violet-400 dark:hover:border-violet-500/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-600/10 border border-violet-200 dark:border-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xl font-black text-slate-300 dark:text-gray-700 font-mono">
                        {step.num}
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-gray-200 text-sm leading-relaxed">
                      <strong className="text-slate-900 dark:text-white font-bold block mb-1">
                        {step.boldTitle}
                      </strong>
                      {step.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold rounded-2xl transition-all hover:shadow-lg hover:shadow-violet-500/25 active:scale-95"
          >
            <span>Start Downloading Free</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
