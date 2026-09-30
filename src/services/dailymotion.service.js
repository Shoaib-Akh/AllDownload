import {
  fetchWithTimeout,
  extractMetaTags,
  createMediaResponse,
} from "./base.js";

/**
 * Dailymotion Video Downloader Service
 */
export async function extractDailymotionMedia(url) {
  try {
    const idMatch =
      url.match(/video\/([A-Za-z0-9]+)/i) ||
      url.match(/dai\.ly\/([A-Za-z0-9]+)/i);

    const videoId = idMatch ? idMatch[1] : null;

    if (!videoId) {
      throw new Error("Could not find a valid Dailymotion video ID in URL.");
    }

    let title = "Dailymotion Video";
    let thumbnail = null;
    let author = null;
    let duration = null;
    const mediaList = [];

    // Method 1: Dailymotion Player Metadata API
    try {
      const metaUrl = `https://www.dailymotion.com/player/metadata/video/${videoId}`;
      const metaRes = await fetchWithTimeout(metaUrl);

      if (metaRes.ok) {
        const data = await metaRes.json();
        title = data.title || title;
        thumbnail =
          data.posters?.["1080"] ||
          data.posters?.["720"] ||
          data.posters?.["480"] ||
          data.poster_url ||
          null;
        author = data.owner?.screenname ? `@${data.owner.screenname}` : null;
        duration = data.duration ? `${Math.floor(data.duration / 60)}:${(data.duration % 60).toString().padStart(2, "0")}` : null;

        if (data.qualities) {
          const qualityKeys = ["1080", "720", "480", "380", "240"];
          for (const q of qualityKeys) {
            const streams = data.qualities[q];
            if (Array.isArray(streams)) {
              for (const stream of streams) {
                if (stream.url && (stream.type === "video/mp4" || stream.url.includes(".mp4"))) {
                  mediaList.push({
                    quality: `${q}p HD`,
                    type: "video",
                    format: "mp4",
                    url: stream.url,
                  });
                  break;
                }
              }
            }
          }

        }
      }
    } catch {
      // Fallback
    }

    // Method 2: Open Graph scrape
    if (mediaList.length === 0) {
      const pageRes = await fetchWithTimeout(url);
      if (pageRes.ok) {
        const html = await pageRes.text();
        const meta = extractMetaTags(html);

        title = meta["og:title"] || title;
        thumbnail = meta["og:image"] || thumbnail;

        const vidUrl =
          meta["og:video"] ||
          meta["og:video:url"] ||
          meta["twitter:player:stream"];

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
      throw new Error("Could not extract video stream for this Dailymotion video.");
    }

    return createMediaResponse({
      platform: "Dailymotion",
      platformSlug: "dailymotion",
      title,
      thumbnail,
      author,
      duration,
      media: mediaList,
    });
  } catch (error) {
    throw new Error(error.message || "Failed to process Dailymotion video");
  }
}
