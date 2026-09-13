import test from "node:test";
import assert from "node:assert/strict";
import sitemap from "../src/app/sitemap.js";
import robots from "../src/app/robots.js";
import { PLATFORMS, SITE_NAME, SITE_URL } from "../src/lib/constants.js";

test("sitemap includes all static pages and all 12 platforms", () => {
  const entries = sitemap();
  assert.ok(Array.isArray(entries));
  assert.equal(entries.length, 3 + 12); // 3 static + 12 platforms = 15 entries

  const homeEntry = entries.find((e) => e.url === SITE_URL);
  assert.ok(homeEntry, "Home entry should exist in sitemap");
  assert.equal(homeEntry.priority, 1.0);
  assert.equal(homeEntry.changeFrequency, "daily");

  const faqEntry = entries.find((e) => e.url === `${SITE_URL}/faq`);
  assert.ok(faqEntry, "FAQ entry should exist in sitemap");

  for (const platform of PLATFORMS) {
    const pEntry = entries.find((e) => e.url === `${SITE_URL}/${platform.slug}`);
    assert.ok(pEntry, `Platform ${platform.slug} should be indexed in sitemap`);
    assert.equal(pEntry.priority, 0.9);
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
