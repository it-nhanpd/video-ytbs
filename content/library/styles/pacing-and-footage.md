# Nhịp kể, tốc độ đọc và footage (dùng chung mọi họ style)

Tạo 2026-10-19 theo yêu cầu của người dùng (nhịp dồn dập, ưu tiên chuyển động thật, không phụ thuộc credit). Chỉ chứa phần **không phụ thuộc họ style**; phần riêng nằm ở `video-style-investigation` và `video-style-history`. Con số trong file là **điểm xuất phát để thử**, chốt sau khi người dùng nghe/xem pilot rồi ghi lại vào mục "Đã chốt" cuối file.

## 1. Tốc độ đọc và nhịp lời dẫn
Hiện trạng: `vox.json` đặt `rate: -2%` (edge-tts NamMinh), đo ~2,9 âm tiết/giây gồm nghỉ. Người dùng thấy chậm, thiếu cuốn theo truyện.
- **Thử** `rate` `+10%`, `+15%`, `+20%` trên cùng một đoạn kịch tính (vd. cảnh Thompson của Mỹ Lai), người dùng nghe chọn. Lệnh: `node tools/vox-tts.mjs <p> --rate +15% --only <shotId> --force`. Không tự chốt số.
- **Độ dài câu:** đa số ≤ 15–18 âm tiết; cứ 3–4 câu dài thì có 1 câu 3–5 từ ("Không ai bắn trả."). Cấm câu liệt kê ≥ 3 tên đơn vị/số trong một hơi: tách ra hoặc đẩy xuống chữ phụ.
- **Khoảng nghỉ:** nghỉ ngắn ~0,15–0,25 s giữa câu; chỉ nghỉ dài (~0,6–1 s) tại điểm sốc/cao trào.
- **Đổi hình:** mỗi 4–7 s ở đoạn cao trào, 8–12 s ở đoạn thường (khớp `script-craft` mục 3). Không có nhịp nào > 12 s không đổi gì.
- **Open loop trước mỗi chương** (một câu treo cụ thể) và **một đỉnh cảm xúc** (nhân vật cụ thể làm gì) trước đoạn pháp lý/số liệu.
- Nhịp nhanh không có nghĩa bỏ nguồn: khẳng định vẫn có `Fxx` và đúng giới hạn câu chữ (`source-policy.md`).
- Đổi `rate` thì thời lượng mọi shot đổi theo `timing.json`; chạy lại `vox-tts` rồi render lại, không kéo giãn hình.

## 2. Phân loại cảnh theo độ khó → công cụ
Ngân sách: **clip AI chỉ hỗ trợ cảnh khó**; phần lớn do code (người dùng quyết 2026-10-19).

| Loại | Làm bằng | Tốn credit |
|---|---|---|
| Bản đồ, tài liệu, chữ, sơ đồ | code (`geomap`, `doc`, `stats`…) | không |
| Cảnh tĩnh có sâu | ảnh nhiều lớp + camera + parallax + hạt/khói/sương | ảnh (rẻ) |
| Nhân vật đi/làm cử chỉ đơn giản | rig, key pose, lật ảnh, `runner`, cánh quạt quay bằng code | ảnh |
| **Cảnh khó**: chuyển động phức tạp khó rig (trực thăng hạ cánh, đám đông, nước, lửa lớn), cần chiều sâu thật | **clip G-Labs 4–8 s** | **có** |

Quy tắc: thử cách code trước; chỉ khi code không đạt mới nâng lên clip. Mỗi dự án ghi **trần số clip** trong `project.md` (người dùng duyệt).

## 3. Quy trình clip G-Labs cho cảnh khó
Công cụ: `tools/glabs-video.mjs` (luật: `.claude/rules/glabs-delegation.md`).
1. Cảnh khó có thẻ cảnh được duyệt (G1) và ảnh khung đầu đã qua `style-guard`.
2. Chế độ mặc định rẻ: `omni_flash` + `mode start_image` + `resolution 360p` (nháp) → thấy ổn mới nâng `720p`. Không dùng `4K`/`lite_relaxed` (cần ULTRA).
3. Prompt clip mô tả **chuyển động**, 1 hành động, 4–6 s, kèm câu "static camera"/"slow push-in" tùy ý; dán lại block style của họ; không từ nhạy cảm (`style-lock.md`).
4. **Pilot 1 clip** → người dùng xem → mới làm tiếp. Mỗi lần gọi ghi 1 dòng vào `.claude/progress/<dự án>.md` (số clip, model, độ phân giải).
5. Clip duyệt đưa vào `content/library/footage/<id>.mp4` + thẻ `<id>.md` (nguồn prompt, sự kiện minh họa, nhãn "Minh họa", cảnh đã dùng) để **tái dùng**: loop, cắt, đảo chiều, đổi màu/grade, đổi nền. Tạo lại chỉ khi không tái dùng được. Cập nhật `content/library/INDEX.md`.
6. Dựng vào cảnh: clip làm một lớp (nền hoặc giữa), số liệu/chữ/nhãn đè bằng code; clip luôn có nhãn "Minh họa" nếu là dựng lại.

## 4. Visual brief cho agent (mỗi shot)
`Narration → Visual intent → Loại asset → Nguồn/Verification → Render`
- **Loại asset:** tài liệu gốc | bản đồ/sơ đồ code | ảnh tư liệu thật | dựng cảnh (ảnh lớp/rig) | clip AI (cảnh khó).
- Tách: **tư liệu đúng sự kiện** / **tư liệu bối cảnh** / **minh họa tái dựng** (có nhãn). Không dùng footage ngẫu nhiên làm như hình trực tiếp của sự kiện.
- Mỗi asset ghi tiêu chí chấp nhận (đúng địa điểm/thời gian/nhân vật, không chữ lạ, đúng style họ).

## Đã chốt (cập nhật sau pilot)
- `rate` (edge-tts): **`+22%`** (≈ ×1,25 so với `-2%`, từ ~2,96 lên ~3,7 âm tiết/s). Người dùng nghe mẫu s005 và xác nhận "nghe rõ" (2026-10-19). Căn cứ: benchmark `content/projects/2026-truecrime-my-lai/research/pacing-benchmark.md` (kênh Việt đo lại: CDTeam 3,5, Dương FG 3,8, Dòng Máu Việt 4,1–4,5; 3,7 nằm trong khoảng). Không vượt ~4,0 khi chưa nghe thử. Với Vbee dùng `speed` riêng (chưa chốt, nghe thử trước).
- Trần clip/dự án: _chưa chốt_
