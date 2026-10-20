# style-guard — pilot dựng cảnh (2026-10-18)

| Ảnh | Lần | Kết quả | Lý do |
|---|---|---|---|
| ml_medina_brief.jpg → assets/chars/medina_ref.png | 1 | ĐẠT | Cel viền mực, 2 tông; nhân vật gốc cách điệu (không dựa ảnh thật); đứng chỉ tay trái, cầm bản đồ, quân hàm đại úy, mũ ngụy trang. Tách nền `--tol 18 --erode 2`: còn vệt chấm rất mờ ở mép lưng (chỉ thấy khi soi gần) — theo dõi. |
| ml_gi_group_seated.jpg | 1 | **KHÔNG ĐẠT** | 2 lính quay nghiêng lộ mặt trơn không nét mặt, thấy rõ ở full-res trong cảnh ghép. |
| ml_gi_group_seated_v2.jpg → assets/chars/gi_group_seated.png | 2 | ĐẠT | Tất cả quay lưng, không lộ mặt, súng chĩa lên. Ảnh có quầng sáng quanh nhân vật → tách nền cần `--tol 34 --erode 2` (tol thấp để lại viền trắng lởm chởm). |
| ml_lz_dusk.jpg | 1 | ĐẠT | Nền painterly không viền, chạng vạng, không người, trực thăng đậu xa, khoảng trống giữa cho nhân vật. |

Ghép cảnh `stage` (s003c): `grade` = brightness(0.78) saturate(0.8) sepia(0.18) contrast(1.05) cho lớp nhân vật để khớp ánh chạng vạng.
