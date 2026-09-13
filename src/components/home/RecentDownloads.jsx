"use client";

import { Download, Trash2, Clock, ExternalLink } from "lucide-react";

export default function RecentDownloads({ recents = [], onClear, onRemove }) {
  if (!recents || recents.length === 0) return null;

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 bg-gray-900/40 border border-gray-800/60 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Clock className="w-4 h-4 text-violet-400" />
          <span>Recent Downloads ({recents.length})</span>
        </div>
        {onClear && (
          <button
            onClick={onClear}
            className="text-xs text-gray-400 hover:text-red-400 flex items-center gap-1 transition-colors"
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
            className="flex items-center gap-3 p-3 bg-gray-800/40 hover:bg-gray-800/70 border border-gray-700/30 rounded-xl transition-all group"
          >
            {item.thumbnail ? (
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-gray-700"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-violet-600/20 flex items-center justify-center flex-shrink-0">
                <Download className="w-5 h-5 text-violet-400" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-medium text-white truncate group-hover:text-violet-300 transition-colors">
                {item.title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-700/60 text-gray-300 uppercase tracking-wider">
                  {item.platform}
                </span>
                <span className="text-[10px] text-gray-500">
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
                className="p-2 rounded-lg bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white transition-all flex-shrink-0"
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
