# Progress — 2026-truecrime-my-lai

## G-Labs (đếm lần gọi)
- 2026-10-17: 4 lần, `nano_banana_2_lite`, 16:9 → inbox/: ml_hamlet_dawn (KHÔNG ĐẠT), ml_helicopter_side (KHÔNG ĐẠT), ml_hamlet_dawn_v2 (ĐẠT), ml_helicopter_side_v2 (ĐẠT). Chi tiết `qa/style-guard-s001.md`.

- 2026-10-17: +2 lần (s002), `nano_banana_2_lite` → ml_paddy_villagers (ĐẠT), ml_night_camp (ĐẠT). Tổng: 6 lần.

- 2026-10-18: +1 lần (s003) → ml_helmet_dusk (ĐẠT). Tổng: 7 lần.

- 2026-10-18: +4 lần (pilot dựng cảnh) → ml_medina_brief (ĐẠT), ml_gi_group_seated (KHÔNG ĐẠT), ml_lz_dusk (ĐẠT), ml_gi_group_seated_v2 (ĐẠT). Tổng: 11 lần.

## Cổng duyệt
- s001: G1, G2, G3 duyệt 2026-10-17 → **pilot đã duyệt**.
- s001: dựng xong 2026-10-17 → `renders/s001/s001_v1.mp4` (53,7 s, -17,9 LUFS chưa chuẩn hóa). Tự chấm trên khung trích từ mp4: sửa 4 lỗi (chữ lịch đè phụ đề, băng nguồn bị che, trích dẫn thiếu bản dịch, chấm đỏ thừa). G3 đạt.
- Engine mới: `engine/src/vox/history.tsx` (scene, docscan, calendar), `tools/cutout.mjs`, `tools/music-synth.mjs`; sửa `VoxVideo.tsx` (dải âm lượng nhạc cho shot < 5 s).
- s002: G1, G2 duyệt 2026-10-17 (giữ câu Tiểu đoàn 48; "Quân Giải phóng miền Nam và Quân đội Nhân dân Việt Nam").
- s002: dựng xong 2026-10-17 → `renders/s002/s002_v1.mp4` (68,4 s). Tự chấm: sửa 2 lỗi (stats tràn khung → thêm `v.size`; bản đồ tô cả tỉnh khi nói về huyện → bỏ tô ở s002d/e, dời nhãn Tiểu đoàn 48 sát Sơn Mỹ). Engine: `geomap` thêm `bursts`, `panel`, `source`. G3 duyệt 2026-10-17 ("Good! pls continue").
- s003: G1, G2 duyệt 2026-10-18.
- s003: dựng xong 2026-10-18 → `renders/s003/s003_v1.mp4` (73,7 s). Engine mới: `unitchart` (có `reverse`), `people`, `versus`; `docscan` thêm `mark`, gạch chữ chỉ khi có `strikeAt`. Tự chấm: sửa 3 lỗi (thẻ Task Force Barker tràn khung + sơ đồ lệch lên trên; khung tô trang Peers thiếu dòng; thứ tự hiện sơ đồ ngược với lời dẫn). Chờ G3.
- 2026-10-18: người dùng đổi hướng sang dựng lại cảnh (rule `reenactment-first.md`). Pilot dựng cảnh: `renders/pilot2/pilot_stage_s003c.mp4` (kind `stage`). Chờ duyệt pilot trước khi làm lại s001–s003.
- 2026-10-18: **pilot dựng cảnh đã duyệt** ("Khá tốt rồi. Tôi đồng ý"). Model ảnh đổi sang `nano_banana_2`. Bắt đầu làm lại s001 theo hướng dựng cảnh: brief G2 ở `script/scenes/s001.md` mục 9, chờ duyệt.
- 2026-10-18: s001 làm lại (G2 "yes"): +10 lần G-Labs `nano_banana_2` (đoạn 12–21, đạt cả 10). **Tổng: 21 lần.** Code `stage` thêm smoke/embers/wash/shake/stamp/tag big, layer move/bob; `title` nhận `bg`. Clip `renders/s001v2/s001_v2.mp4`, QA `qa/style-guard-s001v2.md`. Chờ G3.
- 2026-10-18: người dùng duyệt s001 v2 ("Clip tương đối ổn rồi") và **ủy quyền chạy một mạch tới hết** (ghi `project.md`). Làm: lời dẫn s004–s010 (`script/scenes/s004-s010.md`, F57–F58 mới), TTS s004–s010, hình s002–s010 bằng kind `stage` (62 shot), cánh quạt quay bằng code (`rotors`, theo kỹ thuật `2026-test-huey`). G-Labs: +28 lần (27 + 1 tạo lại `ml_gi_firing`). **Tổng: 49 lần.** QA `qa/style-guard-s002-s010.md`.
- 2026-10-18 (cuối lượt chạy một mạch): 77 shot, 538 s. Nhạc 4 bài theo chương (tension/investigate/calm/grief, cues trong vox.json). Mô tả YouTube nháp `publish/description.md`. Bản xem trước 30% `renders/full/preview_lowres.mp4` đã chấm từng shot (còn: khói nhẹ che nhân vật ở vài shot s004, s010a–c dùng một nền 3 shot liên tiếp). Render cuối `renders/full/my-lai_full_v1.mp4` đang chạy (timeout 180 s, concurrency 3; lần đầu hết thời gian chờ ở khung 296). **Chưa làm:** chuẩn hóa độ to (~-14 LUFS); người dùng chưa xem bất kỳ cảnh s002–s010 nào (G3 chưa có); các câu F24 (số 28 sĩ quan) chưa dùng vì chưa đối chiếu bản scan.
- 2026-10-18: **render cuối xong** `renders/full/my-lai_full_v1_norm.mp4` (1920×1080, 538 s, h264/aac, 624 MB, chuẩn hóa -14,1 LUFS; bản chưa chuẩn hóa `my-lai_full_v1.mp4` -20,2 LUFS). Chưa nghe lại giọng đọc tên riêng; người dùng chưa xem s002–s010.

