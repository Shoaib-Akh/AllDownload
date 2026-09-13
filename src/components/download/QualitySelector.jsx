'use client';

import { Check } from 'lucide-react';

export default function QualitySelector({ qualities = [], selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {qualities.map((quality) => (
        <button
          key={quality.value}
          onClick={() => onSelect(quality.value)}
          className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
            selected === quality.value
              ? 'bg-violet-600 border-violet-500 text-white shadow-sm'
              : 'bg-white dark:bg-gray-800/50 border-slate-200 dark:border-gray-700/50 text-slate-700 dark:text-gray-300 hover:border-slate-300 dark:hover:border-gray-600 shadow-sm'
          }`}
        >
          {selected === quality.value && <Check className="w-3.5 h-3.5 inline mr-1.5" />}
          {quality.label}
        </button>
      ))}
    </div>
  );
}
