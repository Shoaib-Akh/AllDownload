import Link from 'next/link';
import {
  BookOpen,
  ArrowRight,
  Download,
  Music2,
  Smartphone,
  ShieldCheck,
  Compass,
} from 'lucide-react';

const guides = [
  {
    title: 'How to download',
    href: '/how-it-works',
    icon: Download,
  },
  {
    title: 'Convert to MP3',
    href: '/blog/extract-high-quality-mp3-audio-online',
    icon: Music2,
  },
  {
    title: 'iPhone guide',
    href: '/blog/download-instagram-reels-stories-safely',
    icon: Smartphone,
  },
  {
    title: 'Android guide',
    href: '/blog/save-tiktok-videos-without-watermark',
    icon: Smartphone,
  },
  {
    title: 'Is it legal?',
    href: '/blog/why-savefrompro-is-safest-downloader',
    icon: ShieldCheck,
  },
  {
    title: 'All guides & tips',
    href: '/blog',
    icon: Compass,
  },
];

export default function DownloadGuides() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-gray-950 relative overflow-hidden border-t border-slate-200 dark:border-gray-800/40 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-semibold uppercase tracking-wider mb-4 transition-colors">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guides &amp; Resources</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight transition-colors">
            Savefrompro Download Guides for Every Device
          </h2>

          <p className="text-slate-600 dark:text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed transition-colors">
            Step-by-step guides for every platform — all free.
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
          {guides.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group flex flex-col sm:flex-row items-center sm:items-center justify-between p-5 rounded-2xl bg-white dark:bg-gray-900/60 backdrop-blur-xl border border-slate-200 dark:border-gray-800/80 hover:border-violet-400 dark:hover:border-violet-500/40 hover:bg-slate-50 dark:hover:bg-gray-900/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-950/10 dark:hover:shadow-violet-950/20 text-center sm:text-left gap-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-600/10 border border-violet-200 dark:border-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-slate-900 dark:text-white font-semibold text-sm group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                    {item.title}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-violet-600 dark:text-gray-500 dark:group-hover:text-violet-400 transition-transform group-hover:translate-x-1 hidden sm:block" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
