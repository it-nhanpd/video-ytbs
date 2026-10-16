#!/usr/bin/env bash
# Ảnh tham khảo đã tải thủ công vào research/images/ (nguồn + giấy phép: images/metadata.csv).
# Script mẫu cũ chỉ là khung rỗng; thêm lệnh curl tại đây khi cần tải thêm (ch04, ch06 còn thiếu).
set -euo pipefail
outdir="$(dirname "$0")/images"
mkdir -p "$outdir"
# curl -L -o "$outdir/<tên>.jpg" "<URL upload.wikimedia.org>"
echo "Chưa có ảnh nào để tải thêm. Thư mục: $outdir"
