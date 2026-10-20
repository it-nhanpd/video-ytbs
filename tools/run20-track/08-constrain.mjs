// Ràng buộc giải phẫu cho track (chạy sau 07): hông gắn cứng vào thắt lưng, đùi/ống chân dài cố định (gối giải IK 2 đoạn),
// khuỷu tay tự do giải IK 2 đoạn từ vai (theo thân) tới bàn tay đo được. Đọc bản trước-08 (sao lưu lần đầu) nên chạy lại cho cùng kết quả.
import fs from 'node:fs';
import {load, mask} from './lib.mjs';
import {S, GW, GH, YMIN, down, polyFill, fillPoly, fillCircle} from './legiou.mjs';
const OUT = 'content/projects/_ref-run20/run20_track.json';
const PRE = '_refs/run20/run20_track_pre08.json';
if (!fs.existsSync(PRE)) fs.copyFileSync(OUT, PRE);
const T = JSON.parse(fs.readFileSync(PRE, 'utf8'));
const find = (o) => {if (o && typeof o === 'object') {if (o.type === 'runner') return o; for (const v of Object.values(o)) {const r = find(v); if (r) return r;}} return null;};
const R = find(JSON.parse(fs.readFileSync('content/projects/_ref-run20/scenes.json', 'utf8')));
const F = T.frames, T0 = F[0], DEG = Math.PI / 180, N = F.length;
const d = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const rd = (p) => [+p[0].toFixed(1), +p[1].toFixed(1)];
const rotAt = (f, v) => {const r = f.rot * DEG; return [Math.cos(r) * v[0] - Math.sin(r) * v[1], Math.sin(r) * v[0] + Math.cos(r) * v[1]];};
const toBody = (f, p) => {const v = rotAt(f, [p[0] - T0.belt[0], p[1] - T0.belt[1]]); return [f.belt[0] + v[0], f.belt[1] + v[1]];};
const med = (v) => {const s = [...v].sort((a, b) => a - b); return s[s.length >> 1];};
const sd = (v) => {const m = v.reduce((a, b) => a + b, 0) / v.length; return Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / v.length);};
// IK 2 đoạn: điểm giữa cách A một đoạn l1, cách B một đoạn l2; chọn nghiệm gần `pref` (hoặc theo hàm chọn). Ngoài tầm: duỗi thẳng.
const ik = (A, B, l1, l2, pick) => {
  const D = d(A, B), ux = (B[0] - A[0]) / D, uy = (B[1] - A[1]) / D;
  if (D >= l1 + l2) return {p: [A[0] + ux * l1, A[1] + uy * l1], straight: true};
  const x = (D * D + l1 * l1 - l2 * l2) / (2 * D), h = Math.sqrt(Math.max(0, l1 * l1 - x * x));
  const c = [A[0] + ux * x, A[1] + uy * x];
  const s = [[c[0] - uy * h, c[1] + ux * h], [c[0] + uy * h, c[1] - ux * h]];
  return {p: pick(s), straight: false};
};

