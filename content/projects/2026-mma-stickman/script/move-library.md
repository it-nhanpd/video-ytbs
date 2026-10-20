# Move library — bản nháp chờ duyệt

Mỗi đòn = chuỗi pose, thời lượng tính bằng frame ở 24fps. Pha: **A** anticipation (lấy đà) → **I** impact (trúng) → **R** recover (hồi). `hit` = frame tại đó phát SFX, shake, impact star. Góc khớp chi tiết viết ở Bước 4 trong `engine/src/moves/*.ts`; ở đây chỉ chốt danh sách và nhịp.

Quy ước: người tấn công `atk`, người nhận `def`. `facing` ±1 do code xử lý.

## Di chuyển và tư thế
| Mã | Đòn | Pose | Tổng frame | Dùng ở |
|---|---|---|---|---|
| `stance` | Đứng thủ (lặp, thở nhẹ) | 2 pose lắc nhẹ | 24 (vòng) | mọi cảnh đứng |
| `step_f` | Bước tiến | 3 | 12 | B05, B09 |
| `step_b` | Lùi | 3 | 12 | B05, B06 |
| `walk_in` | Đi vào đài | 4 (vòng) | 24 (vòng) | B03 |
| `tired` | Đứng thở dốc, vai thấp | 2 pose vòng | 24 (vòng) | B11, B12 |
| `sit_rest` | Ngồi góc đài | 1 | tĩnh | B08 |

## Đòn đứng (striking)
| Mã | Đòn | Pha | Frame (A/I/R) | hit | Hiệu ứng | Dùng ở |
|---|---|---|---|---|---|---|
| `jab` | Đấm thẳng | 3 pose | 3/2/4 | f4 | impact nhỏ | B05 |
| `hook` | Móc | 4 pose | 5/2/6 | f6 | impact + shake 8px | B05, B06, B07 |
| `low_kick` | Đá thấp | 4 pose | 5/2/7 | f6 | impact nhỏ | B06 |
| `roundhouse` | Đá vòng cao | 5 pose | 8/3/10 | f10 | impact lớn, freeze 3f, speed lines, shake 20px | B01, B13 |
| `block` | Đỡ | 2 pose | 2/—/4 | — | không | B05 |
| `dodge` | Né ngả người | 3 pose | 3/—/5 | — | speed lines | B13 |

## Đòn nhận (reaction)
| Mã | Đòn | Frame | Dùng ở |
|---|---|---|---|
| `hit_head` | Đầu giật, người ngả sau | 8 | B01, B05 |
| `hit_body` | Gập bụng | 8 | B06 |
| `stagger` | Loạng choạng lùi | 14 | B06 |
| `fall_back` | Ngã ngửa xuống sàn | 18 | B07 |
| `kneel` | Khuỵu gối | 12 | B06 |

## Vật lộn (grappling)
| Mã | Đòn | Pha | Frame | hit | Dùng ở |
|---|---|---|---|---|---|
| `shoot` | Cúi xuống lao vào chân | 3 pose | 4/6 | — | B09 |
| `double_leg` | Quật hai chân | 4 pose | 6/4/8 | f10 (chạm sàn, shake 12px) | B09 |
| `ground_top` | Đè trên đất, kiểm soát | 3 pose vòng | 24 (vòng) | B10 |
| `ground_bottom` | Nằm dưới, vùng vẫy | 3 pose vòng | 24 (vòng) | B10 |
| `scramble` | Thép xoay thoát, đứng dậy | 5 pose | 18 | B11 |
| `leg_catch` | Bắt chân đá | 3 pose | 6 | B13 |
| `takedown_back` | Quật và lên lưng | 5 pose | 24 | B14 |
| `rnc` | Siết cổ từ sau (rear-naked choke) | 3 pose + giữ | 12 + giữ | B15 |
| `tap` | Vỗ tay đầu hàng | 2 pose vòng | 12 (vòng) | B15 |

## Kết thúc
| Mã | Mô tả | Frame | Dùng ở |
|---|---|---|---|
| `ref_raise` | Trọng tài giơ tay người thắng | 12 | B16 |
| `hug` | Hai võ sĩ ôm nhau | 12 | B16 |
| `celebrate` | Gai giơ hai tay | 12 | B16 |

## Ghi chú cho pilot
- Pilot dùng: `stance`, `jab`, `hook`, `roundhouse`, `hit_head`, `fall_back` (đủ làm 1 combo + 1 KO giống B01).
- Tổng ~38 đòn; đòn vòng lặp (`stance`, `tired`, `ground_*`, `tap`, `walk_in`) cần cực rẻ.
- Đòn hai người (`double_leg`, `takedown_back`, `rnc`) là một clip chung: một timeline cho cả hai nhân vật, định nghĩa theo vị trí tương đối giữa hai người.
