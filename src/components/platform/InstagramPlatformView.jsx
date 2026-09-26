"use client";

import { useState } from "react";
import {
  Sparkles,
  Download,
  Film,
  Layers,
  Tv,
  History,
  Bookmark,
  Share2,
  Copy,
  FolderDown,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  ChevronDown,
  ShieldCheck,
  Video,
} from "lucide-react";
import { InstagramIcon } from "@/components/common/BrandIcons";
import DownloadInput from "@/components/download/DownloadInput";
import DownloadResult from "@/components/download/DownloadResult";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import RecentDownloads from "@/components/home/RecentDownloads";

const FORMATS = [
  {
    title: "Reels",
    description:
      "Short vertical videos, with or without background music, saved as a standard MP4 file ready to re-edit or repost elsewhere.",
    icon: Film,
    gradient: "from-[#E4405F] to-[#FD1D1D]",
  },
  {
    title: "Feed posts & carousels",
    description:
      "Single photos, single videos, or multi-image carousel posts — each image or clip in a carousel can be saved individually.",
    icon: Layers,
    gradient: "from-[#FD1D1D] to-[#F77737]",
  },
  {
    title: "IGTV",
    description:
      "Longer-form videos originally published under Instagram's IGTV format are supported at the resolution the channel uploaded.",
    icon: Tv,
    gradient: "from-[#F77737] to-[#FCAF45]",
  },
  {
    title: "Stories",
    description:
      "Stories shared from a public account can be saved while they're still live, including photo and video Stories.",
    icon: History,
    gradient: "from-[#C13584] to-[#E4405F]",
  },
  {
    title: "Highlights",
    description:
      "Story Highlights kept on a profile can be opened and saved clip by clip the same way regular Stories are.",
    icon: Bookmark,
    gradient: "from-[#833AB4] to-[#C13584]",
  },
];

const STEPS = [
  {
    num: "01",
    boldTitle: "On the Instagram app:",
    text: "open the Reel or post, tap the share icon, then choose Copy Link from the row of options that appears.",
    icon: Share2,
  },
  {
    num: "02",
    boldTitle: "Paste it above:",
    text: "bring the link back to this page, drop it into the paste box, and press Fetch Reel.",
    icon: Copy,
  },
  {
    num: "03",
    boldTitle: "Choose a quality and save:",
    text: "once the file is ready, pick a resolution if more than one is available, then save it to your camera roll, downloads folder, or files app.",
    icon: FolderDown,
  },
];

const SUPPORTED_LIST = [
  "Public Instagram Reels",
  "Public Video Posts",
  "Public Story Links",
  "Carousel Video Slides",
  "Creator-Owned Content Archives",
  "Original MP3 Audio Track Extraction",
];

const NOT_SUPPORTED_LIST = [
  "Private Instagram Accounts",
  "Close Friends Stories & Posts",
  "Direct Messages (DMs)",
  "Deleted or Restricted Media",
  "Login-Protected Media Endpoints",
];

const INSTAGRAM_FAQS = [
  {
    q: "Can I download from a private Instagram account?",
    a: "No. If a Reel, post or Story belongs to a private account, the link won't resolve. This is intentional — SaveFromPro only works with content the account owner has made public.",
  },
  {
    q: "Will my download have the Instagram logo on it?",
    a: "SaveFromPro doesn't add a watermark of its own. The file you receive is the same one Instagram serves when the post plays inside the app.",
  },
  {
    q: "Can I save a carousel post with multiple photos and videos?",
    a: "Yes. Paste the link to the carousel post and each slide — whether it's a photo or a video — is offered as a separate file to save.",
  },
  {
    q: "Does this work for Instagram Stories?",
    a: "Yes, as long as the Story is still live and the account is public. Once a Story expires after 24 hours (and isn't kept as a Highlight), it's no longer reachable by any tool.",
  },
  {
    q: "Do I need to log into Instagram to use this?",
    a: "No. SaveFromPro never asks for your Instagram username or password — it only reads the public link you paste in.",
  },
  {
    q: "What format do I get for video versus photos?",
    a: "Video is delivered as a standard MP4 file and photos as JPG, so both open normally on any phone or computer without extra software.",
  },
  {
    q: "Can I download a Story Highlight?",
    a: "Yes — Highlights are treated the same as regular Stories, since the account owner has chosen to keep them visible on their public profile.",
  },
  {
    q: "Does saving a Reel notify the original creator?",
    a: "No. Fetching a public link through SaveFromPro doesn't trigger any notification to the account, the same as simply viewing the post normally would not.",
  },
];

