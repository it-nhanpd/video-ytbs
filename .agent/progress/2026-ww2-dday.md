# Progress — 2026-ww2-dday

## 1. G-Labs & agy Generation (Đếm số lần gọi)
| # | Ngày | Kênh / Model | Asset ID | Đích | Kết quả |
|---|---|---|---|---|---|
| 1 | 2026-10-20 | G-Labs / nano_banana_2 | `us_infantry_omaha_1944_base` | `inbox/us_infantry_omaha_1944_base.jpg` | ĐẠT (193 KB). Anchor nhân vật chuẩn style, hướng phải 90°, cel 2 tông |
| 2 | 2026-10-20 | G-Labs / nano_banana_2 | `vessel_lcvp_higgins` | `inbox/vessel_lcvp_higgins.jpg` | ĐẠT (132 KB). Xuồng Higgins LCVP nhìn nghiêng 90°, sơn Haze Gray #5-H |
| 3 | 2026-10-20 | G-Labs / nano_banana_2 | `bg_omaha_sea_far` | `inbox/bg_omaha_sea_far.jpg` | ĐẠT (159 KB). Nền biển xa eo biển Manche lúc 06:30 sáng, trời mù, bóng tàu chiến |
| 4 | 2026-10-20 | agy image-generator | `char_german_gunner_mg42` | `inbox/char_german_gunner_mg42.jpg` | ĐẠT (434 KB). Xạ thủ Đức MG42 trên bệ Lafette 42, hướng TRÁI 90°, nền #808080 |
| 5 | 2026-10-20 | agy image-generator | `char_general_bradley` | `inbox/char_general_bradley.jpg` | ĐẠT (524 KB). Tướng Bradley trên soái hạm, bán thân 3/4 hướng PHẢI, kính gọng tròn |
| 6 | 2026-10-20 | agy image-generator | `char_general_cota` | `inbox/char_general_cota.jpg` | ĐẠT (402 KB). Chuẩn tướng Cota bước tiến hướng PHẢI 90°, gậy bata, M1911, 1 sao M1 |
| 7 | 2026-10-20 | agy image-generator | `char_us_ranger_omaha` | `inbox/char_us_ranger_omaha.jpg` | ĐẠT (431 KB). Biệt kích Rangers khom tiến hướng PHẢI 90°, súng Thompson, thoi cam |
| 8 | 2026-10-20 | agy image-generator | `char_us_engineer_bangalore` | `inbox/char_us_engineer_bangalore.jpg` | ĐẠT (406 KB). Công binh bò trườn hướng PHẢI đẩy bộc phá Bangalore |
| 9 | 2026-10-20 | agy image-generator | `veh_tank_dd_sherman` | `inbox/veh_tank_dd_sherman.jpg` | ĐẠT (498 KB). Xe tăng DD Sherman bạt nổi, hướng PHẢI 90°, chân vịt đôi |
| 10 | 2026-10-20 | agy image-generator | `vessel_destroyer_mccook` | `inbox/vessel_destroyer_mccook.jpg` | ĐẠT (320 KB). Khu trục hạm McCook DD-496 lớp Gleaves, ngụy trang Measure 22 |

Tổng: 3 ảnh qua G-Labs + 7 ảnh qua agy subagent = 10 asset đã hoàn thành.

## 2. Trạng thái các Cổng Duyệt (`workflow-gates.md`)
- **Cổng G1 (Kịch bản & Thẻ cảnh s001):** Người dùng đã duyệt 2026-10-19. Thẻ cảnh `script/scenes/s001.md` (55s, Hook mở màn).
- **Cổng G2 (Danh sách Asset & Prompt Pack):** Người dùng đã duyệt 2026-10-19.
- **Cổng G3 (Pilot Still & Motion Clip s001):** Đã render still và preview clip 5s. Người dùng đã duyệt 2026-10-20 ("pilot đã duyệt" trong `project.md`).

