---
name: simple-bash
description: Tạo lệnh bash đơn giản, an toàn (liệt kê, tìm, đếm, chạy npm/remotion) cho dự án videos-system. Dùng khi người dùng nhờ "viết lệnh", "tạo script bash", "lệnh để ...".
---

# simple-bash

Quy trình:
1. Đọc `.claude/rules/bash-simple.md`.
2. Xác định mục tiêu 1 câu. Nếu mơ hồ → hỏi lại 1 câu.
3. Kiểm tra đường dẫn thật bằng `ls`/Glob trước khi đưa vào lệnh.
4. Trả về: lệnh trong khối ```bash + 1 dòng giải thích.
5. Nếu cần lưu thành script: ghi vào `tools/<ten>.sh`, bắt đầu bằng `#!/usr/bin/env bash` và `set -euo pipefail`.

Mẫu thường dùng:
- Liệt kê file: `ls -la content/`
- Tìm text: `grep -rn "từ khóa" engine/ --include="*.ts"`
- Đếm file: `find content -type f | wc -l`
- Xem scripts: `cat package.json`
- Chạy: `npm run <script>`

Không chạy lệnh phá hủy; chỉ đề xuất và chờ xác nhận.
