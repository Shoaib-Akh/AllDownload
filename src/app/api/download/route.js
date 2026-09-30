import { validateUrl, getPlatformFromUrl } from "../../../lib/validators.js";
import { DEFAULT_USER_AGENT, statsTracker } from "../../../services/base.js";
import { store } from "../../../db/store.js";

export const runtime = "edge";
export const dynamic = "force-dynamic";

/**
 * Extract client IP or hash from request headers
 */
function getClientInfo(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
  const userAgent = request.headers.get("user-agent") || "Browser";
  const country = request.headers.get("cf-ipcountry") || "Global";

  // Quick 8-char hash
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    hash = (hash << 5) - hash + ip.charCodeAt(i);
    hash |= 0;
  }
  const ipHash = Math.abs(hash).toString(16).padStart(8, "0");

  return { ipHash, userAgent, country };
}

/**
 * POST /api/download: Validate and generate ready download payload
 */
export async function POST(request) {
  const { ipHash, userAgent, country } = getClientInfo(request);

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      body = {};
    }
    const { url, quality, title } = body || {};

    const validation = validateUrl(url);
    if (!validation.valid) {
      store.recordDownload({
        url: url || "",
        platform: "unknown",
        mediaTitle: title || "Invalid URL Attempt",
        status: "error",
        errorMessage: validation.error || "Invalid URL",
        ipHash,
        userAgent,
        country,
      });

      return Response.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const platform = getPlatformFromUrl(url);
    if (!platform) {
      store.recordDownload({
        url,
        platform: "unsupported",
        mediaTitle: title || "Unsupported Platform Attempt",
        status: "error",
        errorMessage: "Unsupported platform",
        ipHash,
        userAgent,
        country,
      });

      return Response.json(
        { success: false, error: "Unsupported platform" },
        { status: 400 }
      );
    }

    // Record success
    statsTracker.recordDownload(platform.slug, `Download: ${platform.name}`, url);
    store.recordDownload({
      url,
      platform: platform.slug,
      mediaTitle: title || `${platform.name} Video`,
      quality: quality || "HD",
      status: "success",
      ipHash,
      userAgent,
      country,
    });

    return Response.json({
      success: true,
      platform: platform.name,
      downloadUrl: url,
      proxyDownloadUrl: `/api/download?url=${encodeURIComponent(url)}&filename=SaveFromPro_${platform.slug}_video.mp4`,
      quality: quality || "HD",
    });
  } catch (error) {
    console.error("Download API error:", error);
    store.recordError({
      type: "INTERNAL_ERROR",
      message: error.message || "Internal server error",
      url: "",
      ipHash,
    });

    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/download?url=...&filename=...
 * Streams/proxies file directly to browser with Content-Disposition: attachment
 */
export async function GET(request) {
  const { ipHash, userAgent, country } = getClientInfo(request);

  try {
    const { searchParams } = new URL(request.url);
    const mediaUrl = searchParams.get("url");
    let filename = searchParams.get("filename") || "SaveFromPro_video.mp4";

    if (!mediaUrl) {
      store.recordError({
        type: "MISSING_PARAM",
        message: "Missing url query parameter in streaming download",
        url: "",
        ipHash,
      });
      return new Response("Missing url query parameter", { status: 400 });
    }

    try {
      new URL(mediaUrl);
    } catch {
      store.recordError({
        type: "INVALID_PARAM",
        message: "Invalid media url query parameter in streaming download",
        url: mediaUrl,
        ipHash,
      });
      return new Response("Invalid media url query parameter", { status: 400 });
    }

    // Clean filename
    filename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    if (!filename.includes(".")) {
      filename += ".mp4";
    }

    // Fetch the remote file
    const remoteResponse = await fetch(mediaUrl, {
      headers: {
        "User-Agent": DEFAULT_USER_AGENT,
        Accept: "*/*",
      },
    });

    if (!remoteResponse.ok) {
      // If direct fetch fails (e.g. expired link), redirect as fallback
      return Response.redirect(mediaUrl, 302);
    }

    const contentType =
      remoteResponse.headers.get("content-type") || "application/octet-stream";
    const contentLength = remoteResponse.headers.get("content-length");

    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", contentType);
    responseHeaders.set(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );
    if (contentLength) {
      responseHeaders.set("Content-Length", contentLength);
    }
    responseHeaders.set("Cache-Control", "public, max-age=3600");

    // Return streamed body
    return new Response(remoteResponse.body, {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Download streaming error:", error);
    store.recordError({
      type: "STREAMING_ERROR",
      message: error.message || "Error streaming media file",
      ipHash,
    });
    return new Response("Error streaming media file", { status: 500 });
  }
}
