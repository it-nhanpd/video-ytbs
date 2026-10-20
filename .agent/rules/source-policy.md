# Quy tắc nguồn (BẮT BUỘC cho mọi khẳng định lịch sử/số liệu)

Lý do: phần mô tả video YouTube đính kèm tài liệu để người xem đọc và tìm hiểu thêm. Mọi khẳng định trong lời dẫn, chữ trên màn hình và số liệu phải truy được về nguồn chính thống (người dùng quyết 2026-10-17).

## Nguồn được làm căn cứ và đưa vào mô tả
- **A. Sử liệu gốc:** hiệp ước, văn bản luật, kho lưu trữ quốc gia (NARA…), bản dịch học thuật của biên niên sử (vd. Rachewiltz, *Secret History of the Mongols*).
- **B. Sách và bài tạp chí học thuật có bình duyệt:** nhà xuất bản đại học, tạp chí peer-reviewed (vd. Taagepera 1997, Turchin–Adams–Hall 2006, Cliopatria trên *Scientific Data*).
- **B2. Bách khoa thư học thuật có tác giả chuyên gia ký tên:** Britannica, Encyclopaedia Iranica, *Encyclopedia of Russian History* (ghi theo tên bài + tác giả + tên bộ sách, không ghi tên trang lưu trữ như encyclopedia.com).
- **G. Cơ quan nhà nước, bảo tàng, thư viện quốc gia:** Office of the Historian (Bộ Ngoại giao Mỹ), Library of Congress, Bảo tàng Cố cung Đài Bắc, BnF.

## Nguồn KHÔNG được làm căn cứ, không đưa vào mô tả
Wikipedia và mọi wiki; World History Encyclopedia; blog (kể cả blog của sử gia); trang tổng quan không tác giả (kể cả trang giáo dục dạng tổng quan); historyofwar.org; bản tóm tắt kết quả tìm kiếm; trang đại lý/diễn đàn.
Chỉ dùng để **tìm tên sách/bài gốc** (xem trích dẫn cuối trang), rồi đi theo trích dẫn tới nguồn thật. Không ghi các trang này vào cột "nguồn" của một dòng `Fxx`.

## Trạng thái khẳng định
- **Đã kiểm chứng:** ≥2 nguồn A/B/B2 độc lập **đã mở đọc** khớp nhau (hoặc khẳng định chỉ nói "văn bản ghi gì" và đã đọc chính văn bản).
- **Đạt một phần:** ≥1 nguồn A/B/B2/G đã mở đọc. Chỉ dùng với câu có giới hạn ("theo …", "khoảng …", chỉ năm).
- **Sơ bộ:** chỉ có nguồn loại cấm, hoặc nguồn tốt nhưng chưa mở đọc/chỉ thấy tóm tắt. **Không dùng.**
- **Tranh cãi / Chưa rõ:** như `fact-research`.

## Điều kiện để một nguồn vào danh mục mô tả video
Phải ghi đủ: tác giả (hoặc cơ quan), tựa, nơi xuất bản/nhà xuất bản, năm, URL hoặc DOI, trang/mục (hoặc đoạn trích ≤25 từ), ngày truy cập. Thiếu một mục thì chưa đủ điều kiện.

## Cách kiểm chứng
- Công cụ tóm tắt trang (WebFetch) chỉ đủ xác nhận ý, **không đủ để xác nhận một trích dẫn nguyên văn**. Với nguồn A/B/B2 có PDF: tải vào thư mục riêng, rỗng; trích bằng `pdftotext -layout`; `grep` đúng đoạn trích; ghi số trang thật. Chạy Python bằng `-I`, truyền đường dẫn qua tham số (xem quy tắc tải file không tin cậy).
- Nguồn không mở được (403, tường trả phí, sách in): ghi "chưa đọc được" và **hỏi người dùng cung cấp PDF/ảnh trang**; không thay bằng tóm tắt.
- agy (hoặc agent khác) báo "đã đọc/đã kiểm chứng" không phải bằng chứng: Claude tự kiểm lại các nguồn chính trước khi ghi vào `research/03-facts.md`.

## Ảnh và dữ liệu
- Ảnh: chỉ ảnh có hồ sơ bảo tàng/kho lưu trữ và giấy phép đọc từ trang gốc; ghi trong `qa/image-sources.md`.
- Dữ liệu bản đồ: Cliopatria CC BY 4.0 (ghi công, nêu có chỉnh sửa), Natural Earth public domain.
