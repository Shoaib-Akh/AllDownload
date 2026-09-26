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
  Briefcase,
  Building2,
  Radio,
  Video,
  Monitor,
  Link2,
  TrendingUp,
} from "lucide-react";
import { LinkedInIcon } from "@/components/common/BrandIcons";
import DownloadInput from "@/components/download/DownloadInput";
import DownloadResult from "@/components/download/DownloadResult";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import RecentDownloads from "@/components/home/RecentDownloads";

const FORMATS = [
  {
    title: "Personal profile posts",
    description:
      "Videos shared by an individual's public profile, including recorded talks, career tips, and personal updates posted natively to the feed.",
    icon: Briefcase,
    gradient: "from-[#0A66C2] to-[#084e96]",
  },
  {
    title: "Company page posts",
    description:
      "Product demos, event recaps and announcement videos posted by a public company page.",
    icon: Building2,
    gradient: "from-[#084e96] to-[#004182]",
  },
  {
    title: "Native LinkedIn Live recordings",
    description:
      "Once a LinkedIn Live broadcast has ended and been saved as a normal post, it can be downloaded the same as any other video.",
    icon: Radio,
    gradient: "from-[#0077b5] to-[#0A66C2]",
  },
];

const STEPS = [
  {
    num: "01",
    boldTitle: "Open the post containing the video, on the LinkedIn app or linkedin.com.",
    text: "Copy the link.",
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
    boldTitle: "Save the file to your",
    text: "downloads folder or files app.",
    icon: FolderDown,
  },
];

const SUPPORTED_LIST = [
  "Public LinkedIn Feed Videos (linkedin.com/posts/)",
  "Company Page Video Posts",
  "Public Webinar & Event Clip Replays",
  "HD 1080p Progressive MP4 Output",
  "Professional Presentation MP3 Audio Extraction",
];

const NOT_SUPPORTED_LIST = [
  "Private LinkedIn Profiles",
  "Restricted Corporate Group Posts",
  "InMail Messages",
  "Paid Learning Courses (LinkedIn Learning)",
  "Account Login Endpoints",
];

const LINKEDIN_FAQS = [
  {
    q: "Can I download a video shared to Connections only?",
    a: "No. SaveFromPro can only resolve videos attached to posts set to public — the same visibility a logged-out visitor would see.",
  },
  {
    q: "Does this work for company page videos?",
    a: "Yes, as long as the company page and the specific post are public.",
  },
  {
    q: "Do I need a LinkedIn account to use this?",
    a: "No. SaveFromPro only reads the public link you paste in — it never asks for your LinkedIn login.",
  },
  {
    q: "Does this work for LinkedIn Live recordings?",
    a: "Yes, once the broadcast has ended and LinkedIn has saved it as a normal video post.",
  },
  {
    q: "What format do I get?",
    a: "Video downloads as a standard MP4 file, which plays on any modern phone or computer.",
  },
  {
    q: "Can I download a document-carousel post as video?",
    a: "No — document carousels are a slideshow format, separate from native video, and aren't supported by this tool.",
  },
  {
    q: "Will the downloaded video have LinkedIn's interface on it?",
    a: "No — SaveFromPro fetches the source video file directly, without the surrounding feed, reactions, or comments.",
  },
  {
    q: "Can I choose a lower resolution?",
    a: "Whenever more than one resolution is available, SaveFromPro lists each option so you can pick a smaller file if you prefer.",
  },
  {
    q: "What if the post just links to a YouTube video?",
    a: "SaveFromPro's LinkedIn page is built for native LinkedIn video; a linked-out video hosted elsewhere would need that platform's own downloader.",
  },
  {
    q: "Is there a limit to how many videos I can save?",
    a: "There's no hard cap for personal use, but pasting and checking one link at a time keeps results accurate before saving.",
  },
  {
    q: "Can I download a video from a LinkedIn newsletter post?",
    a: "Yes, as long as the newsletter edition is public and the video is a native upload rather than a link to an outside site.",
  },
  {
    q: "Does this work for videos posted by LinkedIn Groups?",
    a: "Only if the group's posts are publicly visible without requiring membership, since the same visibility rule that applies elsewhere on LinkedIn also applies to groups.",
  },
  {
    q: "Can I download a video from a LinkedIn event page?",
    a: "If the event page itself is public and includes a native video post, the same permalink approach applies as it would for a regular profile or company post.",
  },
];

export default function LinkedInPlatformView({
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
            <LinkedInIcon className="w-3.5 h-3.5" />
            <span>Works with linkedin.com/posts and /feed/update links from public posts.</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            LinkedIn Video Downloader
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6">
            Keep a copy of a public LinkedIn video post — a talk, a product demo, or a company update — in the original quality it was uploaded in, without an account, browser extension, or extra software of any kind.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 mb-8">
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-500 font-bold">✓</span> Public posts &amp; company pages
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
              What SaveFromPro can save from LinkedIn
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              LinkedIn video is mostly professional in nature, and SaveFromPro treats it the same way it would any public video post.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              How to copy a LinkedIn video post link
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
            SaveFromPro provides a specialized video downloader for public LinkedIn feed videos, company updates, webinar clips, and executive presentations. LinkedIn is the leading professional networking platform, hosting high-value industry keynotes, product announcements, educational tutorials, and career advice videos. Our engine parses public LinkedIn post links, delivering clean 1080p MP4 files directly to your web browser.
          </p>
          <p>
            Business professionals, educators, researchers, and job seekers use SaveFromPro to archive public LinkedIn video presentations for offline viewing. Study industry keynotes or review training clips during travel without relying on active internet connections.
          </p>
          <p>
            We operate under a strict commitment to copyright ethics and user privacy. SaveFromPro parses only publicly accessible web links. Downloading LinkedIn content does not grant commercial ownership; saved files are intended for personal offline reference, professional learning, and research in accordance with copyright law.
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
                    Public professional video endpoints
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
                    Gated or private corporate content
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
              only save videos you or your company posted, have permission to reuse, or are keeping from a public post for personal, offline viewing. If you reuse a saved video elsewhere, credit the original poster or company.
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Technical / Feature Overview Cards */}
      <section className="py-12 md:py-16 border-t border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Card 1: Why video matters on a professional network */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-gray-850 border border-slate-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Why video matters on a professional network
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              LinkedIn&apos;s feed has grown well beyond text updates and job postings, with video now a major part of how companies announce products, how executives share short talks, and how recruiters showcase company culture. That shift means a single well-performing video post can carry real business value, which is exactly why marketing teams and individual professionals often want a permanent, offline copy rather than relying on the post staying live and public indefinitely.
            </p>
          </div>

          {/* Card 2: Native uploads versus shared links */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-gray-850 border border-slate-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Link2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Native uploads versus shared links
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Because LinkedIn allows both native video uploads and posts that simply link out to a video hosted elsewhere, it&apos;s worth checking which kind you&apos;re dealing with before pasting a link here. A native upload plays directly inside the LinkedIn feed without redirecting anywhere, and that&apos;s the format SaveFromPro is built to fetch.
            </p>
          </div>

          {/* Card 3: Works on any device */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-gray-850 border border-slate-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Monitor className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Works on any device
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              SaveFromPro runs in your browser, so a LinkedIn link works the same way whether you&apos;re on a phone, tablet or desktop computer, with no app to install and nothing to keep updated. Paste the link, wait a moment for the file to be prepared, and save it wherever your device keeps downloads.
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
            {LINKEDIN_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-850 overflow-hidden transition-colors"
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
