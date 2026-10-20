# Kế hoạch: tách 2 skill phong cách (điều tra / lịch sử), chỉnh nhịp đọc, dò G-Labs video

## Context
Nhận xét thứ hai (dán trong chat) và phát hiện của người dùng: repo đang **lẫn hai họ phong cách** ("tra án" kiểu Vox `truecrime-collage`, template `vox` vs "lịch sử" kiểu `history-cel-docu`, `geomap`, cel). Ví dụ dự án Mỹ Lai: `project.md` ghi template `vox` + style `history-cel-docu` + ảnh tư liệu thật kiểu truecrime. Lẫn là nguyên nhân thất bại. Thêm nữa: nhịp đọc chậm (`rate -2%`, ~2,9 âm tiết/giây), người dùng muốn dồn dập, cuốn theo truyện; muốn nhiều footage hơn ảnh tĩnh nhưng **không phụ thuộc credit**.

Quyết định của người dùng (câu trả lời vừa rồi):
- Footage AI **chỉ hỗ trợ các cảnh khó**; phần lớn vẫn bằng code (lật ảnh, key pose, rig, parallax, `runner`, hạt, camera).
- Chưa biết G-Labs có endpoint video không → **dò trước** (chỉ đọc).
- Hai skill riêng + 1 file dùng chung.
- Skill phải **đính kèm tự động mỗi khi bắt đầu dự án mới**.

Việc trước đó (file `script/full-narration.md`, đề xuất chỉnh lời dẫn Mỹ Lai) đã xong/đang chờ duyệt; kế hoạch này là việc **khác**, không sửa nội dung Mỹ Lai.

## Bước A — Dò endpoint video G-Labs (chỉ đọc, không tốn credit)
- Server phải đang chạy (`GET /api/health` đã dùng trong `tools/glabs.mjs`).
- Chỉ dùng `GET`: `/openapi.json`, `/docs`, `/api/models`, `GET /api/video/generate` (405 = endpoint tồn tại; 404 = không có). **Không POST** (POST mới tốn credit). Không đọc/in khóa API (`glabs-delegation.md`).
- Báo kết quả trung thực: có/không, tên model, tham số (ảnh đầu vào, độ dài, tỉ lệ). Nếu server chưa chạy thì dừng và báo.
- Nếu **có**: viết `tools/glabs-video.mjs` (theo mẫu `tools/glabs.mjs`: 1 clip mỗi lần, poll `/api/status/<id>`, ghi vào `inbox/`, không ghi đè trừ `--force`), 1 clip pilot rồi chờ người dùng duyệt; cập nhật `.claude/rules/glabs-delegation.md` (cho phép video, trần số clip, chỉ cảnh khó, log số lần gọi vào `.claude/progress/`).
- Nếu **không**: ghi vào skill rằng footage đến từ nguồn ngoài do người dùng cung cấp hoặc ảnh G-Labs + chuyển động code; không đoán thêm.
- Việc này đảo ngược điều đã ghi trong `project.md` Mỹ Lai ("chuyển động = ảnh nhiều lớp, không image-to-video"): theo `workflow-gates.md` mục 5 phải ghi quyết định của người dùng (lời nói hôm nay) vào `project.md` khi áp cho dự án đó.

## Bước B — Hai skill (nguồn `.claude/skills/`, đồng bộ sang `.agent/skills/` theo `one-source.md`)
Mỗi skill có `SKILL.md` ngắn (<~150 dòng) làm cửa vào, mô tả để tự kích hoạt, kèm bảng "dùng / không dùng".

| | `video-style-investigation` (tra án) | `video-style-history` (lịch sử) |
|---|---|---|
| Khi dùng | true crime, vụ án, điều tra, che giấu, tài liệu | chiến tranh, đế chế, nhân vật, biên niên |
| Style bible | `truecrime-collage.md` | `history-cel-docu.md` (+ `empire-map.md` nếu bản đồ đế chế) |
| Template engine | `vox` (`engine/src/vox/`) | `vox` + `geomap`, hoặc scenes multiplane (cel/rig) |
| Xương sống | tài liệu gốc, bút dạ quang, đóng dấu, đối chiếu lời khai | bản đồ giấy, sơ đồ đơn vị, cảnh dựng cel, nhân vật cố định |
| Lời dẫn | nghi vấn, mâu thuẫn chứng cứ, open loop | kể theo diễn biến, kịch tính (dramatic irony), nhân vật |
| Cấm lẫn | không cel nhân vật hoạt hình, không bản đồ giấy cổ | không ảnh kiểu hồ sơ dán giấy-xé làm xương sống |

Nội dung mỗi skill: (1) định nghĩa họ + ví dụ chủ đề; (2) style bible và palette/chữ (trỏ file, không chép); (3) loại cảnh cho phép + danh sách cấm; (4) cấu trúc kể chuyện mẫu (điều tra: mâu thuẫn → chứng cứ → che giấu → phanh phui; lịch sử: bối cảnh → diễn biến → cao trào → hệ quả); (5) tỉ lệ nhịp theo `reenactment-first.md`; (6) mục chọn footage cho cảnh khó (xem Bước C); (7) checklist "có đang lẫn họ kia không".

