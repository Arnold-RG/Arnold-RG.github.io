import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, normalize } from "node:path";

const siteRoot = new URL("../site/", import.meta.url);
const html = await readFile(new URL("../site/index.html", import.meta.url), "utf8");

const refs = new Set();
for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
  refs.add(match[1]);
}
for (const match of html.matchAll(/\bcontent="(https?:\/\/[^"]+)"/g)) {
  refs.add(match[1]);
}

const failures = [];
const checked = [];

function localFromAbsolute(url) {
  const parsed = new URL(url);
  if (parsed.hostname !== "arnold-rg.github.io") return null;
  if (parsed.pathname === "/" || parsed.pathname === "") return null;
  const relative = parsed.pathname.replace(/^\//, "");
  const file = new URL(relative, siteRoot);
  if (existsSync(file)) return file;
  return null;
}

async function fetchStatus(url) {
  let lastError = "no response";
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch(url, {
        redirect: "follow",
        signal: controller.signal,
        headers: { "User-Agent": "Arnold-RG-portfolio-link-check" },
      });
      clearTimeout(timer);
      return response.status;
    } catch (error) {
      clearTimeout(timer);
      lastError = error.name === "AbortError" ? "timeout" : error.message;
    }
  }
  throw new Error(lastError);
}

function okStatus(url, status) {
  if (status >= 200 && status < 400) return true;
  if (status === 999 && url.includes("linkedin.com")) return true;
  return false;
}

for (const ref of refs) {
  if (ref.startsWith("mailto:") || ref.startsWith("tel:") || ref.startsWith("data:")) continue;

  if (ref.startsWith("#")) {
    const id = ref.slice(1);
    if (!html.includes(`id="${id}"`)) failures.push(`missing target for ${ref}`);
    else checked.push(ref);
    continue;
  }

  if (ref.startsWith("./") || ref.startsWith("assets/") || ref === "favicon.ico" || ref === "favicon.svg") {
    const relative = ref.replace(/^\.\//, "");
    const file = new URL(relative, siteRoot);
    if (!existsSync(file)) failures.push(`missing file ${ref}`);
    else checked.push(ref);
    continue;
  }

  if (ref.startsWith("/hamwe")) {
    try {
      const status = await fetchStatus(`https://arnold-rg.github.io${ref}`);
      if (!okStatus(ref, status)) failures.push(`${status} ${ref}`);
      else checked.push(`${status} ${ref}`);
    } catch (error) {
      failures.push(`${ref} (${error.message})`);
    }
    continue;
  }

  if (ref.startsWith("http://") || ref.startsWith("https://")) {
    const local = localFromAbsolute(ref);
    if (local) {
      checked.push(`local ${ref}`);
      continue;
    }
    if (ref === "https://arnold-rg.github.io/" || ref === "https://arnold-rg.github.io") {
      checked.push(ref);
      continue;
    }
    try {
      const status = await fetchStatus(ref);
      if (!okStatus(ref, status)) failures.push(`${status} ${ref}`);
      else checked.push(`${status} ${ref}`);
    } catch (error) {
      failures.push(`${ref} (${error.message})`);
    }
    continue;
  }

  if (ref.startsWith("/")) {
    const file = normalize(join("site", ref));
    if (!existsSync(file)) failures.push(`missing root file ${ref}`);
    else checked.push(ref);
  }
}

console.log(`checked ${checked.length} references`);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("link check passed");
