import { ClipboardPaste, Search, Download, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "How It Works",
  description: "Learn how to download videos from any platform using SaveFromPro in 3 simple steps.",
};

const steps = [
  {
    step: 1,
    icon: ClipboardPaste,
    title: "Copy & Paste the URL",
    description:
      "Go to the platform (Facebook, Instagram, TikTok, etc.), find the video you want to download, and copy its URL. Then come to SaveFromPro and paste it in the input field.",
    color: "from-violet-600 to-violet-400",
  },
  {
    step: 2,
    icon: Search,
    title: "Fetch Video Info",
    description:
      "Click the Download button. Our system will automatically detect the platform, fetch the video details, and show you available quality options including HD, Full HD, and more.",
    color: "from-fuchsia-600 to-fuchsia-400",
  },
  {
    step: 3,
    icon: Download,
    title: "Download & Enjoy",
    description:
      "Select your preferred quality (HD, SD, or Audio only) and click Download. The file will be saved directly to your device. No signup, no watermark, completely free!",
    color: "from-pink-600 to-pink-400",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="py-20 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 transition-colors">
            How It <span className="gradient-text">Works</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors">
            Download videos from any supported platform in 3 simple steps. No software, no signup, no hassle.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8 mb-16">
          {steps.map((item) => (
            <div
              key={item.step}
              className="flex flex-col sm:flex-row gap-6 items-start bg-white dark:bg-gray-900/50 border border-slate-200 dark:border-gray-800/50 rounded-2xl p-8 hover:border-slate-300 dark:hover:border-gray-700/50 shadow-sm transition-all"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-violet-600 dark:text-violet-400 text-sm font-semibold mb-1">
                  Step {item.step}
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">
                  {item.title}
                </h2>
                <p className="text-slate-600 dark:text-gray-400 leading-relaxed transition-colors">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold rounded-2xl transition-all hover:shadow-lg hover:shadow-violet-500/25"
          >
            Start Downloading Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
