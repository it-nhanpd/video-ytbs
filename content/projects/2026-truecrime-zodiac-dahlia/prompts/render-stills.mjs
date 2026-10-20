// Script render toàn bộ các still frame đại diện của 8 chương để kiểm toán hình ảnh trong 1 lệnh duy nhất.
// Dùng: node content/projects/2026-truecrime-zodiac-dahlia/prompts/render-stills.mjs
import {execSync} from 'node:child_process';
import fs from 'node:fs';

const shots = [
  {id: 'P01', frame: 60, desc: 'Chương mở đầu - Reenactment phác họa chì màu 1992'},
  {id: 'P05', frame: 45, desc: 'Chương mở đầu - Bản đồ địa lý California'},
  {id: 'P08', frame: 60, desc: 'Chương mở đầu - Bảng ghim điều tra 2 đại án'},
  {id: 'C106', frame: 50, desc: 'Chương 1 - Bàn hồ sơ giải phẫu Thược Dược Đen L2-L3'},
  {id: 'C204', frame: 50, desc: 'Chương 2 - Báo cáo Đại bồi thẩm đoàn LA 1950 Frank Jemison'},
  {id: 'C310', frame: 60, desc: 'Chương 3 - Bàn phân tích mật mã Z13 và lá thư Zodiac'},
  {id: 'C404', frame: 50, desc: 'Chương 4 - Bảng đối soát 13 chữ cái Marvin Merrill'},
  {id: 'C505', frame: 50, desc: 'Chương 5 - Hồ sơ quản chế và mốc thời gian Margolis'},
  {id: 'C604', frame: 60, desc: 'Chương 6 - Sách Hollywood Babylon II 1984 Kenneth Anger'},
  {id: 'J703', frame: 60, desc: 'Chương 7 - Bảng tổng kết đối chiếu 2 đại án'},
];

console.log('=== BẮT ĐẦU RENDER STILL AUDIT (10 KHUNG HÌNH ĐẠI DIỆN 8 CHƯƠNG) ===');
for (const s of shots) {
  const comp = `2026-truecrime-zodiac-dahlia-vox-${s.id}`;
  const out = `content/projects/2026-truecrime-zodiac-dahlia/renders/still-${s.id}.png`;
  if (fs.existsSync(out) && fs.statSync(out).size > 10000) {
    console.log(`[ĐÃ CÓ SẴN] Bỏ qua ${s.id}: ${out}`);
    continue;
  }
  console.log(`\nRendering ${s.id} (${s.desc}) tại frame ${s.frame}...`);
  try {
    execSync(`npx remotion still engine/src/index.ts ${comp} ${out} --frame=${s.frame}`, {stdio: 'inherit'});
    console.log(`✓ Đã xuất: ${out}`);
  } catch (e) {
    console.error(`✗ Lỗi render ${s.id}:`, e.message);
  }
}
console.log('\n=== HOÀN TẤT RENDER STILL AUDIT ===');
