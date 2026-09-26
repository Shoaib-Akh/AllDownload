import Link from "next/link";
import {
  FileText,
  Calendar,
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Scale,
  Building,
  Mail,
} from "lucide-react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata = {
  title: "Terms of Use | SaveFromPro",
  description:
    "Read the Terms of Use for SaveFromPro. Understand your rights, permitted use, copyright responsibilities, and legal disclaimers.",
  alternates: {
    canonical: `${SITE_URL}/terms`,
  },
};

export default function TermsPage() {
  return (
    <div className="py-16 sm:py-20 relative overflow-hidden transition-colors duration-200">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-violet-500/10 via-fuchsia-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Document Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-semibold uppercase tracking-wider mb-4 transition-colors">
            <FileText className="w-3.5 h-3.5" />
            <span>SAVEFROMPRO · LEGAL</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4 transition-colors">
            Terms of <span className="gradient-text">Use</span>
          </h1>

          <div className="inline-flex items-center gap-2 text-slate-500 dark:text-gray-400 text-sm font-medium">
            <Calendar className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <span>Last updated: Sep 15, 2026</span>
          </div>
        </div>

        {/* Intro Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm backdrop-blur-xl mb-10 space-y-4 text-slate-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
          <p>
            Welcome to SaveFromPro. These Terms of Use (&quot;Terms&quot;) govern your access to and use of the website located at{" "}
            <a
              href="https://savefrompro.com"
              className="text-violet-600 dark:text-violet-400 underline underline-offset-2 hover:text-violet-500"
            >
              https://savefrompro.com
            </a>{" "}
            (the &quot;Service&quot;), operated by SaveFromPro (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;).
          </p>
          <p>
            By accessing or using SaveFromPro, you confirm that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, please stop using our Service immediately.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-slate-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
          {/* Section 1 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800/60 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-600/20 text-violet-700 dark:text-violet-300 flex items-center justify-center text-sm font-mono font-bold">
                1
              </span>
              Description of Service
            </h2>
            <div className="space-y-3">
              <p>
                SaveFromPro is a free, browser-based tool that allows users to download publicly available videos and audio from supported social media platforms including Facebook, Instagram, TikTok, Twitter/X, Snapchat, and Twitch.
              </p>
              <p>
                SaveFromPro does not operate a public media-hosting library. The Service processes submitted public URLs and may create temporary files while preparing a requested download; those files are removed after processing.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800/60 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-600/20 text-violet-700 dark:text-violet-300 flex items-center justify-center text-sm font-mono font-bold">
                2
              </span>
              Eligibility
            </h2>
            <p className="mb-3">By using SaveFromPro, you confirm that:</p>
            <ul className="space-y-2.5 pl-2">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>You are at least 13 years of age. If you are under 18, you confirm that you have parental or guardian permission to use this Service.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>You have the legal capacity to agree to these Terms in your jurisdiction.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>Your use of the Service does not violate any applicable law or regulation.</span>
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800/60 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-600/20 text-violet-700 dark:text-violet-300 flex items-center justify-center text-sm font-mono font-bold">
                3
              </span>
              Permitted Use
            </h2>
            <p className="mb-3">SaveFromPro is intended for personal, non-commercial use only. You may use our Service to:</p>
            <ul className="space-y-2.5 pl-2">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>Download publicly available video and audio content for your own personal, offline viewing.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>Save content that you own or have explicit permission from the copyright holder to download.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>Extract audio from publicly available videos for personal listening purposes.</span>
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800/60 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-600/20 text-rose-700 dark:text-rose-300 flex items-center justify-center text-sm font-mono font-bold">
                4
              </span>
              Prohibited Use
            </h2>
            <p className="mb-3">You agree NOT to use SaveFromPro to:</p>
            <ul className="space-y-2.5 pl-2">
              <li className="flex items-start gap-2.5">
                <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>Download, reproduce, distribute, or publicly display copyrighted content without the explicit permission of the copyright holder.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>Re-upload downloaded content to other platforms and claim it as your own work.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>Use downloaded content for commercial purposes without proper licensing.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>Download any content that is private, restricted, or intended only for a specific audience.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>Attempt to gain unauthorized access to any account, server, or network connected to the Service.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>Use the Service for any unlawful purpose or in violation of any applicable local, national, or international law.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>Use automated tools, bots, or scrapers to access SaveFromPro in ways that place an unreasonable load on our servers or disrupt the Service.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>Circumvent, remove, alter, or bypass any security measures or access controls on our website.</span>
              </li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800/60 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-600/20 text-violet-700 dark:text-violet-300 flex items-center justify-center text-sm font-mono font-bold">
                5
              </span>
              Copyright and Intellectual Property
            </h2>
            <div className="space-y-4">
              <p>
                SaveFromPro respects the intellectual property rights of content creators and third parties. All video, audio, and other media content downloaded through our Service belongs to its respective creators and rights holders.
              </p>
              <p>By using SaveFromPro, you acknowledge that:</p>
              <ul className="space-y-2 pl-2">
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 font-bold">•</span>
                  <span>You are responsible for ensuring that your use of downloaded content complies with applicable copyright laws and the terms of service of the originating platform.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 font-bold">•</span>
                  <span>SaveFromPro is not responsible for copyright infringement committed by its users.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 font-bold">•</span>
                  <span>We do not encourage or endorse the unauthorized reproduction or distribution of copyrighted content.</span>
                </li>
              </ul>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700/60 space-y-2 mt-4">
                <p className="font-semibold text-slate-900 dark:text-white">
                  If you are a rights holder and believe content accessible through our Service infringes your copyright, please contact us with the following information:
                </p>
                <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-600 dark:text-gray-300">
                  <li>Your name and contact details</li>
                  <li>A description of the copyrighted work in question</li>
                  <li>The URL where the alleged infringement occurs</li>
                  <li>A statement confirming your good-faith belief that the use is unauthorized</li>
                </ol>
                <p className="text-xs text-slate-500 dark:text-gray-400 pt-1">
                  We will review your request and take appropriate action.
                </p>
              </div>
            </div>
          </div>

          {/* Section 6 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800/60 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-600/20 text-violet-700 dark:text-violet-300 flex items-center justify-center text-sm font-mono font-bold">
                6
              </span>
              Disclaimer of Warranties
            </h2>
            <div className="space-y-3">
              <p>
                SaveFromPro is provided on an &quot;as is&quot; and &quot;as available&quot; basis, without warranties of any kind — express or implied. We do not warrant that:
              </p>
              <ul className="space-y-2 pl-2">
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 font-bold">•</span>
                  <span>The Service will be available at all times or be free of errors or interruptions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 font-bold">•</span>
                  <span>Download results will always be successful, as third-party platforms may change their structure at any time.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 font-bold">•</span>
                  <span>The Service will meet your specific requirements or expectations.</span>
                </li>
              </ul>
              <p className="font-medium text-slate-900 dark:text-white">
                Your use of SaveFromPro is at your own risk.
              </p>
            </div>
          </div>

          {/* Section 7 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800/60 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-600/20 text-violet-700 dark:text-violet-300 flex items-center justify-center text-sm font-mono font-bold">
                7
              </span>
              Limitation of Liability
            </h2>
            <p className="mb-3">
              To the fullest extent permitted by applicable law, SaveFromPro and its operators shall not be liable for:
            </p>
            <ul className="space-y-2 pl-2">
              <li className="flex items-start gap-2">
                <span className="text-violet-500 font-bold">•</span>
                <span>Any indirect, incidental, special, or consequential damages arising from your use of or inability to use the Service.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-500 font-bold">•</span>
                <span>Loss of data, revenue, or profits resulting from use of the Service.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-500 font-bold">•</span>
                <span>Any damage caused by content downloaded through the Service.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-500 font-bold">•</span>
                <span>Any third-party claims arising from your misuse of downloaded content.</span>
              </li>
            </ul>
          </div>

          {/* Section 8 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800/60 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-600/20 text-violet-700 dark:text-violet-300 flex items-center justify-center text-sm font-mono font-bold">
                8
              </span>
              Third-Party Platforms
            </h2>
            <div className="space-y-3">
              <p>
                SaveFromPro operates independently and is not affiliated with, endorsed by, or sponsored by Facebook, Instagram, TikTok, Twitter/X, Snapchat, or Twitch. All trademarks and platform names belong to their respective owners.
              </p>
              <p>
                Use of those platforms is governed by their own terms of service, and users are responsible for complying with them. SaveFromPro is not responsible for any account restrictions or penalties imposed by third-party platforms as a result of downloading their content.
              </p>
            </div>
          </div>

          {/* Section 9 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800/60 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-600/20 text-violet-700 dark:text-violet-300 flex items-center justify-center text-sm font-mono font-bold">
                9
              </span>
              Advertising
            </h2>
            <p>
              SaveFromPro displays third-party advertisements through authorized ad networks. We are not responsible for the content of these advertisements. Clicking on advertisements is voluntary and subject to the advertiser&apos;s own terms and policies.
            </p>
          </div>

          {/* Section 10 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800/60 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-600/20 text-violet-700 dark:text-violet-300 flex items-center justify-center text-sm font-mono font-bold">
                10
              </span>
              Privacy
            </h2>
            <p>
              Your use of SaveFromPro is also governed by our{" "}
              <Link
                href="/privacy"
                className="text-violet-600 dark:text-violet-400 underline underline-offset-2 hover:text-violet-500"
              >
                Privacy Policy
              </Link>
              , which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our data practices.
            </p>
          </div>

          {/* Section 11 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800/60 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-600/20 text-violet-700 dark:text-violet-300 flex items-center justify-center text-sm font-mono font-bold">
                11
              </span>
              Modifications to Terms
            </h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be effective upon posting the revised Terms on this page with an updated &quot;Last Updated&quot; date. Your continued use of SaveFromPro after any modification constitutes your acceptance of the new Terms.
            </p>
          </div>

          {/* Section 12 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800/60 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-600/20 text-violet-700 dark:text-violet-300 flex items-center justify-center text-sm font-mono font-bold">
                12
              </span>
              Governing Law
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with applicable laws. Any disputes arising from these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the competent courts in the applicable jurisdiction.
            </p>
          </div>

          {/* Section 13 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800/60 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-600/20 text-violet-700 dark:text-violet-300 flex items-center justify-center text-sm font-mono font-bold">
                13
              </span>
              Contact Us
            </h2>
            <p>
              If you have questions about these Terms, please visit our{" "}
              <Link
                href="/contact"
                className="text-violet-600 dark:text-violet-400 underline underline-offset-2 hover:text-violet-500 font-medium"
              >
                Contact page
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-800 dark:text-gray-200 font-medium text-sm transition-colors"
          >
            <span>← Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
