import {
  fetchWithTimeout,
  extractMetaTags,
  createMediaResponse,
  BOT_USER_AGENT,
} from "./base.js";

/**
 * TikTok Video Downloader Service (Watermark-Free)
 */
export async function extractTikTokVideo(url) {
  try {
    let title = "TikTok Video";
    let thumbnail = null;
    let author = null;
    let duration = null;
    const mediaList = [];

    // Method 1: TikWM Public Extraction API (Watermark-Free HD + MP3)
    try {
      const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
      const apiRes = await fetchWithTimeout(apiUrl, { timeout: 8000 });

      if (apiRes.ok) {
        const json = await apiRes.json();
        if (json && json.code === 0 && json.data) {
          const d = json.data;
          title = d.title || title;
          thumbnail = d.cover || d.origin_cover || null;
          author = d.author ? `@${d.author.unique_id || d.author.nickname}` : null;
          duration = d.duration ? `${d.duration}s` : null;

          if (d.hdplay) {
            mediaList.push({
              quality: "HD Without Watermark",
              type: "video",
              format: "mp4",
              url: d.hdplay.startsWith("http") ? d.hdplay : `https://www.tikwm.com${d.hdplay}`,
              size: d.hd_size || null,
            });
          }

          if (d.play) {
            mediaList.push({
              quality: "Without Watermark",
              type: "video",
              format: "mp4",
              url: d.play.startsWith("http") ? d.play : `https://www.tikwm.com${d.play}`,
              size: d.size || null,
            });
          }

          if (d.music) {
            mediaList.push({
              quality: "Original Audio (MP3)",
              type: "audio",
              format: "mp3",
              url: d.music.startsWith("http") ? d.music : `https://www.tikwm.com${d.music}`,
            });
          }
        }
      }
    } catch {
      // Continue to fallback
    }

    // Method 2: Direct Scrape / oEmbed fallback
    if (mediaList.length === 0) {
      const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
      const oembedRes = await fetchWithTimeout(oembedUrl);

      if (oembedRes.ok) {
        const oembed = await oembedRes.json();
        title = oembed.title || title;
        thumbnail = oembed.thumbnail_url || thumbnail;
        author = oembed.author_name ? `@${oembed.author_name}` : author;
      }

      // Check open graph
      const pageRes = await fetchWithTimeout(url, {
        headers: { "User-Agent": BOT_USER_AGENT },
      });

      if (pageRes.ok) {
        const html = await pageRes.text();
        const meta = extractMetaTags(html);
        const vidUrl = meta["og:video"] || meta["og:video:url"] || meta["twitter:player:stream"];

        if (vidUrl) {
          mediaList.push({
            quality: "Standard Video",
            type: "video",
            format: "mp4",
            url: vidUrl,
          });
        }
        if (!thumbnail) thumbnail = meta["og:image"];
      }
    }

    if (mediaList.length === 0) {
      throw new Error(
        "Could not extract video from this TikTok URL. Please make sure the video is public."
      );
    }

    return createMediaResponse({
      platform: "TikTok",
      platformSlug: "tiktok",
      title,
      thumbnail,
      author,
      duration,
      media: mediaList,
    });
  } catch (error) {
    throw new Error(error.message || "Failed to process TikTok video");
  }
}
