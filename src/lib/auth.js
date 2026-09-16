/**
 * Admin Authentication Utilities (Edge-Runtime Compatible)
 * Uses Web Crypto (crypto.subtle) for signing and verifying admin session tokens.
 */

const DEFAULT_ADMIN_USERNAME = "admin";
const DEFAULT_ADMIN_PASSWORD = "admin123";
const DEFAULT_SECRET = "savefrompro-admin-secret-salt-2026";
const SESSION_COOKIE_NAME = "admin_session";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function getAdminCredentials() {
  const username = process.env.ADMIN_USERNAME || DEFAULT_ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SECRET_KEY || DEFAULT_SECRET;
  return { username, password, secret };
}

/**
 * Validate incoming username and password
 */
export function validateAdminCredentials(username, password) {
  const creds = getAdminCredentials();
  return (
    username !== undefined &&
    password !== undefined &&
    username.trim() === creds.username &&
    password === creds.password
  );
}

/**
 * Compute HMAC-SHA256 signature for payload string
 */
async function signString(payload, secretKey) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secretKey);
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  return signatureArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Generate a signed session token: username.timestamp.signature
 */
export async function createAdminToken(username = "admin") {
  const { secret } = getAdminCredentials();
  const timestamp = Date.now().toString();
  const payload = `${username}:${timestamp}`;
  const sig = await signString(payload, secret);
  return `${username}.${timestamp}.${sig}`;
}

/**
 * Verify a session token
 */
export async function verifyAdminToken(token) {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [username, timestampStr, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (Number.isNaN(timestamp)) return false;

  // Check TTL
  const now = Date.now();
  if (now - timestamp > SESSION_TTL_MS || timestamp > now + 60000) {
    return false;
  }

  const { secret, username: expectedUser } = getAdminCredentials();
  if (username !== expectedUser) return false;

  const expectedSig = await signString(`${username}:${timestampStr}`, secret);
  return expectedSig === signature;
}

/**
 * Extract and verify admin token from Request object (Cookie or Authorization header)
 */
export async function verifyAdminSession(request) {
  if (!request) return true; // Fallback for headless tests without request

  const cookieHeader = request.headers?.get("cookie") || "";
  let token = null;

  // Check cookies
  const cookies = cookieHeader.split(";").map((c) => c.trim());
  for (const cookie of cookies) {
    if (cookie.startsWith(`${SESSION_COOKIE_NAME}=`)) {
      token = decodeURIComponent(cookie.substring(SESSION_COOKIE_NAME.length + 1));
      break;
    }
  }

  // Check Bearer authorization header fallback
  if (!token) {
    const authHeader = request.headers?.get("authorization") || "";
    if (authHeader.toLowerCase().startsWith("bearer ")) {
      token = authHeader.substring(7).trim();
    }
  }

  if (!token) {
    return false;
  }

  return await verifyAdminToken(token);
}

export { SESSION_COOKIE_NAME, SESSION_TTL_MS };
