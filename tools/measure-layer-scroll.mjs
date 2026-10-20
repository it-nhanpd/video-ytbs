// Đo tốc độ trôi ngang của các dải y (lớp) giữa hai khung: tương quan chéo hồ sơ độ sáng theo cột, bỏ vùng nhân vật.
import sharp from 'sharp';
const dir = '_refs/run20/frames';
const [fa, fb, W = 1260] = [Number(process.argv[2] ?? 90), Number(process.argv[3] ?? 105), 1260];
const ex0 = Number(process.argv[4] ?? 0.40), ex1 = Number(process.argv[5] ?? 0.66);
const bands = [[0.05, 0.15], [0.18, 0.28], [0.30, 0.40], [0.42, 0.52], [0.54, 0.60], [0.66, 0.74], [0.80, 0.90]];
const load = async (n) => sharp(`${dir}/f_${String(n).padStart(4, '0')}.jpg`).resize(W, 540).greyscale().raw().toBuffer();
const A = await load(fa), B = await load(fb);
const prof = (buf, y0, y1) => { const p = new Float64Array(W); for (let x = 0; x < W; x++) { let s = 0; for (let y = y0; y < y1; y++) s += buf[y * W + x]; p[x] = s / (y1 - y0); } return p; };
for (const [a, b] of bands) {
  const y0 = Math.round(a * 540), y1 = Math.round(b * 540);
  const pa = prof(A, y0, y1), pb = prof(B, y0, y1);
  let best = 0, bs = -1e9;
  for (let s = -140; s <= 20; s++) {
    let sum = 0, n = 0;
    for (let x = 100; x < W - 160; x++) { if (x > W * ex0 && x < W * ex1) continue; const xb = x + s; if (xb < 0 || xb >= W) continue; sum -= Math.abs(pa[x] - pb[xb]); n++; }
    sum /= n; if (sum > bs) { bs = sum; best = s; }
  }
  console.log(`y ${a}-${b}: dịch ${best}px/${((fb - fa) / 30).toFixed(2)}s = ${(best / W / ((fb - fa) / 30)).toFixed(3)} W/s (điểm ${bs.toFixed(2)})`);
}