// ---- Chân ----
// điểm cuối ống quần mà RunnerAsset vẽ (biến đổi điểm `tube` của ảnh giày), không phải cổ chân `a`
const ft = R.foot;
const tubeEnd = (L) => {const th = (L.foot.ang - ft.axisDeg) * DEG, dx = (ft.tube[0] - ft.centroid[0]) * ft.scale, dy = (ft.tube[1] - ft.centroid[1]) * ft.scale; return [L.foot.c[0] + Math.cos(th) * dx - Math.sin(th) * dy, L.foot.c[1] + Math.sin(th) * dx + Math.cos(th) * dy];};
// lệch hông so với thắt lưng (hệ thân): chọn (dx,dy) cho độ dài đùi (theo gối cũ) ổn định nhất
let best = null;
for (let dx = -120; dx <= 0; dx += 1) for (let dy = 50; dy <= 170; dy += 1) {
  const c = [0, 1].map((j) => sd(F.map((f) => {const v = rotAt(f, [dx, dy]); return d([f.belt[0] + v[0], f.belt[1] + v[1]], f.legs[j].k);}))).reduce((a, b) => a + b);
  if (!best || c < best.c) best = {dx, dy, c};
}
const hipOf = (f) => {const v = rotAt(f, [best.dx, best.dy]); return [f.belt[0] + v[0], f.belt[1] + v[1]];};
const H = F.map(hipOf), E = F.map((f) => f.legs.map(tubeEnd));
// hai chân cùng độ dài (khởi đầu): chọn (đùi, ống) cho tổng độ dịch gối so với gối đã khớp IoU (07) nhỏ nhất (L1, bền với vài gối lệch).
// Phóng dài để với tới mọi hình sẽ làm gối chân gập nhô ra trước ống quần gốc, nên hình ngoài tầm cho duỗi thẳng.
const pickNear = (L) => (s) => (d(s[0], L.k) < d(s[1], L.k) ? s[0] : s[1]);
let TH = 0, SH = 0, bestCost = Infinity;
for (let th = 130; th <= 220; th++) for (let sh = 90; sh <= 180; sh++) {
  let c = 0;
  for (let i = 0; i < N; i++) for (const j of [0, 1]) c += d(ik(H[i], E[i][j], th, sh, pickNear(F[i].legs[j])).p, F[i].legs[j].k);
  if (c < bestCost) {bestCost = c; TH = th; SH = sh;}
}
const len = [0, 1].map((j) => ({th: TH, sh: SH, reach: Math.max(...F.map((f, i) => d(H[i], E[i][j])))}));
const before = [0, 1].map((j) => ({th: F.map((f) => d(f.hip, f.legs[j].k)), sh: F.map((f, i) => d(f.legs[j].k, E[i][j]))}));
// Tinh chỉnh từng hình theo IoU với mặt nạ ống quần gốc (đa giác đúng như RunnerAsset, hông đã cố định):
// gối = IK với đùi/ống trong ±10% độ dài chung, phạt nhẹ khi lệch độ dài; 2 lượt luân phiên hai chân.
const FR = [120, 121, 123, 124, 125, 126, 128, 129, 130, 131, 133, 134, 135, 136, 138, 139, 140, 141, 143, 144, 145, 146, 148, 149, 150, 151, 153];
const OX = 700, OY = 170, W = R.leg.widths, LAM = 0.1;
const frameIoU = (i, hips, knees, tgt) => {
  const g = new Uint8Array(GW * GH);
  for (const j of [0, 1]) {
    const pts = [hips[j], knees[j], E[i][j]].map((p) => [p[0] - OX, p[1] - OY]);
    fillPoly(g, polyFill(pts, W, 0));
    fillCircle(g, pts[0][0], pts[0][1], W[0] / 2);
  }
  let tp = 0, fp = 0, fn = 0;
  for (let k = Math.floor(YMIN / S) * GW; k < GW * GH; k++) {const a = g[k], b = tgt[k]; if (a && b) tp++; else if (a) fp++; else if (b) fn++;}
  return tp / (tp + fp + fn);
};
const TGT = [];
for (let i = 0; i < N; i++) TGT.push(down(mask(await load(FR[i]))));
// tối ưu toàn cục (lệch hông dx,dy + đùi + ống) theo IoU trung bình, gối = IK thuần; khởi đầu từ nghiệm hình học ở trên
const hipAt = (f, dx, dy) => {const v = rotAt(f, [dx, dy]); return [f.belt[0] + v[0], f.belt[1] + v[1]];};
const meanIoU = (q) => F.reduce((acc, f, i) => {const h = hipAt(f, q.dx, q.dy); return acc + frameIoU(i, [h, h], f.legs.map((L, j) => ik(h, E[i][j], q.th, q.sh, pickNear(L)).p), TGT[i]);}, 0) / N;
const G = {dx: best.dx, dy: best.dy, th: TH, sh: SH};
let gBest = meanIoU(G);
for (const step of [8, 4, 2, 1]) for (let round = 0; round < 4; round++) for (const k of Object.keys(G)) for (const sg of [1, -1]) {
  for (;;) {const o = G[k]; G[k] = o + sg * step; const v = meanIoU(G); if (v > gBest + 1e-5) gBest = v; else {G[k] = o; break;}}
}
best.dx = G.dx; best.dy = G.dy; TH = G.th; SH = G.sh;
for (let i = 0; i < N; i++) H[i] = hipOf(F[i]);
len.forEach((l) => {l.th = TH; l.sh = SH;});
console.log(`toàn cục theo IoU: hông (${G.dx}, ${G.dy}), đùi ${TH}, ống ${SH}, IoU IK thuần ${gBest.toFixed(3)}`);

