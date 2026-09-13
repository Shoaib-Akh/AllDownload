import {
  fetchWithTimeout,
  extractMetaTags,
  createMediaResponse,
} from "./base.js";

/**
 * Reddit Video & Media Downloader Service
 */
export async function extractRedditMedia(url) {
  try {
    const idMatch = url.match(/comments\/([A-Za-z0-9]+)/i) || url.match(/redd\.it\/([A-Za-z0-9]+)/i);
    const postId = idMatch ? idMatch[1] : null;

    let title = "Reddit Video";
    let thumbnail = null;
    let author = null;
    let duration = null;
    const mediaList = [];

    // Method 1: Reddit JSON API
    if (postId) {
      try {
        const jsonUrl = `https://www.reddit.com/comments/${postId}.json?raw_json=1`;
        const res = await fetchWithTimeout(jsonUrl, {
          headers: {
            "User-Agent": "SaveFromProBot/1.0 (by /u/savefrompro)",
          },
        });

        if (res.ok) {
          const data = await res.json();
          const post = data?.[0]?.data?.children?.[0]?.data;

          if (post) {
            title = post.title || title;
            thumbnail = post.thumbnail && post.thumbnail.startsWith("http") ? post.thumbnail : null;
            author = post.author ? `u/${post.author}` : null;

            const videoData =
              post.secure_media?.reddit_video ||
              post.media?.reddit_video ||
              post.crosspost_parent_list?.[0]?.secure_media?.reddit_video;

            if (videoData) {
              duration = videoData.duration ? `${videoData.duration}s` : null;
              const fallbackUrl = videoData.fallback_url;

              if (fallbackUrl) {
                const height = videoData.height || 720;
                mediaList.push({
                  quality: `${height}p HD (Video)`,
                  type: "video",
                  format: "mp4",
                  url: fallbackUrl,
                });

                // Infer audio stream URL
                const baseUrl = fallbackUrl.replace(/DASH_[^?#]+/, "");
                const audioUrl = `${baseUrl}DASH_AUDIO_128.mp4`;
                mediaList.push({
                  quality: "Audio Stream (MP4/AAC)",
                  type: "audio",
                  format: "mp4",
                  url: audioUrl,
                });
              }
            } else if (post.url && post.url.match(/\.(mp4|gif|png|jpg|jpeg)$/i)) {
              const ext = post.url.split(".").pop().toLowerCase();
              mediaList.push({
                quality: `Original ${ext.toUpperCase()}`,
                type: ext === "mp4" ? "video" : "image",
                format: ext,
                url: post.url,
              });
            }
          }
        }
      } catch {
        // Fallback
      }
    }

    // Method 2: OpenGraph scrape
    if (mediaList.length === 0) {
      const pageRes = await fetchWithTimeout(url, {
        headers: { "User-Agent": "facebookexternalhit/1.1" },
      });

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
      throw new Error("Could not extract video from this Reddit post. Check if the post contains a video.");
    }

    return createMediaResponse({
      platform: "Reddit",
      platformSlug: "reddit",
      title,
      thumbnail,
      author,
      duration,
      media: mediaList,
    });
  } catch (error) {
    throw new Error(error.message || "Failed to process Reddit media");
  }
}
