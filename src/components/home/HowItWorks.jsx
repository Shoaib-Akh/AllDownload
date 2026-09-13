import { ClipboardPaste, Search, Download } from 'lucide-react';
import { HOW_IT_WORKS_STEPS } from '@/lib/constants';

const stepIcons = {
  'clipboard-paste': ClipboardPaste,
  'search': Search,
  'download': Download,
};

export default function HowItWorks() {
  return (
    <section className="py-20 bg-slate-100/50 dark:bg-gray-900/30 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">
            How It Works
          </h2>
          <p className="text-slate-600 dark:text-gray-400 text-lg max-w-2xl mx-auto transition-colors">
            Download any video in just 3 simple steps. No signup required.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {HOW_IT_WORKS_STEPS.map((step, index) => {
            const Icon = stepIcons[step.icon] || Download;
            return (
              <div key={step.step} className="relative text-center">
                {/* Connector Line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-violet-500/30 to-transparent" />
                )}

                {/* Step Number + Icon */}
                <div className="relative inline-flex">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/15 to-fuchsia-500/15 dark:from-violet-600/20 dark:to-fuchsia-600/20 border border-violet-200 dark:border-violet-500/20 flex items-center justify-center mb-6 shadow-sm">
                    <Icon className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm">
                    {step.step}
                  </span>
                </div>

                <h3 className="text-slate-900 dark:text-white font-semibold text-lg mb-2 transition-colors">{step.title}</h3>
                <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed mb-3 transition-colors">{step.description}</p>
                {step.bar && (
                  <span className="inline-block px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-medium">
                    {step.bar}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
