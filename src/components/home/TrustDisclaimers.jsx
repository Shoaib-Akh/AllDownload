import { Shield, Lock, AlertCircle } from 'lucide-react';

export default function TrustDisclaimers() {
  return (
    <section className="py-16 bg-slate-50 dark:bg-gray-950 relative overflow-hidden border-t border-slate-200 dark:border-gray-800/40 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 3 Disclaimers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900/50 border border-slate-200 dark:border-gray-800/70 hover:border-slate-300 dark:hover:border-gray-700/80 transition-colors shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-600/10 border border-violet-200 dark:border-violet-500/20 flex items-center justify-center mb-4 text-violet-600 dark:text-violet-400">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-slate-900 dark:text-white font-bold text-base mb-2 transition-colors">
              Copyright &amp; Fair Use
            </h3>
            <p className="text-slate-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed transition-colors">
              Savefrompro is for personal use only. Respect creators’ copyrights. Never redistribute downloaded content without permission.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900/50 border border-slate-200 dark:border-gray-800/70 hover:border-slate-300 dark:hover:border-gray-700/80 transition-colors shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-600/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-slate-900 dark:text-white font-bold text-base mb-2 transition-colors">
              Privacy Commitment
            </h3>
            <p className="text-slate-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed transition-colors">
              We never collect, store, or sell your data. All requests are processed without retaining URLs, IPs, or files.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900/50 border border-slate-200 dark:border-gray-800/70 hover:border-slate-300 dark:hover:border-gray-700/80 transition-colors shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-600/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="text-slate-900 dark:text-white font-bold text-base mb-2 transition-colors">
              Platform Disclaimer
            </h3>
            <p className="text-slate-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed transition-colors">
              Savefrompro is not affiliated with any platform or Snapchat. All trademarks belong to their respective owners.
            </p>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-violet-100/60 via-slate-100/80 to-fuchsia-100/60 dark:from-violet-950/30 dark:via-gray-900/60 dark:to-fuchsia-950/30 border border-violet-200 dark:border-violet-500/20 text-center shadow-sm transition-colors">
          <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight transition-colors">
            Savefrompro
          </h4>
          <p className="text-slate-600 dark:text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed transition-colors">
            A free, browser-based way to save public videos and photos from your favourite social platforms for personal, offline use.
          </p>
        </div>
      </div>
    </section>
  );
}
