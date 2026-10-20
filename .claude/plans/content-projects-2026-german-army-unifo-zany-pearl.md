# Sửa lỗi sau code review s010 (so với tham chiếu)

## Context
Đã review (/code-review high) bản s010 mới nhất so với ảnh tham chiếu (`qa/s010_vs_ref.png`, `renders/check_s010.png`) và diff chưa commit ở `engine/src`, `tools`. Phát hiện: tính năng đổi bộ phận 1936→1944 thiếu hiệu ứng/callout theo đặc tả, validate bỏ sót lỗi gây crash, ingest có lỗi hình ảnh (quầng màu) và lỗi lệch dữ liệu. Kế hoạch dưới đây sửa theo thứ tự ưu tiên; mỗi bước nhỏ, kiểm bằng typecheck + validate + still s010.

## Bước (ưu tiên giảm dần)
1. **RigAsset swap + callouts** — `engine/src/components/RigAsset.tsx`: thêm chớp sáng ngắn (~6 khung) quanh thời điểm swap và vẽ `callouts` (vòng + nhãn i18n key) theo schema có sẵn; màu lấy từ `theme.ts`.
2. **validate rig** — `tools/validate.ts`: kiểm `weapon.parent` tồn tại trong parts, file `weapon.src` tồn tại, `swaps[].fromLayer` là layer rig có thật và `part` có trong layer đó.
3. **angleSet** — `engine/src/walkCycle.ts:177`: sắp xếp poses theo `atSec`; nếu pose đầu `atSec <= 0` thì không blend từ `walk`.
4. **seamBlend** — `tools/ingest.ts:464`: blend theo alpha premultiplied; từ chối `seamBlend > 0.5` (hoặc clamp) để không đọc tràn hàng.
5. **keyColor cho rig/sprite** — `tools/ingest.ts:195, 313`: truyền `p.keyColor` vào `keyOut`.
6. **ingest không exit giữa chừng** — `tools/ingest.ts:296`: kiểm layer trước khi ghi PNG; lỗi thì gom lại, vẫn lưu `scenes.json` cho asset đã xong, cuối cùng exit 1.
7. **Camera rung** — `engine/src/templates/MultiplaneScene.tsx:55`: thêm trường scene `handheld` (mặc định tắt hoặc 0), kẹp zoom ≥ 1.
8. **Filter boil** — `engine/src/components/Layer.tsx:22`: id dùng `useId()` thay vì `boil-${z}`.
9. **Màu cứng** — `Burst.tsx`, `RigAsset.tsx`, `Chip.tsx`, `LowerThird.tsx`: chuyển sang token trong `theme.ts`.
10. **Layer ẩn** — `MultiplaneScene.tsx:79`: bỏ qua render layer `opacity === 0` (vẫn giữ dữ liệu để swap đọc).
11. **Hardcode `bg`** — `tools/ingest.ts:498`: thay bằng trường manifest rõ ràng (vd `replacesLayers: [...]`).

## Ngoài code (cần người dùng quyết)
- Tiền cảnh lá dày hơn như tham chiếu → bổ sung lớp fg theo `layer-recipe.md` (cần G2 duyệt số ảnh).
- Tay mở trên súng → sửa pose/ảnh tay nắm.
- Phù hiệu ngực áo 1936 → đối chiếu `style-lock.md` trước khi duyệt.

## Kiểm chứng
- `npm run typecheck`, `npm run validate`.
- `npm run still -- 2026-german-army-uniforms-s010 ...` tại 0s, 56s, 60s, 71s; so với `qa/s010_vs_ref.png`.
- Render `rig-demo-walk` để chắc không hồi quy (không rung nếu tắt handheld).
