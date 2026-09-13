export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8 transition-colors">
      <div className={`${sizes[size]} border-2 border-slate-300 dark:border-gray-700 border-t-violet-600 dark:border-t-violet-500 rounded-full animate-spin`} />
      {text && <p className="text-slate-600 dark:text-gray-400 text-sm font-medium">{text}</p>}
    </div>
  );
}
