# Nguồn hình ảnh và Kiểm toán bản quyền (Audit 2026-10-18)

Dự án: `2026-truecrime-zodiac-dahlia`
Chủ đề: Thuyết liên kết Thược Dược Đen (1947) & Zodiac Killer (1968–1974) — Hồ sơ Marvin Margolis / Merrill

---

## 1. Bản phỏng dựng hồ sơ pháp y (`assets/docs/`)
Gồm 36 bản phỏng dựng đồ họa độ phân giải cao (1600×1000) được sinh bằng mã nguồn `prompts/make-docs.mjs` (sử dụng Sharp + SVG vector rendering).
- **Cơ sở tư liệu gốc**:
  - Hồ sơ FBI Vault Black Dahlia (HQ 65-58537, Los Angeles Field Office).
  - Báo cáo đệ trình Đại bồi thẩm đoàn Quận Los Angeles (1950) của Trung úy Thám tử Frank Jemison và Trợ lý Chưởng lý Al Matthews.
  - Hồ sơ giải mã Z340 của David Oranchak, Sam Blake, Jarl Van Eycke (arXiv:2403.17350, 2024).
  - Loạt bài điều tra của ký giả Christopher Goffard trên *Los Angeles Times* (23/12/2025).
  - Kenneth Anger, *Hollywood Babylon II* (Dutton, 1984).
- **Ranh giới đạo đức & bản quyền**:
  - Toàn bộ hồ sơ đều gắn tiêu đề chính thống kèm dòng ghi chú pháp lý dưới chân trang: `"BẢN PHỎNG DỰNG TÀI LIỆU LƯU TRỮ — MINH HỌA HỒ SƠ VỤ ÁN"`.
  - **Tuyệt đối KHÔNG sử dụng ảnh chụp thi thể hoặc hiện trường ghê rợn** của Elizabeth Short hay bất kỳ nạn nhân nào. Các bản vẽ giải phẫu (`doc_autopsy_diagram.png`) chỉ sử dụng sơ đồ y khoa đường nét trung tính (anatomical contour) để minh họa vết cắt phẫu thuật hemicorporectomy.
  - Các vùng tài liệu trọng tâm được phủ lớp highlight màu hổ phách / vàng pháp y tương ứng với tọa độ `marks` trong `vox.json`.

---

## 2. Minh họa nghệ thuật AI (`assets/ai/`)
Toàn bộ ảnh AI minh họa bối cảnh được sinh qua API G-Labs Studio (`nano_banana_2_lite`) hoặc kế thừa từ thư viện collage của hệ thống.
- **Style bible**: Tuân thủ tuyệt đối `content/library/styles/truecrime-collage.md` (giấy xé, mực in thô, tông màu phim noir hoài cổ 1947 / 1969, hạt grain analog).
- **Danh sách ảnh AI mới sinh qua G-Labs (`tools/glabs.mjs`)**:
  1. `ai_sketch1992.jpg`: Minh họa bàn làm việc của họa sĩ phác họa năm 1992 (bản vẽ bút chì bán thân nhìn nghiêng, thước đo tỉ lệ, bút chì than).
  2. `ai_desk_files.jpg`: Bàn điều tra án mạng phủ đầy kẹp hồ sơ mật, nhãn lưu trữ Manila 1947.
  3. `ai_leimert_fog.jpg`: Bãi đất trống đại lộ Norton (Leimert Park) trong sương mù mờ ảo tháng 1/1947 (không có thi thể, chỉ có cọc ranh giới và xe cảnh sát xa xa).
  4. `ai_usc_medical.jpg`: Giảng đường giải phẫu y khoa USC thập niên 1940 (bàn đá cẩm thạch, dụng cụ phẫu tích bằng thép, ánh đèn vòm).
  5. `ai_okinawa1945.jpg`: Bờ biển Okinawa tháng 4/1945 mịt mù khói đạn, tàu đổ bộ và quân y Hải quân Mỹ.
  6. `ai_foxhole_med1945.jpg`: Hầm quân y dã chiến Thế chiến II (băng gạc, túi đồ nghề phẫu thuật dã chiến, đèn bão).
  7. `ai_vallejo_night1968.jpg`: Đường vắng ngoại ô Vallejo đêm tối 1968, đèn pha ô tô rọi vào màn đêm mờ ảo.
- **Chấm kiểm định Style-Guard**:
  - 100% đạt chuẩn: Không có khuôn mặt người rõ nét (chỉ dùng bóng silhouette hoặc góc nhìn sau lưng), không có trẻ em, không có biểu tượng thù địch (§86a StGB), không có logo thương mại.
  - Mọi khung hình hiển thị đều có nhãn phụ `"Minh họa (AI)"`.

---

## 3. Bản đồ địa lý (`assets/camap.json`)
- Trích xuất từ tập dữ liệu Natural Earth 1:10m (Public Domain) thông qua `tools/geo-map-extract.mjs`.
- Bao gồm đường bờ biển California, ranh giới hạt và 11 tọa độ then chốt được chuẩn hóa trong `prompts/camap-points.json`:
  - `sf`, `vallejo`, `santaclara`, `atascadero`, `la`, `hollywood`, `leimert`, `compton`, `oceanside`, `berryessa`, `ca`.

---

## 4. Âm thanh và Lời bình
- **Giọng đọc thuyết minh**: Microsoft Edge TTS `vi-VN-NamMinhNeural` (giọng nam miền Nam trầm ấm, phong cách phóng sự điều tra, tốc độ chuẩn).
- **Âm nhạc bối cảnh (`assets/audio/`)**:
  - `mus_tension.mp3`: Tiết tấu dồn dập, căng thẳng cho phần mở đầu và các vụ án mạng.
  - `mus_invest.mp3`: Giai điệu trầm tĩnh, phân tích mật mã và tài liệu lưu trữ.
  - `mus_grief.mp3`: Tưởng niệm các nạn nhân và kết luận mở về công lý.
- **Hiệu ứng âm thanh (`assets/sfx/`)**:
  - Đầy đủ 10 hiệu ứng case-file: `paper`, `click`, `type`, `pin`, `thud`, `whoosh`, `ring`, `heart`, `riser`, `stinger`.
