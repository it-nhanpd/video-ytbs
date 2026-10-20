# ĐỀ XUẤT style bible: empire-map (CHƯA DUYỆT, chưa dùng để tạo ảnh)

Theo `.claude/rules/style-lock.md`: style mới phải là đề xuất bằng văn bản và chờ người dùng duyệt. Chưa có chữ "đã duyệt" thì **không tạo ảnh nào**. Khi duyệt, tôi mới chuyển file này thành `content/library/styles/empire-map.md` (KHÓA).

Nguồn tham chiếu: phân tích video "Toàn bộ lịch sử thế giới trong 8 phút" (Vui Vẻ) và thumbnail cùng kênh. Chỉ mượn **cấu trúc/cách dựng**, không sao chép nhân vật hay câu chữ.
**Ảnh tham chiếu style: không dùng** (người dùng chọn). Prompt mascot tự đủ mô tả; `styles/refs/` không áp cho style này.
**Mascot:** người dùng chọn tạo bằng G-Labs; thẻ `content/library/characters/mascot-explorer/character.md`. Code (layer `map`) làm linh động để tiết kiệm token, ưu tiên phần đơn giản trước.

## 1. Khung hình và bố cục
- 1920×1080, 24fps, **16:9 không letterbox** (khác uniform-showcase 2.35:1: bản đồ cần nhiều chiều cao).
- Bản đồ chiếm toàn khung làm nền; camera pan/zoom vào khu vực đế chế.
- Chữ do code vẽ (không nằm trong ảnh): tên đế chế + nhãn năm (góc trên trái), số liệu km² (góc dưới trái, dạng "X–Y triệu km²" khi hai họ nguồn lệch >10%).

## 2. Bản đồ (vẽ bằng code, không tạo ảnh AI)
- Nền: bản đồ phẳng đơn sắc (đại dương xanh nhạt, đất be/xám), nét viền mảnh, không địa hình painterly.
- Lãnh thổ đế chế: đa giác tô một màu duy nhất mỗi đế chế (có bảng màu, ngoài grade không dùng màu rực khác), mở rộng giữa các mốc bằng nội suy.
- Dữ liệu: Cliopatria (CC BY 4.0, ghi công trong mô tả/cuối video, nêu rõ có giản lược); nền hiện đại Natural Earth (public domain).
- Số hiển thị trên màn hình phải là số Cliopatria hoặc khoảng hai họ nguồn (không trộn).

## 3. Ảnh tư liệu ghim
- Chỉ ảnh **public domain / CC** có ghi nguồn trong `qa/` (tên, tác giả, giấy phép, URL). Không dùng ảnh chưa rõ bản quyền.
- Dạng ô vuông/chữ nhật nhỏ (rộng ~12–18% khung) đặt tại vị trí địa lý liên quan, khung trắng mảnh, bóng nhẹ.
- Mỗi cảnh 2–3 ảnh, tối đa 4.

## 4. Mascot
- Nhân vật cartoon nhỏ: **nét viền đen đều, màu phẳng 2 tông, mặt đơn giản** (hai mắt tròn, chấm hoặc nét miệng), thân trang phục đơn giản, **thiết kế gốc của dự án, không giống mascot Vui Vẻ** (không tóc hồng, không túi chéo vàng).
- Xuất hiện cỡ nhỏ (≤ 18% chiều cao khung) ở góc hoặc ghim trên bản đồ; có 3–4 biểu cảm (nói, ngạc nhiên, suy nghĩ, chỉ tay).
- Hướng nhìn tự do (không có phù hiệu bất đối xứng), được phép `flipX`.
- Ảnh mascot qua G-Labs `nano_banana_2_lite`; mỗi biểu cảm một ảnh; số ảnh nêu ở cổng G2.

## 5. Danh sách cấm (gặp một mục là KHÔNG ĐẠT)
1. Ảnh tư liệu chưa rõ giấy phép.
2. Bản đồ hiển thị diện tích khác số trong `research/03-facts.md` đã duyệt.
3. Ranh giới hiện đại bị giả làm biên giới lịch sử mà không ghi "minh họa".
4. Mascot giống nhân vật có bản quyền khác (kể cả Vui Vẻ).
5. Chữ trong ảnh AI; màu rực ngoài bảng màu.
6. Hình ảnh bạo lực, máu, thương vong, biếm họa một dân tộc; biểu tượng cấm.
7. Nói chắc số liệu "Tranh cãi" (F08, F09, F11…) mà không nêu khoảng/tranh cãi.

## 6. Câu hỏi cho người dùng
1. Đồng ý style trên (bản đồ code + ảnh ghim public domain + mascot gốc nhỏ)?
2. Mascot: tôi viết thẻ nhân vật gốc (mô tả + prompt) để bạn duyệt trước khi tạo ảnh, hay bạn có sẵn mascot?
3. Giữ 16:9 không letterbox cho video này?

## ĐỀ XUẤT BỔ SUNG cho `empire-map.md` (2026-10-17, chờ người dùng duyệt; chưa sửa file khóa)
Rút ra từ nhận xét của người dùng khi xem pilot s009 và từ phân tích kênh Ghiền Địa Lý.
1. **Mục 2 (Bản đồ):** thêm "Camera luôn thấy trọn đế chế ở mọi beat: zoom trong 0,98–1,1, không zoom cận vào sự kiện. Chỉ vị trí bằng vòng tròn nhấp nháy (`marks`). Ảnh ghim đặt ngoài phần đất đế chế (biển hoặc đất láng giềng), không che polygon."
2. **Mục 5 (Cấm):** thêm "Zoom cận làm không thấy hết đế chế" và "Ảnh ghim che phần tô của đế chế".
3. **Khung cảnh cố định (~55 giây, 7 beat):** hook (số hoặc sự kiện có nguồn) → hạng + khoảng diện tích → mốc đầu + sự kiện 1 → mốc giữa → mốc đỉnh + sự kiện 2 → chi tiết bất ngờ hoặc so sánh diện tích → câu dẫn sang hạng kế. Dữ liệu mỗi đế chế một file `empires/<id>.json`, cảnh sinh bằng `tools/gen-empire-scene.mjs`.

4. **Nhãn địa danh (2026-10-17, từ phản hồi của người dùng: "xem xong không biết đế chế nằm ở đâu trên bản đồ"):** mỗi cảnh luôn có nhãn lục địa/đại dương (`empires/_labels.json`, mờ, chữ hoa) và nhãn nước/thành phố hiện đại thuộc phạm vi đế chế (`labels` trong file đế chế, chữ đậm), cộng nhãn địa danh theo beat. Layer `map` có trường `labels`. Chưa có quả địa cầu phụ (đề xuất nếu cần).
