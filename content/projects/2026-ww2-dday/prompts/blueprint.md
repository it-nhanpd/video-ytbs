# Master Asset Blueprint: D-Day 1944 — Bãi Biển Omaha
*Dự án: `2026-ww2-dday` (12 cảnh, ~11.5 phút)*
*Style Bible: `content/library/styles/uniform-showcase.md` + `comic-cel-painterly.md` + `layer-recipe.md`*
*Mục đích: Thiết lập danh mục tài nguyên dùng chung, tối đa hóa hệ số tái sử dụng (Asset Multiplier) cho toàn bộ 12 cảnh.*

---

## 1. Bảng Ma Trận Khai Thác Asset (Asset Matrix)

| # | Asset ID | Loại | Tỉ lệ / Khung | Anchor / Ref | Cảnh sử dụng | Tái sử dụng | Trạng thái |
|---|---|---|:---:|:---:|---|:---:|:---:|
| **1** | `us_infantry_omaha_1944_base` | Nhân vật | 1:1 | Anchor gốc | s001, s002, s003, s005, s008, s009, s011, s012 | **8 cảnh** | **ĐÃ CÓ (Final)** |
| **2** | `vessel_lcvp_higgins` | Phương tiện | 16:9 (5:2 fit) | Bản vẽ LCVP | s001, s002, s011 | **3 cảnh** | **ĐÃ CÓ (Final)** |
| **3** | `bg_omaha_sea_far` | Nền | 16:9 | Bờ biển sương mù | s001, s003, s008 | **3 cảnh** | **ĐÃ CÓ (Final)** |
| **4** | `prop_czech_hedgehog` | Đạo cụ | 1:1 / 4:3 | Nhím thép chống tăng | s002, s005 | **2 cảnh** | Cần tạo mới |
| **5** | `bg_omaha_tidal_flat` | Nền | 16:9 | Bãi triều cát ướt | s002, s003 | **2 cảnh** | Cần tạo mới |
| **6** | `veh_tank_dd_sherman` | Phương tiện | 16:9 (5:2 fit) | DD Sherman bạt nổi | s003, s010 | **2 cảnh** | Cần tạo mới |
| **7** | `veh_tank_sherman_wreck` | Đạo cụ | 16:9 | Xác xe tăng cháy | s003, s011 | **2 cảnh** | Cần tạo mới |
| **8** | `bg_bunker_wn_interior` | Nền | 16:9 | Nội thất WN62 | s004 | 1 cảnh | Cần tạo mới |
| **9** | `char_german_gunner_mg42` | Nhân vật | 1:1 | Xạ thủ Đức MG42 | s004, s009 | **2 cảnh** | Cần tạo mới |
| **10** | `diagram_grazing_fire` | Sa bàn | 16:9 | Sơ đồ góc bắn bạt | s004 | 1 cảnh | Cần tạo mới |
| **11** | `bg_omaha_shingle_wall` | Nền | 16:9 | Bờ đê đá cuội shingle | s005, s006, s007 | **3 cảnh** | Cần tạo mới |
| **12** | `char_general_bradley` | Nhân vật | 1:1 | Tướng Bradley Augusta | s005 | 1 cảnh | Cần tạo mới |
| **13** | `char_general_cota` | Nhân vật | 1:1 | Chuẩn tướng Cota M1 | s006 | 1 cảnh | Cần tạo mới |
| **14** | `char_us_ranger_omaha` | Nhân vật | 1:1 | Biệt kích Rangers | s006 | 1 cảnh | Cần tạo mới |
| **15** | `char_us_engineer_bangalore` | Nhân vật | 16:9 | Công binh bộc phá | s007 | 1 cảnh | Cần tạo mới |
| **16** | `prop_wire_concertina_blast` | Đạo cụ | 16:9 | Kẽm gai bộc phá nổ | s007 | 1 cảnh | Cần tạo mới |
| **17** | `vessel_destroyer_mccook` | Phương tiện | 16:9 (5:2 fit) | Khu trục McCook DD-496 | s008 | 1 cảnh | Cần tạo mới |
| **18** | `prop_bunker_blast_direct` | Đạo cụ | 16:9 | Boongke trúng đạn pháo | s008 | 1 cảnh | Cần tạo mới |
| **19** | `map_omaha_tactical_master` | Sa bàn | 16:9 | Bản đồ tổng thể Omaha | s002, s003, s005, s009, s010, s011 | **6 cảnh** | Cần tạo mới |
| **20** | `bg_trench_network_wn` | Nền | 16:9 | Chiến hào đỉnh đồi | s009 | 1 cảnh | Cần tạo mới |
| **21** | `veh_armored_bulldozer` | Phương tiện | 16:9 (5:2 fit) | Xe ủi D7 bọc thép | s010 | 1 cảnh | Cần tạo mới |
| **22** | `veh_truck_gmc_convoy` | Phương tiện | 16:9 (5:2 fit) | Đoàn xe tải GMC 2.5t | s010 | 1 cảnh | Cần tạo mới |
| **23** | `bg_vierville_draw_wall` | Nền | 16:9 | Hẻm đá Vierville D-1 | s010 | 1 cảnh | Cần tạo mới |
| **24** | `bg_omaha_sunset_beach` | Nền | 16:9 | Bãi biển hoàng hôn | s011 | 1 cảnh | Cần tạo mới |
| **25** | `prop_helmet_rifle_marker` | Đạo cụ | 1:1 / 4:3 | Mũ sắt cắm báng súng | s011 | 1 cảnh | Cần tạo mới |
| **26** | `bg_normandy_cemetery` | Nền | 16:9 | Nghĩa trang Normandie | s012 | 1 cảnh | Cần tạo mới |
| **27** | `map_europe_liberation` | Sa bàn | 16:9 | Bản đồ giải phóng Tây Âu | s012 | 1 cảnh | Cần tạo mới |

