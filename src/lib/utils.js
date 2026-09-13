import { PLATFORMS } from './constants.js';

export function detectPlatform(url) {
  for (const platform of PLATFORMS) {
    if (platform.urlPattern.test(url)) {
      return platform;
    }
  }
  return null;
}

export function formatFileSize(bytes) {
  if (!bytes) return 'Unknown';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

export function formatDuration(seconds) {
  if (!seconds) return '';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function slugToTitle(slug) {
  if (slug === 'twitter') return 'Twitter / X';
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}
