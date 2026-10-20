// Dựng các tấm "tài liệu" trên bàn điều tra (assets/docs/*.png) bằng SVG → PNG (sharp).
// Đây là ĐỒ HỌA PHỎNG DỰNG từ trích dẫn đã kiểm chứng (research/03-facts.md), KHÔNG phải ảnh scan gốc; mỗi tấm ghi rõ ở chân trang.
// Vùng tô sáng (mark) của từng tấm đọc từ vox.json để khối chữ chính luôn nằm đúng chỗ bút dạ quang sẽ tô.
// Dùng: node content/projects/2026-truecrime-zodiac-dahlia/prompts/make-docs.mjs
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const dir = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const out = path.join(dir, 'assets/docs');
fs.mkdirSync(out, {recursive: true});
const vox = JSON.parse(fs.readFileSync(path.join(dir, 'vox.json'), 'utf8'));
const W = 1600;
const H = 1000;

const marks = {};
for (const s of vox.shots) {
  const v = s.v;
  if (v.kind === 'desk' && v.src?.startsWith('docs/') && v.mark) {
    const name = path.basename(v.src, '.png');
    marks[name] ??= v.mark;
  }
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const wrap = (text, maxChars) => {
  const lines = [];
  for (const para of String(text).split('\n')) {
    let cur = '';
    for (const w of para.split(' ')) {
      if ((cur + ' ' + w).trim().length > maxChars) {
        lines.push(cur);
        cur = w;
      } else cur = (cur + ' ' + w).trim();
    }
    lines.push(cur);
  }
  return lines;
};

// Khai báo từng tấm. head: dòng đầu; sub: dòng phụ; key: khối chính (đặt trong vùng mark); foot: nguồn.
// cells: [{label, row: [...], hl?: [chỉ số]}]; bars: [{label, a, b, c?}] (thanh theo năm hoặc độ rộng).
const D = {
  sketch1992_diagram: {head: 'BẢN PHÂN TÍCH BỨC VẼ NĂM 1992', sub: 'Sơ đồ kỹ thuật, không tái hiện hình ảnh nạn nhân', sketch: true, foot: 'Theo Los Angeles Times (23/12/2025)'},
  z13_letter: {head: 'THƯ GỬI SAN FRANCISCO CHRONICLE · 20/04/1970', sub: 'Dòng mở đầu của bức thư', key: 'My name is —', cells: [{row: ['A', 'E', 'N', '⊕', '8', 'K', '8', 'M', '8', 'τ', 'N', 'A', 'M']}], foot: 'Theo hồ sơ FBI Vault · The Zodiac Killer'},
  fbi_dahlia_memo: {head: 'GHI NHỚ ĐIỀU TRA · LOS ANGELES · 1947', sub: 'Vụ sát hại Elizabeth Short ("The Black Dahlia")', key: 'Elizabeth Short, 22 tuổi, được phát hiện sáng 15/01/1947 tại lô đất trống gần đại lộ South Norton, Leimert Park, Los Angeles. Thi thể bị cắt ngang thắt lưng.', foot: 'Theo hồ sơ FBI Vault · Black Dahlia'},
  latimes_2025: {head: 'LOS ANGELES TIMES · 23/12/2025', sub: 'Christopher Goffard', key: '"An amateur codebreaker may have just solved the Black Dahlia and Zodiac killings"', foot: 'Tựa bài điều tra, latimes.com'},
  jemison_1950: {head: 'BÁO CÁO TRÌNH ĐẠI BỒI THẨM ĐOÀN · 05/1950', sub: 'Trung úy Frank Jemison, Văn phòng Công tố Quận Los Angeles', key: 'Marvin Margolis — the only pre-medical student who ever lived as a boy friend with Beth Short.', foot: 'Trích theo bài điều tra Los Angeles Times (23/12/2025)'},
  fbi_dahlia_id: {head: 'HỒ SƠ NHẬN DẠNG NẠN NHÂN', sub: 'Los Angeles, tháng 1/1947', key: 'Elizabeth Short · 22 tuổi · sinh ra ở Massachusetts · biệt danh báo chí: "Black Dahlia".', foot: 'Theo hồ sơ FBI Vault · Black Dahlia'},
  autopsy_summary: {head: 'TÓM TẮT KHÁM NGHIỆM PHÁP Y', sub: 'Los Angeles, 1947', key: 'Thi thể đã bị rút sạch máu và rửa sạch trước khi bị bỏ lại tại hiện trường.', foot: 'Theo hồ sơ điều tra LAPD / Đại bồi thẩm đoàn LA (1950)'},
  lumbar_diagram: {head: 'SƠ ĐỒ GIẢI PHẪU CỘT SỐNG THẮT LƯNG', sub: 'Minh họa kỹ thuật', key: 'Đường cắt đi qua khe đĩa đệm giữa đốt sống thắt lưng số 2 và số 3 (L2–L3), không chạm xương.', spine: true, foot: 'Theo hồ sơ điều tra LAPD · 1947'},
  dahlia_envelope1947: {head: 'BƯU KIỆN GỬI TÒA SOẠN · 24/01/1947', sub: 'Chữ cắt dán từ báo', key: '"Los Angeles Examiner and other Los Angeles papers\nHere is Dahlia\'s belongings\nletter to follow"', cutout: true, foot: 'Theo hồ sơ FBI Vault · Black Dahlia'},
  fbi_gasoline_lab: {head: 'BIÊN BẢN GIÁM ĐỊNH VẬT CHỨNG', sub: 'Bưu kiện ngày 24/01/1947', key: 'Vật dụng cá nhân và phong bì đã được lau bằng xăng (gasoline) để xóa dấu vân tay.', foot: 'Theo hồ sơ FBI Vault · Black Dahlia'},
  jemison_cover1950: {head: 'BÁO CÁO TỔNG HỢP · THÁNG 5/1950', sub: 'Gửi Đại bồi thẩm đoàn Quận Los Angeles', key: 'Tổng hợp 22 nghi phạm chính trong vụ án Elizabeth Short ("The Black Dahlia"). Lập bởi Trung úy Frank Jemison.', foot: 'Văn phòng Công tố Quận Los Angeles · 1950'},
  guardian_arms_record: {head: 'HỒ SƠ LƯU TRÚ · GUARDIAN ARMS', sub: '5217 Hollywood Boulevard, Los Angeles', key: 'Phòng 726 · tháng 10/1946 · Elizabeth Short sống cùng Marvin Margolis khoảng 12 ngày.', foot: 'Theo báo cáo công tố 1950 / Los Angeles Times'},
  navy_medical1945: {head: 'HỒ SƠ QUÂN Y HẢI QUÂN HOA KỲ', sub: 'Trích theo Los Angeles Times', key: "Pharmacist's Mate Marvin Margolis — 1st Marine Division — Okinawa campaign, April 1945.", foot: 'Theo hồ sơ Hải quân Mỹ dẫn trong LA Times (23/12/2025)'},
  navy_psych1945: {head: 'ĐÁNH GIÁ TÂM THẦN · 1945', sub: 'Giải ngũ với 50% thương tật tâm thần', key: '"...resentful individual who shows ample evidence of open aggression."', foot: 'Theo hồ sơ Hải quân Mỹ dẫn trong LA Times (23/12/2025)'},
  navy_quote1945: {head: 'GHI CHÉP CỦA BÁC SĨ TÂM THẦN QUÂN ĐỘI', sub: 'Lời Marvin Margolis', key: '"The next time there is a war, two of us are not going — the one who comes after me and myself."', foot: 'Theo hồ sơ Hải quân Mỹ dẫn trong LA Times (23/12/2025)'},
  zodiac_motel1947: {head: 'MẪU TIN BÁO LOS ANGELES · 1947', sub: 'Phỏng dựng từ phát hiện của Alex Baber', key: 'ZODIAC MOTEL\n2615 Santa Fe Ave., Compton\nPhòng có bồn tắm', ad: true, foot: 'Theo Los Angeles Times (23/12/2025); không phải bản scan gốc'},
  fbi_zodiac_summary: {head: 'TỔNG HỢP 4 VỤ TẤN CÔNG ĐƯỢC XÁC NHẬN', sub: 'Bắc California · 1968–1969', key: '20/12/1968 Benicia · 04/07/1969 Vallejo · 27/09/1969 hồ Berryessa · 11/10/1969 San Francisco\n5 người thiệt mạng · 2 người sống sót', foot: 'Theo hồ sơ FBI Vault · The Zodiac Killer'},
  z408_cipher: {head: 'MẬT MÃ Z408 · THÁNG 8/1969', sub: 'Giải mã bởi Donald và Bettye Harden', key: 'Bản giải mã không chứa tên thật của hung thủ.', foot: 'Theo hồ sơ FBI Vault · The Zodiac Killer'},
  z340_oranchak2020: {head: 'MẬT MÃ Z340 · GỬI 08/11/1969', sub: 'Giải mã tháng 12/2020', key: 'David Oranchak, Sam Blake, Jarl Van Eycke — được FBI xác nhận ngày 11/12/2020.', foot: 'arXiv:2403.17350; FBI San Francisco'},
  z13_closeup: {head: 'MẬT MÃ Z13 · 20/04/1970', sub: '13 ký tự, 8 ký hiệu phân biệt', key: '', cells: [{row: ['A', 'E', 'N', '⊕', '8', 'K', '8', 'M', '8', 'τ', 'N', 'A', 'M'], hl: [4, 6, 8]}], foot: 'Theo hồ sơ FBI Vault · The Zodiac Killer'},
  census_funnel: {head: 'PHỄU LỌC DỮ LIỆU HỘ TỊCH 1950', sub: 'Theo mô tả của Alex Baber trên LA Times', bars: [{label: '71.000.000 tên 13 chữ cái', w: 1}, {label: '185 tên', w: 0.55}, {label: '14 tên', w: 0.3}, {label: '1 tên', w: 0.12}], foot: 'Theo Los Angeles Times (23/12/2025)'},
  merrill_13letters: {head: 'CÁI TÊN 13 CHỮ CÁI', sub: 'Bí danh của Marvin Margolis (1925–1993)', key: '', cells: [{row: ['M', 'A', 'R', 'V', 'I', 'N', 'M', 'E', 'R', 'R', 'I', 'L', 'L']}], foot: 'Theo Los Angeles Times (23/12/2025)'},
  z13_elizabeth_key: {head: 'GIẢ THUYẾT KHÓA GIẢI MÃ', sub: 'Alex Baber', key: 'Bản mã Z13 + từ khóa "ELIZABETH" → "MARVIN MERRILL"\n(chưa được kiểm chứng độc lập)', foot: 'Theo Los Angeles Times (23/12/2025)'},
  nsa_review2025: {head: 'NHẬN ĐỊNH CỦA CỰU CHUYÊN GIA NSA', sub: 'Ed Giorgio · Patrick Henry · Rich Wisniewski', key: 'Phép tính của Baber "checked out" (khớp về mặt logic), theo lời họ nói với Los Angeles Times.', foot: 'Los Angeles Times (23/12/2025)'},
  lapd_detectives_quote: {head: 'HAI CỰU THÁM TỬ LAPD', sub: 'Xem xét hồ sơ của Alex Baber', key: 'Rick Jackson — cựu thám tử án mạng LAPD và San Mateo, 36 năm kinh nghiệm.\nMitzi Roberts — cựu thám tử Cold Case LAPD.', foot: 'Los Angeles Times (23/12/2025)'},
  california_timeline: {head: 'HÀNH TRÌNH CỦA MARVIN MERRILL', sub: 'Theo hồ sơ trong bài điều tra', bars: [{label: 'Chicago → Kansas (1961)', w: 0.3}, {label: 'Santa Clara — Intel (Bắc California)', w: 0.5}, {label: 'Oceanside — Bucksavers (đầu thập niên 1970)', w: 0.7}], foot: 'Theo Los Angeles Times (23/12/2025)'},
  probation_gap1971_1974: {head: 'ĐỐI CHIẾU THỜI GIAN', sub: '1969 – 1975', timeline: true, foot: 'Theo hồ sơ FBI Vault và Los Angeles Times (23/12/2025)'},
  bucksavers_court: {head: 'BẢN ÁN · OCEANSIDE, CALIFORNIA', sub: 'Bucksavers Automotive Repair & Parts Supply', key: '30 ngày tù giam + 3 năm quản chế (probation) vì lừa đảo khách hàng.', foot: 'Theo hồ sơ tòa án California dẫn trong LA Times'},
  okinawa_bayonet_spec: {head: 'DI VẬT SỐ 1', sub: 'Do con trai Roark Merrill lưu giữ', key: 'Dao lê quân đội Nhật Bản, mang về từ Okinawa (1945). Baber đối chiếu kích thước với vết thương tại hồ Berryessa (1969).', foot: 'Theo Los Angeles Times (23/12/2025)'},
  factcheck_1984_vs_1994: {head: 'KIỂM TOÁN LỜI ĐỒN', sub: 'Nhiều video lan truyền trên mạng', key: '"Ảnh nhà xác chỉ được công bố năm 1994, sau khi Merrill mất."', stamp: 'SAI SỰ THẬT LỊCH SỬ', foot: 'Đối chiếu bài LA Times (23/12/2025)'},
  hollywood_babylon1984: {head: 'KENNETH ANGER · HOLLYWOOD BABYLON II', sub: 'New York: E. P. Dutton, 1984', key: 'Ảnh khám nghiệm đã được in công khai từ năm 1984 — tám năm trước bức vẽ năm 1992.', foot: 'Theo Los Angeles Times (23/12/2025)'},
  z13_pattern_mismatch: {head: 'ĐỐI CHIẾU MẪU LẶP KÝ TỰ', sub: 'Vị trí 5, 7, 9', cells: [{label: 'Z13', row: ['A', 'E', 'N', '⊕', '8', 'K', '8', 'M', '8', 'τ', 'N', 'A', 'M'], hl: [4, 6, 8]}, {label: 'TÊN', row: ['M', 'A', 'R', 'V', 'I', 'N', 'M', 'E', 'R', 'R', 'I', 'L', 'L'], hl: [4, 6, 8]}], foot: 'Phân tích theo cấu trúc Z13; xem arXiv:2403.17350'},
  unicity_distance: {head: 'NGƯỠNG ĐỘ DÀI DUY NHẤT (UNICITY DISTANCE)', sub: 'Oranchak · Blake · Van Eycke', key: '13 ký tự là quá ngắn để một lời giải trở thành duy nhất: nhiều tên 13 chữ cái khác nhau có thể được tạo ra.', foot: 'arXiv:2403.17350; Los Angeles Times (23/12/2025)'},
  harnisch_rebuttal: {head: 'PHẢN BIỆN CỦA SỬ GIA LARRY HARNISCH', sub: 'Cựu biên tập viên Los Angeles Times', key: 'Báo cáo LAPD năm 1947 đã xác minh lịch làm việc của Margolis và Bill Robinson. Ông gọi giả thuyết là "fraud and fakery".', foot: 'Los Angeles Times (23/12/2025)'},
  forensic_status2025: {head: 'TRẠNG THÁI PHÁP Y', sub: 'LAPD và FBI', key: 'Chưa có đối chiếu ADN hay vân tay chính thức nào khớp với Marvin Margolis. Cả hai vụ án vẫn mở.', foot: 'Theo hồ sơ FBI Vault và Los Angeles Times'},
  roberts_quote2025: {head: 'MITZI ROBERTS · CỰU THÁM TỬ COLD CASE LAPD', sub: 'Trả lời Los Angeles Times', key: '"It\'s not a burning thing on their radar right now. I don\'t think the LAPD will ever take a position and say it\'s solved."', foot: 'Los Angeles Times (23/12/2025)'},
};

const FONT = "Courier New, Courier, monospace";
const SYM = "Segoe UI Symbol, Cambria Math, Arial Unicode MS, sans-serif";

const plate = (name, d) => {
  const m = marks[name] ?? [0.08, 0.36, 0.84, 0.30];
  const [mx, my, mw, mh] = [m[0] * W, m[1] * H, m[2] * W, m[3] * H];
  let g = '';
  g += `<rect width="${W}" height="${H}" fill="#f4eedd"/>`;
  g += `<rect x="30" y="30" width="${W - 60}" height="${H - 60}" fill="none" stroke="#bdb095" stroke-width="3"/>`;
  g += `<text x="${W / 2}" y="105" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="44" fill="#26221b">${esc(d.head)}</text>`;
  g += `<text x="${W / 2}" y="152" text-anchor="middle" font-family="${FONT}" font-size="30" fill="#6b6354">${esc(d.sub ?? '')}</text>`;
  g += `<line x1="90" y1="178" x2="${W - 90}" y2="178" stroke="#26221b" stroke-width="3"/>`;
  // dải chữ mờ (không đọc được) ngoài vùng mark để giống trang tài liệu
  for (let y = 205; y < H - 150; y += 36) {
    if (y + 20 > my - 10 && y < my + mh + 10) continue;
    const len = 0.5 + ((y * 7) % 40) / 100;
    g += `<rect x="90" y="${y}" width="${(W - 180) * len}" height="14" fill="#d6cdb6"/>`;
  }
  // khối chính
  if (d.cells) {
    d.cells.forEach((c, ri) => {
      const rows = d.cells.length;
      const cw = Math.min(104, (mw - 140) / 13);
      const x0 = mx + (mw - cw * 13) / 2 + 20;
      const y0 = my + (rows === 1 ? (mh - cw) / 2 : 14 + ri * (mh / rows));
      if (c.label) g += `<text x="${mx}" y="${y0 + cw * 0.68}" font-family="${FONT}" font-weight="700" font-size="30" fill="#6b6354">${esc(c.label)}</text>`;
      c.row.forEach((ch, i) => {
        const hl = c.hl?.includes(i);
        g += `<rect x="${x0 + i * cw}" y="${y0}" width="${cw - 6}" height="${cw - 6}" fill="${hl ? '#f3d9d3' : '#ebe3cd'}" stroke="${hl ? '#d7372b' : '#26221b'}" stroke-width="${hl ? 5 : 2.5}"/>`;
        g += `<text x="${x0 + i * cw + (cw - 6) / 2}" y="${y0 + cw * 0.66}" text-anchor="middle" font-family="${/[A-Z]/.test(ch) ? FONT : SYM}" font-weight="700" font-size="${cw * 0.5}" fill="#1b1b1b">${esc(ch)}</text>`;
        g += `<text x="${x0 + i * cw + (cw - 6) / 2}" y="${y0 + cw + 18}" text-anchor="middle" font-family="${FONT}" font-size="17" fill="#6b6354">${i + 1}</text>`;
      });
    });
    if (d.key) {
      const fs0 = 44;
      g += `<text x="${mx + 6}" y="${my + 50}" font-family="${FONT}" font-weight="700" font-size="${fs0}" fill="#26221b">${esc(d.key)}</text>`;
    }
  } else if (d.bars) {
    const n = d.bars.length;
    d.bars.forEach((b, i) => {
      const bh = Math.min(70, (mh - 20) / n - 14);
      const y = my + 10 + i * (bh + 16);
      g += `<rect x="${mx}" y="${y}" width="${mw * b.w}" height="${bh}" fill="#e3d6b0" stroke="#26221b" stroke-width="2.5"/>`;
      g += `<text x="${mx + 14}" y="${y + bh * 0.66}" font-family="${FONT}" font-weight="700" font-size="${Math.min(34, bh * 0.5)}" fill="#26221b">${esc(b.label)}</text>`;
    });
  } else if (d.timeline) {
    const x0 = mx + 20;
    const x1 = mx + mw - 20;
    const yr = (y) => x0 + ((y - 1969) / 6) * (x1 - x0);
    const yA = my + mh * 0.28;
    const yB = my + mh * 0.72;
    g += `<text x="${x0}" y="${yA - 26}" font-family="${FONT}" font-weight="700" font-size="28" fill="#26221b">Khoảng lặng thư Zodiac (03/1971 – 01/1974)</text>`;
    g += `<rect x="${yr(1971.2)}" y="${yA}" width="${yr(1974.05) - yr(1971.2)}" height="44" fill="#d7372b" opacity="0.85"/>`;
    g += `<text x="${x0}" y="${yB - 26}" font-family="${FONT}" font-weight="700" font-size="28" fill="#26221b">Án 30 ngày tù + 3 năm quản chế (theo LA Times)</text>`;
    g += `<rect x="${yr(1971.2)}" y="${yB}" width="${yr(1974.2) - yr(1971.2)}" height="44" fill="#2c4a6b" opacity="0.85"/>`;
    for (let y = 1969; y <= 1975; y++) {
      g += `<line x1="${yr(y)}" y1="${my + 6}" x2="${yr(y)}" y2="${my + mh + 40}" stroke="#bdb095" stroke-width="2"/><text x="${yr(y)}" y="${my + mh + 72}" text-anchor="middle" font-family="${FONT}" font-size="26" fill="#26221b">${y}</text>`;
    }
  } else if (d.sketch) {
    // Sơ đồ khối: khung bức vẽ + nhãn vị trí; KHÔNG vẽ hình nạn nhân.
    g += `<rect x="330" y="205" width="940" height="560" fill="#e9e1cb" stroke="#26221b" stroke-width="4"/>`;
    g += `<text x="800" y="270" text-anchor="middle" font-family="${FONT}" font-style="italic" font-weight="700" font-size="50" fill="#26221b">"Elizabeth"</text>`;
    g += `<rect x="460" y="320" width="680" height="250" fill="#4a463d" opacity="0.88"/>`;
    g += `<text x="800" y="460" text-anchor="middle" font-family="${FONT}" font-size="30" fill="#8a8478">vùng bóng chì (sơ đồ khối)</text>`;
    g += `<rect x="${mx}" y="${my}" width="${mw}" height="${mh}" fill="none"/>`;
    g += `<text x="800" y="680" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="40" fill="#26221b">Chữ "ZODIAC" ẩn dưới lớp bóng chì</text>`;
    g += `<text x="800" y="735" text-anchor="middle" font-family="${FONT}" font-size="34" fill="#26221b">Ký tên: "Marty Merrill '92"</text>`;
  } else {
    const fs0 = Math.max(34, Math.min(56, Math.sqrt((mw * mh) / (String(d.key).length * 0.62 * 1.5)) * 0.95));
    const lines = wrap(d.key, Math.floor(mw / (fs0 * 0.6)));
    const th = lines.length * fs0 * 1.3;
    const y0 = my + (mh - th) / 2 + fs0;
    if (d.cutout) {
      lines.forEach((l, i) => {
        l.split('').forEach((ch, j) => {
          g += `<rect x="${mx + 20 + j * fs0 * 0.64}" y="${y0 + i * fs0 * 1.3 - fs0 * 0.85}" width="${fs0 * 0.6}" height="${fs0 * 1.0}" fill="#fffdf3" stroke="#bdb095"/>`;
        });
      });
    }
    if (d.ad) g += `<rect x="${mx}" y="${my}" width="${mw}" height="${mh}" fill="#ebe3cd" stroke="#26221b" stroke-width="5" stroke-dasharray="14 8"/>`;
    lines.forEach((l, i) => {
      g += `<text x="${mx + (d.ad ? mw / 2 : 20)}" y="${y0 + i * fs0 * 1.3}" ${d.ad ? 'text-anchor="middle"' : ''} font-family="${FONT}" font-weight="700" font-size="${fs0}" fill="#1b1b1b">${esc(l)}</text>`;
    });
  }
  if (d.stamp) g += `<g transform="rotate(-8 1180 800)"><rect x="880" y="740" width="620" height="110" fill="none" stroke="#d7372b" stroke-width="8"/><text x="1190" y="812" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="46" fill="#d7372b">${esc(d.stamp)}</text></g>`;
  g += `<text x="${W / 2}" y="${H - 100}" text-anchor="middle" font-family="${FONT}" font-size="26" fill="#6b6354">${esc(d.foot ?? '')}</text>`;
  g += `<text x="${W / 2}" y="${H - 56}" text-anchor="middle" font-family="${FONT}" font-size="22" fill="#a1957b">ĐỒ HỌA PHỎNG DỰNG TỪ TRÍCH DẪN · KHÔNG PHẢI BẢN SCAN GỐC</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${g}</svg>`;
};

let n = 0;
for (const [name, d] of Object.entries(D)) {
  await sharp(Buffer.from(plate(name, d))).png().toFile(path.join(out, `doc_${name}.png`));
  n++;
}
// báo thiếu: mọi docs/ trong vox.json phải có file
const need = new Set(vox.shots.filter((s) => s.v.src?.startsWith('docs/')).map((s) => s.v.src));
for (const f of need) if (!fs.existsSync(path.join(dir, 'assets', f))) console.log('THIẾU', f);
console.log(`✓ ${n} tấm tài liệu → ${out}`);
