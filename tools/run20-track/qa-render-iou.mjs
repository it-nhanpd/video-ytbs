// Chấm IoU chân TRÊN VIDEO ĐÃ RENDER: cảnh `rtestm` (chân tô #ff00ff) so với mặt nạ ống quần của khung gốc, cùng tỉ lệ 1920.
// Dùng: node tools/run20-track/qa-render-iou.mjs <thư mục khung dựng m_00..m_26.png>
import sharp from 'sharp';
const FR = [120, 121, 123, 124, 125, 126, 128, 129, 130, 131, 133, 134, 135, 136, 138, 139, 140, 141, 143, 144, 145, 146, 148, 149, 150, 151, 153];
const dir = process.argv[2] ?? 'D:/remotion-tmp/rm';
const s = 1920 / 2520;
const oy = Math.round((1080 - 1080 * s) / 2);
const rh = Math.round(1080 * s);
const box = {left: Math.round(700 * s), top: Math.round(oy + 650 * s), width: Math.round(1060 * s), height: Math.round((1080 - 650 - 5) * s)};
const per = [];
for (let i = 0; i < FR.length; i++) {
  const refFull = await sharp(`_refs/run20/frames/f_${String(FR[i]).padStart(4, '0')}.jpg`).resize(1920, rh).extend({top: oy, bottom: 1080 - rh - oy, background: '#000'}).png().toBuffer();
  const ref = await sharp(refFull).extract(box).removeAlpha().raw().toBuffer({resolveWithObject: true});
  const mine = await sharp(`${dir}/m_${String(i).padStart(2, '0')}.png`).extract(box).removeAlpha().raw().toBuffer({resolveWithObject: true});
  let tp = 0, fp = 0, fn = 0;
  for (let p = 0; p < ref.info.width * ref.info.height; p++) {
    const o = p * 3;
    const R = ref.data[o], G = ref.data[o + 1], B = ref.data[o + 2];
    const a = Math.abs(R - G) <= 9 && G - B >= 0 && G - B <= 14 && R - B <= 16 && R >= 70 && R <= 140;
    const r2 = mine.data[o], g2 = mine.data[o + 1], b2 = mine.data[o + 2];
    const b = r2 > 150 && b2 > 150 && g2 < 120;
    if (a && b) tp++; else if (b) fp++; else if (a) fn++;
  }
  per.push(tp / (tp + fp + fn));
}
const mean = per.reduce((x, y) => x + y, 0) / per.length;
console.log('IoU chân trên video render, trung bình', mean.toFixed(3), 'min', Math.min(...per).toFixed(3), 'max', Math.max(...per).toFixed(3));
console.log(per.map((v, i) => `${i}:${v.toFixed(2)}`).join(' '));
