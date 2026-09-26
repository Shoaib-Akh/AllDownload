import Link from 'next/link';
import { Download, Heart } from 'lucide-react';
import { PLATFORMS } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-slate-100/80 dark:bg-gray-950 border-t border-slate-200 dark:border-gray-800/50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-md shadow-violet-500/20">
                <Download className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white transition-colors">
                SaveFrom<span className="text-violet-600 dark:text-violet-400">Pro</span>
              </span>
            </Link>
            <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">
              Free online video downloader. Download from 12+ platforms in HD quality.
            </p>
          </div>

          {/* Platforms */}
          <div>
            <h3 className="text-slate-900 dark:text-white font-semibold mb-4 text-sm uppercase tracking-wider">Platforms</h3>
            <ul className="space-y-2">
              {PLATFORMS.slice(0, 6).map((p) => (
                <li key={p.slug}>
                  <Link href={`/${p.slug}`} className="text-slate-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors text-sm">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Platforms */}
          <div>
            <h3 className="text-slate-900 dark:text-white font-semibold mb-4 text-sm uppercase tracking-wider">More Platforms</h3>
            <ul className="space-y-2">
              {PLATFORMS.slice(6).map((p) => (
                <li key={p.slug}>
                  <Link href={`/${p.slug}`} className="text-slate-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors text-sm">
                    {p.name}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link href="/platforms" className="text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300 transition-colors text-sm font-medium">
                  All Platforms &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-slate-900 dark:text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/platforms" className="text-slate-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors text-sm">Supported Platforms</Link></li>
              <li><Link href="/how-it-works" className="text-slate-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors text-sm">How It Works</Link></li>
              <li><Link href="/blog" className="text-slate-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors text-sm">Blog</Link></li>
              <li><Link href="/privacy" className="text-slate-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors text-sm">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 dark:border-gray-800/50 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 dark:text-gray-500 text-sm">
            © {new Date().getFullYear()} SaveFromPro. All rights reserved.
          </p>
          <p className="text-slate-500 dark:text-gray-500 text-sm flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for the internet
          </p>
        </div>
      </div>
    </footer>
  );
}
