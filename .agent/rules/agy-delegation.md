# Quy tắc giao việc cho agy (CLI Antigravity)

Người dùng đã duyệt (2026-10-17). Mục đích: tiết kiệm token của Claude; Claude giữ phần suy luận.

## Khóa kênh media — cập nhật 2026-10-21
- **CẤM dùng agy để tạo hoặc chỉnh sửa ảnh/video.** Khi agent cần tạo ảnh hoặc video, chỉ dùng G-Labs theo `glabs-delegation.md`.
- agy chỉ được giao việc văn bản: đọc/tóm tắt khối lượng lớn hoặc soạn bản nháp. Ảnh agy đã tạo trước quyết định này là artifact cũ; không được lấy làm tiền lệ cho lần gọi mới.

- Gọi agy bằng Bash: `agy -p "<prompt tự đủ ngữ cảnh>"` (thêm `--output-format json` khi cần parse). agy không thấy ngữ cảnh của Claude.
- **Giao cho agy:** đọc/tóm tắt khối lượng lớn, soạn bản nháp. Không giao tạo/chỉnh ảnh hoặc video.
- **Claude giữ:** viết/duyệt prompt (dán nguyên văn block style theo `style-lock.md`), chấm `style-guard`, thiết kế schema/manifest, kiểm chứng sự kiện.
- Ảnh agy cũ còn trong `inbox/` không được ingest cho dự án mới nếu người dùng chưa duyệt ngoại lệ bằng văn bản.
- Vẫn áp `workflow-gates.md`: pilot trước loạt, >3 asset phải có checklist `style-guard`, báo cáo trung thực (chỉ nói đã tạo khi file tồn tại, nêu đường dẫn).
- Trước mỗi đợt giao việc: nêu lệnh định chạy và ước lượng số lần gọi, chờ người dùng xác nhận.
- Không dùng `image-generator` của agy và không dùng `--dangerously-skip-permissions` cho media. Nếu G-Labs lỗi/quota, dừng và báo người dùng; không chuyển vòng sang agy.
