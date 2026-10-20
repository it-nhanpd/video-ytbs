# Tiến độ & Bàn giao (Handoff): `2026-german-army-uniforms`

**Cập nhật lần cuối:** 2026-10-16 18:20 (+07:00)  
**Thư mục dự án:** `content/projects/2026-german-army-uniforms/`  
**Quy trình chuẩn:** `content/projects/2026-german-army-uniforms/PLAYBOOK.md` (bản gốc `templates/NEW_PROJECT_PLAYBOOK.md`)

---

## 1. Các quyết định cốt lõi đã chốt với người dùng

1. **Nguyên tắc làm việc (Workflow Rule bắt buộc):**
   - **KHÔNG tự ý thực hiện ngay khi có yêu cầu** mà phải **kiểm tra, phân tích và trình bày phương án / đặc tả kỹ thuật (Specs) trước để người dùng duyệt**, chỉ khi người dùng xác nhận mới bắt tay vào sửa file hay chạy lệnh.
2. **Phạm vi & Nội dung lịch sử:**
   - Chủ đề: Sự tiến hóa quân phục lục quân Đức, **phạm vi D' (1871 → 2026)**, đi theo trục xuyên suốt **"Quy định so với Thực tế chiến trường"**, lược bớt vũ khí (tập trung vào mũ, áo, quần, giày, trang bị cá nhân).
   - Bám sát 5 hướng khác biệt: (1) giải thích vì sao thay đổi; (2) so sánh cạnh nhau trên cùng tỉ lệ cơ thể; (3) đối chiếu quy định vs thực tế; (4) chỉ kể chuyện qua quân phục; (5) mở đầu bằng câu hỏi/hình ảnh đối lập.
   - Chỉ mượn **style đồ họa** của video tham chiếu (`5nX9uVBi95s` — `comic-cel-painterly`); cấu trúc, nội dung và câu chữ viết mới hoàn toàn từ nguồn kiểm chứng (`[Fxx]`).
3. **Kiến trúc kỹ thuật của dự án (Không dùng AI tạo Video):**
   - Dự án sử dụng **Remotion (`engine/src/`)** kết xuất các lớp ảnh tĩnh 2D (`type: "image"`) kết hợp hiệu ứng multiplane parallax (`sky`, `silhouette`, `fog`, `haze`, `camera`, `lowerThird`), **KHÔNG dùng Agent/AI tạo video clip (Image-to-Video)**.
   - Đã loại bỏ toàn bộ các mục "Prompt Image-to-Video" khỏi `script/shotlist.md` và `prompts/s001.md` → `s014.md`.

---

## 2. Những gì đã hoàn thành (Bước 0 → Bước 4 hiện tại)

| Bước | Hạng mục | Trạng thái | File kết quả chính |
|---|---|---|---|
| **Bước 0–1** | Khởi tạo dự án, phân tích tham chiếu & chốt phạm vi D' | **Hoàn tất** | `project.md`, `PLAYBOOK.md`, `research/00-reference.md`, `research/01-scope.md` |
| **Bước 2** | Nghiên cứu nguồn & sự kiện 7 chương (`ch01`–`ch07`) + Viết kịch bản nháp tiếng Việt gắn mã `[Fxx]` | **Hoàn tất** | `research/02-sources.md`, `research/03-facts.md`, `research/04-open-questions.md`, `research/ch04..ch07/*`, `script/vi.md` |
| **Bước 3** | Lập Shotlist 14 cảnh (`s001`–`s014`), 14 thẻ nhân vật trong `library`, Prompt Pack (`s001.md`–`s014.md` + `manifest.json`), khung `scenes.json` & `locales/vi.json` | **Hoàn tất (bản ảnh đơn)** | `script/shotlist.md`, `prompts/s001.md`..`s014.md`, `prompts/manifest.json`, `content/library/characters/<id>/*`, `content/library/INDEX.md` |
| **Bước 4** | Tạo đủ 14 ảnh trong `inbox/`, hiệu chỉnh `crop` + `keyOut` trong `manifest.json`, chạy `ingest` tách nền ra 14 file `.png` (`2000×800`), đăng ký `Root.tsx`, chạy `validate` & xuất thử 14 still (`out/s001.png`–`out/s014.png`) | **Hoàn tất kỹ thuật tách nền, nhưng phát hiện vấn đề thiếu chuyển động bước đi (xem Mục 3 & 4)** | `inbox/*.jpg` (14 ảnh), `assets/*.png` (14 ảnh), `scenes.json`, `locales/vi.json`, `engine/src/Root.tsx` |

