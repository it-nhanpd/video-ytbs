# style-guard — ảnh s001 (2026-10-17)

Chuẩn: `history-cel-docu.md` + block `comic-cel-painterly.md` (nền không viền, painterly; đạo cụ viền mực, cel 2 tông), `project.md` (không người thật, không bạo lực).

| Ảnh | Lần | Kết quả | Lý do |
|---|---|---|---|
| ml_hamlet_dawn.jpg | 1 | **KHÔNG ĐẠT** | Ra ảnh gần như chụp thật (photoreal), lệch style vẽ. Bố cục/nội dung đúng (không người). |
| ml_hamlet_dawn_v2.jpg | 2 | ĐẠT | Painterly, không viền, bảng màu xám-ô liu trầm, tiền cảnh cỏ tối mờ, lối đất giữa khung, không người/vật. |
| ml_helicopter_side.jpg | 1 | **KHÔNG ĐẠT** | Style đúng nhưng sai loại máy bay: đuôi giàn hở kiểu Bell 47/OH-13; Peers ghi Thompson lái OH-23. Có người lái không yêu cầu. |
| ml_helicopter_side_v2.jpg | 2 | ĐẠT | Đuôi ống kín, kính bong bóng, động cơ hở sau cabin (gần OH-23; *ước lượng nhận dạng, không phải bản vẽ kỹ thuật*), hướng trái 90°, không phù hiệu/số, người lái là bóng tối không mặt. Tách nền bằng `tools/cutout.mjs --min-hole 150`: hết mảng xám, kính thành trong suốt. |

File dùng: `assets/ai/ml_hamlet_dawn.jpg` (từ v2), `assets/ai/ml_helicopter_side.png` (từ v2, đã tách nền).
