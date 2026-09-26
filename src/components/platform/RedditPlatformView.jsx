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
  Volume2,
  MessageSquare,
  Layers,
  Split,
  Users2,
  Monitor,
  Film,
} from "lucide-react";
import DownloadInput from "@/components/download/DownloadInput";
import DownloadResult from "@/components/download/DownloadResult";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import RecentDownloads from "@/components/home/RecentDownloads";

const STEPS = [
  {
    num: "01",
    boldTitle: "Open the post containing the video, on the Reddit app or reddit.com.",
    text: "Copy the link.",
    icon: Share2,
  },
  {
    num: "02",
    boldTitle: "Tap or click Share below the post.",
    text: "Paste the link into the box above and click Start download.",
    icon: Copy,
  },
  {
    num: "03",
    boldTitle: "Save the merged file to your camera roll,",
    text: "downloads folder, or files app.",
    icon: FolderDown,
  },
];

const SUPPORTED_LIST = [
  "Public Reddit Video Posts",
  "Direct v.redd.it Media URLs",
  "Automatic Video + Audio Stream Multiplexing",
  "HD 1080p & 720p MP4 Quality Tiers",
  "Standalone MP3 Audio Extraction",
];

const NOT_SUPPORTED_LIST = [
  "Private Subreddit Posts (Private / Quarantined)",
  "Deleted or Removed Reddit Posts",
  "Reddit Direct Messages",
  "External Third-Party Video Links (e.g. YouTube embeds)",
  "Account Login Endpoints",
];

const REDDIT_FAQS = [
  {
    q: "Why do Reddit videos I download elsewhere have no sound?",
    a: "Reddit's own v.redd.it player streams the video and audio as two separate files. A basic downloader that only grabs the video file misses the sound entirely, which is why SaveFromPro merges both.",
  },
  {
    q: "Can I download from a private subreddit?",
    a: "No. Content inside a private or restricted community isn't publicly reachable, so it can't be resolved by any outside tool.",
  },
  {
    q: "Does this work for crossposted videos?",
    a: "Yes — a crosspost still points to the same underlying video file, so its link resolves the same way as the original post.",
  },
  {
    q: "Do I need a Reddit account to use this?",
    a: "No. SaveFromPro only reads the public link you paste in — it never asks for your Reddit login.",
  },
  {
    q: "What format do I get?",
    a: "The merged video and audio download as a single standard MP4 file, which plays on any modern device.",
  },
  {
    q: "Can I paste a v.redd.it link directly instead of the post link?",
    a: "The post link is more reliable, since it gives SaveFromPro the context needed to locate the matching audio track.",
  },
  {
    q: "What if the original post genuinely has no sound?",
    a: "Then the saved file will be silent too — SaveFromPro can only merge an audio track that actually exists on Reddit's servers.",
  },
  {
    q: "Can I choose a lower resolution?",
    a: "Whenever more than one resolution is available, SaveFromPro lists each option so you can pick a smaller file if you prefer.",
  },
  {
    q: "Does this work for videos in NSFW-tagged posts?",
    a: "As long as the post is otherwise public and doesn't require joining a restricted community, the same fetch process applies.",
  },
  {
    q: "Is there a limit to how many videos I can save?",
    a: "There's no hard cap for personal use, but pasting and checking one link at a time keeps results accurate before saving.",
  },
  {
    q: "Can I save a video from a multi-reddit or curated feed?",
    a: "Open the specific post from the feed first, then copy that post's own link rather than the feed's overview page.",
  },
  {
    q: "Does the merged file keep the original video's frame rate?",
    a: "Yes — SaveFromPro combines the picture and sound tracks without re-encoding the video itself, so the frame rate and picture quality stay exactly as Reddit stored them.",
  },
];

