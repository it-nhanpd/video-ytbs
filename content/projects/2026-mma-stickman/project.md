# mma-stickman — Trận MMA nhân vật hoạt hình 2D (hư cấu)

## Thông số
- **slug:** 2026-mma-stickman
- **Topic:** "Mũ gai vs Mũ thép": trận đấu tay không hư cấu, hài, giữa lính bộ binh Phổ 1871 (Gai) và Đức 1916 (Thép), 3 hiệp (người dùng giao quyền quyết định 2026-10-17)
- **Ngách:** giải trí hoạt hình + quân phục Đức (fiction)
- **Locale:** vi (`scenes.json` chỉ chứa key i18n, chữ nằm ở `locales/vi.json`)
- **Thời lượng:** 8–10 phút (chốt ở Bước 2)
- **Khung:** 1920×1080, 24fps
- **Khán giả:** người xem thích hoạt hình đánh nhau, MMA/UFC; không cần kiến thức nền
- **Giọng điệu:** hài, không lời (chữ ngắn + SFX); lồng tiếng để sau
- **Video tham chiếu:** chưa có (người dùng cung cấp 1–2 URL ở Bước 1)
- **Nguồn ưu tiên:** không cần kiểm chứng lịch sử (fiction); dùng luật MMA thống nhất (Unified Rules) để đòn/hiệp/điểm nghe thật

## Quyết định cần người dùng duyệt bằng văn bản (workflow-gates mục 5)
Ghi "ĐÃ DUYỆT + ngày" vào dòng tương ứng khi người dùng xác nhận.
1. Rig nhân vật hoạt hình 2D bằng code (SVG, pose keyframe) thay vì ảnh AI: **đã duyệt kế hoạch 2026-10-17 (qua ExitPlanMode)**; ngoại lệ chỉ cho dự án này, quy tắc "không SVG rig" giữ nguyên cho dự án nhân vật tranh vẽ.
2. Style bible riêng `content/library/styles/cartoon-mma.md`: **đã duyệt hướng cartoon dày nét, đầu to ngày 2026-10-17 (người dùng chọn khi được hỏi)**; chi tiết bible chờ duyệt cùng pilot.
3. Bước 2 thu gọn thành "bible trận đấu" thay cho kiểm chứng nguồn: **đã duyệt kế hoạch 2026-10-17**; **đổi nhân vật sang lính Đức hai thời kỳ: người dùng chọn 2026-10-17** (hướng 1), quy tắc nội dung nhạy cảm nằm trong bible.

## Trạng thái các bước
| Bước | Nội dung | Trạng thái |
|---|---|---|
| 0 | Khởi tạo dự án | xong |
| 1 | Style bible nhân vật hoạt hình 2D | bỏ phân tích tham chiếu theo yêu cầu người dùng; bible `content/library/styles/cartoon-mma.md` đã soạn, **chờ duyệt** |
| 2 | Bible trận đấu + kịch bản | **v3 (Phổ 1871 vs Đức 1916, hài, không lời)**: `research/02-fight-bible.md` (có kế hoạch giữ chân), `script/beats.md`, **chờ duyệt** |
| 3 | Shotlist + move library | nháp: `script/shotlist.md` (10 cảnh), `script/move-library.md`, **chờ duyệt** |
| 4 | Pilot (cảnh s001, 14 giây) | **đổi style sang cartoon 2D (2026-10-17, người dùng chọn)**; đã render lại `renders/pilot.mp4` + still `renders/pilot-f*.png`, **chờ bạn xem và ghi "pilot đã duyệt"**; chưa duyệt thì cấm làm loạt |
| 5–9 | Dựng, âm thanh, render/QA, đóng gói, promote | chưa |
