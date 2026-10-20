// Hàm dựng đa giác chân như RunnerAsset và tô lưới (tách từ 07-refine-legs để 08 dùng lại; 07 vẫn giữ bản riêng).
import {CW, CH} from './lib.mjs';
export const S = 3, GW = Math.ceil(CW / S), GH = Math.ceil(CH / S), YMIN = 480;
export const down = (m) => {
  const g = new Uint8Array(GW * GH);
  for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
    const sx = x * S + 1, sy = y * S + 1;
    if (sy >= YMIN && m[sy * CW + sx]) g[y * GW + x] = 1;
  }
  return g;
};
export const polyFill = (pts, widths, grow, scale = 1, shift = 0, ext = 0) => {
  const seg = [0, 1].map((i) => {
    const dx = pts[i + 1][0] - pts[i][0], dy = pts[i + 1][1] - pts[i][1], L = Math.hypot(dx, dy) || 1;
    return {dx: dx / L, dy: dy / L, nx: dy / L, ny: -dx / L};
  });
  const half = widths.map((w) => (w * scale + grow) / 2);
  const c = pts.map((p, i) => {
    const sg = seg[Math.min(i, 1)], sg0 = seg[Math.max(i - 1, 0)];
    const nx = i === 1 ? sg0.nx + sg.nx : sg.nx, ny = i === 1 ? sg0.ny + sg.ny : sg.ny, nl = Math.hypot(nx, ny) || 1;
    return [p[0] + (nx / nl) * shift * widths[i], p[1] + (ny / nl) * shift * widths[i]];
  });
  const end = [c[2][0] + seg[1].dx * ext, c[2][1] + seg[1].dy * ext];
  const P = [c[0], c[1], end];
  const side = (sgn) => {
    const out = [[P[0][0] + sgn * seg[0].nx * half[0], P[0][1] + sgn * seg[0].ny * half[0]]];
    const cross = seg[0].dx * seg[1].dy - seg[0].dy * seg[1].dx, outerSgn = cross < 0 ? -1 : 1;
    if (sgn === outerSgn) {
      const a0 = Math.atan2(sgn * seg[0].ny, sgn * seg[0].nx), a1 = Math.atan2(sgn * seg[1].ny, sgn * seg[1].nx);
      const dl = ((((a1 - a0 + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;
      for (let t = 0; t <= 8; t++) { const an = a0 + (dl * t) / 8; out.push([P[1][0] + Math.cos(an) * half[1], P[1][1] + Math.sin(an) * half[1]]); }
    } else {
      const mx = seg[0].nx + seg[1].nx, my = seg[0].ny + seg[1].ny, dot = seg[0].nx * seg[1].nx + seg[0].ny * seg[1].ny;
      let kx = (mx / (1 + dot)) * half[1], ky = (my / (1 + dot)) * half[1];
      const kl = Math.hypot(kx, ky), lim = half[1] * 1.6;
      if (kl > lim) { kx *= lim / kl; ky *= lim / kl; }
      out.push([P[1][0] + sgn * kx, P[1][1] + sgn * ky]);
    }
    out.push([P[2][0] + sgn * seg[1].nx * half[2], P[2][1] + sgn * seg[1].ny * half[2]]);
    return out;
  };
  return [...side(1), ...side(-1).reverse()];
};
export const fillPoly = (grid, poly) => {
  let minY = 1e9, maxY = -1e9;
  for (const p of poly) { minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]); }
  for (let gy = Math.max(0, Math.floor(minY / S)); gy <= Math.min(GH - 1, Math.ceil(maxY / S)); gy++) {
    const y = gy * S + 1, xs = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      if ((a[1] <= y && b[1] > y) || (b[1] <= y && a[1] > y)) xs.push(a[0] + ((y - a[1]) / (b[1] - a[1])) * (b[0] - a[0]));
    }
    xs.sort((p, q) => p - q);
    for (let k = 0; k + 1 < xs.length; k += 2) for (let gx = Math.max(0, Math.ceil((xs[k] - 1) / S)); gx <= Math.min(GW - 1, Math.floor((xs[k + 1] - 1) / S)); gx++) grid[gy * GW + gx] = 1;
  }
};
export const fillCircle = (grid, cx, cy, r) => {
  for (let gy = Math.max(0, Math.floor((cy - r) / S)); gy <= Math.min(GH - 1, Math.ceil((cy + r) / S)); gy++)
    for (let gx = Math.max(0, Math.floor((cx - r) / S)); gx <= Math.min(GW - 1, Math.ceil((cx + r) / S)); gx++) {
      const x = gx * S + 1, y = gy * S + 1;
      if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) grid[gy * GW + gx] = 1;
    }
};
