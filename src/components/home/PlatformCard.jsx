import Link from 'next/link';
import { ArrowRight, Video, Music, Pin, MessageCircle, AtSign, Ghost, Play } from 'lucide-react';
import { FacebookIcon, InstagramIcon, TwitterXIcon, LinkedInIcon } from '@/components/common/BrandIcons';

const iconMap = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  twitter: TwitterXIcon,
  linkedin: LinkedInIcon,
  music: Music,
  video: Video,
  'message-circle': MessageCircle,
  'at-sign': AtSign,
  ghost: Ghost,
  play: Play,
  pin: Pin,
  twitch: Video,
};

export default function PlatformCard({ platform }) {
  const IconComponent = iconMap[platform.icon] || Video;

  return (
    <Link
      href={`/${platform.slug}`}
      className="group relative bg-white dark:bg-gray-900/50 border border-slate-200 dark:border-gray-800/50 rounded-2xl p-6 hover:border-slate-300 dark:hover:border-gray-700/50 hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-sm"
    >
      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}
      >
        <IconComponent className="w-6 h-6 text-white" />
      </div>

      {/* Content */}
      <h3 className="text-slate-900 dark:text-white font-semibold text-lg mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
        {platform.name}
      </h3>
      <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2 transition-colors">
        {platform.description}
      </p>

      {/* Features Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {platform.features.slice(0, 3).map((feature) => (
          <span
            key={feature}
            className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-gray-800/80 text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700/30 font-medium"
          >
            {feature}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div className="flex items-center text-violet-600 dark:text-violet-400 text-sm font-medium group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
        Download Now
        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
