import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const html = readFileSync(new URL("../site/index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../site/assets/styles.css", import.meta.url), "utf8");
const profile = JSON.parse(readFileSync(new URL("../site/content/profile.json", import.meta.url), "utf8"));
const fallback = readFileSync(new URL("../site/404.html", import.meta.url), "utf8");

function decode(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'");
}

function lum(hex) {
  const value = hex.replace("#", "");
  const channels = [0, 2, 4].map((index) => {
    const channel = parseInt(value.slice(index, index + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(a, b) {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

test("hero names Arnold, Ateck, Kraków, and the target roles", () => {
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /<h1[^>]*>Arnold Rurangwa<\/h1>/);
  assert.match(html, /Also goes by Ateck/);
  assert.match(html, /Kraków, Poland/);
  assert.match(html, /Software development, Linux\/sysadmin, and IT support/);
  assert.match(html, /href="#main"/);
  assert.match(html, /id="main"/);
});

test("published projects, jobs, and education are present", () => {
  const text = decode(html);
  for (const project of profile.projects) {
    assert.ok(text.includes(project.name), project.name);
    assert.ok(text.includes(project.summary), project.summary);
    for (const link of project.links) assert.ok(html.includes(link), link);
  }
  for (const job of profile.experience) {
    assert.ok(text.includes(job.title), job.title);
    assert.ok(text.includes(job.org), job.org);
    assert.ok(text.includes(job.dates), job.dates);
  }
  assert.ok(text.includes(profile.education.school));
  assert.ok(text.includes(profile.education.dates));
  assert.ok(text.includes("Cognizant"));
  assert.ok(text.includes("LG Energy Solution"));
  assert.ok(text.includes("Escola S.A"));
  assert.ok(text.includes("I&M Bank"));
});

test("TODO placeholders match the profile gaps", () => {
  for (const item of profile.todos) {
    assert.ok(html.includes(`id="${item.id}"`), item.id);
    assert.ok(decode(html).includes(item.text), item.text);
  }
});

test("contact details and meta tags", () => {
  assert.match(html, /rurangwaarnold32@gmail.com/);
  assert.match(html, /tel:\+48575217930/);
  assert.match(html, /rel="canonical" href="https:\/\/arnold-rg\.github\.io\/"/);
  assert.match(html, /property="og:image" content="https:\/\/arnold-rg\.github\.io\/assets\/og\.png"/);
  assert.match(html, /property="og:image:width" content="1200"/);
  assert.match(html, /property="og:image:height" content="630"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(html, /href="\.\/favicon\.ico"/);
  assert.doesNotMatch(html, /"email": "mailto:/);
  assert.doesNotMatch(html, /example\.com/);
  assert.doesNotMatch(html, /lorem ipsum/i);
});

test("local assets exist and in-page links resolve", () => {
  for (const asset of [
    "site/favicon.ico",
    "site/favicon.svg",
    "site/apple-touch-icon.png",
    "site/assets/og.png",
    "site/assets/portrait.png",
    "site/assets/logo.png",
    "site/assets/favicon-32.png",
    "site/assets/styles.css",
    "site/assets/main.js",
    "site/assets/theme-init.js",
    "site/assets/Rurangwa-Arnold-Resume.pdf",
    "site/robots.txt",
    "site/sitemap.xml",
  ]) {
    assert.equal(existsSync(new URL(`../${asset}`, import.meta.url)), true, asset);
  }

  for (const match of html.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(html.includes(`id="${match[1]}"`), `#${match[1]}`);
  }
});

test("theme follows the system until the visitor chooses", () => {
  const init = readFileSync(new URL("../site/assets/theme-init.js", import.meta.url), "utf8");
  assert.match(init, /prefers-color-scheme: light/);
  assert.match(html, /aria-label="Switch to light theme"/);
  const main = readFileSync(new URL("../site/assets/main.js", import.meta.url), "utf8");
  assert.match(main, /Switch to light theme/);
  assert.match(main, /Switch to dark theme/);
});

test("palette contrast stays above WCAG AA for text", () => {
  assert.ok(contrast("#f4f0e6", "#12161c") >= 7);
  assert.ok(contrast("#b7c3d4", "#12161c") >= 4.5);
  assert.ok(contrast("#9fd0c3", "#12161c") >= 4.5);
  assert.ok(contrast("#9fd0c3", "#1a212c") >= 4.5);
  assert.ok(contrast("#1c1912", "#e8c872") >= 4.5);
  assert.ok(contrast("#1a1d23", "#f7f5f0") >= 7);
  assert.ok(contrast("#3d4654", "#f7f5f0") >= 4.5);
  assert.ok(contrast("#115e4a", "#f7f5f0") >= 4.5);
  assert.ok(contrast("#ffffff", "#115e4a") >= 4.5);
  assert.ok(contrast("#6a9a00", "#f4f6f1") < 4.5, "the old light-mode green failed AA");
  assert.doesNotMatch(css, /#6a9a00/i);
  assert.doesNotMatch(css, /#1B3A5C/i);
});

test("content security policy does not use a meta frame-ancestors directive", () => {
  assert.match(html, /Content-Security-Policy/);
  assert.doesNotMatch(html, /frame-ancestors/);
  assert.doesNotMatch(html, /unsafe-inline/);
  const markup = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(markup, "json-ld script");
  const hash = createHash("sha256").update(markup[1]).digest("base64");
  assert.match(html, new RegExp(`sha256-${hash.replace(/\+/g, "\\+")}`));
});

test("Hamwe deep links still recover through the root 404", () => {
  assert.match(fallback, /\/hamwe\//);
  assert.match(fallback, /location\.replace\('\/hamwe\/\?p='/);
});

test("sitemap and robots still advertise the public site", () => {
  const robots = readFileSync(new URL("../site/robots.txt", import.meta.url), "utf8");
  const sitemap = readFileSync(new URL("../site/sitemap.xml", import.meta.url), "utf8");
  assert.match(robots, /Sitemap: https:\/\/arnold-rg\.github\.io\/sitemap\.xml/);
  assert.match(sitemap, /https:\/\/arnold-rg\.github\.io\/</);
  assert.match(sitemap, /https:\/\/arnold-rg\.github\.io\/hamwe\/</);
});
