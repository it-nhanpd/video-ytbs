# Quy tắc cổng làm việc (BẮT BUỘC)

1. **Không thực hiện khi chưa duyệt.** Khi nhận yêu cầu mới: phân tích, nêu phương án/đặc tả, chờ người dùng xác nhận rồi mới sửa file hoặc chạy lệnh.
2. **Pilot trước loạt.** Mỗi dự án: tạo 1 nhân vật + 1 nền + dựng 1 cảnh render thử, người dùng duyệt style, rồi mới làm các asset còn lại. Chưa có chữ "pilot đã duyệt" trong `project.md` thì không làm hàng loạt.
3. **Kết luận phân tích tham chiếu phải thành luật.** Xong Bước 1, mọi điều rút ra (hướng nhìn, tỉ lệ, chuyển động, nền, chú thích) phải nằm trong style bible trước khi sang Bước 3.
4. **Báo cáo trung thực.** Chỉ nói "đã xuất/đã kiểm" khi file/log tồn tại; nêu đường dẫn. Không có thì nói chưa làm.
5. **Quyết định ngược với nguyên tắc dự án** (vd. bỏ image-to-video, bỏ chuyển động) phải được người dùng duyệt bằng văn bản, ghi vào `project.md`; không tự đơn giản hóa.
6. Việc hàng loạt (>3 asset) phải kèm checklist `style-guard` cho từng asset.
7. **Làm từng cảnh, mỗi cảnh một vòng có cổng duyệt.** Cảnh sNNN: thẻ cảnh theo skill `script-craft` (G1: người dùng duyệt) → liệt kê asset + số ảnh (G2: xác nhận) → tạo ảnh/ingest/dựng → still + clip (G3: người dùng nhận xét) → sửa → ghi "đã duyệt" vào progress và cập nhật `script/vi.md`. Không tạo ảnh hay dựng khi thẻ cảnh chưa duyệt; không làm hai cảnh song song.
   - **Ngoại lệ theo lô (người dùng duyệt 2026-10-17, áp cho dự án có "khung cảnh cố định" như `2026-largest-empires`):** sau khi pilot đã duyệt, được viết thẻ **3 cảnh liền nhau** để duyệt G1 một lần, rồi dựng cả 3 và gửi still + clip (G3) một lần. Điều kiện: dùng đúng khung cố định (không đổi cấu trúc cảnh), mọi khẳng định theo `source-policy.md`, asset mới vẫn phải qua G2 trước khi tạo. Lô sau chỉ bắt đầu khi lô trước đã nhận xét xong. Dự án khác vẫn làm từng cảnh.
