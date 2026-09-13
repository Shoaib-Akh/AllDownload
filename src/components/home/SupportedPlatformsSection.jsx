import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Music,
  Video,
  Pin,
  MessageCircle,
  AtSign,
  Ghost,
  Play,
} from 'lucide-react';
import {
  FacebookIcon,
  InstagramIcon,
  TwitterXIcon,
  LinkedInIcon,
} from '@/components/common/BrandIcons';

const platformsData = [
  {
    slug: 'instagram',
    name: 'Instagram Downloader',
    description:
      'Save Reels, feed videos, carousel posts, IGTV and Stories from public Instagram accounts, in the resolution they were uploaded in.',
    icon: InstagramIcon,
    gradient: 'from-[#E4405F] via-[#FD1D1D] to-[#F77737]',
  },
  {
    slug: 'tiktok',
    name: 'TikTok Downloader',
    description:
      'Grab TikTok clips without the swirling watermark, including slideshow posts and videos from creators you follow.',
    icon: Music,
    gradient: 'from-[#00f2ea] to-[#ff0050]',
  },
  {
    slug: 'facebook',
    name: 'Facebook Downloader',
    description:
      'Download public Facebook videos, Reels and Watch clips shared on pages, groups and profiles.',
    icon: FacebookIcon,
    gradient: 'from-[#1877F2] to-[#0a5dc2]',
  },
  {
    slug: 'twitter',
    name: 'Twitter / X Downloader',
    description:
      'Save video and GIF clips attached to public posts on X, including replies and quote posts.',
    icon: TwitterXIcon,
    gradient: 'from-[#1DA1F2] to-[#0d8bd9]',
  },
  {
    slug: 'snapchat',
    name: 'Snapchat Downloader',
    description:
      'Save public Snapchat Spotlight clips and Stories that have been shared outside the app.',
    icon: Ghost,
    gradient: 'from-[#FFFC00] to-[#e6e300]',
    iconColor: 'text-black',
  },
  {
    slug: 'twitch',
    name: 'Twitch Downloader',
    description:
      'Turn a Twitch clip or VOD link into a downloadable file for offline highlights and edits.',
    icon: Video,
    gradient: 'from-[#9146FF] to-[#772ce8]',
  },
  {
    slug: 'dailymotion',
    name: 'Dailymotion Downloader',
    description:
      'Save Dailymotion uploads in the quality the channel published, without needing a Dailymotion account.',
    icon: Play,
    gradient: 'from-[#00AAFF] to-[#0088cc]',
  },
  {
    slug: 'vimeo',
    name: 'Vimeo Downloader',
    description:
      'Download videos from public, non-password-protected Vimeo pages for offline viewing.',
    icon: Video,
    gradient: 'from-[#1AB7EA] to-[#162221]',
  },
  {
    slug: 'reddit',
    name: 'Reddit Downloader',
    description:
      'Reddit stores video and audio separately — SaveFromPro merges them back into one playable file.',
    icon: MessageCircle,
    gradient: 'from-[#FF4500] to-[#cc3700]',
  },
  {
    slug: 'threads',
    name: 'Threads Downloader',
    description:
      "Save videos and photos posted publicly on Threads, Meta's text-and-media app.",
    icon: AtSign,
    gradient: 'from-[#333333] to-[#111111]',
  },
  {
    slug: 'linkedin',
    name: 'LinkedIn Downloader',
    description:
      'Keep a copy of a public LinkedIn video post — talks, product demos, or company updates.',
    icon: LinkedInIcon,
    gradient: 'from-[#0A66C2] to-[#004182]',
  },
  {
    slug: 'pinterest',
    name: 'Pinterest Downloader',
    description:
      'Save Pinterest video Pins and Idea Pins in their original quality, straight from the Pin link.',
    icon: Pin,
    gradient: 'from-[#E60023] to-[#ad001a]',
  },
];

export default function SupportedPlatformsSection() {
  return (
    <section id="platforms" className="py-20 bg-slate-100/60 dark:bg-gray-950/60 relative overflow-hidden border-t border-slate-200 dark:border-gray-800/40 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-semibold uppercase tracking-wider mb-4 transition-colors">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Platforms we supported</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight transition-colors">
            Built for every platform you already use
          </h2>

          <p className="text-slate-600 dark:text-gray-400 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed transition-colors">
            Each platform stores and shares video differently, so we built a dedicated page for each one rather than a single generic tool.
          </p>
        </div>

        {/* Platforms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {platformsData.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.slug}
                href={`/${item.slug}`}
                className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-gray-900/60 backdrop-blur-xl border border-slate-200 dark:border-gray-800/80 hover:border-violet-400 dark:hover:border-violet-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-950/10 dark:hover:shadow-violet-950/20"
              >
                <div>
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-md`}
                  >
                    <Icon className={`w-6 h-6 ${item.iconColor || 'text-white'}`} />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-slate-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed mb-4 transition-colors">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center text-violet-600 dark:text-violet-400 text-xs font-semibold group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors pt-3 border-t border-slate-100 dark:border-gray-800/50">
                  <span>Open downloader</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