### Danh sách 14 nhân vật (`assetId`) đã tạo trong `inbox/` và `assets/`:
1. `de_prussia_infantry_1871` — Bộ binh Phổ 1871 (Mũ da Pickelhaube, áo Dunkelblau) — dùng ở `s001, s002, s003`
2. `de_schutztruppe_soldier_1896` — Lính Schutztruppe Tây Nam Phi 1896 (Mũ Südwester, kaki) — dùng ở `s004`
3. `de_askari_infantry_1914` — Bộ binh Askari Đông Phi 1914 (Mũ Tarbusch có tấm che gáy, kaki) — dùng ở `s005`
4. `de_heer_ersatz_1915` — Bộ binh Đức 1914–1915 (Áo Feldgrau M1907/10, mũ Pickelhaube nỉ Ersatz) — dùng ở `s006`
5. `de_heer_infantry_1916` — Bộ binh Đức 1916–1918 (Mũ thép Stahlhelm M1916, áo Bluse M1915) — dùng ở `s001, s007`
6. `de_reichswehr_infantry_1921` — Bộ binh Reichswehr Cộng hòa Weimar 1921 — dùng ở `s008`
7. `de_reichswehr_transition_1934` — Bộ binh chuyển giao sang Wehrmacht 1934–1935 (Mũ M35, phù hiệu ngực) — dùng ở `s009`
8. `de_wehrmacht_infantry_1936` — Bộ binh Heer 1936 (Feldbluse M36 cổ xanh đậm, ủng cao cổ) — dùng ở `s010`
9. `de_wehrmacht_infantry_1944` — Bộ binh Heer cuối 1944 (Áo ngắn Feldanzug 44 vải tái chế, mũ M42, giày thấp cổ + ghệt) — dùng ở `s010, s011`
10. `de_bundeswehr_soldier_1956` — Bộ binh Tây Đức Bundeswehr 1956 (Mũ kiểu M1, rằn ri Splittertarn) — dùng ở `s012`
11. `de_nva_soldier_1956` — Bộ binh Đông Đức NVA 1956 (Mũ thép vát M56, quân phục Steingrau) — dùng ở `s012`
12. `de_bundeswehr_flecktarn_1991` — Bộ binh Bundeswehr sau thống nhất 1991 (Flecktarn 5 màu, mũ M92) — dùng ở `s013`
13. `de_bundeswehr_tropentarn_2002` — Bộ binh Bundeswehr phái bộ quốc tế 2002 (Tropentarn 3 màu sa mạc) — dùng ở `s013`
14. `de_bundeswehr_kbssk_2026` — Bộ binh Bundeswehr hiện đại 2022–2026 (Hệ thống KBS SK & Multitarn 6 màu) — dùng ở `s014`

---

## 3. Vấn đề phát hiện ở Bước 4 (Tại sao cần dừng lại và nâng cấp Specs)

- **Vấn đề:** Ở bài mẫu `2026-test-huey`, chủ thể là chiếc trực thăng UH-1D có thân cứng bay ngang bầu trời và cánh quạt được vẽ quay bằng code (`Rotors` trong `ImageAsset.tsx`), nên chỉ cần 1 ảnh tĩnh thân máy bay là có cảm giác bay thật. Ngược lại, với dự án `2026-german-army-uniforms`, chủ thể là **những người lính bộ binh đi qua các giai đoạn lịch sử**. Việc tạo **1 ảnh người lính đứng nghiêm tĩnh** rồi chỉ dịch chuyển tọa độ `x` làm nhân vật trông như hình cắt giấy trượt trên mặt đất, không có chuyển động bước đi thực sự.
- **Hướng giải quyết (do người dùng chỉ đạo):**
  - Phải tạo **1 ảnh gốc chứa nhiều tư thế chuyển động bước đi (Sprite Sheet / Walk-Cycle Sheet)** trên cùng nền xám `#808080`.
  - Sau đó dùng công cụ (`tools/ingest.ts`) **tách ảnh đó ra thành các frame chuyển động** và phát lặp tuần tự các frame trong Remotion (`ImageAsset.tsx`) khi nhân vật di chuyển ngang qua khung cảnh.

---

