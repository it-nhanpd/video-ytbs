// Tách nền phẳng của ảnh đạo cụ (vd. trực thăng trên nền xám) thành PNG trong suốt, cắt sát mép.
// Dùng: node tools/cutout.mjs <in.jpg|png> <out.png> [--tol 12] [--min-hole 1500] [--pad 12] [--erode 0]
//   --erode N: co mép N px để bỏ viền xám sót quanh nhân vật (nên dùng 2 cho ảnh nhân vật đặt lên nền tối).
// Màu nền = trung vị 4 góc. Tô loang từ mép những điểm gần màu nền (≤ tol), rồi xóa thêm các vùng kín
// cùng màu nền rộng ≥ min-hole px (khe giữa cánh quạt/đuôi). Vùng kín nhỏ hơn (kính, chi tiết) giữ nguyên.
import sharp from 'sharp';

const args = process.argv.slice(2);
const [src, out] = args;
const opt = (k, d) => {
  const i = args.indexOf(`--${k}`);
  return i >= 0 ? Number(args[i + 1]) : d;
};
if (!src || !out) {
  console.error('Dùng: node tools/cutout.mjs <in> <out.png> [--tol 12] [--min-hole 1500] [--pad 12]');
  process.exit(1);
}
const tol = opt('tol', 12);
const minHole = opt('min-hole', 1500);
const pad = opt('pad', 12);
const erode = opt('erode', 0);

const {data, info} = await sharp(src).ensureAlpha().raw().toBuffer({resolveWithObject: true});
const {width: W, height: H} = info;
const at = (x, y) => (y * W + x) * 4;
const corners = [at(2, 2), at(W - 3, 2), at(2, H - 3), at(W - 3, H - 3)];
const med = (c) => corners.map((i) => data[i + c]).sort((a, b) => a - b).slice(1, 3).reduce((a, b) => a + b) / 2;
const bg = [med(0), med(1), med(2)];
const near = (p) => Math.max(Math.abs(data[p] - bg[0]), Math.abs(data[p + 1] - bg[1]), Math.abs(data[p + 2] - bg[2])) <= tol;

// 0 = chưa xét, 1 = nền (xóa), 2 = đã xét thuộc vùng kín.
const mark = new Uint8Array(W * H);
const fill = (seeds, label) => {
  const stack = [...seeds];
  const got = [];
  while (stack.length) {
    const k = stack.pop();
    if (mark[k]) continue;
    const x = k % W;
    const y = (k - x) / W;
    if (!near(k * 4)) continue;
    mark[k] = label;
    got.push(k);
    if (x > 0) stack.push(k - 1);
    if (x < W - 1) stack.push(k + 1);
    if (y > 0) stack.push(k - W);
    if (y < H - 1) stack.push(k + W);
  }
  return got;
};
const edge = [];
for (let x = 0; x < W; x++) edge.push(x, (H - 1) * W + x);
for (let y = 0; y < H; y++) edge.push(y * W, y * W + W - 1);
fill(edge, 1);
let holes = 0;
for (let k = 0; k < W * H; k++) {
  if (mark[k] || !near(k * 4)) continue;
  const got = fill([k], 2);
  if (got.length >= minHole) {
    for (const g of got) mark[g] = 1;
    holes++;
  }
}
// Co mép vùng giữ (xóa viền nền sót do khử răng cưa): mỗi vòng xóa điểm giữ kề điểm nền.
for (let r = 0; r < erode; r++) {
  const edgePx = [];
  for (let k = 0; k < W * H; k++) {
    if (mark[k] === 1) continue;
    const x = k % W;
    if ((x > 0 && mark[k - 1] === 1) || (x < W - 1 && mark[k + 1] === 1) || (k >= W && mark[k - W] === 1) || (k < W * (H - 1) && mark[k + W] === 1)) edgePx.push(k);
  }
  for (const k of edgePx) mark[k] = 1;
}
let [x0, y0, x1, y1] = [W, H, 0, 0];
for (let k = 0; k < W * H; k++) {
  if (mark[k] === 1) data[k * 4 + 3] = 0;
  else {
    const x = k % W;
    const y = (k - x) / W;
    [x0, y0, x1, y1] = [Math.min(x0, x), Math.min(y0, y), Math.max(x1, x), Math.max(y1, y)];
  }
}
const left = Math.max(0, x0 - pad);
const top = Math.max(0, y0 - pad);
await sharp(data, {raw: {width: W, height: H, channels: 4}})
  .extract({left, top, width: Math.min(W, x1 + pad + 1) - left, height: Math.min(H, y1 + pad + 1) - top})
  .png()
  .toFile(out);
console.log(`✓ ${out}: nền rgb(${bg.map(Math.round)}), xóa thêm ${holes} vùng kín, cắt ${x1 - x0 + 1}×${y1 - y0 + 1}`);
