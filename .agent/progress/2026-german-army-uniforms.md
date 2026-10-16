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
