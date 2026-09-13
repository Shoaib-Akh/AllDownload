"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, X } from "lucide-react";
import Link from "next/link";

const CONSENT_KEY = "savefrompro_cookie_consent";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(CONSENT_KEY);
      if (!consent) {
        // Show after a brief delay for smoother UX
        const timer = setTimeout(() => setShow(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, "accepted");
    } catch {
      // ignore
    }
    setShow(false);
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem(CONSENT_KEY, "dismissed");
    } catch {
      // ignore
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-gray-950/95 border border-gray-800/90 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-2">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4 text-violet-400" />
        </div>
        <div className="flex-1 min-w-0 text-xs text-gray-300 leading-relaxed">
          <p>
            We use local storage and privacy-friendly cookies to enhance your download experience and remember your preferences. No personal information is sold.
          </p>
          <div className="flex items-center gap-3 mt-3">
            <button
              type="button"
              onClick={handleAccept}
              className="px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-colors"
            >
              Got it
            </button>
            <Link
              href="/faq"
              className="text-gray-400 hover:text-white underline transition-colors"
            >
              Learn more
            </Link>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="text-gray-500 hover:text-gray-300 p-1 -mr-1 -mt-1 transition-colors"
          aria-label="Dismiss cookie notice"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
