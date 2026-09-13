"use client";

import { useState, useCallback } from "react";

export function useClipboard() {
  const [copied, setCopied] = useState(false);

  const paste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      return text;
    } catch {
      return null;
    }
  }, []);

  const copy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch {
      return false;
    }
  }, []);

  return { paste, copy, copied };
}
