import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { privateNameProblems, problemsInDocs, problemsInTree } from "../scripts/check-published.mjs";

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

test("hero names Arnold Rurangwa, Kraków, and the target roles", () => {
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /<h1[^>]*>Arnold Rurangwa<\/h1>/);
  assert.doesNotMatch(html, /alternateName/);
  assert.match(html, /Kraków, Poland/);
  assert.match(html, /Software development, Linux &amp; systems administration, IT support/);
  assert.match(html, /href="#main"/);
  assert.match(html, /id="main"/);
  assert.match(
    html,
    /class="hero-actions"[\s\S]*Download resume \(PDF\)[\s\S]*Email me[\s\S]*See projects/
  );
});

test("sections lead with projects and experience", () => {
  const order = ["projects", "experience", "skills", "education", "about", "contact"];
  let cursor = 0;
  for (const id of order) {
    const at = html.indexOf(`id="${id}"`);
    assert.ok(at > cursor, id);
    cursor = at;
  }
  assert.doesNotMatch(html, /id="certificates"/);
  assert.doesNotMatch(html, /Earlier folio/);
  assert.doesNotMatch(html, /Nothing new was added/);
  assert.doesNotMatch(html, /already on the folio/);
  assert.doesNotMatch(html, /class="section-index"/);
  assert.doesNotMatch(html, /class="source-note"/);
});

test("published projects, jobs, skills, and education are present", () => {
  const text = decode(html);
  for (const project of profile.projects) {
    assert.ok(text.includes(project.name), project.name);
    assert.ok(text.includes(project.summary), project.summary);
    if (project.stack) assert.ok(text.includes(project.stack), project.stack);
    for (const link of project.links) assert.ok(html.includes(link), link);
  }
  assert.equal(profile.projects.filter((project) => project.featured).length, 4);
  assert.match(html, /<details class="more">/);
  assert.match(html, /role="button"/);
  assert.match(html, /aria-controls="more-projects-list"/);
  assert.match(html, /id="more-projects-list"/);
  assert.match(html, /More projects/);
  for (const job of profile.experience) {
    assert.ok(text.includes(job.title), job.title);
    assert.ok(text.includes(job.org), job.org);
    assert.ok(text.includes(job.dates), job.dates);
  }
  for (const line of profile.highlights) assert.ok(text.includes(line), line);
  for (const items of Object.values(profile.skills)) {
    for (const item of items) assert.ok(text.includes(item), item);
  }
  assert.equal(profile.education.school, "Wrocławska Akademia Biznesu (ATA Wrocław)");
  assert.ok(text.includes(profile.education.school));
  assert.doesNotMatch(text, /Akademia Techniczno-Artystyczna/);
  assert.ok(text.includes(profile.education.dates));
  assert.ok(text.includes("Cognizant"));
  assert.ok(text.includes("LG Energy Solution"));
  assert.ok(text.includes("Escola S.A"));
  assert.ok(text.includes("I&M Bank"));
});

