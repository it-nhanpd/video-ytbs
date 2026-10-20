# Style: truecrime-collage (Vox-style cho true crime)

Tạo 2026-10-17 cho `2026-truecrime-unabomber` (người dùng ủy quyền tự quyết, ghi trong `project.md` của dự án). Khác hẳn `uniform-showcase`/`comic-cel`: không nhân vật vẽ, không rig.

## Nguyên tắc
- **Tư liệu thật là chính.** Ảnh PD (FBI, US Marshals, văn bản tòa án) cắt kiểu giấy: viền trắng xé, bóng đổ mềm, xoay nhẹ ±4°, tùy chọn halftone. Mỗi ảnh tư liệu có nhãn nguồn nhỏ (font mono).
- **Ảnh AI chỉ làm nền/không khí**, không bao giờ là người thật. Người = bóng (silhouette) không mặt.
- **Đồ họa vẽ bằng code:** bản đồ, số liệu chạy, chữ đóng dấu, khung trích văn bản tòa án, vòng tròn/gạch chân bút dạ đỏ.
- **Nền:** giấy ngà có hạt + vignette. Không nền trắng tinh, không gradient số.
- **Chuyển động:** camera đẩy chậm (zoom 1 → ~1,05 mỗi shot); vật vào bằng "rơi + nảy nhẹ" (spring); "boil" giấy 2px ở 12fps cho cảm giác stop-motion. Không chuyển cảnh lòe loẹt; cắt thẳng hoặc trượt giấy.

## Màu (định nghĩa ở `engine/src/vox/palette.ts`)
- Giấy `#ece4d3`, giấy tối `#1c1a17`, mực `#1b1b1b`, đỏ dạ `#d7372b`, vàng hồ sơ `#e8b33c`, xanh mực `#2c4a6b`.

## Chữ (tất cả có subset tiếng Việt)
- Tiêu đề / số lớn: **Anton**. Thân: **Be Vietnam Pro**. Nhãn / tem / máy chữ: **Roboto Mono**. Trích văn bản / tuyên ngôn: **Playfair Display**.

## Cấm
- Ảnh AI có khuôn mặt người, logo/masthead thật của báo, chữ trong ảnh AI.
- Ảnh gia đình nạn nhân, ảnh hiện trường có người bị thương, mô tả cách chế tạo bom.
- Số điện thoại thật trên áp phích (crop bỏ).

## Block style dán vào mọi prompt ảnh AI
```
Flat paper-collage illustration for a documentary explainer: layered cut paper with slightly torn white edges, subtle halftone print texture, muted off-white and warm grey paper tones with deep black shapes and a few small accents of muted red, soft drop shadows between paper layers, calm and serious mood. No text, no letters, no numbers, no logos, no human faces (people only as plain dark silhouettes without facial features). 16:9 composition with empty space in the center for overlays.
```
