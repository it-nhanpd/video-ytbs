---
name: prompt-pack
description: Sinh prompt pack (prompt tạo ảnh + checklist QA + tên file đích + manifest) cho các asset còn thiếu của một cảnh/dự án, để người dùng tự tạo bằng Nano Banana, rồi hiệu chỉnh manifest sau khi ảnh về. Dùng khi scenes.json có layer ảnh chưa có file final, khi cần thêm nhân vật/vũ khí/phương tiện/nền vào library, hoặc khi người dùng vừa thả ảnh vào inbox/.
---

# prompt-pack

> **Họ style:** đọc `Style-family` trong `project.md`; style bible và block prompt phải thuộc đúng họ (`video-style-investigation` hoặc `video-style-history`), không trộn. Clip video cho cảnh khó: xem `content/library/styles/pacing-and-footage.md` mục 3.

Hệ thống **không** tạo ảnh. Skill này tạo mọi thứ người dùng cần để tự tạo ảnh và đưa lại vào hệ thống, rồi hiệu chỉnh `manifest.json` để `ingest` xử lý đúng.

**Đọc trước, bắt buộc:** `content/library/styles/uniform-showcase.md` (style bible), `comic-cel-painterly.md` (các block), `.claude/rules/style-lock.md`, `.claude/rules/workflow-gates.md`. Thư mục `styles/refs/` trống thì dừng và hỏi người dùng.

## Quy trình
1. Đọc `content/projects/<p>/scenes.json`, liệt kê layer `type: image` có `status: placeholder` và các bối cảnh cần nền.
2. Với mỗi asset, **tra `content/library/INDEX.md` trước**. Đã có và `approved` thì dùng lại, không tạo prompt.
3. **Pilot gate:** nếu `project.md` chưa ghi "pilot đã duyệt", chỉ làm prompt cho **1 nhân vật + 1 nền** của 1 cảnh. Xong dừng, chờ người dùng duyệt (qua `style-guard`). Chỉ khi duyệt mới làm các asset còn lại.
4. Phân loại chủ thể rồi chọn ràng buộc đúng loại (mục dưới): *nhân vật người*, *phương tiện/vật thể dài*, *nền*.
5. Còn thiếu: lấy "Prompt block" từ thẻ library + block style tương ứng + khối ràng buộc kỹ thuật. Chưa có thẻ thì tạo thẻ mới trước (format `library/vehicles/uh1-huey/vehicle.md`).
6. Nhân vật người: **ảnh anchor bắt buộc** = base body/nhân vật đã duyệt (ảnh đầu tiên của pilot). Mọi biến thể quân phục đính kèm anchor và ghi "same character, same face and proportions as the attached image, change only the uniform". Chưa có anchor thì asset đầu tiên chính là pilot.
7. Ghi `prompts/<scene>.md` cho từng asset, theo thứ tự: ảnh tham chiếu cần đính kèm (anchor + ảnh style + ảnh tư liệu) → prompt dán nguyên văn → yêu cầu đầu ra → checklist QA (từ "Bất biến", "Lỗi AI hay gặp" và bảng `style-guard`).
8. Ghi `prompts/manifest.json` (bản nháp: `inbox` là tên file **không đuôi**, `process` điền sau).
9. `npm run validate`.

## Ràng buộc theo loại chủ thể

