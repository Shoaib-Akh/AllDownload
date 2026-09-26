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
  Users,
  Tv,
  Link2,
  Code,
  Play,
} from "lucide-react";
import { FacebookIcon } from "@/components/common/BrandIcons";
import DownloadInput from "@/components/download/DownloadInput";
import DownloadResult from "@/components/download/DownloadResult";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import RecentDownloads from "@/components/home/RecentDownloads";

const FORMATS = [
  {
    title: "Page videos",
    description:
      "Videos uploaded directly to a public Facebook Page, including live broadcasts once they've finished and been saved as a replay.",
    icon: Video,
    gradient: "from-[#1877F2] to-[#0a5dc2]",
  },
  {
    title: "Reels",
    description:
      "Short vertical clips shared through Facebook's Reels format, saved the same way an Instagram Reel would be.",
    icon: Film,
    gradient: "from-[#0a5dc2] to-[#084e96]",
  },
  {
    title: "Groups & profiles",
    description:
      "Public group posts and public profile videos resolve the same way as Page content, as long as the post itself isn't restricted.",
    icon: Users,
    gradient: "from-[#2374E1] to-[#1877F2]",
  },
  {
    title: "Watch",
    description:
      "Clips discovered through Facebook Watch use their own share link, which SaveFromPro reads the same as a standard video post.",
    icon: Tv,
    gradient: "from-[#1877F2] to-[#0055b3]",
  },
  {
    title: "fb.watch short links",
    description:
      "Shortened fb.watch links are followed automatically to the full video, so you can paste either version.",
    icon: Link2,
    gradient: "from-[#388af6] to-[#1877F2]",
  },
  {
    title: "Embedded video links",
    description:
      "If a video was shared by pasting an embed or permalink into a comment, that permalink works the same as a normal post link.",
    icon: Code,
    gradient: "from-[#0062E0] to-[#0048a7]",
  },
];

const STEPS = [
  {
    num: "01",
    boldTitle: "On the Facebook app:",
    text: "tap the Share button under the video, then choose Copy Link from the menu that opens.",
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
    boldTitle: "Choose a quality and save",
    text: "the file to your camera roll, downloads folder, or files app.",
    icon: FolderDown,
  },
];

const SUPPORTED_LIST = [
  "Public Facebook Page & Profile Videos",
  "Public Facebook Reels (/reel/)",
  "Facebook Watch URLs (facebook.com/watch & fb.watch)",
  "Public Facebook Live Stream Replays",
  "Mobile Facebook Links (m.facebook.com)",
  "HD (1080p) & SD (480p) MP4 Quality Options",
];

const NOT_SUPPORTED_LIST = [
  "Private Facebook Profiles & Accounts",
  "Closed or Secret Facebook Groups",
  "Private Facebook Messages",
  "Ongoing Active Live Streams (Before Processing)",
  "Login-Protected Facebook Video Endpoints",
];

const FACEBOOK_FAQS = [
  {
    q: "Can I download a video shared to Friends only?",
    a: "No. SaveFromPro can only resolve videos attached to posts set to public — the same rule Facebook itself applies when a post is viewed while logged out.",
  },
  {
    q: "Does this work for Facebook Live replays?",
    a: "Yes, once a live broadcast has ended and Facebook has saved it as a normal video post on the Page, it can be downloaded the same as any other public video.",
  },
  {
    q: "Can I download Facebook Reels?",
    a: "Yes. Paste the Reel's share link the same way you would for a regular video post.",
  },
  {
    q: "Do I need a Facebook account to use this tool?",
    a: "No — SaveFromPro never asks for your Facebook login. It only needs the public link to the video itself.",
  },
  {
    q: "What if I only have an fb.watch link?",
    a: "That's fine — fb.watch is Facebook's own shortened link format, and SaveFromPro follows it through to the full video automatically.",
  },
  {
    q: "Can I download a video posted inside a group?",
    a: "Only if the group itself is public and doesn't require membership to view posts — the same visibility rule that applies everywhere else on Facebook.",
  },
  {
    q: "Will the downloaded file include the video's sound?",
    a: "Yes, the saved MP4 includes the original audio track exactly as it plays on Facebook.",
  },
  {
    q: "Can I choose a lower resolution to save space?",
    a: "Whenever Facebook offers more than one resolution for a video, SaveFromPro lists each one so you can pick a smaller file if that's what you need.",
  },
  {
    q: "Does this work for videos shared from a Marketplace listing?",
    a: "If the listing itself is public and includes an embedded video, the same permalink approach applies — copy the video's own link rather than the listing's main page.",
  },
  {
    q: "Can I download a video from a public event page?",
    a: "Yes, as long as the event page itself is public and the video post's permalink is used, rather than the general event overview link.",
  },
];