// Từng hình: mỗi chân một gốc đùi riêng, lệch tối đa HMAX px quanh tâm khung chậu gắn thắt lưng (khung chậu có bề ngang:
// chân duỗi ra sau mọc từ phía sau, chân trước từ phía trước); đùi/ống ±10%. Chọn theo IoU trừ phạt lệch.
// Sau đó làm mượt vòng [1,2,1]/4 độ lệch và độ dài, gối giải lại bằng IK (không còn gối nhảy giữa hai hình).
const HMAX = 25, HLAM = 0.03;
const kneeMove = [], iouOld = [], iouNew = [], lenDev = [];
const sol = [];
const kneesOf = (i, hs, ls) => F[i].legs.map((L, j) => ik(hs[j], E[i][j], ls[j][0], ls[j][1], pickNear(L)).p);
const pen = (os, ls) => os.reduce((a, o) => a + (HLAM * Math.hypot(o[0], o[1])) / HMAX, 0) + LAM * ls.reduce((a, [th, sh]) => a + Math.abs(th - TH) / TH + Math.abs(sh - SH) / SH, 0);
for (let i = 0; i < N; i++) {
  const f = F[i], tgt = TGT[i];
  iouOld.push(frameIoU(i, [f.hip, f.hip], f.legs.map((L) => L.k), tgt));
  let os = [[0, 0], [0, 0]], ls = [[TH, SH], [TH, SH]];
  const score = (os2, ls2) => {const hs = os2.map((o) => hipAt(f, best.dx + o[0], best.dy + o[1])); return frameIoU(i, hs, kneesOf(i, hs, ls2), tgt) - pen(os2, ls2);};
  let cur = score(os, ls);
  for (let pass = 0; pass < 2; pass++) for (const j of [0, 1]) {
    for (let ox = -HMAX; ox <= HMAX; ox += 5) for (let oy = -HMAX; oy <= HMAX; oy += 5) {
      if (Math.hypot(ox, oy) > HMAX) continue;
      const o2 = os.map((x) => [...x]); o2[j] = [ox, oy];
      const v = score(o2, ls); if (v > cur) {cur = v; os = o2;}
    }
    for (let th = TH * 0.9; th <= TH * 1.1 + 1e-6; th += 3) for (let sh = SH * 0.9; sh <= SH * 1.1 + 1e-6; sh += 3) {
      const l2 = ls.map((x) => [...x]); l2[j] = [th, sh];
      const v = score(os, l2); if (v > cur) {cur = v; ls = l2;}
    }
  }
  sol.push({os, ls});
}
const sm = (get) => sol.map((_, i) => (get(sol[(i - 1 + N) % N]) + 2 * get(sol[i]) + get(sol[(i + 1) % N])) / 4);
const osS = [0, 1].map((j) => [sm((s) => s.os[j][0]), sm((s) => s.os[j][1])]);
const lsS = [0, 1].map((j) => [sm((s) => s.ls[j][0]), sm((s) => s.ls[j][1])]);
const hipShift = [];
const frames = F.map((f, i) => {
  const hs = [0, 1].map((j) => hipAt(f, best.dx + osS[j][0][i], best.dy + osS[j][1][i]));
  const ls = [0, 1].map((j) => [lsS[j][0][i], lsS[j][1][i]]);
  const knees = kneesOf(i, hs, ls);
  iouNew.push(frameIoU(i, hs, knees, TGT[i]));
  ls.forEach(([th, sh]) => lenDev.push(Math.max(Math.abs(th - TH) / TH, Math.abs(sh - SH) / SH)));
  [0, 1].forEach((j) => hipShift.push(Math.hypot(osS[j][0][i], osS[j][1][i])));
  f.legs.forEach((L, j) => kneeMove.push(d(knees[j], L.k)));
  // hip = tâm khung chậu (giữ cho công cụ cũ); mỗi chân có hip riêng cho RunnerAsset
  return {...f, hip: rd(hipAt(f, best.dx, best.dy)), legs: f.legs.map((L, j) => ({...L, hip: rd(hs[j]), k: rd(knees[j])}))};
});

