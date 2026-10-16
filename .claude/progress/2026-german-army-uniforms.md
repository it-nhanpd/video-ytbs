# Tiến độ: 2026-german-army-uniforms

Cập nhật: 2026-10-16. Thư mục dự án: `content/projects/2026-german-army-uniforms/`. Quy trình: `PLAYBOOK.md` trong thư mục dự án (bản gốc `templates/NEW_PROJECT_PLAYBOOK.md`).

## Thông số đã chốt
- Topic: sự tiến hóa quân phục lục quân Đức, **phạm vi D' (1871 → nay)**, trục "quy định so với thực tế", lược bớt vũ khí.
- Thời lượng: **15–20 phút** (con số tạm, chốt sau bước 2). Locale: vi. Khung 1920×1080, 24fps, letterbox 2.35:1.
- Hướng khác biệt: **cả 5** (vì sao thay đổi; so sánh cạnh nhau cùng một người lính; quy định vs thực tế; chỉ kể quân phục; hook bằng câu hỏi/hình ảnh).
- Chỉ mượn **style** của video tham chiếu (`5nX9uVBi95s`); nội dung, cấu trúc, câu chữ khác hẳn.
- Yêu cầu bắt buộc: bám lịch sử, nguồn chính thống, không xuyên tạc.

## Trạng thái các bước
| Bước | Nội dung | Trạng thái |
|---|---|---|
| 0 | Khởi tạo dự án | **Xong** |
| 1 | Phân tích tham chiếu + phạm vi | **Xong, đã duyệt** (D', cả 5 hướng) |
| 2 | Nghiên cứu + kịch bản | **Đang làm.** Chương 1 đã nghiên cứu, chờ bạn duyệt; chương 2 trở đi chưa làm; chưa viết kịch bản |
| 3 | Shotlist + prompt pack | Chưa |
| 4 | Tạo ảnh + ingest | Chưa |
| 5 | Dựng scenes.json | Chưa |
| 6 | Âm thanh | Chưa |
| 7 | Render + QA | Chưa |
| 8 | Tiêu đề, thumbnail, mô tả | Chưa |
| 9 | Promote asset vào library | Chưa |

## Bước 2: chương 1 (1871, quân đội các bang, Pickelhaube)
Đạt chuẩn ở mức giới hạn. Chi tiết: `research/02-sources.md`, `03-facts.md`, `04-open-questions.md`.
- **Đã kiểm chứng:** F01 (tuyên bố Đế quốc 18/1/1871, Versailles), F02 (Hiến pháp 16/4/1871 Điều 63 + ngoại lệ Bayern theo hiệp ước 23/11/1870), F15 (hiệp ước Bayern để nguyên quyền về quân phục).
- **Đạt một phần (chỉ dùng câu có giới hạn):** F07 (mũ nhỏ dần qua các mẫu; hiện vật DHM), F11 (Sachsen tự quản), F16 (Sachsen theo kiểu Prussia từ 1867; luận án Hoffmann).
- **Chưa dùng:** F03–F06, F08–F10, F12–F14 (chỉ có nguồn Wikipedia/đại lý, hoặc mới thấy tóm tắt tìm kiếm).
- **Khoảng trống:** màu/kiểu quân phục bộ binh Prussia, Sachsen, Bayern năm 1871 (chưa có nguồn bảo tàng); ngày lệnh Pickelhaube 1842 (tranh cãi 10/10, 23/10, 29/11, hay "1843"); năm Bayern đổi mũ (nghiêng 1886, một nguồn ghi 1887); bốn hồ sơ museum-digital lỗi trang 503/504; chưa đối chiếu bản scan RGBl gốc (đang dùng bản chép Wikisource).
- Khẳng định của video gốc: V1 ("mô-đun đầu tiên") **không dùng**; V2 (WWI "đổi sang thép tấm") thực tế chỉ là một vật liệu thay thế; cảnh "Saxon 1871" (mũ lưỡi trai, áo xanh lục) **chưa kiểm chứng**; V3–V11 chưa tra.
- Giới hạn nghiên cứu: không đọc được sách in (Knötel, Herr, Schiers); luận án Hoffmann không có bảng màu quân phục.

## Bộ khung đã tạo cho các chương sau (chưa chạy thử trên chương khác)
- `.claude/skills/fact-research/SKILL.md`: quy trình tra nguồn, thang 5 trạng thái, quy tắc cứng, mẹo kỹ thuật.
- `.claude/agents/source-researcher.md`: agent tra nguồn một chương.
- `templates/CHAPTER_RESEARCH_PROMPT.md`: prompt nghiên cứu chương, định dạng đầu ra, prompt viết kịch bản sau cổng duyệt.
- `templates/NEW_PROJECT_PLAYBOOK.md`: playbook 10 bước (Bước 0–9).

## Phát hiện về style của video tham chiếu (6 frame)
Hoạt hình 2D nét viền đen, nhìn ngang đi sang phải; nền painterly nhiều lớp đồi, tiền cảnh tối mờ; chú thích góc dưới trái (tên loại lính + năm). Độ chính xác quân phục của bản gốc chưa được kiểm chứng (vd. Reichswehr 1919 có thể sai niên đại). Chi tiết ở `research/01-reference-analysis.md` mục 10.

## Việc hệ thống còn thiếu (chưa build)
- Template `UniformShowcase` (nhân vật đi trên nền multiplane + chú thích) và `SideBySide` (cùng thân hình, đổi quân phục theo năm).
- Chuỗi bước đi bằng ảnh → image-to-video loop; thân hình chuẩn (base body) dùng chung các thời kỳ. Ước tính 25–40 nhân vật/biến thể.
- Skill còn thiếu: `video-brief`, `script-writer`, `shot-planner`, `render-qa`, thumbnail/tiêu đề; voice/timing; ghép nhiều cảnh.

## Rủi ro
- Giai đoạn sau 1945 (Bundeswehr, NVA, Flecktarn, M92) gần như chưa có tư liệu.
- Chủ đề Quốc xã/SS: tư liệu, không tô điểm; thumbnail tránh biểu tượng; kiểm tra chính sách nền tảng và §86a StGB.
- Điều khoản ảnh bảo tàng (DHM: CC BY-NC-ND, không chỉnh sửa; Hoffmann: In Copyright).

## Bước kế tiếp (chờ bạn chọn)
1. Duyệt chương 1 rồi viết đoạn kịch bản chương 1 từ các dòng được dùng; hoặc
2. Nghiên cứu chương 2 (thuộc địa: Schutztruppe, Askari; khẳng định V10) bằng `source-researcher`; hoặc
3. Bổ sung nguồn chương 1 (cần sách Knötel/Herr hoặc PDF do bạn cung cấp).
