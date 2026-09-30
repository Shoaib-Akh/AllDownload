import { validateUrl, getPlatformFromUrl } from "../../../lib/validators.js";
import { statsTracker, isAllowedMediaHost, DEFAULT_USER_AGENT } from "../../../services/base.js";
import { store } from "../../../db/store.js";

export const runtime = "edge";
export const dynamic = "force-dynamic";

/**
 * Extract client IP hash from request headers
 */
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

/**
 * POST /api/download
 *
 * Validates the page URL and records the attempt.
 * Returns platform info and a pointer to /api/info so the browser can
 * retrieve the real direct media files.
 * The page URL is never treated as a downloadable file.
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

    // Record attempt
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

    // Return platform info — direct file URLs come from /api/info, not here.
    // We intentionally do NOT return the page URL as a downloadUrl.
    return Response.json({
      success: true,
      platform: platform.name,
      platformSlug: platform.slug,
      message:
        "Use /api/info to retrieve the direct media files for this URL.",
      infoEndpoint: "/api/info",
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
 *
 * Downloads the video directly to the user's browser with Content-Disposition: attachment.
 * The file is saved directly onto the user's computer without navigating away or redirecting
 * to third-party CDN pages.
 */
export async function GET(request) {
  const { ipHash } = getClientInfo(request);

  try {
    const { searchParams } = new URL(request.url);
    const mediaUrl = searchParams.get("url");
    const filename = searchParams.get("filename") || "SaveFromPro_Video.mp4";

    if (!mediaUrl) {
      store.recordError({
        type: "MISSING_PARAM",
        message: "Missing url query parameter in download request",
        url: "",
        ipHash,
      });
      return new Response("Missing url query parameter", { status: 400 });
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(mediaUrl);
    } catch {
      store.recordError({
        type: "INVALID_PARAM",
        message: "Invalid media url query parameter in download request",
        url: mediaUrl,
        ipHash,
      });
      return new Response("Invalid media url query parameter", { status: 400 });
    }

    // Only allow known CDN / platform hosts — closes open proxy vulnerability
    if (!isAllowedMediaHost(mediaUrl)) {
      store.recordError({
        type: "BLOCKED_HOST",
        message: `Rejected download from disallowed host: ${parsedUrl.hostname}`,
        url: mediaUrl,
        ipHash,
      });
      return new Response(
        "This URL is not from a recognised media host and cannot be used for download.",
        { status: 400 }
      );
    }

    const cleanFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");

    // Fetch the remote file stream directly from the platform CDN
    const remoteResponse = await fetch(mediaUrl, {
      headers: {
        "User-Agent": DEFAULT_USER_AGENT,
        Accept: "*/*",
      },
    });

    if (!remoteResponse.ok) {
      // Fallback redirect if CDN rejects server-side stream
      return Response.redirect(mediaUrl, 302);
    }

    const contentType =
      remoteResponse.headers.get("content-type") || "application/octet-stream";
    const contentLength = remoteResponse.headers.get("content-length");

    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", contentType);
    responseHeaders.set(
      "Content-Disposition",
      `attachment; filename="${cleanFilename}"`
    );
    if (contentLength) {
      responseHeaders.set("Content-Length", contentLength);
    }
    responseHeaders.set("Cache-Control", "public, max-age=3600");
    responseHeaders.set("Access-Control-Allow-Origin", "*");

    return new Response(remoteResponse.body, {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Download error:", error);
    store.recordError({
      type: "DOWNLOAD_ERROR",
      message: error.message || "Error processing media download",
      ipHash,
    });
    return new Response("Error processing media download", { status: 500 });
  }
}

