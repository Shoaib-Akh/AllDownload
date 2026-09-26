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
  Pin,
  Film,
  Layers,
  Image,
  Bookmark,
  Sparkle,
  Monitor,
} from "lucide-react";
import DownloadInput from "@/components/download/DownloadInput";
import DownloadResult from "@/components/download/DownloadResult";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import RecentDownloads from "@/components/home/RecentDownloads";

const FORMATS = [
  {
    title: "Video Pins",
    description:
      "Standalone video content pinned directly to a board, saved at the resolution it was uploaded in.",
    icon: Film,
    gradient: "from-[#E60023] to-[#ad001a]",
  },
  {
    title: "Idea Pins",
    description:
      "Multi-page Idea Pins with several video or photo slides can be saved page by page, in the order they were originally arranged.",
    icon: Layers,
    gradient: "from-[#ad001a] to-[#800013]",
  },
  {
    title: "Standard image Pins",
    description:
      "Regular photo Pins can be saved as a full-resolution image, considerably larger than the compressed thumbnail shown while scrolling the feed.",
    icon: Image,
    gradient: "from-[#ff334b] to-[#E60023]",
  },
];

const STEPS = [
  {
    num: "01",
    boldTitle: "Open the Pin you want to save, on the Pinterest app or pinterest.com.",
    text: "Copy the link",
    icon: Share2,
  },
  {
    num: "02",
    boldTitle: "Paste it above and press Fetch Pin.",
    text: "Bring the link back to this page and drop it into the box.",
    icon: Copy,
  },
  {
    num: "03",
    boldTitle: "Save the file to your camera roll,",
    text: "downloads folder, or files app.",
    icon: FolderDown,
  },
];

const SUPPORTED_LIST = [
  "Public Pinterest Video Pins (pin.it & pinterest.com/pin/)",
  "Public Idea Pins & Story Pins",
  "Animated GIF Pins (Converted to MP4)",
  "HD 1080p Progressive MP4 Output",
  "Original Background Music MP3 Extraction",
];

const NOT_SUPPORTED_LIST = [
  "Secret / Private Pinterest Boards",
  "Private Account Messages",
  "Deleted or Removed Pins",
  "Static Image Pins (Use Browser Save Image)",
  "Account Login Endpoints",
];

const PINTEREST_FAQS = [
  {
    q: "Can I download a Pin from a secret board?",
    a: "No. Pins kept on a private \"secret\" board aren't publicly reachable, so they can't be resolved by SaveFromPro or any outside tool.",
  },
  {
    q: "Does this work with pin.it short links?",
    a: "Yes — pin.it is Pinterest's own shortened link format, and it's followed through automatically to the full Pin.",
  },
  {
    q: "Can I save an Idea Pin's video pages?",
    a: "Yes. Paste the Idea Pin's link and each page's video or photo is offered separately.",
  },
  {
    q: "Do I need a Pinterest account to use this?",
    a: "No. SaveFromPro only reads the public link you paste in — it never asks for your Pinterest login.",
  },
  {
    q: "Will I get the full-resolution image, not a thumbnail?",
    a: "Yes — SaveFromPro fetches the original file Pinterest stores, rather than the smaller preview shown while scrolling the feed.",
  },
  {
    q: "What format do I get?",
    a: "Video downloads as a standard MP4 file and photos as JPG, both of which open normally on any device.",
  },
  {
    q: "What if the Pin just links to an outside website?",
    a: "If the media itself is hosted elsewhere and Pinterest only shows a linked preview, SaveFromPro can't fetch it — you'd need to visit the original site directly.",
  },
  {
    q: "Can I choose a lower resolution?",
    a: "Whenever more than one resolution is available for a video Pin, SaveFromPro lists each option so you can pick a smaller file if you prefer.",
  },
  {
    q: "Does this work for Pins repinned from another board?",
    a: "Yes — a repin still points to the same underlying image or video file, so its link resolves the same way as the original Pin.",
  },
  {
    q: "Is there a limit to how many Pins I can save?",
    a: "There's no hard cap for personal use, but pasting and checking one link at a time keeps results accurate before saving.",
  },
  {
    q: "Can I download a Pin created by a business account?",
    a: "Yes — business and personal Pinterest accounts work exactly the same way as far as saving a public Pin is concerned.",
  },
  {
    q: "Does this work for a Pin saved from a search results page?",
    a: "Open the specific Pin from the search results first, then copy its own link rather than the search page's address.",
  },
];

