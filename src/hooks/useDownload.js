"use client";

import { useState, useCallback, useEffect } from "react";
import { validateUrl } from "@/lib/validators";

const RECENTS_KEY = "savefrompro_recent_downloads";

export function useDownload() {
  const [state, setState] = useState({
    status: "idle", // 'idle' | 'fetching' | 'fetched' | 'downloading' | 'completed' | 'error'
    result: null,
    error: null,
    downloadProgress: 0,
    activeItemUrl: null,
    copied: false,
  });

  const [recents, setRecents] = useState([]);

  // Load recent downloads from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENTS_KEY);
      if (saved) {
        setRecents(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveToRecents = useCallback((mediaData) => {
    if (!mediaData || !mediaData.title) return;
    try {
      const newItem = {
        id: Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
        title: mediaData.title,
        thumbnail: mediaData.thumbnail || null,
        platform: mediaData.platform || "Video",
        platformSlug: mediaData.platformSlug || "video",
        downloadUrl: mediaData.media?.[0]?.downloadUrl || mediaData.media?.[0]?.url || "",
        timestamp: new Date().toISOString(),
      };

      setRecents((prev) => {
        const filtered = prev.filter((item) => item.title !== newItem.title);
        const updated = [newItem, ...filtered].slice(0, 10);
        localStorage.setItem(RECENTS_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch {
      // ignore storage errors
    }
  }, []);

  const clearRecents = useCallback(() => {
    try {
      localStorage.removeItem(RECENTS_KEY);
      setRecents([]);
    } catch {
      // ignore
    }
  }, []);

  const removeRecent = useCallback((id) => {
    try {
      setRecents((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        localStorage.setItem(RECENTS_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch {
      // ignore
    }
  }, []);

  const fetchInfo = useCallback(async (url, platformSlug = null) => {
    const validation = validateUrl(url, platformSlug);
    if (!validation.valid) {
      setState((prev) => ({
        ...prev,
        status: "error",
        result: null,
        error: validation.error,
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      status: "fetching",
      result: null,
      error: null,
    }));

    try {
      const response = await fetch("/api/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), platform: platformSlug }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setState((prev) => ({
          ...prev,
          status: "error",
          result: null,
          error:
            data.error ||
            "Unable to fetch media from this link. The post might be private, expired, or deleted.",
        }));
        return;
      }

      saveToRecents(data);

      setState((prev) => ({
        ...prev,
        status: "fetched",
        result: data,
        error: null,
      }));
    } catch {
      setState((prev) => ({
        ...prev,
        status: "error",
        result: null,
        error: "Connection timeout. Please check your network and try again.",
      }));
    }
  }, [saveToRecents]);

  const triggerDownload = useCallback((mediaItem, title = "SaveFromPro_Video") => {
    if (!mediaItem || (!mediaItem.url && !mediaItem.downloadUrl)) return;

    const downloadTarget = mediaItem.downloadUrl || mediaItem.url;
    setState((prev) => ({
      ...prev,
      status: "downloading",
      downloadProgress: 15,
      activeItemUrl: mediaItem.url,
    }));

    // Trigger browser download via anchor element
    const link = document.createElement("a");
    link.href = downloadTarget;
    link.download = `${title.slice(0, 40).replace(/[^a-zA-Z0-9_-]/g, "_")}.${mediaItem.format || "mp4"}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Simulated smooth progress feedback for client satisfaction
    const interval = setInterval(() => {
      setState((prev) => {
        if (prev.downloadProgress >= 100) {
          clearInterval(interval);
          return {
            ...prev,
            status: "completed",
            downloadProgress: 100,
            activeItemUrl: null,
          };
        }
        return {
          ...prev,
          downloadProgress: prev.downloadProgress + 25,
        };
      });
    }, 180);
  }, []);

  const copyDownloadLink = useCallback(async (linkUrl) => {
    try {
      await navigator.clipboard.writeText(linkUrl);
      setState((prev) => ({ ...prev, copied: true }));
      setTimeout(() => {
        setState((prev) => ({ ...prev, copied: false }));
      }, 2500);
      return true;
    } catch {
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      status: "idle",
      result: null,
      error: null,
      downloadProgress: 0,
      activeItemUrl: null,
      copied: false,
    });
  }, []);

  return {
    ...state,
    isLoading: state.status === "fetching" || state.status === "downloading",
    isFetching: state.status === "fetching",
    isFetched: state.status === "fetched",
    isDownloading: state.status === "downloading",
    isCompleted: state.status === "completed",
    isError: state.status === "error",
    recents,
    fetchInfo,
    triggerDownload,
    copyDownloadLink,
    clearRecents,
    removeRecent,
    reset,
  };
}
