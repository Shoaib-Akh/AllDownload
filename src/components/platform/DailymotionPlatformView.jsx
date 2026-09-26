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
  Play,
  Film,
  ListVideo,
  Code2,
  Tv,
  Monitor,
  Video,
} from "lucide-react";
import DownloadInput from "@/components/download/DownloadInput";
import DownloadResult from "@/components/download/DownloadResult";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import RecentDownloads from "@/components/home/RecentDownloads";

const FORMATS = [
  {
    title: "Channel uploads",
    description:
      "Standard videos uploaded to a public channel, available at whichever resolutions the channel provided at upload time.",
    icon: Film,
    gradient: "from-[#00AAFF] to-[#0088cc]",
  },
  {
    title: "Playlists",
    description:
      "Individual videos inside a public playlist can be saved one at a time using each video's own dedicated link, rather than the playlist's overview page.",
    icon: ListVideo,
    gradient: "from-[#0088cc] to-[#0066aa]",
  },
  {
    title: "Embedded video pages",
    description:
      "Videos found through an embedded player on a news site or blog resolve the same way once you open the video's own Dailymotion page rather than the page that embedded it.",
    icon: Code2,
    gradient: "from-[#38bdf8] to-[#00AAFF]",
  },
];

const STEPS = [
  {
    num: "01",
    boldTitle: "Open the video on dailymotion.com or the Dailymotion app.",
    text: "copy the link",
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
    text: "the file to your downloads folder or files app.",
    icon: FolderDown,
  },
];

const SUPPORTED_LIST = [
  "Public Dailymotion Video Links",
  "Embed Player URLs",
  "Short Link Handles",
  "Multiple Quality Tiers",
  "Original Sound MP3 Extraction",
];

const NOT_SUPPORTED_LIST = [
  "Password-Protected Dailymotion Videos",
  "Private User Channel Videos",
  "Geo-Restricted Regional Media",
  "Deleted or Suspended Videos",
  "Account Login Endpoints",
];

const DAILYMOTION_FAQS = [
  {
    q: "Can I download a private Dailymotion video?",
    a: "No. Only videos set to public on the channel can be resolved by SaveFromPro or any other outside tool.",
  },
  {
    q: "Does this work with dai.ly short links?",
    a: "Yes — dai.ly is Dailymotion's own shortened link format, and it's followed through automatically to the full video.",
  },
  {
    q: "Do I need a Dailymotion account to use this?",
    a: "No. SaveFromPro only reads the public link you paste in — it never asks for your Dailymotion login.",
  },
  {
    q: "Can I download an entire playlist at once?",
    a: "Paste each video's own link one at a time for the most reliable result, rather than the playlist's overview page.",
  },
  {
    q: "What format do I get?",
    a: "Video downloads as a standard MP4 file, which plays on any modern phone or computer.",
  },
  {
    q: "Why does a video say it's not available in my region?",
    a: "Some uploads are restricted to certain countries by the rights holder, and that restriction applies the same way to SaveFromPro as it would to any viewer.",
  },
  {
    q: "Can I choose a lower resolution?",
    a: "Whenever more than one resolution is available, SaveFromPro lists each option so you can pick a smaller file if you prefer.",
  },
  {
    q: "Does this work for videos embedded on another website?",
    a: "Yes — open the video on its own Dailymotion page first, then copy that link rather than the page it was embedded on.",
  },
  {
    q: "Can I save the video's automatic captions?",
    a: "SaveFromPro focuses on the video and audio file itself; captions burned into the frame are included, but separate caption files aren't part of the download.",
  },
  {
    q: "Is there a limit to how many videos I can save?",
    a: "There's no hard cap for personal use, but pasting and checking one link at a time keeps the result accurate before saving.",
  },
  {
    q: "Can I save a documentary or full episode, not just a short clip?",
    a: "Yes — length doesn't matter to the tool itself, though longer uploads naturally take a little more time to prepare and result in a larger file.",
  },
  {
    q: "What happens if I paste a channel link instead of a video link?",
    a: "A channel's main page lists many videos rather than pointing to one specific file, so it won't resolve — open the individual video first.",
  },
];

