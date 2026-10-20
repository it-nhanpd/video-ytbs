# Kế hoạch: bỏ vòng lặp, làm 10 cảnh theo khung cố định (`2026-largest-empires`)

## Context
Người dùng đưa video "Top 10 Quốc gia có Diện Tích Lớn Nhất Thế Giới" của kênh Ghiền Địa Lý (263 nghìn đăng ký, 13 phút 27 giây, ~464 nghìn lượt xem) và hỏi vì sao tôi làm mãi không xong, lòng vòng. Tôi đọc metadata và phụ đề tự động (chưa xem khung hình, chưa tải video). Kết luận phân tích dưới đây, kèm kế hoạch sửa. Các lựa chọn của người dùng: mỗi đế chế **hai sự kiện có nguồn**; **duyệt theo lô 3 cảnh** sau pilot (đề xuất sửa `workflow-gates.md` mục 7, cần người dùng đồng ý bằng văn bản).

## Kênh tham chiếu làm gì (rút từ phụ đề, thông tin video)
- Khung cố định cho mỗi hạng (~65–70 giây): "vị trí thứ N, tên nước, diện tích" → vị trí địa lý/láng giềng → địa hình → tài nguyên → kinh tế → dân số → văn hóa. Mười mục dùng **cùng một khung**, nên mục thứ 2–10 gần như không tốn công thiết kế.
- Nêu **cách tính** một lần ngay đầu (30 giây): "tổng diện tích gồm đất và nước, theo ranh giới quốc tế hoặc bờ biển". Xong là đi tiếp, không tranh luận.
- Mở bằng "Chào mừng các bạn…", không có hook, không open loop; kết bằng "hãy comment". Hình dựa trên video kho (Storyblocks, Pixabay, Motion Array theo mô tả).
- **Không có danh mục tài liệu** trong mô tả (chỉ ghi nhạc, kho hình, bản quyền). Phụ đề tự động có vài chỗ không chắc đúng (vd. "quốc gia không giáp biển lớn nhất", "quê hương của Messi"): chưa kiểm, chỉ là nhận xét từ chữ.
- Chủ đề của họ là **số liệu tĩnh hiện nay**, không cần kiểm chứng lịch sử từng mốc.

## Vì sao tôi chậm và lòng vòng (tự đánh giá, nêu thẳng)
1. **Bài toán của tôi khó gấp nhiều lần.** Họ xếp nước hiện nay (một bảng số). Tôi xếp đế chế lịch sử: số liệu tranh cãi giữa các nguồn, mỗi mốc năm cần sự kiện có nguồn, mỗi sự kiện cần kiểm. Kế hoạch cũ có ~50 sự kiện cần kiểm chứng (5 mốc × 10 đế chế). Đây là chỗ tốn thời gian chính, không phải phần dựng hình.
2. **Sai thứ tự.** Tôi dựng layer `map`, render nhiều still và clip **trước** khi chốt (a) luật nguồn, (b) khung cố định của một cảnh, (c) quy tắc bản đồ. Hệ quả: phải làm lại (zoom cận làm mất thấy trọn đế chế; ảnh ghim che đất; lời dẫn phải sửa theo nguồn; rà lại toàn bộ `03-facts.md` sau khi bạn chỉ ra nguồn không chính thống).
3. **Thiết kế riêng từng cảnh thay vì khung dùng lại.** Pilot Nga tự nghĩ cấu trúc, nhịp, vị trí ảnh ghim, camera trong cùng lúc dựng. Kênh tham chiếu dùng một khung cho cả 10 mục.
4. **Giao nhầm việc nhiều lần.** Ba lần tôi giao nghiên cứu cho subagent của Claude thay vì agy (đúng luật `agy-delegation.md`), rồi nhận kết quả dùng nguồn không chuẩn. Mỗi lần là một vòng làm lại.
5. **Nghiên cứu theo chương rồi rà lại.** Mỗi đợt nghiên cứu gồm tìm → kiểm → hạ trạng thái → ghi lại. Với tin cậy của agy chưa cao (đã gặp một trích dẫn sai), tôi phải kiểm từng nguồn. Kiểm bằng tóm tắt công cụ lại không đủ chặt, nên thành hai vòng.
6. **Hỏi nhiều, hỏi lắt nhắt.** Nhiều câu hỏi nhỏ cho người dùng làm tăng số lượt qua lại; một số câu tôi có thể tự chọn mặc định hợp lý.
7. **Lỗi công cụ nhỏ:** lệnh Bash dán nội dung dài lỗi cú pháp, mã hóa cp1252 trên Windows, render bị dừng giữa chừng. Tốn thêm vài lượt nhưng không phải nguyên nhân chính.

