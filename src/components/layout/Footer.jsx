import Link from 'next/link';
import { Download, Heart } from 'lucide-react';
import { PLATFORMS } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center">
                <Download className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                SaveFrom<span className="text-violet-400">Pro</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Free online video downloader. Download from 12+ platforms in HD quality.
            </p>
          </div>

          {/* Platforms */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Platforms</h3>
            <ul className="space-y-2">
              {PLATFORMS.slice(0, 6).map((p) => (
                <li key={p.slug}>
                  <Link href={`/${p.slug}`} className="text-gray-400 hover:text-violet-400 transition-colors text-sm">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Platforms */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">More Platforms</h3>
            <ul className="space-y-2">
              {PLATFORMS.slice(6).map((p) => (
                <li key={p.slug}>
                  <Link href={`/${p.slug}`} className="text-gray-400 hover:text-violet-400 transition-colors text-sm">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/how-it-works" className="text-gray-400 hover:text-violet-400 transition-colors text-sm">How It Works</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-violet-400 transition-colors text-sm">FAQ</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-violet-400 transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-violet-400 transition-colors text-sm">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/50 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} SaveFromPro. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for the internet
          </p>
        </div>
      </div>
    </footer>
  );
}