## 4. Đặc tả kỹ thuật (Specs) chờ duyệt khi tiếp tục ở máy mới

### 4.1. Quy cách tạo 1 ảnh chứa nhiều tư thế bước đi (Input Walk-Cycle Sheet Spec)
- Mỗi nhân vật (`assetId`) tạo **1 ảnh ngang duy nhất (`16:9`, `1376 × 768`, nền xám phẳng `#808080`)** chứa **4 tư thế bước đi (4-frame walk cycle)** xếp thành 1 hàng ngang từ trái sang phải, nhìn ngang 90° hướng sang trái (`strict 90-degree side profile facing LEFT`):
  1. **Frame 1 (Left Contact — Chạm đất trái):** Chân trái bước ra trước chạm gót, chân phải duỗi sau, tay phải đánh nhẹ ra trước.
  2. **Frame 2 (Left Passing/Down — Chuyển trụ trái):** Chân trái trụ thẳng chịu lực, chân phải nhấc co lướt qua mắt cá trái, hai tay thu gần thân.
  3. **Frame 3 (Right Contact — Chạm đất phải):** Chân phải bước ra trước chạm gót, chân trái duỗi sau, tay trái đánh nhẹ ra trước.
  4. **Frame 4 (Right Passing/Up — Chuyển trụ phải):** Chân phải trụ thẳng, chân trái nhấc co lướt qua mắt cá phải.
- **Ràng buộc kỹ thuật bắt buộc trong Prompt:**
  - Cả 4 tư thế trên cùng 1 ảnh phải **cùng tỉ lệ cơ thể, cùng chiều cao đầu, cùng đường mặt đất (`baseline`)** và **cách nhau một khoảng trống nền xám `#808080` tối thiểu 40–60px** (không chạm tay/chân vào nhau).
  - Nền xám `#808080` phẳng tuyệt đối, không bóng đổ dưới chân, góc dưới phải trống tránh watermark.

### 4.2. Quy cách tách Frame tự động trong `tools/ingest.ts` & `prompts/manifest.json`
- Bổ sung cấu hình `splitFrames` vào `process` trong `prompts/manifest.json`:
  ```json
  "process": {
    "crop": { "left": 80, "top": 20, "width": 1150, "height": 720 },
    "keyOut": true,
    "keyTolerance": 35,
    "minHolePx": 800,
    "splitFrames": {
      "count": 4,
      "minGapPx": 10,
      "frameFit": { "width": 800, "height": 800 }
    }
  }
  ```
- **Quy trình xử lý trong `tools/ingest.ts`:**
  1. `crop` vùng chứa 4 tư thế (loại bỏ watermark góc phải) → `keyOut` xóa nền `#808080` sang kênh alpha trong suốt.
  2. Quét tổng alpha theo từng cột dọc `X` để tự động tìm khoảng trống (`alpha == 0`) giữa các tư thế và cắt tách thành `N` frame rời (`Frame 1..4`).
  3. **Đồng bộ tỉ lệ & mặt đất:** Dùng chung một hệ số `scale` cho cả 4 frame; căn đáy đế giày (`bottom`) của cả 4 frame chạm cùng một đường `baseline` và căn trục trọng tâm ngang (`centerX` của phần thân/đầu) trùng nhau.
  4. Xuất ra `assets/<assetId>_f1.png` .. `<assetId>_f4.png` (hoặc 1 file sprite strip) và tự động cập nhật mảng `frames: [...]` vào layer tương ứng trong `scenes.json`.

### 4.3. Quy cách hiển thị & hoạt họa trong Engine (`engine/src/schema.ts` & `ImageAsset.tsx`)
1. **Trong `engine/src/schema.ts` (`ImageLayer`):**
   - Thêm thuộc tính tùy chọn (giữ tương thích ngược 100% với `2026-test-huey`):
     - `frames: z.array(z.string()).optional()` — danh sách các frame đã tách.
     - `frameFps: z.number().default(6)` — tốc độ chuyển tư thế bước chân (mặc định `6 fps` trên nền video `24 fps`, tức mỗi tư thế giữ `4 frame`, tương đương 1,5 bước/giây).
2. **Trong `engine/src/components/ImageAsset.tsx`:**
   - Khi layer có `frames`:
     ```ts
     const frameIdx = Math.floor((frame / fps) * (layer.frameFps ?? 6)) % layer.frames.length;
     const activeSrc = layer.frames[frameIdx];
     ```
   - Kết hợp với nội suy tọa độ ngang `x: [from, to]` để nhân vật bước đi xuyên qua khung cảnh đồng bộ với chuyển động parallax của `camera.x` và các lớp `treeline_near` / `foreground`.

