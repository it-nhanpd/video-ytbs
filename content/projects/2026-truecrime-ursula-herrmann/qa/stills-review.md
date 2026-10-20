# Tự chấm still (2026-10-18)

Still nửa độ phân giải (960×540) render bằng `scratchpad/ursula/stills.mjs`, xem trực tiếp theo lưới 3×3. Tổng 34.874 frame = **19:22**.

## Vòng 1: 163/163 shot (tại 80% thời lượng shot)
KHÔNG ĐẠT (đã sửa):
| Shot | Lỗi | Sửa |
|---|---|---|
| H09 | Tiêu đề 4 chữ xuống dòng, che dòng phụ | Tiêu đề "CHIẾC HỘP", phần còn lại vào dòng phụ |
| H10 | Dấu "310 TRANG" đè lên trang bìa bản án (docscan với ảnh ngang) | Đổi sang `docpage` |
| C102, C215, C502 | Bản đồ trống, không thấy ranh bang; Kappeln ngoài khung; nhãn chạm nhau | `provinces`, tô DEU, zoom 0.55 cho toàn nước Đức, dời nhãn |
| C106, C111, C117 | Điểm "rừng Weingarten" lệch chữ trên bản đồ 1899; lối Seeweg thẳng | Đo lại trên still full: Seeweg men bờ hồ; điểm bắt cóc ngang khu Weingarten; hộp ~800 m tây bắc theo tỉ lệ Eching–Schondorf ≈ 3,75 km |
| C202–C204 | 11 cuộc gọi hiện cùng lúc | `calls.upto`: 1 → 7 → 11 theo lời dẫn |
| C205, C509 | Ghi chú dạng sóng tràn mép phải | Dời vào trong khung |
| C207, C220, C304, C515, C619… | `docpage wide` với trích cao: tiêu đề đè lên chữ scan | Ảnh wide cao ≤ 0,4H, phóng theo `aspect` (builder đọc từ PNG) |
| C210–C216 (thư) | Ngắt dòng giữa từ ("entfü/hrt") | Gom chữ cắt theo từ |
| C307–C313 (hộp) | Nhãn "72 cm" dưới phụ đề; nhãn nắp/chốt chồng nhau | Thu sơ đồ (0,48H), giãn nhãn |
| C316 | Dòng thời gian 2 tháng, nhãn đè nhau | Đổi thành danh sách mốc |
| C404 | Dấu X đỏ trên vân tay gây hiểu "không có vân tay" (lời dẫn: có đúng 1) | Đổi thành số "1" + chú thích |
| C406–C416 | Mốc 1981/1982 dồn mép trái, nhãn đè | Gộp mốc, thang 1980–2012, so le trên/dưới |
| C505 | Trích đoạn sai (nói về ống nhòm, không phải chợ trời) | Cắt thêm `court/j_flohmarkt.png` (tr. 13) |
| C617 | Khung đánh dấu vùng trống | Khung quanh "wird freigesprochen" |
| H05, C503, C603, C620 | Ảnh che dòng phụ của con dấu | Thu ảnh sang trái |
| C112, C709 | Chữ đen trên nền ảnh tối, khó đọc | Con dấu đỏ có nền |
| C712 | Số quá to | `size: 200` |
| C813 | Ảnh tràn xuống dải phụ đề | Thu nhỏ |

## Vòng 2–3: 72 still của các shot đã sửa: đạt hết.

Chưa kiểm: chuyển động giữa các frame (chỉ xem still); nghe giọng đọc tên Đức.
