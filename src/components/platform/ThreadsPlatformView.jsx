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
  AtSign,
  Video,
  Image,
  MessageCircle,
  Sparkle,
  Monitor,
  Repeat,
} from "lucide-react";
import DownloadInput from "@/components/download/DownloadInput";
import DownloadResult from "@/components/download/DownloadResult";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import RecentDownloads from "@/components/home/RecentDownloads";

const FORMATS = [
  {
    title: "Video posts",
    description:
      "Clips attached to a public Threads post, saved at the resolution the account uploaded.",
    icon: Video,
    gradient: "from-zinc-900 to-black dark:from-zinc-800 dark:to-zinc-950",
  },
  {
    title: "Photo posts",
    description:
      "Single or multi-photo posts can be saved image by image, in their original resolution.",
    icon: Image,
    gradient: "from-zinc-800 to-zinc-900 dark:from-zinc-700 dark:to-zinc-900",
  },
  {
    title: "Replies and quote posts",
    description:
      "Media attached to a reply within a thread, or to a quote post, resolves the same way as a standalone post, as long as it's public.",
    icon: MessageCircle,
    gradient: "from-neutral-700 to-neutral-900 dark:from-neutral-800 dark:to-neutral-950",
  },
];

const STEPS = [
  {
    num: "01",
    boldTitle: "On the Threads app:",
    text: "tap the paper-plane share icon under the post, then choose Copy Link.",
    icon: Share2,
  },
  {
    num: "02",
    boldTitle: "Paste it above and press Fetch Post.",
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
  "Public Threads Posts (threads.net/@user/post/)",
  "Multi-Video Attachments in Threads",
  "Full HD 1080p Progressive MP4",
  "Original Background Music MP3 Extraction",
  "Cross-Platform Browser Compatibility",
];

const NOT_SUPPORTED_LIST = [
  "Private Threads Accounts",
  "Direct Messages",
  "Deleted or Restricted Threads",
  "Account Login Endpoints",
];

const THREADS_FAQS = [
  {
    q: "Can I download from a private Threads profile?",
    a: "No. Threads follows the same visibility rules as the linked Instagram account — if the profile is private, its posts aren't publicly reachable.",
  },
  {
    q: "Does this work for multi-photo posts?",
    a: "Yes. Paste the post's link and each photo is offered as a separate file to save.",
  },
  {
    q: "Can I save a video from a reply, not just the main post?",
    a: "Yes, as long as the reply is public — open it individually so the link points to that specific reply before copying it.",
  },
  {
    q: "Do I need a Threads account to use this?",
    a: "No. SaveFromPro only reads the public link you paste in — it never asks for your Threads login.",
  },
  {
    q: "Will my download have a watermark on it?",
    a: "SaveFromPro doesn't add a watermark of its own. The file you get is the same one Threads serves when the post plays in the app.",
  },
  {
    q: "What format do I get?",
    a: "Video saves as a standard MP4 file and photos as JPG, both of which open normally on any device.",
  },
  {
    q: "Does this work for quote posts?",
    a: "Yes, as long as you copy the link to the post that actually has the media attached, rather than the post quoting it.",
  },
  {
    q: "Is Threads content the same as Instagram content?",
    a: "They're separate apps with separate posts, though they share the same underlying account system — a video posted only to Threads won't appear on Instagram, and vice versa.",
  },
  {
    q: "Can I download a video from a Threads profile grid?",
    a: "Open the specific post from the grid first, then copy that post's own link rather than the profile page itself.",
  },
  {
    q: "Is there a limit to how many posts I can save?",
    a: "There's no hard cap for personal use, but pasting and checking one link at a time keeps results accurate before saving.",
  },
  {
    q: "Does this work for Threads posts shared from another app?",
    a: "Yes — a Threads link forwarded through a messaging app still points to the same public post, so it works the same way when pasted here.",
  },
  {
    q: "Can I save a video posted by a verified public figure's account?",
    a: "Yes, as long as the account is public — verification badges don't change how the tool resolves the underlying post.",
  },
];

export default function ThreadsPlatformView({
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
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-500/15 via-transparent to-transparent dark:from-zinc-500/10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 mb-6">
            <AtSign className="w-3.5 h-3.5" />
            <span>Works with threads.net post links from public profiles.</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Threads Video &amp; Photo Downloader
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6">
            Save videos and photos posted publicly on Threads, Meta&apos;s text-and-media app, in the original quality they were shared in.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 mb-8">
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-500 font-bold">✓</span> Video &amp; photo posts
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-500 font-bold">✓</span> No login required
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-500 font-bold">✓</span> No watermark added
            </span>
          </div>

          {/* Download Input Box */}
          <div className="max-w-2xl mx-auto">
            <DownloadInput
              onDownload={handleDownload}
              isLoading={isLoading}
              platform={platform}
              buttonText="Fetch Post"
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
              What SaveFromPro can save from Threads
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Threads shares Instagram&apos;s underlying media infrastructure, so the kinds of posts it supports will feel familiar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FORMATS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl p-6 bg-slate-50 dark:bg-gray-850/50 border border-slate-200 dark:border-gray-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all group"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white mb-5 shadow-md shadow-zinc-900/10 group-hover:scale-105 transition-transform`}
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
              How to copy a Threads post link
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
                    <span className="text-3xl font-black text-zinc-600/30 dark:text-zinc-400/30">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-800 dark:text-zinc-200">
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
            SaveFromPro provides a specialized public link downloader for Meta&apos;s Threads platform. Threads has rapidly grown into a major text and video social network where creators, journalists, and public figures share short-form videos and commentary. Our engine parses public Threads web endpoints (threads.net), delivering clean 1080p MP4 video files directly to your web browser.
          </p>
          <p>
            Social media managers, journalists, and video creators use SaveFromPro to archive public Threads clips, news commentary, and viral video posts. Save high-definition video archives locally to prevent losing media if a post is edited or deleted.
          </p>
          <p>
            We operate under a strict commitment to copyright ethics and user privacy. SaveFromPro parses only publicly accessible web links. Downloading Threads content does not grant commercial ownership; saved files are intended for personal offline reference, news archiving, and educational study in accordance with copyright law.
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
                    Public Threads media endpoints
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
                    Private or restricted content
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
              only save posts you created, have permission to reuse, or are keeping from a public profile for personal, offline viewing. If you repost a saved video or photo elsewhere, credit the original account.
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Technical / Feature Overview Cards */}
      <section className="py-12 md:py-16 border-t border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Card 1: Threads and its relationship to Instagram */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-gray-850 border border-slate-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-800 dark:text-zinc-200">
                <Repeat className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Threads and its relationship to Instagram
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Threads launched as a text-first companion to Instagram, built on the same underlying account system and much of the same media infrastructure. That shared foundation is why a Threads video looks and plays similarly to an Instagram Reel, and why the same general approach to fetching and saving public content applies to both. The two apps are still separate feeds with separate posts, though, so a video shared only on Threads won&apos;t automatically show up if you check the same account&apos;s Instagram profile.
            </p>
          </div>

          {/* Card 2: A faster-moving, conversation-first feed */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-gray-850 border border-slate-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-800 dark:text-zinc-200">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                A faster-moving, conversation-first feed
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Threads leans more heavily on replies and ongoing conversation than a typical photo-and-video feed, which means useful video content is often buried a few replies deep rather than sitting on a main post. Opening the specific reply you want and copying its own link, rather than the top of the thread, is usually the difference between a link that resolves and one that doesn&apos;t.
            </p>
          </div>

          {/* Card 3: Works on any device */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-gray-850 border border-slate-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-800 dark:text-zinc-200">
                <Monitor className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Works on any device
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              SaveFromPro runs in your browser, so a Threads link works the same way whether you&apos;re on a phone, tablet or desktop computer, with no app to install and nothing to keep updated. Paste the link, wait a moment for the file to be prepared, and save it wherever your device keeps downloads.
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
            {THREADS_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-850 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                  >
                    <span className="text-sm sm:text-base">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 flex-shrink-0 text-slate-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-zinc-800 dark:text-zinc-200" : ""
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
