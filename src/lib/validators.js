import { PLATFORMS } from './constants.js';

export function validateUrl(url, platformSlug = null) {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'Please enter a URL' };
  }

  url = url.trim();

  try {
    new URL(url);
  } catch {
    return { valid: false, error: 'Please enter a valid URL' };
  }

  if (platformSlug) {
    const platform = PLATFORMS.find(p => p.slug === platformSlug);
    if (platform && !platform.urlPattern.test(url)) {
      return { valid: false, error: `This does not look like a ${platform.name} URL` };
    }
  } else {
    const detected = PLATFORMS.find(p => p.urlPattern.test(url));
    if (!detected) {
      return { valid: false, error: 'This URL is not from a supported platform' };
    }
  }

  return { valid: true, error: null };
}

export function getPlatformFromUrl(url) {
  if (!url) return null;
  return PLATFORMS.find(p => p.urlPattern.test(url)) || null;
}
