import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const TEXT = new Set([".html", ".css", ".js", ".mjs", ".json", ".svg", ".xml", ".txt", ".webmanifest", ".map"]);
const todoText = /\bTODO\b/;
const gapList = new RegExp("\\b" + ["ne", "eded"].join("") + "\\b", "i");
const privateName = new RegExp(["Ar", "nova"].join(""), "i");
const privateAlias = new RegExp(["at", "eck"].join(""), "i");
const localPath =
  /(?:\b[A-Za-z]:[\\/])|(?:^|[\s"'`(=:])\/(?:home|Users|opt|tmp|workspace|usr|var)\//m;
const SKIP = new Set(["node_modules", "dist", "dist-ssr", ".git", "test-results", "playwright-report", "blob-report"]);

function scanText(path, text, found, gaps) {
  if (todoText.test(text)) found.push(`${path}: contains TODO`);
  if (gaps && gapList.test(text)) found.push(`${path}: contains a placeholder list`);
  if (localPath.test(text)) found.push(`${path}: contains a local file path`);
  if (privateName.test(text) || privateAlias.test(text)) found.push(`${path}: contains a private name`);
}

function scanPath(path, found) {
  if (privateName.test(path) || privateAlias.test(path)) found.push(`${path}: path contains a private name`);
}

export function problemsInTree(root) {
  const found = [];
  if (!existsSync(root)) return found;

  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      scanPath(path, found);
      if (statSync(path).isDirectory()) {
        walk(path);
        continue;
      }
      const ext = extname(path);
      if (!TEXT.has(ext)) continue;
      scanText(path, readFileSync(path, "utf8"), found, ext === ".html");
    }
  };

  walk(root);
  return found;
}

function collectMarkdown(root) {
  const files = [];

  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      if (SKIP.has(name)) continue;
      const path = join(dir, name);
      const info = statSync(path);
      if (info.isDirectory()) {
        walk(path);
        continue;
      }
      if (extname(path) === ".md") files.push(path);
    }
  };

  walk(root);
  return files;
}

export function problemsInDocs(root) {
  const found = [];
  if (!existsSync(root)) return found;
  for (const path of collectMarkdown(root)) {
    scanPath(path, found);
    scanText(path, readFileSync(path, "utf8"), found, true);
  }
  return found;
}

export function privateNameProblems(root) {
  const found = [];
  if (!existsSync(root)) return found;

  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      if (SKIP.has(name)) continue;
      const path = join(dir, name);
      scanPath(path, found);
      const info = statSync(path);
      if (info.isDirectory()) {
        walk(path);
        continue;
      }
      if (!TEXT.has(extname(path)) && extname(path) !== ".md") continue;
      const body = readFileSync(path, "utf8");
      if (privateName.test(body) || privateAlias.test(body)) found.push(`${path}: contains a private name`);
    }
  };

  walk(root);
  return found;
}

function run() {
  const root = fileURLToPath(new URL("..", import.meta.url));
  const targets = [join(root, "site")];
  const dist = join(root, "dist");
  if (existsSync(dist)) targets.push(dist);
  const found = [...targets.flatMap(problemsInTree), ...problemsInDocs(root), ...privateNameProblems(root)];
  if (found.length) {
    console.error(found.join("\n"));
    process.exit(1);
  }
  console.log(`published check passed (${targets.join(", ")}; docs)`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run();
}
