"use client";

import { useState } from "react";
import {
  Sparkles,
  Download,
  Share2,
  Copy,
  FolderDown,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  ChevronDown,
  Video,
  Film,
  Repeat,
  MessageSquare,
  Layers,
  Radio,
} from "lucide-react";
import { TwitterXIcon } from "@/components/common/BrandIcons";
import DownloadInput from "@/components/download/DownloadInput";
import DownloadResult from "@/components/download/DownloadResult";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import RecentDownloads from "@/components/home/RecentDownloads";

const FORMATS = [
  {
    title: "Video posts",
    description:
      "Standard video attached directly to a post, saved at the same resolution X served it in through its own player, without any interface elements layered on top.",
    icon: Film,
    gradient: "from-[#1DA1F2] to-[#0d8bd9]",
  },
  {
    title: "GIFs",
    description:
      "Looping GIF clips are converted into a playable video file, since a raw GIF loses a lot of quality compared to the source clip.",
    icon: Repeat,
    gradient: "from-sky-500 to-blue-600",
  },
  {
    title: "Quote posts",
    description:
      "If the video lives in the post being quoted rather than the quote itself, paste the original post's link to reach the media.",
    icon: Repeat,
    gradient: "from-blue-600 to-indigo-600",
  },
  {
    title: "Reply videos",
    description:
      "Video attached to a reply in a thread works the same way as a standalone post, as long as the reply itself is public.",
    icon: MessageSquare,
    gradient: "from-indigo-500 to-violet-600",
  },
  {
    title: "Multi-video posts",
    description:
      "Posts with more than one video attached offer each clip as its own separate file to save.",
    icon: Layers,
    gradient: "from-violet-600 to-purple-600",
  },
  {
    title: "Space recordings",
    description:
      "Where a host has kept a recorded Space's playback link public, its audio can be saved the same way as any other media link.",
    icon: Radio,
    gradient: "from-purple-600 to-pink-600",
  },
];

const STEPS = [
  {
    num: "01",
    boldTitle: "On the X app:",
    text: "tap the share icon under the post, then choose Copy link from the menu that opens.",
    icon: Share2,
  },
  {
    num: "02",
    boldTitle: "Paste it above and press Fetch Video.",
    text: "Bring the link back to this page and drop it into the box.",
    icon: Copy,
  },
  {
    num: "03",
    boldTitle: "Pick a quality and save",
    text: "the file to your camera roll, downloads folder, or files app.",
    icon: FolderDown,
  },
];

const SUPPORTED_LIST = [
  "Public Twitter/X Posts (/status/)",
  "Video Attachments in Reply Threads",
  "Twitter Animated GIFs (Converted to MP4)",
  "x.com & twitter.com URL Formats",
  "Multiple Bitrate Resolutions (240p to 1080p)",
  "Original Audio MP3 Extraction",
];

const NOT_SUPPORTED_LIST = [
  "Protected / Locked X Accounts",
  "Direct Messages (DMs)",
  "Deleted Tweets or Suspended Media",
  "Space Audio Broadcasts (Live)",
  "Account Login Endpoints",
];

const TWITTER_FAQS = [
  {
    q: "Does this work with both twitter.com and x.com links?",
    a: "Yes, both point to the same platform and either version of the link can be pasted into the box above.",
  },
  {
    q: "Can I download from a protected account?",
    a: "No. Posts from accounts with protected posts enabled aren't public, so no outside tool can reach them.",
  },
  {
    q: "Does this work for GIFs, not just videos?",
    a: "Yes — GIFs attached to a post are converted into a standard video file when you save them.",
  },
  {
    q: "Can I save a video from a reply, not just the main post?",
    a: "Yes, as long as the reply is public. Open it individually so the link points to that specific reply.",
  },
  {
    q: "Do I need to log into X to use this?",
    a: "No. SaveFromPro never asks for your X username or password — it only reads the public link you paste in.",
  },
  {
    q: "What if a post has several videos attached?",
    a: "Each video is offered as its own file, so you can choose exactly the clip you want.",
  },
  {
    q: "What format do I get?",
    a: "Video and converted GIFs are delivered as standard MP4 files that play on any modern device.",
  },
  {
    q: "Can I download a recorded Space?",
    a: "If the host has kept the playback link public after the Space ends, its audio can be saved the same way as other media links.",
  },
  {
    q: "Why did my link fail even though the post is public?",
    a: "Double-check the link points to the exact post with the video attached, rather than the profile page or a shortened link that redirects somewhere else first.",
  },
  {
    q: "Is there a limit on how many posts I can save?",
    a: "There's no hard cap for personal use, but pasting and checking one link at a time keeps the result accurate before you save it.",
  },
];

