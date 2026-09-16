'use client';

import Link from 'next/link';
import { Home, LayoutGrid, BookOpen, Info, Shield, PlusCircle } from 'lucide-react';

export default function MobileMenu({ isOpen, onClose }) {
  if (!isOpen) return null;

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/platforms', label: 'Platforms', icon: LayoutGrid },
    { href: '/how-it-works', label: 'How It Works', icon: Info },
    { href: '/blog', label: 'Blog', icon: BookOpen },
    { href: '/blog/create', label: 'Write Blog (HTML/CSS)', icon: PlusCircle },
    { href: '/admin', label: 'Admin Dashboard', icon: Shield },
  ];

  return (
    <div className="md:hidden bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-b border-slate-200 dark:border-gray-800/50 transition-colors duration-200 shadow-xl">
      <div className="px-4 py-3 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800/50 transition-all text-sm font-medium"
          >
            <link.icon className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
