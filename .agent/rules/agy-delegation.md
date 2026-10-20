# Quy tắc giao việc cho agy (CLI Antigravity)

Người dùng đã duyệt (2026-10-17). Mục đích: tiết kiệm token của Claude; Claude giữ phần suy luận.

- Gọi agy bằng Bash: `agy -p "<prompt tự đủ ngữ cảnh>"` (thêm `--output-format json` khi cần parse). agy không thấy ngữ cảnh của Claude.
- **Giao cho agy:** tạo ảnh (nhân vật/nền/asset theo prompt từ `prompt-pack`), đọc/tóm tắt khối lượng lớn, soạn bản nháp.
- **Claude giữ:** viết/duyệt prompt (dán nguyên văn block style theo `style-lock.md`), chấm `style-guard`, thiết kế schema/manifest, kiểm chứng sự kiện.
- Ảnh agy tạo phải lưu vào `content/projects/<p>/inbox/`, rồi qua `style-guard` đạt mới `ingest`. Không đạt thì tạo lại (không "tạm chấp nhận").
- Vẫn áp `workflow-gates.md`: pilot trước loạt, >3 asset phải có checklist `style-guard`, báo cáo trung thực (chỉ nói đã tạo khi file tồn tại, nêu đường dẫn).
- Trước mỗi đợt giao việc: nêu lệnh định chạy và ước lượng số lần gọi, chờ người dùng xác nhận.
- **Đã kiểm chứng (2026-10-17):** agy tạo ảnh được qua subagent `image-generator` của nó (1 ảnh ~45-60s, ~20k token bên agy; ảnh thử: `apple.png`, đạt). Ở chế độ `-p`, agy cần quyền `command` để lưu file mà không hỏi được nên bị từ chối; người dùng đã duyệt dùng `--dangerously-skip-permissions`.
- Khi dùng `--dangerously-skip-permissions`: chạy với cwd là thư mục đích (`inbox/` hoặc scratchpad); prompt phải ghi rõ chỉ tạo/copy file trong cwd, cấm xóa/di chuyển/ghi đè file khác, cấm lệnh phá hủy hoặc sửa hệ thống; chạy xong kiểm `ls` để xác nhận file thật sự tồn tại.
- Prompt phải bảo agy "WAIT until the image generator subagent finishes, save as <tên> in cwd, print absolute path", nếu không agy kết thúc lượt trước khi có ảnh.
- Nếu agy bị limit/lỗi: quay lại Claude cho phần có thể (viết prompt, soạn bản nháp); báo người dùng việc nào chỉ agy hoặc Nano Banana làm được.
