---
name: video-style-history
description: Họ phong cách "LỊCH SỬ" (chiến tranh, trận đánh, đế chế, nhân vật, biên niên): bản đồ giấy + hoạt hình cel + nhân vật cố định, kể theo diễn biến có kịch tính. Nạp khi bắt đầu dự án mới thuộc họ này hoặc khi sửa dự án history-cel/empire-map/Mỹ Lai. KHÔNG dùng cho true crime kiểu hồ sơ-vụ án (dùng video-style-investigation). Cấm trộn hai họ.
---

# video-style-history (họ "lịch sử")

Đọc kèm: `content/library/styles/pacing-and-footage.md` (nhịp, tốc độ đọc, footage), `.claude/rules/reenactment-first.md`, `source-policy.md`.

## Dùng / không dùng
| Dùng khi | Không dùng khi (→ `video-style-investigation`) |
|---|---|
| chiến tranh, trận đánh, đế chế, nhân vật, một giai đoạn | vụ án, tội phạm, hồ sơ chứng cứ làm trục chính |
| câu chuyện xoay quanh **diễn biến, địa điểm, con người hành động** | câu chuyện xoay quanh **đối chiếu tài liệu/lời khai** |

Dự án "lai": **dừng, hỏi người dùng chọn một họ**, ghi `Style-family` trong `project.md`. Không tự gộp.

## Nhận diện lẫn họ (kiểm trước khi làm)
Dừng và hỏi nếu có dấu hiệu họ kia: style bible `truecrime-collage`, ảnh giấy-xé viền trắng/halftone làm xương sống, bút dạ quang/đóng dấu hồ sơ làm ngôn ngữ chính, bóng người không mặt thay nhân vật.

## Định nghĩa
- **Style bible:** `content/library/styles/history-cel-docu.md` (+ `comic-cel-painterly.md` cho ảnh AI; `empire-map.md` nếu bản đồ đế chế; `layer-recipe.md` cho lớp nền). Đọc `style-lock.md` trước khi viết prompt ảnh.
- **Template:** `vox` kind `geomap`/`stage` (Mỹ Lai) hoặc multiplane scenes với `rig`/`runner`/`walkCycle` (xem skill `remotion-engine`).
- **Xương sống hình:** bản đồ giấy zoom/pan từ khu vực → làng/trận địa; sơ đồ đơn vị; **cảnh dựng** có nhân vật cel cố định (thẻ nhân vật + `--ref`) làm hành động trong nền nhiều lớp; tài liệu/ảnh thật xuất hiện ở nhịp chứng cứ. Nhãn "Minh họa" trên mọi cảnh dựng.
- **Chuyển động:** ưu tiên code (lật ảnh, key pose, rig, parallax, hạt/khói, cánh quạt quay); **clip G-Labs chỉ cho cảnh khó** (trực thăng hạ cánh, đám đông…) theo `pacing-and-footage.md` mục 2–3.

## Cấu trúc kể mẫu
1. **Hook:** khoảnh khắc/mâu thuẫn mạnh, ≤ 15 s (có thể mỉa mai kịch tính: người xem biết điều nhân vật chưa biết).
2. **Bối cảnh ngắn** (≤ 60–90 s; tên đơn vị, số liệu đẩy xuống chữ phụ).
3. **Diễn biến theo thời gian**, có không gian rõ (bản đồ → hiện trường).
4. **Cao trào có nhân vật cụ thể** (một người làm một việc).
5. **Hệ quả** (điều tra, trách nhiệm, ký ức).
- Nhịp (theo `reenactment-first.md`): nhịp kể = dựng cảnh là chính; chứng cứ = tài liệu gốc; định vị = bản đồ động; chữ/số thuần ≤ 10%.
- Tốc độ đọc: nhanh hơn họ tra án; theo `pacing-and-footage.md` mục 1, câu ngắn dồn dập ở diễn biến, nghỉ dài chỉ ở điểm sốc.

## Cấm
- Collage giấy-xé hồ sơ làm xương sống; chuyển động lòe loẹt; cel nhân vật không có thẻ cố định.
- Đổi sự kiện để có cảnh: chi tiết gợi hình đánh dấu *(gợi hình)* trong thẻ cảnh (`reenactment-first.md`).
- Giới hạn nội dung (người thật, trẻ em, bạo lực) theo `project.md`; chưa ghi thì hỏi.
- Không `flipX` nhân vật có phù hiệu bất đối xứng (`style-lock.md`).

## Cổng
`workflow-gates.md`: pilot trước loạt, từng cảnh có G1/G2/G3 (trừ ủy quyền bằng văn bản trong `project.md`).
