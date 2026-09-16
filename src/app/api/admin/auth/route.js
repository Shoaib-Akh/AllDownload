import { verifyAdminSession } from "../../../../lib/auth.js";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const isAuthed = await verifyAdminSession(request);
    if (!isAuthed) {
      return Response.json(
        { success: false, authenticated: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    return Response.json({
      success: true,
      authenticated: true,
    });
  } catch (error) {
    return Response.json(
      { success: false, authenticated: false, error: error.message },
      { status: 500 }
    );
  }
}
