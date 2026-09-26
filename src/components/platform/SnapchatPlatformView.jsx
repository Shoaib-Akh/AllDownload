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
  Ghost,
  Film,
  History,
  UserCheck,
  Smartphone,
  Eye,
} from "lucide-react";
import DownloadInput from "@/components/download/DownloadInput";
import DownloadResult from "@/components/download/DownloadResult";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import RecentDownloads from "@/components/home/RecentDownloads";

const FORMATS = [
  {
    title: "Spotlight clips",
    description:
      "Short vertical videos submitted to Snapchat's public Spotlight feed, saved at the resolution they were uploaded in.",
    icon: Film,
    gradient: "from-[#FFFC00] to-[#e6e300]",
  },
  {
    title: "Shared Stories",
    description:
      "A Story link a friend or creator has sent outside the app — through a message, email, or another platform — can be opened and saved while it's still live.",
    icon: History,
    gradient: "from-[#e6e300] to-[#d4d100]",
  },
  {
    title: "Public profile Snap",
    description:
      "Public creator profiles that showcase Snaps on a shareable web page can have those individual clips saved the same way as a Spotlight link.",
    icon: UserCheck,
    gradient: "from-[#FFFC00] to-[#f5d000]",
  },
];

const STEPS = [
  {
    num: "01",
    boldTitle: "For a Spotlight clip:",
    text: "tap the Share icon on the clip, then choose Copy Link from the options shown.",
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
    boldTitle: "Save the file",
    text: "to your camera roll, downloads folder, or files app.",
    icon: FolderDown,
  },
];

const SUPPORTED_LIST = [
  "Public Snapchat Spotlight Clips (spotlight.snapchat.com)",
  "Public Creator Stories (/add/username)",
  "Public Discover Feed Videos",
  "Full HD 1080p Vertical MP4",
  "Original Sound Track Extraction",
];

const NOT_SUPPORTED_LIST = [
  "Private Snaps & Direct Chats",
  "Private Friend Stories",
  "Memories (Private Account Backup)",
  "Deleted Ephemeral Snaps",
  "Account Login Endpoints",
];

const SNAPCHAT_FAQS = [
  {
    q: "Can I download a private Snap sent to me directly?",
    a: "No. SaveFromPro only works with content that's been made public or actively shared as a link outside the app — it can't reach a private chat Snap.",
  },
  {
    q: "Does this work for Spotlight clips?",
    a: "Yes, as long as the clip is public on Spotlight and you've copied its share link.",
  },
  {
    q: "Will the sender know I saved their Story?",
    a: "SaveFromPro doesn't send any notification to Snapchat, but Snapchat's own in-app screenshot alerts are a separate feature that only apply within the app itself.",
  },
  {
    q: "Do I need a Snapchat account to use this?",
    a: "No. SaveFromPro only reads the public link you paste in — it never asks for your Snapchat login.",
  },
  {
    q: "What format do I get?",
    a: "Video saves as a standard MP4 file that plays on any phone or computer without extra software.",
  },
  {
    q: "Can I save a Story after it has expired?",
    a: "No. Once a shared Story's viewing window has passed, its link no longer points to a working file for anyone.",
  },
  {
    q: "Is this different from a screenshot?",
    a: "Yes — a saved file keeps full video and audio quality, while a screenshot only captures one still frame.",
  },
  {
    q: "Can I download from a Snapchat public profile page?",
    a: "Yes, if the creator has a public web profile showcasing their Snaps, individual clips there can be saved the same way as a Spotlight link.",
  },
  {
    q: "Is there a limit to how many clips I can save?",
    a: "There's no hard cap for personal use, but pasting and checking one link at a time keeps results accurate before saving.",
  },
  {
    q: "Can I download a Spotlight clip submitted by a friend?",
    a: "Yes, as long as the clip has actually been published to the public Spotlight feed rather than only shared privately in a chat.",
  },
];

