// Lấp phần lõm ở đáy ảnh tay áo trên (run_arm_up.png): khi cánh tay trên quay khác góc cẳng tay, chỗ lõm không còn ôm vòm cẳng tay
// và lộ nền thành vệt cung sáng ở khuỷu. Mỗi cột giữa hai mũi lõm được kéo xuống tới đường nối hai mũi, chép hoa văn từ phía trên.
// Sao lưu bản gốc vào _refs/run20/backup/ (lần đầu) và luôn đọc từ bản sao lưu, nên chạy lại cho cùng kết quả.
import sharp from 'sharp';
import fs from 'node:fs';
const OUT = 'content/projects/_ref-run20/assets/run_arm_up.png';
const BAK = '_refs/run20/backup/run_arm_up.orig.png';
fs.mkdirSync('_refs/run20/backup', {recursive: true});
if (!fs.existsSync(BAK)) fs.copyFileSync(OUT, BAK);
const {data, info} = await sharp(BAK).ensureAlpha().raw().toBuffer({resolveWithObject: true});
const {width: W, height: H} = info;
const A = (x, y) => data[(y * W + x) * 4 + 3];
// đáy mờ đục thấp nhất của từng cột
const yb = [];
for (let x = 0; x < W; x++) {let b = -1; for (let y = H - 1; y >= 0; y--) if (A(x, y) > 128) {b = y; break;} yb.push(b);}
// hai mũi lõm: cột thấp nhất ở nửa trái và nửa phải của phần đáy
const cols = yb.map((y, x) => ({x, y})).filter((c) => c.y >= 0);
const mid = (cols[0].x + cols[cols.length - 1].x) / 2;
const tip = (side) => cols.filter((c) => (side < 0 ? c.x < mid : c.x >= mid)).reduce((a, c) => (c.y > a.y ? c : a));
const L = tip(-1), R = tip(1);
const out = Buffer.from(data);
let filled = 0;
for (let x = L.x + 1; x < R.x; x++) {
  const target = Math.round(L.y + ((R.y - L.y) * (x - L.x)) / (R.x - L.x));
  const gap = target - yb[x];
  if (gap <= 0) continue;
  // ghi đè cả 4 hàng mép cắt cũ (đục nhưng tối) rồi kéo xuống tới target
  for (let y = yb[x] - 3; y <= target; y++) {
    // chép đối xứng qua đáy cũ, lùi 8 px để tránh vệt tối khử răng cưa của mép cắt
    const sy = Math.max(0, yb[x] - 8 - (y - (yb[x] - 3)));
    for (let c = 0; c < 4; c++) out[(y * W + x) * 4 + c] = data[(sy * W + x) * 4 + c];
    out[(y * W + x) * 4 + 3] = 255;
    filled++;
  }
}
await sharp(out, {raw: {width: W, height: H, channels: 4}}).png().toFile(OUT);
console.log(`ảnh ${W}×${H}; mũi lõm trái (${L.x},${L.y}) phải (${R.x},${R.y}); đã lấp ${filled} px`);
