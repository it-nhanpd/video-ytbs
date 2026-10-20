// Ghép nhiều tấm nền (cùng chiều cao) thành MỘT tấm toàn cảnh lặp vòng, trộn mờ ở mỗi chỗ nối kể cả mối nối cuối → đầu.
// Dùng: node tools/concat-plates.mjs --out <png> [--blend 0.12] [--height 1080] <ảnh1[@trái,phải]> <ảnh2> ...  (@trái,phải = tỉ lệ cắt bỏ mép, vd. @0,0.07)
// Chiều rộng kết quả = tổng rộng − (số ảnh × vùng chồng). In ra tỉ lệ cao/rộng để đặt `aspect` cho layer image (tile wrap).
import sharp from 'sharp';

const args = process.argv.slice(2);
const opt = (k, d) => {
  const i = args.indexOf(`--${k}`);
  return i >= 0 ? args[i + 1] : d;
};
const out = opt('out');
const blend = Number(opt('blend', '0.12'));
const H = Number(opt('height', '1080'));
const files = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
if (!out || files.length < 1) {
  console.error('Dùng: node tools/concat-plates.mjs --out <png> [--blend 0.12] [--height 1080] <ảnh>...');
  process.exit(1);
}

const imgs = [];
for (const spec of files) {
  const [f, trim] = spec.split('@');
  const [tl, tr] = trim ? trim.split(',').map(Number) : [0, 0];
  const meta = await sharp(f).metadata();
  const left = Math.round(meta.width * tl);
  const width = meta.width - left - Math.round(meta.width * tr);
  const {data, info} = await sharp(f).removeAlpha().extract({left, top: 0, width, height: meta.height}).resize({height: H}).raw().toBuffer({resolveWithObject: true});
  imgs.push({data, w: info.width});
}
// --match-sky 0.2: cân màu trời giữa các tấm (gain theo kênh từ trung bình của 20% hàng trên) để không lộ dải sáng ở chỗ nối.
const skyFrac = Number(opt('match-sky', '0'));
if (skyFrac > 0) {
  const means = imgs.map((im) => {
    const m = [0, 0, 0];
    const rows = Math.round(H * skyFrac);
    for (let y = 0; y < rows; y++) for (let x = 0; x < im.w; x++) for (let c = 0; c < 3; c++) m[c] += im.data[(y * im.w + x) * 3 + c];
    return m.map((v) => v / (rows * im.w));
  });
  const target = [0, 1, 2].map((c) => means.reduce((a, m) => a + m[c], 0) / means.length);
  imgs.forEach((im, k) => {
    const g = [0, 1, 2].map((c) => target[c] / means[k][c]);
    for (let i = 0; i < im.data.length; i += 3) for (let c = 0; c < 3; c++) im.data[i + c] = Math.max(0, Math.min(255, im.data[i + c] * g[c]));
    console.log(`  cân trời tấm ${k + 1}: gain ${g.map((v) => v.toFixed(3)).join(',')}`);
  });
}
const ov = Math.round(Math.min(...imgs.map((i) => i.w)) * blend);
const starts = [];
let s = 0;
for (const im of imgs) {
  starts.push(s);
  s += im.w - ov;
}
const P = s; // chu kỳ lặp
const buf = Buffer.alloc(P * H * 3);
for (let x = 0; x < P; x++) {
  const acc = [0, 0, 0];
  let wsum = 0;
  const hits = [];
  imgs.forEach((im, k) => {
    for (const off of [-P, 0, P]) {
      const lx = x + off - starts[k];
      if (lx < 0 || lx >= im.w) continue;
      const wgt = Math.max(1e-3, Math.min(1, (lx + 0.5) / ov, (im.w - lx - 0.5) / ov));
      hits.push({k, lx, wgt});
    }
  });
  for (const h of hits) wsum += h.wgt;
  for (let y = 0; y < H; y++) {
    acc[0] = acc[1] = acc[2] = 0;
    for (const h of hits) {
      const i = (y * imgs[h.k].w + h.lx) * 3;
      acc[0] += imgs[h.k].data[i] * h.wgt;
      acc[1] += imgs[h.k].data[i + 1] * h.wgt;
      acc[2] += imgs[h.k].data[i + 2] * h.wgt;
    }
    const o = (y * P + x) * 3;
    buf[o] = acc[0] / wsum;
    buf[o + 1] = acc[1] / wsum;
    buf[o + 2] = acc[2] / wsum;
  }
}
await sharp(buf, {raw: {width: P, height: H, channels: 3}}).png().toFile(out);
console.log(`✓ ${out}: ${P}×${H}, ${files.length} tấm, chồng ${ov}px mỗi mối nối; aspect (cao/rộng) = ${(H / P).toFixed(5)}`);
