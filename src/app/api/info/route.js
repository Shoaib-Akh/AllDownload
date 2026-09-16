import { validateUrl, getPlatformFromUrl } from "../../../lib/validators.js";
import { extractMedia } from "../../../services/index.js";
import { store } from "../../../db/store.js";

export const runtime = "edge";
export const dynamic = "force-dynamic";

function getClientInfo(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
  const userAgent = request.headers.get("user-agent") || "Browser";
  const country = request.headers.get("cf-ipcountry") || "Global";

  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    hash = (hash << 5) - hash + ip.charCodeAt(i);
    hash |= 0;
  }
  const ipHash = Math.abs(hash).toString(16).padStart(8, "0");

  return { ipHash, userAgent, country };
}

export async function POST(request) {
  const { ipHash, userAgent, country } = getClientInfo(request);
  store.recordUserVisit({ ipHash, userAgent, country });

  try {
    const body = await request.json();
    const { url, platform: platformSlug } = body;

    // Validate URL
    const validation = validateUrl(url, platformSlug);
    if (!validation.valid) {
      store.recordError({
        type: "VALIDATION_FAILED",
        message: validation.error || "Invalid URL format",
        platform: platformSlug || "unknown",
        url: url || "",
        ipHash,
      });

      return Response.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Detect platform
    const platform = getPlatformFromUrl(url);
    if (!platform) {
      store.recordError({
        type: "UNSUPPORTED_PLATFORM",
        message: "Unsupported platform URL provided",
        platform: "unsupported",
        url: url || "",
        ipHash,
      });

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

      const errorMsg = extractError.message || `Failed to fetch video from ${platform.name}. The video might be private, region-restricted, or removed.`;
      store.recordError({
        type: "EXTRACTION_ERROR",
        message: errorMsg,
        platform: platform.slug,
        url,
        ipHash,
      });

      // Also record download attempt failure
      store.recordDownload({
        url,
        platform: platform.slug,
        mediaTitle: `${platform.name} Video`,
        status: "error",
        errorMessage: errorMsg,
        ipHash,
        userAgent,
        country,
      });

      return Response.json(
        {
          success: false,
          error: errorMsg,
          platform: platform.name,
        },
        { status: 422 }
      );
    }
  } catch (error) {
    console.error("Info API error:", error);
    store.recordError({
      type: "INTERNAL_ERROR",
      message: error.message || "Internal server error",
      ipHash,
    });

    return Response.json(
      { success: false, error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
