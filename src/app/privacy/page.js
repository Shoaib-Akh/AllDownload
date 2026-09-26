import Link from "next/link";
import {
  Shield,
  Calendar,
  Lock,
  Eye,
  Cookie,
  Server,
  Users,
  Baby,
  Scale,
  ExternalLink,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata = {
  title: "Privacy Policy | SaveFromPro",
  description:
    "Learn how SaveFromPro collects, uses, and safeguards your data. We do not store personal videos or sell your personal information.",
  alternates: {
    canonical: `${SITE_URL}/privacy`,
  },
  openGraph: {
    title: "Privacy Policy | SaveFromPro",
    description:
      "Learn how SaveFromPro collects, uses, and safeguards your data. We do not store personal videos or sell your personal information.",
    url: `${SITE_URL}/privacy`,
    siteName: SITE_NAME,
  },
};

export default function PrivacyPage() {
  return (
    <div className="py-16 sm:py-20 relative overflow-hidden transition-colors duration-200">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-violet-500/10 via-fuchsia-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Document Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-semibold uppercase tracking-wider mb-4 transition-colors">
            <Lock className="w-3.5 h-3.5" />
            <span>SAVEFROMPRO · PRIVACY</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4 transition-colors">
            Privacy <span className="gradient-text">Policy</span>
          </h1>

          <div className="inline-flex items-center gap-2 text-slate-500 dark:text-gray-400 text-sm font-medium">
            <Calendar className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <span>Last updated: Sep 15, 2026</span>
          </div>
        </div>

        {/* Intro Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm backdrop-blur-xl mb-10 space-y-4 text-slate-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
          <p>
            Welcome to SaveFromPro (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). This Privacy Policy explains how we collect, use, disclose, and protect information when you visit and use our website at{" "}
            <a
              href="https://savefrompro.com"
              className="text-violet-600 dark:text-violet-400 underline underline-offset-2 hover:text-violet-500"
            >
              https://savefrompro.com
            </a>{" "}
            (the &quot;Service&quot;).
          </p>
          <p>
            Please read this policy carefully. By using SaveFromPro, you agree to the data practices described in this Privacy Policy. If you do not agree, please discontinue use of our website.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-slate-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
          {/* Section 1 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800/60 shadow-sm space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-600/20 text-violet-700 dark:text-violet-300 flex items-center justify-center text-sm font-mono font-bold">
                1
              </span>
              Information We Collect
            </h2>

            {/* 1.1 */}
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                1.1 Information You Provide to Us
              </h3>
              <p>
                SaveFromPro does not require users to register, create an account, or submit personal information such as their name, email address, or social media credentials to use the core downloading functionality of our Service.
              </p>
              <p>
                If you contact us through our Contact page, we may receive your name and email address, which we use solely to respond to your inquiry.
              </p>
            </div>

            {/* 1.2 */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-gray-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                1.2 Information Collected Automatically
              </h3>
              <p>
                When you visit SaveFromPro, certain technical information may be collected automatically through standard web technologies. This may include:
              </p>
              <ul className="space-y-2 pl-2">
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 font-bold">•</span>
                  <span><strong>IP Address</strong> — Your internet protocol address, used for security monitoring and to detect abuse.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 font-bold">•</span>
                  <span><strong>Browser Type and Version</strong> — The browser and operating system you are using.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 font-bold">•</span>
                  <span><strong>Device Information</strong> — Whether you are on a mobile device or desktop computer.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 font-bold">•</span>
                  <span><strong>Pages Visited</strong> — Which pages or sections of our website you accessed.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 font-bold">•</span>
                  <span><strong>Referrer URL</strong> — The web address you came from before arriving at SaveFromPro.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 font-bold">•</span>
                  <span><strong>Date and Time of Visit</strong> — A timestamp of when your session occurred.</span>
                </li>
              </ul>
              <p>
                This information is collected through server logs and standard analytics tools. It is used to understand how our Service is being used and to improve its performance and reliability.
              </p>
            </div>

            {/* 1.3 */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-gray-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                1.3 Cookies and Similar Technologies
              </h3>
              <p>
                SaveFromPro may use cookies — small text files stored on your device — and similar tracking technologies. These are used for:
              </p>
              <ul className="space-y-2 pl-2">
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 font-bold">•</span>
                  <span><strong>Functionality</strong> — To remember your preferences and improve your experience.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 font-bold">•</span>
                  <span><strong>Analytics</strong> — To understand traffic patterns and page performance (for example, through Google Analytics).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 font-bold">•</span>
                  <span><strong>Advertising</strong> — We may display advertisements through third-party advertising services. These services may use cookies and pixels to show relevant ads based on your browsing activity.</span>
                </li>
              </ul>
              <p>
                You can control or disable cookies through your browser settings. Please note that disabling cookies may affect certain features of the website.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800/60 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-600/20 text-violet-700 dark:text-violet-300 flex items-center justify-center text-sm font-mono font-bold">
                2
              </span>
              How We Use Your Information
            </h2>
            <p className="mb-3">We use the information described above for the following purposes:</p>
            <ul className="space-y-2 pl-2">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>To provide, operate, and maintain the SaveFromPro video downloading service.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>To improve and optimize our website&apos;s performance and user experience.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>To monitor and analyze usage patterns and trends.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>To detect, investigate, and prevent fraudulent or unauthorized activity.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>To respond to your inquiries or support requests.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>To display relevant advertisements through third-party advertising platforms.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>To comply with applicable legal obligations.</span>
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800/60 shadow-sm space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-600/20 text-violet-700 dark:text-violet-300 flex items-center justify-center text-sm font-mono font-bold">
                3
              </span>
              Third-Party Services and Advertising
            </h2>

            {/* 3.1 */}
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                3.1 Third-Party Advertising Networks
              </h3>
              <p>
                SaveFromPro may display advertisements powered by third-party ad networks (such as Google AdSense or other ad platforms). These networks may use cookies, device identifiers, and similar technologies to measure ad effectiveness and display relevant advertisements.
              </p>
              <p>
                You may manage or opt out of personalized advertising preferences through your browser settings or aboutads.info.
              </p>
            </div>

            {/* 3.2 */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-gray-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                3.2 Google Analytics
              </h3>
              <p>
                We may use Google Analytics to collect anonymized data about how visitors interact with our website. This data helps us understand traffic sources, popular pages, and overall usage patterns. Google Analytics collects data such as session duration, pages per visit, and approximate geographic location. This data is anonymized and does not personally identify you. For more information, visit{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-600 dark:text-violet-400 underline underline-offset-2 hover:text-violet-500"
                >
                  https://policies.google.com/privacy
                </a>
                .
              </p>
            </div>

            {/* 3.3 */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-gray-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                3.3 Social Media Platforms
              </h3>
              <p>
                SaveFromPro sends submitted URLs to its download infrastructure and, where necessary, a processing provider solely to retrieve the requested public media. We do not ask for or access your social media account credentials. Temporary media files may be created during processing and are deleted after the request completes. We are not affiliated with the named social platforms.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800/60 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-600/20 text-violet-700 dark:text-violet-300 flex items-center justify-center text-sm font-mono font-bold">
                4
              </span>
              Data Retention
            </h2>
            <div className="space-y-3">
              <p>
                Submitted URLs are used to complete the requested download. The application does not add them to a public library or user profile. Hosting, security, and application providers may retain limited request logs for reliability, abuse prevention, and debugging according to their retention settings.
              </p>
              <p>
                Any contact form submissions are retained only as long as necessary to respond to your inquiry, after which they are deleted.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800/60 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-600/20 text-violet-700 dark:text-violet-300 flex items-center justify-center text-sm font-mono font-bold">
                5
              </span>
              Data Sharing and Disclosure
            </h2>
            <p className="mb-3">
              We do not sell, trade, or rent your personal information to third parties. We may share data only in the following circumstances:
            </p>
            <ul className="space-y-2.5 pl-2">
              <li className="flex items-start gap-2">
                <span className="text-violet-500 font-bold">•</span>
                <span><strong>Service Providers</strong> — We may share anonymized technical data with analytics or hosting providers who assist in operating our website. These providers are contractually obligated to protect your data.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-500 font-bold">•</span>
                <span><strong>Legal Requirements</strong> — We may disclose information if required to do so by law, court order, or government authority, or to protect the rights, safety, and property of SaveFromPro or its users.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-500 font-bold">•</span>
                <span><strong>Business Transfers</strong> — In the event of a merger, acquisition, or sale of assets, user data may be transferred as part of that transaction. You will be notified of any such change.</span>
              </li>
            </ul>
          </div>

          {/* Section 6 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800/60 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-600/20 text-violet-700 dark:text-violet-300 flex items-center justify-center text-sm font-mono font-bold">
                6
              </span>
              Children&apos;s Privacy
            </h2>
            <p>
              SaveFromPro is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has submitted personal information through our website, please contact us and we will take prompt steps to delete that information.
            </p>
          </div>

          {/* Section 7 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800/60 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-600/20 text-violet-700 dark:text-violet-300 flex items-center justify-center text-sm font-mono font-bold">
                7
              </span>
              Your Rights
            </h2>
            <p className="mb-3">
              Depending on your location, you may have certain rights regarding your personal data under applicable privacy laws (such as GDPR in the European Union or similar laws in other jurisdictions). These rights may include:
            </p>
            <ul className="space-y-2 pl-2">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>The right to access the personal data we hold about you.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>The right to request correction of inaccurate data.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>The right to request deletion of your personal data.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>The right to object to the processing of your data for direct marketing.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>The right to withdraw consent where processing is based on consent.</span>
              </li>
            </ul>
            <p className="mt-3">To exercise any of these rights, please contact us.</p>
          </div>

          {/* Section 8 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800/60 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-600/20 text-violet-700 dark:text-violet-300 flex items-center justify-center text-sm font-mono font-bold">
                8
              </span>
              Security
            </h2>
            <p>
              We take reasonable technical and organizational measures to protect the information we collect from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security of your data.
            </p>
          </div>

          {/* Section 9 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800/60 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-600/20 text-violet-700 dark:text-violet-300 flex items-center justify-center text-sm font-mono font-bold">
                9
              </span>
              Links to Other Websites
            </h2>
            <p>
              Our website may contain links to other websites that are not operated or controlled by SaveFromPro. We are not responsible for the privacy practices of those third-party websites. We encourage you to review the privacy policies of any website you visit.
            </p>
          </div>

          {/* Section 10 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800/60 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-600/20 text-violet-700 dark:text-violet-300 flex items-center justify-center text-sm font-mono font-bold">
                10
              </span>
              Changes to This Privacy Policy
            </h2>
            <div className="space-y-3">
              <p>
                We reserve the right to update or modify this Privacy Policy at any time. When we do, we will revise the &quot;Last Updated&quot; date at the top of this page. We encourage you to review this policy periodically to stay informed about how we protect your information.
              </p>
              <p>
                Your continued use of SaveFromPro after any changes to this policy constitutes your acceptance of the updated terms.
              </p>
            </div>
          </div>

          {/* Section 11 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800/60 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-600/20 text-violet-700 dark:text-violet-300 flex items-center justify-center text-sm font-mono font-bold">
                11
              </span>
              Contact Us
            </h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy, please reach out to us through our{" "}
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

        {/* Return to Home button */}
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
