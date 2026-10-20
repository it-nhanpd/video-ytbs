# ww2-dday — D-Day 1944: 24 Giờ Sinh Tử Trên Bãi Biển Omaha

## Thông số
- **slug:** 2026-ww2-dday
- **Style-family:** history (skill `video-style-history`, bản đồ sa bàn + hoạt hình cel 2.5D multiplane + nhân vật cố định)
- **Topic:** Diễn biến 24 giờ đầu tiên của cuộc đổ bộ bờ biển Omaha (Chiến dịch Neptune / Overlord, ngày 6/6/1944)
- **Ngách:** Lịch sử quân sự thế chiến 2, giải thích chiến thuật & tái hiện trận đánh (chuẩn The Armchair Historian)
- **Locale:** vi (key i18n trong `locales/vi.json`, `scenes.json` không chứa text cứng)
- **Thời lượng mục tiêu:** ~14 phút (khoảng 10–12 cảnh s001–s012)
- **Pilot:** Cảnh `s001` (Hook 60s: Xuồng LCVP vượt sóng tiến sát bờ biển Omaha, chuẩn bị hạ bửng đổ bộ dưới hỏa lực pháo kích)
- **Style bible:** `content/library/styles/uniform-showcase.md` + `comic-cel-painterly.md` + `layer-recipe.md` (nền phẳng có viền, nhiều lớp, cỏ/nước che chân, nhân vật có nét mực viền đen)
- **Khung:** 1920×1080, 24fps
- **Video tham chiếu chính (The Armchair Historian):**
  - Trực tiếp: `https://www.youtube.com/watch?v=tlq3bZ7DdXg` (*D-Day from the American Perspective | Bird's Eye View*)
  - Bản đầy đủ: `https://www.youtube.com/watch?v=3ky-USkybqY` (*D-Day From the Bird's Eye Perspective - Full Documentary*)
  - Góc nhìn đối đầu: `https://www.youtube.com/watch?v=EUTo1urxwPo` (*D-Day From the German Perspective*)
  - *Mục đích:* Học ngữ pháp hình ảnh (sa bàn bản đồ, góc nhìn chim bay, nhịp chuyển giữa sa bàn và hoạt cảnh cận chiến), không sao chép hình, lời, nhạc.
- **Nguồn căn cứ ưu tiên:**
  - NARA (Hồ sơ lưu trữ Cục Lưu trữ Quốc gia Hoa Kỳ, RG 407, hồ sơ Sư đoàn Bộ binh số 1 & 29).
  - Beevor, Antony. (2009). *D-Day: The Battle for Normandy*. Penguin Books.
  - Ambrose, Stephen E. (1994). *D-Day: June 6, 1944: The Climactic Battle of World War II*. Simon & Schuster.
  - Balkoski, Joseph. (2004). *Omaha Beach: D-Day, June 6, 1944*. Stackpole Books.
  - Harrison, Gordon A. (1951). *Cross-Channel Attack* (United States Army in World War II: The European Theater of Operations). Office of the Chief of Military History.

- **Quy trình sản xuất:** Người dùng duyệt phương án **Script-First** (2026-10-20): Hoàn thành toàn bộ kịch bản 12 cảnh (`script/vi.md`) và bảng sự kiện `research/03-facts.md` trước, sau đó lập Master Asset Blueprint, tạo ảnh/video hàng loạt và render toàn bộ.

## Trạng thái các bước
| Bước | Nội dung | Trạng thái |
|---|---|---|
| 0 | Khởi tạo dự án & Kế hoạch 12 tập | xong (`topic-plan-ww2.md` đã chuyển vào repo) |
| 1 | Xác lập nguồn & Sự kiện căn cứ s001–s012 | xong (`research/03-facts.md` mã F01–F37) |
| 2 | Pilot s001 (G1, G2, Tạo ảnh, Ingest, Multiplane, Render Still/Clip) | **pilot đã duyệt** (2026-10-20, người dùng duyệt style ĐẠT) |
| 3 | Kịch bản Master toàn bộ 12 cảnh s001–s012 (Script-First) | **xong** (`script/vi.md`, `script/scenes/s001.md`–`s012.md`) |
| 4 | Master Asset Blueprint & Prompt Pack toàn dự án (Cổng G2) | **xong** (24 asset mới, `prompts/blueprint.md`, `prompt-pack-all.md`, `g-labs/*.txt`) |
| 5 | Tạo ảnh & Ingest hàng loạt | **chuẩn bị tạo ảnh** (chờ xác nhận lệnh gọi G-Labs/agy) |
| 6 | Dựng multiplane `scenes.json` & Audio TTS toàn bộ | chờ bước 5 |
| 7 | Render hoàn chỉnh video full (~11.5 phút) | chưa |