### A. Nhân vật người (uniform-showcase)
Dán nguyên văn sau phần mô tả quân phục, trước block style:
```
full-body strict 90-degree side profile facing RIGHT, mid-stride walking pose (one foot forward, arms swinging naturally), not standing at attention,
standard adult male base body proportion identical to the attached reference, head about 1/7.5 of body height,
tall portrait or square composition with the full figure from helmet top to boot soles inside frame, figure fills about 80% of image height,
solid flat uniform neutral gray background (#808080), perfectly even with no gradient, no vignette, no texture, no noise,
at least 8% empty margin on every side and the bottom-right corner completely empty,
no ground, no shadow, no reflection, no other objects, single subject only,
no part of the subject uses the same neutral gray as the background (interiors and openings must be deep shadow or a clearly different color)
```
- Hướng PHẢI, **không dùng `flipX`**. Phù hiệu bất đối xứng (đại bàng ngực phải, miếng cờ tay áo) đúng bên theo hiện vật.
- Vũ khí: chỉ ở giai đoạn chiến tranh khi shotlist ghi; vẽ thành **mảnh riêng** (`weapon`) trong bảng bộ phận, mô tả trung tính, không máu/thương vong. Không chữ thập ngoặc chi tiết.
- **Chuyển động = RIG tách bộ phận (từ 2026-10-17; sprite sheet 12 tư thế BỊ BỎ vì ba ảnh sinh độc lập lệch màu/tỉ lệ).** Mỗi nhân vật chỉ **MỘT ảnh "bảng bộ phận"** tạo từ ảnh nhân vật đã duyệt (anchor): 7 mảnh xếp MỘT hàng trái → phải theo thứ tự **đầu+mũ, thân, tay trên, cẳng tay+bàn tay, đùi, cẳng chân, bàn chân** (+ tùy chọn **vũ khí** là mảnh thứ 8). Mẫu prompt đã duyệt dùng được: `content/projects/_rig-demo/prompts/g-labs/1-parts-1871.txt`.
  - Mỗi mảnh vẽ **thẳng đứng, không cong** (bàn chân nằm ngang, mũi hướng phải); đầu khớp tròn, kéo dài hơn khớp một chút để chồng lên nhau khi xoay.
  - Mọi mảnh **cùng thang vẽ** (như cắt từ một người cao ~900 px), cùng nét, màu, chi tiết quân phục; khoảng trống ≥ 90 px giữa các mảnh, không chạm nhau, không chạm mép ảnh; nền #808080; **không** chữ/nhãn/số/mũi tên, không đường kẻ đất.
  - Chỉ tạo **một** chi (tay, chân); chi xa dùng lại ảnh chi gần (tối hơn trong code) nên màu luôn khớp. Không tạo bản trái/phải riêng.
- **Tách bộ phận bằng code (không tốn token):** `tools/ingest.ts` có `splitParts`. Manifest: `"inbox":"<id>_parts"`, `"process":{"keyOut":true,"splitParts":{"pieces":["head","torso","upperArm","foreArm","thigh","shin","foot"],"minGapPx":30}}` (thêm `"weapon"` cuối nếu có); `layer` phải là layer type `rig` trong scenes.json. Khớp/trục mặc định theo quy tắc loại mảnh, ghi đè bằng `overrides`. Chu kỳ đi nằm ở `engine/src/walkCycle.ts` (không cần ảnh thêm).

### B. Phương tiện/vật thể dài (kiểu Huey)
Dán nguyên văn (sau mô tả, trước block style):
```
solid flat uniform neutral gray background (#808080), perfectly even with no gradient, no vignette, no texture, no noise,
subject centered with at least 12% empty margin on every side and the bottom-right corner completely empty,
no ground, no shadow, no reflection, no other objects, single subject only,
no part of the subject uses the same neutral gray as the background (interiors and openings must be deep shadow or a clearly different color)
```
Nhìn ngang đúng 90° (đầu hướng trái theo quy ước Huey; engine có `flipX` cho vật thể đối xứng), khung ngang ~5:2. **Chỉ áp cho phương tiện/vật thể dài, không áp cho người.** Phần chuyển động bằng code (cánh quạt, tia lửa, khói) **không vẽ**.

