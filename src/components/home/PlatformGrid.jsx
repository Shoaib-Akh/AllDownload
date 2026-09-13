import { PLATFORMS } from '@/lib/constants';
import PlatformCard from './PlatformCard';

export default function PlatformGrid() {
  return (
    <section id="platforms" className="py-20 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Supported Platforms
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Download videos, reels, stories, and more from all your favorite platforms.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {PLATFORMS.map((platform) => (
            <PlatformCard key={platform.slug} platform={platform} />
          ))}
        </div>
      </div>
    </section>
  );
}
