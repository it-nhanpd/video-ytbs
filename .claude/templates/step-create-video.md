Written for: bạn, để copy vào từng dự án rồi đưa cho agent làm từng bước.

Tôi đã tạo file mẫu [templates/NEW_PROJECT_PLAYBOOK.md](templates/NEW_PROJECT_PLAYBOOK.md). Tôi chưa chạy thử playbook với agent nào.

**Cách dùng:** copy file vào `content/projects/<slug>/PLAYBOOK.md`, điền khối THÔNG SỐ (topic, ngách, locale, thời lượng, khán giả, URL tham chiếu, nguồn ưu tiên), rồi đưa agent từng `PROMPT` một. Mỗi bước có đầu vào, việc agent làm, file đầu ra và một cổng duyệt. Agent dừng ở cổng, bạn duyệt xong mới sang bước kế.

Bốn bước bạn đề xuất đã nằm trong đó. Tôi thêm các bước 0, 4, 5, 6, 7 và 9, vì thiếu chúng thì video chưa ra được.

| Bước | Nội dung | Đầu ra chính |
|---|---|---|
| 0 | Khởi tạo thư mục dự án | `project.md` |
| 1 | Phân tích video tham chiếu (cấu trúc, 3 điểm khác biệt, điều không được copy) | `research/01-reference-analysis.md` |
| 2 | Kịch bản bám nguồn kiểm chứng: bảng nguồn, bảng sự kiện cần ≥2 nguồn độc lập, mỗi đoạn gắn mã `[Fxx]` | `02-sources.md`, `03-facts.md`, `script/<locale>.md` |
| 3 | Chia cảnh, tra library, sinh prompt pack tạo ảnh | `shotlist.md`, `prompts/*.md` |
| 4 | Bạn tạo ảnh Nano Banana. Agent đo lại crop/anchors rồi ingest | `assets/*.png` |
| 5 | Dựng `scenes.json` và i18n | `scenes.json`, `locales/*.json` |
| 6 | Voice, nhạc, SFX | `audio/` |
| 7 | Render và QA | `05-qa-report.md` |
| 8 | Tiêu đề, thumbnail, mô tả theo ngách | `publish/titles.md`, `thumbnail-prompts.md`, `description.md` |
| 9 | Đưa asset đã duyệt vào library, ghi bài học | cập nhật `library/` |

File còn có checklist "một video YouTube cần những gì" và một khối quy tắc để dán đầu phiên làm việc: một bước mỗi lần, không đoán dữ kiện, không copy tham chiếu, tra library trước.

**Phần hệ thống chưa có:** cuối file có bảng liệt kê từng bước đã có công cụ chưa. Những phần chưa có:
- Các skill `video-brief`, `script-writer`, `shot-planner`, `render-qa` và skill thumbnail/tiêu đề. Hiện agent làm các bước này trực tiếp theo PROMPT trong file.
- Template bản đồ, cảnh tư liệu và chữ lớn. Engine mới chỉ có `MultiplaneScene`.
- Voice và timing (WhisperX).
- Ghép nhiều cảnh thành một video.

Tôi chưa làm các phần này. Nếu bạn muốn, tôi có thể biến bước 2 (kịch bản) hoặc bước 8 (thumbnail/tiêu đề) thành skill trước.