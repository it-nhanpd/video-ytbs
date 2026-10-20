# Công thức nhiều lớp (layer recipe) cho cảnh nhân vật đi qua phong cảnh

Nguồn: phân tích một video tham chiếu 650 giây về quân phục Đức (YouTube `5nX9uVBi95s`, xem bằng bản 640×274, không nghe được lời dẫn). Khung trích để đối chiếu: `refs/ref-video/` (27 khung mỗi 25 giây + 8 khung đi bộ giây 62–65, ảnh ghép `sheet_*.png`). Chỉ học **ngữ pháp hình** (lớp, nhịp, cỡ cảnh); **không** sao chép nhân vật, bố cục, câu chữ, nhận diện kênh. Số liệu đánh dấu *(ước lượng)* là nhìn bằng mắt từ khung hình, chưa đo bằng công cụ.
Ngày ghi: 2026-10-17. Sửa file này chỉ khi có quan sát mới (xem mục 9); style chính thức vẫn là `uniform-showcase.md`.

## 1. Chồng lớp của một cảnh đi bộ (xa → gần)
Hệ số trôi của engine: `parallaxFactor = (z + 0.5) / (focusZ + 0.5)`, với `focusZ = 3` (nhân vật).

| # | Lớp | z đề xuất | Nội dung (quan sát) | Viền | Mờ (DOF) | Trôi (hệ số) |
|---|---|---|---|---|---|---|
| 1 | Trời + đồi xa | 0 | Dải màu nhạt, đồi xa mờ như sương, ít chi tiết | không/rất mảnh | ~4 px | 0,14 |
| 2 | Đồi giữa | 1 | Mảng đồi tô phẳng nhiều tông, **ô ruộng, đường vạch**, **nét gạch ngắn "///" làm cỏ** | mảnh | ~3 px | 0,43 |
| 3 | Mặt đất + vật nhỏ | 2 | Dải đất có **đường viền đen đậm** uốn lượn, cây nhỏ, bụi thấp, đá | đậm | ~1,5 px | 0,71 |
| 4 | **Nhân vật** | 3 | Mảnh rời (rig), đi tại chỗ | đậm | 0 | 1,00 |
| 5 | Tiếp xúc đất (code) | 3,4 | Bóng elip dưới chân, bụi nhỏ lúc chạm gót | — | — | 1,00 |
| 6 | **Cỏ/bụi tiền cảnh che chân** | 4 | Bụi cây/cỏ tô phẳng, **viền đen dày**, che khoảng 15–30% phần dưới chân *(ước lượng)*, tối hơn một chút | dày | 0–1 px | 1,29 |
| 7 | **Quét tiền cảnh** | 5 | Tán cây/bụi rất to, rất mờ, lướt ngang màn hình trong ~1,5–3 s *(ước lượng)* ở đầu cảnh để lộ nhân vật; thân cây rõ hơn khi lướt qua | dày | 10–14 px | 1,57 hoặc chạy bằng `x` |
| 8 | Phủ bụi/khói (code) | 6 | Màn vàng/xám phủ khung ở cảnh nổ; chớp cam sau lưng | — | — | — |

Quy tắc: nhân vật luôn "đứng trong" đất, nghĩa là có ít nhất một lớp (6) đi qua **trước** chân; không có lớp tiền cảnh thì cảnh bị coi là phẳng (lỗi của s010 bản đầu).

## 2. Chuyển động
- Nhân vật **đi tại chỗ**; nền trôi trái; lớp càng gần càng trôi nhanh. Camera gần như đứng, chỉ nhích nhẹ.
- Bước chân: **gập gối thấy rõ**, tay đung đưa ngược chân, thân nhún theo nhịp, vật đeo (súng, ba lô) lắc theo bước. Một chu kỳ 2 bước ≈ 1 giây *(ước lượng)*.
- Cỏ/bụi tiền cảnh trôi nhanh hơn nhân vật nên bước chân "ăn" với nền, hết cảm giác trượt.

## 3. Cỡ cảnh và camera
- Cùng một nhân vật đổi cỡ: toàn thân → **cận vũ khí hoặc mặt** → lùi ra, mỗi 8–12 giây *(ước lượng, nhiều cảnh cắt rất ít: ~12 lần cắt lớn trong 650 giây)*. Mỗi lần đổi là một ý.
- Cận cảnh phải **đủ nét**: ảnh nhân vật cần độ phân giải ≥ cỡ phóng; ở cận cảnh nền mờ hơn.
- Đổi thế giới theo thời kỳ: đồng ruộng, savan, chiến hào, phố, rừng thông tuyết, tường Berlin, sa mạc, mỗi cảnh một bảng màu riêng.

## 4. Hành động và đạo cụ
Nhân vật luôn làm gì đó theo thời kỳ: vác súng, giơ súng ngắn, cúi chạy, ngắm bắn, đứng gác. Nổ/khói/chớp ở xa phía sau; không cảnh trúng người. Cận cảnh thường là **vũ khí trong tay**.

## 5. Chữ
Caption nhỏ góc dưới trái, hai dòng: tên loại lính (chữ nghiêng nhạt) và năm; mờ vào/ra; không che nhân vật. Ở ta: `LowerThird` (hiện hơi lớn hơn), thẻ `chip` cho mốc phụ.

