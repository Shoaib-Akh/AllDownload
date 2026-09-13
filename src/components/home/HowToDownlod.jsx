import { ClipboardPaste, Search, Download, ArrowRight, Sparkles } from 'lucide-react';
import { HOW_IT_WORKS_STEPS } from '@/lib/constants';

const stepConfig = {
  1: {
    icon: ClipboardPaste,
    gradient: 'from-violet-500/20 via-indigo-500/10 to-transparent',
    border: 'border-violet-200 dark:border-violet-500/30 group-hover:border-violet-400/60',
    iconColor: 'text-violet-600 dark:text-violet-400',
    badgeBg: 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-500/30',
    glow: 'group-hover:shadow-violet-500/10 dark:group-hover:shadow-violet-500/20',
    dotColor: 'bg-violet-600 dark:bg-violet-400',
  },
  2: {
    icon: Search,
    gradient: 'from-fuchsia-500/20 via-pink-500/10 to-transparent',
    border: 'border-fuchsia-200 dark:border-fuchsia-500/30 group-hover:border-fuchsia-400/60',
    iconColor: 'text-fuchsia-600 dark:text-fuchsia-400',
    badgeBg: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-500/15 dark:text-fuchsia-300 dark:border-fuchsia-500/30',
    glow: 'group-hover:shadow-fuchsia-500/10 dark:group-hover:shadow-fuchsia-500/20',
    dotColor: 'bg-fuchsia-600 dark:bg-fuchsia-400',
  },
  3: {
    icon: Download,
    gradient: 'from-pink-500/20 via-rose-500/10 to-transparent',
    border: 'border-pink-200 dark:border-pink-500/30 group-hover:border-pink-400/60',
    iconColor: 'text-pink-600 dark:text-pink-400',
    badgeBg: 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-500/15 dark:text-pink-300 dark:border-pink-500/30',
    glow: 'group-hover:shadow-pink-500/10 dark:group-hover:shadow-pink-500/20',
    dotColor: 'bg-pink-600 dark:bg-pink-400',
  },
};

export default function HowToDownlod() {
  return (
    <div className="w-full text-left">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-semibold uppercase tracking-wider mb-3 transition-colors">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simple 3-Step Process</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors">
          How to <span className="gradient-text">Download</span>
        </h2>
        <p className="text-slate-600 dark:text-gray-400 text-sm sm:text-base mt-2 max-w-xl mx-auto transition-colors">
          Download any video in just 3 simple steps. No signup required.
        </p>
      </div>

      {/* Steps Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
        {HOW_IT_WORKS_STEPS.map((step, index) => {
          const config = stepConfig[step.step] || stepConfig[1];
          const Icon = config.icon;

          return (
            <div
              key={step.step}
              className={`group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white dark:bg-gray-900/70 backdrop-blur-xl border ${config.border} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${config.glow} shadow-sm`}
            >
              {/* Top Row: Icon + Step Badge */}
              <div className="flex items-center justify-between mb-5">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config.gradient} border ${config.border} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-md`}
                >
                  <Icon className={`w-7 h-7 ${config.iconColor}`} />
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${config.badgeBg}`}
                >
                  0{step.step}
                </span>
              </div>

              {/* Step Content */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                  {step.title}
                </h3>
                <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed transition-colors">
                  {step.description}
                </p>
              </div>

              {/* Step Bar (Status / Feature Note) */}
              {step.bar && (
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-gray-800/80">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700/50 text-xs font-medium text-slate-700 dark:text-gray-300 group-hover:border-violet-500/30 transition-colors">
                    <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
                    <span>{step.bar}</span>
                  </div>
                </div>
              )}

              {/* Desktop subtle connector arrow between cards */}
              {index < HOW_IT_WORKS_STEPS.length - 1 && (
                <div className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700/80 items-center justify-center text-slate-500 dark:text-gray-400 shadow-md pointer-events-none">
                  <ArrowRight className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { HowToDownlod as HowToDownload };