export default function PinterestPlatformView({
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
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-500/15 via-transparent to-transparent dark:from-rose-500/10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 mb-6">
            <Pin className="w-3.5 h-3.5 rotate-45" />
            <span>Works with pinterest.com/pin/ links and pin.it short links.</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Pinterest Video &amp; Pin Downloader
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6">
            Save Pinterest video Pins and Idea Pins in their original quality, straight from the Pin&apos;s link, without needing a Pinterest account, browser extension, or any extra software.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 mb-8">
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-500 font-bold">✓</span> Video &amp; Idea Pins
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-500 font-bold">✓</span> No login required
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-500 font-bold">✓</span> Standard MP4/JPG files
            </span>
          </div>

          {/* Download Input Box */}
          <div className="max-w-2xl mx-auto">
            <DownloadInput
              onDownload={handleDownload}
              isLoading={isLoading}
              platform={platform}
              buttonText="Fetch Pin"
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
              What SaveFromPro can save from Pinterest
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Pinterest mixes photo and video Pins into the same feed, so the tool checks the link to see which type it&apos;s dealing with.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FORMATS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl p-6 bg-slate-50 dark:bg-gray-850/50 border border-slate-200 dark:border-gray-800 hover:border-rose-300 dark:hover:border-rose-700/60 transition-all group"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white mb-5 shadow-md shadow-rose-500/10 group-hover:scale-105 transition-transform`}
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
              How to copy a Pinterest Pin link
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
                    <span className="text-3xl font-black text-rose-600/30 dark:text-rose-400/30">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
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
            SaveFromPro provides a specialized video downloader designed for Pinterest Video Pins, Idea Pins, and animated motion pins. Pinterest has evolved from a static image bookmarking board into a vibrant video discovery platform for DIY tutorials, recipe guides, fashion lookbooks, and design inspiration. Our web utility parses public Pinterest pin links, delivering clean 1080p MP4 video files directly to your device.
          </p>
          <p>
            Designers, craft enthusiasts, recipe collectors, and video creators use SaveFromPro to archive public Pinterest video tutorials for offline reference. Save video guides locally so you can follow cooking instructions or DIY steps without relying on an active internet connection.
          </p>
          <p>
            We operate under a strict commitment to copyright ethics. SaveFromPro parses only publicly accessible pin links. Downloading Pinterest videos does not grant ownership; saved media must be used for personal offline reference, mood board creation, or educational study in accordance with copyright law.
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
                    Public Pinterest media endpoints
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
                    Secret or non-hosted links
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
              only save Pins you created, have permission to reuse, or are keeping from a public Pin for personal, offline viewing. If you reuse a saved image or video elsewhere, credit the original creator or source linked on the Pin.
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Technical / Feature Overview Cards */}
      <section className="py-12 md:py-16 border-t border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Card 1: Pinterest as a visual bookmarking tool */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-gray-850 border border-slate-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <Bookmark className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Pinterest as a visual bookmarking tool
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Pinterest was built around the idea of collecting inspiration onto boards rather than broadcasting to followers, which is part of why its Pins behave a little differently from a typical social feed post. Some Pins host their own photo or video directly on Pinterest&apos;s servers, while others are essentially bookmarks pointing back to an image or article hosted somewhere else entirely. Knowing which kind you&apos;re dealing with explains why some links save instantly and others simply don&apos;t resolve — only Pins hosting their own media can be fetched through a downloader.
            </p>
          </div>

          {/* Card 2: Idea Pins as short-form video */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-gray-850 border border-slate-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <Sparkle className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Idea Pins as short-form video
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Idea Pins brought a more TikTok-like, full-screen video format to Pinterest, letting creators build a multi-page story out of several video or photo slides. Because each page is technically its own piece of media, saving an entire Idea Pin usually means saving each slide individually rather than getting one combined file.
            </p>
          </div>

          {/* Card 3: Works on any device */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-gray-850 border border-slate-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <Monitor className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Works on any device
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              SaveFromPro runs in your browser, so a Pinterest link works the same way whether you&apos;re on a phone, tablet or desktop computer, with no app to install and nothing to keep updated. Paste the link, wait a moment for the file to be prepared, and save it wherever your device keeps downloads.
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
            {PINTEREST_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-850 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                  >
                    <span className="text-sm sm:text-base">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 flex-shrink-0 text-slate-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-rose-600 dark:text-rose-400" : ""
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
