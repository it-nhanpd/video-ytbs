# Nâng cấp "dựng cảnh + không khí + lộ trình thám tử": vụ Ursula Herrmann (và template vox)

## Context
Bản 19:22 (163 shot) đã xong và đúng nguồn, nhưng người dùng thấy video "ảnh tĩnh, không dựng cảnh". Họ đề xuất thêm:
- hiệu ứng hạt và chuyển động,
- nhạc ma mị, kinh dị,
- flow dẫn dắt để người xem thấy mình là thám tử đang phá án.

Họ nhờ đánh giá các đề xuất này theo tiêu chí xưởng. Render vẫn do người dùng tự làm.

### Chẩn đoán bản hiện tại (đo từ vox.json)
- **Cảnh dựng chỉ có 15/163 shot (9%).** Luật `reenactment-first.md` yêu cầu ≥ 2/3. Phần còn lại:
  - 41 con dấu chữ, 14 checklist, 9 stats;
  - 19 trang bản án + 10 doc.
  - Đây là lỗi chính, và nó vi phạm luật của chính xưởng.
- **Chuyển động đơn điệu.** Shot nào cũng có cùng một kiểu: đẩy vào 4,5% và rung giấy (`VoxVideo.tsx:69`). Không có pan, parallax, đổi tiêu cự hay nhịp cắt.
- **Âm thanh gần như không có thiết kế:**
  - Chỉ một bản drone tổng hợp dài 22 phút (`tools/music-synth.mjs`), âm lượng cố định 0.5.
  - Nhạc không đổi theo chương, không có stinger khi lộ chứng cứ, không có khoảng lặng, không tự giảm khi có lời (ducking), không có SFX.
- **Flow kể theo trình tự thời gian.** Người xem nghe kể lại, không được tự xâu chuỗi manh mối.

### Đánh giá các đề xuất (tiêu chí: giữ chân người xem / chi phí / nguồn và đạo đức / tái dùng)

| Đề xuất | Đánh giá | Hiệu quả | Chi phí |
|---|---|---|---|
| Flow thám tử | **Mạnh nhất, làm.** Vụ này hợp hoàn hảo: bản án gây tranh cãi, chứng cứ gián tiếp. Người xem cầm "hồ sơ", nhận từng chứng cứ, tự cân nhắc, và cuối video tự phán xét. Chỉ cần sắp xếp lại các sự kiện đã có nguồn, không cần sự kiện mới. | rất cao | trung bình: sửa kịch bản + TTS lại |
| Dựng cảnh + chuyển động | **Làm.** Đây là việc bắt buộc theo luật. Kỹ thuật: cảnh 2.5D nhiều lớp (nền + tiền cảnh tách nền), camera đa dạng. Bản án và thư đặt *vào trong cảnh* (trên bàn điều tra, dưới đèn) thay vì nằm trên nền giấy trống. | rất cao | cao nhất: ~30–35 ảnh G-Labs (sau khi chia vai trò nhịp) |
| Hạt, hiệu ứng | **Làm có kiềm chế.** Hiệu ứng phải gắn với bối cảnh: sương trong rừng, bụi trong luồng đèn phòng hồ sơ, mưa, nháy đèn neon, vết xước phim cho cảnh 1981. Rải đều mọi shot sẽ thành "template rẻ tiền". | trung bình | thấp, viết bằng code, dùng lại cho mọi video |
| Nhạc ma mị, kinh dị | **Đồng ý một nửa.** Nên làm nhạc *hồi hộp, điều tra*: drone trầm, nhịp tim, stinger, khoảng lặng, đổi cue theo chương. Không nên làm horror kiểu jump-scare, vì: nạn nhân là trẻ em có thật, gia đình còn sống; YouTube xếp "bi kịch có thật được giật gân hóa" vào nhóm hạn chế quảng cáo; và kênh tham chiếu "CẢI KINH DỊ" bị chính chỗ này kéo xuống. Thêm SFX: cạch băng cassette, chuông điện thoại quay số, máy chữ, gió rừng, tiếng giấy. | cao (âm thanh là phần tăng cảm giác "có đầu tư" rẻ nhất) | thấp đến trung bình |

**Kết luận:** làm cả 4 đề xuất, theo thứ tự ưu tiên:
1. flow;
2. dựng cảnh;
3. âm thanh;
4. hạt.

Phần engine (không khí, camera, âm thanh, bảng chứng cứ) dùng lại được cho mọi video vox sau này.

