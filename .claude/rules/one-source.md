# Một nguồn cấu hình

- `.claude/` là nguồn gốc của skills, agents, rules, templates.
- `.agent/` là bản sao cho công cụ khác (Antigravity). Mỗi lần sửa file trong `.claude/skills|agents|rules|templates`, đồng bộ cùng nội dung sang `.agent/` trong cùng lượt làm việc, rồi kiểm tra không lệch.
- Ở gốc dự án, `GEMINI.md` nhúng `@[CLAUDE.md](./CLAUDE.md)` và `AGENTS.md` nhúng toàn bộ `.agent/rules/*.md` để Antigravity tự động nạp cùng bộ nhớ với Claude mà không nhân đôi nội dung (và giữ mỗi file dưới ngưỡng 24 KB). Khi thêm/xóa file trong `rules/`, cập nhật danh sách nhúng trong `AGENTS.md`.
- Không sửa riêng `.agent/`. Không tạo luật chỉ nằm trong file progress/handoff; luật phải nằm trong `rules/` hoặc `skills/`.

