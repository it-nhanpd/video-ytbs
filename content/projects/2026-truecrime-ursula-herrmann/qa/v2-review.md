# Bản v2 "hồ sơ vụ án" đầy đủ (2026-10-18): tự chấm

`vox-v2.json` + `locales/vi-v2.json`, composition `2026-truecrime-ursula-herrmann-v2-full`. **167 shot, 38.254 frame = 21:15** (bản 19:22 giữ nguyên). Kịch bản `script/vi-v2.md`, mô tả `script/description-v2.md`.

## Tỉ lệ hình theo vai trò nhịp (167 shot)
Theo thẻ "vai trò" trong `script/vi-v2.md`: kể (cảnh dựng, 83), chứng cứ (62: tài liệu gốc trên bàn 31 shot, bảng chứng cứ 16, đồ họa dựng từ bản án 15), định vị (10: ảnh thật, bản đồ), thẻ chương/tưởng niệm/tài liệu (10), chữ thuần (2).
- Chữ thuần ≈ 1% (mục tiêu ≤ 10%).
- **Ảnh thật có giấy phép chỉ ≈ 6% (mục tiêu ~25%):** Commons chỉ có 14 ảnh dùng được và không có ảnh hiện trường. Phần thiếu được bù bằng cảnh dựng (AI) chứ không bằng chữ.
- Bảng chứng cứ và đồ họa (sơ đồ hộp, dạng sóng, thang giám định) không phải tài liệu gốc; chúng ghi rõ "phỏng dựng" hoặc "minh họa" trên màn hình.

## Chấm still: 167/167 shot đã xem (pilot 28 + lô 139), sau đó sửa và xem lại
| Lỗi | Shot | Sửa |
|---|---|---|
| Thẻ bảng chứng cứ bị cắt mép trên/trái khi camera tiến về thẻ focus | E201–E501, C607–C610, C809–C811, J801 | Bảng zoom quanh thẻ focus (không dịch cả bảng), zoom ≤ 1,05–1,1; nền cork phóng 1,14 để cắt khung đen; dời vị trí thẻ |
| Chip tiêu đề đè hộp dịch của tài liệu | C207, C212, C214, C312, C414, C505, C614–C619 | Hộp dịch căn phải khi có chip |
| Chip số rỗng (stamp cũ dùng `count`) | C305, C404 | đọc `count` |
| Chip dài tràn khung | nhiều shot | chip tự xuống dòng (maxWidth 50%) |
| Viền giấy trắng của ảnh AI lộ mép | ảnh AI | phóng sẵn nền 1,2 (hoặc `over`) |
| J801 cột thẻ đè phụ đề | J801 | dời thẻ, bỏ xuống y ≤ 0,8 |
| C419 lặp ảnh phòng DNA liên tục | C419 | đổi ảnh kho hồ sơ |

CÒN LẠI (chấp nhận): J801 các thẻ xếp khít nhau; vài shot nhiều chip nhỏ khó đọc nếu xem trên điện thoại; lặp ảnh (phòng DNA, hành lang tòa, kho hồ sơ) xen nhau trong cùng chương; C115 vệt viền mảnh (đã nêu ở pilot).

## Chưa kiểm
- Chuyển động (chỉ xem still); hạt, sương, đèn pin, vết xước phim chạy thế nào.
- **Âm thanh:** nhạc mood (investigate, tension, grief), SFX, mức hạ nhạc khi có lời (`duck` 0,55), chỗ chuyển cue và khoảng lặng ở P115, C621. Chưa nghe.
- Giọng đọc 139 câu mới; phát âm tên Đức.
- Thời lượng 21:15 dài hơn ~20 phút mục tiêu (do bảng chứng cứ cuối chương, "Bạn là thẩm phán"); có thể cắt bớt nếu muốn.

## Tài nguyên
G-Labs: tổng 32 lần trong dự án (10 + 8 + 14), 1 bị từ chối chính sách ở lần đầu (ai_archive, không thử lại; lô v2 dùng ai_archive2 với mô tả khác, thành công). Mọi ảnh AI không có trẻ em.
