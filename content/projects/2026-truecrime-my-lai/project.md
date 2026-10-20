# truecrime-my-lai — Thảm sát Mỹ Lai (16/3/1968)

## Thông số
- **slug:** 2026-truecrime-my-lai
- **Topic:** vụ thảm sát Mỹ Lai (Sơn Mỹ, Quảng Ngãi), che giấu, điều tra (Peers), xét xử (Calley) và hậu quả.
- **Dạng:** video mới của kênh, học ngữ pháp hình từ video tham chiếu "Mỹ Lai Massacre" (The Armchair Historian, YouTube `o9sr8sviSIs`). Không chép hình, lời, nhạc, nhân vật.
- **Style-family:** `history` (người dùng chọn 2026-10-19). Nạp skill `video-style-history` + `content/library/styles/pacing-and-footage.md`. Không dùng ngôn ngữ collage giấy-xé/hồ sơ của `truecrime-collage` làm xương sống; template `vox` chỉ là bộ dựng, không phải họ style. (Tên thư mục `truecrime` là tên cũ, giữ nguyên.)
- **Style:** `content/library/styles/history-cel-docu.md` (bản đồ giấy + hoạt hình cel) + block `comic-cel-painterly.md` cho ảnh AI.
- **Locale:** vi. **Khung:** 1920×1080 16:9, 30fps. **Template:** `vox` (thêm kind bản đồ Việt Nam, sơ đồ đơn vị…).
- **Giọng:** edge-tts `vi-VN-NamMinhNeural` qua `tools/vox-tts.mjs`.

## Quyết định
- **2026-10-17, người dùng:** chọn "ghi style + làm video mới", chủ đề Mỹ Lai dự án mới, tải tham chiếu bằng yt-dlp. Style doc `history-cel-docu.md` được duyệt ("good! pls continue").
- Khung 16:9 (mặc định, người dùng chưa chọn 2.35:1). Làm **từng cảnh có cổng duyệt** (`workflow-gates.md` mục 7); chưa có ủy quyền tự chạy như dự án Unabomber.
- ~~**Nội dung nhạy cảm:** không hình máu/xác người, không ảnh AI mô tả người thật, không tái dựng cảnh bắn giết~~ → **thay bằng quyết định 2026-10-18 dưới đây.** Ảnh màu của Haeberle chỉ dùng nếu giấy phép rõ ràng.
- **2026-10-19, người dùng:** (1) dự án thuộc họ **lịch sử**; (2) muốn lời đọc nhanh, dồn dập, cuốn theo truyện (tốc độ cụ thể **chưa chốt**, hiện `rate -2%`); (3) ưu tiên footage chuyển động, nhưng clip G-Labs **chỉ hỗ trợ cảnh khó**, còn lại bằng code (lật ảnh, key pose, rig, parallax). Điều này sửa quyết định "không image-to-video" bên dưới: clip được phép cho cảnh khó theo `glabs-delegation.md`. **Trần số clip: chưa chốt** (người dùng chưa quyết) → chưa tạo clip nào.
- **2026-10-18, người dùng (văn bản trong chat):** "video của tôi ưu tiên dựng lại cảnh để thu hút người xem. I don't like video chỉ đưa ra số liệu, tối đa cảnh". Chọn: (1) làm lại s001–s003 + mọi cảnh sau theo hướng dựng lại cảnh, số liệu chỉ là chữ phụ đè lên cảnh; (2) người thật (Medina, Calley, Thompson, Ridenhour…) = **nhân vật cel cách điệu**, không cố giống ảnh thật, mỗi người một thẻ nhân vật cố định, nhãn "Minh họa"; (3) bạo lực **"như video tham chiếu"** (cel cách điệu: lính nổ súng, máu, vũng máu/vỏ đạn); (4) chuyển động = ảnh nhiều lớp + camera (không image-to-video).
  - Giới hạn Claude giữ (đã báo người dùng): **không vẽ trẻ em bị giết/thi thể trẻ em, không vẽ bạo lực tình dục** — lời dẫn vẫn nói sự thật có nguồn, hình chuyển sang ẩn ý; nếu G-Labs từ chối prompt thì báo, không lách. Rủi ro: YouTube giới hạn độ tuổi/quảng cáo.
  - Pilot lại style dựng cảnh (`workflow-gates.md` mục 2) trước khi làm loạt: 1 nhân vật + 1 nền + 1 shot dựng lại.
  - **Pilot dựng cảnh đã duyệt** 2026-10-18 (người dùng: "Khá tốt rồi. Tôi đồng ý => you can continue"): `renders/pilot2/pilot_stage_s003c.mp4` (kind `stage`).
- **2026-10-18, người dùng:** "ảnh dùng banana 2.1 instead of lite" → ảnh G-Labs của dự án này dùng `nano_banana_2` (model đầy đủ, không phải Pro), thay `nano_banana_2_lite`.
- **2026-10-18, người dùng:** s001 v2 "Clip tương đối ổn rồi" (G3 đạt). **Ủy quyền chạy một mạch tới hết video** ("Tôi muốn bạn làm một mạch đến hết vì giờ tôi có việc bận… mong muốn là mọi thứ đều xong và chỉ đợi render video"): bỏ cổng G1/G2/G3 từng cảnh và bỏ hỏi xác nhận từng đợt G-Labs cho dự án này, trong lượt làm việc này. Vẫn giữ: nguồn theo `source-policy.md`, `nano_banana_2` (không Pro), style-guard từng ảnh, giới hạn nội dung ở trên, báo cáo trung thực khi người dùng quay lại. Gợi ý của người dùng: tham khảo kỹ thuật chuyển động 2D của `2026-test-huey` (cánh quạt quay bằng code, lật ảnh).
- **Nguồn:** theo `source-policy.md`. Gợi ý từ mô tả video tham chiếu: Allison 2012 (JHU Press), Bilton & Sim 1992, Jones 2017 (OUP); cộng Báo cáo Peers (LoC) và văn bản tòa án vụ Calley.

## Trạng thái
| Bước | Nội dung | Trạng thái |
|---|---|---|
| 1 | Style capture | xong: `history-cel-docu.md`, khung trích `refs/ref-video/my-lai/` |
| 2 | Nguồn + bảng sự kiện | xong vòng 1: `research/02-sources.md` (4 nguồn A đã đọc + Claude tự kiểm trích đoạn), `03-facts.md` (F01–F30), `04-open-questions.md`; 3 sách học thuật chưa đọc được |
| 3 | Dàn ý + thẻ cảnh (G1) | dàn ý `script/outline.md`; s001 duyệt G1+G2 |
| 4 | Engine: kind bản đồ VN, sơ đồ đơn vị | `geomap` xong (tools/geo-map-extract.mjs, engine/src/vox/GeoMap.tsx, shot thử `m00` → `renders/m00_geomap_test.mp4`); sơ đồ đơn vị, quân cờ, ô phóng to: chưa |
| 6 | s001 v2 + s002–s010 (chạy một mạch) | dựng xong, chờ người dùng xem; render cuối `renders/full/my-lai_full_v1.mp4` |
| 5 | Pilot 1 cảnh (G3) | **pilot đã duyệt** 2026-10-17 (người dùng: "Good! You can continue"): `renders/s001/s001_v1.mp4` |
