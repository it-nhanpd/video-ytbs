# style-guard — s001 làm lại theo hướng dựng cảnh (2026-10-18)

Model G-Labs `nano_banana_2` (người dùng chọn 2026-10-18). Prompt `prompts/g-labs.txt` đoạn 12–21. 10 lần gọi, 10 ảnh về, không tạo lại.

| Ảnh (inbox) | Dùng ở | Chấm | Ghi chú |
|---|---|---|---|
| ml_tent_night | s001a nền | ĐẠT | nền vẽ tay, không viền, không chữ đọc được |
| ml_officer_typing | s001a nhân vật | ĐẠT | viền mực, cel 2 tông; mặt nhìn nghiêng, nhân vật chung (không phải người thật) |
| ml_huey_landing | s001c | ĐẠT | UH-1 không phù hiệu/số; xạ thủ cửa là bóng tối |
| ml_gi_run_paddy | s001c | ĐẠT | đồng phục khớp ảnh ref `gi_group_seated` |
| ml_hamlet_burning | s001d, s001e, s001i nền | ĐẠT | không người, không thi thể |
| ml_gi_walk_smoke | s001d | ĐẠT | quay lưng hoàn toàn; tách nền `--erode 3` để bỏ viền sáng |
| ml_villagers_group | s001e | ĐẠT | dân làng còn sống, sợ hãi; không bạo lực. Bóng đổ dưới chân giữ lại (tách bằng `--min-hole` lớn để không mất áo trắng của đứa trẻ) |
| ml_livingroom_1969 | s001g nền | ĐẠT | báo trên bàn chỉ có nét nguệch ngoạc |
| ml_reader_1969 | s001g | ĐẠT | tờ báo không có chữ đọc được; lần tách nền đầu xóa mất tờ báo → tách lại `--tol 12 --min-hole 999999999` |
| ml_photographer | s001h, ảnh ref thẻ `us-army-photographer-1968` | ĐẠT | cel cách điệu, không dựa trên ảnh thật |

## Lỗi tìm thấy khi tự chấm still và đã sửa
- s001a: tem che đầu sĩ quan → thêm `stamp.x` (0.36); ghế của nền lộ sau nhân vật → dời lớp sang x 0.745.
- s001c: bụi gió cánh quạt thành đốm tròn rõ → làm mờ 10px.
- s001d: ký tự "≥" bị font hiển thị sai → đổi thành "175 – 400+" kèm dòng phụ "ít nhất 175, có thể hơn 400 · theo Báo cáo Peers".
- s001e: nhóm dân quá to, đứa trẻ bị cắt mép; viền sáng → giảm zoom/h, `--erode 3`.
- s001g: tay ghế bành của nền lộ ra → dời lớp người đọc báo.

## Còn lại (nhỏ)
- s001g: lưng ghế bành của nền vẫn hơi lộ sau ghế của nhân vật ở mép phải.
- Nhân vật cel (viền mực rõ) sắc nét hơn nền vẽ mềm: đúng style doc (§8), nhưng ở s001g nhìn rõ nhất.
