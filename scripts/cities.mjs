// Paints the city panoramas as pixel art in the palette and light of public/cool-bg.jpg:
// a warped golden-hour sky with streaky cirrus, cumulus built from sunlit puffs, glass
// skylines, rippled reflections, foliage grown from leaf clumps, blooms, and each city's
// landmarks drawn shape by shape.
//   node scripts/cities.mjs [singapore|bengaluru]  -> public/cities/<city>.png
// Drawn at 400x137 and scaled 3x with nearest-neighbour, matching the 1200x411 SF frame.

import sharp from "sharp";

const W = 400;
const H = 137;
const SCALE = 3;

// ---------------------------------------------------------------- palette
// Sampled from the SF panorama (k-means), plus the greens and blossoms its foliage implies.
const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const P = Object.fromEntries(
  Object.entries({
    ink: "#172c3b", plum: "#5b2a4b", navy: "#344264", slate: "#52679a", haze: "#687eb1", hazeLt: "#8592b6",
    skyDeep: "#1f6cc0", sky: "#2987d2", skyMid: "#3a9ce0", skyLt: "#51a6e1", skyPale: "#74a0db", lav: "#97a4d9",
    lilac: "#baa0cb", pink: "#d59fae", paleBlue: "#aabde1", paleLilac: "#cfc5d4", peach: "#f4c2b0", apricot: "#f7d2a8",
    cloud: "#eddacb", cream: "#f9f2d7", ice: "#d3e9ee", mauve: "#815170", mauveLt: "#977c9a", rose: "#ae756e",
    waterDeep: "#1f62a8", water: "#2d81bb", waterLt: "#3e94c1", teal: "#56a0c6", sparkle: "#d3e9ee",
    g0: "#14291f", g1: "#1f3d2b", g2: "#2c5734", g3: "#43763a", g4: "#6c9a42", g5: "#a4c25a",
    trunk: "#4f3727", trunkLt: "#86663f", stone: "#eadcc4", stoneLt: "#fcf1dc", stoneMd: "#d8c3a8", stoneSh: "#b4a2ab",
    stoneDk: "#857aa0", orange: "#ec8f37", gold: "#f4b54a", magenta: "#d4408c", hotpink: "#e86f9f", blossom: "#f4a5c5",
    blossomLt: "#ffd3e5", violet: "#8a6fc2", violetLt: "#b8a0e4", red: "#c9463d", white: "#f8f1e2", asphalt: "#5f5d7c",
    asphaltLt: "#827f9e", yellow: "#f6cd47", green: "#2c8f4c", saffron: "#f39a3b", indiaGreen: "#2e8b47",
  }).map(([k, v]) => [k, hex(v)])
);
const mixc = (a, b, t) => [0, 1, 2].map((i) => Math.round(a[i] + (b[i] - a[i]) * t));

// ---------------------------------------------------------------- canvas and noise
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
].map((r) => r.map((v) => (v + 0.5) / 16));
const bayer = (x, y) => BAYER[((y % 4) + 4) % 4][((x % 4) + 4) % 4];
function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
const hash = (x, y, s) => {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 2246822519)) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
function noise(x, y, s = 1) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
const fbm = (x, y, s = 1) => noise(x, y, s) * 0.55 + noise(x * 2.1, y * 2.1, s + 7) * 0.3 + noise(x * 4.3, y * 4.3, s + 13) * 0.15;
// nearest jittered cell centre: the leaf clumps foliage is grown from
function worley(x, y, cell, seed) {
  const cx = Math.floor(x / cell), cy = Math.floor(y / cell);
  let best = null, bd = Infinity;
  for (let j = -1; j <= 1; j++)
    for (let i = -1; i <= 1; i++) {
      const gx = (cx + i + hash(cx + i, cy + j, seed) * 0.9 + 0.05) * cell;
      const gy = (cy + j + hash(cy + j, cx + i, seed + 1) * 0.9 + 0.05) * cell;
      const d = Math.hypot(x - gx, y - gy);
      if (d < bd) {
        bd = d;
        best = [gx, gy];
      }
    }
  return { d: bd / cell, nx: (x - best[0]) / cell, ny: (y - best[1]) / cell };
}

class Canvas {
  constructor() {
    this.d = new Uint8ClampedArray(W * H * 3);
    this.kind = new Uint8Array(W * H); // 0 sky, 1 structure, 2 water, 3 foliage
  }
  set(x, y, c, kind = 1) {
    x = Math.round(x);
    y = Math.round(y);
    if (!c || x < 0 || y < 0 || x >= W || y >= H) return;
    const i = (y * W + x) * 3;
    this.d[i] = c[0];
    this.d[i + 1] = c[1];
    this.d[i + 2] = c[2];
    this.kind[y * W + x] = kind;
  }
  get(x, y) {
    x = Math.max(0, Math.min(W - 1, Math.round(x)));
    y = Math.max(0, Math.min(H - 1, Math.round(y)));
    const i = (y * W + x) * 3;
    return [this.d[i], this.d[i + 1], this.d[i + 2]];
  }
  rect(x0, y0, x1, y1, c, kind = 1) {
    for (let y = Math.round(y0); y < Math.round(y1); y++)
      for (let x = Math.round(x0); x < Math.round(x1); x++) this.set(x, y, typeof c === "function" ? c(x, y) : c, kind);
  }
  poly(pts, color, kind = 1) {
    const ys = pts.map((p) => p[1]);
    const y0 = Math.max(0, Math.floor(Math.min(...ys))), y1 = Math.min(H - 1, Math.ceil(Math.max(...ys)));
    for (let y = y0; y <= y1; y++) {
      const xs = [];
      for (let i = 0; i < pts.length; i++) {
        const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % pts.length];
        if ((ay <= y + 0.5 && by > y + 0.5) || (by <= y + 0.5 && ay > y + 0.5)) xs.push(ax + ((y + 0.5 - ay) * (bx - ax)) / (by - ay));
      }
      xs.sort((a, b) => a - b);
      for (let k = 0; k + 1 < xs.length; k += 2)
        for (let x = Math.ceil(xs[k] - 0.5); x <= Math.floor(xs[k + 1] - 0.5); x++) this.set(x, y, typeof color === "function" ? color(x, y) : color, kind);
    }
  }
  disc(cx, cy, r, color, kind = 1, ry = r) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) {
        const dx = (x - cx) / r, dy = (y - cy) / ry;
        if (dx * dx + dy * dy > 1) continue;
        this.set(x, y, typeof color === "function" ? color(x, y, dx, dy) : color, kind);
      }
  }
  line(x0, y0, x1, y1, c, kind = 1) {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= n; i++) this.set(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, c, kind);
  }
}

