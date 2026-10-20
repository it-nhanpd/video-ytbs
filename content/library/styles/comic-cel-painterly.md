# Style block: comic-cel-painterly

Các block dán nguyên văn vào prompt tạo ảnh. Quy tắc chi tiết (hướng, tỉ lệ, danh sách cấm) nằm ở `uniform-showcase.md`, **đọc trước khi viết prompt**.

## Block nhân vật người (dán cuối prompt nhân vật)
```
2D animated documentary style, clean dark ink outlines of even thickness, flat cel shading with two tones
(light and shadow), subtle warm rim light, muted earthy palette, hand-drawn animation look,
no photorealism, no 3D render, no anime, no text except where specified
```
Negative (ghi thêm nếu công cụ có ô negative): `photo, 3D, anime, glossy, thick outline variation, shadow on ground, standing at attention, three-quarter view, extra objects, watermark`

## Block phương tiện/vật thể dài
Như block nhân vật; thêm khung ngang 5:2 (chỉ dành cho phương tiện).

## Block nền (environment plate)
```
soft painterly background, no outlines, layered rolling hills with atmospheric perspective, hazy, low contrast, muted palette,
dark softly blurred foreground framing, empty ground path in the middle, no characters, no text
```

## Bất biến của style
- Nhân vật/vũ khí/phương tiện có nét viền đen; nền thì không. Sự tương phản này tạo cảm giác điện ảnh.
- Vũ khí và phương tiện phải đúng lịch sử, ưu tiên chính xác hơn đẹp.
- Màu theo grade của cảnh (xem `engine/src/theme.ts`), không tự thêm màu rực.
- Nhân vật người: hướng PHẢI, đang đi, base body chung (xem `uniform-showcase.md`).
