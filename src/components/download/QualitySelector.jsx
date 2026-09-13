'use client';

import { useState } from 'react';
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
              ? 'bg-violet-600 border-violet-500 text-white'
              : 'bg-gray-800/50 border-gray-700/50 text-gray-300 hover:border-gray-600'
          }`}
        >
          {selected === quality.value && <Check className="w-3.5 h-3.5 inline mr-1.5" />}
          {quality.label}
        </button>
      ))}
    </div>
  );
}
