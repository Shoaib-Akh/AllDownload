import test from "node:test";
import assert from "node:assert/strict";
import sitemap from "../src/app/sitemap.js";
import robots from "../src/app/robots.js";
import { PLATFORMS, SITE_NAME, SITE_URL } from "../src/lib/constants.js";
import { BLOG_POSTS } from "../src/lib/blog-data.js";

test("sitemap includes all static pages, all 12 platforms, and blog articles", () => {
  const entries = sitemap();
  assert.ok(Array.isArray(entries));
  assert.equal(entries.length, 4 + 12 + BLOG_POSTS.length); // 4 static + 12 platforms + blog posts

  const homeEntry = entries.find((e) => e.url === SITE_URL);
  assert.ok(homeEntry, "Home entry should exist in sitemap");
  assert.equal(homeEntry.priority, 1.0);
  assert.equal(homeEntry.changeFrequency, "daily");

  const platformsEntry = entries.find((e) => e.url === `${SITE_URL}/platforms`);
  assert.ok(platformsEntry, "Platforms entry should exist in sitemap");
  assert.equal(platformsEntry.priority, 0.9);

  const blogEntry = entries.find((e) => e.url === `${SITE_URL}/blog`);
  assert.ok(blogEntry, "Blog entry should exist in sitemap");
  assert.equal(blogEntry.priority, 0.8);

  for (const platform of PLATFORMS) {
    const pEntry = entries.find((e) => e.url === `${SITE_URL}/${platform.slug}`);
    assert.ok(pEntry, `Platform ${platform.slug} should be indexed in sitemap`);
    assert.equal(pEntry.priority, 0.9);
  }

  for (const post of BLOG_POSTS) {
    const postEntry = entries.find((e) => e.url === `${SITE_URL}/blog/${post.slug}`);
    assert.ok(postEntry, `Blog post ${post.slug} should be indexed in sitemap`);
    assert.equal(postEntry.priority, 0.7);
  }
});

test("robots directives allow general crawl and protect API routes", () => {
  const robotConfig = robots();
  assert.ok(robotConfig);
  assert.equal(robotConfig.rules.userAgent, "*");
  assert.equal(robotConfig.rules.allow, "/");
  assert.ok(robotConfig.rules.disallow.includes("/api/"));
  assert.equal(robotConfig.sitemap, `${SITE_URL}/sitemap.xml`);
});

test("all platforms have complete SEO attributes", () => {
  assert.equal(PLATFORMS.length, 12);
  for (const p of PLATFORMS) {
    assert.ok(p.slug, `Platform missing slug: ${p.name}`);
    assert.ok(p.name, `Platform missing name: ${p.slug}`);
    assert.ok(p.description, `Platform missing description: ${p.slug}`);
    assert.ok(p.features.length >= 2, `Platform missing features: ${p.slug}`);
    assert.ok(p.urlPattern instanceof RegExp, `Platform missing urlPattern: ${p.slug}`);
  }
});