// ---- Tay tự do ----
// vai lúc nghỉ = đỉnh ảnh tay áo trên (armUp.top) đặt theo pivot tại khuỷu cũ; dài cánh tay trên/cẳng tay lấy từ ảnh
const au = R.armUp, af = R.armFore, sc = R.armScale;
const top = au.top ?? [56, 6];
const E0 = [T0.chest[0] + R.elbow[0], T0.chest[1] + R.elbow[1]];
const ar = au.rotDeg * DEG, tv = [(top[0] - au.pivot[0]) * sc, (top[1] - au.pivot[1]) * sc];
const S0 = [E0[0] + Math.cos(ar) * tv[0] - Math.sin(ar) * tv[1], E0[1] + Math.sin(ar) * tv[0] + Math.cos(ar) * tv[1]];
const lf = d(af.hand, af.pivot) * sc;
// gốc vung tay gần như thẳng quanh vai: cánh tay trên dài đủ để mọi hình với tới (gập nhẹ), không ngắn hơn ảnh
const reachArm = Math.max(...F.map((f, i) => d(toBody(f, S0), f.hand)));
const lu = Math.max(Math.hypot(tv[0], tv[1]), reachArm - lf + 1);
let straightArm = 0;
frames.forEach((f, i) => {
  const S = toBody(F[i], S0);
  // khuỷu chĩa ra sau (x nhỏ hơn)
  const r = ik(S, f.hand, lu, lf, (s) => (s[0][0] < s[1][0] ? s[0] : s[1]));
  if (r.straight) straightArm++;
  f.shoulder = rd(S);
  f.elbow = rd(r.p);
});

fs.writeFileSync(OUT, JSON.stringify({...T, frames}));
const st = (v) => `${Math.min(...v).toFixed(0)}–${Math.max(...v).toFixed(0)} (sd ${sd(v).toFixed(1)})`;
console.log(`hông = thắt lưng + R(rot)·(${best.dx}, ${best.dy})`);
[0, 1].forEach((j) => console.log(`chân ${j}: đùi cũ ${st(before[j].th)} → ${len[j].th.toFixed(1)}; ống cũ ${st(before[j].sh)} → ${len[j].sh.toFixed(1)}; tầm xa nhất ${len[j].reach.toFixed(1)}`));
const avg = (v) => (v.reduce((a, b) => a + b, 0) / v.length).toFixed(3);
console.log(`IoU chân (đa giác RunnerAsset vs mặt nạ gốc): trước ${avg(iouOld)} → sau ${avg(iouNew)}; hình tệ nhất sau ${Math.min(...iouNew).toFixed(3)}; lệch độ dài lớn nhất ${(Math.max(...lenDev) * 100).toFixed(0)}%`);
console.log("IoU từng hình cũ→mới: " + iouOld.map((v, i) => `i${i}:${v.toFixed(2)}→${iouNew[i].toFixed(2)}`).join(" "));
console.log(`hông lệch khỏi vị trí gắn thắt lưng: lớn nhất ${Math.max(...hipShift).toFixed(1)} px (giới hạn ${HMAX})`);
console.log(`gối dịch: trung vị ${med(kneeMove).toFixed(1)}, lớn nhất ${Math.max(...kneeMove).toFixed(1)} px`);
console.log(`vai nghỉ ${rd(S0)}, cánh tay trên ${lu.toFixed(1)}, cẳng tay ${lf.toFixed(1)}; hình tay duỗi thẳng (ngoài tầm): ${straightArm}/${N}`);