export default function FacebookPlatformView({
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

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 md:pt-14 md:pb-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/15 via-transparent to-transparent dark:from-blue-600/10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 mb-6">
            <FacebookIcon className="w-3.5 h-3.5" />
            <span>Works with facebook.com and fb.watch links, including Reels.</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Facebook Video Downloader
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6">
            Save public Facebook videos, Reels and Watch clips shared on pages, groups and profiles — in the original quality they were uploaded in, ready to keep on your device without a Facebook account or extra software.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 mb-8">
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-500 font-bold">✓</span> Pages, groups &amp; profiles
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-500 font-bold">✓</span> Reels &amp; Watch clips
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-500 font-bold">✓</span> No login required
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-500 font-bold">✓</span> Standard MP4 files
            </span>
          </div>

          {/* Download Input Box */}
          <div className="max-w-2xl mx-auto">
            <DownloadInput
              onDownload={handleDownload}
              isLoading={isLoading}
              platform={platform}
              buttonText="Fetch Video"
            />
          </div>

          {error && (
            <div className="max-w-2xl mx-auto mt-6">
              <ErrorMessage message={error} onDismiss={reset} />
            </div>
          )}

          {isLoading && (
            <div className="mt-8">
              <LoadingSpinner />
            </div>
          )}

          {result && (
            <div className="max-w-2xl mx-auto mt-8">
              <DownloadResult
                result={result}
                onDownload={triggerDownload}
                onReset={reset}
              />
            </div>
          )}

          {recents && recents.length > 0 && (
            <div className="max-w-2xl mx-auto mt-10 text-left">
              <RecentDownloads
                items={recents}
                onClear={clearRecents}
                onRemove={removeRecent}
              />
            </div>
          )}
        </div>
      </section>

      {/* Formats Section */}
      <section className="py-12 md:py-16 border-t border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Where Facebook video comes from
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Facebook spreads video across several parts of the platform, each with its own link style. SaveFromPro handles all of them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FORMATS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl p-6 bg-slate-50 dark:bg-gray-850/50 border border-slate-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700/60 transition-all group"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white mb-5 shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How To Copy Steps */}
      <section className="py-12 md:py-16 border-t border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-900/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              How to copy a Facebook video link
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="relative p-6 rounded-2xl bg-white dark:bg-gray-850 border border-slate-200 dark:border-gray-800 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black text-blue-600/30 dark:text-blue-400/30">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5 leading-snug">
                    {step.boldTitle}
                  </h3>
                  {step.text && (
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      {step.text}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Editorial Content / Archival Information */}
      <section className="py-12 md:py-16 border-t border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          <p>
            SaveFromPro provides a specialized public link parser for Facebook videos, Reels, Watch content, and completed Live stream replays. Facebook&apos;s media ecosystem uses a variety of URL structures—ranging from legacy mobile web links (m.facebook.com) to shortened watch handles (fb.watch). Our engine parses public Facebook endpoints without requiring user login credentials, session cookies, or browser plugins.
          </p>
          <p>
            Whether you are saving a public tutorial, archiving your business page&apos;s live video stream replays, or downloading public Facebook Reels for offline research, SaveFromPro resolves public CDN video streams in clear HD 1080p MP4 or extractable MP3 audio format.
          </p>
          <p>
            We strictly adhere to privacy laws and platform boundaries. SaveFromPro operates only on publicly accessible web URLs. Downloading Facebook video content does not grant ownership; saved media must be used responsibly for personal offline viewing, research, or content backups in accordance with copyright law.
          </p>
        </div>
      </section>

      {/* Supported vs Not Supported */}
      <section className="py-12 md:py-16 border-t border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Supported Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-850 border border-emerald-200 dark:border-emerald-900/40 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Supported
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Public Facebook video sources
                  </p>
                </div>
              </div>
              <ul className="space-y-3.5">
                {SUPPORTED_LIST.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Not Supported Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-850 border border-rose-200 dark:border-rose-900/40 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Not supported
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Restricted or private endpoints
                  </p>
                </div>
              </div>
              <ul className="space-y-3.5">
                {NOT_SUPPORTED_LIST.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300"
                  >
                    <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Reminder Box */}
          <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-start gap-4">
            <ShieldAlert className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
              <strong className="font-semibold block mb-1">A quick reminder:</strong>
              only save Facebook videos you created, have permission to reuse, or are keeping from a public post for personal, offline viewing. If you share a saved video again, credit the page, group or profile it came from.
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-12 md:py-20 border-t border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white capitalize">
              frequently asked questions
            </h2>
          </div>

          <div className="space-y-3">
            {FACEBOOK_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-850 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <span className="text-sm sm:text-base">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 flex-shrink-0 text-slate-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-blue-600 dark:text-blue-400" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-300 border-t border-slate-200/60 dark:border-gray-800/60 pt-3 leading-relaxed">
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
