// Screenshots + geometry assertions at the design breakpoints.
//   node scripts/shots.mjs [url] [outDir]
// Env:
//   SIZES="1440x900,375x812"           viewports (default: all five)
//   SECTIONS="top,search@0.5,work"     ids to capture; "@p" scrolls p of the way through a pinned section;
//                                       "css=#case-turing figure" targets any selector
//   MOTION=reduce                       emulate prefers-reduced-motion
//   NOGL=1                              disable WebGL (fallback path)

import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const url = process.argv[2] ?? "http://localhost:3000";
const out = process.argv[3] ?? "shots";
const sizes = (process.env.SIZES ?? "375x812,768x1024,1024x768,1440x900,1920x1080")
  .split(",")
  .map((s) => s.split("x").map(Number));
const sections = (process.env.SECTIONS ?? "top,search@0.1,search@0.5,search@0.95,work,craft,open-source,path,principles,contact")
  .split(",")
  .filter(Boolean);

const args = process.env.NOGL
  ? ["--disable-gpu", "--disable-webgl", "--disable-webgl2"]
  : ["--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--ignore-gpu-blocklist"];

await mkdir(out, { recursive: true });
const browser = await chromium.launch({ args });
const failures = [];

for (const [width, height] of sizes) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
    reducedMotion: process.env.MOTION === "reduce" ? "reduce" : "no-preference",
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(3200); // boot log + hero intro

  const geo = await page.evaluate(() => {
    const r = (el) => el && el.getBoundingClientRect();
    const wrap = document.querySelector("#top .wrap");
    const cs = wrap && getComputedStyle(wrap);
    const box = wrap && {
      left: r(wrap).left + parseFloat(cs.paddingLeft),
      right: r(wrap).right - parseFloat(cs.paddingRight),
    };
    const name = r(document.querySelector("#top h1 > span"));
    const nav = r(document.querySelector("header[data-nav]"));
    return {
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
      navH: nav?.height,
      container: box && Math.round(box.right - box.left),
      nameLeft: name && box && +(name.left - box.left).toFixed(1),
      nameRight: name && box && +(box.right - name.right).toFixed(1),
    };
  });
  const tag = `${width}x${height}`;
  console.log(tag, JSON.stringify(geo));
  if (geo.overflowX > 0) failures.push(`${tag}: horizontal overflow ${geo.overflowX}px`);
  if (Math.abs(geo.nameLeft) > 1 || Math.abs(geo.nameRight) > 1) failures.push(`${tag}: name not fitted (${geo.nameLeft}, ${geo.nameRight})`);
  const expectNav = width >= 1024 ? 64 : 56;
  if (geo.navH !== expectNav) failures.push(`${tag}: nav ${geo.navH} ≠ ${expectNav}`);

  for (const spec of sections) {
    const [id, frac] = spec.split("@");
    const y = await page.evaluate(
      ([id, frac]) => {
        const el = id.startsWith("css=") ? document.querySelector(id.slice(4)) : document.getElementById(id);
        if (!el) return null;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const nav = id === "top" || frac ? 0 : parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h"));
        const pin = frac ? (el.offsetHeight - window.innerHeight) * Number(frac) : 0;
        return Math.max(0, top - nav + pin);
      },
      [id, frac]
    );
    if (y === null) continue;
    // Step through the scroll so scroll-triggered reveals fire on the way.
    await page.evaluate(async (target) => {
      const lenis = window.__lenis;
      const from = window.scrollY;
      const steps = 12;
      for (let i = 1; i <= steps; i++) {
        window.scrollTo(0, from + ((target - from) * i) / steps);
        await new Promise((r) => setTimeout(r, 40));
      }
      lenis?.resize?.();
    }, y);
    await page.waitForTimeout(1400);
    await page.screenshot({ path: `${out}/${tag}-${spec.replace("@", "_").replace(/[^\w.-]+/g, "_")}.png` });
  }

  if (errors.length) failures.push(`${tag}: ${errors.length} console error(s): ${errors.slice(0, 3).join(" | ")}`);
  await page.close();
}

await browser.close();
if (failures.length) {
  console.log("\nFAIL\n" + failures.map((f) => "  - " + f).join("\n"));
  process.exitCode = 1;
} else console.log("\nPASS");
