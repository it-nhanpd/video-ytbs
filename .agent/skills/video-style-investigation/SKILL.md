---
name: video-style-investigation
description: Họ phong cách "TRA ÁN / ĐIỀU TRA" (true crime, vụ án, che giấu, tài liệu, lời khai, đối chiếu chứng cứ): collage giấy kiểu Vox, template vox, tài liệu gốc làm xương sống. Nạp khi bắt đầu dự án mới thuộc họ này hoặc khi sửa dự án truecrime. KHÔNG dùng cho chiến tranh/đế chế/nhân vật lịch sử (dùng video-style-history). Cấm trộn hai họ.
---

# video-style-investigation (họ "tra án")

Đọc kèm: `content/library/styles/pacing-and-footage.md` (nhịp, tốc độ đọc, footage), `.claude/rules/reenactment-first.md`, `source-policy.md`.

## Dùng / không dùng
| Dùng khi | Không dùng khi (→ `video-style-history`) |
|---|---|
| vụ án, tội phạm, cuộc điều tra, thủ phạm chưa biết, vụ bê bối, che giấu | trận đánh, đế chế, chiến tranh, tiểu sử, biên niên |
| câu chuyện xoay quanh **chứng cứ ↔ lời khai ↔ kết luận** | câu chuyện xoay quanh **diễn biến và bản đồ** |

Dự án "lai" (vd. tội ác chiến tranh bị che giấu): **dừng, hỏi người dùng chọn một họ**, ghi vào `project.md` mục `Style-family`. Không tự gộp.

## Nhận diện lẫn họ (kiểm trước khi làm)
Dừng và hỏi nếu `project.md`/shot có **bất kỳ** dấu hiệu họ kia: style bible `history-cel-docu`/`empire-map`, bản đồ giấy cổ có nhãn serif, nhân vật cel hoạt hình, `rig`, quân cờ trên bản đồ.

## Định nghĩa
- **Style bible:** `content/library/styles/truecrime-collage.md` (giấy ngà, giấy xé viền trắng, halftone, đỏ dạ/vàng hồ sơ; Anton, Be Vietnam Pro, Roboto Mono, Playfair).
- **Template:** `vox` (`engine/src/vox/`, `vox.json`, `locales/vi.json`, `tools/vox-tts.mjs`). Composition `<p>-full`, `<p>-vox-<shotId>`.
- **Xương sống hình:** tài liệu gốc (báo cáo, thư, bản án) đặt trong bối cảnh: bút dạ quang tô câu trích, đóng dấu, camera lướt dòng chữ; bản đồ/dòng thời gian bằng code; ảnh tư liệu thật có giấy phép, cắt kiểu giấy.
- **Ảnh/clip AI:** chỉ làm không khí, đồ vật, bóng người không mặt; không khuôn mặt người thật (`truecrime-collage.md` mục Cấm). Cảnh khó có thể dùng clip G-Labs theo `pacing-and-footage.md` mục 3.

## Cấu trúc kể mẫu
1. **Mâu thuẫn mở đầu** (trên giấy ghi X, thực tế là Y) — hook ≤ 15 s.
2. **Chứng cứ và nhân chứng** (mỗi khẳng định có `Fxx`, nêu cả lời khai mâu thuẫn).
3. **Che giấu / sai lệch** — ai biết, ai im.
4. **Phanh phui** — điều gì làm sự thật lộ ra.
5. **Kết luận pháp lý và điều còn bỏ ngỏ.**
- Nhịp (theo `reenactment-first.md`): nhịp chứng cứ = tài liệu gốc; nhịp kể = dựng cảnh/bóng người/clip; định vị = bản đồ/ảnh thật; chữ/số thuần ≤ 10% shot.
- Tốc độ đọc và độ dài câu: theo `pacing-and-footage.md` mục 1; giọng nghi vấn, câu hỏi treo, câu ngắn sau số liệu.

## Cấm
- Cel hoạt hình nhân vật, bản đồ giấy cổ làm xương sống, quân cờ chiến trận.
- Mô tả bạo lực chi tiết bằng hình; ảnh nạn nhân; từ nhạy cảm trong prompt ảnh (`style-lock.md`).
- Sự kiện không có nguồn A/B/B2/G (`source-policy.md`).

## Cổng
`workflow-gates.md`: pilot trước loạt, từng cảnh có G1/G2/G3 (trừ khi người dùng ủy quyền bằng văn bản trong `project.md`).
