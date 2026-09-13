import { validateUrl, getPlatformFromUrl } from "../../../lib/validators.js";
import { extractMedia } from "../../../services/index.js";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const { url, platform: platformSlug } = body;

    // Validate URL
    const validation = validateUrl(url, platformSlug);
    if (!validation.valid) {
      return Response.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Detect platform
    const platform = getPlatformFromUrl(url);
    if (!platform) {
      return Response.json(
        { success: false, error: "Unsupported platform. Please enter a valid URL from one of our 12 supported platforms." },
        { status: 400 }
      );
    }

    try {
      // Call actual platform extraction service
      const mediaData = await extractMedia(url, platform.slug);
      return Response.json(mediaData);
    } catch (extractError) {
      console.warn(`Extraction service notice for ${platform.name}:`, extractError.message);

      // Return a clean error with suggestion
      return Response.json(
        {
          success: false,
          error: extractError.message || `Failed to fetch video from ${platform.name}. The video might be private, region-restricted, or removed.`,
          platform: platform.name,
        },
        { status: 422 }
      );
    }
  } catch (error) {
    console.error("Info API error:", error);
    return Response.json(
      { success: false, error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
