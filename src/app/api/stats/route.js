import { statsTracker } from "../../../services/base.js";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  const currentStats = statsTracker.getStats();

  return Response.json({
    success: true,
    stats: currentStats,
  });
}