## Kế hoạch tăng tốc (đã được người dùng chọn hướng)
### 1. Chốt một khung cảnh cố định (một lần, dùng cho cả 10 cảnh)
Khung ~55 giây, 7 beat: (1) hook một số hoặc một sự kiện có nguồn; (2) hạng + khoảng diện tích; (3) mốc đầu + sự kiện 1; (4) mốc giữa; (5) mốc đỉnh + sự kiện 2; (6) chi tiết bất ngờ (nếu có nguồn) hoặc so sánh diện tích; (7) câu dẫn sang hạng kế tiếp. Camera luôn thấy trọn đế chế (quy tắc đã rút ra), vòng chỉ vị trí thay zoom, mascot theo biểu cảm cố định, chip theo mẫu. Ghi vào `content/library/styles/empire-map.md` bằng đề xuất bổ sung chờ người dùng duyệt (mục bản đồ: "luôn thấy trọn đế chế").

### 2. Dữ liệu từng đế chế một file, sinh `scenes.json` bằng script
- `content/projects/2026-largest-empires/empires/<id>.json`: hạng, khoảng diện tích và nguồn, các mốc năm (Cliopatria), 2 sự kiện có mã Fxx, chip, ảnh ghim, nhịp mascot, vị trí vòng chỉ.
- `tools/gen-empire-scene.mjs`: đọc file đó, ghi cảnh vào `scenes.json` và key vào `locales/vi.json`. Tái dùng `engine/src/components/MapAsset.tsx`, `tools/map-extract.mjs`, `tools/ingest.ts`. Mỗi đế chế mới = điền dữ liệu, không thiết kế lại từ đầu, tiết kiệm token.

### 3. Thu hẹp nghiên cứu
- Mỗi đế chế: **tối đa 2 sự kiện có nguồn + 1 chi tiết bất ngờ (nếu có)**; số diện tích lấy từ Turchin 2006 và Cliopatria, hiển thị khoảng. Các mốc còn lại chỉ vẽ bản đồ, không kể sự kiện.
- Một đợt `agy` cho **tất cả 9 đế chế còn lại** (hạng 1, 2, 4–10) theo danh sách trắng nguồn của `source-policy.md`, yêu cầu: 2 sự kiện + nguồn A/B/B2/G + trang + trích ≤25 từ + thông tin xuất bản đủ cho danh mục mô tả. Claude kiểm lại bằng `pdftotext` + `grep` (không dùng tóm tắt công cụ). Lệnh nêu trước, chờ xác nhận; không giao subagent của Claude.

### 4. Cổng duyệt theo lô
- Sau pilot (đã duyệt): tôi viết thẻ **3 cảnh liền nhau** (khung cố định nên ngắn), người dùng duyệt một lần (G1), tôi dựng 3 cảnh rồi gửi still + clip (G3). Cần người dùng đồng ý **bằng văn bản** để sửa `.claude/rules/workflow-gates.md` mục 7 (rồi đồng bộ `.agent/`); trước khi có chữ đó vẫn làm từng cảnh.
- Quy tắc cho tôi: không hỏi những điều có mặc định hợp lý; chọn mặc định, ghi vào `project.md`, chỉ hỏi khi đổi hướng hoặc rủi ro.

### 5. Khác biệt cần giữ so với kênh tham chiếu
Có hook và open loop; có bản đồ thể hiện diện tích; có danh mục tài liệu chính thống trong mô tả (đối thủ không có); số liệu có khoảng và nguồn.

## Tệp chính sẽ tạo/sửa
- Tạo: `content/projects/2026-largest-empires/empires/*.json` (10 file, bắt đầu bằng `russia.json` chuyển từ s009), `tools/gen-empire-scene.mjs`.
- Sửa: `content/library/styles/empire-map.md` (đề xuất bổ sung, chờ duyệt), `.claude/rules/workflow-gates.md` mục 7 (chỉ khi người dùng đồng ý văn bản), `project.md`, `research/03-facts.md` (chỉ theo kết quả agy đã kiểm).
- Không sửa engine (`MapAsset.tsx`) trừ khi phát sinh lỗi thật.

## Kiểm chứng
- Dựng lại s009 từ `empires/russia.json` bằng script và so khớp với bản hiện tại (still giây 3, 17, 44; thời lượng 55 giây); `npm run validate` và `npm run typecheck` đạt.
- Chạy đợt agy một lần cho 9 đế chế; chọn 5 trích dẫn ngẫu nhiên kiểm bằng `pdftotext` + `grep`; ghi nguồn không mở được; không dùng nguồn nào trong danh sách đen.
- Đo: số lượt hỏi người dùng và số lần làm lại mỗi cảnh sau khi có khung (mục tiêu: cảnh 2–4 không phải sửa kiểu "zoom/ảnh che đất/nguồn").
- Báo cáo trung thực: không nói "xong" khi chưa có file render và nêu đường dẫn.
