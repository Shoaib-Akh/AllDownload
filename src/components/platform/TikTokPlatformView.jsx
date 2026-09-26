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
  Music,
} from "lucide-react";
import DownloadInput from "@/components/download/DownloadInput";
import DownloadResult from "@/components/download/DownloadResult";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import RecentDownloads from "@/components/home/RecentDownloads";

const STEPS = [
  {
    num: "01",
    boldTitle: "Open the video in the TikTok app:",
    text: "tap the curved arrow (Share) icon on the right-hand side of the screen.",
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
  "Public TikTok Video Posts",
  "Short Link Redirects (vt.tiktok.com & vm.tiktok.com)",
  "Photo Slideshow & Carousel Posts",
  "No-Watermark Clean MP4 Output",
  "Original Sound MP3 Extraction",
  "HD 1080p Video Bitrates",
];

const NOT_SUPPORTED_LIST = [
  "Private TikTok Accounts",
  "Friends-Only Posts",
  "Deleted or Muted Videos",
  "Geo-Blocked Account Media",
  "Account Login Endpoints",
];

const TIKTOK_FAQS = [
  {
    q: "Does the saved video really have no watermark?",
    a: "Correct — SaveFromPro fetches the source file directly rather than using TikTok's built-in share export, so the username watermark that export adds isn't present.",
  },
  {
    q: "Can I download a TikTok from a private account?",
    a: "No. Only videos posted by public accounts can be resolved, the same restriction TikTok itself applies to sharing outside the app.",
  },
  {
    q: "Does this work for TikTok photo slideshows?",
    a: "Yes. Paste the slideshow's link and you'll be able to save each photo individually along with the background audio.",
  },
  {
    q: "Do I need the TikTok app installed?",
    a: "No — as long as you can open the video's link (from the app, tiktok.com, or a link someone sent you), SaveFromPro can process it.",
  },
  {
    q: "What video format do I get?",
    a: "Video downloads as a standard MP4 file, which plays natively on iPhone, Android, and any modern computer.",
  },
  {
    q: "Can I save just the audio from a TikTok?",
    a: "The tool is built around video and slideshow files; if you only need the sound, you can extract it afterwards using any basic audio-editing app.",
  },
  {
    q: "Why does the video look slightly different from the app?",
    a: "Occasionally TikTok serves a lower-bitrate version to weaker connections. If that happens, refreshing the fetch usually returns the higher-quality version.",
  },
  {
    q: "Is there a limit to how many videos I can save?",
    a: "There's no hard cap for personal use, but pasting one link at a time keeps the result accurate and easy to check before saving.",
  },
  {
    q: "Does SaveFromPro work with TikTok links shared in other apps?",
    a: "Yes — a TikTok link forwarded through a messaging app or shared to your notes still points to the same public video, so it can be pasted into the box the same way.",
  },
  {
    q: "Does this work for TikTok LIVE replays?",
    a: "If the creator has kept a LIVE broadcast saved as a regular video on their public profile after it ends, it can be fetched the same way as any other TikTok video.",
  },
];

export default function TikTokPlatformView({
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#00f2ea]/10 via-[#ff0050]/5 to-transparent dark:from-[#00f2ea]/15 dark:via-[#ff0050]/10 dark:to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-cyan-500/10 via-rose-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
          {/* Platform Icon */}
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00f2ea] to-[#ff0050] items-center justify-center mb-6 shadow-lg shadow-cyan-500/20">
            <Music className="w-8 h-8 text-black" />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight transition-colors">
            TikTok <span className="gradient-text">Downloader</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed transition-colors">
            Save TikTok videos and photo slideshows in their original quality, without the spinning username watermark stitched into the corner of every clip, and without needing to install anything extra on your phone or computer.
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
              Works with tiktok.com links and shortened vm.tiktok.com links.
            </p>

            <div className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800 text-xs text-slate-700 dark:text-gray-300 shadow-sm backdrop-blur-sm">
              <span>✓ No watermark</span>
              <span className="text-slate-300 dark:text-gray-700">•</span>
              <span>✓ Slideshows supported</span>
              <span className="text-slate-300 dark:text-gray-700">•</span>
              <span>✓ No login required</span>
            </div>
          </div>

          {/* Result / Error / Loading */}
          {isLoading && (
            <div className="mt-8">
              <LoadingSpinner text="Fetching TikTok video details..." />
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

      {/* Explanatory Cards */}
      <section className="py-16 bg-slate-50 dark:bg-gray-950 border-t border-slate-200 dark:border-gray-800/40 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="p-7 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm leading-relaxed text-slate-700 dark:text-gray-300 text-sm sm:text-base">
            SaveFromPro provides a high-performance TikTok media parser optimized for public TikTok posts and short links. TikTok relies on a complex global network of mobile short URLs, regional CDN nodes, and adaptive video stream wrappers. Our engine seamlessly resolves these public endpoints, delivering clean, uncompressed HD MP4 video files directly to your web browser without asking for user account logins or mobile app permissions.
          </div>

          <div className="p-7 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm leading-relaxed text-slate-700 dark:text-gray-300 text-sm sm:text-base">
            For video editors, social media managers, and digital archivists, saving public TikTok clips is an essential part of trend analysis and content management. Creators frequently use SaveFromPro to back up their own published TikTok catalog, removing platform watermarks to enable clean cross-posting to Instagram Reels, YouTube Shorts, and Pinterest Idea Pins.
          </div>

          <div className="p-7 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm leading-relaxed text-slate-700 dark:text-gray-300 text-sm sm:text-base">
            We operate under a strict commitment to copyright ethics and user privacy. SaveFromPro parses only publicly available web links. Downloading TikTok media does not grant commercial reuse rights; users must respect original creator intellectual property and comply with licensing requirements before sharing or re-publishing downloaded media.
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
        </div>
      </section>

      {/* How to copy a TikTok link */}
      <section className="py-16 sm:py-20 bg-slate-50 dark:bg-gray-950 border-t border-slate-200 dark:border-gray-800/40 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
              How to copy a TikTok link
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-7 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-600/10 border border-cyan-200 dark:border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-300 dark:text-gray-700 font-mono">
                    01
                  </span>
                </div>
                <p className="text-slate-700 dark:text-gray-200 text-sm sm:text-base leading-relaxed">
                  <strong className="text-slate-900 dark:text-white block font-bold mb-1">
                    Open the video in the TikTok app:
                  </strong>
                  tap the curved arrow (Share) icon on the right-hand side of the screen.
                </p>
              </div>
            </div>

            <div className="p-7 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-600/10 border border-rose-200 dark:border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
                    <Copy className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-300 dark:text-gray-700 font-mono">
                    02
                  </span>
                </div>
                <p className="text-slate-700 dark:text-gray-200 text-sm sm:text-base leading-relaxed">
                  <strong className="text-slate-900 dark:text-white block font-bold mb-1">
                    Paste it above and press Fetch Video.
                  </strong>
                  The link fills in and fetches the clean source file directly.
                </p>
              </div>
            </div>

            <div className="p-7 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-600/10 border border-violet-200 dark:border-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400">
                    <FolderDown className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-300 dark:text-gray-700 font-mono">
                    03
                  </span>
                </div>
                <p className="text-slate-700 dark:text-gray-200 text-sm sm:text-base leading-relaxed">
                  <strong className="text-slate-900 dark:text-white block font-bold mb-1">
                    Pick a quality and save
                  </strong>
                  the file to your camera roll, downloads folder, or files app.
                </p>
              </div>
            </div>
          </div>

          {/* Responsible Notice Callout */}
          <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-rose-500/10 to-violet-500/10 border border-cyan-200 dark:border-cyan-500/30 backdrop-blur-xl">
            <div className="flex items-start gap-3.5">
              <ShieldAlert className="w-6 h-6 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
              <p className="text-slate-700 dark:text-gray-200 text-sm sm:text-base leading-relaxed">
                <strong>Use it responsibly:</strong> save clips you made yourself, have permission to reuse, or are keeping from a public account for personal, offline viewing. If you repost a saved TikTok elsewhere, tag or credit the original creator rather than presenting the clip as your own.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 sm:py-20 bg-white dark:bg-gray-900/40 border-t border-slate-200 dark:border-gray-800/40 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
              frequently asked questions
            </h2>
          </div>

          <div className="space-y-3.5">
            {TIKTOK_FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl bg-slate-50 dark:bg-gray-900/60 backdrop-blur-xl border border-slate-200 dark:border-gray-800/80 overflow-hidden shadow-sm transition-all"
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
                      className={`w-8 h-8 rounded-lg bg-white dark:bg-gray-800/60 flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? "rotate-180 bg-rose-100 text-rose-700 dark:bg-rose-600/20 dark:text-rose-400"
                          : "text-slate-500 dark:text-gray-400"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-slate-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed border-t border-slate-200/60 dark:border-gray-800/40">
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