### 4.4. Ba câu hỏi cần chốt khi mở lại dự án ở máy mới
1. **Số tư thế trên 1 ảnh gốc:** Chốt **4 tư thế (4-frame walk cycle)** hay **6 tư thế** trên 1 ảnh ngang `1376×768`? *(Khuyến nghị: 4 tư thế để mỗi hình đủ lớn ~250px chiều ngang, nét vẽ chi tiết và các dáng cách xa nhau dễ tách tự động).*
2. **Định dạng lưu sau khi tách (`ingest`):** Xuất thành **4 file PNG rời (`<id>_f1.png`..`_f4.png`)** hay **1 file Sprite Strip (`<id>_strip.png`)**? *(Khuyến nghị: 4 file PNG rời để dễ kiểm tra QA từng frame và thay thế nếu 1 frame bị lỗi).*
3. **Hướng di chuyển ở 4 cảnh so sánh đôi (`s001`, `s010`, `s012`, `s013`):** Cho 2 người lính **cùng bước hành quân nối tiếp nhau từ phải sang trái** (như đoàn quân đi xuyên qua các thời kỳ), hay đi từ hai phía lại gần nhau?

---

## Cập nhật 2026-10-17: pilot đã duyệt (kèm danh sách cải thiện lần sau)

**Pilot đã duyệt** (bởi người dùng): nhân vật 1871 đi (`de_prussia_infantry_1871_pose`), chu kỳ 12 tư thế (3 sheet × 4, 12fps), nền `bg_europe_dawn_1871`, cảnh s002. Bản chạy hiện dùng sheet A có ria mép (tạm). QA: `qa/style-pilot.md`. Prompt batch: `prompts/g-labs/` (index: `index-12pose.csv`).

**Cải thiện ở lần sau (chưa làm):**
1. Tạo lại sheet A 1871 (prompt đã có "clean-shaven"), ingest lại.
2. Nhiều sheet có tư thế gần trùng (A2≈A3, B2≈B3): chấm kỹ hơn khi làm loạt, cân nhắc `frameBlend` (pha trộn khung) trong engine nếu vẫn chưa mượt.
3. Nền cuộn lặp (tile/wrap) và đồng bộ tốc độ nền với độ dài bước; hiện nhân vật đi tại chỗ, camera đứng yên.
4. `ingest`: đã có `splitFrames` (inbox mảng A,B,C), cảnh báo chiều cao lệch, `headNorm`. Chưa có: tự loại chữ/đường kẻ dính vào ảnh.
5. Làm loạt: `2-characters-pose.txt` → `3-sheets-walk.txt` (42) → `4-backgrounds.txt`, mỗi lô qua `style-guard`.
6. Bỏ `prompts/g-labs/index.csv` cũ (bản 4 tư thế).

## Cập nhật 2026-10-17 (làm loạt)
- Đã đổi tên theo thứ tự prompt bằng `node tools/rename-batch.mjs <project> <file-prompt.txt> <Task_...>` (đọc `prompts/g-labs/index-12pose.csv`), rồi `npm run ingest`: 14 nhân vật × 12 frame, 13 nền. Chưa chấm `style-guard` (người dùng bỏ qua có chủ đích).
- `ingest` thêm: bỏ qua asset lỗi thay vì dừng; tự thử khoảng trống nhỏ dần khi tư thế chạm nhau (cắt tại cột thưa nhất nếu vẫn thiếu, có cảnh báo).
- Còn lại: render do người dùng chạy; nền cuộn lặp; `frameBlend`; xem lại chất lượng từng nhân vật khi dựng video.

## Cập nhật 2026-10-17 (nền cuộn lặp)
- Engine: `Scene.walkSpeed` (px/s tại lớp focusZ, mặc định 0) và `ImageLayer.tile` (lát ngang xen kẽ gương, trôi trái theo walkSpeed × parallax). Tất cả cảnh đặt `walkSpeed: 410` (khớp chu kỳ 12 frame 12fps), nền `bg` bật `tile`.
- Còn lại: nền lát gương (cây/nhà bị lặp đối xứng, có khe nối mờ); `frameBlend`; Askari ra da sáng (prompt đã sửa, cần tạo lại pose + 3 sheet Askari); lớp tiền cảnh code đang đứng yên.

