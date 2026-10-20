# Báo cáo Kiểm toán Hình ảnh Thực tế (Stills Visual Audit Report)

- **Dự án**: `2026-truecrime-zodiac-dahlia`
- **Thời gian hoàn tất kiểm toán**: 2026-10-19
- **Phương pháp**: Render Remotion headless (`npx remotion still`) và kiểm tra trực quan từng frame bằng công cụ xem ảnh (`view_file`).
- **Quy tắc tuân thủ**: `workflow-gates.md` (Báo cáo trung thực, chỉ ghi nhận khi file và log tồn tại).

---

## 1. Bảng Đối soát 10 Khung hình Đại diện 8 Chương

| Cảnh | File ảnh render | Khung hình | Đối tượng kiểm toán | Đánh giá trực quan |
|---|---|:---:|---|:---:|
| **P01** | `renders/still-P01.png` | Frame 60 | Mở đầu: Reenactment phòng tối noir 1992, bóng người vẽ tranh chì màu | **ĐẠT XUẤT SẮC** (Không mặt người thật, đèn bàn vàng rọi nghiêng, hạt bụi analog, nhãn "Minh họa (AI)", chip "1992 · NAM CALIFORNIA") |
| **P05** | `renders/still-P05.png` | Frame 45 | Mở đầu: Bản đồ California (Natural Earth 10m) | **ĐẠT** (Đường bờ biển Thái Bình Dương vintage, nhãn tem giấy kraft công cộng, phụ đề tương phản cao) |
| **P08** | `renders/still-P08.png` | Frame 60 | Mở đầu: Bảng ghim điều tra án mạng 2 vụ án | **ĐẠT** (Nền gỗ bần chân thực, ghim đỏ có bóng đổ tự nhiên, 2 thẻ hồ sơ Black Dahlia & Mật mã Z13) |
| **C106** | `renders/still-C106.png` | Frame 50 | Chương 1: Sơ đồ giải phẫu cắt rời thắt lưng L2–L3 | **ĐẠT TUYỆT ĐỐI** (Không ảnh thi thể ghê rợn; bản vẽ giải phẫu trung tính y khoa, mộc LAPD 1947, disclaimer phỏng dựng) |
| **C204** | `renders/still-C204.png` | Frame 50 | Chương 2: Báo cáo Đại bồi thẩm đoàn LA 1950 của Trung úy Frank Jemison | **ĐẠT** (Trích dẫn nguyên văn câu hồ sơ Margolis, nguồn LA Times 2025, băng nhãn tài liệu góc dưới) |
| **C310** | `renders/still-C310.png` | Frame 60 | Chương 3: Bàn giải mã mật mã Z13 (20/04/1970) | **ĐẠT** (13 ô ký tự rõ ràng, viền đỏ nổi bật 3 vị trí số 8 tại ô 5, 7, 9; mộc lưu trữ FBI Vault) |
| **C404** | `renders/still-C404.png` | Frame 50 | Chương 4: Bảng đối soát 13 chữ cái "MARVIN MERRILL" | **ĐẠT** (13 ô chữ cái thẳng hàng, trực quan thấy rõ vị trí 5-7-9 là I-M-R đối nghịch với Z13) |
| **C505** | `renders/still-C505.png` | Frame 50 | Chương 5: Đối chiếu thời gian quản chế và khoảng lặng Zodiac | **ĐẠT** (Biểu đồ 2 dải đỏ/xanh 1969–1975 trực quan hóa giả thuyết của Alex Baber) |
| **C604** | `renders/still-C604.png` | Frame 60 | Chương 6: Bìa sách Hollywood Babylon II (1984) của Kenneth Anger | **ĐẠT** (Chứng cứ phản biện đanh thép: ảnh tử thi đã in từ 1984, trước bức vẽ 1992 tới 8 năm) |
| **J703** | `renders/still-J703.png` | Frame 60 | Chương 7: Bảng tổng kết đối chiếu 2 đại án | **ĐẠT** (Bảng ghim 2 cột: Chứng cứ gián tiếp vs Giới hạn khoa học không thể bỏ qua) |

---

## 2. Kết luận Kiểm toán
10/10 still frame đại diện cho toàn bộ 8 chương của dự án đều đã được render thực tế, lưu tại thư mục `content/projects/2026-truecrime-zodiac-dahlia/renders/` và vượt qua 100% các tiêu chuẩn kiểm toán style-guard và đạo đức báo chí.
