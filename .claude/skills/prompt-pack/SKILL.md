---
name: prompt-pack
description: Sinh prompt pack (prompt tạo ảnh + checklist QA + tên file đích + manifest) cho các asset còn thiếu của một cảnh/dự án, để người dùng tự tạo bằng Nano Banana, rồi hiệu chỉnh manifest sau khi ảnh về. Dùng khi scenes.json có layer ảnh chưa có file final, khi cần thêm nhân vật/vũ khí/phương tiện vào library, hoặc khi người dùng vừa thả ảnh vào inbox/.
---

# prompt-pack

Hệ thống **không** tạo ảnh. Skill này tạo mọi thứ người dùng cần để tự tạo ảnh và đưa lại vào hệ thống, rồi hiệu chỉnh `manifest.json` để `ingest` xử lý đúng.

## Quy trình
1. Đọc `content/projects/<p>/scenes.json`, liệt kê layer `type: image` có `status: placeholder`.
2. Với mỗi asset, **tra `content/library/INDEX.md` trước**. Đã có và `approved` thì dùng lại, không tạo prompt.
3. Còn thiếu: lấy "Prompt block" từ thẻ trong library (`vehicle.md`/`character.md`) + style block `library/styles/comic-cel-painterly.md` + **khối ràng buộc kỹ thuật bên dưới**. Chưa có thẻ thì tạo thẻ mới trước (theo format `library/vehicles/uh1-huey/vehicle.md`).
4. Ghi `prompts/<scene>.md` cho từng asset, theo thứ tự: ảnh tham chiếu cần đính kèm → prompt dán nguyên văn → yêu cầu đầu ra → checklist QA (từ "Bất biến" và "Lỗi AI hay gặp" của thẻ).
5. Ghi `prompts/manifest.json` (bản nháp: `inbox` là tên file **không đuôi**, `process` điền sau ở bước hiệu chỉnh).
6. `npm run validate`.

## Khối ràng buộc kỹ thuật (BẮT BUỘC có trong mọi prompt nhân vật/vũ khí/phương tiện)
Các ràng buộc này tồn tại vì cách `tools/ingest.ts` tách nền. Thiếu một điều là ảnh về sẽ lỗi.

Dán nguyên văn vào prompt (sau phần mô tả chủ thể, trước style block):
```
solid flat uniform neutral gray background (#808080), perfectly even with no gradient, no vignette, no texture, no noise,
subject centered with at least 12% empty margin on every side and the bottom-right corner completely empty,
no ground, no shadow, no reflection, no other objects, single subject only,
no part of the subject uses the same neutral gray as the background (interiors and openings must be deep shadow or a clearly different color)
```
| Ràng buộc | Lý do |
|---|---|
| Nền xám phẳng đồng nhất | `ingest` flood-fill từ mép ảnh theo màu 4 góc (dung sai 38). Gradient/vignette/texture làm viền bẩn |
| Chừa ≥12% lề, góc dưới phải trống | Nano Banana/Gemini gắn watermark hình sao ở góc dưới phải. Crop bỏ nó nên chủ thể phải nằm ngoài vùng cắt |
| Không bóng đổ, không mặt đất | Bóng thành vệt đục sau khi tách nền |
| Không có phần nào của chủ thể màu xám trùng nền | Cửa mở/kính/nội thất màu xám giống nền sẽ bị xóa thành lỗ |
| Một chủ thể duy nhất | `trim` cắt theo hộp bao toàn bộ vùng đục, vật thừa làm lệch tâm |
| Phần chuyển động bằng code **không vẽ** (cánh quạt, tia lửa, khói) | Engine vẽ bằng code, đúng tốc độ và mờ chuyển động |
| Phương tiện/nhân vật nhìn ngang đúng 90°, đầu hướng trái | Engine chỉ có `flipX`, không xoay góc nhìn |
| Chủ thể rộng, tỉ lệ ngang khoảng 5:2 | `ImageAsset` bố cục 5:2; ảnh dọc sẽ bị thu nhỏ nhiều khi `fit` |

Định dạng ảnh người dùng tải về có thể là `.jpg`, `.png` hoặc `.webp`: **không cần đổi đuôi**. `ingest` tự ép về PNG RGBA. Chỉ cần đặt tên **đúng `<assetId>`** (vd `huey_side.jpg`). Nếu có nhiều bản cùng tên khác đuôi thì lấy bản mới nhất.

Trong yêu cầu đầu ra của prompt pack ghi: "tên file `<assetId>` (đuôi jpg/png/webp đều được), tỉ lệ ~16:9 hoặc 5:2 đều được vì có bước crop".

## Hiệu chỉnh manifest sau khi ảnh về inbox (bước hay bị bỏ quên)
Khi người dùng báo đã thả ảnh vào `inbox/`:
1. **Xem ảnh bằng Read** (vision) và ghi lại kích thước thật (`sharp(...).metadata()` hoặc xem log ingest).
2. Điền `process` trong `manifest.json`, **tọa độ theo pixel ảnh gốc**:
   - `crop`: hộp quanh chủ thể, **loại watermark ở góc dưới phải** và lề thừa.
   - `keyOut: true`, `keyTolerance: 38` (tăng nếu nền có nhiễu JPEG, giảm nếu chủ thể có màu gần nền), `trim: true`.
   - `fit: {width: 2000, height: 800}` cho ảnh 5:2.
   - `anchors`: `mainHub` (đỉnh trục rotor chính), `tailHub` (tâm cánh đuôi) nếu là trực thăng. Ước lượng từ ảnh, sai vài chục pixel vẫn chấp nhận được.
   - `rotorRadius`: mặc định `{"main": 0.55, "tail": 0.085}` (theo chiều rộng chủ thể).
   - `minHolePx`: mặc định 600. Tăng nếu mất chi tiết xám nhỏ của chủ thể.
3. `npm run ingest -- <project>`, `npm run validate`, render một still (`npm run still -- <compId> <out>.png --frame=<n>`) và **xem lại**: tìm viền bẩn, lỗ ở chỗ không nên, cánh quạt lệch trục.
4. Sai thì chỉnh `process` rồi ingest lại (idempotent, ghi đè `assets/`).

## Quy tắc prompt
- Nhân vật/vũ khí/phương tiện: một chủ thể, nét viền đen, **không** mờ chuyển động.
- Nhân vật cần chuyển động thật (giật súng, quay đầu): tạo pose gốc, rồi prompt image-to-video riêng (2–4 giây, khóa khung đầu và cuối, nền phẳng, chuyển động nhỏ). Clip cuối hạ về 12fps.
- Vũ khí và phương tiện phải đúng lịch sử, luôn đính kèm ảnh tham chiếu thật.
- Không đưa tên nghệ sĩ/kênh khác vào prompt.

## Sau khi duyệt
Promote vào library: copy `assets/<assetId>.png` vào `content/library/...`, cập nhật `meta.json` (`files.approved`, `usedIn`, `rotors` nếu có) và `INDEX.md`.