## Cập nhật 2026-10-17 (ghép cảnh)
- `engine/src/templates/ProjectFull.tsx`: composition `<project>-full` ghép mọi cảnh theo thứ tự trong scenes.json, chuyển mờ 12 frame (cảnh sau chồng lên cảnh trước). Đăng ký trong `Root.tsx`. Bản đức: 28644 frame ≈ 19,9 phút.
- Chỉnh cỡ: s001 `soldier_1916` width 0.152, s012 `nva_1956` width 0.153 (cỡ tư thế đầy đủ chiều cao khác nhau giữa nhân vật; ingest chỉ chuẩn hóa theo chiều cao khung). NVA ảnh ra hướng phải dù prompt ghi hướng trái → s012 đặt `flipX: true` (phù hiệu NVA gần đối xứng).
- Còn lại: âm thanh/voice (Bước 6), thumbnail/tiêu đề (Bước 8), nền lát gương, frameBlend, Askari da sáng.

## Chuyển sang rig tách bộ phận (2026-10-17)
- Lý do: sprite sheet 3 ảnh độc lập lệch màu/tỉ lệ (lỗi cảnh 008, 004, 009); bạn cần chuyển động mượt cao. Quyết định đã duyệt: rig trong code, vũ khí + khói lửa được phép ở cảnh chiến tranh.
- Đã làm: `engine/src/walkCycle.ts` (chu kỳ đi + FK), `components/RigAsset.tsx`, layer `rig` trong schema, `splitParts` trong ingest, `validate` kiểm rig, `tools/synth-rig.mjs` + project thử `_rig-demo` (composition `rig-demo-walk`, kiểm bằng hình hộp), prompt pilot `_rig-demo/prompts/g-labs/1-parts-1871.txt`, cập nhật style bible/prompt-pack/style-guard/CLAUDE.md.
- Chờ: bạn tạo ảnh bảng bộ phận 1871 → `inbox/rig_prussia_1871_parts` → `npm run ingest -- _rig-demo` → duyệt pilot. Chưa làm: 13 nhân vật còn lại, cảnh so sánh 2 nhân vật, chuẩn hóa chiều cao, bỏ flipX/nền lát gương, vũ khí, khói lửa, đồng bộ tốc độ nền với bước chân, dọn dự án.

## Vòng từng cảnh + script-craft (2026-10-17)
- Mới: skill `script-craft`, rule mục 7 trong `workflow-gates.md`, mục "Vòng làm từng cảnh" trong playbook; `tools/glabs.mjs` mặc định `nano_banana_2_lite`; rule G-Labs: không dùng Pro mặc định.
- Thẻ cảnh `script/scenes/s001.md` (nháp, chờ G1). Chưa tạo ảnh/dựng. 1 lần gọi G-Labs đã dùng cho test (`_rig-demo/inbox/glabs_test_parts.jpg`, model pro).

## s007/s010 (2026-10-17)
- Nghiên cứu phía Anh/Pháp: `research/ch03-opponents/` (FA01–FA44; nguồn bảo tàng, không có văn bản sơ cấp). Thẻ `script/scenes/s007.md` (72 s duyệt), `s004.md`, `s010.md` (chưa duyệt G1).
- `tools/gen-parts-prompt.mjs` sinh prompt bảng bộ phận. G-Labs đã gọi 2 lần (lite): `rig_wehrmacht_1936_parts`, `rig_wehrmacht_1944_parts` (bản 1944 in nhãn chữ → xóa bằng `erase` ở ingest, không tạo lại; ghi nhận).
- s010 đã chuyển sang layer `rig` (2 nhân vật đi song song, nền `bg_ruins_1944`), CHƯA có camera nhiều đoạn, chip chữ, bộ đếm; thời lượng vẫn 110 s (đề xuất 100 s chờ duyệt). Tổng 3 lần gọi G-Labs hôm nay (1 pro, 2 lite).

