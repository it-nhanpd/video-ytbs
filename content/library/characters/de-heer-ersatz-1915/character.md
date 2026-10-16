# de-heer-ersatz-1915 — Bộ binh Đức 1915 (Bluse M1915 & Pickelhaube M1915 tháo mũi nhọn)

## Prompt block (dán nguyên văn)
```
German infantry soldier of World War I in autumn 1915 after the September 1915 uniform reform, full-body strict 90-degree side profile view facing LEFT, standard adult male base body proportion,
wearing the simplified Model 1915 leather Pickelhaube helmet with matte dark-charcoal sheet-iron fittings (Eisenblech) and with the removable top spike REMOVED for front-line service (leaving only the low circular bayonet-mount base dome on top of the helmet),
wearing the simplified Model 1915 greenish field-grey (Feldgrau) wool Bluse tunic with concealed front buttons, turn-down collar, and blackened leather belt with ammunition pouches,
greenish field-grey trousers tucked into blackened leather marching boots, canvas breadbag and field pack, unarmed,
all field-grey fabrics rendered in a distinct muted olive-greenish tone (#505d4c) clearly different from the neutral gray background (#808080),
wide landscape composition (5:2 aspect ratio) with full figure clearly inside frame,
solid flat uniform neutral gray background (#808080), perfectly even with no gradient, no vignette, no texture, no noise,
subject centered with at least 12% empty margin on every side and the bottom-right corner completely empty,
no ground, no shadow, no reflection, no other objects, single subject only,
no part of the subject uses the same neutral gray as the background (interiors and openings must be deep shadow or a clearly different color)
```
Sau đó dán style block: `library/styles/comic-cel-painterly.md` (khối nhân vật/phương tiện).

## Ảnh tham chiếu cần đính kèm khi tạo
- `content/projects/2026-german-army-uniforms/research/images/ch01_pickelhaube_prussia_1915_item1.jpg` (hiện vật Pickelhaube M1915 có phụ kiện sắt tấm và khớp tháo mũi nhọn).
- Văn bản sắc lệnh AKO 21/9/1915 in trong Osten-Sacken 1916 (`S55`, `[F51, F58, F59]`) và hồ sơ DHM U 1198 (`S64`).

## Bất biến (không được đổi)
- Nhìn ngang đúng 90° hướng TRÁI, cùng tỉ lệ thân hình chuẩn.
- Mũ Pickelhaube M1915 thân da đen, phụ kiện bằng sắt tấm tối màu (không phải đồng vàng), và **đã tháo mũi nhọn** (chỉ còn chân đế tròn thấp trên đỉnh mũ theo đúng lệnh ngày 21–27/9/1915 khi ra mặt trận `[F59]`).
- Áo *Bluse* M1915 giấu hàng cúc trước, vải màu xanh xám *Feldgrau* ngả lục (`#505d4c`), tuyệt đối không dùng màu xám trung tính `#808080`.

## Lỗi AI hay gặp
- AI vẫn vẽ mũi nhọn cao trên đỉnh mũ (cảnh này minh họa lệnh tháo mũi nhọn ngoài mặt trận tháng 9/1915 `[F59]`).
- Màu vải *Feldgrau* hoặc phụ kiện sắt trên mũ bị tô màu xám `#808080` trùng nền làm thủng hình khi tách nền.
- **Watermark hình sao ở góc dưới phải** (Nano Banana/Gemini): crop bỏ trong manifest, nên chủ thể không được lấn vào góc đó.

## Đã dùng
- german-army-uniforms/s006
