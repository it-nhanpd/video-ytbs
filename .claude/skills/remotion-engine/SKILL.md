---
name: remotion-engine
description: Quy ước và cách dùng engine Remotion của repo videos-system (schema zod, multiplane, rig nhân vật, ingest, lệnh render/still, lỗi đã gặp). Dùng khi sửa engine/src, scenes.json, dựng/render một cảnh, hoặc trước khi đọc skill Remotion chính thức.
---

# Engine Remotion của videos-system

API Remotion chung (spring, interpolate, Sequence, media...): đọc `remotion-best-practices`. Quy ước **của repo này**: file này. Khác nhau thì theo file này.

## Lệnh (Git Bash, chạy từ gốc repo)
| Việc | Lệnh |
|---|---|
| Studio | `npm run studio` |
| Render | `npm run render -- <compId> content/projects/<p>/renders/<x>.mp4` (đã có `--concurrency=2`) |
| Still | `npm run still -- <compId> <out.png> --frame=<n>` |
| Kiểm | `npm run typecheck`, `npm run validate` |
| Ingest | `npm run ingest -- <project> [assetId]` (có assetId thì chỉ xử lý asset đó; **không có thì xử lý lại mọi asset trong manifest**) |
- compId = `<project-bỏ-tiền-tố-năm>-<sceneId>`, ví dụ `german-army-uniforms-s010` (không phải `2026-german-...`). Danh sách: `engine/src/Root.tsx`.
- Người dùng tự render; Claude đưa lệnh, và dùng `still` để kiểm khung.

## Cấu trúc
- `content/` là publicDir: ảnh nạp bằng `staticFile('projects/<p>/assets/...')`.
- `engine/src/schema.ts`: nguồn sự thật (zod). `Project → scenes[] → layers[]`; layer là union theo `type`: sky, silhouette, fog, haze, image, rig, runner, burst, map, arena, fighters. Kiểu suy từ schema (`ProjectT`, `SceneT`, `LayerT`).
- `scenes.json` không chứa chữ hiển thị, chỉ khóa i18n trong `locales/<locale>.json`.
- `templates/MultiplaneScene.tsx`: sắp lớp theo z, camera (`x`/`zoom` + `shots` nhiều đoạn + rung cầm tay), `Layer.tsx` tính parallax `(z+0.5)/(focusZ+0.5)` và mờ DOF theo `|z−focusZ|`; `boil` (nét viền rung) tốn thời gian render.
- Màu/grade/font chỉ ở `theme.ts`.

## Lớp ảnh (`image`)
`tile` + `tileMode: 'wrap'` (lặp liền mạch, chu kỳ 1 ô) hoặc `'mirror'` (lật gương); `scrollMul` (nhân tốc độ trôi); `moveSec` (nội suy x/y theo giây thay vì cả cảnh); `showSec`; `blur`; `boil`. Công thức nhiều lớp: `content/library/styles/layer-recipe.md`.

## Nhân vật rig (`RigAsset.tsx` + `walkCycle.ts`)
- Một "bảng bộ phận" → `ingest splitParts` cắt thành bộ phận; động học thuận (FK), chu kỳ đi sinh bằng code (Catmull-Rom tuần hoàn), chân luôn chạm đất (theo gót/mũi hoặc cẳng chân thấp nhất), chân xa tối 0,78.
- Tham số layer: `poses` (walk/carry/aim theo mốc), `swaps` (đổi bộ phận theo giây), `weapon` (+`parent`, `attach`, `support` IK tay xa), `crouch` (0–1,5), `cycleSec`, `phase`, `groundY`, `height`.
- Z-order bộ phận: số `z` của bộ phận ×10 làm `zIndex`; súng z=17. **Thứ tự tay–súng quyết định "tay cầm" hay "súng nằm ngoài tay"** — kiểm bằng ảnh crop khi đổi.
- Bóng elip + bụi gót tính trong `RigAsset`; không có vòng callout (đã bỏ).

## Nhân vật dựng lại từ video tham chiếu (`runner`, `RunnerAsset.tsx`)
- Dùng khi cần chuyển động GIỐNG một video gốc (không phải đi bộ chung). Layer đọc JSON số đo theo hình (`track`, 27 hình @24 fps của `_ref-run20`), vẽ trong hệ khung gốc 2520×1080 ánh xạ theo chiều rộng. Thân trên+đầu+súng = một ảnh cứng; chân = đa giác vector liền (gối bo tròn phía ngoài, giao nhọn phía trong, đầu ống phẳng phủ lên xà cạp); tay tự do = tay áo trên đứng yên sau thân + cẳng tay quay quanh khuỷu.
- **Đo trước, dựng sau**: bộ đo ở `tools/run20-track/` (README có thứ tự 01→07, số đo rút ra, giới hạn). Chấm bằng số trên VIDEO RENDER (`qa-compare`, `qa-render-iou`), không bằng mắt hay mô phỏng.
- Bài học: (1) đo xem gốc làm gì trước khi đặt mục tiêu: gốc KHÔNG khóa chân vào đất; (2) độ rộng/vị trí đúng thường khác cảm giác (ống quần đúng mỏng hơn tưởng); (3) đa giác miter ở khớp gập sâu cho mũi nhọn, dùng cung tròn phía ngoài; (4) đặt tên script không kết thúc bằng tên thư viện có đoạn CLI (`boots.mjs`, `lib.mjs`).

## Quy trình ảnh → cảnh
`prompts/manifest.json` (assetId, process: crop/keyOut/keyColor/trim/fit/seamBlend/aspectFromImage/splitParts) → ảnh vào `inbox/` (G-Labs qua `tools/glabs.mjs`, `--ref` phải là đường dẫn tuyệt đối tồn tại) → `style-guard` → `ingest` → `scenes.json`. Luật cổng: `.claude/rules/workflow-gates.md`; khóa style: `style-lock.md`.

## Lỗi đã gặp
- Chạy script Node cần sharp từ ngoài repo thì lỗi import: đặt file tạm trong repo (`tools/_tmp_*`), xóa sau. Node trên Windows không hiểu đường dẫn kiểu `/d/...` của Git Bash: truyền `D:/...`.
- `--ref` của glabs sai đường dẫn → không tìm thấy file.
- `ingest` không filter chạy lại tất cả và có thể dừng giữa chừng khi một layer cũ đã bị xóa khỏi scenes.json.
- Nền xám tách: dùng `keyColor` đúng (xám 120, không phải 128); góc ảnh không phải màu nền thì không dùng được corner-average.
- `showSec` sai làm lớp che nhân vật cả đoạn đầu; luôn xem still ở giây 0, giữa và cuối.
- Chỉ xem ảnh tĩnh thì không biết chuyển động đúng không: xuất chuỗi khung liên tiếp (8 khung/chu kỳ bước) hoặc nhờ người dùng xem clip.
