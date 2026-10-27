// Renders the share image (with my illustrated portrait) and the KP icons into app/, in the
// site's own font.
//   npm run build && node scripts/og.mjs
// (The build provides the self-hosted Onest files.)
// Colours are the tokens from app/tokens.css, as hex.

import { readFile, readdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const media = new URL("../out/_next/static/media/", import.meta.url);
const css = (await readdir(new URL("../out/_next/static/css/", import.meta.url))).filter((f) => f.endsWith(".css"));
const sheet = (await Promise.all(css.map((f) => readFile(new URL(`../out/_next/static/css/${f}`, import.meta.url), "utf8")))).join("");

// The preloaded (".p.") file of each family is its latin subset.
const fontFile = (family) => {
  const re = new RegExp(`font-family:"?${family}"?;[^}]*?src:url\\(/_next/static/media/([^)]+\\.p\\.woff2)\\)`);
  const m = sheet.match(re);
  if (!m) throw new Error(`no latin file for ${family}; run npm run build first`);
  return m[1];
};
const b64 = async (url) => (await readFile(url)).toString("base64");
const onest = await b64(new URL(fontFile("Onest"), media));
const img = async (name, type) => `data:${type};base64,${await b64(new URL(`../public/me/${name}`, import.meta.url))}`;
const portrait = await img("illustrated-900.webp", "image/webp");

// paper oklch(99.3% 0.002 270), paper-2 96.7%, ink 21%, muted 53%.
const C = { paper: "#fcfcfd", paper2: "#f4f4f6", ink: "#18191c", muted: "#6c6e75" };

const base = `
@font-face { font-family: O; src: url(data:font/woff2;base64,${onest}) format("woff2"); font-weight: 100 900; }
* { margin: 0; box-sizing: border-box; }
body { background: ${C.paper}; }
`;

// My illustrated portrait, whole, beside the line I'm known by.
const og = `<!doctype html><html><head><style>${base}
.wrap { position: relative; width: 1200px; height: 630px; overflow: hidden; background: ${C.paper}; }
.portrait { position: absolute; left: 80px; top: 55px; width: 390px; height: 522px; border-radius: 32px; overflow: hidden; background: ${C.paper2}; box-shadow: 0 24px 48px -28px rgba(24, 25, 28, 0.45); }
.portrait img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.head { position: absolute; left: 552px; top: 150px; width: 580px; font: 600 76px/1.02 O; letter-spacing: -0.035em; color: ${C.ink}; }
.lead { position: absolute; left: 552px; top: 336px; width: 540px; font: 400 28px/1.36 O; letter-spacing: -0.012em; color: ${C.muted}; }
.url { position: absolute; left: 552px; bottom: 115px; font: 500 22px/1 O; color: ${C.ink}; }
</style></head><body><div class="wrap">
<div class="portrait"><img src="${portrait}"></div>
<div class="head">I’ve been coding since 6th grade.</div>
<div class="lead">I’m Krisna Pranav, a senior AI/ML engineer at Turing, based in Singapore.</div>
<div class="url">krishpranav.github.io</div>
</div></body></html>`;

// The icon: my initials in Onest 600, paper on an ink tile, the site's one filled recipe.
// The tab icon has rounded corners on a transparent ground; the Apple icon is full-bleed,
// since iOS rounds it itself. The letters sit on the cap-height centre, not the em box.
const icon = (size, rounded) => `<!doctype html><html><head><style>${base}
body { background: transparent; }
div { width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;
  background: ${C.ink}; border-radius: ${rounded ? Math.round(size * 0.22) : 0}px; }
span { font: 600 ${Math.round(size * 0.54)}px/1 O; letter-spacing: -0.04em; color: ${C.paper};
  transform: translate(-0.02em, 0.03em); }
</style></head><body><div><span>KP</span></div></body></html>`;

const browser = await chromium.launch();
const shoot = async (html, w, h, out, transparent = false) => {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await writeFile(new URL(out, import.meta.url), await page.screenshot({ type: "png", omitBackground: transparent }));
  await page.close();
  console.log(`[og] ${out}`);
};
await shoot(og, 1200, 630, "../app/opengraph-image.png");
await shoot(og, 1200, 630, "../app/twitter-image.png");
await shoot(icon(64, true), 64, 64, "../app/icon.png", true);
await shoot(icon(180, false), 180, 180, "../app/apple-icon.png");
await browser.close();
