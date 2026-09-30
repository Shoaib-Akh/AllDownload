import fs from "node:fs";
import path from "node:path";

function patchAsyncHooks(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      patchAsyncHooks(fullPath);
    } else if (entry.name.endsWith(".js")) {
      let content = fs.readFileSync(fullPath, "utf8");
      if (content.includes('"async_hooks"') || content.includes("'async_hooks'")) {
        content = content
          .replaceAll('"async_hooks"', '"node:async_hooks"')
          .replaceAll("'async_hooks'", "'node:async_hooks'");
        fs.writeFileSync(fullPath, content, "utf8");
        console.log(`[fix-cf-build] Patched async_hooks in ${path.relative(process.cwd(), fullPath)}`);
      }
    }
  }
}

patchAsyncHooks(path.resolve(process.cwd(), ".vercel/output/static/_worker.js"));
console.log("[fix-cf-build] Cloudflare Pages bundle patched successfully.");