---

## 2. Thống Kê & Hiệu Suất Tái Sử Dụng

- **Tổng số asset phục vụ 12 cảnh:** 27 asset.
- **Asset đã hoàn thiện từ Pilot s001:** 3 asset (`us_infantry_omaha_1944_base`, `vessel_lcvp_higgins`, `bg_omaha_sea_far`).
- **Asset cần tạo mới:** **24 asset** gồm:
  - **Nhân vật:** 5 asset.
  - **Phương tiện:** 4 asset.
  - **Nền 2.5D:** 7 asset.
  - **Đạo cụ & Sa bàn bản đồ:** 8 asset.
- **Hệ số nhân tài nguyên (Asset Multiplier):**
  - Trung bình mỗi cảnh cần 3–4 layer ảnh, tổng cộng ~42 lượt xuất hiện asset trên 12 cảnh.
  - Nhờ tái sử dụng lính Mỹ (8 cảnh), bản đồ tổng thể (6 cảnh), xuồng đổ bộ (3 cảnh), bờ đê đá cuội (3 cảnh), ta tiết kiệm được hơn **40% số lượt tạo ảnh** so với việc vẽ độc lập từng cảnh!

---

## 3. Quy Cách Kỹ Thuật Bắt Buộc Theo Nhóm

### Nhóm A: Nhân vật & Đạo cụ tách nền (`keyOut: true`)
- **Nền:** Màu xám trung tính phẳng tuyệt đối `#808080`, không gradient, không bóng đổ dưới chân.
- **Lề an toàn:** Cách mép ảnh tối thiểu 10–12%, góc dưới bên phải trống hoàn toàn để crop watermark Nano Banana.
- **Nét vẽ:** Cel animation viền mực đen dày đều đặn, đổ bóng 2 tông (light/shadow), không mờ chuyển động, không photorealism.
- **Hướng:**
  - Lính Mỹ, xe cộ phe Đồng minh: hướng nhìn sang **PHẢI** (hướng tiến công).
  - Lính Đức, cứ điểm phòng ngự: hướng nhìn sang **TRÁI** (hướng phòng thủ chặn đầu).

### Nhóm B: Phương tiện & Vật thể cơ giới
- **Khung hình:** Khung ngang 16:9 (khi ingest ép fit chuẩn 2000×800 theo tỉ lệ 5:2).
- **Quy cách:** Nhìn nghiêng đúng 90 độ (strict side profile), tách rời khỏi mặt đất để code Remotion kiểm soát độ rung nhấp nhô (`bobPx`).

### Nhóm C: Nền phong cảnh 2.5D (Environment Plates)
- **Khung hình:** 1920×1080 (16:9), phủ trọn màn hình.
- **Đặc trưng:** Nét vẽ painterly mềm mại, không có viền mực đen cứng, phân tách lớp tiền cảnh/hậu cảnh bằng độ sâu trường ảnh (depth of field) và mây mù mờ ảo.
- **Bảng màu:** Bão hòa thấp, trầm mặc theo gam màu dã chiến `misty_green` / `ochre_dusk` để tôn nổi nhân vật chính.
