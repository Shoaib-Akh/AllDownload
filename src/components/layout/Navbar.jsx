'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Download, Menu, X } from 'lucide-react';
import MobileMenu from './MobileMenu';
import ThemeToggle from '../common/ThemeToggle';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-gray-800/50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shadow-violet-500/20">
              <Download className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white transition-colors">
              SaveFrom<span className="text-violet-600 dark:text-violet-400">Pro</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-slate-600 hover:text-slate-900 dark:text-gray-300 dark:hover:text-white transition-colors text-sm font-medium">
              Home
            </Link>
            <Link href="/platforms" className="text-slate-600 hover:text-slate-900 dark:text-gray-300 dark:hover:text-white transition-colors text-sm font-medium">
              Platforms
            </Link>
            <Link href="/how-it-works" className="text-slate-600 hover:text-slate-900 dark:text-gray-300 dark:hover:text-white transition-colors text-sm font-medium">
              How It Works
            </Link>
            <Link href="/blog" className="text-slate-600 hover:text-slate-900 dark:text-gray-300 dark:hover:text-white transition-colors text-sm font-medium">
              Blog
            </Link>
            <ThemeToggle />
          </div>

          {/* Right Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 dark:text-gray-300 dark:hover:text-white transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-gray-800"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </nav>
  );
}
