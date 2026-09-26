"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Scale,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileCheck,
  ShieldAlert,
  Globe2,
  ChevronDown,
  ArrowRight,
  Sparkles,
  HelpCircle,
  BookOpen,
} from "lucide-react";

const REGION_DATA = [
  {
    region: "United States",
    personalUse: "Generally low enforcement risk; fair use may apply in limited cases",
    commercialUse: "Can trigger DMCA takedowns and copyright claims",
  },
  {
    region: "United Kingdom / EU",
    personalUse: "Generally low risk for private, non-commercial use",
    commercialUse: "Copyright and, in the EU, additional platform-liability rules can apply",
  },
  {
    region: "Canada",
    personalUse: "Similar to the US and UK; personal use is rarely pursued",
    commercialUse: "Commercial or re-distributed use falls under Canadian copyright law",
  },
  {
    region: "Australia",
    personalUse: "Generally low risk for private use",
    commercialUse: "Copyright Act protections apply to unauthorized redistribution",
  },
  {
    region: "Pakistan / India",
    personalUse: "Rarely enforced for personal downloads",
    commercialUse: "Copyright law still applies to commercial reuse; enforcement varies",
  },
];

const FAQS = [
  {
    q: "Can I get in trouble just for downloading a video for myself?",
    a: "For publicly shared content saved for personal, non-commercial use, real-world enforcement against individual downloaders is uncommon. Risk rises sharply if the content is later shared, re-uploaded, or monetized.",
  },
  {
    q: "Does it matter if the account is public or private?",
    a: "Yes. Downloading from a public account or public Story is very different from accessing friends-only or private content — the latter can raise both platform-policy and legal concerns.",
  },
  {
    q: "Is using a downloader tool itself illegal?",
    a: "Using a tool to save publicly available video is generally not illegal on its own in most countries. What you do with the downloaded file — personal use versus redistribution or commercial use — is what determines the legal risk.",
  },
  {
    q: "Can I use a downloaded clip in my own video if I give credit?",
    a: "Credit alone doesn't remove copyright protection. You generally still need permission from the rights holder to reuse their content, especially for anything monetized — crediting the source reduces reputational risk but not legal risk.",
  },
  {
    q: "What should I do if I'm not sure about a specific use case?",
    a: "For anything beyond personal, private viewing — especially commercial use or re-publishing — it's worth getting permission from the original creator or consulting a lawyer familiar with copyright law in your country.",
  },
];

