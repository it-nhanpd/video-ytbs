// Tạm: đo quỹ đạo bàn tay tự do (pixel màu da, vùng bên phải thân, y>600) theo khung, để suy ra chu kỳ đung đưa.
import sharp from 'sharp';
import fs from 'node:fs';
const dir = '_refs/run20/frames';
const from = Number(process.argv[2] ?? 241), to = Number(process.argv[3] ?? 420);
const out = [];
for (let n = from; n <= to; n++) {
  const f = `${dir}/f_${String(n).padStart(4, '0')}.jpg`;
  const {data, info} = await sharp(f).resize(1260, 540).raw().toBuffer({resolveWithObject: true});
  let sx = 0, sy = 0, c = 0;
  for (let y = 300; y < 540; y++) for (let x = 760; x < 1100; x++) {
    const i = (y * info.width + x) * 3, r = data[i], g = data[i + 1], b = data[i + 2];
    if (r > 205 && g > 165 && g < 215 && b > 140 && b < 200 && r - b > 28 && r - b < 70) { sx += x; sy += y; c++; }
  }
  out.push([n, c, c ? +(sx / c).toFixed(1) : null, c ? +(sy / c).toFixed(1) : null]);
}
fs.writeFileSync(process.argv[4] ?? 'tools/_tmp_period.json', JSON.stringify(out));
console.log(out.map((o) => o.join(',')).join('\n'));
