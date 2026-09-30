import {
  fetchWithTimeout,
  extractMetaTags,
  createMediaResponse,
  BOT_USER_AGENT,
} from "./base.js";

/**
 * Pinterest Video & High-Res Image Downloader Service
 */
export async function extractPinterestMedia(url) {
  try {
    const pinMatch = url.match(/pin\/(\d+)/i);
    const pinId = pinMatch ? pinMatch[1] : null;

    let title = "Pinterest Pin";
    let thumbnail = null;
    const mediaList = [];

    // Method 1: Pinterest Pidgets API
    if (pinId) {
      try {
        const apiUrl = `https://api.pinterest.com/v3/pidgets/pins/info/?pin_ids=${pinId}`;
        const apiRes = await fetchWithTimeout(apiUrl);

        if (apiRes.ok) {
          const json = await apiRes.json();
          const pinData = json?.data?.pins?.[0] || json?.data?.[pinId];

          if (pinData) {
            title = pinData.description || pinData.rich_metadata?.title || title;

            // Video pins
            if (pinData.videos?.video_list) {
              const vList = pinData.videos.video_list;
              const qualities = ["V_720P", "V_EXP7", "V_EXP4"];

              for (const q of qualities) {
                if (vList[q]?.url) {
                  mediaList.push({
                    quality: `${q.replace("V_", "")} Video`,
                    type: "video",
                    format: vList[q].url.includes(".m3u8") ? "m3u8" : "mp4",
                    url: vList[q].url,
                  });
                }
              }
            }

            // Image pins
            if (pinData.images?.orig?.url) {
              const imgUrl = pinData.images.orig.url;
              thumbnail = imgUrl;
              mediaList.push({
                quality: "Original High-Res Image",
                type: "image",
                format: "jpg",
                url: imgUrl,
              });
            }
          }
        }
      } catch {
        // Fallback
      }
    }

    // Method 2: Scrape / OpenGraph fallback
    if (mediaList.length === 0) {
      const pageRes = await fetchWithTimeout(url, {
        headers: { "User-Agent": BOT_USER_AGENT },
      });

      if (pageRes.ok) {
        const html = await pageRes.text();
        const meta = extractMetaTags(html);

        title = meta["og:title"] || meta["title"] || title;
        thumbnail = meta["og:image"] || thumbnail;

        const vidUrl =
          meta["og:video"] ||
          meta["og:video:url"] ||
          meta["og:video:secure_url"];

        if (vidUrl) {
          mediaList.push({
            quality: "HD Video (Original)",
            type: "video",
            format: "mp4",
            url: vidUrl,
          });
        } else if (thumbnail) {
          mediaList.push({
            quality: "Original Image",
            type: "image",
            format: "jpg",
            url: thumbnail,
          });
        }
      }
    }

    if (mediaList.length === 0) {
      throw new Error("Could not extract any media from this Pinterest pin.");
    }

    return createMediaResponse({
      platform: "Pinterest",
      platformSlug: "pinterest",
      title: title.slice(0, 80),
      thumbnail,
      media: mediaList,
    });
  } catch (error) {
    throw new Error(error.message || "Failed to process Pinterest pin");
  }
}
