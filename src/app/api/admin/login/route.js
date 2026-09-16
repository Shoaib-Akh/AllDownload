import { validateAdminCredentials, createAdminToken, SESSION_COOKIE_NAME, SESSION_TTL_MS } from "../../../../lib/auth.js";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body || {};

    if (!username || !password) {
      return Response.json(
        { success: false, error: "Username and password are required" },
        { status: 400 }
      );
    }

    const isValid = validateAdminCredentials(username, password);
    if (!isValid) {
      return Response.json(
        { success: false, error: "Invalid administrator credentials" },
        { status: 401 }
      );
    }

    const token = await createAdminToken(username.trim());
    const maxAgeSeconds = Math.floor(SESSION_TTL_MS / 1000);
    const isProduction = process.env.NODE_ENV === "production";

    // Set-Cookie header with HttpOnly and SameSite
    const cookieValue = `${SESSION_COOKIE_NAME}=${encodeURIComponent(
      token
    )}; Path=/; Max-Age=${maxAgeSeconds}; HttpOnly; SameSite=Lax${
      isProduction ? "; Secure" : ""
    }`;

    const headers = new Headers();
    headers.set("Set-Cookie", cookieValue);
    headers.set("Content-Type", "application/json");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Admin authenticated successfully",
        username: username.trim(),
        token,
      }),
      { status: 200, headers }
    );
  } catch (error) {
    return Response.json(
      { success: false, error: error.message || "Authentication failed" },
      { status: 500 }
    );
  }
}
