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

  const triggerDownload = useCallback(async (mediaItem, title = "SaveFromPro_Video") => {
    if (!mediaItem || !mediaItem.url) return;

    // downloadUrl IS the direct CDN URL (set by createMediaResponse)
    const directUrl = mediaItem.downloadUrl || mediaItem.url;
    const safeTitle = title.slice(0, 40).replace(/[^a-zA-Z0-9_-]/g, "_");
    const ext = mediaItem.format || "mp4";
    const filename = `${safeTitle}.${ext}`;

    setState((prev) => ({
      ...prev,
      status: "downloading",
      downloadProgress: 0,
      activeItemUrl: mediaItem.url,
    }));

    try {
      // Attempt fetch so we can show real progress from Content-Length
      const response = await fetch(directUrl, { method: "GET" });

      if (!response.ok) throw new Error("fetch_failed");

      const contentLength = response.headers.get("content-length");
      const total = contentLength ? parseInt(contentLength, 10) : 0;

      // Read body as a stream to show progress
      const reader = response.body?.getReader();
      const chunks = [];
      let received = 0;

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          received += value.length;
          if (total > 0) {
            setState((prev) => ({
              ...prev,
              downloadProgress: Math.min(99, Math.round((received / total) * 100)),
            }));
          }
        }
      } else {
        // No streaming support — read all at once
        const buffer = await response.arrayBuffer();
        chunks.push(new Uint8Array(buffer));
        received = buffer.byteLength;
      }

      // Build blob and save
      const contentType =
        response.headers.get("content-type") || "application/octet-stream";
      const blob = new Blob(chunks, { type: contentType });
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke after a short delay
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000);

      setState((prev) => ({
        ...prev,
        status: "completed",
        downloadProgress: 100,
        activeItemUrl: null,
      }));
    } catch {
      // CORS or network error — open CDN URL in a new tab as fallback.
      // The file is served by the platform CDN; Cloudflare sends no video bytes.
      window.open(directUrl, "_blank", "noopener,noreferrer");

      setState((prev) => ({
        ...prev,
        status: "completed",
        downloadProgress: 100,
        activeItemUrl: null,
      }));
    }
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