export default function RedditPlatformView({
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
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/15 via-transparent to-transparent dark:from-orange-500/10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 mb-6">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Works with reddit.com post links and v.redd.it video links.</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Reddit Video Downloader — With Audio
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6">
            Reddit stores a post&apos;s video and audio as two separate files. SaveFromPro merges them back into one playable file, so you get sound along with the picture.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 mb-8">
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-500 font-bold">✓</span> Audio merged automatically
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
              buttonText="Start download"
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

      {/* How To Copy Steps */}
      <section className="py-12 md:py-16 border-t border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              How to copy a Reddit post&apos;s link
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="relative p-6 rounded-2xl bg-slate-50 dark:bg-gray-850/50 border border-slate-200 dark:border-gray-800 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black text-orange-600/30 dark:text-orange-400/30">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800/60 flex items-center justify-center text-orange-600 dark:text-orange-400">
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
      <section className="py-12 md:py-16 border-t border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          <p>
            SaveFromPro provides a specialized video downloader that solves the notorious &apos;Reddit no-audio&apos; issue. Reddit hosts native video files on its v.redd.it domain using Dynamic Adaptive Streaming over HTTP (DASH). Standard browser &apos;Save Video As&apos; features only download the visual video track, leaving the audio track behind. SaveFromPro automatically parses both the video and audio streams from Reddit&apos;s DASH manifest, merging them into a single, perfectly synchronized HD MP4 file.
          </p>
          <p>
            Meme creators, community archivists, and social researchers rely on SaveFromPro to save viral Reddit video clips, educational tutorials, and public discussions. Whether you are archiving content from r/videos, r/educationalgifs, or niche subreddits, SaveFromPro delivers complete MP4 files with crisp audio.
          </p>
          <p>
            We operate under a strict commitment to copyright ethics. SaveFromPro parses only publicly accessible subreddit links. Downloading Reddit video content does not grant commercial ownership; saved files are intended for personal offline viewing, research, and community archival in accordance with copyright law.
          </p>
        </div>
      </section>

      {/* Supported vs Not Supported */}
      <section className="py-12 md:py-16 border-t border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Supported Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-gray-850/50 border border-emerald-200 dark:border-emerald-900/40 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Start download
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Supported Reddit video sources
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
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-gray-850/50 border border-rose-200 dark:border-rose-900/40 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Not supported
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Restricted or external endpoints
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
              only save videos you posted yourself, have permission to reuse, or are keeping from a public post for personal, offline viewing. If you repost a saved clip elsewhere, credit the subreddit or user it came from.
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Technical / Feature Overview Cards */}
      <section className="py-12 md:py-16 border-t border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Card 1: Why v.redd.it splits video and audio */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-850 border border-slate-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <Split className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Why v.redd.it splits video and audio
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Reddit&apos;s native player streams video and audio as two separate tracks so it can adjust picture quality on the fly without interrupting the sound, similar to how many modern streaming services work behind the scenes. That&apos;s efficient for playback inside a busy comment thread, but it means the two tracks live at different addresses, which is exactly why a plain link to the raw video file only ever produces a silent clip. SaveFromPro identifies both tracks from the post link and combines them into a single file automatically.
            </p>
          </div>

          {/* Card 2: Reddit video across communities */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-850 border border-slate-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <Users2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Reddit video across communities
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Because nearly every subreddit allows native video uploads, the same fetch process applies whether the post comes from a large default community or a small, niche one — the only real requirement is that the subreddit itself is public and doesn&apos;t require special access to view.
            </p>
          </div>

          {/* Card 3: Works on any device */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-850 border border-slate-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <Monitor className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Works on any device
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              SaveFromPro runs in your browser, so a Reddit link works the same way whether you&apos;re on a phone, tablet or desktop computer, with no app to install and nothing to keep updated. Paste the link, wait a moment for the file to be prepared, and save it wherever your device keeps downloads.
            </p>
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
            {REDDIT_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-850 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    <span className="text-sm sm:text-base">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 flex-shrink-0 text-slate-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-orange-600 dark:text-orange-400" : ""
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
