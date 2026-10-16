# Style block: comic-cel-painterly

Dán nguyên văn vào cuối mọi prompt tạo ảnh của dự án (nhân vật, vũ khí, phương tiện).

```
2D animated documentary style, clean dark ink outlines of even thickness, flat cel shading with two tones
(light and shadow), subtle warm rim light, muted earthy palette, hand-drawn animation look,
no photorealism, no 3D render, no text except where specified
```

Nền (không phải nhân vật): painterly, **không nét viền**, mềm, mờ dần theo độ sâu. Dùng block riêng:

```
soft painterly background, no outlines, atmospheric perspective, hazy, low contrast, muted palette
```

## Bất biến của style
- Nhân vật/vũ khí/phương tiện có nét viền đen; nền thì không. Sự tương phản này tạo cảm giác điện ảnh.
- Vũ khí và phương tiện phải đúng lịch sử, ưu tiên chính xác hơn đẹp.
- Màu theo grade của cảnh (xem `engine/src/theme.ts`), không tự thêm màu rực.
