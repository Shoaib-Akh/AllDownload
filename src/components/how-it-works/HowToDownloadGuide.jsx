"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  Download,
  Copy,
  FolderCheck,
  CheckCircle2,
  ArrowRight,
  Search,
  ExternalLink,
  ChevronRight,
  Info,
} from "lucide-react";

export default function HowToDownloadGuide() {
  const [activeTab, setActiveTab] = useState("all");

  const allDevicesSteps = [
    {
      num: "01",
      title: "Find the Snapchat video",
      description:
        "Open the public post you want to save. Only publicly shared content can be downloaded — friends-only and private posts are not accessible.",
      icon: Search,
    },
    {
      num: "02",
      title: "Copy the video link",
      description:
        'Tap the Share icon, then select "Copy Link." On a browser, copy the URL directly from the address bar.',
      icon: Copy,
    },
    {
      num: "03",
      title: "Visit SaveFromPro",
      description:
        "Open savefrompro.com in any browser. No account, no app, nothing to install.",
      icon: Globe,
    },
    {
      num: "04",
      title: "Paste and download",
      description:
        "Paste the link into the input field, choose the quality, and click Download. The file saves to your device immediately.",
      icon: Download,
    },
    {
      num: "05",
      title: "Find your file",
      description:
        "Check your Downloads folder, Gallery (Android) or Files app (iPhone). See the device-specific steps below for exact file paths.",
      icon: FolderCheck,
    },
  ];

  const iphoneSteps = [
    {
      num: "01",
      title: "Open Safari on your iPhone",
      description:
        "Safari saves files directly without needing any extra confirmation steps that Chrome sometimes throws at you.",
      icon: Globe,
    },
    {
      num: "02",
      title: "Go to savefrompro.com",
      description:
        "Type it in the address bar or tap the link from wherever you found it. No sign-up, no pop-ups — just the tool.",
      icon: ExternalLink,
    },
    {
      num: "03",
      title: "Paste your Snapchat link",
      description:
        "Tap the Paste button for one-tap clipboard access, or long-press the input box and tap Paste manually.",
      icon: Copy,
    },
    {
      num: "04",
      title: "Tap Download",
      description:
        'Safari may ask "Download Linked File?" — tap Download to confirm. The file saves in the background.',
      icon: Download,
    },
    {
      num: "05",
      title: "Find it in the Files app",
      description:
        "Open the Files app → On My iPhone → Downloads. To move it to Photos, long-press the file and tap Share → Save Video.",
      icon: FolderCheck,
    },
  ];

  const androidSteps = [
    {
      num: "01",
      title: "Open Chrome on Android",
      description:
        "Any modern Android browser works. Chrome is the most consistent for file downloads.",
      icon: Globe,
    },
    {
      num: "02",
      title: "Go to savefrompro.com",
      description:
        "Loads instantly. No notification prompts, no redirects to ad pages.",
      icon: ExternalLink,
    },
    {
      num: "03",
      title: "Paste your link",
      description:
        "Tap the Paste button or long-press the input field and choose Paste.",
      icon: Copy,
    },
    {
      num: "04",
      title: "Tap Download",
      description:
        "Select the quality (HD or SD) and tap Download. The file saves automatically to your device.",
      icon: Download,
    },
    {
      num: "05",
      title: "Find it in Files or Gallery",
      description:
        "Open Files by Google (or your file manager) → Downloads. The video also appears in your Gallery app under the Downloads album.",
      icon: FolderCheck,
    },
  ];

  const desktopSteps = [
    {
      num: "01",
      title: "Open any browser",
      description:
        "Chrome, Firefox, Edge, Safari on Mac — all work identically. Nothing to install.",
      icon: Globe,
    },
    {
      num: "02",
      title: "Go to savefrompro.com",
      description:
        "The download tool is the first thing on the page. No scrolling required.",
      icon: ExternalLink,
    },
    {
      num: "03",
      title: "Paste your link",
      description:
        "Click inside the input field and press Ctrl+V (Windows) or Cmd+V (Mac).",
      icon: Copy,
    },
    {
      num: "04",
      title: "Click Download",
      description:
        "Select HD or SD quality and click the Download button. The file saves to your browser's default Downloads folder.",
      icon: Download,
    },
    {
      num: "05",
      title: "Find your file",
      description:
        "Press Ctrl+J (Windows) or Cmd+Option+L (Mac) to open your browser's download list directly.",
      icon: FolderCheck,
    },
  ];

  const tabs = [
    { id: "all", label: "All Devices", icon: Globe },
    { id: "iphone", label: "iPhone", icon: Smartphone },
    { id: "android", label: "Android", icon: Smartphone },
    { id: "desktop", label: "Desktop", icon: Monitor },
  ];

  return (
    <div className="py-16 sm:py-20 relative overflow-hidden transition-colors duration-200">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-violet-500/10 via-fuchsia-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-semibold uppercase tracking-wider mb-5 transition-colors">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SAVEFROMPRO · COMPLETE 2026 GUIDE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-5 leading-tight transition-colors">
            How to <span className="gradient-text">Download Videos</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed transition-colors mb-8">
            Save any video, on any device. No app. No login. No watermark.
          </p>

          {/* Quick Answer Callout */}
          <div className="max-w-3xl mx-auto p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-violet-500/10 border border-violet-200 dark:border-violet-500/30 backdrop-blur-xl text-left shadow-sm">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-9 h-9 rounded-xl bg-violet-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md shadow-violet-500/30">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-violet-900 dark:text-violet-200 text-base sm:text-lg block mb-1">
                  Quick answer:
                </span>
                <p className="text-slate-700 dark:text-gray-200 text-sm sm:text-base leading-relaxed">
                  Copy a public Snapchat link, paste it into SaveFromPro, click Download. Done in under 30 seconds.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Device Navigation Tabs */}
        <div className="flex items-center justify-center mb-10 overflow-x-auto pb-2">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 dark:bg-gray-900/80 border border-slate-200 dark:border-gray-800 backdrop-blur-md">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-white dark:bg-gray-800 text-violet-600 dark:text-violet-300 shadow-sm border border-slate-200/80 dark:border-gray-700"
                      : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: All Devices */}
        {(activeTab === "all" || activeTab === "all-view") && (
          <div className="space-y-6 mb-16">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                <Globe className="w-7 h-7 text-violet-600 dark:text-violet-400" />
                <span>All Devices</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {allDevicesSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.num}
                    className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-6 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 hover:border-violet-400 dark:hover:border-violet-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-violet-950/10 dark:hover:shadow-violet-950/20"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-black text-slate-300 dark:text-gray-700 font-mono group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors w-10">
                        {step.num}
                      </span>
                      <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-600/10 border border-violet-200 dark:border-violet-500/20 flex items-center justify-center flex-shrink-0 text-violet-600 dark:text-violet-400 group-hover:scale-105 transition-transform shadow-sm">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: iPhone */}
        {activeTab === "iphone" && (
          <div className="space-y-6 mb-16">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                <Smartphone className="w-7 h-7 text-violet-600 dark:text-violet-400" />
                <span>iPhone</span>
              </h2>
            </div>

            {/* Note */}
            <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800/40 flex items-start gap-3 text-slate-700 dark:text-violet-200 text-sm">
              <Info className="w-5 h-5 text-violet-600 dark:text-violet-400 flex-shrink-0 mt-0.5" />
              <span>Safari handles file downloads more reliably than Chrome on iPhone, so use that if you have the choice.</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {iphoneSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.num}
                    className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-6 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 hover:border-violet-400 dark:hover:border-violet-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-violet-950/10 dark:hover:shadow-violet-950/20"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-black text-slate-300 dark:text-gray-700 font-mono group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors w-10">
                        {step.num}
                      </span>
                      <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-600/10 border border-violet-200 dark:border-violet-500/20 flex items-center justify-center flex-shrink-0 text-violet-600 dark:text-violet-400 group-hover:scale-105 transition-transform shadow-sm">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Android */}
        {activeTab === "android" && (
          <div className="space-y-6 mb-16">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                <Smartphone className="w-7 h-7 text-violet-600 dark:text-violet-400" />
                <span>Android</span>
              </h2>
            </div>

            {/* Note */}
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex items-start gap-3 text-slate-700 dark:text-emerald-200 text-sm">
              <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Android is straight forward — downloaded videos land directly in your gallery. Chrome, Firefox, and Samsung Internet all work.</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {androidSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.num}
                    className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-6 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 hover:border-violet-400 dark:hover:border-violet-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-violet-950/10 dark:hover:shadow-violet-950/20"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-black text-slate-300 dark:text-gray-700 font-mono group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors w-10">
                        {step.num}
                      </span>
                      <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-600/10 border border-violet-200 dark:border-violet-500/20 flex items-center justify-center flex-shrink-0 text-violet-600 dark:text-violet-400 group-hover:scale-105 transition-transform shadow-sm">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Desktop */}
        {activeTab === "desktop" && (
          <div className="space-y-6 mb-16">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                <Monitor className="w-7 h-7 text-violet-600 dark:text-violet-400" />
                <span>Desktop</span>
              </h2>
            </div>

            {/* Note */}
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 flex items-start gap-3 text-slate-700 dark:text-blue-200 text-sm">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <span>Works on Chrome, Firefox, Edge, and Safari — no extensions or plugins needed.</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {desktopSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.num}
                    className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-6 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 hover:border-violet-400 dark:hover:border-violet-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-violet-950/10 dark:hover:shadow-violet-950/20"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-black text-slate-300 dark:text-gray-700 font-mono group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors w-10">
                        {step.num}
                      </span>
                      <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-600/10 border border-violet-200 dark:border-violet-500/20 flex items-center justify-center flex-shrink-0 text-violet-600 dark:text-violet-400 group-hover:scale-105 transition-transform shadow-sm">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* All Devices Accordion/Overview for full scrolling completeness */}
        {activeTab !== "all" && (
          <div className="text-center mb-16">
            <button
              onClick={() => setActiveTab("all")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 underline underline-offset-4"
            >
              <span>← Back to All Devices Overview</span>
            </button>
          </div>
        )}

        {/* Device Quick Switch Grid Cards (When on All Devices) */}
        {activeTab === "all" && (
          <div className="mt-14 mb-16">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
              Device-Specific Guides
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <button
                onClick={() => setActiveTab("iphone")}
                className="group p-6 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 hover:border-violet-400 dark:hover:border-violet-500/40 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-600/10 border border-violet-200 dark:border-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-4 group-hover:scale-110 transition-transform">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                  iPhone Guide
                </h4>
                <p className="text-slate-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed mb-4">
                  Safari saves files directly without extra confirmation steps.
                </p>
                <div className="flex items-center text-violet-600 dark:text-violet-400 text-xs font-semibold">
                  <span>View iPhone steps</span>
                  <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </button>

              <button
                onClick={() => setActiveTab("android")}
                className="group p-6 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 hover:border-violet-400 dark:hover:border-violet-500/40 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-600/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                  Android Guide
                </h4>
                <p className="text-slate-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed mb-4">
                  Downloaded videos land directly in your phone gallery.
                </p>
                <div className="flex items-center text-violet-600 dark:text-violet-400 text-xs font-semibold">
                  <span>View Android steps</span>
                  <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </button>

              <button
                onClick={() => setActiveTab("desktop")}
                className="group p-6 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800/80 hover:border-violet-400 dark:hover:border-violet-500/40 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                  <Monitor className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                  Desktop Guide
                </h4>
                <p className="text-slate-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed mb-4">
                  Works on Chrome, Firefox, Edge, Safari on Mac &amp; Windows.
                </p>
                <div className="flex items-center text-violet-600 dark:text-violet-400 text-xs font-semibold">
                  <span>View Desktop steps</span>
                  <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            </div>
          </div>
        )}

        {/* CTA Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-center shadow-xl shadow-violet-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">
            Ready to Download Your Video?
          </h3>
          <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto mb-6">
            Paste any public video link into SaveFromPro and save it in seconds.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-2xl transition-all hover:shadow-lg active:scale-95 text-base"
          >
            <span>Start Downloading Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