export default function IsItLegalContent() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="py-16 sm:py-20 relative overflow-hidden transition-colors duration-200">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-violet-500/10 via-fuchsia-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-semibold uppercase tracking-wider mb-4 transition-colors">
            <Scale className="w-3.5 h-3.5" />
            <span>SAVEFROMPRO · LEGAL GUIDE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-5 leading-tight transition-colors">
            Is It Legal to <span className="gradient-text">Download Videos?</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed transition-colors mb-8">
            A plain-language look at where downloading social media videos stands legally — and where the real risk actually is.
          </p>

          {/* Not Legal Advice Banner */}
          <div className="max-w-3xl mx-auto p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-left backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-amber-900 dark:text-amber-200 text-xs sm:text-sm leading-relaxed">
                <strong>Not legal advice.</strong> This page explains general principles for informational purposes only. Laws vary by country and change over time — if you need advice for a specific situation, consult a qualified lawyer in your jurisdiction.
              </p>
            </div>
          </div>
        </div>

        {/* The Short Answer Card */}
        <div className="mb-14 p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-slate-50 dark:to-gray-900/60 border border-violet-200 dark:border-violet-500/30 shadow-sm backdrop-blur-xl">
          <div className="flex items-center gap-2 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4" />
            <span>Quick Summary</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
            The short answer
          </h2>
          <p className="text-slate-700 dark:text-gray-200 text-base sm:text-lg leading-relaxed">
            In most countries, downloading a video for personal, private, non-commercial use — like watching it offline later — is low-risk and rarely enforced. The legal exposure grows when the video is re-uploaded, re-published, monetized, or used commercially without the original creator&apos;s permission. The two issues that actually matter are copyright ownership and each platform&apos;s Terms of Service — and they&apos;re separate questions.
          </p>
        </div>

        {/* Copyright vs Terms of Service */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
              Copyright vs. Terms of Service
            </h2>
            <p className="text-slate-600 dark:text-gray-400 text-sm sm:text-base">
              These two are often confused, but they carry very different consequences:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Copyright Card */}
            <div className="p-7 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-600/10 border border-violet-200 dark:border-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-4 shadow-sm">
                  <Scale className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2.5">
                  Copyright Law
                </h3>
                <p className="text-slate-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                  Copyright law protects the creator&apos;s ownership of the video itself. Copying, redistributing, or profiting from someone else&apos;s video without permission can expose you to a copyright claim, regardless of which platform it came from.
                </p>
              </div>
            </div>

            {/* Terms of Service Card */}
            <div className="p-7 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-fuchsia-100 dark:bg-fuchsia-600/10 border border-fuchsia-200 dark:border-fuchsia-500/20 flex items-center justify-center text-fuchsia-600 dark:text-fuchsia-400 mb-4 shadow-sm">
                  <FileCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2.5">
                  Terms of Service
                </h3>
                <p className="text-slate-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                  Terms of Service are a private contract between you and the platform (Snapchat, Instagram, TikTok, etc.). Violating them can get your account restricted or banned, but on its own it&apos;s not usually a criminal matter — it&apos;s a platform-enforcement issue, not a courtroom one.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Risk vs Higher Risk Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* Lower Risk */}
          <div className="p-7 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/60 border border-emerald-500/30 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                What generally makes downloading lower-risk
              </h3>
            </div>
            <ul className="space-y-4 text-sm sm:text-base">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 mt-2" />
                <div>
                  <strong className="text-slate-900 dark:text-white block font-semibold mb-0.5">
                    The content is public.
                  </strong>
                  <span className="text-slate-600 dark:text-gray-300 leading-relaxed">
                    Spotlight videos, public Stories, and openly shared posts are meant to be viewed by anyone — downloading a copy for personal offline viewing carries far less exposure than accessing private or friends-only content.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 mt-2" />
                <div>
                  <strong className="text-slate-900 dark:text-white block font-semibold mb-0.5">
                    The use is personal.
                  </strong>
                  <span className="text-slate-600 dark:text-gray-300 leading-relaxed">
                    Saving a video to watch later, for reference, or for personal archiving is treated very differently from re-publishing it.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 mt-2" />
                <div>
                  <strong className="text-slate-900 dark:text-white block font-semibold mb-0.5">
                    Nothing is re-uploaded or monetized.
                  </strong>
                  <span className="text-slate-600 dark:text-gray-300 leading-relaxed">
                    The moment a downloaded video is posted elsewhere, used in a monetized video, or presented as your own, copyright risk increases sharply.
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Higher Risk */}
          <div className="p-7 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/60 border border-rose-500/30 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5 text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                What increases legal risk
              </h3>
            </div>
            <ul className="space-y-4 text-sm sm:text-base">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0 mt-2" />
                <div>
                  <strong className="text-slate-900 dark:text-white block font-semibold mb-0.5">
                    Re-uploading without credit or permission.
                  </strong>
                  <span className="text-slate-600 dark:text-gray-300 leading-relaxed">
                    Posting someone else&apos;s video on your own account or website is the most common source of copyright takedown notices.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0 mt-2" />
                <div>
                  <strong className="text-slate-900 dark:text-white block font-semibold mb-0.5">
                    Commercial use.
                  </strong>
                  <span className="text-slate-600 dark:text-gray-300 leading-relaxed">
                    Using a downloaded clip in an ad, product, or monetized content multiplies the exposure — this is where creators and rights holders take action most often.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0 mt-2" />
                <div>
                  <strong className="text-slate-900 dark:text-white block font-semibold mb-0.5">
                    Accessing private or friends-only content.
                  </strong>
                  <span className="text-slate-600 dark:text-gray-300 leading-relaxed">
                    Content that isn&apos;t publicly shared (private Stories, direct Snaps, DMs) isn&apos;t just a ToS issue — accessing it without authorization can raise separate legal concerns depending on the jurisdiction.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0 mt-2" />
                <div>
                  <strong className="text-slate-900 dark:text-white block font-semibold mb-0.5">
                    Circumventing DRM or paywalls.
                  </strong>
                  <span className="text-slate-600 dark:text-gray-300 leading-relaxed">
                    Downloading from behind a paywall or bypassing technical protection measures is treated more seriously in most countries than downloading freely public content.
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Region Overview Table */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Globe2 className="w-3.5 h-3.5" />
              <span>International Comparison</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              A rough by-region overview
            </h2>
          </div>

          <div className="rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-gray-800/80 bg-slate-100/80 dark:bg-gray-900/80">
                    <th className="py-4 px-6 font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                      Region
                    </th>
                    <th className="py-4 px-6 font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider text-xs">
                      Personal use of public content
                    </th>
                    <th className="py-4 px-6 font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider text-xs">
                      Re-upload / commercial use
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-gray-800/60">
                  {REGION_DATA.map((row, idx) => (
                    <tr
                      key={row.region}
                      className={idx % 2 === 0 ? "bg-transparent" : "bg-slate-50/40 dark:bg-gray-900/20"}
                    >
                      <td className="py-4 px-6 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {row.region}
                      </td>
                      <td className="py-4 px-6 text-slate-600 dark:text-gray-300 leading-relaxed">
                        {row.personalUse}
                      </td>
                      <td className="py-4 px-6 text-slate-600 dark:text-gray-300 leading-relaxed">
                        {row.commercialUse}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-gray-900/90 border-t border-slate-200 dark:border-gray-800/60 text-xs text-slate-500 dark:text-gray-400 italic">
              This table is a general orientation, not a legal ruling — copyright statutes, case law, and enforcement practices differ by country and can change.
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3.5">
            {FAQS.map((faq, index) => {
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
                        isOpen ? "rotate-180 bg-violet-100 text-violet-700 dark:bg-violet-600/20 dark:text-violet-400" : "text-slate-500 dark:text-gray-400"
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

        {/* Bottom CTA Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-center shadow-xl shadow-violet-500/20 relative overflow-hidden">
          <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">
            Start Downloading for Personal Use
          </h3>
          <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto mb-6">
            Save public videos cleanly and safely for offline personal viewing.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-2xl transition-all hover:shadow-lg active:scale-95 text-base"
          >
            <span>Go to Video Downloader</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
