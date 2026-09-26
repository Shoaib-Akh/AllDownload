"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, MessageSquare, Send, CheckCircle2, Sparkles, Shield } from "lucide-react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-16 sm:py-20 relative overflow-hidden transition-colors duration-200">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-violet-500/10 via-fuchsia-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-semibold uppercase tracking-wider mb-4 transition-colors">
            <Mail className="w-3.5 h-3.5" />
            <span>SAVEFROMPRO · SUPPORT</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4 transition-colors">
            Contact <span className="gradient-text">Us</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-gray-300 leading-relaxed">
            Have questions about our service, Terms of Use, Privacy Policy, or need copyright assistance? Get in touch with us.
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 shadow-sm backdrop-blur-xl">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Thank You for Reaching Out
              </h2>
              <p className="text-slate-600 dark:text-gray-300 text-sm max-w-md mx-auto leading-relaxed">
                Your message has been received. Our team will review your inquiry and get back to you as soon as possible.
              </p>
              <div className="pt-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-semibold rounded-xl text-sm hover:bg-violet-500 transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-950/70 border border-slate-200 dark:border-gray-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-950/70 border border-slate-200 dark:border-gray-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Terms inquiry, Privacy question, Feedback"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-950/70 border border-slate-200 dark:border-gray-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your inquiry in detail..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-950/70 border border-slate-200 dark:border-gray-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold rounded-xl transition-all shadow-md shadow-violet-500/20 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Send Message</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
