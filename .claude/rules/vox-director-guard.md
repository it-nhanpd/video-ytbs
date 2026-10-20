# Quy tắc dùng skill vox-director (đã clone 2026-10-17, MIT, tham khảo)

- Skill nằm ở `.claude/skills/vox-director/` (clone từ github.com/Alisa0808/vox-director, commit 6a85a7c). Nó tạo ảnh/video/giọng/nhạc qua **API trả phí Atlas Cloud** (`ATLASCLOUD_API_KEY`), khác kênh G-Labs/agy của dự án.
- **Không chạy script nào của skill** (`scripts/*.py`) khi người dùng chưa duyệt từng lần, kể cả khi mô tả skill khớp yêu cầu "Vox style". Trước khi chạy: nêu lệnh, model, số lần gọi ước lượng, chi phí, chờ xác nhận. `run_jobs()` của nó tự gửi lại job lỗi, nên chỉ chạy khi đã chốt trần số lần gọi.
- Không đọc/in/ghi `ATLASCLOUD_API_KEY`; khóa chỉ nằm trong biến môi trường hoặc `.env` (đã gitignore).
- Dự án `2026-largest-empires` dùng style `empire-map` (bản đồ code + mascot), **không** dùng paper-collage của skill này. Dùng skill chỉ để tham khảo quy tắc beat/camera/nhịp (đã rút vào `script-craft`) hoặc cho dự án khác do người dùng chọn.
- Dùng Atlas Cloud cho dự án nào thì ghi quyết định bằng văn bản vào `project.md` của dự án đó (`workflow-gates.md` mục 5).
- Đã kiểm code `scripts/`: chỉ gọi mạng tới `api.atlascloud.ai`, `subprocess` chỉ chạy ffmpeg/ffprobe/curl, `rmtree` chỉ xóa thư mục tạm của chính nó. Việc kiểm là grep theo từ khóa, chưa đọc từng dòng.
