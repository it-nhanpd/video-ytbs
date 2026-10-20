import sharp from 'sharp';
const FR = [120, 121, 123, 124, 125, 126, 128, 129, 130, 131, 133, 134, 135, 136, 138, 139, 140, 141, 143, 144, 145, 146, 148, 149, 150, 151, 153];
const dir = process.argv[2];
const out = process.argv[3];
const from = Number(process.argv[4] ?? 0);
const to = Number(process.argv[5] ?? 26);
const s = 1920 / 2520;
const oy = Math.round((1080 - 1080 * s) / 2);
const rh = Math.round(1080 * s);
const crop = {left: Math.round(1000 * s), top: Math.round(oy + 150 * s), width: Math.round(780 * s), height: Math.round(900 * s)};
const TW = 230;
const TH = Math.round((crop.height * TW) / crop.width);
const refT = [];
const mineT = [];
for (let i = from; i <= to; i++) {
  const full = await sharp(`_refs/run20/frames/f_${String(FR[i]).padStart(4, '0')}.jpg`).resize(1920, rh).extend({top: oy, bottom: 1080 - rh - oy, background: '#000'}).png().toBuffer();
  const lab = (t) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${TW}" height="26"><text x="4" y="20" font-size="20" fill="yellow" stroke="black" stroke-width="1">${t}</text></svg>`);
  refT.push(await sharp(await sharp(full).extract(crop).resize(TW, TH).png().toBuffer()).composite([{input: lab(`G${i}`), left: 0, top: 0}]).png().toBuffer());
  mineT.push(await sharp(await sharp(`${dir}/m_${String(i).padStart(2, '0')}.png`).extract(crop).resize(TW, TH).png().toBuffer()).composite([{input: lab(`M${i}`), left: 0, top: 0}]).png().toBuffer());
}
const n = refT.length;
const cols = Math.min(n, 7);
const rowsPer = Math.ceil(n / cols);
const comp = [];
for (let r = 0; r < rowsPer; r++) {
  for (let c = 0; c < cols; c++) {
    const k = r * cols + c;
    if (k >= n) continue;
    comp.push({input: refT[k], left: c * (TW + 2), top: r * (TH * 2 + 6)});
    comp.push({input: mineT[k], left: c * (TW + 2), top: r * (TH * 2 + 6) + TH + 2});
  }
}
await sharp({create: {width: cols * (TW + 2), height: rowsPer * (TH * 2 + 6), channels: 3, background: '#222'}}).composite(comp).png().toFile(out);
console.log('ok', n);
