# largest-empires — 10 đế chế lớn nhất lịch sử, mở rộng theo bản đồ

## Thông số
- **slug:** 2026-largest-empires
- **Topic:** 10 đế chế có diện tích đỉnh cao lớn nhất lịch sử, minh họa bằng bản đồ mở rộng theo các mốc năm
- **Tiêu chí xếp hạng (đã duyệt):** diện tích đỉnh cao (km²). Con số và thứ hạng phải tra nguồn (`fact-research`), ghi rõ nguồn nào và chỗ các nguồn khác nhau
- **Ngách:** giải thích lịch sử dạng bản đồ + ảnh tư liệu ghim + mascot nhỏ (tham chiếu: video "Toàn bộ lịch sử thế giới trong 8 phút" của kênh Vui Vẻ, dùng để học cấu trúc, không sao chép)
- **Locale:** vi (key i18n trong `locales/vi.json`, `scenes.json` không chứa text cứng)
- **Thời lượng mục tiêu:** ~10 phút (hook ~30s, 10 cảnh × ~55s xếp từ hạng 10 xuống 1, kết ~20s)
- **Giọng đọc:** chưa cần ở bản thử, làm hình trước
- **Style (đã duyệt hướng):** bản đồ phẳng vẽ bằng code + ảnh tư liệu ghim + mascot cartoon nhỏ. **Style bible chưa viết/chưa duyệt**: chưa tạo ảnh nào cho đến khi có (`style-lock.md`)
- **Dữ liệu bản đồ:** nền hiện đại (Natural Earth, public domain, cần xác nhận); ranh giới lịch sử cần tìm bộ dữ liệu và kiểm tra giấy phép, dự phòng là polygon vẽ tay ghi rõ là minh họa
- **Khung:** 1920×1080, 24fps

## Quyết định đã duyệt (người dùng chọn)
- **Tăng tốc (2026-10-17, sau khi người dùng đưa kênh Ghiền Địa Lý và hỏi vì sao làm lòng vòng):** (1) mỗi đế chế **2 sự kiện có nguồn + 1 chi tiết bất ngờ (nếu có)**, mốc khác chỉ vẽ bản đồ; (2) **duyệt theo lô 3 cảnh** sau pilot (đã ghi ngoại lệ vào `workflow-gates.md` mục 7); (3) dữ liệu mỗi đế chế một file `empires/<id>.json`, cảnh sinh bằng `node tools/gen-empire-scene.mjs 2026-largest-empires <id>` (s009 đã chuyển sang dạng này, `empires/russia.json`); (4) thu thập nguồn cho 9 đế chế còn lại bằng **một đợt agy**, Claude kiểm bằng `pdftotext` + `grep`. Đề xuất bổ sung style (camera trọn đế chế, vòng chỉ vị trí) ở `research/05-style-proposal.md`, chờ duyệt.
- **Nguồn (2026-10-17):** chỉ nguồn chính thống (sử liệu gốc, học thuật bình duyệt, bách khoa thư học thuật có tác giả, cơ quan nhà nước/bảo tàng/thư viện) vì mô tả video đính kèm tài liệu cho người xem. Luật: `.claude/rules/source-policy.md`. Mô tả video có danh mục tham khảo đánh số theo cảnh (mục "9. Tài liệu tham khảo" trong thẻ cảnh → `research/06-references.md`). Thu thập do agy, Claude kiểm chứng bằng đọc thật.
- **Cách tính:** tính thuộc địa và vùng phụ thuộc trực tiếp, tách nhà nước kế vị, loại nước cộng hòa (Liên Xô, Hoa Kỳ).
- **Hạng 10:** Brazil (Đế quốc Brazil); số liệu hiển thị dạng khoảng "X–Y triệu km²" khi hai họ nguồn lệch >10%.
- **Dữ liệu ranh giới lịch sử:** Cliopatria (CC BY 4.0, ghi công, nêu rõ có giản lược); nền hiện đại Natural Earth.
- **Kiểm chứng:** pilot dùng hạng 1–3 (hạng 3 Nga đã kiểm chứng khoảng 22,8–22,9); hạng 4–10 chờ nguồn thêm (PDF Taagepera 1997 nếu người dùng cung cấp).
- **Style bible:** đã khóa `content/library/styles/empire-map.md` (2026-10-17, người dùng chọn khóa sau khi duyệt mascot); không dùng ảnh tham chiếu.
- **Mascot:** `mascot-explorer` đạt (neutral). Đã tạo thêm 3 biểu cảm (surprised, thinking, pointing) trong `inbox/`, chờ người dùng xem; "pointing" hơi tinh quái so với prompt "thân thiện".
- **Pilot Nga:** 3 mốc có sự kiện (1721 → Trung Á 1865–67 → bán Alaska 1867). Thẻ cảnh `script/scenes/s009.md` đã duyệt (G1, 2026-10-17: người dùng "đồng ý"; giữ nguyên lời dẫn, không thêm câu mascot). G2 xong (0 ảnh AI thêm, 3 ảnh PD, ingest mascot). **G3 (2026-10-17): pilot đã duyệt.** Người dùng nhận xét camera zoom cận làm mất thấy trọn đế chế → đã sửa (toàn cảnh, zoom 0,98–1,1, vòng chỉ vị trí `marks`, ảnh ghim không che đất); người dùng trả lời "tốt hơn rồi, tiếp tục". Clip `renders/s009-pilot.mp4` (nửa độ phân giải). Đề xuất B4 thêm thanh số km² chạy tăng: chưa hỏi/chưa làm. **Quy tắc rút ra:** bản đồ luôn thấy trọn đế chế, không zoom cận; chỉ vị trí bằng vòng tròn.
- **Engine thêm:** layer `map` (Equal Earth, crossfade polygon theo mốc, ảnh ghim, camera `views`), `showSec` cho ảnh, text `credit`, `mapTheme` + grade `map_clean`, `tools/map-extract.mjs`.
- **Quy tắc nhịp/camera:** rút từ vox-director vào `script-craft` (không cài repo đó, không dùng Atlas Cloud).

