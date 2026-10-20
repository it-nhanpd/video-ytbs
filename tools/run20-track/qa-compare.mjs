import sharp from 'sharp';
const FR = [120, 121, 123, 124, 125, 126, 128, 129, 130, 131, 133, 134, 135, 136, 138, 139, 140, 141, 143, 144, 145, 146, 148, 149, 150, 151, 153];
const idx = process.argv[2].split(',').map(Number);
const out = process.argv[3];
const dir = process.argv[4] ?? '/d/remotion-tmp/rt1';
const s = 1920 / 2520;
const oy = Math.round((1080 - 1080 * s) / 2);
const rh = Math.round(1080 * s);
const crop = {left: Math.round(1000 * s), top: Math.round(oy + 150 * s), width: Math.round(780 * s), height: Math.round(900 * s)};
const tiles = [];
for (const i of idx) {
  const full = await sharp(`_refs/run20/frames/f_${String(FR[i]).padStart(4, '0')}.jpg`)
    .resize(1920, rh)
    .extend({top: oy, bottom: 1080 - rh - oy, background: '#000'})
    .png()
    .toBuffer();
  const ref = await sharp(full).extract(crop).png().toBuffer();
  const mine = await sharp(`${dir}/m_${String(i).padStart(2, '0')}.png`).extract(crop).png().toBuffer();
  // nửa trong suốt: dựng đè lên gốc
  const half = await sharp(mine).ensureAlpha().toBuffer();
  const ov = await sharp(ref).composite([{input: await sharp(half).linear([1, 1, 1, 0.55], [0, 0, 0, 0]).toBuffer(), blend: 'over'}]).png().toBuffer();
  const lab = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${crop.width}" height="30"><text x="6" y="22" font-size="22" fill="yellow" stroke="black" stroke-width="1">i${i} (f${FR[i]})</text></svg>`);
  tiles.push(
    await sharp({create: {width: crop.width * 3 + 8, height: crop.height, channels: 3, background: '#000'}})
      .composite([{input: ref, left: 0, top: 0}, {input: mine, left: crop.width + 4, top: 0}, {input: ov, left: crop.width * 2 + 8, top: 0}, {input: lab, left: 4, top: 2}])
      .png()
      .toBuffer(),
  );
}
await sharp({create: {width: crop.width * 3 + 8, height: crop.height * tiles.length + 4 * (tiles.length - 1), channels: 3, background: '#222'}})
  .composite(tiles.map((t, k) => ({input: t, left: 0, top: k * (crop.height + 4)})))
  .png()
  .toFile(out);
console.log('crop', JSON.stringify(crop));
