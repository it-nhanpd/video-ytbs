# style-guard — s002–s010 (chạy một mạch, 2026-10-18)

Model G-Labs `nano_banana_2`. Prompt `prompts/g-labs.txt` đoạn 22–49. Ảnh lính tạo với `--ref assets/chars/gi_group_seated.png`; `calley_trial` với `--ref inbox/ml_calley_order.jpg`.
Chấm trên ảnh thu nhỏ (bảng ghép) + bảng ghép tách nền trên nền tối.

| Ảnh | Chấm | Ghi chú |
|---|---|---|
| ml_tet_night, ml_road_dawn, ml_ditch, ml_airfield_1967, ml_memorial_lz, ml_bunker, ml_courtroom, ml_hearing_room, ml_newsstand_1969, ml_memorial_today | ĐẠT | nền vẽ tay, không người (tet_night: bóng người xa không mặt), không chữ đọc được |
| ml_guerrilla_squad | ĐẠT | quân phục đen, mũ cối/mũ tai bèo; dải đất dưới chân giữ lại |
| ml_gi_duffel, ml_gi_stretcher, ml_howitzer, ml_gi_refuse | ĐẠT | đồng phục khớp ảnh ref; thương binh không có máu |
| ml_officers_map, ml_colonel_sign, ml_panel_officers | ĐẠT | nhân vật chung, bản đồ/giấy không có chữ |
| ml_calley_order, ml_calley_trial | ĐẠT | thẻ `us-army-calley-1968`; `calley_trial` tách lại `--min-hole 150` (mảng xám kẹt sau lưng) |
| ml_thompson_stop, ml_crew_child | ĐẠT | thẻ `us-army-thompson-1968`; đứa trẻ còn sống, được bế |
| ml_market_women, ml_villagers_crouch | ĐẠT | dân làng còn sống |
| ml_veteran_letter, ml_reporter_phone | ĐẠT | cel cách điệu, không dựa trên ảnh thật |
| ml_gi_firing (lần 1) | **KHÔNG ĐẠT** | người bên trái bắn sang trái, ngược hướng cả nhóm → đổi tên `ml_gi_firing_v1_reject.jpg`, tạo lại bằng đoạn 49 |
| ml_gi_firing (lần 2, đoạn 49) | ĐẠT | cả 4 người bắn sang phải |
