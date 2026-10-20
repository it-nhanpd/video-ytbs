// Chấm IoU của chân dựng (đa giác như RunnerAsset) với mặt nạ ống quần gốc; tối ưu độ rộng/đầu ống/tỉ lệ giày.
import fs from 'node:fs';
import {load, mask, CW, CH} from './lib.mjs';
const OX = 700, OY = 170;
const track = JSON.parse(fs.readFileSync('content/projects/_ref-run20/run20_track.json', 'utf8'));
const FR = [120, 121, 123, 124, 125, 126, 128, 129, 130, 131, 133, 134, 135, 136, 138, 139, 140, 141, 143, 144, 145, 146, 148, 149, 150, 151, 153];
const S = 3, GW = Math.ceil(CW / S), GH = Math.ceil(CH / S), YMIN = 480;
const down = (m) => {
  const g = new Uint8Array(GW * GH);
  for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
    const sx = x * S + 1, sy = y * S + 1;
    if (sy >= YMIN && m[sy * CW + sx]) g[y * GW + x] = 1;
  }
  return g;
};
const tg = [];
for (const f of FR) tg.push(down(mask(await load(f))));

const polyFill = (pts, widths, grow, scale = 1, shift = 0, ext = 0) => {
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
const fillPoly = (grid, poly) => {
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
const fillCircle = (grid, cx, cy, r) => {
  for (let gy = Math.max(0, Math.floor((cy - r) / S)); gy <= Math.min(GH - 1, Math.ceil((cy + r) / S)); gy++)
    for (let gx = Math.max(0, Math.floor((cx - r) / S)); gx <= Math.min(GW - 1, Math.ceil((cx + r) / S)); gx++) {
      const x = gx * S + 1, y = gy * S + 1;
      if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) grid[gy * GW + gx] = 1;
    }
};
const FOOT = {centroid: [54.7, 99.8], axisDeg: 16.5};
const DEG = Math.PI / 180;
const iouAll = (P, detail = false) => {
  let tot = 0;
  const per = [];
  track.frames.forEach((T, i) => {
    const g = new Uint8Array(GW * GH);
    for (const j of [0, 1]) {
      const L = T.legs[j];
      const th = (L.foot.ang - FOOT.axisDeg) * DEG;
      const dx = (P.tubeX - FOOT.centroid[0]) * P.fs, dy = (P.tubeY - FOOT.centroid[1]) * P.fs;
      const end = [L.foot.c[0] + Math.cos(th) * dx - Math.sin(th) * dy, L.foot.c[1] + Math.sin(th) * dx + Math.cos(th) * dy];
      const pts = [T.hip, L.k, end].map((p) => [p[0] - OX, p[1] - OY]);
      fillPoly(g, polyFill(pts, [P.wh, P.wk, P.wa], 0));
      fillCircle(g, pts[0][0], pts[0][1], P.wh / 2);
    }
    // vùng quan tâm: dưới gấu áo (YMIN) — g đã chỉ tính từ YMIN? cắt thủ công
    let tp = 0, fp = 0, fn = 0;
    const t = tg[i];
    for (let gy = Math.floor(YMIN / S); gy < GH; gy++) for (let gx = 0; gx < GW; gx++) {
      const a = g[gy * GW + gx], b = t[gy * GW + gx];
      if (a && b) tp++; else if (a) fp++; else if (b) fn++;
    }
    const v = tp / (tp + fp + fn);
    per.push(v);
    tot += v;
  });
  return detail ? per : tot / track.frames.length;
};
// --- giai đoạn 1: toàn cục (tubeX cố định 30) ---
let P = {wh: 92, wk: 80, wa: 66, tubeX: 30, tubeY: 10, fs: 0.78};
console.log('IoU với P ban đầu', iouAll(P).toFixed(3));
let best = iouAll(P);
const steps = {wh: 8, wk: 8, wa: 6, tubeY: 4, fs: 0.06};
for (let round = 0; round < 3; round++) for (const k of Object.keys(steps)) for (const d of [1, -1]) for (let it = 0; it < 6; it++) {
  const o = P[k]; P[k] = o + d * steps[k] / (round + 1);
  const v = iouAll(P); if (v > best + 1e-4) best = v; else { P[k] = o; break; }
}
console.log('IoU toàn cục (tubeX=30):', best.toFixed(3), JSON.stringify(P));
// --- giai đoạn 2: tinh chỉnh gối từng hình (hông ±15, gối ±40 quanh giá trị đo) ---
const frameIoU = (i, T) => {
  const g = new Uint8Array(GW * GH);
  for (const j of [0, 1]) {
    const L = T.legs[j];
    const th = (L.foot.ang - FOOT.axisDeg) * DEG;
    const dx = (P.tubeX - FOOT.centroid[0]) * P.fs, dy = (P.tubeY - FOOT.centroid[1]) * P.fs;
    const end = [L.foot.c[0] + Math.cos(th) * dx - Math.sin(th) * dy, L.foot.c[1] + Math.sin(th) * dx + Math.cos(th) * dy];
    const pts = [T.hip, L.k, end].map((p) => [p[0] - OX, p[1] - OY]);
    fillPoly(g, polyFill(pts, [P.wh, P.wk, P.wa], 0)); fillCircle(g, pts[0][0], pts[0][1], P.wh / 2);
  }
  let tp = 0, fp = 0, fn = 0; const t = tg[i];
  for (let gy = Math.floor(YMIN / S); gy < GH; gy++) for (let gx = 0; gx < GW; gx++) { const a = g[gy * GW + gx], b = t[gy * GW + gx]; if (a && b) tp++; else if (a) fp++; else if (b) fn++; }
  return tp / (tp + fp + fn);
};
const out = JSON.parse(JSON.stringify(track));
let before = 0, after = 0;
// hai lượt: lượt sau cho phép dịch tiếp ±45 (gối) / ±15 (hông) quanh kết quả lượt trước
for (let pass = 0; pass < 2; pass++) {
const snap = JSON.parse(JSON.stringify(out));
if (pass === 1) { before = 0; after = 0; }
out.frames.forEach((T, i) => {
  const T0 = snap.frames[i];
  before += frameIoU(i, T);
  for (const st of [12, 6, 3, 1.5]) {
    let imp = true, it = 0;
    while (imp && it++ < 20) {
      imp = false;
      let b = frameIoU(i, T);
      for (const [pt, p0, r] of [[T.legs[0].k, T0.legs[0].k, 45], [T.legs[1].k, T0.legs[1].k, 45], [T.hip, T0.hip, 15]]) for (const ax of [0, 1]) for (const d of [1, -1]) {
        const o = pt[ax]; pt[ax] = o + d * st;
        if (Math.hypot(pt[0] - p0[0], pt[1] - p0[1]) > r) { pt[ax] = o; continue; }
        const v = frameIoU(i, T); if (v > b + 1e-4) { b = v; imp = true; } else pt[ax] = o;
      }
    }
  }
  after += frameIoU(i, T);
});
console.log('lượt', pass + 1, 'IoU trung bình', (before / out.frames.length).toFixed(3), '→', (after / out.frames.length).toFixed(3));
}
const n = out.frames.length;
console.log('IoU trung bình: trước tinh chỉnh gối', (before / n).toFixed(3), '→ sau', (after / n).toFixed(3));
out.frames.forEach((T) => { T.legs.forEach((L) => { L.k = L.k.map((v) => +v.toFixed(1)); }); T.hip = T.hip.map((v) => +v.toFixed(1)); });
// kiểm độ giật khớp gối giữa hai hình liền kề (px, hệ khung gốc)
let jmax = 0; for (let i = 0; i < n; i++) for (const j of [0, 1]) { const a = out.frames[i].legs[j].k, b = out.frames[(i + 1) % n].legs[j].k; jmax = Math.max(jmax, Math.hypot(a[0] - b[0], a[1] - b[1])); }
console.log('dịch gối lớn nhất giữa hai hình liền kề:', jmax.toFixed(0), 'px');
// thử làm mượt gối theo thời gian (vòng) và so IoU
const smoothed = (w) => {
  const o2 = JSON.parse(JSON.stringify(out)); const N = out.frames.length;
  for (const L of [0, 1]) o2.frames.forEach((T, i) => { const a = out.frames[(i - 1 + N) % N].legs[L].k, b = out.frames[i].legs[L].k, c = out.frames[(i + 1) % N].legs[L].k; T.legs[L].k = [0, 1].map((q) => w * b[q] + ((1 - w) / 2) * (a[q] + c[q])); });
  return o2;
};
for (const w of [1, 0.6, 0.5, 0.4]) {
  const o2 = smoothed(w); let tot = 0; o2.frames.forEach((T, i) => { tot += frameIoU(i, T); });
  let jm = 0; for (let i = 0; i < n; i++) for (const L of [0, 1]) { const a = o2.frames[i].legs[L].k, b = o2.frames[(i + 1) % n].legs[L].k; jm = Math.max(jm, Math.hypot(a[0] - b[0], a[1] - b[1])); }
  console.log('trọng số giữ gối', w, '→ IoU', (tot / n).toFixed(3), ' dịch gối lớn nhất', jm.toFixed(0));
}
const final = smoothed(0.5);
final.frames.forEach((T) => { T.legs.forEach((L) => { L.k = L.k.map((v) => +v.toFixed(1)); }); T.hip = T.hip.map((v) => +v.toFixed(1)); });
fs.writeFileSync('_refs/run20/_track_refined.json', JSON.stringify({P, out: final}));
// ghi vào file chuyển động dùng khi dựng (hông + gối đã tinh chỉnh và làm mượt 0,5)
fs.writeFileSync('content/projects/_ref-run20/run20_track.json', JSON.stringify(final));
console.log('✓ đã ghi content/projects/_ref-run20/run20_track.json');
