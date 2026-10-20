# SPEC: 20 giây "lính chạy" của video tham chiếu (5nX9uVBi95s, 6:00–6:20)

Mục đích: bài thử kỹ thuật **nội bộ, không đăng** (người dùng quyết 2026-10-17: "dựng lại thật sát cả hình"). Nhân vật gốc là lính Waffen-SS 1944, **không thuộc phạm vi** `2026-german-army-uniforms` (Heer); không dùng lại trong video đăng.
Nguồn ảnh (gitignored): `_refs/run20/` (ngoài content/ để Remotion không sao chép vào thư mục tạm) = `run20.mp4` (cắt từ bản 2520×1080, 60 fps, tải 2026-10-17), `frames/f_0001..0602.jpg` (30 fps, 602 khung), `sheets/*.png`.
Nhãn: **[ĐO]** = tính bằng script từ khung; **[LƯỚI]** = đọc từ ảnh có lưới (±10%); **[THẤY]** = nhìn bằng mắt, chưa đo.

## 0. Sai lầm cần sửa so với phân tích trước
1. **Máy quay không đứng yên:** quét cây mở đầu, giữ toàn cảnh, **cú zoom nhanh ~0,5 s vào cận** (~9,2 s), giữ, cú lùi ra (~16,7 s), rồi quét cây kết (xem §1). Trước đây tôi ghi "camera gần như đứng".
2. **Chỉ MỘT tay cầm súng [THẤY]** (mọi khung §4); tay kia đung đưa tự do. Cầm hai tay (IK `weapon.support`) mà tôi làm là sai so với gốc.
3. **Nhân vật nhìn 3/4 từ trước, quay sang phải [THẤY]**, không phải nghiêng 90°: thấy cả hai dây Y, hàng nút/dây chéo giữa ngực, mặt quay nghiêng. Rig nghiêng thuần túy không thể giống; phải vẽ bộ phận 3/4.
4. **Cảnh này không có cỏ che chân [THẤY]:** chân đứng trên đất nâu; chỉ có búi cỏ nhỏ trên đường đồi phía sau (xa hơn nhân vật). "Cỏ che chân" là quan sát từ cảnh đi bộ khác (giây 62–65), không áp cho đoạn này.

## 1. Nhịp thời gian (t tính từ 6:00)
| t (s) | Sự kiện [LƯỚI/THẤY] |
|---|---|
| 0–1,5 | Thân cây to, rất mờ, lướt từ giữa khung sang trái; lộ cảnh mới; cảnh cũ (tuyết) còn mờ bên trái. Chữ "Waffen SS / 1944" bắt đầu mờ vào (~1 s) |
| ~2,5–9,2 | **Toàn cảnh, máy giữ nguyên [ĐO]**: mặt ở x = 0,54 chiều rộng (không đổi); y của mặt dao động 0,277–0,322 chiều cao khung (**nhún thân ≈ 4,5% chiều cao khung**); cao lính ≈ 58–62% khung [LƯỚI] |
| ~9,2–10,0 | **Cú zoom vào nhanh ≈ 0,5–0,8 s [ĐO]** (không phải dolly chậm): mặt x 0,54 → 0,68, y 0,29 → 0,11 |
| ~10,0–16,7 | **Cận, máy giữ [ĐO]**: mặt x ≈ 0,69, y ≈ 0,09–0,12; đầu thỉnh thoảng trồi lên khỏi mép trên khi nhún; chân cắt ở đùi/gối |
| ~16,7–17,5 | Cú lùi ra nhanh ≈ 0,8 s [ĐO]: mặt x 0,65 → 0,54, y 0,13 → 0,29 |
| ~17,5–20 | Toàn cảnh (mặt x 0,54, y 0,29–0,32 [ĐO]); ~19–20 s cây tuyết của cảnh sau lướt vào từ phải [THẤY] |

