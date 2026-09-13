import { Download, Loader2 } from 'lucide-react';

export default function DownloadButton({ href, isLoading = false, children = 'Download' }) {
  if (isLoading) {
    return (
      <button disabled className="px-6 py-3 bg-violet-600/50 text-white font-semibold rounded-xl flex items-center gap-2 cursor-not-allowed">
        <Loader2 className="w-5 h-5 animate-spin" />
        Processing...
      </button>
    );
  }

  return (
    <a
      href={href}
      download
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-violet-500/25 active:scale-95"
    >
      <Download className="w-5 h-5" />
      {children}
    </a>
  );
}