export default function InstagramPlatformView({
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#E4405F]/10 via-fuchsia-500/5 to-transparent dark:from-[#E4405F]/15 dark:via-fuchsia-950/10 dark:to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-rose-500/10 via-fuchsia-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
          {/* Platform Icon */}
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E4405F] via-[#FD1D1D] to-[#F77737] items-center justify-center mb-6 shadow-lg shadow-rose-500/20">
            <InstagramIcon className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight transition-colors">
            Instagram <span className="gradient-text">Downloader</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed transition-colors">
            Save Reels, feed videos, IGTV episodes, carousel posts and Stories from public Instagram accounts — in the same quality they were uploaded in, without a watermark stamped over the top.
          </p>

          {/* Download Input */}
          <DownloadInput
            onSubmit={handleDownload}
            isLoading={isLoading}
            platform={platform}
            buttonText="Fetch Reel"
          />

          {/* Subtext under input */}
          <div className="mt-5 space-y-3">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400">
              Works with Reels, posts, IGTV and Stories links from public profiles.
            </p>

            <div className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800 text-xs text-slate-700 dark:text-gray-300 shadow-sm backdrop-blur-sm">
              <span>✓ Reels, posts &amp; Stories</span>
              <span className="text-slate-300 dark:text-gray-700">•</span>
              <span>✓ No login required</span>
              <span className="text-slate-300 dark:text-gray-700">•</span>
              <span>✓ No watermark added</span>
            </div>
          </div>

          {/* Result / Error / Loading */}
          {isLoading && (
            <div className="mt-8">
              <LoadingSpinner text="Fetching Instagram video details..." />
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

      {/* Every kind of Instagram content, one box */}
      <section className="py-16 sm:py-20 bg-slate-50 dark:bg-gray-950 relative overflow-hidden border-t border-slate-200 dark:border-gray-800/40 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
              Every kind of Instagram content, one box
            </h2>
            <p className="text-slate-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
              Instagram spreads video and photo content across several formats. SaveFromPro reads the link and works out which one it&apos;s looking at.
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

      {/* How to copy an Instagram share link */}
      <section className="py-16 sm:py-20 bg-white dark:bg-gray-900/40 border-t border-slate-200 dark:border-gray-800/40 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
              How to copy an Instagram share link
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="p-7 rounded-2xl bg-slate-50 dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-600/10 border border-rose-200 dark:border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
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

      {/* Context & Research & Fair Use */}
      <section className="py-16 bg-slate-50 dark:bg-gray-950 border-t border-slate-200 dark:border-gray-800/40 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="p-7 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm leading-relaxed text-slate-700 dark:text-gray-300 text-sm sm:text-base">
            SaveFromPro is a free tool built to download public Instagram videos. A public URL is any Reel, Story, or video post that anyone can view on the web without logging in. Our tool never asks for your password, login token, or personal data.
          </div>

          <div className="p-7 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm leading-relaxed text-slate-700 dark:text-gray-300 text-sm sm:text-base">
            Creators, editors, and researchers often need offline copies of public Instagram videos. You might be building a mood board, backing up your own Reels for other platforms, or saving educational clips for later. SaveFromPro gives you the original HD MP4 file straight from the source.
          </div>

          <div className="p-7 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm leading-relaxed text-slate-700 dark:text-gray-300 text-sm sm:text-base">
            Downloading a video does not give you copyright over it. Saved files are for personal use, content backups, and fair-use research only. Always get permission from the copyright holder before sharing, editing, or earning money from saved Instagram content.
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

          {/* Respectful Usage Notice Callout */}
          <div className="mt-8 p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-rose-500/10 border border-violet-200 dark:border-violet-500/30 backdrop-blur-xl">
            <div className="flex items-start gap-3.5">
              <ShieldAlert className="w-6 h-6 text-violet-600 dark:text-violet-400 flex-shrink-0 mt-0.5" />
              <p className="text-slate-700 dark:text-gray-200 text-sm sm:text-base leading-relaxed">
                <strong>Please keep it respectful:</strong> only download Reels, posts and Stories you created, have explicit permission to reuse, or are saving from a public account for your own personal, offline viewing. If you repost someone else&apos;s work, credit the original creator by tagging their account, and don&apos;t present someone else&apos;s content as your own.
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
            {INSTAGRAM_FAQS.map((faq, index) => {
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
                          ? "rotate-180 bg-rose-100 text-rose-700 dark:bg-rose-600/20 dark:text-rose-400"
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
