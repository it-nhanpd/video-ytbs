# Progress — 2026-ww2-dday

## 1. G-Labs (đếm số lần gọi)
| # | Ngày | Model | Tỉ lệ | Đích | Kết quả |
|---|---|---|---|---|---|
| 1 | 2026-10-20 | nano_banana_2 | 1:1 | `content/projects/2026-ww2-dday/inbox/us_infantry_omaha_1944_base.jpg` | ĐẠT (193 KB). Anchor nhân vật chuẩn style, hướng phải 90°, cel 2 tông, tách nền sạch |
| 2 | 2026-10-20 | nano_banana_2 | 16:9 | `content/projects/2026-ww2-dday/inbox/vessel_lcvp_higgins.jpg` | ĐẠT (132 KB). Xuồng Higgins LCVP nhìn nghiêng 90°, sơn Haze Gray #5-H |
| 3 | 2026-10-20 | nano_banana_2 | 16:9 | `content/projects/2026-ww2-dday/inbox/bg_omaha_sea_far.jpg` | ĐẠT (159 KB). Nền biển xa eo biển Manche lúc 06:30 sáng, trời mù, bóng tàu chiến |

Tổng: 3 lần gọi (model nano_banana_2).

## 2. Trạng thái các Cổng Duyệt (`workflow-gates.md`)
- **Cổng G1 (Kịch bản & Thẻ cảnh s001):** Người dùng đã duyệt 2026-10-19 ("implement continue"). Thẻ cảnh `script/scenes/s001.md` (55s, Hook mở màn).
- **Cổng G2 (Danh sách Asset & Prompt Pack):** Người dùng đã duyệt 2026-10-19 ("đồng ý"). Đã sinh prompt pack tại `prompts/s001.md` và `prompts/manifest.json`.
- **Tạo ảnh & Ingest:**
  - Đã chạy G-Labs 3 ảnh vào `inbox/`.
  - Đã kiểm tra `style-guard` đạt cả 3 (`qa/style-*.md`).
  - Đã hiệu chỉnh `manifest.json`: đặt `minHolePx: 999999` để tránh flood-fill nhầm thân xuồng màu xám; đo bounding box crop chính xác.
  - Ingest thành công 3 asset vào `assets/`.
- **Cấu hình Engine Remotion & Render:**
  - Cấu hình multiplane trong `scenes.json`: căn chỉnh tọa độ tâm (center-aligned `x: [0.5, 0.5]`), đặt lính Mỹ đứng trong lòng xuồng (`z: 2.9`, xuồng `z: 3.0`, `y: [0.585, 0.605]`).
  - Đăng ký `ww2ProjectJson` vào `engine/src/Root.tsx`.
  - `npm run validate` và `npm run typecheck` đạt 100%.
  - Render still hoàn thiện: `renders/s001_pilot_still_final.png` (khớp bố cục, lính nhô nửa người trên thành xuồng, sóng biển bao trọn khung hình).
- **Cổng G3 (Pilot Still & Motion Clip):**
  - Khung hình still hoàn thiện đã sẵn sàng tại `renders/s001_pilot_still_final.png`.
  - Trạng thái hiện tại: Đang ở Cổng G3 (chờ nhận xét khung still / clip chuyển động từ người dùng trước khi sản xuất loạt).