**Nhận biết lẫn:** thêm vào mỗi skill một đoạn kiểm tra nhanh (đối chiếu `project.md`: `Style-family`, template, style bible, loại cảnh). Dự án có dấu hiệu của cả hai họ → dừng, hỏi người dùng chọn một (không tự gộp).

## Bước C — File dùng chung `content/library/styles/pacing-and-footage.md`
Chỉ chứa phần **độc lập với họ style**; hai skill đều trỏ tới.
1. **Tốc độ đọc & nhịp kể dồn dập:** hiện `rate -2%` ≈ 2,9 âm tiết/giây (`vox.json`, `tools/vox-tts.mjs --rate`). Đề xuất thử `+10%…+20%` (đo bằng đoạn mẫu so sánh trước khi chốt, không tự đặt số cuối), câu ≤ 15–18 âm tiết, xen câu 3–5 từ, tạm nghỉ ngắn (~0,15–0,25 s) thay cho khoảng lặng dài, đổi hình/camera mỗi 4–7 s ở đoạn cao trào, mở loop trước mỗi chương, cao trào cảm xúc (nhân vật cụ thể) trước đoạn pháp lý. Số cuối cùng ghi vào file sau pilot do người dùng nghe duyệt.
2. **Phân loại cảnh theo độ khó** → công cụ: 
   - Dễ/phần lớn: ảnh lớp + camera, lật ảnh, key pose, rig, `runner`, hạt/khói bằng code (không tốn credit).
   - **Cảnh khó** (chỉ những cảnh này mới dùng clip AI): chuyển động phức tạp khó rig (trực thăng đáp, đám đông, xe hạ cánh), cảnh cần chiều sâu thật.
3. **Quy trình clip G-Labs cho cảnh khó:** ảnh tĩnh duyệt style-guard → prompt clip ngắn 3–6 s → pilot 1 clip → log credit → clip vào `content/library/footage/<id>.mp4` kèm thẻ (nguồn prompt, sự kiện minh họa, nhãn "Minh họa") để **tái dùng** (loop, cắt, đảo chiều, đổi màu) thay vì tạo lại; trần số clip/dự án đặt trong `project.md` (người dùng duyệt).
4. **Visual brief cho agent** (ý từ nhận xét thứ hai): mỗi shot ghi Narration → Visual intent → Asset (loại: tư liệu / bản đồ / dựng cảnh / clip) → Verification → Render; tách tư liệu đúng sự kiện / tư liệu bối cảnh / minh họa tái dựng, minh họa luôn có nhãn.

## Bước D — "Đính kèm mỗi dự án mới"
Cơ chế thật, không chỉ nhắc:
- **Bước 0 của playbook** (`.claude/templates/step-create-video.md`, mẫu `NEW_PROJECT_PLAYBOOK.md`): bắt buộc điền `Style-family: investigation | history` và nạp skill tương ứng + `pacing-and-footage.md`; thiếu trường này thì không sang bước 1.
- **`CLAUDE.md`** thêm 1 dòng trong "Rules bắt buộc": mọi dự án mới phải chọn họ style trước, nạp 1 trong 2 skill, cấm trộn.
- **`project.md` mẫu**: thêm dòng `Style-family`.
- Cập nhật mô tả `script-craft` và `prompt-pack` để trỏ tới skill họ tương ứng (không sửa nội dung lõi). Đồng bộ `.agent/` và kiểm không lệch (`diff -r .claude/skills .agent/skills`).

## Bước E — Không làm trong đợt này (chờ duyệt riêng)
- Chưa chạy lại TTS / render Mỹ Lai; chưa phân loại lại Mỹ Lai thuộc họ nào (đề xuất: "lịch sử", vì dùng bản đồ + cel, nhưng cần người dùng chọn rồi mới sửa `project.md`).
- Chưa tạo clip G-Labs nào ngoài 1 pilot sau khi Bước A xác nhận endpoint.

## Files
- Tạo: `.claude/skills/video-style-investigation/SKILL.md`, `.claude/skills/video-style-history/SKILL.md`, `content/library/styles/pacing-and-footage.md`; (nếu có endpoint) `tools/glabs-video.mjs`.
- Sửa: `.claude/templates/step-create-video.md`, `CLAUDE.md`, `.claude/rules/glabs-delegation.md` (nếu có video), `.claude/skills/script-craft/SKILL.md` và `prompt-pack/SKILL.md` (1 dòng trỏ), `.claude/rules/one-source.md` không đổi; đồng bộ toàn bộ sang `.agent/`.
- Tham khảo, không sửa: `content/library/styles/truecrime-collage.md`, `history-cel-docu.md`, `empire-map.md`, `.claude/rules/reenactment-first.md`, `tools/glabs.mjs`.

## Verification
- Bước A: log các lệnh GET + mã HTTP; không có POST nào.
- `ls .claude/skills/video-style-*` và `.agent/skills/video-style-*` tồn tại, `diff -r` không lệch.
- Mỗi `SKILL.md` có frontmatter `name`/`description` đúng; mở thử bằng Skill tool để chắc nạp được.
- Chạy thử "dự án mới giả" trên giấy: đọc playbook bước 0 → buộc chọn họ → trích đúng skill; một dự án trộn họ bị checklist chặn.
- Nếu có `glabs-video.mjs`: `node tools/glabs-video.mjs` không tham số in cách dùng; 1 pilot clip được người dùng duyệt trước khi cho phép thêm.
