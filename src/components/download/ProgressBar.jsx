export default function ProgressBar({ progress = 0 }) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-slate-600 dark:text-gray-400">Downloading...</span>
        <span className="text-violet-600 dark:text-violet-400 font-medium">{Math.round(progress)}%</span>
      </div>
      <div className="w-full h-2 bg-slate-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
