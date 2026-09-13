import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PLATFORMS } from '@/lib/constants';
import PlatformCard from './PlatformCard';

export default function PlatformGrid() {
  return (
    <section id="platforms" className="py-20 bg-slate-50 dark:bg-gray-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">
            Supported Platforms
          </h2>
          <p className="text-slate-600 dark:text-gray-400 text-lg max-w-2xl mx-auto transition-colors">
            Download videos, reels, stories, and more from all your favorite platforms.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {PLATFORMS.map((platform) => (
            <PlatformCard key={platform.slug} platform={platform} />
          ))}
        </div>

        {/* View All Platforms CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/platforms"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:border-violet-500/50 hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-all text-sm font-medium shadow-sm hover:shadow-md"
          >
            <span>Browse All Platforms &amp; Details</span>
            <ArrowRight className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          </Link>
        </div>
      </div>
    </section>
  );
}
