# Quy tắc viết lệnh bash đơn giản

Áp dụng khi tạo lệnh shell cho dự án này (Windows 11, dùng Git Bash/POSIX sh).

- Cú pháp POSIX: `/dev/null`, dấu `/`, `$VAR`. Không dùng cmd/PowerShell trong Bash tool.
- Đường dẫn Windows viết dạng `/d/videos-system/...`; luôn đặt trong dấu nháy kép nếu có khoảng trắng.
- Mỗi lệnh làm MỘT việc; tối đa 1-2 pipe. Nối bằng `&&` khi phụ thuộc nhau.
- Chỉ đọc/liệt kê là mặc định (`ls`, `cat`, `grep`, `wc`, `node -v`). Ưu tiên công cụ Read/Grep/Glob nếu có.
- Cấm tự chạy: `rm -rf`, `git reset --hard`, `git push --force`, `chmod -R`, ghi đè file chưa xem.
- Lệnh phá hủy/ghi đè: chỉ đề xuất, chờ người dùng xác nhận.
- Lệnh dự án: `npm run <script>` (xem package.json), `npx remotion ...`.
- Luôn kèm mô tả 1 dòng lệnh làm gì. Không bịa đường dẫn: kiểm tra bằng `ls` trước.