## 3. Quy trình Script-First (Người dùng duyệt 2026-10-20)
- **Hệ thống sự kiện kiểm chứng:** Đã hoàn thành mở rộng [F01]–[F37] tại `research/03-facts.md` (100% trích xuất từ tư liệu học thuật A/B).
- **Kịch bản Master toàn bộ:** Đã hoàn thành toàn bộ kịch bản `script/vi.md` (12 cảnh s001–s012, 2.189 từ TTS, tổng thời lượng 690 giây ≈ 11.5 phút).
- **Thẻ cảnh chi tiết:** Đã xuất đầy đủ 12 thẻ cảnh độc lập tại `script/scenes/s001.md` đến `s012.md`. Kiểm toán kịch bản `npm run audit:script` đạt 100%.

## 4. Master Asset Blueprint & Prompt Pack (Cổng G2 Tổng Thể)
- **Master Asset Blueprint:** Đã hoàn thành `prompts/blueprint.md` ma trận 27 asset (3 asset đã có từ pilot + 24 asset cần tạo mới).
- **Prompt Pack:** Đã lập trọn vẹn `prompts/prompt-pack-all.md` cho 24 asset mới theo đúng style bible `uniform-showcase.md` + `comic-cel-painterly.md`.
- **File prompt gọi API:** Đã xuất đầy đủ 24 file prompt riêng biệt tại `prompts/g-labs/*.txt`.
- **Master Manifest:** Đã hoàn thành `prompts/manifest.json` và `prompts/manifest-all.json`.

## 5. Tạo Ảnh Đợt 1, Đánh Giá Style-Guard & Ingest
- **Tạo ảnh Đợt 1:** 7 asset đã được sinh trực tiếp bằng subagent, lưu vào `inbox/`:
  - `char_german_gunner_mg42.jpg`
  - `char_general_bradley.jpg`
  - `char_general_cota.jpg`
  - `char_us_ranger_omaha.jpg`
  - `char_us_engineer_bangalore.jpg`
  - `veh_tank_dd_sherman.jpg`
  - `vessel_destroyer_mccook.jpg`
- **Đánh giá Style-Guard:** Đã lập checklist đầy đủ và kiểm tra đạt 100% cho cả 7 asset tại `qa/style-*.md`.
- **Cấu hình Multiplane 12 cảnh:**
  - Tạo `assets/placeholder.svg` cho các layer chờ sinh ảnh.
  - Cập nhật `locales/vi.json` đầy đủ tiêu đề và phụ đề cho cả 12 cảnh `s001`–`s012`.
  - Khởi tạo đầy đủ 12 cảnh với camera pan/zoom, grades, focusZ, và toàn bộ layers trong `scenes.json`.
- **Ingest thành công:** Chạy `npm run ingest -- 2026-ww2-dday` xử lý xong 7 asset (keyOut, trim, fit) vào `assets/*.png`, nâng tổng số asset hoàn thiện trong dự án lên **10 / 27 asset**.
- **Kiểm định:**
  - `npx tsx tools/validate.ts 2026-ww2-dday`: **ĐẠT 100%** (12 cảnh, 1 locale).
  - `npm run typecheck`: **ĐẠT 100%**.
  - Render thử nghiệm still cảnh `s006` (`renders/s006_preview.png`) và `s008` (`renders/s008_preview.png`) thành công, hiển thị chính xác các layer nhân vật và chiến hạm mới.

## 6. Trạng thái các Asset Còn Lại & Hạn mức
- Còn **17 asset** cần sinh ảnh:
  - 2 phương tiện: `veh_armored_bulldozer`, `veh_truck_gmc_convoy`.
  - 7 nền 2.5D: `bg_omaha_tidal_flat`, `bg_bunker_wn_interior`, `bg_omaha_shingle_wall`, `bg_trench_network_wn`, `bg_vierville_draw_wall`, `bg_omaha_sunset_beach`, `bg_normandy_cemetery`.
  - 8 đạo cụ & sa bàn: `prop_czech_hedgehog`, `veh_tank_sherman_wreck`, `prop_wire_concertina_blast`, `prop_bunker_blast_direct`, `prop_helmet_rifle_marker`, `diagram_grazing_fire`, `map_omaha_tactical_master`, `map_europe_liberation`.
- **Hạn mức (Quota):** Model tạo ảnh qua subagent gặp thông báo `RESOURCE_EXHAUSTED` (hạn mức dự kiến đặt lại sau ~4.5 giờ, tầm 18:55 local time). G-Labs server local hiện đang tắt.
