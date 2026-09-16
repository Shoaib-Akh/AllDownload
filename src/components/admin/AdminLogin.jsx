"use client";

import { useState } from "react";
import { Shield, Lock, User, Eye, EyeOff, AlertCircle, ArrowRight, KeyRound } from "lucide-react";

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed. Please check your credentials.");
      }

      // Store in memory / trigger parent update
      if (typeof onLoginSuccess === "function") {
        onLoginSuccess();
      }
    } catch (err) {
      setError(err.message || "Invalid administrator credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDefaults = () => {
    setUsername("admin");
    setPassword("admin123");
    setError("");
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Decorative backdrop gradients */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center">
          <div className="mx-auto w-14 h-14 bg-gradient-to-tr from-violet-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30 mb-4 transform hover:scale-105 transition-transform duration-200">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Administrator Portal
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-gray-400 max-w-sm mx-auto">
            Authenticate with secure admin credentials to access live metrics, database explorer, and diagnostic tools.
          </p>
        </div>

        {error && (
          <div className="relative z-10 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-3 text-rose-700 dark:text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative z-10 space-y-5 mt-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-1.5">
              Admin Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-gray-200 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-500 hover:via-purple-500 hover:to-pink-500 shadow-lg shadow-violet-500/25 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Help & Credentials reference */}
        <div className="relative z-10 pt-4 border-t border-slate-100 dark:border-gray-800 text-center">
          <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 dark:bg-gray-800/50 border border-slate-200/80 dark:border-gray-800 text-left">
            <div>
              <div className="text-[11px] font-semibold text-slate-700 dark:text-gray-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-violet-500" />
                <span>Default Local Credentials</span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5 font-mono">
                admin / admin123
              </div>
            </div>
            <button
              type="button"
              onClick={handleFillDefaults}
              className="text-[11px] font-bold text-violet-600 dark:text-violet-400 hover:underline px-2 py-1 rounded hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors"
            >
              Autofill
            </button>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-gray-500 mt-2">
            Credentials can be changed in <code className="font-mono text-violet-600 dark:text-violet-400">.env.local</code> via <code className="font-mono">ADMIN_USERNAME</code> &amp; <code className="font-mono">ADMIN_PASSWORD</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
