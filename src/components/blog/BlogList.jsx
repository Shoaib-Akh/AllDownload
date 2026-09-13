'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Clock, Calendar, ArrowRight, Tag, Sparkles } from 'lucide-react';

export default function BlogList({ posts = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(posts.map((p) => p.category));
    return ['All', ...Array.from(cats)];
  }, [posts]);

  // Filter posts based on search query and category
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'All' || post.category === selectedCategory;
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesCategory && matchesSearch;
    });
  }, [posts, searchQuery, selectedCategory]);

  const featuredPost = posts.find((p) => p.featured) || posts[0];
  const showFeatured =
    selectedCategory === 'All' && !searchQuery && featuredPost;

  return (
    <div className="space-y-12 transition-colors duration-200">
      {/* Search & Category Filter Bar */}
      <div className="bg-white/80 dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 rounded-2xl p-4 sm:p-6 backdrop-blur-md shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tutorials, tips, platforms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-gray-950/80 border border-slate-200 dark:border-gray-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                    : 'bg-slate-100 dark:bg-gray-800/50 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-gray-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Post Card (when in default view) */}
      {showFeatured && (
        <section className="relative group">
          <div className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 border border-slate-200 dark:border-gray-800 hover:border-violet-400 dark:hover:border-violet-500/50 rounded-3xl overflow-hidden transition-all duration-300 shadow-lg dark:shadow-2xl">
            <div className={`h-3 bg-gradient-to-r ${featuredPost.gradient}`} />
            <div className="p-6 sm:p-10 flex flex-col md:flex-row gap-8 items-start justify-between">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-violet-100 text-violet-700 border border-violet-200 dark:bg-violet-600/20 dark:text-violet-300 dark:border-violet-500/30 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                    Featured Guide
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-gray-800/80 text-slate-700 dark:text-gray-300 text-xs font-medium">
                    {featuredPost.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredPost.readTime}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-4 group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                  <Link href={`/blog/${featuredPost.slug}`}>
                    {featuredPost.title}
                  </Link>
                </h2>

                <p className="text-slate-600 dark:text-gray-400 text-base leading-relaxed mb-6 transition-colors">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-600/30 dark:text-violet-300 flex items-center justify-center font-bold text-xs">
                      {featuredPost.author.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{featuredPost.author.name}</div>
                      <div className="text-slate-500 dark:text-gray-500">{featuredPost.author.role}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto shrink-0 flex md:flex-col justify-end">
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all shadow-md shadow-violet-600/20 group/btn"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filtered Posts Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white transition-colors">
            {searchQuery
              ? `Search Results for "${searchQuery}" (${filteredPosts.length})`
              : selectedCategory === 'All'
              ? 'All Guides & Tutorials'
              : `${selectedCategory} (${filteredPosts.length})`}
          </h2>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900/30 rounded-2xl border border-slate-200 dark:border-gray-800/50 shadow-sm">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 dark:bg-gray-800/80 flex items-center justify-center text-slate-400 dark:text-gray-500">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-slate-900 dark:text-white font-semibold text-lg mb-1">No articles found</h3>
            <p className="text-slate-600 dark:text-gray-400 text-sm max-w-sm mx-auto mb-4">
              We could not find any guides matching your search criteria. Try a different query or browse all categories.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <article
                key={post.slug}
                className="bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 hover:border-violet-400 dark:hover:border-violet-500/40 rounded-2xl overflow-hidden flex flex-col transition-all hover:shadow-xl shadow-sm group"
              >
                <div className={`h-2 bg-gradient-to-r ${post.gradient}`} />
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

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2.5 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>

                  <p className="text-slate-600 dark:text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-1 transition-colors">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-gray-800/60 text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700/40 font-medium"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>

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
        )}
      </div>

      {/* Downloader CTA Banner */}
      <div className="bg-gradient-to-br from-violet-100/80 via-white to-fuchsia-100/60 dark:from-violet-950/40 dark:via-gray-900 dark:to-gray-950 border border-violet-200 dark:border-violet-500/20 rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden shadow-sm">
        <div className="max-w-2xl mx-auto space-y-4">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white transition-colors">
            Ready to Download Any Video?
          </h3>
          <p className="text-slate-600 dark:text-gray-400 text-sm sm:text-base transition-colors">
            Save videos from Facebook, Instagram, TikTok, Twitter/X and 8+ platforms in full HD quality without watermarks.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all shadow-md shadow-violet-600/20 hover:scale-105"
            >
              <span>Go to Video Downloader</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
