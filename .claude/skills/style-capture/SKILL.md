---
name: style-capture
description: Ghi lại style từ một video tham chiếu thành tài liệu dùng lại được (khung hình trích có đánh số, bảng phân rã lớp, cỡ cảnh/camera, chuyển động, màu, chữ, điều không được sao chép, phát hiện của người dùng). Dùng khi người dùng đưa video tham chiếu và nói "làm giống", "ghi nhớ style", "style hiện tại chưa tốt so với video gốc", hoặc trước khi đổi style bible.
---

# style-capture: học ngữ pháp hình từ video tham chiếu

Mục tiêu: người sau (và phiên sau) làm lại được cùng style mà không cần xem lại video. Chỉ học **cách làm** (lớp, nhịp, cỡ cảnh), không chép nhân vật/bố cục/câu chữ/nhận diện kênh.

## Quy trình
1. **Lấy video** vào thư mục tạm riêng (không vào repo): `python -m yt_dlp --js-runtimes node -f <id định dạng> -o ref.%(ext)s <url>`. Nếu định dạng bị 403 hoặc phụ đề bị 429, thử định dạng khác (`-F` để liệt kê); không lách bằng cách khác. Bản 360p đủ để phân tích bố cục.
2. **Trích khung** bằng `node tools/grab-frames.mjs --video <mp4> --out content/library/styles/refs/<tên>/ --every 25` (tổng quan), rồi `--at 62,62.5,63,...` (8 khung/giây) cho đoạn đi bộ/hành động. Xem từng ảnh ghép `sheet_*.png` bằng công cụ đọc ảnh.
3. **Phân rã lớp** của ít nhất một cảnh đi bộ: từ xa đến gần, mỗi lớp ghi loại, có viền không, mờ bao nhiêu, trôi nhanh/chậm, có che nhân vật không. Cảnh nào chỉ có 3 lớp thì ghi rõ là phẳng.
4. **Nhịp:** số lần cắt cảnh (`ffmpeg ... select='gt(scene,0.35)'`), đổi cỡ cảnh bao lâu một lần, cận cảnh ở đâu.
5. **Chuyển động nhân vật:** gập gối/khuỷu, nhún thân, vật đeo lắc, chu kỳ bước. Số nào chỉ nhìn bằng mắt thì ghi *(ước lượng)*.
6. **Hành động/đạo cụ, màu, chữ** (kích cỡ, vị trí, hiệu ứng vào/ra).
7. **Ghi vào** `content/library/styles/layer-recipe.md` (hoặc file mới cùng cấu trúc cho thể loại khác) và hỏi người dùng **phát hiện riêng của họ**; ghi nguyên văn vào mục "Phát hiện của người dùng".
8. **So với style hiện tại:** liệt kê khác biệt thành bảng "đã có / chưa có" (engine, ảnh nền, prompt) và đề xuất sửa `uniform-showcase.md` (chờ người dùng duyệt theo `style-lock.md`).
9. **Kiểm sau khi làm:** ảnh ghép đối chiếu khung tham chiếu ↔ khung của ta cho người dùng chấm; không tự tuyên bố "giống X%".

## Quy tắc
- Báo trung thực việc không làm được (không nghe được lời, không đo được).
- Không đưa khung trích lên kho công khai: `refs/ref-video/` nằm trong `.gitignore`; chỉ ghi nguồn và ngày.
- Không dùng ảnh tham chiếu làm ảnh đính kèm khi tạo nhân vật; nếu đính kèm cho nền/style, ghi "chỉ tham khảo style, không sao chép nhân vật/địa điểm".