// ---------------------------------------------------------------- sky
// Bands warped by slow noise, with a narrow dithered seam where neighbours meet.
function sky(cv, stops, bottom, seed) {
  for (let y = 0; y < bottom; y++)
    for (let x = 0; x < W; x++) {
      const yy = y + (fbm(x * 0.016, y * 0.05, seed) - 0.5) * 8;
      let i = 0;
      while (i < stops.length - 2 && yy > stops[i + 1][0]) i++;
      const [ya, ca] = stops[i], [yb, cb] = stops[i + 1];
      const t = Math.min(1, Math.max(0, (yy - ya) / (yb - ya)));
      const td = Math.min(1, Math.max(0, (t - 0.3) / 0.4));
      cv.set(x, y, td > bayer(x, y) ? cb : ca, 0);
    }
}

// Long streaky cirrus: a tapering bright core with fibrous feathers combed off its lower
// edge, like the streaks in the SF sky.
function cirrus(cv, { x, y, len, slope, seed, thick = 2.2, bend = 0 }) {
  for (let t = 0; t < len; t++) {
    const u = t / len;
    const w = Math.sin(u * Math.PI) ** 0.6;
    const py = y + t * slope + Math.sin(u * Math.PI) * bend;
    const half = Math.max(0.6, w * thick);
    if (noise(t * 0.18, 3, seed) < 0.16) continue;
    for (let k = -Math.ceil(half); k <= Math.ceil(half); k++) {
      const a = Math.abs(k) / half;
      if (a > 1.05) continue;
      if (a > 0.75 && hash(t, k, seed) < 0.45) continue;
      cv.set(x + t, py + k, a < 0.45 ? P.cream : a < 0.8 ? P.cloud : P.paleBlue, 0);
    }
    // feathers: short combed strands below the core
    if (hash(t, 7, seed) < 0.22 * w) {
      const fl = 2 + Math.round(hash(t, 8, seed) * 5 * w);
      for (let k = 1; k <= fl; k++) cv.set(x + t - k * 0.9, py + half + k * 0.55, k < fl * 0.5 ? P.cloud : P.paleBlue, 0);
    }
  }
}

// Cumulus: tiers of puffs drawn bottom-up, each lit from the sun on the left, so the cloud
// scallops where puffs overlap; the belly sinks into lilac and lavender.
function cumulus(cv, { x, base, w, h, seed, warm = 0 }) {
  const r = rng(seed);
  const puffs = [];
  const tier = (count, fy, fr, spread = 0.9) => {
    for (let i = 0; i < count; i++) {
      const f = (1 - spread) / 2 + spread * ((i + 0.5) / count) + (r() - 0.5) * (spread / count) * 0.8;
      const prof = Math.sin(Math.min(1, Math.max(0, f)) * Math.PI);
      const rad = h * fr * (0.55 + 0.6 * prof) * (0.85 + r() * 0.3);
      puffs.push([x + f * w, base - h * fy * (0.4 + 0.6 * prof) - rad * 0.35, rad]);
    }
  };
  tier(Math.max(4, Math.round(w / 11)), 0.18, 0.3, 1);
  tier(Math.max(3, Math.round(w / 15)), 0.5, 0.27, 0.82);
  tier(Math.max(2, Math.round(w / 22)), 0.82, 0.22, 0.6);
  for (const p of puffs.slice()) {
    if (p[1] > base - h * 0.35 || r() < 0.3) continue;
    const a = -Math.PI * (0.2 + r() * 0.6);
    puffs.push([p[0] + Math.cos(a) * p[2] * 0.8, p[1] + Math.sin(a) * p[2] * 0.75, p[2] * (0.32 + r() * 0.18)]);
  }
  puffs.sort((a, b) => b[1] + b[2] - (a[1] + a[2]));
  const tones = warm ? [P.cream, P.apricot, P.peach, P.pink, P.lilac, P.lav] : [P.cream, P.cloud, P.peach, P.paleLilac, P.lilac, P.lav];
  for (const [px, py, pr] of puffs)
    cv.disc(px, py, pr, (xx, yy, nx, ny) => {
      if (yy > base) return null;
      const puff = 0.5 + 0.5 * (-nx * 0.62 - ny * 0.78);
      const height = 1 - Math.max(0, Math.min(1, (yy - (base - h * 1.05)) / (h * 1.05)));
      let s = puff * 0.42 + height * 0.62 + 0.04;
      s += (bayer(xx, yy) - 0.5) * 0.08;
      return tones[s > 0.8 ? 0 : s > 0.66 ? 1 : s > 0.53 ? 2 : s > 0.42 ? 3 : s > 0.31 ? 4 : 5];
    }, 0);
  // the flat underside, smeared into streaks
  for (let xx = Math.round(x - h * 0.1); xx < x + w + h * 0.1; xx++)
    for (let k = 0; k < 2; k++) if (hash(xx, k, seed) < 0.75 && cv.kind[(base - k) * W + xx] === 0) cv.set(xx, base - k, k ? tones[4] : tones[5], 0);
}