export default function TwitterPlatformView({
  platform,
  handleDownload,
  isLoading,
  error,
  reset,
  result,
  triggerDownload,
  recents,
  clearRecents,
  removeRecent,
}) {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <>
      {/* Platform Hero */}
      <section className="relative overflow-hidden transition-colors duration-200">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1DA1F2]/10 via-sky-500/5 to-transparent dark:from-[#1DA1F2]/15 dark:via-blue-950/10 dark:to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-sky-500/10 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
          {/* Platform Icon */}
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1DA1F2] to-[#0d8bd9] items-center justify-center mb-6 shadow-lg shadow-sky-500/20">
            <TwitterXIcon className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight transition-colors">
            Twitter / X <span className="gradient-text">Video Downloader</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed transition-colors">
            Save video clips and GIFs attached to public posts on X, including replies and quote posts, in the original quality they were uploaded in — without an account, browser extension, or extra software of any kind.
          </p>

          {/* Download Input */}
          <DownloadInput
            onSubmit={handleDownload}
            isLoading={isLoading}
            platform={platform}
            buttonText="Fetch Video"
          />

          {/* Subtext under input */}
          <div className="mt-5 space-y-3">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400">
              Works with both x.com and twitter.com post links.
            </p>

            <div className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800 text-xs text-slate-700 dark:text-gray-300 shadow-sm backdrop-blur-sm">
              <span>✓ Video &amp; GIF posts</span>
              <span className="text-slate-300 dark:text-gray-700">•</span>
              <span>✓ No login required</span>
              <span className="text-slate-300 dark:text-gray-700">•</span>
              <span>✓ Standard MP4 files</span>
            </div>
          </div>

          {/* Result / Error / Loading */}
          {isLoading && (
            <div className="mt-8">
              <LoadingSpinner text="Fetching Twitter/X video details..." />
            </div>
          )}
          {error && (
            <div className="mt-6 max-w-2xl mx-auto text-left">
              <ErrorMessage message={error} onRetry={reset} />
            </div>
          )}
          {result && (
            <div className="mt-8 text-left">
              <DownloadResult
                result={result}
                onDownload={(item, title) => triggerDownload(item, title)}
              />
            </div>
          )}

          <RecentDownloads
            recents={recents}
            onClear={clearRecents}
            onRemove={removeRecent}
          />
        </div>
      </section>

      {/* What SaveFromPro pulls from a post on X */}
      <section className="py-16 sm:py-20 bg-slate-50 dark:bg-gray-950 relative overflow-hidden border-t border-slate-200 dark:border-gray-800/40 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
              What SaveFromPro pulls from a post on X
            </h2>
            <p className="text-slate-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
              A single post on X can carry more than one kind of media, so the tool checks the whole post before offering a file.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FORMATS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-7 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm hover:border-violet-400 dark:hover:border-violet-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white mb-5 shadow-md`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How to copy a post's link on X */}
      <section className="py-16 sm:py-20 bg-white dark:bg-gray-900/40 border-t border-slate-200 dark:border-gray-800/40 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
              How to copy a post&apos;s link on X
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="p-7 rounded-2xl bg-slate-50 dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-600/10 border border-sky-200 dark:border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-2xl font-black text-slate-300 dark:text-gray-700 font-mono">
                        {step.num}
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-gray-200 text-sm sm:text-base leading-relaxed">
                      <strong className="text-slate-900 dark:text-white block font-bold mb-1">
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
      </section>

      {/* Explanatory Cards */}
      <section className="py-16 bg-slate-50 dark:bg-gray-950 border-t border-slate-200 dark:border-gray-800/40 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="p-7 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm leading-relaxed text-slate-700 dark:text-gray-300 text-sm sm:text-base">
            SaveFromPro provides a fast, web-based downloader for videos and animated GIFs published on Twitter (X). Following X&apos;s domain migration from twitter.com to x.com, link structures have evolved. Our media engine supports both x.com and twitter.com post URLs, resolving direct public video streams without requiring account logins, API keys, or browser plugins.
          </div>

          <div className="p-7 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm leading-relaxed text-slate-700 dark:text-gray-300 text-sm sm:text-base">
            Journalists, researchers, social commentators, and creators rely on SaveFromPro to archive public interest news clips, viral video threads, and historical posts published on X. Because public posts on social platforms can be deleted or edited at any time, local MP4 video backup provides an essential tool for digital media preservation.
          </div>

          <div className="p-7 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm leading-relaxed text-slate-700 dark:text-gray-300 text-sm sm:text-base">
            We are deeply committed to legal ethics and user privacy. SaveFromPro operates strictly on publicly accessible web links. Downloading Twitter/X content does not transfer intellectual property rights; saved media must be used for personal offline reference, research, or fair-use commentary.
          </div>
        </div>
      </section>

      {/* Supported vs Not Supported */}
      <section className="py-16 sm:py-20 bg-white dark:bg-gray-900/40 border-t border-slate-200 dark:border-gray-800/40 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Supported Card */}
            <div className="p-7 sm:p-8 rounded-2xl bg-slate-50 dark:bg-gray-900/60 border border-emerald-500/30 shadow-sm">
              <div className="flex items-center gap-2.5 mb-6 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Supported
                </h3>
              </div>
              <ul className="space-y-3.5">
                {SUPPORTED_LIST.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm sm:text-base text-slate-700 dark:text-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Not Supported Card */}
            <div className="p-7 sm:p-8 rounded-2xl bg-slate-50 dark:bg-gray-900/60 border border-rose-500/30 shadow-sm">
              <div className="flex items-center gap-2.5 mb-6 text-rose-600 dark:text-rose-400">
                <XCircle className="w-6 h-6" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Not supported
                </h3>
              </div>
              <ul className="space-y-3.5">
                {NOT_SUPPORTED_LIST.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm sm:text-base text-slate-700 dark:text-gray-200">
                    <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Reminder Notice Callout */}
          <div className="mt-8 p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-sky-500/10 via-blue-500/10 to-violet-500/10 border border-sky-200 dark:border-sky-500/30 backdrop-blur-xl">
            <div className="flex items-start gap-3.5">
              <ShieldAlert className="w-6 h-6 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" />
              <p className="text-slate-700 dark:text-gray-200 text-sm sm:text-base leading-relaxed">
                <strong>A quick reminder:</strong> only save video from posts you created, have permission to reuse, or are keeping from a public post for personal, offline viewing. If you repost a saved clip elsewhere, credit the account it came from.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 sm:py-20 bg-slate-50 dark:bg-gray-950 border-t border-slate-200 dark:border-gray-800/40 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
              frequently asked questions
            </h2>
          </div>

          <div className="space-y-3.5">
            {TWITTER_FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl bg-white dark:bg-gray-900/60 backdrop-blur-xl border border-slate-200 dark:border-gray-800/80 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-slate-900 dark:text-white text-base sm:text-lg">
                      {faq.q}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-lg bg-slate-100 dark:bg-gray-800/60 flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? "rotate-180 bg-sky-100 text-sky-700 dark:bg-sky-600/20 dark:text-sky-400"
                          : "text-slate-500 dark:text-gray-400"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-slate-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed border-t border-slate-100 dark:border-gray-800/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
