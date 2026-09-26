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
  Tv,
  Star,
  Gamepad2,
  Radio,
} from "lucide-react";
import DownloadInput from "@/components/download/DownloadInput";
import DownloadResult from "@/components/download/DownloadResult";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import RecentDownloads from "@/components/home/RecentDownloads";

const FORMATS = [
  {
    title: "Clips",
    description:
      "Short, creator- or viewer-made highlights cut from a stream, usually a minute or less, saved at the resolution the clip was originally recorded in.",
    icon: Film,
    gradient: "from-[#9146FF] to-[#772ce8]",
  },
  {
    title: "VODs",
    description:
      "Full past broadcasts kept on a channel, which can run for hours — SaveFromPro can fetch the entire VOD or the segment you need.",
    icon: Tv,
    gradient: "from-[#772ce8] to-[#5c16c5]",
  },
  {
    title: "Highlights",
    description:
      "Broadcaster-curated highlight reels saved from a stream are treated the same way as a regular VOD link.",
    icon: Star,
    gradient: "from-[#a970ff] to-[#9146FF]",
  },
];

const STEPS = [
  {
    num: "01",
    boldTitle: "For a clip:",
    text: "click the Share icon under the clip player, then choose Copy to grab the clips.twitch.tv link.",
    icon: Share2,
  },
  {
    num: "02",
    boldTitle: "Paste it above and press Fetch Clip.",
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
  "Public Twitch Clips",
  "Public Stream Highlights",
  "Full Broadcast VOD Replays",
  "High Frame Rate 1080p 60fps MP4",
  "Podcast & Music Stream MP3 Extraction",
];

const NOT_SUPPORTED_LIST = [
  "Subscriber-Only VODs (Subscriber Lock)",
  "Private / Subscriber-Only Live Streams",
  "Deleted VODs (Past Twitch Purge Windows)",
  "Muted VOD Audio Chunks (Copyright Mutes)",
  "Account Login Endpoints",
];

const TWITCH_FAQS = [
  {
    q: "Can I download a subscriber-only VOD?",
    a: "No. If a channel restricts a VOD to subscribers, that restriction applies to outside tools as well as to logged-out viewers.",
  },
  {
    q: "Does this work for full-length VODs, not just clips?",
    a: "Yes, as long as the VOD is still available on the channel and isn't subscriber-restricted.",
  },
  {
    q: "Can I download from a channel that's currently live?",
    a: "Live broadcasts in progress aren't supported — the tool works with clips and finished VODs, not an ongoing live feed.",
  },
  {
    q: "Do I need a Twitch account to use this?",
    a: "No. SaveFromPro only reads the public link you paste in — it never asks for your Twitch login.",
  },
  {
    q: "What format do I get?",
    a: "Both clips and VODs save as a standard MP4 file, which plays on any modern device.",
  },
  {
    q: "Why did my VOD link stop working after a few weeks?",
    a: "Twitch automatically removes most VODs after a set retention period unless the streamer has highlighted or archived them permanently.",
  },
  {
    q: "Can I choose a lower resolution for a large VOD?",
    a: "Whenever more than one resolution is available for a video, SaveFromPro lists each option so you can pick a smaller file if you prefer.",
  },
  {
    q: "Does this include the stream's chat replay?",
    a: "No — SaveFromPro saves the video and audio of the broadcast itself, not the accompanying chat log.",
  },
  {
    q: "Can I save just a portion of a long VOD?",
    a: "Using Twitch's own clip tool to cut the moment you want first, then saving the resulting clip link, is the most reliable way to get a shorter segment.",
  },
  {
    q: "Is there a limit to how many clips I can save?",
    a: "There's no hard cap for personal use, but pasting and checking one link at a time keeps results accurate before saving.",
  },
  {
    q: "Can I download a clip made by a viewer, not the streamer?",
    a: "Yes — viewer-created clips work exactly the same way as streamer-created ones, since both use the same clips.twitch.tv link format.",
  },
];

export default function TwitchPlatformView({
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#9146FF]/10 via-purple-500/5 to-transparent dark:from-[#9146FF]/15 dark:via-purple-950/10 dark:to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-purple-500/10 via-violet-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
          {/* Platform Icon */}
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9146FF] to-[#772ce8] items-center justify-center mb-6 shadow-lg shadow-purple-500/20">
            <Video className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight transition-colors">
            Twitch Clip &amp; <span className="gradient-text">VOD Downloader</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed transition-colors">
            Turn a Twitch clip or full VOD link into a downloadable file for offline highlights, edits and archives, in the resolution the broadcast was streamed at.
          </p>

          {/* Download Input */}
          <DownloadInput
            onSubmit={handleDownload}
            isLoading={isLoading}
            platform={platform}
            buttonText="Fetch Clip"
          />

          {/* Subtext under input */}
          <div className="mt-5 space-y-3">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400">
              Works with clips.twitch.tv links and twitch.tv/videos/ VOD links.
            </p>

            <div className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800 text-xs text-slate-700 dark:text-gray-300 shadow-sm backdrop-blur-sm">
              <span>✓ Clips &amp; full VODs</span>
              <span className="text-slate-300 dark:text-gray-700">•</span>
              <span>✓ No login required</span>
              <span className="text-slate-300 dark:text-gray-700">•</span>
              <span>✓ Standard MP4 files</span>
            </div>
          </div>

          {/* Result / Error / Loading */}
          {isLoading && (
            <div className="mt-8">
              <LoadingSpinner text="Fetching Twitch clip / VOD details..." />
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

      {/* What SaveFromPro can save from Twitch */}
      <section className="py-16 sm:py-20 bg-slate-50 dark:bg-gray-950 relative overflow-hidden border-t border-slate-200 dark:border-gray-800/40 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
              What SaveFromPro can save from Twitch
            </h2>
            <p className="text-slate-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
              Twitch stores video in two main forms, and each needs a slightly different link.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FORMATS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-7 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm hover:border-purple-400 dark:hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between"
                >
                  <div>
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
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How to copy a Twitch clip or VOD link */}
      <section className="py-16 sm:py-20 bg-white dark:bg-gray-900/40 border-t border-slate-200 dark:border-gray-800/40 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
              How to copy a Twitch clip or VOD link
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
                      <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-600/10 border border-purple-200 dark:border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
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

      {/* Stream & Archival Cards */}
      <section className="py-16 bg-slate-50 dark:bg-gray-950 border-t border-slate-200 dark:border-gray-800/40 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="p-7 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm leading-relaxed text-slate-700 dark:text-gray-300 text-sm sm:text-base">
            SaveFromPro provides a powerful video downloader designed for Twitch stream clips, highlights, and public Video on Demand (VOD) broadcasts. Live streaming content on Twitch is highly dynamic, but Twitch automatically deletes past VOD broadcasts after 14 days for standard streamers and 60 days for Twitch Partners and Prime members. SaveFromPro gives gamers, esports fans, and content creators a reliable way to save memorable gaming moments before VOD retention windows expire.
          </div>

          <div className="p-7 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm leading-relaxed text-slate-700 dark:text-gray-300 text-sm sm:text-base">
            Our platform supports 1080p 60fps high frame rate downloads, preserving the liquid-smooth playback required for fast-paced esports gameplay, gaming tutorials, and live podcast recordings. You can also extract standalone audio files using our MP3 converter mode.
          </div>

          <div className="p-7 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm leading-relaxed text-slate-700 dark:text-gray-300 text-sm sm:text-base">
            We operate with complete respect for streamer copyright and Twitch platform rules. SaveFromPro processes only publicly accessible web links. Saved files are intended for personal offline review, esports highlights archiving, and creator editing workflows in accordance with copyright law.
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

      {/* Deep-Dive / Editorial Section */}
      <section className="py-16 sm:py-20 bg-slate-50 dark:bg-gray-950 border-t border-slate-200 dark:border-gray-800/40 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="p-8 rounded-3xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Clips versus VODs, explained
            </h3>
            <p className="text-slate-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
              A Twitch clip is a short excerpt cut from a broadcast, usually created by a viewer or the streamer highlighting a specific funny or exciting moment, and it lives independently once created — it stays available even after the original VOD it was cut from eventually expires. A VOD, on the other hand, is the full, unedited recording of an entire broadcast, which Twitch generally keeps for a limited number of days unless the streamer takes the extra step of saving it as a permanent Highlight. Understanding that difference explains why an old clip might still work perfectly while the full stream it came from is long gone.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Why creators keep their own archive
            </h3>
            <p className="text-slate-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
              Because Twitch&apos;s default VOD retention is time-limited, many streamers treat a personal download habit as basic housekeeping — saving key broadcasts locally, or at least the moments worth revisiting, before Twitch&apos;s automatic cleanup removes them for good.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Works on any device
            </h3>
            <p className="text-slate-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
              SaveFromPro runs in your browser, so a Twitch link works the same way whether you&apos;re on a phone, tablet or desktop computer, with no app to install and nothing to keep updated. Paste the link, wait a moment for the file to be prepared, and save it wherever your device keeps downloads.
            </p>
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
            {TWITCH_FAQS.map((faq, index) => {
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
                          ? "rotate-180 bg-purple-100 text-purple-700 dark:bg-purple-600/20 dark:text-purple-400"
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
