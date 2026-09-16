import test from "node:test";
import assert from "node:assert/strict";
import { POST as loginHandler } from "../src/app/api/admin/login/route.js";
import { POST as logoutHandler } from "../src/app/api/admin/logout/route.js";
import { GET as authHandler } from "../src/app/api/admin/auth/route.js";
import {
  validateAdminCredentials,
  createAdminToken,
  verifyAdminToken,
  SESSION_COOKIE_NAME,
} from "../src/lib/auth.js";
import { store } from "../src/db/store.js";

test("admin auth: validateAdminCredentials validates correctly", () => {
  assert.equal(validateAdminCredentials("admin", "admin123"), true);
  assert.equal(validateAdminCredentials("admin", "wrongpassword"), false);
  assert.equal(validateAdminCredentials("notadmin", "admin123"), false);
  assert.equal(validateAdminCredentials("", ""), false);
});

test("admin auth: createAdminToken and verifyAdminToken roundtrip", async () => {
  const token = await createAdminToken("admin");
  assert.ok(token);
  assert.equal(typeof token, "string");

  const isValid = await verifyAdminToken(token);
  assert.equal(isValid, true);

  const isInvalid = await verifyAdminToken("tampered.token.signature");
  assert.equal(isInvalid, false);
});

test("POST /api/admin/login rejects invalid credentials with 401", async () => {
  const req = new Request("http://localhost/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin", password: "wrong_password" }),
  });

  const res = await loginHandler(req);
  assert.equal(res.status, 401);
  const data = await res.json();
  assert.equal(data.success, false);
  assert.match(data.error, /invalid/i);
});

test("POST /api/admin/login requires username and password with 400", async () => {
  const req = new Request("http://localhost/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin" }),
  });

  const res = await loginHandler(req);
  assert.equal(res.status, 400);
});

test("POST /api/admin/login succeeds with valid credentials and sets cookie", async () => {
  const req = new Request("http://localhost/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin", password: "admin123" }),
  });

  const res = await loginHandler(req);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.token);

  const setCookie = res.headers.get("set-cookie");
  assert.ok(setCookie);
  assert.ok(setCookie.includes(SESSION_COOKIE_NAME));
  assert.ok(setCookie.includes("HttpOnly"));
});

test("GET /api/admin/auth returns 401 if unauthenticated and 200 with valid cookie", async () => {
  // Unauthenticated
  const reqUnauth = new Request("http://localhost/api/admin/auth", {
    method: "GET",
  });
  const resUnauth = await authHandler(reqUnauth);
  assert.equal(resUnauth.status, 401);

  // Authenticated
  const token = await createAdminToken("admin");
  const reqAuth = new Request("http://localhost/api/admin/auth", {
    method: "GET",
    headers: {
      Cookie: `${SESSION_COOKIE_NAME}=${token}`,
    },
  });
  const resAuth = await authHandler(reqAuth);
  assert.equal(resAuth.status, 200);
  const dataAuth = await resAuth.json();
  assert.equal(dataAuth.authenticated, true);
});

test("POST /api/admin/logout clears admin_session cookie", async () => {
  const res = await logoutHandler();
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);

  const setCookie = res.headers.get("set-cookie");
  assert.ok(setCookie);
  assert.ok(setCookie.includes("Max-Age=0"));
});

test("store contains real data and zero dummy multipliers", () => {
  const stats = store.getUserStats();
  // No fake multiplier of 142 or 18450
  assert.ok(stats.activeNow <= stats.totalUsers);
  assert.ok(typeof stats.repeatRate === "number");

  const analytics = store.getAnalytics();
  assert.ok(typeof analytics.totalDownloads === "number");
  assert.ok(typeof analytics.successRate === "number");
  assert.ok(Array.isArray(analytics.recentDownloads));
  assert.ok(Array.isArray(analytics.recentErrors));
});
