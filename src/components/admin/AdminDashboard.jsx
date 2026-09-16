"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  BarChart3,
  Database,
  AlertTriangle,
  Users,
  FileText,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  Search,
  Filter,
  RefreshCw,
  PlusCircle,
  Eye,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Server,
  Layers,
  Sparkles,
  ChevronRight,
  Code2,
  Palette,
  LogOut,
} from "lucide-react";
import AdminLogin from "./AdminLogin";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState("analytics"); // analytics | db | errors | blogs | users
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  // DB explorer states
  const [tablesList, setTablesList] = useState([]);
  const [selectedTable, setSelectedTable] = useState("downloads");
  const [tableData, setTableData] = useState(null);
  const [loadingTable, setLoadingTable] = useState(false);
  const [dbSearch, setDbSearch] = useState("");
  const [dbStatusFilter, setDbStatusFilter] = useState("all");
  const [dbPlatformFilter, setDbPlatformFilter] = useState("all");

  // Admin blog creator states
  const [showAdminBlogModal, setShowAdminBlogModal] = useState(false);
  const [adminBlogTitle, setAdminBlogTitle] = useState("");
  const [adminBlogCategory, setAdminBlogCategory] = useState("Guides");
  const [adminBlogExcerpt, setAdminBlogExcerpt] = useState("");
  const [adminBlogCustomHtml, setAdminBlogCustomHtml] = useState(
`<div class="admin-notice-card">
  <span class="admin-badge">Admin Official Update</span>
  <h4>High-Speed Cloudflare CDN Routing Active</h4>
  <p>All download endpoints now route via Tier 1 Cloudflare Edge cache.</p>
</div>`
  );
  const [adminBlogCustomCss, setAdminBlogCustomCss] = useState(
`.admin-notice-card {
  background: #1e1b4b;
  border: 1px solid #4338ca;
  border-radius: 1rem;
  padding: 1.5rem;
  color: #e0e7ff;
}
.admin-badge {
  background: #4f46e5;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  display: inline-block;
  margin-bottom: 0.5rem;
}
.admin-notice-card h4 {
  color: #a5b4fc;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}`
  );
  const [blogSubmitting, setBlogSubmitting] = useState(false);
  const [adminBlogsList, setAdminBlogsList] = useState([]);

  // Fetch analytics
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoadingAnalytics(true);
      const res = await fetch("/api/admin/analytics");
      const json = await res.json();
      if (json.success) {
        setAnalytics(json.data);
      }
    } catch (e) {
      console.error("Analytics fetch failed:", e);
    } finally {
      setLoadingAnalytics(false);
    }
  }, []);

  // Fetch tables list
  const fetchTablesList = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/db");
      const json = await res.json();
      if (json.success) {
        setTablesList(json.tables || []);
      }
    } catch (e) {
      console.error("DB tables list fetch failed:", e);
    }
  }, []);

  // Fetch specific table data
  const fetchTableData = useCallback(async () => {
    if (!selectedTable) return;
    try {
      setLoadingTable(true);
      let url = `/api/admin/db?table=${selectedTable}&search=${encodeURIComponent(dbSearch)}&status=${dbStatusFilter}&platform=${dbPlatformFilter}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setTableData(json);
      }
    } catch (e) {
      console.error("Table data fetch failed:", e);
    } finally {
      setLoadingTable(false);
    }
  }, [selectedTable, dbSearch, dbStatusFilter, dbPlatformFilter]);

  // Fetch all blogs
  const fetchBlogs = useCallback(async () => {
    try {
      const res = await fetch("/api/blogs");
      const json = await res.json();
      if (json.success) {
        setAdminBlogsList(json.posts || []);
      }
    } catch (e) {
      console.error("Blogs fetch error:", e);
    }
  }, []);

  // Check admin session
  const checkAuth = useCallback(async () => {
    try {
      setCheckingAuth(true);
      const res = await fetch("/api/admin/auth");
      if (res.ok) {
        const json = await res.json();
        if (json.authenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (e) {
      setIsAuthenticated(false);
    } finally {
      setCheckingAuth(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      setIsAuthenticated(false);
      setAnalytics(null);
      setTableData(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics();
      fetchTablesList();
      fetchBlogs();
    }
  }, [isAuthenticated, fetchAnalytics, fetchTablesList, fetchBlogs]);

  useEffect(() => {
    if (isAuthenticated && (activeTab === "db" || activeTab === "errors")) {
      fetchTableData();
    }
  }, [isAuthenticated, activeTab, selectedTable, fetchTableData]);

  // Handle Admin Blog Submit
  const handleCreateAdminBlog = async (e) => {
    e.preventDefault();
    if (!adminBlogTitle.trim()) return;

    setBlogSubmitting(true);
    try {
      const payload = {
        title: adminBlogTitle,
        excerpt: adminBlogExcerpt || adminBlogTitle,
        category: adminBlogCategory,
        authorName: "System Administrator",
        authorRole: "Platform Admin",
        tags: ["System", "Admin", adminBlogCategory],
        content: [
          {
            type: "intro",
            text: adminBlogExcerpt || adminBlogTitle,
          },
        ],
        custom_html: adminBlogCustomHtml,
        custom_css: adminBlogCustomCss,
        createdBy: "admin",
        featured: true,
      };

      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setShowAdminBlogModal(false);
        setAdminBlogTitle("");
        setAdminBlogExcerpt("");
        fetchBlogs();
        fetchAnalytics();
      }
    } catch (err) {
      alert("Error publishing blog: " + err.message);
    } finally {
      setBlogSubmitting(false);
    }
  };

  const handleDeleteBlog = async (slugOrId) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      const res = await fetch(`/api/blogs?id=${slugOrId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchBlogs();
        fetchAnalytics();
      }
    } catch (e) {
      alert("Failed to delete post: " + e.message);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-violet-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">
          Verifying administrator authorization...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={() => {
          setIsAuthenticated(true);
          fetchAnalytics();
          fetchTablesList();
          fetchBlogs();
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-3xl p-6 sm:p-8 text-white border border-indigo-900/50 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Management & Monitoring System</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              SaveFromPro <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">Admin Dashboard</span>
            </h1>
            <p className="text-indigo-200/80 text-sm sm:text-base mt-2 max-w-2xl">
              Live metrics, database table inspection, error diagnostics, active online user tracking, and blog publishing control.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                fetchAnalytics();
                fetchTableData();
                fetchBlogs();
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold backdrop-blur-sm transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Data</span>
            </button>
            <button
              onClick={() => setShowAdminBlogModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-xs font-semibold shadow-lg shadow-violet-500/25 transition-all text-white"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Admin Blog</span>
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 text-xs font-semibold backdrop-blur-sm transition-all"
              title="Log out of admin portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Quick KPI ribbon */}
        {analytics && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-indigo-900/60">
            <div>
              <span className="text-xs text-indigo-300/80">Active Users Online</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-2xl font-bold text-white">{analytics.activeUsers.toLocaleString()}</span>
              </div>
            </div>
            <div>
              <span className="text-xs text-indigo-300/80">Total Downloads</span>
              <div className="text-2xl font-bold text-white mt-1">{analytics.totalDownloads.toLocaleString()}</div>
            </div>
            <div>
              <span className="text-xs text-indigo-300/80">Success Rate</span>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{analytics.successRate}%</div>
            </div>
            <div>
              <span className="text-xs text-indigo-300/80">Logged Errors</span>
              <div className="text-2xl font-bold text-rose-400 mt-1">{analytics.failedDownloads.toLocaleString()}</div>
            </div>
          </div>
        )}
      </div>

      {/* Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-gray-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "analytics"
              ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
              : "text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics & Performance</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("db");
            setSelectedTable("downloads");
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "db"
              ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
              : "text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800"
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Database Explorer (&quot;Check the DB&quot;)</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("errors");
            setSelectedTable("errors");
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "errors"
              ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
              : "text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Error & Failure Diagnostics</span>
        </button>

        <button
          onClick={() => setActiveTab("blogs")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "blogs"
              ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
              : "text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Blog Management ({adminBlogsList.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("users");
            setSelectedTable("users");
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "users"
              ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
              : "text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User & Visitor Tracking</span>
        </button>
      </div>

      {/* TAB 1: ANALYTICS & PERFORMANCE */}
      {activeTab === "analytics" && analytics && (
        <div className="space-y-8">
          {/* Main KPI cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between text-slate-500 dark:text-gray-400 text-xs font-medium mb-2">
                <span>Total Downloads</span>
                <TrendingUp className="w-4 h-4 text-violet-500" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {analytics.totalDownloads.toLocaleString()}
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-2 flex items-center gap-1">
                <span>+{analytics.todayDownloads} downloads today</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between text-slate-500 dark:text-gray-400 text-xs font-medium mb-2">
                <span>Success Ratio</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {analytics.successRate}%
              </div>
              <div className="text-xs text-slate-500 dark:text-gray-400 mt-2">
                {analytics.successfulDownloads.toLocaleString()} successful saves
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between text-slate-500 dark:text-gray-400 text-xs font-medium mb-2">
                <span>Failed Downloads (Errors)</span>
                <XCircle className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">
                {analytics.failedDownloads.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 dark:text-gray-400 mt-2">
                Private links, expired tokens, or bad URLs
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between text-slate-500 dark:text-gray-400 text-xs font-medium mb-2">
                <span>Users Online Right Now</span>
                <Users className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping inline-block" />
                <span>{analytics.activeUsers.toLocaleString()}</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-gray-400 mt-2">
                {analytics.totalUsers.toLocaleString()} cumulative tracked visitors
              </div>
            </div>
          </div>

          {/* Platform Performance Bars */}
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-violet-500" />
              <span>Downloads Breakdown by Platform</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(analytics.platforms).map(([plat, count]) => {
                const pct = ((count / (analytics.totalDownloads || 1)) * 100).toFixed(1);
                return (
                  <div key={plat} className="p-3 bg-slate-50 dark:bg-gray-800/50 rounded-xl border border-slate-100 dark:border-gray-800">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-gray-200 mb-1.5">
                      <span className="capitalize">{plat}</span>
                      <span>{count.toLocaleString()} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-gray-700 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                        style={{ width: `${Math.min(parseFloat(pct) * 2.5, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Downloads Feed (Success & Error states) */}
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-violet-500" />
                <span>Live Downloads & Activity Stream</span>
              </h3>
              <span className="text-xs text-slate-500 dark:text-gray-400">
                Showing latest attempts
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-gray-300">
                <thead className="bg-slate-50 dark:bg-gray-800/60 uppercase font-semibold text-[11px] text-slate-500 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3 rounded-l-xl">Status</th>
                    <th className="px-4 py-3">Platform</th>
                    <th className="px-4 py-3">Title / Target</th>
                    <th className="px-4 py-3">Quality</th>
                    <th className="px-4 py-3">IP Hash</th>
                    <th className="px-4 py-3 rounded-r-xl">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-gray-800/60">
                  {analytics.recentDownloads && analytics.recentDownloads.length > 0 ? (
                    analytics.recentDownloads.map((dl) => (
                      <tr key={dl.id} className="hover:bg-slate-50/50 dark:hover:bg-gray-800/30">
                        <td className="px-4 py-3 whitespace-nowrap">
                          {dl.status === "success" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-[11px] font-bold">
                              <CheckCircle2 className="w-3 h-3" />
                              Success
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 text-[11px] font-bold">
                              <XCircle className="w-3 h-3" />
                              Failed
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-800 dark:text-white capitalize">
                          {dl.platform}
                        </td>
                        <td className="px-4 py-3 max-w-xs truncate">
                          {dl.media_title || dl.error_message || dl.url}
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px]">
                          {dl.quality || "—"}
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] text-slate-400">
                          {dl.ip_hash || "anon"}
                        </td>
                        <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                          {new Date(dl.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-slate-400 dark:text-gray-500">
                        No downloads recorded yet. Real download activity will appear here as users download media.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DATABASE EXPLORER ("Check the DB") */}
      {activeTab === "db" && (
        <div className="space-y-6">
          {/* Table Selector Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {tablesList.map((t) => (
              <button
                key={t.name}
                onClick={() => {
                  setSelectedTable(t.name);
                  setDbSearch("");
                  setDbStatusFilter("all");
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  selectedTable === t.name
                    ? "bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-600/20"
                    : "bg-white dark:bg-gray-900 text-slate-800 dark:text-gray-200 border-slate-200 dark:border-gray-800 hover:border-violet-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Database className={`w-4 h-4 ${selectedTable === t.name ? "text-white" : "text-violet-500"}`} />
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${selectedTable === t.name ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-gray-800 text-slate-500"}`}>
                    {t.rowCount} rows
                  </span>
                </div>
                <div className="font-bold text-xs capitalize truncate">{t.name}</div>
              </button>
            ))}
          </div>

          {/* Table Inspector Container */}
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-gray-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white capitalize">
                    Table: <span className="text-violet-600 dark:text-violet-400">{selectedTable}</span>
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-300 font-mono">
                    {tableData?.totalCount ?? 0} total records
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                  Direct table records from active database schema and edge cache.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search table rows..."
                    value={dbSearch}
                    onChange={(e) => setDbSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>

                {selectedTable === "downloads" && (
                  <select
                    value={dbStatusFilter}
                    onChange={(e) => setDbStatusFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="success">Success Only</option>
                    <option value="error">Errors Only</option>
                  </select>
                )}

                <button
                  onClick={fetchTableData}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 text-slate-700 dark:text-gray-300 text-xs transition-colors"
                  title="Reload table"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingTable ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>

            {/* Table Schema Ribbon */}
            {tableData?.schema && tableData.schema.length > 0 && (
              <div className="p-3 bg-slate-50 dark:bg-gray-800/40 rounded-xl border border-slate-100 dark:border-gray-800 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500 dark:text-gray-400 mr-2">Schema:</span>
                {tableData.schema.map((col) => (
                  <span key={col.name} className="px-2 py-0.5 rounded bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 text-[10px] font-mono text-slate-700 dark:text-gray-300">
                    <strong>{col.name}</strong> <span className="text-slate-400">({col.type})</span>
                  </span>
                ))}
              </div>
            )}

            {/* Live Rows Table */}
            <div className="overflow-x-auto border border-slate-100 dark:border-gray-800 rounded-xl">
              <table className="w-full text-left text-xs text-slate-600 dark:text-gray-300">
                <thead className="bg-slate-50 dark:bg-gray-800/80 uppercase font-semibold text-[11px] text-slate-500 dark:text-gray-400">
                  <tr>
                    {tableData?.schema?.map((col) => (
                      <th key={col.name} className="px-4 py-3 whitespace-nowrap">
                        {col.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {loadingTable ? (
                    <tr>
                      <td colSpan={tableData?.schema?.length || 5} className="px-4 py-8 text-center text-slate-400">
                        Loading table data...
                      </td>
                    </tr>
                  ) : !tableData?.rows || tableData.rows.length === 0 ? (
                    <tr>
                      <td colSpan={tableData?.schema?.length || 5} className="px-4 py-8 text-center text-slate-400">
                        No rows found matching the search criteria.
                      </td>
                    </tr>
                  ) : (
                    tableData.rows.map((row, idx) => (
                      <tr key={row.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-gray-800/30">
                        {tableData.schema.map((col) => {
                          const val = row[col.name];
                          return (
                            <td key={col.name} className="px-4 py-2.5 max-w-xs truncate font-mono text-[11px]">
                              {col.name === "status" ? (
                                val === "success" ? (
                                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 font-sans font-bold text-[10px]">
                                    success
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 font-sans font-bold text-[10px]">
                                    error
                                  </span>
                                )
                              ) : typeof val === "boolean" ? (
                                val ? "true" : "false"
                              ) : val !== null && val !== undefined ? (
                                String(val)
                              ) : (
                                <span className="text-slate-300 dark:text-gray-600">null</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ERROR & FAILURE DIAGNOSTICS */}
      {activeTab === "errors" && (
        <div className="space-y-6">
          <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-2xl p-5 flex items-start gap-4">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-rose-900 dark:text-rose-200">
                Download Error & Exception Diagnostic Logs
              </h4>
              <p className="text-xs text-rose-800/80 dark:text-rose-300/80 mt-0.5">
                Every failed attempt (invalid format, restricted post, scraper timeout, network error) is automatically captured with error diagnostics.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Failure Event Logs
            </h3>

            <div className="overflow-x-auto border border-slate-100 dark:border-gray-800 rounded-xl">
              <table className="w-full text-left text-xs text-slate-600 dark:text-gray-300">
                <thead className="bg-slate-50 dark:bg-gray-800/80 uppercase font-semibold text-[11px] text-slate-500 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3">Error Type</th>
                    <th className="px-4 py-3">Platform</th>
                    <th className="px-4 py-3">Diagnostic Message</th>
                    <th className="px-4 py-3">Target URL</th>
                    <th className="px-4 py-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {analytics?.recentErrors && analytics.recentErrors.length > 0 ? (
                    analytics.recentErrors.map((err) => (
                      <tr key={err.id} className="hover:bg-slate-50/50 dark:hover:bg-gray-800/30">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 font-mono text-[10px] font-bold">
                            {err.type || "ERROR"}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white capitalize">
                          {err.platform || "unknown"}
                        </td>
                        <td className="px-4 py-3 text-rose-700 dark:text-rose-300 font-medium max-w-sm">
                          {err.message}
                        </td>
                        <td className="px-4 py-3 text-slate-400 max-w-xs truncate font-mono text-[11px]">
                          {err.url || "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                          {new Date(err.timestamp).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-slate-400 dark:text-gray-500">
                        No system errors logged. System is operating normally with zero failures.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BLOG MANAGEMENT */}
      {activeTab === "blogs" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Platform Articles & Tutorials
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                Manage built-in articles, user community guides, or author new blogs with custom HTML and CSS.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/blog/create"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 text-slate-800 dark:text-white text-xs font-semibold transition-colors"
              >
                <Code2 className="w-4 h-4" />
                <span>Open Full HTML/CSS Studio</span>
              </Link>
              <button
                onClick={() => setShowAdminBlogModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publish as Admin</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminBlogsList.map((post) => (
              <div
                key={post.slug}
                className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 text-[11px] font-semibold">
                      {post.category}
                    </span>
                    {post.custom_html && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 font-mono font-bold">
                        HTML + CSS
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2 line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-gray-400 line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-gray-800 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    By {post.author?.name || "Author"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-violet-600 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
                      title="View Article"
                      target="_blank"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    {post.createdBy && (
                      <button
                        onClick={() => handleDeleteBlog(post.id || post.slug)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: USER & VISITOR TRACKING */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm">
              <span className="text-xs text-slate-500 dark:text-gray-400">Active Online Users</span>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping inline-block" />
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {analytics?.activeUsers ?? 0}
                </span>
              </div>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1 block">
                Active in last 15 minutes
              </span>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm">
              <span className="text-xs text-slate-500 dark:text-gray-400">Total Unique Visitors</span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
                {(analytics?.totalUsers ?? 0).toLocaleString()}
              </div>
              <span className="text-xs text-slate-500 mt-1 block">
                Tracked sessions &amp; IP signatures
              </span>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm">
              <span className="text-xs text-slate-500 dark:text-gray-400">Retention &amp; Repeat Visits</span>
              <div className="text-3xl font-extrabold text-violet-600 dark:text-violet-400 mt-2">
                {analytics?.repeatRate ?? 0}%
              </div>
              <span className="text-xs text-slate-500 mt-1 block">
                {analytics?.repeatVisitors ?? 0} repeat users out of {analytics?.totalUsers ?? 0} total
              </span>
            </div>
          </div>

          {/* Active Visitor Session Table */}
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Tracked Visitor Profiles & Signatures
            </h3>

            <div className="overflow-x-auto border border-slate-100 dark:border-gray-800 rounded-xl">
              <table className="w-full text-left text-xs text-slate-600 dark:text-gray-300">
                <thead className="bg-slate-50 dark:bg-gray-800/80 uppercase font-semibold text-[11px] text-slate-500 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3">Visitor ID / Hash</th>
                    <th className="px-4 py-3">Country</th>
                    <th className="px-4 py-3">Browser / Device</th>
                    <th className="px-4 py-3">Total Visits</th>
                    <th className="px-4 py-3">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {tableData?.rows?.length > 0 && selectedTable === "users" ? (
                    tableData.rows.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-gray-800/30">
                        <td className="px-4 py-3 font-mono text-[11px] font-bold text-violet-600 dark:text-violet-400">
                          {u.ip_hash || u.id}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-800 dark:text-white">
                          {u.country || "Global"}
                        </td>
                        <td className="px-4 py-3 text-slate-500 max-w-xs truncate">
                          {u.user_agent}
                        </td>
                        <td className="px-4 py-3 font-mono">
                          {u.visits_count || 1}
                        </td>
                        <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                          {new Date(u.last_seen).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                        Select users table or refresh to inspect live sessions.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Admin Blog Creation Modal */}
      {showAdminBlogModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Publish Admin Blog Article
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 mb-6">
              Create an official announcement or guide with custom HTML and CSS.
            </p>

            <form onSubmit={handleCreateAdminBlog} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={adminBlogTitle}
                  onChange={(e) => setAdminBlogTitle(e.target.value)}
                  placeholder="e.g., SaveFromPro v2 Released with 4K Support"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={adminBlogCategory}
                    onChange={(e) => setAdminBlogCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                    Excerpt
                  </label>
                  <input
                    type="text"
                    value={adminBlogExcerpt}
                    onChange={(e) => setAdminBlogExcerpt(e.target.value)}
                    placeholder="Short summary..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                  Custom HTML Component
                </label>
                <textarea
                  rows={4}
                  value={adminBlogCustomHtml}
                  onChange={(e) => setAdminBlogCustomHtml(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-gray-700 bg-slate-900 text-emerald-400 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                  Custom CSS Styling
                </label>
                <textarea
                  rows={4}
                  value={adminBlogCustomCss}
                  onChange={(e) => setAdminBlogCustomCss(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-gray-700 bg-slate-900 text-fuchsia-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowAdminBlogModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={blogSubmitting}
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50"
                >
                  {blogSubmitting ? "Publishing..." : "Publish Admin Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
