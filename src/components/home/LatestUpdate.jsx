import { Sparkles, Zap, CheckCircle2, Calendar } from 'lucide-react';

const updateHighlights = [
  'New download engine — 3× faster processing speed',
  'One-click and download every public post',
  'MP3 audio extractor with 256kbps output',
  'Improved iPhone and iOS 18 Safari compatibility',
  'Zero-log privacy architecture rebuilt from scratch',
  'PageSpeed 97 achieved — sub-800ms LCP',
];

export default function LatestUpdate() {
  return (
    <section className="py-20 bg-slate-100/60 dark:bg-gray-950/70 relative overflow-hidden border-t border-slate-200 dark:border-gray-800/40 transition-colors duration-200">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-fuchsia-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-white to-slate-50 dark:from-gray-900/90 dark:to-gray-950/90 border border-violet-200 dark:border-violet-500/30 shadow-xl dark:shadow-2xl dark:shadow-violet-950/20 backdrop-blur-xl transition-colors">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-semibold uppercase tracking-wider mb-4 transition-colors">
              <Zap className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              <span>Latest Update</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight transition-colors">
              Savefrompro v2.0 — <span className="gradient-text">Faster, Smarter, Better</span>
            </h2>

            <p className="text-slate-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed transition-colors">
              We completely rebuilt our download engine in Sep 2026. Processing is now up to 3× faster, posts download in a single click, and our new MP3 extractor delivers studio-quality audio from any public post.
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-10">
            {updateHighlights.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 hover:border-violet-400 dark:hover:border-violet-500/30 transition-colors shadow-sm"
              >
                <div className="w-6 h-6 rounded-lg bg-violet-100 dark:bg-violet-600/20 border border-violet-200 dark:border-violet-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                </div>
                <span className="text-slate-800 dark:text-gray-200 text-sm font-medium leading-snug transition-colors">
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* Footer Release Status */}
          <div className="text-center pt-6 border-t border-slate-200 dark:border-gray-800/60 transition-colors">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-gray-400 font-medium">
              <Calendar className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <span>Released Sep 15, 2026 • Free for all users • No action required</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
