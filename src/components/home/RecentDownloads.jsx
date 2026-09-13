"use client";

import { Download, Trash2, Clock } from "lucide-react";

export default function RecentDownloads({ recents = [], onClear, onRemove }) {
  if (!recents || recents.length === 0) return null;

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 bg-white/80 dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800/60 rounded-2xl p-6 backdrop-blur-sm shadow-sm transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold transition-colors">
          <Clock className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          <span>Recent Downloads ({recents.length})</span>
        </div>
        {onClear && (
          <button
            onClick={onClear}
            className="text-xs text-slate-500 hover:text-rose-600 dark:text-gray-400 dark:hover:text-red-400 flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear History
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {recents.slice(0, 6).map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 dark:bg-gray-800/40 dark:hover:bg-gray-800/70 border border-slate-200 dark:border-gray-700/30 rounded-xl transition-all group"
          >
            {item.thumbnail ? (
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-slate-200 dark:bg-gray-700"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-violet-100 dark:bg-violet-600/20 flex items-center justify-center flex-shrink-0">
                <Download className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-medium text-slate-900 dark:text-white truncate group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                {item.title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-gray-700/60 text-slate-700 dark:text-gray-300 uppercase tracking-wider font-medium">
                  {item.platform}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-gray-500">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {item.downloadUrl && (
              <a
                href={item.downloadUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-violet-100 hover:bg-violet-600 text-violet-700 hover:text-white dark:bg-violet-600/20 dark:hover:bg-violet-600 dark:text-violet-300 dark:hover:text-white transition-all flex-shrink-0 shadow-sm"
                title="Download Again"
              >
                <Download className="w-4 h-4" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
