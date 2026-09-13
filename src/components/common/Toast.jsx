'use client';

import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export default function Toast({ type = 'success', message, onClose, duration = 4000 }) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const styles = {
    success: 'bg-emerald-50 dark:bg-green-500/10 border-emerald-200 dark:border-green-500/20 text-emerald-800 dark:text-green-300',
    error: 'bg-rose-50 dark:bg-red-500/10 border-rose-200 dark:border-red-500/20 text-rose-800 dark:text-red-300',
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-green-400" />,
    error: <XCircle className="w-5 h-5 text-rose-600 dark:text-red-400" />,
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border ${styles[type]} shadow-xl backdrop-blur-md animate-in slide-in-from-bottom-2 transition-colors`}>
      {icons[type]}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