export default function DailymotionPlatformView({
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
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500/15 via-transparent to-transparent dark:from-sky-500/10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 mb-6">
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Works with dailymotion.com and dai.ly short links.</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Dailymotion Video Downloader
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6">
            Save Dailymotion uploads in the quality the channel published them, without needing a Dailymotion account, a browser extension, or any extra software installed on your device.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 mb-8">
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-500 font-bold">✓</span> Original quality
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
              What SaveFromPro can save from Dailymotion
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Dailymotion is a straightforward, single-format platform, which keeps things simple.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FORMATS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl p-6 bg-slate-50 dark:bg-gray-850/50 border border-slate-200 dark:border-gray-800 hover:border-sky-300 dark:hover:border-sky-700/60 transition-all group"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white mb-5 shadow-md shadow-sky-500/10 group-hover:scale-105 transition-transform`}
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
              How to copy a Dailymotion video link
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
                    <span className="text-3xl font-black text-sky-600/30 dark:text-sky-400/30">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800/60 flex items-center justify-center text-sky-600 dark:text-sky-400">
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
            SaveFromPro provides a specialized video downloader for Dailymotion public videos, news broadcasts, documentary clips, and embed player links. Dailymotion is one of the internet&apos;s oldest video platforms, hosting millions of independent news clips, entertainment videos, and publisher streams. Our engine parses public Dailymotion video manifests, delivering clean MP4 files directly to your web browser.
          </p>
          <p>
            Journalists, film students, and researchers use SaveFromPro to archive public news reports and media documentaries for offline study. Whether you are analyzing news coverage or preserving public video archives, SaveFromPro provides uncompressed HD downloads.
          </p>
          <p>
            We operate under a strict commitment to copyright ethics. SaveFromPro parses only publicly available web links. Downloading Dailymotion media does not grant commercial ownership; saved files are intended for personal offline reference, educational study, and media archival in accordance with copyright law.
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
                    Public endpoints ready for download
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
                    Restricted or inaccessible media
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
              only save videos you created, have permission to reuse, or are keeping from a public upload for personal, offline viewing. If you repost a saved video elsewhere, credit the original channel.
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Technical / Feature Overview Cards */}
      <section className="py-12 md:py-16 border-t border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Card 1: How Dailymotion serves its videos */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-gray-850 border border-slate-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                How Dailymotion serves its videos
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Behind the single &quot;play&quot; button on a Dailymotion page, the platform typically prepares several versions of the same upload — a lighter one for slow mobile connections and one or more higher-bitrate versions for a stronger connection or a bigger screen. The player picks automatically based on your connection speed at the moment you hit play, which is why the same video can sometimes look sharper on one visit than another. SaveFromPro sidesteps that automatic guessing by listing every version the platform has actually prepared, so the choice of quality is yours rather than the player&apos;s.
            </p>
          </div>

          {/* Card 2: Long-form content on Dailymotion */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-gray-850 border border-slate-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <Tv className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Long-form content on Dailymotion
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Dailymotion has historically been a home for longer uploads — documentaries, full episodes, and extended interviews — alongside shorter clips, which sets it apart from platforms built primarily around a few seconds of vertical video. That longer format means files can be considerably larger, so choosing a lower resolution is often worth it if you mainly want to watch once rather than keep a permanent high-quality archive.
            </p>
          </div>

          {/* Card 3: Works on any device */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-gray-850 border border-slate-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <Monitor className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Works on any device
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              SaveFromPro runs in your browser, so a Dailymotion link works the same way whether you&apos;re on a phone, tablet or desktop computer, with no app to install and nothing to keep updated. Paste the link, wait a moment for the file to be prepared, and save it wherever your device keeps downloads.
            </p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-12 md:py-20 border-t border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-900/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white capitalize">
              frequently asked questions
            </h2>
          </div>

          <div className="space-y-3">
            {DAILYMOTION_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-850 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                  >
                    <span className="text-sm sm:text-base">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 flex-shrink-0 text-slate-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-sky-600 dark:text-sky-400" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-gray-800/60 pt-3 leading-relaxed">
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
