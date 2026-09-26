'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, Menu, X } from 'lucide-react';
import MobileMenu from './MobileMenu';
import ThemeToggle from '../common/ThemeToggle';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(1);

  useEffect(() => {
    // Fetch live users
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        const json = await res.json();
        if (json.success && typeof json.activeNow === 'number') {
          setOnlineUsers(json.activeNow);
        }
      } catch (e) {
        // quiet fallback
      }
    };

    fetchUsers();
    const timer = setInterval(fetchUsers, 30000);
    return () => clearInterval(timer);
  }, []);

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
          <div className="hidden md:flex items-center gap-6">
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

            {/* Live Online Users Counter */}
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-medium"
              title="Active online users currently using SaveFromPro"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{onlineUsers} Online</span>
            </div>

            <ThemeToggle />
          </div>

          {/* Right Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium mr-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{onlineUsers}</span>
            </div>
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