## 6. Màu
Nền màu giấy ấm, bão hòa thấp (ô-liu nhạt, cát, xám phố, xanh trắng của tuyết); **quân phục là mảng màu bão hòa nhất** trong khung (xanh Phổ nổi hẳn trên nền ô-liu). Giữ đúng điều này khi tạo nền: nền không được cạnh tranh với nhân vật.

## 7. Cách tạo ảnh nền theo lớp (prompt-pack)
Mỗi bối cảnh = **các ảnh riêng, không phải một ảnh nền**:
1. Trời + đồi xa (không viền hoặc rất mảnh), phủ cả khung.
2. Đồi giữa + mặt đất (viền đen đậm, ô ruộng, nét gạch cỏ).
3. Dải cỏ/bụi tiền cảnh, **nền xám #808080 để tách**, lặp được theo chiều ngang (mép trái khớp mép phải), viền đen dày.
4. 1–2 tán cây to để "quét" (nền xám tách, không cần lặp).
Yêu cầu chung: tô phẳng, nhiều tông, không gradient bóng bẩy, viền đen đậm đều ở lớp gần, không chữ, không người. Lớp lặp phải qua kiểm tra mép bằng code trước khi dùng.

## 8. Việc engine đã có và còn thiếu (cập nhật khi làm)
| Hạng mục | Trạng thái |
|---|---|
| Nhiều lớp theo z + DOF + parallax | Có |
| Nhân vật rig đi, đổi món, súng, tư thế mang/ngắm | Có |
| Camera nhiều đoạn (zoom quanh điểm), chip, vòng chú thích, nổ xa | Có |
| Lớp lặp **liền mạch, không lật gương** (`tile: true, tileMode: 'wrap'`, trôi riêng bằng `scrollMul`) | Có (2026-10-17, đã qua typecheck; chưa thử với ảnh thật; ảnh phải liền mép trái–phải) |
| Lớp cỏ che chân + quét tiền cảnh | Có (pilot s010, 2026-10-17): `fg_grass` (z4, wrap) + `fg_sweep` (z5, blur 12, `moveSec`); ảnh nền theo lớp ingest bằng `keyColor`, `seamBlend`, `aspectFromImage` |
| Bóng dưới chân + bụi lúc chạm gót (trong `RigAsset`) | Có (xem ảnh tĩnh s010 khung 900; bụi nhỏ, chỉnh lại sau khi xem clip) |
| Nhún thân rõ hơn | Đã tăng (gối gập 24° ở nhịp nảy, thân lắc 2,4°); chưa xem clip |
| Tay gập khuỷu (`splitParts.elbowCut` cắt ảnh cả cánh tay, mặc định tắt; s010 dùng 0,42) | Có; súng gắn vào cẳng tay (`weapon.parent: foreArmN`); mép cắt chưa xem phóng đại kỹ |
| Cận cảnh đủ nét (nâng cấp ảnh nhân vật) | Chưa; chưa kiểm máy có Real-ESRGAN |

## 9. Phát hiện của người dùng
- 2026-10-17, sau khi xem s010 bản nhiều lớp: "cảm giác video của mình bị AI, bị cứng". Bỏ vòng tròn chú thích (callout/flash) khỏi lính.
  Đã thử chống cứng: máy quay cầm tay (noise), pha bước và góc thân/đầu/súng lệch nhẹ, nét viền "sôi" (`boil`, chỉ bật cho bg_mid + fg_grass, tốn thời gian render). Chưa xem trong clip.

## 10. Không được sao chép
Nhân vật, tư thế cụ thể, bố cục từng cảnh, thứ tự cảnh, câu chữ lời dẫn, tên và nhận diện kênh, quảng cáo cuối video. Khi tạo ảnh mới, chỉ dùng ảnh tham chiếu để học nét, màu, số lớp; ghi "không sao chép nhân vật/địa điểm" trong prompt.

- 2026-10-17, khung tham chiếu Waffen SS 1944 (giây 6:02): "thấp gối có cảm giác nhún, bước thật"; "quần áo không giống" (video gốc có dây đeo chéo, túi đạn, hoa văn ngụy trang, nếp vải; ta chỉ có áo trơn); "đôi tay cầm, cánh tay nhặt vật người lính đang lỗi" (video gốc: súng cầm HAI tay sát hông).
  Đã làm: `crouch` (hạ gối, thân chúi) và `weapon.support` (tay xa tự IK tới điểm nắm trên súng). Chưa làm: trang bị/nếp vải trên ảnh nhân vật (cần tạo lại bảng bộ phận), bàn tay nắm thay vì bàn tay mở.

- 2026-10-17, đo lại đoạn 6:00–6:20 của video gốc (xem `run20-spec.md`): **trong toàn cảnh, toàn bộ nền (nhà, cây, đồi, đất) trôi CÙNG một tốc độ 0,140 chiều rộng/giây, chỉ trời đứng yên**. Bảng §1 (nhiều lớp với hệ số trôi khác nhau) là **suy đoán từ cảnh đi bộ giây 62–65, chưa đo**; không coi là sự thật cho mọi cảnh. Cũng ở đoạn này: chỉ MỘT tay cầm súng; nhân vật 3/4 từ trước; zoom là cú cắt nhanh ~0,5 s (≈1,85×), không dolly chậm; gốc vẽ 24 fps; không có cỏ che chân. Các mục §1/§2 phải đo lại bằng `tools/measure-layer-scroll.mjs` trước khi dùng làm luật.
