import { ClipboardPaste, Search, Download } from 'lucide-react';
import { HOW_IT_WORKS_STEPS } from '@/lib/constants';

const stepIcons = {
  'clipboard-paste': ClipboardPaste,
  'search': Search,
  'download': Download,
};

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gray-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
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
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/20 flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-violet-400" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    {step.step}
                  </span>
                </div>

                <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