// ---------------------------------------------------------------- buildings
const GLASS = { lit: P.paleBlue, litHi: P.ice, band: P.lav, shade: P.haze, shadeDk: P.slate, win: P.apricot };
const WARM = { lit: P.peach, litHi: P.cream, band: P.pink, shade: P.mauveLt, shadeDk: P.mauve, win: P.cream };
const LILAC = { lit: P.paleLilac, litHi: P.cream, band: P.lilac, shade: P.hazeLt, shadeDk: P.haze, win: P.apricot };
const fog = (s, t) => Object.fromEntries(Object.entries(s).map(([k, v]) => [k, mixc(v, P.lav, t)]));

// A tower: a sunlit glass face with floor bands and a glint, a shaded face with lit windows.
function tower(cv, { x, w, top, base, scheme = GLASS, seed, cap }) {
  const split = Math.max(2, Math.round(w * 0.58));
  for (let y = top; y < base; y++)
    for (let xx = x; xx < x + w; xx++) {
      const lx = xx - x;
      let c;
      if (lx < split) {
        c = (y - top) % 2 ? scheme.band : scheme.lit;
        if (lx % 3 === 2) c = mixc(c, scheme.band, 0.5);
        if (lx === 0 || ((y - top) < (base - top) * 0.3 && lx < 2)) c = scheme.litHi;
      } else {
        c = scheme.shade;
        if ((y - top) % 3 === 1 && lx < w - 1) c = hash(xx, y, seed) < 0.24 ? scheme.win : scheme.shadeDk;
      }
      cv.set(xx, y, c, 1);
    }
  const mid = x + Math.floor(w / 2);
  if (cap === "spire") {
    cv.rect(mid - 1, top - 3, mid + 1, top, scheme.shade, 1);
    cv.line(mid, top - 4, mid, top - 9, scheme.shadeDk, 1);
  }
  if (cap === "step") {
    cv.rect(x + 1, top - 3, x + w - 1, top, scheme.lit, 1);
    cv.rect(x + 2, top - 5, x + w - 2, top - 3, scheme.shade, 1);
  }
  if (cap === "crown") {
    cv.rect(x, top - 2, x + w, top, scheme.shadeDk, 1);
    for (let k = x; k < x + w; k += 2) cv.set(k, top - 3, scheme.litHi, 1);
  }
  if (cap === "slant") cv.poly([[x, top], [x + w, top], [x + w, top - Math.ceil(w * 0.6)]], scheme.lit, 1);
}

// ---------------------------------------------------------------- water
function water(cv, top, bottom, seed, sunX, horizonTint) {
  for (let y = top; y < bottom; y++) {
    const t = (y - top) / (bottom - top);
    const base = t < 0.1 ? mixc(P.teal, horizonTint, 0.45) : t < 0.25 ? P.teal : t < 0.48 ? P.waterLt : t < 0.75 ? P.water : P.waterDeep;
    for (let x = 0; x < W; x++) {
      const ripple = Math.round(Math.sin(y * 1.7 + x * 0.06 + seed) * (0.6 + t * 2));
      const sy = top - (y - top) * 1.1 - 1;
      const sx = x + ripple;
      const k = cv.kind[Math.max(0, Math.round(sy)) * W + Math.max(0, Math.min(W - 1, sx))];
      const src = cv.get(sx, sy);
      let c = k === 1 || k === 3 ? mixc(mixc(src, P.navy, 0.25), base, 0.32 + t * 0.32) : mixc(src, base, 0.66 + t * 0.26);
      if ((y * 3 + Math.floor(x / 7 + Math.sin(y) * 2)) % 5 === 0) c = mixc(c, base, 0.55);
      cv.set(x, y, c, 2);
    }
  }
  const r = rng(seed + 3);
  for (let i = 0; i < 340; i++) {
    const near = r() < 0.6;
    const y = Math.round(top + 1 + r() ** 0.8 * (bottom - top - 2));
    const spread = 18 + ((y - top) / (bottom - top)) * 60;
    const x = Math.round(near ? sunX + (r() - 0.5) * spread * 2 : r() * W);
    const len = 1 + Math.round(r() * (near ? 4 : 2));
    const c = near ? (r() > 0.5 ? P.cream : P.apricot) : P.sparkle;
    for (let k = 0; k < len; k++) if (cv.kind[y * W + x + k] === 2) cv.set(x + k, y, c, 2);
  }
}

// ---------------------------------------------------------------- foliage
const GREENS = [P.g0, P.g1, P.g2, P.g3, P.g4, P.g5];

// Foliage grown from leaf clumps: inside(x, y) gives the canopy and its normal; every clump
// is lit from the upper left, the gaps between clumps sink into shadow, blossoms take the
// lit clumps.
function canopy(cv, { x0, y0, x1, y1, inside, seed, cell = 4, tones = GREENS, blossom = null, bloomRate = 0.6 }) {
  for (let y = Math.floor(y0); y <= y1; y++)
    for (let x = Math.floor(x0); x <= x1; x++) {
      const g = inside(x, y);
      if (!g) continue;
      const wl = worley(x, y, cell, seed);
      let s = 0.5 + 0.28 * (-g.nx * 0.6 - g.ny * 0.8) + 0.3 * (-wl.nx * 0.65 - wl.ny * 0.8);
      if (wl.d > 0.55) s -= 0.3;
      s += (noise(x * 0.7, y * 0.7, seed) - 0.5) * 0.18;
      const lit = Math.max(0, Math.min(0.999, s));
      if (blossom && wl.d < 0.55 && hash(Math.floor((x - wl.nx * cell) / 1), Math.floor((y - wl.ny * cell) / 1), seed) < bloomRate) {
        cv.set(x, y, blossom[Math.min(blossom.length - 1, Math.floor(lit * blossom.length))], 3);
        continue;
      }
      cv.set(x, y, tones[Math.floor(lit * tones.length)], 3);
    }
}

