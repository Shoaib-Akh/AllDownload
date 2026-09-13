import { BadgeDollarSign, Monitor, UserX, Zap, LayoutGrid, Smartphone } from 'lucide-react';
import { FEATURES } from '@/lib/constants';

const featureIcons = {
  'badge-dollar-sign': BadgeDollarSign,
  'monitor': Monitor,
  'user-x': UserX,
  'zap': Zap,
  'layout-grid': LayoutGrid,
  'smartphone': Smartphone,
};

export default function Features() {
  return (
    <section className="py-20 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Why Choose SaveFromPro?
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            The best free video downloader with powerful features.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {FEATURES.map((feature) => {
            const Icon = featureIcons[feature.icon] || Zap;
            return (
              <div
                key={feature.title}
                className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-6 hover:border-gray-700/50 transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
