# Shotlist — bản nháp chờ duyệt

16 nhịp (`beats.md`) gom thành 10 cảnh (`s001`–`s010`). Khung 1920×1080, 24fps. Loại cảnh đều là `MultiplaneScene` (nền phẳng nhiều lớp + nhân vật hoạt hình 2D), chưa cần template mới.

Grade: tạo thêm 2 grade trong `theme.ts` khi dựng (không có sẵn cho dự án này): `arena_warm` (đài, đèn ấm) và `arena_cold` (hiệp 3 + hook, lạnh, tương phản cao). Ghi vào Bước 5.

| Cảnh | Nhịp | Giây | Nội dung hình | Đòn (move) | Camera | Grade | Chữ (key) | SFX |
|---|---|---|---|---|---|---|---|---|
| s001 | B01–B02 | 14 | Hook: Thép đá vòng trúng Gai, slow-mo 0.4×, flash, freeze, cắt đen | `roundhouse`, `hit_head` | zoom 1.0→1.15 vào cú trúng | arena_cold | `b02.q` | thịch nặng, ù tai, nhịp tim |
| s002 | B03 | 20 | Hai võ sĩ vào đài, đèn nón quét | `walk_in` | pan chậm trái→phải | arena_warm | `b03.red`, `b03.blue` | nhạc, đám đông |
| s003 | B04 | 20 | So dáng, trọng tài giữa đài | `stance` | tĩnh, zoom 1.0→1.04 | arena_warm | `b04.round1` | còi |
| s004 | B05 | 60 | H1: Thép tiến, jab, hook; Gai lùi/đỡ | `jab`, `hook`, `block`, `step_f`, `step_b`, `hit_head` | bám Thép, shake nhẹ mỗi cú trúng | arena_warm | — | đấm, né, thở |
| s005 | B06–B07 | 60 | H1: đá thấp, Gai khuỵu, ngã sau hook cuối hiệp | `low_kick`, `hit_body`, `kneel`, `stagger`, `hook`, `fall_back` | zoom ở cú cuối, giữ cảnh ngã 2 giây | arena_warm | `b07.end1` | đá, thịch, còi |
| s006 | B08 | 30 | Nghỉ: hai góc đài, Gai nhìn Thép | `sit_rest`, `stance` | 2 cảnh cắt xen kẽ | arena_cold | `b08.rest` | thở, nước |
| s007 | B09–B11 | 120 | H2: Gai cắt ngang, `double_leg`, kiểm soát đất, Thép thoát và đứng dậy | `shoot`, `double_leg`, `ground_top`, `ground_bottom`, `scramble`, `tired` | góc hơi cao khi ở đất, trở lại ngang khi đứng | arena_warm | `b09.round2` | còi, thịch, cọ sàn, thở dốc |
| s008 | B12–B13 | 70 | H3: kiệt sức, Thép lặp cú đá vòng, Gai né | `tired`, `roundhouse`, `dodge`, `leg_catch` | zoom chậm, slow-mo ở cú đá | arena_cold | `b12.round3` | còi, nhịp tim, vút |
| s009 | B14–B15 | 60 | Gai quật, lên lưng, siết cổ, Thép vỗ tay | `takedown_back`, `rnc`, `tap` | góc cao nhẹ, zoom vào tay vỗ | arena_cold | `b15.tap` | thịch, đám đông, vỗ, còi |
| s010 | B16 | 20 | Trọng tài giơ tay Gai, ôm nhau, màn kết | `ref_raise`, `hug`, `celebrate` | kéo ra rộng | arena_warm | `b16.win`, `b16.end` | đám đông, nhạc |

Tổng: 14 + 20 + 20 + 60 + 60 + 30 + 120 + 70 + 60 + 20 = **474 giây (7 phút 54 giây)**. Gần khung 8–10 phút; có thể kéo dài ở s004/s007 hoặc thêm cảnh khi duyệt.

## Asset
| Asset | Dùng lại hay tạo mới | Ghi chú |
|---|---|---|
| Nhân vật nhân vật hoạt hình 2D (Thép, Gai, trọng tài) | tạo mới (code, `FighterLayer`) | `content/library/INDEX.md` chưa có nhân vật hoạt hình 2D |
| Nền octagon, đám đông, đèn nón | tạo mới (layer code) | khối phẳng, dùng `sky`/`silhouette`/`haze` |
| Hiệu ứng (impact star, speed lines, flash) | tạo mới (code) | trong `engine/src/components/` |
| Ảnh AI | không cần | theo kế hoạch đã duyệt |

Đã tra `content/library/INDEX.md`: không có asset dùng lại được.

## Hiệu ứng cần làm sớm cho pilot
`roundhouse` + `hit_head` + `fall_back` ở s001, cùng `jab`/`hook`. Cảnh pilot đề xuất: **s001** (hook), vì nhỏ (14 giây), đủ kiểm tra rig, slow-mo, shake, freeze, flash và nền.
