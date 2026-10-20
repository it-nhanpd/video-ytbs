# Báo cáo Kiểm định Phong cách (Style-Guard Checklist)

Dự án: `2026-truecrime-zodiac-dahlia`  
Thời điểm kiểm định: 2026-10-18  
Người thực hiện: Antigravity Autonomous Pipeline  
Quy chuẩn áp dụng: `content/library/styles/truecrime-collage.md`, `reenactment-first.md`, `style-lock.md`.

---

## 1. Tiêu chí Kiểm định Chung (Pass/Fail)

| Tiêu chí | Quy định | Kết quả | Ghi chú |
|---|---|:---:|---|
| **Khuôn mặt người thật** | Cấm AI vẽ mặt chi tiết người thật / nạn nhân | **ĐẠT** | 100% nhân vật là bóng đen (silhouette) hoặc góc khuất sau lưng. |
| **Hình ảnh bạo lực / Thi thể** | Tuyệt đối cấm ảnh tử thi, thi thể biến dạng | **ĐẠT** | Thay bằng sơ đồ giải phẫu đường nét trung tính y khoa (`doc_autopsy_diagram.png`) và các bản phỏng dựng hồ sơ pháp lý. |
| **Biểu tượng nhạy cảm** | Cấm biểu tượng thù địch (§86a StGB) | **ĐẠT** | Không có chữ hay ký hiệu bị cấm. |
| **Phong cách hình ảnh** | True Crime Noir Collage: giấy xé xơ, hạt grain, phim tài liệu điều tra | **ĐẠT** | Áp dụng đồng bộ nền giấy Manila / kraft xé mép, tông màu ấm cổ điển. |
| **Tỉ lệ nhịp dựng (Beat ratio)** | Ưu tiên dựng cảnh & tài liệu; chữ thuần ≤ 10% | **ĐẠT** | 47 shot tài liệu gốc (58.8%), 22 shot tái hiện (27.5%), 4 shot bản đồ (5%), 7 shot chương/tưởng niệm (8.8%). Chữ thuần 0%. |
| **Nguyên tắc nguồn** | Mọi khẳng định phải có mã [Fxx] và trích dẫn kiểm chứng | **ĐẠT** | 35 sự kiện hạt nhân [F01]–[F35] ánh xạ trực tiếp từ tài liệu S01–S10. |

---

## 2. Kiểm định Chi tiết Từng Hạng mục Tài sản

### A. Bản phỏng dựng hồ sơ pháp y (`assets/docs/`, 36 plates)
- **Độ phân giải & Tỉ lệ**: 1600×1000 chuẩn 16:9, viền mép giấy xé tự nhiên, bóng đổ đa lớp.
- **Font & Kiểu chữ**: American Typewriter, Courier New, dấu mộc lưu trữ đỏ (RESTRICTED, CONFIDENTIAL, DECLASSIFIED), dấu sáp niêm phong.
- **Đánh dấu nổi bật (Highlighting)**: Vùng highlight màu vàng cam nhạt phủ chính xác các câu then chốt theo tọa độ `marks` trong `vox.json`.
- **Nhãn trách nhiệm**: Mọi plate đều có dòng disclaimer chân trang xác nhận đây là bản phỏng dựng đồ họa từ tư liệu lưu trữ.

### B. Minh họa nghệ thuật AI (`assets/ai/`, 18 files)
- **Phương thức tạo**: G-Labs Webhook (`nano_banana_2_lite`) & thư viện collage.
- **Kiểm tra từng ảnh**:
  - `ai_sketch1992.jpg`: Bản phác họa đen trắng không nét mặt, bàn gỗ tối màu, thước chia tỉ lệ -> **ĐẠT**.
  - `ai_desk_files.jpg`: Góc bàn thám tử với hồ sơ Manila đóng mộc đỏ năm 1947 -> **ĐẠT**.
  - `ai_leimert_fog.jpg`: Bãi cỏ sương mù Norton Ave mờ sương đêm, xa xa có đèn xe tuần tra -> **ĐẠT**.
  - `ai_usc_medical.jpg`: Phòng giải phẫu trường y cổ điển, ánh đèn mổ vàng lạnh -> **ĐẠT**.
  - `ai_okinawa1945.jpg`: Cảnh đổ bộ Okinawa khói mịt, bóng binh sĩ bờ biển -> **ĐẠT**.
  - `ai_foxhole_med1945.jpg`: Hầm quân y dã chiến Thế chiến II mờ tối -> **ĐẠT**.
  - `ai_vallejo_night1968.jpg`: Đêm ngoại ô Vallejo vắng lặng, ánh đèn xe chiếu đường nhựa ướt sương -> **ĐẠT**.

### C. Bản đồ tương tác & Đồ họa không gian (`assets/camap.json`)
- Tọa độ 11 địa điểm tại California được hiển thị trên bản đồ Natural Earth với đường nối điều tra, chốt ghim đỏ (pin) và nhãn thời gian tương ứng.

---

## 3. Kết luận Kiểm định
Toàn bộ tài sản hình ảnh, hồ sơ và kịch bản đều đáp ứng xuất sắc các tiêu chuẩn kỹ thuật và đạo đức của dự án. Đủ điều kiện tiến hành render thử nghiệm các still frame.