## 2. Lớp [ĐO + THẤY]
**Đo (toàn cảnh, 3 cặp khung cách 0,5 s: khung 90→105, 120→135, 150→165; `tools/measure-layer-scroll.mjs`):** mọi dải ngang từ y = 0,18 đến 0,74 chiều cao khung (nhà xa, nhà lớn, cây, bụi, đường đồi, đất) **trôi CÙNG tốc độ: 0,140 chiều rộng/giây (88 px/0,5 s ở ảnh 1260 px)**, ổn định ở cả ba cặp; dải trời (y 0,05–0,15) **đứng yên**. => Nền toàn cảnh là **một tấm toàn cảnh vẽ sẵn trôi một tốc độ, không có parallax khác nhau giữa nhà gần và nhà xa**. Cảm giác sâu đến từ kích thước vật và mờ vẽ sẵn (nhà/cây xa nhạt và mờ, vật gần viền đậm), không phải từ tốc độ trôi.
- Cận cảnh: đo thất bại (dịch vượt biên tìm kiếm ±140 px, điểm tương quan kém) nên **chưa biết**; suy luận hợp lý là nền cùng bị camera phóng ≈1,85× nên trôi ≈ 0,26 chiều rộng/giây (khớp việc kết quả chạm biên 0,222).
- Độ lặp của tấm toàn cảnh: chòi gỗ nâu + cây xuất hiện lúc ~7 s và lại ở ~22 s tính từ đầu đoạn tải (= chu kỳ ≈ 15 s ≈ 2,1 chiều rộng khung) **[THẤY]**: tấm nền lặp vòng.
Thành phần [THẤY], theo thứ tự từ trên xuống:
1. Trời tím nhạt, có vignette tối ở mép khung (đứng yên).
2. Dãy nhà nhỏ/hàng cây xa, mờ, tông xám xanh.
3. Nhà lớn/chòi gỗ/cây tròn/bụi cây to: viền đen mảnh, tô phẳng 2–3 tông (nhà gần rõ hơn nhà xa).
4. Đường đồi: viền đen dày, uốn lượn; đất nâu phẳng với vài nét gạch ngắn; búi cỏ viền đen trên đường đồi.
5. Nhân vật (một khối rig, chạy tại chỗ, đứng yên theo x trong khung).
6. Tiền cảnh: chỉ cây quét ở đầu/cuối; không có cỏ đè lên chân.

## 3. Bước chạy
- **Chu kỳ đung đưa tay tự do: 33,5 khung @30 = 1,12 s [ĐO]** (đỉnh bàn tay phía trước tại khung 325–326 và 358–359; đáy tại 306–307 và 339–340; script `tools/measure-hand-period.mjs`, đoạn 8–13 s cận). Một chu kỳ = hai bước (tay xa nhịp với chân đối diện).
- **Gốc vẽ ở 24 fps [ĐO]:** khung trùng lặp đều mỗi 5 khung (286=287, 291=292, 296=297, 301=302, 311=312, 316=317…) = 24 fps quy lên 30. Không phải "on twos"; chuyển động mượt từng khung.
- Quỹ đạo bàn tay tự do trong khung cận (ảnh 1260×540): x từ 827 đến 983 (≈ 12,4% chiều rộng khung), y từ 314 đến 386 (≈ 13,3% chiều cao khung) **[ĐO]**; tay vung ra trước-xuống rồi về sau-lên, cổ tay mềm, các ngón xòe nhẹ.
- Chân [THẤY]: đùi trước nâng, cẳng chân sau hất gót cao (gót giày nâu thấy ở mép dưới), chân trụ gần thẳng; thân **chúi trước ~15–20°** [LƯỚI, chưa đo góc], thân bồng bềnh lên xuống nhẹ theo bước; đầu cúi và hơi ngoảnh phải, mũ nhấp nhô.
- Súng và thân: súng **đứng yên tương đối so với thân** (nằm ngang ở hông, ổn định), chỉ nhún theo thân; không lắc riêng.

## 4. Tay và súng (trọng tâm lỗi hiện tại) [THẤY, mọi khung cận §3 và `sheets/crop_mid_t10_allframes.png`]
- **Súng tiểu liên MP-style** nằm ngang ở hông, nòng chĩa **về phía trước (phải)**, báng dây gập chĩa ra sau (trái), băng đạn dài thò xuống dưới.
- **Tay cầm súng = tay gần camera** (hiện bên trái ảnh, sát thân): cánh tay trên rủ dọc thân, **khuỷu gập ~90°**, cẳng tay nằm ngang; **bàn tay nằm TRƯỚC súng** (vẽ đè lên thân súng), ngón trỏ duỗi dọc thân, các ngón còn lại ôm; thấy mu/cạnh bàn tay, không phải lòng bàn tay quay vào thân.
- Thứ tự lớp (xa → gần): thân (+dây đeo) → tay xa buông (nằm ở mép phải thân, đè lên viền áo) → súng → cánh tay + bàn tay cầm súng (trước súng).
- **Tay xa tự do** đung đưa theo chu kỳ §3; tay áo ngụy trang cùng họa tiết, bàn tay màu da, ngón mở.
- Túi đạn (3 băng) đeo ngang bụng dưới thân súng; thấy rõ ở khung cận.