### C. Nền theo lớp (environment layers, từ 2026-10-17)
Đọc `content/library/styles/layer-recipe.md` trước. Mỗi bối cảnh = các ảnh riêng, tên `bg_<bối-cảnh>_<lớp>`; khung 16:9; không nhân vật; kiểu **tô phẳng nhiều tông + viền đen + nét gạch cỏ**, không gradient bóng bẩy, không chữ; bảng màu theo grade, nền bão hòa thấp hơn quân phục.
1. `_far`: trời + đồi xa (nhạt, viền rất mảnh hoặc không), phủ cả khung.
2. `_mid`: đồi giữa + mặt đất (viền đen đậm, ô ruộng/đường vạch, nét gạch cỏ), có dải trống ở giữa cho nhân vật.
3. `_fg`: dải cỏ/bụi tiền cảnh viền đen dày, nằm ở đáy khung, nền xám #808080 để tách, **mép trái khớp mép phải** (lặp ngang); ingest làm liền mép và báo nếu lệch.
4. `_sweep`: 1–2 tán cây/bụi rất to dùng để quét ngang đầu cảnh (nền xám tách, không cần lặp).
Chi tiết địa lý (địa hình, thực vật) lấy từ nguồn đã đọc, không từ trí nhớ; nếu nguồn chưa có thì để chung chung. Kèm "ảnh tham chiếu chỉ để học nét/màu/số lớp, không sao chép nhân vật hay địa điểm".

## Lý do các ràng buộc tách nền
| Ràng buộc | Lý do |
|---|---|
| Nền xám phẳng đồng nhất | `ingest` flood-fill từ mép ảnh theo màu 4 góc (dung sai 38). Gradient/vignette/texture làm viền bẩn |
| Chừa lề, góc dưới phải trống | Nano Banana/Gemini gắn watermark hình sao ở góc dưới phải; crop bỏ nó nên chủ thể phải nằm ngoài vùng cắt |
| Không bóng đổ, không mặt đất | Bóng thành vệt đục sau khi tách nền |
| Không phần nào của chủ thể màu xám trùng nền | Chi tiết xám giống nền sẽ bị xóa thành lỗ |
| Một chủ thể duy nhất | `trim` cắt theo hộp bao toàn bộ vùng đục |

Định dạng ảnh tải về có thể `.jpg`, `.png`, `.webp`: không cần đổi đuôi, `ingest` tự ép về PNG RGBA. Đặt tên **đúng `<assetId>`**; nhiều bản cùng tên thì lấy bản mới nhất.

## Hiệu chỉnh manifest sau khi ảnh về inbox (bước hay bị bỏ quên)
1. **Chạy skill `style-guard` trên ảnh vừa về.** Không đạt: dừng, báo lỗi, sửa prompt tạo lại. Chỉ ảnh đạt mới sang bước 2.
2. **Xem ảnh bằng Read** và ghi kích thước thật.
3. Điền `process` trong `manifest.json`, tọa độ theo pixel ảnh gốc:
   - `crop`: hộp quanh chủ thể, **loại watermark ở góc dưới phải** và lề thừa.
   - `keyOut: true`, `keyTolerance: 38` (tăng nếu nền có nhiễu JPEG, giảm nếu chủ thể gần màu nền), `trim: true`.
   - `fit`: **theo loại chủ thể**: vật thể dài `{2000, 800}`; nhân vật người theo tỉ lệ người (vd. `{800, 1000}`), không ép 5:2. Ingest tự ghi `layer.aspect = cao/rộng` của `fit`/`frameFit`; `ImageAsset` dùng nó.
   - `anchors`, `rotorRadius` chỉ cho trực thăng; `minHolePx` mặc định 600.
4. `npm run ingest -- <project>`, `npm run validate`, render một still và **xem lại**: viền bẩn, lỗ, cỡ nhân vật so với khung (55–65%).
5. Sai thì chỉnh `process` rồi ingest lại (idempotent).

## Quy tắc prompt
- Một chủ thể, nét viền đen, **không** mờ chuyển động.
- Vũ khí và phương tiện phải đúng lịch sử, luôn đính kèm ảnh tham chiếu thật.
- Không đưa tên nghệ sĩ/kênh khác vào prompt.
- Báo cáo trung thực: chỉ ghi đã làm khi file tồn tại.

## Sau khi duyệt
Promote vào library: copy `assets/<assetId>.png` vào `content/library/...`, cập nhật `meta.json` (`files.approved`, `usedIn`) và `INDEX.md`.