### Ranh giới giữ nguyên
- Không có hình trẻ em, kể cả AI hay bóng người.
- Người lớn chỉ xuất hiện dạng bóng, không mặt.
- "Werner M." luôn đi kèm việc ông phủ nhận.
- Mọi ảnh dựng có nhãn "Minh họa".
- Chi tiết thêm cho có hình được đánh dấu *(gợi hình)*.
- Không thêm sự kiện mới chưa có nguồn.

### Nguyên tắc người dùng chọn (2026-10-18): chia hình theo vai trò của nhịp lời
Chọn hình cho mỗi nhịp lời theo việc nhịp đó đang làm:

| Nhịp đang làm gì | Hình dùng |
|---|---|
| Nêu khẳng định hoặc chứng cứ | **Bắt buộc dùng tài liệu gốc** khi có, đặt trong bối cảnh. Dựng cảnh không được thay tài liệu. |
| Kể chuyện hoặc gợi cảm xúc | Dựng cảnh là lựa chọn chính. |
| Định vị nơi chốn, thời gian | Ảnh địa điểm thật và bản đồ, có chuyển động. |
| Chỉ có chữ hoặc số | Tối đa 10%; mỗi shot phải ghi lý do. |

**Tỉ lệ mục tiêu cho vụ Ursula:** khoảng 35% tài liệu, 25% ảnh thật, 30% dựng cảnh, tối đa 10% chữ thuần.

Từ nguyên tắc này, kế hoạch đổi như sau:
- **29 shot tài liệu là đúng hướng, giữ lại.** Lỗi nằm ở cách trình bày, không phải ở việc dùng tài liệu. Cách làm mới:
  - Tài liệu đặt vào bối cảnh điều tra (bàn, đèn, bìa hồ sơ).
  - Camera lướt dọc dòng chữ, bút dạ quang tô đúng câu được trích.
  - Có tiếng lật giấy.
- **Ảnh Commons của địa điểm thật dùng 2.5D:** tách tiền cảnh, thêm parallax và không khí (sương trên hồ Ammersee, rừng). Cách này thay được nhiều cảnh AI.
- **Đối tượng thay thế chính là 64 shot chữ thuần** (41 con dấu, 14 checklist, 9 stats). Có tài liệu thì chuyển thành shot tài liệu; không có thì làm cảnh dựng; số liệu thành chữ phụ đè lên cảnh.
- **Dựng cảnh cho các nhịp kể chuyện hoặc cảm xúc, và cho chỗ thiếu tài liệu.** Ví dụ:
  - Chiều 15/9 trên đường ven hồ.
  - Cuộc tìm kiếm.
  - Gia đình chờ điện thoại.
  - Chiếc hộp (ảnh cảnh sát có bản quyền).
  - Cuộc khám nhà năm 2007.
  - Phòng xử án.
- **Ước lượng G-Labs khoảng 30–35 ảnh,** thay vì 50–60. Pilot vẫn khoảng 6–8 ảnh.
- **Khi được duyệt, đổi luật theo nguyên tắc mới:**
  - Sửa `.claude/rules/reenactment-first.md`: thay mục tiêu "≥ 2/3 cảnh" bằng bảng vai trò ở trên. Đồng bộ sang `.agent/` và kiểm bằng `diff -r`.
  - Sửa skill `script-craft`: thêm cột "vai trò nhịp" vào thẻ cảnh.
  - Cập nhật memory `feedback-reenactment-first`.

## Cách làm

### 1. Kịch bản lại theo "hồ sơ vụ án" (giữ toàn bộ Fxx đã kiểm)
- **Mở đầu lạnh:** chứng cứ then chốt (chiếc máy ghi âm năm 2008) và một câu hỏi: "Chiếc máy này có phải là máy đã gọi tống tiền năm 1981?" Sau đó quay lại năm 1981.
- **Mỗi chương là một "Hồ sơ số N".** Mỗi chương kết bằng một câu hỏi mở dẫn sang chương sau.
- **Bảng chứng cứ lặp lại** (kind mới `board`): bảng ghim, chỉ đỏ nối các thẻ (thư, cuộc gọi, hộp, băng, máy ghi âm). Mỗi chứng cứ mới được ghim thêm lên bảng. Thẻ còn tranh cãi đánh dấu "?".
- **Chương cuối: "Bạn là thẩm phán".**
  - Đặt chứng cứ buộc tội và các điểm phản biện lên hai cột.
  - Không nói "bồi thẩm đoàn": Đức xử bằng thẩm phán và hội thẩm nhân dân.
  - Kết bằng câu hỏi, không phán quyết thay tòa.
