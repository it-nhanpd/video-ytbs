---
name: fact-research
description: Quy trình nghiên cứu một chương/chủ đề lịch sử để ra bảng nguồn (02-sources.md), bảng sự kiện có trạng thái kiểm chứng (03-facts.md) và danh sách câu hỏi mở (04-open-questions.md), làm nền cho kịch bản. Dùng ở Bước 2 của PLAYBOOK, mỗi lần một chương, không gắn với chủ đề cụ thể.
---

# fact-research

Mục tiêu: mọi câu trong kịch bản truy được về nguồn đã **đọc thật**. Không đoán, không "làm tròn" số liệu, không xuyên tạc.
Quy trình này rút ra từ chương 1 của `2026-german-army-uniforms` (xem `content/projects/2026-german-army-uniforms/research/`, dùng làm ví dụ mẫu).

## Đầu vào
- `project.md` (phạm vi, khán giả), `research/01-reference-analysis.md` (các khẳng định cần kiểm chứng của video tham chiếu: V1…Vn).
- Tên chương và phạm vi thời gian của chương.

## Vòng lặp cho mỗi chương
1. **Lập danh sách câu hỏi** của chương (ai/khi nào/ở đâu/vật gì/số liệu/mâu thuẫn). Đưa các khẳng định Vn thuộc chương vào.
2. **Tìm nguồn theo thứ tự ưu tiên:**
   1. Văn bản sơ cấp/luật/quy định (A): Wikisource, Reichsgesetzblatt, kho lưu trữ, sắc lệnh.
   2. Hồ sơ hiện vật bảo tàng, luận án, bài báo học thuật (B): DHM/LeMO, museum-digital, Deutsche Digitale Bibliothek, Qucosa, bảo tàng quân sự quốc gia.
   3. Bách khoa/tổng hợp (C): Wikipedia, chỉ để định hướng và lấy tên sách dẫn.
   4. Đại lý, diễn đàn sưu tầm, blog (D): chỉ để tìm hướng, **không dùng làm bằng chứng**.
3. **Đọc thật.** Mở từng trang bằng WebFetch (hoặc tải PDF về và trích bằng `pdftotext`). Ghi cột "Đã đọc" trung thực:
   - *đọc toàn trang* / *đọc một phần* / *chỉ thấy tóm tắt tìm kiếm* / *không đọc được*.
   - Tóm tắt của công cụ tìm kiếm **không phải** là đã đọc.
4. **Ghi từng khẳng định thành một dòng** trong `03-facts.md`: ID `Fxx`, khẳng định, số liệu, nguồn (ID Sxx), trạng thái, ghi chú.
5. **Đối chiếu độc lập.** Các bài Wikipedia **không độc lập với nhau**; hồ sơ bảo tàng khác nhau là độc lập. Tìm nguồn thứ hai ở loại khác (luật, hồ sơ hiện vật, học thuật).
6. **Nêu mâu thuẫn**, đừng chọn đại. Ghi ai nói gì (ngày, số, tên).
7. **Viết `04-open-questions.md`:** điều chưa chắc, nguồn cần tìm tiếp, nguồn cần người dùng cung cấp (sách in, PDF).
8. **Chọn dòng được dùng** trong mục "Dòng được dùng trong kịch bản", kèm giới hạn câu chữ.

## Thang trạng thái (dùng đúng các nhãn này)
- **Đã kiểm chứng**: ≥2 nguồn độc lập A/B khớp, **hoặc** khẳng định chỉ nói "văn bản/hiện vật ghi gì" và đã đọc chính văn bản đó. Được dùng.
- **Đạt một phần**: ≥1 nguồn A/B đã đọc + C/D đồng thuận. Chỉ dùng với câu có giới hạn ("theo …", "khoảng …").
- **Sơ bộ**: chỉ C/D, hoặc A/B mới thấy tóm tắt. **Không dùng.**
- **Tranh cãi**: nguồn mâu thuẫn. Chỉ dùng nếu kịch bản nói rõ có tranh cãi.
- **Chưa rõ**: không có nguồn. Không dùng.

## Quy tắc cứng
- Không bịa tên nguồn, số trang, trích dẫn, ngày. Số trang suy từ chân trang phải ghi "suy từ chân trang, cần đối chiếu".
- Không dùng nguyên văn nguồn trong kịch bản; diễn đạt lại. Trích dẫn ngắn khi cần.
- Tên riêng và dấu tiếng Việt kiểm tra lại. Tên Đức viết đúng chính tả gốc.
- Ghi điều khoản sử dụng ảnh/hồ sơ (vd. CC BY-NC-ND không cho chỉnh sửa; "In Copyright" thì chỉ trích dẫn).
- Chủ đề nhạy cảm: trình bày tư liệu, không tô điểm; nêu rõ bối cảnh và phần tranh cãi.
- Khi một khẳng định của video tham chiếu (Vn) không tìm được nguồn: ghi "chưa kiểm chứng", **không dùng** thay vì lặp lại.
- Sai sót của chính mình (nguồn đã dẫn nhầm, trạng thái cũ sai): sửa trong `02-sources.md` mục "Sửa lỗi" và nói rõ cho người dùng.

## Mẹo kỹ thuật (từ chương 1)
- Hồ sơ museum-digital thường lỗi 5xx: thử lại bản `?lang=de`/`?lang=en`, hoặc dùng bản Deutsche Digitale Bibliothek của cùng hiện vật.
- PDF tải về nằm trong thư mục riêng ở scratchpad; trích bằng `pdftotext -layout` rồi `iconv -f latin1 -t utf-8` nếu bị lỗi dấu; tìm theo từ khóa rồi đọc đoạn quanh nó.
- Wikisource là nơi tìm văn bản luật sơ cấp, nhưng là bản chép: ghi "chờ đối chiếu bản scan".
- WebFetch có thể chỉ trả một phần (ghi rõ 100.000 ký tự đầu): ghi "đọc một phần".
- Luận án/sách học thuật có thể không chứa thứ bạn cần (vd. luận án chính trị không có bảng màu quân phục): nói thẳng.

## Đầu ra mỗi chương
- Cập nhật `02-sources.md`, `03-facts.md`, `04-open-questions.md`.
- Một đoạn tóm tắt cho người dùng: cái gì đã đạt, cái gì chưa, cái gì cần họ cung cấp, đề xuất bước tiếp.
- **Dừng ở cổng duyệt** trước khi viết kịch bản.
