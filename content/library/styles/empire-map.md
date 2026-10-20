# Style bible: empire-map (KHÓA, không tự ý đổi)

Áp dụng cho video giải thích lịch sử dạng bản đồ + ảnh tư liệu ghim + mascot nhỏ (dự án đầu tiên: `2026-largest-empires`). Nguồn: đề xuất `projects/2026-largest-empires/research/05-style-proposal.md`; người dùng duyệt mascot và chọn khóa style (2026-10-17). Chỉ mượn **cấu trúc/cách dựng** từ video tham chiếu, không copy nhân vật/câu chữ. **Không dùng ảnh tham chiếu style** (người dùng chọn); `styles/refs/` không áp cho style này.
Muốn đổi điều khoản: đề xuất bằng văn bản và chờ người dùng duyệt.

## 1. Khung hình
- 1920×1080, 24fps, 16:9 **không letterbox**.
- Bản đồ chiếm toàn khung làm nền; camera pan/zoom vào khu vực.
- Chữ do code vẽ (không nằm trong ảnh): tên đế chế + năm (góc trên trái); số liệu km² (góc dưới trái) dạng "X–Y triệu km²" khi hai họ nguồn lệch >10%.

## 2. Bản đồ (vẽ bằng code, không tạo ảnh AI)
- Nền phẳng đơn sắc (đại dương xanh nhạt, đất be/xám), nét viền mảnh.
- Lãnh thổ: đa giác một màu mỗi đế chế (bảng màu cố định, không màu rực ngoài bảng), mở rộng giữa các mốc bằng nội suy.
- Dữ liệu: Cliopatria (CC BY 4.0: ghi công ở mô tả/cuối video, nêu rõ có giản lược); nền hiện đại Natural Earth (public domain).
- Số trên màn hình phải là số đã duyệt trong `research/03-facts.md`; không trộn số hai họ nguồn.

## 3. Ảnh tư liệu ghim
- Chỉ ảnh **public domain / CC** có ghi nguồn trong `qa/` (tên, tác giả, giấy phép, URL).
- Ô nhỏ (rộng ~12–18% khung) đặt tại vị trí địa lý liên quan; khung trắng mảnh, bóng nhẹ. Mỗi cảnh 2–3 ảnh, tối đa 4.

## 4. Mascot
- Nhân vật gốc `mascot-explorer` (`content/library/characters/mascot-explorer/`): đầu tròn lớn, mũ nâu băng đỏ, khăn đỏ, áo olive nhạt, ba lô nâu; nét viền đen đều, màu phẳng 2 tông; chibi.
- Cỡ nhỏ (≤ 18% chiều cao khung), góc hoặc ghim trên bản đồ. 4 biểu cảm: neutral (vẫy), ngạc nhiên, suy nghĩ, chỉ tay (chỉ về phải).
- Không phù hiệu bất đối xứng nên được phép `flipX`.
- Tạo bằng G-Labs `nano_banana_2_lite`; nền xám #808080 để `keyOut`.

## 5. Danh sách cấm (gặp một mục là KHÔNG ĐẠT)
1. Ảnh tư liệu chưa rõ giấy phép.
2. Diện tích trên màn hình khác số trong `03-facts.md` đã duyệt; nói chắc số của mục "Tranh cãi" mà không nêu khoảng.
3. Ranh giới hiện đại giả làm biên giới lịch sử mà không ghi "minh họa".
4. Mascot giống nhân vật có bản quyền khác (kể cả Vui Vẻ); mascot khác 4 biểu cảm đã duyệt về mặt/tỉ lệ/trang phục.
5. Chữ trong ảnh AI; màu rực ngoài bảng màu; bóng đổ/mặt đất/vật thừa trong ảnh mascot.
6. Hình bạo lực, máu, thương vong, biếm họa một dân tộc; biểu tượng cấm.
7. Mascot chiếm >18% chiều cao khung khi bản đồ là trọng tâm.
