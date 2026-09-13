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
    <div className="w-full max-w-3xl mx-auto mt-8 bg-gray-900/70 border border-gray-800/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-2">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-violet-900/40 via-fuchsia-900/30 to-gray-900/40 px-6 py-3 border-b border-gray-800/60 flex items-center justify-between text-xs">
        <span className="text-violet-300 font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Media Ready for Download
        </span>
        <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-medium border border-violet-500/30">
          {result.platform}
        </span>
      </div>

      <div className="p-6">
        {/* Media Preview Header */}
        <div className="flex flex-col sm:flex-row gap-5 mb-6">
          {result.thumbnail && (
            <div className="sm:w-56 h-32 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0 relative group shadow-md">
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
              <h3 className="text-white font-bold text-lg leading-snug mb-1 line-clamp-2">
                {result.title || "Untitled Video"}
              </h3>
              {result.author && (
                <p className="text-gray-400 text-sm">{result.author}</p>
              )}
            </div>

            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-800/50 text-xs text-gray-400">
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
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-800/40 hover:bg-gray-800/70 border border-gray-700/40 rounded-xl px-4 py-3 transition-all"
              >
                {/* Format & Label */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-700/50 flex items-center justify-center flex-shrink-0">
                    {item.type === "video" ? (
                      <FileVideo className="w-5 h-5 text-violet-400" />
                    ) : item.type === "audio" ? (
                      <FileAudio className="w-5 h-5 text-fuchsia-400" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-semibold">
                        {item.quality || "Standard Quality"}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-violet-600/30 text-violet-300 font-mono uppercase">
                        {item.format || "mp4"}
                      </span>
                    </div>
                    {item.size && (
                      <span className="text-gray-400 text-xs">
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
                    className="px-3 py-1.5 rounded-lg border border-gray-700 hover:border-gray-600 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                    title="Copy direct media link"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-green-300">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  {/* Download Button */}
                  <a
                    href={targetUrl}
                    download
                    onClick={() => handleDownloadClick(item)}
                    target="_blank"
                    rel="noopener noreferrer"
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
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
