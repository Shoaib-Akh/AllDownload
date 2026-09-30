"use client";

import { useState } from "react";
import {
  Download,
  Copy,
  Check,
  FileVideo,
  FileAudio,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { formatFileSize } from "@/lib/utils";

export default function DownloadResult({ result, onDownload }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [downloadingUrl, setDownloadingUrl] = useState(null);

  if (!result) return null;

  const handleCopy = async (url, index) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // ignore
    }
  };

  const handleDownloadClick = (item) => {
    setDownloadingUrl(item.url);
    if (onDownload) {
      onDownload(item, result.title);
    }
    setTimeout(() => {
      setDownloadingUrl(null);
    }, 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 bg-white dark:bg-gray-900/70 border border-slate-200 dark:border-gray-800/80 rounded-2xl overflow-hidden shadow-xl dark:shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-2 transition-colors duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-violet-100 via-fuchsia-100/50 to-slate-100 dark:from-violet-900/40 dark:via-fuchsia-900/30 dark:to-gray-900/40 px-6 py-3 border-b border-slate-200 dark:border-gray-800/60 flex items-center justify-between text-xs transition-colors">
        <span className="text-violet-700 dark:text-violet-300 font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Media Ready for Download
        </span>
        <span className="px-2.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 font-medium border border-violet-200 dark:border-violet-500/30 uppercase tracking-wide text-[10px]">
          {result.platform}
        </span>
      </div>

      <div className="p-6">
        {/* Media Preview Header */}
        <div className="flex flex-col sm:flex-row gap-5 mb-6">
          {result.thumbnail && (
            <div className="sm:w-56 h-32 rounded-xl overflow-hidden bg-slate-100 dark:bg-gray-800 flex-shrink-0 relative group shadow-md">
              <img
                src={result.thumbnail}
                alt={result.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {result.duration && (
                <span className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[11px] text-white font-mono">
                  {result.duration}
                </span>
              )}
            </div>
          )}

          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <h3 className="text-slate-900 dark:text-white font-bold text-lg leading-snug mb-1 line-clamp-2 transition-colors">
                {result.title || "Untitled Video"}
              </h3>
              {result.author && (
                <p className="text-slate-600 dark:text-gray-400 text-sm transition-colors">{result.author}</p>
              )}
            </div>

            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-gray-800/50 text-xs text-slate-500 dark:text-gray-400 transition-colors">
              <span>{result.media?.length || 0} quality options found</span>
            </div>
          </div>
        </div>

        {/* Quality Options Table / Cards */}
        <div className="space-y-2.5">
          {result.media?.map((item, index) => {
            const isDownloading = downloadingUrl === item.url;
            const isCopied = copiedIndex === index;
            const targetUrl = item.downloadUrl || item.url;

            return (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 hover:bg-slate-100/80 dark:bg-gray-800/40 dark:hover:bg-gray-800/70 border border-slate-200/80 dark:border-gray-700/40 rounded-xl px-4 py-3 transition-all"
              >
                {/* Format & Label */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-200/60 dark:bg-gray-700/50 flex items-center justify-center flex-shrink-0">
                    {item.type === "video" ? (
                      <FileVideo className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    ) : item.type === "audio" ? (
                      <FileAudio className="w-5 h-5 text-fuchsia-600 dark:text-fuchsia-400" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900 dark:text-white text-sm font-semibold transition-colors">
                        {item.quality || "Standard Quality"}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 dark:bg-violet-600/30 dark:text-violet-300 font-mono uppercase font-semibold">
                        {item.format || "mp4"}
                      </span>
                    </div>
                    {item.size && (
                      <span className="text-slate-500 dark:text-gray-400 text-xs">
                        {formatFileSize(item.size)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {/* Copy direct link */}
                  <button
                    type="button"
                    onClick={() => handleCopy(item.url, index)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 dark:border-gray-700 dark:hover:border-gray-600 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 dark:text-gray-300 dark:hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
                    title="Copy direct media link"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-green-400" />
                        <span className="text-emerald-600 dark:text-green-300">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  {/* Download Button — fetches directly from CDN, no Cloudflare proxy */}
                  <button
                    type="button"
                    onClick={() => handleDownloadClick(item)}
                    className="px-5 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xs sm:text-sm font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-md hover:shadow-violet-500/20 active:scale-95"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
