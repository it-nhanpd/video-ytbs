# Batch prompt cho G-labs (mỗi prompt một dòng, cách nhau một dòng trắng)

Tên ảnh lưu + ảnh cần đính kèm cho từng prompt: `index-12pose.csv` (thứ tự prompt = số dòng trong cột "dòng"). `index.csv` là bản cũ 4 tư thế: bỏ.

## Chu kỳ đi mượt cao: 12 tư thế = 3 sheet × 4 (12fps)
Mỗi nhân vật có sheet A, B, C. Pha: A1 chạm-phải, A2 nảy, A3 thấp, A4 chuyển, B1 cao, B2 vươn, B3 chạm-trái, B4 nảy, C1 thấp, C2 chuyển, C3 cao, C4 vươn (nối lại A1).

## Thứ tự
1. `1-pilot.txt` (5 prompt): pose 1871 (đã duyệt, giữ nguyên) → sheet A → sheet B → sheet C → nền s002 (đã duyệt). Chỉ cần tạo lại **3 sheet**; sheet B, C đính kèm ảnh pose + sheet A.
2. `2-characters-pose.txt` (14): đính kèm **ảnh pose 1871 đã duyệt**; prompt 1 trùng pilot, bỏ qua.
3. `3-sheets-walk.txt` (42 = 14 nhân vật × 3): đính kèm ảnh pose của chính nhân vật; sheet B, C đính kèm thêm sheet A của nhân vật đó. Prompt 1–3 trùng pilot.
4. `4-backgrounds.txt` (13): prompt 2 trùng pilot.

## Quy ước
- Hướng PHẢI, không `flipX`. Ngoại lệ: NVA 1956 hướng TRÁI.
- Tên file lưu = cột "lưu ảnh với tên" (không cần đuôi). Pose là anchor; sheet và nền đi vào `ingest`.
- 10 frame trong `library/styles/refs/` chỉ tham chiếu **style**.
- Ưu tiên khi công cụ giới hạn số ảnh đính kèm: ảnh pose > sheet A > 1 ảnh style > ảnh tư liệu.
- Mỗi sheet phải có 4 tư thế **khác nhau rõ**; ảnh có hai tư thế gần như trùng thì tạo lại.
