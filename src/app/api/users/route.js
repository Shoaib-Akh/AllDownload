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

export async function GET(request) {
  try {
    const { ipHash, userAgent, country } = getClientInfo(request);
    // Heartbeat current request
    store.recordUserVisit({ ipHash, userAgent, country });

    const stats = store.getUserStats();
    return Response.json({
      success: true,
      activeNow: stats.activeNow,
      totalUsers: stats.totalUsers,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message || "Failed to fetch user metrics" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { ipHash, userAgent, country } = getClientInfo(request);
    const stats = store.recordUserVisit({ ipHash, userAgent, country });
    return Response.json({
      success: true,
      activeNow: stats.activeNow,
      totalUsers: stats.totalUsers,
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
