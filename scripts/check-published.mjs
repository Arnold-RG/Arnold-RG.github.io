import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const TEXT = new Set([".html", ".css", ".js", ".mjs", ".json", ".svg", ".xml", ".txt", ".webmanifest", ".map"]);
const todoText = /\bTODO\b/;
const localPath =
  /(?:\b[A-Za-z]:[\\/])|(?:^|[\s"'`(=:])\/(?:home|Users|opt|tmp|workspace|usr|var)\//m;

export function problemsInTree(root) {
  const found = [];
  if (!existsSync(root)) return found;

  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) {
        walk(path);
        continue;
      }
      if (!TEXT.has(extname(path))) continue;
      const text = readFileSync(path, "utf8");
      if (todoText.test(text)) found.push(`${path}: contains TODO`);
      if (localPath.test(text)) found.push(`${path}: contains a local file path`);
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
  const found = targets.flatMap(problemsInTree);
  if (found.length) {
    console.error(found.join("\n"));
    process.exit(1);
  }
  console.log(`published check passed (${targets.join(", ")})`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run();
}
