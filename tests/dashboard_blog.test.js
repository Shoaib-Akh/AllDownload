import test from "node:test";
import assert from "node:assert/strict";
import { store } from "../src/db/store.js";
import { getAllBlogPosts, getBlogPostBySlug } from "../src/lib/blog-data.js";
import { GET as getAnalytics } from "../src/app/api/admin/analytics/route.js";
import { GET as getDbData } from "../src/app/api/admin/db/route.js";
import { GET as getUsers, POST as postUsers } from "../src/app/api/users/route.js";
import { GET as getBlogs, POST as postBlogs, DELETE as deleteBlogs } from "../src/app/api/blogs/route.js";

test("store records successful download and updates statistics", () => {
  const initialAnalytics = store.getAnalytics();
  const initialDownloads = initialAnalytics.totalDownloads;
  const initialSuccess = initialAnalytics.successfulDownloads;

  const record = store.recordDownload({
    url: "https://www.tiktok.com/@test/video/123456789",
    platform: "tiktok",
    mediaTitle: "Dance Test Clip",
    quality: "1080p",
    status: "success",
    ipHash: "testhash1",
  });

  assert.equal(record.status, "success");
  assert.equal(record.platform, "tiktok");

  const updatedAnalytics = store.getAnalytics();
  assert.equal(updatedAnalytics.totalDownloads, initialDownloads + 1);
  assert.equal(updatedAnalytics.successfulDownloads, initialSuccess + 1);
});

test("store records failed download and logs error diagnostic", () => {
  const initialAnalytics = store.getAnalytics();
  const initialErrors = initialAnalytics.failedDownloads;

  const record = store.recordDownload({
    url: "https://facebook.com/private/clip",
    platform: "facebook",
    mediaTitle: "Private Video Test",
    status: "error",
    errorMessage: "Post is restricted to followers only",
    ipHash: "testhash2",
  });

  assert.equal(record.status, "error");
  assert.equal(record.error_message, "Post is restricted to followers only");

  const updatedAnalytics = store.getAnalytics();
  assert.equal(updatedAnalytics.failedDownloads, initialErrors + 1);

  // Check recent errors
  const foundError = updatedAnalytics.recentErrors.find(
    (e) => e.message === "Post is restricted to followers only"
  );
  assert.ok(foundError, "Error should be present in recent errors log");
});

test("store tracks active users and total visitor sessions", () => {
  store.recordUserVisit({
    ipHash: "new_visitor_99",
    userAgent: "Safari iOS",
    country: "US",
  });

  const userStats = store.getUserStats();
  assert.ok(userStats.activeNow > 0, "Active users must be greater than 0");
  assert.ok(userStats.totalUsers > 0, "Total tracked users must be greater than 0");
});

test("store database explorer inspects tables, schemas, and supports filters", () => {
  const tables = store.getTableList();
  assert.ok(Array.isArray(tables));
  const tableNames = tables.map((t) => t.name);
  assert.ok(tableNames.includes("downloads"));
  assert.ok(tableNames.includes("errors"));
  assert.ok(tableNames.includes("users"));
  assert.ok(tableNames.includes("blogs"));

  // Check downloads table data with status filter
  const successData = store.getTableData("downloads", { status: "success" });
  assert.ok(Array.isArray(successData.rows));
  assert.ok(successData.rows.every((r) => r.status === "success"));

  const errorData = store.getTableData("downloads", { status: "error" });
  assert.ok(Array.isArray(errorData.rows));
  assert.ok(errorData.rows.every((r) => r.status === "error"));

  // Check schema is returned
  assert.ok(Array.isArray(successData.schema));
  assert.ok(successData.schema.some((c) => c.name === "status"));
});

test("store creates blog post with custom HTML & CSS and resolves via getBlogPostBySlug", () => {
  const customHtml = '<div class="test-widget"><h3>Widget Test</h3></div>';
  const customCss = '.test-widget { color: blue; }';

  const blog = store.createBlog({
    title: "How to Download 4K Streams with High Fidelity",
    excerpt: "Complete technical breakdown of media fetching",
    category: "Tutorials",
    authorName: "Sarah Connor",
    custom_html: customHtml,
    custom_css: customCss,
    createdBy: "user",
  });

  assert.ok(blog.slug);
  assert.equal(blog.custom_html, customHtml);
  assert.equal(blog.custom_css, customCss);

  // Retrieve via blog-data wrapper
  const found = getBlogPostBySlug(blog.slug);
  assert.ok(found, "Blog post should be found by slug");
  assert.equal(found.title, "How to Download 4K Streams with High Fidelity");
  assert.equal(found.custom_html, customHtml);

  // Verify it appears in all posts
  const all = getAllBlogPosts();
  assert.ok(all.some((p) => p.slug === blog.slug));
});

test("GET /api/admin/analytics returns valid status and KPI payload", async () => {
  const res = await getAnalytics();
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.totalDownloads >= 0);
  assert.ok(json.data.activeUsers > 0);
  assert.ok(Array.isArray(json.data.recentDownloads));
});

test("GET /api/admin/db returns table list and queried records", async () => {
  // Test table list
  const reqTables = new Request("https://localhost/api/admin/db");
  const resTables = await getDbData(reqTables);
  const jsonTables = await resTables.json();
  assert.equal(jsonTables.success, true);
  assert.ok(Array.isArray(jsonTables.tables));

  // Test table query
  const reqData = new Request("https://localhost/api/admin/db?table=downloads&limit=5");
  const resData = await getDbData(reqData);
  const jsonData = await resData.json();
  assert.equal(jsonData.success, true);
  assert.equal(jsonData.table, "downloads");
  assert.ok(Array.isArray(jsonData.rows));
});

test("GET and POST /api/users tracks and returns active counts", async () => {
  const reqGet = new Request("https://localhost/api/users");
  const resGet = await getUsers(reqGet);
  const jsonGet = await resGet.json();
  assert.equal(jsonGet.success, true);
  assert.ok(jsonGet.activeNow > 0);

  const reqPost = new Request("https://localhost/api/users", { method: "POST" });
  const resPost = await postUsers(reqPost);
  const jsonPost = await resPost.json();
  assert.equal(jsonPost.success, true);
  assert.ok(jsonPost.totalUsers > 0);
});

test("POST /api/blogs creates blog and DELETE /api/blogs removes it", async () => {
  const createReq = new Request("https://localhost/api/blogs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Api Test Custom CSS Blog Post",
      category: "Guides",
      authorName: "Tester",
      custom_html: "<div class='api-box'>API</div>",
      custom_css: ".api-box { margin: 10px; }",
      createdBy: "admin",
    }),
  });

  const createRes = await postBlogs(createReq);
  assert.equal(createRes.status, 201);
  const createJson = await createRes.json();
  assert.equal(createJson.success, true);
  assert.ok(createJson.blog.id);

  // Delete it
  const delReq = new Request(`https://localhost/api/blogs?id=${createJson.blog.id}`, {
    method: "DELETE",
  });
  const delRes = await deleteBlogs(delReq);
  const delJson = await delRes.json();
  assert.equal(delJson.success, true);
});