## Trạng thái các bước
| Bước | Nội dung | Trạng thái |
|---|---|---|
| 0 | Khởi tạo dự án | xong (thư mục + project.md) |
| 1 | Chốt danh sách 10 đế chế theo nguồn | bản nháp xong (`research/02-04`): hạng 1–3 chắc, 4–10 tranh cãi; đang tra sự kiện cho Nga (pilot) |
| 2 | Style bible + layer `map` (đề xuất, chờ duyệt) | đề xuất style viết xong (`research/05-style-proposal.md`), chờ bạn duyệt; layer `map` chưa làm |
| 3 | Pilot: 1 cảnh (thẻ cảnh → asset → still + clip) | **pilot đã duyệt** (s009, G3 xong) |
| 4 | 9 cảnh còn lại + hook | đang làm từng cảnh; tiếp theo s010 (Mông Cổ, hạng 2): nghiên cứu xong (agy thu thập, Claude kiểm lại, F31–F37 trong `research/03-facts.md`; mốc 1220–26 Khwarazm chưa kiểm nên chưa dùng), chưa viết thẻ cảnh |

## Ghi chú
- Chưa tạo ảnh/render nào. Mỗi cảnh theo `workflow-gates.md` mục 7.

## Quyết định bổ sung (2026-10-17, sau đợt agy #2)
- **Umayyad + Abbasid = 1 cảnh "Caliphate Hồi giáo"** (người dùng chọn): cả ba nguồn định lượng gộp một chuỗi, đỉnh 11,1 triệu km² (750; Roolvink 10,1). Hệ quả: còn 9 đế chế; hạng 9 cần thêm một đế chế.
- **Đề xuất hạng 9: Hung Nô (Xiongnu), 9 triệu km², khoảng -176** (cả Taagepera 1978 Table 3, Taagepera 1997 chính văn, Turchin 2006 Table 1 đều ghi 9). Brazil giữ hạng 10 (5,0–8,5). **Đã chốt (tôi tự quyết theo mặc định, không hỏi lại).**
- **Nhà Thanh và Brazil:** người dùng không có PDF Cambridge; đổi sang sự kiện có nguồn đọc được (hiệp ước/văn bản gốc, nguồn có lớp chữ).
