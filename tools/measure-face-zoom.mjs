import sharp from 'sharp';
const dir = '_refs/run20/frames';
const rows = [];
for (let n = 30; n <= 600; n += 15) {
  const {data, info} = await sharp(`${dir}/f_${String(n).padStart(4, '0')}.jpg`).resize(1260, 540).raw().toBuffer({resolveWithObject: true});
  let c = 0, sx = 0, sy = 0, ymin = 1e9;
  for (let y = 0; y < 200; y++) for (let x = 0; x < 1260; x++) {
    const i = (y * info.width + x) * 3, r = data[i], g = data[i + 1], b = data[i + 2];
    if (r > 205 && g > 165 && g < 215 && b > 140 && b < 200 && r - b > 28 && r - b < 70) { c++; sx += x; sy += y; if (y < ymin) ymin = y; }
  }
  rows.push(`${(n / 30).toFixed(1)}s count=${c} faceX=${c ? (sx / c / 1260).toFixed(3) : '-'} faceY=${c ? (sy / c / 540).toFixed(3) : '-'} scale~${Math.sqrt(c).toFixed(1)}`);
}
console.log(rows.join('\n'));