function tree(cv, { cx, cy, rx, ry = rx * 0.78, seed, trunkTo, blossom, bloomRate, cell = 4, tones = GREENS }) {
  const rr = rng(seed);
  if (trunkTo) {
    for (let y = Math.round(cy); y < trunkTo; y++) {
      cv.set(cx - 1, y, P.trunkLt, 3);
      cv.set(cx, y, P.trunk, 3);
      cv.set(cx + 1, y, P.trunk, 3);
    }
    for (const s of [-1, 1]) cv.line(cx, cy + ry * 0.45, cx + s * rx * 0.5, cy, P.trunk, 3);
  }
  const blobs = [[cx, cy, rx * 0.75, ry * 0.75]];
  for (let i = 0; i < 9; i++) {
    const a = rr() * Math.PI * 2, d = 0.35 + rr() * 0.3;
    blobs.push([cx + Math.cos(a) * rx * d, cy + Math.sin(a) * ry * d * 0.9 - ry * 0.05, rx * (0.4 + rr() * 0.25), ry * (0.4 + rr() * 0.25)]);
  }
  canopy(cv, {
    x0: cx - rx * 1.3, y0: cy - ry * 1.3, x1: cx + rx * 1.3, y1: cy + ry * 1.2, seed, cell, tones, blossom, bloomRate,
    inside: (x, y) => {
      for (const [bx, by, brx, bry] of blobs) {
        const dx = (x - bx) / brx, dy = (y - by) / bry;
        if (dx * dx + dy * dy <= 1) return { nx: (x - cx) / rx, ny: (y - cy) / ry };
      }
      return null;
    },
  });
}

// The foreground keeps to the deeper greens, so it frames the scene the way SF's does.
const DEEP = [P.g0, P.g0, P.g1, P.g2, P.g3, P.g4];

function bushes(cv, { x0, x1, base, h, seed, cell = 3, blossom, bloomRate = 0.3, tones = GREENS }) {
  const rr = rng(seed);
  const humps = [];
  for (let x = x0; x < x1; x += 6 + rr() * 6) humps.push([x, h * (0.55 + rr() * 0.5)]);
  canopy(cv, {
    x0, y0: base - h * 1.2, x1, y1: base, seed, cell, blossom, bloomRate, tones,
    inside: (x, y) => {
      for (const [hx, hh] of humps) {
        const dx = (x - hx) / (hh * 1.2), dy = (y - base) / hh;
        if (dx * dx + dy * dy <= 1 && y <= base) return { nx: dx * 0.6, ny: dy };
      }
      return null;
    },
  });
}

// Blooms: little flowers with a lit petal, scattered over a strip.
function blooms(cv, { x0, x1, y0, y1, colors, seed, step = 4, rate = 0.5, onFoliage = true }) {
  for (let y = y0; y < y1; y += step - 1)
    for (let x = x0; x < x1; x += step) {
      if (hash(x, y, seed) > rate) continue;
      const bx = x + Math.round(hash(y, x, seed) * (step - 1)), by = y + Math.round(hash(x + 1, y, seed) * (step - 2));
      if (onFoliage && cv.kind[by * W + bx] !== 3) continue;
      const c = colors[Math.floor(hash(bx, by, seed + 2) * colors.length)];
      const lit = mixc(c, P.cream, 0.45);
      cv.set(bx, by, c, 3);
      cv.set(bx + 1, by, c, 3);
      cv.set(bx, by + 1, mixc(c, P.plum, 0.25), 3);
      cv.set(bx + 1, by + 1, c, 3);
      cv.set(bx, by - 1, lit, 3);
    }
}

// A palm: a ringed, leaning trunk and full fronds that droop, leaflets lit on top.
function palm(cv, { x, base, h, lean, seed, fronds = 12 }) {
  const rr = rng(seed);
  const pts = [];
  for (let i = 0; i <= h; i++) {
    const t = i / h;
    pts.push([x + lean * t * t * h * 0.32, base - t * h]);
  }
  pts.forEach(([tx, ty], i) => {
    cv.set(tx - 1, ty, i % 3 === 0 ? P.trunk : P.trunkLt, 3);
    cv.set(tx, ty, i % 3 === 0 ? P.trunk : mixc(P.trunkLt, P.trunk, 0.4), 3);
    cv.set(tx + 1, ty, P.trunk, 3);
  });
  const [px, py] = pts[pts.length - 1];
  const order = [...Array(fronds).keys()].sort((a, b) => Math.abs(b - fronds / 2) - Math.abs(a - fronds / 2));
  for (const f of order) {
    const a = -Math.PI * (-0.08 + (1.16 * f) / (fronds - 1)) + (rr() - 0.5) * 0.2;
    const len = 15 + rr() * 9;
    const droop = 0.5 + rr() * 0.7 + Math.abs(Math.cos(a)) * 0.5;
    for (let t = 0; t <= len; t++) {
      const u = t / len;
      const fx = px + Math.cos(a) * t, fy = py + Math.sin(a) * t * 0.7 + u * u * len * droop * 0.6;
      const leaf = Math.round((1 - Math.abs(u - 0.35)) * 4.2);
      for (const side of [-1, 1])
        for (let k = 1; k <= leaf; k++) {
          const lx = fx + (Math.cos(a + side * 1.25) * k) * 0.45, ly = fy + k * 0.85;
          cv.set(lx, ly, side < 0 ? (k < leaf ? P.g3 : P.g4) : k < leaf ? P.g2 : P.g3, 3);
        }
      cv.set(fx, fy, u < 0.6 ? P.g4 : P.g5, 3);
    }
  }
  cv.disc(px, py + 1, 2, P.g1, 3);
  cv.set(px - 1, py + 2, P.trunk, 3);
  cv.set(px + 1, py + 2, P.trunkLt, 3);
}

