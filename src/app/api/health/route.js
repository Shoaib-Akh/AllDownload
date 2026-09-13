export const runtime = "edge";

export async function GET() {
  return Response.json({
    status: "ok",
    service: "SaveFromPro API",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
}
