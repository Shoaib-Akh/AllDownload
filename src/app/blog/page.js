import { getAllBlogPosts } from "@/lib/blog-data";
import BlogList from "@/components/blog/BlogList";
import { BookOpen, PlusCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Blog & Guides — Video Downloading Tips & Tutorials | SaveFromPro",
  description:
    "Explore the latest tutorials, tips, and step-by-step guides on downloading high-definition videos from Facebook, Instagram, TikTok, Twitter/X, and more.",
  openGraph: {
    title: "Blog & Guides — SaveFromPro",
    description:
      "Explore the latest tutorials, tips, and step-by-step guides on downloading videos in HD quality.",
    type: "website",
  },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-colors duration-200">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-700 dark:text-violet-400 text-xs font-semibold mb-4 transition-colors">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Articles & Insights</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4 transition-colors">
          The SaveFromPro <span className="gradient-text">Blog</span>
        </h1>
        <p className="text-slate-600 dark:text-gray-400 text-base sm:text-lg leading-relaxed transition-colors mb-6">
          Actionable tutorials, platform walkthroughs, security tips, and media extraction tricks to enhance your video downloading experience.
        </p>

        {/* User Create Blog CTA */}
        <div className="inline-flex items-center gap-3">
          <Link
            href="/blog/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xs font-semibold shadow-md shadow-violet-600/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Write a Post (with HTML & CSS)</span>
          </Link>
        </div>
      </div>

      <BlogList posts={posts} />
    </div>
  );
}
