# Kế hoạch: video YouTube người que – trận đấu MMA (fiction)

## Context
Người dùng muốn bộ hướng dẫn + khởi tạo dự án cho video người que hoạt hình, chủ đề trận MMA hư cấu. Đã chọn: giao **Playbook + khởi tạo dự án** (chưa làm asset), kiểu **người que đánh nhau (fiction)**, cách tạo chuyển động **để tôi đề xuất**.

Hệ thống hiện tại (Remotion, layer parallax, `scenes.json` + i18n, 1 dự án mẫu lịch sử quân phục) được thiết kế cho tranh cel-painterly + ảnh AI. Người que **không khớp** với: style-lock (`uniform-showcase.md`), nguyên tắc "không SVG rig", và Bước 1–2 của playbook (phân tích tham chiếu, kiểm chứng nguồn). Vì vậy cần ghi rõ các điểm lệch dưới đây và xin duyệt (theo `workflow-gates.md` mục 5).

## Đề xuất cách làm chuyển động (khuyến nghị)
**Người que vẽ bằng code, chuyển động theo pose keyframe** (không dùng ảnh AI cho nhân vật):
- Mỗi người que = ~12 khớp (đầu, cổ, hông, 2 vai, 2 khuỷu, 2 tay, 2 gối, 2 chân) vẽ bằng nét SVG dày, màu theo `theme.ts`.
- Mỗi đòn (đấm thẳng, móc, đá vòng, double-leg, khóa/siết, KO) = 3–5 pose; `interpolate` góc khớp giữa các pose với easing ngắn (anticipation → impact → recover). Thư viện đòn tái sử dụng nhiều cảnh.
- Hiệu ứng trúng đòn trong code: camera shake, freeze 2–3 frame, "impact star" nét, speed lines, khung chớp trắng, slow-mo. Nền: lồng đấu/octagon dạng layer phẳng (khối màu đơn giản, đã có `sky/silhouette/haze`).
- Lý do chọn: người que AI sinh ảnh khó giữ nhất quán qua nhiều pose; code cho nhất quán 100%, tái sử dụng đòn, đổi màu võ sĩ trivially, render rẻ. Không cần Nano Banana/agy cho nhân vật.
- Phương án dự phòng (nếu không duyệt): ảnh tĩnh từng pose + shake (rủi ro lệch nét), hoặc dựng ngoài (CapCut/AE).

**Điểm lệch cần người dùng duyệt bằng văn bản (ghi vào `project.md`):**
1. Cho phép rig người que bằng code (ngoại lệ riêng của dự án này; quy tắc "không SVG rig" vẫn giữ cho dự án nhân vật tranh vẽ).
2. Style bible mới `content/library/styles/stickman-mma.md` (không sửa `uniform-showcase.md`/`comic-cel-painterly.md`); style-lock hiện hành chỉ áp cho dự án quân phục.
3. Bước 2 (kiểm chứng nguồn) thu gọn vì là fiction; thay bằng "bible trận đấu" (luật, hiệp, diễn biến).

## Các bước thực hiện (sau khi duyệt)
1. **Khởi tạo** `content/projects/2026-mma-stickman/` theo mẫu `2026-test-huey` và `templates/NEW_PROJECT_PLAYBOOK.md`: `project.md`, `scenes.json` rỗng, `locales/vi.json`, `inbox/ assets/ prompts/ renders/ script/ research/ audio/ qa/ publish/`. Điền THÔNG SỐ: topic trận MMA 3 hiệp hư cấu, niche giải trí/hoạt hình, 1920×1080, 24fps, 8–10 phút, locale vi.
2. **PLAYBOOK.md** của dự án, chỉnh từ template cho người que:
   - B1: phân tích 1–2 kênh người que đánh nhau (nhịp, hook, âm thanh) → style bible `stickman-mma.md` (độ dày nét, màu 2 võ sĩ, nền, ngôn ngữ hiệu ứng, danh sách cấm).
   - B2: bible trận đấu + kịch bản: hook 30s (khoảnh khắc KO), cấu trúc 3 hiệp (thăm dò → thế đổi → đảo chiều/kết), nhân vật/động cơ, lời bình hoặc không lời.
   - B3: shotlist theo đòn + danh mục "move library" (danh sách pose).
   - B4 (thay bước ảnh AI): dựng và duyệt **pilot**: 1 người que + 1 nền + 1 cảnh render thử (1 combo đấm–đá + 1 cú KO) trước khi làm loạt.
   - B5–B9: dựng `scenes.json`, âm thanh (SFX đấm/đá là trọng tâm, nhạc, bình luận viên), render + QA, tiêu đề/thumbnail/mô tả, đưa nhân vật + move library vào `library/`.
3. **Mở rộng engine (chỉ sau pilot duyệt):** thêm layer `type: 'stickman'` (hoặc component `StickFigure`) vào `engine/src/schema.ts` và `engine/src/components/`, nhận `pose` timeline; thêm vào `engine/src/Root.tsx`/`templates/MultiplaneScene.tsx`; cập nhật `tools/validate.ts`. Màu lấy từ `engine/src/theme.ts`, không hardcode.
4. Đồng bộ `.claude/` → `.agent/` nếu thêm skill/rule (`one-source.md`), thêm mục vào `content/library/INDEX.md`.

## File chính sẽ động tới
- Mới: `content/projects/2026-mma-stickman/**`, `content/library/styles/stickman-mma.md`, (sau pilot) `engine/src/components/StickFigure.tsx`.
- Sửa (sau pilot): `engine/src/schema.ts`, `engine/src/templates/MultiplaneScene.tsx`, `engine/src/Root.tsx`, `tools/validate.ts`, `content/library/INDEX.md`.
- Tham khảo/tái sử dụng: `templates/NEW_PROJECT_PLAYBOOK.md`, `content/projects/2026-test-huey` (khung), `utils.overScene`/camera range trong engine, `Layer.tsx` (blur/parallax).

## Kiểm chứng
- `npm run validate` và `npm run typecheck` sạch sau khi khởi tạo.
- `npm run studio` mở được composition của dự án mới.
- Pilot: `npm run still -- <project>-s001 .../renders/pilot.png` rồi `npm run render -- <project>-s001 .../renders/pilot.mp4`; người dùng xem và duyệt, ghi "pilot đã duyệt" vào `project.md` trước khi làm loạt.
- Báo cáo chỉ nói "đã tạo/render" khi file tồn tại (nêu đường dẫn).
