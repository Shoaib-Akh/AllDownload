import {
  fetchWithTimeout,
  extractMetaTags,
  createMediaResponse,
} from "./base.js";

/**
 * Vimeo Video Downloader Service
 */
export async function extractVimeoMedia(url) {
  try {
    const idMatch =
      url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|video\/|)(\d+)/i) ||
      url.match(/vimeo\.com\/(\d+)/i);

    const videoId = idMatch ? idMatch[1] || idMatch[2] : null;

    if (!videoId) {
      throw new Error("Could not find a valid Vimeo video ID in URL.");
    }

    let title = "Vimeo Video";
    let thumbnail = null;
    let author = null;
    let duration = null;
    const mediaList = [];

    // Method 1: Vimeo Player Config API
    try {
      const configUrl = `https://player.vimeo.com/video/${videoId}/config`;
      const configRes = await fetchWithTimeout(configUrl);

      if (configRes.ok) {
        const config = await configRes.json();
        const v = config.video;

        if (v) {
          title = v.title || title;
          thumbnail = v.thumbs?.["640"] || v.thumbs?.["1280"] || v.thumbs?.base || null;
          author = v.owner?.name ? `@${v.owner.name}` : null;
          duration = v.duration ? `${Math.floor(v.duration / 60)}:${(v.duration % 60).toString().padStart(2, "0")}` : null;
        }

        // Extract progressive MP4 streams
        const files = config.request?.files?.progressive;
        if (Array.isArray(files)) {
          const sorted = [...files].sort((a, b) => (b.height || 0) - (a.height || 0));

          for (const file of sorted) {
            if (file.url) {
              mediaList.push({
                quality: `${file.quality || file.height + "p"} HD (${file.fps || 30}fps)`,
                type: "video",
                format: "mp4",
                url: file.url,
              });
            }
          }
        }
      }
    } catch {
      // Fallback
    }

    // Method 2: Vimeo oEmbed fallback
    if (mediaList.length === 0) {
      try {
        const oembedUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`;
        const oembedRes = await fetchWithTimeout(oembedUrl);

        if (oembedRes.ok) {
          const oembed = await oembedRes.json();
          title = oembed.title || title;
          thumbnail = oembed.thumbnail_url || thumbnail;
          author = oembed.author_name ? `@${oembed.author_name}` : author;
          duration = oembed.duration ? `${Math.floor(oembed.duration / 60)}:${(oembed.duration % 60).toString().padStart(2, "0")}` : null;
        }
      } catch {
        // Continue to meta tags
      }

      // Check OpenGraph
      const pageRes = await fetchWithTimeout(url);
      if (pageRes.ok) {
        const html = await pageRes.text();
        const meta = extractMetaTags(html);

        title = meta["og:title"] || title;
        thumbnail = meta["og:image"] || thumbnail;

        const vidUrl = meta["og:video"] || meta["og:video:url"];
        if (vidUrl) {
          mediaList.push({
            quality: "Standard Video",
            type: "video",
            format: "mp4",
            url: vidUrl,
          });
        }
      }
    }

    if (mediaList.length === 0) {
      throw new Error("Could not extract video stream for this Vimeo video. It might be privacy-restricted.");
    }

    return createMediaResponse({
      platform: "Vimeo",
      platformSlug: "vimeo",
      title,
      thumbnail,
      author,
      duration,
      media: mediaList,
    });
  } catch (error) {
    throw new Error(error.message || "Failed to process Vimeo video");
  }
}
