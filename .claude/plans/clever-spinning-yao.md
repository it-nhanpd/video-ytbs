# Review điểm khớp `run20_track.json` (chú trọng tay trái) + ảnh chụp để phân tích

## Context
Người dùng muốn kiểm các điểm khớp trong `content/projects/_ref-run20/run20_track.json` có khớp video gốc không, đặc biệt **tay trái** (tay tự do của nhân vật, nhân vật nhìn sang phải nên tay này nằm bên phải màn hình; tay cầm súng là tay phải, thuộc ảnh thân trên cứng). Cần ảnh chồng điểm lên khung gốc để phân tích.

Cách tay đang được dựng (`engine/src/components/RunnerAsset.tsx:148-156`):
- Khuỷu `E = toBody(T0.chest + elbow)` với `elbow=[108,112]` (scenes.json) → khuỷu dính cứng vào thân, chỉ xoay quanh thắt lưng theo `rot`.
- Cẳng tay xoay từ `E` về phía `T.hand`; cánh tay trên `armUp` đặt tại `E0` (khung 0), **không theo thân** → có thể hở/lệch khi thân nhún 66 px.
- `hand` = tâm khối màu da lớn nhất (`05-hand.mjs`), tức **tâm lòng bàn tay**, không phải cổ tay; 5 hình khuất (`handSeen:false`, i12–i15: f135/136/138/139) được nội suy **đường thẳng** (`06-build-track.mjs:9-10`).

Nghi vấn sơ bộ từ `_refs/run20/grid/hand.png` (đã xem):
1. Khuỷu thật có vẻ dịch theo pha (f120 cẳng tay chĩa ra trước, f131 thả thẳng đứng sát túi đạn) → giả định "khuỷu cố định" cần đo lại.
2. Tâm bàn tay bị lệch khi một phần bàn tay bị túi đạn/ống quần che (f131, f134).
3. Đoạn nội suy thẳng i12–i15 có thể không đúng quỹ đạo vòng cung quanh khuỷu.

## Việc sẽ làm (chỉ đọc + ghi vào scratchpad, không sửa track/scenes)
Script `D:\Temp\claude\d--videos-system\cef9a192-932c-4794-af3c-7d93c9dcab17\scratchpad\review-joints.mjs` (chạy từ gốc repo, dùng `sharp` như các tool `tools/run20-track/`):

1. **Chồng khớp toàn thân** lên 27 khung gốc `_refs/run20/frames/f_<src>.jpg` (toạ độ track là toạ độ gốc 2520×1080, không cần đổi): belt, chest, headC, hip, 2 gối, 2 cổ chân, tâm + trục giày, khuỷu `E` (tính đúng như RunnerAsset), bàn tay, đoạn E→tay; màu riêng cho tay thấy/nội suy. Crop vùng nhân vật (x≈900–1600, y≈220–1060) → `sheet-body.png` (lưới 7×4).
2. **Phóng to tay trái**: crop x≈1240–1560, y≈480–760, phóng 2×, 27 ô → `sheet-arm.png`, có nhãn `i/f`, độ dài E→tay, góc cẳng tay.
3. **Số liệu** in ra console + `arm-metrics.csv`: |E−hand| mỗi hình (so bán kính 128±6), góc ψ, bước nhảy giữa hai hình liên tiếp (phát hiện giật), cờ handSeen; khoảng cách `armUp` (đặt ở E0 cố định) tới E hiện tại.
4. **Đo khuỷu thật** để đối chiếu: trên ô phóng to, tôi đọc mắt vị trí khuỷu/cổ tay ở ~6 hình đại diện (120,126,131,136,141,148) và ghi sai lệch so với `E`/`hand`.

## Báo cáo (theo memory "tự chấm trước khi báo")
Bảng chấm từng khớp (Đạt/Không đạt, sai lệch px), lỗi KHÔNG ĐẠT nêu trước, kèm đường dẫn ảnh full-res. Đề xuất sửa (vd. đo khuỷu theo từng hình, tay dùng cổ tay thay tâm lòng bàn tay, nội suy cung tròn quanh khuỷu, `armUp` theo `toBody`) chỉ nêu, chờ duyệt mới sửa (`workflow-gates.md` mục 1).

## Kiểm chứng
- Mở `sheet-body.png`, `sheet-arm.png` bằng Read, kiểm điểm nằm đúng chỗ trên ít nhất các khung đã có trong `hand.png` (chấm vàng trùng).
- Đối chiếu số liệu: bán kính trung bình ≈128 như README; nếu không khớp, nêu rõ.
