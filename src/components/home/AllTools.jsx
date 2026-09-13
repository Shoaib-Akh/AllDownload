import Link from 'next/link';
import {
  Sparkles,
  SlidersHorizontal,
  ShieldCheck,
  UserX,
  MonitorSmartphone,
  ServerOff,
  LayoutGrid,
  ArrowRight,
} from 'lucide-react';

const toolsData = [
  {
    number: '01',
    title: 'Original quality',
    description:
      'We fetch the same file the platform serves to its own app, so you keep the resolution and bitrate the creator uploaded — not a recompressed copy.',
    icon: SlidersHorizontal,
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'from-violet-500/20 to-indigo-500/10',
    border: 'border-violet-200 dark:border-violet-500/30 group-hover:border-violet-400/60',
    glow: 'group-hover:shadow-violet-500/10 dark:group-hover:shadow-violet-500/20',
  },
  {
    number: '02',
    title: 'No watermark',
    description:
      "Clips saved through SaveFromPro don't get a floating logo stamped in the corner, so the content stays clean for your own use.",
    icon: ShieldCheck,
    color: 'text-fuchsia-600 dark:text-fuchsia-400',
    bg: 'from-fuchsia-500/20 to-pink-500/10',
    border: 'border-fuchsia-200 dark:border-fuchsia-500/30 group-hover:border-fuchsia-400/60',
    glow: 'group-hover:shadow-fuchsia-500/10 dark:group-hover:shadow-fuchsia-500/20',
  },
  {
    number: '03',
    title: 'No account needed',
    description:
      "There's no sign-up wall between you and your download. Paste a link, get a file, close the tab.",
    icon: UserX,
    color: 'text-pink-600 dark:text-pink-400',
    bg: 'from-pink-500/20 to-rose-500/10',
    border: 'border-pink-200 dark:border-pink-500/30 group-hover:border-pink-400/60',
    glow: 'group-hover:shadow-pink-500/10 dark:group-hover:shadow-pink-500/20',
  },
  {
    number: '04',
    title: 'Works on any device',
    description:
      "The tool runs in your browser, so it behaves the same whether you're on an iPhone, an Android phone, a Chromebook or a desktop.",
    icon: MonitorSmartphone,
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'from-indigo-500/20 to-blue-500/10',
    border: 'border-indigo-200 dark:border-indigo-500/30 group-hover:border-indigo-400/60',
    glow: 'group-hover:shadow-indigo-500/10 dark:group-hover:shadow-indigo-500/20',
  },
  {
    number: '05',
    title: 'Nothing stored',
    description:
      "We don't keep a library of downloaded files on our servers. Once your browser has the file, our job is done.",
    icon: ServerOff,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'from-rose-500/20 to-pink-500/10',
    border: 'border-rose-200 dark:border-rose-500/30 group-hover:border-rose-400/60',
    glow: 'group-hover:shadow-rose-500/10 dark:group-hover:shadow-rose-500/20',
  },
  {
    number: '06',
    title: 'One tool, twelve platforms',
    description:
      'Instead of bookmarking a different site for every app, SaveFromPro covers the twelve platforms people actually share video and photo content on.',
    icon: LayoutGrid,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'from-purple-500/20 to-violet-500/10',
    border: 'border-purple-200 dark:border-purple-500/30 group-hover:border-purple-400/60',
    glow: 'group-hover:shadow-purple-500/10 dark:group-hover:shadow-purple-500/20',
  },
];

export default function AllTools() {
  return (
    <section id="all-tools" className="py-20 bg-slate-50 dark:bg-gray-950 relative overflow-hidden transition-colors duration-200">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-semibold uppercase tracking-wider mb-4 transition-colors">
            <Sparkles className="w-3.5 h-3.5" />
            <span>All Tools</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight transition-colors">
            Everything You Need to <span className="gradient-text">Save your Content</span>
          </h2>

          <p className="text-slate-600 dark:text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed transition-colors">
            Saving something you found online should take seconds, not a trip to an app store. Here&apos;s what we optimised for.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolsData.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.number}
                className={`group relative flex flex-col justify-between p-7 sm:p-8 rounded-2xl bg-white dark:bg-gray-900/60 backdrop-blur-xl border ${item.border} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${item.glow}`}
              >
                <div>
                  {/* Top Bar: Number + Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-black text-slate-300 dark:text-gray-700 font-mono group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      {item.number}
                    </span>
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.bg} border ${item.border} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-md`}
                    >
                      <Icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2.5 group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed transition-colors">
                    {item.description}
                  </p>
                </div>

                {item.link && (
                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-gray-800/60">
                    <Link
                      href={item.link.href}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 transition-colors"
                    >
                      <span>{item.link.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
