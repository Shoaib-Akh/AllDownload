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
  FolderKanban,
  Link,
  Clapperboard,
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
    title: "Public uploads",
    description:
      "Standard videos uploaded to a creator's account and set to public, available at the resolutions the uploader chose to offer.",
    icon: Film,
    gradient: "from-[#1AB7EA] to-[#0092c8]",
  },
  {
    title: "Showcases",
    description:
      "Videos grouped into a public showcase or portfolio page can be saved individually using each video's own dedicated link, rather than the showcase overview.",
    icon: FolderKanban,
    gradient: "from-[#0092c8] to-[#00719c]",
  },
  {
    title: "Unlisted-but-shared links",
    description:
      "A video set to \"Anyone with the link\" can be resolved the same way as a fully public one, as long as no separate password has been set by the uploader.",
    icon: Link,
    gradient: "from-[#38cdf8] to-[#1AB7EA]",
  },
];

const STEPS = [
  {
    num: "01",
    boldTitle: "Open the video on vimeo.com.",
    text: "Copy the link",
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
  "Public Vimeo Videos (vimeo.com/ID)",
  "Vimeo Showcase & Channel Links",
  "Pristine 1080p & 4K Progressive MP4 Output",
  "High-Bitrate Uncompressed Audio Tracks",
  "Original Soundtrack MP3 Extraction",
];

const NOT_SUPPORTED_LIST = [
  "Password-Protected Vimeo Videos",
  "Domain-Restricted Embed-Only Videos",
  "Private On-Demand / Paid Media",
  "Deleted or Unlisted Media",
  "Account Login Endpoints",
];

const VIMEO_FAQS = [
  {
    q: "Can I download a password-protected Vimeo video?",
    a: "No. Password-protected videos are intentionally excluded, the same way they'd be inaccessible to anyone without the password.",
  },
  {
    q: "Does this work if the uploader disabled Vimeo's download button?",
    a: "Often yes — SaveFromPro fetches the public video file directly, independent of whether Vimeo's own optional download button is switched on.",
  },
  {
    q: "Do I need a Vimeo account to use this?",
    a: "No. SaveFromPro only reads the public link you paste in — it never asks for your Vimeo login.",
  },
  {
    q: "Can I save a video set to \"Anyone with the link\"?",
    a: "Yes, as long as no separate password is required to view it.",
  },
  {
    q: "What format do I get?",
    a: "Video downloads as a standard MP4 file, which plays on any modern phone or computer.",
  },
  {
    q: "Why does a video fail even though I can watch it in my browser?",
    a: "Some creators restrict playback to approved websites only. That setting blocks outside tools the same way it blocks viewing the video anywhere else.",
  },
  {
    q: "Can I choose a lower resolution to save space?",
    a: "Whenever more than one resolution is available, SaveFromPro lists each option so you can pick a smaller file if you prefer.",
  },
  {
    q: "Does this work for videos inside a showcase?",
    a: "Yes — open the individual video inside the showcase and copy that video's own link rather than the showcase's overview page.",
  },
  {
    q: "Can I download the highest bitrate version available?",
    a: "Yes — SaveFromPro lists every resolution the uploader provided, so you can pick the highest one for archiving purposes.",
  },
  {
    q: "Is there a limit to how many videos I can save?",
    a: "There's no hard cap for personal use, but pasting and checking one link at a time keeps results accurate before saving.",
  },
  {
    q: "Does this work for a video hosted by a business account?",
    a: "Yes, as long as the video itself is public or set to \"Anyone with the link\" without a password requirement.",
  },
  {
    q: "What if the video was uploaded years ago at a lower resolution?",
    a: "SaveFromPro can only offer whatever resolutions Vimeo actually stored for that upload — an older video simply may not have a higher-quality version available to fetch.",
  },
];

export default function VimeoPlatformView({
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
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/15 via-transparent to-transparent dark:from-cyan-500/10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 mb-6">
            <Video className="w-3.5 h-3.5" />
            <span>Works with public vimeo.com video links.</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Vimeo Video Downloader
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6">
            Download videos from public, non-password-protected Vimeo pages for offline viewing, at the quality the creator uploaded, without an account, browser extension, or extra software of any kind.
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
              What SaveFromPro can save from Vimeo
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Vimeo is popular with filmmakers and businesses precisely because it preserves higher video quality than most social platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FORMATS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl p-6 bg-slate-50 dark:bg-gray-850/50 border border-slate-200 dark:border-gray-800 hover:border-cyan-300 dark:hover:border-cyan-700/60 transition-all group"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white mb-5 shadow-md shadow-cyan-500/10 group-hover:scale-105 transition-transform`}
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
              How to copy a Vimeo video link
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
                    <span className="text-3xl font-black text-cyan-600/30 dark:text-cyan-400/30">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800/60 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
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
            SaveFromPro provides an advanced video downloader engineered for Vimeo&apos;s high-fidelity video ecosystem. Vimeo is the world&apos;s premier platform for indie filmmakers, videographers, animation studios, and creative agencies. Vimeo creators upload master video edits encoded at exceptionally high bitrates. SaveFromPro parses public Vimeo video manifests, delivering bit-exact 1080p and 4K MP4 video files directly to your web browser.
          </p>
          <p>
            Filmmakers, video editors, and film students use SaveFromPro to archive public short films, cinematography reels, and commercial showreels for offline study. Analyze framing, color grading, and sound design locally without buffering or compression drops.
          </p>
          <p>
            We operate under a strict commitment to copyright ethics. SaveFromPro parses only publicly accessible web links. Downloading Vimeo content does not grant commercial ownership; saved files are intended for personal offline reference, mood board creation, and educational study in accordance with copyright law.
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
                    Start download
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Supported Vimeo video sources
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
                    Restricted or gated uploads
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
              only save videos you created, have permission to reuse, or are keeping from a public upload for personal, offline viewing. Password-protected and private videos are intentionally not accessible through this tool, and shouldn&apos;t be worked around some other way either.
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Technical / Feature Overview Cards */}
      <section className="py-12 md:py-16 border-t border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Card 1: How Vimeo serves its videos */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-gray-850 border border-slate-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                How Vimeo serves its videos
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Vimeo typically prepares several versions of the same upload, ranging from a compact version suited to a slower connection up to the full-resolution master where the creator provided one. The player normally picks a version automatically based on your connection at the moment of playback, which is why the same video can look different across two visits. SaveFromPro lists every version Vimeo has actually prepared, so the choice of quality is yours rather than left to an automatic guess.
            </p>
          </div>

          {/* Card 2: Why filmmakers pick Vimeo */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-gray-850 border border-slate-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Clapperboard className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Why filmmakers pick Vimeo
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Vimeo built its reputation on preserving picture quality better than most social platforms, which is why independent filmmakers, agencies and businesses often host their best work there rather than on a feed-based app. That same emphasis on quality is worth keeping in mind when saving a copy — the highest available resolution will usually be a noticeably larger file than an equivalent clip from a more heavily compressed platform, so it&apos;s worth deciding in advance whether you need the archival-quality version or something smaller and easier to share.
            </p>
          </div>

          {/* Card 3: Works on any device */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-gray-850 border border-slate-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Monitor className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Works on any device
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              SaveFromPro runs in your browser, so a Vimeo link works the same way whether you&apos;re on a phone, tablet or desktop computer, with no app to install and nothing to keep updated. Paste the link, wait a moment for the file to be prepared, and save it wherever your device keeps downloads.
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
            {VIMEO_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-850 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    <span className="text-sm sm:text-base">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 flex-shrink-0 text-slate-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-cyan-600 dark:text-cyan-400" : ""
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