- Số liệu thành chữ phụ đè lên cảnh. Shot chỉ có chữ phải ghi lý do trong `script/vi.md`.
- Mục tiêu: khoảng 160 shot, khoảng 20 phút, theo tỉ lệ vai trò nhịp (khoảng 35/25/30, tối đa 10% chữ thuần).

### 2. Engine (`engine/src/vox/`, dùng lại cho mọi dự án)
- **`atmos.tsx`, lớp không khí theo preset:**
  - Các preset: `fog`, `dust-beam`, `rain`, `flicker`, `film1981` (xước, cháy mép, rung khung), `embers`.
  - Hạt dùng `random()` của Remotion để tất định, nhẹ cho render.
  - Shot khai báo bằng `v.atmos`.
- **Camera theo shot:** `v.cam` gồm `push | pull | panL | panR | tilt | handheld | snap`, thay cho một kiểu đẩy chung ở `Shot` trong `VoxVideo.tsx`. Mặc định giữ hành vi cũ, để bản Unabomber không đổi.
- **Cảnh 2.5D:** kind `scene` nhận `layers: [{img, z}]`, parallax theo camera. Tái dùng ý tưởng `parallaxFactor` (`engine/src/utils.ts`) và pipeline `ingest` (`keyOut`, `trim`) để tách tiền cảnh.
- **Kind `desk`:** đặt trích đoạn bản án, thư, ảnh lên mặt bàn điều tra dưới đèn bàn, có tay bóng người lật trang. Thay phần lớn các docpage, stamp và checklist trên nền giấy.
- **Kind `board`:** bảng chứng cứ, như mô tả ở mục 1.
- **Âm thanh:**
  - `vox.json` có thêm `cues: [{at shotId, track, vol}]` (nhạc đổi theo chương, có khoảng lặng) và `v.sfx`.
  - Nhạc tự giảm (duck) khi có lời, tính từ `timing.json`.
  - `tools/music-synth.mjs` có thêm `--mood tension|investigate|grief|reveal`.
  - `tools/sfx-synth.mjs` mới, tự tổng hợp: cạch băng, chuông quay số, nhịp tim, stinger, gió. Tự tổng hợp nên không có rủi ro bản quyền.
- Nếu người dùng muốn chất lượng nhạc cao hơn: họ tự tải nhạc từ YouTube Audio Library, và ghi giấy phép vào `qa/`.

### 3. Pilot (cổng duyệt bắt buộc, `workflow-gates.md` mục 2)
- Làm lại chương 1 (chiều 15/9/1981, khoảng 2 phút) cộng mở đầu lạnh. Cần:
  - khoảng 8 ảnh G-Labs `nano_banana_2_lite` (nền + tiền cảnh tách lớp: rừng ven hồ lúc chiều, đường mòn, xe đạp đổ, đèn pin tìm kiếm, bàn điều tra);
  - bảng chứng cứ;
  - cue nhạc và SFX.
- Gửi người dùng still, kèm một lệnh render clip ngắn để họ tự chạy, chờ nhận xét.
- **Chưa chốt "pilot đã duyệt" thì không làm loạt.**

### 4. Loạt (sau khi pilot được duyệt)
- Các chương còn lại cần thêm khoảng 40–50 ảnh G-Labs, có checklist `style-guard` từng ảnh. Tái dùng ảnh bằng cách đổi crop và camera.
- Báo số lần gọi trước khi chạy. Gặp lỗi chính sách thì dừng.
- TTS lại các câu đã đổi, cập nhật `script/vi.md`, `description.md` (mốc chương mới) và `qa/`.

## Rủi ro / đánh đổi
- Render lâu hơn, vì có thêm hạt và nhiều lớp ảnh. Hạt sẽ được giữ ở mức nhẹ.
- Hạn mức G-Labs: tổng khoảng 50–60 lần gọi.
- Sửa kịch bản thì phải TTS lại phần lớn các câu. Phần này rẻ.
- Bản 19:22 hiện tại vẫn giữ nguyên để so sánh. Pilot làm trên một bản copy shot mới, không ghi đè.

## Verification
- `npm run typecheck` sạch.
- Still của Unabomber không đổi (kiểm tra mặc định cũ còn đúng).
- Pilot: still mỗi shot và bảng chấm `style-guard`. Đếm tỉ lệ cảnh có hình ≥ 2/3 trong chương.
- Kiểm âm thanh: in mức âm lượng nhạc ở frame có lời và không lời (ducking hoạt động).
- Mỗi câu mới vẫn có mã Fxx. Không commit git.
