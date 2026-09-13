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
      className="group relative bg-gray-900/50 border border-gray-800/50 rounded-2xl p-6 hover:border-gray-700/50 hover:bg-gray-800/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20"
    >
      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        <IconComponent className="w-6 h-6 text-white" />
      </div>

      {/* Content */}
      <h3 className="text-white font-semibold text-lg mb-2">{platform.name}</h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
        {platform.description}
      </p>

      {/* Features Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {platform.features.slice(0, 3).map((feature) => (
          <span
            key={feature}
            className="text-xs px-2 py-0.5 rounded-md bg-gray-800/80 text-gray-400 border border-gray-700/30"
          >
            {feature}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div className="flex items-center text-violet-400 text-sm font-medium group-hover:text-violet-300 transition-colors">
        Download Now
        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
