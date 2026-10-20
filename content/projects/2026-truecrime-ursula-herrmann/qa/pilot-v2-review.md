# Pilot v2 "hồ sơ vụ án" (2026-10-18): tự chấm

Phạm vi: mở đầu lạnh (P001–P010) + Hồ sơ số 1 (P101–P118), **28 shot, 7.030 frame = 3:54**. Kịch bản `script/vi-v2.md`, dữ liệu `vox-v2.json` + `locales/vi-v2.json` (bản 19:22 giữ nguyên). Composition: `2026-truecrime-ursula-herrmann-v2-full`.

Vai trò nhịp: kể 16, định vị 4, chứng cứ 6, chữ 2 (thẻ tựa + thẻ chương). Chữ thuần 7% (≤10%).

## Chấm still (28/28 shot đã xem; lần 1 và lần sửa)
| Shot | Lỗi lần 1 | Sửa |
|---|---|---|
| P005 | Dòng trích tràn mép phải khi zoom | zoom giới hạn 1,4 |
| P006 | Bảng zoom quá sát, mất thẻ "máy ghi âm" | zoom 1,12 |
| P007 | Thư chép lại bị hộp dịch che dòng đầu | giấy thư rộng hơn, thấp hơn (aspect 1,5) |
| P109 | Hai chip chữ chồng nhau | chip xếp cộng dồn theo chiều cao |
| P110 | Mảng giấy trắng sáng chói giữa cảnh | grade `night` |
| P114, P115 | Viền giấy trắng của ảnh AI lộ ra mép phải | phóng sẵn nền 1,45 từ mép trái (`over`, `ox`) |
| P117 | Chip đè hộp dịch | bỏ chip |

CÒN LẠI (chấp nhận, nêu rõ): P115 còn một vệt viền mảnh ~1% ở mép trái khi camera lùi; P001 có mảng tối chữ nhật lớn là phần trống của ảnh AI (đã đẩy camera sang trái); P105/P116 dùng lại shot bản đồ cũ nên ghi chú nguồn nhỏ.

## Chưa kiểm
- **Chuyển động và âm thanh:** chỉ xem still. Chưa nghe nhạc (mus_tension/mus_invest), SFX, mức hạ nhạc khi có lời (`duck` 0,55). Cần người dùng nghe khi render clip.
- Phát âm TTS của các câu mới (P001–P118).
- Cảnh ban đêm: hạt/sương/đèn pin chỉ thấy một khung; hiệu ứng động chưa xem.

## Ảnh mới
8 lần gọi G-Labs `nano_banana_2_lite` (prompts `prompts/g-labs-v2.txt`), 8/8 thành công: ai_raid2007, ai_house_dusk, ai_bellwire, ai_search_night, ai_desk, ai_board (nền cảnh); fg_spruce, fg_ferns (nền xanh, tách bằng chroma key thành PNG trong suốt). Tiền cảnh dương xỉ cắt 68% bên trái vì mép phải sót bóng người. Không ảnh nào có trẻ em. Cảnh khám nhà 2007 và tìm kiếm chỉ có bóng người lớn không mặt.
