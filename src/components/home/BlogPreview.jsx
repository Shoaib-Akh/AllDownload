import Link from 'next/link';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';
import { getRecentBlogPosts } from '@/lib/blog-data';

export default function BlogPreview() {
  const posts = getRecentBlogPosts(3);

  return (
    <section className="py-20 bg-slate-100/50 dark:bg-gray-900/50 border-t border-slate-200 dark:border-gray-800/50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-700 dark:text-violet-400 text-xs font-medium mb-3 transition-colors">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Guides & Tips</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">
              Latest From Our Blog
            </h2>
            <p className="text-slate-600 dark:text-gray-400 text-base max-w-xl transition-colors">
              Tutorials, platform tips, and security insights to help you get the most out of your media downloads.
            </p>
          </div>
          <Link
            href="/blog"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium text-sm transition-colors group"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-white dark:bg-gray-900/80 border border-slate-200 dark:border-gray-800/80 hover:border-violet-400 dark:hover:border-violet-500/40 rounded-2xl overflow-hidden flex flex-col transition-all hover:shadow-xl shadow-sm group"
            >
              <div className={`h-2.5 bg-gradient-to-r ${post.gradient}`} />
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-violet-100 text-violet-700 border border-violet-200 dark:bg-violet-600/20 dark:text-violet-300 dark:border-violet-500/20">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>

                <p className="text-slate-600 dark:text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-1 transition-colors">
                  {post.excerpt}
                </p>

                <div className="pt-4 border-t border-slate-100 dark:border-gray-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-600/30 dark:text-violet-300 flex items-center justify-center font-bold text-[10px]">
                      {post.author.avatar}
                    </div>
                    <span className="font-medium text-slate-700 dark:text-gray-300">{post.author.name}</span>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium group/link"
                  >
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
