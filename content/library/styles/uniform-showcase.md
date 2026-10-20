# Style bible: uniform-showcase (KHÓA, không tự ý đổi)

Áp dụng cho mọi dự án "quân phục/nhân vật đi qua các thời kỳ". Nguồn: phân tích video tham chiếu (research/01-reference-analysis.md §10) + quyết định đã duyệt. Chỉ mượn **style**, không copy nhân vật/câu chữ.
Muốn đổi điều khoản nào: đề xuất bằng văn bản và chờ người dùng duyệt; nhân viên không tự sửa file này.

## 1. Khung hình và bố cục
- Khung 2.35:1 (letterbox), 24fps. Chú thích **góc dưới trái**, 2 dòng: tên loại lính, năm. Chữ do code vẽ, không nằm trong ảnh.
- Nhân vật cao **55–65% chiều cao vùng hiển thị**, đặt ở 1/3 trái đến giữa khung, chừa khoảng trống phía trước (bên phải) cho hướng đi.
- Mỗi cảnh một bảng màu theo bối cảnh (grade trong `engine/src/theme.ts`), không thêm màu rực ngoài grade.

## 2. Nhân vật
- **Nhìn ngang đúng 90°, hướng PHẢI**, đang **đi** (không đứng nghiêm như tượng). Tạo ảnh hướng phải ngay từ prompt; **không dùng `flipX`** (làm gương phù hiệu bất đối xứng là sai lịch sử). Ngoại lệ có chủ đích (cảnh đối diện) phải tạo bộ ảnh hướng trái riêng.
- Nét viền đen đều, cel 2 tông, tỉ lệ hoạt hình tài liệu. Một **base body chung** (nam trưởng thành, cùng chiều cao, đầu:thân ≈ 1:7.5, cùng khuôn mặt); mỗi quân phục chỉ là biến thể trên base body.
- **Vũ khí**: không có ở cảnh quân phục thường; được phép ở giai đoạn chiến tranh khi shotlist ghi (vd. WWI, Wehrmacht, NVA). Vũ khí là **bộ phận riêng** (`weapon`) trong bảng bộ phận, gắn vào bàn tay trong code; mô tả trung tính, chi tiết vừa đủ nhận diện, không máu, không thương vong, không cảnh bắn trúng người.
- **Chuyển động = rig tách bộ phận** (từ 2026-10-17, thay sprite sheet 12 tư thế): mỗi nhân vật MỘT ảnh "bảng bộ phận" (đầu, thân, tay trên, cẳng tay+bàn tay, đùi, cẳng chân, bàn chân, tùy chọn vũ khí; chi xa dùng lại ảnh chi gần, tối hơn trong code). Chu kỳ đi sinh bằng code (`engine/src/walkCycle.ts`) 24fps, mọi nhân vật dùng chung; chân luôn chạm đất; nhân vật đi tại chỗ, nền trôi trái. Không lật gương (`flipX`); cử động đặc biệt khác (quay đầu, chào): ảnh riêng + image-to-video bên ngoài.
- Khung ảnh nhân vật theo **tỉ lệ người (dọc/vuông)**, không ép 5:2. Quy tắc 5:2 chỉ dành cho phương tiện/vật thể dài.

## 3. Nền (cập nhật 2026-10-17 theo `layer-recipe.md`, người dùng duyệt: nền phẳng CÓ viền như video tham chiếu)
- Nền là **tô phẳng nhiều tông + nét viền đen** (đồi, đường ruộng, bụi, cây) và **nét gạch ngắn làm cỏ**; lớp xa nhạt và mờ, lớp gần viền đậm hơn. Không gradient bóng bẩy. Nền phải nhạt/bão hòa thấp hơn quân phục để nhân vật nổi.
- Mỗi cảnh dựng bằng **nhiều lớp** (công thức đầy đủ ở `layer-recipe.md` §1): trời + đồi xa, đồi giữa, mặt đất + vật nhỏ, nhân vật, **cỏ/bụi tiền cảnh che chân**, **tán cây to mờ để quét ở đầu cảnh**. Cảnh chỉ có nền một ảnh + nhân vật là KHÔNG ĐẠT.
- Mỗi bối cảnh có **bộ prompt nền riêng** (mỗi lớp một ảnh, xem `prompt-pack` mục C), không để nền chỉ là silhouette sinh bằng code.
- **Cảnh chiến tranh**: cùng kiểu nền phẳng có viền (trời khói, đường chân trời cháy, hố đạn); khói/lửa/chớp nòng/nổ xa thêm bằng code, không vẽ vào ảnh nhân vật; không máu, không xác.
- Các nền painterly không viền tạo trước ngày này là **thế hệ cũ**, tạo lại dần theo từng cảnh (không làm hàng loạt trước khi pilot được duyệt).

## 4. Danh sách cấm (gặp một mục là KHÔNG ĐẠT)
1. Nhân vật đứng nghiêm, thẳng, tay buông như tượng.
2. Nhìn chéo 3/4 hoặc hướng trái khi chưa có lý do ghi trong shotlist.
3. Nhân vật nhỏ xíu giữa khung rộng (chiếm < 40% chiều cao hiển thị) hoặc ảnh dọc ép vào khung 5:2.
4. Nền xám/viền xám còn sót; viền răng cưa; lỗ thủng trong nhân vật.
5. Bóng đổ, mặt đất, vật thừa trong ảnh nhân vật.
6. Khuôn mặt/tỉ lệ khác base body; hai nhân vật cùng cảnh khác chiều cao không có lý do.
7. Phong cách khác: 3D, ảnh thật, anime, tranh sơn dầu có nét viền nhân vật khác độ dày.
8. Màu rực/bão hòa ngoài grade của cảnh.
9. Vũ khí chi tiết quá mức hoặc cảnh bạo lực/máu; biểu tượng cấm (ghi chú pháp lý §86a StGB: không vẽ chữ thập ngoặc chi tiết).
10. Chữ trong ảnh (trừ khi shotlist yêu cầu).

## 5. Ảnh tham chiếu style
Đặt trong `content/library/styles/refs/` (6 frame video tham chiếu, do người dùng cung cấp). Chỉ đính kèm làm tham chiếu **style** (nét, màu, bố cục), ghi rõ "không copy nhân vật/địa điểm". Nếu thư mục trống, **dừng và hỏi người dùng**, không tự đoán style.
