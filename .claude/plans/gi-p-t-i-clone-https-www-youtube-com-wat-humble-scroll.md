# Plan: ghi style video "Mỹ Lai Massacre" + làm video Mỹ Lai mới

## Context
Người dùng muốn "clone" https://www.youtube.com/watch?v=o9sr8sviSIs (tựa "Mỹ Lai Massacre"). Đã chốt: **học style** (bố cục, nhịp, chữ, chuyển động) rồi **làm video mới của mình** về Mỹ Lai, với kịch bản, nguồn, hình, giọng riêng. Không chép hình, lời dẫn, nhạc hay nhận diện kênh gốc. Lấy video bằng yt-dlp (đã có sẵn dạng module `python -m yt_dlp` 2026.08.19, không cần cài; ffmpeg có ở `C:\ffmpeg-7.0.2`).

## Bước 1: style-capture (skill `style-capture`)
1. Tải bản 360p vào thư mục riêng, rỗng ở scratchpad (không vào repo):
   `python -I -m yt_dlp --js-runtimes node -F <url>` rồi `-f <id> -o ref.%(ext)s`.
2. Trích khung: `node tools/grab-frames.mjs --video <mp4> --out content/library/styles/refs/ref-video/my-lai/ --every 25`, thêm `--at` dày quanh 3:06 (`t=186s` người dùng đánh dấu). Kiểm `refs/ref-video/` có trong `.gitignore`.
3. Đếm cắt cảnh bằng `ffmpeg select='gt(scene,0.35)'`; xem các `sheet_*.png`.
4. Ghi `content/library/styles/<tên-style>.md` cùng cấu trúc `truecrime-collage.md`: loại hình (ảnh tư liệu / collage / bản đồ / chữ), cỡ cảnh, camera, nhịp, màu, chữ, chuyển cảnh, "điều không sao chép", mục "Phát hiện của người dùng" (sẽ hỏi).
5. Bảng "đã có / chưa có" so với template `vox` (`engine/src/vox/`): kind nào dùng lại được (stamp, map, cutouts, doc, stats…), kind nào phải thêm.
→ **Cổng:** gửi style doc + bảng khác biệt, chờ duyệt (`style-lock.md`).

## Bước 2: dự án mới `content/projects/2026-truecrime-my-lai/`
Dựng theo khuôn `2026-truecrime-unabomber` (project.md, research/, script/, locales/vi.json, vox.json, qa/, prompts/, inbox/, assets/, renders/).
- **Nguồn** (skill `fact-research`, `source-policy.md`): Báo cáo Peers (Library of Congress, nguồn G/A), hồ sơ tòa án binh vụ Calley và phán quyết phúc thẩm liên bang (văn bản tòa án), sách học thuật có bình duyệt. Mỗi khẳng định có dòng Fxx.
- **Kịch bản:** skill `script-craft`, thẻ cảnh từng cảnh (G1 duyệt).
- **Hình:** ưu tiên ảnh PD có hồ sơ (ảnh Quân đội Mỹ, tài liệu Peers); ảnh màu của Haeberle phải kiểm giấy phép trước khi dùng, không đạt thì không dùng. **Không** tạo ảnh AI mô tả người thật hay cảnh bạo lực; ảnh AI (G-Labs `nano_banana_2_lite`) chỉ cho nền/đạo cụ trung tính, mỗi đợt nêu số ảnh và chờ xác nhận. Tránh hình ảnh thi thể/bạo lực trực diện (an toàn nội dung YouTube + tôn trọng nạn nhân).
- **Giọng:** `node tools/vox-tts.mjs <p>` (edge-tts như Unabomber).
- **Pilot trước loạt** (`workflow-gates.md` mục 2, 7): 1 cảnh render still + clip → người dùng duyệt style → ghi "pilot đã duyệt" vào `project.md` → làm các cảnh còn lại từng cảnh.

## File chính
- Mới: `content/library/styles/<style>.md`, `content/projects/2026-truecrime-my-lai/**`
- Có thể sửa (nếu style cần kind mới): `engine/src/vox/*`, `engine/src/Root.tsx` (`voxProjects`)
- Cập nhật: `content/library/INDEX.md`, `.claude/progress/`

## Kiểm chứng
- Style: ảnh ghép đối chiếu khung tham chiếu ↔ khung của ta cho người dùng chấm (không tự nói "giống X%").
- Engine: `npm run typecheck`, `npm run still -- 2026-truecrime-my-lai-vox-<shot> ...`, render clip pilot, xem khung full-res kèm bảng chấm (`style-guard`).
- Nguồn: mọi câu trong `locales/vi.json` truy được về Fxx đã kiểm chứng.

## Giới hạn báo trước
- Không nghe được lời dẫn gốc ngoài phụ đề (nếu tải được); số đo nhìn bằng mắt ghi *(ước lượng)*.
- Không đăng tải gì; không đưa khung trích lên git.
