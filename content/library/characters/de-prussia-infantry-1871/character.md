# de-prussia-infantry-1871 — Bộ binh Phổ 1871 (Pickelhaube M1871)

## Prompt block (dán nguyên văn)
```
Prussian infantry soldier of the German Empire, year 1871, full-body strict 90-degree side profile view facing LEFT, standing in a steady marching posture using the standard adult male base body proportion,
wearing the reduced-height model 1871 black lacquered leather Pickelhaube helmet with polished brass front eagle plate, brass spike (Spitze) on top, and brass chin-scale strap,
single-breasted dark Prussian blue wool tunic (Waffenrock) with 8 brass buttons down the front, red collar and cuffs, dark trousers tucked into black leather marching boots,
cross-straps and black leather ammunition pouches on belt, leather knapsack (Tornister) with rolled grey overcoat strapped around it on his back, unarmed hands at sides to keep full focus on the uniform,
wide landscape composition (5:2 aspect ratio) with full figure from spike tip to boot soles clearly inside frame,
solid flat uniform neutral gray background (#808080), perfectly even with no gradient, no vignette, no texture, no noise,
subject centered with at least 12% empty margin on every side and the bottom-right corner completely empty,
no ground, no shadow, no reflection, no other objects, single subject only,
no part of the subject uses the same neutral gray as the background (interiors and openings must be deep shadow or a clearly different color)
```
Sau đó dán style block: `library/styles/comic-cel-painterly.md` (khối nhân vật/phương tiện).

## Ảnh tham chiếu cần đính kèm khi tạo
- `content/projects/2026-german-army-uniforms/research/images/ch01_pickelhaube_prussia_1915_item1.jpg` (chỉ tham khảo dáng vòm mũ da đen; lưu ý mẫu 1871 có đỉnh nhọn và phụ kiện bằng đồng thau vàng, thân mũ thấp hơn mẫu 1867 theo hiện vật DHM U 748 `[F07]`).
- Hồ sơ hiện vật DHM U 748 (Helm M1871, cao 23,5 cm) & U 1254 (Helm M1867, cao 26 cm) trong `research/02-sources.md` (`S02, S23`).

## Bất biến (không được đổi)
- Nhìn ngang đúng 90° (strict side profile), đầu hướng TRÁI, toàn thân từ chóp mũi nhọn đến đế ủng nằm gọn trong khung.
- Mũ Pickelhaube da đen bóng, phụ kiện và mũi nhọn màu đồng thau vàng ấm (không phải màu xám sắt của năm 1915).
- Áo Waffenrock xanh Phổ sẫm (dark Prussian blue) một hàng cúc đồng, cổ và măng-sét đỏ; tuyệt đối không có mảng nào màu xám #808080 trùng màu nền (cuộn áo khoác trên ba lô dùng màu nâu xám sẫm hoặc xanh xám đậm).
- Không cầm súng để tập trung hoàn toàn vào đường cắt quân phục.

## Lỗi AI hay gặp
- AI vẽ mũ Pickelhaube quá cao kiểu 1842 hoặc vẽ phụ kiện màu xám sắt (mẫu 1915).
- Cuộn áo khoác trên ba lô hoặc quần có sắc xám trung tính gần #808080 làm `ingest` xóa thủng thành lỗ.
- Vẽ bóng đổ dưới chân hoặc mặt đất dưới đế ủng.
- **Watermark hình sao ở góc dưới phải** (Nano Banana/Gemini): crop bỏ trong manifest, nên chủ thể không được lấn vào góc đó.

## Đã dùng
- german-army-uniforms/s001
- german-army-uniforms/s002
- german-army-uniforms/s003
