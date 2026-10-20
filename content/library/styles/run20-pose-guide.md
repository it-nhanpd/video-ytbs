> **ĐÃ THAY THẾ (2026-10-17):** hướng flipbook 14 pose bị bỏ; chuyển động nay lấy từ số đo thật (`run20-spec.md` §9, `tools/run20-track/README.md`). Bảng dưới là phân tích mô tả ban đầu, giữ để tham khảo.

# Hướng dẫn pose chạy (run20) — proportion guide + 14 pose của một chu kỳ

Nguồn: khung gốc 120–151 (toàn cảnh, 30 fps) trong `_refs/run20/frames`; ảnh ghép `_refs/run20/poses/sheet_0.png`, `sheet_1.png`. Pose i = khung `120 + round(i × 33,5/14)`: 120, 122, 125, 127, 130, 132, 134, 137, 139, 142, 144, 146, 149, 151.
Nhãn: **[THẤY]** nhìn trên ảnh ghép (mỗi pose ~285 px rộng), **chưa đo bằng script**.

## Tỉ lệ cơ thể (đọc từ khung gốc, ước lượng ±10%)
- Mũ+đầu : thân (cổ áo → gấu áo) ≈ 1 : 2; chân (gấu áo → mắt cá) ≈ 1,2 × thân. **Chân gốc dày và không dài**; ống quần là MỘT khối liền, uốn cong ở gối (không có đầu mảnh, không lộ khớp).
- Bản rig cũ của ta: đầu 199 : thân 481 : chân ~733 (chân ≈ 1,5 × thân, mảnh) → chân dài và mảnh hơn gốc ~25%.

## Dáng chung [THẤY]
- Thân chúi trước khoảng 15–20°, gần như cứng, đầu thò ra trước, mặt quay phải, mũ ổn định.
- Súng nằm ngang ở hông, **đứng yên so với thân** ở mọi pha; nòng chĩa phải, báng dây gập chĩa trái; chỉ MỘT tay (tay gần) cầm, bàn tay nằm trước súng.
- Tay tự do: vung ra trước–xuống rồi về sau, khuỷu gập nhẹ, bàn tay mở.
- Chân: chạy thật có pha bay; chân sau hất gót cao (cẳng chân gần nằm ngang phía sau ở pose 3–5); chân trước gập gối dưới thân rồi duỗi chống; thân nhấp nhô nhẹ.
- **Hai chân lặp lại hình dạng sau mỗi 7 pose (nửa chu kỳ)**; chỉ pha tay tự do (và chi tiết nhỏ) khác nhau giữa hai nửa.

## 14 pose (mô tả thô, cần xác nhận khi xem full-res)
| # | Khung | Chân (trước/sau) | Ghi chú |
|---|---|---|---|
| 0 | 120 | chân sau duỗi xa phía sau, mũi giày gần đất (đẩy); chân trước gập gối dưới thân | tay tự do thấp phía sau |
| 1 | 122 | chân sau bắt đầu nhấc gót | |
| 2 | 125 | chân sau cao hơn, gối gập | |
| 3 | 127 | gót sau hất cao, cẳng chân gần nằm ngang | pha bay |
| 4 | 130 | chân sau còn cao, bắt đầu kéo gối ra trước | |
| 5 | 132 | chân trước duỗi chống, chân sau kéo về | |
| 6 | 134 | chân sau vung ra trước | |
| 7–13 | 137–151 | lặp lại hình dạng chân của 0–6 với chân kia | tay tự do ở pha đối diện |

## Quy tắc giải phẫu cho mọi pose được tạo (từ review ngoài, bắt buộc)
Đầu cùng cỡ ở mọi pose; vai–khuỷu–bàn tay nối đúng; **gối chỉ gập về một chiều (gót hướng ra sau mông)**; bàn chân đúng hướng, cùng cỡ; mũ gắn vào đầu; súng–tay–thân giữ quan hệ cố định; không chân cao su, không tách háng bất thường, không cụt đầu/chân, không pose như ngã hay khập khiễng; nhìn như chạy chủ đích.