test("published files and docs contain no TODO text, placeholder lists, or local file paths", () => {
  const repo = fileRoot();
  const targets = [join(repo, "site")];
  const dist = join(repo, "dist");
  if (existsSync(dist)) targets.push(dist);
  const found = [...targets.flatMap(problemsInTree), ...problemsInDocs(repo), ...privateNameProblems(repo)];
  assert.deepEqual(found, []);
  assert.equal(profile.todos, undefined);
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
  assert.match(main, /aria-current", "location"/);
  assert.match(main, /opens in a new tab/);
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
  assert.ok(contrast("#f4f0e6", "#e8c872") < 3);
  assert.ok(contrast("#1a1d23", "#115e4a") < 3);
  assert.ok(contrast("#6a9a00", "#f4f6f1") < 4.5, "the old light-mode green failed AA");
  assert.doesNotMatch(css, /#6a9a00/i);
  assert.doesNotMatch(css, /#1B3A5C/i);
  assert.match(css, /\.nav-drawer ul a/);
  assert.match(css, /\.nav-drawer \.btn-primary/);
});

test("content security policy does not use a meta frame-ancestors directive", () => {
  assert.match(html, /Content-Security-Policy/);
  assert.doesNotMatch(html, /frame-ancestors/);
  assert.doesNotMatch(html, /unsafe-inline/);
  const hamwe = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  assert.doesNotMatch(hamwe, /frame-ancestors/);
  const markup = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(markup, "json-ld script");
  const hash = createHash("sha256").update(markup[1]).digest("base64");
  assert.match(html, new RegExp(`sha256-${hash.replace(/\+/g, "\\+")}`));
});

function fileRoot() {
  return fileURLToPath(new URL("..", import.meta.url));
}

test("Hamwe deep links still recover through the root 404", () => {
  assert.match(fallback, /\/hamwe\//);
  assert.match(fallback, /location\.replace\('\/hamwe\/\?p='/);
});

test("public identity stays Resume, Kraków, and the public email", () => {
  const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");
  const album = JSON.parse(readFileSync(new URL("../src/data/rwandaAlbum.json", import.meta.url), "utf8"));
  const group = new RegExp(["ar", "nova"].join(""), "i");
  const alias = new RegExp(["at", "eck"].join(""), "i");
  assert.equal(profile.location, "Kraków, Poland");
  assert.equal(profile.email, "rurangwaarnold32@gmail.com");
  assert.equal(profile.education.dates, "2022 – 2025");
  assert.match(html, /Kraków, Poland/);
  assert.match(html, /rurangwaarnold32@gmail.com/);
  assert.match(html, />Resume</);
  assert.match(html, /Download resume \(PDF\)/);
  assert.match(html, /class="when">2022 – 2025<br/);
  assert.match(readme, /2022 – 2025/);
  assert.doesNotMatch(html, /Mar 2022 – Sep 2025/);
  assert.doesNotMatch(readme, /Mar 2022 – Sep 2025/);
  assert.doesNotMatch(html, /\bCV\b/);
  assert.doesNotMatch(readme, /\bCV\b/);
  for (const text of [html, readme, JSON.stringify(profile), JSON.stringify(album)]) {
    assert.doesNotMatch(text, group);
    assert.doesNotMatch(text, alias);
  }
});

test("the Rwanda album is a curated set with author and licence", () => {
  const album = JSON.parse(readFileSync(new URL("../src/data/rwandaAlbum.json", import.meta.url), "utf8"));
  const photos = album.photos;
  const placed = /rwanda|kigali|nyamirambo|kimihurura|kimironko|rebero|gisozi|gasabo|kicukiro|nyarugenge|musanze|ruhengeri|kinigi|rubavu|gisenyi|butare|huye|karongi|cyangugu|rwamagana|muhanga|gitarama|nyungwe|akagera|lake kivu|lac kivu|bisoke|sabyinyo|karisimbi|muhabura|gahinga|mille collines|nyabarongo|bugesera|nyagatare|gicumbi|nyamagabe|ngororero|rulindo|kayonza|kirehe|rutsiro|nyamasheke|gisagara|muhazi|ihema|ruhondo|burera|volcanoes national park/i;
  const elsewhere = /biarritz|tenerife|el bailadero|hawai|loyal trooper|pennsylvania|dpla/i;
  const email = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
  assert.ok(photos.length >= 60 && photos.length <= 150, `photo count ${photos.length}`);
  assert.equal(album.count, photos.length);
  assert.doesNotMatch(JSON.stringify(album), email);
  for (const photo of photos) {
    const text = `${photo.title} ${photo.caption}`;
    assert.match(text, placed, photo.title);
    assert.doesNotMatch(text, elsewhere, photo.title);
    assert.ok(photo.credit, photo.title);
    assert.ok(photo.license, photo.title);
    assert.match(photo.src, /^https:\/\//);
  }
});

test("sitemap and robots still advertise the public site", () => {
  const robots = readFileSync(new URL("../site/robots.txt", import.meta.url), "utf8");
  const sitemap = readFileSync(new URL("../site/sitemap.xml", import.meta.url), "utf8");
  assert.match(robots, /Sitemap: https:\/\/arnold-rg\.github\.io\/sitemap\.xml/);
  assert.match(sitemap, /https:\/\/arnold-rg\.github\.io\/</);
  assert.match(sitemap, /https:\/\/arnold-rg\.github\.io\/hamwe\/</);
});
