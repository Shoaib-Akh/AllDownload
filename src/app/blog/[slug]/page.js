import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllBlogPosts,
  getBlogPostBySlug,
} from "@/lib/blog-data";
import { ArticleJsonLd } from "@/components/seo/JsonLd";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ChevronRight,
  Share2,
  CheckCircle2,
  Lightbulb,
  ArrowRight,
  Sparkles,
  Download,
} from "lucide-react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({ params }) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Article Not Found — SaveFromPro",
    };
  }

  return {
    title: `${post.title} — SaveFromPro Blog`,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author?.name || SITE_NAME],
      url: `${SITE_URL}/blog/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default function BlogPostPage({ params }) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Related posts (excluding current post)
  const allPosts = getAllBlogPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      <ArticleJsonLd post={post} />

      <article className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto transition-colors duration-200">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-gray-400 mb-8 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-gray-600 shrink-0" />
          <Link href="/blog" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Blog
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-gray-600 shrink-0" />
          <span className="text-slate-700 dark:text-gray-300 font-medium truncate">
            {post.category}
          </span>
        </nav>

        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Articles</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-10 space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 text-xs font-semibold rounded-lg bg-violet-100 text-violet-700 border border-violet-200 dark:bg-violet-600/20 dark:text-violet-300 dark:border-violet-500/30">
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-gray-400">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight transition-colors">
            {post.title}
          </h1>

          <p className="text-lg text-slate-700 dark:text-gray-300 leading-relaxed font-normal transition-colors">
            {post.excerpt}
          </p>

          {/* Author info & tags */}
          <div className="pt-6 border-t border-slate-200 dark:border-gray-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                {post.author.avatar}
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white text-sm transition-colors">
                  {post.author.name}
                </div>
                <div className="text-slate-500 dark:text-gray-400 text-xs">{post.author.role}</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-slate-600 dark:text-gray-400 text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Article Body Content */}
        <div className="max-w-none space-y-8 text-slate-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed border-t border-slate-200 dark:border-gray-800/60 pt-8 transition-colors">
          {post.content.map((block, idx) => {
            if (block.type === "intro") {
              return (
                <p
                  key={idx}
                  className="text-lg sm:text-xl text-slate-800 dark:text-gray-200 leading-relaxed font-normal bg-violet-50 dark:bg-violet-950/20 border-l-4 border-violet-500 p-4 rounded-r-xl"
                >
                  {block.text}
                </p>
              );
            }

            if (block.type === "heading") {
              return (
                <h2
                  key={idx}
                  className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-10 mb-4 pt-4 border-t border-slate-200 dark:border-gray-800/40 transition-colors"
                >
                  {block.title}
                </h2>
              );
            }

            if (block.type === "paragraph") {
              return (
                <p key={idx} className="text-slate-700 dark:text-gray-300 leading-relaxed transition-colors">
                  {block.text}
                </p>
              );
            }

            if (block.type === "tip") {
              return (
                <div
                  key={idx}
                  className="my-6 p-5 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-900 dark:text-amber-200 flex items-start gap-4 transition-colors"
                >
                  <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-500/20 shrink-0 text-amber-600 dark:text-amber-400">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-amber-800 dark:text-amber-300 mb-1">
                      {block.title}
                    </h4>
                    <p className="text-sm text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
                      {block.text}
                    </p>
                  </div>
                </div>
              );
            }

            if (block.type === "callout") {
              return (
                <div
                  key={idx}
                  className="my-6 p-6 rounded-2xl bg-white dark:bg-gray-900/80 border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300 shadow-sm transition-colors"
                >
                  <h4 className="font-bold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    {block.title}
                  </h4>
                  <ul className="space-y-3">
                    {block.points.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-slate-700 dark:text-gray-300">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }

            return null;
          })}
        </div>

        {/* Action / Try Downloader Box */}
        <div className="mt-14 p-8 rounded-3xl bg-gradient-to-r from-violet-100/70 via-purple-50 to-slate-100 dark:from-violet-900/40 dark:via-purple-900/20 dark:to-gray-900 border border-violet-200 dark:border-violet-500/30 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm dark:shadow-xl transition-colors">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 transition-colors">
              Start Downloading Right Now
            </h3>
            <p className="text-slate-600 dark:text-gray-400 text-sm transition-colors">
              Paste any video URL on our homepage and get high-quality MP4 downloads without limits.
            </p>
          </div>
          <Link
            href="/"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all shadow-md shadow-violet-600/20"
          >
            <Download className="w-4 h-4" />
            <span>Try Free Downloader</span>
          </Link>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-slate-200 dark:border-gray-800 transition-colors">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 transition-colors">
              Related Articles & Guides
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rPost) => (
                <article
                  key={rPost.slug}
                  className="bg-white dark:bg-gray-900/50 border border-slate-200 dark:border-gray-800 hover:border-violet-400 dark:hover:border-violet-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all group shadow-sm"
                >
                  <div>
                    <span className="text-xs text-violet-600 dark:text-violet-400 font-semibold mb-2 inline-block">
                      {rPost.category}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors line-clamp-2 mb-2">
                      <Link href={`/blog/${rPost.slug}`}>{rPost.title}</Link>
                    </h4>
                    <p className="text-slate-600 dark:text-gray-400 text-xs line-clamp-2 mb-4 transition-colors">
                      {rPost.excerpt}
                    </p>
                  </div>
                  <Link
                    href={`/blog/${rPost.slug}`}
                    className="inline-flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium group/link"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
