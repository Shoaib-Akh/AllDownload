import { validateUrl, getPlatformFromUrl } from "../../../lib/validators.js";
import { DEFAULT_USER_AGENT, statsTracker } from "../../../services/base.js";

export const runtime = "edge";
export const dynamic = "force-dynamic";

/**
 * POST /api/download: Validate and generate ready download payload
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { url, quality } = body;

    const validation = validateUrl(url);
    if (!validation.valid) {
      return Response.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const platform = getPlatformFromUrl(url);
    if (!platform) {
      return Response.json(
        { success: false, error: "Unsupported platform" },
        { status: 400 }
      );
    }

    statsTracker.recordDownload(platform.slug, `Download: ${platform.name}`, url);

    return Response.json({
      success: true,
      platform: platform.name,
      downloadUrl: url,
      proxyDownloadUrl: `/api/download?url=${encodeURIComponent(url)}&filename=SaveFromPro_${platform.slug}_video.mp4`,
      quality: quality || "HD",
    });
  } catch (error) {
    console.error("Download API error:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/download?url=...&filename=...
 * Streams/proxies file directly to browser with Content-Disposition: attachment
 * Bypasses CORS and forced in-browser playback restrictions.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const mediaUrl = searchParams.get("url");
    let filename = searchParams.get("filename") || "SaveFromPro_video.mp4";

    if (!mediaUrl) {
      return new Response("Missing url query parameter", { status: 400 });
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
    return new Response("Error streaming media file", { status: 500 });
  }
}