## 5. Quần áo (danh sách kiểm, nhìn khung cận)
Mũ sắt phủ vải họa tiết đốm nhiều tông (xanh–nâu–kem) + quai cằm; cổ áo có miếng cổ nhỏ; áo smock họa tiết đốm cùng loại, nếp vải rõ ở khuỷu/bụng, tay áo xắn có gân; **dây đeo chéo kiểu Y hai bên** với khóa và **dây chéo dạng chữ X xếp dọc giữa ngực**; túi đạn đeo bụng; thắt lưng + khóa; quần xám xanh nhạt nhăn ở gối; giày nâu. Mặt: nam, râu ngắn, mày rậm, nét viền đen dày, tô phẳng có bóng 2 tông.
(Tả bằng từ trung tính khi tạo prompt; không đưa tên đơn vị/phù hiệu vào prompt gửi công cụ: `style-lock.md`.)

## 6. Camera và hình học khung
Khung 21:9 (2520×1080 gốc). Vignette tối ở mép khung. Quét cây: thân cây nâu có vân gỗ, đen viền, **rất mờ (~12–14 px ở 1080p)**, chuyển cảnh từ tuyết (Eastern Front 1943) sang cảnh này.

## 7. Tiêu chí chấm "giống" (đạt / chưa)
1. Số và thứ tự lớp §2. 2. Camera §1 (quét mở, toàn→cận→toàn, quét kết) và độ zoom ≈1,85× (cú cắt nhanh ~0,5–0,8 s, không dolly chậm). 3. Chu kỳ 1,12 s, 24 fps. 4. Tay: một tay cầm, bàn tay đè trước súng, tay kia vung theo §3. 5. Súng ổn định theo thân. 6. Quần áo theo §5 (dây Y, dây X, túi đạn, đốm, nếp vải). 7. Thân chúi + hất gót. 8. Chữ góc dưới trái đúng nhịp. 9. Nền: MỘT tấm toàn cảnh trôi 0,140 W/s + trời đứng yên (nhà/cây/bụi viền đen, đường đồi viền dày), không tự thêm parallax.

## 8. Chưa đo / hạn chế
- Góc chúi thân, góc khuỷu: mới [LƯỚI]/[THẤY]; cần đo từ khung trước khi chỉnh số trong engine. Tốc độ trôi ở cận cảnh chưa đo được.
- Chưa phân tích 0–2 s kỹ từng khung (quét cây) và 18–20 s.

## 9. Số đo bằng chuyển động thật (2026-10-17, sửa các điều đã ghi sai ở trên) [ĐO bằng `tools/run20-track/`]
- **Vòng lặp chính xác 27 hình @24 fps = 1,125 s** (giày đóng vòng lệch 0,4 px sau 34 khung @30; thân/đầu/thắt lưng lệch trung vị 0–2 px). Thay cho "1,12 s đo từ tay" ở §3.
- **Gốc KHÔNG khóa chân vào đất**: giày chống (y ≈ 845 trong khung 1080) trượt về sau ≈ 38 px/hình ≈ 0,34 chiều rộng/giây; nền trôi 0,14 → trượt nhanh gấp ~2,4 lần nền. (Các bản trước cố "khóa chân" là sai mục tiêu.) Giày chống ~9 khung @30 mỗi lần; hai chân là cùng quỹ đạo lệch ~nửa chu kỳ.
- **Thân nhún ≈ 66 px (≈ 6% chiều cao khung)**, hai lần mỗi chu kỳ; đầu còn nhún riêng so với thân tối đa ≈ 13 px; thân xoay −7°…0° (khớp 3 điểm).
- **Tay tự do = cẳng tay vung quanh khuỷu cố định** (bàn tay đi trên cung bán kính ≈ 128 px, độ lệch chuẩn 6 px; khuỷu nằm sát mép phải thân, lệch (108, 112) so với tâm ngực lúc nghỉ); cánh tay trên đứng yên sau thân; vài hình (≈ 135–139 @30) tay khuất hoàn toàn sau thân.
- **Chân**: ống quần là MỘT khối dày, gối gập về trước; gối đùi nâng gần ngang ở pha vung; chân sau hất gót, cẳng chân gần nằm ngang. Độ rộng phần màu (không viền) đo bằng IoU: hông ≈ 96, gối ≈ 80 px (khung 2520×1080).
- Khung gốc 2520×1080 ánh xạ vào khung 1920 theo chiều rộng (0,762), vùng hiển thị khớp `letterbox 2.35`; nhân vật cao ≈ 73% chiều cao khung gốc.
