import { Sparkles, Check, X, Minus } from 'lucide-react';

const comparisonRows = [
  {
    feature: '100% Free',
    saveFromPro: '✓',
    dumpmedia: '✓',
    saveplays: '✓',
  },
  {
    feature: 'No Watermark',
    saveFromPro: '✓',
    dumpmedia: 'Partial',
    saveplays: '✗',
  },
  {
    feature: 'No Login Required',
    saveFromPro: '✓',
    dumpmedia: '✓',
    saveplays: 'Partial',
  },
  {
    feature: 'Browser-Based (No App)',
    saveFromPro: '✓',
    dumpmedia: '✗ App only',
    saveplays: '✓',
  },
  {
    feature: 'All-in-One (12 platforms)',
    saveFromPro: '✓',
    dumpmedia: '✗ Single platform',
    saveplays: 'Partial (3–4)',
  },
  {
    feature: 'HD / 4K Download',
    saveFromPro: '✓',
    dumpmedia: 'Partial',
    saveplays: '✓',
  },
  {
    feature: 'MP3 / Audio Extraction',
    saveFromPro: '✓',
    dumpmedia: '✗',
    saveplays: 'Partial',
  },
  {
    feature: 'Works on Mobile (Safari/Chrome)',
    saveFromPro: '✓',
    dumpmedia: 'Partial',
    saveplays: '✗',
  },
  {
    feature: 'No Data Stored',
    saveFromPro: '✓',
    dumpmedia: 'Unclear',
    saveplays: 'Unclear',
  },
  {
    feature: 'Download Speed',
    saveFromPro: 'Fast',
    dumpmedia: 'Average',
    saveplays: 'Average',
  },
];

function renderCell(val, isSaveFromPro = false) {
  if (val === '✓') {
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
        <Check className="w-4 h-4" />
      </span>
    );
  }
  if (val === '✗') {
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold">
        <X className="w-4 h-4" />
      </span>
    );
  }
  if (val.startsWith('✗')) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-300 text-xs font-medium border border-rose-500/20">
        <X className="w-3.5 h-3.5" />
        {val.replace('✗', '').trim()}
      </span>
    );
  }
  if (val.includes('Partial')) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-medium border border-amber-500/20">
        <Minus className="w-3.5 h-3.5" />
        {val}
      </span>
    );
  }
  if (val === 'Fast') {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold shadow-sm shadow-violet-500/30">
        Fast
      </span>
    );
  }
  return (
    <span className="text-slate-600 dark:text-gray-400 text-xs sm:text-sm font-medium">
      {val}
    </span>
  );
}

export default function ComparisonTable() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-gray-950 relative overflow-hidden border-t border-slate-200 dark:border-gray-800/40 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-semibold uppercase tracking-wider mb-4 transition-colors">
            <Sparkles className="w-3.5 h-3.5" />
            <span>How We Compare</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight transition-colors">
            Savefrompro vs Other Downloaders
          </h2>

          <p className="text-slate-600 dark:text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed transition-colors">
            See how Savefrompro stacks up against the most popular alternatives in every category that matters.
          </p>
        </div>

        {/* Table Card */}
        <div className="rounded-2xl bg-white dark:bg-gray-900/60 backdrop-blur-xl border border-slate-200 dark:border-gray-800/80 overflow-hidden shadow-xl dark:shadow-2xl dark:shadow-black/40 transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-gray-800/80 bg-slate-100/80 dark:bg-gray-900/80">
                  <th className="py-4 px-6 text-sm font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider">
                    Feature
                  </th>
                  <th className="py-4 px-6 text-sm font-bold text-center bg-gradient-to-b from-violet-100/80 to-violet-50/40 dark:from-violet-600/20 dark:to-violet-600/5 text-violet-800 dark:text-violet-300 border-x border-violet-200 dark:border-violet-500/30">
                    <div className="inline-flex items-center gap-1.5 font-extrabold text-slate-900 dark:text-white">
                      <span>SaveFromPro</span>
                      <span className="px-2 py-0.5 rounded-md bg-violet-600 text-white dark:bg-violet-500/30 dark:text-violet-300 text-xs uppercase tracking-wide border border-violet-500/40 font-semibold">
                        Best
                      </span>
                    </div>
                  </th>
                  <th className="py-4 px-6 text-sm font-semibold text-center text-slate-500 dark:text-gray-400">
                    Dumpmedia
                  </th>
                  <th className="py-4 px-6 text-sm font-semibold text-center text-slate-500 dark:text-gray-400">
                    Saveplays
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-gray-800/60 text-sm">
                {comparisonRows.map((row, idx) => (
                  <tr
                    key={row.feature}
                    className={`transition-colors hover:bg-slate-50/80 dark:hover:bg-gray-800/30 ${
                      idx % 2 === 0 ? 'bg-transparent' : 'bg-slate-50/40 dark:bg-gray-900/20'
                    }`}
                  >
                    <td className="py-4 px-6 font-medium text-slate-900 dark:text-white transition-colors">
                      {row.feature}
                    </td>
                    <td className="py-4 px-6 text-center bg-violet-500/5 border-x border-violet-200/60 dark:border-violet-500/20">
                      {renderCell(row.saveFromPro, true)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {renderCell(row.dumpmedia)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {renderCell(row.saveplays)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