## s010 làm lại (2026-10-17): một nhân vật biến đổi + camera đổi cỡ cảnh
- Engine mới: `RigLayer.swaps/callouts/poses/weapon/appearSec`, `camera.shots` (zoom quanh điểm), layer `burst` (nổ xa bằng code), chip chữ (`TextItem.type='chip'`), tư thế carry/aim trong `walkCycle.ts`.
- s010: lính 1936 đổi từng món sang 1944 (thân, chân, mũ) kèm tia sáng + vòng chú thích; mang súng chung chung (`prop_rifle_generic`), ngắm ở giây 76–84; thời lượng 100 s (đề xuất, chờ duyệt). Layer ẩn `soldier_1944_src`, `rifle_src` (opacity 0) chỉ để ingest ghi dữ liệu.
- G-Labs: thêm 1 lần gọi (súng, lite). Tổng 4 lần hôm nay (1 pro, 3 lite).
- Chưa làm: audio, lời dẫn; 24 s đầu (Boss) chỉ chữ trên nền; tay là một mảnh (không gập khuỷu); vũ khí/khói chưa dùng cho cảnh khác.
- `npm run validate` báo `2026-largest-empires` thiếu scenes.json: thư mục này không do phiên này tạo.

## 2026-10-17 — pilot nền nhiều lớp s010
- G-Labs nano_banana_2 (theo yêu cầu người dùng, không dùng lite): 4 ảnh (bg_s010_far/mid/fg/sweep) trong inbox, 4 lần gọi, 1 ảnh/lần, đều về. Prompt: prompts/g-labs/layers-s010.txt (có 1 ảnh tham chiếu style = khung đi bộ video gốc).
- Engine: tileMode wrap, scrollMul, moveSec, bóng+bụi chân; ingest: keyColor, seamBlend, aspectFromImage, tham số lọc assetId.
- Ảnh ghép đối chiếu: qa/s010_vs_ref.png. Chưa duyệt; chưa xem clip chuyển động; mép lặp chỉ kiểm bằng mắt trên ảnh tĩnh.
- Sửa sau phản hồi người dùng (2026-10-17): lớp quét hiện sai suốt 26 s đầu (showSec) → chỉ hiện giây 0–4,2; lính xuất hiện từ giây 0 (trước là 26 s chỉ chữ); thêm elbowCut, nhún thân, đổi tay áo theo mốc 56 s, cỏ nhỏ/thấp hơn. Chưa làm: nâng độ nét (Real-ESRGAN chưa kiểm), giữ zoom ≤ ~2.
- Bỏ callouts/flash (RigAsset không còn vẽ vòng tròn). Chống cứng: cam noise, pha bước noise, boil. Phản hồi người dùng: "bị AI, bị cứng" (ghi ở layer-recipe §9).
- Thêm rig.crouch + weapon.support (IK tay xa) trong RigAsset/walkCycle; s010 soldier crouch 1, support [0.62,0.6]. Bàn tay ảnh gốc là tay mở nên chưa giống tay nắm.

## 2026-10-17 — dọn dẹp, skill Remotion, phân tích 20 s tham chiếu
- Skill: thêm `remotion-best-practices` (remotion-dev/skills 4.0.536, 1441a11), `remotion-motion-graphics` (haidrrrry, MIT, 1dcbe5e; mô tả đã thu hẹp), `remotion-engine` (viết riêng); đồng bộ `.agent/`.
- Dọn dẹp: xem `content/_archive/ARCHIVE-LOG.md`. typecheck và validate đạt.
- Phân tích đoạn 6:00–6:20 (bản 2520×1080): `content/library/styles/run20-spec.md`. Phát hiện: chỉ MỘT tay cầm súng (bàn tay đè trước súng), tay kia vung tự do; nhân vật 3/4 từ trước; máy quay quét cây → dolly-in/out → quét cây; chu kỳ 1,12 s; gốc 24 fps; không có cỏ che chân. Cầm hai tay (IK `weapon.support`) trước đó là SAI so với gốc.
- Chưa làm: dự án sandbox `_ref-run20`, số đo còn thiếu (trôi lớp, góc chúi, khuỷu), cổng G2 tạo ảnh.