// ---------------------------------------------------------------- Singapore
function singapore() {
  const cv = new Canvas();
  const HZ = 96;
  sky(cv, [[0, P.skyDeep], [14, P.sky], [30, P.skyMid], [46, P.skyLt], [58, P.skyPale], [68, P.lav], [77, P.lilac], [85, P.pink], [91, P.peach], [96, P.apricot]], HZ, 2);
  cirrus(cv, { x: -6, y: 34, len: 80, slope: -0.32, seed: 1, thick: 2.2, bend: -3 });
  cirrus(cv, { x: 26, y: 46, len: 54, slope: -0.36, seed: 2, thick: 1.5 });
  cirrus(cv, { x: 92, y: 20, len: 44, slope: -0.3, seed: 3, thick: 1.4 });
  cirrus(cv, { x: 236, y: 20, len: 86, slope: -0.2, seed: 4, thick: 2, bend: -2 });
  cirrus(cv, { x: 320, y: 36, len: 84, slope: -0.26, seed: 5, thick: 1.8 });
  cirrus(cv, { x: 168, y: 24, len: 50, slope: -0.22, seed: 6, thick: 1.2 });
  cumulus(cv, { x: 190, base: 80, w: 128, h: 66, seed: 11 });
  cumulus(cv, { x: 306, base: 74, w: 104, h: 42, seed: 15, warm: 1 });
  cumulus(cv, { x: -12, base: 66, w: 78, h: 36, seed: 8, warm: 1 });
  cumulus(cv, { x: 128, base: 88, w: 54, h: 18, seed: 19, warm: 1 });

  // the far shore: the Gardens by the Bay on the left
  cv.rect(0, 89, 80, HZ, mixc(P.g2, P.haze, 0.5), 1);
  for (let x = 0; x < 80; x++) if (hash(x, 0, 5) < 0.6) cv.set(x, 88, mixc(P.g3, P.haze, 0.45), 1);
  cv.disc(10, HZ - 1, 9, (x, y, nx, ny) => (y > HZ - 1 ? null : (x + y) % 2 ? mixc(P.ice, P.lav, 0.3) : mixc(P.paleBlue, P.lav, 0.3)), 1, 6);
  for (const [sx, top, wide] of [[26, 64, 15], [42, 71, 11], [56, 60, 17], [70, 73, 10]]) {
    for (let y = top + 6; y < HZ - 2; y++) {
      cv.set(sx - 1, y, P.mauveLt, 1);
      cv.set(sx, y, P.mauve, 1);
    }
    cv.poly([[sx - 1.5, top + 9], [sx + 1.5, top + 9], [sx + wide / 2, top], [sx - wide / 2, top]], (x, y) => ((x + y) % 2 ? P.mauve : P.violetLt), 1);
    cv.line(sx - wide / 2, top, sx + wide / 2, top, P.blossom, 1);
    for (let k = 0; k <= wide; k += 2) cv.set(sx - wide / 2 + k, top - 1, hash(k, top, sx) > 0.4 ? P.g4 : P.g3, 1);
  }

  // the city: a far hazy row, then nearer glass
  const far = [[206, 66, 10, "step"], [218, 58, 9], [229, 62, 11, "crown"], [245, 54, 8, "spire"], [256, 60, 12], [272, 52, 10, "slant"], [286, 62, 9], [298, 50, 12, "crown"], [314, 58, 10], [330, 54, 11, "spire"], [346, 60, 12], [362, 56, 9, "step"], [374, 62, 12], [389, 58, 11]];
  for (const [x, top, w, cap] of far) tower(cv, { x, w, top, base: HZ, scheme: fog(GLASS, 0.32), seed: x, cap });
  const near = [[212, 70, 12, WARM], [226, 64, 10, GLASS, "crown"], [240, 72, 14, LILAC], [258, 66, 11, GLASS, "step"], [272, 74, 13, WARM], [289, 62, 12, GLASS, "spire"], [305, 70, 14, LILAC], [322, 66, 10, GLASS], [334, 72, 13, WARM, "crown"], [350, 64, 12, GLASS, "slant"], [366, 70, 11, LILAC], [380, 66, 13, GLASS, "step"]];
  for (const [x, top, w, scheme, cap] of near) tower(cv, { x, w, top, base: HZ, scheme, seed: x + 7, cap });

  // Marina Bay Sands: three towers on splayed legs, the SkyPark across the top
  for (let i = 0; i < 3; i++) {
    const cx = 100 + i * 24, top = 40 + i, base = HZ - 5;
    cv.poly([[cx - 6, top], [cx + 6, top], [cx + 8, base], [cx - 8, base]], (x, y) => {
      const left = x < cx;
      const band = (y - top) % 2 === 0;
      const sun = Math.max(0, 1 - (y - top) / (base - top));
      let c = left ? (band ? mixc(P.paleLilac, P.apricot, sun * 0.6) : mixc(P.ice, P.cream, sun * 0.5)) : band ? P.haze : P.hazeLt;
      if (left && x <= cx - 6 - ((y - top) / (base - top)) * 2 + 0.5) c = P.cream;
      if (!left && (y - top) % 4 === 1 && hash(x, y, 9) < 0.3) c = P.apricot;
      return c;
    }, 1);
    for (let y = top + 10; y < base; y++) {
      const g = ((y - top - 10) / (base - top - 10)) * 3;
      for (let k = -Math.floor(g / 2); k <= Math.ceil(g / 2); k++) cv.set(cx + k, y, k > 0 ? P.slate : P.navy, 1);
    }
  }
  cv.poly([[82, 36.5], [170, 35.5], [184, 37.5], [171, 40.5], [84, 41], [79, 39]], (x, y) => (y < 37.5 ? P.cream : y < 39.5 ? P.paleLilac : P.navy), 1);
  for (let x = 85; x < 170; x++) if (hash(x, 1, 2) > 0.38) cv.set(x, 34.5, hash(x, 2, 2) > 0.5 ? P.g4 : P.g3, 1);
  cv.rect(80, HZ - 7, 182, HZ, (x, y) => (y === HZ - 7 ? P.paleLilac : y === HZ - 4 && x % 3 === 0 ? P.apricot : y < HZ - 4 ? P.hazeLt : P.slate), 1);

  // the ArtScience Museum, a lotus of white fingers lit from the left
  for (let k = 0; k < 10; k++) {
    const a = -Math.PI * (0.1 + (0.8 * k) / 9);
    const len = 9 + Math.sin((k / 9) * Math.PI) * 5;
    for (let t = 0; t < len; t++) {
      const x = 196 + Math.cos(a) * t, y = HZ - 2 + Math.sin(a) * t;
      const c = Math.cos(a) < -0.25 ? P.cream : Math.cos(a) < 0.25 ? P.cloud : P.paleLilac;
      cv.set(x, y, c, 1);
      cv.set(x + 1, y, mixc(c, P.lilac, 0.45), 1);
    }
  }
  cv.rect(190, HZ - 3, 203, HZ, P.navy, 1);

  water(cv, HZ, H, 4, 118, P.peach);

  // a bumboat and its wake
  cv.rect(258, 108, 272, 110, P.white, 2);
  cv.rect(259, 106, 271, 108, P.red, 2);
  cv.rect(259, 105, 271, 106, mixc(P.red, P.cream, 0.4), 2);
  cv.rect(257, 110, 273, 111, P.plum, 2);
  for (let k = 0; k < 18; k++) cv.set(274 + k, 110 + (k % 4 < 2 ? 0 : 1), k % 3 ? P.sparkle : P.cream, 2);
  // a sailboat far out
  cv.poly([[150, 104], [150, 98], [154, 104]], P.cream, 2);
  cv.rect(148, 104, 156, 105, P.navy, 2);

  // the promenade rail
  for (let x = 92; x < 332; x++) {
    cv.set(x, 123, P.cream, 1);
    cv.set(x, 124, P.paleLilac, 1);
    cv.set(x, 129, P.stoneSh, 1);
    if (x % 9 === 0) for (let y = 123; y < 131; y++) cv.set(x, y, y === 123 ? P.cream : x % 18 === 0 ? P.stoneDk : P.stoneSh, 1);
  }
  cv.rect(92, 131, 332, H, (x, y) => ((x + (y % 2) * 3) % 6 === 0 ? P.stoneMd : P.stone), 1);

  // the frame: palms, a rain tree and bougainvillea
  tree(cv, { cx: 392, cy: 74, rx: 30, seed: 12, trunkTo: H });
  palm(cv, { x: 352, base: H, h: 66, lean: -0.6, seed: 14, fronds: 12 });
  palm(cv, { x: 26, base: H, h: 78, lean: 0.55, seed: 3, fronds: 13 });
  palm(cv, { x: 60, base: H, h: 60, lean: -0.5, seed: 9, fronds: 11 });
  bushes(cv, { x0: -6, x1: 112, base: H, h: 22, seed: 4, cell: 5, blossom: [P.plum, P.magenta, P.hotpink, P.blossom], bloomRate: 0.32, tones: DEEP });
  bushes(cv, { x0: 316, x1: 404, base: H, h: 26, seed: 6, cell: 5, blossom: [P.plum, P.magenta, P.hotpink, P.blossomLt], bloomRate: 0.3, tones: DEEP });
  blooms(cv, { x0: 0, x1: 110, y0: 118, y1: H, colors: [P.gold, P.orange, P.white], seed: 7, rate: 0.35 });
  blooms(cv, { x0: 318, x1: W, y0: 114, y1: H, colors: [P.orange, P.gold, P.violetLt], seed: 8, rate: 0.35 });
  return cv;
}

