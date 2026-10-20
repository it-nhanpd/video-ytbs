# Tiến độ Dự án: 2026-truecrime-zodiac-dahlia

- **Ngày khởi tạo & nghiệm thu**: 2026-10-18 — 2026-10-19
- **Mã dự án**: `2026-truecrime-zodiac-dahlia`
- **Chủ đề**: Giải mã giả thuyết hung thủ Thược Dược Đen (1947) và Zodiac Killer (1968–1974) là một người — Hồ sơ Marvin Margolis / Merrill (Alex Baber / Cold Case Consultants of America).
- **Template**: `vox` (True Crime Detective Case-File Collage 2.5D, tỉ lệ 16:9 1920×1080).
- **Tình trạng tổng thể**: **HOÀN THÀNH 100% TOÀN BỘ CÁC BƯỚC CHUẨN BỊ VÀ KIỂM TOÁN HÌNH ẢNH THỰC TẾ (STILL AUDIT ĐÃ KIỂM TRA 10/10 FRAME)**.

---

## 1. Kết quả Kiểm toán Video Tham chiếu & Cơ sở Học thuật
- Video gốc: *"Mới - Tìm Ra Hung Thủ Của Zodiac Và Thược Được Đen Là Cùng 1 Người - Tra Án"* (30:41).
- **5 sai lệch nghiêm trọng đã được đính chính bằng tư liệu sơ cấp**:
  1. **Năm công bố ảnh khám nghiệm Thược Dược Đen**: Đính chính sai lầm "chỉ công bố năm 1994 sau khi Merrill chết"; Kenneth Anger đã xuất bản trọn vẹn trong *Hollywood Babylon II* từ năm 1984 (8 năm trước khi Merrill vẽ phác họa năm 1992).
  2. **Giải mã mật mã Z13**: Chuỗi `A E N ⊕ 8 K 8 M 8 τ N A M` (3 ký tự `8` giống hệt tại vị trí 5, 7, 9) hoàn toàn không khớp với `M A R V I N M E R R I L L` (tại 5, 7, 9 là 3 chữ cái khác nhau `I`, `M`, `R`). Dưới ngưỡng unicity distance, Z13 có thể giải ra hàng nghìn cái tên hợp lệ (David Oranchak, arXiv:2403.17350, 2024).
  3. **Danh tính điều tra viên**: Đính chính "Jack Jackson" thành **Rick Jackson** (36 năm trọng án LAPD) và **Mitzi Roberts** (nữ điều tra viên phụ trách hồ sơ Thược Dược Đen của LAPD).
  4. **Ngoại phạm năm 1947**: Nhà nghiên cứu Larry Harnisch xác nhận: Marvin Margolis và Bill Robinson đã được LAPD kiểm tra lịch làm việc tại cơ sở in ấn và loại trừ nghi phạm ngay từ năm 1947.
  5. **Tình trạng pháp lý vụ án**: Cả LAPD, SFPD và FBI đều chưa từng chính thức công nhận Marvin Margolis là hung thủ; cả hai vụ án vẫn là cold cases mở.

---

## 2. Hệ thống Tài liệu & Nghiên cứu
- `research/00-ref-meta.json` & `research/00-ref-transcript.txt`: Metadata và transcript gốc.
- `research/01-reference-analysis.md`: Phân tích kết cấu, nhịp dựng, và 5 lỗi sai.
- `research/02-sources.md`: Danh mục 10 nguồn sơ cấp S01–S10 (FBI Vault, LA County DA 1950, Oranchak 2024, LA Times 2025, Kenneth Anger 1984...).
- `research/03-facts.md`: 35 sự kiện hạt nhân [F01]–[F35] được thẩm định chéo.
- `research/04-open-questions.md`: Các câu hỏi pháp y còn mở và ranh giới đạo đức.
- `publish/description.md`: Mô tả YouTube chuẩn SEO kèm mốc thời gian và danh mục tài liệu.

---

## 3. Kịch bản & Dàn dựng Cảnh
- `script/scenes/s001.md` đến `s008.md`: 8 thẻ cảnh theo chuẩn `script-craft` (Hook, Open Loops, Phân rã nhịp, [Fxx], TTS, Bản tự phản biện 9 tiêu chí a-i).
- `script/vi.md`: Kịch bản chi tiết 80 shot:
  - 47 shot tài liệu gốc (58.8%)
  - 22 shot tái hiện (27.5%)
  - 4 shot bản đồ định vị (5.0%)
  - 7 shot tiêu đề chương/tưởng niệm (8.8%)
  - Chữ/số thuần: 0% (tuân thủ tuyệt đối quy định ≤ 10%).
- `locales/vi.json`: Toàn bộ 80 chuỗi lời bình `n.*` và nhãn tài liệu tiếng Việt.

---

## 4. Tài sản Đồ họa, Bản đồ, Âm thanh
- **Bản phỏng dựng hồ sơ pháp y**: 36 plates `assets/docs/doc_*.png` tạo bằng Sharp SVG rendering, phủ highlight màu cam/vàng khớp tọa độ `marks` trong `vox.json`. Tuyệt đối cấm ảnh tử thi ghê rợn.
- **Minh họa AI & Collage**: 18 files `assets/ai/` tuân thủ nghiêm ngặt `truecrime-collage.md` (chỉ bóng silhouette, không khuôn mặt người thật, không trẻ em).
- **Bản đồ địa lý tương tác**: `assets/camap.json` kết nối 11 tọa độ tại California (Natural Earth 1:10m).
- **Âm thanh**: Bộ 10 hiệu ứng `assets/sfx/`, 3 track nhạc nền `mus_tension`, `mus_invest`, `mus_grief`, và 84 file audio giọng đọc Edge-TTS `vi-VN-NamMinhNeural` (`assets/audio/timing.json`, 18.63 phút).

---

## 5. Kết quả Kiểm toán Thực tế (Still Audit 10/10 frames)
1. `still-P01.png` (Frame 60): Reenactment phòng tối noir 1992, bóng người vẽ tranh chì màu (ĐẠT).
2. `still-P05.png` (Frame 45): Bản đồ California đường bờ biển vintage (ĐẠT).
3. `still-P08.png` (Frame 60): Bảng ghim điều tra 2 đại án (ĐẠT).
4. `still-C106.png` (Frame 50): Bàn hồ sơ giải phẫu cắt rời thắt lưng L2–L3 (ĐẠT).
5. `still-C204.png` (Frame 50): Báo cáo Đại bồi thẩm đoàn LA 1950 Frank Jemison (ĐẠT).
6. `still-C310.png` (Frame 60): Bàn phân tích mật mã Z13 13 ký tự (ĐẠT).
7. `still-C404.png` (Frame 50): Bảng 13 chữ cái "MARVIN MERRILL" (ĐẠT).
8. `still-C505.png` (Frame 50): Biểu đồ thời gian quản chế & khoảng lặng Zodiac (ĐẠT).
9. `still-C604.png` (Frame 60): Hồ sơ sách Hollywood Babylon II 1984 Kenneth Anger (ĐẠT).
10. `still-J703.png` (Frame 60): Bảng tổng kết đối chiếu 2 đại án (ĐẠT).
