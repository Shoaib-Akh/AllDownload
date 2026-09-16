import { store } from "../../../../db/store.js";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const analytics = store.getAnalytics();
    return Response.json({
      success: true,
      data: analytics,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message || "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
