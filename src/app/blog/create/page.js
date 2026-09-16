"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Code2,
  Eye,
  FileText,
  Send,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Layers,
  Palette,
} from "lucide-react";

export default function CreateBlogPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("Tutorials");
  const [authorName, setAuthorName] = useState("");
  const [tags, setTags] = useState("Guides, HD Video, Downloader");
  const [bodyText, setBodyText] = useState("");
  const [customHtml, setCustomHtml] = useState(
`<div class="user-custom-card">
  <span class="user-pill">Community Resource</span>
  <h3 class="user-card-heading">High-Bitrate Video Extract Guide</h3>
  <p class="user-card-text">
    Use direct CDN query parameters to capture the clean original master stream without compression artifacts.
  </p>
  <div class="user-stats-row">
    <div class="user-stat-badge">⚡ 60 FPS</div>
    <div class="user-stat-badge">🎧 320 kbps</div>
    <div class="user-stat-badge">🛡️ Lossless</div>
  </div>
</div>`
  );

  const [customCss, setCustomCss] = useState(
`.user-custom-card {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: #ffffff;
  padding: 2rem;
  border-radius: 1.25rem;
  box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
  margin: 1.5rem 0;
}
.user-pill {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  margin-bottom: 0.75rem;
}
.user-card-heading {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: #ffffff !important;
}
.user-card-text {
  font-size: 0.95rem;
  opacity: 0.95;
  line-height: 1.6;
  margin-bottom: 1.25rem;
}
.user-stats-row {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.user-stat-badge {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  padding: 0.35rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
}`
  );

  const [activeTab, setActiveTab] = useState("editor"); // "editor" | "preview"
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleTemplateInsert = (type) => {
    if (type === "banner") {
      setCustomHtml(
`<div class="promo-banner">
  <div class="banner-tag">⚡ Fast Track</div>
  <h4>Download in 3 Clicks</h4>
  <p>Copy URL, Paste in SaveFromPro, Tap Download. Done in seconds!</p>
</div>`
      );
      setCustomCss(
`.promo-banner {
  background: #0f172a;
  color: #f8fafc;
  border: 1px solid #334155;
  padding: 1.5rem;
  border-radius: 1rem;
}
.promo-banner h4 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #38bdf8;
  margin: 0.5rem 0;
}
.banner-tag {
  color: #fbbf24;
  font-weight: bold;
  font-size: 0.75rem;
}`
      );
    } else if (type === "card-grid") {
      setCustomHtml(
`<div class="features-custom-grid">
  <div class="f-card">
    <div class="f-icon">🚀</div>
    <h5>Instant CDN</h5>
    <p>Zero wait time</p>
  </div>
  <div class="f-card">
    <div class="f-icon">🔒</div>
    <h5>100% Private</h5>
    <p>No storage kept</p>
  </div>
  <div class="f-card">
    <div class="f-icon">💎</div>
    <h5>True 1080p</h5>
    <p>Lossless audio/video</p>
  </div>
</div>`
      );
      setCustomCss(
`.features-custom-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}
.f-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1rem;
  text-align: center;
}
.f-icon { font-size: 1.75rem; margin-bottom: 0.5rem; }
.f-card h5 { font-weight: 700; margin-bottom: 0.25rem; color: #1e293b; }
.f-card p { font-size: 0.75rem; color: #64748b; }`
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setStatusMessage({ type: "error", text: "Please enter a blog post title." });
      return;
    }

    setSubmitting(true);
    setStatusMessage(null);

    try {
      const payload = {
        title,
        excerpt: excerpt || title,
        category,
        authorName: authorName || "Community Author",
        authorRole: "Contributor",
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        content: [
          {
            type: "intro",
            text: excerpt || title,
          },
          ...(bodyText.trim()
            ? [
                {
                  type: "paragraph",
                  text: bodyText.trim(),
                },
              ]
            : []),
        ],
        custom_html: customHtml,
        custom_css: customCss,
        createdBy: "user",
      };

      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to publish blog post");
      }

      setStatusMessage({
        type: "success",
        text: "Blog post published successfully! Redirecting to post...",
      });

      setTimeout(() => {
        router.push(`/blog/${data.blog.slug}`);
      }, 1200);
    } catch (err) {
      setStatusMessage({ type: "error", text: err.message });
      setSubmitting(false);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto transition-colors duration-200">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Blog & Guide Creator</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Create a <span className="gradient-text">Blog Article</span>
            </h1>
            <p className="text-slate-600 dark:text-gray-400 text-sm mt-1">
              Publish video downloading guides, custom tutorials, or insert your own HTML and CSS styles.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("editor")}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all ${
                activeTab === "editor"
                  ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                  : "bg-white dark:bg-gray-900 text-slate-700 dark:text-gray-300 border-slate-200 dark:border-gray-800 hover:bg-slate-50"
              }`}
            >
              <Code2 className="w-4 h-4" />
              Editor & Code
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all ${
                activeTab === "preview"
                  ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                  : "bg-white dark:bg-gray-900 text-slate-700 dark:text-gray-300 border-slate-200 dark:border-gray-800 hover:bg-slate-50"
              }`}
            >
              <Eye className="w-4 h-4" />
              Live Preview
            </button>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800"
              : "bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-800"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Editor & Preview Split or Tabs */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {activeTab === "editor" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Form & Code */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Meta */}
              <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-gray-800 text-slate-800 dark:text-white font-bold text-sm">
                  <FileText className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  <span>Article Details</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1.5">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Ultimate Guide to 4K TikTok Video Downloads"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1.5">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      <option value="Tutorials">Tutorials</option>
                      <option value="Guides">Guides</option>
                      <option value="Tips & Tricks">Tips & Tricks</option>
                      <option value="Community Guides">Community Guides</option>
                      <option value="Updates">Updates</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1.5">
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="e.g., Alex Parker or Your Name"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1.5">
                    Short Excerpt / Intro
                  </label>
                  <textarea
                    rows={2}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="A brief 1-2 sentence overview of what readers will learn..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1.5">
                    Main Guide Paragraphs
                  </label>
                  <textarea
                    rows={4}
                    value={bodyText}
                    onChange={(e) => setBodyText(e.target.value)}
                    placeholder="Write detailed instructions, platform recommendations, or steps here..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>

              {/* Custom HTML Code Editor */}
              <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-sm">
                    <Code2 className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    <span>Custom HTML Snippet</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-gray-400">Templates:</span>
                    <button
                      type="button"
                      onClick={() => handleTemplateInsert("banner")}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-gray-800 hover:bg-violet-100 dark:hover:bg-violet-900/30 text-xs font-medium text-slate-700 dark:text-gray-300 transition-colors"
                    >
                      Banner
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTemplateInsert("card-grid")}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-gray-800 hover:bg-violet-100 dark:hover:bg-violet-900/30 text-xs font-medium text-slate-700 dark:text-gray-300 transition-colors"
                    >
                      Grid
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-gray-400">
                  You can design custom layout boxes, stats matrices, download badges, or interactive cards in raw HTML.
                </p>

                <textarea
                  rows={8}
                  value={customHtml}
                  onChange={(e) => setCustomHtml(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-gray-700 bg-slate-900 text-emerald-400 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="<div>...Your custom HTML here...</div>"
                />
              </div>

              {/* Custom CSS Code Editor */}
              <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-gray-800 text-slate-800 dark:text-white font-bold text-sm">
                  <Palette className="w-4 h-4 text-fuchsia-600 dark:text-fuchsia-400" />
                  <span>Custom CSS Styling</span>
                </div>

                <p className="text-xs text-slate-500 dark:text-gray-400">
                  Write scoped CSS classes to style your custom HTML component (gradients, borders, flexbox, animations).
                </p>

                <textarea
                  rows={8}
                  value={customCss}
                  onChange={(e) => setCustomCss(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-gray-700 bg-slate-900 text-fuchsia-300 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder=".my-class { color: red; ... }"
                />
              </div>
            </div>

            {/* Right 1 Col: Quick Settings & Live Mini Preview */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-gray-800 text-slate-800 dark:text-white font-bold text-sm">
                  <Layers className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  <span>Publishing Options</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1.5">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold text-sm shadow-md shadow-violet-600/25 transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? "Publishing Post..." : "Publish Blog Post"}</span>
                  </button>
                </div>
              </div>

              {/* Side Live HTML/CSS Preview */}
              <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white">
                    <Eye className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Live Style Preview</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold">
                    Real-time
                  </span>
                </div>

                {customCss && (
                  <style dangerouslySetInnerHTML={{ __html: customCss }} />
                )}

                <div
                  className="p-3 border border-slate-100 dark:border-gray-800 rounded-xl bg-slate-50/50 dark:bg-gray-800/30 overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: customHtml || "<p class='text-xs text-gray-400'>No HTML entered yet</p>" }}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Full Page Preview Tab */
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
            <div className="border-b border-slate-100 dark:border-gray-800 pb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 text-xs font-semibold rounded-lg bg-violet-100 text-violet-700 border border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-700">
                  {category}
                </span>
                <span className="text-xs text-slate-500 dark:text-gray-400">
                  {new Date().toISOString().split("T")[0]}
                </span>
                <span className="text-xs text-slate-500 dark:text-gray-400">
                  3 min read
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                {title || "Untitled Blog Post Preview"}
              </h2>

              <p className="text-base sm:text-lg text-slate-600 dark:text-gray-400 mt-3">
                {excerpt || "Add an excerpt to show a summary intro here."}
              </p>
            </div>

            {bodyText && (
              <p className="text-slate-700 dark:text-gray-300 leading-relaxed text-base">
                {bodyText}
              </p>
            )}

            {/* Custom CSS and HTML preview */}
            {customCss && (
              <style dangerouslySetInnerHTML={{ __html: customCss }} />
            )}

            {customHtml && (
              <div className="p-6 rounded-2xl border border-violet-200 dark:border-violet-900/40 bg-violet-50/20 dark:bg-violet-950/10">
                <div className="text-xs font-bold text-violet-600 dark:text-violet-400 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Custom HTML Component
                </div>
                <div dangerouslySetInnerHTML={{ __html: customHtml }} />
              </div>
            )}

            <div className="pt-6 border-t border-slate-100 dark:border-gray-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-gray-400">
                Author: {authorName || "Community Contributor"}
              </span>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-md transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? "Publishing..." : "Publish Article Now"}</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