// ---------------------------------------------------------------- Bengaluru
function bengaluru() {
  const cv = new Canvas();
  const G = 103;
  sky(cv, [[0, P.skyDeep], [14, P.sky], [28, P.skyMid], [42, P.skyLt], [54, P.skyPale], [64, P.lav], [74, P.lilac], [83, P.pink], [91, P.peach], [99, P.apricot]], G, 7);
  cirrus(cv, { x: 2, y: 34, len: 92, slope: -0.3, seed: 21, thick: 2.2, bend: -3 });
  cirrus(cv, { x: 40, y: 46, len: 58, slope: -0.34, seed: 22, thick: 1.5 });
  cirrus(cv, { x: 120, y: 24, len: 64, slope: -0.26, seed: 23, thick: 1.6 });
  cirrus(cv, { x: 252, y: 26, len: 96, slope: -0.22, seed: 24, thick: 2.1, bend: -2 });
  cirrus(cv, { x: 318, y: 42, len: 70, slope: -0.28, seed: 25, thick: 1.4 });
  cumulus(cv, { x: 258, base: 78, w: 150, h: 62, seed: 33 });
  cumulus(cv, { x: -20, base: 74, w: 112, h: 46, seed: 31, warm: 1 });
  cumulus(cv, { x: 226, base: 86, w: 60, h: 20, seed: 35, warm: 1 });

  // the city behind, in haze
  const far = [[0, 66, 11, "step"], [13, 58, 9], [24, 62, 13, "crown"], [39, 52, 10, "spire"], [51, 64, 12], [65, 56, 10, "slant"], [77, 68, 9], [88, 60, 12], [300, 64, 11], [313, 54, 12, "crown"], [327, 62, 10], [339, 48, 12, "spire"], [353, 60, 11], [366, 54, 12, "step"], [380, 64, 10], [392, 56, 9]];
  for (const [x, top, w, cap] of far) tower(cv, { x, w, top, base: G, scheme: fog(x < 200 ? GLASS : LILAC, 0.3), seed: x + 3, cap });

  // Vidhana Soudha, warm granite lit from the left by a low sun
  const C = 200;
  const lit = (x) => mixc(P.stoneLt, P.apricot, Math.max(0, 0.45 - (x - 104) / 400));
  const front = (x) => mixc(P.stone, P.peach, Math.max(0, 0.3 - (x - 104) / 500));
  // the plinth and grand stair
  cv.rect(102, 98, 298, G, P.stoneSh, 1);
  cv.rect(102, 98, 298, 99, (x) => lit(x), 1);
  for (let y = 87; y < 99; y++) cv.rect(C - 22 - (y - 87), y, C + 22 + (y - 87), y + 1, y % 2 ? P.stoneLt : P.stoneMd, 1);
  // the wings, with arched windows and a cornice
  for (const [x0, x1] of [[106, 152], [248, 294]]) {
    cv.rect(x0, 78, x1, 98, (x) => front(x), 1);
    cv.rect(x0, 76, x1, 78, (x) => lit(x), 1);
    cv.rect(x0, 78, x1, 79, P.stoneSh, 1);
    for (let x = x0; x < x1; x += 2) cv.set(x, 75, (x) % 4 ? P.stoneMd : P.stoneLt, 1);
    for (let row = 0; row < 3; row++)
      for (let x = x0 + 3; x < x1 - 2; x += 5) {
        cv.rect(x, 82 + row * 5, x + 2, 85 + row * 5, P.navy, 1);
        cv.set(x, 82 + row * 5, P.slate, 1);
        cv.set(x + 1, 81 + row * 5, P.stoneSh, 1);
      }
    cv.rect(x1 - 2, 76, x1, 98, P.stoneSh, 1);
  }
  // the central block
  cv.rect(152, 64, 248, 98, (x) => front(x), 1);
  cv.rect(152, 64, 159, 98, (x) => lit(x), 1);
  cv.rect(241, 64, 248, 98, P.stoneSh, 1);
  cv.rect(150, 62, 250, 64, (x) => lit(x), 1);
  cv.rect(150, 64, 250, 65, P.stoneSh, 1);
  for (let x = 150; x < 250; x += 2) cv.set(x, 61, x % 4 ? P.stoneMd : P.stoneLt, 1);
  for (let row = 0; row < 5; row++)
    for (const x of [161, 166, 230, 235]) {
      cv.rect(x, 68 + row * 6, x + 2, 72 + row * 6, P.navy, 1);
      cv.set(x, 68 + row * 6, P.slate, 1);
    }
  // the portico: twelve columns with capitals before a deep shaded recess
  cv.rect(171, 62, 229, 90, P.slate, 1);
  cv.rect(171, 62, 229, 66, P.navy, 1);
  for (let k = 0; k < 12; k++) {
    const x = Math.round(172 + k * 4.7);
    cv.rect(x, 64, x + 2, 90, (xx) => lit(xx), 1);
    cv.rect(x + 2, 64, x + 3, 90, P.stoneSh, 1);
    cv.rect(x - 1, 63, x + 3, 64, P.stoneLt, 1);
  }
  cv.rect(168, 56, 232, 62, (x) => front(x), 1);
  cv.rect(168, 56, 232, 57, (x) => lit(x), 1);
  cv.rect(168, 61, 232, 62, P.stoneSh, 1);
  for (let x = 170; x < 230; x += 3) cv.set(x, 59, P.stoneSh, 1);
  cv.poly([[186, 56], [214, 56], [200, 49]], (x) => (x < C ? lit(x) : P.stoneMd), 1);
  cv.set(C, 52, P.gold, 1);
  // the drum, ringed with columns, and the great dome
  cv.rect(181, 44, 219, 56, (x) => front(x), 1);
  for (let x = 182; x < 219; x += 3) cv.rect(x, 46, x + 1, 55, x < C ? P.stoneLt : P.stoneSh, 1);
  cv.rect(180, 43, 220, 45, (x) => lit(x), 1);
  cv.disc(C, 43, 19, (x, y, nx, ny) => {
    if (y > 43) return null;
    const s = 0.55 + 0.45 * (-nx * 0.78 - ny * 0.42) + (bayer(x, y) - 0.5) * 0.1;
    const t = s > 0.82 ? mixc(P.stoneLt, P.apricot, 0.35) : s > 0.66 ? P.stoneLt : s > 0.5 ? P.stone : s > 0.36 ? P.stoneMd : s > 0.24 ? P.stoneSh : P.stoneDk;
    return Math.abs(nx) < 0.08 && ny < -0.2 ? mixc(t, P.stoneSh, 0.25) : t;
  }, 1, 20);
  cv.rect(C - 3, 21, C + 3, 25, P.stone, 1);
  cv.rect(C - 3, 21, C, 25, P.stoneLt, 1);
  cv.rect(C - 1, 17, C + 1, 21, P.stoneMd, 1);
  // the national flag over the dome
  cv.line(C, 6, C, 17, P.stoneDk, 1);
  cv.rect(C + 1, 6, C + 9, 8, P.saffron, 1);
  cv.rect(C + 1, 8, C + 9, 10, P.white, 1);
  cv.rect(C + 1, 10, C + 9, 12, P.indiaGreen, 1);
  cv.set(C + 5, 9, P.navy, 1);
  // the corner domes
  for (const [dx, dy, r] of [[156, 62, 6], [244, 62, 6], [110, 76, 4], [290, 76, 4]]) {
    cv.rect(dx - r, dy - 4, dx + r + 1, dy, (x) => (x < dx ? lit(x) : P.stoneMd), 1);
    cv.disc(dx, dy - 4, r, (x, y, nx, ny) => (y > dy - 4 ? null : -nx * 0.8 - ny * 0.5 > 0.25 ? P.stoneLt : nx > 0.35 ? P.stoneSh : P.stone), 1, r * 1.1);
    cv.rect(dx, dy - 4 - r * 1.1 - 2, dx + 1, dy - 4 - r * 1.1, P.stoneMd, 1);
  }

  // the lawn, mown in stripes, a path to the stair, and the road with an auto-rickshaw
  for (let y = G; y < 121; y++)
    for (let x = 0; x < W; x++) {
      const t = (y - G) / 18;
      const stripe = Math.floor((x + (y - G) * 1.3) / 16) % 2;
      let c = t < 0.3 ? (stripe ? P.g4 : P.g5) : t < 0.7 ? (stripe ? P.g3 : P.g4) : stripe ? P.g3 : P.g4;
      if (Math.abs(x - C) < 18 + (y - G) * 0.9) c = (x + y) % 5 === 0 ? P.stoneMd : P.stone;
      cv.set(x, y, c, 3);
    }
  bushes(cv, { x0: 106, x1: 168, base: 110, h: 6, seed: 51, cell: 2, blossom: [P.red, P.orange, P.gold, P.yellow], bloomRate: 0.45 });
  bushes(cv, { x0: 232, x1: 294, base: 110, h: 6, seed: 53, cell: 2, blossom: [P.red, P.orange, P.gold, P.yellow], bloomRate: 0.45 });
  cv.rect(0, 121, W, 129, P.asphalt, 1);
  cv.rect(0, 121, W, 122, P.asphaltLt, 1);
  for (let x = 6; x < W; x += 16) cv.rect(x, 125, x + 7, 126, P.paleLilac, 1);
  const ax = 286, ay = 126; // the auto-rickshaw, facing left
  cv.poly([[ax, ay - 9], [ax + 16, ay - 9], [ax + 18, ay - 5], [ax - 1, ay - 5]], P.yellow, 1);
  cv.rect(ax + 1, ay - 10, ax + 15, ay - 9, P.gold, 1);
  cv.rect(ax - 1, ay - 5, ax + 18, ay, P.green, 1);
  cv.rect(ax - 1, ay - 5, ax + 18, ay - 4, mixc(P.green, P.cream, 0.35), 1);
  cv.rect(ax, ay - 8, ax + 4, ay - 5, P.ice, 1);
  cv.rect(ax + 6, ay - 8, ax + 12, ay - 5, P.ink, 1);
  cv.set(ax - 1, ay - 3, P.cream, 1);
  for (const wx of [ax + 1, ax + 14]) {
    cv.rect(wx, ay, wx + 3, ay + 2, P.ink, 1);
    cv.set(wx + 1, ay, P.asphaltLt, 1);
  }

  // the frame: a rain tree, pink and golden trumpet trees in bloom, flowering beds
  tree(cv, { cx: 30, cy: 70, rx: 34, seed: 7, trunkTo: 121 });
  tree(cv, { cx: 78, cy: 84, rx: 24, seed: 19, trunkTo: 120, blossom: [P.mauve, P.hotpink, P.blossom, P.blossomLt], bloomRate: 0.7 });
  tree(cv, { cx: 8, cy: 98, rx: 20, seed: 27, trunkTo: 121, blossom: [P.mauve, P.hotpink, P.blossom, P.blossomLt], bloomRate: 0.7 });
  tree(cv, { cx: 370, cy: 74, rx: 32, seed: 33, trunkTo: 121, blossom: [P.rose, P.orange, P.gold, P.yellow], bloomRate: 0.72 });
  tree(cv, { cx: 326, cy: 90, rx: 20, seed: 37, trunkTo: 120, blossom: [P.mauve, P.hotpink, P.blossom, P.blossomLt], bloomRate: 0.7 });
  tree(cv, { cx: 400, cy: 98, rx: 18, seed: 43, trunkTo: 121 });
  bushes(cv, { x0: -6, x1: 150, base: H, h: 12, seed: 57, cell: 4, blossom: [P.plum, P.magenta, P.hotpink, P.blossom], bloomRate: 0.3, tones: DEEP });
  bushes(cv, { x0: 252, x1: 406, base: H, h: 12, seed: 59, cell: 4, blossom: [P.violet, P.violetLt, P.hotpink, P.blossomLt], bloomRate: 0.3, tones: DEEP });
  blooms(cv, { x0: 0, x1: 150, y0: 127, y1: H, colors: [P.gold, P.orange, P.white], seed: 61, rate: 0.4 });
  blooms(cv, { x0: 252, x1: W, y0: 127, y1: H, colors: [P.gold, P.orange, P.white], seed: 62, rate: 0.4 });
  for (let x = 150; x < 252; x++) {
    cv.set(x, 130, P.ink, 1);
    cv.set(x, 133, P.ink, 1);
    if (x % 4 === 0) for (let y = 129; y < H; y++) cv.set(x, y, y === 129 ? P.gold : P.ink, 1);
  }
  cv.rect(150, 134, 252, H, P.g2, 3);
  blooms(cv, { x0: 150, x1: 252, y0: 134, y1: H, colors: [P.red, P.gold], seed: 63, rate: 0.5, onFoliage: false });
  return cv;
}

// ---------------------------------------------------------------- write
async function write(cv, name) {
  const out = new URL(`../public/cities/${name}.png`, import.meta.url).pathname;
  await sharp(Buffer.from(cv.d), { raw: { width: W, height: H, channels: 3 } })
    .resize(W * SCALE, H * SCALE, { kernel: "nearest" })
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log("[cities]", out);
}

const only = process.argv[2];
if (!only || only === "singapore") await write(singapore(), "singapore");
if (!only || only === "bengaluru") await write(bengaluru(), "bengaluru");