export default function SnapchatPlatformView({
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFFC00]/10 via-yellow-500/5 to-transparent dark:from-[#FFFC00]/10 dark:via-yellow-950/5 dark:to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-yellow-400/10 via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
          {/* Platform Icon */}
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFFC00] to-[#e6e300] items-center justify-center mb-6 shadow-lg shadow-yellow-500/20">
            <Ghost className="w-8 h-8 text-black" />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight transition-colors">
            Snapchat Spotlight &amp; <span className="gradient-text">Story Downloader</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed transition-colors">
            Save public Spotlight clips and Stories that a creator or friend has shared outside the app, in the original quality they were posted in, without installing anything extra.
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
              Works with public Spotlight and shared Story links.
            </p>

            <div className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800 text-xs text-slate-700 dark:text-gray-300 shadow-sm backdrop-blur-sm">
              <span>✓ Spotlight &amp; Stories</span>
              <span className="text-slate-300 dark:text-gray-700">•</span>
              <span>✓ No login required</span>
              <span className="text-slate-300 dark:text-gray-700">•</span>
              <span>✓ Standard MP4 files</span>
            </div>
          </div>

          {/* Result / Error / Loading */}
          {isLoading && (
            <div className="mt-8">
              <LoadingSpinner text="Fetching Snapchat clip details..." />
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

      {/* What SaveFromPro can save from Snapchat */}
      <section className="py-16 sm:py-20 bg-slate-50 dark:bg-gray-950 relative overflow-hidden border-t border-slate-200 dark:border-gray-800/40 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
              What SaveFromPro can save from Snapchat
            </h2>
            <p className="text-slate-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
              Snapchat is built to be a closed, in-app experience, so only content a person has actively chosen to share outside it can be reached.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FORMATS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-7 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm hover:border-yellow-400 dark:hover:border-yellow-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-black mb-5 shadow-md`}
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

      {/* How to get a shareable Snapchat link */}
      <section className="py-16 sm:py-20 bg-white dark:bg-gray-900/40 border-t border-slate-200 dark:border-gray-800/40 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
              How to get a shareable Snapchat link
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
                      <div className="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-600/10 border border-yellow-200 dark:border-yellow-500/20 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
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

      {/* Privacy-conscious & Archival Cards */}
      <section className="py-16 bg-slate-50 dark:bg-gray-950 border-t border-slate-200 dark:border-gray-800/40 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="p-7 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm leading-relaxed text-slate-700 dark:text-gray-300 text-sm sm:text-base">
            SaveFromPro provides a privacy-conscious downloader built strictly for Snapchat&apos;s public web media features: Snapchat Spotlight and Public Creator Stories. Snapchat&apos;s platform is famous for ephemeral, privacy-first direct messaging. To protect user privacy, SaveFromPro strictly blocks any access to private snaps or personal chat media, operating only on public web URLs that Snapchat publishes openly on the internet.
          </div>

          <div className="p-7 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm leading-relaxed text-slate-700 dark:text-gray-300 text-sm sm:text-base">
            Snapchat Spotlight and Public Stories have become major hubs for viral short-form video creators. Digital marketers, video editors, and social media archivists use SaveFromPro to back up public Spotlight clips and archive public creator story broadcasts before they expire.
          </div>

          <div className="p-7 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm leading-relaxed text-slate-700 dark:text-gray-300 text-sm sm:text-base">
            Our platform operates with total transparency. Downloading public Snapchat Spotlight content does not grant commercial ownership rights; saved files are intended for personal offline reference, creator channel backups, and educational review in accordance with copyright law.
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
          <div className="mt-8 p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-orange-500/10 border border-yellow-300 dark:border-yellow-500/30 backdrop-blur-xl">
            <div className="flex items-start gap-3.5">
              <ShieldAlert className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-slate-700 dark:text-gray-200 text-sm sm:text-base leading-relaxed">
                <strong>A quick reminder:</strong> only save Snaps you created, have permission to reuse, or are keeping from a publicly shared link for personal, offline viewing. Recording or saving a private Snap without the sender&apos;s knowledge goes against the spirit of how Snapchat is meant to be used.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Deep-Dive / Editorial Section */}
      <section className="py-16 sm:py-20 bg-slate-50 dark:bg-gray-950 border-t border-slate-200 dark:border-gray-800/40 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="p-8 rounded-3xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Why Snapchat content is harder to find outside the app
            </h3>
            <p className="text-slate-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
              Snapchat was built around disappearing messages from the start, which shaped how the whole platform handles sharing. Most content is private by default and only visible to the people it was sent to, with a limited window before it&apos;s gone for good. Spotlight and public Story sharing are the deliberate exceptions — features Snapchat built specifically so a clip could travel beyond the app when the creator chose to allow it. SaveFromPro only works within that intentional exception, which is why private chat Snaps stay firmly out of reach.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Spotlight as a public stage
            </h3>
            <p className="text-slate-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
              Spotlight functions more like a public video feed than the rest of Snapchat, closer in spirit to a short-form video platform than to a private messaging feature. Clips submitted there are meant to be watched widely, which is why they&apos;re the most reliably downloadable type of Snapchat content through a tool like this one.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Works on any device
            </h3>
            <p className="text-slate-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
              SaveFromPro runs in your browser, so a Snapchat link works the same way whether you&apos;re on a phone, tablet or desktop computer, with no app to install and nothing to keep updated. Paste the link, wait a moment for the file to be prepared, and save it wherever your device keeps downloads.
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
            {SNAPCHAT_FAQS.map((faq, index) => {
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
                          ? "rotate-180 bg-yellow-100 text-yellow-700 dark:bg-yellow-600/20 dark:text-yellow-400"
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
