---
name: style-guard
description: Chấm đạt/không đạt từng ảnh nhân vật, nền hoặc still render theo style bible (uniform-showcase) trước khi ingest hoặc duyệt. Dùng khi ảnh vừa về inbox/, khi có still render, hoặc khi người dùng nghi ngờ lệch style.
---

# style-guard

Mục tiêu: chặn ảnh sai style **trước khi** vào `assets/`. Đọc `content/library/styles/uniform-showcase.md` rồi chấm từng ảnh bằng cách mở ảnh (Read) và đo, không đoán.

## Quy trình
1. Liệt kê ảnh cần chấm (inbox/ hoặc still render).
2. Mở từng ảnh, điền bảng chấm bên dưới. Có số đo thì ghi số (px, %).
3. Ghi kết quả vào `content/projects/<p>/qa/style-<assetId>.md`. Một mục KHÔNG ĐẠT = cả ảnh KHÔNG ĐẠT.
4. Báo cáo: danh sách đạt/không đạt kèm lý do ngắn và lệnh sửa prompt. Không `ingest` ảnh không đạt.
5. Lần đầu của dự án (pilot): chấm xong, **dừng chờ người dùng duyệt** trước khi làm loạt.

## Bảng chấm (mỗi dòng: ĐẠT / KHÔNG ĐẠT + ghi chú)
| # | Tiêu chí | Ngưỡng |
|---|---|---|
| 1 | Hướng | Nhìn ngang 90°, mặt hướng PHẢI (hoặc hướng trái nếu shotlist ghi lý do) |
| 2 | Tư thế | Đang đi (một chân bước, tay đánh); không đứng nghiêm như tượng |
| 3 | Tỉ lệ khung | Khung ảnh theo tỉ lệ người; chủ thể chiếm ≥ 70% chiều cao ảnh; không ép 5:2 |
| 4 | Cỡ trong cảnh | Sau khi dựng: cao 55–65% vùng hiển thị (< 40% là KHÔNG ĐẠT) |
| 5 | Nét viền | Đen, đều, kín; không đứt, không dày mỏng thất thường |
| 6 | Tô màu | Cel 2 tông; không gradient bóng bẩy, không ảnh thật/3D/anime |
| 7 | Base body | Cùng chiều cao đầu, tỉ lệ thân, khuôn mặt với ảnh anchor |
| 8 | Nền/tách nền | Sạch: không viền xám, không lỗ thủng, không bóng đổ, không mặt đất |
| 9 | Màu | Trong grade của cảnh, không màu rực ngoài grade |
| 10 | Đúng thẻ | Đủ mọi mục "Bất biến" của thẻ library; không dính "Lỗi AI hay gặp" |
| 11 | Phù hiệu | Bất đối xứng đặt đúng bên theo hiện vật; không lật gương; không chữ thập ngoặc chi tiết |
| 12 | Danh sách cấm | Không vi phạm mục nào trong §4 của style bible |

Nền theo lớp (environment layers) thay 1–3 bằng: không nhân vật, tô phẳng nhiều tông có viền đen, nét gạch cỏ, không gradient bóng bẩy; đúng vai trò lớp (_far/_mid/_fg/_sweep); lớp _fg/_sweep tách nền sạch, _fg lặp liền mép (không thấy đường nối khi ghép hai bản cạnh nhau); nền bão hòa thấp hơn quân phục. Sau khi dựng cảnh: đếm số lớp thấy được (≥ 6) và có lớp đi **trước** chân nhân vật; thiếu là KHÔNG ĐẠT.
Bảng bộ phận (rig) thay tiêu chí 1–3 bằng: đúng 7 mảnh (8 nếu có vũ khí) một hàng trái → phải đúng thứ tự; mỗi mảnh thẳng, không cong, bàn chân nằm ngang mũi hướng phải; cùng thang vẽ, nét, màu, chi tiết; khoảng trống ≥ 90 px, không chạm nhau/mép; không chữ, nhãn, đường kẻ đất; đầu khớp kéo dài đủ để chồng nhau. Sau ingest: render 4 pha của chu kỳ đi (still) phóng to kiểm khớp có hở không.

## Quy tắc
- Chưa mở ảnh thì không được chấm. Không chấm "đạt" khi không chắc: ghi "chưa chắc" và hỏi người dùng.
- Không nới ngưỡng để cho qua.
