# test-huey — bài test end-to-end

- **Mục đích:** đi hết chuỗi spec → prompt pack → asset → render với 1 cảnh. Không phải video thật.
- **Locale:** vi (key i18n trong `locales/vi.json`, `scenes.json` không chứa text cứng)
- **Khung:** 1920×1080, 24fps, letterbox 2.35:1
- **Tham chiếu hình ảnh:** frame trực thăng Huey hoàng hôn vàng đất (nền gradient cam, hàng cây bóng phẳng, cánh quạt mờ)

## Cảnh
| id | thời lượng | nội dung | grade |
|---|---|---|---|
| s001 | 8s | Huey bay ngang từ phải sang trái lúc hoàng hôn | ochre_dusk |

## Asset dùng
| assetId | nguồn hiện tại | nguồn final | trạng thái |
|---|---|---|---|
| huey_side | `library/vehicles/uh1-huey/placeholder.svg` (SVG tự vẽ) | Nano Banana, `inbox/huey_side.png` | placeholder |
| mọi lớp khác | sinh bằng code | giữ nguyên hoặc thay bằng ảnh Nano Banana | code |

## Quy trình đã đi qua
1. `scenes.json` + `locales/vi.json` (spec)
2. `prompts/s001.md` + `prompts/manifest.json` (prompt pack)
3. `npm run validate`
4. Render placeholder → `renders/s001_placeholder.mp4`
5. (Bạn) tạo ảnh Nano Banana → thả vào `inbox/` → `npm run ingest` → render `renders/s001_final.mp4`
