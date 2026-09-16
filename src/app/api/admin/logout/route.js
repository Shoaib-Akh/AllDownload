import { SESSION_COOKIE_NAME } from "../../../../lib/auth.js";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST() {
  const isProduction = process.env.NODE_ENV === "production";
  const expiredCookie = `${SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${
    isProduction ? "; Secure" : ""
  }`;

  const headers = new Headers();
  headers.set("Set-Cookie", expiredCookie);
  headers.set("Content-Type", "application/json");

  return new Response(
    JSON.stringify({
      success: true,
      message: "Admin logged out successfully",
    }),
    { status: 200, headers }
  );
}
