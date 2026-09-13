'use client';

import { useState } from 'react';
import { Download, ClipboardPaste, Loader2 } from 'lucide-react';

export default function DownloadInput({ onSubmit, isLoading = false, platform = null }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please paste a video URL');
      return;
    }
    setError('');
    onSubmit(url.trim());
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setError('');
    } catch {
      setError('Unable to access clipboard');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(''); }}
            placeholder={platform ? `Paste ${platform.name} video URL here...` : 'Paste video URL here...'}
            disabled={isLoading}
            className="w-full px-5 py-4 bg-gray-800/80 border border-gray-700/50 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 text-base transition-all disabled:opacity-50"
          />
          <button
            type="button"
            onClick={handlePaste}
            disabled={isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-violet-400 transition-colors disabled:opacity-50"
            title="Paste from clipboard"
          >
            <ClipboardPaste className="w-5 h-5" />
          </button>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-violet-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
        >
          {isLoading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Fetching...</>
          ) : (
            <><Download className="w-5 h-5" /> Download</>
          )}
        </button>
      </div>
      {error && (
        <p className="text-red-400 text-sm mt-3">{error}</p>
      )}
    </form>
  );
}