## 2026-10-17 (tiếp) — bài thử `_ref-run20` (nội bộ)
- Số đo bổ sung (script trong tools/): zoom là cú cắt ~0,5–0,8 s ≈1,85× (9,2 s vào, 16,7 s ra); toàn cảnh mặt ở x=0,54 nhún ~4,5% chiều cao khung; nền toàn cảnh MỘT tốc độ 0,140 W/s, trời đứng yên; chu kỳ 1,12 s; gốc 24 fps.
- Engine/tool mới: `ingest splitParts` thêm `components`, `noNearArm`, `farArmZ`, `farArmShade`, `overrides.scale`, gộp mảnh rời vào bộ phận gần nhất; rig `armSwing`, `armBias`, `shadow`, `dust`; layer `blurZoom`; text `caption`; grade `lilac_dusk`; `tools/concat-plates.mjs`.
- G-Labs nano_banana_2: 6 lượt (1 bảng bộ phận, 3 nền gồm 1 bản bỏ, 2 quét).
- Dọn dẹp xong (`_archive/ARCHIVE-LOG.md`); đã chuyển `_archive/` và khung tham chiếu `_refs/` RA NGOÀI `content/` vì Remotion sao chép cả `content/` vào thư mục tạm mỗi lần render (gây ENOSPC khi ổ C đầy).
- Chưa kiểm: clip đầy đủ 20 s (mới xem still + clip 2,5 s quanh cú zoom); chuyển động chân/hất gót vẫn là walk-cycle điều chỉnh, chưa đo góc gối/chúi thân của gốc; không có thử tốc độ render đầy đủ; `RigAsset.tsx` trên đĩa lại có mã callout/flash (không dùng ở sandbox) khác với bản tôi nhớ.

## 2026-10-17 (tiếp 2) — làm lại `_ref-run20` bằng key pose (flipbook on twos)
- Lý do: người dùng chấm rig "lộ khớp, như người khuyết tật". Chuyển sang phương án A (key pose); rig giữ ở `soldier_rig_layer.backup.json` và assets `rig_ref20_*`.
- `run20-pose-guide.md`: 14 pose của một chu kỳ (khung gốc 120–151); dải tham chiếu `_refs/run20/posestrips/`.
- G-Labs nano_banana_2 thêm 7 lượt: bảng pose s0 (1), s1–s3 bản v1 (3, **hỏng**: model chép lại pose của s0 vì ảnh nhận dạng chứa sẵn pose), s1–s3 bản v2 (3, đạt khi dùng bảng bộ phận làm nhận dạng). Bài học: ảnh nhận dạng phải KHÔNG chứa pose.
- Ingest `splitFrames` thêm: `alignX:'head'`, `take`, `despeckle`, `headNorm:'sheet'`; tool đo `measure-foot-slide.mjs`.
- Cảnh `wide10` (10 s toàn cảnh) và `run20` (20 s, zoom, quét); render `renders/wide10_v1.mp4` (240 khung, 33 s render).
- Chưa kiểm: chân trượt (giày tiếp đất lùi ~335 px/s ở nửa sau chu kỳ nên đặt walkSpeed 335, chưa xác nhận bằng mắt/đo), độ mượt (12 hình/s so với 24 hình/s của gốc), nhất quán họa tiết ngụy trang giữa các pose, xem MP4 trong chuyển động (chỉ xem ảnh).

## 2026-10-17 (tiếp 3) — sửa chân bước `_ref-run20` (người dùng: "chân bước có vấn đề")
- Nguyên nhân (đo, `tools/foot-lock.mjs`): 14 pose AI vẽ KHÔNG phải một chu kỳ nhất quán: giày chống lùi lúc ~36 px/hình, lúc >100 px/hình; số hình tiếp đất mỗi bước 3, 4, 7 (không đều); nền cuộn mượt trong khi hình vẽ đổi mỗi 2 khung. Không tốc độ nền nào khóa được cả 14 hình.
- Sửa: dùng nửa chu kỳ 7 hình có hành trình chân nhất quán (hình 10,11,12,13,14,1,2), `frameDx` (lệch thân ≤31 px, bình phương tối thiểu), `walkSpeed` 430 px/s, `scrollSnap 2` (nền cuộn theo bước cùng hình vẽ).
- Đo lại trên video render cảnh `foottest` (nhân vật trên nền trơn, `tools/measure-planted-foot-render.mjs`): trong mỗi lần chống chân, giày trôi so với mặt đất ≤18 px mỗi hình (trước: 72–250); giữa các lần chạm đất giày nhảy ≈254 px = một sải bước.
- Đánh đổi/chưa kiểm: nền nhanh hơn gốc (430 so với 269 px/s) vì sải bước của pose AI dài hơn gốc; tay tự do giờ lặp mỗi bước (0,58 s) thay vì mỗi 2 bước (1,12 s); vẫn 12 hình/s; không có pha bay (đáy các hình căn về một đường); họa tiết ngụy trang giữa các bảng chưa đo; chưa xem video ở dạng chuyển động.

