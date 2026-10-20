# QA style: pilot (2026-10-17, lô Task_021229_10172026)

| Ảnh | Kết quả | Ghi chú |
|---|---|---|
| 1 `de_prussia_infantry_1871_pose` | ĐẠT | Hướng phải, đang đi, nét viền đen đều, cel 2 tông, cao ~88% ảnh, phù hiệu/mũ đúng thẻ. Watermark mờ ở góc dưới phải: crop bỏ. Chưa kiểm số nút áo (thẻ: 8). |
| 2 `..._sheet` | KHÔNG ĐẠT | Sai nhân vật: lính kiểu Mỹ (mũ M1, quân phục olive) thay vì lính Phổ 1871 (mục 7 và 10 trượt). Có 4 tư thế, hướng phải, cùng baseline, nhưng tư thế 1≈3 và 2≈4. Nguyên nhân: ảnh pose không được đính kèm. Tạo lại kèm ảnh 1. |
| 3 `bg_europe_dawn_1871` | ĐẠT | Painterly không viền, nhiều lớp đồi, tiền cảnh tối mờ, đường trống giữa, tông ochre. Chi tiết hơi thực hơn frame tham chiếu; ghép thử với nhân vật vẫn ổn (nhân vật cao ~60% vùng hiển thị). |

## Lần 2 (sheet tạo lại, 02:17)
| Ảnh | Kết quả | Ghi chú |
|---|---|---|
| 2 `..._sheet` | ĐẠT (có lưu ý) | Đúng lính Phổ 1871, hướng phải, 4 tư thế cùng tỉ lệ/đường chân, cách nhau ≥ 80px. Tư thế 1≈3 và 2≈4 nên chuỗi thực chất chỉ có 2 dáng khác nhau (chạm/chuyển); muốn mượt hơn cần sheet thứ hai. |

Ingest `splitFrames` chạy được trên ảnh thật (4 frame 500×800). Still dựng thử: `renders/pilot_s002_f20|f40|f44.png`. Cảnh s002: nền thay bằng ảnh painterly (`bg`), bỏ sky/silhouette code; camera đang đứng yên (chưa có nền cuộn nên chưa thấy "đi").

## Lần 3 (12 tư thế, lô Task_022510_10172026): KHÔNG ĐẠT cả 3 sheet
- **Chữ trong ảnh** (sheet A in nhãn CONTACT/RECOIL/LOW POINT/PASSING) và **đường kẻ đất** (sheet B): vi phạm cấm 4, 10; làm lệch hộp bao khi tách frame.
- **Lệch nhân vật giữa các sheet:** B có ria mép (A, C không); C thêm đai trắng chéo ngực (A, B đai đen); pose mới (ảnh 1) cũng có đai trắng, khác pose đã duyệt. Giữ pose đã duyệt `inbox/de_prussia_infantry_1871_pose.jpg`, bỏ ảnh 1 và ảnh 5 mới.
- **Lệch tỉ lệ giữa sheet** (cao ≈ 560 / 600 / 540 px): chuỗi sẽ nhấp nháy kích thước.
- **Tư thế:** B1 và C3 nhấc gối quá cao như bước diễu hành (không phải đi tự nhiên); A2≈A3, B2≈B3 gần trùng.
- Nguyên nhân gốc ở prompt: tên pha viết hoa bị vẽ ra thành nhãn; "knee lifted high" bị hiểu thành bước diễu hành; không cấm chữ/đường kẻ/đồ thêm. Đã sửa prompt (bỏ nhãn, gối thấp hơn hông, cấm chữ và đường kẻ, cấm thêm/đổi trang bị và ria, khóa chiều cao 70%).

## Lần 4 (lô Task_022919_10172026)
- Sheet A: KHÔNG ĐẠT vì nhân vật có ria mép (pose đã duyệt không có). Tạo lại sheet A với prompt đã thêm "clean-shaven".
- Sheet B, C: ĐẠT (không chữ, không đường kẻ, gối tự nhiên, không đai trắng). Lưu ý B2≈B3 và A2≈A3 gần trùng, nên chuỗi có khoảng 10 dáng khác nhau thay vì 12.
- Lệch tỉ lệ giữa sheet (mũ rộng 83px ở A, C; 75px ở B): đã sửa bằng `headNorm` trong ingest (hệ số 1.09–1.11 cho sheet B). 12 frame 500×800, cùng baseline.
