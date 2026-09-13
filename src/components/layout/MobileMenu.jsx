'use client';

import Link from 'next/link';
import { Home, LayoutGrid, HelpCircle, Info } from 'lucide-react';

export default function MobileMenu({ isOpen, onClose }) {
  if (!isOpen) return null;

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/#platforms', label: 'Platforms', icon: LayoutGrid },
    { href: '/how-it-works', label: 'How It Works', icon: Info },
    { href: '/faq', label: 'FAQ', icon: HelpCircle },
  ];

  return (
    <div className="md:hidden bg-gray-950/95 backdrop-blur-xl border-b border-gray-800/50">
      <div className="px-4 py-3 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all text-sm font-medium"
          >
            <link.icon className="w-4 h-4" />
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