## 2026-10-17 (tiếp 4) — `_ref-run20` làm lại bằng layer `runner` (rig 2D dữ liệu đo), thay flipbook
- Lý do: `wide10_v2` (flipbook + khóa chân) còn tệ hơn `v1` (người dùng). Nguyên nhân tôi nhận: chỉ tính trục X của MỘT điểm (giày chống), bỏ trục Y, cỡ hình, chân thứ hai; chọn `lambda`, 7 hình, `frameDx` theo phán đoán; **khóa chân sai mục tiêu** vì gốc KHÔNG khóa chân (đo: giày chống trượt ≈0,34 W/s, nền 0,14 W/s). `frameDx` làm thân giật 53 px/hình. Người dùng chọn "làm cách C Rig nhân vật 2D".
- Đo lại gốc (`tools/run20-track/`, đã chạy lại trọn chuỗi 01→07 từ khung gốc, cùng số đo): vòng lặp chính xác **27 hình @24 fps = 1,125 s**; thân nhún ≈66 px; tay tự do = cẳng tay vung quanh khuỷu cố định (bán kính 128 px, độ lệch chuẩn 6 px), vài hình khuất sau thân; đầu nhún riêng ≤13 px (chưa dựng).
- Layer mới `runner` (`engine/src/components/RunnerAsset.tsx`, schema `RunnerLayer`): vẽ trong hệ khung gốc 2520×1080 → khung cảnh (tỉ lệ 0,762); thân trên+đầu+súng+tay cầm = MỘT ảnh cứng cắt từ pose AI f9 (`run_upper.png`, căn vào khung gốc 120 bằng tối ưu sai khác màu: tỉ lệ 1,03, xoay 2°); chân = đa giác vector liền (gối bo tròn phía ngoài, đầu ống phẳng) + ảnh giày/xà cạp; tay tự do = tay áo trên (đứng yên sau thân) + cẳng tay quay quanh khuỷu (cắt theo vòng cung khuỷu có sẵn trong ảnh). Chuyển động từ `content/projects/_ref-run20/run20_track.json` (27 hình, on ones, 24 fps). Nền `walkSpeed 269`, cuộn mượt.
- Số đo (trên video render, không phải mô phỏng): IoU chân với ống quần gốc **0,668** (min 0,606, max 0,741; trần chỉ số ≈0,85 do viền đen); khớp 3 điểm thân/đầu sai số lớn nhất 13 px khung gốc (≈10 px màn hình); mối nối vòng 26→0 không vượt các cặp khác. Bài học số đo: độ rộng ống đúng nhỏ hơn cảm giác (đùi 96, gối 80 px, không phải 130).
- Lỗi nhìn thấy đã sửa trong quá trình: mũi nhọn miter ở gối (đổi sang bo tròn phía ngoài + giao nhọn phía trong), dải V tối ở gối và cục tròn dưới gối (bỏ lớp hai tông), đầu ống tròn lộ (đầu phẳng phủ lên xà cạp).
- G-Labs: không gọi thêm (dùng lại ảnh pose f9 và ảnh bộ phận giày/tay). Tổng cả sandbox: 13 lượt.
- Dọn: script đo gom vào `tools/run20-track/` (README); xóa 10 script thử chết; lưu trữ vào `_archive/ref-run20-flipbook-rig/`: 18 ảnh flipbook/rig cũ, 13 bản render thử, 5 ảnh inbox hỏng/bỏ, 71 ảnh qa cũ, `soldier_rig_layer.backup.json`, và `foot-lock.mjs`, `measure-planted-foot-render.mjs`, `measure-foot-slide.mjs` (đặt sai mục tiêu).
- Chưa đạt / chưa kiểm: thân là ảnh cứng (không biến dạng, không nhún đầu riêng); chân phẳng 1 màu + 3 nét nhăn, kém chi tiết nếp vải của gốc; bàn tay lệch ≈15 px và tay áo hơi mảnh so với gốc; ống quần gốc dày hơn ở đùi (IoU chỉ ~0,67); zoom 1,85× mới xem 4 still (thân trên là ảnh phóng ~1,45×); chưa xem video ở dạng chuyển động; nền/cảnh quanh là ảnh tự tạo nên không giống gốc từng pixel; sương/hạt/viền chữ chưa so với gốc.
